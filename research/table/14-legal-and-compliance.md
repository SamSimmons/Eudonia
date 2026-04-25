# Legal and compliance

A document-centric and dispute-centric domain. Reference tools: Clio, MyCase, PracticePanther, Smokeball, NetDocuments, iManage, Relativity (eDiscovery), Everlaw, Logikcull, DISCO, Ironclad (CLM), DocuSign CLM, ContractWorks, Westlaw / LexisNexis legal research, courthouse case management systems (CourtListener, PACER, state-specific systems), GRC platforms (OneTrust, Vanta, Drata, AuditBoard).

## Who is at the screen

- **Litigation associates and paralegals** doing document review at scale. The eDiscovery review platform is essentially one massive table.
- **Transactional attorneys** managing matters, contracts, deadlines.
- **General counsel teams** overseeing the legal department's matter portfolio.
- **Compliance officers** tracking obligations, controls, evidence.
- **Privacy professionals** managing data subject access requests, vendor inventories, processing activities.
- **Court clerks** managing docket entries.
- **Judges and clerks** reviewing case lists.
- **Pro se litigants** looking at court calendars.
- **Audit and risk professionals** running tests and tracking findings.
- **Information governance** managing records retention.

## Jobs to be done

- Review thousands of documents for relevance and privilege.
- Find the contract clause that controls the dispute.
- Track every deadline in every matter.
- Roll up legal department spend.
- Prove a control was in place during an audit.
- File a motion or pleading.
- Look up case law citations.
- Respond to a regulator's request.
- Manage a contract lifecycle from drafting through renewal.
- Decide whether to settle or proceed.

## Representative tables

### Document review table (eDiscovery)
The defining legal table. Each row a document in the discovery set. Columns: doc ID, custodian, source, date, sender/from, recipients/to, subject, file type, page count, hash, review status, tags, privilege, responsiveness. Row scale: thousands to millions. Reviewer keys through documents, tagging each. Extreme keyboard-driven. Filter, search, and bulk-tag are essential.

### Privilege / privilege log table
Each row a withheld document. Columns: doc ID, date, from, to, subject, basis (attorney-client / work product), description, claimed by. Row scale: hundreds to thousands. Often produced as a formal artifact for opposing counsel.

### Production log
Documents produced to opposing counsel. Each row a document. Columns: production # (Bates range), original ID, produced date, production volume. Row scale: thousands.

### Matter list
Each row an active matter. Columns: matter name, client, type, lead attorney, opened, last activity, status, billable hours, fees to date. Row scale: dozens to hundreds per attorney, thousands per firm.

### Docket / case calendar
Each row an upcoming deadline or hearing. Columns: date, matter, event type, court, judge, time, who's appearing. Row scale: dozens per attorney per month. Sort by date ascending. Color heavily as deadlines approach.

### Court docket / case file
For court systems. Each row a docket entry. Columns: date, doc type (motion, order, response), filed by, description, link. Row scale: dozens to hundreds per case. Append-only, chronological.

### Time entry / billing table
Each row a billable time entry. Columns: date, attorney, matter, description, hours, rate, billed, status. Row scale: thousands per month. Editable. Footer: total hours, total billed.

### Invoice table
Each row an invoice. Columns: invoice #, client, matter, period, amount, status, sent date, paid date. Row scale: dozens per month.

### Contract repository
Each row a contract. Columns: title, counterparty, type, status, effective date, expiry, value, owner, renewal date, governing law. Row scale: hundreds to tens of thousands. Filter by status, by counterparty, by expiry. Color on expiring soon.

### Contract clause table
Each row a clause type within a contract or across contracts. Columns: clause type, language, deviation from standard, risk rating. Used in clause-library tools and in negotiation analytics.

### Approval / workflow queue
Contract or matter approvals pending. Each row an approval. Columns: item, requested by, approver, requested date, status, days waiting. Row scale: dozens.

### Risk register
Each row a risk. Columns: ID, description, category, likelihood, impact, score, owner, mitigation, status, last reviewed. Row scale: dozens to hundreds.

### Compliance control table
Each row a control. Columns: control ID, framework (SOC2, ISO, GDPR), description, owner, last tested, status, evidence count. Row scale: hundreds. Hierarchical (framework > control family > control). Color on test status.

### Audit finding table
Each row an audit finding. Columns: finding, framework, severity, raised, owner, due, status, remediation. Row scale: dozens per audit.

### DSAR / privacy request queue
Each row a data subject access request (or deletion, or portability). Columns: requester, type, received, due (regulatory deadline), status, owner. Row scale: dozens to hundreds.

### Vendor / processor inventory
For privacy and security teams. Each row a vendor. Columns: name, data shared, processing purpose, contract status, DPA signed, security review, risk rating. Row scale: dozens to hundreds.

### Records retention schedule
Each row a record category. Columns: category, retention period, legal basis, location, owner. Row scale: dozens.

### Litigation hold / preservation table
Each row a custodian under hold. Columns: custodian, matter, hold issued, acknowledged, status. Row scale: dozens.

### Case law search results
Each row a case. Columns: citation, title, court, date, headnote, relevance, cited by count. Row scale: dozens per query. Drill to opinion.

### Witness / deponent table
Each row a witness. Columns: name, role, deposition date, transcript, summary, exhibits referenced. Row scale: dozens per case.

### Exhibit list
Each row an exhibit for trial. Columns: exhibit #, description, sponsor witness, status (admitted / pending / rejected), date offered. Row scale: dozens to hundreds per trial.

## Behaviors and needs

- **Heavy keyboard navigation in document review.** Reviewers move through thousands of docs per day. j/k to navigate, 1-9 for tags, hotkeys for everything. The mouse is too slow.
- **Bulk tagging.** Select 100 documents, tag all "responsive." Or apply same code to a range.
- **Saved searches and saved views.** "All emails from custodian X in date range Y mentioning term Z." Reused constantly.
- **Rich filtering.** Multi-attribute, full-text, metadata-aware. Often via a query language.
- **Highlighting / annotation per row.** Comments per document. Reviewer notes.
- **Production-ready output.** Some tables (privilege log, exhibit list, billing) are formal deliverables. The component must produce paginated, signed, dated artifacts.
- **Color carefully.** Privilege colors, responsiveness colors, deadline urgency colors. Many overlapping color systems.
- **Drill to original document.** Universal. The row references; the document opens.
- **Threading and family.** Email threads grouped, attachments shown with parent emails.
- **Status / workflow transitions.** Almost every row has a state machine. Mark reviewed, mark for QC, mark privileged, etc.
- **Audit trail.** Who changed what, when. Required for chain of custody.
- **Time entry from the row.** "I worked on this matter for 1.5 hours" entered from the matter list.
- **Renewal alerts.** Contracts and certifications need countdown columns.
- **Court-form-aware printing.** Pleadings, exhibit lists must match court rules (font, margins, headers).
- **Per-cell sensitivity / redaction.** Some cell content is privileged or PII. Render-time redaction.

## Frustrations

- A document review table that loses the user's place when a search refilters.
- Tagging that doesn't immediately reflect in the row indicator, leaving the reviewer uncertain whether their action took.
- A contract repository that doesn't surface the clause text without opening the document.
- Privilege logs that don't enforce the format required by the court.
- Time entry that requires opening a separate window per entry.
- A docket calendar that doesn't account for jurisdiction-specific holiday rules in deadline calculation.
- Compliance evidence that goes stale without a freshness indicator.
- DSAR queues that don't show the regulatory deadline prominently (GDPR's 30 days is unforgiving).
- A search that returns 10,000 results with no way to refine without restarting.
- An exhibit table that auto-renumbers when a row is deleted, breaking trial references.
- Vendor inventories that don't link to the actual DPA on file.
- Audit findings without remediation owners, leaving them orphaned.

## Domain-specific notes

- **Volume in eDiscovery is uniquely huge.** A document review table backs millions of documents. The visible table is always a query result; pagination and virtualization are non-negotiable.
- **Keyboard-first design.** Document review platforms have devoted users who can review hundreds of documents per hour purely on keyboard. The component must not stand in their way.
- **Formal artifacts.** Privilege logs, exhibit lists, certifications, audit reports are produced from tables and have legal weight. The output must be precise, paginated, and unalterable.
- **Privilege and confidentiality are operational concerns.** Some columns or rows must be hidden or redacted depending on viewer. The component renders whatever it gets but consumers will need to render redactions cleanly.
- **Deadlines are non-negotiable.** Statute of limitations, court deadlines, regulatory windows. Date columns drive workflow and the table needs to make them legible at a glance.
- **Versions and revisions.** Contracts especially. The table often shows versions / amendments per contract; sometimes nested.
- **Hierarchy in compliance frameworks.** SOC2 → trust services criteria → individual controls. Tree-aware tables.
- **Court rules differ by jurisdiction.** A pleading table for federal court has different format requirements from California state court. Consumers must be able to render different formats.
- **Audit trails are sacred.** Every cell change should be loggable. The component doesn't enforce but must not interfere with consumer instrumentation.
- **The cost of being wrong is high.** A missed deadline can lose a case; a leaked privileged document can be sanctionable. Trust matters more than features.
- **Tables are often the entire workflow.** Document review, contract lifecycle, compliance certification — the table is the application.
- **Aesthetics historically poor.** Legal software is famously ugly; modern tools (Ironclad, Everlaw, Vanta) compete on usability. A clean table component is meaningful uplift.
