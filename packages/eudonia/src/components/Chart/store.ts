import { createContext } from "react";
import { createStore as createZustandStore, type StoreApi } from "zustand/vanilla";

import type { TreemapConfig } from "../Treemap/types";

import type { ChartData } from "./dataShape";
import { derive } from "./derive";
import {
  sameStringList,
  shallowEqualMargin,
  shallowEqualMark,
  shallowEqualTreemapConfig,
  shallowEqualXAxisConfig,
  shallowEqualYAxisConfig,
  shallowEqualYDomain,
} from "./equality";
import type { ScaleKind } from "./scales";
import type {
  ChartMargin,
  ChartStateDerived,
  ChartStateInputs,
  MarkRegistration,
  XAxisConfig,
  YAxisConfig,
} from "./state-types";

interface ChartStateActions {
  setData: (data: ChartData) => void;
  setMargin: (margin: ChartMargin) => void;
  setSize: (width: number, height: number) => void;
  setAuthoredConfig: (cfg: {
    xKey?: string;
    xType?: ScaleKind;
    yKey?: string;
    yType?: ScaleKind;
    yKeys?: readonly string[];
    yDomain?: readonly [number, number];
  }) => void;
  registerMark: (id: string, reg: MarkRegistration) => void;
  unregisterMark: (id: string) => void;
  registerXAxis: (id: string, cfg: XAxisConfig) => void;
  unregisterXAxis: (id: string) => void;
  registerYAxis: (id: string, cfg: YAxisConfig) => void;
  unregisterYAxis: (id: string) => void;
  registerTreemap: (id: string, cfg: TreemapConfig) => void;
  unregisterTreemap: (id: string) => void;
}

export type ChartState = ChartStateInputs & ChartStateDerived & ChartStateActions;
export type ChartStore = StoreApi<ChartState>;

export interface CreateChartStoreInit {
  data: ChartData;
  xKey?: string;
  xType?: ScaleKind;
  yKey?: string;
  yType?: ScaleKind;
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
      authoredYKey: init.yKey,
      authoredYType: init.yType,
      authoredYKeys: init.yKeys,
      yDomain: init.yDomain,
      margin: init.margin,
      width: init.width,
      height: init.height,
      markRegistrations: new Map(),
      xAxisRegistrations: new Map(),
      yAxisRegistrations: new Map(),
      treemapRegistrations: new Map(),
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
      setAuthoredConfig: ({ xKey, xType, yKey, yType, yKeys, yDomain }) =>
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
            prev.authoredYKey === yKey &&
            prev.authoredYType === yType &&
            prev.authoredYKeys === nextYKeys &&
            prev.yDomain === nextYDomain
          ) {
            return prev;
          }
          const next = {
            ...prev,
            authoredXKey: xKey,
            authoredXType: xType,
            authoredYKey: yKey,
            authoredYType: yType,
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
      registerTreemap: (id, cfg) =>
        set((prev) => {
          const existing = prev.treemapRegistrations.get(id);
          if (existing && shallowEqualTreemapConfig(existing, cfg)) return prev;
          const treemapRegistrations = new Map(prev.treemapRegistrations);
          treemapRegistrations.set(id, cfg);
          const next = { ...prev, treemapRegistrations };
          return { ...next, ...derive(prev, next) };
        }),
      unregisterTreemap: (id) =>
        set((prev) => {
          if (!prev.treemapRegistrations.has(id)) return prev;
          const treemapRegistrations = new Map(prev.treemapRegistrations);
          treemapRegistrations.delete(id);
          const next = { ...prev, treemapRegistrations };
          return { ...next, ...derive(prev, next) };
        }),
    };
  });
}

export const ChartStoreContext = createContext<ChartStore | null>(null);
