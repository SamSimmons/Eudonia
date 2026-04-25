import { extractNumber } from "./extract";
import type { Signal, SignalSpec } from "./types";

export function resolveSignal<T>(spec: SignalSpec<T>, value: number, row: T): Signal {
  if (spec === "delta") {
    if (value > 0) return "positive";
    if (value < 0) return "negative";
    return "neutral";
  }
  if (typeof spec === "function") return spec(value, row);
  const baseline = extractNumber(row[spec.baselineKey]);
  if (baseline === null) return "neutral";
  if (value > baseline) return "positive";
  if (value < baseline) return "negative";
  return "neutral";
}
