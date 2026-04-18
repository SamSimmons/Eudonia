# Axes

Survey of how existing chart libraries configure ticks, labels, and axis chrome, and how a handful of them handle label collisions at small widths. Written to inform the design of Eudonia's axis primitive and the `tickDensity` intent knob on the component layer.

## 1. How ticks are configured — five libraries

For each library: the declarative / 80%-case form, the escape hatch, and whether you can decouple the axis line from ticks and gridlines. Code snippets over prose.

### ggplot2 (R) — `scale_*_continuous`

Hadley-pattern: every argument defaults to `waiver()`, which means "do the default thing." You only override the parts you care about.

```r
# Declarative — let ggplot pick breaks and labels.
p + scale_y_continuous()

# Intent knob — ask for ~3 breaks, let the algorithm choose positions.
p + scale_y_continuous(n.breaks = 3)

# Consumer formatter via scales:: helpers (small handful shipped).
p + scale_y_continuous(labels = scales::label_percent())
p + scale_x_continuous(labels = scales::label_comma())

# Full control — explicit vectors.
p + scale_x_continuous(breaks = c(2, 4, 6), labels = c("two", "four", "six"))

# Function form — break positions computed from limits.
p + scale_x_continuous(breaks = function(limits) pretty(limits, n = 5))
```

- `breaks`, `labels`, `minor_breaks` each accept: `NULL` (off), `waiver()` (default), a vector, or a function of limits.
- `n.breaks` is the soft intent knob — what eudonia's `tickDensity` roughly maps to.
- Default break algorithm is `labeling::extended` (a "pretty" algorithm descended from Wilkinson).
- Axis line / tick visibility lives in **theme**, not in `scale_*`. `theme(axis.line.y = element_blank(), panel.grid.major.y = element_line())` hides the axis line while keeping gridlines. Clean separation.

**Source:** [scale_continuous reference](https://ggplot2.tidyverse.org/reference/scale_continuous.html).

### Plotly (JS) — `layout.xaxis` config object

Three explicit tick modes, each with its own required companions. No hidden inference.

```js
// Declarative — let Plotly pick.
{ xaxis: { tickmode: "auto", nticks: 10 } }

// Linear — explicit step from a start.
{ xaxis: { tickmode: "linear", tick0: 0, dtick: 5 } }

// Array — explicit positions + labels.
{ xaxis: { tickmode: "array", tickvals: [1, 5, 10], ticktext: ["Low", "Mid", "High"] } }

// D3 format string for the 80% case.
{ xaxis: { tickformat: ".0%" } }
```

Chrome is fully decoupled — each piece has its own flag:

```js
{
  xaxis: {
    showline: false,      // axis line off
    showgrid: true,       // gridlines on
    ticks: "outside",     // keep tick marks
    showticklabels: true,
    zeroline: false,
  }
}
```

**Source:** [xaxis reference](https://plotly.com/javascript/reference/layout/xaxis/).

### d3-axis + d3-scale

Reference implementation that every React chart library wraps. Minimal, entirely pass-through.

```js
const axis = d3.axisBottom(scale)
  .ticks(5, "$,.0f")          // count hint + d3-format specifier
  .tickFormat(d3.format(".0%"))
  .tickSize(6)
  .tickPadding(3);

// OR — explicit values. Beats .ticks() when both are set.
axis.tickValues([0, 0.25, 0.5, 0.75, 1]);
```

- `.ticks(count)` forwards to `scale.ticks(count)` — d3-scale owns the "pretty" algorithm, not d3-axis.
- `.tickValues(values)` wins over `.ticks()`. From [the source](https://github.com/d3/d3-axis/blob/main/src/axis.js): `var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues`.
- No collision handling. Rotation, skipping, measurement — all external. You render what you're told.
- Axis line and ticks share one `<path class="domain">` element by convention; hiding one via CSS doesn't affect ticks. Gridlines aren't part of d3-axis at all — you draw them yourself from `scale.ticks()`. That's actually the property Eudonia wants: gridlines align by consuming the same tick values the axis uses.

**What's not possible without dropping out:** any responsive / measurement behavior. You need to implement it on top.

**Source:** [d3-axis API](https://d3js.org/d3-axis).

### Recharts — `<XAxis />`

React-idiomatic, prop-shaped. Notably high-level: `interval` is the only real knob for collision handling.

```jsx
<XAxis
  dataKey="month"
  interval="preserveStartEnd"    // default is "preserveEnd"
  tickFormatter={(v) => v.slice(0, 3)}
  minTickGap={5}                 // px gap threshold for internal skipping
  axisLine={false}
  tickLine={false}
/>

// Full control — explicit ticks + count.
<XAxis ticks={[0, 3, 6, 9, 12]} tickCount={5} />
```

`interval` options:

- `0` — show every tick.
- `"preserveStart" | "preserveEnd" | "preserveStartEnd"` — auto-skip on collision, preserve the named endpoint(s).
- `"equidistantPreserveStart" | "equidistantPreserveEnd"` — find N such that every Nth tick fits.
- A number — show every Nth tick.

Chrome is decoupled: `axisLine={false}` hides the line, `tickLine={false}` hides the marks, and the `<CartesianGrid />` component is a sibling that consumes the same tick positions — matches Eudonia's context-sharing model exactly.

**Source:** [recharts XAxis API](https://recharts.github.io/en-US/api/XAxis/).

### Highcharts — `xAxis` config

Mature commercial lib. Notable for exposing the escape hatch as a function that receives the axis context.

```js
// Declarative step.
xAxis: { tickInterval: 1 }

// Explicit positions.
xAxis: { tickPositions: [0, 3, 6, 9, 12] }

// Escape hatch — function with access to axis internals.
xAxis: {
  tickPositioner: function () {
    // `this.tickPositions` has the default auto-computed positions.
    // Return the array you actually want.
    return [this.dataMin, (this.dataMin + this.dataMax) / 2, this.dataMax];
  }
}

// Formatter and auto-rotation.
xAxis: {
  labels: {
    formatter: function () { return "$" + this.value; },
    autoRotation: [-45],  // rotation angles tried when labels overlap
    step: 1,              // show every Nth label
  }
}
```

Chrome decoupled: `lineWidth: 0` hides the axis line; `gridLineWidth` and `tickLength` are independent. Labels have their own `autoRotation` array (tries angles until they fit) — genuine responsive behavior built in.

**Source:** [xAxis.tickPositioner](https://api.highcharts.com/highcharts/xAxis.tickPositioner).

### Cross-cutting observation

Every library we looked at **can** decouple axis-line visibility from tick / gridline visibility. None of them force them coupled. The design question for Eudonia is not "can we" but "what does the default case look like" and "do gridlines consume axis tick context or compute their own?" Recharts' sibling model (`<CartesianGrid />` reads the same tick values) is the cleanest prior art for that.

High-level vs low-level API split maps onto Eudonia's component/primitive split directly:

| Library | High-level (intent) | Low-level (control) |
|---|---|---|
| ggplot2 | `n.breaks = 3` | `breaks = c(...)` or `breaks = fn` |
| Plotly | `tickmode: "auto", nticks: 10` | `tickmode: "array", tickvals, ticktext` |
| d3 | `.ticks(5)` | `.tickValues([...])` |
| Recharts | `interval="preserveStartEnd"` | `ticks={[...]}` + `tick={renderFn}` |
| Highcharts | `tickInterval: 1` | `tickPositioner: fn` |

## 2. Measurement-based collision handling — reading source

### d3-axis

**Confirmed: no measurement, no collision handling.** From `d3-axis/src/axis.js`:

```js
var values = tickValues == null
  ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain())
  : tickValues;
```

That's the whole decision. `.ticks(count)` and `.tickValues()` are mutually exclusive (values wins). No `measureText`, no bounding-box check, no rotation fallback, no skipping. The library explicitly delegates styling and responsiveness to the consumer.

### Observable Plot

**Also confirmed: no automatic overlap handling.** Their [axis mark docs](https://observablehq.com/plot/marks/axis) say "if the tick spacing in a plot is too narrow for the width, the labels will overlap." The canonical workaround is [filtering ticks manually in an Observable notebook](https://observablehq.com/@observablehq/removing-overlapping-labels-from-time-axis-in-plot).

Plot has `ticks` (count) and `tickSpacing` (pixel separation — a coarse declarative guard), but no `measureText` pass. Open issue [#383](https://github.com/observablehq/plot/issues/383) tracks "Automatic margins based on tick label length" — still not done as of this writing.

So the entire d3 family (d3, Plot) does **not** do measurement-based collision. They expose hooks and expect you to compose it yourself.

### Vega / Vega-Lite

**This is the real prior art.** Axis has a `labelOverlap` option with three modes:

- `false` — no reduction (default for linear axes where step is chosen not to overlap).
- `true` / `"parity"` — drop every other label; recurse if still overlapping. Works for regular spacing.
- `"greedy"` — linear scan; drop any label whose bounding box intersects the previous kept label's. Works for irregular spacing (log, symlog).

Plus `labelSeparation` (extra px buffer around each box).

```json
{
  "encoding": {
    "x": { "axis": { "labelOverlap": "greedy", "labelSeparation": 5 } }
  }
}
```

**Measurement mechanism:** Vega uses canvas `measureText` as ground truth, with an LRU cache keyed by `(font, text)`. Source: `vega-scenegraph/src/util/text.js`. Fallback when canvas is unavailable is `0.8 * text.length * fontSize` (crude but safe).

**When in the render cycle:** labels are measured after tick positions are computed. The filter runs over the already-positioned label set, producing a kept subset passed to render. Re-runs when the plot resizes.

**Algorithm summary (paraphrased from the [2024 "Legible Label Layout" paper](https://arxiv.org/abs/2405.10953) and [vega-label repo](https://github.com/vega/vega-label)):**

- *Parity:* bbox-test adjacent pairs; if any overlap, drop every second label (keeping the first); repeat until no overlap. Converges fast because each pass halves candidates.
- *Greedy:* walk labels in order; keep the current one only if its bbox doesn't overlap the last-kept label's bbox (plus `labelSeparation`).

Both keep axis endpoints by preference — same instinct as Recharts' `preserveStartEnd`.

### Summary for Eudonia

- If we want measurement-based collision, only Vega and Highcharts ship it as a library primitive. Vega is open source and the algorithm is small.
- The rest of the ecosystem either ignores the problem (d3, Plot) or resolves it with coarse declarative skip rules (Recharts `interval`, Plot `tickSpacing`). Recharts' approach is interesting: it *does* measure (otherwise `minTickGap` wouldn't work), but it doesn't expose the measurement to the user, only the high-level skip intent.
- Canvas `measureText` with an LRU cache is the de facto method. Works for SVG text too as long as the font-family/size match — you measure with the same font metrics the browser will use for SVG. This is exactly what pretext claims to optimize.

## 3. Pretext (Cheng Lou)

What it actually is: a **text measurement and layout library** that avoids DOM reflow by implementing its own measurement atop the browser's font engine. Ships as `@chenglou/pretext`. Creator: Cheng Lou (ex–React Motion). 44.5k stars, actively maintained.

**Core claim:** 300–600x faster than `getBoundingClientRect` / `offsetHeight` for multiline layout, because those trigger synchronous reflow. Pretext reads font metrics once and does the line-breaking math itself.

**API surface (relevant bits):**

```ts
import { prepare, layout, layoutWithLines } from "@chenglou/pretext";

// Total height for text at a width.
const { height } = layout(prepare(text, font), width);

// Line-by-line breakdown for custom rendering.
const { lines } = layoutWithLines(prepare(text, font), width);
// lines: [{ text, width, ascent, descent }, ...]
```

**Rendering targets:** DOM, Canvas, SVG — pretext is render-agnostic; it produces geometry, you draw. Site: [pretextjs.net](https://pretextjs.net/) shows SVG and canvas demos. Works in React, Vue, vanilla.

**Gotchas for axis labels:**

- It's optimized for **multiline wrap** ("width-tight multiline UI"). Axis labels are mostly single-line, short strings. The problem Pretext solves hardest — Knuth-Plass justification, line routing around obstacles — doesn't apply to axes.
- It still does fast single-string width measurement (that's a prerequisite for its layout), so you can use `prepare(text, font)` purely as a fast `measureText`. But you're paying for a 15KB library to get something canvas already provides.
- Font has to match the rendered font exactly. Same gotcha as canvas `measureText`.

**Verdict on depending on it:** For axis labels specifically, **probably overkill**. Canvas `measureText` with an LRU cache (10–20 lines of code, Vega's approach) covers the single-line measurement case. Pretext becomes worth it only if we later want multi-line labels, wrapped tick labels, or rich-inline label text. Reasonable to revisit then; reach for canvas now.

## 4. Tufte / Wilke on axis minimalism

### Tufte — data-ink ratio

- "Erase non-data-ink, within reason." Axis lines, redundant gridlines, tick marks beyond what's needed are all explicit targets.
- Sparklines: "small, intense, word-sized" — the shrink principle says chrome must disappear at small sizes.
- Caveat from subsequent research: the 1994 Carswell et al. experiments pushed back — some non-data-ink (gridlines, axis lines) improves reading speed and accuracy. Tufte's principle is a starting point, not a rule.

### Wilke — *Fundamentals of Data Visualization*

From [ch. 23 "Balance the data and the context"](https://clauswilke.com/dataviz/balance-data-context.html):

- **Omit axis lines when using background grids** — the grid is the frame. Don't double up.
- **Grid lines perpendicular to the key variable are most useful.** Time-series → horizontal grid only. Bar chart → vertical grid only.
- Prefers "minimal, light grids on a white background" over dense or heavy grids.
- Warns against removing everything: "data points seem to float in space" and become harder to read.

### What this means for our defaults

For the Gross Margin % tile (small dashboard tile, 3 y-ticks, 12 monthly x-labels):

- Axis line hidden, horizontal gridlines visible at tick positions — matches Wilke's frame-via-grid recommendation.
- Tick marks optional / off by default on the chrome-lite preset; labels close to the data.
- Restraint scales with tile size: at sparkline-size, drop the labels entirely (Tufte's shrink principle). At tile-size, 3 y-labels and monthly x-labels.

## 5. Recommendation

**API shape — closest prior art:** **ggplot2's scale_\* + Recharts' XAxis, combined.**

- ggplot2's `waiver()`-everywhere pattern is the right default model. Every prop has three valid states: "do the default," "turn off," "explicit value/function." Maps onto our primitive cleanly:
  - `ticks`: `undefined` (auto) | `false` (none) | `number[]` (explicit) | `(scale) => number[]` (function).
  - `labels`: same pattern.
  - `n.breaks` ↔ our `tickDensity` on the component layer.
- Recharts' sibling-gridline model is the right mechanism — both the axis and the `<Gridlines>` primitive read tick positions off the axis context. This is already the decision we've made; Recharts confirms it works.
- The chrome flags (`hideAxisLine`, `hideTicks`, `hideLabels`) match Plotly's separate-flags model. Don't collapse them.

**Measurement — copy Vega.** Canvas `measureText` with an LRU cache keyed by `(font, text)`. Fallback to `0.8 * len * fontSize` for SSR / no-canvas. Algorithm:

1. Compute candidate tick positions from the scale.
2. Format each label via the consumer-provided formatter.
3. Measure each. Determine required chart margin from the widest y-label; reserve.
4. For x-axis: walk positions, drop with **parity** first (cheap; good for regular spacing like monthly data), fall back to **greedy** if the axis has a non-uniform scale. Recharts' `preserveStartEnd` behavior is essentially parity that pins endpoints — worth matching as the default since it maps onto "always show first and last month."

**Pretext — don't depend on it.** Axis labels are short, single-line. Canvas `measureText` plus cache covers it in ~20 lines with zero dependencies. Keep pretext in the back pocket for a future wrapped-label or multi-line legend primitive.

**Honest caveats:**

- Nothing in prior art is quite our shape. Every library either buries measurement (Vega — it just works but you can't compose it) or skips it entirely (d3 — composable but you DIY everything). Our primitive-plus-component split means we need to expose the measurement machinery at the primitive layer (so `<Gridlines>` can read `tickPositions` from context *after* pruning) and hide it behind `tickDensity` at the component layer. That's new territory; no one ships it exactly this way.
- Vega's `labelOverlap` runs after positions are chosen. We should verify our context ordering: does `<Gridlines>` render against pre-prune positions or post-prune? We probably want post-prune (labels and gridlines agree) but pre-prune is also defensible (gridlines show the scale's real tick structure; only labels drop). **Decide explicitly.**

## 6. Prior art inside the user's own work — screenhead

`/Users/samsimmons/code/screenhead/apps/web/src/components/Charts/` — a financial charting project. Worth studying because it's opinionated, ships, and the user finds the axis behavior "reasonable."

### What it does

- **No text measurement.** Zero `measureText` / `getBBox` / `getComputedTextLength` calls in the codebase.
- **Pixel-spacing budgets** drive tick count: `tickCount = max(2, floor(innerWidth / spacing))`, with `xTickSpacing=80px` and `yTickSpacing=50px` as defaults. (`chart-constants.ts`, `hooks.ts:193`.)
- **Anchor-based edge handling.** First tick renders with `textAnchor: "start"`, last with `"end"`, middle with `"middle"`. (`chart-ticks.ts:120–124`, `ChartTimeAxis.tsx:35`.) Lets edge labels extend without clipping — zero measurement needed.
- **Interval-aware tick selection for time axes.** For intraday (15min) it snaps ticks to day boundaries using timezone-aware logic. For daily+ intervals it uses index-even distribution with first/last always preserved. (`chart-ticks.ts:15`.)
- **Log-space pixel-even ticks** for log price axis. Distributes ticks evenly in pixel space, then inverts to data values — avoids d3's clumpy log tick output. (`chart-ticks.ts:91–114`.)
- **Shared scales via context; axes compute their own ticks.** Grid and axis both call `computeTimeTicks` with the same inputs — no shared tick array passed around. (`ChartGrid.tsx:27`.) Matches the context-sharing pattern Eudonia already committed to.
- **Static margins** (`{top:16, right:64, bottom:40, left:0}`). No auto-margin.

### What this means for Eudonia

Screenhead's approach is the **pixel-budget alternative** to Vega's measurement approach. It works because financial charts have homogeneous label widths (prices and timestamps are bounded in length). It's simpler, has no render-measure-rerender cycle, and ships in production.

**Decision: Eudonia goes with Vega-style measurement, not screenhead-style pixel budget.** Dashboard label widths vary too much (`"5%"` vs `"$1,234,567"` vs `"Q1 2024"`) for a fixed-budget heuristic to hold. Measurement is the more adaptive choice and the extra engineering is justified by the use case.

**Take forward regardless:**

- **Anchor trick** (first=`start`, last=`end`, middle=`middle`) — orthogonal to the measurement decision, cheap, obviously correct. Use it.
- **Context-sharing pattern** — already our plan; screenhead is corroboration.
- **Log-space pixel-even ticks** — parked for when log scales come into scope.
- **Interval-aware tick snapping for time axes** — parked for when time axes come into scope (likely not v1 of the dashboard lib, but worth remembering when we get there).

## 7. Open questions the research surfaced

1. ~~**Context exposure: pre- or post-prune tick positions?**~~ **Decided: post-prune.** Labels and gridlines always agree in position; matches the Power BI tile and dashboard aesthetic. Chart orchestrates: `scale.ticks(target)` → canvas `measureText` on each formatted label → prune → publish `{scale, ticks}` to context → children render against final positions. Single render pass.
2. ~~**What does `tickDensity: "low" | "medium" | "high"` compile to?**~~ **Decided: pixel budget (target space-per-tick), not a literal count.** Starting guesses: `low` ~150px/tick, `medium` ~80px/tick, `high` ~50px/tick. Pipeline: `tickDensity` → pixel budget → `targetCount = floor(width / budget)` → `scale.ticks(targetCount)` → measurement pruning. Pruning strategy (parity vs greedy) is a library default, not exposed via `tickDensity`. Real budget numbers come from prototyping against the GM% tile and a few other sizes.
3. **Rotation as a fallback before dropping?** Highcharts tries `autoRotation: [-45]` before giving up. Probably out of scope for v1 — rotation breaks the clean look we want for dashboard tiles. Noting it as a future knob.
4. **SSR / first-render before measurement is possible.** Canvas `measureText` works without a live DOM in modern bundlers, but SVG text measurement via `getBBox` doesn't. Decision: use canvas measurement (which doesn't need mount) so the pruning happens in the same render pass as the layout — no two-pass flicker. Verify this holds for the 12-month tile.
5. **Auto-margin reserves space for y-labels — does it also reserve for the longest x-label on rotation?** If we keep rotation out of v1, irrelevant. If we add it, yes.
