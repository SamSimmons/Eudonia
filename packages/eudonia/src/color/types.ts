// Public types for the eudonia/color package.

import type { _PALETTE_REGISTRY } from "./palettes";

// Authoring shape for a palette. `resolvePalette` serializes this into the
// CSS variables Screen / Card / chart components consume. Any field is
// optional — partial palettes layer over defaults from theme.css.
export interface Palette {
  // Categorical slot colors (assigned to --eudonia-chart-cat-1..N).
  categorical?: readonly string[];
  // Sequential ramp (assigned to --eudonia-chart-seq-1..N).
  sequential?: readonly string[];
  // Diverging ramp (assigned to --eudonia-chart-div-1..N).
  diverging?: readonly string[];
  // Semantic positive/negative — only hue + chroma; the light/dark theme
  // blocks pick lightness/alpha so cells stay legible on either surface.
  positiveH?: number;
  positiveC?: number;
  negativeH?: number;
  negativeC?: number;
}

// Names derived from the registry — single source of truth, no drift.
export type PaletteName = keyof typeof _PALETTE_REGISTRY;

// Returned by `defineCategorical` / `defineSequential` / `defineDiverging`.
// Carries CSS variable assignments directly. Pre-dates the structured
// `Palette` shape; kept for backward compatibility.
export interface DerivedPalette {
  vars: Record<string, string>;
}

// Per-kind partial — for cases where a single component (or a Screen) wants
// to set categorical and diverging palettes simultaneously.
export interface PalettePartial {
  categorical?: PaletteName | readonly string[] | DerivedPalette;
  sequential?: PaletteName | readonly string[] | DerivedPalette;
  diverging?: PaletteName | readonly string[] | DerivedPalette;
}

export type PaletteProp =
  | PaletteName
  | Palette
  | readonly string[]
  | DerivedPalette
  | PalettePartial;

export interface Oklch {
  L: number;
  C: number;
  H: number;
  alpha?: number;
}
