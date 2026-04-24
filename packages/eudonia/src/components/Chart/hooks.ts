import { use, useId, useState } from "react";
import type { HierarchyRectangularNode } from "d3-hierarchy";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

import type {
  TreemapConfig,
  TreemapNode,
  TreemapNodeBase,
} from "../Treemap/types";

import type { Tick } from "./computeTicks";
import { isHierarchical, type ChartDatum } from "./dataShape";
import {
  shallowEqualBar,
  shallowEqualMark,
  shallowEqualTreemapConfig,
  shallowEqualXAxisConfig,
  shallowEqualYAxisConfig,
} from "./equality";
import type { Scale, TickValue } from "./scales";
import type {
  BarLayout,
  BarRegistration,
  ChartMargin,
  MarkRegistration,
  XAxisConfig,
  YAxisConfig,
} from "./state-types";
import {
  ChartStoreContext,
  type ChartState,
  type ChartStore,
} from "./store";

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

const selectArrayData = (s: ChartState): readonly ChartDatum[] => {
  if (isHierarchical(s.data)) {
    throw new Error(
      "useChartArrayData(): <Chart> was given hierarchical data. Use useChartHierarchyData() instead.",
    );
  }
  return s.data;
};
export function useChartArrayData(): readonly ChartDatum[] {
  return useStore(useChartStore(), selectArrayData);
}

const selectHierarchyData = (s: ChartState): TreemapNode => {
  if (!isHierarchical(s.data)) {
    throw new Error(
      "useChartHierarchyData(): <Chart> was given flat data. Use useChartArrayData() instead.",
    );
  }
  return s.data;
};
export function useChartHierarchyData<
  T extends TreemapNodeBase = TreemapNodeBase,
>(): TreemapNode<T> {
  // Store is non-generic over node shape; consumers carry their own T.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return useStore(useChartStore(), selectHierarchyData) as TreemapNode<T>;
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
export function useXScale(): Scale {
  return useStore(useChartStore(), selectXScale);
}

const selectYScale = (s: ChartState) => s.yScale;
export function useYScale(): Scale {
  return useStore(useChartStore(), selectYScale);
}

const selectXTicks = (s: ChartState) => s.xTicks;
export function useXTicks(): Tick<TickValue>[] {
  return useStore(useChartStore(), selectXTicks);
}

const selectYTicks = (s: ChartState) => s.yTicks;
export function useYTicks(): Tick<TickValue>[] {
  return useStore(useChartStore(), selectYTicks);
}

const selectResolvedXKey = (s: ChartState) => s.resolvedXKey;
export function useResolvedXKey(): string {
  return useStore(useChartStore(), selectResolvedXKey);
}

const selectResolvedYKey = (s: ChartState) => s.resolvedYKey;
export function useResolvedYKey(): string {
  return useStore(useChartStore(), selectResolvedYKey);
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

// Returns the stable registration id so the caller can pass it to useBarLayout.
// Bars need both ends of the same id — registration writes to the store and
// the layout hook reads the derived rect keyed by that id.
export function useRegisterBar(reg: BarRegistration): string {
  const store = useChartStore();
  const id = useId();
  const stable = useStable(reg, shallowEqualBar);

  useIsomorphicLayoutEffect(() => {
    store.getState().registerBar(id, stable);
    return () => {
      store.getState().unregisterBar(id);
    };
  }, [store, id, stable]);

  return id;
}

export function useBarLayout(id: string): BarLayout | null {
  return useStore(useChartStore(), (s) => s.barLayouts.get(id) ?? null);
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

export function useRegisterTreemap(cfg: TreemapConfig): string {
  const store = useChartStore();
  const id = useId();
  const stable = useStable(cfg, shallowEqualTreemapConfig);

  useIsomorphicLayoutEffect(() => {
    store.getState().registerTreemap(id, stable);
    return () => {
      store.getState().unregisterTreemap(id);
    };
  }, [store, id, stable]);

  return id;
}

export function useTreemapLayout<
  T extends TreemapNodeBase = TreemapNodeBase,
>(id: string): HierarchyRectangularNode<TreemapNode<T>> | null {
  const layout = useStore(useChartStore(), (s) => s.treemapLayouts.get(id));
  // Store holds layouts parameterized to the base node; consumers carry T.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return (layout ?? null) as HierarchyRectangularNode<TreemapNode<T>> | null;
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
