# Construction and project management

Construction and physical project management run on tables that bridge office and field. Reference tools: Procore, Autodesk Construction Cloud (PlanGrid, BIM 360), Buildertrend, CoConstruct, Fieldwire, Smartsheet, Microsoft Project, Primavera P6, Asana, Monday, ClickUp, Notion, Bluebeam Revu. Industry-adjacent: facilities management (FM:Systems), real estate development tools.

## Who is at the screen

- **Project managers** in trailers on-site or in offices, coordinating dozens of subcontractors. Tables are their primary coordination surface.
- **Superintendents** on-site running daily operations from a tablet.
- **Foremen and trade leads** coordinating their crew's work, often on a phone or tablet.
- **Architects** tracking RFIs, submittals, drawings.
- **Estimators** building bids and budgets in spreadsheet-like tables.
- **Owners / developers** consuming progress dashboards.
- **Accountants and controllers** tracking cost, billing, and change orders.
- **Inspectors** documenting site conditions, punch list items.
- **Safety managers** tracking incidents, near-misses, certifications.

Setting is a mix of office workstation, on-site trailer desktop, jobsite tablet, and phone in the field. The same table is regularly viewed in all four.

## Jobs to be done

- See what's happening on-site today.
- Decide who needs which information by tomorrow.
- Track which RFIs are blocking work.
- Approve or reject a change order.
- Document a punch list item.
- Submit a daily report.
- Schedule next week's work.
- Track budget against actual spend.
- Decide whether the project is on schedule.
- Resolve a safety incident.

## Representative tables

### Task / activity schedule (project plan)
Each row a task. Columns: ID, name, predecessors, duration, start, finish, % complete, owner, resources, baseline variance. Row scale: hundreds to tens of thousands. Hierarchical (WBS — work breakdown structure) with multi-level expand/collapse. Often shown alongside a Gantt chart; the table and Gantt are linked.

### Daily report table
Each row a daily entry. Columns: date, weather, manpower, equipment, work performed, photos count, signed by. Row scale: one per day; hundreds over a project. Drill into a row for full report.

### Manpower / labor log
Each row a worker/day. Columns: worker, trade, hours, area, task. Row scale: dozens per day, thousands over a project. Roll up to weekly summaries.

### RFI (Request for Information) table
Each row an RFI. Columns: RFI #, subject, submitted by, submitted date, due date, days open, assignee, status, response. Row scale: dozens to hundreds per project. Workflow-driven. Color heavily on overdue.

### Submittal table
Each row a submittal. Columns: number, item, contractor, submitted, reviewer, status, returned date, days in review. Row scale: hundreds to thousands per project. Workflow-driven, multi-stage approval.

### Change order table
Each row a change order. Columns: CO #, description, requested by, amount, schedule impact, status, approver, dates. Row scale: dozens to hundreds. High dollar values; auditable.

### Punch list table
Each row a defect to be corrected. Columns: ID, location, trade, description, photo, severity, assignee, status, due. Row scale: dozens to thousands at end of project. Filter by trade for the trade lead.

### Drawing / document table
Each row a drawing. Columns: number, title, revision, date, status, discipline, set. Row scale: hundreds to thousands. Filter by discipline. Drill to drawing viewer.

### Subcontract / contract table
Each row a subcontract. Columns: subcontractor, scope, value, signed, percent complete, billed to date, retainage, balance, insurance status. Row scale: dozens to hundreds.

### Budget / cost table
Each row a cost code or line item. Columns: code, description, original budget, change orders, revised budget, committed, actual, projected, variance. Row scale: hundreds. Hierarchical (CSI MasterFormat divisions). Footer subtotals.

### Bid / estimate table
Each row a bid item. Columns: item, qty, unit, unit price, extended price, vendor, alternates. Row scale: hundreds to thousands. Editable in place; the entire bid lives in this table.

### Pay application table (AIA G702/G703)
Standard construction billing form. Each row a schedule-of-values line. Columns: description, scheduled value, completed previous, completed this period, materials stored, total completed, % complete, balance to finish, retainage. Row scale: dozens to hundreds. Footer totals; signed monthly.

### Inspection / observation table
Each row an inspection. Columns: date, area, inspector, type, items checked, deficiencies, photos. Row scale: dozens.

### Safety incident table
Each row an incident or near-miss. Columns: date, location, type, severity, persons involved, action taken, OSHA reportable. Row scale: dozens per project per year.

### Equipment table
Each row a piece of equipment. Columns: equipment ID, type, location, status (in use / idle / maintenance), operator, hours, last service. Row scale: dozens to hundreds.

### Material delivery / procurement table
Each row a material order. Columns: PO #, vendor, items, ordered date, expected, received, quantity short, status. Row scale: dozens to hundreds.

### Lookahead / 3-week plan
Each row a task in the upcoming window. Columns: task, contractor, area, prerequisites, start, finish, constraints. Row scale: dozens. Updated weekly in a coordination meeting.

### Punch / closeout document table
Each row a closeout requirement. Columns: item, responsible party, status, due date, document. Row scale: hundreds at project end.

### Permit table
Each row a permit. Columns: type, jurisdiction, status, issued date, expiry, conditions, inspection schedule. Row scale: dozens.

### Issue / observation log
Each row an issue raised in coordination. Columns: ID, description, raised by, date, area, status, owner, resolution. Row scale: hundreds.

## Behaviors and needs

- **Hierarchical tables with WBS.** Expand/collapse multi-level. Subtotals at each level. Critical for any cost or schedule table.
- **Sticky first column.** Scope, item, or task name. Without it, the table is unreadable on wide budgets.
- **Color on schedule status, on overdue, on safety severity, on cost variance.**
- **Inline edit, especially in budget and pay app tables.**
- **Photo attachment per row.** RFIs, punch list items, daily reports all carry photos. Often shown as small thumbnails in the row, expandable on click.
- **Drawing / document attachment per row.** Submittals, RFIs, change orders link to documents.
- **Signed / approval indicators per row.** Who signed, when. Often required for compliance.
- **Saved views.** "My open RFIs," "This week's submittals," "Overdue punch items by trade."
- **Mobile-friendly forms.** Field users add a row from a phone — punch item with photo and location.
- **Print and PDF.** Pay apps, daily reports, RFI logs, punch lists are routinely printed and sent.
- **Bulk update.** Mark complete, reassign, change due date.
- **Date math.** Days open, days to due, schedule slip in days.
- **Currency awareness.** Most projects are single-currency but international ones aren't.
- **Trade / discipline filter.** Show only mechanical, only electrical, only structural items.
- **Location tagging.** "Floor 3, Room 320, Wall B." Location is a first-class attribute.
- **Linking across tables.** RFI references drawing references submittal references change order. Cross-table navigation is constant.

## Frustrations

- A schedule table that is 4000 rows deep and impossible to navigate without aggressive collapse defaults.
- A photo column where thumbnails are too small to identify.
- An "approve" button that requires going to a different page to actually approve.
- Pay application tables that don't enforce the AIA format precisely (failed compliance).
- Slow uploads of field photos from spotty cellular connections, causing duplicate submissions.
- A daily report table that doesn't carry forward yesterday's information for editing.
- A budget table that doesn't update when a change order is approved elsewhere.
- Mobile views that show only a fraction of the columns and not the right ones.
- Punch list items without location data — "fix the wall" is useless without a location.
- A schedule that shows percent complete without showing critical path.
- Submittal status pills that don't distinguish "in review by architect" from "in review by engineer."
- An RFI log that shows "open" but not "days open" — the user has to do mental math.

## Domain-specific notes

- **Tables span office and field.** The same table needs to render at desk, on a tablet in the trailer, on a phone in the field. Responsive collapse is not optional.
- **Photos and documents are first-class.** Construction tables are heavily multimedia. Inline preview, lightbox expansion, document linking are baseline expectations.
- **Hierarchy is everywhere.** WBS, cost codes, location structure, trade structure. Tree-aware tables are non-negotiable.
- **Compliance and audit.** Pay apps, permits, safety logs, RFIs all carry legal and contractual weight. Signature trails, version history, immutability all matter.
- **Many tables are also forms.** Daily reports, RFIs, change orders are submitted via the table. The "row as form" pattern is common.
- **Standardized industry forms.** AIA pay application format, OSHA 300 logs, EPA SWPPP forms — strict layouts with regulatory teeth.
- **Connectivity is unreliable on jobsites.** Tables need to handle offline-first scenarios gracefully (queued writes, conflict resolution, "last sync" indicators).
- **Multiple parties.** Owner, architect, GC, subs, engineers all interact with the same tables but with different permissions. Visibility and editability differ by role.
- **Print is not optional.** Pay apps, RFI logs, daily reports, transmittals are printed and signed every week.
- **Currency and unit accuracy matter.** Cost overruns and quantity errors have real-money consequences.
- **The "list" idiom is often more accurate than the "table" idiom.** Many of these are queues and logs that grow append-only over time.
