import type { ComponentPropsWithoutRef } from "react";
import { Area as VisxArea } from "@visx/shape";

import {
  useChartArrayData,
  useInnerSize,
  useRegisterMark,
  useResolvedXKey,
  useXScale,
  useYScale,
} from "../Chart/hooks";
import { getX, getY } from "../Chart/scales";
import type { ChartDatum } from "../Chart/dataShape";

type PathProps = Omit<
  ComponentPropsWithoutRef<"path">,
  "d" | "fill" | "x" | "y" | "x1" | "y0" | "y1" | "children"
>;

export interface AreaProps extends PathProps {
  dataKey: string;
  fill?: string;
}

export function Area({
  dataKey,
  fill = "var(--eudonia-chart-area, var(--eudonia-chart-line, oklch(0.55 0.15 230)))",
  className,
  ...props
}: AreaProps) {
  useRegisterMark({ dataKey, categoricalPreference: "point", includeZero: true });
  const data = useChartArrayData();
  const { innerHeight } = useInnerSize();
  const xKey = useResolvedXKey();
  const xScale = useXScale();
  const yScale = useYScale();

  // Fill terminates at the value-axis zero so authored yDomains and
  // straddle-zero datasets don't draw a misleading slab. Non-linear y (band /
  // point / time) has no meaningful zero — fall back to the chart bottom.
  const zeroY = yScale.kind === "linear" ? getY(0, yScale) : innerHeight;
  const baseline = Number.isFinite(zeroY) ? zeroY : innerHeight;

  const x = (d: ChartDatum) => getX(d[xKey], xScale);
  const y1 = (d: ChartDatum) => getY(d[dataKey], yScale);
  const y0 = () => baseline;
  const defined = (d: ChartDatum) =>
    Number.isFinite(getX(d[xKey], xScale)) && Number.isFinite(getY(d[dataKey], yScale));

  return (
    <VisxArea<ChartDatum>
      // visx Area types `data` as a mutable array; we treat it as readonly.
      // Spreading would copy the whole dataset on every render, which is wasteful
      // for large series. The component does not mutate the input.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      data={data as ChartDatum[]}
      x={x}
      y0={y0}
      y1={y1}
      defined={defined}
      fill={fill}
      className={className}
      {...props}
    />
  );
}
