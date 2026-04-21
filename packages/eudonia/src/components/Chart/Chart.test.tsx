import "@/test/register-dom";

import { afterEach, describe, expect, test } from "bun:test";
import type { ReactNode } from "react";
import { cleanup, renderHook } from "@testing-library/react";

import { Chart, type ChartProps } from "./Chart";
import { useResolvedXKey, useXScale, useYScale } from "./hooks";
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
