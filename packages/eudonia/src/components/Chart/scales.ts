import { scaleBand, scaleLinear, scalePoint, scaleTime } from "@visx/scale";
import { extent } from "d3-array";

import type { ChartDatum } from "./dataShape";
import type { CategoricalScalePreference } from "./state-types";

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

export function buildXScale(
  data: readonly ChartDatum[],
  xKey: string,
  type: ScaleKind,
  width: number,
): Scale {
  if (type === "band") {
    return {
      kind: "band",
      scale: scaleBand<string>({
        domain: data.map((d) => String(d[xKey])),
        range: [0, width],
        paddingInner: 0.1,
        paddingOuter: 0.05,
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
): Scale {
  if (yType === "band") {
    return {
      kind: "band",
      scale: scaleBand<string>({
        domain: data.map((d) => String(d[yKey])),
        range: [0, height],
        paddingInner: 0.1,
        paddingOuter: 0.05,
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
  let domain: [number, number];
  if (yDomain) {
    domain = [yDomain[0], yDomain[1]];
  } else {
    let min = Infinity;
    let max = -Infinity;
    for (const row of data) {
      for (const k of yKeys) {
        const v = row[k];
        if (typeof v === "number") {
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }
    }
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      domain = [0, 1];
    } else if (min === max) {
      // Flat series: a zero-width domain makes scaleLinear return NaN for every
      // input, so the line vanishes. Pad symmetrically (5% of the value, or 1
      // when the value is 0) so the line renders centered vertically.
      const offset = min === 0 ? 1 : Math.abs(min) * 0.05;
      domain = [min - offset, max + offset];
      if (includeZero) domain = [Math.min(domain[0], 0), Math.max(domain[1], 0)];
    } else {
      domain = [min, max];
      if (includeZero) domain = [Math.min(domain[0], 0), Math.max(domain[1], 0)];
    }
  }
  return {
    kind: "linear",
    scale: scaleLinear<number>({ domain, range: [height, 0] }),
  };
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
