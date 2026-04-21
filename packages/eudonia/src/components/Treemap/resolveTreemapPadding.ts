import type { ResolvedTreemapPadding, TreemapPadding } from "./types";

export function resolveTreemapPadding(
  padding: number | TreemapPadding | undefined,
): ResolvedTreemapPadding {
  if (padding === undefined) return { inner: 1, outer: 0, top: 0 };
  if (typeof padding === "number") return { inner: padding, outer: padding, top: padding };
  return {
    inner: padding.inner ?? 1,
    outer: padding.outer ?? 0,
    top: padding.top ?? padding.outer ?? 0,
  };
}
