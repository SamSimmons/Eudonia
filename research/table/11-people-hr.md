# People analytics and HR

The world of headcount, hiring, performance, compensation, attrition, and workforce reporting. Reference tools: Workday, BambooHR, Rippling, Gusto, Lattice, 15Five, Greenhouse, Lever, Ashby, Pave, Carta, Visier, Culture Amp, ChartHop, HiBob.

## Who is at the screen

- **HR business partners** managing populations of employees, running periodic reviews. The "my org" table is their daily home.
- **Recruiters** working candidate pipelines. Heavy table users; the candidate list is the workspace.
- **Hiring managers** reviewing candidates passed by recruiters. Less frequent, focused on a small slate.
- **People analytics teams** building dashboards for leadership. Designers and consumers of the reporting tables.
- **Compensation analysts** running comp planning cycles. Spreadsheet-equivalent tables for editing pay decisions.
- **Managers** doing performance reviews, calibration, headcount planning.
- **Executives** consuming weekly/monthly people dashboards (headcount, hiring, attrition).
- **Employees themselves** looking at directory, org chart, time-off calendar.
- **Payroll / finance** reconciling pay runs.

## Jobs to be done

- Find an employee.
- See where in the funnel each candidate is.
- Make a hire decision and move the candidate to offer.
- Run a comp planning cycle (decide raises and bonuses for a team).
- Calibrate performance ratings across a team.
- Spot attrition risk before someone leaves.
- Approve time off, expenses, promotions.
- Plan next quarter's hiring.
- Build a diversity / equity report.
- Roll up payroll.

## Representative tables

### Employee directory
Each row an employee. Columns: photo, name, title, department, location, manager, start date, employment type, work email. Row scale: tens to hundreds of thousands. Searchable by name. Filter by department, location. The "look up a colleague" tool.

### Org / team table
Each row an employee on a team. Columns: photo, name, title, level, tenure, manager, direct reports count, last 1:1. Row scale: handful to a few hundred. Used by managers and HRBPs. Often presented as an org chart view as well.

### Headcount report table
Aggregated. Each row a department, function, or location. Columns: current headcount, new hires (period), terminations (period), net change, open requisitions, plan, variance to plan. Row scale: tens. Footer total. Hierarchical with subtotals.

### Candidate pipeline table (recruiting)
Each row a candidate. Columns: name, role applied, stage, recruiter, hiring manager, source, applied date, last activity, scorecards completed, status. Row scale: dozens to thousands per role across all roles. Sort by stage and by activity. Bulk move stage. Filter by role, by stage. Color on stage age (stuck candidates).

### Pipeline funnel by role
Each row a stage. Columns: candidates in stage, conversion rate from prior, time in stage, drop reasons. Row scale: 5–10 per role.

### Open requisitions table
Each row an open req. Columns: title, team, hiring manager, recruiter, opened date, days open, candidates in pipeline, status, target start. Row scale: dozens to hundreds.

### Interview schedule table
Each row a scheduled interview. Columns: time, candidate, role, interviewer, panel, scorecard due. Row scale: dozens per day for a busy team.

### Performance review table
For calibration. Each row an employee. Columns: name, level, manager, manager rating, calibrated rating, perf history, peer ratings. Row scale: dozens to hundreds. Editable in place during calibration sessions.

### Comp planning table
The comp cycle workspace. Each row an employee. Columns: name, current salary, market band (min, mid, max), recommended raise, recommended bonus, new salary, new total, % over plan, manager justification. Row scale: dozens to hundreds per manager. Heavy in-place editing. Footer with budget remaining. The most spreadsheet-like table in HR.

### Equity / cap table
Each row an employee or grant. Columns: name, grant date, type, shares, strike, vesting schedule, vested, unvested. Row scale: hundreds to thousands.

### Pay run / payroll table
Each row an employee for one pay period. Columns: name, hours, gross, taxes, deductions, net, status. Row scale: hundreds to tens of thousands per pay run.

### Time-off / absence table
Each row a time-off request or accrual. Columns: employee, type, dates, days, status, balance remaining. Row scale: dozens per week.

### Time tracking table
Each row a timesheet entry or weekly summary. Columns: employee, week, hours by project, total, status. Row scale: hundreds per week.

### Goals / OKR table
Each row an OKR or goal. Columns: title, owner, status, progress, target date, parent objective. Row scale: dozens per team. Hierarchical with parent/child expansion.

### 1:1 / feedback table
Each row a touch point. Columns: date, manager, report, topics, action items. Row scale: dozens per relationship.

### Survey response table
Engagement survey raw responses. Each row a respondent (anonymized). Columns: response date, demographics (department/level/tenure-bucket), question scores. Row scale: hundreds to thousands.

### Attrition / turnover report
Each row a department, function, or cohort. Columns: starting headcount, terminations (voluntary, involuntary), turnover rate, regretted attrition rate, top reasons. Row scale: tens. Footer.

### Diversity / DEI report
Each row a demographic dimension or intersection. Columns: count, % of workforce, hiring %, promotion %, attrition %, comparison to industry. Row scale: tens. Often presented with extreme care around how cells are presented (suppressing low-count cells for privacy).

### Learning / training table
Each row a course or assignment. Columns: course, employees assigned, completion rate, avg score, due date. Row scale: dozens to hundreds.

### Compliance / certifications table
Each row an employee × certification. Columns: employee, cert, status, expires, days to expiry, last training. Row scale: hundreds. Color on expiring.

### Expense / reimbursement table
Each row an expense. Columns: date, employee, category, amount, status, manager, receipt. Row scale: dozens to thousands per month.

## Behaviors and needs

- **Photos / avatars.** Universal. Identity recognition matters.
- **Name + title + manager** is the identity unit, not just name.
- **Hierarchical / org-aware grouping.** Roll up by team, by manager, by department, by location. Subtotals at each level.
- **Inline edit, especially for comp planning and calibration.** Tab between cells; commit; see budget impact.
- **Stage transitions in candidate pipelines.** Drag, dropdown, or button to advance.
- **Saved views.** "My team," "My direct reports," "My recruiting pipeline." Often shared across team.
- **Privacy-aware rendering.** Suppress demographic cells with low counts. Hide compensation from peers.
- **Time-aware columns.** "Days in stage," "Days until expiry," "Days since last 1:1." Color as the number gets concerning.
- **Filter by org structure.** "Show me everyone reporting up through this VP." Tree-aware filter.
- **Action menus per row.** Promote, terminate, change manager, add note. High-stakes; usually behind confirmation.
- **Bulk import / export.** Comp cycles, benefits enrollments, mass updates.
- **History and audit.** Who changed what compensation, what rating, what title, when. Often visible inline as expanded row.
- **Restricted visibility.** A manager sees their org; HR sees more; an employee sees only themselves. The table renders whatever it gets but the context matters.
- **Tags and labels.** "Top performer," "Hi-po," "Critical role," "Remote." Free-form tagging is common.
- **Mobile lookups.** Directory and org chart usage on mobile is common.
- **Print / PDF for offer packets, comp letters, review summaries.** The table is often the data behind a generated document.
- **Calendar awareness.** Time-off balances, anniversary dates, review cycle deadlines all carry calendar weight.

## Frustrations

- A directory that doesn't update when someone changes manager, leaving stale reporting lines for weeks.
- Comp planning tables that don't show the running budget impact as the user edits.
- Calibration sessions where rating changes don't immediately re-render the histogram of ratings across the team.
- A pipeline table where the candidate's last activity is from a third-party tool and not updated in the dashboard.
- Privacy mistakes — showing a comp number or demographic to someone who shouldn't see it.
- Demographic cells that show counts of "1" or "2" violating privacy thresholds.
- Org tables that don't handle dotted-line reporting.
- Headcount reports that double-count contractors or part-time as 1.0 FTE.
- A "request time off" flow that requires opening a separate page instead of acting from the row.
- Missing "as-of date" — looking at a headcount table without knowing whether it's today or last month.
- Tables that don't handle accented characters in names cleanly.
- A "manager" column showing email instead of name.
- Photos that don't load and are replaced with broken-image icons that destroy the design.

## Domain-specific notes

- **People are the rows.** Photos, names, titles, identity carry visual weight unlike anywhere else.
- **Privacy and suppression rules** are critical. Demographic cells must collapse below a threshold to protect individuals. The component doesn't enforce but consumers must be able to render "—" or "<5" cells trivially.
- **Hierarchical data is the norm.** Org structure, reporting chain, department > team > individual. Tree-aware tables matter.
- **Comp planning is uniquely spreadsheet-like.** It is one of the few HR contexts where a heavy in-place edit + recalculation experience is the norm.
- **Calendar / date intelligence.** Tenure, days-since, days-until are everywhere. Often colored by recency or proximity.
- **Tables are sensitive artifacts.** Screenshots get shared widely. Compensation cells leaking is a real harm. The table component should render cleanly when cells are intentionally redacted.
- **Cross-tool data.** The directory pulls from HRIS, the pipeline from ATS, comp from a comp tool. Tables often join across systems and may have inconsistent freshness.
- **Reports for legal / compliance** (EEOC, pay equity, OSHA logs) are tabular and must produce printable, signed artifacts.
- **The audience is mixed-technical.** A people analyst lives in the data; a hiring manager touches it monthly; an executive once a quarter. Tables need different defaults for each.
- **Photos are not optional in modern HR tools.** A directory without faces feels broken.
- **Locale and i18n.** Names with non-Latin characters, currency in many denominations for global pay, date formats. Tables need to handle without breaking.
