import { useMemo } from "react";
import type { HierarchyRectangularNode } from "d3-hierarchy";

import {
  useChartHierarchyData,
  useRegisterTreemap,
  useTreemapLayout,
} from "../Chart/hooks";

import { DefaultTreemapCell } from "./DefaultTreemapCell";
import { resolveTreemapPadding } from "./resolveTreemapPadding";
import type {
  TreemapCellComponent,
  TreemapFill,
  TreemapLabelFormat,
  TreemapNode,
  TreemapNodeBase,
  TreemapPadding,
  TreemapTile,
  TreemapValueFormat,
} from "./types";

const DEFAULT_FILL = "var(--eudonia-chart-treemap, oklch(0.7 0.1 230))";
const DEFAULT_STROKE = "var(--eudonia-chart-treemap-stroke, var(--eudonia-card-bg, #fff))";

export interface TreemapProps<T extends TreemapNodeBase = TreemapNodeBase> {
  tile?: TreemapTile;
  padding?: number | TreemapPadding;
  fill?: TreemapFill<T>;
  stroke?: string;
  strokeWidth?: number;
  labelSkipSize?: number;
  showValue?: boolean;
  labelFormat?: TreemapLabelFormat<T>;
  valueFormat?: TreemapValueFormat<T>;
  renderBranches?: boolean;
  cellComponent?: TreemapCellComponent<T>;
  "aria-label"?: string;
}

export function Treemap<T extends TreemapNodeBase = TreemapNodeBase>({
  tile = "squarify",
  padding,
  fill = DEFAULT_FILL,
  stroke = DEFAULT_STROKE,
  strokeWidth = 1,
  labelSkipSize = 24,
  showValue = false,
  labelFormat,
  valueFormat,
  renderBranches = false,
  cellComponent,
  "aria-label": ariaLabel,
}: TreemapProps<T>) {
  // `useChartHierarchyData` asserts hierarchical; call it so the primitive
  // throws a useful error when misused with a flat <Chart>, even though we
  // don't use the result here (layout is read below).
  useChartHierarchyData<T>();

  const resolvedPadding = useMemo(() => resolveTreemapPadding(padding), [padding]);
  const registerConfig = useMemo(
    () => ({ tile, padding: resolvedPadding, renderBranches }),
    [tile, resolvedPadding, renderBranches],
  );
  const id = useRegisterTreemap(registerConfig);
  const layout = useTreemapLayout<T>(id);

  if (!layout) return null;

  // DefaultTreemapCell is declared as a generic function component; the cast
  // pins its generic slot to T so it conforms to TreemapCellComponent<T>.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const Cell = cellComponent ?? (DefaultTreemapCell as TreemapCellComponent<T>);
  const descendants = renderBranches ? layout.descendants() : layout.leaves();

  return (
    <g role="img" aria-label={ariaLabel ?? layout.data.name}>
      {descendants.map((node) => {
        if (node === layout && !renderBranches) return null;
        const x = node.x0;
        const y = node.y0;
        const width = Math.max(0, node.x1 - node.x0);
        const height = Math.max(0, node.y1 - node.y0);
        if (width <= 0 || height <= 0) return null;

        const cellFill = typeof fill === "function" ? fill(node) : fill;
        const label = labelFormat ? labelFormat(node) : node.data.name;
        const value =
          showValue && typeof node.value === "number"
            ? formatValue(node.value, node, valueFormat)
            : null;
        const isBranch = !!node.children && node.children.length > 0;

        return (
          <Cell
            key={idFor(node)}
            node={node}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={cellFill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            label={label}
            value={value}
            labelSkipSize={labelSkipSize}
            isBranch={isBranch}
          />
        );
      })}
    </g>
  );
}

function formatValue<T extends TreemapNodeBase>(
  value: number,
  node: HierarchyRectangularNode<TreemapNode<T>>,
  formatter: TreemapValueFormat<T> | undefined,
): string {
  if (formatter) return formatter(value, node);
  return defaultValueFormat.format(value);
}

const defaultValueFormat = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});

// Path of child-indices from the root to `node`, e.g. "0/2/1". Names would
// collide when siblings share a label, which is realistic in user data.
function idFor<T extends TreemapNodeBase>(
  node: HierarchyRectangularNode<TreemapNode<T>>,
): string {
  const path: number[] = [];
  let curr: HierarchyRectangularNode<TreemapNode<T>> | null = node;
  while (curr && curr.parent) {
    const siblings = curr.parent.children;
    path.push(siblings ? siblings.indexOf(curr) : 0);
    curr = curr.parent;
  }
  return path.reverse().join("/");
}
