# Tables in Dashboards

Product research for the upcoming `Table` component in eudonia. The goal is to capture *who* looks at dashboard tables, *what* they are trying to do, and *what shapes those tables actually take in the wild* — so the v1 wrapper covers the common cases, the design language fits across domains, and we know what we are consciously deferring.

## Why this exists

Eudonia's stated focus is financial and business dashboards, but the layout and component primitives are intended to be broad. Before scoping the table component to "the finance and BI shape only," we want to look across enough other domains to spot patterns we would otherwise miss — table shapes, cell types, interactions, and constraints that show up consistently somewhere we were not looking.

The user has stated their first intention plainly: a simple table that fits the design language, extended as new use cases appear. This research exists to *de-risk that simplicity* — to know what we are leaving room for, even if we are not building it now.

## What this research captures

For each domain:

- **Who is at the screen** — roles, context, attention level (passive monitoring vs. active investigation), shared display vs. solo screen.
- **Jobs to be done** — the questions being answered, the decisions being made, the time pressure involved.
- **Representative tables** — actual tables that show up in that domain's dashboards. Each entry names the table, its purpose, the column types it tends to carry, rough row scale, and refresh cadence.
- **Behaviors and needs** — what users expect the table to do (sort, filter, expand, follow a row, freeze a header, mark a row read, etc.).
- **Frustrations** — what would make the table feel broken or untrustworthy in that domain.
- **Domain-specific notes** — anything non-obvious, idiosyncratic, or that crosses into the rest of the dashboard.

## What this research does not capture

- API design, prop shape, component decomposition.
- How TanStack Table or any other library maps to these requirements.
- Visual styling, design tokens, density tiers.
- Implementation feasibility or engineering effort.
- Naming.

This is product research, not software design. The goal is to know what we are building *for*, not how to build it. A separate scoping pass will translate the synthesis into v1 scope.

## Methodology

We sweep wide intentionally. Each domain doc is independent and can stand on its own. Where a domain has several distinct table shapes (e.g. a 911 dispatch CAD has *both* an active-incidents table and a unit-status table, which behave very differently), each shape gets its own treatment within the doc.

Accuracy matters more than coverage volume. Claims are grounded in known tools and products where possible (Bloomberg, Grafana, Datadog, Splunk, Epic, Salesforce, etc.) and called out as extrapolation where not. When something is genuinely uncertain or where deeper field knowledge would help, the doc says so rather than papering over it.

The default unit of analysis is the *single table shown on a dashboard*, not the application that contains it. A trading platform has many tables; we treat each shape distinctly. The goal is the requirement set, not the application taxonomy.

## Recurring axes (used across domains)

These are the dimensions that distinguish one dashboard table from another. They are listed here so each domain doc can refer to them rather than redefine them.

- **Row scale** — handful (under 20), page (20–200), thousand-class, million-class, unbounded stream.
- **Column scale** — narrow (3–6), medium (6–15), wide (15+), virtualized.
- **Refresh cadence** — static (loaded once), interval polling (seconds to minutes), live push (sub-second), human-driven only.
- **Attention model** — glance (wallboard, ambient), monitor (foreground but periodic), investigate (active focus, drill-down expected), edit (the table is the workspace).
- **Identity of a row** — durable entity (customer, alert, employee), event (one trade, one log line, one page view), aggregate (a bucket, a cohort, a category).
- **Time stance** — atemporal (current state), as-of (snapshot in time), windowed (last N), live (continuously updating).
- **Stakes** — informational, decision-supporting, decision-binding, life-safety.
- **Setting** — solo workstation, shared wallboard, mobile / on-call, public-facing, embedded inside a larger workflow.

These appear repeatedly in the per-domain docs. They are not the synthesis — that comes at the end — but they are the vocabulary the synthesis pulls together.

## Domains

### Finance and business
- [Finance and markets](01-finance-and-markets.md)
- [Business intelligence and executive reporting](02-business-bi.md)

### Operational and engineering
- [Observability and reliability](03-observability.md)
- [Security and SIEM](04-security.md)
- [DevOps and CI/CD](05-devops-ci.md)
- [Network operations](06-network-ops.md)

### Commercial and growth
- [Customer support and CRM](07-support-crm.md)
- [Marketing and growth](08-marketing-growth.md)
- [Product analytics](09-product-analytics.md)
- [E-commerce and fulfillment](10-ecommerce-fulfillment.md)

### People and process
- [People analytics and HR](11-people-hr.md)
- [Education](12-education.md)
- [Construction and project management](13-construction-pm.md)
- [Legal and compliance](14-legal-and-compliance.md)
- [Government and public sector](15-government-public.md)

### Mission-critical and time-sensitive
- [Emergency response](16-emergency-response.md)
- [Healthcare and clinical monitoring](17-healthcare-clinical.md)
- [Public health surveillance](18-public-health.md)
- [Aviation and transit operations](19-aviation-transit.md)
- [Energy and utilities](20-energy-utilities.md)

### Civic and political
- [Politics and election results](21-politics-elections.md)

### Industrial and physical
- [Manufacturing and industrial operations](22-manufacturing-industrial.md)
- [Logistics and supply chain](23-logistics-supply-chain.md)
- [Real estate and property](24-real-estate.md)

### Realtime, content, and other
- [Realtime markets and auctions](25-realtime-streaming.md)
- [Sports and e-sports](26-sports-esports.md)
- [Newsroom and media analytics](27-newsroom-media.md)
- [Gaming and casino operations](28-gaming-casino.md)
- [Scientific and clinical research](29-scientific-research.md)

### Synthesis
- [Cross-cutting patterns and requirements](99-synthesis.md)
