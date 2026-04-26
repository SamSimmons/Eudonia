# Perceptual constraints

The hard constraints that bound any color system. These are not stylistic preferences; they're rooted in human visual perception and accessibility law.

## OKLCH and perceptual uniformity

### What it is

OKLCH is a perceptually uniform color space proposed by Björn Ottosson (2020), now a CSS standard. Three coordinates:

- **L** (Lightness) 0..1 — perceived brightness, uniform across hues
- **C** (Chroma) 0..0.4 — perceived colorfulness/saturation
- **H** (Hue) 0..360 — perceived hue angle

### Why it matters for palette design

In sRGB, equal steps don't look equal. `#0000FF` to `#000080` looks like a much bigger jump than `#FF0000` to `#800000`, even though numerically each halves the channel. This is because human vision is nonlinear in RGB.

In OKLCH, equal steps look equal. Two colors with the same L look equally bright, regardless of hue. Two colors with the same C look equally saturated. This makes OKLCH the right space for:

- **Interpolation** — interpolating L, C, H between two endpoints produces a perceptually smooth ramp. Interpolating in RGB produces muddy, dark midpoints (the "purple problem" — red→green through brown via RGB; through clean yellow-green via OKLCH).
- **Palette derivation** — generating a sequential ramp from one color is just walking L while keeping H constant.
- **Light/dark variants** — a dark-mode color is roughly the light-mode color with L flipped (1 - L) and C slightly reduced.
- **Contrast checks** — perceptual contrast is a function of ΔL.

### The OKLCH gamut

Not every (L, C, H) triple is renderable in sRGB. High-chroma colors at extreme L values fall outside the gamut and get clipped to the nearest in-gamut color. Modern browsers handle this; palette design must respect it.

In practice: keep C ≤ 0.15 for most palette work; go higher only when you've tested the rendering.

### CSS support

`oklch()` is now Baseline (Chrome 111, Safari 16.4, Firefox 113). For the eudonia codebase (which already uses oklch throughout), this is the native authoring space.

## Color-blindness

### Types and prevalence

| Type | Prevalence | Effect |
| --- | --- | --- |
| Deuteranopia (green-blind) | ~6% of men | Red and green look similar; reds desaturated |
| Protanopia (red-blind) | ~1% of men | Red looks dark; red/green confusion |
| Tritanopia (blue-blind) | <0.01% | Blue/yellow confusion (rare) |
| Monochromacy | <0.01% | No color perception |

About **8% of men** and **0.5% of women** have some form of color vision deficiency. In any non-trivial audience, several percent of users see your charts in transformed colors.

### What fails

- **Red vs green** — the canonical bad pair. Used everywhere (good/bad, profit/loss, pass/fail) and broken for ~7% of viewers.
- **Red vs brown vs orange** — distinguishable for normal vision, often indistinguishable for deuteranopes.
- **Green vs blue** at low saturation — can blur for protanopes.
- **Light pastel pairs** — already low contrast; color-blind transformations push them lower.

### What works

- **Blue vs orange** — robust across all common deficiencies (this is why d3's default Tableau-style palette opens with blue/orange).
- **Hue + lightness pairs** — adding a lightness difference makes a hue pair distinguishable even when hue alone fails. A bright red vs dark green is recognizable as different in any color vision.
- **Adding shape/icon/position** — the universal redundancy strategy.

### Practical constraint for eudonia

- **Default categorical palette must pass deuteranopia + protanopia simulation.** This rules out red→green dominant palettes.
- **Diverging "bad↔good" palette uses red↔green by tradition, but must vary in lightness as well as hue** so the two arms remain distinguishable when hue collapses.
- **Status colors (positive/negative) must pair with text or icon** — the component should not encode pass/fail with color alone.
- **Ship a check helper** — `checkPalette(colors)` that runs the three simulations and warns on collision.

## WCAG contrast

### The standard

WCAG 2.1 contrast minimums (relative luminance ratio):

- **4.5:1** for normal text
- **3:1** for large text (18pt+ or 14pt+ bold) and UI components
- **AAA**: 7:1 for normal, 4.5:1 for large

### What it constrains in dataviz

- **Tick labels and axis text** — must hit 4.5:1 against the chart background. Light gray on white often fails.
- **Bar/line colors against background** — bars should hit 3:1 against the background to be reliably perceived as objects.
- **Status pills** — text inside a colored pill must hit 4.5:1 against the pill background.
- **Hover/focus states** — focus rings must hit 3:1 against adjacent surfaces.

### WCAG vs APCA

WCAG 2's contrast formula is known to be inaccurate for dark text on light backgrounds and for certain hue combinations. **APCA** (Accessible Perceptual Contrast Algorithm, draft for WCAG 3) is more accurate for screen text but not yet a standard. For now, target WCAG AA; track APCA development.

### Practical constraint for eudonia

- All token-driven text colors (`--eudonia-text`, `--eudonia-text-muted`, `--eudonia-text-subtle`, `--eudonia-label-color`, etc.) should hit WCAG AA against `--eudonia-bg` and `--eudonia-fg` surfaces.
- Categorical palette colors should hit 3:1 against `--eudonia-fg` (chart background = card surface).
- Sequential palette endpoints should hit 3:1 at minimum against the card surface; intermediate stops can be lighter.
- Status pill colors should be hand-tuned for 4.5:1 text-on-pill.

## Perceptual brightness vs hue

A subtler constraint: **different hues at the same OKLCH L look about equally bright**, but different hues at the same sRGB lightness do *not*.

Practical impact: a categorical palette where each color has the same L looks balanced. A categorical palette tuned by sRGB has uneven visual weight (the yellows look "louder," the blues look "quieter"). This is a Tufte-style "no color carries more emphasis than another" principle, enforceable in OKLCH.

## Color appearance in context

A color does not look the same on different surfaces. On `--eudonia-fg` (light cool surface) vs `--eudonia-bg` (slightly darker cool surface) vs a dark mode equivalent, the same `oklch(0.55 0.14 230)` appears different.

This is why dark-mode palettes are not "the light palette with L flipped" alone — they often want slightly higher chroma (because dark surfaces wash chroma out) and slightly less extreme L (because dark mode needs less contrast headroom).

**Practical constraint:** Light and dark palette variants should be designed (or auto-derived with rules), not just inverted. Anchor-derivation helpers should produce both variants from the consumer's anchor.

## Rendering constraints

### Subpixel rendering and small targets

Color decoding fails below ~8px. A 4px sparkline stroke in muted gray reads as "presence/absence" not as a specific gray. Don't waste palette nuance on tiny marks.

### Print and high-contrast environments

Some users render charts in:
- Print (CMYK-converted, rough)
- Forced colors mode (Windows high-contrast — overrides palette entirely)
- Reader mode (often strips color)
- Email clients (limited CSS support)

Charts should remain *informative* in these modes. Color is one channel; structure (position, alignment, label) is another. Both should always be present.

## Summary of hard constraints

A palette system that ignores these constraints produces broken charts:

1. **Author in OKLCH**, interpolate in OKLCH.
2. **Default to color-blind-safe** combinations; check by simulation.
3. **Hit WCAG AA contrast** for all foreground/background pairs by default.
4. **Equal-L for categorical balance** so no single color screams.
5. **Lightness varies in sequential palettes** so they remain ordered when grayscaled.
6. **Diverging palettes have symmetric perceptual weight** on both arms.
7. **Color is never the only encoding** for critical signals.

These are non-negotiable in our defaults. Override is allowed; defaults must satisfy.
