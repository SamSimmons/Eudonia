import { isTreemapNode } from "../Treemap/isTreemapNode";
import type { TreemapNode } from "../Treemap/types";

// A single row in a flat dataset. Arbitrary shape — marks and scales project
// the fields they care about by key.
export type ChartDatum = Record<string, unknown>;

// A <Chart>'s data is either a flat array of rows (line, bar, scatter) or a
// single hierarchical root (treemap, sunburst, pack). The two shapes are
// mutually exclusive; narrowing hooks (`useChartArrayData`,
// `useChartHierarchyData`) guard per-primitive access.
export type ChartData = readonly ChartDatum[] | TreemapNode;

export function isHierarchical(data: ChartData): data is TreemapNode {
  return isTreemapNode(data);
}
