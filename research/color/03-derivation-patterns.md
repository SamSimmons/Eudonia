# Derivation patterns

How modern design systems generate palettes from a small number of anchor inputs. This is the load-bearing prior art for the "consumer hands us their brand colors, we derive the rest" pattern.

## Radix Colors

Open-source color system from the Radix UI team (WorkOS). The most influential recent example of *programmatic* palette derivation.

**The shape:**

- Each color is a **12-step ramp** with documented purposes per step:
  - Steps 1–2: app/component backgrounds
  - Steps 3–5: component states (normal, hover, active)
  - Steps 6–8: borders
  - Steps 9–10: solid backgrounds (the "loud" version of the color)
  - Steps 11–12: low- and high-contrast text
- Each ramp has a **light variant** and a **dark variant**, designed (not auto-flipped) to maintain the same role at each step.
- Each ramp has an **alpha variant** for transparency over backgrounds.

**The engine:**

Radix Colors uses a declarative engine — given an anchor (or even a brand color), it can generate the full 12-step ramp via OKLCH manipulation: walk L from very light to very dark, holding H constant, varying C to maintain perceived chroma at extreme L values.

**What it proves:**

- A consumer can hand over a single color and get a complete role-based palette.
- The 12-step structure is more than enough for any UI need — most components only consume 3–5 steps.
- Light and dark variants can be derived as a pair, not separately authored, *if* the system designs the rules.

**What's not portable to dataviz:**

Radix is designed for UI surfaces (backgrounds, borders, text). The chart use-case wants different things: equal-L categorical sets, sequential ramps, diverging palettes through neutrals. The ramp structure is wrong for chart palettes — but the *derivation discipline* is exactly right.

## Material Design 3 (Dynamic Color / HCT)

Google's Material Design 3 introduced "Dynamic Color" — palettes auto-derived from a single source color (often the user's wallpaper on Android).

**The system:**

- Source color → 6 tonal palettes: primary, secondary, tertiary, neutral, neutral-variant, error.
- Each tonal palette has 13 tones (0, 10, 20, …, 100).
- Light and dark themes are different *role mappings* of the same tonal palettes.
- Built on **HCT** (Hue, Chroma, Tone), a perceptually-uniform color space similar to OKLCH but tuned for Material's specific needs.

**What it proves:**

- One source color can produce a comprehensive role-based theme.
- The same tonal palettes serve light and dark by remapping which tone fills which role.
- A "complementary" or "harmonic" hue can be auto-derived for accent/secondary.

**What's worth borrowing:**

- The role-mapping idea: the *role* (background, border, text, accent) is stable; the *tone* assigned to that role differs by theme. This is exactly the eudonia approach for surfaces today (`--eudonia-bg`, `--eudonia-fg`, etc.).
- Auto-harmonic accent generation: from an anchor blue, a harmonized orange (or whatever pairs perceptually) can be computed.

**What's heavy:**

Material's full Dynamic Color is complex and tied to Google's quantization algorithm (extracting source color from images). For dataviz we don't need that machinery; we just need the OKLCH-based derivation rules.

## Tailwind CSS

Adam Wathan's Tailwind ships **22 color families × 11 shades** (50, 100, 200, …, 900, 950). Hand-tuned, not derived — Tailwind v3 explicitly rejected algorithmic generation in favor of designer-curated values.

**Why hand-tuned:**

The Tailwind team's argument: algorithmic palettes always have weird stops where the math is right but the eye doesn't agree. Hand-tuning means each step looks intentional.

**What's worth borrowing:**

- The naming convention (`blue-500` etc.) is broadly recognized.
- The 11-step granularity is overkill for charts but a sensible reference scale.
- The light/dark variant pairing is well-considered.

**What's not portable:**

We can't ship 22×11 hand-tuned colors. We'd be reinventing Tailwind. The eudonia approach is to derive from anchors, not hand-curate a closed set.

## Untitled UI

Closed-source design system (popular Figma toolkit). Worth noting because their "1 anchor → full palette" pattern is well-documented in their public material.

**The shape:**

- 11-step ramps per color, modeled on Tailwind.
- A "primary" anchor → automatic generation of all step values via Lch interpolation.
- Light and dark variants paired.

**What it proves:**

The "consumer picks a primary, system generates the rest" approach is mainstream and validated in commercial design tooling.

## Apple HIG (Human Interface Guidelines)

Apple's system colors. The aesthetic anchor the user pointed at for eudonia.

**The structure:**

- **System colors** — `systemBlue`, `systemGreen`, `systemRed`, `systemOrange`, `systemYellow`, `systemPurple`, `systemPink`, `systemTeal`, `systemIndigo`, `systemBrown`, `systemMint`, `systemCyan`. Twelve hues. Each has a light and a dark variant.
- **Semantic colors** — `label` (primary text), `secondaryLabel`, `tertiaryLabel`, `quaternaryLabel`, `placeholderText`, `separator`, `opaqueSeparator`, `link`. Each adapts to light/dark and to high-contrast accessibility settings.
- **Background colors** — `systemBackground`, `secondarySystemBackground`, `tertiarySystemBackground` for layered surface contexts.

**What's distinctive:**

- The system colors are **not pastel** in default. They're saturated — `systemBlue` is `#007AFF`, `systemRed` is `#FF3B30`. Pastel HIG references usually mean either the *adaptive* tone in dark mode (which is slightly lighter, slightly less saturated) or the recently-added "tinted" variants for visionOS / iPadOS multitasking.
- They are **paired with rich semantic systems** that make consumer code shorter (`label` knows how to be light or dark) and adapt to user accessibility settings.

**Pastel-HIG flavored** (the user's actual ask):

Lifting L into the 0.7–0.8 range and reducing C to ~0.10–0.13 produces a "soft Apple" palette:
- blue → `oklch(0.72 0.13 250)`
- green → `oklch(0.74 0.12 150)`
- red → `oklch(0.72 0.15 25)`
- orange → `oklch(0.77 0.13 60)`
- yellow → `oklch(0.86 0.12 95)`
- purple → `oklch(0.68 0.13 295)`
- pink → `oklch(0.76 0.13 350)`
- teal → `oklch(0.72 0.10 195)`

Color-blind safety would need to be verified for any 4-color subset of these.

**What's worth borrowing for eudonia:**

- The semantic layer (`label`, `secondaryLabel`, `separator`) is exactly what eudonia already does with `--eudonia-text`, `--eudonia-text-muted`, `--eudonia-border`. Confirm the naming model.
- The system color set (12 named hues at saturated and pastel weights) is a good model for what to ship as a categorical default.
- The light/dark pairing via *role* not value-flip is the right architecture.

## Stripe / Vercel / Linear

Closed-source but observable design systems used by analytical-feeling apps.

**Stripe:**

- Restrained, near-monochrome charts.
- One brand purple as the accent; everything else neutral gray.
- Heavy use of grayscale ramps for sequential.
- Status colors (green for success, red for failed, yellow for pending) are muted.

**Vercel:**

- Black/white/gray as the primary palette. Almost no color in dashboards.
- Single accent (their brand black on light, white on dark) for emphasis.
- Charts use a small set of pastel-ish colors when categorical distinction is needed.

**Linear:**

- Multi-color status palette, but each is muted and consistent in chroma.
- Their priority palette (urgent, high, medium, low, no) is a curated 5-color set used widely.
- Sequential progress visualizations use single-hue ramps.

**Common pattern:**

These three apps all *under-use* color compared to their potential. The aesthetic move is restraint. When color is used, it's curated and consistent. None of them ship a 12-color rainbow palette as default.

## Observable Plot

Plot is the modern viz library most explicitly engineered around perceptually-uniform palettes.

**Color helpers:**

- **Categorical scales**: `tableau10`, `category10`, `accent`, `dark2`, `paired`, `set1`, `set2`, `set3`, `observable10`. Default is `tableau10`.
- **Sequential scales**: `blues`, `greens`, `viridis`, `magma`, `inferno`, `plasma`, `cividis`, `turbo`. Default is `blues`.
- **Diverging scales**: `rdbu`, `rdylbu`, `rdylgn`, `spectral`, `brbg`, `piyg`, `prgn`, `puor`. Default is `rdbu`.
- **Cyclical scales**: `rainbow`, `sinebow`. (For periodic data only.)

**API shape:**

```js
Plot.barY(data, { fill: "category" })            // categorical, auto colors
Plot.cellX(data, { fill: "value", scheme: "blues" })  // sequential
Plot.dot(data, { fill: "delta", scheme: "rdbu", pivot: 0 })  // diverging with explicit midpoint
```

**What's worth borrowing:**

- Color *kind* is implied by data type and encoding intent, not by an "isCategorical: true" flag. You pass `fill: "category-name"` and the categorical default is used; you pass `fill: "magnitude"` and the sequential default is used; you specify `pivot:` to opt into diverging.
- Named schemes are accessible by string literal, but custom palettes can be passed as arrays.
- Defaults are excellent. Most users never override.

**What's not directly portable:**

Plot determines the kind from the data; eudonia is a primitive React library where the consumer composes by component. We can't auto-determine in the same way; we'd need explicit kind hints (`<Bar palette="categorical" />` is implicit, `<Heatmap palette="sequential" />` is implicit by component type).

## d3-scale-chromatic

The library that ships the underlying scheme arrays Plot uses.

**Surface area:**

- Per-scheme constants: `d3.schemeBlues[5]` is a 5-element array of hex strings.
- Per-scheme interpolators: `d3.interpolateBlues(0.7)` returns a single color at 70% along the ramp.
- ~30+ schemes covering categorical/sequential/diverging/cyclical.

**Architectural choice:**

D3 ships **discrete arrays per N** (e.g. blues has 9 sub-arrays for sizes 3–9, 11). Plot ships **continuous interpolators** and discretizes on demand. Both work; the second is lighter to ship (one curve, infinite N).

For OKLCH-based work in 2026, continuous interpolation through OKLCH is well-supported — we don't need to ship per-N hand-tuned arrays.

## What proves the approach

Across all these systems:

1. **Anchor → palette derivation is mainstream.** Radix, Material, Untitled UI, Tailwind (despite hand-tuning, structure suggests derivation), HCT all do it.
2. **Role-based mapping** beats step-based references. `--text-primary` is more useful than `--gray-900`.
3. **Light/dark variants** are designed as pairs, not auto-inversions.
4. **OKLCH (or HCT, Lch) is the universal substrate.** sRGB derivation is broken; perceptually-uniform spaces work.
5. **Defaults are excellent in best-in-class systems.** Plot, Stripe, Linear, Vercel — consumers usually don't override.
6. **Restraint dominates.** Saturated multi-color palettes lost in the past decade. Modern aesthetic is muted, anchored, intentional.

## Synthesis for eudonia

We should:

- Ship excellent **defaults per palette kind** (categorical, sequential, diverging) so the no-input case is great.
- Provide **derivation helpers** (`defineCategorical({ anchor })`, `defineDiverging({ low, high })`) for consumers who hand us their brand colors.
- Use **OKLCH for everything** — authoring, interpolation, light/dark derivation.
- Provide **role-named tokens** that components consume, swappable at any DOM scope.
- Default to **color-blind-safe combinations** where the kind allows.
- Keep **raw override** as the always-available escape hatch.

We should NOT:

- Ship a closed set of 22 × 11 hand-tuned colors (that's Tailwind's job).
- Build a quantization engine to extract palette from images (Material's complexity).
- Force consumers to think in 12-step ramps when 5 steps is plenty for any chart.
- Couple our color system to a specific UI framework's tokens — eudonia is the chart layer, not the design system.
