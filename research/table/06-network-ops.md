# Network operations

A close cousin of observability but distinct enough to warrant its own treatment. The audience runs telecom carriers, ISPs, datacenter networks, content-delivery networks, large enterprise WANs, satellite operations, and broadcast facilities. Reference tools: SolarWinds, PRTG, Cisco DNA Center, Juniper Mist, ThousandEyes, Kentik, NS1, Cloudflare and Fastly customer portals, NOC custom dashboards. Many NOCs run home-grown wallboard software unique to their environment.

## Who is at the screen

- **NOC technicians** at multi-monitor consoles in operations centers. Often 24/7 shift work. The room itself has wallboards visible to the whole team. Tickets and alerts come in from multiple regions and customer types.
- **Network engineers** investigating faults, doing capacity planning, pushing config changes. Workstation work, deeper dives.
- **Field technicians** dispatched to a site, working on a tablet or phone. Limited screen real estate, sometimes intermittent connectivity.
- **Customer-success engineers at a carrier** looking at an enterprise customer's circuit health.
- **Tier 1 helpdesk** taking calls about slow internet; pulling up the customer's modem status table.

Wallboard usage is heavier here than almost anywhere else — large NOCs keep dozens of summary tables on permanent display.

## Jobs to be done

- See whether all sites / circuits / regions / nodes are up.
- Find the device that just stopped responding.
- Check the BGP route health to a region.
- Investigate a customer's complaint about packet loss.
- Decide whether to dispatch a technician.
- Track a maintenance window (which devices are scheduled to be touched, when).
- Verify a config change rolled out to all targeted devices.
- Measure capacity headroom by region.
- Watch for fiber cuts in real time.

## Representative tables

### Device / node status table
The fundamental NOC table. Each row a network device (router, switch, firewall, AP, modem, OLT, BTS). Columns: name, type, location, status (up/down/degraded), last seen, uptime, IP, version, MAC, vendor, alarms count. Row scale: hundreds to hundreds of thousands. Sort by status (down first), filter by region or type. Color heavily on status. Updated by SNMP polling on intervals (1–5 min) plus trap-driven push for events.

### Circuit status table
Each row a circuit / link / interface. Columns: name, A-side, Z-side, status, type (fiber/copper/microwave), bandwidth, utilization %, errors, last flap, customer (if it's a customer circuit). Row scale: hundreds to tens of thousands. Often paired with utilization sparklines per row.

### Alarm / fault table
Active alarms across the network. Columns: time raised, severity, source device, alarm type, description, ack status, owner, age, related ticket. Row scale: dozens to thousands. Sort by severity then age. Bulk acknowledge. Suppression rules to handle storms (one fiber cut → 200 derived alarms).

### Site / branch status table (enterprise WAN, retail networks)
Each row a physical site (store, branch, datacenter, cell tower). Columns: site ID, address, region, manager, primary link status, secondary link status, devices online/total, last incident. Row scale: hundreds to tens of thousands. Color on status; sometimes paired with a map.

### BGP / routing table
Each row a route or a peer. Columns (peer view): peer ASN, IP, state, prefixes received, prefixes sent, uptime, last reset reason. Row scale: hundreds. Status of "Established" vs "Idle" is the heartbeat of an ISP.

### IP address management (IPAM) table
Each row a subnet or an IP. Columns: prefix, description, assigned to, utilization %, VRF, location, last changed. Row scale: thousands. Filter by VRF or by utilization (find subnets near full).

### Wireless client / connection table (Wi-Fi NOC)
Each row a client device connected to an AP. Columns: MAC, hostname, AP, SSID, signal, RX/TX rate, traffic, connect time, OS guess. Row scale: hundreds to tens of thousands per controller. Filter by AP, sort by signal to find struggling clients.

### Cellular / radio access network table
Each row a cell, sector, or eNodeB/gNodeB. Columns: site, sector, technology (4G/5G), connected users, throughput, PRB utilization, KPIs (drop rate, handover success). Row scale: tens of thousands per carrier region.

### Traffic / flow / NetFlow table
Aggregated by source, destination, protocol, ASN. Columns: dimension value, packets, bytes, flows, top talkers contributing. Row scale: thousands. Filter to investigate a spike.

### DDoS / security event table
Each row a detected attack or anomaly. Columns: time, target, attack type, peak bandwidth, peak PPS, duration, mitigation status, affected customer. Row scale: dozens per day in normal times, hundreds during a storm.

### Maintenance / change window table
Scheduled work. Each row a planned change. Columns: window, devices affected, change ticket, requester, approver, status (pending/in progress/complete). Row scale: dozens per week.

### Customer-circuit performance table (enterprise / SaaS view)
For carriers showing customers their own circuits. Each row a circuit/site. Columns: site, link, availability %, latency, jitter, packet loss, MTTR. Row scale: handful to hundreds per customer. Often shown to customers in self-service portals.

### Dispatch / ticket queue
Each row a ticket needing field action. Columns: ticket ID, customer, site, priority, assigned tech, ETA, age. Row scale: dozens to hundreds. Workflow-driven.

### Inventory / spares table
Hardware inventory. Each row a spare device or part. Columns: serial, model, location, status (in service / spare / RMA), last moved, warranty end. Row scale: hundreds to thousands.

## Behaviors and needs

- **Wallboard mode.** A presentation mode of a table designed for 30-foot readability. No interactivity. Larger fonts, more contrast, no chrome, often auto-rotating between several views.
- **Auto-refresh with countdown and pause.** Universal in NOCs.
- **Status-based row highlighting.** Down rows light up; the eye finds them across a 200-row table.
- **Sticky severity filter.** "Hide info-level alarms" persists across sessions.
- **Storm dampening / collapse.** When a fiber cut creates 500 alarms, the table should collapse them to a single parent row.
- **Map linkage.** Click a site row → map zooms to it; click a map pin → table scrolls to row.
- **Topology linkage.** Click a device → topology view highlights that node and its neighbors.
- **Bulk ack and bulk suppress.** Select all alarms from one site, ack them all.
- **History / trend per row.** A small sparkline showing the last hour or 24 hours of a metric.
- **Threshold annotations.** "This circuit is at 85% utilization, threshold is 80%." Visible inline.
- **Color tokens consistent across the org.** Carrier colors are written into runbooks; the dashboard component must respect a color contract.
- **Print to a fault report.** Carrier reports to enterprise customers are PDF-exported tables of incidents.
- **Mobile single-row drill.** Field tech opens the device row on a phone and sees an action sheet (reboot, run diagnostic, update firmware).
- **Sub-second updates for key alarm tables** during incidents.
- **Long-running view stability.** A NOC operator looks at the same table for 8 hours; it must not memory-leak or visually drift.

## Frustrations

- A single fiber cut producing 200 rows that drown out everything else.
- A "down" device that is actually up but had a brief polling failure — false alarms train the operator to ignore the table.
- Wallboard auto-refresh that flashes the whole table white every 30 seconds.
- A status column that reads green even though the device hasn't reported in two hours (stale data masquerading as healthy).
- Inability to acknowledge an alarm without leaving the dashboard.
- An IPAM table that doesn't show the contiguous free space in a subnet.
- A topology link that opens a slow modal blocking the table.
- Map-and-table dual views that don't stay in sync when one is filtered.
- Maintenance window not visually distinguished from real outage.
- A fault report PDF where the table breaks across pages without repeating headers.

## Domain-specific notes

- **Color is operational.** The status colors mean specific things in the org's runbook ("orange means call the field team, red means call the customer first"). The component cannot prescribe color semantics, only render whatever the consumer hands it.
- **Storms are a dominant failure mode** of dashboards in this domain. Anything that doesn't gracefully handle 1000 simultaneous alarms is broken in NOC contexts.
- **The wallboard form is its own product.** Some vendors ship a separate "video wall" version of their dashboards. The same data, different rendering — bigger fonts, more saturated colors, no interactivity, slow auto-cycle.
- **Long uptimes matter.** A NOC dashboard runs continuously for weeks. Memory leaks, accumulating DOM nodes, growing event listeners — all are visible failures.
- **Polling and push coexist.** Some data is polled (SNMP every 5 min); some is pushed (SNMP traps, syslog events). The table sees both.
- **Dispatch tickets are workflow.** The table is also the queue and the workspace; rows transition through states and the operator interacts with each.
- **Enterprise customer portals reuse the same tables** as the carrier's internal NOC, with rows filtered to that customer's data. The component must work in both branded and unbranded contexts.
- **Time zones are a real concern.** A NOC in Singapore looks at a circuit in Texas; the table needs to be unambiguous about the timestamp's zone.
- **Locale-aware sorting.** Hostnames like `dc1-rtr-01` need natural sort; alphabetical produces `dc1-rtr-1`, `dc1-rtr-10`, `dc1-rtr-11`, `dc1-rtr-2`. A common bug.
- **Many of these tables resemble the alert / service health tables in observability.** The split is more about audience and language than about UI shape.
