import type { CSSProperties, ReactNode } from "react";

import { XAxis, type XAxisProps } from "../Axis/XAxis";
import { YAxis, type YAxisProps } from "../Axis/YAxis";
import { Chart, type ChartProps } from "../Chart/Chart";
import { Gridlines, type GridlinesProps } from "../Gridlines/Gridlines";
import { Line } from "../Line/Line";

export interface LineChartProps {
  data: ChartProps["data"];
  dataKey: string | readonly string[];
  xKey?: ChartProps["xKey"];
  xType?: ChartProps["xType"];
  yDomain?: ChartProps["yDomain"];
  margin?: ChartProps["margin"];
  width?: ChartProps["width"];
  height?: ChartProps["height"];
  xAxis?: XAxisProps | false;
  yAxis?: YAxisProps | false;
  gridlines?: boolean | GridlinesProps;
  className?: string;
  style?: CSSProperties;
  // Extra primitives rendered between Gridlines and the Line(s). Later JSX
  // paints on top in SVG — use this for reference lines, shaded regions, or
  // annotations that should sit below the data.
  children?: ReactNode;
}

export function LineChart({
  data,
  dataKey,
  xKey,
  xType,
  yDomain,
  margin,
  width,
  height,
  xAxis,
  yAxis,
  gridlines = true,
  className,
  style,
  children,
}: LineChartProps) {
  const keys = typeof dataKey === "string" ? [dataKey] : dataKey;
  const gridlineProps = typeof gridlines === "object" ? gridlines : {};

  return (
    <Chart
      data={data}
      xKey={xKey}
      xType={xType}
      yDomain={yDomain}
      margin={margin}
      width={width}
      height={height}
      className={className}
      style={style}
    >
      {gridlines ? <Gridlines {...gridlineProps} /> : null}
      {children}
      {keys.map((key) => (
        <Line key={key} dataKey={key} />
      ))}
      {xAxis === false ? null : <XAxis {...(xAxis ?? {})} />}
      {yAxis === false ? null : <YAxis {...(yAxis ?? {})} />}
    </Chart>
  );
}
