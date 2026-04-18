import { type ReactNode, useMemo } from "react";

import styles from "./Chart.module.css";
import {
  ChartContext,
  type ChartContextValue,
  type ChartDatum,
  type ChartMargin,
} from "./context";
import { buildXScale, buildYScale, type ChartXType } from "./scales";

export interface ChartSvgProps {
  data: readonly ChartDatum[];
  width: number;
  height: number;
  xKey: string;
  yKeys: readonly string[];
  xType: ChartXType;
  yDomain: readonly [number, number] | undefined;
  margin: ChartMargin;
  children?: ReactNode;
}

export function ChartSvg({
  data,
  width,
  height,
  xKey,
  yKeys,
  xType,
  yDomain,
  margin,
  children,
}: ChartSvgProps) {
  const contextValue = useMemo<ChartContextValue>(() => {
    const innerWidth = Math.max(0, width - margin.left - margin.right);
    const innerHeight = Math.max(0, height - margin.top - margin.bottom);
    const xScale = buildXScale(data, xKey, xType, innerWidth);
    const yScale = buildYScale(data, yKeys, yDomain, innerHeight);
    return { data, xKey, xScale, yScale, innerWidth, innerHeight };
  }, [data, width, height, xKey, yKeys, xType, yDomain, margin]);

  return (
    <ChartContext.Provider value={contextValue}>
      <svg className={styles.svg} width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>{children}</g>
      </svg>
    </ChartContext.Provider>
  );
}
