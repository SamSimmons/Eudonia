# Stat Tile

## Naming

Not picking a name yet — this depends on decisions we haven't made (anatomy, variants in scope, how this sits alongside other Eudonia components). Recording candidates and what each signals so the pick is easier later.

### Names collected, grouped by signal

**Business performance / target-oriented** — "KPI" (Power BI KPI visual, Sigma KPI chart, Tableau, Horizon UI Statistics context, Tremor blocks gallery). Signals executive-dashboard, goal-tracking, target-vs-actual. Most widely used industry name.

**Observability / monitoring** — "Stat" (Grafana Stat panel), "Single Value" (Dynatrace, Looker, deprecated Sigma SVV). Leaner, real-time feel. "Stat" reads specifically as system-monitoring.

**Editorial / visual-first** — "Big Number" (Metabase Number, Superset Big Number family, Mode Big Number). Names the component by visual effect, not semantic role. Fits when the value is the story.

**Primitive-oriented / data-centric** — "Metric" (Tremor), "Metrics" (Tableau Metrics feature). Reads as a low-level building block. Tremor uses it as a primitive inside composed KPI cards.

**Generic container** — "Card" (Power BI Card, Tremor Card). Doesn't claim meaning; the stat is what goes *in* it. Loses scope clarity on its own.

**Other / idiosyncratic** — "Billboard" (New Relic — evocative, non-standard), "Ticker" (TradingView — specific to price+change, domain-bound), "Monitor" (Bloomberg — different concept; dense table, not a stat tile).

### Literature terms (sub-components and variants, not the tile itself)

- **Bullet graph** (Few) — the value-with-target variant's canonical visual form.
- **Sparkline / Dataword** (Tufte) — the embedded mini-trend and the inline-text variant.
- **Small multiples** (Tufte) — the KPI strip pattern.

### Tradeoffs to resolve when we pick

- **Scope signal**: "KPI" narrows to business performance; "Stat" to monitoring; "Big Number" to visual emphasis. A broader name (e.g. "Metric") stays open across domains.
- **Two-class model**: Eudonia has primitives and components. The primitive (headless) and component (polished) may want different names that pair well — e.g. `Metric` primitive + `KPICard` component, or similar. Worth considering as a pair.
- **Existing library context**: should sit comfortably alongside `Screen`, `Grid`, `Flex` — short, noun-shaped, visual.

## Prior art survey

### Observability

**Grafana — Stat panel** ([docs](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/stat/))
- Anatomy: title, value, optional name/label, optional sparkline background, optional percent-change, threshold-based color.
- Variants: color mode (none / value / background gradient / background solid), graph mode (none / area sparkline), text mode (auto / value / value+name / name / none), orientation (auto / horizontal / vertical).
- Threshold system: absolute or percentage bounds; color applies to value, background, and sparkline area.
- Auto-adjusts layout based on available space. Supports data links to other panels/dashboards.

**Datadog — Query Value widget** ([docs](https://docs.datadoghq.com/dashboards/widgets/query_value/))
- Anatomy: title, value, unit, optional change indicator, optional timeseries background, conditional formatting (background/font colors or custom images).
- Aggregations: avg / min / sum / max / last / percentile (p75, p90, etc.).
- Change indicator: comparison window (previous period / day / week / month / custom); display mode (relative / absolute / both / off); color semantics (increase-better / decrease-better / neutral).
- Timeseries background can be min-to-max scale, line, or bar.
- Conditional formatting rules reference raw metric units, not autoformatted display values.

### BI tools

**Power BI — Card visual** ([docs](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-card)) and **KPI visual** ([docs](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-kpi))
- Two distinct visuals: "Card" (single measure, large value; supports callout images, reference labels, supporting details) and "KPI" (value + target + status indicator + trend).
- November 2025 release unified old single-card and multi-card into one "Card" visual.
- KPI visual explicitly models three inputs: indicator (the value), trend axis, target goals.

**Tableau — KPI / Metrics** ([Visualize Key Progress Indicators](https://help.tableau.com/current/pro/desktop/en-us/kpi.htm))
- Historically a community-constructed pattern rather than a canned viz type.
- "Tableau Metrics" is a first-class feature for tracking KPIs across dashboards.
- Community consensus on anatomy (three essential elements): **value**, **trend**, **performance** (good/bad status).
- Heavy emphasis on visual hierarchy (value > name > context) and status communication via color + shape.

**Looker — Single Value chart** ([docs](https://cloud.google.com/looker/docs/single-value-options))
- Anatomy: value, custom title as subtext under the value, optional comparison field rendered as "Show as Value" or "Show as Change" (with up/down triangles, default red/green).
- "Calculate Progress" mode: divides primary value by comparison field (produces a progress percentage).
- Auto-resize font so the value fits the tile (min 14px); custom tooltips with Liquid templating.
- Color collections for themed dashboards.

**Metabase — Number chart** ([docs](https://www.metabase.com/docs/latest/questions/visualizations/numbers)) and **Trend chart** ([docs](https://www.metabase.com/docs/latest/questions/visualizations/trend))
- Two separate viz types: "Number" for the raw value, "Trend" for value-plus-change against a prior period.
- Conditional colors via rules on the Number chart.
- Multiple Number charts can be pivoted into a bar chart (unusual).

**Apache Superset — Big Number family**
- Three variants: **Big Number** (value only), **Big Number with Trendline** (value + sparkline), **Big Number with Time Period Comparison** (value + comparison against prior period, behind an experimental feature flag).
- Top headers and prefixes for context.
- Comparison window configurable (WoW, MoM, etc.).

**Sigma Computing — KPI chart** ([docs](https://help.sigmacomputing.com/docs/build-a-kpi-chart))
- Replaces the older "Single Value Visualization (SVV)" (worth noting — same company renamed the concept).
- Anatomy: value, optional trend line that reveals previous-period values on hover, comparison against benchmark/target.
- Conditional formatting via rule-based color rules on the text color.

**Mode — Big Number chart** ([blog intro](https://mode.com/blog/introducing-big-number-charts/))
- Anatomy: value, rate-of-change, optional sparkline, color scale, link-wrapping of the whole tile for drilldown.
- Format modes: absolute number or percentage.

### Analytics component libraries

**Tremor** ([Card docs](https://www.tremor.so/docs/ui/card), [KPI blocks gallery](https://blocks.tremor.so/))
- Architecturally distinctive: no single "KPI card" component. KPI cards are **compositions of primitives** — `Card` (container) + `Metric` (the large value) + `Text` (label/description) + `BadgeDelta` (change indicator with variants: increase / moderateIncrease / unchanged / moderateDecrease / decrease) + `Flex` (layout) + `ProgressBar` (optional).
- Blocks gallery advertises 29 KPI card variants (portfolio value, expenses breakdown, regional comparison, investment tables, etc.) — showing how wide the compositional space is when the primitives are right.
- This is the closest prior art to Eudonia's two-class (primitive/component) model: Tremor exposes both low-level primitives and pre-composed block patterns.

**Horizon UI — MiniStatistics and Statistics cards** ([Chakra docs](https://horizon-ui.com/docs-boilerplate/chakra-components/statistics), [shadcn docs](https://horizon-ui.com/docs-boilerplate/shadcn-components/statistics))
- Two tiers:
  - **MiniStatistics**: `name`, `value`, `growth` props — minimal KPI row element.
  - **Statistics**: adds `icon` and `title` props — more prominent, single-item dashboard card.
- Props-driven, not composition-driven (opposite of Tremor).
- Notable: names the two variants explicitly as separate components rather than as one component with a "size" prop.

**Refine** — skipped as prior art. Refine is a data/admin framework; KPI cards are user-assembled using whichever UI lib is bolted on (MUI, DaisyUI, Chakra, etc.). No first-class KPI component.

**Also surfaced**: Material Tailwind has a "KPI Cards" blocks section — similar model to Tremor's blocks gallery. Not deep-dived.

### Finance

Note: this domain is the thinnest by far. Most professional finance UIs are auth-gated; public docs cover embeddable widgets rather than internal dashboard components.

**Bloomberg Terminal — Launchpad + Monitor** ([Launchpad basics](https://www.bloomberg.com/professional/insights/technology/bloomberg-terminal-essentials-ib-worksheets-launchpad/))
- Bloomberg's dashboarding idiom is **Launchpad** (customizable workspace) composed of **Monitors** (dense, table-driven components that track many securities across up to 30 data columns) and other components.
- Bloomberg does not use single-value stat tiles in the same way other dashboarding tools do. The terminal aesthetic is **dense tabular data**, not isolated large numbers. This is itself a finding — the traditional "stat tile" pattern we're researching is a *consumer/product-dashboard* convention more than a *professional-terminal* convention.

**TradingView — ticker widget family** ([widgets overview](https://www.tradingview.com/widget-docs/widgets/tickers/))
- Four distinct widget types, which read as a useful size/density taxonomy for a single-value-with-change component:
  - **Single Ticker** ([docs](https://www.tradingview.com/widget-docs/widgets/tickers/single-ticker/)) — symbol, price, change %. "Nothing else."
  - **Ticker** — horizontal row of up to 15 single-ticker units.
  - **Symbol Overview** ([docs](https://www.tradingview.com/widget-docs/widgets/charts/symbol-overview/)) — quote + simple chart (equivalent to "big number with trendline").
  - **Ticker Tag** — compact inline "pill" with logo + daily change; expands into a detail pop-up on hover. Interesting variant — a stat tile as an *inline text element*.
- Public embeddable widget docs; actual internal TradingView app UI goes further but isn't well documented publicly.

**FactSet Workstation** — skipped. Docs are gated behind customer login; public marketing describes personalized dashboards but doesn't expose component anatomy.

**Consumer finance apps** (Yahoo Finance, Google Finance, Robinhood, etc.) — not researched here but would be a useful complement if we want mobile-sized / touch-friendly variants later. Every one of them prominently uses the value + delta + optional sparkline stat-tile pattern for account balances, positions, and watchlists.

### Dataviz literature

**Stephen Few — *Information Dashboard Design*** ([Perceptual Edge library](https://www.perceptualedge.com/library.php))
- Defines a dashboard as *"a visual display of the most important information needed to achieve one or more objectives that has been consolidated on a single computer screen so it can be monitored at a glance."*
- Observes that *"key performance indicators and dashboards appear to be synonymous in the minds of most vendors"* — useful framing for why every BI tool has a KPI component.
- Contributes the **bullet graph** — his own replacement for dials/gauges. Directly relevant to the "stat tile with target" variant seen in Power BI KPI, Sigma, Looker's Calculate Progress mode. If we build that variant, the bullet graph is the canonical visual.
- Covers sparklines (from Tufte) as a primary dashboard component.

**Edward Tufte — sparklines, small multiples, data-ink** ([Sparkline theory and practice](https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/), [Executive dashboards](https://www.edwardtufte.com/notebook/executive-dashboards/))
- **Sparkline**: "small, intense, word-sized graphics" designed to be inline with text. Three underlying principles: maximize data density, minimize non-data, and the shrink principle ("graphics can be shrunk way down"). Also called a **dataword**.
- Cross-reference: Tufte's sparkline-as-inline-text is the same insight as TradingView's **Ticker Tag** widget. Both say a stat doesn't have to be a card — it can be a character-sized piece of text.
- **Small multiples**: grid of the same chart with varying data. Directly describes how KPI strips work in every dashboard we've surveyed.
- **Data-ink ratio**: maximize data, minimize non-data. Philosophy that should inform defaults for a stat-tile primitive — restraint in chrome, type hierarchy, and color.
- Notable critique: Tufte argues the "dashboard" metaphor (from cars) is actually a poor fit for business because business metrics are "intensely multivariate." Worth holding: the name "dashboard" has stuck industry-wide, but the underlying pattern isn't really dial-shaped.

**Cole Knaflic — *Storytelling with Data*** ([site](https://www.storytellingwithdata.com/))
- Doesn't publish a specific term for the stat tile pattern.
- Contributes design philosophy relevant to our defaults: focus attention, eliminate clutter, "simple beats sexy." Applicable to our component's visual defaults but doesn't add terminology.

**Terminology worth carrying forward**:
- "Bullet graph" (Few) — variant with target/threshold markers.
- "Sparkline" / "dataword" (Tufte) — the inline or embedded mini-trend.
- "Small multiples" (Tufte) — framing for KPI strips.
- "Data-ink ratio" (Tufte) — principle for default styling restraint.

## Anatomy

Synthesized from the Prior art survey. Tiered by how universal each part is. "Variants" below keeps configuration/mode choices (orientation, size tier, text mode) separate — this section is about *pieces the component can contain*.

### Core (present in every implementation)

- **Value** — the primary number. The reason the component exists.
- **Label** — what this value represents. Called title, name, metric name, or field name depending on source.

### Near-universal (most implementations)

- **Unit** — currency symbol, `%`, `ms`, etc. Usually attached to the value visually.
- **Subtitle / context line** — short descriptor like "by Month" or "last 7 days." Seen in Grafana, Power BI, Looker, Datadog.
- **Change indicator** — delta against a comparison window. Displayed as absolute, relative, or both. Includes a direction (up/down) and color semantics (green/red, configurable per metric — "increase is better" vs "decrease is better").
- **Threshold-driven color** — value, background, or border recolored based on value ranges. Most universal mechanism for status signaling.

### Common optional parts

- **Sparkline / trendline** — small time-series visual behind, beside, or below the value. Grafana, Superset, Sigma, Mode, TradingView Symbol Overview, Tufte's foundational idea.
- **Comparison value** — the previous-period raw number shown alongside the current one (Looker "Show as Value," New Relic current+previous, Sigma hover-to-reveal).
- **Target / benchmark / goal** — a reference value the primary value is measured against. Power BI KPI, Sigma, Looker Calculate Progress. Canonical visual: Few's bullet graph.
- **Progress bar** — visual % progress to target. Tremor, Looker.
- **Icon** — small visual identifier, usually at one corner. Horizon UI Statistics, marketing-style KPI cards.
- **Timestamp / "as of"** — when the value was measured or last refreshed. Common in observability and finance contexts; not named in most component docs but visible in screenshots.
- **Drilldown affordance** — the entire tile is clickable or a link icon is shown. Grafana data links, Mode link-wrapping, Datadog context links.

### Less common but distinctive

- **Callout / conditional image** — an image swapped in based on value (Datadog, Power BI Card's "callout images"). Unusual — most tools use color, not imagery, for status.
- **Custom tooltip content** — templated HTML shown on hover (Looker uses Liquid). Moves beyond fixed "value + label" reveals.
- **Delta badge as a separate sub-component** — Tremor exposes `BadgeDelta` independently so it can be placed anywhere in the composition. In other tools the delta is locked to a position relative to the value.
- **Status symbol / shape** — triangle up/down (Looker default), check/warning icon, arrow. Tableau community patterns lean heavily on shape for at-a-glance status.

### States

Not in every doc, but every real implementation has to handle these. Worth naming as anatomy because each is a visual presentation of the component, not just a prop:

- **Loading / skeleton** — placeholder shape before data arrives.
- **Empty / no data** — e.g. "—" or a muted message when the query returns nothing.
- **Error** — e.g. query failure or threshold that can't be evaluated.
- **Stale** — data older than a threshold; often shown with a muted color or a "last updated N min ago" note.

### Parts we likely missed (not researched)

Domains we held off on would probably add context-specific parts:

- **Sports scorebug**: LIVE indicator, period/quarter/inning, team colors as identity.
- **Manufacturing**: setpoint marker, batch/lot ID, operator/shift identifier.
- **Military/COP**: classification marking, source attribution, confidence level.

None of these change the core anatomy, but they suggest the component should have a generic "metadata slot" rather than trying to name every field.

## Variants

Configurational and modal choices observed across the prior art. Distinct from Anatomy — these are knobs that change *how* the same parts behave or are arranged, not which parts exist.

### Size and form

- **Density tiers** — pill / inline → mini → standard → expanded (with chart). Horizon UI ships two density tiers as separate components (MiniStatistics, Statistics); TradingView ships four (Ticker Tag, Single Ticker, Ticker, Symbol Overview); Grafana auto-adapts within one component.
- **Orientation** — vertical (value stacked over label) vs horizontal (value beside label). Grafana names this explicitly (auto / horizontal / vertical); Tremor expects the caller to compose with `Flex`.
- **Card vs inline** — default is a card-shaped container, but the inline/pill form (TradingView Ticker Tag, Tufte's dataword) is a legitimate variant that reads more like text than UI chrome.

### Content variants

- **With / without sparkline or trendline** — Superset explicitly splits this as a separate named chart type; Grafana and most others make it a toggle.
- **With / without delta** — Metabase splits this as Number vs Trend (two components); Datadog, Grafana, most others make it a toggle.
- **With / without target / benchmark** — Power BI splits this as Card vs KPI (two visuals); Sigma, Looker treat it as a configuration mode.
- **With / without progress bar** — usually coupled with target; Tremor exposes `ProgressBar` as a separate primitive.
- **Text mode** — controls which of {value, label, both, neither} is shown. Grafana names five modes (auto / value / value+name / name / none); useful for dense strips where the label is implicit from position.

### Comparison framing

- **Comparison window** — previous period / previous day / previous week / previous month / custom. Datadog and Superset make this a first-class config.
- **Comparison display mode** — relative change only / absolute change only / both / off.
- **Color semantics** — "increase is better" (green↑/red↓), "decrease is better" (red↑/green↓), or neutral. A same-metric concern: "latency down" is good but "revenue down" is bad — direction alone doesn't carry color, the metric's polarity does.

### Value formatting

- **Format** — absolute number / percentage / currency.
- **Unit** — appended as suffix (`ms`, `%`, `req/s`) or prefix (currency symbol).
- **Precision** — decimal places. Datadog flags a subtle issue: conditional-formatting rules must reference raw values, not autoformatted display values.
- **Auto-resize** — font scales to fit available space (Looker, Grafana). Floor on minimum font size.

### Multi-stat patterns

These aren't variants of a single tile — they're compositions of multiple tiles. Still worth naming here because prior art treats them as first-class:

- **KPI row / strip** — horizontal series of tiles with shared visual treatment. Tufte's "small multiples."
- **KPI grid** — 2D arrangement; the Executive Scorecard example's left column is this.
- **Multi-measure single visual** — Power BI's unified Card visual shows several measures inside one visual. Blurs the line between "one tile with several metrics" and "several tiles."
- **Inline stat in prose** — Ticker Tag / dataword; the stat tile embedded in running text, not a dashboard region.

### Meta-variant: how the variants themselves are modeled

A real API decision visible in the survey: **one configurable component vs several named components**.

- **One configurable**: Grafana Stat, Looker Single Value, Sigma KPI, Datadog Query Value, Mode Big Number. Flexible, harder to discover, more props.
- **Several named**: Power BI (Card vs KPI visual), Metabase (Number vs Trend), Superset (Big Number / Big Number with Trendline / Big Number with Time Period Comparison), Horizon UI (MiniStatistics vs Statistics), TradingView (four ticker widget types). Clearer intent per component, more things to name and maintain.
- **Hybrid** (Tremor): primitives stay configurable but opinionated compositions get named and shipped as blocks. This matches Eudonia's two-class model and is likely the right reference for us.

## API shape

Synthesized from the Prior art survey. Two axes are doing most of the work: whether the API is **props-shaped or composition-shaped**, and whether the component is **coupled to a data/query model or data-agnostic**. Most tools pick one position on each axis.

### Props-shaped vs composition-shaped

- **Props-shaped** (Horizon UI, New Relic BillboardChart, implicitly all BI tools via their config panels) — one component, props for each part. `<MiniStatistics name="Sales" value="$574" growth="+23%" />`. Discoverable, easy to start with. Becomes awkward as optional parts multiply (icon + target + sparkline + delta + footer = large prop surface).
- **Composition-shaped** (Tremor) — many small primitives the caller arranges. `<Card><Flex><Metric>...</Metric><BadgeDelta>...</BadgeDelta></Flex></Card>`. Flexible, scales with variants, but costs more to stand up the simplest case.

Tremor's observation: it's reasonable to **ship both**. Primitives are composition-shaped; block-level components wrap them in a props-shaped façade for the common cases. This matches Eudonia's primitive/component split directly.

### Data coupling

- **Query-coupled** — the component accepts a query in the tool's own language and fetches/aggregates itself. Grafana (data source + query), Datadog (metric query), Sigma (workbook data source), New Relic BillboardChart (`query` prop with NRQL).
- **Data-agnostic** — the component renders whatever data you hand it. Tremor `Metric` is just formatted text. Horizon UI `MiniStatistics` takes `value` as a string.
- **Hybrid** — New Relic BillboardChart accepts *either* `query` or `data`. Good pattern: don't force a data model but make the integrated path nice when present.

For Eudonia, data-agnostic is almost certainly right for the primitive. A later data layer can wrap it for the integrated experience.

### Minimum required props

A revealing test: how small is "hello world"?

- Tremor: `<Card><Metric>$34,743</Metric></Card>` — two primitives, one required child each.
- Horizon UI MiniStatistics: `name` + `value` (two props).
- Grafana Stat: a metric query (the panel configures everything else).
- New Relic BillboardChart: either `query` or `data`.
- Looker: a query field.

Common ground: the minimum is always **just the value** (plus a data/query binding where applicable). Label is almost always treated as recommended-but-optional. Everything else is optional.

### Sub-component exposure

Key API decision — does the component expose its sub-parts as independent primitives?

- **Yes**: Tremor exposes `Metric`, `BadgeDelta`, `ProgressBar`, `Text` separately. Users can place them outside a card, inside a table, in prose, etc.
- **No**: Horizon UI, Grafana, Datadog, etc. — the delta is a configuration of the tile, not a reusable piece.

Exposing sub-parts is strictly more flexible but costs API surface and stable-identity guarantees (every export becomes a public contract). Worth the cost for primitives; probably not for styled components.

### Escape hatch patterns

What do tools do when the built-in shape isn't quite right?

- **`className` / `style` override** — universal, low-ceiling. Works for tweaks; not for structural changes.
- **Slots / children override** — pass a React node into a named slot (header, footer, action). Seen in newer React component libraries; not strong in the BI tool world.
- **Render props / custom renderers** — function that receives data and returns a node. Looker's custom tooltip with Liquid templating is a templated variant of this idea.
- **"Block" recipes** — ship the primitives and let teams copy-paste pre-composed versions. Tremor's blocks and shadcn's model. This is the least runtime-coupled and the most common modern pattern.

### Theming

Every tool has a theming story; the shapes vary:

- **Config-driven** — BI tools theme via dashboard-level settings (Looker color collections, Grafana theming options).
- **Token / prop-based** — component libraries theme via design tokens or direct color/size props.
- **Class / CSS-variable-based** — Tailwind-ecosystem libraries (Tremor, Horizon UI) lean on utility classes and CSS variables; the consumer overrides via their own Tailwind config.

For Eudonia, primitives should be theme-agnostic (no tokens baked in); components should respect a theme contract but allow per-instance override.

### Implications for Eudonia's primitive/component split

Pulling this together into concrete design directions:

- **Primitive** — composition-shaped, data-agnostic, minimum props (value + optional label as children or content), sub-parts exposed as peer primitives (`Delta`, `Sparkline`, `ProgressBar` as peers of the stat primitive), no theming baked in.
- **Component** — props-shaped façade wrapping the primitives, opinionated layout/chrome, theme-respecting, escape-hatch via slots for header/footer/action.

This is almost exactly Tremor's model, which we can use as concrete prior art when drafting the API.

## Interaction

Synthesized from the Prior art survey. Most tools document interaction per-tile, but the real pattern is: a stat tile **receives context** (time range, filters, selection state from the surrounding dashboard) and **emits intent** (click-for-drill, hover-for-detail). Orchestration lives above the tile, not inside it.

### Hover

- **Tooltip with exact values** — near-universal. Useful when the displayed value is formatted/abbreviated and the precise number is wanted.
- **Extra detail on hover** — Sigma reveals previous-period values by hovering the trendline; Looker allows custom tooltip content via Liquid templating; TradingView Ticker Tag expands into a full detail popover on hover.
- **No hover affordance** — uncommon but legitimate; in ultra-dense scorebug-style displays hover isn't assumed (broadcast TV has no cursor).

### Click / drilldown

- **Whole-tile link** — Mode wraps the entire chart as a link; common in product dashboards.
- **Data links / context links** — Grafana's data links and Datadog's context links support multiple destinations per tile; single-link fires on click, multi-link opens a small menu.
- **Drill-to-detail** — click opens a drawer, detail page, or a dashboard filtered to the tile's slice. Power BI, Tableau, Looker support this as a dashboard-level concern.
- **No-interaction mode** — display-only tiles (scorebugs, public dashboards, wallboards) should render identically but not respond to clicks.

### Time-range and filter context

- **Global vs per-tile time range** — Datadog lets a widget opt into the dashboard's global timeframe or use a custom one. Grafana, Superset, Looker similar. The tile itself usually just reads the effective time range from its surroundings.
- **Filter context** — BI tools propagate selected filters, slicers, or segment selections to every tile on the dashboard. The stat tile doesn't own the filter state; it re-renders when context changes.
- **"Value vs comparison"** — when time range and comparison window both change, tools differ on whether the comparison follows or stays anchored. No consensus here; worth deciding explicitly.

### Realtime / streaming

- **Auto-refresh on an interval** — Grafana, Datadog, Power BI refresh at configured intervals. Widget re-renders with new data; no special component-level interaction.
- **Push / stream** — TradingView widgets stream live; Bloomberg Monitors stream. Behaviorally different from pull: values change continuously without a visible refresh event.
- **Stale indicator** — when data can't refresh (network error, paused stream), some tools show a muted state or a "last updated" note. Appears in scorecards and observability dashboards.
- **Visual change on update** — some tools flash a color or play a subtle transition when a value changes (finance tickers, sports scorebugs). Easy to overdo — defaults should be restrained.

### Cross-filter and linked-view participation

- **Tile as source** — clicking a tile filters other tiles on the dashboard. Common in BI tools for discrete categorical values (regions, segments). Less common on stat tiles than on bar charts or maps, but present.
- **Tile as target** — when another tile filters the dashboard, the stat tile recomputes and shows the filtered value. More common role for stat tiles.
- **Linked highlight** — hovering a peer tile temporarily highlights the related stat. Rarer; seen in market-intelligence and demographic dashboards.

### Focus, selection, keyboard

- Under-documented in prior art. Most component docs don't specify keyboard behavior or focus states for stat tiles.
- Minimum expectation: if the tile is interactive (click opens something), it should be focusable and activatable via keyboard. Focus ring should be visible. If it's display-only, it should not be in the tab order.
- No clear industry consensus on keyboard shortcuts for drilldown or tooltip reveal.

### Dashboard-shell interactions (out of scope for the tile)

These are dashboard behaviors that affect the tile but live above it:

- **Resize / drag** — authoring-time layout change. Belongs to the layout primitive (a future `Dock`-like component), not the stat tile.
- **Maximize / fullscreen** — Grafana can maximize a panel. Implemented by the dashboard shell wrapping the tile.
- **Edit mode** — toggling into a config/authoring state for the tile. A shell concern.

### Implications for Eudonia

- The stat primitive should be **display-only and input-free by default**. Click and hover behavior should be opt-in and usually implemented by the surrounding component or a parent card/link.
- Time range, filter, and refresh state should be **received, not owned**. A stat tile shouldn't fetch; it should render what it's given.
- A **stale / loading / error state prop** is probably the right contract for streaming and async — the tile doesn't know whether a refresh happened; it just knows the current state of its data.
- Cross-tile coordination (filter propagation, linked highlight) is a dashboard-runtime concern and not part of the tile API. Worth noting now so we don't accidentally build it into the primitive.

## Accessibility

Prior art is thin here — most component docs for stat tiles don't meaningfully document accessibility. That's itself a finding. Synthesizing from standard web a11y practice plus what little the surveyed tools mention.

### Semantic structure

- **Label–value association** — the label names the value; the two should be programmatically associated so a screen reader reads them together. In practice: label in a `<dt>`/`<dd>` pair, or an explicit `aria-labelledby` from the value to the label, or simple DOM order with both inside a single region.
- **Visual vs semantic order** — designers usually put the value first and largest. Screen readers read DOM order. Either place the label first in DOM even if it's second visually, or use `aria-labelledby` so the reading order makes sense regardless of visual layout.
- **No role by default** — a stat tile is just formatted text. Over-roling it (`role="region"`, `role="figure"`) usually hurts more than it helps. If the tile is interactive, use a native `<a>` or `<button>` — not `role="button"`.
- **Chakra UI's Stat component** is worth noting as a rare example that documents this: separate `StatLabel`, `StatNumber`, `StatHelpText` elements establish the relationship through element choice.

### Updating / live values

- **`aria-live` policy** — values that change should be in an `aria-live="polite"` region so updates are announced without interrupting. `aria-atomic="true"` re-announces the whole value on change.
- **Don't flood** — a streaming ticker updating every second with `aria-live` would be unusable. For high-frequency updates, either throttle announcements, skip them entirely, or put them behind an opt-in. This is an under-documented area across the industry.
- **Stale / loading / error states** — should be perceivable non-visually. A loading tile that's just a skeleton shape needs some announcement; an error state should be announced, not just colored red.

### Color and status

- **Don't rely on color alone** — the consistent Tableau community wisdom is to pair color with shape or icon for status. Color-blind users and monochrome contexts need a second signal.
- **Contrast ratios** — delta text, threshold-colored values, and sparkline strokes all need to meet WCAG AA (4.5:1 for normal text, 3:1 for large). Many default dashboard palettes don't.
- **Status semantics in text** — "↑ 5.2%" renders fine visually but "up arrow 5.2 percent" isn't meaningful to a screen reader. Better: a visually-hidden text equivalent ("increased by 5.2% from previous period") rendered alongside the symbol.

### Keyboard and focus

- **Interactive tiles must be focusable** via keyboard, with a visible focus ring. A click-to-drill tile should be reachable by Tab and activatable by Enter/Space.
- **Display-only tiles should not be in the tab order** — avoids noise when tabbing through a dashboard.
- **No clear industry consensus** on keyboard shortcuts for tooltip reveal or drilldown beyond the standard focus + Enter pattern.

### Localization and direction

- **Number formatting** — locale-aware (thousands separator, decimal separator). `Intl.NumberFormat` is the modern answer in JS.
- **Currency** — symbol position (prefix vs suffix) varies by locale. Don't hardcode `$` in front.
- **RTL layouts** — delta arrows, unit positions, value alignment all mirror. Sparkline direction typically does not (time still goes left-to-right in charts) — but this is a real open question.
- **Abbreviated units** (K, M, B) have locale variants — European "milliard" vs US "billion," for instance. `Intl.NumberFormat`'s `notation: 'compact'` handles most of this.

### What prior art actually documents

- **Grafana**: general Grafana a11y guidance exists, not specific to Stat panel.
- **Tremor, Horizon UI**: claim "accessible components" at the library level but don't document stat-tile specifics.
- **Chakra UI `Stat`**: documents the semantic element choice (StatLabel/StatNumber/StatHelpText).
- **BI tools** (Power BI, Tableau, Looker, Sigma): little to no stat-tile-specific a11y documentation. A real gap in the category.

### Implications for Eudonia

- The **primitive** should make label–value association trivially correct by construction — e.g. the primitive renders both in a single region with proper association, or exposes matched sub-primitives (like Chakra) that pair correctly.
- **`aria-live` should be opt-in**, defaulted off. A basic stat tile isn't live; subscribing to live updates is a deliberate choice.
- **Status text equivalents** for direction and threshold coloring should be generated automatically by the styled component when the data supports it.
- **Number and currency formatting** should route through `Intl.NumberFormat` by default, with an escape hatch for custom formatters. No hardcoded separators or currency symbols.
- **Keyboard interactivity** should be implicit: a `href` or `onClick` prop makes the tile focusable and activatable; absence makes it display-only and out of the tab order.

## Primitive vs component decomposition

Synthesis of the research above into a concrete split across Eudonia's two export classes. Starting point for scoping, not a final spec.

### Guiding principles (from earlier sections)

- Minimum required data is **just the value**. Everything else optional.
- Sub-parts as **peer primitives**, not props — placeable anywhere, not locked to a tile.
- **Composition-shaped primitives, props-shaped components**.
- **Label-value association correct by construction**, not by opt-in prop.
- **Display-only by default**; interactivity is opt-in via `href`/`onClick`.
- **Data-agnostic primitive**; data/query coupling is someone else's job.

### Proposed primitive set

Working names — actual naming deferred to the Naming pass when we scope.

- **`Stat`** — structural container. Establishes the semantic region and sets up label-value association for any `StatValue`/`StatLabel` children. Renders children; no styling. Handles: `as`, `href`/`onClick` to make it a link or button, `aria-*` passthrough, `loading`/`empty`/`error` state props.
- **`StatValue`** — renders the primary value. Accepts a number (with optional formatter), string, or `ReactNode`. Number formatting routes through `Intl.NumberFormat` with an override for custom formatters. No styling.
- **`StatLabel`** — renders the label. Plain text or node. Automatic association with `StatValue` when inside a `Stat`. No styling.
- **`Delta`** — peer primitive for change indicators. Props: numeric delta, optional comparison-window label, polarity (`increase-better` / `decrease-better` / `neutral`). Auto-generates a screen-reader text equivalent alongside the visual symbol. Composable anywhere (inside a `Stat`, inside a table cell, inline in prose).
- **`Sparkline`** — peer primitive for inline trend visual. Takes a numeric series. Handles axis/range calculation; no chrome. Composable anywhere.

`Delta` and `Sparkline` probably live outside a "stat" subpath — they have real value independent of stat tiles. Worth deciding at file-structure time whether they belong under `stat/` or their own location in the library.

### Proposed component set

- **`StatCard`** (working name) — opinionated, styled composition of the primitives. Props-shaped façade. Defaults: card surface, type hierarchy (value > label > context), restrained spacing and color per the data-ink principle.

  Handles: `label`, `value`, `unit`, `delta` (with comparison window and polarity), `sparkline` (series), `target`, `icon`, `href`, and state props.

  Ships as **one configurable component**, not several named density tiers. If inline/mini/expanded variants become needed, consider a `size` prop before splitting into separate exports.

### Boundary — what belongs in each class

- **Primitives own**: semantic structure, a11y correctness by construction, data-agnostic rendering, composability with anything.
- **Components own**: styling, theming, common-case ergonomics, restrained visual defaults.
- **Neither owns**: data fetching, time-range orchestration, cross-tile filter coordination, multi-tile strip layout (that's the layout primitives' job — `Grid`, `Flex`).

### Explicitly out of scope for v1

- **Bullet graph** (Few's target-variant visual) — a chart primitive, not a stat-tile primitive. Belongs in a future marks set.
- **Inline text stat** (Ticker Tag / dataword) — achievable by composing the primitives directly in running text; no dedicated export needed in v1.
- **Streaming / live-update behavior** — `aria-live` wiring and value-change animation deferred until we have a concrete streaming use case driving the design.
- **Cross-filter participation** — dashboard-runtime concern, not a component concern.
- **Authoring behaviors** (maximize, resize, reorder) — future `Dock` layout primitive, not the tile.

### Open questions for the scoping pass

- **Wrapper or peers?** Do we ship `Stat` as a wrapper that auto-associates children, or flat `StatValue`/`StatLabel` peers with `Stat` as optional? Chakra uses the wrapper model; Tremor uses flat peers. Either works — the choice affects how common the "just render a number" case looks in consumer code.
- **Do `Delta` and `Sparkline` live under `stat/` or their own path?** Recommendation is their own path — they're broader primitives.
- **Format API**: expose `Intl.NumberFormat` options as props, or take a single `format: (n: number) => string` function, or both? Both is flexible; both is also more surface.
- **Naming**: deferred — see Naming section.
- **How does the component integrate with layout primitives when building a KPI strip?** Probably just `<Grid>` of `<StatCard>`. Worth confirming when we rebuild the executive scorecard KPI column.

### Suggested next step

Before designing the API in detail, scope against a concrete target: **the four KPI tiles from the current executive-scorecard example** (Gross Margin %, Total Revenue, Number of Customers, Number of Products). Those tiles exercise only the narrowest slice of the research above (value + label, no delta, no sparkline, no target). Good first milestone — proves the primitive-plus-component split on a minimal real case without front-loading variant complexity.
