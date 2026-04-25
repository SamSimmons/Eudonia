# DevOps and CI/CD

Tables in DevOps tooling sit between source code and running infrastructure. Reference tools: GitHub / GitLab / Bitbucket, Jenkins, CircleCI, Buildkite, GitHub Actions, ArgoCD, Spinnaker, Octopus Deploy, Harness, Terraform Cloud, internal developer portals like Backstage, Cortex, Port. Less life-or-death than security or observability but watched constantly by every engineer in a team.

## Who is at the screen

- **Developers** checking on their PR, their build, their deploy. Several times an hour, often as a context-switch from coding. They want one row to tell them "you are unblocked."
- **Release engineers / platform engineers** managing pipelines, environments, and cross-team coordination. Workstation work; the tables are the workspace.
- **On-call engineers** verifying a deploy went out cleanly or rolling back a bad one. High urgency in the rollback case.
- **Engineering managers** doing reviews, looking at flaky tests, deployment frequency, change failure rates (DORA metrics). Low frequency, high abstraction.
- **Platform team** maintaining the developer portal, the internal infra catalog, the service registry. Building the tables others consume.

Setting is workstation, often inside an IDE side panel or a tab the engineer keeps pinned. Mobile usage exists for "did my deploy succeed?" notifications.

## Jobs to be done

- See if my PR is mergeable.
- See whether the build / test / deploy passed.
- Find the test that just started failing.
- Promote a release from staging to prod.
- Roll back a bad deploy.
- Find the change that introduced the regression.
- Audit who deployed what to which environment last week.
- Review the open PRs blocking my team.
- Find the service I'm supposed to own and check its deployment health.
- Investigate why a job has been queued for 20 minutes.

## Representative tables

### Pull request / merge request list
The list view in GitHub, GitLab, Bitbucket. Each row a PR. Columns: title, author, status (draft/open/merged/closed), reviewers, CI status, age, target branch, labels, mergeable. Row scale: tens to hundreds per repo. Filter by author, by reviewer, by label is constant. The "PRs assigned to me" view is the daily home page for many engineers.

### CI build / pipeline run table
Each row a build run. Columns: build #, branch, commit, author, status (queued/running/passed/failed/cancelled), duration, started, triggered-by. Row scale: thousands per project per week. Sort by recency. Live updates as builds complete. Click → build detail with stage breakdown.

### Pipeline / job table within a build
Inside one build, a table of stages or jobs. Columns: job name, status, duration, runner, log link. Row scale: tens. Often shown as a graph as well as a table; some tools show only the graph.

### Test results table
Inside a build, the test results. Columns: test name, status, duration, error message (if failed), file, owner. Row scale: hundreds to tens of thousands. Filter to failures only is the universal first action. Sort by duration to find slow tests.

### Flaky test table
Aggregated test reliability. Columns: test name, file, flake rate, runs, last failure, recent failure trend (sparkline), owner. Row scale: hundreds. Sort by flake rate. Click to see a history of pass/fail.

### Deployment history table
Every deploy that has happened. Columns: time, service, environment, version, deployer, status, change set link, rollback button. Row scale: thousands. Filter by service and environment. The audit trail and the operational record both live here.

### Environment / release status table
Each row an environment (dev, staging, prod). Columns: env, current version, deployed at, deployer, health status, traffic %. Row scale: handful per service, dozens to hundreds across services. Often a colored cell-grid (services × environments) rather than a row-per-env table.

### Service catalog table
The developer portal home. Each row a service. Columns: name, owner team, language, repo link, runbook link, current version, dependency count, on-call, criticality, scorecard score. Row scale: tens to thousands. Filtered by team or by language. Drill to service page.

### Open issues / tickets table
GitHub issues, Jira issue navigator, Linear list view. Each row a ticket. Columns: ID, title, status, assignee, priority, labels, age, sprint. Row scale: tens to thousands. Sort and filter heavily; saved views are essential. This is one of the most-used "tables" in software engineering, even if the tool calls it a "list view."

### Sprint / iteration board (table form)
Same data as the kanban board but in a table for backlog grooming or reporting. Columns: ID, title, assignee, status, points, sprint. Row scale: dozens to hundreds. Editable in place — change assignee, change status, change points.

### Code review queue table
Reviews assigned to me. Columns: PR title, author, age, size (lines changed), repo, last activity. Row scale: handful to dozens. Sort by age. The "what should I review next" decision tool.

### Infrastructure inventory tables (Terraform, Crossplane outputs)
Each row a resource. Columns: name, type, state (planned/applied/error), drift indicator, region, owner. Row scale: hundreds to thousands. The plan/apply diff view is itself a table — added rows green, removed rows red, changed rows highlighted.

### Container / image table
Each row a container image. Columns: name, tag, digest, size, age, vulnerability count, used by, registry. Row scale: hundreds to tens of thousands. Sort by vulnerability count.

### Feature flag table
Each row a flag. Columns: key, status (on/off/percentage), owner, environments, last toggled, dependencies. Row scale: hundreds. Status column is interactive — toggle directly from the table.

### Schedule / cron / scheduled-job table
Each row a scheduled task. Columns: name, schedule, last run, next run, last status, duration. Row scale: dozens. Sort by next-run-soonest.

### Approval / change request queue
For environments with change management. Each row a pending change. Columns: title, requester, environment, risk, scheduled, approver list, status. Row scale: tens. Workflow-driven.

## Behaviors and needs

- **Refresh on focus.** When the user comes back to the tab the table updates. Otherwise they wonder if the build that's been "running" for 10 minutes actually finished.
- **Live status updates without re-render thrash.** Builds change state every few seconds. Animate the status pill, don't reflow the table.
- **Status is the dominant column.** Pass/fail/running/queued/cancelled/skipped. Color and icon both. Often the column the user sorts by first.
- **Group / threading by branch or by commit.** "All builds for this PR" or "all builds for this commit."
- **Quick filter by author, by team, by branch.** Saved as user preferences.
- **Re-run / cancel from the row.** Direct actions.
- **Drill into logs.** From a failed build row → log viewer. The log viewer itself is often a virtualized text table.
- **Compare two runs.** Pick this build and the last green build, see the diff.
- **Linked entity navigation.** PR → commit → build → deploy → service → owner. The PR table links to the build table links to the service table.
- **Search by ID or title.** Universal.
- **Markdown / rich text in cells.** Issue titles can have inline code, links, emoji. Render them.
- **Author attribution with avatars.** Visual identity matters when scanning.
- **Time as relative ("3 minutes ago") with hover-to-absolute.** Standard.
- **Permissions show through actions.** I can re-run my own build but not someone else's. The table doesn't enforce but must render disabled affordances cleanly.

## Frustrations

- A status that updates from "running" to "failed" and the user only notices because they refreshed manually.
- A "duration" column that keeps counting up after the build finished because the UI didn't get the completion event.
- Filter chips that don't visibly indicate that a filter is applied (causing the "where are my PRs?" panic).
- Test results table that doesn't deduplicate retries — same test fails 3 times, appears as 3 rows.
- A flaky test indicator without enough history to be trusted.
- A re-run button that requires three confirmations.
- Deploy table that doesn't link to the diff between deploys.
- Service catalog with stale ownership information.
- A sprint board / list view that re-sorts every time you change a status, throwing the user out of context.
- A status icon that uses only color and is unreadable in dark mode or for colorblind users.
- An infrastructure plan output that doesn't preserve the rendered diff when scrolled.

## Domain-specific notes

- **Tables and lists blur in this domain.** The "list view" of a kanban board, the "queue" of pending items, the "feed" of recent activity all overlap with "table." The component needs to look right whether the consumer calls it a table, a list, or a queue.
- **Status as a first-class concept.** Almost every DevOps table has a status column with a small set of values, an associated color, and an associated icon. The pattern is universal enough to deserve a built-in pattern.
- **Avatars are common.** Author, assignee, reviewer columns. Stack of overlapping avatars (reviewer list with 5 reviewers shown as 3 + "+2").
- **Inline progress.** "Deploying to prod (3/5 regions)." Shown inline in the status cell with a thin progress bar or a fraction.
- **Live-updating without push.** Many tools poll on an interval (5–30s) rather than maintain a websocket. The component must look fine when data refreshes mid-interaction.
- **Deep linking.** Every row needs to be a stable URL. Bookmarks, Slack pastes, terraform plan output, on-call pages all link directly to specific rows or filtered views.
- **The auditing case.** Deploy tables and approval tables are also the audit log. Filter by date range, export, sign-off. Same shape, different purpose.
- **Flaky-test sparklines** are a useful crossover with the chart side of eudonia — small, dense, in a numeric cell, signaling trend more than absolute value.
- **Tables embedded in chat.** PR status, build status, deploy status get shown in Slack. Static rendering — what the table looks like as an image or a Block Kit message is a real concern even though it's downstream.
