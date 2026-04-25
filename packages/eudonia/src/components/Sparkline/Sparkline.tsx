import { useId, type ComponentPropsWithoutRef } from "react";

import { Area } from "../Area/Area";
import { Chart } from "../Chart/Chart";
import type { ChartDatum } from "../Chart/dataShape";
import { paletteColor } from "../Chart/palette";
import type { ScaleKind } from "../Chart/scales";
import type { ChartMargin } from "../Chart/state-types";
import { Line } from "../Line/Line";

type DivProps = ComponentPropsWithoutRef<"div">;

export interface SparklineGradientFill {
  from?: string;
  to?: string;
  fromOpacity?: number;
  toOpacity?: number;
}

type SparklineFillConfig = true | string | SparklineGradientFill;
type SparklineFillValue = boolean | string | SparklineGradientFill;

interface SparklineBaseProps extends Omit<DivProps, "children"> {
  stroke?: string | readonly (string | undefined)[];
  strokeWidth?: number;
  fill?: SparklineFillValue | readonly (SparklineFillValue | undefined)[];
  xKey?: string;
  xType?: ScaleKind;
  yDomain?: readonly [number, number];
  margin?: Partial<ChartMargin>;
  width?: number;
  height?: number;
}

interface SparklineValuesProps extends SparklineBaseProps {
  values: readonly number[];
  data?: never;
  dataKey?: never;
}

interface SparklineDataProps extends SparklineBaseProps {
  data: readonly ChartDatum[];
  dataKey: string | readonly string[];
  values?: never;
}

export type SparklineProps = SparklineValuesProps | SparklineDataProps;

export function Sparkline({
  values,
  data,
  dataKey,
  stroke,
  strokeWidth = 1.5,
  fill,
  xKey,
  xType,
  yDomain,
  margin = { top: 2, right: 2, bottom: 2, left: 2 },
  width,
  height,
  className = "",
  ...props
}: SparklineProps) {
  const gradientId = useId();
  const chartData = data ?? values.map((y, x) => ({ x, y }));
  const keys = dataKey === undefined ? ["y"] : typeof dataKey === "string" ? [dataKey] : dataKey;

  // Resolve once per series, then render defs, areas, and lines as separate
  // sibling groups so we emit a single <defs> block instead of one per series.
  const series = keys.map((key, index) => {
    const resolvedStroke = resolveStroke(stroke, index, keys.length);
    const resolvedFill = resolveFill(fill, index);
    const isSolidFill = typeof resolvedFill === "string";
    const gradient =
      resolvedFill && !isSolidFill ? resolveGradient(resolvedFill, resolvedStroke) : null;
    const areaFill = !resolvedFill
      ? null
      : isSolidFill
        ? resolvedFill
        : `url(#${gradientDomId(gradientId, index)})`;
    return { key, index, resolvedStroke, areaFill, gradient };
  });

  const gradients = series.filter((s) => s.gradient !== null);

  return (
    <Chart
      data={chartData}
      xKey={xKey}
      xType={xType}
      yKeys={keys}
      yDomain={yDomain}
      margin={margin}
      width={width}
      height={height}
      className={className}
      {...props}
    >
      {gradients.length === 0 ? null : (
        <defs>
          {gradients.map((s) => (
            <linearGradient
              key={s.key}
              id={gradientDomId(gradientId, s.index)}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={s.gradient!.from}
                stopOpacity={s.gradient!.fromOpacity}
              />
              <stop
                offset="100%"
                stopColor={s.gradient!.to}
                stopOpacity={s.gradient!.toOpacity}
              />
            </linearGradient>
          ))}
        </defs>
      )}
      {series.map((s) =>
        s.areaFill === null ? null : (
          <Area key={`${s.key}-area`} dataKey={s.key} fill={s.areaFill} />
        ),
      )}
      {series.map((s) => (
        <Line
          key={s.key}
          dataKey={s.key}
          stroke={s.resolvedStroke}
          strokeWidth={strokeWidth}
        />
      ))}
    </Chart>
  );
}

function resolveStroke(
  stroke: SparklineBaseProps["stroke"],
  index: number,
  seriesCount: number,
): string {
  if (isReadonlyArray<string | undefined>(stroke)) {
    return stroke[index] ?? paletteColor(index);
  }
  if (stroke) return stroke;
  if (seriesCount > 1) return paletteColor(index);
  return "var(--eudonia-sparkline-stroke, oklch(0.55 0.15 230))";
}

function resolveFill(
  fill: SparklineBaseProps["fill"],
  index: number,
): SparklineFillConfig | null {
  if (fill === undefined || fill === false) return null;
  if (isReadonlyArray<SparklineFillValue | undefined>(fill)) {
    const item = fill[index];
    return item === undefined || item === false ? null : item;
  }
  return fill;
}

function resolveGradient(
  fill: Exclude<SparklineFillConfig, string>,
  stroke: string,
): Required<SparklineGradientFill> {
  if (fill === true) {
    // Default the gradient to the resolved stroke so multi-series sparklines
    // get a fill that matches each line's palette color, not a single global
    // var. Single-series stays themeable through the resolved stroke fallback.
    return {
      from: stroke,
      to: stroke,
      fromOpacity: 0.24,
      toOpacity: 0,
    };
  }
  return {
    from: fill.from ?? stroke,
    to: fill.to ?? stroke,
    fromOpacity: fill.fromOpacity ?? 0.24,
    toOpacity: fill.toOpacity ?? 0,
  };
}

function gradientDomId(base: string, index: number): string {
  return `${base.replaceAll(":", "")}-sparkline-fill-${index}`;
}

function isReadonlyArray<T>(value: unknown): value is readonly T[] {
  return Array.isArray(value);
}
