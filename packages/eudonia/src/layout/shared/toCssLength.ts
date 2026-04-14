export type LayoutLength = number | string;

export function toCssLength(value: LayoutLength) {
  return typeof value === "number" ? `${value}px` : value;
}
