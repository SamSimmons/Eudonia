import "eudonia/theme.css";
import "eudonia/components.css";
import { TableCard } from "eudonia/components";

const ROWS = [
  { product: "Droga", revenue: 7362616, growth: -1.3 },
  { product: "Gladius", revenue: 90906436, growth: 288.1 },
  { product: "Primus", revenue: 120834182, growth: 369.7 },
];

export function TableCardPage() {
  return (
    <div
      data-testid="table-card-page"
      style={{ padding: 24, width: 720, fontFamily: "system-ui" }}
    >
      <TableCard
        data-testid="card"
        title="Year over Year"
        subtitle="By Product"
        data={ROWS}
        columns={[
          { key: "product", label: "Product" },
          { key: "revenue", label: "Revenue", format: "currency-compact" },
          {
            key: "growth",
            label: "Growth",
            format: "percent",
            signal: "delta",
            defaultSort: "desc",
          },
        ]}
      />
    </div>
  );
}
