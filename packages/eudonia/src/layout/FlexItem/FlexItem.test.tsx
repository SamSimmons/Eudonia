import "@/test/register-dom";

import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import { FlexItem } from "./FlexItem";

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

describe("FlexItem", () => {
  test("defaults to a normal shrinking flex item", () => {
    const { getByTestId } = render(<FlexItem data-testid="item" />);

    const element = getByTestId("item");

    expect(element.style.flexGrow).toBe("0");
    expect(element.style.flexShrink).toBe("1");
    expect(element.style.flexBasis).toBe("auto");
    expect(element.style.minWidth).toBe("0px");
    expect(element.style.minHeight).toBe("0px");
  });

  test("uses basis as a fixed rail size when grow is not enabled", () => {
    const { getByTestId } = render(
      <FlexItem
        basis={240}
        data-testid="item"
        style={{
          flexBasis: "10px",
          flexGrow: 7,
          flexShrink: 1,
          minHeight: "100px",
          minWidth: "100px",
        }}
      />,
    );

    const element = getByTestId("item");

    expect(element.style.flexGrow).toBe("0");
    expect(element.style.flexShrink).toBe("0");
    expect(element.style.flexBasis).toBe("240px");
    expect(element.style.minWidth).toBe("0px");
    expect(element.style.minHeight).toBe("0px");
  });

  test("grows from zero basis by default", () => {
    const { getByTestId } = render(<FlexItem data-testid="item" grow />);

    const element = getByTestId("item");

    expect(element.style.flexGrow).toBe("1");
    expect(element.style.flexShrink).toBe("1");
    expect(element.style.flexBasis).toBe("0px");
  });

  test("grows from an explicit basis when provided", () => {
    const { getByTestId } = render(
      <FlexItem basis="30%" data-testid="item" grow />,
    );

    const element = getByTestId("item");

    expect(element.style.flexGrow).toBe("1");
    expect(element.style.flexShrink).toBe("1");
    expect(element.style.flexBasis).toBe("30%");
  });
});
