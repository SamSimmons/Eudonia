import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

import styles from "./Chart.module.css";
import { ChartSurface } from "./ChartSurface";
import type { ChartData } from "./dataShape";
import type { ScaleKind } from "./scales";
import type { ChartMargin } from "./state-types";
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
  margin?: Partial<ChartMargin>;
  width?: number;
  height?: number;
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
  margin,
  width,
  height,
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
    store.getState().setAuthoredConfig({ xKey, xType, yKey, yType, yKeys, yDomain });
  }, [store, xKey, xType, yKey, yType, yKeys, yDomain]);

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

  const rootStyle = {
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
