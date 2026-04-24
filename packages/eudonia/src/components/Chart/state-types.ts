import type { HierarchyRectangularNode } from "d3-hierarchy";

import type { TreemapConfig, TreemapNode } from "../Treemap/types";

import type { Tick, TickDensity, TickPreserve } from "./computeTicks";
import type { ChartData } from "./dataShape";
import type { Scale, ScaleKind, TickValue } from "./scales";

// State-shape types shared by the store (writer) and derive (reader). Lives
// separate from store.ts so derive.ts can depend on these without pulling in
// the zustand factory — avoids the store ↔ derive circular dep.

export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// A padding value expressed as pixels or a fraction of the band step.
//   - A raw `number` is pixels — `8` === `"8px"`.
//   - A `${number}px` string is pixels.
//   - A `${number}%` string is a fraction of the step — `"10%"` === fraction 0.1.
// Pixel inputs are converted to the equivalent fraction at scale-build time
// using the axis's pixel range and domain size. If the requested pixels exceed
// the available space, the fraction clamps to 1 and bars collapse to zero
// width (graceful degradation).
export type PaddingValue = number | `${number}%` | `${number}px`;

// d3 band-scale paddings. `inner` controls the gap between bands; `outer`
// controls the gap at each end of the range. Defaults: inner 0.1, outer 0.05.
export interface BandPadding {
  inner?: PaddingValue;
  outer?: PaddingValue;
}

// Preference a mark contributes for whichever axis carries its categorical
// dimension. `band` wins over `point` when marks disagree — a line sampled on
// band centers still renders, but a bar can't render without a bandwidth.
export type CategoricalScalePreference = "band" | "point";

export interface MarkRegistration {
  dataKey?: string | readonly string[];
  categoricalPreference?: CategoricalScalePreference;
  // Marks whose geometry is anchored at zero (bars, areas) register
  // `includeZero: true` so the value axis domain is clamped to contain zero
  // even when the data doesn't straddle it. Authored yDomain still wins.
  includeZero?: boolean;
}

// Registered by every <Bar>. Grouped bars share a common sub-band scale across
// the categorical axis's bandwidth — each registration claims one slot keyed by
// `stackId ?? dataKey`. Two bars with the same stackId collapse into one slot
// (used by stacks in a later slice; v1 ignores stackId, so each Bar is its own
// group). Registration order determines slot order.
export interface BarRegistration {
  dataKey: string;
  stackId?: string;
}

// Per-bar slice of the sub-band: where along the categorical axis this bar's
// group sits within the main band, and how wide it is. Bar applies this as an
// offset on whichever axis is categorical (x for vertical, y for horizontal).
// `slot` is the zero-based group index in registration order — used by Bar to
// pick a default fill from the palette. Stacked bars share a slot.
//
// `baseValues` is the value-axis offset per category for stacked bars. For
// each category the bar's segment runs from `base` to `base + v`, where `base`
// is the signed sum of earlier stack members' values at that category
// (positives stack upward from 0, negatives downward — d3 convention). Bars
// without a stackId have an empty map and fall back to 0.
export interface BarLayout {
  offset: number;
  bandwidth: number;
  slot: number;
  baseValues: ReadonlyMap<string, number>;
}

export interface XAxisConfig {
  density: TickDensity;
  preserve: TickPreserve;
  anchorLabelsToEdges: boolean;
  preferredTickCount: number | undefined;
  tickFormat: ((v: TickValue) => string) | undefined;
}

export interface YAxisConfig {
  density: TickDensity;
  preferredTickCount: number | undefined;
  tickFormat: ((v: TickValue) => string) | undefined;
}

export interface ChartStateInputs {
  data: ChartData;
  authoredXKey: string | undefined;
  authoredXType: ScaleKind | undefined;
  authoredYKey: string | undefined;
  authoredYType: ScaleKind | undefined;
  authoredYKeys: readonly string[] | undefined;
  yDomain: readonly [number, number] | undefined;
  bandPadding: BandPadding | undefined;
  barGroupPadding: PaddingValue | undefined;
  margin: ChartMargin;
  width: number;
  height: number;
  markRegistrations: ReadonlyMap<string, MarkRegistration>;
  barRegistrations: ReadonlyMap<string, BarRegistration>;
  xAxisRegistrations: ReadonlyMap<string, XAxisConfig>;
  yAxisRegistrations: ReadonlyMap<string, YAxisConfig>;
  treemapRegistrations: ReadonlyMap<string, TreemapConfig>;
}

export interface ChartStateDerived {
  resolvedXKey: string;
  resolvedXType: ScaleKind;
  resolvedYKey: string;
  resolvedYType: ScaleKind;
  resolvedYKeys: readonly string[];
  innerWidth: number;
  innerHeight: number;
  xScale: Scale;
  yScale: Scale;
  xAxisConfig: XAxisConfig;
  yAxisConfig: YAxisConfig;
  xTicks: Tick<TickValue>[];
  yTicks: Tick<TickValue>[];
  treemapLayouts: ReadonlyMap<string, HierarchyRectangularNode<TreemapNode>>;
  barLayouts: ReadonlyMap<string, BarLayout>;
  // Per-stackId list of dataKeys in registration order. Empty when no bars
  // declare a stackId. Consumed by the value scale (for stack-total domain)
  // and by deriveBarLayouts (to compute baseValues).
  stackGroups: ReadonlyMap<string, readonly string[]>;
}
