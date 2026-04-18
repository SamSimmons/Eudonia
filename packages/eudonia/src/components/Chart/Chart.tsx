import { type ComponentPropsWithoutRef, type ReactNode, useMemo } from "react";
import { ParentSize } from "@visx/responsive";

import styles from "./Chart.module.css";
import { ChartSvg } from "./ChartSvg";
import type { ChartDatum, ChartMargin } from "./context";
import { inferXKey, inferXType, inferYKeys } from "./infer";
import type { ChartXType } from "./scales";

type DivProps = ComponentPropsWithoutRef<"div">;

export interface ChartProps extends Omit<DivProps, "children"> {
  data: readonly ChartDatum[];
  xKey?: string;
  yKeys?: readonly string[];
  yDomain?: readonly [number, number];
  xType?: ChartXType;
  margin?: Partial<ChartMargin>;
  width?: number;
  height?: number;
  children?: ReactNode;
}

const DEFAULT_MARGIN: ChartMargin = { top: 0, right: 0, bottom: 0, left: 0 };

export function Chart({
  data,
  xKey,
  yKeys,
  yDomain,
  xType,
  margin,
  width,
  height,
  children,
  className = "",
  style,
  ...props
}: ChartProps) {
  const resolvedXKey = useMemo(() => xKey ?? inferXKey(data), [xKey, data]);
  const resolvedYKeys = useMemo(
    () => yKeys ?? inferYKeys(data, resolvedXKey),
    [yKeys, data, resolvedXKey],
  );
  const resolvedXType = useMemo(
    () => xType ?? inferXType(data, resolvedXKey),
    [xType, data, resolvedXKey],
  );
  const resolvedMargin = useMemo<ChartMargin>(
    () => ({ ...DEFAULT_MARGIN, ...margin }),
    [margin],
  );

  // Explicit width/height props size the wrapping div so the whole component
  // matches the requested dimensions; otherwise the CSS rule keeps it 100% of
  // its parent. Each axis is independent — pass only width to fix the width
  // and let height stay responsive (or vice versa).
  const rootStyle = {
    ...style,
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
  };

  return (
    <div {...props} className={`${styles.root} ${className}`} style={rootStyle}>
      <ParentSize>
        {({ width: w, height: h }) => {
          const finalW = width ?? w;
          const finalH = height ?? h;
          return finalW > 0 && finalH > 0 ? (
            <ChartSvg
              data={data}
              width={finalW}
              height={finalH}
              xKey={resolvedXKey}
              yKeys={resolvedYKeys}
              xType={resolvedXType}
              yDomain={yDomain}
              margin={resolvedMargin}
            >
              {children}
            </ChartSvg>
          ) : null;
        }}
      </ParentSize>
    </div>
  );
}
