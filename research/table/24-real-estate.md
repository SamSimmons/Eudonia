# Real estate and property

Residential, commercial, industrial real estate. Includes brokerage, property management, REITs, real estate investment, mortgage, title, appraisal. Reference tools: MLS systems (regional, e.g. Stellar MLS, Bright MLS), Zillow / Redfin / Realtor.com, CoStar, LoopNet, Yardi, AppFolio, Buildium, MRI Software, RealPage, ARGUS (commercial valuation), Reonomy, CompStak, Procore (construction overlap covered separately), Mortgage LOS systems (Encompass, Calyx), title platforms.

## Who is at the screen

- **Residential agents** searching MLS, building tour lists, tracking deals. Constant phone use plus desktop for paperwork.
- **Buyers / renters** browsing public listing sites.
- **Commercial brokers** working comp tables, rent rolls, lease abstracts, deal pipelines. Higher complexity per deal than residential.
- **Property managers** running rent collection, maintenance, leasing, financials for portfolios.
- **Leasing agents** showing units and processing applications.
- **Investors / asset managers** evaluating properties, modeling cash flows, tracking portfolios.
- **Appraisers** building comp tables and valuation reports.
- **Mortgage loan officers and processors** managing loan pipelines.
- **Underwriters** evaluating loans.
- **Title agents** managing closings.
- **REIT analysts** rolling up property-level data to portfolio.
- **Construction / development teams** tracking projects (overlaps with construction PM).
- **Tenants** in tenant portals.

Settings include the desk, the car (showing properties), the property itself (showings, inspections), and increasingly mobile.

## Jobs to be done

- Find listings matching a buyer's criteria.
- Build a CMA (comparative market analysis).
- Run a tour for a client.
- Manage today's leads.
- Collect rent and chase late payments.
- Track maintenance requests through resolution.
- Model the financial returns of an investment property.
- Roll up portfolio performance.
- Process a loan application from intake to close.
- Order a title search.
- Renew a lease.

## Representative tables

### MLS listing search results
The defining residential real estate table. Each row a listing. Columns: photo, address, price, beds, baths, sq ft, $/sq ft, days on market, status, listing agent. Row scale: dozens to hundreds per search. Sort by price, by days on market. Photo column is dominant.

### Saved searches / new listings table
Each row a new listing matching a saved search. Columns same as above. Refresh: every few minutes during prime hours.

### Comparable sales (comps) table
For an appraisal or CMA. Each row a comparable property. Columns: address, sale date, sale price, beds, baths, sq ft, distance from subject, adjustments (per feature), adjusted price. Row scale: 3–10 typically. Footer: implied value range. Editable in adjustment columns.

### Active rent comps table
Each row a comparable rental. Columns: property, unit, rent, $/sq ft, beds, baths, sq ft, year built, amenities. Row scale: dozens.

### Buyer prospect / lead table
For agents. Each row a lead. Columns: name, contact, source, status, budget, criteria summary, last activity, owner. Row scale: dozens to hundreds per agent.

### Showings / tour list
Each row a tour stop. Columns: time, address, listing agent, lockbox code, notes. Row scale: 5–15 per tour.

### Property / portfolio table
For investors and managers. Each row a property. Columns: name, address, type, units, occupancy %, NOI, cap rate, value, debt, equity. Row scale: dozens to thousands.

### Rent roll
The defining commercial / multifamily table. Each row a unit or lease. Columns: unit, tenant, lease start, lease end, base rent, additional rent, sq ft, $/sq ft, escalations, security deposit, status. Row scale: dozens to thousands. Footer: total rent, occupancy, weighted average lease term.

### Tenant / resident table
Each row a tenant. Columns: name, unit, lease term, balance, payment status, move-in, move-out scheduled. Row scale: dozens to thousands per portfolio.

### Delinquency / aging table
Each row a tenant with overdue balance. Columns: tenant, unit, balance, days past due, last payment, next action. Row scale: dozens.

### Maintenance request table
Each row a request. Columns: ID, property, unit, tenant, category, priority, description, status, assigned tech, opened, resolved. Row scale: hundreds per portfolio.

### Vendor / contractor table
Each row a vendor. Columns: name, trade, rates, insurance status, performance score. Row scale: dozens.

### Lease abstract table
Each row a key lease term. Columns: term, value, source page in lease document. Row scale: dozens per lease. Used by asset managers to summarize long lease documents.

### Investment / financial model table
Cash flow projection. Rows: line items (gross rent, vacancy, opex categories, NOI, debt service, cash flow); columns: years (10-year hold typical). Spreadsheet-like.

### Loan pipeline table
Each row a loan. Columns: file #, borrower, property, amount, status (application / processing / underwriting / clear-to-close / funded), loan officer, target close, days in stage. Row scale: dozens per LO. Color on stage age.

### Loan condition table
For one loan, conditions to satisfy. Each row a condition. Columns: description, status, source (UW/lender/investor), due, owner. Row scale: dozens per loan.

### Closing / disclosure table (CD)
Settlement statement. Rows: loan terms, charges, payments. Standardized format (Closing Disclosure form). Strict layout for regulatory compliance.

### Title search / chain of title table
Each row a recorded document. Columns: date, type (deed / mortgage / lien / release), parties, recording reference. Row scale: dozens. Chronological.

### Closing schedule table
Each row a closing. Columns: date, time, property, buyer, seller, agents, escrow officer, status. Row scale: dozens per week.

### Open house / showings activity table
Each row a showing or open house event. Columns: property, date, agent, attendees, leads generated. Row scale: dozens.

### Construction / development project table (overlap with construction PM)
Used by developers tracking units pre-sale or pre-lease.

### Affordable housing compliance table
For income-restricted properties. Each row a household. Columns: household, income, AMI %, eligibility, recertification due. Row scale: dozens. Regulatory-sensitive.

### REIT / fund holdings table
Each row an asset. Columns: property, type, market, acquired, basis, current value, NOI, cap rate. Row scale: dozens to hundreds.

### Acquisition pipeline table
Each row an opportunity. Columns: address, type, ask price, NOI, cap rate, status (sourced / IOI / LOI / due diligence / contracted / closed), broker. Row scale: dozens.

### Public records / parcel table
Each row a parcel. Columns: address, owner, last sale, last sale price, assessed value, lot size. Row scale: many.

## Behaviors and needs

- **Photo-first columns.** Listings, properties, units. The image is data.
- **Map linkage.** Universal in real estate. Click row → map; click pin → row scrolls.
- **Saved searches with new-result alerts.**
- **Side-by-side comparison.** Compare 3–5 listings or properties on metrics.
- **Currency formatting per locale.** International real estate exists.
- **Per-cell unit awareness.** sq ft vs sq m, $/sq ft, $/unit, cap rate %.
- **Date math.** Days on market, days past due, days to lease expiry, days to close.
- **Drill from row to property detail (with photos, history, docs).**
- **Editable in place** for rent rolls, tour notes, lead status updates.
- **Bulk action.** Move leads to a campaign, archive listings, send showings to a client.
- **Print and PDF.** Listing flyers, CMAs, rent rolls, settlement statements, leases.
- **Mobile** is heavy in residential brokerage and field property management.
- **Tag rows.** "Hot lead," "Cash buyer," "Off-market."
- **Workflow status pills.** Pipeline stages, lease status, maintenance status.
- **Compliance-aware rendering** for disclosures (RESPA, Fair Housing, state-specific).
- **Footer aggregations.** Average price, total NOI, weighted lease term, occupancy %.
- **Branded outputs.** Brokerages produce branded reports; agents produce branded CMAs.

## Frustrations

- A listing search that hides relevant listings because of a filter the user forgot they applied.
- A photo column with thumbnails too small to evaluate.
- Maps and tables that show different listing counts because of different filter logic.
- Rent rolls that don't account for stepped rent escalations cleanly.
- A delinquency aging table that doesn't show the recent payment that resolved the balance.
- Maintenance tables without photo support — tenants want to attach.
- Lease abstract tables that don't link back to the lease text.
- Loan pipelines without stage-age coloring, hiding stuck files.
- Title chain tables that aren't chronologically sorted.
- A CMA where adjustments don't auto-recalculate.
- Settlement statement layouts that don't match regulatory format.
- Mobile listing tables that show only price + photo, hiding sq ft or beds.
- A property table that doesn't roll up to fund-level totals cleanly.
- An MLS listing whose photos rotate too fast for the viewer to grasp.

## Domain-specific notes

- **Photos are first-class data.** Listings, units, repairs all carry photo evidence. Inline thumbnails, lightbox expansion, photo carousels.
- **Maps and tables are inseparable.** Real estate is geographic; every table has a spatial counterpart.
- **Per-row units differ.** Residential is bedrooms / bathrooms; commercial is sq ft and rate; multifamily is units. Tables in this domain accommodate heterogeneous property types or specialize.
- **Compliance forms.** CDs, settlement statements, fair-housing disclosures, lease addenda. Strict layouts.
- **Print and branded PDF.** Listing flyers, market reports, CMAs all printed and shared with clients.
- **Mobile is dominant in residential brokerage.** Agents work from phones in showings and tours.
- **Multi-stakeholder workflows.** Buyer, seller, both agents, lender, title, escrow, inspector. Tables coordinate across.
- **Long retention.** Property records persist indefinitely; tables show very old data.
- **MLS data is contractually constrained.** Display restrictions, attribution requirements, limits on how it can be exported.
- **Public-facing vs internal tables.** Zillow's table is the public version; the brokerage's CRM table is internal. Same data, different presentations.
- **Investment modeling is spreadsheet-like.** Cash flow projections, IRR calculations, sensitivity tables. The table is a model.
- **Status complexity.** A listing can be active, pending, contingent, under contract, closed, expired, withdrawn. Each market has its own vocabulary.
- **Currency and locale.** International real estate tables span currencies and measurement systems.
- **Tags and notes** are pervasive — agent notes on leads, tenant notes, property notes.
- **The rent roll is iconic for commercial real estate.** Footer with weighted-average lease term and total rent is essential.
- **Lead-management tables resemble CRM tables** (covered in support-crm).
- **Loan pipeline tables resemble support queues and DevOps PR tables** in shape — workflow stages, age coloring, pipeline metrics.
- **Aesthetics historically poor** in many real estate platforms; modern tools (Compass, Side, AppFolio) compete on usability. Clean tables matter.
