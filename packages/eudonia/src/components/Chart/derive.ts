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
import { scaleBand } from "@visx/scale";

import {
  buildXScale,
  buildYScale,
  inferXKey,
  inferXType,
  inferYKey,
  inferYKeys,
  resolveCategoryKey,
  resolveSubBandPaddingInner,
  type Scale,
  type TickValue,
} from "./scales";
import type {
  BarLayout,
  BarRegistration,
  CategoricalScalePreference,
  ChartStateDerived,
  ChartStateInputs,
  MarkRegistration,
  PaddingValue,
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

export const DEFAULT_BAR_GROUP_PADDING = 0.1;

const EMPTY_ARRAY: readonly ChartDatum[] = [];
const EMPTY_TREEMAP_LAYOUTS: ReadonlyMap<string, HierarchyRectangularNode<TreemapNode>> =
  new Map();
const EMPTY_BAR_LAYOUTS: ReadonlyMap<string, BarLayout> = new Map();
const EMPTY_BASE_VALUES: ReadonlyMap<string, number> = new Map();
const EMPTY_STACK_GROUPS: ReadonlyMap<string, readonly string[]> = new Map();

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

  const includeZero = resolveIncludeZero(next.markRegistrations);

  const stackGroups =
    prev && prev.barRegistrations === next.barRegistrations
      ? prev.stackGroups
      : resolveBarStacks(next.barRegistrations);

  // Horizontal orientation (yType=band) puts values on x — aggregate across
  // resolvedYKeys with stack awareness, same way buildYScale does for vertical.
  const xValueKeys = resolvedYType === "band" ? resolvedYKeys : undefined;

  const xScale =
    prev &&
    prev.data === next.data &&
    prev.resolvedXKey === resolvedXKey &&
    prev.resolvedXType === resolvedXType &&
    prev.innerWidth === innerWidth &&
    prev.bandPadding === next.bandPadding &&
    prev.resolvedYType === resolvedYType &&
    prev.resolvedYKeys === resolvedYKeys &&
    prev.stackGroups === stackGroups &&
    prev.markRegistrations === next.markRegistrations
      ? prev.xScale
      : buildXScale(
          flat,
          resolvedXKey,
          resolvedXType,
          innerWidth,
          next.bandPadding,
          xValueKeys,
          includeZero,
          stackGroups,
        );

  const yScale =
    prev &&
    prev.data === next.data &&
    prev.resolvedYKey === resolvedYKey &&
    prev.resolvedYType === resolvedYType &&
    prev.resolvedYKeys === resolvedYKeys &&
    prev.yDomain === next.yDomain &&
    prev.innerHeight === innerHeight &&
    prev.markRegistrations === next.markRegistrations &&
    prev.bandPadding === next.bandPadding &&
    prev.stackGroups === stackGroups
      ? prev.yScale
      : buildYScale(
          flat,
          resolvedYKey,
          resolvedYKeys,
          resolvedYType,
          next.yDomain,
          innerHeight,
          includeZero,
          next.bandPadding,
          stackGroups,
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

  const barLayouts =
    prev &&
    prev.barRegistrations === next.barRegistrations &&
    prev.data === next.data &&
    prev.xScale === xScale &&
    prev.yScale === yScale &&
    prev.resolvedXType === resolvedXType &&
    prev.resolvedYType === resolvedYType &&
    prev.resolvedXKey === resolvedXKey &&
    prev.resolvedYKey === resolvedYKey &&
    prev.barGroupPadding === next.barGroupPadding &&
    prev.stackGroups === stackGroups
      ? prev.barLayouts
      : deriveBarLayouts(
          next.barRegistrations,
          xScale,
          yScale,
          resolvedXType,
          resolvedYType,
          next.barGroupPadding,
          flat,
          resolvedXKey,
          resolvedYKey,
          stackGroups,
        );

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
    barLayouts,
    stackGroups,
  };
}

// Sub-band scale across the categorical axis's bandwidth. Each registration
// claims a slot keyed by `stackId ?? dataKey` — bars sharing a stackId collapse
// into one slot (stacks) and bars without a stackId each get their own (groups).
// If neither axis is band, bars can't render; return an empty map.
function deriveBarLayouts(
  regs: ReadonlyMap<string, BarRegistration>,
  xScale: Scale,
  yScale: Scale,
  xType: string,
  yType: string,
  groupPadding: PaddingValue | undefined,
  data: readonly ChartDatum[],
  xKey: string,
  yKey: string,
  stackGroups: ReadonlyMap<string, readonly string[]>,
): ReadonlyMap<string, BarLayout> {
  if (regs.size === 0) return EMPTY_BAR_LAYOUTS;

  const categoricalScale =
    xType === "band" ? xScale : yType === "band" ? yScale : null;
  if (!categoricalScale || categoricalScale.kind !== "band") return EMPTY_BAR_LAYOUTS;

  // Group keys in registration order so authors control slot order.
  const groupKeys: string[] = [];
  const slotOfGroup = new Map<string, number>();
  const groupOfReg = new Map<string, string>();
  for (const [id, reg] of regs) {
    const key = reg.stackId ?? reg.dataKey;
    groupOfReg.set(id, key);
    if (!slotOfGroup.has(key)) {
      slotOfGroup.set(key, groupKeys.length);
      groupKeys.push(key);
    }
  }

  const bandwidth = categoricalScale.scale.bandwidth();
  const paddingInner = resolveSubBandPaddingInner(
    groupPadding,
    bandwidth,
    groupKeys.length,
    DEFAULT_BAR_GROUP_PADDING,
  );
  const subBand = scaleBand<string>({
    domain: groupKeys,
    range: [0, bandwidth],
    paddingInner,
    paddingOuter: 0,
  });

  const baseValuesByReg = computeStackBaseValues(regs, stackGroups, data, xType === "band" ? xKey : yKey);

  const out = new Map<string, BarLayout>();
  for (const [id, groupKey] of groupOfReg) {
    out.set(id, {
      offset: subBand(groupKey) ?? 0,
      bandwidth: subBand.bandwidth(),
      slot: slotOfGroup.get(groupKey) ?? 0,
      baseValues: baseValuesByReg.get(id) ?? EMPTY_BASE_VALUES,
    });
  }
  return out;
}

// Stacking math: for each row, walk each stack's members in registration order
// and track separate positive/negative accumulators (d3 convention — positive
// values stack upward from 0, negatives downward). A segment's base at that
// row's category is the accumulator's current value BEFORE the segment's own
// value is added. Bars without a stackId (or whose value is missing) don't
// get an entry — the Bar renderer falls back to 0.
function computeStackBaseValues(
  regs: ReadonlyMap<string, BarRegistration>,
  stackGroups: ReadonlyMap<string, readonly string[]>,
  data: readonly ChartDatum[],
  categoryKey: string,
): Map<string, Map<string, number>> {
  const out = new Map<string, Map<string, number>>();
  if (stackGroups.size === 0) return out;

  // For each stack, resolve the list of registration ids in the same order as
  // the dataKeys the stackGroups map records. A stack's dataKey list is built
  // from barRegistrations in iteration order, so we re-walk the same iteration
  // and pick out the ids that belong to the stack.
  const idsByStack = new Map<string, string[]>();
  for (const [id, reg] of regs) {
    if (reg.stackId === undefined) continue;
    let list = idsByStack.get(reg.stackId);
    if (!list) {
      list = [];
      idsByStack.set(reg.stackId, list);
    }
    list.push(id);
    out.set(id, new Map());
  }

  for (const row of data) {
    const cat = resolveCategoryKey(row[categoryKey]);
    if (cat === null) continue;
    for (const [stackId, keys] of stackGroups) {
      const ids = idsByStack.get(stackId);
      if (!ids) continue;
      let pos = 0;
      let neg = 0;
      for (let i = 0; i < keys.length; i++) {
        const v = row[keys[i]!];
        if (typeof v !== "number" || !Number.isFinite(v)) continue;
        const base = v >= 0 ? pos : neg;
        out.get(ids[i]!)!.set(cat, base);
        if (v >= 0) pos += v;
        else neg += v;
      }
    }
  }
  return out;
}

// Builds the per-stackId list of dataKeys in barRegistrations iteration order.
// Consumed by buildYScale (to aggregate stack-total domain) and by
// computeStackBaseValues (to walk each stack's members per row).
function resolveBarStacks(
  regs: ReadonlyMap<string, BarRegistration>,
): ReadonlyMap<string, readonly string[]> {
  if (regs.size === 0) return EMPTY_STACK_GROUPS;
  let any = false;
  const out = new Map<string, string[]>();
  for (const reg of regs.values()) {
    if (reg.stackId === undefined) continue;
    any = true;
    let list = out.get(reg.stackId);
    if (!list) {
      list = [];
      out.set(reg.stackId, list);
    }
    list.push(reg.dataKey);
  }
  return any ? out : EMPTY_STACK_GROUPS;
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
