# Energy and utilities

Power generation, transmission, distribution; oil and gas operations; water and wastewater utilities; renewable energy operations. Reference systems: SCADA / EMS (energy management systems — GE, Siemens, ABB, OSI), distribution management systems (DMS), outage management systems (OMS — Oracle, Schneider), advanced metering infrastructure (AMI / smart meter platforms — Itron, Landis+Gyr), grid operator platforms (PJM, ERCOT, MISO, CAISO market interfaces), pipeline SCADA, oilfield production systems, ICS / process historians (PI, Ignition).

## Who is at the screen

- **Grid operators / system operators** at control centers managing transmission grid stability. 24/7 shifts. Highly trained and certified. Decisions can blackout regions.
- **Distribution dispatchers** managing the local grid — outage response, switching operations.
- **Plant operators** at power plants (gas, coal, nuclear, hydro, wind, solar) running individual generation units.
- **Field crews** responding to outages, doing repairs, restoring service.
- **Trading desks** at utilities and IPPs (independent power producers) buying and selling energy in wholesale markets.
- **Demand response coordinators** managing load curtailment.
- **Pipeline operators** (oil, gas, water) monitoring flows, pressures, leaks.
- **Oilfield operations** (production, drilling, completions).
- **Water / wastewater plant operators**.
- **Customer service** taking outage calls, billing inquiries.
- **Regulators** consuming reliability and market data.
- **Renewable / battery operators** managing storage dispatch and forecasting.

Setting is heavily control-room with shared wallboards, multi-monitor operator consoles, and ruggedized field equipment. Some roles use mobile heavily (field crews).

## Jobs to be done

- Keep the grid stable in real time (frequency, voltage, reactive power).
- Respond to faults — isolate and restore.
- Dispatch generation to meet load economically.
- Bid into the wholesale market.
- Schedule maintenance windows without compromising reliability.
- Track every outage and restoration.
- Monitor every meter and every flow.
- Decide whether to curtail demand.
- Coordinate field crews.
- Comply with reliability standards (NERC CIP).
- Bill customers.

## Representative tables

### Generation unit status table
Each row a generation unit. Columns: unit, type (gas / coal / hydro / wind / solar / battery), capacity, current MW, status (online / offline / outage / standby), heat rate, fuel cost, ramp rate, last action. Row scale: dozens to hundreds. Refresh: live, sub-second.

### Transmission line / circuit table
Each row a line. Columns: line ID, from substation, to substation, voltage, current loading (MW / amps), thermal limit, % of limit, status (in service / out / clearance), contingency rating. Row scale: hundreds to thousands. Color on loading.

### Substation / breaker table
Each row a substation or a breaker. Columns: name, voltage, status, alarms, last operation, lockout. Row scale: hundreds.

### Outage management table (OMS)
Each row an outage event. Columns: outage ID, started, restored (if), customers out, area, cause, crew assigned, ETA, status. Row scale: dozens to thousands during a storm. Color heavily.

### Outage tickets / customer trouble calls
Each row a customer report. Columns: account, address, reported time, status, related outage. Row scale: dozens to thousands. Often deduplicated by location.

### Crew dispatch table
Each row a field crew. Columns: crew ID, members, vehicle, current location, current assignment, status (en route / on site / cleared). Row scale: dozens to hundreds. Live AVL feeds drive position.

### Switching order table
For planned switching operations. Each row a step. Columns: sequence, action, location, performed by, status, signature. Row scale: dozens per order.

### Alarm summary table (control room)
Each row an active grid alarm. Columns: time, severity, source, point, value, condition, ack status. Row scale: dozens to hundreds. Live push. Color by severity. Sort by time descending. Bulk acknowledge.

### Tag / clearance table
Each row a safety tag (a tag-out for crew safety). Columns: tag #, equipment, holder, issued, hold reason. Row scale: dozens.

### SCADA point / measurement table
Each row a SCADA point (a measurement or command). Columns: name, value, units, last update, quality, source. Row scale: thousands per substation. Used for diagnostics.

### Energy market / dispatch table
Each row a market participant or generation unit's bid. Columns: bid time, unit, MW offered, price, accepted, dispatched. Row scale: thousands per market interval.

### Locational marginal price (LMP) table
Each row a price node. Columns: node, time interval, LMP, congestion component, loss component. Row scale: thousands of nodes × intervals.

### Load forecast table
Each row a time interval (5-min, hourly). Columns: forecast load, actual load, error, weather inputs. Row scale: hundreds.

### Renewable forecast table (wind / solar)
Each row a time interval. Columns: forecast generation, actual generation, error, conditions. Row scale: hundreds.

### Pipeline / flow station table
Each row a station or compressor. Columns: station, pressure, flow, temperature, valve states, alarms, status. Row scale: dozens.

### Tank / storage table
Each row a tank. Columns: tank ID, contents, level, capacity, % full, last reading, alarm thresholds. Row scale: dozens.

### Oil well / production table
Each row a well. Columns: well, field, status, daily production, water cut, gas-oil ratio, last test, downtime reason. Row scale: hundreds to thousands.

### Drilling rig status table
Each row a rig. Columns: rig, current well, day of operation, depth, status, operations. Row scale: dozens.

### Smart meter / AMI table
Each row a meter. Columns: meter, account, location, last read, current usage, voltage, signal status. Row scale: thousands to millions.

### Billing table
Each row a customer bill or account. Columns: account, name, address, last reading, usage, rate, amount due, due date, status. Row scale: thousands to millions.

### Solar / wind farm table
Each row a turbine or inverter. Columns: ID, location in farm, status, current power, fault codes, last service, availability. Row scale: dozens to hundreds per farm.

### Demand response event table
During a DR event. Each row a participant. Columns: account, capacity offered, dispatched, performance, payment. Row scale: hundreds.

### NERC compliance / disturbance event table
Each row a reportable event. Columns: date, type, severity, description, status (under analysis / submitted), filing deadline. Row scale: dozens.

### Maintenance work order table
Each row a work order. Columns: WO #, equipment, type, priority, status, scheduled, assigned crew, estimated downtime. Row scale: hundreds.

## Behaviors and needs

- **Live updates with stable layout.** SCADA values update every 2–4 seconds. Operators read while updates happen.
- **Color drives operational meaning.** Loading thresholds (green / amber / red), alarm severity, status. Configurable per utility.
- **Severity-based sort and grouping.** Active alarms sorted by severity then age.
- **Sticky / pinned rows.** Critical equipment pinned regardless of sort.
- **Geographic linkage.** Map of grid topology with click-through to table rows.
- **Single-line diagram linkage.** Click a breaker on the SLD → table scrolls to that breaker.
- **Audit trail.** Every operator action (open breaker, issue tag, accept alarm) logged with timestamp and operator. Required for NERC and post-event analysis.
- **Workflow with formal approvals.** Switching orders require sign-off; some actions require two operators.
- **Print and PDF.** Switching orders, daily logs, post-event reports, NERC filings.
- **Sub-second alarm response.** A new critical alarm must be unmistakable.
- **Audio alerts** for critical conditions.
- **Multi-monitor operator consoles** with the same table at different sizes.
- **Wallboards in control rooms.** Big, high-contrast, low-interaction.
- **Field mobile** for crews — outage details, switching steps, photo upload.
- **Time alignment.** SCADA timestamps must align across systems for post-event analysis.
- **Quality flags per cell.** A SCADA value may be telemetered, manually entered, estimated, or stale. The cell should signal quality.
- **Bulk acknowledge.** Storm conditions create alarm storms.
- **Trend / sparkline cells.** Per-row recent history of a measurement.
- **Threshold display.** Show the threshold inline (current 850A / limit 1000A).
- **Per-row history drill** to the historian for that point.

## Frustrations

- An alarm storm during a major event that buries the critical alarms in noise.
- A SCADA value that says "850 MW" without indicating the timestamp or quality (stale, estimated, manual).
- An outage table that doesn't deduplicate calls from the same neighborhood.
- Switching order that doesn't enforce the sequence of steps.
- A market table that doesn't reflect the latest cleared interval.
- Loading values that don't account for contingency (the line is at 80% but a contingency would push it to 110%).
- Tags / clearances that aren't visible on the equipment row, leading to safety incidents.
- A field outage map that doesn't sync with the operator's outage table.
- A maintenance table that doesn't account for outage windows.
- Wind / solar forecasts that don't show forecast vs actual together.
- Smart meter tables where last-read time isn't visible per row.
- Customer billing tables that don't show payment history alongside the current balance.
- A regulatory filing table that doesn't surface the next deadline prominently.
- Time displayed in local without indicating which time zone (utilities span zones).

## Domain-specific notes

- **Reliability standards (NERC CIP, IEC, ISO) shape everything.** Audit trails, change control, training requirements all influence the operator UI.
- **The control-room aesthetic is conservative.** Operators are trained on specific colors and layouts; changing them creates real risk. Tables must respect existing conventions.
- **Quality flags are first-class.** SCADA values come with quality (good, bad, manual, estimated, stale). Cells must communicate this.
- **24/7/365 operation.** Tables run continuously across decades. Reliability beats features.
- **Wallboard rendering is its own surface.** Same data, different presentation.
- **Color carries operational meaning.** Loading thresholds, alarm severity, equipment status are standardized within a utility's operating procedures.
- **Audit trails are mandatory.** NERC filings depend on them; post-event analysis requires them.
- **Standardized forms and reports.** NERC, FERC, EIA reporting templates. Tables must produce regulatory-compliant artifacts.
- **Geographic and topological linkage.** Grid topology (single-line diagrams) and geographic maps are constantly paired with tables.
- **Field crews use mobile.** Outage details, switching procedures, photo upload from rugged tablets in trucks.
- **Storm response is the dominant disruption pattern.** Tables must scale to thousands of simultaneous outages and not collapse.
- **Trading desk tables overlap with finance.** LMP, market clearing, auction results — same shape as finance tables but with energy-specific units.
- **Historians and trends.** Many measurements are pulled from historians (PI, OSIsoft); per-row sparklines are common.
- **Multi-zone time complexity.** A grid spans time zones; trades clear in market-zone time; field crews work in local time. Tables must be unambiguous.
- **The "quality flag" pattern (per-cell metadata)** is more developed in this domain than almost any other. Worth understanding even if eudonia doesn't model it deeply.
- **Operator certification.** Operators are certified on specific systems. UI changes require retraining. Table component changes ripple slowly.
