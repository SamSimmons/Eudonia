import "@/test/register-dom";

import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import { Chart } from "../Chart/Chart";
import { ReferenceLine } from "./ReferenceLine";

afterEach(() => {
  cleanup();
});

const data = [
  { x: 1, y: 10 },
  { x: 2, y: 20 },
];

describe("ReferenceLine", () => {
  test("throws when neither x nor y is provided (runtime backstop for JS callers)", () => {
    expect(() =>
      render(
        <Chart data={data} width={200} height={100} xType="linear">
          {/* @ts-expect-error — types disallow this; testing runtime guard */}
          <ReferenceLine />
        </Chart>,
      ),
    ).toThrow(/exactly one of `x` or `y`/);
  });

  test("throws when both x and y are provided (runtime backstop for JS callers)", () => {
    expect(() =>
      render(
        <Chart data={data} width={200} height={100} xType="linear">
          {/* @ts-expect-error — types disallow this; testing runtime guard */}
          <ReferenceLine x={1} y={10} />
        </Chart>,
      ),
    ).toThrow(/exactly one of `x` or `y`/);
  });

  test("renders when only y is provided", () => {
    expect(() =>
      render(
        <Chart data={data} width={200} height={100} xType="linear">
          <ReferenceLine y={10} />
        </Chart>,
      ),
    ).not.toThrow();
  });

  test("renders when only x is provided", () => {
    expect(() =>
      render(
        <Chart data={data} width={200} height={100} xType="linear">
          <ReferenceLine x={1} />
        </Chart>,
      ),
    ).not.toThrow();
  });
});
