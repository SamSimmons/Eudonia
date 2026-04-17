import type { CSSProperties, ComponentPropsWithoutRef } from "react";

import { toCssLength, type LayoutLength } from "../shared/toCssLength";

export type GridTrack = LayoutLength | "fluid";

export interface GridProps extends ComponentPropsWithoutRef<"div"> {
  columns?: readonly GridTrack[];
  rows?: readonly GridTrack[];
  gap?: LayoutLength;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
}

function toCssGridTrack(track: GridTrack) {
  return track === "fluid" ? "minmax(0px, 1fr)" : toCssLength(track);
}

export function Grid({
  children,
  className = "",
  columns = ["fluid"],
  gap = 0,
  height = "100%",
  rows,
  style,
  width = "100%",
  ...props
}: GridProps) {
  return (
    <div
      {...props}
      className={`eudonia-grid ${className}`}
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: columns.map(toCssGridTrack).join(" "),
        gridTemplateRows: rows?.map(toCssGridTrack).join(" "),
        gap: toCssLength(gap),
        width,
        height,
        minWidth: "0px",
        minHeight: "0px",
      }}
    >
      {children}
    </div>
  );
}
