import { Grid, GridItem, Screen } from "eudonia/layout";
import {
  Bar,
  BarChart,
  BarOverlay,
  BarTick,
  Chart,
  ChartCard,
  Gridlines,
  LineChart,
  ReferenceLine,
  Sparkline,
  StatCard,
  TreemapChart,
  XAxis,
  YAxis,
  type TreemapNode,
} from "eudonia/components";

const BOARD_COLUMNS = ["1fr", "2fr", "1fr", "1fr"] as const;
const BOARD_ROWS = [24, "1fr", "1fr", "1fr", "1fr", "1fr", "1fr", "1fr"] as const;
const BOARD_GAP = 6;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

const KPIS = [
  { label: "Gross Margin %", value: "42.5%", row: 2 },
  { label: "Total Revenue", value: "$235M", row: 3 },
  { label: "Number of Customers", value: "80", row: 4 },
  { label: "Number of Products", value: "5", row: 5 },
] as const;

const GROSS_MARGIN_BARS = [64, 58, 66, 50, 61, 53, 55, 48, 57, 44, 51, 29] as const;
const REVENUE_BARS = [
  [38, 42],
  [40, 48],
  [44, 46],
  [43, 45],
  [41, 44],
  [46, 45],
  [43, 47],
  [56, 53],
  [58, 55],
  [61, 59],
  [65, 62],
  [42, 48],
] as const;

const TARGETS = [
  { label: "Andrew Ma", actual: 42, budget: 58, value: "$64.7M" },
  { label: "Annelie Zubar", actual: 54, budget: 51, value: "$61.5M" },
  { label: "Carlos Grilo", actual: 74, budget: 49, value: "$71.4M" },
  { label: "Tina Lasula", actual: 26, budget: 24, value: "$23.4M" },
  { label: "Valery Uzhakov", actual: 17, budget: 19, value: "$17.2M" },
] as const;

const MANAGERS = [
  { name: "Andrew", value: "45%", trend: [38, 41, 39, 44, 42, 46, 45, 48, 47, 50, 49, 52] },
  { name: "Annelie", value: "37.8%", trend: [36, 37, 36, 36, 37, 37, 38, 37, 38, 38, 38, 38] },
  { name: "Carlos", value: "38.5%", trend: [42, 40, 36, 32, 30, 29, 31, 34, 37, 38, 39, 39] },
  { name: "Tina", value: "53.8%", trend: [53, 54, 53, 54, 54, 53, 54, 54, 53, 54, 54, 54] },
  { name: "Valery", value: "47.2%", trend: [58, 56, 55, 53, 52, 50, 49, 49, 48, 48, 47, 47] },
] as const;

const VARIANCE_BY_MONTH = [
  { month: "Jan", varPct: 4.2 },
  { month: "Feb", varPct: -12.5 },
  { month: "Mar", varPct: 9.8 },
  { month: "Apr", varPct: 3.1 },
  { month: "May", varPct: 1.4 },
  { month: "Jun", varPct: 5.6 },
  { month: "Jul", varPct: 2.3 },
  { month: "Aug", varPct: 6.9 },
  { month: "Sep", varPct: 4.8 },
  { month: "Oct", varPct: 7.2 },
  { month: "Nov", varPct: 3.5 },
  { month: "Dec", varPct: -2.1 },
] as const;

const GROSS_MARGIN_BY_MONTH = GROSS_MARGIN_BARS.map((gmPct, i) => ({
  month: MONTHS[i],
  gmPct,
}));

const GROSS_MARGIN_BY_BU = GROSS_MARGIN_BARS.map((actual, i) => ({
  bu: MONTHS[i],
  actual,
  scenario: Math.max(actual - 8 + (i % 3) * 4, 12),
}));

const REVENUE_BY_MONTH_SCENARIO = REVENUE_BARS.map(([actual, scenario], i) => ({
  month: MONTHS[i],
  actual,
  scenario,
}));

// Target vs Actual: three stacked segments (low / mid / high) form a tiered
// range background; `actual` overlays on top; `target` is drawn as a tick.
const TARGET_VS_ACTUAL = TARGETS.map((t) => {
  const lowBound = Math.round(t.budget * 0.6);
  const midBound = Math.round(t.budget * 0.9);
  const highBound = Math.round(t.budget * 1.1);
  return {
    label: t.label,
    low: lowBound,
    mid: midBound - lowBound,
    high: highBound - midBound,
    actual: t.actual,
    target: t.budget,
    value: t.value,
  };
});

const REVENUE_BY_REGION: TreemapNode = {
  name: "Regions",
  children: [
    { name: "North", value: 92 },
    { name: "East", value: 64 },
    { name: "South", value: 38 },
    { name: "West", value: 22 },
    { name: "Central", value: 9 },
  ],
};

function toggleTheme() {
  const el = document.documentElement;
  const current = el.dataset.theme;
  const system = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const effective = current ?? system;
  el.dataset.theme = effective === "dark" ? "light" : "dark";
}

export default function App() {
  return (
    <Screen className="scorecard-page">
      <Grid
        aria-label="Customer profitability dashboard"
        className="scorecard-board"
        columns={BOARD_COLUMNS}
        gap={BOARD_GAP}
        padding={5}
        rows={BOARD_ROWS}
      >
        <GridItem className="scorecard-toolbar" column={1} columnSpan={4} row={1}>
          <div className="scorecard-search">Ask a question about your data</div>
        </GridItem>

        {KPIS.map((kpi) => (
          <GridItem column={1} key={kpi.label} row={kpi.row}>
            <StatCard title={kpi.label} value={kpi.value} className="kpi-tile" />
          </GridItem>
        ))}

        <GridItem column={1} row={6}>
          <ChartCard title="Gross Margin %" subtitle="By Month">
            <LineChart
              data={GROSS_MARGIN_BY_MONTH}
              dataKey="gmPct"
              margin={{ top: 8, right: 8, bottom: 20, left: 35 }}
              yAxis={{ density: "low", tickFormat: (v) => `${v}%` }}
            />
          </ChartCard>
        </GridItem>

        <GridItem column={1} row={7}>
          <ChartCard title="Total Revenue" subtitle="by Region">
            <TreemapChart data={REVENUE_BY_REGION} aria-label="Total Revenue by Region" />
          </ChartCard>
        </GridItem>

        <GridItem column={2} row={2} rowSpan={2}>
          <ChartCard title="Gross Margin %" subtitle="by Business Unit, Scenario">
            <BarChart
              data={GROSS_MARGIN_BY_BU}
              dataKey={["actual", "scenario"]}
              xKey="bu"
              margin={{ top: 8, right: 8, bottom: 20, left: 35 }}
              yAxis={{ preferredTickCount: 5, tickFormat: (v) => `${v}%` }}
              barGroupPadding="1px"
              bandPadding={{ outer: "10px", inner: "10px" }}
            />
          </ChartCard>
        </GridItem>

        <GridItem column={2} row={4} rowSpan={2}>
          <ChartCard title="Total Revenue" subtitle="by Month, Scenario">
            <BarChart
              data={REVENUE_BY_MONTH_SCENARIO}
              dataKey={["actual", "scenario"]}
              xKey="month"
              margin={{ top: 8, right: 8, bottom: 20, left: 35 }}
              yAxis={{ preferredTickCount: 5 }}
              barGroupPadding="1px"
              bandPadding={{ outer: "10px", inner: "10px" }}
            />
          </ChartCard>
        </GridItem>

        <GridItem className="tile" column={2} row={6} rowSpan={2}>
          <h2 className="tile-title">Year Over Year Revenue Growth</h2>
          <div className="tile-subtitle">by Product</div>
          <table className="growth-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Total Revenue</th>
                <th>LY Revenue</th>
                <th>YoY Rev Growth</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Droga</td>
                <td>$7,362,616</td>
                <td>$7,458,542</td>
                <td className="growth-table__cell--negative">-1.3%</td>
              </tr>
              <tr>
                <td>Gladius</td>
                <td>$90,906,436</td>
                <td>$15,227,134</td>
                <td className="growth-table__cell--positive">288.1%</td>
              </tr>
              <tr>
                <td>Gunner</td>
                <td>$78,300</td>
                <td>-</td>
                <td>-</td>
              </tr>
              <tr>
                <td>MI-72</td>
                <td>$690,550</td>
                <td>-</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Primus</td>
                <td>$120,834,182</td>
                <td>$25,728,279</td>
                <td className="growth-table__cell--positive">369.7%</td>
              </tr>
              <tr>
                <td>Svova</td>
                <td>$8,511,302</td>
                <td>$1,493,617</td>
                <td className="growth-table__cell--positive">469.8%</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Grand Total</td>
                <td>$196,593,985</td>
                <td>$49,907,572</td>
                <td className="growth-table__cell--positive">293.9%</td>
              </tr>
            </tfoot>
          </table>
        </GridItem>

        <GridItem column={3} columnSpan={2} row={2} rowSpan={2}>
          <ChartCard title="Target vs Actual" subtitle="by Executive">
            <Chart
              data={TARGET_VS_ACTUAL}
              yKey="label"
              yType="band"
              xType="linear"
              margin={{ top: 8, right: 24, bottom: 20, left: 100 }}
              bandPadding={{ inner: "25%", outer: "10%" }}
            >
              <Gridlines />
              <Bar dataKey="low" stackId="range" fill="oklch(0.7 0.17 25)" />
              <Bar dataKey="mid" stackId="range" fill="oklch(0.82 0.14 90)" />
              <Bar dataKey="high" stackId="range" fill="oklch(0.72 0.16 150)" />
              <BarOverlay
                dataKey="actual"
                size={0.35}
                fill="oklch(0.4 0.14 250)"
              />
              <BarTick
                dataKey="target"
                size={1}
                stroke="oklch(0.6 0.2 25)"
                strokeWidth={3}
              />
              <XAxis />
              <YAxis />
            </Chart>
          </ChartCard>
        </GridItem>

        {MANAGERS.map((manager, index) => (
          <GridItem className="manager-card__metric" column={3} key={`${manager.name}-metric`} row={index + 4}>
            <h2 className="tile-title">{manager.name} Gross Margin %</h2>
            <div className="manager-card__value">{manager.value}</div>
          </GridItem>
        ))}

        {MANAGERS.map((manager, index) => (
          <GridItem className="manager-card__trend" column={4} key={`${manager.name}-trend`} row={index + 4}>
            <h2 className="tile-title">{manager.name} Gross Margin Trend</h2>
            <div className="tile-subtitle">by Month, Executive</div>
            <div className="mini-chart">
              <Sparkline values={manager.trend} />
            </div>
          </GridItem>
        ))}

        <GridItem column={1} columnSpan={2} row={8}>
          <ChartCard title="Revenue % Variance to Budget" subtitle="By Month">
            <LineChart
              data={VARIANCE_BY_MONTH}
              dataKey="varPct"
              margin={{ top: 12, right: 16, bottom: 24, left: 30 }}
              yAxis={{ tickFormat: (v) => `${v}%` }}
            >
              <ReferenceLine y={0} />
            </LineChart>
          </ChartCard>
        </GridItem>
      </Grid>
      <button className="theme-toggle" onClick={toggleTheme} type="button">
        💡
      </button>
    </Screen>
  );
}
