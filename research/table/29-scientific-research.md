# Scientific and clinical research

Wet-lab biology, clinical trials, physics, chemistry, ecology, social science. Reference tools and surfaces: REDCap (clinical research data capture), Medidata Rave / Veeva Vault (clinical trial management), LIMS (lab information management — LabWare, Benchling), electronic lab notebooks (Benchling, LabArchives), bioinformatics platforms (Galaxy, DNAnexus, Terra, Geneious), R/RStudio / Python notebooks for analysis, OpenRefine, ClinicalTrials.gov, NIH dbGaP, GenBank, GEO, NCBI tools, particle physics / astronomy archives (CERN OpenData, MAST, IRSA), social science data (ICPSR), survey platforms (Qualtrics, SurveyMonkey).

## Who is at the screen

- **Bench scientists / lab researchers** running experiments, recording results in lab notebooks and LIMS.
- **Clinical research coordinators** entering case report form data, tracking study visits.
- **Principal investigators** reviewing study progress and analytical results.
- **Biostatisticians and data analysts** building analytical tables and cleaning data.
- **Bioinformaticians** working with sequence data, gene expression matrices, variant tables.
- **Trial sponsors / CROs** monitoring study progress across sites.
- **Regulatory submission staff** preparing FDA / EMA submissions.
- **Data managers** running quality control on study data.
- **Field ecologists / surveyors** entering observation data on tablets in the field.
- **Survey researchers** designing and analyzing surveys.
- **Astronomers / physicists / chemists** querying observational and experimental archives.
- **Peer reviewers and journal editors** reviewing supplementary data tables.
- **Citizen scientists** in crowdsourced research.

Settings range from quiet labs to bustling clinics to remote field sites to compute clusters in dark rooms.

## Jobs to be done

- Record an experimental result.
- Track a sample through processing.
- Enter case report form data for a patient visit.
- Spot data quality issues.
- Reproduce someone else's analysis.
- Decide whether the data supports a conclusion.
- Prepare a manuscript or grant.
- Submit data to a regulatory body.
- Compare two experiments or two cohorts.
- Run a statistical test.
- Annotate a sequence or a structure.
- Plan the next experiment.

## Representative tables

### Sample / specimen tracking table (LIMS)
Each row a specimen. Columns: sample ID, source (patient / subject), collection date, type, location (freezer / box / position), status (received / aliquoted / tested / depleted), chain of custody. Row scale: thousands to millions per lab.

### Experimental run / batch table
Each row an experimental run. Columns: run ID, date, operator, protocol, samples included, instrument, parameters, status (queued / running / complete / failed), result file. Row scale: hundreds.

### Case report form (CRF) data table
Each row a subject × visit × form. Columns: subject ID, visit, field 1, field 2, ... entered by, entered date, queries open. Row scale: thousands per study. Editable. Strict edit checks.

### Subject / participant enrollment table
Each row a subject. Columns: subject ID, site, enrolled date, status (screened / enrolled / withdrawn / completed), arm, visit progress. Row scale: hundreds to thousands per study.

### Study site monitoring table
Each row a study site. Columns: site, PI, country, screened, enrolled, completed, queries open, days since last visit, last monitoring visit. Row scale: dozens to hundreds.

### Adverse event table
Each row a reported adverse event. Columns: subject, AE term, onset, severity, relationship, action, outcome, serious (Y/N), reported date. Row scale: hundreds. Workflow-driven, regulatory-sensitive.

### Concomitant medication table
Each row a medication a study subject is taking. Columns: subject, drug, indication, dose, route, start, stop, ongoing. Row scale: dozens per subject.

### Lab values table (clinical research)
Each row a lab result. Columns: subject, visit, test, result, unit, ref range, flag, drawn date. Row scale: thousands per study.

### Visit schedule / window table
Each row a planned visit. Columns: subject, visit, target date, window opens, window closes, status, actual date. Row scale: thousands per study.

### Query table
Each row an open data query. Columns: subject, form, field, query, status (open / answered / closed), age, monitor, site response. Row scale: hundreds. Workflow-driven.

### Protocol deviation table
Each row a deviation. Columns: subject, date, type, description, severity, reportable. Row scale: dozens.

### Reagent / consumable inventory
Each row a reagent. Columns: catalog #, lot, on hand, location, expiration, supplier. Row scale: hundreds per lab.

### Equipment / instrument log table
Each row an instrument. Columns: ID, type, status, last calibration, next due, run count. Row scale: dozens per lab.

### Plate / well layout table (lab biology)
Rows are plate rows (A-H), columns are plate columns (1-12), cells are samples. 8x12 fixed shape. Critical for high-throughput biology.

### Sequencing run table
Each row a sequencing run. Columns: run ID, instrument, start, end, samples, total reads, quality score, status. Row scale: dozens per facility.

### Variant / VCF table (bioinformatics)
Each row a variant. Columns: chromosome, position, ref, alt, gene, allele frequency, quality, annotation. Row scale: thousands to millions per sample.

### Gene expression table
Rows are genes; columns are samples; cells are expression values. Row scale: tens of thousands. Often shown as a heatmap. Sticky first column.

### Biomarker / clinical correlate table
Each row a subject. Columns: clinical variables and lab values for analysis. Row scale: hundreds.

### Survey response table
Each row a respondent × question or each row a respondent (with one column per question). Row scale: hundreds to millions.

### Field observation table
Each row an observation. Columns: time, location (lat/lon), observer, species or measurement, count, condition, photo. Row scale: hundreds to thousands.

### Telescope / observation log
Each row an exposure. Columns: time, target, instrument, exposure, filter, conditions, observer. Row scale: thousands.

### Citation / reference table
Each row a paper. Columns: authors, year, title, journal, citations, DOI. Row scale: hundreds in a literature review.

### Data dictionary table
Each row a variable. Columns: name, type, description, allowed values, units, source. Row scale: hundreds.

### Statistical analysis output table
Each row a statistical comparison or a coefficient. Columns: comparison, estimate, CI, p-value, adjusted p-value, significance. Row scale: dozens to thousands. Footer: model summary.

### Cohort / inclusion attrition table
Each row a filter step. Columns: criterion, n remaining after applying. Row scale: dozens. Critical for transparency.

### Submission / regulatory tables (FDA SDTM/ADaM)
Highly structured, standardized formats. Tables follow CDISC standards exactly.

## Behaviors and needs

- **Data integrity is paramount.** Every cell change logged with user, timestamp, reason. ALCOA+ compliance.
- **Strict edit checks.** Range checks, type checks, cross-field validation. The component supports consumer-defined validation.
- **Sticky first column** in genomics matrices, lab values trends, expression heatmaps.
- **Drill from row to source.** A subject row → all their forms. A variant row → external annotation.
- **Filter and search by anything.**
- **Saved analyses / saved queries.** Reproducibility matters.
- **Export to statistical software.** R, Python, SAS, Stata. CSV with strict naming.
- **Print and PDF.** Regulatory submissions, manuscripts, grant figures.
- **Pivot and reshape.** Wide-to-long, long-to-wide. Common analytical operation.
- **Heatmap-style cell coloring** in genomic and biomarker tables.
- **Per-cell metadata.** A value with units, a method, a quality flag, an analyst.
- **Provenance tracking.** Where did this number come from? Which version of the analysis?
- **Reproducibility.** A table generated today should reproduce identically tomorrow given the same inputs.
- **Field data entry on tablets.** Touch-friendly forms in remote settings.
- **Bulk import.** Lab instrument output files, EHR extracts, survey CSVs.
- **Annotation** of rows with researcher notes.
- **Compare cohorts / experiments side by side.** Multi-column metric tables.
- **Statistical results with confidence intervals.** Cells often carry uncertainty (estimate ± SE; CI).
- **Multilingual considerations** in international trials.
- **Privacy-preserving rendering.** Subject IDs are pseudonyms; PHI is suppressed.
- **Long retention.** Decades for clinical trial data; centuries for some scientific archives.

## Frustrations

- A LIMS table that doesn't enforce chain-of-custody when a sample is moved.
- A CRF table that allows entry of out-of-range values silently.
- Variant tables without functional annotation inline.
- Gene expression tables where the row of interest is buried.
- Adverse event tables without the SAE flag prominently.
- Query resolution that doesn't link back to the source data.
- Statistical output tables without confidence intervals.
- Survey response tables that conflate "skipped" with "answered no."
- Inventory tables with stale on-hand counts.
- Equipment logs without calibration status.
- Sequencing run tables without QC metrics.
- Field observation entries that don't capture GPS reliably.
- Submission tables that don't validate against CDISC structure.
- Tables in published papers that don't carry over alignment, footnotes, units when downloaded.
- Citation tables that confuse same-name authors.
- Data dictionary tables that get out of sync with the actual data.

## Domain-specific notes

- **Reproducibility is non-negotiable.** Tables must be exportable, version-controlled, and reproducible.
- **Standards-driven.** CDISC SDTM / ADaM in clinical trials, GA4GH formats in genomics, IVOA for astronomy. Tables must produce standards-compliant outputs.
- **Audit trails are mandatory** in regulated research (clinical trials, GLP labs, GMP manufacturing covered separately).
- **Data integrity (ALCOA+) is encoded in regulation.** Attributable, Legible, Contemporaneous, Original, Accurate.
- **Provenance and lineage.** Where did this value come from? Which analysis run? Which model? Tables surface this when possible.
- **Statistical literacy.** Tables show estimates with uncertainty. Cells often carry confidence intervals or standard errors.
- **Heterogeneous data.** Genomics tables have millions of rows × thousands of samples. Survey tables have hundreds of rows × hundreds of questions. Field tables have dozens of rows. Same component must scale.
- **Cohort / matrix tables** (gene × sample, variable × subject) are uniquely large and uniquely two-dimensional.
- **Privacy.** Subject IDs, geographic data, demographic combinations. Suppression and aggregation patterns.
- **Bench-to-bedside-to-population.** Same data flows from sample to subject to population analysis. Tables at each layer have different shapes but consistent identity.
- **Tables published in papers** are the deliverable. They must look right in print, in supplementary CSV, in screen-readable form.
- **Field data entry is hostile.** Outdoor tablets, gloves, dust, sun glare. Mobile-friendly forms with offline support.
- **Lab notebook integration.** Tables embedded in research notebooks with narrative text around them.
- **Genomics has unique scale and presentation.** Variant tables with millions of rows are routine; expression matrices are heatmaps; phylogenetic data is tree-shaped.
- **Citation and provenance tables** are unique to the academic workflow.
- **Statistical analysis output is its own table genre** — coefficients, p-values, model fit statistics. The conventions are well-established (regression output, ANOVA tables, contingency tables).
- **Quality and ethical standards are extreme** in clinical research (IRB, GCP) and increasingly in other domains.
- **Long-running studies.** A clinical trial may run 10+ years; an ecological monitoring program runs for decades. Tables must look right with very old and very recent data.
- **Many "tables" are heatmaps with row/column metadata.** Especially in genomics and proteomics. The table-vs-chart line is blurry.
