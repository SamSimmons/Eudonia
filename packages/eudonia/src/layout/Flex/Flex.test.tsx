import "@/test/register-dom";

import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import { Flex } from "./Flex";

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

describe("Flex", () => {
  test("defaults to a row flex container with no gap", () => {
    const { getByTestId } = render(<Flex data-testid="flex" />);

    const element = getByTestId("flex");

    expect(element.style.display).toBe("flex");
    expect(element.style.flexDirection).toBe("row");
    expect(element.style.gap).toBe("0px");
    expect(element.style.minWidth).toBe("0px");
    expect(element.style.minHeight).toBe("0px");
  });

  test("preserves required layout styles over conflicting user styles", () => {
    const { getByTestId } = render(
      <Flex
        data-testid="flex"
        direction="column"
        gap={24}
        style={{
          display: "block",
          flexDirection: "row",
          gap: "2rem",
          minHeight: "200px",
          minWidth: "200px",
        }}
      />,
    );

    const element = getByTestId("flex");

    expect(element.style.display).toBe("flex");
    expect(element.style.flexDirection).toBe("column");
    expect(element.style.gap).toBe("24px");
    expect(element.style.minWidth).toBe("0px");
    expect(element.style.minHeight).toBe("0px");
  });
});
