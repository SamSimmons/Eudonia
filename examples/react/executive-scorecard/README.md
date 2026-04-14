# Customer Profitability Dashboard Example

This example starts from the Power BI Customer Profitability dashboard reference:

- Reference image: https://learn.microsoft.com/en-us/power-bi/create-reports/media/sample-customer-profitability/power-bi-dash.png
- Source article: https://learn.microsoft.com/en-us/power-bi/create-reports/sample-customer-profitability

## Dashboard Anatomy

- Narrow KPI strip on the left for headline metrics
- Larger analytical tiles in the center for trends and comparisons
- Repeating scorecard tiles on the right for team or region rollups
- Strong card boundaries and dense information without overlap

## Expected Interactions

- Click any tile to open a more detailed report page or drawer
- Hover to reveal exact values and deltas
- Switch time range globally without losing tile proportions
- Compare one manager, region, or business unit against the overall view

## Build Plan

1. Lock the example to the reference frame first.
   This is example-local: board canvas, outer gutter, muted page background, search bar, and a temporary screenshot overlay for alignment if needed.
   Library need: none unless `Screen` needs a tiny overflow tweak.

2. Build the outer three-rail shell.
   Use `Flex` and `FlexItem` to express a fixed left KPI rail, fluid center, fixed right scorecard rail, plus vertical stacking and gap control.

3. Build the tile matrix inside that shell.
   Use `Grid` and `GridItem` for fixed and fluid tracks, gaps, and numeric placement/span.
   This is where the example should really pressure the API.

4. Add the card chrome in the example only.
   Borders, padding, typography, labels, legends, search input styling, and the Power BI look stay out of the library.
   Defer `Box` until it solves a real spatial problem.

5. Add the charts and table with static local data and `recharts`.
   That includes grouped bars, the revenue trend, small sparklines, and the scorecard rows.

6. Do the pixel pass last.
   Once the structure is stable, tune track widths, row heights, gaps, line weights, and type until it lines up with the screenshot.

## Working Loop

- Keep work in `examples/` and import from `eudonia`.
- When a real layout gap appears, stop and name the exact friction.
- Add the minimum support in `packages/`.
- Switch the example over to the new library surface.
- Repeat for the next slice.
