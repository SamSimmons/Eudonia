import { GridColumns, GridRows } from "@visx/grid";

import { useChart } from "../Chart/context";

export interface GridlinesProps {
  rows?: boolean;
  columns?: boolean;
  numTicks?: number;
  stroke?: string;
  strokeDasharray?: string;
  className?: string;
}

export function Gridlines({
  rows = true,
  columns = false,
  numTicks,
  stroke = "var(--eudonia-chart-grid)",
  strokeDasharray,
  className,
}: GridlinesProps) {
  const { xScale, yScale, innerWidth, innerHeight } = useChart();

  return (
    <g className={className}>
      {rows ? (
        <GridRows
          scale={yScale}
          width={innerWidth}
          stroke={stroke}
          strokeDasharray={strokeDasharray}
          numTicks={numTicks}
        />
      ) : null}
      {columns ? (
        <GridColumns
          scale={xScale.scale}
          height={innerHeight}
          stroke={stroke}
          strokeDasharray={strokeDasharray}
          numTicks={numTicks}
        />
      ) : null}
    </g>
  );
}
