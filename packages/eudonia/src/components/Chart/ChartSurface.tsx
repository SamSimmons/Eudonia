import type { ReactNode } from "react";

import styles from "./Chart.module.css";
import { useChartSurface } from "./hooks";

export function ChartSurface({ children }: { children?: ReactNode }) {
  const { width, height, margin } = useChartSurface();
  if (width <= 0 || height <= 0) return null;
  return (
    <svg className={styles.svg} width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>{children}</g>
    </svg>
  );
}
