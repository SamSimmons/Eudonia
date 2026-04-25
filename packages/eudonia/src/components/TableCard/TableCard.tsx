import {
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type Row,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { Card } from "../Card/Card";

import { CaretIcon } from "./CaretIcon";
import { fitForColumn, trackForColumn } from "./columnLayout";
import { extractNumber, isPlaceholder } from "./extract";
import { renderValue } from "./renderValue";
import { resolveColumns } from "./resolveColumns";
import { resolveFooterCells } from "./resolveFooter";
import { resolveSignal } from "./resolveSignal";
import styles from "./TableCard.module.css";
import type { TableCardProps } from "./types";

export function TableCard<T extends Record<string, unknown>>({
  title,
  subtitle,
  data,
  columns: columnSpecs,
  footer,
  emptyMessage = "No data",
  columnLayout = "stretch-first",
  className = "",
  ...props
}: TableCardProps<T>) {
  const resolvedColumns = useMemo(
    () => resolveColumns(data, columnSpecs),
    [data, columnSpecs],
  );

  const stretchIndex = useMemo(() => {
    if (columnLayout !== "stretch-first") return -1;
    return resolvedColumns.findIndex((c) => c.align === "left");
  }, [columnLayout, resolvedColumns]);

  const gridTemplateColumns = useMemo(
    () =>
      resolvedColumns.map((_, i) => trackForColumn(columnLayout, i, stretchIndex)).join(" "),
    [resolvedColumns, columnLayout, stretchIndex],
  );

  const columnSignature = useMemo(
    () => resolvedColumns.map((c) => `${c.key}:${c.defaultSort ?? ""}`).join("|"),
    [resolvedColumns],
  );

  const initialSorting = useMemo<SortingState>(() => {
    for (const col of resolvedColumns) {
      if (col.defaultSort) return [{ id: col.key, desc: col.defaultSort === "desc" }];
    }
    return [];
  }, [resolvedColumns]);

  // React-recommended pattern for resetting state when a prop derivation
  // changes: store the signature alongside the state and reset in render when
  // it diverges. Avoids the stale-sort bug where swapping columns leaves an
  // entry whose `id` no longer exists, and avoids an effect.
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [sortingSig, setSortingSig] = useState(columnSignature);
  if (sortingSig !== columnSignature) {
    setSortingSig(columnSignature);
    setSorting(initialSorting);
  }

  const tanstackColumns = useMemo<ColumnDef<T>[]>(() => {
    return resolvedColumns.map((col) => ({
      id: col.key,
      accessorKey: col.key,
      enableSorting: col.sortable,
      // Numeric columns default desc-first (high-to-low matches "show me the
      // biggest" expectation); text columns default asc-first (alphabetical).
      sortDescFirst: col.isNumeric,
      sortingFn: col.isNumeric
        ? (a: Row<T>, b: Row<T>, id: string) => {
            const av = extractNumber(a.getValue(id));
            const bv = extractNumber(b.getValue(id));
            if (av === null && bv === null) return 0;
            if (av === null) return -1;
            if (bv === null) return 1;
            return av - bv;
          }
        : "alphanumeric",
    }));
  }, [resolvedColumns]);

  // TanStack Table types `data` as a mutable array; we hand it readonly. The
  // hook does not mutate. Same pattern as Line.tsx around visx.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const tableData = data as T[];
  // TanStack Table's useReactTable returns functions React Compiler can't
  // safely memoize; we rely on its internal stability instead.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tableData,
    columns: tanstackColumns,
    state: { sorting },
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table.getRowModel().rows;
  const sortedData = useMemo(() => rows.map((r) => r.original), [rows]);
  const footerCells = useMemo(
    () => resolveFooterCells(resolvedColumns, sortedData, footer),
    [resolvedColumns, sortedData, footer],
  );

  return (
    <Card {...props} className={className}>
      {title !== undefined ? <Card.Title>{title}</Card.Title> : null}
      {subtitle !== undefined ? <Card.SubTitle>{subtitle}</Card.SubTitle> : null}
      <div className={styles.scroll}>
        <div
          role="table"
          className={styles.table}
          data-layout={columnLayout}
          style={{ gridTemplateColumns }}
        >
          <div role="rowgroup" className={styles.head} data-section="head">
            <div role="row" className={styles.tr}>
              {table.getHeaderGroups()[0]?.headers.map((header, index) => {
                const col = resolvedColumns.find((c) => c.key === header.column.id);
                if (!col) return null;
                const fit = fitForColumn(columnLayout, index, stretchIndex);
                const sortDir = header.column.getIsSorted();
                // Sort affordance lives on the columnheader itself so the
                // interactive element matches the aria-sort target. The inner
                // span is purely presentational.
                const sortHandlers = col.sortable
                  ? {
                      tabIndex: 0,
                      onClick: header.column.getToggleSortingHandler(),
                      onKeyDown: (e: React.KeyboardEvent) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          header.column.toggleSorting();
                        }
                      },
                    }
                  : {};
                return (
                  <div
                    key={header.id}
                    role="columnheader"
                    className={`${styles.th} ${col.align === "right" ? styles.right : styles.left} ${col.sortable ? styles.sortable : ""}`}
                    data-align={col.align}
                    data-fit={fit}
                    data-sortable={col.sortable ? "true" : undefined}
                    aria-sort={
                      sortDir === "asc" ? "ascending" : sortDir === "desc" ? "descending" : "none"
                    }
                    {...sortHandlers}
                  >
                    <span className={styles.headerInner}>
                      <span>{col.label}</span>
                      {col.sortable ? (
                        <span className={styles.sortIcon} aria-hidden="true">
                          {sortDir ? (
                            <CaretIcon
                              variant="current"
                              className={styles.sortIconCurrent}
                              direction={sortDir === "desc" ? "down" : "up"}
                            />
                          ) : null}
                          <CaretIcon
                            variant="preview"
                            className={styles.sortIconPreview}
                            direction={sortDir === "desc" ? "up" : "down"}
                          />
                        </span>
                      ) : null}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div role="rowgroup" className={styles.body} data-section="body">
            {rows.length === 0 ? (
              // Render one cell per column so the empty row's ARIA shape
              // matches data rows. The first cell carries the visible message
              // and spans all columns via .empty; the rest collapse to zero
              // height but remain in the accessibility tree.
              <div role="row" className={styles.tr}>
                {resolvedColumns.length === 0 ? (
                  <div role="cell" className={styles.empty}>
                    {emptyMessage}
                  </div>
                ) : (
                  resolvedColumns.map((col, i) => (
                    <div
                      key={col.key}
                      role="cell"
                      className={i === 0 ? styles.empty : styles.emptyPlaceholder}
                    >
                      {i === 0 ? emptyMessage : null}
                    </div>
                  ))
                )}
              </div>
            ) : (
              rows.map((row) => (
                <div role="row" key={row.id} className={styles.tr}>
                  {resolvedColumns.map((col, index) => {
                    const raw = row.original[col.key];
                    const numeric = col.isNumeric && !isPlaceholder(raw) ? extractNumber(raw) : null;
                    const signal =
                      col.signal && numeric !== null
                        ? resolveSignal(col.signal, numeric, row.original)
                        : undefined;
                    const content = col.render
                      ? col.render(raw, row.original)
                      : renderValue(raw, col.formatter);
                    const fit = fitForColumn(columnLayout, index, stretchIndex);
                    return (
                      <div
                        key={col.key}
                        role="cell"
                        className={[
                          styles.td,
                          col.align === "right" ? styles.right : styles.left,
                          signal === "positive" ? styles.positive : "",
                          signal === "negative" ? styles.negative : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        data-align={col.align}
                        data-fit={fit}
                        data-signal={signal}
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
          {footerCells ? (
            <div role="rowgroup" className={styles.foot} data-section="foot">
              <div role="row" className={styles.tr}>
                {resolvedColumns.map((col, i) => {
                  const fit = fitForColumn(columnLayout, i, stretchIndex);
                  return (
                    <div
                      key={col.key}
                      role="cell"
                      className={`${styles.tf} ${col.align === "right" ? styles.right : styles.left}`}
                      data-align={col.align}
                      data-fit={fit}
                    >
                      {footerCells[i]}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
