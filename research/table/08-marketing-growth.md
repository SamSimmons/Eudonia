# Marketing and growth

The marketing analytics table is performance-driven and platform-mediated. Reference tools and surfaces: Google Ads, Meta Ads Manager, LinkedIn Campaign Manager, Google Analytics 4, Adobe Analytics, Mixpanel, Amplitude, Iterable, Braze, Customer.io, Klaviyo, Hubspot Marketing, Marketo, Segment, Optimizely, VWO, AppsFlyer, Branch, Singular, Adjust, Looker / Tableau marketing dashboards.

## Who is at the screen

- **Performance marketers** running paid campaigns daily. The Ads Manager table is their workplace. They tune bids, pause underperformers, scale winners — many times per day.
- **Lifecycle / CRM marketers** managing email, push, in-app campaigns. The campaign list and the segment library are their home tables.
- **Growth analysts** building experiment readouts, attribution analyses, cohort tables.
- **SEO managers** tracking rankings, content performance, backlink profiles.
- **Brand / content marketers** reviewing content performance, social engagement.
- **Marketing ops** building dashboards, managing data integrations.
- **CMOs and VPs** reading rolled-up dashboards.
- **Affiliate / partner managers** tracking partner-driven traffic and revenue.

Setting is workstation, often with multiple platform UIs open at once. The "compare ad spend in Meta vs LinkedIn" task is a cross-tab juggling act.

## Jobs to be done

- Find the campaign / ad / creative that is winning right now.
- Cut spend on the campaign that is losing.
- Decide whether yesterday's spike was real.
- Attribute revenue to the right channel.
- Compare two creatives at the same stage of an A/B test.
- Build a segment for the next campaign.
- Report performance to leadership in a weekly review.
- Find the keyword that ranks position 4 and could be pushed to position 1.
- Investigate why the email open rate dropped.
- See whether a campaign is pacing toward its budget.

## Representative tables

### Campaign / ad set / ad table (paid media)
The Ads Manager core. Each row a campaign, ad set, or ad — switchable level. Columns: name, status, budget, spend, impressions, clicks, CTR, conversions, CPA, ROAS, frequency, reach. Row scale: tens to thousands per account. Sort by spend or ROAS. Filter by status. Color on ROAS thresholds. Toggle status from the row. Edit budget in place.

### Hierarchical paid media table
Same shape but expandable: Campaign → Ad Set → Ad → Creative. Columns at each level. Row scale: hundreds with expansion. Subtotals at each level.

### Keyword / search term table
For SEM. Each row a keyword. Columns: keyword, match type, search volume, impressions, clicks, CTR, position, conversions, cost. Row scale: hundreds to hundreds of thousands. Sort by spend, by position, by CTR. The "search terms report" is a different but related table — actual user queries that triggered ads.

### Creative / asset performance table
Each row a creative variant. Columns: thumbnail, name, impressions, clicks, CTR, engagement, install rate, format. Row scale: dozens to hundreds. The thumbnail column is mandatory and visually dominant — actual creatives, not text.

### Email / push campaign table
Each row a campaign send. Columns: name, sent date, audience, sent count, delivered, opens, clicks, conversions, unsubscribes, revenue. Row scale: dozens to thousands. Sort by send date descending. Drill to individual campaign report.

### Email / push campaign performance over time
Each row a date or a cohort; columns are aggregated metrics. Row scale: dozens. Often shown next to a chart of the same data.

### Audience / segment library table
Each row a saved segment. Columns: name, definition, member count, last refresh, owner, used by campaigns. Row scale: dozens to hundreds. Drill to segment details and to campaigns using it.

### Cohort / retention table
Defined separately in product analytics but used heavily in lifecycle marketing too. Rows are cohorts (signup week or campaign date), columns are time periods, cells are retention or revenue. Heatmap presentation.

### Funnel / conversion table
Steps as rows, conversion counts and rates as columns. Often per-segment. Row scale: handful per funnel; many funnels. Compare segments side-by-side.

### Attribution model comparison table
Same conversions attributed under different models (last-click, first-click, linear, position-based, data-driven). Row scale: handful of channels; columns per model. Used to debate methodology choices.

### Channel performance summary
Roll-up across channels. Each row a channel (paid search, social, email, organic, direct, affiliate). Columns: spend, impressions, clicks, sessions, conversions, revenue, ROAS. Row scale: 10–20. Footer total. The CMO's slide.

### A/B test / experiment results table
Each row a variant in an experiment. Columns: variant, exposure, conversion rate, lift vs control, confidence, p-value, revenue per user. Row scale: 2–10 per experiment. Color on significance reached vs not. Critical for experiment platforms.

### Experiments dashboard
List of all experiments. Columns: name, owner, status (running/concluded/draft), start date, days running, variants, primary metric, current lift, decision. Row scale: tens to hundreds. Sort by status and by significance.

### SEO ranking table
Each row a keyword for a domain. Columns: keyword, current position, change vs last week, search volume, URL ranking, intent, page authority. Row scale: hundreds to tens of thousands. Sort by position-change to find movers.

### Content performance table
Each row a piece of content (article, landing page, blog post). Columns: title, URL, sessions, bounce rate, time on page, conversions, social shares, ranks. Row scale: hundreds to tens of thousands. Sort by sessions or by conversions.

### Backlink table (SEO)
Each row a backlink. Columns: source URL, target URL, anchor text, domain authority, follow status, first seen, lost. Row scale: hundreds of thousands.

### Social media post performance
Each row a post. Columns: time, channel, content preview, impressions, engagement, clicks, shares. Row scale: tens to hundreds per week.

### Influencer / affiliate performance
Each row a partner. Columns: name, channel, code, clicks, conversions, revenue driven, payout, status. Row scale: dozens to thousands.

### Subscriber list / unsubscribe table
For email teams. Each row a subscriber or unsubscribe event. Columns: email, source, subscribed date, unsubscribed date (if applicable), reason. Row scale: thousands to millions.

### Spend pacing table
Each row a campaign or budget bucket. Columns: budget, spent so far, daily run rate, projected end-of-period, on-pace status. Row scale: dozens. Color on pacing health.

## Behaviors and needs

- **Cell-level conditional formatting.** ROAS, CTR, CPA all need green/yellow/red bands or quantile heatmap. The table is read for outliers more than absolutes.
- **Sort and re-sort by every metric.** Universal.
- **Compare two periods.** Today vs yesterday, this week vs last week. Often shown as paired columns or as a single column with a delta sub-cell.
- **Aggregation level toggle.** View by day, by week, by month, by campaign, by ad set, by ad. Same data, different rows.
- **Currency awareness across markets.** A multi-region campaign table shows USD, EUR, GBP. Conversion to a reporting currency or per-row native currency are both expected.
- **Pause / resume from the row.** Status is interactive.
- **Edit budget / bid in place.** Tab between rows; commit on Enter.
- **Bulk action.** Select 20 ad sets, increase budget by 10%, pause, duplicate.
- **Threshold-based alerting from the table.** "Show me everything above $50 CPA." Saved.
- **Pivot / group by dimension.** "Show me spend by country," "by device," "by audience." Same underlying data; different grouping.
- **Date-range scoping.** Universal. The table re-runs.
- **Compare to benchmark / target.** A benchmark line or column showing target ROAS or target CPA.
- **Funnel-aware columns.** Sometimes the same number is shown as a count, a rate, and a trend in three adjacent cells.
- **Drill from row to platform UI.** Click a campaign → opens that campaign in Meta Ads Manager. Cross-platform reporting tools especially.
- **Naming convention awareness.** Campaign names encode metadata (e.g. `US_FB_Q4_2024_Retargeting`). Some teams parse these into virtual columns.
- **Sample-size / statistical caveats** for low-volume rows. Show "low-volume" badge on rows with too few conversions to draw conclusions.
- **Save view.** Filters, sorts, column sets. Shared across team.
- **Annotation.** Mark a date as "campaign launched" or "tracking pixel broken."
- **Export to CSV / Sheets.** For ad-hoc analysis.

## Frustrations

- A ROAS column where green doesn't account for ROAS being higher than target *because volume is too low to be meaningful*.
- Budget edits in place that don't sync back to the platform for 10 minutes, leaving the rep to wonder if they took.
- A "compare last week" column that is blank for new campaigns instead of saying "new."
- Dimensions that have hundreds of values producing 200-row tables that need to be top-N'd before they're readable.
- Currency mixing without conversion (a column that shows `5000` without indicating USD vs JPY).
- An aggregation that double-counts a conversion attributed to two channels.
- A re-sort that is *partially live* — the sort applies to the visible page only, not the whole result set.
- Hidden creative thumbnails (just a name) when the visual is the entire reason for the analysis.
- A "pause campaign" button that takes 5 seconds to confirm and gives no feedback in between.
- Cohort tables where the diagonal isn't aligned because of variable column widths.
- Search terms reports that don't let you add a negative keyword from the row.

## Domain-specific notes

- **Outliers are the point.** The marketer is scanning for the row that broke a pattern. Conditional formatting and sortable everything are more important than total readability.
- **Heterogeneous data sources.** A modern marketing dashboard pulls from 5+ ad platforms, a CRM, an analytics tool, and a data warehouse. Tables need to render whatever schema the warehouse exposes — flexible columns are necessary.
- **Currency, locale, time zone.** A global campaign table is full of localization issues. Per-cell currency and per-row time zone are real edge cases.
- **Visuals matter** — creative thumbnails, brand logos, country flags, channel icons. Tables in this domain are more visually rich than in finance or BI.
- **The platform UIs are the prior art.** Meta's, Google's, LinkedIn's, TikTok's ad managers are the reference for what marketers expect. They are all dense, sortable-everything, edit-in-place, with conditional formatting.
- **Privacy and tracking changes** (iOS ATT, third-party cookie deprecation, GDPR consent) cause many cells to be "modeled" or "estimated" rather than measured. Tables need to indicate uncertainty (e.g. "modeled" badge, asterisk with footnote).
- **A/B test tables are quasi-statistical.** The component should accept the consumer's significance/confidence rendering rather than building one in.
- **Cohort and retention tables are visually distinct** — heatmap-as-table, sticky first column and header, diagonal reading. Worth treating as a distinct pattern.
- **Daily reporting cadences** mean tables are looked at in roughly the same way every day. Saved views and persistent layouts are not optional.
- **Marketing is creative-adjacent.** Tools should look polished. The "data table that looks like a spreadsheet from 2003" aesthetic that survives in finance does not survive here.
