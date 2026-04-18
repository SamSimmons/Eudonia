import type { ComponentPropsWithoutRef } from "react";
import { LinePath } from "@visx/shape";

import { type ChartDatum, useChart } from "../Chart/context";
import { getX } from "../Chart/scales";

type PathProps = Omit<
  ComponentPropsWithoutRef<"path">,
  "d" | "stroke" | "strokeWidth" | "fill" | "x" | "y" | "children"
>;

export interface LineProps extends PathProps {
  dataKey: string;
  stroke?: string;
  strokeWidth?: number;
}

export function Line({
  dataKey,
  stroke = "var(--eudonia-chart-line, oklch(0.55 0.15 230))",
  strokeWidth = 1.5,
  className,
  ...props
}: LineProps) {
  const { data, xKey, xScale, yScale } = useChart();

  const x = (d: ChartDatum) => getX(d[xKey], xScale);
  const y = (d: ChartDatum) => {
    const v = d[dataKey];
    return typeof v === "number" ? yScale(v) : NaN;
  };
  const defined = (d: ChartDatum) =>
    Number.isFinite(getX(d[xKey], xScale)) && typeof d[dataKey] === "number";

  return (
    <LinePath
      // visx LinePath types `data` as a mutable array; we treat it as readonly.
      // Spreading would copy the whole dataset on every render, which is wasteful
      // for large series. The component does not mutate the input.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      data={data as ChartDatum[]}
      x={x}
      y={y}
      defined={defined}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      className={className}
      {...props}
    />
  );
}
