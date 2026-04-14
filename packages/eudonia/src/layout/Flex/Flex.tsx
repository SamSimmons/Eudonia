import type { ComponentPropsWithoutRef } from "react";

import { toCssLength, type LayoutLength } from "../shared/toCssLength";

type FlexDirection = "row" | "column";

export interface FlexProps extends ComponentPropsWithoutRef<"div"> {
  direction?: FlexDirection;
  gap?: LayoutLength;
}

export function Flex({
  children,
  className = "",
  direction = "row",
  gap = 0,
  style,
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
        minWidth: "0px",
        minHeight: "0px",
      }}
    >
      {children}
    </div>
  );
}
