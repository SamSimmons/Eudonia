import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { FormatSpec } from "./format";

export type Signal = "positive" | "negative" | "neutral";

export type SignalSpec<T> =
  | "delta"
  | { baselineKey: keyof T & string }
  | ((value: number, row: T) => Signal);

export type AggKind = "sum" | "avg" | "min" | "max" | "count";

// Aggregation requests are always wrapped: `{ agg: "sum" }`. Plain strings in a
// footer object always render as literals — no overlap, no surprises.
export interface FooterAggregation {
  agg: AggKind;
}

export type FooterCell<T> = ReactNode | FooterAggregation | ((rows: readonly T[]) => ReactNode);

interface ColumnSpecBase<T> {
  label?: ReactNode;
  align?: "left" | "right";
  // Drives sort comparator, signal evaluation, and footer aggregation. Defaults
  // to a sniff of the column's values. Independent of `align`, which is purely
  // visual — set `numeric` explicitly when a string column should sort/sum
  // numerically, or when a numeric column should be treated as a label.
  numeric?: boolean;
  format?: FormatSpec;
  signal?: SignalSpec<T>;
  sortable?: boolean;
  defaultSort?: "asc" | "desc";
}

interface ColumnSpecForKey<T, K extends keyof T & string> extends ColumnSpecBase<T> {
  key: K;
  render?: (value: T[K], row: T) => ReactNode;
}

// Distributed over each `keyof T & string` so `render`'s `value` parameter
// reflects the type of the chosen key, not the union of all column types.
export type ColumnSpec<T> = {
  [K in keyof T & string]: ColumnSpecForKey<T, K>;
}[keyof T & string];

export type FooterProp<T> = string | { [K in keyof T]?: FooterCell<T> };

export type ColumnLayout = "stretch-first" | "content" | "equal";

type DivProps = ComponentPropsWithoutRef<"div">;

export interface TableCardProps<T extends Record<string, unknown>>
  extends Omit<DivProps, "title" | "children"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  data: readonly T[];
  columns?: readonly ColumnSpec<T>[];
  footer?: FooterProp<T>;
  emptyMessage?: ReactNode;
  columnLayout?: ColumnLayout;
}

export interface ResolvedColumn<T> {
  key: keyof T & string;
  label: ReactNode;
  align: "left" | "right";
  isNumeric: boolean;
  formatter: ((value: number) => string) | null;
  signal?: SignalSpec<T>;
  sortable: boolean;
  defaultSort?: "asc" | "desc";
  // Looser than the public spec: a column's render is declared per-key in the
  // ColumnSpec union, but at the call site we only know `keyof T & string`.
  // Coerced once when the spec is resolved; the runtime value at row[key]
  // already matches the per-key signature, so this is safe.
  render?: (value: unknown, row: T) => ReactNode;
}
