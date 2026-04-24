import type { ComponentPropsWithoutRef } from "react";

import { resolveCategoryKey, type Scale } from "../Chart/scales";

type LineProps = Omit<
  ComponentPropsWithoutRef<"line">,
  "x1" | "x2" | "y1" | "y2" | "children"
>;

export interface RenderBarTickArgs {
  data: readonly Record<string, unknown>[];
  categoryKey: string;
  valueKey: string;
  categoryScale: Extract<Scale, { kind: "band" }>;
  valueScale: Scale;
  size: number;
  stroke: string;
  strokeWidth: number;
  className: string | undefined;
  lineProps: LineProps;
}

export function renderVerticalBarTick({
  data,
  categoryKey,
  valueKey,
  categoryScale,
  valueScale,
  size,
  stroke,
  strokeWidth,
  className,
  lineProps,
}: RenderBarTickArgs) {
  if (valueScale.kind !== "linear") return null;
  const bandwidth = categoryScale.scale.bandwidth();
  const halfLen = (bandwidth * size) / 2;
  return (
    <g className={className}>
      {data.map((d) => {
        const cat = resolveCategoryKey(d[categoryKey]);
        if (cat === null) return null;
        const bandStart = categoryScale.scale(cat);
        if (bandStart === undefined) return null;
        const v = d[valueKey];
        if (typeof v !== "number" || !Number.isFinite(v)) return null;
        const center = bandStart + bandwidth / 2;
        const y = valueScale.scale(v);
        return (
          <line
            key={cat}
            x1={center - halfLen}
            x2={center + halfLen}
            y1={y}
            y2={y}
            stroke={stroke}
            strokeWidth={strokeWidth}
            {...lineProps}
          />
        );
      })}
    </g>
  );
}

export function renderHorizontalBarTick({
  data,
  categoryKey,
  valueKey,
  categoryScale,
  valueScale,
  size,
  stroke,
  strokeWidth,
  className,
  lineProps,
}: RenderBarTickArgs) {
  if (valueScale.kind !== "linear") return null;
  const bandwidth = categoryScale.scale.bandwidth();
  const halfLen = (bandwidth * size) / 2;
  return (
    <g className={className}>
      {data.map((d) => {
        const cat = resolveCategoryKey(d[categoryKey]);
        if (cat === null) return null;
        const bandStart = categoryScale.scale(cat);
        if (bandStart === undefined) return null;
        const v = d[valueKey];
        if (typeof v !== "number" || !Number.isFinite(v)) return null;
        const center = bandStart + bandwidth / 2;
        const x = valueScale.scale(v);
        return (
          <line
            key={cat}
            x1={x}
            x2={x}
            y1={center - halfLen}
            y2={center + halfLen}
            stroke={stroke}
            strokeWidth={strokeWidth}
            {...lineProps}
          />
        );
      })}
    </g>
  );
}
