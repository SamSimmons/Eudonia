import "@/test/register-dom";

import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import { Flex } from "./Flex";

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

describe("Flex", () => {
  test("defaults to a row flex container that fills its container", () => {
    const { getByTestId } = render(<Flex data-testid="flex" />);

    const element = getByTestId("flex");

    expect(element.style.display).toBe("flex");
    expect(element.style.flexDirection).toBe("row");
    expect(element.style.gap).toBe("0px");
    expect(element.style.width).toBe("100%");
    expect(element.style.height).toBe("100%");
    expect(element.style.minWidth).toBe("0px");
    expect(element.style.minHeight).toBe("0px");
  });

  test("uses explicit width and height props over style width and height", () => {
    const { getByTestId } = render(
      <Flex
        data-testid="flex"
        direction="column"
        gap={24}
        height="fit-content"
        style={{
          display: "block",
          flexDirection: "row",
          gap: "2rem",
          height: "10px",
          minHeight: "200px",
          minWidth: "200px",
          width: "10px",
        }}
        width="calc(100% - 24px)"
      />,
    );

    const element = getByTestId("flex");

    expect(element.style.display).toBe("flex");
    expect(element.style.flexDirection).toBe("column");
    expect(element.style.gap).toBe("24px");
    expect(element.style.width).toBe("calc(100% - 24px)");
    expect(element.style.height).toBe("fit-content");
    expect(element.style.minWidth).toBe("0px");
    expect(element.style.minHeight).toBe("0px");
  });
});
