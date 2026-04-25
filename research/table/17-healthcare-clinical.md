# Healthcare and clinical monitoring

The hospital and clinic environment. Reference systems: Epic (EpicCare, Hyperspace, Rover, Haiku/Canto), Cerner (Oracle Health), Meditech, Allscripts, athenahealth, eClinicalWorks, Phillips IntelliVue / Cerner CareAware (bedside monitors), GE Centricity, Stryker / Hill-Rom systems, ICU Medical infusion pumps, OR scheduling systems, lab information systems (Sunquest, Beaker), pharmacy systems, anesthesia information management systems (AIMS), EMS run sheets (ESO, Image Trend, Zoll). Specialized: telemetry monitoring stations, blood bank, organ donation registries.

## Who is at the screen

- **Bedside nurses** at COWs (computers on wheels), at nursing stations, on tablets. Charting, looking at orders, reading vitals, planning care.
- **Charge nurses** running a unit's bed status, staffing assignments, admission/discharge flow.
- **Hospitalists / floor physicians** rounding with a tablet, reviewing patient lists, writing notes.
- **Critical-care nurses and intensivists** in ICUs with continuous bedside monitoring and dense flowsheets.
- **ED nurses and physicians** in fast-paced triage and treatment.
- **Telemetry technicians** watching central station tables of dozens of patients' rhythms simultaneously.
- **OR teams** managing surgical schedules, case carts, sterile processing.
- **Pharmacists** verifying orders, managing dispensing.
- **Lab technicians** managing specimen workflows.
- **Care managers / case managers** tracking length of stay, discharge planning.
- **Coding / revenue cycle staff** post-encounter.
- **Hospital administrators** consuming throughput dashboards.
- **Patients themselves** in patient portals.

Settings range from quiet office workstations to chaotic bedside, with mobile use throughout. Tables must work in both extremes.

## Jobs to be done

- See the patients I am responsible for this shift.
- Find a specific patient's chart.
- Look at the trend of vital signs over the last 4 hours.
- Verify the medication order before administering.
- Schedule the next OR case.
- Decide where to admit the new ED patient.
- Discharge a patient.
- Document an assessment.
- Read a lab result.
- Track every patient on the floor for shift handoff.
- Brief the on-coming shift.

## Representative tables

### Patient list / census table
The defining clinical table. Each row a patient. Columns: room/bed, name, age, sex, attending, admit reason, length of stay, code status, isolation, alerts (allergy, fall risk), diet, vitals warning indicators. Row scale: 10–60 per unit. Refresh: live or short polling. Color heavily on alerts and on warning indicators. Sort by room or by admission. The home table for a nurse or hospitalist's shift.

### Patient flowsheet (vitals, I&O)
For one patient, vitals over time. Rows are vital types (HR, BP, SpO2, RR, temp, pain); columns are time points. Cells are values. Row scale: dozens of vital types; columns: dozens to hundreds of time points (q15min, qhour, qshift). Sticky first column, sticky time-row header. Color on out-of-range values. The most data-dense clinical table.

### Telemetry central station table
Each row a patient on monitored telemetry. Columns: bed, name, current rhythm, HR, alarm status, last 30s waveform sparkline. Row scale: 16–48 (one tech can monitor a unit's worth). Color heavily on alarm status. Refresh: live, sub-second. Audio alarms.

### Medication administration record (MAR)
Rows are scheduled medications; columns are time slots. Cells indicate scheduled / given / refused / missed. Row scale: dozens per patient. Color heavily. Editable in place when nurse documents administration. Each cell is a workflow event with timestamp, witness, etc.

### Active orders table
Each row an active order. Columns: time ordered, ordered by, type (med / lab / imaging / nursing), description, status, frequency, next due. Row scale: dozens per patient.

### Lab results table
Each row a lab test. Columns: test, result, unit, reference range, flag (H/L/HH/LL/critical), drawn time, resulted time. Row scale: dozens per patient encounter. Color heavily on flagged values. Often grouped by panel (CBC, BMP, etc.).

### Lab trend / cumulative results table
For one test type over time. Rows: test components; columns: time points. Same shape as flowsheet but for labs. Sticky first column.

### Imaging study list
Each row a study. Columns: date, modality, body part, status, ordering provider, findings, report status. Row scale: dozens per patient.

### Problem list
Each row an active or resolved problem (diagnosis). Columns: problem, ICD code, onset, status, resolved date, resolved by. Row scale: dozens per chronic patient.

### Allergy / intolerance table
Each row an allergy. Columns: substance, reaction, severity, onset, source. Row scale: handful. Critical to display prominently.

### Encounter / visit history
Each row a past encounter. Columns: date, type, location, provider, primary diagnosis, disposition. Row scale: dozens per patient.

### OR schedule / surgical day-of table
Each row a surgical case. Columns: room, scheduled time, surgeon, procedure, patient, status (waiting / pre-op / in OR / PACU / discharged), case time elapsed. Row scale: dozens per day per OR suite. Refresh: live.

### Pre-op / pre-admission table
Each row an upcoming surgery. Columns: date, patient, procedure, surgeon, anesthesia plan, clearance status, missing requirements. Row scale: dozens per week.

### Bed board / unit status table
Each row a bed. Columns: room/bed, status (clean / dirty / occupied / blocked / out of service), patient (if occupied), expected discharge time, isolation, special needs. Row scale: dozens per unit.

### ED tracking board
The ED's master table. Each row a patient. Columns: bed/chair, name, age, chief complaint, ESI triage level, time in dept, last vitals, attending, status (waiting / being seen / dispo pending / boarding), pending tasks. Row scale: dozens to hundreds in a busy ED. Color on triage level and on time-in-dept.

### Discharge planning / care progression table
Each row a patient. Columns: name, admit date, expected discharge, barriers to discharge, social work status, disposition (home / SNF / rehab / hospice). Row scale: dozens per unit.

### Code blue / rapid response log
Each row a code event. Columns: time, location, response team, outcome, leader, debrief status. Row scale: dozens per month.

### Infusion pump / IV table
Each row an active infusion. Columns: medication, rate, volume remaining, time remaining, pump status, line, patient. Row scale: dozens per ICU.

### Worklist tables (radiology, lab, pathology)
Each row a study or specimen awaiting work. Columns: case ID, patient, priority, received, age in queue, assigned to. Row scale: dozens to hundreds.

### Pharmacy queue
Each row a medication order awaiting verification or dispensing. Columns: order time, patient, medication, dose, route, frequency, prescriber, status. Row scale: dozens.

### Quality / event log
Each row a near-miss, fall, pressure injury, medication error. Columns: date, patient, event type, severity, contributing factors, action. Row scale: dozens.

### Throughput dashboard tables
Census by unit, ED wait times, OR utilization, length of stay by service. Roll-up tables for executives.

### Patient portal tables (patient-facing)
My appointments, my medications, my test results, my bills.

## Behaviors and needs

- **Live updates without losing place.** Vitals update continuously; nurses and physicians read while updates happen. Layout cannot shift.
- **Alarm and alert visibility.** Critical results, code status, allergy alerts must be unmistakable and accessible immediately.
- **Color by clinical significance.** High / low / critical / out-of-range. Standardized within an EHR but configurable per organization.
- **Inline charting.** Click a cell in MAR or flowsheet → enter the value → tab to next.
- **Sticky first column and sticky header.** Mandatory in flowsheets, MAR, lab trends.
- **Drill from row to chart / detail.** Click a patient row → full chart. Click a result → trend over time.
- **Time alignment across rows.** All vitals at 14:00 should line up vertically. Misalignment is a clinical safety issue.
- **Range and reference indicators.** Show what's normal alongside the value.
- **Per-row alerts and badges.** Allergy, isolation, code status, fall risk, sepsis screen positive. Often shown as small icons on the patient row.
- **Audit trail.** Every cell change logged with user, time, witness. Required for compliance and patient safety.
- **Print and PDF for records.** After-encounter summaries, hand-off reports.
- **Hand-off reporting.** End-of-shift, the table is the basis of the SBAR or I-PASS report. Often exported as a one-page sheet.
- **Mobile use** — physicians round with iPads or phones; nurses use COWs and increasingly tablets.
- **Bedside-friendly font sizes.** Some workflows happen at the bedside without dedicated reading distance.
- **High-contrast modes for low-light wards.** Night shift in NICUs and ICUs.
- **Multi-patient focus.** A nurse cares for 4–8 patients; a tech monitors 32. The table must balance density with per-row legibility.
- **Confidentiality and break-glass.** Some patient information is shielded (VIP, employee, abuse case). The table may render redacted unless break-glass is invoked.
- **Locale and language considerations** less than other domains but real for international and pediatric clinics.

## Frustrations

- A flowsheet that re-sorts when a new value is entered, throwing the nurse off.
- Color schemes that don't reflect organizational policy (red = bad in some places, hospitals have their own).
- A patient list that doesn't surface "needs immediate action" patients prominently.
- Slow charting — the nurse types a value and it takes 2 seconds to commit, breaking flow.
- Time stamps in the wrong time zone.
- Critical lab values that don't trigger any visual alert in the table.
- Alarm fatigue from too many low-priority alerts; clinicians stop noticing them.
- Hand-off reports that include irrelevant noise and bury the priority info.
- A bed board that doesn't show isolation status, leading to placement errors.
- A medication MAR that doesn't show drug-drug interactions inline.
- Telemetry tables where rhythm changes don't visually signal until alarm threshold is reached.
- Discharge planning tables that don't reflect upstream barriers (insurance not approved, no SNF bed available).
- ED tracking boards that don't show how long since last vitals.
- A code-blue row that disappears after the code without preserving data for the debrief.

## Domain-specific notes

- **Patient safety drives every decision.** The table must not contribute to errors. Misalignment, mis-attribution, mis-timing are not aesthetic flaws — they are clinical risks.
- **The flowsheet is the canonical clinical table.** It is the densest, most-read table in healthcare, and many other tables (vitals, I&O, MAR, lab cumulative) share its shape.
- **Sticky first column and sticky header are mandatory.** Flowsheets are unreadable without them.
- **Color is operational and standardized.** H/L/critical flags follow lab medicine conventions. Triage colors follow ESI / SALT. Code status colors are organizationally defined. The component cannot prescribe.
- **Standardized forms.** Hand-off reports (I-PASS, SBAR), pre-op checklists, discharge summaries are largely tabular. The component should produce these reliably.
- **Audit trail is mandatory.** HIPAA and clinical practice both require cell-level change logs.
- **24/7 operation.** Tables run continuously; rendering must remain stable for weeks.
- **Multi-monitor and multi-form-factor.** Same data appears on a 24" workstation, a COW, an iPad, a phone, a wall-mounted patient list. Render quality must hold across all.
- **Telemetry tables include waveform sparklines.** A small ECG strip per row is standard. The intersection of "table" and "small chart" is real here.
- **Many tables are also forms.** Charting happens by editing table cells. The table is workflow.
- **Privacy is operational.** Break-glass access, VIP shielding, minimum-necessary disclosure all influence what cells are visible.
- **Speed of reading is a clinical skill.** Experienced nurses and physicians scan a flowsheet in seconds. The table must support that scanning — alignment, color, white space, no surprises.
- **Aesthetics historically poor.** Clinical software is universally mocked for ugliness. A clean, modern table is meaningful uplift but must not sacrifice density.
- **Compliance with regulatory standards** (FDA, HIPAA, HITECH, Joint Commission) shapes some rendering decisions. The component is agnostic but consumers may need to render in compliant ways.
- **The patient row carries identity.** Name, MRN, DOB, room. Misidentification is a sentinel event.
