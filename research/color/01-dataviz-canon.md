# Color in the dataviz canon

What the load-bearing dataviz writers say about color in charts. Positions, not surveys.

## Tufte (Visual Display, Envisioning Information, Beautiful Evidence)

Tufte does not write a "color chapter" — he writes about color throughout, treating it as a high-stakes design decision.

**Key positions:**

- **Color is data.** When color is used in a chart, it must encode something. Decorative color is noise.
- **The fundamental rule for color use is: above all else do no harm.** Color choices that confuse the reader are worse than no color at all.
- **Pure saturated color is rare in nature** — it carries the strong association of the artificial. Earth tones, muted hues, and grayscale should be the default; bright color reserved for emphasis.
- **Layering and separation through color value (lightness)** rather than hue. The most important encoding channel is value/lightness; hue is for distinguishing categories.
- **Small multiples** can use the same color treatment across panels — this is part of what makes them readable.
- **Avoid the rainbow.** Rainbow palettes (red→yellow→green→blue→violet) are the canonical bad example because hue does not have ordinal meaning.

**Implication for eudonia:** Default palette should lean muted and earth-toned. Saturated color is for emphasis (status, alert, the focused series). Lightness ramps for sequential data, not hue ramps.

## Few (Show Me the Numbers, Information Dashboard Design)

Few has explicit chapters on color, especially in Information Dashboard Design.

**Key positions:**

- **Use color sparingly.** A dashboard with too much color teaches readers to ignore color, which destroys its value as a signal.
- **Reserve color for the data that needs to stand out.** The default state of cells, lines, and bars should be muted; color is for the exception.
- **Match color encoding to data type:**
  - Categorical → distinct hues, not ordered.
  - Sequential → single hue, varying lightness.
  - Diverging → two hues meeting at a neutral.
- **Status colors should be conventional but restrained.** Red for problems, yellow for caution, green for OK — but in muted tints, not Christmas-tree saturation.
- **Avoid color combinations that are problematic for color-blind readers.** Red and green together fail for ~8% of men. Pair color with another channel (icon, shape, position).
- **Test in monochrome.** A well-designed chart should remain readable when color is removed (printed in B&W, screenshot through a grayscale filter, viewed by a color-blind reader).

**Implication for eudonia:** Default behavior should make it easy to use one accent color against a neutral baseline (the "highlighted series" pattern). Status colors must be muted. Color should never be the only encoding for important information.

## Cleveland (Elements of Graphing Data; "Graphical Perception" with McGill, 1984)

Cleveland's perceptual ranking establishes color's place among visual encodings.

**The ranking (most to least precise):**

1. Position along common scale
2. Position along non-aligned scales
3. Length
4. Angle / slope
5. Area
6. Volume
7. **Color hue** (qualitative)
8. **Color value / saturation** (quantitative)

**Implications:**

- Color hue is a *qualitative* channel — good for distinguishing categories, poor for reading exact magnitudes.
- Color value/saturation is precision-rank #8 — humans cannot decode exact numbers from color shading. A heatmap shows pattern; reading exact values requires hover/tooltip.
- For numeric precision, position (right-aligned numbers, dot plots, aligned bars) wins. Color is the wrong tool for "is this 23 or 25?"
- Color is the right tool for "is this category A or B?" or "is this anomalous vs normal?"

**Implication for eudonia:** Don't oversell color. Sequential heatmaps are for spotting patterns and outliers, not for reading exact values. Diverging palettes signal direction (positive/negative); their precision is rank #8 — pair with the actual number when it matters.

## Bertin (Semiology of Graphics, 1967)

Bertin enumerated the visual variables a graphical mark can vary along. Color is three of them:

- **Hue** (color name) — qualitative; useful for nominal categories. No ordinal meaning.
- **Value** (lightness) — has ordinal meaning. Reads as "more vs less."
- **Saturation** (chroma) — has weak ordinal meaning. Often perceptually ambiguous.

His broader point: each visual variable has different perceptual properties and is suited to different data types. Hue ≠ value ≠ saturation. Treating "color" as one thing conflates three different channels with three different roles.

**Implication for eudonia:** The categorical/sequential/diverging taxonomy isn't an arbitrary library convention — it's a direct consequence of Bertin's variables. Categorical = hue varies; Sequential = value varies (single hue); Diverging = hue varies through a neutral with value varying as well.

## Brewer (ColorBrewer, 2003)

Cynthia Brewer's ColorBrewer is the most cited research-grounded palette resource. Originally developed for cartography; widely adopted in dataviz.

**Key positions:**

- **Three palette types**, mapped to data types:
  - **Sequential** for ordered data low→high.
  - **Diverging** for data with a meaningful midpoint.
  - **Qualitative** for nominal categories.
- **Each palette is designed for a specific number of classes** (3, 4, 5, 6, 7, 8, 9, sometimes 10–12). Palettes don't scale linearly — a 5-step is hand-tuned, not "the 9-step truncated."
- **Color-blind safety is a first-class constraint.** ColorBrewer marks each palette as color-blind safe / problematic / unknown, tested against deuteranopia, protanopia, and tritanopia simulations.
- **Print-friendly and photocopy-safe** are also marked. Some palettes that work on screen fail when printed.
- **Sequential palettes vary lightness monotonically** so they remain ordered when grayscaled.
- **Diverging palettes have a perceptually neutral midpoint** (light/dim) so the two arms read as comparably weighted from center.

**Implication for eudonia:** ColorBrewer is the proven default basis for sequential and diverging palettes. We don't need to invent these; we adopt or adapt. Color-blind safety should be a default constraint we can check against.

## Crameri ("The misuse of colour in science communication," Nature 2020)

Fabio Crameri's research on perceptually uniform colormaps for scientific visualization. Co-author of the *Scientific Colour Maps* (e.g. `vik`, `roma`, `batlow`).

**Key positions:**

- **Rainbow palettes are perceptually broken.** The classic jet colormap (matplotlib's old default, MATLAB's default) introduces false structure: regions where color value changes rapidly look like edges that aren't in the data; regions where it changes slowly hide real structure.
- **Perceptually uniform colormaps** (viridis, inferno, magma, plasma — and Crameri's own *batlow*, *vik*, *roma*) are designed so equal steps in the data map to equal steps in perceived color. This is what enables honest reading of magnitude from color.
- **Diverging palettes need symmetric perceptual weight** on both arms — otherwise readers mistake "more red" for "more extreme" when the green arm is just visually weaker.
- **Test palettes by simulating color-blind vision.** Crameri publishes simulation tools.

**Implication for eudonia:** Sequential palettes should be perceptually uniform (viridis-family or hand-tuned ramps in OKLCH). Diverging palettes must have symmetric perceptual weight on each arm. Avoid rainbow at all costs.

## Stone (A Field Guide to Digital Color, 2003)

Maureen Stone's foundational text on digital color science. Less cited in viz writing but the substrate.

**Key positions:**

- **Color appearance is contextual.** A color looks different on different backgrounds, at different sizes, next to different colors. Palette design must account for the rendering context.
- **sRGB is not perceptually uniform.** Distances in RGB don't correspond to perceived color differences. CIE Lab and (now) OKLCH are the right spaces for palette design and interpolation.
- **Brightness, lightness, and luminance are not the same thing.** Lightness is what designers want; luminance is the physical measurement.

**Implication for eudonia:** All palette work should happen in OKLCH (the modern, web-supported perceptually uniform space). Interpolation, contrast checks, and derivation must use perceptually uniform math, not RGB.

## Where the canon converges

Despite different framings, the load-bearing writers agree on:

1. **Three palette types**, matched to data types (Brewer's nominal/ordinal/diverging is universal).
2. **Color is encoding**, not decoration. Reserve color for what matters (Tufte, Few).
3. **Hue is for categories; value is for magnitude.** Don't mix the two (Bertin, Cleveland).
4. **Restrained, low-saturation palettes** read better than vivid ones in dense displays (Tufte, Few).
5. **Perceptual uniformity matters** for honest sequential and diverging encodings (Crameri, Brewer).
6. **Color-blind safety is a default constraint**, not an accessibility add-on (Brewer, Few, Crameri).
7. **Color should never be the only encoding** for critical information (all of them).

These seven points are the load-bearing inheritance. The eudonia color system should embody all of them by default, not require consumers to know them.
