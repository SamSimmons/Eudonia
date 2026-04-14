# Dashboard Reference Variants

Ten real-world dashboard variants with distinct layout and interaction patterns.

## 1. Executive Scorecard Board

**Primary use case**

CFO, CEO, or GM dashboard used to answer "Are we on track?" before drilling into any one function.

**Reference image**

![Customer Profitability dashboard](https://learn.microsoft.com/en-us/power-bi/create-reports/media/sample-customer-profitability/power-bi-dash.png)

Source: [Customer Profitability sample for Power BI](https://learn.microsoft.com/en-us/power-bi/create-reports/sample-customer-profitability)

**Layout anatomy**

- Narrow KPI strip on the left for headline metrics
- Larger analytical tiles in the center for trends and comparisons
- Repeating scorecard tiles on the right for team or region rollups
- Strong card boundaries and dense information without overlap

**Typical interactions**

- Click any tile to open a more detailed report page or drawer
- Hover to reveal exact values and deltas
- Switch time range globally without losing tile proportions
- Compare one manager, region, or business unit against the overall view

---

## 2. Sales Pipeline and Funnel Board

**Primary use case**

Sales manager or RevOps dashboard tracking opportunity count, stage progression, partner influence, and weighted revenue.

**Reference image**

![Opportunity Count Overview](https://learn.microsoft.com/en-us/power-bi/create-reports/media/sample-opportunity-analysis/opportunity-3.png)

Source: [Opportunity Analysis sample for Power BI](https://learn.microsoft.com/en-us/power-bi/create-reports/sample-opportunity-analysis)

**Layout anatomy**

- Top row of process-oriented comparisons
- Summary stat or KPI block at the right edge
- Bottom row for regional split and stage totals
- Optional filter rail for partner-driven, region, or rep filters

**Typical interactions**

- Select a sales stage to filter the rest of the board
- Toggle between opportunity count and weighted revenue
- Compare partner-driven and direct opportunities
- Keep stage order fixed to workflow order, not sorted by value

---

## 3. Cross-Filter Analysis Board

**Primary use case**

Merchandising, product analytics, or category-performance dashboard where users explore relationships across category, time, geography, and scatterplot outliers.

**Reference image**

![District Monthly Sales](https://learn.microsoft.com/en-us/power-bi/create-reports/media/sample-retail-analysis/retail11.png)

Source: [Retail Analysis sample for Power BI](https://learn.microsoft.com/en-us/power-bi/create-reports/sample-retail-analysis)

**Layout anatomy**

- Left-side slicer or selector rail
- Top-left ranked or categorical bar chart
- Top-right variance or comparison chart
- Bottom-left time-series panel
- Bottom-right scatter or bubble chart for outlier detection

**Typical interactions**

- Select a manager or region in a filter rail
- Click a bubble or bar to cross-highlight peer charts
- Clear one local selection without resetting page-level filters
- Compare one selected segment against the overall trend

---

## 4. Map Plus Timeline Explorer

**Primary use case**

Store rollout, delivery coverage, field operations, fleet activity, or location-based business performance.

**Reference image**

![New Stores Analysis](https://learn.microsoft.com/en-us/power-bi/create-reports/media/sample-retail-analysis/retail15.png)

Source: [Retail Analysis sample for Power BI](https://learn.microsoft.com/en-us/power-bi/create-reports/sample-retail-analysis)

**Layout anatomy**

- Large map panel on the left or upper-left
- Small categorical summaries on the right
- Long trend chart spanning the bottom
- Optional entity checklist or detail list on the far right

**Typical interactions**

- Select a point, bubble, or region on the map
- Pan and zoom the map without breaking surrounding layout
- Select an entity from a list and synchronize map and timeline
- Cluster markers at high density and expand them on zoom

---

## 5. Market Intelligence and Narrative Board

**Primary use case**

CMO or strategy dashboard tracking market share, competition, sentiment, and growth opportunities over time.

**Reference image**

![VanArsdel Market Share](https://learn.microsoft.com/en-us/power-bi/create-reports/media/sample-sales-and-marketing/sales5.png)

Additional reference:

![Sentiment Analysis](https://learn.microsoft.com/en-us/power-bi/create-reports/media/sample-sales-and-marketing/sales6.png)

Source: [Sales and Marketing sample for Power BI](https://learn.microsoft.com/en-us/power-bi/create-reports/sample-sales-and-marketing)

**Layout anatomy**

- Headline metrics or short KPI row near the top
- Main trend and benchmark charts in the middle
- Supporting context panel at the bottom
- Clear visual hierarchy optimized for reading from top to bottom

**Typical interactions**

- Toggle between own-brand and market-wide views
- Filter by segment, manufacturer, or region
- Annotate significant dips or spikes with narrative callouts
- Move between report pages while preserving global context

---

## 6. Plan Versus Actual and Variance Board

**Primary use case**

Finance, FP&A, budget owners, or operational planning teams comparing plan, latest estimate, and actuals.

**Reference image**

![YTD Spend by Cost Elements](https://learn.microsoft.com/en-us/power-bi/create-reports/media/sample-it-spend/it6.png)

Additional reference:

![Plan Variance Analysis](https://learn.microsoft.com/en-us/power-bi/create-reports/media/sample-it-spend/it7.png)

Source: [IT Spend Analysis sample for Power BI](https://learn.microsoft.com/en-us/power-bi/create-reports/sample-it-spend)

**Layout anatomy**

- Filter rail on the left for area, subarea, and cost groups
- KPI summary row at the top
- Central comparison charts showing plan, estimate, and actual
- Bottom section for country, region, or cost-center variance

**Typical interactions**

- Filter by business area and subarea
- Toggle between absolute value and percent variance views
- Keep zero lines visible and legible across all variance charts
- Compare one category against the entire portfolio

---

## 7. Workforce and Demographic Composition Board

**Primary use case**

HR or people analytics dashboard for hiring mix, active employees, attrition, and bias checks.

**Reference image**

![New Hires](https://learn.microsoft.com/en-us/power-bi/create-reports/media/sample-human-resources/hr-3.png)

Source: [Human Resources sample for Power BI](https://learn.microsoft.com/en-us/power-bi/create-reports/sample-human-resources)

**Layout anatomy**

- Balanced multi-panel grid
- At least one combo chart for change over time
- One stacked or grouped demographic chart
- One part-to-whole chart such as pie or donut
- One waterfall or decomposition-style chart for net change

**Typical interactions**

- Select age group, gender, region, or ethnicity
- Compare one demographic slice to overall totals
- Toggle between hires, actives, separations, or bad hires
- Inspect outlier months or subgroups through linked highlights

---

## 8. Realtime Alert Desk

**Primary use case**

NOC, SRE, SOC, or service operations wallboard answering "What needs attention right now?"

**Reference image**

![Alerts Overview](https://grafana.com/api/dashboards/4181/images/2654/image)

Source: [Alerts - Overview dashboard on Grafana Labs](https://grafana.com/grafana/dashboards/4181-alerts-overview/)

**Layout anatomy**

- Thin top strip of severity or status cards
- Large central panel for active incidents or fired alerts
- Dense table or list at the bottom for actionable rows
- Minimal decoration, optimized for fast scanning

**Typical interactions**

- Auto-refresh without full page reload
- Filter by severity, namespace, service, or environment
- Click a row to open detail, runbook, or linked dashboard
- Acknowledge, silence, or open an incident from the current context

---

## 9. Table and Log Investigation Workbench

**Primary use case**

Support engineer, platform engineer, fraud analyst, or security analyst moving from aggregate monitoring into raw evidence.

**Reference images**

![Logs example](https://grafana.com/media/docs/grafana/panels-visualizations/screenshot-logs-example2-v12.3.png)

![Table filter interaction](https://grafana.com/media/docs/grafana/panels-visualizations/filter-column-values_12.2.png)

Sources:

- [Grafana logs visualization docs](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/logs/)
- [Grafana table visualization docs](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/table/)

**Layout anatomy**

- Filter bar or time-range bar at the top
- Table or log stream as the main panel
- Expandable row detail inline or in a secondary pane
- Dense monospace or semi-monospace presentation when needed

**Typical interactions**

- Sort by any visible column
- Filter from column headers or row values
- Expand one row to inspect structured detail
- Preserve time-range context when jumping from chart to log row

---

## 10. Multi-Pane Time-Series Workstation

**Primary use case**

Trading, advanced observability, industrial monitoring, or any expert workflow where users need synchronized time-series panes with tools and overlays.

**Reference images**

![Trading workstation UI](https://www.tradingview.com/charting-library-docs/assets/images/user-interface-a5b2a6d4be777ffa1fb4a2942e890b74.png)

![Chart panes](https://www.tradingview.com/charting-library-docs/assets/images/pane-d44d70e4c4be2d846c4ecdd789fc0e17.png)

Sources:

- [TradingView Charting Library UI elements](https://www.tradingview.com/charting-library-docs/latest/ui_elements/)
- [TradingView multi-chart layout article](https://www.tradingview.com/chart/EURUSD/GruVJYB1-Watch-multiple-charts-at-once-and-build-the-perfect-workspace/)

**Layout anatomy**

- Top toolbar for symbol, interval, tools, and layout actions
- Main price or primary metric pane
- One or more secondary indicator panes underneath
- Side widgets for watchlists, news, objects, or details
- Optional lower account, order, or event panel

**Typical interactions**

- Zoom and pan on a shared time axis
- Synchronized crosshair across panes
- Add, remove, resize, reorder, or maximize panes
- Draw annotations and overlays on the primary pane
- Link multiple charts by symbol, interval, or cursor
