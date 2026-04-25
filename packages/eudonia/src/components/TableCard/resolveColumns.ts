import type { ReactNode } from "react";

import { sniffNumericColumn } from "./extract";
import { resolveFormatter } from "./format";
import { humanizeKey } from "./humanize";
import type { ColumnSpec, ResolvedColumn } from "./types";

export function resolveColumns<T extends Record<string, unknown>>(
  data: readonly T[],
  specs: readonly ColumnSpec<T>[] | undefined,
): ResolvedColumn<T>[] {
  const sample = data[0];
  const declared: ColumnSpec<T>[] =
    specs !== undefined
      ? [...specs]
      : sample === undefined
        ? []
        // Object.keys returns string[]; T extends Record<string, unknown> so
        // every runtime key is also a keyof T & string.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        : (Object.keys(sample) as (keyof T & string)[]).map((key) => ({ key }));

  return declared.map((spec) => {
    const values = data.map((row) => row[spec.key]);
    const sniffed = sniffNumericColumn(values);
    const isNumeric = spec.numeric ?? sniffed;
    const align = spec.align ?? (isNumeric ? "right" : "left");
    // The public per-key render gets widened to `(unknown, T) => ReactNode`
    // for storage; the runtime value is the per-key value, so the underlying
    // function still receives what it expects.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const render = spec.render as ((value: unknown, row: T) => ReactNode) | undefined;
    return {
      key: spec.key,
      label: spec.label ?? humanizeKey(spec.key),
      align,
      isNumeric,
      formatter: resolveFormatter(spec.format),
      signal: spec.signal,
      sortable: spec.sortable ?? true,
      defaultSort: spec.defaultSort,
      render,
    };
  });
}
