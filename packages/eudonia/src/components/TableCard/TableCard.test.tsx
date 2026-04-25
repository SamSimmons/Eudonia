import "@/test/register-dom";

import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";

import { extractNumber, isPlaceholder, looksNumeric, sniffNumericColumn } from "./extract";
import { resolveFormatter } from "./format";
import { humanizeKey } from "./humanize";
import { TableCard } from "./TableCard";

afterEach(() => {
  cleanup();
});

describe("extract", () => {
  test("recognises numeric strings with currency, commas, percent", () => {
    expect(looksNumeric("$7,362,616")).toBe(true);
    expect(looksNumeric("-1.3%")).toBe(true);
    expect(looksNumeric("288.1%")).toBe(true);
    expect(looksNumeric(7362616)).toBe(true);
    expect(looksNumeric("Droga")).toBe(false);
  });

  test("treats common no-value strings as placeholders", () => {
    for (const v of ["", "-", "—", "–", "--", "N/A", "NA", "n/a", "?", null, undefined]) {
      expect(isPlaceholder(v)).toBe(true);
    }
    expect(isPlaceholder("Droga")).toBe(false);
  });

  test("extractNumber strips currency/percent/commas", () => {
    expect(extractNumber("$7,362,616")).toBe(7362616);
    expect(extractNumber("-1.3%")).toBe(-1.3);
    expect(extractNumber(42)).toBe(42);
    expect(extractNumber("-")).toBe(null);
    expect(extractNumber("Droga")).toBe(null);
  });

  test("sniffNumericColumn skips placeholders", () => {
    expect(sniffNumericColumn(["-", "-", "$1,000"])).toBe(true);
    expect(sniffNumericColumn(["Droga", "Gladius"])).toBe(false);
  });
});

describe("format", () => {
  test("typed strings produce formatters", () => {
    expect(resolveFormatter("currency")?.(1000)).toBe("$1,000");
    expect(resolveFormatter("currency")?.(120834182)).toBe("$120,834,182");
    expect(resolveFormatter("currency-compact")?.(120834182)).toBe("$120.83M");
    expect(resolveFormatter("currency-compact")?.(78300)).toBe("$78.3K");
    expect(resolveFormatter("percent")?.(12.5)).toBe("12.5%");
    expect(resolveFormatter("compact")?.(1500000)).toBe("1.5M");
    expect(resolveFormatter("number")?.(1234)).toBe("1,234");
    expect(resolveFormatter(undefined)).toBe(null);
  });

  test("function passes through", () => {
    const f = resolveFormatter((v: number) => `~${v}`);
    expect(f?.(5)).toBe("~5");
  });
});

describe("humanize", () => {
  test("camelCase, snake_case, kebab-case", () => {
    expect(humanizeKey("totalRevenue")).toBe("Total Revenue");
    expect(humanizeKey("yoyRevGrowth")).toBe("Yoy Rev Growth");
    expect(humanizeKey("total_revenue")).toBe("Total Revenue");
    expect(humanizeKey("total-revenue")).toBe("Total Revenue");
    expect(humanizeKey("product")).toBe("Product");
  });
});

describe("TableCard", () => {
  const ROWS = [
    { product: "Droga", revenue: "$7,362,616", growth: "-1.3%" },
    { product: "Gladius", revenue: "$90,906,436", growth: "288.1%" },
    { product: "Primus", revenue: "$120,834,182", growth: "369.7%" },
  ];

  test("auto-derives columns and renders all rows", () => {
    const { container, getByText } = render(<TableCard data={ROWS} />);
    expect(getByText("Product")).not.toBeNull();
    expect(getByText("Revenue")).not.toBeNull();
    expect(getByText("Growth")).not.toBeNull();
    expect(getByText("Droga")).not.toBeNull();
    expect(
      container.querySelectorAll('[data-section="body"] [role="row"]').length,
    ).toBe(3);
  });

  test("right-aligns sniffed numeric columns and left-aligns text", () => {
    const { container } = render(<TableCard data={ROWS} />);
    const headers = container.querySelectorAll('[role="columnheader"]');
    expect(headers[0]?.getAttribute("data-align")).toBe("left");
    expect(headers[1]?.getAttribute("data-align")).toBe("right");
    expect(headers[2]?.getAttribute("data-align")).toBe("right");
  });

  test("renders an empty message when data is empty", () => {
    const { getByText } = render(<TableCard data={[]} emptyMessage="Nothing here" />);
    expect(getByText("Nothing here")).not.toBeNull();
  });

  test("first click on a sortable header sorts desc, second click toggles to asc", () => {
    const { container } = render(<TableCard data={ROWS} />);
    const revenueHeader = container.querySelectorAll('[role="columnheader"]')[1];
    expect(revenueHeader).not.toBeNull();
    fireEvent.click(revenueHeader!);
    const firstCellDesc = container
      .querySelectorAll('[data-section="body"] [role="row"]')[0]
      ?.querySelectorAll('[role="cell"]')[0]?.textContent;
    expect(firstCellDesc).toBe("Primus");
    fireEvent.click(revenueHeader!);
    const firstCellAsc = container
      .querySelectorAll('[data-section="body"] [role="row"]')[0]
      ?.querySelectorAll('[role="cell"]')[0]?.textContent;
    expect(firstCellAsc).toBe("Droga");
  });

  test("signal delta applies positive/negative classes", () => {
    const { container } = render(
      <TableCard
        data={ROWS}
        columns={[
          { key: "product" },
          { key: "revenue" },
          { key: "growth", signal: "delta" },
        ]}
      />,
    );
    const growthCells = Array.from(
      container.querySelectorAll('[data-section="body"] [role="row"]'),
    ).map((r) =>
      r.querySelectorAll('[role="cell"]')[2]?.getAttribute("data-signal"),
    );
    expect(growthCells[0]).toBe("negative");
    expect(growthCells[1]).toBe("positive");
    expect(growthCells[2]).toBe("positive");
  });

  test("signal with baselineKey compares against another column", () => {
    const data = [
      { name: "A", actual: 50, target: 100 },
      { name: "B", actual: 120, target: 100 },
    ];
    const { container } = render(
      <TableCard
        data={data}
        columns={[
          { key: "name" },
          { key: "actual", signal: { baselineKey: "target" } },
          { key: "target" },
        ]}
      />,
    );
    const actualCells = Array.from(
      container.querySelectorAll('[data-section="body"] [role="row"]'),
    ).map((r) =>
      r.querySelectorAll('[role="cell"]')[1]?.getAttribute("data-signal"),
    );
    expect(actualCells[0]).toBe("negative");
    expect(actualCells[1]).toBe("positive");
  });

  test("footer string shorthand auto-sums numeric columns", () => {
    const data = [
      { name: "A", count: 1 },
      { name: "B", count: 2 },
      { name: "C", count: 3 },
    ];
    const { container, getByText } = render(<TableCard data={data} footer="Total" />);
    expect(getByText("Total")).not.toBeNull();
    const footerCells = container.querySelectorAll('[data-section="foot"] [role="cell"]');
    expect(footerCells[1]?.textContent).toBe("6");
  });

  test("footer object accepts literals, aggregations, and functions", () => {
    const { container, getByText } = render(
      <TableCard
        data={ROWS}
        columns={[
          { key: "product" },
          { key: "revenue", format: "currency" },
          { key: "growth" },
        ]}
        footer={{
          product: "Grand Total",
          revenue: { agg: "sum" },
          growth: (rows) => `count: ${rows.length}`,
        }}
      />,
    );
    expect(getByText("Grand Total")).not.toBeNull();
    expect(getByText("count: 3")).not.toBeNull();
    const footerCells = container.querySelectorAll('[data-section="foot"] [role="cell"]');
    expect(footerCells[1]?.textContent).toBe("$219,103,234");
  });

  test("render escape hatch replaces cell content but keeps alignment from sniff", () => {
    const { container } = render(
      <TableCard
        data={ROWS}
        columns={[
          { key: "product" },
          { key: "revenue", render: (_, row) => <strong>{String(row.product)}</strong> },
          { key: "growth" },
        ]}
      />,
    );
    expect(
      container.querySelectorAll('[data-section="body"] [role="cell"] strong').length,
    ).toBe(3);
  });

  test("title and subtitle render via Card composition", () => {
    const { getByText } = render(
      <TableCard data={ROWS} title="Year over Year" subtitle="By Product" />,
    );
    expect(getByText("Year over Year")).not.toBeNull();
    expect(getByText("By Product")).not.toBeNull();
  });

  test("default columnLayout marks first left-aligned column as stretch and others as shrink", () => {
    const { container } = render(<TableCard data={ROWS} />);
    const headers = container.querySelectorAll('[role="columnheader"]');
    expect(headers[0]?.getAttribute("data-fit")).toBe("stretch");
    expect(headers[1]?.getAttribute("data-fit")).toBe("shrink");
    expect(headers[2]?.getAttribute("data-fit")).toBe("shrink");
    const table = container.querySelector('[role="table"]');
    expect(table?.getAttribute("data-layout")).toBe("stretch-first");
  });

  test("columnLayout=content marks every column as shrink", () => {
    const { container } = render(<TableCard data={ROWS} columnLayout="content" />);
    const headers = container.querySelectorAll('[role="columnheader"]');
    expect(headers[0]?.getAttribute("data-fit")).toBe("shrink");
    expect(headers[1]?.getAttribute("data-fit")).toBe("shrink");
    expect(headers[2]?.getAttribute("data-fit")).toBe("shrink");
  });

  test("columnLayout=equal removes data-fit from cells", () => {
    const { container } = render(<TableCard data={ROWS} columnLayout="equal" />);
    const headers = container.querySelectorAll('[role="columnheader"]');
    expect(headers[0]?.getAttribute("data-fit")).toBe(null);
    expect(headers[1]?.getAttribute("data-fit")).toBe(null);
    const table = container.querySelector('[role="table"]');
    expect(table?.getAttribute("data-layout")).toBe("equal");
  });

  test("renders preview caret on every sortable header and current caret only when sorted", () => {
    const { container } = render(
      <TableCard
        data={ROWS}
        columns={[
          { key: "product" },
          { key: "revenue", defaultSort: "desc" },
          { key: "growth" },
        ]}
      />,
    );
    const headers = container.querySelectorAll('[role="columnheader"]');
    const previews = container.querySelectorAll('[data-sort-icon="preview"]');
    const currents = container.querySelectorAll('[data-sort-icon="current"]');
    expect(headers.length).toBe(3);
    expect(previews.length).toBe(3);
    expect(currents.length).toBe(1);
    expect(headers[1]?.contains(currents[0]!)).toBe(true);
  });

  test("sortable false disables click handler", () => {
    const { container } = render(
      <TableCard data={ROWS} columns={[{ key: "product", sortable: false }, { key: "revenue" }]} />,
    );
    const productHeader = container.querySelectorAll('[role="columnheader"]')[0];
    expect(productHeader?.getAttribute("data-sortable")).toBe(null);
  });
});
