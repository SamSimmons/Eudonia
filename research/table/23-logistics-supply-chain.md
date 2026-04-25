# Logistics and supply chain

Movement of goods and the planning behind it. Reference systems: SAP, Oracle SCM, Manhattan WMS, Blue Yonder (JDA), Kinaxis, o9, Anaplan supply chain modules, Project44, FourKites, Flexport, ShipBob, ShipStation, EDI VANs, freight broker platforms, last-mile dispatch (Onfleet, Bringg), warehouse robotics dashboards (Locus, Geek+, AutoStore), customs platforms.

## Who is at the screen

- **Warehouse managers** running a DC. The order/wave/pick tables are home.
- **Pickers, packers, sorters** doing the physical work — usually with handhelds, sometimes with HMD, sometimes with workstation.
- **Transportation managers** coordinating freight, dispatching trucks, managing carriers.
- **Dispatchers** assigning loads to drivers in real time.
- **Drivers** on phones / tablets in cabs.
- **Customs brokers and import/export staff** managing documentation.
- **Demand planners** building forecasts and supply plans.
- **Buyers and procurement** placing POs and managing supplier relationships.
- **Inventory analysts** tracking stock across locations.
- **Customer service / track-and-trace** answering "where's my order."
- **Plant logistics** coordinating raw material delivery and finished goods shipment.
- **Last-mile coordinators** managing courier routes.
- **Executives** consuming supply chain dashboards (especially in disrupted times).

Settings span warehouse floor (handhelds, voice picking, AR), trucking cabs, port operations, broker offices, and corporate. Same data through different surfaces.

## Jobs to be done

- Pick today's orders correctly and on time.
- Dispatch trucks against committed delivery windows.
- Decide where to source a shortage from.
- Track a shipment in transit.
- Confirm delivery and reconcile.
- Forecast next quarter's demand.
- Plan production against demand.
- Manage carrier performance and rates.
- Clear customs efficiently.
- Respond to a disruption (port strike, weather, supplier failure).
- Diagnose why orders are late.

## Representative tables

### Warehouse order / pick wave table
Each row an order or a batch of orders. Columns: order #, customer, items, weight, ship date, carrier, status. Row scale: hundreds per wave, thousands per day. Color on priority and status.

### Pick list (handheld)
Each row an item to pick. Columns: bin, SKU, qty, order #. Row scale: dozens per pick path. Optimized for scanning — minimal columns, high readability.

### Wave management table
Each row a wave. Columns: wave ID, orders, items, planned start, current status, picker count. Row scale: dozens per shift.

### Inbound receipt table
Each row an incoming shipment. Columns: PO #, supplier, ETA, status, items expected, items received, discrepancies. Row scale: dozens per day.

### Putaway table
Each row a received item awaiting putaway. Columns: SKU, qty, suggested location, putaway by. Row scale: hundreds per shift.

### Cycle count / inventory adjustment table
Each row a cycle count task. Columns: location, SKU, expected, counted, variance, counter. Row scale: dozens per shift.

### Inventory positions table
Each row a SKU at a location. Columns: SKU, description, on hand, allocated, available, in transit, on order. Row scale: thousands to millions.

### Shipment / load table
Each row a shipment or load. Columns: BOL #, customer, carrier, weight, pieces, pickup, delivery window, status, current location. Row scale: hundreds per day.

### In-transit / track-and-trace table
Each row a shipment in transit. Columns: tracking #, carrier, origin, destination, scheduled delivery, status, ETA, last event, exceptions. Row scale: thousands. Sort by ETA. Color on exceptions.

### Carrier scorecard table
Each row a carrier. Columns: name, shipments, on-time %, damage rate, cost per mile, claims. Row scale: dozens to hundreds.

### Driver / asset table
Each row a driver or vehicle. Columns: ID, location, status (available / loaded / unloading / OOS), HOS hours remaining, current load. Row scale: dozens to thousands.

### Route / stop table
Each row a stop on a route. Columns: stop #, address, time window, items, status. Row scale: dozens per route.

### Last-mile dispatch table
Each row an active delivery. Columns: order, courier, status (assigned / en route / arrived / delivered / failed), customer, ETA, delay. Row scale: dozens to thousands. Live updates.

### Freight quote / tender table
Each row a tender. Columns: lane, mode, weight, requested pickup, carrier, rate, status. Row scale: dozens per day.

### Purchase order table
Each row a PO. Columns: PO #, supplier, items, total, expected delivery, status, % received. Row scale: dozens to hundreds.

### Supplier table
Each row a supplier. Columns: name, category, lead time, on-time %, quality score, contract status. Row scale: hundreds to thousands.

### Demand forecast table
Each row a SKU × period (or location × SKU × period). Columns: forecast, actual (if past), bias, accuracy. Row scale: thousands. Editable in collaborative planning workflows.

### Inventory plan / stock projection table
Each row a SKU × period. Columns: starting inventory, demand, supply, ending inventory, target, gap. Row scale: thousands. Forward-looking simulation.

### Stockout / shortage table
Each row a SKU at risk. Columns: SKU, location, on hand, demand, days of cover, severity, supply ETA. Row scale: dozens to hundreds.

### Reorder / replenishment table
Each row a replenishment recommendation. Columns: SKU, location, recommended qty, supplier, lead time, expected. Row scale: hundreds.

### Customs / international shipment table
Each row a shipment. Columns: shipment #, origin country, destination, HTS code, value, status (filed / cleared / inspection / released), broker. Row scale: dozens per day.

### EDI document table
Each row an EDI document (850 PO, 856 ASN, 810 invoice, 944 receipt, etc.). Columns: doc type, partner, sent/received, status, errors. Row scale: hundreds per day.

### Warehouse labor table
Each row an employee. Columns: name, current task, productivity (units per hour), current shift, hours worked. Row scale: dozens.

### Yard management table
Each row a trailer or container in the yard. Columns: trailer #, gate-in time, location, status (loading / unloading / waiting / empty), assigned door. Row scale: dozens to hundreds.

### Cross-dock table
Each row a cross-dock event. Columns: inbound load, outbound load, items, status, timing. Row scale: dozens.

### Returns / reverse logistics table
Each row a return. Columns: RMA, original order, customer, status, disposition (restock / refurb / scrap). Row scale: hundreds per week.

### Disruption / risk table
Each row a flagged risk. Columns: type (supplier issue / port congestion / weather / strike), affected SKUs / lanes, severity, mitigation, owner. Row scale: dozens.

## Behaviors and needs

- **Mobile-first for field roles.** Handheld pick lists, driver apps, yard tablets all need touch-friendly, scan-friendly tables.
- **Status-driven color.** Order status, shipment status, exception flags.
- **Time-window awareness.** Pickup windows, delivery windows, dock appointments. Color as windows approach.
- **Sort by ETA, by priority, by route order.** Universal.
- **Filter by carrier, by lane, by SKU, by location.** Saved.
- **Bulk action.** Assign loads to drivers, release waves, reassign POs.
- **Map linkage.** Routes on maps, shipment positions on maps.
- **Handheld scan integration.** Scan a barcode → row updates.
- **Voice picking integration.** Some tables drive voice instructions to pickers.
- **Live tracking.** Shipment positions update from carrier ELD or GPS feeds.
- **Audit trail.** Every status change, every assignment, every exception logged.
- **Drill into shipment / order detail.** Universal.
- **Compare plan vs actual.** Forecast vs actual, planned receipt vs actual, scheduled vs delivered.
- **Per-row exceptions.** Flag damaged shipments, missing items, customs holds.
- **Print labels and BOLs.** From the row.
- **Time zone awareness.** Shipments span zones; ETAs need to be unambiguous.
- **Currency awareness.** International procurement.
- **Multi-language for global operations.**
- **Bulk import.** POs, demand forecasts, EDI batches loaded en masse.
- **Real-time KPIs in dashboards.** OTIF (on-time-in-full), fill rate, inventory turns.
- **Tagging.** Labels for regions, customers, special handling.

## Frustrations

- A pick list that doesn't update when an item is short, sending the picker to an empty bin.
- Inventory tables with cached on-hand values that don't reflect recent transactions.
- Shipment tracking that says "in transit" without a recent location update.
- ETA columns that don't account for traffic / weather / driver hours.
- Carrier scorecards that don't normalize for lane mix.
- Demand forecast tables that don't show forecast accuracy alongside the forecast.
- Yard management tables that lose track of trailers, leading to "ghost" trailers.
- EDI tables that show "errors" without explaining what's wrong.
- Customs tables that don't surface duty / tax detail.
- Mobile pick list rendering that requires zoom to read.
- Handheld scan integration that lags behind the user, leading to duplicate scans.
- A returns table that doesn't link to the original order.
- A stockout table that doesn't show the in-transit inventory that could close the gap.
- Disruption tables that don't tie to specific affected orders.

## Domain-specific notes

- **Mobile and handheld are dominant.** Warehouse, driver, yard, last-mile all use small screens with rugged hardware. The table component must look right at small sizes and big-touch-target sizes.
- **Real-time tracking is increasingly the expectation.** Customers want to see their shipment move; ops wants ELD-driven ETAs. Tables show live updates.
- **EDI is the lingua franca.** Every supply chain transaction has an EDI counterpart. Tables for EDI exception management are unique to this domain.
- **Cross-organization data flows.** Suppliers, carriers, brokers, customers all share data. Tables show data from many sources with different freshness and reliability.
- **Print is operational.** BOLs, packing lists, customs documents, pick lists. Some printed; some printed and scanned.
- **Audit trails for chain-of-custody.** Required for regulated goods and increasingly common everywhere.
- **Time and time zones.** Shipments span continents; tables need unambiguous time handling.
- **Status complexity.** A shipment can be tendered, picked-up, in-transit, out-for-delivery, attempted, delivered, exception, returned. Tables must accommodate many states without losing clarity.
- **Visual coordination with maps and 3D warehouse views.** Tables alone are insufficient for spatial work.
- **Robotics integration.** AS/RS, AGVs, AMRs are increasingly behind tables. The "row" may represent a robot's task.
- **Disruption response is tabular.** When a port closes or a supplier fails, planners work in tables to decide reallocation.
- **Demand planning is collaborative.** Tables in S&OP processes involve sales, operations, finance editing the same forecast.
- **The plan vs actual pattern is universal.** Forecast vs actual, planned vs received, scheduled vs delivered. Variance columns everywhere.
- **Sustainability and carbon reporting** are joining standard supply chain tables.
- **Globalization sensitivities.** Currency, language, customs codes (HTS), incoterms. Tables must accommodate.
- **Track-and-trace is a public-facing pattern** when the customer sees their shipment. Different rendering, simpler data.
