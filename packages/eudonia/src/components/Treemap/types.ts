import type { HierarchyRectangularNode } from "d3-hierarchy";
import type { ComponentType } from "react";

export type TreemapTile = "squarify" | "binary" | "slice" | "dice" | "slice-dice";

export interface TreemapPadding {
  inner?: number;
  outer?: number;
  top?: number;
}

export interface ResolvedTreemapPadding {
  inner: number;
  outer: number;
  top: number;
}

export interface TreemapNodeBase {
  name: string;
  value?: number;
}

export type TreemapNode<T extends TreemapNodeBase = TreemapNodeBase> = T & {
  children?: readonly TreemapNode<T>[];
};

export interface TreemapConfig {
  tile: TreemapTile;
  padding: ResolvedTreemapPadding;
  renderBranches: boolean;
}

export interface TreemapCellProps<T extends TreemapNodeBase = TreemapNodeBase> {
  node: HierarchyRectangularNode<TreemapNode<T>>;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  label: string;
  value: string | null;
  labelSkipSize: number;
  isBranch: boolean;
}

export type TreemapFill<T extends TreemapNodeBase = TreemapNodeBase> =
  | string
  | ((node: HierarchyRectangularNode<TreemapNode<T>>) => string);

export type TreemapLabelFormat<T extends TreemapNodeBase = TreemapNodeBase> = (
  node: HierarchyRectangularNode<TreemapNode<T>>,
) => string;

export type TreemapValueFormat<T extends TreemapNodeBase = TreemapNodeBase> = (
  value: number,
  node: HierarchyRectangularNode<TreemapNode<T>>,
) => string;

export type TreemapCellComponent<T extends TreemapNodeBase = TreemapNodeBase> =
  ComponentType<TreemapCellProps<T>>;
