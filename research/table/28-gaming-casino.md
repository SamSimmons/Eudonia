# Gaming and casino operations

The gambling and gaming industry: physical casinos, online gambling, lotteries, regulatory oversight. Reference systems: casino management systems (Bally / Konami / IGT / Aristocrat / Light & Wonder), table game tracking (RFID chip systems), slot floor management (Bally CMP, Aristocrat Oasis), player loyalty platforms, online gambling backends (Playtech, Evolution Gaming), regulatory submission systems, anti-money-laundering (AML) systems for gaming, sportsbook back-office systems (overlap with realtime markets), poker site backends, gaming compliance / RG (responsible gaming) tools.

## Who is at the screen

- **Pit bosses and floor managers** monitoring table games on the casino floor.
- **Slot floor attendants and managers** monitoring slot performance and dealing with jackpots / malfunctions.
- **Surveillance / eye-in-the-sky** operators monitoring gameplay for cheating, dealer errors, advantage play.
- **Cage / count room staff** managing chip and cash flow.
- **Player development / hosts** managing high-roller (whale) relationships.
- **Marketing teams** running targeted offers and promotions.
- **Compliance and AML staff** filing CTRs and SARs, monitoring suspicious patterns.
- **Responsible gaming teams** monitoring at-risk players.
- **Online operators' risk and trading teams** for sportsbook and casino.
- **Customer service** for online operators.
- **Regulators** consuming required reports.
- **Game developers and analytics teams** for online operators reviewing game performance.

Setting includes the casino floor (low-light, multi-monitor pit stations), cage / count rooms, surveillance rooms (banks of monitors), regulatory offices, online ops centers.

## Jobs to be done

- Track every table and every game in progress.
- Monitor a high-roller's play.
- Spot cheating, advantage play, or dealer errors.
- Process buy-ins, color-ups, fills, credits.
- Comp a player.
- File a CTR (Currency Transaction Report) for transactions over thresholds.
- Roll up shift / day / month performance for management.
- Monitor responsible gaming flags.
- Settle a wager dispute.
- Verify game outcome integrity.
- Manage promotional offers.
- Run a tournament (poker, slots).

## Representative tables

### Live table game / pit table
Each row a game table. Columns: table #, game type (BJ / craps / roulette / baccarat), dealer, pit, status (open / closed / on break), seats occupied, drop, win/loss, hold %, max/min bet. Row scale: dozens per pit, hundreds per casino. Refresh: live or per shift.

### Slot machine / floor table
Each row a slot machine. Columns: machine ID, location on floor, type, status (active / out of service / hand pay), coin in, coin out, win/loss, hold %, last hand pay. Row scale: hundreds to thousands per casino. Often paired with a floor map.

### Player session table
Each row a player session at a table or slot. Columns: player ID, time in, time out, average bet, time played, theoretical loss, actual win/loss, comp value earned. Row scale: hundreds per shift.

### Player loyalty / database table
Each row a player. Columns: player card #, name, tier, lifetime theoretical, last visit, comp balance, host. Row scale: thousands to millions per casino group.

### High-roller / whale tracking table
Each row a high-value player. Columns: name, host, segment, lifetime value, current trip status, current play summary, comp authorized, comp used. Row scale: dozens to hundreds.

### Cage transaction table
Each row a cage transaction. Columns: time, type (buy / cash / fill / credit / chip exchange), player ID, amount, denomination breakdown, cashier, signature. Row scale: hundreds per shift.

### Hand pay / jackpot table
Each row a hand pay event. Columns: time, machine, player, amount, taxes withheld, status (pending / paid), W2-G generated. Row scale: dozens per shift.

### Drop / count table
Each row a drop bag or count event. Columns: shift, table / machine, drop amount, count team, variance vs meter. Row scale: dozens per count.

### Game outcome / shoe table (table games)
Each row a hand or a shoe. Columns: hand #, dealer cards, player cards, outcome, amount wagered, won/lost. Row scale: thousands per shift. Used for surveillance and audit.

### Surveillance event log
Each row a surveillance observation. Columns: time, location, type, observed, action taken. Row scale: dozens to hundreds per shift.

### Comp / promo redemption table
Each row a comp issued or promo redeemed. Columns: time, player, type, value, authorizing manager. Row scale: hundreds.

### Tournament leaderboard (poker, slots)
Each row an entrant. Columns: rank, player, current chip count or score, change. Row scale: dozens to thousands. Live.

### Sportsbook bet ticket queue (covered in realtime-streaming)

### Online casino game performance table
Each row a game. Columns: name, sessions, gross gaming revenue, hold %, RTP, unique players, avg session duration. Row scale: hundreds to thousands.

### Online player table
Each row a registered user. Columns: account ID, name, status (active / self-excluded / closed), KYC status, balance, lifetime deposits / withdrawals, lifetime GGR. Row scale: thousands to millions.

### Transaction / payment table
Each row a deposit or withdrawal. Columns: time, player, amount, method, status, fees. Row scale: thousands per day.

### KYC / verification queue
Each row a pending verification. Columns: player, document type, submitted, status, reviewer. Row scale: dozens to hundreds per day.

### AML alerts / SAR investigation queue
Each row an alert. Columns: alert ID, player, trigger, severity, status, investigator, decision (file SAR / no action). Row scale: dozens per day. Privacy-sensitive.

### Responsible gaming flags table
Each row a player flagged for at-risk behavior. Columns: player, flag type (rapid loss / extended session / increased stakes), severity, intervention (cooling off / contact / self-exclusion offered). Row scale: dozens to hundreds. High ethical sensitivity.

### Self-exclusion / VIE table
Each row a self-excluded individual. Columns: name, exclusion period, jurisdictions, start, end. Row scale: thousands.

### Bonus / promotion offers table
Each row an offer. Columns: name, type, eligible segment, claim count, GGR impact, cost. Row scale: dozens.

### Game certification / RNG audit table
Each row a game version × audit. Columns: game, version, certifier, date, RTP measured, certified. Row scale: dozens per quarter.

### Regulatory report table
Standardized reports (gross gaming revenue by category, hold %, etc.) for regulators. Strict layouts.

### Tournament structure table (poker)
Each row a level. Columns: level, blinds, ante, duration. Row scale: dozens.

### Dealer schedule table
Each row a dealer × shift. Columns: dealer, shift, table assignments, breaks, supervisor. Row scale: dozens per shift.

## Behaviors and needs

- **Live updates** for table game and machine performance.
- **Status pills** for table / machine / player session / transaction status.
- **Color on threshold breaches** — large wins, large losses, suspicious patterns.
- **Sort by drop / GGR / theoretical** for performance analysis.
- **Drill from row to detail.** Click a player → full profile. Click a machine → game history.
- **Print and PDF.** Hand pays, W2-Gs, CTRs, SARs, daily reports.
- **Audit trail.** Every action logged.
- **Per-row signature workflows.** Hand pays require two signatures; fills / credits require pit signature.
- **Floor map linkage.** Click a machine → map highlights location.
- **Surveillance video linkage.** Click a hand → video clip.
- **Bulk action.** Apply a comp to a player, void a transaction (with appropriate authority).
- **Confidentiality and break-glass.** Some player data is restricted (VIPs, employees, banned players).
- **Multi-jurisdiction.** Casinos with properties in multiple states or countries — different regulations per row.
- **Currency awareness.** International gaming.
- **Compliance with thresholds** built in. CTR triggered at $10K cumulative cash (US); SAR triggered at $5K with suspicion.
- **Real-time risk indicators** for sportsbook and online.
- **Mobile** for hosts on the floor and for online customer service.
- **24/7 operation** for casino floors and online platforms.

## Frustrations

- A pit table that doesn't show a player's session activity to the pit boss in real time.
- A slot table that doesn't differentiate "out of service" from "no play" by appearance.
- A high-roller table that doesn't surface their preferred host immediately.
- AML alert tables that are noisy with false positives.
- Hand pay tables without W2-G generation status.
- Cage transactions that don't enforce CTR aggregation logic.
- Compliance reports that don't match regulator's exact format.
- Surveillance event logs that don't link to video efficiently.
- Online player tables that conflate KYC status with deposit status.
- Comp tables that don't tie back to theoretical earned.
- Self-exclusion lists that don't prevent re-registration.
- Online game performance tables that don't separate test play from real play.
- Tournament tables that don't update chip counts during play.
- Bonus tables without unit-economics columns.
- A responsible gaming flag table that doesn't surface intervention history.

## Domain-specific notes

- **Heavy regulation.** Every jurisdiction has its own rules; tables must produce required artifacts (CTRs, SARs, daily revenue reports). The component should not get in the way of strict format requirements.
- **Audit trails are mandatory.** Every action, every signature, every change. Required for AML, gaming control, internal audit.
- **Privacy and confidentiality.** Player data, especially for high-rollers and at-risk players, is sensitive. Break-glass access patterns are common.
- **Anti-money-laundering is a major workstream.** Tables here resemble security SIEM queues — alerts, investigations, decisions, formal filings.
- **Responsible gaming is a growing concern.** Tables here are ethically loaded; presenting at-risk patterns to staff requires care.
- **Real-time updates** for sportsbook and table-level operations.
- **Status complexity.** Sessions, transactions, machines, alerts all have rich state machines.
- **Print is operational.** Hand pays, W2-Gs, daily reports, regulatory submissions.
- **Multi-jurisdiction.** Casino groups operate across states and countries with different rules.
- **Currency and language for international.**
- **24/7/365 operation.** Tables must remain stable for weeks.
- **Surveillance integration.** Video clips linked to table rows.
- **Map / floor-plan integration.** Slot floor maps; table game pit layouts.
- **Tournament leaderboards** are a leaderboard pattern shared with sports and gaming.
- **Online gambling resembles e-commerce + finance + gaming combined.** Tables here have unique density and stakes.
- **Color schemes are conservative.** Casinos use red / black / green palettes already (cards, chips); UI tables work within or alongside.
- **The line between casino floor and surveillance is sensitive.** Surveillance sees more than the floor; tables should not reveal observer-only data to the floor pit.
- **Promotional / bonus engineering** has its own analytical lens — bonus abuse detection, eligibility tracking, GGR contribution analysis.
- **Game integrity tables** (RNG audits, RTP measurements) are unique to this industry.
- **Aesthetics in casino software historically very poor.** Modern competitors (FanDuel, DraftKings, online platforms generally) compete on usability. Clean tables are an upgrade.
