import { describe, expect, test } from "bun:test";

import { checkColorBlindSafe } from "./checkColorBlindSafe";
import { defineCategorical } from "./defineCategorical";
import { defineDiverging } from "./defineDiverging";
import { defineSequential } from "./defineSequential";
import { formatOklch, lerpHue, parseOklch } from "./oklch";
import { resolvePalette } from "./resolvePalette";

describe("oklch parse/format", () => {
  test("round-trips a simple oklch", () => {
    const parsed = parseOklch("oklch(0.55 0.14 230)");
    expect(parsed.L).toBeCloseTo(0.55);
    expect(parsed.C).toBeCloseTo(0.14);
    expect(parsed.H).toBeCloseTo(230);
    expect(parsed.alpha).toBeUndefined();
  });

  test("parses alpha", () => {
    const parsed = parseOklch("oklch(0.55 0.14 230 / 0.5)");
    expect(parsed.alpha).toBeCloseTo(0.5);
  });

  test("rejects malformed input", () => {
    expect(() => parseOklch("rgb(0,0,0)")).toThrow();
    expect(() => parseOklch("oklch()")).toThrow();
  });

  test("formats round-trip", () => {
    expect(formatOklch({ L: 0.55, C: 0.14, H: 230 })).toBe(
      "oklch(0.55 0.14 230)",
    );
  });
});

describe("lerpHue", () => {
  test("walks the short way around the wheel", () => {
    expect(lerpHue(10, 350, 0.5)).toBeCloseTo(0); // wraps through 360, not through 180
    expect(lerpHue(0, 180, 0.5)).toBeCloseTo(90);
  });
});

describe("defineCategorical", () => {
  test("emits the expected number of slots", () => {
    const palette = defineCategorical({
      anchor: "oklch(0.55 0.14 230)",
      size: 5,
    });
    expect(Object.keys(palette.vars)).toHaveLength(5);
    expect(palette.vars["--eudonia-chart-cat-1"]).toContain("oklch");
    expect(palette.vars["--eudonia-chart-cat-5"]).toContain("oklch");
  });

  test("anchor is slot 1", () => {
    const anchor = "oklch(0.55 0.14 230)";
    const palette = defineCategorical({ anchor });
    const parsed = parseOklch(palette.vars["--eudonia-chart-cat-1"]!);
    expect(parsed.H).toBeCloseTo(230, 0);
    expect(parsed.L).toBeCloseTo(0.55);
  });

  test("equal L across all slots", () => {
    const palette = defineCategorical({ anchor: "oklch(0.6 0.12 200)" });
    for (const value of Object.values(palette.vars)) {
      expect(parseOklch(value).L).toBeCloseTo(0.6);
    }
  });
});

describe("defineSequential", () => {
  test("L is monotonically decreasing from light to dark", () => {
    const palette = defineSequential({ hue: "oklch(0.5 0.14 230)", size: 9 });
    const lValues = Object.values(palette.vars).map((v) => parseOklch(v).L);
    for (let i = 1; i < lValues.length; i++) {
      expect(lValues[i]!).toBeLessThan(lValues[i - 1]!);
    }
  });

  test("hue is constant", () => {
    const palette = defineSequential({ hue: "oklch(0.5 0.14 200)", size: 5 });
    for (const value of Object.values(palette.vars)) {
      expect(parseOklch(value).H).toBeCloseTo(200, 0);
    }
  });
});

describe("defineDiverging", () => {
  test("rejects even sizes", () => {
    expect(() =>
      defineDiverging({
        low: "oklch(0.6 0.16 25)",
        high: "oklch(0.6 0.16 150)",
        size: 6,
      }),
    ).toThrow();
  });

  test("midpoint sits at exact center", () => {
    const palette = defineDiverging({
      low: "oklch(0.55 0.16 25)",
      high: "oklch(0.55 0.16 150)",
      size: 7,
    });
    expect(palette.vars["--eudonia-chart-div-mid"]).toBe(
      palette.vars["--eudonia-chart-div-4"],
    );
  });

  test("low and high alias to the endpoints", () => {
    const palette = defineDiverging({
      low: "oklch(0.55 0.16 25)",
      high: "oklch(0.55 0.16 150)",
      size: 5,
    });
    expect(palette.vars["--eudonia-chart-div-low"]).toBe(
      palette.vars["--eudonia-chart-div-1"],
    );
    expect(palette.vars["--eudonia-chart-div-high"]).toBe(
      palette.vars["--eudonia-chart-div-5"],
    );
  });
});

describe("checkColorBlindSafe", () => {
  test("flags the canonical red/green pair as deuteranopia-unsafe", () => {
    const result = checkColorBlindSafe([
      "oklch(0.6 0.18 25)",
      "oklch(0.6 0.16 150)",
    ]);
    expect(result.safe).toBe(false);
    expect(result.conflicts.some((c) => c.type === "deuteranopia")).toBe(true);
  });

  test("blue/orange pair is safe across all CVD types", () => {
    const result = checkColorBlindSafe([
      "oklch(0.55 0.14 230)",
      "oklch(0.7 0.13 60)",
    ]);
    expect(result.safe).toBe(true);
  });
});

describe("resolvePalette", () => {
  test("named palette resolves to inline-style vars from the registry", () => {
    const r = resolvePalette("tableau-10");
    expect(r.style).toBeDefined();
    expect(r.style!["--eudonia-chart-cat-1"]).toBe("oklch(0.564 0.086 251.1)");
    expect(r.style!["--eudonia-positive-h"]).toBe("141");
    expect(r.style!["--eudonia-negative-c"]).toBe("0.14");
  });

  test("structured Palette object resolves to vars", () => {
    const r = resolvePalette({
      categorical: ["#abc", "#def"],
      positiveH: 120,
      negativeC: 0.15,
    });
    expect(r.style).toEqual({
      "--eudonia-chart-cat-1": "#abc",
      "--eudonia-chart-cat-2": "#def",
      "--eudonia-positive-h": "120",
      "--eudonia-negative-c": "0.15",
    });
  });

  test("unknown palette name throws", () => {
    // The typed API blocks invalid names at compile time; this exercises the
    // runtime guard for callers passing strings from external config.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    expect(() => resolvePalette("not-a-real-palette" as never)).toThrow();
  });

  test("raw array becomes categorical CSS vars", () => {
    const r = resolvePalette(["oklch(0.5 0.1 200)", "oklch(0.5 0.1 50)"]);
    expect(r.style).toEqual({
      "--eudonia-chart-cat-1": "oklch(0.5 0.1 200)",
      "--eudonia-chart-cat-2": "oklch(0.5 0.1 50)",
    });
  });

  test("derived palette becomes inline style", () => {
    const palette = defineCategorical({
      anchor: "oklch(0.55 0.14 230)",
      size: 3,
    });
    const r = resolvePalette(palette);
    expect(r.style).toMatchObject(palette.vars);
  });

  test("partial merges multiple kinds into style", () => {
    const cat = defineCategorical({
      anchor: "oklch(0.55 0.14 230)",
      size: 2,
    });
    const seq = defineSequential({ hue: "oklch(0.5 0.14 230)", size: 2 });
    const r = resolvePalette({ categorical: cat, sequential: seq });
    expect(r.style).toBeDefined();
    expect(r.style!["--eudonia-chart-cat-1"]).toBeDefined();
    expect(r.style!["--eudonia-chart-seq-1"]).toBeDefined();
  });

  test("undefined palette resolves to empty", () => {
    expect(resolvePalette(undefined)).toEqual({});
  });

  test("partial with raw categorical + derived other kind disambiguates correctly", () => {
    // Regression: `{ categorical: [...], sequential: <derived> }` used to be
    // misclassified as a structured Palette (since `categorical: string[]`
    // matches Palette's shape) and crash inside paletteToVars.
    const seq = defineSequential({ hue: "oklch(0.5 0.14 230)", size: 2 });
    const r = resolvePalette({ categorical: ["#111"], sequential: seq });
    expect(r.style!["--eudonia-chart-cat-1"]).toBe("#111");
    expect(r.style!["--eudonia-chart-seq-1"]).toBeDefined();
  });

  test("named palette in a kind that doesn't define that ramp throws", () => {
    // Regression: `{ sequential: "tableau-10" }` used to silently resolve to
    // {} because tableau-10 only defines categorical. Now it errors.
    expect(() => resolvePalette({ sequential: "tableau-10" })).toThrow();
  });

  test("raw diverging array emits low/mid/high aliases for odd-stop ramps", () => {
    const r = resolvePalette({
      diverging: ["#a", "#b", "#c", "#d", "#e"],
    });
    expect(r.style!["--eudonia-chart-div-low"]).toBe("#a");
    expect(r.style!["--eudonia-chart-div-mid"]).toBe("#c");
    expect(r.style!["--eudonia-chart-div-high"]).toBe("#e");
  });

  test("raw diverging array with even stops omits mid alias", () => {
    const r = resolvePalette({ diverging: ["#a", "#b", "#c", "#d"] });
    expect(r.style!["--eudonia-chart-div-low"]).toBe("#a");
    expect(r.style!["--eudonia-chart-div-high"]).toBe("#d");
    expect(r.style!["--eudonia-chart-div-mid"]).toBeUndefined();
  });

  test("structured Palette with diverging ramp emits aliases", () => {
    const r = resolvePalette({
      diverging: ["#a", "#b", "#c"],
    });
    expect(r.style!["--eudonia-chart-div-low"]).toBe("#a");
    expect(r.style!["--eudonia-chart-div-mid"]).toBe("#b");
    expect(r.style!["--eudonia-chart-div-high"]).toBe("#c");
  });
});
