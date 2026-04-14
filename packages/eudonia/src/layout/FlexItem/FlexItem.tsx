import type { ComponentPropsWithoutRef } from "react";

import { toCssLength, type LayoutLength } from "../shared/toCssLength";

export interface FlexItemProps extends ComponentPropsWithoutRef<"div"> {
  basis?: LayoutLength;
  grow?: boolean;
}

export function FlexItem({
  basis,
  children,
  className = "",
  grow = false,
  style,
  ...props
}: FlexItemProps) {
  const resolvedBasis = basis === undefined ? "auto" : toCssLength(basis);
  const flexBasis = grow && basis === undefined ? "0px" : resolvedBasis;

  return (
    <div
      {...props}
      className={`eudonia-flex-item ${className}`}
      style={{
        ...style,
        flexGrow: grow ? 1 : 0,
        flexShrink: grow || basis === undefined ? 1 : 0,
        flexBasis,
        minWidth: "0px",
        minHeight: "0px",
      }}
    >
      {children}
    </div>
  );
}
