import type { ReactNode } from "react";

import { extractNumber, isPlaceholder } from "./extract";
import type {
  AggKind,
  FooterAggregation,
  FooterCell,
  FooterProp,
  ResolvedColumn,
} from "./types";

export function aggregate(kind: AggKind, values: readonly unknown[]): number | null {
  // `count` is row-level: it counts non-placeholder entries regardless of
  // whether they're numeric, so `{ agg: "count" }` works on label columns too.
  if (kind === "count") {
    let n = 0;
    for (const v of values) if (!isPlaceholder(v)) n += 1;
    return n;
  }
  const nums: number[] = [];
  for (const v of values) {
    const n = extractNumber(v);
    if (n !== null) nums.push(n);
  }
  if (nums.length === 0) return null;
  switch (kind) {
    case "sum":
      return nums.reduce((a, b) => a + b, 0);
    case "avg":
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    case "min":
      return Math.min(...nums);
    case "max":
      return Math.max(...nums);
  }
}

function isFooterAggregation(value: unknown): value is FooterAggregation {
  return (
    typeof value === "object" &&
    value !== null &&
    "agg" in value &&
    typeof value.agg === "string"
  );
}

export function resolveFooterCells<T extends Record<string, unknown>>(
  columns: readonly ResolvedColumn<T>[],
  rows: readonly T[],
  footer: FooterProp<T> | undefined,
): ReactNode[] | null {
  if (footer === undefined) return null;

  if (typeof footer === "string") {
    // Place the label on the first non-numeric column when one exists; for
    // all-numeric tables fall back to column 0 so the label is never dropped.
    const labelIndex = (() => {
      const firstText = columns.findIndex((c) => !c.isNumeric);
      return firstText === -1 ? 0 : firstText;
    })();
    return columns.map((col, i) => {
      if (i === labelIndex) return footer;
      if (!col.isNumeric) return null;
      const values = rows.map((r) => r[col.key]);
      const total = aggregate("sum", values);
      if (total === null) return null;
      return col.formatter ? col.formatter(total) : total.toLocaleString();
    });
  }

  return columns.map((col) => {
    const cell: FooterCell<T> | undefined = footer[col.key];
    if (cell === undefined) return null;
    if (typeof cell === "function") return cell(rows);
    if (isFooterAggregation(cell)) {
      const values = rows.map((r) => r[col.key]);
      const result = aggregate(cell.agg, values);
      if (result === null) return null;
      // `count` returns a raw row count — the column's value formatter would
      // give the wrong shape (e.g. "$3" for currency), so format counts as a
      // plain integer.
      if (cell.agg === "count") return result.toLocaleString();
      return col.formatter ? col.formatter(result) : result.toLocaleString();
    }
    return cell;
  });
}
