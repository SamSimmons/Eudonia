import styles from "../Chart/Chart.module.css";
import { useInnerSize, useXScale, useYScale } from "../Chart/hooks";
import { getX } from "../Chart/scales";

interface CommonReferenceLineProps {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  label?: string;
  className?: string;
}

// `x` and `y` are mutually exclusive: a reference line is either horizontal
// (y) or vertical (x), never both. The `?: never` halves enforce this at the
// type level so consumers get a TS error instead of a runtime throw.
// `x` is constrained to the value types the three xScale kinds accept.
export type ReferenceLineProps =
  | (CommonReferenceLineProps & { y: number; x?: never })
  | (CommonReferenceLineProps & { x: string | number | Date; y?: never });

export function ReferenceLine({
  y,
  x,
  stroke = "var(--eudonia-chart-axis, oklch(0.5 0 0))",
  strokeWidth = 1,
  strokeDasharray = "3 3",
  label,
  className,
}: ReferenceLineProps) {
  const xScale = useXScale();
  const yScale = useYScale();
  const { innerWidth, innerHeight } = useInnerSize();

  if ((x === undefined) === (y === undefined)) {
    throw new Error(
      "<ReferenceLine> requires exactly one of `x` or `y`; " +
        `received x=${String(x)}, y=${String(y)}.`,
    );
  }

  // Label placement note: a serious data-viz designer (Tufte, Few, Knaflic)
  // would position reference-line labels deliberately — in negative space the
  // chart layout reserves, often replacing an axis tick. Auto-placement always
  // compromises (collides with data, escapes margins, or needs arbitrary
  // offsets). We anchor labels *inside* the plot area at the line's terminal
  // end as a working default so consumers don't need to allocate margin, but
  // this is a stopgap. Long term, replace with a dedicated label slot
  // (e.g. <ReferenceLine.Label>) or a render-prop so the consumer controls
  // placement, and treat collisions with data as a designer concern.

  if (y !== undefined) {
    const yPos = yScale(y);
    return (
      <g className={className}>
        <line
          x1={0}
          x2={innerWidth}
          y1={yPos}
          y2={yPos}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
        {label !== undefined ? (
          <text
            className={styles.tickLabel}
            x={innerWidth}
            y={yPos}
            textAnchor="end"
            dx="-0.33em"
            dy="-0.33em"
          >
            {label}
          </text>
        ) : null}
      </g>
    );
  }

  if (x !== undefined) {
    const xPos = getX(x, xScale);
    if (!Number.isFinite(xPos)) return null;
    return (
      <g className={className}>
        <line
          x1={xPos}
          x2={xPos}
          y1={0}
          y2={innerHeight}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
        {label !== undefined ? (
          <text
            className={styles.tickLabel}
            x={xPos}
            y={0}
            textAnchor="start"
            dx="0.33em"
            dy="1em"
          >
            {label}
          </text>
        ) : null}
      </g>
    );
  }

  return null;
}
