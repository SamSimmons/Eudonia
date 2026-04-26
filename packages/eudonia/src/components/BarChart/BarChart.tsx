import type { CSSProperties, ReactNode } from "react";

import { XAxis, type XAxisProps } from "../XAxis/XAxis";
import { YAxis, type YAxisProps } from "../YAxis/YAxis";
import { Bar } from "../Bar/Bar";
import { Chart, type ChartProps } from "../Chart/Chart";
import { Gridlines, type GridlinesProps } from "../Gridlines/Gridlines";

export interface BarChartProps {
  data: ChartProps["data"];
  dataKey: string | readonly string[];
  xKey?: ChartProps["xKey"];
  xType?: ChartProps["xType"];
  yKey?: ChartProps["yKey"];
  yType?: ChartProps["yType"];
  yDomain?: ChartProps["yDomain"];
  bandPadding?: ChartProps["bandPadding"];
  barGroupPadding?: ChartProps["barGroupPadding"];
  margin?: ChartProps["margin"];
  width?: ChartProps["width"];
  height?: ChartProps["height"];
  palette?: ChartProps["palette"];
  xAxis?: XAxisProps | false;
  yAxis?: YAxisProps | false;
  gridlines?: boolean | GridlinesProps;
  className?: string;
  style?: CSSProperties;
  // Extra primitives rendered between Gridlines and the Bar(s). Later JSX
  // paints on top in SVG — use this for reference lines or annotations that
  // should sit below the data.
  children?: ReactNode;
}

export function BarChart({
  data,
  dataKey,
  xKey,
  xType,
  yKey,
  yType,
  yDomain,
  bandPadding,
  barGroupPadding,
  margin,
  width,
  height,
  palette,
  xAxis,
  yAxis,
  gridlines = true,
  className,
  style,
  children,
}: BarChartProps) {
  const keys = typeof dataKey === "string" ? [dataKey] : dataKey;
  const gridlineProps = typeof gridlines === "object" ? gridlines : {};

  // Default x to band so Bar has a bandwidth. Horizontal charts opt out by
  // passing xType="linear" and yType="band" (and a yKey holding the category).
  const resolvedXType = xType ?? (yType === "band" ? "linear" : "band");

  return (
    <Chart
      data={data}
      xKey={xKey}
      xType={resolvedXType}
      yKey={yKey}
      yType={yType}
      yDomain={yDomain}
      bandPadding={bandPadding}
      barGroupPadding={barGroupPadding}
      margin={margin}
      width={width}
      height={height}
      palette={palette}
      className={className}
      style={style}
    >
      {gridlines ? <Gridlines {...gridlineProps} /> : null}
      {children}
      {keys.map((key) => (
        <Bar key={key} dataKey={key} />
      ))}
      {xAxis === false ? null : <XAxis {...(xAxis ?? {})} />}
      {yAxis === false ? null : <YAxis {...(yAxis ?? {})} />}
    </Chart>
  );
}
