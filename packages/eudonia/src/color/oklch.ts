// OKLCH parsing, serialization, and interpolation. Thin wrappers around
// culori — all palette derivation in eudonia happens in OKLCH because
// perceptual uniformity makes interpolation produce visually balanced
// results. See research/color/02-perceptual-constraints.md for why.

import { formatCss, interpolate, parse } from "culori";

import type { Oklch } from "./types";

export function parseOklch(input: string): Oklch {
  const parsed = parse(input.trim());
  if (!parsed || parsed.mode !== "oklch") {
    throw new TypeError(`Invalid oklch color: ${input}`);
  }
  // culori omits / NaN-fills hue when chroma is 0 (achromatic); normalize.
  const h = parsed.h;
  return {
    L: parsed.l,
    C: parsed.c,
    H: h === undefined || Number.isNaN(h) ? 0 : ((h % 360) + 360) % 360,
    alpha: parsed.alpha,
  };
}

export function formatOklch({ L, C, H, alpha }: Oklch): string {
  const formatted = formatCss({ mode: "oklch", l: L, c: C, h: H, alpha });
  if (formatted === undefined) {
    throw new TypeError(`Failed to format oklch: { L: ${L}, C: ${C}, H: ${H} }`);
  }
  return formatted;
}

// Hue interpolation that respects the angular wrap (shortest path around the
// wheel). Kept hand-rolled since culori only exposes hue interpolation as part
// of its color-space interpolators, which is overkill for a pure-number lerp.
export function lerpHue(a: number, b: number, t: number): number {
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return ((a + diff * t) % 360 + 360) % 360;
}

export function lerpOklch(a: Oklch, b: Oklch, t: number): Oklch {
  const result = interpolate(
    [
      { mode: "oklch", l: a.L, c: a.C, h: a.H },
      { mode: "oklch", l: b.L, c: b.C, h: b.H },
    ],
    "oklch",
  )(t);
  return {
    L: result.l,
    C: result.c ?? 0,
    H: Number.isNaN(result.h ?? Number.NaN) ? a.H : result.h ?? 0,
  };
}
