# Customer support and CRM

The "queue and pipeline" world. Salesforce, HubSpot, Zendesk, Intercom, Front, Help Scout, Freshdesk, ServiceNow, Linear, Jira Service Management, Gainsight, Vitally. The table is both the working surface and the management dashboard, depending on the role.

## Who is at the screen

- **Support agents** working a queue of tickets. Front-line, conversational, time-pressured. The agent's home screen is a table they live in for entire shifts.
- **Support team leads** monitoring their team's queue health, SLAs, agent performance.
- **Customer success managers (CSMs)** managing a book of accounts. Account list is their home screen.
- **Sales reps** working a pipeline of deals. Pipeline list and "my activities for today" are their daily surfaces.
- **Sales managers** rolling up pipeline for forecasts.
- **Account executives at strategic accounts** living in deeply customized account-detail tables (contacts, opportunities, activities, products, contracts).
- **Operations / RevOps** building the dashboards, tuning the pipeline stages, designing reports.

Setting is mostly workstation. Mobile usage is real for sales reps in the field but most heavy lifting is on a laptop.

## Jobs to be done

- Take the next ticket / call / case.
- Find the customer who has been waiting the longest.
- Spot the account at risk of churn.
- Decide which deals to focus on this week.
- Roll up the team's numbers for the manager's standup.
- Update the deal stage after a call.
- Find every account using product X for an outreach campaign.
- Confirm an SLA was met.
- Hand off a ticket to a teammate at end of shift.

## Representative tables

### Ticket queue (support)
The defining table of customer support. Each row a ticket. Columns: ID, subject, requester, status, priority, channel (email/chat/phone), assignee, group, age, last update, SLA countdown, sentiment. Row scale: dozens to thousands. Sort by SLA countdown or by priority then age. Filter by status (open, pending, solved). Bulk reassign. Color on SLA risk and on priority.

### Inbox / conversations table
A more email-shaped variant — Front, Intercom, Help Scout. Each row a conversation. Columns: avatar+name, subject preview, snippet, channel, age, assignee. Threading and unread status carry the visual weight. The "table" is closer to an email inbox than a spreadsheet.

### Ticket detail history table
Inside one ticket, the timeline of events. Columns: time, actor, action, content. Row scale: tens. Often shown as a timeline rather than a table but the underlying data is tabular.

### Agent performance dashboard table
For team leads. Each row an agent. Columns: name, tickets touched today, avg first-response, avg resolution, CSAT, currently active, status (online/away/busy). Row scale: handful to dozens. Sometimes ranked / leaderboarded.

### SLA / breach watch table
Tickets at risk of breaching SLA. Columns: ticket, customer, contracted SLA, time remaining, assignee. Row scale: dozens. Sort by time remaining ascending. Color heavily as deadlines approach.

### Account list (CSM home)
Each row an account. Columns: account name, owner CSM, ARR, plan tier, health score, NPS, last touched, renewal date, days to renewal, expansion opportunity, support ticket count (30d). Row scale: dozens to hundreds per CSM. Sort by renewal date or by health score is the daily use.

### Pipeline / opportunity list (sales)
Each row a deal. Columns: account, deal name, stage, amount, probability, weighted amount, owner, close date, age in stage, last activity, next step. Row scale: dozens to thousands. Sort by close date for forecast reviews. Sort by age in stage to find stuck deals. Editable in place — change stage, update amount, change close date.

### Forecast roll-up table
Each row a rep, a team, or a region. Columns: name, committed, best case, pipeline, gap to quota, last week change. Row scale: handful to dozens. Hierarchical with subtotals (region > team > rep).

### Activity / task list
Calls to make, emails to send today. Columns: time, task, related deal/account, type, status. Row scale: handful to dozens per rep. Mark complete in place.

### Contact list
Each row a contact. Columns: name, email, phone, title, account, last contacted, opt-in status. Row scale: hundreds to millions across the CRM.

### Lead list
Pre-account contacts. Columns: name, source, lead score, status, owner, age. Row scale: hundreds to thousands.

### Opportunity products / line items table
Inside one deal. Columns: product, quantity, unit price, discount, total. Row scale: handful to dozens. Editable.

### Renewal pipeline table
For renewals teams. Each row a renewal. Columns: account, ARR, renewal date, status, owner, churn risk, decision made. Row scale: dozens to hundreds per quarter.

### Health / risk dashboard table
Each row an account flagged at risk. Columns: account, risk reason, signals (engagement, support, NPS), days at risk, owner, last action. Row scale: dozens. Color heavily.

### Knowledge base article performance table
For content/support ops. Columns: article, views, helpful %, last updated, deflection score. Row scale: hundreds.

### Macros / saved replies table
Internal tooling. Columns: name, usage count, owner, last edited. Row scale: dozens to hundreds.

### Customer org chart table
Each row a person at the customer. Columns: name, title, department, role on deal, engagement level, last contacted. Row scale: handful to dozens. Often shown as a tree/org-chart but the underlying data is tabular.

## Behaviors and needs

- **Inline editing.** Change deal stage, change ticket priority, reassign owner — all from the row. Tab between cells. The table is the primary editor.
- **Save view.** A particular sort, filter, and column config saved by name and shared with team. Universal.
- **My / Team / All scope toggle.** Switch the table's row set without rebuilding the view.
- **Avatars and identity.** Owner, assignee, requester always shown as avatar + name.
- **Status pills with workflow context.** "Stage: Negotiation" colored to indicate health of that stage.
- **Bulk update.** Select 20 leads, reassign owner, change status, add to campaign.
- **Drag to reorder priority** (in queue contexts where priority is operator-set, not field-driven).
- **Quick filter chips.** "Open," "Mine," "Today," "Overdue."
- **Search.** Universal. Often required to be fuzzy and field-aware ("subject contains," "from email matches").
- **Row click → side panel detail** (preview without full navigation) and double-click or button → full detail page.
- **Recent / favorited rows.** A "starred" or "pinned" sub-list.
- **Export.** CSV exports for reporting, Excel for executives.
- **Import.** Upload a CSV to add or update rows in bulk.
- **Mass email / mass action from selection.** Select 50 contacts → send sequence.
- **Field permissions.** A rep can see deal amount but not commission %. The table renders blanks gracefully.
- **Custom fields.** Every CRM lets admins add fields; the table must accept arbitrary additional columns of arbitrary types.
- **Roll-up subtotals.** Pipeline by stage with stage subtotals.
- **Sort stability.** Update a row → it doesn't jump unless the sort column changed. Otherwise the rep loses their place.
- **Conditional formatting.** Health score green/yellow/red, days-to-renewal warm-coloring as they get close.
- **Mention support and threading on ticket rows.** Inline conversation preview in the row.

## Frustrations

- A queue table that loses your spot every time a new ticket arrives.
- An "edit in place" that reverts your change when the page polls.
- A pipeline table that re-sorts when you change a deal's stage, throwing you out of context.
- Bulk update UI that requires a full page reload for each batch.
- A "saved view" that doesn't actually save because of a stale local-storage state.
- Custom fields that work in detail view but disappear in list view.
- A "this account has 47 open tickets" indicator that doesn't link directly to those tickets.
- Searches that don't search across all visible columns.
- Phone numbers and emails that aren't click-to-call / click-to-email.
- An export that takes 30 seconds to start downloading and gives no progress indicator.
- Inability to copy a single cell value (the row click is captured globally and triggers navigation).
- A "today" filter that means UTC today instead of the user's today.

## Domain-specific notes

- **Tables are workflow.** This is the most "table-as-application" of any domain in this research. The row is the unit of work. Updates from the table are the primary form of data entry.
- **Custom fields and custom views are the product.** Salesforce, HubSpot, Linear, etc. are valuable specifically because every customer customizes them. The table component must accept arbitrary column sets without breaking.
- **Permissions and visibility rules are deep.** A rep sees their accounts; their manager sees the team's; the CFO sees everyone's. The table doesn't enforce but renders whatever it gets.
- **Inline edit needs to feel safe.** A confirmation pattern (subtle highlight on save, undo toast) is more important than in pure-read tables. The user is editing live data with downstream consequences.
- **Avatars and humans dominate.** Almost every column is "owned by," "assigned to," "created by," "contacted by." The component should make stacks of avatars first-class.
- **Email and chat threading affordances** show up in support tables and aren't quite "table" in the BI sense. The component needs to allow custom row content rich enough for these.
- **Numbers matter but less than in finance.** Currency, percentages, counts — universal but rarely high-precision. Abbreviation (1.2M ARR) is preferred to full digits.
- **Mobile is a real second context.** Sales reps and field-CSMs use mobile apps; the table on mobile is usually a card list, not a table — but the source data shape is the same.
- **Reports are tables.** Salesforce Reports, HubSpot Reports — the report builder produces a table with grouping and roll-ups. Same shape as a pivot table; same need for footer subtotals.
- **The design language for these tables is much "softer" than finance** — more rounded, more padded, more whitespace, more personality. The eudonia design language should be tested against this.
