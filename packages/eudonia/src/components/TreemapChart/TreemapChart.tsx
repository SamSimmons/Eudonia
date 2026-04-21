import type { CSSProperties } from "react";
import type { HierarchyRectangularNode } from "d3-hierarchy";

import { Chart, type ChartProps } from "../Chart/Chart";
import { Treemap, type TreemapProps } from "../Treemap/Treemap";
import type { TreemapNode, TreemapNodeBase } from "../Treemap/types";

const PALETTE_SIZE = 8;

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

// Fallback OKLCH palette used when `eudonia/theme.css` is not loaded. CSS
// variables override these when the theme is imported.
const FALLBACK_PALETTE: readonly string[] = [
  "oklch(0.62 0.14 235)",
  "oklch(0.65 0.15 155)",
  "oklch(0.68 0.15 75)",
  "oklch(0.6 0.17 25)",
  "oklch(0.55 0.17 300)",
  "oklch(0.6 0.13 200)",
  "oklch(0.7 0.12 100)",
  "oklch(0.55 0.15 340)",
];

const DEFAULT_PALETTE: readonly string[] = Array.from(
  { length: PALETTE_SIZE },
  (_, i) => `var(--eudonia-chart-cat-${i + 1}, ${FALLBACK_PALETTE[i]})`,
);
