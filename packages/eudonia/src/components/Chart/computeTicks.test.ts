import { describe, expect, test } from "bun:test";
import { scaleBand, scaleLinear, scalePoint } from "@visx/scale";

import { computeXTicks, computeYTicks } from "./computeTicks";
import type { Scale } from "./scales";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function pointScale(width: number): Scale {
  return {
    kind: "point",
    scale: scalePoint<string>({ domain: [...MONTHS], range: [0, width] }),
  };
}

function bandScale(width: number): Scale {
  return {
    kind: "band",
    scale: scaleBand<string>({ domain: [...MONTHS], range: [0, width] }),
  };
}

function linearScale(width: number): Scale {
  return {
    kind: "linear",
    scale: scaleLinear<number>({ domain: [0, 100], range: [0, width] }),
  };
}

const identityFormat = (v: unknown): string => String(v);

describe("computeXTicks (categorical)", () => {
  test("narrow chart: keeps multiple labels instead of collapsing to one", () => {
    // With the old budget-based target this produced [Jan] only. Measurement-
    // based selection should pick the tightest stride that fits.
    const ticks = computeXTicks(pointScale(200), 200, "medium", "auto", false, undefined, identityFormat);
    const labels = ticks.map((t) => t.label);
    expect(labels.length).toBeGreaterThan(1);
    expect(labels).toContain("Jan");
    expect(labels).toContain("Dec");
  });

  test("wide chart: shows every category when measurement allows", () => {
    const ticks = computeXTicks(pointScale(2000), 2000, "medium", "auto", false, undefined, identityFormat);
    expect(ticks.map((t) => t.label)).toEqual([...MONTHS]);
  });

  test("very narrow chart: falls back to both endpoints", () => {
    const ticks = computeXTicks(pointScale(30), 30, "medium", "auto", false, undefined, identityFormat);
    expect(ticks.map((t) => t.label)).toEqual(["Jan", "Dec"]);
  });

  test("density does not cap categorical tick count", () => {
    // "low" used to mean "target=floor(width/120)" which capped categorical
    // axes. Now density is ignored for categorical — measurement alone rules.
    const low = computeXTicks(pointScale(400), 400, "low", "auto", false, undefined, identityFormat);
    const high = computeXTicks(pointScale(400), 400, "high", "auto", false, undefined, identityFormat);
    expect(low.map((t) => t.label)).toEqual(high.map((t) => t.label));
  });

  test("preferredTickCount still caps categorical", () => {
    const ticks = computeXTicks(pointScale(2000), 2000, "medium", "auto", false, 3, identityFormat);
    expect(ticks.length).toBeLessThanOrEqual(4);
    expect(ticks.map((t) => t.label)).toContain("Jan");
  });

  test("works for band scales", () => {
    const ticks = computeXTicks(bandScale(200), 200, "medium", "auto", false, undefined, identityFormat);
    const labels = ticks.map((t) => t.label);
    expect(labels.length).toBeGreaterThan(1);
    expect(labels).toContain("Jan");
    expect(labels).toContain("Dec");
  });

  test("explicit preserve=start anchors only the first label", () => {
    const ticks = computeXTicks(pointScale(80), 80, "medium", "start", false, undefined, identityFormat);
    const labels = ticks.map((t) => t.label);
    expect(labels[0]).toBe("Jan");
    expect(labels).not.toContain("Dec");
  });
});

describe("computeXTicks (continuous)", () => {
  test("uses density budget to pick target tick count", () => {
    const ticks = computeXTicks(linearScale(600), 600, "medium", "auto", false, undefined, identityFormat);
    // Budget medium=80 → target≈7, d3 picks nice numbers within that range.
    expect(ticks.length).toBeGreaterThan(2);
    expect(ticks.length).toBeLessThanOrEqual(12);
  });

  test("narrow chart still shows at least the endpoints d3 returns", () => {
    const ticks = computeXTicks(linearScale(150), 150, "medium", "auto", false, undefined, identityFormat);
    expect(ticks.length).toBeGreaterThanOrEqual(1);
  });
});

describe("computeYTicks", () => {
  test("returns tick values covering a linear domain", () => {
    const scale: Scale = {
      kind: "linear",
      scale: scaleLinear<number>({ domain: [0, 100], range: [200, 0] }),
    };
    const ticks = computeYTicks(scale, 200, "medium", undefined, identityFormat);
    expect(ticks.length).toBeGreaterThan(1);
  });

  test("handles band y for horizontal charts", () => {
    const scale: Scale = {
      kind: "band",
      scale: scaleBand<string>({ domain: [...MONTHS], range: [0, 400] }),
    };
    const ticks = computeYTicks(scale, 400, "medium", undefined, identityFormat);
    const labels = ticks.map((t) => t.label);
    expect(labels).toContain("Jan");
    expect(labels).toContain("Dec");
  });
});
