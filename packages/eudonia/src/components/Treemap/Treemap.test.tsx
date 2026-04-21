import "@/test/register-dom";

import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import { Chart } from "../Chart/Chart";

import { Treemap } from "./Treemap";
import type { TreemapNode } from "./types";

afterEach(() => {
  cleanup();
});

const SAMPLE: TreemapNode = {
  name: "Root",
  children: [
    { name: "A", value: 60 },
    { name: "B", value: 30 },
    { name: "C", value: 10 },
  ],
};

describe("Treemap", () => {
  test("renders one rect per leaf by default", () => {
    const { container } = render(
      <Chart data={SAMPLE} width={200} height={100}>
        <Treemap />
      </Chart>,
    );
    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBe(3);
  });

  test("rect areas are roughly proportional to leaf value", () => {
    const { container } = render(
      <Chart data={SAMPLE} width={200} height={100}>
        <Treemap padding={0} />
      </Chart>,
    );
    const cells = Array.from(container.querySelectorAll<SVGGElement>("[data-name]"));
    const byName = new Map(cells.map((c) => [c.getAttribute("data-name") ?? "", c]));
    const areaOf = (name: string): number => {
      const g = byName.get(name);
      if (!g) throw new Error(`missing cell for ${name}`);
      const rect = g.querySelector("rect");
      if (!rect) throw new Error(`missing rect for ${name}`);
      const w = Number(rect.getAttribute("width"));
      const h = Number(rect.getAttribute("height"));
      return w * h;
    };
    expect(areaOf("A")).toBeGreaterThan(areaOf("B"));
    expect(areaOf("B")).toBeGreaterThan(areaOf("C"));
  });

  test("renderBranches includes internal nodes", () => {
    const { container } = render(
      <Chart data={SAMPLE} width={200} height={100}>
        <Treemap renderBranches />
      </Chart>,
    );
    const leafCells = container.querySelectorAll('[data-depth="1"]');
    expect(leafCells.length).toBe(3);
    const rootCells = container.querySelectorAll('[data-depth="0"]');
    expect(rootCells.length).toBe(1);
  });

  test("throws when given flat array data", () => {
    // Render is swallowed inside an error boundary by testing-library in some
    // setups; explicit try/catch is the portable check.
    const doRender = () =>
      render(
        <Chart data={[{ x: 1, y: 2 }]} width={100} height={50}>
          <Treemap />
        </Chart>,
      );
    expect(doRender).toThrow(/hierarchy/i);
  });
});
