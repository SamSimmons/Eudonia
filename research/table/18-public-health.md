# Public health surveillance

Distinct from clinical care — the population-level rather than individual-level view. Reference systems: CDC NEDSS / state-level disease surveillance, REDCap, electronic case reporting (eCR), syndromic surveillance dashboards (BioSense / NSSP), Tableau-based public dashboards, COVID-era state and JHU dashboards, vital records systems, immunization registries (IIS), STD / TB / HIV registries, vector-borne disease tracking.

## Who is at the screen

- **Public health nurses and case investigators** working contact tracing, case follow-up.
- **Epidemiologists** building outbreak investigations, analyzing trends.
- **Disease surveillance staff** at state and local health departments monitoring for clusters.
- **Public information officers** preparing public-facing dashboards.
- **Policy staff and health officials** making intervention decisions.
- **Healthcare providers** submitting case reports.
- **The general public** consuming public dashboards (esp. during outbreaks).
- **Researchers** analyzing surveillance data.
- **Federal coordinators (CDC, WHO)** rolling up across jurisdictions.

## Jobs to be done

- Detect a cluster or outbreak early.
- Investigate a confirmed case (interview, contact trace, exposure history).
- Track contacts under monitoring.
- Decide whether to issue a public health alert.
- Brief decision-makers.
- Publish a public dashboard.
- Submit required reports to CDC / WHO.
- Allocate vaccines or interventions.
- Communicate with the public during a crisis.
- Compare jurisdictions or time periods.

## Representative tables

### Case investigation table
Each row a confirmed or suspected case. Columns: case ID, name (often pseudonymized), age, sex, county, condition, status (under investigation / confirmed / closed), reporting source, date of symptom onset, assigned investigator. Row scale: dozens to thousands. Workflow-driven. Privacy-sensitive.

### Contact tracing table
Each row a contact of a known case. Columns: contact ID, exposure date, exposure source, status (notified / under monitoring / symptomatic / lost to follow-up), days remaining in monitoring, last symptom check. Row scale: dozens to thousands per case investigator. Color on monitoring status and days remaining.

### Line list (epi)
The defining outbreak investigation table. Each row a case. Columns: ID, demographics, date of onset, date of report, exposure data, lab results, hospitalization, outcome. Row scale: dozens to hundreds during an outbreak. Used for hypothesis generation. Often built in Excel by epis.

### Daily case report / surveillance dashboard table
Each row a jurisdiction (county, state, country). Columns: new cases, cumulative, deaths, hospitalizations, test positivity, vaccination rate, test count, change vs prior period. Row scale: dozens to hundreds. Footer total. Public-facing variants are heavily designed.

### Outbreak / cluster table
Each row an active outbreak. Columns: outbreak ID, location, pathogen, cases, status, started, lead investigator. Row scale: dozens.

### Lab specimen / result table
Each row a specimen. Columns: specimen ID, patient ID, test, collected, received, resulted, result, lab. Row scale: thousands. Workflow-driven.

### Genomic surveillance table
Each row a sequenced sample. Columns: sample ID, lineage / variant, collection date, location, source. Row scale: thousands.

### Immunization registry table
Each row a vaccination record. Columns: patient, vaccine, lot, manufacturer, date, dose number, provider, location. Row scale: millions. Lookup by patient is the daily use.

### Vaccine inventory table
Each row a vaccine lot at a provider. Columns: provider, vaccine, lot, expiration, on hand, ordered, allocated. Row scale: hundreds to thousands.

### Reportable conditions inbox
Each row an incoming case report from a provider or lab. Columns: source, condition, patient, received, status (under review / accepted / rejected). Row scale: dozens to hundreds per day.

### Mortality / vital records table
Each row a death certificate. Columns: decedent, date of death, location, cause, contributing causes, certifier. Row scale: thousands. Used for mortality surveillance.

### Birth records table
Each row a birth. Columns: child, date, location, mother, father, weight, gestational age. Row scale: thousands.

### Foodborne illness investigation table
Each row a case in an outbreak. Columns: ID, age, onset, foods consumed (Y/N for each), restaurant, lab status. Row scale: dozens to hundreds. The "shotgun questionnaire" is its own table form.

### Vector / animal surveillance table
Each row a trapping location or sample. Columns: location, date, vector type (mosquito, tick), pool size, pathogen tested, result. Row scale: hundreds per season.

### Wastewater surveillance table
Each row a sampling event. Columns: site, date, pathogen, result (concentration), trend. Row scale: hundreds per week.

### Outbreak timeline / epi curve as table
Each row a date or epi week. Columns: cases by exposure type or by symptom-onset date. Often paired with a chart.

### Demographic breakdown table
Cases stratified by age, sex, race/ethnicity, geography, occupation. Roll-up rows. Often the politically sensitive part of a public report.

### Travel / quarantine table
For border health. Each row a traveler under quarantine. Columns: passport ID, country of origin, arrival date, quarantine end, location, status. Row scale: dozens to thousands.

### Public dashboard tables (public-facing)
Highly designed, simple, accessible. Counts by jurisdiction, vaccinated %, hospital census, test positivity. Frequently mobile-viewed.

### Federal / international reporting tables
WHO, CDC, ECDC, Pan American Health Organization formats. Strict layouts.

## Behaviors and needs

- **Privacy and small-cell suppression.** Cells with low counts (typically < 5 or < 10) must be suppressed to prevent re-identification of individuals. The component should render `*` or `<5` cleanly.
- **Hierarchical roll-up.** Country > state > county > zip. Subtotals at each level.
- **Time-series-as-columns.** Daily / weekly counts running across columns.
- **Color heatmap.** Case rates, positivity, vaccination coverage all benefit from heatmap presentation.
- **Map linkage.** Public health is geography-bound; tables and choropleth maps are constantly paired.
- **Public-facing accessibility.** During outbreaks, the dashboard is consumed by millions. WCAG compliance is mandatory; mobile-first rendering is essential.
- **Stable over months.** A surveillance dashboard runs for years. The table must look right with both empty and dense states.
- **Update cadence is variable.** Some jurisdictions report daily, some weekly, some sporadically. The table must not present sparse data as broken.
- **Lag and revision.** Today's count for last week is different from yesterday's count for last week, because reports trickle in. Tables must show current values without misleading.
- **Comparison to baseline.** "Above expected for this week" requires a baseline column or band.
- **Per-condition workflows.** Some conditions have legally mandated investigation timelines. Tables surface the deadline.
- **Bilingual / multilingual** for public-facing tables.
- **Print and PDF** for federal reports and weekly surveillance summaries (MMWR, state equivalents).
- **Search by case ID, by patient identifier (with auth), by location.**
- **Bulk update** when a batch of cases needs status change.
- **Annotation.** Mark a row "outlier — exclude from analysis."
- **Export to statistical software.** SAS, R, Stata, Python. CSV with strict column naming.

## Frustrations

- A table that aggregates without indicating the reporting lag, leading public officials to draw wrong conclusions.
- Cells with low counts not suppressed, exposing individuals.
- Demographic breakdowns that conflate race and ethnicity inconsistently.
- Maps and tables that show different counts because of different aggregation logic.
- A weekly dashboard that misleadingly extends partial-week data into a full bar.
- Tables that don't handle the ICD-10 vs ICD-9 transition cleanly across historical data.
- Inconsistent geographic boundaries across years.
- A vaccination table that doesn't distinguish "fully vaccinated" from "any dose received" vs "boosted."
- Mobile public dashboards that show only one column at a time, hiding the comparison.
- A line list with PII not properly redacted being shared accidentally.
- An outbreak table that doesn't show the curve alongside the totals.
- Real-time updates that confuse the public when the number "drops" because of data corrections.
- A foodborne illness questionnaire table where the food columns are in arbitrary order, making it hard to spot the common exposure.

## Domain-specific notes

- **Privacy is operational.** Population-level surveillance must not enable individual identification. Small-cell suppression, geographic aggregation, demographic collapsing are routine. The component renders what it gets but consumers will need flexibility.
- **Public-facing variants** of internal tables are a common pattern. Same data, different presentation, much higher accessibility bar.
- **Crisis-time scaling.** During outbreaks (COVID, mpox, ebola), public dashboards see millions of views. The component must be performant and printable on phones.
- **Data freshness varies wildly.** Some streams are real-time; some are weekly; some are quarterly. The table should make freshness explicit.
- **Revision is normal.** Yesterday's count for last week changes as more reports arrive. Tables should accommodate this without alarming the reader.
- **Standardized reporting formats.** MMWR, WHO weekly bulletins, CDC NNDSS — strict layouts. Tables must be able to produce these.
- **Hierarchical geography is dominant.** Almost every table has a geographic dimension that rolls up.
- **Equity considerations.** Race, ethnicity, income, language are often present and politically charged. Tables must present demographic breakdowns thoughtfully and not in misleading ways.
- **Long retention.** Historical surveillance data goes back decades; tables must render very old records (without modern columns).
- **Accessibility matters more here than almost anywhere else.** Public dashboards must work for non-technical, low-bandwidth, screen-reader, low-vision audiences.
- **Map-table integration is uniquely tight.** Public health is inherently geographic.
- **The line list is an iconic epi tool.** A single Excel-style table that captures everything known about every case in an outbreak. Built ad-hoc, often, but increasingly tooled.
- **Crisis tables are politically sensitive.** Counts, by demographic breakdown, by jurisdiction, become news. Tables must be precise, footnoted, and defensible.
