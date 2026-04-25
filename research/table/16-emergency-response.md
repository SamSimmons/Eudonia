# Emergency response

The high-stakes, time-critical, multi-agency coordination world. Reference systems: 911 CAD (Computer-Aided Dispatch — Tyler New World, Hexagon, Motorola Solutions, RapidDeploy, CentralSquare), incident management systems (WebEOC, NICS, ICS forms 201–215, Veoci, NC4), fire / EMS records management, mutual aid coordination, mass casualty triage, search-and-rescue tools, FEMA HSPA dashboards, NORAD / NORTHCOM operations, ESF (Emergency Support Function) coordination cells.

## Who is at the screen

- **911 / 911 calltakers and dispatchers** in dispatch centers (PSAPs). Multi-monitor consoles. 24/7 shifts. Calltakers pick up incoming calls; dispatchers send units. Some centers combine roles.
- **Incident commanders** at the scene of large events, working from a tablet, a vehicle screen, or an EOC.
- **EOC (Emergency Operations Center) staff** during activations — multi-agency coordination room with shared displays.
- **Fire / EMS crews** in the apparatus, viewing turnout cards on a mobile data terminal.
- **Police officers** in patrol cars on MDTs viewing dispatch and querying records.
- **Hospital ED charge nurses** during MCIs (mass casualty incidents) coordinating bed status with field.
- **Search and rescue teams** tracking team positions, search assignments.
- **Public information officers** preparing situational reports.
- **Federal / state coordinators** during disasters using ICS forms and dashboards.

The setting is uniquely intense — shared wallboards in EOCs, multi-monitor dispatcher consoles, ruggedized mobile in vehicles, austere field laptops in command tents.

## Jobs to be done

- Triage an incoming 911 call.
- Dispatch the appropriate units to an incident.
- Track unit status (available, en route, on scene, transporting, out of service).
- Coordinate multi-agency response at a major scene.
- Maintain an ICS 214 unit log.
- Build an incident action plan (IAP).
- Track resources (personnel, apparatus, equipment).
- Triage casualties.
- Coordinate evacuations.
- Brief incoming shifts.
- Generate the official record of an incident.

## Representative tables

### Active incident / call queue (CAD)
The defining dispatch table. Each row an active incident. Columns: priority, call type, location (address + cross-streets), narrative, units assigned, status, time received, time of latest update. Row scale: dozens to hundreds active. Refresh: live push, sub-second. Sort by priority then time. Color heavily on priority and on aging without unit assigned. The dispatcher's primary surface for an entire shift.

### Unit status table
Each row a field unit (police car, fire engine, ambulance, supervisor). Columns: unit ID, type, status (available / en route / on scene / transporting / quarters / out of service), current incident, location, crew, time in current status. Row scale: dozens to hundreds. Refresh: live push. Color heavily on status. The dispatcher uses this and the incident queue together.

### Pending / unassigned incidents
A subset of the call queue — calls that have come in but no unit dispatched yet. Same shape as the active queue but filtered. Aging is the critical signal.

### Closed incidents log
Recently completed incidents. Same shape as active queue but with disposition and total time. Used at end of shift for reporting.

### Resource / apparatus inventory
Each row a piece of equipment. Columns: ID, type, station / district, status, last service, in-service date. Row scale: dozens to hundreds.

### Personnel / staffing table
Who's on shift. Each row a person. Columns: name, role, station, shift, on-duty status, qualifications, contact. Row scale: dozens per agency.

### Mutual aid request table
For incidents requiring outside help. Each row a request. Columns: requesting agency, resource needed, sent to, status (pending / committed / arrived / released), ETA. Row scale: dozens per major incident.

### Triage / patient table (MCI)
At a mass casualty incident. Each row a patient. Columns: triage ID (e.g. tag color + number), category (red / yellow / green / black), age estimate, chief complaint, injuries, transport destination, transport time. Row scale: dozens to hundreds. Color is operational.

### Hospital / bed availability table
During an MCI or daily ops. Each row a hospital. Columns: hospital, ED beds available, trauma beds, OR availability, divert status, wait time. Row scale: dozens. Refresh: minutes. Used by EMS to decide where to transport.

### Resource ordering / ICS 213RR table
ICS form for resource requests. Each row a requested item. Columns: item description, quantity, priority, ordered, delivery location, status. Row scale: dozens per operational period.

### ICS 214 unit log
Activity log for a unit / position. Each row an event. Columns: time, event description. Row scale: dozens per shift. Append-only. Used for after-action reporting and legal record.

### Incident action plan (IAP) — ICS 215 / 215A / 204 tables
Detailed assignments by branch / division / group. Each row an assignment. Columns: division, leader, resources assigned, work assignment, special instructions. Row scale: dozens per IAP.

### Search assignment table (SAR)
Each row a search team's assignment. Columns: team, search area, terrain, start, planned duration, status, last comms. Row scale: dozens.

### Evacuation tracking table
Each row a person, household, or facility evacuated. Columns: identifier, origin, destination shelter, transport, special needs, status. Row scale: dozens to thousands during a major evacuation.

### Shelter management table
Each row a shelter. Columns: name, address, capacity, current population, special needs accepted, supplies status, manager. Row scale: dozens.

### Damage assessment table
Each row a structure or area assessed. Columns: address, structure type, damage category (minor / major / destroyed), photos, GPS, assessor, date. Row scale: hundreds to thousands after a major event.

### Donations / volunteer intake table
For long-tail disaster response. Each row a donation or volunteer offer. Columns: source, type / quantity / skill, contact, status, assigned to. Row scale: dozens to thousands.

### Situational awareness / common operating picture summary
Roll-up tables showing key counts: active incidents by type, units by status, resources committed, casualties.

### Notification / message log
Each row a notification sent or received. Columns: time, from, to, content, channel, acknowledgment. Row scale: dozens per major incident.

## Behaviors and needs

- **Live updates without scroll jump.** Calls come in and units update constantly; the dispatcher must keep their place.
- **Severity / priority drives row presentation.** A new priority-1 call must be visually unmistakable.
- **Color is operational and standardized within agency.** Triage tag colors (red/yellow/green/black) are SALT/START standards. Unit status colors are agency-specific but consistent within.
- **Audio and visual alerts on new high-priority rows.** A new priority-1 call may chime; the dispatcher cannot miss it.
- **Keyboard-driven dispatch.** Type a unit ID and an incident # to assign. Function keys for common actions. The mouse is too slow.
- **Single-screen-of-truth.** The CAD table is often visible on every console in the room; consistency across views is critical.
- **Address autocomplete and validation.** Accuracy matters — wrong address sends help to the wrong place.
- **Map linkage.** Click incident → map shows location; click unit → map shows current position. Real-time AVL feeds drive unit positions.
- **Drill into incident detail without losing the queue.** Side panel or split view.
- **Aging counters that are visible at a glance.** "Call has been holding 3:15." Color escalates.
- **Annotation / narrative stream per incident.** Dispatcher updates the call narrative as new info arrives. Time-stamped, append-only.
- **Audit trail.** Every action (call received, unit dispatched, status changed) logged with timestamp and dispatcher. Often required for legal record.
- **Export and print incident reports.** End-of-shift or post-incident.
- **Offline-tolerant in vehicles.** MDT in a patrol car may lose connectivity; the unit table needs to handle gracefully.
- **High-contrast in low-light environments.** Dispatch centers run dimly; field vehicles run at night. The table must remain legible.
- **Wallboard mode for EOCs.** Big fonts, no interaction, summary view of multiple operations.
- **Bulk actions for resource management.** Assign 5 units to a perimeter, change status of a strike team.
- **Multi-agency interoperability.** The same incident may show up in police, fire, EMS, and 911 systems with shared keys.

## Frustrations

- A new high-priority call appearing and the active row jumping out of place.
- Stale unit status — the table says "available" when the unit is actually on a call.
- Address fields that don't autocomplete or validate, leading to mis-routing.
- Aging counters that don't reset visibly when an action is taken.
- A status change that takes 5 seconds to reflect, leaving the dispatcher uncertain.
- Tables that require mouse interaction in a keyboard-first environment.
- Wallboard text too small to read across the EOC.
- A triage table that doesn't preserve color in printouts.
- An ICS form export that doesn't match FEMA template requirements.
- Map-table desync — incident shows in one place, map pin in another.
- Alert chimes that fatigue the dispatcher and get muted.
- Cluttered displays that obscure the next priority call.
- A unit log that doesn't enforce strict time-stamping.
- Multi-agency systems that show different counts of the same incident.
- Failure modes that are not obvious — the dispatcher thinks the system is working when it isn't.

## Domain-specific notes

- **Stakes are uniquely high.** A misread row, a missed update, a delayed dispatch can cost lives. Reliability and clarity beat aesthetics.
- **The table is mission-critical infrastructure.** Failure modes must degrade gracefully — never blank, never stuck-loading, never silent.
- **Audit trails are required by law in many jurisdictions.** Every action is logged; tables are often exported as the legal record of an incident.
- **Standardized forms.** ICS forms (201, 202, 204, 205, 206, 213, 214, 215, 215A) are FEMA-defined; tables that produce these must match exactly.
- **Color carries operational meaning.** Triage colors, hazmat placards, severity levels. Color cannot be the only carrier — colorblind users exist and dispatch is sometimes done in monochrome printouts — but color is essential as one channel.
- **24/7 operation.** Tables run continuously across shift changes. Memory leaks, accumulating DOM, growing event listeners are all real failure modes.
- **Multi-monitor consoles.** Dispatchers run 2–6 monitors with different views. Tables must look right at very different sizes simultaneously.
- **Wallboard mode is a separate product surface.** Same data, different rendering — large, high-contrast, low-interaction.
- **Hardware is ruggedized but old.** Field MDTs may be from 5+ years ago. The table must perform on modest hardware.
- **Printed artifacts are operational.** Pre-incident plans, IAPs, after-action reports — printed and bound. The table is the data; the printed document is the deliverable.
- **The triage table is a unique pattern.** Rows added quickly under stress, color is the most-important visual encoding, must be readable on a tablet held in gloves under poor lighting.
- **Network is unreliable in the field.** Offline-first patterns matter — queued updates, conflict resolution, "last sync" indicators.
- **Interoperability across agencies** is a long-running challenge. Tables should not assume data ownership; they render whatever the dispatch center's CAD or EOC system feeds them.
- **The component would never be the source of truth** — but it is what the operator sees, and that perception is what drives action.
