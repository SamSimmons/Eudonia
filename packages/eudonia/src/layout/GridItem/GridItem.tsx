import type { ComponentPropsWithoutRef } from "react";

export interface GridItemProps extends ComponentPropsWithoutRef<"div"> {
  column?: number;
  columnSpan?: number;
  row?: number;
  rowSpan?: number;
}

export function GridItem({
  children,
  className = "",
  column,
  columnSpan = 1,
  row,
  rowSpan = 1,
  style,
  ...props
}: GridItemProps) {
  return (
    <div
      {...props}
      className={`eudonia-grid-item ${className}`}
      style={{
        ...style,
        gridColumnStart: column === undefined ? undefined : `${column}`,
        gridColumnEnd: columnSpan === 1 ? undefined : `span ${columnSpan}`,
        gridRowStart: row === undefined ? undefined : `${row}`,
        gridRowEnd: rowSpan === 1 ? undefined : `span ${rowSpan}`,
        minWidth: "0px",
        minHeight: "0px",
      }}
    >
      {children}
    </div>
  );
}
