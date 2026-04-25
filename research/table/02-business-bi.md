# Business intelligence and executive reporting

The other named target for eudonia. Distinct from finance in that the audience is broader (executives, line managers, individual contributors across functions) and the data tends to be aggregated rather than transactional. Reference tools: Power BI, Tableau, Looker, Mode, Sigma, Hex, Metabase, ThoughtSpot, Qlik. The example dashboard already in the repo (executive scorecard with the YoY revenue table) lives squarely in this domain.

## Who is at the screen

- **C-suite executives** glancing at a recurring dashboard before a meeting. Want headline numbers and the ability to drill if a number looks wrong. Tolerance for friction is essentially zero.
- **Functional managers** (sales VP, marketing director, finance manager) who own a number and review it daily or weekly. They know their data well; they are looking for anomalies and explanations.
- **Business analysts** building the dashboards and answering ad-hoc questions. Power users; they manipulate the table much more than they passively read it.
- **Line operators** (account managers, store managers, regional reps) consuming dashboards built for them, focused on their own slice. Often non-technical; the table needs to be self-explanatory.
- **Board members and external stakeholders** seeing periodic reports. Static-feeling tables, often exported as PDF or rendered in a deck.

Setting is mostly a single laptop or large desktop monitor. Some wall-mounted "TV dashboard" usage exists but is less polished than the equivalent in finance or ops.

## Jobs to be done

- Answer "are we on track?"
- Find the segment, region, product, or rep that explains the topline.
- Compare this period to last period, plan, and forecast.
- Spot anything that looks wrong before someone else does.
- Defend a number in a meeting.
- Hand a number to a finance team for a roll-up.
- Decide where to look next (which detail to drill into, which person to ask).
- Build a one-off table to share in Slack or email.
- Take a number from a dashboard and paste it into a slide.

## Representative tables

### KPI rollup table (the YoY revenue table in the repo)
The canonical "small dense business table." A handful of rows (products, regions, salespeople, segments) and a handful of metric columns (current, prior, change, change %). Row scale: 5–50. Refresh: daily or on-demand. Footer with grand total essentially required. Color on the change column (positive green, negative red) is standard. Often the table is the focal element of the tile; the chart next to it just visualizes one column.

### Plan vs. actual / variance table
By cost center, project, GL account, or business line. Columns: bucket, plan, actual, variance, variance %, often forecast and full-year-projection columns too. Row scale: tens to a few hundred. Hierarchical (department > team > line item) with expand/collapse. Often paired with a tornado chart showing the same data graphically. Conditional formatting by variance threshold (red over 10% over budget).

### Sales pipeline table
Each row is a deal/opportunity. Columns: account, stage, amount, probability, weighted amount, owner, close date, age in stage, last activity. Row scale: hundreds for one rep, thousands for a sales org. Sortable by everything. Filtered constantly (by stage, by owner, by close-quarter). Editable in place for power users (change stage, update amount).

### Account / customer list with health
For customer success and account management. Columns: account name, ARR, plan tier, MRR change, NPS, last login, health score, owner, renewal date, days to renewal. Row scale: 50–5000. Color heavily — health and renewal-urgency. Sort by renewal date is the everyday use.

### Cohort retention table
Rows are signup cohorts (one per week or month), columns are periods after signup, cells are retention percentages. The whole table is a heatmap. Row scale: 12–104 (one per week or month over 1–2 years). Column scale: similar. Read diagonally — the diagonal lines up "this many periods after signup." Sticky header and sticky first column are mandatory; otherwise the data is illegible.

### Funnel breakdown table
Each row is a step in a funnel; columns are users entering, users converting, conversion %, drop-off. Row scale: 5–20. Often grouped by segment (mobile vs desktop, country, plan tier). Shown alongside a sankey or a funnel chart but the table carries the precise numbers.

### Marketing campaign table
Each row a campaign or ad set. Columns: name, channel, spend, impressions, clicks, CTR, conversions, CPA, ROAS. Row scale: tens to thousands. Sorted by spend or ROAS most of the time. Drill down to ad-level rows. Edit budgets in place when the dashboard wraps the platform UI.

### Vendor / supplier scorecard
Each row a vendor; columns are spend, on-time delivery %, quality score, contract end date, risk rating. Row scale: tens to hundreds. Rarely updated in real time; quarterly or monthly review cadence. Often the source for decisions (renew, renegotiate, drop).

### Inventory / stock table (in business BI context, not warehouse ops)
Each row a SKU; columns are on-hand, on-order, reorder point, days of cover, last sold, sell-through. Row scale: hundreds to tens of thousands. Sortable, filterable. Often the trigger for replenishment workflows (mark for reorder).

### Self-serve "explore" results table
The table view of a data exploration tool (Looker Explore, Mode SQL output, Hex). Columns are whatever the user selected; rows are query output. Row scale: 1 to many million (with paging or virtualization). Almost completely uncolored — analysts want raw values, not formatted dashboards. Export to CSV is the expected next step.

### Pivot table
Multidimensional cross-tabs with row groups and column groups. Sales by product (rows) by region (columns) with totals. Row and column scale variable. Distinct shape from a regular table — both axes carry headers, both have subtotals. Tableau, Power BI, Excel are the references.

### Recurring report table
A table that lives inside a scheduled report (PDF, email, Slack snippet). Columns optimized for readability, no interactivity. Often the same shape as the dashboard table but rendered statically. Footer totals essential.

### Data quality / freshness table
Operational meta-table for the analytics team. Each row a dataset or model; columns are last-updated, row count, expected count, drift %, alert state. Row scale: tens to hundreds. Sort by alert state to see what is broken.

### Forecast vs actual time table
Periods (months, quarters) as rows; actual, forecast, variance as columns. Row scale: 12–48. Often the headline of an FP&A report. Footer is annual totals.

## Behaviors and needs

- **Sort and re-sort.** Universal. Even a "static" report-style table is expected to sort.
- **Search / filter on a column.** Type in a search box and rows that don't match disappear. Per-column search appears in heavier tables.
- **Show/hide columns.** Especially in self-serve and pipeline tables — different reps want different views.
- **Group / drill-down expansion.** Region > country > city. Click a row to expand into its children. Subtotals at each level.
- **Footer totals.** Sum, average, median, min, max. Sometimes per-column-configurable.
- **Conditional cell formatting.** Threshold colors, heatmap-by-quantile, sparkline-in-cell, data bars (Excel-style horizontal bars inside a numeric cell).
- **Compare against a benchmark column or row.** Variance to plan, change vs prior period, contribution to total.
- **Cross-filter.** Click a row in this table → other tiles on the dashboard filter to that row's segment.
- **Export.** CSV, Excel, PDF. Copy-paste to Excel must produce a clean table.
- **Print.** Page-break handling, header repeats on each page. Often forgotten until someone tries to print.
- **Drill from a row to a detail page.** Click a customer row → customer profile. Click a campaign → campaign detail dashboard.
- **Time-range and filter context received from the dashboard.** The table re-runs when the dashboard's date range or filter selection changes.
- **Annotations and comments.** Power users want to attach a note to a cell ("Q3 dip due to migration") that stays with the dashboard.
- **Saved views.** A particular sort, filter, and column config saved by name.
- **Format awareness.** Currency, percent, large-number abbreviation (M, B), per-cell precision. Locale-aware separators.

## Frustrations

- Numbers that are not aligned by decimal point, making columns of money look like a mess.
- Charts and tables on the same dashboard showing slightly different totals because of rounding.
- A table that re-renders entirely when one row changes, losing the user's scroll position.
- Conditional formatting that uses inaccessible color combinations (red/green only).
- An "export to Excel" that produces a file with merged cells, broken formulas, and HTML artifacts.
- A pivot table that demands a full re-query when the user just wants to swap a row dimension.
- Large numbers shown without abbreviation (`12,348,572,991`) when `12.3B` was meant.
- A footer total that doesn't update when a filter is applied (still showing the unfiltered total).
- A "drill-down" that takes 10 seconds and the user can't tell whether anything is happening.
- A table that wraps a long account name across three lines and breaks the row rhythm of the whole grid.
- Locale-insensitive formatting — `1,000.00` vs `1.000,00` matters globally.
- Hidden columns that come back hidden every time the dashboard is opened, ignoring the user's last setup.

## Domain-specific notes

- **The table is often the most important element on the dashboard.** Charts get the visual real estate but the precise numbers come from tables. People copy from tables, screenshot tables, paste tables into slides.
- **The audience is mixed-technical.** A table needs to be readable by a CFO who looks at it once a week and useful to an analyst who lives in it.
- **Dashboards are templates.** The same shape gets reused across regions, business units, products. The table component must look right with 5 rows and with 500.
- **Refresh is human-paced.** Most BI tables refresh hourly or daily. Live data is rare and usually a separate "operational dashboard."
- **Dashboards travel.** Embedded in Slack messages, email, slides, customer-facing portals. The table needs to look right at small sizes and in print.
- **Dark mode is increasingly common but not the default.** Many BI tools still default to light. Conditional formatting must work in both.
- **Permissions affect what the user sees.** Row-level security is common (a regional manager only sees their region). The component doesn't enforce this but must be content-agnostic enough not to break.
- **The "small dense table tile" pattern is everywhere** and is the actual shape eudonia's first version targets — handful of rows, handful of columns, sits inside a card on a dashboard, optional footer, conditional formatting on one or two columns. The YoY revenue table in the example is a textbook instance.
