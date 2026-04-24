import type { CSSProperties } from "react";
import type { HierarchyRectangularNode } from "d3-hierarchy";

import { Chart, type ChartProps } from "../Chart/Chart";
import { DEFAULT_PALETTE } from "../Chart/palette";
import { Treemap, type TreemapProps } from "../Treemap/Treemap";
import type { TreemapNode, TreemapNodeBase } from "../Treemap/types";

export interface TreemapChartProps<T extends TreemapNodeBase = TreemapNodeBase> {
  data: TreemapNode<T>;
  margin?: ChartProps["margin"];
  width?: ChartProps["width"];
  height?: ChartProps["height"];
  tile?: TreemapProps<T>["tile"];
  padding?: TreemapProps<T>["padding"];
  colors?: readonly string[] | TreemapProps<T>["fill"];
  stroke?: TreemapProps<T>["stroke"];
  strokeWidth?: TreemapProps<T>["strokeWidth"];
  labelSkipSize?: TreemapProps<T>["labelSkipSize"];
  showValue?: TreemapProps<T>["showValue"];
  labelFormat?: TreemapProps<T>["labelFormat"];
  valueFormat?: TreemapProps<T>["valueFormat"];
  renderBranches?: TreemapProps<T>["renderBranches"];
  cellComponent?: TreemapProps<T>["cellComponent"];
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

export function TreemapChart<T extends TreemapNodeBase = TreemapNodeBase>({
  data,
  margin,
  width,
  height,
  tile,
  padding,
  colors,
  stroke,
  strokeWidth,
  labelSkipSize,
  showValue,
  labelFormat,
  valueFormat,
  renderBranches,
  cellComponent,
  className,
  style,
  "aria-label": ariaLabel,
}: TreemapChartProps<T>) {
  const fill = resolveFill<T>(colors);

  return (
    <Chart data={data} margin={margin} width={width} height={height} className={className} style={style}>
      <Treemap<T>
        tile={tile}
        padding={padding}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        labelSkipSize={labelSkipSize}
        showValue={showValue}
        labelFormat={labelFormat}
        valueFormat={valueFormat}
        renderBranches={renderBranches}
        cellComponent={cellComponent}
        aria-label={ariaLabel}
      />
    </Chart>
  );
}

function resolveFill<T extends TreemapNodeBase>(
  colors: TreemapChartProps<T>["colors"],
): TreemapProps<T>["fill"] {
  if (typeof colors === "function") return colors;
  const palette = Array.isArray(colors) && colors.length > 0 ? colors : DEFAULT_PALETTE;
  return (node: HierarchyRectangularNode<TreemapNode<T>>) => palette[paletteIndex(node) % palette.length] ?? palette[0] ?? DEFAULT_PALETTE[0]!;
}

// Keyed on the index of the top-level ancestor (depth 1) among its siblings,
// so sibling leaves share a parent color and the palette is stable regardless
// of the current leaf count.
function paletteIndex<T extends TreemapNodeBase>(
  node: HierarchyRectangularNode<TreemapNode<T>>,
): number {
  const ancestors = node.ancestors();
  const topLevel = ancestors[ancestors.length - 2] ?? node;
  const parent = topLevel.parent;
  if (!parent || !parent.children) return 0;
  return parent.children.indexOf(topLevel);
}

