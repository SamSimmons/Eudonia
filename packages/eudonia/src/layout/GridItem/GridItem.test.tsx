import "@/test/register-dom";

import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import { GridItem } from "./GridItem";

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

describe("GridItem", () => {
  test("defaults to an auto-placed grid item", () => {
    const { getByTestId } = render(<GridItem data-testid="item" />);

    const element = getByTestId("item");

    expect(element.style.gridColumnStart).toBe("");
    expect(element.style.gridColumnEnd).toBe("");
    expect(element.style.gridRowStart).toBe("");
    expect(element.style.gridRowEnd).toBe("");
    expect(element.style.minWidth).toBe("0px");
    expect(element.style.minHeight).toBe("0px");
  });

  test("applies numeric placement and span while preserving required min size", () => {
    const { getByTestId } = render(
      <GridItem
        column={2}
        columnSpan={3}
        data-testid="item"
        row={1}
        rowSpan={2}
        style={{
          gridColumnEnd: "span 8",
          gridColumnStart: "7",
          gridRowEnd: "span 9",
          gridRowStart: "6",
          minHeight: "100px",
          minWidth: "100px",
        }}
      />,
    );

    const element = getByTestId("item");

    expect(element.style.gridColumnStart).toBe("2");
    expect(element.style.gridColumnEnd).toBe("span 3");
    expect(element.style.gridRowStart).toBe("1");
    expect(element.style.gridRowEnd).toBe("span 2");
    expect(element.style.minWidth).toBe("0px");
    expect(element.style.minHeight).toBe("0px");
  });

  test("supports auto-placement spans without explicit start positions", () => {
    const { getByTestId } = render(
      <GridItem columnSpan={2} data-testid="item" rowSpan={3} />,
    );

    const element = getByTestId("item");

    expect(element.style.gridColumnStart).toBe("");
    expect(element.style.gridColumnEnd).toBe("span 2");
    expect(element.style.gridRowStart).toBe("");
    expect(element.style.gridRowEnd).toBe("span 3");
  });
});
