import { GridColumns, GridRows } from "@visx/grid";

import {
  useInnerSize,
  useXScale,
  useXTicks,
  useYScale,
  useYTicks,
} from "../Chart/hooks";

export interface GridlinesProps {
  rows?: boolean;
  columns?: boolean;
  stroke?: string;
  strokeDasharray?: string;
  className?: string;
}

export function Gridlines({
  rows = true,
  columns = false,
  stroke = "var(--eudonia-chart-grid)",
  strokeDasharray,
  className,
}: GridlinesProps) {
  const xScale = useXScale();
  const yScale = useYScale();
  const { innerWidth, innerHeight } = useInnerSize();
  const xTicks = useXTicks();
  const yTicks = useYTicks();

  return (
    <g className={className}>
      {rows ? (
        <GridRows
          scale={yScale}
          width={innerWidth}
          stroke={stroke}
          strokeDasharray={strokeDasharray}
          tickValues={yTicks.map((t) => t.value)}
        />
      ) : null}
      {columns ? (
        <GridColumns
          scale={xScale.scale}
          height={innerHeight}
          stroke={stroke}
          strokeDasharray={strokeDasharray}
          tickValues={xTicks.map((t) => t.value)}
        />
      ) : null}
    </g>
  );
}
