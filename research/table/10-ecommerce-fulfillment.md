# E-commerce and fulfillment

The world of orders, products, returns, fraud queues, warehouse operations, and customer experience. Reference tools and surfaces: Shopify, Amazon Seller Central, BigCommerce, WooCommerce, Magento, Square, Stripe Dashboard, Recurly, Chargebee, Returnly / Loop Returns, Gorgias, Klaviyo, Lightspeed, NetSuite, ShipStation, ShipBob, Flexport, DSCO, EDI portals.

## Who is at the screen

- **Merchants / store owners** of small-to-mid stores running their whole operation from the dashboard. The table is everything — orders to fulfill, inventory to restock, customers to email.
- **Operations / fulfillment teams** at larger stores triaging order flow, handling exceptions, coordinating with warehouses.
- **Warehouse staff** picking orders from a list — usually on a handheld scanner or a tablet in the warehouse, not a desktop.
- **Returns specialists** processing returns, deciding restock vs scrap, issuing refunds.
- **Customer support** using the order list as the primary lookup tool when a customer calls.
- **Fraud analysts** working a queue of flagged transactions.
- **Buyers / merchandisers** managing assortment, planning replenishment.
- **Finance** reconciling payouts, taxes, fees.

Setting is workstation for desk roles; warehouse roles use ruggedized handhelds or warehouse workstations under harsh lighting.

## Jobs to be done

- Find the order a customer is calling about.
- Process today's open orders — print labels, mark fulfilled.
- See which products are selling and which aren't.
- Catch the order that's likely fraudulent before it ships.
- Decide what to reorder this week.
- Handle a return — issue refund, restock or scrap.
- Investigate why a payment failed.
- Reconcile yesterday's payout against the GL.
- Prepare a tax report.
- Generate a pick list for the warehouse.

## Representative tables

### Order list
The merchant home page. Each row an order. Columns: order #, date, customer, items count, total, payment status, fulfillment status, channel, ship-to country, tags. Row scale: dozens (small store) to millions (Amazon-scale). Sort by date descending default. Filter by status, by date range, by tag. Bulk action: mark as fulfilled, print labels, archive.

### Order detail line items table
Inside one order, a table of items. Columns: image, SKU, title, variant, qty, unit price, discount, tax, total. Row scale: handful to dozens. Footer with subtotal, shipping, tax, grand total. Editable in some platforms (refund a single item).

### Product / catalog table
Each row a product. Columns: image, title, SKU, status (active/draft/archived), inventory count, price, sales (30d), revenue (30d), category. Row scale: hundreds to hundreds of thousands. Sort by sales, by stock, by recency. Image column dominant.

### Inventory table
Each row a SKU at a location. Columns: SKU, title, location, on hand, available, on order, committed, reorder point, lead time, sell-through (30d). Row scale: hundreds to millions. Filter by low-stock. Color on stock thresholds. Often grouped by location and by category.

### Pick list
For a fulfillment shift. Each row an item to pick from a wave of orders. Columns: bin location, SKU, title, qty, order #. Row scale: dozens to thousands per shift. Sorted by bin location for picker efficiency. Mark picked from row (often via barcode scan).

### Wave / batch table
Each row a batch of orders being processed together. Columns: wave ID, order count, items count, status, started, picker, estimated completion. Row scale: dozens per day.

### Shipment / tracking table
Each row a shipment. Columns: tracking #, carrier, ship date, expected delivery, actual delivery, status, customer, order #. Row scale: thousands per week. Color on delayed/exception.

### Return / RMA table
Each row a return. Columns: RMA #, order #, customer, items, reason, status, value, refund issued, restock decision. Row scale: dozens to thousands per month. Workflow-driven.

### Refund / chargeback table
Each row a refund or chargeback. Columns: date, order, amount, reason, gateway, fee, status. Row scale: dozens to thousands.

### Fraud review queue
Each row a flagged transaction. Columns: order #, score, signals (mismatched address, velocity, IP risk), customer, amount, status. Row scale: dozens to hundreds per day. Workflow-driven.

### Customer table
Each row a customer. Columns: name, email, orders, lifetime value, last order date, location, marketing opt-in, tags. Row scale: hundreds to millions. Sort by LTV or by recency. Used for outreach and for service.

### Subscription table (recurring billing)
Each row a subscription. Columns: customer, plan, status, MRR, started, next charge, dunning state, churn risk. Row scale: hundreds to hundreds of thousands.

### Payout / settlement table
For finance. Each row a payout from the payment processor. Columns: date, amount, fees, net, transactions count, status, gateway. Row scale: dozens to hundreds per month. Reconciliation workflow.

### Tax table
Sales tax owed by jurisdiction. Each row a state/region. Columns: jurisdiction, period, gross sales, taxable sales, tax collected, tax owed. Row scale: dozens.

### Channel performance table
Each row a sales channel (web, Amazon, eBay, retail). Columns: orders, revenue, units, AOV, share. Row scale: 5–20.

### Bestseller / report tables
Each row a SKU. Columns: rank, title, units sold, revenue, % of total. Row scale: tens to hundreds. Footer total. Top-N pattern.

### Discount / promo code table
Each row a code. Columns: code, type, value, uses, redemption %, revenue, status, expiration. Row scale: tens to thousands.

### Vendor / dropship purchase order table
For multichannel retailers. Each row a PO. Columns: PO #, vendor, items, value, ship date, expected receipt, status. Row scale: dozens to hundreds.

### EDI exception queue
For B2B. Each row a malformed EDI document or a flagged transaction. Columns: document type, partner, received, error, status. Row scale: dozens per day. Workflow-driven.

## Behaviors and needs

- **Image-first columns.** Product, customer (avatar), creative thumbnails. The image is data.
- **Status pills with workflow context.** Fulfillment status, payment status, shipping status — multiple status columns per row, each color-coded.
- **Bulk action bar.** Select rows → action menu appears. Print labels, mark fulfilled, archive, refund, tag.
- **Search by anything.** Order #, customer email, customer name, product SKU, product title, tracking #. Universal search bar.
- **Saved filters.** "Today's orders," "Unfulfilled," "Awaiting payment," "International."
- **Date-range scoping.** Universal.
- **Per-row actions.** Print packing slip, send tracking email, refund, cancel.
- **Drill to detail.** Order row → order detail. Customer row → customer profile.
- **Inline edit.** Update inventory, change product status, edit price.
- **Comments / internal notes.** Add a note to an order ("customer requested gift wrap"). Visible to other ops staff.
- **Tag a row.** Free-form tagging is universal in commerce.
- **Print and PDF.** Pack slips, pick lists, invoices, returns labels. The table is often the source of a printable artifact.
- **Barcode-friendly UIs in warehouse contexts.** Scanning advances the row, not the cursor.
- **Multi-currency display.** Each order in its native currency; some columns in store base currency.
- **Multi-channel marker.** Channel icon per row when the store sells across surfaces.
- **Customer lookup integration.** Click a customer email → customer detail panel without leaving the order list.

## Frustrations

- An order list that doesn't visually distinguish "unfulfilled but paid" from "unfulfilled and unpaid."
- Bulk fulfill that fires a separate API call per order with no aggregate progress indicator.
- A search that doesn't find an order by email because the order had a guest checkout with a slightly different email.
- Inventory tables that show "available" without explaining the difference from "on hand" (committed orders, in-transit).
- Returns processing that doesn't pre-populate from the original order.
- A "print labels" action that prints one PDF per order instead of one combined PDF.
- Image columns where the image is too small to identify the product.
- Tables that fail under load — the merchant has a flash sale and the orders table becomes unresponsive at the worst possible moment.
- A status column that doesn't reflect carrier exceptions (the package is stuck in customs but the dashboard still says "in transit").
- Inability to sort by total or by item count.
- Customer column showing only an email when the name was available.
- A table that breaks layout on mobile — many merchants run their whole store from a phone.

## Domain-specific notes

- **Variability of merchant size.** A Shopify table needs to look right for a one-person store with 5 orders/month and a brand with 5000 orders/day. The component must scale visually and functionally.
- **Mobile is real.** Many merchants live on phones. Tables need a graceful mobile collapse — typically to a card list, not a horizontally scrolled table.
- **Warehouse environments are hostile to UI.** Bright lights, gloves, scanners, ruggedized devices, possibly cold temperatures. High-contrast, large-touch-target, scannable fonts matter.
- **Status is not binary.** Order can be paid+fulfilled, paid+unfulfilled, unpaid+unfulfilled, partially-paid, partially-fulfilled, refunded, partially-refunded, cancelled. Tables in this domain often need *multiple* status indicators per row.
- **Money is per-row local currency.** Multi-currency display is the default expectation, not an edge case.
- **Image bandwidth.** A product table with 200 visible rows × 200 KB images is 40 MB. Lazy loading and thumbnail generation matter.
- **Barcodes and scanning** drive a different interaction model — the focus is the row, not the cursor; scanning advances the workflow.
- **Print is not legacy.** Pack slips, invoices, returns labels, customs forms are all printed dozens of times per day. The table component must produce printable artifacts (or play well with an artifact generator).
- **The order list is the most-used table in commerce.** Whatever defaults fit it well will fit most other commerce tables.
- **Audit trail expectations** for refunds, cancellations, returns are real. Logs of who-did-what-when are often shown inline.
- **Compliance with payment regulators** drives some of the column choices (fraud signals, AVS results, CVV checks). Consumers will need flexible columns to render these.
