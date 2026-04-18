import { Grid, GridItem, Screen } from "eudonia/layout";
import {
  Chart,
  Gridlines,
  Line,
  ReferenceLine,
  Sparkline,
  StatCard,
  XAxis,
  YAxis,
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

        <GridItem className="tile tile--sparkline" column={1} row={6}>
          <h2 className="tile-title">Gross Margin %</h2>
          <div className="tile-subtitle">by Month</div>
          <div className="tile-chart">
            <Chart data={GROSS_MARGIN_BY_MONTH} margin={{ top: 8, right: 8, bottom: 20, left: 8 }}>
              <Line dataKey="gmPct" />
              <XAxis hideAxisLine hideTicks />
            </Chart>
          </div>
        </GridItem>

        <GridItem className="tile tile--map" column={1} row={7}>
          <h2 className="tile-title">Total Revenue</h2>
          <div className="tile-subtitle">by Region</div>
          <div className="map-placeholder">
            <div className="map-block map-block--north">North</div>
            <div className="map-block map-block--east">East</div>
            <div className="map-block map-block--west">West</div>
            <div className="map-block map-block--south">South</div>
            <div className="map-block map-block--tiny" />
          </div>
        </GridItem>

        <GridItem className="tile tile--chart" column={2} row={2} rowSpan={2}>
          <h2 className="tile-title">Gross Margin %</h2>
          <div className="tile-subtitle">by Business Unit, Scenario</div>
          <div className="bar-chart">
            {["60%", "50%", "40%", "30%", "20%", "10%", "0%"].map((tick) => (
              <span className="chart-axis-label" key={tick}>
                {tick}
              </span>
            ))}
            <div className="bar-chart-bars" aria-hidden="true">
              {GROSS_MARGIN_BARS.map((height, index) => (
                <div className="bar-pair" key={MONTHS[index]}>
                  <span className="bar bar--teal" style={{ height: `${height}%` }} />
                  <span className="bar bar--slate" style={{ height: `${Math.max(height - 8 + (index % 3) * 4, 12)}%` }} />
                </div>
              ))}
            </div>
          </div>
        </GridItem>

        <GridItem className="tile tile--chart" column={2} row={4} rowSpan={2}>
          <h2 className="tile-title">Total Revenue</h2>
          <div className="tile-subtitle">by Month, Scenario</div>
          <div className="revenue-chart">
            <div className="revenue-bars" aria-hidden="true">
              {REVENUE_BARS.map(([actual, budget], index) => (
                <div className="bar-pair bar-pair--wide" key={MONTHS[index]}>
                  <span className="bar bar--teal" style={{ height: `${actual}%` }} />
                  <span className="bar bar--slate" style={{ height: `${budget}%` }} />
                </div>
              ))}
            </div>
            <div className="month-axis">
              {MONTHS.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
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

        <GridItem className="tile" column={3} columnSpan={2} row={2} rowSpan={2}>
          <h2 className="tile-title">Target vs Actual</h2>
          <div className="tile-subtitle">by Executive</div>
          <div className="target-list">
            {TARGETS.map((target) => (
              <div className="target-row" key={target.label}>
                <span className="target-label">{target.label}</span>
                <div className="target-bars" aria-hidden="true">
                  <span className="target-bar target-bar--actual" style={{ width: `${target.actual}%` }} />
                  <span className="target-bar target-bar--budget" style={{ width: `${target.budget}%` }} />
                </div>
                <span className="target-value">{target.value}</span>
              </div>
            ))}
          </div>
          <div className="target-legend">
            <span className="legend-item">
              <span className="legend-swatch legend-swatch--budget" />
              LY
            </span>
            <span className="legend-item">
              <span className="legend-swatch legend-swatch--actual" />
              Actual
            </span>
            <span className="legend-item">
              <span className="legend-swatch legend-swatch--budget" />
              Target
            </span>
          </div>
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

        <GridItem className="tile tile--line" column={1} columnSpan={2} row={8}>
          <h2 className="tile-title">Revenue % Variance to Budget</h2>
          <div className="tile-subtitle">by Month</div>
          <div className="tile-chart">
            <Chart data={VARIANCE_BY_MONTH} margin={{ top: 12, right: 16, bottom: 24, left: 36 }}>
              <Gridlines />
              <ReferenceLine y={0} />
              <Line dataKey="varPct" />
              <XAxis />
              <YAxis tickFormat={(v) => `${v as number}%`} numTicks={5} />
            </Chart>
          </div>
        </GridItem>
      </Grid>
      <button className="theme-toggle" onClick={toggleTheme} type="button">
        💡
      </button>
    </Screen>
  );
}
