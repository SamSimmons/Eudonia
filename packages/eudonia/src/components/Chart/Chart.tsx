import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";

import { resolvePalette } from "@/color/resolvePalette";
import type { PaletteProp } from "@/color/types";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

import styles from "./Chart.module.css";
import { ChartSurface } from "./ChartSurface";
import type { ChartData } from "./dataShape";
import type { ScaleKind } from "./scales";
import type { BandPadding, ChartMargin, PaddingValue } from "./state-types";
import { ChartStoreContext, createChartStore } from "./store";

type DivProps = ComponentPropsWithoutRef<"div">;

export interface ChartProps extends Omit<DivProps, "children"> {
  data: ChartData;
  xKey?: string;
  yKey?: string;
  yKeys?: readonly string[];
  yDomain?: readonly [number, number];
  xType?: ScaleKind;
  yType?: ScaleKind;
  // Paddings on whichever axis is `band`. `inner` is the gap between
  // categories; `outer` is the gap at each end of the range. Accepts a
  // percentage of the band step (`"10%"`) or pixels (raw number or `"8px"`).
  // Defaults: inner 10% of step, outer 5% of step. Ignored when neither axis
  // is band.
  bandPadding?: BandPadding;
  // Padding between grouped bars within a single category (sub-band inner
  // padding). Accepts a percentage or pixels (same shape as `bandPadding`).
  // Default 10% of the sub-band step. No effect on stacks or non-bar marks.
  barGroupPadding?: PaddingValue;
  margin?: Partial<ChartMargin>;
  width?: number;
  height?: number;
  // Palette override for this chart's subtree. Resolves to CSS vars on the
  // root element so descendants pick the palette up via theme tokens.
  palette?: PaletteProp;
  children?: ReactNode;
}

const DEFAULT_MARGIN: ChartMargin = { top: 0, right: 0, bottom: 0, left: 0 };

export function Chart({
  data,
  xKey,
  yKey,
  yKeys,
  yDomain,
  xType,
  yType,
  bandPadding,
  barGroupPadding,
  margin,
  width,
  height,
  palette,
  children,
  className = "",
  style,
  ...props
}: ChartProps) {
  const resolvedMargin = useMemo<ChartMargin>(
    () => ({ ...DEFAULT_MARGIN, ...margin }),
    [margin],
  );

  // Lazy-init the store once per Chart instance. Subsequent prop changes are
  // synced in via the layout effects below.
  const [store] = useState(() =>
    createChartStore({
      data,
      xKey,
      xType,
      yKey,
      yType,
      yKeys,
      yDomain,
      bandPadding,
      barGroupPadding,
      margin: resolvedMargin,
      width: width ?? 0,
      height: height ?? 0,
    }),
  );

  useIsomorphicLayoutEffect(() => {
    store.getState().setData(data);
  }, [store, data]);

  useIsomorphicLayoutEffect(() => {
    store.getState().setMargin(resolvedMargin);
  }, [store, resolvedMargin]);

  useIsomorphicLayoutEffect(() => {
    store.getState().setAuthoredConfig({
      xKey,
      xType,
      yKey,
      yType,
      yKeys,
      yDomain,
      bandPadding,
      barGroupPadding,
    });
  }, [store, xKey, xType, yKey, yType, yKeys, yDomain, bandPadding, barGroupPadding]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Measure the container and write size into the store. Explicit width/height
  // props short-circuit measurement entirely. Layout effect + getBoundingClientRect
  // runs before paint, so the first mount already has a real size for scales.
  useIsomorphicLayoutEffect(() => {
    if (width !== undefined && height !== undefined) {
      store.getState().setSize(width, height);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      store.getState().setSize(width ?? rect.width, height ?? rect.height);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, [store, width, height]);

  const { style: paletteStyle } = resolvePalette(palette);
  // Palette spreads under the consumer's `style` so explicit inline tokens
  // (e.g. `style={{ "--eudonia-chart-cat-1": "red" }}`) win.
  const rootStyle = {
    ...paletteStyle,
    ...style,
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
  };

  return (
    <div {...props} ref={containerRef} className={`${styles.root} ${className}`} style={rootStyle}>
      <ChartStoreContext value={store}>
        <ChartSurface>{children}</ChartSurface>
      </ChartStoreContext>
    </div>
  );
}
