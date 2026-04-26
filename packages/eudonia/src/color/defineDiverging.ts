import { formatCss, interpolate, parse } from "culori";

import type { DerivedPalette } from "./types";

export interface DefineDivergingOptions {
  // The "negative" / low-end anchor (e.g. brand red).
  low: string;
  // The "positive" / high-end anchor (e.g. brand green).
  high: string;
  // Optional explicit midpoint. Defaults to a perceptually neutral light tint
  // (paper-like) — derived for the light theme. Consumers needing dark-mode
  // diverging should override this to a dark neutral.
  mid?: string;
  // Total number of stops, including both ends and the midpoint. Must be odd
  // so the midpoint sits at the exact center. Defaults to 7.
  size?: number;
}

// Generate a diverging palette by interpolating from `low` through `mid` to
// `high` in OKLCH. Both arms cover the same number of stops so the palette
// reads symmetric — equal perceptual weight on either side of the midpoint
// (Crameri / Brewer; see research/color/01-dataviz-canon.md).
export function defineDiverging(
  options: DefineDivergingOptions,
): DerivedPalette {
  const size = (options.size ?? 7) | 0;
  if (size < 3 || size % 2 === 0) {
    throw new RangeError(
      `defineDiverging size must be odd and >= 3, got ${options.size}`,
    );
  }

  // Default mid: a near-paper neutral matched to `low`'s hue so the midpoint
  // doesn't introduce a third hue. Achromatic (C=0) so the visual weight is
  // exclusively in the L value.
  const lowParsed = parse(options.low);
  if (!lowParsed || lowParsed.mode !== "oklch") {
    throw new TypeError(`Invalid oklch color: ${options.low}`);
  }
  const midColor =
    options.mid ?? `oklch(0.96 0 ${lowParsed.h ?? 0})`;

  const ramp = interpolate([options.low, midColor, options.high], "oklch");
  const half = (size - 1) / 2;
  const vars: Record<string, string> = {};
  for (let i = 0; i < size; i++) {
    const formatted = formatCss(ramp(i / (size - 1)));
    if (formatted === undefined) {
      throw new TypeError(`Failed to format diverging stop ${i}`);
    }
    vars[`--eudonia-chart-div-${i + 1}`] = formatted;
  }
  vars["--eudonia-chart-div-low"] = vars["--eudonia-chart-div-1"]!;
  vars["--eudonia-chart-div-mid"] = vars[`--eudonia-chart-div-${half + 1}`]!;
  vars["--eudonia-chart-div-high"] = vars[`--eudonia-chart-div-${size}`]!;
  return { vars };
}
