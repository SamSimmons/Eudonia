# Realtime markets and auctions

A grab-bag for tables whose distinguishing feature is sub-second update with auction-like dynamics. Overlaps with finance (covered separately) but extends to non-financial real-time markets: live auctions, sports betting, ad exchanges, prediction markets, crypto exchanges, gaming-tournament pools, NFT marketplaces, ride-share surge zones, content moderation queues, live chat, live event tracking. Reference systems and surfaces: Sotheby's / Christie's online bidding, eBay live auctions, DraftKings / FanDuel live betting, Polymarket / Kalshi prediction markets, Coinbase / Binance, OpenSea, Twitch / YouTube live moderation, Uber / Lyft driver dashboards, Zoom / Teams live event monitoring.

## Who is at the screen

- **Auction bidders and auctioneers** in live auctions — fine art, charity, livestock, vehicles, equipment.
- **Sports bettors and sportsbook risk managers** during live in-game betting markets.
- **Ad-tech operators and traders** at programmatic ad exchanges.
- **Prediction market participants and operators**.
- **Crypto traders** on exchanges.
- **NFT marketplace participants** browsing live mint events and floor activity.
- **Tournament operators and gamblers** during esports and fantasy sports.
- **Ride-share / delivery drivers** watching surge zones and offer queues.
- **Content moderators** at scale (YouTube, Twitch, Discord, Reddit).
- **Live chat operators** in support and sales chat queues.
- **Event producers** monitoring live broadcasts, streams, ticketing.

Settings range from desk workstations (auction houses, sportsbook risk desks, ad-tech traders) to phones (bettors, drivers) to specialized control rooms (broadcast, large-scale moderation).

## Jobs to be done

- See and react to a price change in a fraction of a second.
- Submit a bid before the lot closes.
- Accept or reject an offer.
- Spot the suspicious row in a queue of millions.
- Decide whether to take the surge offer.
- Approve, remove, or escalate a piece of content.
- Track market movement during a live event.
- Manage exposure during in-game betting.
- Coordinate operations during a live event.

## Representative tables

### Live auction lot table
Each row a lot. Columns: lot #, item, current bid, bidder ID, time remaining, status (open / hammer down / passed / withdrawn), reserve met. Row scale: dozens visible during a session. Refresh: live push, sub-second on closing.

### Open bids / order table (online auction)
For one lot. Each row a bid. Columns: time, bidder, amount, status. Row scale: dozens per lot. Append-only.

### Live in-game odds table (sportsbook)
Each row a market (over/under, moneyline, prop). Columns: market, current odds (each side), open odds, last move, volume, status (open / suspended / settled). Row scale: dozens per game, hundreds per slate. Refresh: live push, seconds.

### Bet ticket queue (sportsbook back office)
Each row a placed bet. Columns: time, customer, market, stake, odds, potential payout, status. Row scale: thousands per minute during peak. Live updates as bets settle.

### Risk exposure table (sportsbook)
Each row a market. Columns: market, total stake, max liability, current exposure, hedge needed. Row scale: dozens. Live.

### Ad exchange / RTB table
Each row a publisher or campaign. Columns: bid requests, win rate, eCPM, spend, fill rate. Row scale: hundreds. Refresh: aggregated every few seconds.

### Prediction market book
Each row a market. Columns: question, current price (Yes/No), volume, liquidity, change, resolution date. Row scale: dozens to hundreds. Live.

### Crypto exchange order book
Each row a price level. Columns: bid size, bid price, ask price, ask size. Row scale: dozens visible. Refresh: live, multiple updates per second. Same shape as finance DOM.

### Trade tape (crypto)
Append-only stream of trades. Time, price, size. Same as finance time-and-sales.

### NFT marketplace floor / listing table
Each row a listed NFT. Columns: thumbnail, name/token ID, price, traits, last sale, owner. Row scale: hundreds. Sort by price ascending (floor view).

### Live mint table
During a mint event. Each row a buyer or transaction. Columns: time, buyer, qty, gas paid, status. Row scale: thousands per minute. Live.

### Driver offer queue (ride-share)
Each row a ride or delivery offer. Columns: pickup, destination, distance, payout, time-to-accept. Row scale: 1–5 visible. Sub-second decision window.

### Surge / zone heatmap as table
Each row a zone. Columns: zone, current multiplier, demand, drivers available. Row scale: dozens. Live.

### Content moderation queue
Each row a piece of content awaiting decision. Columns: content type (text / image / video), thumbnail, reporter, reason, time, AI confidence, status, decision. Row scale: hundreds to thousands per moderator per shift. High-throughput; keyboard-driven.

### Live chat queue
Each row an active chat. Columns: customer, agent, started, status (waiting / active / closed), last message preview, response time. Row scale: dozens active.

### Live event monitor table
For broadcast / streaming ops. Each row an active stream. Columns: stream, viewers, bitrate, dropped frames, status. Row scale: dozens to hundreds. Refresh: seconds.

### Ticketing / queue table (high-demand sales)
For drops. Each row a queue position or a buyer. Columns: position, started waiting, status, ticket assignment. Row scale: thousands.

### Live polling / Q&A table (events, town halls)
Each row a question or vote. Columns: time, question, votes, asker, answered. Row scale: hundreds.

## Behaviors and needs

- **Sub-second updates without flicker.** The user is making decisions in milliseconds; the table cannot strobe.
- **Update emphasis without distraction.** Flash a cell when it changes; fade quickly. The change itself is data.
- **Position stability.** Even with fast updates, the row the user is looking at must not jump.
- **Audio and visual alerts** for critical changes (lot closing, bet settling, content flagged urgent).
- **Status pills with workflow context.** Open / closed / suspended / settled / under review.
- **Bid/order/decision input from the row.** The table is the control surface.
- **Time-remaining countdowns.** Per-row countdowns to lot close, bet cutoff, offer expiry.
- **Confirmation before commit.** Especially on monetary actions. But not so heavy that fast actions get lost.
- **Hot-key driven interaction.** Decisions per second; mouse is too slow.
- **Real-time aggregation.** Footer totals and risk exposures must update with the table.
- **Anomaly detection inline.** Color when a value moves beyond a threshold.
- **Throttling on display.** A market updating 100 times per second cannot render every update; throttle to ~10/sec without losing the latest value.
- **Pause-on-hover.** Auto-scrolling streams pause when the user hovers — they want to read.
- **Sound design.** A subtle chime on a bet acceptance, a louder one on a critical alert. Sound is a table feature in this domain.
- **Heavy concurrency consideration.** Many users seeing the same data simultaneously; consistency matters.
- **Trust signals.** A cell shows when it was last updated; a "stale" warning appears if the connection drops.
- **Latency display.** Some users (sportsbook traders, market makers) need to see their connection latency.
- **History pop-out.** Right-click → see the last N updates for this cell.

## Frustrations

- A flash on every micro-update that becomes constant strobing.
- An auto-scroll that runs away from the user just as they try to click a row.
- A countdown that doesn't visibly update, leaving the user uncertain whether time is moving.
- A bid or bet that takes 2 seconds to confirm with no intermediate feedback.
- A status change to "suspended" without explanation.
- An order book row that flickers due to micro-updates that don't actually change the price level.
- A content moderation queue that doesn't preserve keyboard focus between decisions.
- A last-mile driver app that doesn't show the offer details until it's almost expired.
- A table that goes blank during reconnection instead of showing stale data with a warning.
- Sound effects that can't be muted independently of the system.
- A bet ticket that disappears before the user can verify the odds locked in.
- A prediction market that doesn't reflect a trade that just executed.
- A chat queue that doesn't visibly aging chats waiting too long.
- An NFT marketplace floor that doesn't differentiate real listings from suspicious ones.

## Domain-specific notes

- **Latency is felt.** Anything beyond a few hundred milliseconds is noticeable; anything beyond a second feels broken.
- **Updates are continuous.** The component must accept a stream of updates without re-rendering the whole table per update.
- **Throttled rendering.** Even when data updates 100/sec, render at 30-60Hz max. The component should make this easy.
- **Sound and haptics** are part of the experience in betting, auctions, and last-mile dispatch.
- **Trust and freshness.** Stale or disconnected states must be visible — the user needs to know whether to trust the table.
- **High-frequency decision-making.** Hotkeys, low click counts, immediate feedback. The table is a control surface.
- **Mobile prevalence in retail.** Bettors, bidders, drivers all use phones primarily. Tables on phones with sub-second updates are demanding.
- **Concurrency.** The same row may be the focus of thousands of users; cross-user consistency matters.
- **Audit trail with timestamps to the millisecond.** Disputes (the bet's odds at submit time, the lot's bid at hammer time) require this.
- **Censorship and scale in moderation queues.** Tables here process thousands of items per moderator per shift; ergonomics directly affect cost.
- **The "tape" or "ticker" pattern (append-only stream)** is shared with finance tape, log tables, chat queues. The component should support it.
- **The "queue with deadline" pattern (offer / bid / decision with time-remaining)** is widely shared.
- **Sub-second updates make sparkline-in-cell less useful** than a flash or color encoding — there's no time for the eye to integrate a tiny sparkline.
