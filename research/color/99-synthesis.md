# Synthesis: the eudonia color system

What eudonia should ship, derived from the literature (01), the perceptual constraints (02), the proven derivation patterns (03), and the modern library survey (04).

This is the practical entry point. The four source docs back the claims; this one is the proposal.

## The aim restated

Make it stupid easy for a consumer to ship charts that respect best practices, while not blocking advanced override. A consumer should:

- **Pass nothing** → get fantastic-looking, color-blind-safe defaults.
- **Pass 1–2 brand anchors** → get a full perceptually-uniform palette derived from their brand.
- **Pass raw colors** → full control, no abstraction in the way.

The literature is firm: never bake in semantic colors. But "accept consumer-defined" doesn't mean "require." Best-in-class means consumers shouldn't have to author 9 colors to get a great chart.

## The four palette kinds

Mapped to data type, per Bertin/Brewer:

| Kind | Data type | Example use | What varies |
| --- | --- | --- | --- |
| **Categorical** | Nominal (no order) | Series in a bar/line chart, treemap regions | Hue (equal L) |
| **Sequential** | Ordinal / quantitative one-direction | Heatmap by magnitude, choropleth, sequential treemap | Lightness (single hue, or multi-hue with monotonic L) |
| **Diverging** | Quantitative through a midpoint | Variance to budget, profit/loss, sentiment | Hue + lightness through a neutral |
| **Status** (semantic) | Bounded categorical with conventional meaning | Positive/negative cells, alert/warning indicators | Single named color per status |

Eudonia exposes all four. Consumers don't have to *think* about these names; they emerge from the component used.

## The architecture

### Foundation: CSS tokens

Already in place. We extend:

```
/* Categorical (existing, refresh) */
--eudonia-chart-cat-1..N

/* Sequential (new) — single-hue ramp */
--eudonia-chart-seq-1..N        /* light → dark; 1 = lightest, N = darkest */

/* Diverging (new) — symmetric ramp through a neutral */
--eudonia-chart-div-low         /* the "negative" end */
--eudonia-chart-div-mid         /* the perceptually neutral middle */
--eudonia-chart-div-high        /* the "positive" end */
/* (Optional N-step expansion for explicit ramps) */
--eudonia-chart-div-1..N

/* Status (existing, possibly rename) */
--eudonia-positive
--eudonia-negative
--eudonia-warning
--eudonia-info
```

All authored in OKLCH. Light and dark variants designed (not auto-flipped).

### Layer 1: Named palettes (CSS-only)

Consumers swap the whole token set by selecting a named palette:

```jsx
<Screen palette="default">         {/* default is implicit */}
<Screen palette="apple-pastel">
<Screen palette="monochrome">
<Screen palette="editorial">
<ChartCard palette="warm">         {/* override per-card */}
```

Implementation: each named palette is a CSS rule that sets the `--eudonia-chart-cat-1..N` (and `seq`, `div`) tokens to a specific palette. Defined in `theme.css`, opt in via attribute selector.

Named palettes shipped:

**Categorical:**
- `default` — current curated, blue-anchored, restraint-leaning
- `apple-pastel` — pastel HIG-flavored
- `monochrome` — single-hue ramp at varying L (pure restraint)
- `editorial` — Stripe/Linear/Vercel-flavored (mostly grays with one accent)

**Sequential:**
- `blues` (default for sequential)
- `greens`
- `warm-grey`
- `cool-grey`

**Diverging:**
- `bad-good` (default — red↔neutral↔green, perceptually balanced)
- `cool-warm` (blue↔neutral↔red)
- `rdbu` (ColorBrewer classic)

All are color-blind safe (verified, not assumed).

### Layer 2: Derivation helpers (JS)

For consumers who hand us their brand colors. Returns a palette object that can be passed to `palette={...}`:

```ts
import { defineCategorical, defineSequential, defineDiverging } from "eudonia/color";

// Categorical: anchor + harmonic spread
const myPalette = defineCategorical({
  anchor: "oklch(0.55 0.14 230)",  // brand blue
  // optional:
  // size: 8,                       // default 8
  // hueSpread: "wide" | "narrow",  // default "wide"
});

// Sequential: single hue or two-hue
const heat = defineSequential({
  hue: "oklch(0.55 0.14 230)",     // brand blue → light blue → dark blue
  // size: 9,
});

// Diverging: two anchors meeting at a perceptual neutral
const variance = defineDiverging({
  low: "oklch(0.6 0.18 25)",       // brand red
  high: "oklch(0.6 0.16 150)",     // brand green
  // mid: auto                      // neutral derived between
  // size: 7,
});
```

**Derivation rules** (this is the core IP):

- **Categorical from anchor:** Anchor at slot 1. Generate slots 2..N by walking H by ~360/N° around the wheel (with adjustments to avoid the perceptually-bad zones), holding L equal-ish, holding C in band. Color-blind check on output; warn on collision.
- **Sequential from anchor:** Generate N stops varying L from 0.95→0.25 (light→dark), holding H constant, varying C to maintain visual saturation at extreme L (chroma must drop near L=1 and L=0 to stay in gamut).
- **Diverging from two anchors:** Generate N stops by interpolating in OKLCH from `low` through a perceptually neutral midpoint to `high`. The midpoint is computed as L=0.95, C≈0 (paper) for light mode or L=0.25, C≈0 for dark mode.

All derivation in OKLCH. All output is OKLCH strings (CSS-renderable in current browsers).

### Layer 3: Raw override

Always available. Pass a string array (or single string) to `palette=`:

```jsx
<BarChart palette={["#3b82f6", "#10b981", "#f59e0b"]} />
<BarChart palette={["oklch(0.6 0.14 230)", "oklch(0.6 0.12 165)"]} />
```

No magic; no derivation; no checks. Consumer is on their own.

### Component API

`palette` prop on every chart component. Polymorphic:

```ts
type PaletteProp =
  | string                          // named palette: "default", "apple-pastel", etc.
  | string[]                        // raw color array
  | DerivedPalette                  // returned from defineXxx helpers
  | { categorical?, sequential?, diverging? }  // partial override, kind-keyed
```

The component picks the right *kind* based on what it is:

- `<BarChart>`, `<LineChart>` → categorical
- `<Treemap>` (default) → categorical (region color); `<Treemap variant="heatmap">` → sequential
- `<Heatmap>` → sequential (or diverging if pivot specified)
- `<TableCard>` `signal: "delta"` → diverging
- `<Sparkline>` → cat-1 (single anchor)

### Status colors

These are semantic, not palette. Stay as standalone tokens (`--eudonia-positive`, etc.). Do not include in categorical palettes — Few/Tufte are firm that semantic color must not be repurposed for category encoding.

Consumers can override status colors via the same `defineXxx`-style helper or just by setting the token.

## Defaults to ship (concrete proposals — values are placeholders for tuning)

### Categorical: `default`

8 colors, blue-anchored, color-blind safe, equal L, moderate C:

```
1. oklch(0.6 0.14 230)   blue       (anchor)
2. oklch(0.7 0.13 60)    orange     (the canonical CB-safe pair to blue)
3. oklch(0.55 0.13 295)  violet
4. oklch(0.6 0.12 165)   teal
5. oklch(0.7 0.13 75)    amber
6. oklch(0.65 0.09 200)  slate-blue
7. oklch(0.55 0.13 340)  magenta
8. oklch(0.68 0.12 110)  moss
```

Slot 1 = blue, slot 2 = orange (the well-known color-blind-safe pair, also Tableau 10's opening).

### Categorical: `apple-pastel`

```
1. oklch(0.72 0.13 250)  blue
2. oklch(0.74 0.12 150)  green
3. oklch(0.72 0.15 25)   red
4. oklch(0.77 0.13 60)   orange
5. oklch(0.86 0.12 95)   yellow
6. oklch(0.68 0.13 295)  purple
7. oklch(0.76 0.13 350)  pink
8. oklch(0.72 0.10 195)  teal
```

### Categorical: `monochrome`

8-step ramp in a single cool hue (the page anchor). For when restraint is the brief:

```
1. oklch(0.60 0.10 220)  primary anchor
2. oklch(0.50 0.08 220)
3. oklch(0.70 0.08 220)
... etc.
```

### Categorical: `editorial`

Mostly neutrals with a single accent. Stripe/Vercel direction:

```
1. oklch(0.55 0.14 230)  accent (the only saturated)
2. oklch(0.65 0.005 220) gray-1
3. oklch(0.5 0.005 220)  gray-2
4. oklch(0.75 0.005 220) gray-3
... etc.
```

### Sequential: `blues` (default)

9 stops, single hue, L 0.95 → 0.25:

```
oklch(0.95 0.02 230)
oklch(0.88 0.05 230)
oklch(0.80 0.08 230)
oklch(0.72 0.10 230)
oklch(0.62 0.13 230)
oklch(0.52 0.14 230)
oklch(0.42 0.13 230)
oklch(0.32 0.10 230)
oklch(0.22 0.07 230)
```

### Diverging: `bad-good` (default)

7 stops, red ↔ neutral paper ↔ green, symmetric L on each arm:

```
oklch(0.55 0.16 25)   red strong
oklch(0.70 0.12 25)   red soft
oklch(0.85 0.06 25)   red wash
oklch(0.96 0   220)   neutral (paper-tinted)
oklch(0.85 0.06 150)  green wash
oklch(0.70 0.12 150)  green soft
oklch(0.55 0.16 150)  green strong
```

(All values placeholders. Final tuning is a separate pass.)

## API ergonomics — how it actually feels

### Case 1: out of the box

```jsx
<Screen>
  <BarChart data={revenue} dataKey={["actual", "budget"]} xKey="month" />
</Screen>
```

Two bars: blue and orange (CB-safe pair from default categorical). Done. Looks great.

### Case 2: switch palette

```jsx
<Screen palette="apple-pastel">
  <BarChart data={revenue} dataKey={["actual", "budget"]} xKey="month" />
</Screen>
```

Two bars: pastel blue and pastel green. One change.

### Case 3: diverging on a delta column

```jsx
<TableCard
  data={products}
  columns={[
    { key: "growth", format: "percent", signal: { kind: "diverging" } },
  ]}
/>
```

Negative growth → red wash; positive → green wash. From default `bad-good`.

### Case 4: brand-derived

```jsx
import { defineCategorical } from "eudonia/color";

const ourPalette = defineCategorical({ anchor: "oklch(0.55 0.18 280)" });

<Screen palette={ourPalette}>
  <BarChart ... />
</Screen>
```

Slot 1 = brand violet; slots 2..8 are perceptually-uniform companions derived from it. The consumer hands one color and gets a full palette in their brand.

### Case 5: brand diverging

```jsx
import { defineDiverging } from "eudonia/color";

const ourBadGood = defineDiverging({
  low: "oklch(0.6 0.18 15)",     // company red
  high: "oklch(0.55 0.16 145)",  // company green
});

<TableCard
  signal={{ kind: "diverging", palette: ourBadGood }}
  ...
/>
```

Or set globally:

```jsx
<Screen diverging={ourBadGood}>
  ...
</Screen>
```

All TableCards (and any component using diverging) inside use the brand-derived palette.

### Case 6: full raw

```jsx
<BarChart palette={["#1a73e8", "#34a853", "#fbbc04", "#ea4335"]} />
```

No magic. Hex strings, in order. Done.

## What we won't do

- **Quantize images for palette extraction** (Material's specialty). Not our use case.
- **Closed 22 × 11 hand-tuned grid** (Tailwind's specialty). We derive instead.
- **One color per UI role** (Radix's strength). We're charts, not UI surfaces. Radix can sit alongside us; consumers can use both.
- **A theme registry / DSL** (ECharts). Too heavy for our scope.
- **Force all consumers through the helpers.** Raw arrays always work.

## Open questions for the grill-me pass

These are the load-bearing decisions worth pressure-testing before code:

1. **Component API: `palette=` prop, or split (`categorical=`, `sequential=`, `diverging=`)?** Polymorphic prop is friendlier; split is more explicit.
2. **Named palettes via string literal vs imported constant.** String literals are compact (`palette="apple-pastel"`) but typo-fragile and not tree-shakeable. Imported constants (`palette={palettes.apple.pastel}`) are typed and tree-shaken. Could support both — strings resolve to constants internally.
3. **Where do `defineCategorical` / `defineSequential` / `defineDiverging` live?** A new export `eudonia/color` package? Or `eudonia/palette`? Shape of the export.
4. **Color-blind safety check — opt-in or always-on dev warning?** Always-on dev warning has false-positive risk; opt-in might be ignored.
5. **Dark mode derivation: rules-based vs hand-authored?** Rules are easier; hand-authoring is more controlled. Hybrid: ship hand-authored dark variants for the named palettes; auto-derive for `defineXxx`-derived palettes.
6. **Diverging midpoint: auto-compute vs explicit?** Auto from the data extent (min and max equidistant from 0 → pivot at 0; otherwise weighted) is "smarter" but unpredictable. Explicit is what Plot does.
7. **Should the "1 brand color → full palette" derivation guarantee color-blind safety, or only attempt it?** A brand anchor at certain hues makes a CB-safe palette impossible; we'd have to warn or compromise.
8. **Status colors vs categorical: hard separation or overlapping?** Stripe/Linear use the same color (e.g. green for success and for one of the status pills). A hard separation is purer; consumers may want overlap.
9. **Naming.** `apple-pastel` is descriptive but legally awkward; could be `pastel`, `tinted`, `soft`. `editorial` could be `restraint`, `mono-accent`. Naming is bikeshed-y but it's public API.
10. **Treemap default color: cat-1 (single-color treemap) vs categorical (regions = cat colors)?** Currently single-color via `--eudonia-chart-treemap`; could default to multi-color via cat palette. Decide.

## Summary recommendations

1. **Keep CSS tokens as the foundation.** Add `--eudonia-chart-seq-*` and `--eudonia-chart-div-*` token groups.
2. **Ship 4 named categorical palettes** (`default`, `apple-pastel`, `monochrome`, `editorial`) as CSS rules selectable via `palette=` attribute.
3. **Ship 4 named sequential palettes** and **3 named diverging palettes** in the same way.
4. **Build `defineCategorical` / `defineSequential` / `defineDiverging` helpers** in OKLCH that consumers can use to derive from their brand.
5. **Status colors stay as standalone tokens.** Don't fold into palettes.
6. **Color-blind safety: always-on dev warning** when a derived palette has problematic pairs; user can suppress via flag.
7. **Dark variants: hand-author for named palettes, derive for consumer-derived.**
8. **API surface: single `palette=` prop**, polymorphic (string | array | derived object | partial overrides).

This gives us defaults that don't make consumers think, derivation that makes brand integration trivial, and raw override for full control. Three layers, increasing specification, similar ergonomics at each level.

The grill-me pass should pressure-test the open questions before any code lands.
