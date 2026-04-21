import {
  hierarchy,
  treemap,
  treemapBinary,
  treemapDice,
  treemapSlice,
  treemapSliceDice,
  treemapSquarify,
  type HierarchyRectangularNode,
  type TreemapLayout,
} from "d3-hierarchy";

import type { TreemapConfig, TreemapNode, TreemapTile } from "../Treemap/types";

import { computeXTicks, computeYTicks } from "./computeTicks";
import {
  isHierarchical,
  type ChartData,
  type ChartDatum,
} from "./dataShape";
import {
  buildXScale,
  buildYScale,
  inferXKey,
  inferXType,
  inferYKey,
  inferYKeys,
  type TickValue,
} from "./scales";
import type {
  CategoricalScalePreference,
  ChartStateDerived,
  ChartStateInputs,
  MarkRegistration,
  XAxisConfig,
  YAxisConfig,
} from "./state-types";

export const X_AXIS_DEFAULTS: XAxisConfig = {
  density: "medium",
  preserve: "auto",
  anchorLabelsToEdges: false,
  preferredTickCount: undefined,
  tickFormat: undefined,
};

export const Y_AXIS_DEFAULTS: YAxisConfig = {
  density: "medium",
  preferredTickCount: undefined,
  tickFormat: undefined,
};

const EMPTY_ARRAY: readonly ChartDatum[] = [];
const EMPTY_TREEMAP_LAYOUTS: ReadonlyMap<string, HierarchyRectangularNode<TreemapNode>> =
  new Map();

function arrayData(data: ChartData): readonly ChartDatum[] {
  return isHierarchical(data) ? EMPTY_ARRAY : data;
}

// Incremental derivation: each derived slice is recomputed only when its
// inputs (by reference) change. Unchanged slices keep their previous object
// identity so subscribers selecting them don't re-render.
export function derive(
  prev: (ChartStateInputs & ChartStateDerived) | null,
  next: ChartStateInputs,
): ChartStateDerived {
  const flat = arrayData(next.data);

  const resolvedXKey =
    prev && prev.data === next.data && prev.authoredXKey === next.authoredXKey
      ? prev.resolvedXKey
      : (next.authoredXKey ?? inferXKey(flat));

  const xAxisConfig =
    prev && prev.xAxisRegistrations === next.xAxisRegistrations
      ? prev.xAxisConfig
      : effectiveAxisConfig(next.xAxisRegistrations, X_AXIS_DEFAULTS);

  const yAxisConfig =
    prev && prev.yAxisRegistrations === next.yAxisRegistrations
      ? prev.yAxisConfig
      : effectiveAxisConfig(next.yAxisRegistrations, Y_AXIS_DEFAULTS);

  const resolvedXType =
    prev &&
    prev.data === next.data &&
    prev.authoredXType === next.authoredXType &&
    prev.resolvedXKey === resolvedXKey &&
    prev.markRegistrations === next.markRegistrations
      ? prev.resolvedXType
      : (next.authoredXType ??
        inferXType(
          flat,
          resolvedXKey,
          resolveCategoricalPreference(next.markRegistrations),
        ));

  const resolvedYKey =
    prev &&
    prev.data === next.data &&
    prev.authoredYKey === next.authoredYKey &&
    prev.resolvedXKey === resolvedXKey
      ? prev.resolvedYKey
      : (next.authoredYKey ?? inferYKey(flat, resolvedXKey));

  // Y defaults to linear unless the author opts into categorical/time. Unlike
  // X, we don't auto-detect — horizontal charts are rare enough that silently
  // flipping a numeric axis to categorical on data shape would be a footgun.
  const resolvedYType =
    prev && prev.authoredYType === next.authoredYType
      ? prev.resolvedYType
      : (next.authoredYType ?? "linear");

  const resolvedYKeys =
    prev &&
    prev.data === next.data &&
    prev.authoredYKeys === next.authoredYKeys &&
    prev.resolvedXKey === resolvedXKey &&
    prev.markRegistrations === next.markRegistrations
      ? prev.resolvedYKeys
      : resolveYKeys(flat, resolvedXKey, next.authoredYKeys, next.markRegistrations);

  const innerWidth = Math.max(0, next.width - next.margin.left - next.margin.right);
  const innerHeight = Math.max(0, next.height - next.margin.top - next.margin.bottom);

  const xScale =
    prev &&
    prev.data === next.data &&
    prev.resolvedXKey === resolvedXKey &&
    prev.resolvedXType === resolvedXType &&
    prev.innerWidth === innerWidth
      ? prev.xScale
      : buildXScale(flat, resolvedXKey, resolvedXType, innerWidth);

  const includeZeroInY = resolveIncludeZero(next.markRegistrations);

  const yScale =
    prev &&
    prev.data === next.data &&
    prev.resolvedYKey === resolvedYKey &&
    prev.resolvedYType === resolvedYType &&
    prev.resolvedYKeys === resolvedYKeys &&
    prev.yDomain === next.yDomain &&
    prev.innerHeight === innerHeight &&
    prev.markRegistrations === next.markRegistrations
      ? prev.yScale
      : buildYScale(
          flat,
          resolvedYKey,
          resolvedYKeys,
          resolvedYType,
          next.yDomain,
          innerHeight,
          includeZeroInY,
        );

  const xTicks =
    prev &&
    prev.xScale === xScale &&
    prev.innerWidth === innerWidth &&
    prev.xAxisConfig === xAxisConfig
      ? prev.xTicks
      : computeXTicks(
          xScale,
          innerWidth,
          xAxisConfig.density,
          xAxisConfig.preserve,
          xAxisConfig.anchorLabelsToEdges,
          xAxisConfig.preferredTickCount,
          xAxisConfig.tickFormat ?? defaultXFormat,
        );

  const yTicks =
    prev &&
    prev.yScale === yScale &&
    prev.innerHeight === innerHeight &&
    prev.yAxisConfig === yAxisConfig
      ? prev.yTicks
      : computeYTicks(
          yScale,
          innerHeight,
          yAxisConfig.density,
          yAxisConfig.preferredTickCount,
          yAxisConfig.tickFormat ?? defaultYFormat,
        );

  const treemapLayouts = deriveTreemapLayouts(prev, next, innerWidth, innerHeight);

  return {
    resolvedXKey,
    resolvedXType,
    resolvedYKey,
    resolvedYType,
    resolvedYKeys,
    innerWidth,
    innerHeight,
    xScale,
    yScale,
    xAxisConfig,
    yAxisConfig,
    xTicks,
    yTicks,
    treemapLayouts,
  };
}

function deriveTreemapLayouts(
  prev: (ChartStateInputs & ChartStateDerived) | null,
  next: ChartStateInputs,
  innerWidth: number,
  innerHeight: number,
): ReadonlyMap<string, HierarchyRectangularNode<TreemapNode>> {
  if (!isHierarchical(next.data) || next.treemapRegistrations.size === 0) {
    return prev && prev.treemapLayouts.size === 0 ? prev.treemapLayouts : EMPTY_TREEMAP_LAYOUTS;
  }
  if (innerWidth <= 0 || innerHeight <= 0) {
    return prev && prev.treemapLayouts.size === 0 ? prev.treemapLayouts : EMPTY_TREEMAP_LAYOUTS;
  }

  const canReusePrev =
    prev !== null &&
    prev.data === next.data &&
    prev.treemapRegistrations === next.treemapRegistrations &&
    prev.innerWidth === innerWidth &&
    prev.innerHeight === innerHeight;
  if (canReusePrev) return prev.treemapLayouts;

  const out = new Map<string, HierarchyRectangularNode<TreemapNode>>();
  for (const [id, cfg] of next.treemapRegistrations) {
    const prevLayout =
      prev &&
      prev.data === next.data &&
      prev.innerWidth === innerWidth &&
      prev.innerHeight === innerHeight &&
      prev.treemapRegistrations.get(id) === cfg
        ? prev.treemapLayouts.get(id)
        : undefined;
    out.set(id, prevLayout ?? computeTreemapLayout(next.data, cfg, innerWidth, innerHeight));
  }
  return out;
}

function computeTreemapLayout(
  data: TreemapNode,
  cfg: TreemapConfig,
  width: number,
  height: number,
): HierarchyRectangularNode<TreemapNode> {
  const root = hierarchy<TreemapNode>(data, (d) => d.children)
    .sum((d) => (d.children && d.children.length > 0 ? 0 : (d.value ?? 0)))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  const layout: TreemapLayout<TreemapNode> = treemap<TreemapNode>()
    .tile(tileForConfig(cfg.tile))
    .size([width, height])
    .paddingInner(cfg.padding.inner)
    .paddingOuter(cfg.padding.outer)
    .paddingTop(cfg.padding.top)
    .round(true);

  return layout(root);
}

function tileForConfig(tile: TreemapTile) {
  switch (tile) {
    case "squarify":
      return treemapSquarify;
    case "binary":
      return treemapBinary;
    case "slice":
      return treemapSlice;
    case "dice":
      return treemapDice;
    case "slice-dice":
      return treemapSliceDice;
  }
}

function resolveCategoricalPreference(
  regs: ReadonlyMap<string, MarkRegistration>,
): CategoricalScalePreference {
  for (const r of regs.values()) {
    if (r.categoricalPreference === "band") return "band";
  }
  return "point";
}

function resolveIncludeZero(
  regs: ReadonlyMap<string, MarkRegistration>,
): boolean {
  for (const r of regs.values()) {
    if (r.includeZero) return true;
  }
  return false;
}

function resolveYKeys(
  data: readonly ChartDatum[],
  xKey: string,
  authored: readonly string[] | undefined,
  regs: ReadonlyMap<string, MarkRegistration>,
): readonly string[] {
  if (authored) return authored;
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const r of regs.values()) {
    if (r.dataKey === undefined) continue;
    if (typeof r.dataKey === "string") {
      if (!seen.has(r.dataKey)) {
        seen.add(r.dataKey);
        ordered.push(r.dataKey);
      }
    } else {
      for (const k of r.dataKey) {
        if (!seen.has(k)) {
          seen.add(k);
          ordered.push(k);
        }
      }
    }
  }
  if (ordered.length > 0) return ordered;
  return inferYKeys(data, xKey);
}

// Last-registered wins. Two-axis use cases aren't realistic in v1; if the
// winner unmounts, the previous loser isn't restored (they'd have to re-
// register, which unmounting doesn't do) — acceptable tradeoff.
function effectiveAxisConfig<C>(regs: ReadonlyMap<string, C>, defaults: C): C {
  let last: C | undefined;
  for (const cfg of regs.values()) last = cfg;
  return last ?? defaults;
}

function defaultXFormat(v: TickValue): string {
  if (v instanceof Date) return v.toLocaleDateString();
  return String(v);
}

function defaultYFormat(v: TickValue): string {
  if (v instanceof Date) return v.toLocaleDateString();
  return String(v);
}
