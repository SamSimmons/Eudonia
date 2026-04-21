import { planCellLabels } from "./cellLabelLayout";
import styles from "./Treemap.module.css";
import type { TreemapCellProps, TreemapNodeBase } from "./types";

export function DefaultTreemapCell<T extends TreemapNodeBase = TreemapNodeBase>({
  node,
  x,
  y,
  width,
  height,
  fill,
  stroke,
  strokeWidth,
  label,
  value,
  labelSkipSize,
  isBranch,
}: TreemapCellProps<T>) {
  const titleText = value === null ? label : `${label}: ${value}`;
  const plan = planCellLabels({ width, height, label, value, labelSkipSize });

  return (
    <g transform={`translate(${x},${y})`} data-name={node.data.name} data-depth={node.depth}>
      <rect
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        className={isBranch ? styles.branchRect : styles.leafRect}
      />
      <title>{titleText}</title>
      {plan.label ? (
        <text x={plan.label.x} y={plan.label.y} className={styles.label}>
          {plan.label.text}
        </text>
      ) : null}
      {plan.value ? (
        <text x={plan.value.x} y={plan.value.y} className={styles.value}>
          {plan.value.text}
        </text>
      ) : null}
    </g>
  );
}
