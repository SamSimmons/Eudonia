import { AxisBottom } from "@visx/axis";

import styles from "../Chart/Chart.module.css";
import { useChart } from "../Chart/context";

export interface XAxisProps {
  tickFormat?: (value: unknown, index: number) => string;
  numTicks?: number;
  hideAxisLine?: boolean;
  hideTicks?: boolean;
}

export function XAxis({ tickFormat, numTicks, hideAxisLine, hideTicks }: XAxisProps) {
  const { xScale, innerHeight } = useChart();

  return (
    <AxisBottom
      top={innerHeight}
      scale={xScale.scale}
      stroke="var(--eudonia-chart-axis, oklch(0.5 0 0))"
      tickStroke="var(--eudonia-chart-axis, oklch(0.5 0 0))"
      hideAxisLine={hideAxisLine}
      hideTicks={hideTicks}
      numTicks={numTicks}
      tickFormat={tickFormat}
      tickLabelProps={() => ({
        className: styles.tickLabel,
        textAnchor: "middle",
        dy: "0.25em",
      })}
    />
  );
}
