// Canvas text measurement. Canvas measureText agrees with SVG single-line text
// rendering once the font spec matches, so we use it to compute label widths
// without mounting anything. No DOM required past canvas creation.

const CACHE_LIMIT = 500;

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
