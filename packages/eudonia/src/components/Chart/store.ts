import { createContext } from "react";
import { createStore as createZustandStore, type StoreApi } from "zustand/vanilla";

import type { Tick, TickDensity, TickPreserve } from "./computeTicks";
import { derive } from "./derive";
import {
  sameStringList,
  shallowEqualMargin,
  shallowEqualMark,
  shallowEqualXAxisConfig,
  shallowEqualYAxisConfig,
  shallowEqualYDomain,
} from "./equality";
import type { ChartXType, XScale, XTickValue, YScale } from "./scales";

export type ChartDatum = Record<string, unknown>;

export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Preference a mark contributes for the categorical x-scale. `band` wins over
// `point` when marks disagree — a line sampled on band centers still renders,
// but a bar can't render without a bandwidth.
export type CategoricalScalePreference = "band" | "point";

export interface MarkRegistration {
  dataKey?: string | readonly string[];
  xCategoricalPreference?: CategoricalScalePreference;
}

export interface XAxisConfig {
  density: TickDensity;
  preserve: TickPreserve;
  anchorLabelsToEdges: boolean;
  preferredTickCount: number | undefined;
  tickFormat: ((v: XTickValue) => string) | undefined;
}

export interface YAxisConfig {
  density: TickDensity;
  preferredTickCount: number | undefined;
  tickFormat: ((v: number) => string) | undefined;
}

export interface ChartStateInputs {
  data: readonly ChartDatum[];
  authoredXKey: string | undefined;
  authoredXType: ChartXType | undefined;
  authoredYKeys: readonly string[] | undefined;
  yDomain: readonly [number, number] | undefined;
  margin: ChartMargin;
  width: number;
  height: number;
  markRegistrations: ReadonlyMap<string, MarkRegistration>;
  xAxisRegistrations: ReadonlyMap<string, XAxisConfig>;
  yAxisRegistrations: ReadonlyMap<string, YAxisConfig>;
}

export interface ChartStateDerived {
  resolvedXKey: string;
  resolvedXType: ChartXType;
  resolvedYKeys: readonly string[];
  innerWidth: number;
  innerHeight: number;
  xScale: XScale;
  yScale: YScale;
  xAxisConfig: XAxisConfig;
  yAxisConfig: YAxisConfig;
  xTicks: Tick<XTickValue>[];
  yTicks: Tick<number>[];
}

interface ChartStateActions {
  setData: (data: readonly ChartDatum[]) => void;
  setMargin: (margin: ChartMargin) => void;
  setSize: (width: number, height: number) => void;
  setAuthoredConfig: (cfg: {
    xKey?: string;
    xType?: ChartXType;
    yKeys?: readonly string[];
    yDomain?: readonly [number, number];
  }) => void;
  registerMark: (id: string, reg: MarkRegistration) => void;
  unregisterMark: (id: string) => void;
  registerXAxis: (id: string, cfg: XAxisConfig) => void;
  unregisterXAxis: (id: string) => void;
  registerYAxis: (id: string, cfg: YAxisConfig) => void;
  unregisterYAxis: (id: string) => void;
}

export type ChartState = ChartStateInputs & ChartStateDerived & ChartStateActions;
export type ChartStore = StoreApi<ChartState>;

export interface CreateChartStoreInit {
  data: readonly ChartDatum[];
  xKey?: string;
  xType?: ChartXType;
  yKeys?: readonly string[];
  yDomain?: readonly [number, number];
  margin: ChartMargin;
  width: number;
  height: number;
}

export function createChartStore(init: CreateChartStoreInit): ChartStore {
  return createZustandStore<ChartState>()((set) => {
    const inputs: ChartStateInputs = {
      data: init.data,
      authoredXKey: init.xKey,
      authoredXType: init.xType,
      authoredYKeys: init.yKeys,
      yDomain: init.yDomain,
      margin: init.margin,
      width: init.width,
      height: init.height,
      markRegistrations: new Map(),
      xAxisRegistrations: new Map(),
      yAxisRegistrations: new Map(),
    };
    const derived = derive(null, inputs);

    return {
      ...inputs,
      ...derived,
      setData: (data) =>
        set((prev) => {
          if (prev.data === data) return prev;
          const next = { ...prev, data };
          return { ...next, ...derive(prev, next) };
        }),
      setMargin: (margin) =>
        set((prev) => {
          if (shallowEqualMargin(prev.margin, margin)) return prev;
          const next = { ...prev, margin };
          return { ...next, ...derive(prev, next) };
        }),
      setSize: (width, height) =>
        set((prev) => {
          if (prev.width === width && prev.height === height) return prev;
          const next = { ...prev, width, height };
          return { ...next, ...derive(prev, next) };
        }),
      setAuthoredConfig: ({ xKey, xType, yKeys, yDomain }) =>
        set((prev) => {
          // Preserve old reference identity when values are equal so derive()
          // sees an unchanged input and skips downstream recomputes.
          const nextYKeys = sameStringList(prev.authoredYKeys, yKeys)
            ? prev.authoredYKeys
            : yKeys;
          const nextYDomain = shallowEqualYDomain(prev.yDomain, yDomain)
            ? prev.yDomain
            : yDomain;
          if (
            prev.authoredXKey === xKey &&
            prev.authoredXType === xType &&
            prev.authoredYKeys === nextYKeys &&
            prev.yDomain === nextYDomain
          ) {
            return prev;
          }
          const next = {
            ...prev,
            authoredXKey: xKey,
            authoredXType: xType,
            authoredYKeys: nextYKeys,
            yDomain: nextYDomain,
          };
          return { ...next, ...derive(prev, next) };
        }),
      registerMark: (id, reg) =>
        set((prev) => {
          const existing = prev.markRegistrations.get(id);
          if (existing && shallowEqualMark(existing, reg)) return prev;
          const markRegistrations = new Map(prev.markRegistrations);
          markRegistrations.set(id, reg);
          const next = { ...prev, markRegistrations };
          return { ...next, ...derive(prev, next) };
        }),
      unregisterMark: (id) =>
        set((prev) => {
          if (!prev.markRegistrations.has(id)) return prev;
          const markRegistrations = new Map(prev.markRegistrations);
          markRegistrations.delete(id);
          const next = { ...prev, markRegistrations };
          return { ...next, ...derive(prev, next) };
        }),
      registerXAxis: (id, cfg) =>
        set((prev) => {
          const existing = prev.xAxisRegistrations.get(id);
          if (existing && shallowEqualXAxisConfig(existing, cfg)) return prev;
          const xAxisRegistrations = new Map(prev.xAxisRegistrations);
          xAxisRegistrations.set(id, cfg);
          const next = { ...prev, xAxisRegistrations };
          return { ...next, ...derive(prev, next) };
        }),
      unregisterXAxis: (id) =>
        set((prev) => {
          if (!prev.xAxisRegistrations.has(id)) return prev;
          const xAxisRegistrations = new Map(prev.xAxisRegistrations);
          xAxisRegistrations.delete(id);
          const next = { ...prev, xAxisRegistrations };
          return { ...next, ...derive(prev, next) };
        }),
      registerYAxis: (id, cfg) =>
        set((prev) => {
          const existing = prev.yAxisRegistrations.get(id);
          if (existing && shallowEqualYAxisConfig(existing, cfg)) return prev;
          const yAxisRegistrations = new Map(prev.yAxisRegistrations);
          yAxisRegistrations.set(id, cfg);
          const next = { ...prev, yAxisRegistrations };
          return { ...next, ...derive(prev, next) };
        }),
      unregisterYAxis: (id) =>
        set((prev) => {
          if (!prev.yAxisRegistrations.has(id)) return prev;
          const yAxisRegistrations = new Map(prev.yAxisRegistrations);
          yAxisRegistrations.delete(id);
          const next = { ...prev, yAxisRegistrations };
          return { ...next, ...derive(prev, next) };
        }),
    };
  });
}

export const ChartStoreContext = createContext<ChartStore | null>(null);
