# Finance and markets

The original target domain for eudonia. Tables in this space are denser, more numeric, and more time-sensitive than almost anywhere else. The user is usually a paid professional whose decisions cost or make money in seconds, and the tooling reflects that — Bloomberg, Eikon, FactSet, IB Trader Workstation, TradingView, Charles River, Aladdin all converge on a small set of well-worn shapes.

## Who is at the screen

- **Traders** at multi-monitor desks. Watching several markets simultaneously. Attention is constantly partial — eyes flick from chart to blotter to news to chat. They expect tables to update without breaking their flow and to surface change without making them hunt.
- **Portfolio managers** with a more deliberative cadence. Reviewing positions, weights, exposures, attribution. They tolerate slightly slower data but want depth and the ability to slice arbitrarily.
- **Sell-side analysts** building screeners, peer comp tables, comparable-company sets. They are constructing tables more than monitoring them — copy/paste to Excel is a first-class workflow.
- **Risk officers** scanning books and exposures, often after hours or for end-of-day reports. Lower update frequency, higher stakes per row.
- **Operations / middle office** doing reconciliations, breaks, settlements, corporate actions. Workflow is "find the broken row, fix it, mark it done."
- **Retail investors** in Robinhood, Schwab, Interactive Brokers consumer apps. Less dense, much smaller column counts, mobile-first.

Setting is almost always a solo workstation, often multi-monitor. Trading floors do have wallboards but most professional decision-making happens on the trader's own screen.

## Jobs to be done

- Confirm a trade hit the right way and update mental P&L.
- Spot the symbol that just moved.
- Find the order that has not filled yet.
- Compare a position to the desk's overall book.
- Investigate why a screener returned a strange result.
- Reconcile what custodian X reports against what the OMS reports.
- Decide whether to add to, trim, or close a position.
- Produce a snapshot for a meeting or report.
- Mark exceptions for follow-up.

## Representative tables

### Trade blotter
The trader's record of orders and fills for the day. Updates in real time as orders go to market and come back filled, partially filled, cancelled, rejected. Columns: time, side (buy/sell), symbol, qty ordered, qty filled, avg price, status, venue, account, P&L since entry. Row scale: tens to a few thousand. Refresh: live push, sub-second. Identity: an order, but rows often update in place rather than appending. Color is heavy — buys/sells distinct, status (filled/partial/rejected) distinct, often row-level.

### Watchlist / quote board
A user-curated list of symbols with live quotes. The most universal table in finance. Columns: symbol, last, change, change %, bid, ask, bid size, ask size, volume, day high, day low, sometimes a sparkline of the day's price. Row scale: 10–200. Refresh: live push, often the entire row updates per tick. Color flashes (green up, red down) on every price change — but the *flash* is the carrier of information, not just the value. Click a row to load it everywhere else on the screen (chart, depth, news).

### Order book / depth of market (DOM / Level II)
A specialized table of bids and asks at each price level. Columns: bid size, bid price, ask price, ask size — usually with depth bars rendered into the size cells as visual fills. Row scale: 10–50 visible, sorted by price. Refresh: live push, multiple updates per second. The table is the visualization — there is barely any chart. Identity is a price level; rows appear and disappear as liquidity moves.

### Position / holdings table
Current positions in an account or portfolio. Columns: symbol, qty, avg cost, market value, unrealized P&L, realized P&L, day P&L, % of portfolio, sector. Row scale: tens to hundreds for one account, thousands across a fund. Refresh: live for market values, slower for cost basis. Drill: click to see lot detail (FIFO/LIFO breakdown). Footer total is mandatory and often subtotaled by sector or asset class.

### Lot detail / tax lot table
A drill-down from a position. Each row is a single lot with acquisition date, qty, basis, current value, gain/loss, holding period (short/long), wash sale status. Row scale: tens per position. Heavily formatted — the holding-period and wash-sale columns drive whether the broker can sell, and how it will be taxed.

### P&L attribution
Returns decomposed by factor, sector, security, or trade. Columns: bucket, contribution to return, weight, security selection, allocation effect. Row scale: tens. Often exported to PDF for client meetings; presentation polish matters more than interactivity.

### Screener results
Output of a multi-factor query against the security universe. Columns: ticker, name, market cap, price, P/E, P/B, dividend yield, sector, country, plus whatever factors the screener targeted. Row scale: hundreds to thousands. The user iterates — adjust filters, re-run, sort by a column, export the survivors. Sort is non-negotiable; column add/remove is universal; saved screeners are a feature.

### Peer comp / comparable companies
Hand-curated table comparing a target company to a peer set. Columns: company, market cap, EV, revenue, EBITDA, EV/EBITDA, P/E, growth rates, margins. Row scale: 5–30. Heavy use of footers (median, mean, target's percentile rank). Often the deliverable itself, not just an analysis tool.

### Time and sales / tape
Stream of every trade as it prints. Columns: time, price, size, condition, exchange. Row scale: unbounded; new rows append at the top. Refresh: live push, can be hundreds per second on liquid names. Auto-scroll behavior is touchy — pause-on-hover is critical.

### News headline list
Often presented as a table even though the row is mostly text. Columns: time, headline, source, symbols-tagged, sentiment. Row scale: hundreds appearing throughout a day. Click to expand or open the body.

### Reconciliation breaks table
Operations workflow. Each row is a discrepancy — qty mismatch, price mismatch, missing trade, missing settlement. Columns: trade ID, side, symbol, our value, their value, difference, status, assignee, age. Row scale: dozens to hundreds. Workflow-driven: assign, comment, resolve. Color-coded by age (older = redder).

### Settlement / trade clearing status
Trades flowing through T+1 / T+2 settlement. Columns: trade date, settle date, counterparty, instrument, qty, amount, status (matched, affirmed, settled, failed, exception). Row scale: thousands per day. Filtering by status is the primary interaction.

### Corporate actions calendar
Upcoming dividends, splits, mergers, tenders. Columns: ex-date, pay-date, symbol, type, ratio, election deadline, status. Row scale: dozens per week. Read-mostly with the occasional election input.

### FX / rates table
Currency pairs or yield-curve points. Columns: pair, bid, ask, mid, change, 1D, 1W, 1M, year-to-date. Row scale: 10–50. Updates live. Often paired with a heatmap representation as an alternative view.

### Risk exposure table
By desk, sector, region, or factor. Columns: bucket, gross exposure, net exposure, beta-weighted, VaR, contribution to VaR. Row scale: tens to hundreds. Hierarchical (sector > industry > security) with expand/collapse expected. Updated end-of-day or intraday on demand.

### Trade allocations
After a block trade, allocate fills across accounts. Columns: account, target qty, allocated qty, price, commission, status. Row scale: 5–200. Editable in place — this *is* the workspace, not a viewer.

## Behaviors and needs

- **Live update without scroll jump.** A row's value can change every second; the user must not be thrown off when reading row 47.
- **In-place row updates with visible change cues.** Flash a cell green when the value rises, red when it falls. The flash itself is data.
- **Hot-key navigation.** Up/down arrow to move row, Enter to act, Esc to cancel. Mouse-only is unacceptable on a trading desk.
- **Custom column sets, saved per user.** Every trader has their own blotter columns. Reordering, hiding, resizing are baseline.
- **Sort and re-sort cheaply.** A trader sorts a watchlist by % change to spot movers, then by symbol to find one.
- **Freeze first column (and sometimes the last).** Symbol stays visible while the user scrolls horizontally through 30 columns.
- **Footer aggregations.** Totals, weighted averages, medians. Often more important than any single row.
- **Group / subtotal by category.** Position table by sector with sector subtotals.
- **Drill into a row** to see the next level (position → lots, screener result → company page, blotter row → fill detail).
- **Cross-table linkage.** Click a watchlist row → chart, depth, news, options chain all retarget. The table is one of many panels watching the same selected entity.
- **Export to clipboard / Excel.** Genuinely table-stakes. Analysts live in Excel.
- **Right-click row context menu.** Buy, sell, chart, alert, news, options, "go to portfolio." Density of actions is high.
- **Cell-level conditional formatting** by absolute value, by quantile within column, by threshold. Heatmaps inside tables.
- **Pinned rows.** Pin a benchmark row (SPY, BRENT) at the top of a watchlist regardless of sort.
- **Inline editing for limited cells.** Order qty, limit price, allocation amount. Tab/Enter to commit, Esc to cancel.
- **Audit visibility.** Operations users must see who changed what, when. Hover-reveal or expandable history.

## Frustrations

- Layout shifts when an order arrives — the trader was pointing at row 3 and now row 3 is something else.
- Colors that wash out in dark mode (the default theme on most trading desks).
- A "flash on update" that is so loud it becomes noise; users disable it; then they miss real changes.
- Sort that loses your place when new rows arrive.
- Slow re-render on tick — a 200-row table updating 5 times per second cannot drop frames.
- Hidden actions behind a triple-dot menu when right-click would have done.
- Inability to copy a single cell value cleanly.
- Truncation that hides the meaningful end of a number.
- Decimal alignment failures — `1234.50` and `12.345` not lining up makes scanning impossible.
- Width changes when a value's character count changes (no fixed-width digits).

## Domain-specific notes

- **Tabular numerals are not optional.** Every numeric column is monospaced-digit by convention; otherwise scanning fails.
- **Negatives in red, sometimes in parentheses.** Accounting convention `(1,234)` is still common alongside `-1,234`. The choice is a user preference.
- **Color carries meaning.** Buy/sell, up/down, long/short, status, age. The palette gets crowded — accessibility is a real concern that the industry has historically ignored.
- **Sub-second updates are common.** A liquid name's quote can update 50+ times per second. Throttling is a UI decision, not a backend one.
- **The same data shows up in many tables.** A symbol's last price is in the watchlist, the blotter, the position table, the chart legend. Updates need to look consistent across them.
- **Decimal precision varies wildly within one table.** Equities print to two places, FX to four or five, crypto to eight. Per-row precision is normal.
- **Status is rarely binary.** A trade can be New, Partially Filled, Filled, Cancelled, Replaced, Rejected, Pending Cancel, Done For Day. Color and shorthand both encode it.
- **The wallboard / display variant exists** (large display in the trading floor showing top movers, headlines) and has very different needs from the workstation table — readable at 30ft, no interactivity.
- **Exchange disclaimers and timestamps** travel with the data. "15-min delayed" must be visible somewhere. Sometimes a per-row indicator.
- **Compliance recording.** What columns the user looked at, what they sorted, even what they hovered, can be logged in regulated environments. Out of scope for a UI library but worth knowing.
