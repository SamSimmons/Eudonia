import { scaleBand, scaleLinear, scaleTime } from "@visx/scale";
import { extent } from "d3-array";

import type { ChartDatum } from "./context";

export type BandScale = ReturnType<typeof scaleBand<string>>;
export type TimeScale = ReturnType<typeof scaleTime<number>>;
export type LinearScale = ReturnType<typeof scaleLinear<number>>;

// d3-scale's three scale types share no discriminating tag, so TS can't narrow
// a `ScaleBand | ScaleTime | ScaleLinear` union. Wrapping each in a tagged
// object lets consumers `switch (xScale.kind)` and stay cast-free.
export type XScale =
  | { kind: "band"; scale: BandScale }
  | { kind: "time"; scale: TimeScale }
  | { kind: "linear"; scale: LinearScale };

export type YScale = LinearScale;

export type ChartXType = XScale["kind"];

// Returns NaN for invalid or out-of-domain input. Callers should pair this with
// a `defined` predicate (e.g. visx LinePath's `defined`) so invalid points are
// dropped instead of silently piling up at the chart origin.
export function getX(value: unknown, xScale: XScale): number {
  switch (xScale.kind) {
    case "band": {
      if (typeof value !== "string") return NaN;
      const pos = xScale.scale(value);
      return pos === undefined ? NaN : pos + xScale.scale.bandwidth() / 2;
    }
    case "time":
      return value instanceof Date ? (xScale.scale(value) ?? NaN) : NaN;
    case "linear":
      return typeof value === "number" ? (xScale.scale(value) ?? NaN) : NaN;
  }
}

export function buildXScale(
  data: readonly ChartDatum[],
  xKey: string,
  type: ChartXType,
  width: number,
): XScale {
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

export function buildYScale(
  data: readonly ChartDatum[],
  yKeys: readonly string[],
  yDomain: readonly [number, number] | undefined,
  height: number,
): YScale {
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
    } else {
      domain = [min, max];
    }
  }
  return scaleLinear<number>({ domain, range: [height, 0] });
}
