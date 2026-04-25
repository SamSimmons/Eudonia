# Product analytics

The "what are users doing in the product" workspace. Reference tools: Mixpanel, Amplitude, Heap, PostHog, June, Pendo, Hotjar, FullStory, LogRocket, Smartlook, Datadog RUM, Firebase Analytics, GA4. Different from marketing analytics in that the audience is product managers, designers, and engineers, and the data is event-level user behavior inside the product.

## Who is at the screen

- **Product managers** measuring feature adoption, funnel performance, retention. Daily users; tables are part of their thinking process.
- **Designers** validating that a redesign worked. Lower frequency, focused on specific flows.
- **Growth engineers / PMs** running experiments, tuning onboarding, optimizing conversion. Heavy users.
- **Data analysts and data scientists** building cohorts, doing custom analyses. Power users; tables are query output.
- **Customer success** looking at individual customer usage to spot at-risk accounts. The "user lookup" workflow.
- **Engineering leadership** measuring engineering output via product signals (deploys cause regressions? Ship velocity → adoption?).
- **Founders and execs** consuming weekly dashboards.

## Jobs to be done

- See whether the new feature got used.
- Find the step in the funnel where users drop off.
- Build a segment of "active users last week."
- Compare retention of users who hit feature X vs those who didn't.
- Trace one specific user's session.
- Investigate why DAU dropped on Tuesday.
- Decide which features to deprecate based on usage.
- Show the board the headline numbers.

## Representative tables

### User / account list (search)
Each row a user or an account. Columns: user ID, email, signup date, last seen, sessions (30d), events (30d), plan, cohort, location. Row scale: thousands to millions (with search/filter). Used to find one specific user.

### Event list (raw event stream)
Each row an event. Columns: time, user, event name, properties (often nested JSON), session ID, source. Row scale: live stream, billions in storage. Filter by event name, by user, by session. Click → expand row to see full property payload.

### User profile / activity timeline
Inside one user's profile, a timeline table of their events. Columns: time, event, properties summary. Row scale: hundreds to thousands. Often grouped by session.

### Session list
Each row a session. Columns: session ID, user, start time, duration, pages, events, device, country, source. Row scale: thousands to millions. Drill to session replay or to event list filtered to that session.

### Cohort retention table
The defining product analytics table. Rows are signup cohorts (week or month); columns are periods after signup (Day 0, Day 1, Day 7, Day 30...); cells are retention percentages. Heatmap. Row scale: 12–104 cohorts. Sticky first column and header. Read diagonally.

### Funnel breakdown table
Each row a step. Columns: step name, users entering, users completing, conversion %, drop-off %, median time. Row scale: 3–10 per funnel. Often segmented by another dimension.

### Funnel comparison table
Same funnel split by segment. Rows are steps; columns are segments. Cells are conversion rates. Color heatmap.

### Top events table
Most-fired events in a window. Columns: event name, count, unique users, change vs prior period, sparkline. Row scale: tens to hundreds. Sort by count or by change.

### Feature usage table
Each row a feature (event group). Columns: name, users (7d, 28d), events, % of MAU, first launch date, owner team. Row scale: tens to hundreds. Used for adoption reviews.

### Feature flag rollout table
Each row a flag rollout. Columns: flag, current %, segment exposed, conversion delta, error rate delta, decision pending. Row scale: tens. Cross-references with experiment results.

### Experiment results table (product side)
Same shape as in marketing. Variant rows; conversion, lift, significance columns.

### Experiment portfolio table
All running experiments. Columns: name, owner, status, start, primary metric, current lift, decision. Row scale: tens.

### Property breakdown table
For one event, broken down by a property value. Each row a property value. Columns: value, event count, % of total, change. Row scale: tens to hundreds. Pareto reading — top N rows are usually most of the value.

### Heatmap-as-table
Day of week × hour of day with engagement intensity in cells. Fixed-shape. Row scale: 7. Column scale: 24.

### Stickiness / DAU/MAU table
Rows: time period; columns: DAU, WAU, MAU, DAU/MAU ratio. Row scale: dozens.

### Path / flow table
Most common paths through the product. Each row a path (sequence of events). Columns: path, count, % of sessions, avg duration. Row scale: tens to hundreds. Often shown as a sankey but the table form gives precise numbers.

### Crash / error table
Each row a unique crash. Columns: signature, count (24h), users affected, app version, OS, first seen, status. Row scale: hundreds. Sort by count or by users affected.

### Revenue / monetization tables
Subscriptions, payments, churn events, expansion events. Each row a subscription or transaction. Columns: user, plan, MRR, started, ended, status. Row scale: thousands.

### NPS / survey response table
Each row a response. Columns: time, user, score, category (promoter/passive/detractor), comment, source. Row scale: hundreds to thousands.

## Behaviors and needs

- **Drill from aggregate to underlying users.** Click a cell in a cohort table → list of users in that cell. Click an event row → users who fired it. The "show me the users behind this number" pattern is universal and table-to-table.
- **Build a cohort or segment from a row.** "Save these users as a cohort." "Add this filter to current segment."
- **Cross-reference identity.** A user appears in many tables (events, sessions, cohorts, billing). Link consistently.
- **Compare segments side by side.** Multi-column metric tables where each column is a segment.
- **Time-bucket toggle.** Day / week / month switching on a single click. Re-renders the table at a different granularity.
- **Live data with frozen sort.** Counts update as data arrives but the row order stays stable.
- **Sticky first column and sticky header.** Mandatory in cohort and matrix tables.
- **Property-based filter chips.** "country = US," "browser = Safari." Add and remove without retyping.
- **Sample-size warning per row.** "Low confidence — 8 users." Don't let people draw conclusions from rows that are too small.
- **Drill to session replay** from a row that represents a user or a session.
- **Annotation on time-based rows.** "Pricing page A/B started here."
- **Export.** CSV for analysis, sometimes direct to data warehouse.
- **Share / embed.** Tables are shared in Slack, Notion, slide decks. Static rendering matters.
- **Cohort intersection.** "Users who did X AND Y in the last 7 days." The row count of the intersection is a common cell.
- **Hover for definitions.** "What does 'unique active' mean?" Tooltip on column header.

## Frustrations

- Cohort tables where week 0 column dominates the color scale, washing out the rest.
- A "drill" that opens a slow query and shows nothing for 30 seconds.
- Funnel tables that don't say what definition of "conversion" they used.
- Tables that update mid-scroll, throwing the user off.
- Sample-size confounding — a row showing 90% conversion based on 4 users.
- Inability to copy a cohort cell value for use elsewhere.
- Property breakdown where "(unknown)" is a row that dominates and obscures the meaningful values.
- Path tables that show "page1 → page1 → page1" loops as the top paths because tracking is misconfigured.
- Tables showing local time when the user expected UTC, or vice versa.
- A user lookup that requires exact email match; partial / fuzzy is needed.
- Charts and tables showing slightly different numbers because of caching layers.
- Filters that silently apply or persist across pages without being visible.

## Domain-specific notes

- **Live, but not finance-live.** Most product analytics data has 1-30 minute latency. Tables don't need sub-second updates but freshness matters.
- **The cohort/retention table is iconic.** It is one of the most-recognized chart-table hybrids in software. The component should support it natively (sticky axes, heatmap cells) even if v1 doesn't.
- **Data is enormous.** Event tables have billions of rows behind them; the visible table is always a query result. Pagination, "load more," windowing all matter.
- **Privacy and PII.** User IDs, emails, IPs all carry privacy weight. Consumers may need to mask or hash on render.
- **Heterogeneous properties.** An event has arbitrary properties of arbitrary types. The "expand row to see properties" pattern is universal.
- **Visual conventions are looser than in finance.** Mixpanel, Amplitude, PostHog all look quite different — there is no single industry standard color palette or layout.
- **Onboarding helpers in tables.** "Hover this cell to see what it means." Tooltips and inline help are more common here than in mature finance tools.
- **Tables are the gateway to deeper analyses.** A table cell often opens a chart, a session replay, a SQL query. The row is rarely the destination.
- **Many "tables" are actually visual matrices** — heatmaps, retention grids, path-flow diagrams. The line between a chart and a table is genuinely blurry.
- **Engineering audiences expect SQL-like power.** Power users want to write expressions, define computed columns, and pipe to the next analysis.
- **Sample data and demo modes.** Many of these tools render with seed data when empty. The component must look reasonable with synthetic content.
