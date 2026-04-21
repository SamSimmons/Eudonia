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
  margin: ChartMargin;
  width: number;
  height: number;
  markRegistrations: ReadonlyMap<string, MarkRegistration>;
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
}
