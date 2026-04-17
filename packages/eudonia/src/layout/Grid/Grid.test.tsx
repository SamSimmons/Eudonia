import "@/test/register-dom";

import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import { Grid } from "./Grid";

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

describe("Grid", () => {
  test("defaults to a single fluid track grid that fills its container", () => {
    const { getByTestId } = render(<Grid data-testid="grid" />);

    const element = getByTestId("grid");

    expect(element.style.display).toBe("grid");
    expect(element.style.gridTemplateColumns).toBe("minmax(0px, 1fr)");
    expect(element.style.gridTemplateRows).toBe("");
    expect(element.style.gap).toBe("0px");
    expect(element.style.width).toBe("100%");
    expect(element.style.height).toBe("100%");
    expect(element.style.minWidth).toBe("0px");
    expect(element.style.minHeight).toBe("0px");
  });

  test("uses explicit width and height props over style width and height", () => {
    const { getByTestId } = render(
      <Grid
        columns={[240, "fluid", "30%"]}
        data-testid="grid"
        gap={24}
        height="auto"
        rows={[120, "fluid"]}
        style={{
          display: "block",
          gap: "2rem",
          height: "10px",
          gridTemplateColumns: "auto",
          gridTemplateRows: "auto",
          minHeight: "200px",
          minWidth: "200px",
          width: "10px",
        }}
        width="75%"
      />,
    );

    const element = getByTestId("grid");

    expect(element.style.display).toBe("grid");
    expect(element.style.gridTemplateColumns).toBe(
      "240px minmax(0px, 1fr) 30%",
    );
    expect(element.style.gridTemplateRows).toBe("120px minmax(0px, 1fr)");
    expect(element.style.gap).toBe("24px");
    expect(element.style.width).toBe("75%");
    expect(element.style.height).toBe("auto");
    expect(element.style.minWidth).toBe("0px");
    expect(element.style.minHeight).toBe("0px");
  });
});
