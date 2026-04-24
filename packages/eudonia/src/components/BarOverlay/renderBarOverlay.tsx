import type { ComponentPropsWithoutRef } from "react";

import { resolveCategoryKey, type Scale } from "../Chart/scales";

type RectProps = Omit<
  ComponentPropsWithoutRef<"rect">,
  "x" | "y" | "width" | "height" | "fill" | "children"
>;

export interface RenderBarOverlayArgs {
  data: readonly Record<string, unknown>[];
  categoryKey: string;
  valueKey: string;
  categoryScale: Extract<Scale, { kind: "band" }>;
  valueScale: Scale;
  size: number;
  fill: string;
  className: string | undefined;
  rectProps: RectProps;
}

export function renderVerticalBarOverlay({
  data,
  categoryKey,
  valueKey,
  categoryScale,
  valueScale,
  size,
  fill,
  className,
  rectProps,
}: RenderBarOverlayArgs) {
  if (valueScale.kind !== "linear") return null;
  const bandwidth = categoryScale.scale.bandwidth();
  const width = bandwidth * size;
  const halfInset = (bandwidth - width) / 2;
  const baseline = valueScale.scale(0);
  return (
    <g className={className}>
      {data.map((d) => {
        const cat = resolveCategoryKey(d[categoryKey]);
        if (cat === null) return null;
        const bandStart = categoryScale.scale(cat);
        if (bandStart === undefined) return null;
        const v = d[valueKey];
        if (typeof v !== "number" || !Number.isFinite(v)) return null;
        const top = valueScale.scale(v);
        const y = Math.min(baseline, top);
        const height = Math.abs(baseline - top);
        return (
          <rect
            key={cat}
            x={bandStart + halfInset}
            y={y}
            width={width}
            height={height}
            fill={fill}
            {...rectProps}
          />
        );
      })}
    </g>
  );
}

export function renderHorizontalBarOverlay({
  data,
  categoryKey,
  valueKey,
  categoryScale,
  valueScale,
  size,
  fill,
  className,
  rectProps,
}: RenderBarOverlayArgs) {
  if (valueScale.kind !== "linear") return null;
  const bandwidth = categoryScale.scale.bandwidth();
  const thickness = bandwidth * size;
  const halfInset = (bandwidth - thickness) / 2;
  const baseline = valueScale.scale(0);
  return (
    <g className={className}>
      {data.map((d) => {
        const cat = resolveCategoryKey(d[categoryKey]);
        if (cat === null) return null;
        const bandStart = categoryScale.scale(cat);
        if (bandStart === undefined) return null;
        const v = d[valueKey];
        if (typeof v !== "number" || !Number.isFinite(v)) return null;
        const end = valueScale.scale(v);
        const x = Math.min(baseline, end);
        const width = Math.abs(end - baseline);
        return (
          <rect
            key={cat}
            x={x}
            y={bandStart + halfInset}
            width={width}
            height={thickness}
            fill={fill}
            {...rectProps}
          />
        );
      })}
    </g>
  );
}
