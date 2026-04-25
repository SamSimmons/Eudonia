import type { ReactNode } from "react";

import { extractNumber } from "./extract";

export function renderValue(
  value: unknown,
  formatter: ((v: number) => string) | null,
): ReactNode {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return formatter ? formatter(value) : value.toLocaleString();
  // Strings that parse to a number (e.g. "$7,362,616") still benefit from a
  // user-supplied formatter — extract once and format if a number falls out.
  if (typeof value === "string") {
    if (formatter) {
      const n = extractNumber(value);
      if (n !== null) return formatter(n);
    }
    return value;
  }
  return String(value);
}
