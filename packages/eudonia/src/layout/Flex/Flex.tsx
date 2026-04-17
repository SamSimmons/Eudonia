import type { CSSProperties, ComponentPropsWithoutRef } from "react";

import { toCssLength, type LayoutLength } from "../shared/toCssLength";

type FlexDirection = "row" | "column";

export interface FlexProps extends ComponentPropsWithoutRef<"div"> {
  direction?: FlexDirection;
  gap?: LayoutLength;
  padding?: LayoutLength;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
}

export function Flex({
  children,
  className = "",
  direction = "row",
  gap = 0,
  height = "100%",
  padding = 0,
  style,
  width = "100%",
  ...props
}: FlexProps) {
  return (
    <div
      {...props}
      className={`eudonia-flex ${className}`}
      style={{
        ...style,
        display: "flex",
        flexDirection: direction,
        gap: toCssLength(gap),
        padding: toCssLength(padding),
        width,
        height,
        minWidth: "0px",
        minHeight: "0px",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}
