# Observability and reliability

Tables in observability dashboards are the bridge between aggregate signal (charts, heatmaps, gauges) and the raw evidence (logs, traces, individual metrics). When a chart shows something is wrong, the table is where the user finds out *which thing* is wrong. Reference tools: Grafana, Datadog, New Relic, Honeycomb, Lightstep, Splunk Observability, Dynatrace, Sentry, Rollbar, PagerDuty.

## Who is at the screen

- **On-call engineers** woken at 3am, working on a phone, laptop, or both. Cognitive load is high. Tables need to show the most-likely-culprit row first and let the user act on it without typing complex queries.
- **Platform / SRE engineers** doing capacity work, reliability reviews, post-incident analysis. Workstation, dual monitor, time to think.
- **Application engineers** investigating a deploy that misbehaved. Familiar with the service, less familiar with the observability tooling.
- **Service owners and team leads** reviewing SLOs and reliability posture. Lower urgency, higher synthesis.
- **NOC / SOC staff** at a shared wallboard or in a room with several screens, watching dozens of services simultaneously. Glance attention.

Setting varies wildly. The same table might be on a 4K workstation, a phone in a parking lot, and a wallboard in a NOC.

## Jobs to be done

- Find the alert that is firing right now.
- See which service / endpoint / customer is degraded.
- Confirm the recent deploy is or isn't the cause.
- Walk from a noisy metric to a representative trace to a representative log line.
- Acknowledge an alert and silence others while investigating.
- Write the postmortem timeline.
- Keep an eye on the system while doing other work.
- Confirm a fix worked.

## Representative tables

### Active alerts / incidents table
The "what is on fire" table. Each row is an alert that is currently firing. Columns: severity, service, alert name, age, value vs threshold, owner, ack status, runbook link. Row scale: dozens at most in a healthy state, can spike to hundreds during an incident. Refresh: live push or 5–30s polling. Severity color is mandatory and dominant. Sort by severity then age is the default.

### Alert history / fired-alerts table
A historical version of the above. Rows accumulate as alerts fire and resolve. Columns: time fired, time resolved, duration, severity, service, alert name, on-call, post-mortem link. Row scale: thousands. Used for tuning ("this alert fires too often") and reporting. Filter by service and by date range constantly.

### Service health overview table
One row per service. Columns: service name, request rate, error rate, p50/p95/p99 latency, saturation indicator, deployment indicator (deployed in last hour), SLO status. Row scale: tens to a few hundred. Each numeric cell often has an inline sparkline showing the last hour. Color on error rate and SLO. This is a "big, dense, ambient" table — often the central wallboard view.

### SLO table
One row per SLO. Columns: SLO name, service, target, current attainment, error budget remaining, burn rate, burn-rate alerting status. Row scale: tens to a few hundred. Color heavily on error-budget-remaining and burn-rate. Sort by burn rate to see what is most threatened.

### Top-N (top endpoints, top errors, top customers) table
The slice-and-rank workhorse. "Top 20 endpoints by p99 latency in the last hour." Columns: dimension value, count or rate, percent of total, change vs prior period. Row scale: 20–100. Each row is a candidate for "click to drill." Sparkline-per-row showing the trend over the window is common.

### Trace search results
Each row is a trace. Columns: trace ID, root span name, duration, status, service, start time, span count, error indicator. Row scale: hundreds to thousands per query. Sort by duration descending is the default ("show me the slow ones"). Click a row → trace waterfall view.

### Logs table
Each row is a log line. Columns: timestamp, severity, service, host, message (truncated), structured fields. Row scale: live stream, can be hundreds per second. Severity color heavily. Wrap or truncate the message column is a per-user preference. Click to expand the row showing the full structured payload. Search and filter must be fast enough to keep up. Auto-scroll with pause-on-hover.

### Log aggregation / log-based metric table
Aggregated counts of log patterns. Columns: pattern (often the templated message), count, count change vs prior period, services contributing, sample. Row scale: tens to hundreds. Used to spot "this error spiked." Click → underlying logs.

### Deployment / change table
Each row a deploy or change event. Columns: time, service, version, deployer, status (ongoing, success, failed, rolled back), commit message, link to PR. Row scale: tens per day. Often shown as an annotation source over charts as well as in table form. Filter by service and time range.

### Synthetic / uptime check table
Each row a check (URL, location, schedule). Columns: name, last result, success rate (24h), p95 latency, last failure, frequency. Row scale: tens to hundreds. Color on last result and on success rate. Sort by failures.

### Host / instance / pod table
Infrastructure inventory. Columns: hostname, status, region, instance type, age, CPU, memory, disk, agent version. Row scale: tens to tens of thousands. Sort by every numeric, filter by region/type/status. Action column: cordon, restart, view. Sometimes hierarchical (cluster > namespace > pod) with expand/collapse.

### Capacity / resource utilization table
Per cluster, namespace, or service. Columns: name, allocated CPU, used CPU, allocated memory, used memory, request count, headroom %. Row scale: hundreds. Heatmap-style cell coloring. Used for sizing and quota work.

### Error / exception table (Sentry, Rollbar)
Each row a unique error type. Columns: title, frequency (24h), users affected, first seen, last seen, environment, status (resolved / ignored / unresolved), assignee. Row scale: hundreds to thousands. Sort by frequency or by recency. Mark-resolved is an inline action.

### Notifications / incident channel table
For incident commanders running an active incident. Columns: time, source, message, ack-by. Row scale: dozens during an incident. Append-only, auto-scroll.

### Dashboards directory table
A meta-table — list of dashboards, owners, last edited, view count. Found in Grafana / Datadog admin UIs. Mundane but ubiquitous.

## Behaviors and needs

- **Severity drives row presentation.** Critical rows look distinct from warnings even at a glance. Often a colored left border or strip rather than a full row tint, which would damage scanning.
- **Live updates without losing focus.** During an incident the user is reading row 12 and rows are appearing. Insertion behavior must not push row 12 off the screen.
- **Search across visible rows.** Type to filter — `cmd-k` style or a fixed search box.
- **Per-column quick filter.** Click a value to filter the table to rows with that value (`service: api-gateway`).
- **Time-range scoping from the dashboard.** Selecting a time range updates the table. The table is rarely the source of the time range.
- **Inline acknowledgement and silencing.** A button in the row to ack the alert, silence it for an hour, etc. The table is also a workflow surface.
- **Drill-from-row.** Click → trace, → logs, → service detail, → runbook. Multiple destinations per row are normal.
- **Open in new tab.** Cmd-click on a row should reliably open the detail in a new tab. Common pattern, often broken in custom tables.
- **Auto-refresh with countdown.** "Next refresh in 12s." User can pause when they need to think.
- **Wide tables with horizontal scroll.** Service health tables often have 15+ columns. First column (service name) freezes.
- **Sparkline cells.** Inline mini-trends are everywhere in this domain. They sit in numeric cells and signal direction even when the absolute value is uninteresting.
- **Status badges.** Healthy / degraded / down / unknown. Color and a text label, not just color.
- **Hover to see the precise number behind an abbreviation.** `1.2M` requests → tooltip shows `1,243,891`.
- **Keyboard navigation in alert lists.** During an incident the user wants j/k to move between alerts and Enter to drill.
- **Selecting multiple rows for bulk action.** Ack 5 alerts at once.
- **Compare two rows side by side.** Pick two services and see their latency next to each other.
- **Dark mode by default.** Most observability tools are dark-first; some are dark-only.
- **Density toggle.** Comfortable for daytime work, compact for wallboards.

## Frustrations

- A new alert appears and the table re-sorts, scrolling away from the alert the user was reading.
- "Loading..." appearing every time the table refreshes, even when nothing changed — looks broken.
- The same alert appearing as 17 rows because a noisy detection re-fires every minute.
- Truncation in the message column hiding the actual error.
- A status column sorted alphabetically (Critical, Degraded, Down, Healthy, Warning) instead of by severity.
- Sparkline cells whose y-axes are not shared, making them look comparable when they aren't.
- An "ack" button that does not give immediate feedback; the user clicks it twice.
- A table that doesn't refresh and silently shows stale data — users think the system is healthy when it isn't.
- A log table that rate-limits during the moment of an incident when log volume spikes.
- Severity colors that fail in colorblind modes.
- Pagination on what should be a continuous stream.
- Time columns showing absolute timestamps when "3 minutes ago" was wanted, or vice versa.
- Filter chips that don't show what is currently filtered, so the user is debugging a "where is the row I expected" problem caused by a stale filter.

## Domain-specific notes

- **Tables are often the rendering for things that aren't naturally tables.** A tag-set, a histogram bucket list, a span tree. The tabular format is chosen because it is the highest-information-density UI we have.
- **The same table is rendered at very different sizes and contexts.** Workstation full-screen, mobile during on-call, NOC wallboard at 30 feet. Density and font-size tiers are real.
- **Interactivity scales with attention.** A wallboard table should not respond to clicks (stray laser pointer). A workstation table should respond to everything.
- **The table often *is* the dashboard.** A "logs" view or a "traces" view is usually a single huge table with a small filter bar and not much else. The table component has to be able to be the whole page.
- **Stream / push semantics.** Many of these tables receive append-only updates from a stream rather than poll-then-replace. The component shouldn't presume polling.
- **Field cardinality matters.** A `service` column has tens of values; a `trace_id` column has millions. Sort, filter, and group behaviors differ between them. The table can be agnostic but the affordances may differ.
- **Severity is universal but not standardized.** Critical / Error / Warning / Info / Debug exists, as does P1 / P2 / P3 / P4, as does emoji-and-color. The table cannot prescribe; it has to render whatever the consumer hands it.
- **Time is the dominant axis.** Almost every observability table has a time column and is sorted by time descending by default.
- **The tables in this domain are the closest analog to what eudonia could most uniquely add.** Sparkline cells, in-line status indicators, status-colored rows, dense-but-readable, dashboard-tile-friendly. The line between "table" and "small chart strip" is blurry here, which plays to eudonia's strengths.
