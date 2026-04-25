# Stephen Few on tables

Stephen Few is the most table-focused of the major dataviz writers. He has written more on the practical design of tables than perhaps anyone in the field, primarily across two books: *Show Me the Numbers: Designing Tables and Graphs to Enlighten* (2004, 2nd ed 2012) and *Information Dashboard Design: Displaying Data for At-a-Glance Monitoring* (2006, 2nd ed 2013). His blog at perceptualedge.com adds substantial commentary on dashboard design specifically.

## Few's central position on tables vs graphs

Few devotes substantial space to a table-vs-graph decision framework. The condensed version, from *Show Me the Numbers*:

**Use a table when:**

- The display will be used to **look up individual values**.
- The display will be used to **compare individual values** (not series, regions, trends).
- **Precise values are required.**
- The quantitative information involves **more than one unit of measure** (revenue and units, dollars and percentages).
- Both **detail values and summary values** must be displayed.

**Use a graph when:**

- The message lives in the **shape of the data** — pattern, trend, exception.
- The reader will **explore relationships** among multiple values.
- The reader will **scan many values quickly** to spot something.

The two forms answer different questions and are not interchangeable. Few's persistent complaint about modern dashboards is that designers reach for graphs (especially gauges, donut charts, and 3D bars) when a clean table would have served better.

The implication for eudonia: the table is not a fallback for "data we couldn't visualize." It is the right form for many specific, common dashboard questions. Designing a great table component is in scope, not a consolation prize for not having a chart.

## Few's structural recommendations

From *Show Me the Numbers* and his subsequent dashboard work, the consolidated table-design checklist:

### Alignment
- **Right-align numbers.** Always. Period.
- **Decimal-align if practical.** Especially when values vary in magnitude (`1,234.5` and `12.34` should align on the decimal).
- **Left-align text.** Names, descriptions, categories.
- **Center-align only short fixed-width content** like single-letter codes or status icons. Avoid centering most content.
- **Headers align with their column content.** Numeric headers right-aligned; text headers left-aligned. (This is sometimes resisted by designers who want all headers centered for visual neatness; Few's stance: alignment carries information.)

### Gridlines and rules
- **Avoid heavy gridlines.** They fragment the table and add visual noise.
- **Replace gridlines with white space.** Adequate row height does the work.
- **Use thin horizontal rules at structural boundaries.** Above the header, below the header, above the totals row, between groups in a hierarchical table.
- **Avoid vertical rules entirely** in most cases. Use column padding instead.
- **Light fill or shading is acceptable** for alternate rows in very dense tables, but only if it remains subtle.

### Type
- **Use a clean sans-serif** for table body. Few specifically endorses faces with strong tabular figures.
- **Body text in normal weight.** Reserve bold for emphasis (totals, the row of interest).
- **Headers in a slightly different weight or color** rather than a different size or rule-bordered cell. Few often uses a slightly bolder or slightly grayer header.
- **Avoid italics for body data.** Reserve italics for footnotes or qualifiers.
- **Use consistent font sizes** within the table; only the header may legitimately differ.

### White space and density
- **Generous row height** — at least 1.4-1.6× type size. Cramped rows hurt scanning.
- **Adequate column padding** — at least 1ch on each side of a column.
- **Don't pack so densely that values run together.** Few warns specifically against the "spreadsheet default" of equal-height tiny rows that produce visual noise.

### Hierarchy
- **Group rows logically.** By category, by region, by product line.
- **Indent subgroup rows** to show structure. Two- or three-level indentation is common.
- **Add subtotal rows above or below each group.** Few prefers above for "summary first, detail follows" layouts.
- **Use a slightly different weight or color for subtotal rows** so they read as structure, not data.
- **Show grand totals at the bottom** in distinct treatment (often bolder, sometimes a thin rule above).

### Color
- **Use color sparingly.** "When everything is highlighted, nothing is."
- **Reserve color for encoding** — status, threshold breach, group identity. Don't use color decoratively.
- **Use light, low-saturation colors as backgrounds.** Saturated colors should be reserved for data-bearing elements.
- **Always pair color with a redundant signal** — text, icon, label. Don't make color the only carrier of meaning.

### Numeric formatting
- **Consistent precision per column.** All values in a column share decimal places.
- **Thousands separators** (commas in US conventions) are mandatory for any number above 1,000.
- **Negative numbers in red** is acceptable but not preferred. Few prefers a minus sign or parentheses; red can be reserved for stronger signaling.
- **Currency symbols** at the top of the column or in the header rather than repeated on every row.
- **Use "K", "M", "B" abbreviations** when raw values would be unreadably long; show the full value in tooltip or reveal.
- **Don't show false precision.** If the underlying value is rounded to the nearest hundred, show it that way.

## Tables on dashboards specifically

Few's *Information Dashboard Design* extends the general guidance with dashboard-specific considerations. The key claims:

### Dashboards are not generic reports
A dashboard is "a visual display of the most important information needed to achieve one or more objectives that has been consolidated on a single computer screen so it can be monitored at a glance." (Few's definition, *IDD* ch.1)

This shapes table design on dashboards:

- **At-a-glance reading is the primary mode.** Tables on dashboards must surface the relevant signal in seconds, not after careful study.
- **Density matters more than on standalone reports.** Dashboard real estate is precious; tables compete with charts for space.
- **Sparklines and bullet graphs in cells extend the table's reach.** Few is the inventor of the bullet graph, designed specifically as a compact alternative to gauges that fits naturally in a table cell.
- **Status indication is expected.** Dashboard tables almost always need to encode status — green/yellow/red, on-track/off-track, trending up/down. The encoding must be honest and accessible.

### The bullet graph
A Few invention. Designed as a replacement for gauges and meters that fits in a small space and conveys: a current value, a target, a comparative range (good/satisfactory/poor zones), and optionally a comparison value (last period).

Visually it is a thin horizontal bar with:
- A background gradient or banded fill encoding performance ranges.
- A bold horizontal bar showing the current value.
- A vertical tick showing the target.
- Optionally a smaller tick showing the comparison value.

The eudonia codebase already supports a bullet-graph-like construction (the Target vs Actual chart in the executive scorecard). The bullet-graph-as-table-cell is a natural extension and explicitly Few-aligned.

### The KPI strip
Few writes about the "row of summary tiles" pattern that appears across most dashboards. Each tile is essentially a single-row, multi-column micro-table:

- Label
- Value
- Comparison
- Trend (often sparkline)
- Status indicator

The same principles apply: alignment, restraint with color, integrated typography, no chrome.

### What Few argues against
- **Gauges and dials.** Decorative, low data density, take too much space.
- **3D charts of any kind.** Distortion, no advantage over 2D.
- **Pie charts beyond 3 slices.** Hard to compare.
- **Excessive use of color.** Especially traffic-light coloring on every cell.
- **Rotated text.** Headers should be readable without head tilt; if a header doesn't fit, the column is wrong.
- **Excessive gridlines.** "If you can see the grid, it's too much."
- **Donut charts.** "Take a pie chart, drill a hole in it. You haven't improved it."

## Few's stance on accessibility

Few writes more about perception and clarity than about formal accessibility, but the implications are consistent with WCAG-aligned design:

- Color should always be paired with another signal (shape, text, position).
- Contrast ratios should be high enough that the table reads in monochrome, in low light, and to color-vision-deficient readers.
- Type should be large enough to read at workstation distance without strain.
- Layout should support keyboard scanning (visible focus, predictable column order).

These overlap with Tufte's "test in monochrome" guidance but Few is more explicit about it as a usability requirement.

## On data ink

Few aligns with Tufte's data-ink ratio but is somewhat more permissive on chrome that aids comprehension:

- Subtle background banding is acceptable in very dense tables.
- A column delimiter (vertical line) is acceptable when columns are visually similar (numeric next to numeric) and confusion is likely.
- Header backgrounds (subtle gray) are acceptable to delineate the header row clearly.

The general principle holds: minimize chrome, but not to the point of damaging usability.

## On the "small multiples" pattern

Few discusses small multiples (Tufte's term) as one of the most powerful patterns in dashboard design. For tables this manifests as:

- **A row of identical small tables**, one per region or product, shown in a grid. Each table has the same shape; the data differs.
- **A row of identical sparkline cells**, each showing a different metric over the same time window.
- **A grid of stat tiles** (the KPI strip), each a tiny table shape.

Eudonia's existing Grid layout primitive supports small multiples directly. The table component should look right when used as the unit cell of a small multiples layout.

## On dashboards-as-monitoring vs dashboards-as-analysis

Few distinguishes:

- **Monitoring dashboards** — a fixed set of indicators reviewed at glance, daily.
- **Analytical dashboards** — exploratory, supports drilling, filtering, comparison.

Tables play different roles:
- In monitoring dashboards, tables are dense at-a-glance summaries.
- In analytical dashboards, tables are interactive surfaces for exploration.

Eudonia's stated focus is closer to monitoring/scorecard dashboards, but the framework is broad enough to support both. The table component's defaults should suit monitoring; its escape hatches should enable analysis.

## On table titles and supporting text

Few argues for clear, descriptive titles and minimal supporting chrome:

- **Title above the table** in distinct typography.
- **Subtitle or context line** for time period, scope, units (e.g. "by Quarter, USD millions").
- **Footnotes below** for caveats, sources, asterisked qualifiers.
- **No "border boxes"** around the whole table.

This matches the existing eudonia ChartCard pattern (title + subtitle + body + optional footer area), suggesting the table should compose into the same card shell rather than carry its own chrome.

## Common Few mistakes (his lists of what designers do wrong)

From *Now You See It* and his blog, the recurring complaints:

1. Using a chart when a table would be better.
2. Using a gauge or dial when a bullet graph or sparkline would be better.
3. Showing "too many digits of precision" — false precision misleads.
4. Using color decoratively rather than as an encoding.
5. Filling the table with redundant chrome (rules everywhere, banded rows, repeated currency symbols, decorative icons).
6. Cramming too much on the dashboard so each table is too small to read.
7. Using tiny fonts to fit more.
8. Failing to align numbers properly.
9. Placing legends and axes far from the data they describe.
10. Designing for printed reports when the audience views on screen, or vice versa.

Most of these have direct table-component implications.

## Inferences for the eudonia table component

Pulling Few's material toward design:

1. **Right-align numbers; decimal-align when needed; left-align text.** Mandatory default.
2. **Tabular figures.** Mandatory default. Already a stated preference in eudonia.
3. **Minimal chrome.** No vertical rules; horizontal rules only at structural boundaries (header, footer, section breaks).
4. **Type-driven hierarchy.** Header, body, footer differentiated by weight and color, not by rules and boxes.
5. **Group with indentation, not nesting.** Subgroup rows visually offset; subtotals visually distinct.
6. **Status pill cells are not optional** for dashboard tables. Color + label, not color alone.
7. **Sparkline cells and bullet-graph cells are first-class.** The bullet graph is Few's invention and should be honored.
8. **Sensible default precision.** Per-column consistent decimals; thousand separators; locale-aware.
9. **Footer aggregations** are normal, not a feature. Sum, mean, weighted mean.
10. **Restraint with color.** Default is monochrome; color used for encoding only.
11. **Test in monochrome.** The table should remain useful when printed black-and-white.
12. **Small-multiples-friendly.** The table at tile size should look as right as at full-page size.
13. **Title and subtitle live above (or in the wrapping card), not in the table itself.** Compose with the existing ChartCard.

## Bibliography

- Few, Stephen. *Show Me the Numbers: Designing Tables and Graphs to Enlighten.* 2nd ed. Analytics Press, 2012.
- Few, Stephen. *Information Dashboard Design: Displaying Data for At-a-Glance Monitoring.* 2nd ed. Analytics Press, 2013.
- Few, Stephen. *Now You See It: Simple Visualization Techniques for Quantitative Analysis.* Analytics Press, 2009.
- Few, Stephen. *Signal: Understanding What Matters in a World of Noise.* Analytics Press, 2015.
- Few, Stephen. Perceptual Edge blog and library — perceptualedge.com — extensive critique of specific dashboards and visualizations, much directly relevant to tables.
- Few, Stephen. "Bullet Graph Design Specification." 2010 (revised). Available via perceptualedge.com.
