import type { ComponentPropsWithoutRef } from "react";

import { resolveCategoryKey, type Scale } from "../Chart/scales";

type RectProps = Omit<
  ComponentPropsWithoutRef<"rect">,
  "x" | "y" | "width" | "height" | "fill" | "children"
>;

export interface RenderBarArgs {
  data: readonly Record<string, unknown>[];
  categoryKey: string;
  valueKey: string;
  categoryScale: Extract<Scale, { kind: "band" }>;
  valueScale: Scale;
  offset: number;
  bandwidth: number;
  baseValues: ReadonlyMap<string, number>;
  fill: string;
  className: string | undefined;
  rectProps: RectProps;
}

export function renderVerticalBar({
  data,
  categoryKey,
  valueKey,
  categoryScale,
  valueScale,
  offset,
  bandwidth,
  baseValues,
  fill,
  className,
  rectProps,
}: RenderBarArgs) {
  if (valueScale.kind !== "linear") return null;
  return (
    <g className={className}>
      {data.map((d) => {
        const cat = resolveCategoryKey(d[categoryKey]);
        if (cat === null) return null;
        const bandStart = categoryScale.scale(cat);
        if (bandStart === undefined) return null;
        const v = d[valueKey];
        if (typeof v !== "number" || !Number.isFinite(v)) return null;
        const base = baseValues.get(cat) ?? 0;
        const bottom = valueScale.scale(base);
        const top = valueScale.scale(base + v);
        const y = Math.min(bottom, top);
        const height = Math.abs(bottom - top);
        return (
          <rect
            key={cat}
            x={bandStart + offset}
            y={y}
            width={bandwidth}
            height={height}
            fill={fill}
            {...rectProps}
          />
        );
      })}
    </g>
  );
}

export function renderHorizontalBar({
  data,
  categoryKey,
  valueKey,
  categoryScale,
  valueScale,
  offset,
  bandwidth,
  baseValues,
  fill,
  className,
  rectProps,
}: RenderBarArgs) {
  if (valueScale.kind !== "linear") return null;
  return (
    <g className={className}>
      {data.map((d) => {
        const cat = resolveCategoryKey(d[categoryKey]);
        if (cat === null) return null;
        const bandStart = categoryScale.scale(cat);
        if (bandStart === undefined) return null;
        const v = d[valueKey];
        if (typeof v !== "number" || !Number.isFinite(v)) return null;
        const base = baseValues.get(cat) ?? 0;
        const start = valueScale.scale(base);
        const end = valueScale.scale(base + v);
        const x = Math.min(start, end);
        const width = Math.abs(end - start);
        return (
          <rect
            key={cat}
            x={x}
            y={bandStart + offset}
            width={width}
            height={bandwidth}
            fill={fill}
            {...rectProps}
          />
        );
      })}
    </g>
  );
}
