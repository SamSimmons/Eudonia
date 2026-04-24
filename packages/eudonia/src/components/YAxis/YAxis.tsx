import { AxisLeft } from "@visx/axis";

import styles from "../Chart/Chart.module.css";
import type { TickDensity } from "../Chart/computeTicks";
import { useRegisterYAxis, useYScale, useYTicks } from "../Chart/hooks";
import type { TickValue } from "../Chart/scales";

export interface YAxisProps {
  density?: TickDensity;
  preferredTickCount?: number;
  tickFormat?: (value: TickValue) => string;
  hideAxisLine?: boolean;
  hideTicks?: boolean;
  display?: boolean;
}

export function YAxis({
  density = "medium",
  preferredTickCount,
  tickFormat,
  hideAxisLine,
  hideTicks,
  display = true,
}: YAxisProps) {
  useRegisterYAxis({
    density,
    preferredTickCount,
    tickFormat,
  });

  const yScale = useYScale();
  const yTicks = useYTicks();

  if (!display) return null;

  return (
    <AxisLeft
      scale={yScale.scale}
      stroke="var(--eudonia-chart-axis, oklch(0.5 0 0))"
      tickStroke="var(--eudonia-chart-axis, oklch(0.5 0 0))"
      hideAxisLine={hideAxisLine}
      hideTicks={hideTicks}
      tickValues={yTicks.map((t) => t.value)}
      tickFormat={(_value, index) => yTicks[index]?.label ?? ""}
      tickLabelProps={() => ({
        className: styles.tickLabel,
        textAnchor: "end",
        dx: "-0.25em",
        dy: "0.33em",
      })}
    />
  );
}
