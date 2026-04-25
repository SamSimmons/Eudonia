# Security and SIEM

Security tooling lives in tables. SIEMs (Splunk, Elastic Security, Sentinel, Chronicle, QRadar), SOAR platforms (Tines, Torq, Cortex XSOAR), EDR consoles (CrowdStrike, SentinelOne, Defender), vulnerability scanners (Qualys, Tenable, Wiz), identity tools (Okta, Auth0), and ticketing-style triage queues all surface their primary content as tables. Security analysts are professional table users in a way few other domains are.

## Who is at the screen

- **Tier 1 SOC analysts** working a queue of alerts. Triage at speed, escalate the real ones, dismiss the noise. Shift work, often 24/7, often in a security operations center with shared displays plus individual workstations.
- **Tier 2/3 SOC and incident responders** investigating escalated incidents. Pivot from alert to host to user to network flow to log. Deep dives, often hours per case.
- **Threat hunters** writing exploratory queries against the SIEM. Power users; the table is their REPL output.
- **Detection engineers** tuning rules, looking at false-positive rates, building queries. Iterative workflow against historical data.
- **Vulnerability managers** working through scanner findings, prioritizing patches, tracking remediation.
- **Identity / IAM admins** auditing access, reviewing entitlement changes, investigating account compromise.
- **GRC / compliance** reviewing periodic reports — access reviews, control attestations.
- **CISO / leadership** looking at posture dashboards. Aggregated; rarely interacting with raw rows.

Setting is workstation-heavy with shared NOC-style displays in larger SOCs. Mobile is rare in SOC contexts (compliance often forbids it).

## Jobs to be done

- Triage the alert queue. Decide each alert: real, false-positive, escalate.
- Pivot from one alert to all related signals (same host, same user, same IP, same hash).
- Find the user account that did the unusual thing.
- Reconstruct what an attacker did (the kill chain).
- Confirm a vulnerability has been remediated.
- Decide who to ask for an access removal.
- Verify a control is in place.
- Build evidence for an audit.

## Representative tables

### Alert queue (triage table)
The defining SOC table. Each row is an alert pending triage. Columns: severity, time, source rule, asset (host/user), summary, status, assignee, age, MITRE technique. Row scale: dozens to thousands depending on tuning. Sort by severity then age. The whole shift is spent in this table. Mark each row read/dismissed/escalated. Bulk actions are essential.

### Investigation / incident table
Each row an incident under investigation. Columns: ID, name, severity, opened, owner, status, last update, related alerts count. Row scale: tens to hundreds. Workflow-driven; rows transition through states (open → investigating → contained → resolved).

### Event search results table (SIEM)
Output of a query against raw events. Columns vary completely by query — could be source IP, destination IP, port, action, user, process, command line. Row scale: tens to millions (with paging). The table is a query result viewer; the user iterates query → table → refine → re-query. Column add/remove via clicking on a field in a row to "add as column."

### Process / parent-process tree (EDR)
Each row a process; columns are PID, name, command line, user, start time, parent PID. Row scale: hundreds per host snapshot. Often hierarchical (parent → child → grandchild) with expand/collapse. This is a "tree-as-table" — the indentation and tree-glyphs in the first column carry meaning.

### Host / endpoint inventory
Each row a managed device. Columns: hostname, OS, version, last check-in, agent version, vulnerability count, risk score, owner, location. Row scale: hundreds to hundreds of thousands. Sort by risk, filter by OS or location. Drill to host detail.

### User / identity table
Each row a user account. Columns: name, email, status (active/disabled), last login, MFA enrolled, group membership count, anomaly score, manager. Row scale: hundreds to hundreds of thousands. The IAM workhorse table. Sort by anomaly score during an investigation.

### Vulnerability findings table
Each row a vulnerability finding. Columns: CVE, severity (CVSS), affected hosts, first seen, age, exploit available, patch available, owner team, status. Row scale: thousands to millions. Filter by severity, by team, by status. Group by CVE so you don't see 500 rows for one vulnerability across 500 hosts. Then expand a row to see the affected hosts.

### Threat intelligence indicator table
Each row an indicator (IP, domain, hash, URL). Columns: indicator, type, source feed, confidence, first seen, last seen, related campaigns, sightings. Row scale: thousands to millions. Used both reactively (does our SIEM have this IOC?) and proactively (block these at the firewall).

### Detection rule table
Each row a rule (Sigma, Splunk SPL, KQL, YARA, etc.). Columns: name, severity, MITRE technique, last fired, fire count (30d), false positive rate, status (enabled/disabled), owner. Row scale: hundreds to thousands. Tuning workflow — sort by fire count to find noisy rules.

### Access review table (GRC)
Periodic certification. Each row a (user, entitlement) pair. Columns: user, entitlement, granted date, last used, justification, action (keep/remove), reviewer status. Row scale: hundreds to thousands per review. Bulk actions ("remove all unused entitlements"). High-stakes — wrong removals break access.

### Audit log / activity log
Each row an action taken in a system. Columns: time, actor, action, target, source IP, result. Row scale: thousands per day. Append-only. Search by actor or target. Used both for investigations and for compliance.

### Cloud posture / misconfiguration table (CSPM)
Each row a misconfiguration finding. Columns: rule, resource, account, region, severity, evidence, age, status. Row scale: hundreds to tens of thousands. Group by rule or by resource. Linked to remediation tickets.

### DLP findings table
Each row a data-loss event (file with sensitive content shared externally, large data movement). Columns: time, user, file, classification, destination, action taken (allowed/blocked/quarantined), severity. Row scale: tens to hundreds per day. Workflow: review, decide, document.

### Phishing / email security queue
Each row a flagged message. Columns: time, sender, subject, recipients, threat indicators, category (phishing/malware/spam), action, analyst notes. Row scale: tens to thousands per day. Triage queue, similar to SOC alerts but email-specific.

### MITRE ATT&CK heatmap-as-table
Tactics as columns, techniques as rows, cells colored by detection coverage or recent activity. Row scale: ~200 (the technique catalog). The cells are the data; the table structure is fixed.

### Compliance control table
Each row a control (SOC2, ISO27001, PCI-DSS). Columns: control ID, description, status, evidence, last tested, owner, next test due. Row scale: tens to hundreds per framework. Periodic review cadence; central to audit preparation.

## Behaviors and needs

- **Pivot.** Right-click any cell value → "show me other rows with this value," "search the SIEM for this value," "add to current filter as include / exclude." This is the defining interaction in security tooling.
- **Take action on rows from the table.** Acknowledge, escalate, dismiss, suppress, assign, comment. Bulk-select then act.
- **See the related context for a row inline.** Expand to show: the parent process, the geo of the IP, the WHOIS, the threat intel reputation. Without leaving the table.
- **Save filters and queries.** A SOC team has dozens of saved queries and filtered views. Switching between them is a daily action.
- **Keyboard-driven.** j/k to move row, x to select, e to escalate. Triage volume demands it.
- **Audit trail.** Who looked at which row, who acknowledged what, when. Often required for compliance, sometimes shown in-table.
- **Annotate / comment a row.** Add an analyst note. Show notes from previous shift.
- **Suppress / silence.** Mark a row pattern as "don't show me again for 24h." Avoids alert fatigue.
- **De-duplicate.** A flood of identical alerts collapses to one row with a count. Expand to see individual instances.
- **Time-range scoping.** Always present, often the first filter applied.
- **Field selection / column add-from-cell.** Looking at a result row, the analyst sees a useful field and adds it as a column.
- **Statistics / facets in the side panel.** "Of these 1247 rows, here are the top 10 source IPs, top 10 users, top 10 actions." Drives the next pivot.
- **Export for case file / report.** PDF or CSV with row IDs preserved for chain-of-custody.
- **Threading / grouping.** A campaign of related alerts grouped under a parent alert.
- **Tag / label.** Apply a tag to a row that propagates to dashboards and saved searches.

## Frustrations

- The table refreshing and dropping the user's selection of "the 17 rows I was about to act on."
- A "drill" that opens a slow detail page and then can't be navigated back from quickly.
- An alert queue where similar alerts are not deduplicated; the analyst sees the same incident as 50 rows.
- A pivot action that loses the user's existing filter context.
- A column added during investigation that goes away when the user navigates away and back.
- A search that ignores typos in field names instead of suggesting fixes.
- Severity colors that conflict with the team's existing playbook colors.
- A long-running query that gives no progress signal.
- Bulk-action UI that requires confirming each row separately.
- A vulnerability table that doesn't have a "show me only the ones I'm responsible for" view, forcing scrolling through everyone else's findings.
- A status update that lags between two analysts looking at the same queue, leading to duplicated work.
- An audit log search that can't be exported with results, only with hashes.

## Domain-specific notes

- **Volume is enormous.** SIEM tables routinely deal with billions of events. Even when the visible table shows 100 rows, the engine behind it is doing a lot. The component itself doesn't need to handle volume but must accept paged or windowed data without breaking the UX (pagination, "load more," virtualization, infinite scroll all live here).
- **Trust the table or stop using it.** If the analyst suspects the table is missing data (because of a slow query, a silent failure, a permissions issue), they will fall back to the CLI and the SIEM team has lost. Reliability and visible freshness matter more than aesthetics.
- **Data is sensitive.** Screenshots are often forbidden; copy/paste may be logged; the table may be embedded in an environment that prohibits export. The component should not assume export is universally available.
- **Many tables are tree-as-table.** Process trees, file system trees, organizational hierarchies, MITRE ATT&CK matrices. Indentation as data is common.
- **The same row identity recurs.** A host or a user shows up in the alert queue, the inventory, the access log, the vulnerability list. Cross-table linking and consistent presentation matter.
- **Cell content is heterogeneous.** A single column might hold a CIDR range, an IPv4 address, an IPv6 address, a hostname, a URL, a hash. Type-aware rendering helps but cannot be hard-coded.
- **Color schemes are political.** Red/yellow/green is universal but its precise mapping to severity bands varies by org. Configurable.
- **Some workflows look more like email clients than tables** — alert queues, phishing triage. The "list view of items with bulk actions" idiom is shared with email and ticketing.
- **Compliance reporting is its own UX.** Static, signed, dated, often PDF. The component must produce a printable, paginated form with header rows repeated.
