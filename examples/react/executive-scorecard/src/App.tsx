import { Grid, GridItem, Screen } from "eudonia";

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
  { name: "Andrew", value: "45%", trendClass: "trend-line--upward" },
  { name: "Annelie", value: "37.8%", trendClass: "trend-line--steady" },
  { name: "Carlos", value: "38.5%", trendClass: "trend-line--rebound" },
  { name: "Tina", value: "53.8%", trendClass: "trend-line--steady" },
  { name: "Valery", value: "47.2%", trendClass: "trend-line--downward" },
] as const;

export default function App() {
  return (
    <Screen className="scorecard-page">
      <Grid
        aria-label="Customer profitability dashboard"
        className="scorecard-board"
        columns={BOARD_COLUMNS}
        gap={BOARD_GAP}
        rows={BOARD_ROWS}
      >
        <GridItem className="scorecard-toolbar" column={1} columnSpan={4} row={1}>
          <div className="scorecard-search">Ask a question about your data</div>
        </GridItem>

        {KPIS.map((kpi) => (
          <GridItem className="tile tile--kpi" column={1} key={kpi.label} row={kpi.row}>
            <h2 className="tile-title">{kpi.label}</h2>
            <div className="kpi-value">{kpi.value}</div>
          </GridItem>
        ))}

        <GridItem className="tile tile--sparkline" column={1} row={6}>
          <h2 className="tile-title">Gross Margin %</h2>
          <div className="tile-subtitle">by Month</div>
          <div className="sparkline-chart">
            <div className="sparkline-chart__path" />
            <div className="sparkline-axis">
              {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
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
              <div className={`trend-line ${manager.trendClass}`} />
            </div>
          </GridItem>
        ))}

        <GridItem className="tile tile--line" column={1} columnSpan={2} row={8}>
          <h2 className="tile-title">Revenue % Variance to Budget</h2>
          <div className="tile-subtitle">by Month</div>
          <div className="line-chart">
            <div className="line-chart__grid" aria-hidden="true" />
            <div className="line-chart__path line-chart__path--variance" />
            <div className="month-axis month-axis--compact">
              {MONTHS.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </GridItem>
      </Grid>
    </Screen>
  );
}
