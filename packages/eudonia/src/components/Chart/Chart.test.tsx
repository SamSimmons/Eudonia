import "@/test/register-dom";

import { afterEach, describe, expect, test } from "bun:test";
import type { ReactNode } from "react";
import { cleanup, renderHook } from "@testing-library/react";

import { Chart, type ChartProps } from "./Chart";
import { useBarLayout, useRegisterBar, useResolvedXKey, useXScale, useYScale } from "./hooks";
import type { Scale } from "./scales";

afterEach(() => {
  cleanup();
});

function renderChart(props: Omit<ChartProps, "children" | "width" | "height">) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Chart width={400} height={200} {...props}>
      {children}
    </Chart>
  );
  const { result } = renderHook(
    () => ({
      xKey: useResolvedXKey(),
      xScale: useXScale(),
      yScale: useYScale(),
    }),
    { wrapper },
  );
  return result.current;
}

function dateDomain(domain: readonly unknown[]): [Date, Date] {
  const [a, b] = domain;
  if (!(a instanceof Date) || !(b instanceof Date)) {
    throw new Error(`expected date domain, got ${JSON.stringify(domain)}`);
  }
  return [a, b];
}

function linearYDomain(ctx: { yScale: Scale }): number[] {
  if (ctx.yScale.kind !== "linear") {
    throw new Error(`expected linear y scale, got ${ctx.yScale.kind}`);
  }
  return ctx.yScale.scale.domain();
}

describe("Chart", () => {
  test("renders with empty data without crashing", () => {
    const ctx = renderChart({ data: [] });
    expect(linearYDomain(ctx)).toEqual([0, 1]);
  });

  test("handles a single data point", () => {
    const ctx = renderChart({
      data: [{ x: 5, y: 10 }],
      xType: "linear",
    });
    expect(ctx.xScale.scale.domain()).toEqual([5, 5]);
    expect(linearYDomain(ctx)).toEqual([10 - 0.5, 10 + 0.5]);
  });

  test("pads degenerate y domain so flat series renders centered", () => {
    const ctx = renderChart({
      data: [
        { x: 1, y: 7 },
        { x: 2, y: 7 },
        { x: 3, y: 7 },
      ],
      xType: "linear",
    });
    const [lo, hi] = linearYDomain(ctx);
    expect(lo).toBeLessThan(7);
    expect(hi).toBeGreaterThan(7);
    if (ctx.yScale.kind !== "linear") throw new Error("expected linear");
    const mapped = ctx.yScale.scale(7);
    expect(Number.isFinite(mapped)).toBe(true);
    expect(mapped).toBeCloseTo(100, 5);
  });

  test("pads degenerate y domain at zero", () => {
    const ctx = renderChart({
      data: [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
      xType: "linear",
    });
    expect(linearYDomain(ctx)).toEqual([-1, 1]);
    if (ctx.yScale.kind !== "linear") throw new Error("expected linear");
    expect(ctx.yScale.scale(0)).toBeCloseTo(100, 5);
  });

  test("ignores non-number y values when inferring domain", () => {
    const ctx = renderChart({
      data: [
        { x: 1, y: 10 },
        { x: 2, y: null },
        { x: 3, y: 30 },
        { x: 4, y: "oops" },
      ],
      yKeys: ["y"],
      xType: "linear",
    });
    expect(linearYDomain(ctx)).toEqual([10, 30]);
  });

  test("does not stack overflow on large datasets", () => {
    const n = 150_000;
    const data = Array.from({ length: n }, (_, i) => ({ x: i, y: i % 97 }));
    const ctx = renderChart({ data, xType: "linear" });
    expect(ctx.xScale.scale.domain()).toEqual([0, n - 1]);
    expect(linearYDomain(ctx)).toEqual([0, 96]);
  });

  test("does not stack overflow on large time datasets", () => {
    const n = 150_000;
    const start = Date.UTC(2020, 0, 1);
    const data = Array.from({ length: n }, (_, i) => ({
      x: new Date(start + i * 86_400_000),
      y: i,
    }));
    const ctx = renderChart({ data, xType: "time" });
    const [lo, hi] = dateDomain(ctx.xScale.scale.domain());
    expect(lo.valueOf()).toBe(start);
    expect(hi.valueOf()).toBe(start + (n - 1) * 86_400_000);
  });

  test("infers point scale for string x values when no mark requests band", () => {
    const ctx = renderChart({
      data: [
        { label: "a", y: 1 },
        { label: "b", y: 2 },
      ],
    });
    expect(ctx.xScale.kind).toBe("point");
    expect(ctx.xKey).toBe("label");
  });

  test("infers time scale for Date x values", () => {
    const d1 = new Date("2024-01-01");
    const d2 = new Date("2024-02-01");
    const ctx = renderChart({
      data: [
        { t: d1, y: 1 },
        { t: d2, y: 2 },
      ],
    });
    const [lo, hi] = dateDomain(ctx.xScale.scale.domain());
    expect(lo.valueOf()).toBe(d1.valueOf());
    expect(hi.valueOf()).toBe(d2.valueOf());
  });

  test("aggregates y domain across multiple yKeys", () => {
    const ctx = renderChart({
      data: [
        { x: 1, a: 5, b: -2 },
        { x: 2, a: 15, b: 20 },
      ],
      yKeys: ["a", "b"],
      xType: "linear",
    });
    expect(linearYDomain(ctx)).toEqual([-2, 20]);
  });

  test("respects explicit yDomain override", () => {
    const ctx = renderChart({
      data: [{ x: 1, y: 500 }],
      yDomain: [0, 100],
      xType: "linear",
    });
    expect(linearYDomain(ctx)).toEqual([0, 100]);
  });

  test("bar layouts: grouped bars split the band into sub-slots in registration order", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Chart
        width={400}
        height={200}
        data={[
          { cat: "a", actual: 10, plan: 12 },
          { cat: "b", actual: 20, plan: 18 },
        ]}
        xType="band"
        xKey="cat"
      >
        {children}
      </Chart>
    );
    const { result } = renderHook(
      () => {
        const actualId = useRegisterBar({ dataKey: "actual" });
        const planId = useRegisterBar({ dataKey: "plan" });
        return {
          actual: useBarLayout(actualId),
          plan: useBarLayout(planId),
          xScale: useXScale(),
        };
      },
      { wrapper },
    );
    const { actual, plan, xScale } = result.current;
    expect(actual).not.toBeNull();
    expect(plan).not.toBeNull();
    if (!actual || !plan) throw new Error("expected layouts");
    if (xScale.kind !== "band") throw new Error("expected band x scale");
    expect(actual.offset).toBeLessThan(plan.offset);
    expect(actual.bandwidth).toBeCloseTo(plan.bandwidth, 5);
    expect(actual.bandwidth).toBeLessThan(xScale.scale.bandwidth());
    expect(actual.slot).toBe(0);
    expect(plan.slot).toBe(1);
  });

  test("barGroupPadding widens bars by reducing the sub-band gap", () => {
    function measure(groupPadding: number | undefined) {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Chart
          width={400}
          height={200}
          data={[{ cat: "a", actual: 1, plan: 2 }]}
          xType="band"
          xKey="cat"
          barGroupPadding={groupPadding}
        >
          {children}
        </Chart>
      );
      const { result } = renderHook(
        () => {
          const actualId = useRegisterBar({ dataKey: "actual" });
          useRegisterBar({ dataKey: "plan" });
          return useBarLayout(actualId);
        },
        { wrapper },
      );
      return result.current?.bandwidth ?? 0;
    }
    const defaultWidth = measure(undefined);
    const tighter = measure(0);
    expect(tighter).toBeGreaterThan(defaultWidth);
  });

  test("bandPadding controls the main category gap", () => {
    function measure(padding: { inner: number; outer: number } | undefined) {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Chart
          width={400}
          height={200}
          data={[
            { cat: "a", y: 1 },
            { cat: "b", y: 2 },
          ]}
          xType="band"
          xKey="cat"
          bandPadding={padding}
        >
          {children}
        </Chart>
      );
      const { result } = renderHook(() => useXScale(), { wrapper });
      const s = result.current;
      if (s.kind !== "band") throw new Error("expected band");
      return s.scale.bandwidth();
    }
    const defaultWidth = measure(undefined);
    const tighter = measure({ inner: 0, outer: 0 });
    expect(tighter).toBeGreaterThan(defaultWidth);
  });

  test("bandPadding pixel input is converted to the equivalent fraction", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Chart
        width={100}
        height={200}
        data={[
          { cat: "a", y: 1 },
          { cat: "b", y: 2 },
        ]}
        xType="band"
        xKey="cat"
        bandPadding={{ inner: "10px", outer: 0 }}
      >
        {children}
      </Chart>
    );
    const { result } = renderHook(() => useXScale(), { wrapper });
    const s = result.current;
    if (s.kind !== "band") throw new Error("expected band");
    // 2 bars + 1 inner gap of 10px + 0 outer = 100px range → each bar 45px,
    // inner gap 10px.
    expect(s.scale.bandwidth()).toBeCloseTo(45, 5);
    expect(s.scale.step() - s.scale.bandwidth()).toBeCloseTo(10, 5);
  });

  test("bandPadding percent string produces the expected d3 fraction", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Chart
        width={400}
        height={200}
        data={[
          { cat: "a", y: 1 },
          { cat: "b", y: 2 },
        ]}
        xType="band"
        xKey="cat"
        bandPadding={{ inner: "20%", outer: 0 }}
      >
        {children}
      </Chart>
    );
    const { result } = renderHook(() => useXScale(), { wrapper });
    const s = result.current;
    if (s.kind !== "band") throw new Error("expected band");
    // step = 400 / (2 - 0.2) = 222.22; bandwidth = step * (1 - 0.2) = 177.78
    expect(s.scale.step()).toBeCloseTo(400 / 1.8, 5);
    expect(s.scale.bandwidth()).toBeCloseTo((400 / 1.8) * 0.8, 5);
  });

  test("barGroupPadding pixel input produces a fixed-pixel sub-band gap", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Chart
        width={400}
        height={200}
        data={[{ cat: "a", x: 1, y: 2 }]}
        xType="band"
        xKey="cat"
        bandPadding={{ inner: 0, outer: 0 }}
        barGroupPadding="6px"
      >
        {children}
      </Chart>
    );
    const { result } = renderHook(
      () => {
        const aId = useRegisterBar({ dataKey: "x" });
        const bId = useRegisterBar({ dataKey: "y" });
        return { a: useBarLayout(aId), b: useBarLayout(bId) };
      },
      { wrapper },
    );
    const { a, b } = result.current;
    if (!a || !b) throw new Error("expected layouts");
    // One category over 400px with no band padding → bandwidth 400.
    // Two groups + 6px inner gap → each bar (400 - 6) / 2 = 197.
    expect(a.bandwidth).toBeCloseTo(197, 5);
    expect(b.offset - a.offset).toBeCloseTo(203, 5);
  });

  test("bar layouts: stacked bars share a slot", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Chart
        width={400}
        height={200}
        data={[{ cat: "a", x: 1, y: 2 }]}
        xType="band"
        xKey="cat"
      >
        {children}
      </Chart>
    );
    const { result } = renderHook(
      () => {
        const aId = useRegisterBar({ dataKey: "x", stackId: "s1" });
        const bId = useRegisterBar({ dataKey: "y", stackId: "s1" });
        return { a: useBarLayout(aId), b: useBarLayout(bId) };
      },
      { wrapper },
    );
    const { a, b } = result.current;
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    if (!a || !b) throw new Error("expected both layouts");
    expect(a.offset).toBe(b.offset);
    expect(a.bandwidth).toBe(b.bandwidth);
    expect(a.slot).toBe(b.slot);
  });

  test("bar layouts: stacked bars record baseValues in registration order", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Chart
        width={400}
        height={200}
        data={[
          { cat: "a", x: 3, y: 5 },
          { cat: "b", x: 4, y: 2 },
        ]}
        xType="band"
        xKey="cat"
      >
        {children}
      </Chart>
    );
    const { result } = renderHook(
      () => {
        const aId = useRegisterBar({ dataKey: "x", stackId: "s1" });
        const bId = useRegisterBar({ dataKey: "y", stackId: "s1" });
        return { a: useBarLayout(aId), b: useBarLayout(bId) };
      },
      { wrapper },
    );
    const { a, b } = result.current;
    if (!a || !b) throw new Error("expected both layouts");
    // First member sits at 0; second stacks on top of first's value.
    expect(a.baseValues.get("a")).toBe(0);
    expect(b.baseValues.get("a")).toBe(3);
    expect(a.baseValues.get("b")).toBe(0);
    expect(b.baseValues.get("b")).toBe(4);
  });

  test("bar layouts: negative values in a stack accumulate downward separately", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Chart
        width={400}
        height={200}
        data={[{ cat: "a", p1: 3, n1: -2, p2: 5, n2: -4 }]}
        xType="band"
        xKey="cat"
      >
        {children}
      </Chart>
    );
    const { result } = renderHook(
      () => ({
        p1: useBarLayout(useRegisterBar({ dataKey: "p1", stackId: "s" })),
        n1: useBarLayout(useRegisterBar({ dataKey: "n1", stackId: "s" })),
        p2: useBarLayout(useRegisterBar({ dataKey: "p2", stackId: "s" })),
        n2: useBarLayout(useRegisterBar({ dataKey: "n2", stackId: "s" })),
      }),
      { wrapper },
    );
    const { p1, n1, p2, n2 } = result.current;
    if (!p1 || !n1 || !p2 || !n2) throw new Error("expected layouts");
    // Positives stack upward from 0, negatives downward — independent accumulators.
    expect(p1.baseValues.get("a")).toBe(0);
    expect(n1.baseValues.get("a")).toBe(0);
    expect(p2.baseValues.get("a")).toBe(3);
    expect(n2.baseValues.get("a")).toBe(-2);
  });

  test("bar layouts: unstacked bars have empty baseValues", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Chart width={400} height={200} data={[{ cat: "a", x: 5 }]} xType="band" xKey="cat">
        {children}
      </Chart>
    );
    const { result } = renderHook(
      () => useBarLayout(useRegisterBar({ dataKey: "x" })),
      { wrapper },
    );
    expect(result.current?.baseValues.size).toBe(0);
  });

  test("y domain spans stack totals, not individual values", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Chart
        width={400}
        height={200}
        data={[
          { cat: "a", x: 10, y: 20 },
          { cat: "b", x: 15, y: 25 },
        ]}
        xType="band"
        xKey="cat"
      >
        {children}
      </Chart>
    );
    const { result } = renderHook(
      () => {
        useRegisterBar({ dataKey: "x", stackId: "s" });
        useRegisterBar({ dataKey: "y", stackId: "s" });
        return useYScale();
      },
      { wrapper },
    );
    const ys = result.current;
    if (ys.kind !== "linear") throw new Error("expected linear y");
    // b's stack total is 40; without stack-aware aggregation max would be 25.
    expect(ys.scale.domain()[1]).toBe(40);
  });

  test("bar layouts: empty when no categorical axis is band", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Chart
        width={400}
        height={200}
        data={[{ x: 1, y: 2 }]}
        xType="linear"
      >
        {children}
      </Chart>
    );
    const { result } = renderHook(
      () => {
        const id = useRegisterBar({ dataKey: "y" });
        return useBarLayout(id);
      },
      { wrapper },
    );
    expect(result.current).toBeNull();
  });

  test("horizontal bars: x domain spans stack totals across value keys", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Chart
        width={400}
        height={200}
        data={[
          { cat: "a", low: 10, mid: 20, high: 30 },
          { cat: "b", low: 5, mid: 15, high: 25 },
        ]}
        yType="band"
        yKey="cat"
        xType="linear"
      >
        {children}
      </Chart>
    );
    const { result } = renderHook(
      () => {
        useRegisterBar({ dataKey: "low", stackId: "s" });
        useRegisterBar({ dataKey: "mid", stackId: "s" });
        useRegisterBar({ dataKey: "high", stackId: "s" });
        return useXScale();
      },
      { wrapper },
    );
    const xs = result.current;
    if (xs.kind !== "linear") throw new Error("expected linear x");
    // First row's stack total is 60. includeZero (bars register it) pins min at 0.
    expect(xs.scale.domain()).toEqual([0, 60]);
  });

  test("supports categorical band y for horizontal charts", () => {
    const ctx = renderChart({
      data: [
        { value: 10, cat: "a" },
        { value: 20, cat: "b" },
      ],
      xType: "linear",
      xKey: "value",
      yType: "band",
      yKey: "cat",
    });
    expect(ctx.yScale.kind).toBe("band");
    if (ctx.yScale.kind !== "band") throw new Error("expected band");
    expect(ctx.yScale.scale.domain()).toEqual(["a", "b"]);
  });
});
