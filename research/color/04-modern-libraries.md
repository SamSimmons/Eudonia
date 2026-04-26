# Modern viz libraries: how they expose color

Quick survey of how peer libraries surface palette/color decisions to the consumer. Looking at what works, what's clunky, and where eudonia's API can be better.

## Observable Plot

Already covered in 03. Recap:

- Color *kind* implied by data semantics + chart type.
- Named scheme strings (`"blues"`, `"rdbu"`, `"tableau10"`).
- Explicit overrides accept arrays.
- Diverging requires explicit `pivot:` (default 0).

**Strength:** Excellent defaults; almost zero ceremony for the common case.
**Weakness:** Strings as first-class palette identifiers (typos fail silently); no derivation helpers.

## d3 + d3-scale-chromatic

Library-level primitive. The shape:

```js
const color = d3.scaleOrdinal(d3.schemeTableau10);
const heatmap = d3.scaleSequential(d3.interpolateBlues);
const diverging = d3.scaleDiverging(d3.interpolateRdBu).domain([-1, 0, 1]);
```

**Strength:** Comprehensive scheme library, perceptually correct, infinitely composable.
**Weakness:** Low-level. Consumers do all the wiring — pick a scheme, build a scale, hand it to a mark. Easy to mis-pair (e.g. categorical scheme on a sequential scale).

## Recharts

The most common React charting library. Its color system:

```jsx
<Bar dataKey="revenue" fill="#8884d8" />
<Bar dataKey="cost" fill="#82ca9d" />
```

**Strength:** Trivially simple — pass a color string per series.
**Weakness:** Defaults are arbitrary purple/green hex codes that look like a 2014 wireframe. No palette concept, no theming, no derivation. Every consumer authors their own colors. The "easy chart" assumption produces uniformly mediocre charts.

This is exactly the trap eudonia should avoid.

## Tremor

React dashboard library focused on aesthetic. Color system:

```jsx
<BarChart colors={["blue", "amber", "rose"]} />
```

Color names map to a fixed Tremor palette (~20 named colors, each with light/dark variants).

**Strength:** Named colors are friendlier than hex; pre-curated palette is always usable.
**Weakness:** The named palette is closed — 20 colors, take it or leave it. Brand colors require hex passthrough, which loses the named-token benefit. Diverging is not a first-class concept.

## Vega / Vega-Lite

Declarative grammar of graphics. Color via:

```js
{ "encoding": { "color": { "field": "category", "type": "nominal" } } }
{ "encoding": { "color": { "field": "revenue", "type": "quantitative", "scale": { "scheme": "viridis" } } } }
```

**Strength:** Type system disambiguates (nominal → categorical, quantitative → sequential). Scheme names cover the d3-scale-chromatic universe.
**Weakness:** Verbose. Consumer must understand the full Vega grammar; color is one of many encodings to specify.

## Chart.js

The browser-default. Colors specified per dataset:

```js
{ datasets: [{ label: "A", backgroundColor: "rgba(255, 99, 132, 0.5)" }] }
```

**Strength:** Familiar; works.
**Weakness:** rgba strings; no palette concept; defaults are bright primary colors that announce "Chart.js was here."

## Apache ECharts

```js
{ color: ['#5470c6', '#91cc75', '#fac858', ...] }
```

Or via theme objects (`echarts.registerTheme(name, themeConfig)` — full theme covering hundreds of properties).

**Strength:** Full theming engine; ships several built-in themes (dark, vintage, macarons, etc.).
**Weakness:** Theme configs are massive; deep customization needs are common because defaults are dated.

## What eudonia can do better than all of these

1. **Defaults that don't say "library X was here."** Plot mostly nails this; Recharts/Chart.js fail. Eudonia's defaults should look like a thoughtfully-designed dashboard, not a generic chart.

2. **Color *kind* implied where possible.** A `<Heatmap>` doesn't need a `paletteKind="sequential"` prop — it's a heatmap. A `<BarChart>` with multiple series defaults to categorical. Diverging needs an opt-in (consumer specifies the midpoint or a `diverging` palette).

3. **Anchor-based derivation as a first-class API.** None of the libraries above let a consumer say "here are my brand colors, give me the palette." Tremor comes closest but is closed; Plot/d3 punt entirely. This is the eudonia opportunity.

4. **Token-driven, scope-overridable.** CSS variables let any subtree override; React props let a single component override. Both should compose.

5. **Color-blind safety as a default-on warning.** `defineCategorical` returns the palette plus, in dev mode, a warning if any pair fails simulation.

6. **Dark mode auto-derived.** Light palette defined; dark palette computed via the OKLCH rules outlined in 02. Consumer can override the dark variant explicitly if needed.

## Anti-patterns to avoid

From this survey:

- **Hex codes as the API surface** (Recharts). Loses semantic meaning.
- **Closed palette of N named colors** (Tremor). Brand colors don't fit.
- **Theme objects with hundreds of keys** (ECharts). Customization is unergonomic.
- **No defaults** (d3). Every chart starts from scratch.
- **Defaults that look 2014** (Recharts, Chart.js). Sets the visual ceiling.

## What we want (synthesis)

```jsx
// No input — get great categorical default
<BarChart data={data} dataKey={["actual", "scenario"]} />

// Pass a named palette
<BarChart data={data} dataKey={...} palette="apple-pastel" />

// Pass anchors, derive
const palette = defineCategorical({ anchor: brandBlue });
<BarChart palette={palette} ... />

// Fully custom
<BarChart palette={["oklch(...)", "oklch(...)"]} ... />

// Diverging with brand anchors
<TableCard data={...} columns={[{ key: "delta", signal: { kind: "diverging", low: brandRed, high: brandGreen, pivot: 0 } }]} />
```

The shape: defaults → named → derived → raw, in increasing levels of consumer specification. Most consumers stop at "defaults." Some go to "named." A few use "derived." A handful drop to "raw." The API supports all four with similar ergonomics.
