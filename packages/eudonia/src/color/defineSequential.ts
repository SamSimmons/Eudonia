import { formatOklch, parseOklch } from "./oklch";
import type { DerivedPalette } from "./types";

export interface DefineSequentialOptions {
  // Hue anchor. Only the H value is used — L and C are walked across the ramp.
  hue: string;
  // Number of stops in the ramp. Defaults to 9 (matches the shipped token range).
  size?: number;
  // L of the lightest stop. Defaults to 0.95 (near paper).
  lightnessMax?: number;
  // L of the darkest stop. Defaults to 0.22 (near body text).
  lightnessMin?: number;
  // Peak chroma at the visual midpoint of the ramp. Chroma tapers toward both
  // ends so colors remain in sRGB gamut at extreme L values. Defaults to 0.14.
  chromaMax?: number;
}

// Generate a sequential palette by walking lightness from `lightnessMax`
// (lightest) to `lightnessMin` (darkest) at fixed hue. Chroma follows a
// bell curve peaking at the midpoint — extremes are washed out, middle
// stops carry the color.
//
// Sequential palettes encode magnitude (Bertin's value channel). Lightness
// must vary monotonically so the palette remains ordered when grayscaled —
// see research/color/01-dataviz-canon.md (Brewer, Crameri).
export function defineSequential(
  options: DefineSequentialOptions,
): DerivedPalette {
  const size = options.size ?? 9;
  const lMax = options.lightnessMax ?? 0.95;
  const lMin = options.lightnessMin ?? 0.22;
  const cMax = options.chromaMax ?? 0.14;
  const { H } = parseOklch(options.hue);

  const vars: Record<string, string> = {};
  for (let i = 0; i < size; i++) {
    const t = size === 1 ? 0 : i / (size - 1);
    const L = lMax - t * (lMax - lMin);
    // Bell curve on chroma: peak at t=0.5, taper to 60% at the ends.
    const cTaper = 1 - ((Math.abs(t - 0.5) * 2) ** 2) * 0.4;
    const C = cMax * cTaper;
    vars[`--eudonia-chart-seq-${i + 1}`] = formatOklch({ L, C, H });
  }
  return { vars };
}
