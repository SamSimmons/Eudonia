# Politics and election results

A domain that overlaps with government, newsroom, and public health (in different ways) but has a distinctive set of table shapes, audiences, and time pressures. Reference systems and surfaces: AP election results feeds, NYT / WaPo / Reuters / BBC / FT / Bloomberg election night dashboards, Decision Desk HQ, FiveThirtyEight, RealClearPolitics, state secretary-of-state results pages, county elections boards, FEC.gov campaign finance, OpenSecrets, ProPublica's Represent, GovTrack, partisan internal campaign analytics, polling aggregator dashboards, exit polling tooling.

## Who is at the screen

- **Election night newsroom staff** at major outlets — desk editors, reporters, decision desk analysts, graphics producers. The most intense audience: results pages must update by the second, must never publish a wrong call, must work across web/mobile/broadcast.
- **State and county election officials** entering and certifying results. Source-of-truth data entry; the table is the workplace.
- **Decision-desk analysts** modeling whether to call a race based on returns, exit polls, and historical patterns.
- **Campaign staff** consuming results live (own race) and tracking other races for downstream implications.
- **Pollsters and forecasters** maintaining polling tables, aggregating, modeling.
- **Political journalists and analysts** writing about results, often with custom queries.
- **Civic technologists / academics** working with historical election data, redistricting, demographics.
- **Engaged voters and the general public** consuming results pages on phones and desktops, often refreshing constantly during election night.
- **Lawyers and observers** monitoring for irregularities.
- **Lobbyists and policy staff** following legislative votes and outcomes.
- **Campaign donors and donor tracking** journalists.

The setting on election night is unique: newsroom war rooms, broadcast studios, watch parties, but mostly individual phones and laptops. The peak demand is millions of concurrent viewers on a results page that must stay correct.

## Jobs to be done

- See who's winning right now.
- Decide whether a race can be called.
- Compare results to expectations / models / pre-election polling.
- Detect anomalies (precincts reporting impossible numbers, swings beyond historical bounds).
- Update voters and viewers.
- Track which precincts haven't reported yet.
- Project the final result based on partial returns.
- Look up a candidate, a district, a ballot measure.
- Investigate a campaign donor.
- Analyze polling trends.
- Enter and certify official results.
- Track legislative votes.

## Representative tables

### Live election results table (race-level)
The defining election night table. Each row a candidate or response (Yes/No on a ballot measure). Columns: candidate, party (often as a colored chip or initial), votes, percent, change from last update, lead/trailing, projected indicator. Row scale: 2–10 per race. Refresh: every 10–60 seconds during reporting. Color: party color often dominant. Status: "(R) Projected winner," "Too close to call," "Too early to call."

### Race summary table (multiple races)
Each row a race (e.g. all U.S. House races, all gubernatorial races). Columns: race, leader, lead margin, % reporting, projected winner. Row scale: dozens to hundreds. Sort by competitiveness or by reporting %. Click a row to drill into race detail.

### County / precinct results table
Inside a race, the geographic breakdown. Each row a county or precinct. Columns: county, % reporting, candidate A votes, candidate B votes, margin, swing vs prior election. Row scale: dozens to thousands. Sort by margin, by swing, by population. Often paired with a choropleth map.

### Battleground / decision desk table
Each row a key race. Columns: race, current leader, lead, % reporting, expected counties yet to report, decision desk status (called / leaning / no call / called for other party). Row scale: dozens. Updated as decisions are made.

### "Where the votes are" table
Used to project. Each row a county or area not yet fully reported. Columns: area, expected votes remaining, historical lean, current lean, implied final margin. Row scale: dozens. Used by decision desks and analysts to project.

### Live update / news ticker table
Append-only stream of called races, big swings, projections. Each row an update. Columns: time, race, headline. Row scale: dozens during election night.

### Historical election results table
Same shape as live results but for past elections. Sort by year, by office. Filter by candidate, by party, by district. Used for context ("how does this margin compare to 2020?").

### District-level long results table
Each row a district × year. Columns: year, winner, party, vote share, opponent, margin, turnout. Row scale: dozens.

### Polling aggregator table
Each row a poll. Columns: pollster, conducted dates, sample size, methodology, margin of error, candidate A %, candidate B %, undecided %, lead. Row scale: dozens to hundreds. Sort by date. Filter by pollster grade or methodology. Color by methodology quality.

### Polling average / trend table
Each row a candidate or option. Columns: current average, change vs week ago, change vs month ago, peak, trough. Footer: time series chart link.

### Forecast / model table
Each row a race. Columns: candidate, win probability, projected vote share, confidence interval. Row scale: dozens to hundreds. Updated as models re-run.

### Exit polling / demographic crosstab table
Each row a demographic group. Columns: group share of electorate, candidate A %, candidate B %, swing vs prior election. Row scale: dozens. Often presented as a stacked bar but the underlying table carries the precise numbers.

### Turnout table
Each row a precinct, county, or state. Columns: registered voters, votes cast, turnout %, vs prior election turnout, projected final. Row scale: dozens to thousands.

### Mail / early / day-of vote breakdown table
Each row a county or candidate. Columns: mail votes, early votes, election day votes, total. Row scale: dozens to thousands. Critical for understanding the "blue shift" / "red mirage" patterns.

### Ballot measure / referendum table
Each row a ballot measure. Columns: measure, description, Yes %, No %, % reporting, projected outcome. Row scale: dozens per state.

### Down-ballot races table
Each row a state legislature seat, judicial seat, county office, school board seat. Columns same as race table but with much more variety in office types. Row scale: hundreds to thousands.

### Election certification table (election admin)
Each row a precinct or batch. Columns: batch ID, source, votes, accepted/rejected, certifier, time. Row scale: hundreds to thousands per county. Workflow-driven.

### Campaign finance / donor table (FEC, OpenSecrets style)
Each row a contribution. Columns: date, donor, donor employer/occupation, recipient, amount, election cycle. Row scale: thousands to millions. Filter by donor, by recipient, by date. Sort by amount.

### Candidate finance summary table
Each row a candidate or committee. Columns: receipts, disbursements, cash on hand, debt, top donor industry, individual vs PAC %. Row scale: dozens per race, thousands per cycle.

### Lobbying / influence table
Each row a registration or contract. Columns: lobbyist firm, client, issue area, fee, period. Row scale: thousands per quarter.

### Legislative vote table
Each row a member of a legislature for one bill. Columns: member, party, district, vote (Yea / Nay / Present / Not Voting). Row scale: dozens to hundreds per vote. Often presented grouped by party for visual scanning.

### Bill tracking table
Each row a bill. Columns: bill #, title, sponsor, status (introduced / committee / passed chamber / signed), last action, cosponsors count. Row scale: hundreds to thousands per session.

### Member / legislator profile table
Each row a legislator. Columns: name, party, district, leadership role, committees, voting record summary. Row scale: hundreds (Congress) to tens of thousands (state legislatures).

### Polling place table
For voter-facing tools. Each row a polling location. Columns: name, address, hours, wait time. Row scale: dozens to thousands per jurisdiction.

### Watchlist / observer log
For observers. Each row an incident or observation. Columns: time, location, observer, description, severity. Row scale: dozens.

## Behaviors and needs

- **Live updates without disorienting the reader.** Numbers update; the row should not jump or re-sort by default. Sort by margin can be sticky.
- **Party color is the dominant visual signal.** Red / blue (US), various per country. Often as a colored bar/chip on the row. Configurable per consumer; sometimes politically sensitive.
- **Projection / call status is more important than raw numbers.** "Projected winner" and "Too early to call" have specific newsroom meanings.
- **% reporting is critical context.** A 60-40 lead with 1% reporting is not the same as 60-40 with 95% reporting.
- **Lead change emphasis.** Flash or highlight when the leader changes. Significant viewer signal.
- **Sort by competitiveness.** "Most competitive races first."
- **Map-table linkage is universal.** Choropleth / county map alongside the table.
- **Drill from race row to county detail.** Universal.
- **Time-zone awareness.** Polls close in different time zones; results trickle in regionally.
- **Mobile-first rendering.** Election night is overwhelmingly consumed on phones.
- **Massive concurrent load.** Results pages serve millions simultaneously. Static rendering and CDN caching matter; live data updates layer on top.
- **Annotation for analysts.** "Wisconsin counts mail-in last; expect blue shift."
- **Comparison to expectations.** Pre-election polls, models, prior election results all shown alongside live data.
- **Footer / aggregate.** Total votes cast, total margin, statewide turnout.
- **Embedded across many surfaces.** The same table shows on the news org's site, in social cards, in TV graphics, in newsletters. Static rendering is essential.
- **Accessibility for voters with disabilities** is a real legal and ethical concern in this domain.
- **Multilingual rendering.** Public-facing tables in jurisdictions with multilingual ballot requirements.
- **Source attribution per row.** Where did this number come from? AP? Edison? Decision Desk? Source label per row sometimes needed.
- **Last-updated timestamp.** Public tables must show freshness.
- **Time series per row.** Sparkline of margin over time during election night.
- **Compare two elections** side by side (this year vs last year by county).

## Frustrations

- A leader change that goes unsignaled, leaving readers confused.
- Sort that changes when an update arrives, throwing readers out of context.
- Maps and tables that show different leaders for the same county.
- A "Projected winner" badge that appears prematurely or is later retracted (publisher reputation hit).
- Party colors that conflict with the publisher's house style.
- Mobile rendering that hides the % reporting column, the most-needed context.
- Election night dashboards that fail under load.
- Stale data without indication of staleness.
- A polling table that doesn't show methodology differences.
- Forecast probabilities (e.g. "85% chance to win") that mislead about uncertainty.
- Demographic crosstabs that round in ways that don't sum to 100%.
- Campaign finance tables that don't deduplicate the same donor across spelling variations.
- Vote tables that don't surface party votes vs. crossings clearly.
- Down-ballot race tables that bury the few competitive races among many uncompetitive ones.
- Polling place tables that aren't accessible or aren't translated.
- Historical comparison tables that don't account for redistricting.

## Domain-specific notes

- **Election night is one of the highest-stakes table-rendering events in computing.** Millions concurrent, results updating live, decisions consequential. The bar for reliability and clarity is extreme.
- **Trust is fragile.** A wrong call, a flipped color, a misleading percent — any of these become news themselves. Tables must be verifiably correct and visibly cautious.
- **Decision desks have specific terminology.** "Too early to call," "Too close to call," "Apparent winner," "Projected winner," "Race called." These map to internal confidence thresholds and are not interchangeable.
- **Color is politically charged.** Red/blue are baked in for US national results but vary by country. Some publications avoid party color entirely for neutrality.
- **Time zones cascade.** Polls close at different times; results from 7pm ET races appear before 11pm ET races. Tables must communicate the partial nature of national rollups.
- **Mobile is the dominant surface.** A results table on a phone is the canonical experience. The component must look right at narrow widths.
- **Static rendering is a real concern.** Results pages embed in social media cards, in print newsroom graphics, in newsletters. The table must survive non-interactive contexts.
- **Map-table integration is uniquely tight.** Choropleth + table is the standard pattern.
- **Data sources are heterogeneous.** AP, state secretaries, county clerks, Edison Research, internal feeds. Source attribution matters.
- **Historical depth matters.** Comparison to past elections requires consistent geography (redistricting changes this) and consistent definitions (party realignment changes this).
- **Campaign finance has its own analysis culture.** Donor matching across name variations, employer-based aggregation, time-windowed analysis. Tables in this niche resemble eDiscovery in their search-and-pivot patterns.
- **Polling aggregation is methodology-aware.** A pollster's house effects, sample size, methodology grade all matter. Tables must accommodate these as columns.
- **Public dashboards are journalism.** The table is a published artifact. Editorial standards apply.
- **The same data is often shown in radically different presentations** for different audiences (newsroom internal, public-facing, broadcast, mobile push notification). The component renders one shape at a time but the underlying data flows through many.
- **Election admin tables (certification, batch entry) are the back-of-house version** of public results. Workflow-heavy, audit-trail-mandatory, far less designed.
- **Legislative vote tables resemble HR or sports rosters** — fixed cohort, repeated rendering, party-color encoding, voting record over time.
- **Bill tracking tables resemble JIRA or court dockets** — append-only history of actions on a stable identifier.
- **The "% reporting" column is uniquely critical.** No other domain has a column that fundamentally changes the interpretation of every other number.
