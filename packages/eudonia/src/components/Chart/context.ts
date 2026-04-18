import { createContext, useContext } from "react";

import type { XScale, YScale } from "./scales";

export type ChartDatum = Record<string, unknown>;

export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartContextValue {
  data: readonly ChartDatum[];
  xKey: string;
  xScale: XScale;
  yScale: YScale;
  innerWidth: number;
  innerHeight: number;
}

export const ChartContext = createContext<ChartContextValue | null>(null);

export function useChart(): ChartContextValue {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used inside <Chart>");
  return ctx;
}
