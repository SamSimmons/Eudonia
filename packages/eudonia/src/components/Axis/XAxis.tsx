import { AxisBottom } from "@visx/axis";

import styles from "../Chart/Chart.module.css";
import type { TickDensity, TickPreserve } from "../Chart/computeTicks";
import { useInnerSize, useRegisterXAxis, useXScale, useXTicks } from "../Chart/hooks";
import type { XTickValue } from "../Chart/scales";

export interface XAxisProps {
  density?: TickDensity;
  preserve?: TickPreserve;
  anchorLabelsToEdges?: boolean;
  preferredTickCount?: number;
  tickFormat?: (value: XTickValue) => string;
  hideAxisLine?: boolean;
  hideTicks?: boolean;
  display?: boolean;
}

export function XAxis({
  density = "medium",
  preserve = "auto",
  anchorLabelsToEdges = false,
  preferredTickCount,
  tickFormat,
  hideAxisLine,
  hideTicks,
  display = true,
}: XAxisProps) {
  useRegisterXAxis({
    density,
    preserve,
    anchorLabelsToEdges,
    preferredTickCount,
    tickFormat,
  });

  const xScale = useXScale();
  const { innerHeight } = useInnerSize();
  const xTicks = useXTicks();

  if (!display) return null;

  return (
    <AxisBottom
      top={innerHeight}
      scale={xScale.scale}
      stroke="var(--eudonia-chart-axis, oklch(0.5 0 0))"
      tickStroke="var(--eudonia-chart-axis, oklch(0.5 0 0))"
      hideAxisLine={hideAxisLine}
      hideTicks={hideTicks}
      tickValues={xTicks.map((t) => t.value)}
      tickFormat={(_value, index) => xTicks[index]?.label ?? ""}
      tickLabelProps={(_value, index) => ({
        className: styles.tickLabel,
        textAnchor: xTicks[index]?.anchor ?? "middle",
        dy: "0.25em",
      })}
    />
  );
}
