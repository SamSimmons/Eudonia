import { describe, expect, test } from "bun:test";
import { scaleBand, scaleLinear, scaleTime } from "@visx/scale";

import { getX, type XScale } from "./scales";

const band: XScale = {
  kind: "band",
  scale: scaleBand<string>({ domain: ["a", "b", "c"], range: [0, 300] }),
};

const time: XScale = {
  kind: "time",
  scale: scaleTime({
    domain: [new Date("2024-01-01"), new Date("2024-12-31")],
    range: [0, 300],
  }),
};

const linear: XScale = {
  kind: "linear",
  scale: scaleLinear<number>({ domain: [0, 100], range: [0, 300] }),
};

describe("getX", () => {
  test("band: returns centered position for in-domain string", () => {
    expect(Number.isFinite(getX("b", band))).toBe(true);
  });

  test("band: returns NaN for out-of-domain string", () => {
    expect(getX("z", band)).toBeNaN();
  });

  test("band: returns NaN for non-string value", () => {
    expect(getX(42, band)).toBeNaN();
    expect(getX(null, band)).toBeNaN();
    expect(getX(undefined, band)).toBeNaN();
  });

  test("time: returns position for Date", () => {
    expect(Number.isFinite(getX(new Date("2024-06-01"), time))).toBe(true);
  });

  test("time: returns NaN for non-Date value", () => {
    expect(getX("2024-06-01", time)).toBeNaN();
    expect(getX(1717200000000, time)).toBeNaN();
    expect(getX(null, time)).toBeNaN();
  });

  test("linear: returns position for number", () => {
    expect(getX(50, linear)).toBeCloseTo(150, 5);
  });

  test("linear: returns NaN for non-number value", () => {
    expect(getX("50", linear)).toBeNaN();
    expect(getX(null, linear)).toBeNaN();
    expect(getX(undefined, linear)).toBeNaN();
  });
});
