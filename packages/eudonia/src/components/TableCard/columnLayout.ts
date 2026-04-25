import type { ColumnLayout } from "./types";

export function trackForColumn(
  columnLayout: ColumnLayout,
  index: number,
  stretchIndex: number,
): string {
  if (columnLayout === "equal") return "minmax(0, 1fr)";
  if (columnLayout === "content") return "auto";
  return index === stretchIndex ? "1fr" : "auto";
}

export function fitForColumn(
  columnLayout: ColumnLayout,
  index: number,
  stretchIndex: number,
): "stretch" | "shrink" | undefined {
  if (columnLayout === "equal") return undefined;
  return index === stretchIndex ? "stretch" : "shrink";
}
