// Canvas-backed text measurement, and the truncation helper that builds on it.
// Canvas measureText agrees with SVG single-line text rendering once the font
// spec matches, so we use it to compute label widths without mounting anything.
// No DOM required past canvas creation.

const CACHE_LIMIT = 500;
const ELLIPSIS = "…";

const cache = new Map<string, number>();
let canvasCtx: CanvasRenderingContext2D | null = null;

// Note: `ChartSvg` is gated behind `ParentSize` (zero-sized on the server), so
// `measureText` never runs during SSR in practice. This guard exists for
// environments that have `document` but no working canvas — happy-dom in our
// bun tests being the concrete case — so a null context shouldn't poison the
// cache or get pinned as the permanent answer.
function getContext(): CanvasRenderingContext2D | null {
  if (canvasCtx) return canvasCtx;
  if (typeof document === "undefined") return null;
  canvasCtx = document.createElement("canvas").getContext("2d");
  return canvasCtx;
}

export function measureText(text: string, font: string): number {
  const ctx = getContext();
  // Fallback path is font-independent; caching it under a font-specific key
  // would block the real canvas value from ever replacing it.
  if (!ctx) return text.length * 7;

  const key = `${font}\x00${text}`;
  const cached = cache.get(key);
  if (cached !== undefined) {
    // LRU touch: re-insert to mark as recently used.
    cache.delete(key);
    cache.set(key, cached);
    return cached;
  }

  ctx.font = font;
  const width = ctx.measureText(text).width;

  if (cache.size >= CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, width);
  return width;
}

// Returns the longest prefix of `text` that fits within `maxWidth` when
// rendered in `font`, with an ellipsis appended. Returns `text` unchanged
// when it already fits, or `""` when not even the ellipsis fits.
//
// Uses binary search over prefix lengths — O(log n) canvas measurements.
export function truncateText(text: string, font: string, maxWidth: number): string {
  if (maxWidth <= 0) return "";
  if (measureText(text, font) <= maxWidth) return text;

  const ellipsisWidth = measureText(ELLIPSIS, font);
  if (ellipsisWidth > maxWidth) return "";

  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    const candidate = text.slice(0, mid) + ELLIPSIS;
    if (measureText(candidate, font) <= maxWidth) lo = mid;
    else hi = mid - 1;
  }
  return lo === 0 ? "" : text.slice(0, lo) + ELLIPSIS;
}
