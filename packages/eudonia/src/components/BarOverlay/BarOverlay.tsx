import type { ComponentPropsWithoutRef } from "react";

import { clampFraction } from "@/utils/clampFraction";

import {
  useChartArrayData,
  useRegisterMark,
  useResolvedXKey,
  useResolvedYKey,
  useXScale,
  useYScale,
} from "../Chart/hooks";

import {
  renderHorizontalBarOverlay,
  renderVerticalBarOverlay,
} from "./renderBarOverlay";

type RectProps = Omit<
  ComponentPropsWithoutRef<"rect">,
  "x" | "y" | "width" | "height" | "fill" | "children"
>;

export interface BarOverlayProps extends RectProps {
  dataKey: string;
  // Width along the categorical axis, as a fraction of the band's bandwidth.
  // Defaults to 0.5 — narrow enough that stacked siblings peek out on either
  // side. Clamped to [0, 1].
  size?: number;
  fill?: string;
}

// Draws a rect per datum centered on the category. Registers band preference +
// includeZero as a mark (so the categorical axis becomes band and the value
// axis contains 0), but does NOT claim a sub-band slot — overlays sit on top
// of whatever bars are in their category's band.
export function BarOverlay({
  dataKey,
  size = 0.5,
  fill = "currentColor",
  className,
  ...props
}: BarOverlayProps) {
  useRegisterMark({
    dataKey,
    categoricalPreference: "band",
    includeZero: true,
  });
  const data = useChartArrayData();
  const xKey = useResolvedXKey();
  const yKey = useResolvedYKey();
  const xScale = useXScale();
  const yScale = useYScale();

  const clampedSize = clampFraction(size);

  if (xScale.kind === "band") {
    return renderVerticalBarOverlay({
      data,
      categoryKey: xKey,
      valueKey: dataKey,
      categoryScale: xScale,
      valueScale: yScale,
      size: clampedSize,
      fill,
      className,
      rectProps: props,
    });
  }
  if (yScale.kind === "band") {
    return renderHorizontalBarOverlay({
      data,
      categoryKey: yKey,
      valueKey: dataKey,
      categoryScale: yScale,
      valueScale: xScale,
      size: clampedSize,
      fill,
      className,
      rectProps: props,
    });
  }
  return null;
}
