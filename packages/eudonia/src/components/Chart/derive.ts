import { computeXTicks, computeYTicks } from "./computeTicks";
import { inferXKey, inferXType, inferYKeys } from "./infer";
import { buildXScale, buildYScale, type XTickValue } from "./scales";
import type {
  CategoricalScalePreference,
  ChartDatum,
  ChartStateDerived,
  ChartStateInputs,
  MarkRegistration,
  XAxisConfig,
  YAxisConfig,
} from "./store";

export const X_AXIS_DEFAULTS: XAxisConfig = {
  density: "medium",
  preserve: "start",
  anchorLabelsToEdges: false,
  preferredTickCount: undefined,
  tickFormat: undefined,
};

export const Y_AXIS_DEFAULTS: YAxisConfig = {
  density: "medium",
  preferredTickCount: undefined,
  tickFormat: undefined,
};

// Incremental derivation: each derived slice is recomputed only when its
// inputs (by reference) change. Unchanged slices keep their previous object
// identity so subscribers selecting them don't re-render.
export function derive(
  prev: (ChartStateInputs & ChartStateDerived) | null,
  next: ChartStateInputs,
): ChartStateDerived {
  const resolvedXKey =
    prev && prev.data === next.data && prev.authoredXKey === next.authoredXKey
      ? prev.resolvedXKey
      : (next.authoredXKey ?? inferXKey(next.data));

  const xAxisConfig =
    prev && prev.xAxisRegistrations === next.xAxisRegistrations
      ? prev.xAxisConfig
      : effectiveAxisConfig(next.xAxisRegistrations, X_AXIS_DEFAULTS);

  const yAxisConfig =
    prev && prev.yAxisRegistrations === next.yAxisRegistrations
      ? prev.yAxisConfig
      : effectiveAxisConfig(next.yAxisRegistrations, Y_AXIS_DEFAULTS);

  const resolvedXType =
    prev &&
    prev.data === next.data &&
    prev.authoredXType === next.authoredXType &&
    prev.resolvedXKey === resolvedXKey &&
    prev.markRegistrations === next.markRegistrations
      ? prev.resolvedXType
      : (next.authoredXType ??
        inferXType(
          next.data,
          resolvedXKey,
          resolveCategoricalPreference(next.markRegistrations),
        ));

  const resolvedYKeys =
    prev &&
    prev.data === next.data &&
    prev.authoredYKeys === next.authoredYKeys &&
    prev.resolvedXKey === resolvedXKey &&
    prev.markRegistrations === next.markRegistrations
      ? prev.resolvedYKeys
      : resolveYKeys(next.data, resolvedXKey, next.authoredYKeys, next.markRegistrations);

  const innerWidth = Math.max(0, next.width - next.margin.left - next.margin.right);
  const innerHeight = Math.max(0, next.height - next.margin.top - next.margin.bottom);

  const xScale =
    prev &&
    prev.data === next.data &&
    prev.resolvedXKey === resolvedXKey &&
    prev.resolvedXType === resolvedXType &&
    prev.innerWidth === innerWidth
      ? prev.xScale
      : buildXScale(next.data, resolvedXKey, resolvedXType, innerWidth);

  const yScale =
    prev &&
    prev.data === next.data &&
    prev.resolvedYKeys === resolvedYKeys &&
    prev.yDomain === next.yDomain &&
    prev.innerHeight === innerHeight
      ? prev.yScale
      : buildYScale(next.data, resolvedYKeys, next.yDomain, innerHeight);

  const xTicks =
    prev &&
    prev.xScale === xScale &&
    prev.innerWidth === innerWidth &&
    prev.xAxisConfig === xAxisConfig
      ? prev.xTicks
      : computeXTicks(
          xScale,
          innerWidth,
          xAxisConfig.density,
          xAxisConfig.preserve,
          xAxisConfig.anchorLabelsToEdges,
          xAxisConfig.preferredTickCount,
          xAxisConfig.tickFormat ?? defaultXFormat,
        );

  const yTicks =
    prev &&
    prev.yScale === yScale &&
    prev.innerHeight === innerHeight &&
    prev.yAxisConfig === yAxisConfig
      ? prev.yTicks
      : computeYTicks(
          yScale,
          innerHeight,
          yAxisConfig.density,
          yAxisConfig.preferredTickCount,
          yAxisConfig.tickFormat ?? defaultYFormat,
        );

  return {
    resolvedXKey,
    resolvedXType,
    resolvedYKeys,
    innerWidth,
    innerHeight,
    xScale,
    yScale,
    xAxisConfig,
    yAxisConfig,
    xTicks,
    yTicks,
  };
}

function resolveCategoricalPreference(
  regs: ReadonlyMap<string, MarkRegistration>,
): CategoricalScalePreference {
  for (const r of regs.values()) {
    if (r.xCategoricalPreference === "band") return "band";
  }
  return "point";
}

function resolveYKeys(
  data: readonly ChartDatum[],
  xKey: string,
  authored: readonly string[] | undefined,
  regs: ReadonlyMap<string, MarkRegistration>,
): readonly string[] {
  if (authored) return authored;
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const r of regs.values()) {
    if (r.dataKey === undefined) continue;
    if (typeof r.dataKey === "string") {
      if (!seen.has(r.dataKey)) {
        seen.add(r.dataKey);
        ordered.push(r.dataKey);
      }
    } else {
      for (const k of r.dataKey) {
        if (!seen.has(k)) {
          seen.add(k);
          ordered.push(k);
        }
      }
    }
  }
  if (ordered.length > 0) return ordered;
  return inferYKeys(data, xKey);
}

// Last-registered wins. Two-axis use cases aren't realistic in v1; if the
// winner unmounts, the previous loser isn't restored (they'd have to re-
// register, which unmounting doesn't do) — acceptable tradeoff.
function effectiveAxisConfig<C>(regs: ReadonlyMap<string, C>, defaults: C): C {
  let last: C | undefined;
  for (const cfg of regs.values()) last = cfg;
  return last ?? defaults;
}

function defaultXFormat(v: XTickValue): string {
  if (v instanceof Date) return v.toLocaleDateString();
  return String(v);
}

function defaultYFormat(v: number): string {
  return String(v);
}
