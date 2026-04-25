# Sports and e-sports

The world of competitive play, from professional leagues to recreational. Includes traditional sports (NFL, NBA, MLB, NHL, soccer, F1, tennis), e-sports (League of Legends, Counter-Strike, Valorant, Dota, fighting games, racing), fantasy sports (DraftKings, FanDuel, Yahoo, ESPN), and analytics platforms (Synergy, Stats Perform, Second Spectrum, Hudl, Wyscout). Reference surfaces: ESPN / theScore / sports-app standings, official league sites and apps, broadcast graphics, scouting platforms, fantasy lineup builders, e-sports tournament brackets and leaderboards (Liquipedia, FACEIT, ESL).

## Who is at the screen

- **Casual fans** checking scores, standings, schedules. Mostly mobile.
- **Hardcore fans** following advanced stats, fantasy implications, betting lines.
- **Fantasy players** building lineups, tracking projections, watching live scores.
- **Broadcasters and producers** in production trucks, using stats during live broadcasts.
- **Coaches and analysts** scouting opponents, reviewing player metrics, planning game plans.
- **Front-office staff** evaluating players, draft prep, contracts.
- **Players themselves** reviewing their own film and stats.
- **Officials and statisticians** entering data live during games.
- **Tournament operators** running brackets, managing matches.
- **E-sports teams and analysts** reviewing match data, opponent prep.
- **Sportsbooks and bettors** (overlap with realtime markets).
- **Sports journalists** writing match reports, columns, long-form analysis.

Settings span couch (mobile), broadcast control rooms, coaches' offices, locker rooms, esports practice rooms.

## Jobs to be done

- See the score.
- Find a specific game / match.
- Track a player or team across the season.
- Build a fantasy lineup.
- Scout an opponent.
- Analyze a player's tendencies.
- Pick brackets.
- Follow a tournament.
- Compare players or teams.
- Trade in a fantasy league.
- Decide a starting lineup as a coach.
- Settle a bet.

## Representative tables

### League standings table
Each row a team. Columns: rank, team, played, wins, losses, ties (if applicable), points, goal difference (or +/-), recent form (W/L/W/W/L), next match. Row scale: dozens. Often grouped by division or conference with subtotals.

### Game / match schedule table
Each row a game. Columns: date, time, home, away, venue, broadcast, status (scheduled / in progress / final), score. Row scale: dozens to hundreds per week.

### Live in-game scoring table
Each row a play, period, or scoring event. Columns: time, team, scorer, type, score after. Row scale: dozens per game. Append-only during the game.

### Box score table
Each row a player. Columns: name, position, minutes, points, rebounds, assists, shooting %, +/-, etc. (sport-specific). Row scale: 10–25 per team. Footer: team totals.

### Stat leaders / leaderboard table
Each row a player. Columns: rank, name, team, stat value (PPG, AVG, ERA, goals, etc.). Row scale: top 25 to all-eligible. Sortable by every stat.

### Player season stats table
Each row a season for a player or each row a player for a season. Many columns (sport-specific). Row scale: dozens. Footer: career.

### Team season summary table
Each row a team. Columns: many sport-specific (offensive rating, defensive rating, pace, etc.). Row scale: dozens.

### Game log table
Each row a game in a player's or team's season. Columns: date, opponent, result, stats. Row scale: dozens to hundreds per season.

### Advanced stats table
Each row a player. Columns: PER, win shares, BPM, VORP, expected points, etc. Row scale: dozens.

### Tournament bracket table
Each row a match in the bracket. Columns: round, match #, team A, team B, scheduled, score, winner. Row scale: dozens to hundreds. Often shown as a bracket diagram but the underlying data is tabular.

### Round-robin / group stage table
Each row a team within a group. Columns: same as standings, scoped to the group. Row scale: 4–6 per group, dozens of groups in a major tournament.

### Match list table (e-sports)
Each row a match. Columns: time, event, team A, team B, format (Bo3, Bo5), stage, status, score. Row scale: hundreds during a major tournament.

### Player roster table
Each row a player on a team. Columns: jersey, name, position, age, height, weight, contract, status (active / injured / suspended). Row scale: dozens per team.

### Injury / availability table
Each row an injured / unavailable player. Columns: name, team, injury, status, expected return, last update. Row scale: dozens to hundreds.

### Transaction / trade table
Each row a transaction. Columns: date, type, team, player, details. Row scale: dozens per week in season.

### Fantasy projection table
Each row a player. Columns: name, position, team, opponent, projected points, salary, ownership %, value. Row scale: hundreds per slate.

### Fantasy lineup builder
Rows are positions; cells are selected players with their stats. Editable.

### Fantasy contest leaderboard
Each row an entry. Columns: rank, user, score, lineup, prize. Row scale: thousands per contest.

### Draft board table (real and fantasy)
Each row a player available to draft. Columns: rank, position, team, projected stats, ADP (average draft position), drafted (yes/no by which team). Row scale: hundreds.

### Scouting report table
Each row a player. Columns: scout grades on attributes (sport-specific — speed, accuracy, etc.), comp, overall grade, notes. Row scale: hundreds during draft prep.

### Game-state / play-by-play table
Each row a play. Columns: quarter/period, time, down (football) or count (baseball) etc., players involved, action, result, score. Row scale: hundreds per game.

### Shot chart / tracking-data table
Each row a shot or tracking event. Columns: time, player, x, y, shot type, made/missed, defender. Row scale: hundreds per game.

### E-sports match scoreboard table
Each row a player. Columns: name, team, K/D/A, headshot %, ADR, MVPs, agent / hero / character. Row scale: 10 (5v5).

### Tournament leaderboard (e-sports / golf / racing)
Each row a competitor. Columns: position, player/team, current score / lap / stage, change vs last update. Row scale: dozens to hundreds. Live.

### Lap / split times table (racing)
Each row a driver × lap. Columns: lap #, time, sector 1/2/3, gap to leader, position. Row scale: hundreds.

### Set / point progression table (tennis)
Each row a set or game. Columns: set, server, score progression, aces, faults. Row scale: dozens per match.

## Behaviors and needs

- **Live updates during games.** Score, stats, possession all change in real time.
- **Sticky first column** for player or team names in stats tables.
- **Sort by every stat.** Universal in stats tables.
- **Filter by team, conference, position, season.**
- **Compare two players / teams** side by side.
- **Drill from row to player / team detail.**
- **Sparkline / mini-trend per row** for "recent form" or game-by-game performance.
- **Color on rank, on +/-, on streak, on injury status.**
- **Sport-specific column sets.** Football vs basketball vs soccer vs racing all need different columns.
- **Switch view: per-game, per-100-possessions, total, average.** Toggle.
- **Per-position scoping** (rank by position).
- **Footer / team totals.**
- **Last-updated indicator** during live games.
- **Status pills** for in-progress, halftime, final, postponed.
- **Mobile-first for fan-facing surfaces.** Most consumption is on phones.
- **Broadcast / lower-third rendering.** TV graphics are tabular but constrained — small subset of columns, big fonts, brand colors.
- **Hover-to-reveal more stats.** Tooltips on player rows.
- **Photo / logo columns.** Team logos, player headshots, country flags.
- **Bracket navigation.** Click a winner → next-round match populates.
- **Time-aware columns.** Time remaining in game, days to next game, time on ice, time on field.
- **Multi-language for international leagues.**

## Frustrations

- A standings table that doesn't update during a game in progress.
- A box score that doesn't refresh until the play is over (long delays in football).
- Sort that loses position when scores update.
- Mobile rendering that hides the most-watched stat (PPG, goals) for a less-important one.
- A bracket table that doesn't show the path to the final clearly.
- Fantasy projections without ownership or salary alongside.
- A schedule table without time-zone awareness.
- A player comparison that uses different sample sizes or different definitions silently.
- An injury table that doesn't update with last-known status.
- Tracking data tables (xG, eFG, expected metrics) without explanation.
- Roster tables that don't reflect a recent trade.
- Live score cards that auto-rotate too fast for the eye.
- An e-sports scoreboard where MVP / first-blood / clutch information is buried.
- Stats expressed only as totals when per-game would be more meaningful, or vice versa.

## Domain-specific notes

- **Sport-specific column conventions.** Each sport has its own canonical stats. The component must accept arbitrary columns; consumers configure by sport.
- **Live updates with stable layout.** Score, time, status update; the user reads continuously.
- **Logos and identity.** Team logos, country flags, player headshots are first-class data.
- **Per-game vs season vs career toggles** are standard in stats tables.
- **Color semantics vary.** Green/red for win/loss, +/-, performance vs expectation; team colors. The component renders consumer-defined palettes.
- **Mobile is dominant for fan consumption.** Tables must collapse gracefully — usually to a card list with key stats, expanding for detail.
- **Broadcast graphics are downstream.** Tables drive on-screen graphics; consumers may render simplified versions for TV.
- **Brackets are tree-like tables.** Match-as-row with parent-child relationships. The bracket diagram is the canonical view; the table is the index.
- **Long retention with consistent identity.** Player careers span decades; team identity persists. Tables must accommodate historical data with consistent column semantics.
- **Equity in display.** Women's leagues, lower divisions, minor leagues, regional events all need the same table treatment. A library biased toward "the major leagues" is missing the long tail.
- **E-sports has its own conventions.** Maps, agents/heroes, champions, picks/bans. Tables here resemble traditional sports stats but with a faster column-set evolution.
- **Fantasy ties together prediction, projection, and live scoring.** Tables fold real-time game data into fantasy points and contest leaderboards.
- **Tournament structures vary.** Single-elim, double-elim, round-robin, Swiss, group stage to playoffs. Tables must accommodate.
- **Officiating and statisticians enter live data.** The table is sometimes the source.
- **Disputes and stat corrections.** Stats are sometimes corrected days later; tables must allow updates without erasing history.
- **The "leaderboard" pattern is universal across sports, e-sports, fitness apps, and beyond.** It's a top-N table with rank, name, value, and usually a per-row sparkline or trend.
- **Photo / video integration.** Stats pages link to highlights; box score rows link to play videos. The row is the index.
