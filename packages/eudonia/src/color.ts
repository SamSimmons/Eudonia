// Public surface of the eudonia/color package — palette derivation helpers
// and color utilities. Pure JS; no React dependencies.
//
// See research/color/99-synthesis.md for the design rationale.

export { defineCategorical } from "./color/defineCategorical";
export type { DefineCategoricalOptions } from "./color/defineCategorical";

export { defineSequential } from "./color/defineSequential";
export type { DefineSequentialOptions } from "./color/defineSequential";

export { defineDiverging } from "./color/defineDiverging";
export type { DefineDivergingOptions } from "./color/defineDiverging";

export { checkColorBlindSafe } from "./color/checkColorBlindSafe";
export type {
  ColorBlindCheckResult,
  ColorBlindConflict,
  ColorVisionDeficiency,
} from "./color/checkColorBlindSafe";

export { resolvePalette } from "./color/resolvePalette";
export type { ResolvedPalette } from "./color/resolvePalette";

export { monochrome, PALETTES, PALETTE_NAMES, paletteToVars } from "./color/palettes";

export type {
  DerivedPalette,
  Oklch,
  Palette,
  PaletteName,
  PalettePartial,
  PaletteProp,
} from "./color/types";

export {
  formatOklch,
  lerpHue,
  lerpOklch,
  parseOklch,
} from "./color/oklch";
