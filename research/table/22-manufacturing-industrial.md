# Manufacturing and industrial operations

The factory floor and the plant. Reference systems: MES (Manufacturing Execution Systems — Rockwell FactoryTalk, Siemens Opcenter, Aveva, GE Proficy), ERP (SAP, Oracle, NetSuite, Infor), historians (OSI PI, Aveva PI, Ignition), quality systems (LIMS — LabWare, STARLIMS), CMMS (computerized maintenance — Maximo, Fiix, UpKeep), SCADA / HMI (Rockwell, Siemens, Wonderware, Ignition), warehouse / logistics (covered separately), pharma manufacturing (electronic batch records — Werum PAS-X), automotive Andon systems.

## Who is at the screen

- **Plant operators** at HMI consoles running the line. Dedicated screens at machines.
- **Production supervisors** monitoring multiple lines or a department. Walking the floor with tablets, returning to the desk for analysis.
- **Plant managers** consuming overall plant performance dashboards.
- **Quality engineers and lab technicians** managing quality data, SPC charts, deviations.
- **Maintenance technicians** working from CMMS work orders.
- **Process engineers** troubleshooting issues, tuning parameters.
- **Schedulers / planners** building production schedules.
- **Inventory / materials handlers** managing raw materials and WIP.
- **Engineering** doing root-cause analysis post-event.
- **Regulatory / compliance** in regulated industries (pharma, food, aerospace).
- **Continuous improvement teams** (Lean, Six Sigma) doing analysis.
- **Supply chain** coordinating with production.

Settings include the plant floor (often hostile — heat, noise, vibration, dust, gloves, hard hats), control rooms, and offices. Same data appears in all three.

## Jobs to be done

- Run today's production schedule.
- Detect a process going out of control.
- Resolve a stoppage.
- Track output against plan.
- Manage quality — release good batches, hold bad ones.
- Coordinate maintenance with production.
- Plan next week's production.
- Investigate a quality incident.
- Generate compliance documentation.
- Hand off shift cleanly.

## Representative tables

### Production schedule / order table
Each row a production order (batch, work order, job). Columns: order #, product, planned qty, actual qty, status (planned / released / running / paused / complete), start, due, line / cell. Row scale: dozens per shift, hundreds per week.

### Live production status / OEE table
Each row a line, cell, or asset. Columns: line, status (running / down / setup / starved / blocked), current product, planned rate, actual rate, OEE % (Availability × Performance × Quality), shift cumulative output. Row scale: dozens. Refresh: live. Color heavily on status and on OEE.

### Andon / line-stop table
Each row an active or recent stoppage. Columns: time, line, station, reason, duration, responder, status. Row scale: dozens per shift. Color by reason category. Often paired with audio / visual alarms on the floor.

### Equipment / asset status table
Each row an asset. Columns: asset ID, name, status (running / idle / down / maintenance), current parameters, alarms, runtime hours, next PM due. Row scale: dozens to hundreds.

### Process parameter / setpoint table
Each row a process variable. Columns: name, setpoint, current value, deviation, units, alarm low, alarm high, mode (auto/manual). Row scale: dozens to hundreds per unit. Live values, with quality flags.

### Trend / historian table
Tabular access to time-series tags. Each row a tag at a time point. Columns: time, value, quality. Row scale: thousands per query.

### Batch record table (regulated manufacturing)
Each row a step in a batch. Columns: step, parameters, expected, actual, performed by, witnessed by, time, deviations. Row scale: dozens to hundreds per batch. Workflow-driven; signature columns. Critical compliance artifact.

### Deviation / nonconformance table
Each row an event. Columns: ID, batch, station, description, severity, reporter, status (open / under investigation / closed), CAPA link. Row scale: dozens per month.

### CAPA (corrective and preventive action) table
Each row a CAPA. Columns: ID, type, source deviation, owner, due, status, effectiveness check. Row scale: dozens per quarter.

### Quality / SPC data table
Each row a sample measurement. Columns: time, lot, characteristic, value, spec low, spec high, in/out of spec, USL, LSL. Row scale: hundreds to thousands per shift. Often paired with SPC chart.

### Inspection record table
Each row an inspection. Columns: lot, sample size, defects found, AQL pass/fail, inspector, time. Row scale: dozens per shift.

### Lot / genealogy table
Each row a lot or its components. Columns: lot, parent lot(s), component lots, qty, status, location. Row scale: thousands. Genealogy navigation (drill into lineage) is critical.

### Material / raw inventory table
Each row a material at a location. Columns: material, location, on hand, allocated, available, reorder point, expiration. Row scale: thousands.

### Work order / maintenance task table
Each row a maintenance task. Columns: WO #, asset, type (PM / corrective / emergency), priority, status, assigned, scheduled, hours used. Row scale: hundreds.

### Spare parts inventory
Each row a part. Columns: part #, description, on hand, location (cribs/bins), min/max, supplier, lead time. Row scale: thousands to tens of thousands.

### Energy consumption table
Each row a meter, asset, or line. Columns: kWh consumed (period), peak demand, cost, baseline, deviation. Row scale: dozens to hundreds.

### Yield / scrap table
Each row a product or line. Columns: produced qty, good qty, scrap qty, yield %, top scrap reasons. Row scale: dozens.

### Operator certification / training table
Each row an operator × certification. Columns: operator, equipment, cert level, certified date, expiration, status. Row scale: hundreds.

### Shift handoff / pass-down table
Each row a topic for the next shift. Columns: time, area, item, severity, status. Row scale: dozens.

### Supplier quality table
Each row an incoming lot from a supplier. Columns: supplier, material, lot, received, inspected, accepted/rejected, defect count. Row scale: dozens to hundreds.

### Compliance / audit findings table
Each row a finding. Columns: audit, category, severity, finding, owner, status, due. Row scale: dozens per audit.

### Calibration table
Each row a measurement instrument. Columns: ID, type, last calibrated, next due, accuracy, status. Row scale: hundreds. Color on overdue.

### Sterilization / traceability tables (food, pharma, medical device)
Each row a sterilization cycle or a traceability link. Columns: cycle, equipment, time, parameters validated, qualifier, status. Row scale: dozens per shift.

## Behaviors and needs

- **Live updates with stable layout.** Operators read the table while values update.
- **Color drives operational meaning.** Status colors, in/out-of-spec, OEE thresholds. Standardized within plant.
- **Sticky first column** for line / asset / parameter name.
- **Hostile-environment readability.** Bright lights, vibration, dirty screens, gloved touchscreens. Big text, high contrast.
- **HMI-style displays** are constrained — fixed layout, large indicators, no scrolling. The "table" on an HMI is short and dense.
- **Audit trail.** Every parameter change, every batch step signed off. Required for FDA / EMA / FAA / similar.
- **Electronic signatures.** A column can be a signed-by attribution per row.
- **Print and PDF.** Batch records, deviation reports, audit findings — printed regulatory artifacts.
- **Drill from row to detail.** Click a parameter → trend chart. Click a batch step → step detail. Click a deviation → investigation.
- **Bulk action.** Release a batch, close out work orders.
- **Status pills.** Many overlapping status systems (production status, quality status, equipment status).
- **Threshold display inline.** Setpoint, current, alarm bands all visible in one row.
- **Quality flags per cell.** Telemetered, manual, estimated, stale.
- **Genealogy and traceability.** Tables expand to show parent-child lot relationships.
- **Time-aware columns.** Cycle time, downtime duration, time since last PM.
- **Multi-shift handoff.** End-of-shift handover from the table.
- **Annotation.** Operator notes on parameters, deviations, scrap entries.
- **Comparison to plan / baseline / spec.** Variance columns and visual indicators.
- **Locale and units.** Imperial vs metric; jurisdiction-specific reporting.

## Frustrations

- A line-stop table that doesn't surface stoppage cause categories quickly enough for analysis.
- A batch record table that allows out-of-order step completion (a compliance failure).
- Process parameter tables where the value is shown without quality flag.
- A maintenance work order table that doesn't account for production schedule, leading to outages during peak demand.
- An OEE rollup that hides the worst-performing line.
- Calibration tables that don't escalate overdue calibrations urgently.
- Inventory tables with stale on-hand values.
- A deviation table that doesn't clearly mark which deviations are blocking batch release.
- Inspection records that don't show pass/fail prominently.
- Trends that aren't accessible from the table.
- HMI tables too small for gloved interaction.
- A supplier quality table that doesn't surface repeat offender patterns.
- Audit finding tables that don't show due-date urgency.
- A genealogy view that requires opening 10 separate pages instead of inline expand.

## Domain-specific notes

- **Compliance shapes everything in regulated industries.** FDA 21 CFR Part 11, EU GMP, ISO standards. Tables in pharma, food, medical device, aerospace must support electronic signatures, audit trails, time-stamped records, and immutable history.
- **Hostile environments.** The plant floor has heat, vibration, dust, glove use, splash hazards, ESD requirements. Touchscreens may be plastic-covered. The component must remain usable.
- **HMI vs office context.** Same data, very different rendering. HMIs are fixed-layout; office tables are flexible.
- **Quality flags per cell.** Telemetered values, manual entries, estimated values, and stale values must be distinguishable.
- **Color is operational and standardized.** OEE color bands, alarm severity, status. Standardized within plant; the component renders consumer-defined palettes.
- **Genealogy / traceability.** Lot ancestors and descendants; batch step composition. Tree-aware tables are common.
- **Standardized regulatory forms.** FDA EBR, EU Annex 11, etc. Tables must produce compliant artifacts.
- **24/7 operation.** Tables run continuously across shifts.
- **Audit trails are mandatory.** Every parameter change, every step completion, every signature.
- **Print is operational.** Batch records, work orders, inspection records — printed daily.
- **Multi-shift handoff** is a core workflow.
- **Process control vs business analytics blur.** A trending tag table for an operator vs an OEE rollup for a manager use the same data through different lenses.
- **Pharma especially is an extreme case.** Every cell may have a regulatory consequence; data integrity is enforced by ALCOA+ principles (Attributable, Legible, Contemporaneous, Original, Accurate, plus more).
- **Energy / sustainability reporting** is increasingly part of plant tables. Carbon, water, waste columns alongside production.
- **Predictive maintenance** is being layered on top — tables now include "predicted failure date" columns from ML models.
- **Aging plants run aging software.** Modern table components must coexist with screens designed for Windows 95.
- **Operator certification visibility.** Some actions can only be performed by certified operators; tables surface who can do what.
