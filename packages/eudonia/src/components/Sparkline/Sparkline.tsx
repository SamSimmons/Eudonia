import type { ComponentPropsWithoutRef } from "react";

import { Chart } from "../Chart/Chart";
import { Line } from "../Line/Line";

type DivProps = ComponentPropsWithoutRef<"div">;

export interface SparklineProps extends Omit<DivProps, "children"> {
  values: readonly number[];
  stroke?: string;
  strokeWidth?: number;
  yDomain?: readonly [number, number];
}

export function Sparkline({
  values,
  stroke,
  strokeWidth,
  yDomain,
  ...props
}: SparklineProps) {
  const data = values.map((y, i) => ({ x: i, y }));
  return (
    <Chart
      data={data}
      margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
      yDomain={yDomain}
      {...props}
    >
      <Line dataKey="y" stroke={stroke} strokeWidth={strokeWidth} />
    </Chart>
  );
}
