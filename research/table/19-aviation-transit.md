# Aviation and transit operations

Air traffic, airline operations, airport operations, rail dispatching, transit scheduling, fleet management. Reference systems: airline ops control centers (United Mission Control, Delta OCC), airport operations centers (AOCs), FAA En Route Automation Modernization (ERAM), Sabre, Amadeus, Navitaire, OAG, FlightAware, FlightRadar24, rail dispatching systems (CAD-equivalent for rail), bus / transit fleet management (Trapeze, INIT), Maintenance Repair and Overhaul (MRO) systems (AMOS, TRAX), aircraft maintenance logs.

## Who is at the screen

- **Air traffic controllers** at radar consoles managing dozens of aircraft. Specialized hardware; tables are companions to radar displays.
- **Airline operations controllers** at the airline's OCC running the day's flying schedule, handling diversions, weather, mechanicals.
- **Dispatchers** generating flight plans, tracking each flight from gate to gate.
- **Crew schedulers** ensuring every flight has a legal crew under FAR/EASA rules.
- **Gate agents and ramp coordinators** managing gate assignments and turn timing.
- **Maintenance controllers** tracking aircraft technical status, deferred items, scheduled maintenance.
- **Rail dispatchers** managing track occupancy, train movements.
- **Transit operations** dispatching buses, light rail, paratransit.
- **Fleet operators** for trucking, ride-share, autonomous vehicle ops.
- **Travelers** consuming flight information displays (FIDs).
- **Cargo coordinators** managing freight movement.

Setting is operations centers (24/7) with multi-monitor consoles and shared wallboards. Crews use EFBs (electronic flight bags — iPads usually) in the cockpit.

## Jobs to be done

- Track every aircraft / train / bus in the fleet right now.
- Decide how to recover from a disruption (cancel, swap aircraft, reposition crew).
- Verify a crew is legal for a flight.
- Confirm an aircraft is airworthy for a flight.
- Dispatch a flight (file the flight plan, brief the crew).
- Decide which gate to assign.
- Manage maintenance: what's grounded, what's coming due, what spares are available.
- Schedule next month's operation.
- Brief the on-coming shift.
- Communicate to passengers / travelers.

## Representative tables

### Flight strip / flight plan table (airline ops)
Each row a flight. Columns: flight #, route (origin > destination), scheduled depart, scheduled arrive, aircraft tail, status (scheduled / boarding / pushback / airborne / landed / arrived / delayed / cancelled / diverted), gate, crew, current ETA, delay reason. Row scale: hundreds to thousands per day per airline. Refresh: live. Color heavily on status and on delay. The OCC's primary operational table.

### Aircraft (tail) status table
Each row an aircraft. Columns: tail, type, current location, current flight assignment, next scheduled flight, technical status, deferred items, fuel, maintenance due. Row scale: hundreds per fleet. Live updates as flights complete.

### Crew tracking table
Each row a crew member. Columns: employee ID, name, base, current pairing, current flight, duty time used, duty time remaining, rest required, next assignment. Row scale: hundreds to thousands. FAR/EASA rule compliance encoded in color and warnings.

### Crew pairing table
Each row a multi-day pairing (a sequence of flights flown together). Columns: pairing ID, start date, end date, flights, length, layover cities, deadhead segments. Row scale: thousands.

### Gate assignment table
Each row a gate. Columns: gate, current aircraft, current flight, scheduled arrivals, scheduled departures, conflicts. Row scale: dozens per terminal.

### Disruption management / recovery table
During a weather event or operational issue. Each row a disrupted flight. Columns: flight, original schedule, current status, options (cancel / delay / divert / swap), passengers affected, downstream impact. Row scale: dozens during a disruption. Workflow-driven.

### Maintenance scheduling table
Each row an upcoming maintenance check or task. Columns: aircraft, task, due, location scheduled, downtime expected, status. Row scale: dozens per fleet per week.

### Deferred items / minimum equipment list (MEL) table
Each row a deferred or open maintenance item. Columns: aircraft, item, MEL category (A/B/C/D), opened, due, restriction, status. Row scale: dozens per fleet.

### Spare / parts inventory table
Each row a part. Columns: part #, description, on hand, location, in repair, due in. Row scale: thousands.

### ATC sector strip table
Each row an aircraft in a controller's sector. Columns: callsign, type, altitude, speed, heading, route, next waypoint, handoff time. Row scale: dozens per controller. Refresh: continuous. Specialized hardware historically.

### Airspace / sector table
Each row a sector. Columns: sector, controller, traffic count, MAP (monitor alert parameter), restrictions. Row scale: dozens.

### Train movement / track occupancy table (rail)
Each row a train. Columns: train ID, origin, destination, current location (track segment), speed, schedule status, crew, equipment. Row scale: dozens to hundreds per dispatcher.

### Bus / transit run table
Each row a scheduled run. Columns: route, run #, vehicle, operator, scheduled depart, current status (on-time / late / early), passengers. Row scale: dozens to hundreds.

### Vehicle / fleet status table (trucking, rideshare)
Each row a vehicle. Columns: ID, type, current location, status (in service / available / out of service), driver, current assignment, last service. Row scale: dozens to thousands.

### Cargo / shipment manifest table
Each row a cargo item. Columns: AWB, weight, pieces, origin, destination, status, ULD, special handling. Row scale: hundreds per flight.

### Flight information display (passenger-facing FID)
The airport monitor table. Each row a flight. Columns: time, airline, flight, destination/origin, gate, status (on time / boarding / departed / delayed / cancelled). Row scale: dozens visible. Auto-cycling, large fonts.

### Airport ramp / turn coordination table
Each row a flight turning at the airport. Columns: arriving flight, departing flight (same aircraft), gate, time on ground, fuel needed, catering, cleaning, baggage, status. Row scale: dozens.

### Slot / runway scheduling table
For congested airports. Each row a slot. Columns: time, runway, aircraft, flight, status. Row scale: hundreds.

### Weather / NOTAM table
Each row a weather warning, NOTAM, or operational restriction. Columns: location, valid from, valid to, type, description, severity. Row scale: hundreds.

### Pilot / crew duty time table
Per crew member, FAR/EASA duty time tracking. Columns: date, duty in, duty out, flight time, rest after, cumulative period. Row scale: dozens per crew per month.

### Accident / incident reporting table
Each row a reported incident. Columns: date, aircraft, flight, location, type, severity, status. Row scale: dozens per year.

## Behaviors and needs

- **Live updates.** Status changes constantly. Color, position, time-aging all update. The user's place must be preserved.
- **Color drives operational meaning.** Status colors are standardized within an airline / agency. Yellow / red / amber for delay severity. Blue for departed. Green for on-time. The component renders consumer-defined palettes.
- **Time-aging signals.** "How long has this flight been delayed?" "How long has this aircraft been on the ground?" Color escalates.
- **Per-row alerts and badges.** Aircraft on MEL, crew nearing duty limit, flight needing attention.
- **Drill from row to detail.** Click a flight → flight detail with crew, aircraft, payload, fuel.
- **Map linkage.** Aircraft positions on a map, gate assignments on a terminal diagram. Click row → map; click map → row.
- **Sticky header.** Mandatory in long flight tables.
- **Sort by time / scheduled departure** is the default in most flight tables.
- **Filter by station, by airline, by status.** Saved filters are common.
- **Workflow actions per row.** Cancel flight, swap aircraft, reposition crew, assign gate.
- **Bulk action for disruption recovery.** Apply changes across many flights.
- **Audit trail.** Every action logged for safety and operational review.
- **Print and PDF.** Flight plans, crew briefings, dispatch releases — all paper-ready.
- **Multi-shift handoff.** Tables must support clean handover between dispatchers.
- **Mobile / iPad use** in the cockpit, on the ramp, in the cabin.
- **Wallboard mode for FIDs and OCC walls.** Large fonts, no interactivity.
- **High-contrast for low-light operations centers.**
- **Slot conflict detection.** Visually surface gate or runway conflicts.
- **Time-zone awareness and Zulu time.** Aviation uses UTC universally; tables often show both Zulu and local.

## Frustrations

- A flight status that lags behind reality, leading dispatchers to make decisions on stale data.
- Color schemes that conflict between systems (an airline's red is a different airport's amber).
- A table that doesn't surface duty-time violations until they're already a problem.
- Time displayed in local time when Zulu was needed, or vice versa.
- Gate conflicts that aren't visually obvious until the aircraft can't park.
- A maintenance table that doesn't align due-dates to aircraft routing, leaving items overdue between hub visits.
- Crew tables that don't account for time zone of the duty start.
- FIDs that flicker on update, distracting passengers.
- A disruption table that doesn't roll up impact (passengers stranded, crew stuck).
- Cargo manifests that don't enforce dangerous goods checks visibly.
- Search by flight # that doesn't differentiate today's flight from last week's same-numbered flight.
- An aircraft swap that doesn't propagate to all dependent flights cleanly.
- Wallboards too small to read across the operations center.
- Mobile EFB tables that don't render in airplane lighting (dim cabin, bright cockpit).

## Domain-specific notes

- **Mission criticality.** Aircraft and trains operate on tight margins. Decisions made from these tables move billion-dollar fleets and thousands of passengers.
- **Regulatory compliance encoded in color.** FAR / EASA / Joint Civil Aviation Authorities rules dictate duty time, equipment requirements, dispatch procedures. Tables surface violations in real time.
- **Time is universally Zulu.** Aviation operates in UTC; tables default to Zulu with optional local display.
- **Color is operational and standardized within agencies but not across them.** The component renders what it gets.
- **Wallboards and FIDs are products of their own.** Same data, different rendering.
- **24/7 with shift-based ownership.** Tables must support clean handoff.
- **Audit trails for safety.** Every operational decision is logged. Some are NTSB-investigable.
- **Multi-monitor consoles** are standard. The same table at different sizes simultaneously.
- **Cockpit / EFB context.** iPad-sized tables in bright daylight or dim cockpits. Brightness adaptation matters.
- **Passenger-facing tables (FIDs, mobile apps)** are downstream of operational tables but share the data. Public versions must be more accessible, less detailed.
- **Disruption management is the dominant operational pattern.** Weather, mechanicals, crew issues cascade through the schedule. Tables must support recovery decision-making, not just monitoring.
- **Aircraft routing is multi-day.** A swap on Monday affects Friday's schedule. Tables must surface downstream impacts.
- **Print is operational.** Dispatch releases, crew briefings, weight-and-balance, NOTAMs — all printed and signed. The table component must produce these.
- **Maintenance is paperwork-heavy and regulated.** Tables produce regulatory artifacts.
- **Tail / aircraft / vehicle identity is paramount.** Tables must distinguish unambiguously between similar IDs.
- **Aviation language is its own.** ICAO codes, IATA codes, ATC phraseology. Tables render whatever consumers provide; the component is content-agnostic.
