import { formatOklch, parseOklch } from "./oklch";
import type { DerivedPalette } from "./types";

export interface DefineCategoricalOptions {
  // Anchor color in OKLCH. Slot 1 of the resulting palette.
  anchor: string;
  // Number of slots to generate. Defaults to 8 (matches the shipped categorical token range).
  size?: number;
  // How far around the hue wheel to spread the generated companions.
  // "wide" walks the full 360° (good when slots may be used for unrelated series).
  // "narrow" walks 180° (a tighter, more harmonized set; companions stay perceptually closer to the anchor).
  hueSpread?: "wide" | "narrow";
}

// Generate a categorical palette from a single anchor by walking hue around
// the wheel while holding L and C constant. Equal L keeps the slots
// perceptually balanced (no slot screams louder than another) — see
// research/color/02-perceptual-constraints.md.
export function defineCategorical(
  options: DefineCategoricalOptions,
): DerivedPalette {
  const size = options.size ?? 8;
  const arc = options.hueSpread === "narrow" ? 180 : 360;
  const { L, C, H } = parseOklch(options.anchor);
  const step = arc / size;

  const vars: Record<string, string> = {};
  for (let i = 0; i < size; i++) {
    const hue = ((H + i * step) % 360 + 360) % 360;
    vars[`--eudonia-chart-cat-${i + 1}`] = formatOklch({ L, C, H: hue });
  }
  return { vars };
}
