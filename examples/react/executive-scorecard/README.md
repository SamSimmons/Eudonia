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

## Working Loop

- Keep work in `examples/` and import from `eudonia`.
- When a real layout gap appears, stop and name the exact friction.
- Add the minimum support in `packages/`.
- Switch the example over to the new library surface.
- Repeat for the next slice.
