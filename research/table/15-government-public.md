# Government and public sector

Tables for civic operations: case management, permit processing, voter rolls, regulatory filings, benefits administration, court systems, public records, public dashboards. Reference tools and surfaces: state and local case management systems (Tyler Technologies, Granicus), benefits enrollment systems, USAJOBS / state HR portals, IRS / tax systems, FCC / SEC / FDA / EPA filing systems, election management software, public open-data portals (data.gov, city / state portals), 311 / constituent services systems, Code for America projects, Salesforce Public Sector, ServiceNow GovCloud.

## Who is at the screen

- **Caseworkers** (benefits, child welfare, parole, housing) managing caseloads. Each caseworker has tens to hundreds of cases.
- **Permit / license clerks** processing applications.
- **Code enforcement officers** working from a queue of complaints and inspections.
- **Tax assessors and auditors** working through filings and appeals.
- **Social workers / probation officers** with hybrid office and field roles.
- **Court clerks** managing dockets, filings.
- **311 / constituent service operators** taking calls and routing requests.
- **Election administrators** managing voter rolls, ballots, results.
- **Inspectors** (food, building, labor) doing field inspections from tablets.
- **Data analysts and policy staff** producing reports for elected officials.
- **The public** consuming open data tables, looking up records, applying for services.
- **Executives and elected officials** consuming summary dashboards.

Settings span office desks, mobile devices for field staff, and public web for constituents.

## Jobs to be done

- Process today's queue of cases / applications / requests.
- Find a specific record (person, property, business, case).
- Verify eligibility for a benefit.
- Document a field inspection.
- Issue a permit, ticket, license, or notice.
- Roll up program statistics for a report to elected officials.
- Respond to a public records request (FOIA / state equivalents).
- Track regulatory compliance.
- Audit suspicious filings.
- Certify election results.

## Representative tables

### Case / caseload table
Each row a case (a child welfare case, a public benefits case, a probation case). Columns: case ID, client name, case type, opened, status, caseworker, last contact, next action due, risk level. Row scale: tens to hundreds per worker. Workflow-driven; sort by next-action-due. Privacy-sensitive.

### Application / permit queue
Each row an application. Columns: app #, applicant, type, submitted, status, assigned reviewer, days in queue, fee paid. Row scale: dozens to hundreds. Workflow-driven, multi-stage approval.

### Inspection table
Each row a scheduled or completed inspection. Columns: address, type, scheduled date, inspector, result, violations count, follow-up due. Row scale: dozens per inspector per week. Drill to inspection report (often photo-rich).

### Violation / citation table
Each row a violation. Columns: citation #, address, business, code section, date, status, fine, hearing date. Row scale: hundreds.

### Tax filing table
For revenue agencies. Each row a filing. Columns: taxpayer ID, period, type, received, status (received / under review / accepted / audited), amount due, paid. Row scale: thousands to millions.

### Property / parcel table
For assessors and planning. Each row a parcel. Columns: parcel #, address, owner, land use, sq ft, assessed value, last sale, last sale price. Row scale: hundreds of thousands per jurisdiction. Sortable, searchable, often paired with a map.

### Voter roll table
Each row a registered voter. Columns: name, address, precinct, registration date, party, status, last vote date. Row scale: hundreds of thousands to millions per state. Search by name or address.

### Election results table
Each row a contest × candidate, or a precinct × contest. Columns: precinct, contest, candidate, votes, % of total, margin. Row scale: thousands. Updated live on election night. Footer subtotals at contest level.

### Court docket (public-facing)
Each row a case in the public court directory. Columns: case #, parties, type, filed, status, next hearing, judge. Row scale: thousands to millions. Search by name or case #.

### Constituent service / 311 request queue
Each row a complaint or request. Columns: ticket #, type, address, opened, status, assigned department, age. Row scale: hundreds to thousands per day in a city. Filter by department, by neighborhood. Often paired with a map.

### Permit history for an address
Each row a permit issued at one address. Columns: permit #, date, type, contractor, status, value. Row scale: dozens per address.

### Benefits eligibility table
For a single applicant. Each row a benefit program × eligibility check. Columns: program, status (eligible / ineligible / pending), reason, effective date. Row scale: dozens.

### Open data portal table (public)
A public dataset rendered as a table. Columns vary completely by dataset. Row scale: thousands to millions. Filter, sort, search; download as CSV.

### Regulatory filing table
Each row a filing (a securities filing, a campaign finance disclosure, a lobbying registration). Columns: filer, type, period, filed date, status, link to filing. Row scale: hundreds to millions.

### Audit trail table
Each row an action taken in a government system. Columns: time, user, action, target, result. Row scale: thousands per day. Required for accountability.

### Procurement / contract table
Each row a government contract. Columns: contract #, vendor, agency, value, awarded, expires, scope, RFP link. Row scale: hundreds to thousands.

### Grant table
Each row a grant award or application. Columns: program, grantee, amount, term, status, performance milestones. Row scale: hundreds.

### Hearing / docket / agenda table
Each row an agenda item for a meeting. Columns: time, item, type, presenter, document. Row scale: dozens per meeting.

### Citation / parking ticket table
For municipal courts. Each row a ticket. Columns: ticket #, plate, date, location, violation, status, fine, paid date. Row scale: thousands per day in a city.

### Reporting tables for legislative bodies
Statistical summaries for council reports. Roll-ups, demographic breakdowns, trend tables.

## Behaviors and needs

- **Saved queries.** "My open cases," "overdue inspections in district 4," "delinquent tax filings." Universal.
- **Print and PDF.** Notices, citations, eligibility determinations, official letters are mailed paper. Print-faithful tables matter.
- **Public-facing read tables.** When the same data is shown to staff and to the public, the public version is read-only, search-friendly, accessible, mobile-friendly.
- **Accessibility (WCAG / Section 508).** Government software has stricter accessibility requirements than most domains. Color contrast, keyboard navigation, screen-reader support are not optional.
- **Bilingual / multilingual support.** Many public-facing tables must render in multiple languages.
- **Map linkage.** Address-keyed tables are constantly paired with maps. Click row → map zooms; click map → table filters.
- **Address normalization in display.** "123 Main St" vs "123 MAIN STREET" — consistency matters.
- **Mobile for field staff.** Inspectors, social workers, code enforcement use tablets and phones in the field.
- **Workflow status transitions** with audit trail.
- **Eligibility logic surfacing.** "Why is this person flagged ineligible?" requires inline explanation, not just a status pill.
- **Bulk actions for queue work.** Approve, reject, reassign multiple at once.
- **Per-row attachments.** Documents, photos, signed forms.
- **Strong security and audit posture.** Every cell access may be logged in some systems.
- **Long retention.** Records kept for years; tables must look right with very old data and very recent data simultaneously.
- **Equitable rendering.** Tables that show case outcomes by demographic group must avoid presentations that obscure or sensationalize.

## Frustrations

- Public open-data tables that download a CSV but can't be sorted or filtered in the browser.
- A search that requires exact match on a name with no fuzzy fallback (and citizens have to spell their own name three ways).
- Mobile inspection forms that lose data when connectivity drops.
- A case management table that doesn't surface what action is due next, leaving caseworkers to scan dozens of fields.
- Permit queue tables that don't account for statutory time limits (some permit applications are auto-approved if not denied within N days).
- Voter rolls with stale addresses leading to mailing waste and confusion.
- A 311 system that doesn't deduplicate the same pothole reported by 50 callers.
- Court dockets that are technically public but unsearchable.
- Tax filings that have no payment status surfaced.
- Election night tables that update in surges and reorder confusingly.
- Tables that don't render in screen readers, blocking blind constituents.
- Print forms that don't match jurisdictional requirements (font, margin, header), invalidating the document.

## Domain-specific notes

- **Accessibility is a legal requirement, not an aspiration.** US government sites are bound by Section 508; many states and municipalities have stricter requirements. The table component must be accessible by default.
- **Slow procurement, long-lived software.** Government systems run for decades. Tables should render in old browsers, with screen readers from many vintages, in printed form.
- **Localization is mandatory.** Many jurisdictions require Spanish, Mandarin, or other language support.
- **Privacy and FOIA simultaneously.** Some data is required to be public; some is required to be hidden. The same row's columns may have different visibility rules. Consumer-driven redaction is the model.
- **Trust is uniquely fragile.** Errors in government tables become news stories (election results, tax errors, benefits eligibility). Reliability beats features.
- **Print is universal.** Notices, eligibility letters, citations, hearing notices. Tables are the data behind printed artifacts.
- **Mobile for field staff is real** but the network is unreliable. Offline-capable rendering is necessary.
- **Map-table coordination** is more common in this domain than almost any other. Addresses and parcels are first-class entities.
- **Workflow and queue patterns dominate.** The table is the inbox.
- **Audit trails are required by law in many contexts.** Cell-level change history.
- **Long-form names, addresses, descriptions.** Tables need to handle long text without breaking the row rhythm.
- **Many users are non-technical.** Caseworkers, citizens, elected officials. The component should not require sophistication to use.
- **Open data portals are public storefronts** for the dataset. They need to be welcoming to journalists, researchers, and curious citizens — not just analysts.
