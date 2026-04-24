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
  renderHorizontalBarTick,
  renderVerticalBarTick,
} from "./renderBarTick";

type LineProps = Omit<
  ComponentPropsWithoutRef<"line">,
  "x1" | "x2" | "y1" | "y2" | "children"
>;

export interface BarTickProps extends LineProps {
  dataKey: string;
  // Length along the categorical axis, as a fraction of the band's bandwidth.
  // Defaults to 0.8 so the tick visually brackets the bar beneath it without
  // touching the category boundaries. Clamped to [0, 1].
  size?: number;
  stroke?: string;
  strokeWidth?: number;
}

// Perpendicular line drawn at valueScale(v) for each datum, centered on the
// category. Same registration shape as BarOverlay — contributes band preference
// and includeZero via mark registration but does not claim a sub-band slot.
export function BarTick({
  dataKey,
  size = 0.8,
  stroke = "currentColor",
  strokeWidth = 2,
  className,
  ...props
}: BarTickProps) {
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
    return renderVerticalBarTick({
      data,
      categoryKey: xKey,
      valueKey: dataKey,
      categoryScale: xScale,
      valueScale: yScale,
      size: clampedSize,
      stroke,
      strokeWidth,
      className,
      lineProps: props,
    });
  }
  if (yScale.kind === "band") {
    return renderHorizontalBarTick({
      data,
      categoryKey: yKey,
      valueKey: dataKey,
      categoryScale: yScale,
      valueScale: xScale,
      size: clampedSize,
      stroke,
      strokeWidth,
      className,
      lineProps: props,
    });
  }
  return null;
}
