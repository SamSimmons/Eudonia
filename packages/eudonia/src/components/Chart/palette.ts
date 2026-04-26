// Fallback OKLCH palette used when `eudonia/theme.css` is not loaded. When the
// theme is imported, the CSS variables override these — the fallback just keeps
// colors sensible in bare setups or storybook-like previews.
export const FALLBACK_PALETTE: readonly string[] = [
  "oklch(0.55 0.14 230)",
  "oklch(0.6 0.12 165)",
  "oklch(0.7 0.13 75)",
  "oklch(0.58 0.16 25)",
  "oklch(0.5 0.13 295)",
  "oklch(0.65 0.09 200)",
  "oklch(0.68 0.12 110)",
  "oklch(0.55 0.13 340)",
];

export const PALETTE_SIZE = FALLBACK_PALETTE.length;

export const DEFAULT_PALETTE: readonly string[] = Array.from(
  { length: PALETTE_SIZE },
  (_, i) => `var(--eudonia-chart-cat-${i + 1}, ${FALLBACK_PALETTE[i]})`,
);

export function paletteColor(slot: number): string {
  return DEFAULT_PALETTE[slot % PALETTE_SIZE]!;
}
