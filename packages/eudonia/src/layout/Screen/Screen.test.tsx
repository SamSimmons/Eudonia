import "@/test/register-dom";

import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import { Screen } from "./Screen";

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

describe("Screen", () => {
  test("renders children and merges className", () => {
    const { getByTestId, getByText } = render(
      <Screen className="custom-screen" data-testid="screen">
        Content
      </Screen>,
    );

    const element = getByTestId("screen");

    expect(getByText("Content")).toBeTruthy();
    expect(element.className).toBe("eudonia-screen custom-screen");
  });

  test("forwards native div props and preserves required root styles", () => {
    const { getByRole, getByTestId } = render(
      <Screen
        aria-label="Executive scorecard"
        data-region="north"
        data-testid="screen"
        id="dashboard"
        role="main"
        style={{
          backgroundColor: "red",
          overflow: "visible",
          width: "50%",
        }}
      />,
    );

    const element = getByRole("main", { name: "Executive scorecard" });

    expect(element.id).toBe("dashboard");
    expect(element.getAttribute("data-region")).toBe("north");
    expect(element).toBe(getByTestId("screen"));
    expect(element.style.backgroundColor).toBe("red");
    expect(element.style.width).toBe("100%");
    expect(element.style.overflow).toBe("hidden");
  });

  test("injects the viewport height stylesheet", () => {
    render(<Screen />);

    const styleElement = document.head.querySelector('style[data-href="eudonia-screen"]');

    expect(styleElement).toBeTruthy();
    expect(styleElement?.textContent).toBe(
      ".eudonia-screen{height:100vh;height:100dvh}",
    );
  });
});
