import type { TreemapConfig } from "../Treemap/types";

import type {
  ChartMargin,
  MarkRegistration,
  XAxisConfig,
  YAxisConfig,
} from "./state-types";

export function shallowEqualMargin(a: ChartMargin, b: ChartMargin): boolean {
  return a.top === b.top && a.right === b.right && a.bottom === b.bottom && a.left === b.left;
}

export function sameStringList(
  a: readonly string[] | undefined,
  b: readonly string[] | undefined,
): boolean {
  if (a === b) return true;
  if (a === undefined || b === undefined) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

export function shallowEqualYDomain(
  a: readonly [number, number] | undefined,
  b: readonly [number, number] | undefined,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return a[0] === b[0] && a[1] === b[1];
}

export function shallowEqualMark(a: MarkRegistration, b: MarkRegistration): boolean {
  if (a.categoricalPreference !== b.categoricalPreference) return false;
  if (a.includeZero !== b.includeZero) return false;
  return sameDataKey(a.dataKey, b.dataKey);
}

function sameDataKey(
  a: string | readonly string[] | undefined,
  b: string | readonly string[] | undefined,
): boolean {
  if (a === b) return true;
  if (a === undefined || b === undefined) return false;
  if (typeof a === "string" || typeof b === "string") return a === b;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

export function shallowEqualXAxisConfig(a: XAxisConfig, b: XAxisConfig): boolean {
  return (
    a.density === b.density &&
    a.preserve === b.preserve &&
    a.anchorLabelsToEdges === b.anchorLabelsToEdges &&
    a.preferredTickCount === b.preferredTickCount &&
    a.tickFormat === b.tickFormat
  );
}

export function shallowEqualYAxisConfig(a: YAxisConfig, b: YAxisConfig): boolean {
  return (
    a.density === b.density &&
    a.preferredTickCount === b.preferredTickCount &&
    a.tickFormat === b.tickFormat
  );
}

export function shallowEqualTreemapConfig(a: TreemapConfig, b: TreemapConfig): boolean {
  return (
    a.tile === b.tile &&
    a.renderBranches === b.renderBranches &&
    a.padding.inner === b.padding.inner &&
    a.padding.outer === b.padding.outer &&
    a.padding.top === b.padding.top
  );
}
