import { AxisLeft } from "@visx/axis";

import styles from "../Chart/Chart.module.css";
import { useChart } from "../Chart/context";

export interface YAxisProps {
  tickFormat?: (value: unknown, index: number) => string;
  numTicks?: number;
  hideAxisLine?: boolean;
  hideTicks?: boolean;
}

export function YAxis({ tickFormat, numTicks, hideAxisLine, hideTicks }: YAxisProps) {
  const { yScale } = useChart();

  return (
    <AxisLeft
      scale={yScale}
      stroke="var(--eudonia-chart-axis, oklch(0.5 0 0))"
      tickStroke="var(--eudonia-chart-axis, oklch(0.5 0 0))"
      hideAxisLine={hideAxisLine}
      hideTicks={hideTicks}
      numTicks={numTicks}
      tickFormat={tickFormat}
      tickLabelProps={() => ({
        className: styles.tickLabel,
        textAnchor: "end",
        dx: "-0.25em",
        dy: "0.33em",
      })}
    />
  );
}
