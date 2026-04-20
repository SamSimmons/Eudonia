import { use, useId, useState } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

import type { Tick } from "./computeTicks";
import {
  shallowEqualMark,
  shallowEqualXAxisConfig,
  shallowEqualYAxisConfig,
} from "./equality";
import {
  ChartStoreContext,
  type ChartMargin,
  type ChartState,
  type ChartStore,
  type ChartDatum,
  type MarkRegistration,
  type XAxisConfig,
  type YAxisConfig,
} from "./store";
import type { XScale, XTickValue, YScale } from "./scales";

export function useChartStore(): ChartStore {
  const store = use(ChartStoreContext);
  if (!store) {
    throw new Error("Chart primitives must be used inside <Chart>");
  }
  return store;
}

export function useChart<T>(
  selector: (state: ChartState) => T,
  equalityFn: (a: T, b: T) => boolean = Object.is,
): T {
  return useStoreWithEqualityFn(useChartStore(), selector, equalityFn);
}

const selectData = (s: ChartState) => s.data;
export function useChartData(): readonly ChartDatum[] {
  return useStore(useChartStore(), selectData);
}

const selectInnerSize = (s: ChartState) => ({
  innerWidth: s.innerWidth,
  innerHeight: s.innerHeight,
});
export function useInnerSize(): { innerWidth: number; innerHeight: number } {
  return useStore(useChartStore(), useShallow(selectInnerSize));
}

const selectSurface = (s: ChartState) => ({
  width: s.width,
  height: s.height,
  margin: s.margin,
});
export function useChartSurface(): {
  width: number;
  height: number;
  margin: ChartMargin;
} {
  return useStore(useChartStore(), useShallow(selectSurface));
}

const selectXScale = (s: ChartState) => s.xScale;
export function useXScale(): XScale {
  return useStore(useChartStore(), selectXScale);
}

const selectYScale = (s: ChartState) => s.yScale;
export function useYScale(): YScale {
  return useStore(useChartStore(), selectYScale);
}

const selectXTicks = (s: ChartState) => s.xTicks;
export function useXTicks(): Tick<XTickValue>[] {
  return useStore(useChartStore(), selectXTicks);
}

const selectYTicks = (s: ChartState) => s.yTicks;
export function useYTicks(): Tick<number>[] {
  return useStore(useChartStore(), selectYTicks);
}

const selectResolvedXKey = (s: ChartState) => s.resolvedXKey;
export function useResolvedXKey(): string {
  return useStore(useChartStore(), selectResolvedXKey);
}

export function useRegisterMark(reg: MarkRegistration): void {
  const store = useChartStore();
  const id = useId();
  const stable = useStable(reg, shallowEqualMark);

  useIsomorphicLayoutEffect(() => {
    store.getState().registerMark(id, stable);
    return () => {
      store.getState().unregisterMark(id);
    };
  }, [store, id, stable]);
}

export function useRegisterXAxis(cfg: XAxisConfig): void {
  const store = useChartStore();
  const id = useId();
  const stable = useStable(cfg, shallowEqualXAxisConfig);

  useIsomorphicLayoutEffect(() => {
    store.getState().registerXAxis(id, stable);
    return () => {
      store.getState().unregisterXAxis(id);
    };
  }, [store, id, stable]);
}

export function useRegisterYAxis(cfg: YAxisConfig): void {
  const store = useChartStore();
  const id = useId();
  const stable = useStable(cfg, shallowEqualYAxisConfig);

  useIsomorphicLayoutEffect(() => {
    store.getState().registerYAxis(id, stable);
    return () => {
      store.getState().unregisterYAxis(id);
    };
  }, [store, id, stable]);
}

// Preserves object identity across renders when a shallow-compare says the
// value hasn't meaningfully changed. Lets us pass `reg` / `cfg` as a layout-
// effect dep without inline-object churn re-running the effect every render.
function useStable<T>(value: T, equal: (a: T, b: T) => boolean): T {
  const [stable, setStable] = useState(value);
  if (!equal(stable, value)) {
    setStable(value);
    return value;
  }
  return stable;
}
