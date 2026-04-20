import type { CategoricalScalePreference, ChartDatum } from "./store";
import type { ChartXType } from "./scales";

export function inferXKey(data: readonly ChartDatum[]): string {
  if (data.length === 0) return "x";
  const first = data[0]!;
  for (const [k, v] of Object.entries(first)) {
    if (typeof v === "string" || v instanceof Date) return k;
  }
  return Object.keys(first)[0] ?? "x";
}

export function inferYKeys(
  data: readonly ChartDatum[],
  xKey: string,
): string[] {
  if (data.length === 0) return [];
  return Object.entries(data[0]!)
    .filter(([k, v]) => k !== xKey && typeof v === "number")
    .map(([k]) => k);
}

// Categorical (string) x resolves to band or point based on what marks want.
// Default is `point` so the first and last category sit at the chart edges —
// bars/heatmap-rects opt in to `band` via registration since they need a width.
export function inferXType(
  data: readonly ChartDatum[],
  xKey: string,
  categoricalPreference: CategoricalScalePreference,
): ChartXType {
  if (data.length === 0) return "linear";
  const first = data[0]![xKey];
  if (first instanceof Date) return "time";
  if (typeof first === "string") return categoricalPreference;
  return "linear";
}
