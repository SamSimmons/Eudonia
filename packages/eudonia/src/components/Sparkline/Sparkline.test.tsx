import "@/test/register-dom";

import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import { Sparkline } from "./Sparkline";

afterEach(() => {
  cleanup();
});

describe("Sparkline", () => {
  test("renders the values convenience API", () => {
    const { container } = render(<Sparkline values={[1, 3, 2]} width={120} height={40} />);

    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelectorAll("path")).toHaveLength(1);
  });

  test("renders chart-shaped data with multiple series", () => {
    const { container } = render(
      <Sparkline
        data={[
          { x: 1, actual: 2, target: 3 },
          { x: 2, actual: 4, target: 5 },
        ]}
        dataKey={["actual", "target"]}
        xType="linear"
        width={120}
        height={40}
      />,
    );

    expect(container.querySelectorAll("path")).toHaveLength(2);
  });

  test("renders filled areas behind lines without exposing gradient ids", () => {
    const { container } = render(
      <Sparkline
        data={[
          { x: 1, price: 10 },
          { x: 2, price: 12 },
          { x: 3, price: 11 },
        ]}
        dataKey="price"
        fill
        xType="linear"
        width={120}
        height={40}
      />,
    );

    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(2);
    expect(container.querySelector("linearGradient")).not.toBeNull();
    expect(paths[0]?.getAttribute("fill")).toMatch(/^url\(#/);
    expect(paths[1]?.getAttribute("fill")).toBe("none");
  });
});
