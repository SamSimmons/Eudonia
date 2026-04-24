import type { ComponentPropsWithoutRef } from "react";

import {
  useBarLayout,
  useChartArrayData,
  useRegisterBar,
  useRegisterMark,
  useResolvedXKey,
  useResolvedYKey,
  useXScale,
  useYScale,
} from "../Chart/hooks";
import { paletteColor } from "../Chart/palette";

import { renderHorizontalBar, renderVerticalBar } from "./renderBar";

type RectProps = Omit<
  ComponentPropsWithoutRef<"rect">,
  "x" | "y" | "width" | "height" | "fill" | "children"
>;

export interface BarProps extends RectProps {
  dataKey: string;
  stackId?: string;
  fill?: string;
}

export function Bar({
  dataKey,
  stackId,
  fill,
  className,
  ...props
}: BarProps) {
  useRegisterMark({
    dataKey,
    categoricalPreference: "band",
    includeZero: true,
  });
  const id = useRegisterBar({ dataKey, stackId });
  const layout = useBarLayout(id);
  const data = useChartArrayData();
  const xKey = useResolvedXKey();
  const yKey = useResolvedYKey();
  const xScale = useXScale();
  const yScale = useYScale();

  if (!layout) return null;

  const resolvedFill = fill ?? paletteColor(layout.slot);

  // Orientation is implied by which scale is categorical. Vertical bars (the
  // common case) run x=category, y=value; horizontal bars swap. If neither axis
  // is band, layout is null above and we don't reach here.
  if (xScale.kind === "band") {
    return renderVerticalBar({
      data,
      categoryKey: xKey,
      valueKey: dataKey,
      categoryScale: xScale,
      valueScale: yScale,
      offset: layout.offset,
      bandwidth: layout.bandwidth,
      baseValues: layout.baseValues,
      fill: resolvedFill,
      className,
      rectProps: props,
    });
  }
  if (yScale.kind === "band") {
    return renderHorizontalBar({
      data,
      categoryKey: yKey,
      valueKey: dataKey,
      categoryScale: yScale,
      valueScale: xScale,
      offset: layout.offset,
      bandwidth: layout.bandwidth,
      baseValues: layout.baseValues,
      fill: resolvedFill,
      className,
      rectProps: props,
    });
  }
  return null;
}
