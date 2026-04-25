# Cross-cutting patterns and requirements

Synthesis of the 29 domain docs. The goal is to surface the patterns that recur across domains, the genuine tensions where domains pull in different directions, and the requirements that would inform the v1 table component without dictating implementation.

This is still product research, not software design. Anything resembling an API decision is deferred to a separate scoping pass.

## The shape of the answer

A few headlines first, before the detail:

1. **A small set of patterns covers the majority of dashboard tables across every domain.** The same shape appears with different labels: the top-N leaderboard, the live status table, the queue-with-status, the plan-vs-actual variance table, the matrix/heatmap, the line-item edit table.
2. **The "small dense table tile" — handful of rows, handful of columns, sits inside a card on a dashboard, optional footer, conditional formatting on one or two columns — is genuinely universal.** Every domain has one. Eudonia's example YoY growth table is a textbook instance. This is the right v1 target.
3. **The next layer up — sortable columns, basic filtering, status pills, sparkline cells, status row colors, footer aggregations — is also broadly shared and would not over-fit to any one domain.**
4. **Beyond that, domains diverge sharply.** Bulk action, virtualization, in-place editing, hierarchical expansion, formal printable artifacts, real-time push, bracket structures, heatmap-as-table, tree-as-table — each is critical somewhere, optional everywhere else, and worth knowing about even if not building.
5. **The most distinctive eudonia opportunity is the chart-table boundary** — sparkline cells, mini-bar cells, threshold indicators, status sparks, bullet-graph cells. This is where library polish would matter most and where existing offerings are weakest.

## Universal patterns (every domain has these)

These are present in essentially every domain doc and should be treated as defaults, not features:

### The small dense tile
A handful of rows × a handful of columns inside a dashboard card. Sits next to charts. The YoY revenue table in the executive scorecard example is the canonical case. Universal across BI, finance, observability, support, marketing, healthcare, education, and beyond.

### Sortable columns
Click a header → sort. Universal across every domain that lets users do anything beyond glance. Direction toggle on repeat click. Default sort exists per table.

### Footer aggregations
Sum, average, weighted average, count, percentile. Almost every numeric table in business/finance/healthcare/HR has a footer. Subtotal rows for hierarchical data.

### Identity column with stable rendering
Customer name, ticker, patient, employee, address, sample ID, candidate, account. Almost every row has a meaningful identifier in the first column. Often paired with a thumbnail / avatar / icon. Sticky-friendly.

### Numeric formatting
Currency, percent, large-number abbreviation (K/M/B), per-row precision, decimal alignment, locale awareness. Universal expectation; common failure point.

### Status as a first-class concept
Almost every domain has a status column with a small enumerated set of values, an associated color, and an associated icon or short label. Order-status, alarm-severity, deal-stage, ticket-state, build-status, flight-status, grant-stage, race-status. The pattern is universal enough to deserve a built-in convention.

### Drill from row to detail
Click a row (or a cell) → open the deeper view. Universal across every domain except wallboard / FID / display-only contexts. Often Cmd/Ctrl-click for new tab.

### Color on outliers and thresholds
Conditional formatting on a column that signals "this row needs attention." Heat colors, threshold bands, comparison-to-baseline, risk indicators. Specific palettes vary; the pattern is universal.

### Time-aware columns
"Days open," "days to deadline," "time since last update," "age in queue," "days to expiry." These columns drive most workflow tables and need their own coloring/escalation semantics.

## Strong-but-not-universal patterns (very common; worth supporting natively)

These appear in the majority of domains but not all:

### Sparkline cells
Inline mini-trend in a cell. Observability (per-service trends), finance (intraday price), HR (engagement trends), marketing (campaign trends), sports (recent form), real estate (price history), supply chain (lead time trends), healthcare (vitals strips). Where they appear, they are not optional.

### Status pills / badges
Color-coded short-text status indicators. CSS-pill or chip style. Almost every workflow table has them. Multiple status columns per row are common in commerce, healthcare, transportation.

### Per-cell conditional formatting
Beyond status — coloring numeric cells by quantile, threshold band, or comparison to baseline. Universal in BI, marketing, finance, observability. Heatmap tables (cohort retention, gene expression) are the extreme case.

### Sticky header and sticky first column
Mandatory in any table tall or wide enough to scroll: gradebooks, flowsheets, cohort tables, large rosters, financial blotters, big inventory tables, gene expression. The component cannot ignore this.

### Live updates
Sub-second to per-minute. Finance, observability, security, dispatch, healthcare, sports, marketing in-flight, election results, casino floors. Without disrupting the user's place. Throttled rendering. Stable sort during update.

### Filter / search
Free-text or per-column. Universal in any table with more than a screen of rows. Saved filters and saved views are common in heavier domains.

### Per-row actions
Buttons, menus, or hotkeys to act from the row. Acknowledge, approve, archive, reassign, dispatch. Universal in workflow domains; absent in pure read-only / wallboard contexts.

### Bulk action
Select multiple rows → action. Common in security triage, marketing, support, commerce, HR, sports admin. The "select bar" pattern.

### Per-row alerts and badges
Small icons next to identity. Allergy in healthcare, isolation, MEL deferred items in aviation, hot-lead tag in CRM, restricted-product flags in commerce. Compact visual encoding.

### Time / date display conventions
Relative ("3 minutes ago") with hover-to-absolute is the de facto standard. Time-zone awareness. ISO timestamps in audit trails.

### Row click context (open in new tab, copy)
Cmd/Ctrl-click reliably opens a row's detail in a new tab. Cell value copy on selection. Both are minor but commonly broken in custom tables.

## Common patterns (notable, present in many domains, but not majority)

### In-place editing
Healthcare flowsheets, HR comp planning, sales pipelines, sports rosters, finance allocations, commerce inventory, lab CRFs. Table is the editor. Demands save / undo / commit semantics.

### Hierarchical (tree-as-table)
Org charts, WBS, MITRE matrices, file systems, DOM trees, classifications, parent-child lots, BU/region rollups, comment threads, ticket subtasks. Expand/collapse with subtotals.

### Image / photo / thumbnail columns
Commerce (products), HR (employees), real estate (listings), construction (RFI photos), creative ads (creatives), healthcare (some), social (posts). The image is data.

### Avatars + identity stack
Multiple owners / reviewers / collaborators per row, shown as overlapping avatars. CRM, support, DevOps, sales pipelines.

### Map linkage
Tables paired with maps. Real estate, government, supply chain, public health, dispatch, network ops, energy, environmental science. Click row → map; click pin → row.

### Pagination / virtualization / infinite scroll
Triggered by row scale. Logs, security event search, eDiscovery, gene expression, IPAM, audit logs, transaction histories. Three different presentations of the same underlying problem.

### Standardized printable artifacts
ICS forms, AIA pay applications, FDA SDTM, CDISC, court pleadings, regulatory filings, prescription labels, settlement statements, daily reports, dispatch records. The table is the data; the printed document is the deliverable.

### Auto-refresh with pause
Observability, dispatch, network ops, election results, finance. Countdown indicator, pause on hover, pause when interacting.

### Multi-monitor / wallboard rendering
NOC, emergency dispatch, hospital units, trading floors, broadcast operations centers, election night newsrooms. Same data, different rendering.

### Audit trails embedded
Healthcare, regulated manufacturing, finance compliance, government, legal, election admin, casino. Cell-level change history surfaced inline (expand row → history) or in a separate audit log table.

### Mobile-first or mobile-secondary rendering
Real estate brokerage, last-mile dispatch, on-call (DevOps), parents (education), sales reps, election results, sports fans, commerce merchants. Phone is a real second context for many domains; primary for some.

## Long-tail patterns (domain-distinctive, worth knowing exists)

These are critical in their domain and rare elsewhere. The component shouldn't build for them in v1 but shouldn't actively block them.

- **Order book / depth of market** — finance, prediction markets. Specialized two-sided table with depth bars.
- **Triage tables under stress** — emergency response MCI, hospital ED tracking. Color is operational; speed of entry matters.
- **Heatmap-as-table** — cohort retention, gene expression, MITRE ATT&CK, demographic crosstabs. Both axes carry headers; cells are the data.
- **Bracket / tournament structures** — sports, e-sports, election primaries. Tree-shaped relationships displayed in tabular form.
- **Stream tape (append-only with auto-scroll)** — finance time-and-sales, log streams, chat queues, live blog ticker, surveillance event log.
- **Pivot / cross-tab with editable cells** — BI pivot tables, demand planning, budgeting.
- **Plate-well layouts** — laboratory plates (8x12 fixed grid). Domain-specific shape.
- **Genealogy / lineage** — manufacturing batch genealogy, lot ancestry, court chain-of-title. Tree expanded inline.
- **Measurement-with-quality-flag** — energy SCADA, manufacturing process tags, lab CRFs. Cell carries metadata about its trustworthiness.
- **Bullet graph cells** — Power BI KPI tiles, executive scorecards, target-vs-actual displays. A small per-row chart embedded in the row.
- **Side-by-side row comparison** — sports, real estate, scientific cohort comparison, marketing A/B, healthcare patient compare.
- **Voice-driven and scan-driven row advancement** — warehouse picking, inventory, hospital med administration, lab specimen tracking.

## Cross-cutting tensions

Real disagreements between domains. v1 will pick a default; the disagreement is worth being explicit about.

### Sort stability under updates
**Tension:** Live tables in finance, dispatch, observability want the row the user is reading to *stay where it is* even as values change. Other domains (sports leaderboards, election results) want to *re-sort* as the leader changes — that's the data.
**Resolution direction:** Default to stable; offer "live re-sort" as an explicit choice.

### Color carries critical meaning
**Tension:** Some domains have legally-mandated or operationally-coded color systems (triage colors, alarm severity, party colors). Others (BI, HR) want a designer-palette aesthetic.
**Resolution direction:** The component must accept consumer-defined palettes; never bake in semantic colors.

### Density vs whitespace
**Tension:** Finance, healthcare flowsheets, security event search, supply chain WMS all want dense — every pixel is data. BI, HR, support / CRM want generous spacing — the audience tolerates less density.
**Resolution direction:** A density token (compact / comfortable / spacious) controllable by the consumer. Default to comfortable (the BI / dashboard target) with compact as a real option.

### Table as form vs table as report
**Tension:** Healthcare flowsheets, comp planning, sales pipelines, lab CRFs, inventory adjustments, gradebooks — the table *is* the editor. BI dashboards, public dashboards, scorecards — the table is read-only.
**Resolution direction:** Read-only is the default for v1; in-place editing is a deliberate later layer.

### Live vs static
**Tension:** Observability, finance, dispatch want live push with sub-second updates. BI, HR, public health usually want hourly or daily refresh. Print artifacts are frozen.
**Resolution direction:** The component renders whatever data shape it gets; live updating is a consumer concern. The component should not assume polling vs push but should not flicker on updates.

### Wide tables with horizontal scroll vs collapsed responsive layouts
**Tension:** Power users on workstations want every column visible (with horizontal scroll if needed). Mobile users want a card-list collapse.
**Resolution direction:** Both. Sticky first column for the wide case; planned graceful collapse for narrow widths. Probably a per-row expand-to-detail option.

### Public-facing vs internal
**Tension:** A public election results dashboard, a public open-data portal, a customer track-and-trace page must be more accessible, more mobile-friendly, less interactive than the internal version of the same table.
**Resolution direction:** The component should not assume an audience; both contexts should render acceptably.

### Action behind confirmation vs action immediate
**Tension:** Some workflows (security triage, support queue) want one-keystroke action. Others (HR comp planning, finance allocations) want confirmation before commit.
**Resolution direction:** The component does not own this; consumers wire it up. But the component should support both fluently.

## Cell-type taxonomy

What goes inside cells. Across all domains, these recur:

- **Plain text** — name, title, description, message.
- **Number** — currency, count, percent, ratio, measurement.
- **Date / time** — absolute, relative, relative+absolute hover, with time zone.
- **Status pill** — short labeled chip with color.
- **Avatar / icon** — single or stacked.
- **Photo / thumbnail** — small image with click-to-expand.
- **Sparkline** — inline mini-trend.
- **Bar / progress** — horizontal bar inside the cell.
- **Bullet graph** — value + target + range bands inline.
- **Delta / change indicator** — value + arrow + percent.
- **Boolean / checkbox** — true/false, sometimes editable.
- **Action button(s)** — one or more buttons in the cell.
- **Link** — to detail, to external system, to artifact.
- **Multi-line / wrapped** — log message, comment, address.
- **Composite** — name + subtitle + metadata in one cell, common in modern table designs.

The first eight or so should feel native — the consumer should not have to fight the component to render them well. The rest should be possible via cell render escape hatches.

## Refresh / freshness models

How data updates differs by domain. Roughly four buckets:

1. **Static / on-demand** — BI reports, scientific tables, legal documents, real estate listings (refreshes when user reloads). The simplest case; nothing special needed.
2. **Interval polling** — most operational dashboards (5s–5min). The component renders the data it gets each poll; transitions should be smooth.
3. **Live push (sub-second)** — finance blotters, dispatch CAD, healthcare telemetry, election night, sportsbooks, auctions. Cells animate; rows update in place; throttling matters.
4. **Append-only stream** — logs, time-and-sales, live blog, chat queues, audit trails. Auto-scroll with pause on hover.

The component should look right in all four. v1 only needs to handle (1) and (2) gracefully; (3) and (4) are extensions but the architecture should not prevent them.

## Setting taxonomy

Where the table renders affects what the table needs:

- **Workstation** — typical desktop/laptop, one or two large monitors. Default target. Keyboard + mouse.
- **Multi-monitor console** — finance trader, dispatcher, NOC, surveillance. Same table at different sizes simultaneously. Keyboard-heavy.
- **Wallboard** — large display, far viewing distance, no interaction. Bigger fonts, higher contrast, slower refresh, often auto-rotating views.
- **Mobile (phone)** — primary in some domains (real estate brokerage, last-mile, election results, sports, parents in education). Card-list collapse is the typical pattern.
- **Tablet (field)** — construction, healthcare rounding, inspection, last-mile dispatch. Touch-friendly, sometimes glove-friendly.
- **Handheld (warehouse)** — pick lists, scanning. Optimized for single-row focus and barcode advancement.
- **Print** — pay applications, settlement statements, regulatory filings, daily reports, transcripts, manuscripts. Page-break aware, header repeat, fixed column widths.
- **Embedded surface** — Slack message, email, social card, slide deck. Static rendering, often imageified.

v1's primary target is workstation. Mobile-collapse should at least not be hostile. Print, wallboard, embedded contexts are explicit later concerns.

## Interaction taxonomy

Patterns that recur:

- **Glance** — read at a distance, no interaction (wallboards, FIDs, public displays).
- **Monitor** — periodic checking, low cognitive load (NOC, dispatcher between calls, manager checking dashboards).
- **Investigate** — active focus, drill-down, pivots, search (security analyst, performance marketer, doctor reviewing chart).
- **Edit** — the table is the workspace, frequent modifications (gradebook, comp planning, sales pipeline, inventory adjustment).
- **Configure / build** — analyst building a saved view or report. Power users.

v1 targets monitor and investigate. Edit is a deliberate later layer. Configure / build is a consumer concern.

## Stakes taxonomy

Worth being explicit because it shapes design priorities:

- **Informational** — fan checks score, executive reads dashboard, citizen browses open data. Mistake cost: low.
- **Decision-supporting** — analyst reviews data before recommending action. Mistake cost: moderate; corrections possible.
- **Decision-binding** — trader executes from blotter, doctor administers med, dispatcher sends unit, official certifies result. Mistake cost: high; sometimes irreversible.
- **Life-safety** — emergency dispatch, healthcare critical care, aviation, energy grid operation. Mistake cost: lives.

eudonia's primary target is the first two. The third occurs in finance and is acceptable. The fourth (life-safety) is a domain we are deliberately not optimizing for in v1 — those domains have specialized compliance, certification, and architecture requirements far beyond a table component.

## Observations on what dashboard tables aren't

A few things that are *not* universal across domains, despite being common in some prior art:

- **Spreadsheet-style cell-by-cell editing with formulas** — present in financial models, comp planning, demand planning. Not what most dashboards need. Excel-equivalence is not a v1 goal.
- **Drag-to-rearrange columns** — common in BI tools but rare in operational dashboards. A power-user feature.
- **Arbitrary user-defined column expressions** — Looker / Hex / Sigma style. A reporting-tool feature, not a dashboard table feature.
- **Detail-view-as-side-panel triggered from table** — common in CRM and support. Useful but a layout pattern, not a table feature.
- **Search/find with regex** — present in eDiscovery and security search. Specialized.
- **Saved per-user views** — common in CRM and BI. Important when present, not foundational to the table itself.

These are deferrable. Some belong to a heavier "DataGrid" component someday; some belong to consumers; some are out of scope entirely.

## Implications for v1 scope (preliminary, not a spec)

This is where the research starts to suggest scope. Treat as input to a separate scoping conversation, not as decided.

### Strongly supports including in v1
- Sortable columns.
- Numeric formatting (currency, percent, abbreviation, locale, decimal alignment, tabular numerals).
- Status pill cells with consumer-defined colors.
- Sparkline cells (eudonia already has Sparkline as a primitive — natural fit).
- Per-cell conditional formatting (color, value-based).
- Footer aggregations.
- Sticky header and sticky first column for tall/wide tables.
- Drill / row click handler.
- Avatar / icon / thumbnail in identity column.
- Per-row alerts/badges (small icons next to identity).
- Reasonable behavior at small tile sizes (the YoY scorecard case).
- Reasonable behavior at full-page sizes.
- Default light + dark theme support.

### Worth leaving room for via slot/escape
- Rich custom cell rendering (so consumers can render anything we don't ship: bullet graph cells, multi-line cells, composite cells, click-to-expand).
- Per-row expansion (for tree-as-table, lineage, audit trail).
- Per-row actions (button or menu).
- Bulk select (checkbox column).
- Live update without re-render thrash.
- Mobile collapse to card list.

### Explicitly out of v1, but the architecture shouldn't block them
- In-place editing.
- Virtualization / large-row-scale (millions of rows).
- Pivot / cross-tab.
- Heatmap-as-table layout.
- Bracket / tree-shaped layouts.
- Wallboard / FID rendering modes.
- Print-perfect artifacts (regulatory forms, AIA, ICS, etc.).
- Streaming append-only with auto-scroll.
- TanStack-driven advanced features (column reorder, column resize, column visibility menus, multi-sort).

### Explicitly not eudonia's job
- Data fetching, backend integration, server-side pagination logic.
- Complex permissions / row-level security enforcement.
- Form validation logic for editable cells.
- Compliance-grade audit trails (consumer wires up; we don't enforce).
- Workflow engines, state machines, approval routing.

## What this research is good for and where it falls short

**Useful for:**
- Sanity-checking that a v1 scope of "small dense tile + sortable + status pills + sparklines + footer + drill" actually covers a meaningful share of real dashboard tables across many domains.
- Knowing what to leave room for via slots and escapes (custom cell render is the big one).
- Avoiding over-fitting to finance/BI by understanding what other domains expect.
- Identifying patterns where eudonia could uniquely shine (sparkline cells, status pills, threshold indicators, the chart-table boundary).
- Knowing what to explicitly defer and why.

**Not useful for:**
- Deciding API shape — that's the next pass with grill-me.
- Deciding component decomposition — same.
- Validating any specific design choice — the research is breadth, not depth.

**Honest caveats:**
- Some domains (especially gaming/casino, scientific, energy) are described from secondary knowledge rather than direct experience. Field validation would sharpen these.
- The "universal" claims are based on the 29 domains surveyed; there are absolutely domains and table shapes not covered (e.g. aerospace flight test data tables, intelligence community tables, tabletop role-playing game character sheets, music software, CAD/CAM, pet adoption, dating apps' match tables, and many others). The patterns identified are robust but not exhaustive.
- The research focused on enterprise / professional contexts more than consumer apps. A separate sweep of consumer-app tables (Apple Health, Strava, MyFitnessPal, restaurant menus, recipe sites) would surface patterns we missed.
- The "tensions" section identifies real disagreements but not all possible ones.

## Next step

The natural next step is the grill-me skill applied to a draft v1 scope. Useful inputs to that conversation, drawn from this research:
- The "strongly supports including in v1" list.
- The "worth leaving room for via slot/escape" list.
- The cross-cutting tensions (especially: sort stability under updates, density default, color semantics, table-as-form vs table-as-report).
- The cell-type taxonomy as a checklist for "does our slot system handle each of these?"
- The setting taxonomy as a check on "does our default rendering hold up at workstation, mobile, and embedded surfaces?"

The user's first stated intention — "a simple table that fits the design language, extended as we hit more use cases" — looks well-supported by this research. The simple version covers the most common case across most domains; the extension paths (custom cell render, per-row expand, bulk select, live update, mobile collapse) are predictable and finite.
