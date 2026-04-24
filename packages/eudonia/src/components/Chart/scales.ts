import { scaleBand, scaleLinear, scalePoint, scaleTime } from "@visx/scale";
import { extent } from "d3-array";

import { clampFraction } from "@/utils/clampFraction";

import type { ChartDatum } from "./dataShape";
import type {
  BandPadding,
  CategoricalScalePreference,
  PaddingValue,
} from "./state-types";

export type BandScale = ReturnType<typeof scaleBand<string>>;
export type PointScale = ReturnType<typeof scalePoint<string>>;
export type TimeScale = ReturnType<typeof scaleTime<number>>;
export type LinearScale = ReturnType<typeof scaleLinear<number>>;

// d3-scale's scale types share no discriminating tag, so TS can't narrow a raw
// union. Wrapping each in a tagged object lets consumers `switch (scale.kind)`
// and stay cast-free. X and Y use the same union — Y-specific range direction
// (flipped for continuous kinds) is baked in by buildYScale, not the type.
export type Scale =
  | { kind: "band"; scale: BandScale }
  | { kind: "point"; scale: PointScale }
  | { kind: "time"; scale: TimeScale }
  | { kind: "linear"; scale: LinearScale };

export type ScaleKind = Scale["kind"];

// Union of every value type a Scale's domain can contain. Each kind emits a
// single concrete type, so downstream code narrows via the scale's `kind` tag.
export type TickValue = string | number | Date;

// Returns NaN for invalid or out-of-domain input. Callers should pair this with
// a `defined` predicate (e.g. visx LinePath's `defined`) so invalid points are
// dropped instead of silently piling up at the chart origin. `getX` and `getY`
// are the same function — distinct names keep call sites readable.
export function getX(value: unknown, xScale: Scale): number {
  return project(value, xScale);
}

export function getY(value: unknown, yScale: Scale): number {
  return project(value, yScale);
}

function project(value: unknown, scale: Scale): number {
  switch (scale.kind) {
    case "band": {
      if (typeof value !== "string") return NaN;
      const pos = scale.scale(value);
      return pos === undefined ? NaN : pos + scale.scale.bandwidth() / 2;
    }
    case "point":
      return typeof value === "string" ? (scale.scale(value) ?? NaN) : NaN;
    case "time":
      return value instanceof Date ? (scale.scale(value) ?? NaN) : NaN;
    case "linear":
      return typeof value === "number" ? (scale.scale(value) ?? NaN) : NaN;
  }
}

// d3's band scale keys its domain by string, so buildXScale/buildYScale run
// every category value through String() when computing the domain. Renderers
// and stack-baseline maps must do the same or they'll miss rows whose source
// value is a number/Date (the scale has a slot for "2020", but the row's
// `d[key]` is the number 2020). Returns null for null/undefined so callers can
// skip rather than emitting a spurious "undefined" bucket.
export function resolveCategoryKey(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  return typeof value === "string" ? value : String(value);
}

export const DEFAULT_BAND_PADDING_INNER_FRACTION = 0.1;
export const DEFAULT_BAND_PADDING_OUTER_FRACTION = 0.05;

// Splits a PaddingValue into its two contributions to d3's band-scale formula
// `range = step * (n - innerFrac + 2*outerFrac)`. A fraction input is a
// coefficient of step; a pixel input is a constant. Keeping them separate lets
// `resolveBandPadding` solve for `step` when inputs mix the two forms.
interface ParsedPadding {
  fraction: number;
  pixels: number;
}

function parsePadding(value: PaddingValue): ParsedPadding {
  if (typeof value === "number") return { fraction: 0, pixels: value };
  if (value.endsWith("%")) return { fraction: parseFloat(value) / 100, pixels: 0 };
  // `${number}px` — parseFloat ignores the trailing "px" for us.
  return { fraction: 0, pixels: parseFloat(value) };
}

// Resolves a (possibly mixed pixel/fraction) padding pair into the 0..1
// fractions d3's scaleBand accepts. The band-scale identity is:
//   step * (n - innerFrac + 2*outerFrac) = range
// Each pixel input contributes a constant to the range side; each fractional
// input is a coefficient of step. Solving for `step` gives us the equivalent
// fraction for each pixel input. If the requested pixels don't fit, fractions
// clamp to 1 and bars collapse — the user's pixel spec was too large.
export function resolveBandPadding(
  inner: PaddingValue | undefined,
  outer: PaddingValue | undefined,
  range: number,
  n: number,
): { paddingInner: number; paddingOuter: number } {
  if (n <= 0 || range <= 0) return { paddingInner: 0, paddingOuter: 0 };
  const i: ParsedPadding =
    inner === undefined
      ? { fraction: DEFAULT_BAND_PADDING_INNER_FRACTION, pixels: 0 }
      : parsePadding(inner);
  const o: ParsedPadding =
    outer === undefined
      ? { fraction: DEFAULT_BAND_PADDING_OUTER_FRACTION, pixels: 0 }
      : parsePadding(outer);
  const denom = n - i.fraction + 2 * o.fraction;
  if (denom <= 0) return { paddingInner: 0, paddingOuter: 0 };
  const step = (range + i.pixels - 2 * o.pixels) / denom;
  if (step <= 0) return { paddingInner: 1, paddingOuter: 0 };
  return {
    paddingInner: clampFraction(i.fraction + i.pixels / step),
    paddingOuter: clampFraction(o.fraction + o.pixels / step),
  };
}

// Sub-band variant (outer is always 0 — no chart-edge gap for grouped bars).
export function resolveSubBandPaddingInner(
  inner: PaddingValue | undefined,
  range: number,
  n: number,
  fallbackFraction: number,
): number {
  if (n <= 0 || range <= 0) return 0;
  const i: ParsedPadding =
    inner === undefined
      ? { fraction: fallbackFraction, pixels: 0 }
      : parsePadding(inner);
  const denom = n - i.fraction;
  if (denom <= 0) return 0;
  const step = (range + i.pixels) / denom;
  if (step <= 0) return 1;
  return clampFraction(i.fraction + i.pixels / step);
}

export function buildXScale(
  data: readonly ChartDatum[],
  xKey: string,
  type: ScaleKind,
  width: number,
  bandPadding: BandPadding | undefined,
  // Horizontal-orientation inputs — only consulted when type is linear and
  // xValueKeys is non-empty. In that mode x is the value axis (like y is on a
  // vertical chart) and we aggregate across multiple dataKeys with stack
  // awareness. Vertical charts pass undefined / empty and fall back to the
  // single-xKey path below.
  xValueKeys: readonly string[] | undefined,
  includeZero: boolean,
  stackGroups: ReadonlyMap<string, readonly string[]> | undefined,
): Scale {
  if (type === "band") {
    const domain = data.map((d) => String(d[xKey]));
    const { paddingInner, paddingOuter } = resolveBandPadding(
      bandPadding?.inner,
      bandPadding?.outer,
      width,
      domain.length,
    );
    return {
      kind: "band",
      scale: scaleBand<string>({
        domain,
        range: [0, width],
        paddingInner,
        paddingOuter,
      }),
    };
  }
  if (type === "point") {
    return {
      kind: "point",
      scale: scalePoint<string>({
        domain: data.map((d) => String(d[xKey])),
        range: [0, width],
        padding: 0,
      }),
    };
  }
  if (type === "time") {
    const [min, max] = extent(data, (d) => {
      const v = d[xKey];
      return v instanceof Date ? v.valueOf() : undefined;
    });
    return {
      kind: "time",
      scale: scaleTime({
        domain: [new Date(min ?? 0), new Date(max ?? 0)],
        range: [0, width],
      }),
    };
  }
  if (xValueKeys && xValueKeys.length > 0) {
    const domain = aggregateValueDomain(data, xValueKeys, stackGroups, includeZero);
    return {
      kind: "linear",
      scale: scaleLinear<number>({ domain, range: [0, width] }),
    };
  }
  const [min, max] = extent(data, (d) => {
    const v = d[xKey];
    return typeof v === "number" ? v : undefined;
  });
  return {
    kind: "linear",
    scale: scaleLinear<number>({
      domain: [min ?? 0, max ?? 0],
      range: [0, width],
    }),
  };
}

// Y has two distinct modes. Continuous (linear/time) aggregates numeric values
// across `yKeys` and flips the range so larger values sit higher on screen.
// Categorical (band/point) mirrors buildXScale — one `yKey` holds the category
// label, range runs top-to-bottom.
export function buildYScale(
  data: readonly ChartDatum[],
  yKey: string,
  yKeys: readonly string[],
  yType: ScaleKind,
  yDomain: readonly [number, number] | undefined,
  height: number,
  includeZero: boolean,
  bandPadding: BandPadding | undefined,
  stackGroups: ReadonlyMap<string, readonly string[]> | undefined,
): Scale {
  if (yType === "band") {
    const domain = data.map((d) => String(d[yKey]));
    const { paddingInner, paddingOuter } = resolveBandPadding(
      bandPadding?.inner,
      bandPadding?.outer,
      height,
      domain.length,
    );
    return {
      kind: "band",
      scale: scaleBand<string>({
        domain,
        range: [0, height],
        paddingInner,
        paddingOuter,
      }),
    };
  }
  if (yType === "point") {
    return {
      kind: "point",
      scale: scalePoint<string>({
        domain: data.map((d) => String(d[yKey])),
        range: [0, height],
        padding: 0,
      }),
    };
  }
  if (yType === "time") {
    const [min, max] = extent(data, (d) => {
      const v = d[yKey];
      return v instanceof Date ? v.valueOf() : undefined;
    });
    return {
      kind: "time",
      scale: scaleTime({
        domain: [new Date(min ?? 0), new Date(max ?? 0)],
        range: [height, 0],
      }),
    };
  }
  const domain: [number, number] = yDomain
    ? [yDomain[0], yDomain[1]]
    : aggregateValueDomain(data, yKeys, stackGroups, includeZero);
  return {
    kind: "linear",
    scale: scaleLinear<number>({ domain, range: [height, 0] }),
  };
}

// Computes a linear-axis domain from a set of value keys. Keys that appear in
// a stack contribute per-row positive/negative totals (d3 stacking: positives
// accumulate up, negatives down); unstacked keys contribute their raw values.
// Flat series and empty data are padded so scaleLinear doesn't collapse to a
// zero-width domain (every input would map to NaN).
export function aggregateValueDomain(
  data: readonly ChartDatum[],
  keys: readonly string[],
  stackGroups: ReadonlyMap<string, readonly string[]> | undefined,
  includeZero: boolean,
): [number, number] {
  const stackedKeys = new Set<string>();
  if (stackGroups) {
    for (const ks of stackGroups.values()) for (const k of ks) stackedKeys.add(k);
  }
  let min = Infinity;
  let max = -Infinity;
  for (const row of data) {
    for (const k of keys) {
      if (stackedKeys.has(k)) continue;
      const v = row[k];
      if (typeof v === "number") {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    if (stackGroups) {
      for (const ks of stackGroups.values()) {
        let pos = 0;
        let neg = 0;
        for (const k of ks) {
          const v = row[k];
          if (typeof v !== "number") continue;
          if (v >= 0) pos += v;
          else neg += v;
        }
        if (pos > max) max = pos;
        if (neg < min) min = neg;
      }
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return [0, 1];
  }
  if (min === max) {
    const offset = min === 0 ? 1 : Math.abs(min) * 0.05;
    let domain: [number, number] = [min - offset, max + offset];
    if (includeZero) domain = [Math.min(domain[0], 0), Math.max(domain[1], 0)];
    return domain;
  }
  let domain: [number, number] = [min, max];
  if (includeZero) domain = [Math.min(domain[0], 0), Math.max(domain[1], 0)];
  return domain;
}

// Scale-config inference — picks xKey / yKeys / xType from the dataset when
// the author hasn't supplied them. Lives alongside the builders because the
// output of these functions is exactly what `buildXScale` / `buildYScale`
// consume.

export function inferXKey(data: readonly ChartDatum[]): string {
  if (data.length === 0) return "x";
  const first = data[0]!;
  for (const [k, v] of Object.entries(first)) {
    if (typeof v === "string" || v instanceof Date) return k;
  }
  return Object.keys(first)[0] ?? "x";
}

export function inferYKeys(
  data: readonly ChartDatum[],
  xKey: string,
): string[] {
  if (data.length === 0) return [];
  return Object.entries(data[0]!)
    .filter(([k, v]) => k !== xKey && typeof v === "number")
    .map(([k]) => k);
}

// Used only when yType is categorical/time — the "which column holds the
// category label" question. For linear y (the common case) we don't consult
// this, the aggregation across yKeys produces the domain directly.
export function inferYKey(data: readonly ChartDatum[], xKey: string): string {
  if (data.length === 0) return "y";
  const first = data[0]!;
  for (const [k, v] of Object.entries(first)) {
    if (k === xKey) continue;
    if (typeof v === "string" || v instanceof Date) return k;
  }
  const fallback = Object.keys(first).find((k) => k !== xKey);
  return fallback ?? "y";
}

// Mirror of inferXType for the Y axis. Peeks at data[0][yKey]; falls back to
// linear when the column is numeric or empty.
export function inferYType(
  data: readonly ChartDatum[],
  yKey: string,
  categoricalPreference: CategoricalScalePreference,
): ScaleKind {
  if (data.length === 0) return "linear";
  const first = data[0]![yKey];
  if (first instanceof Date) return "time";
  if (typeof first === "string") return categoricalPreference;
  return "linear";
}

// Categorical (string) x resolves to band or point based on what marks want.
// Default is `point` so the first and last category sit at the chart edges —
// bars/heatmap-rects opt in to `band` via registration since they need a width.
export function inferXType(
  data: readonly ChartDatum[],
  xKey: string,
  categoricalPreference: CategoricalScalePreference,
): ScaleKind {
  if (data.length === 0) return "linear";
  const first = data[0]![xKey];
  if (first instanceof Date) return "time";
  if (typeof first === "string") return categoricalPreference;
  return "linear";
}
