import { Flex, FlexItem, Screen } from "eudonia";

type Kpi = {
  label: string;
  value: string;
  accent?: string;
};

type ManagerCard = {
  name: string;
  value: string;
  accent: string;
  trendClassName: string;
};

const kpis: Kpi[] = [
  { label: "Gross Margin %", value: "42.5%" },
  { label: "Total Revenue", value: "$235M" },
  { label: "Number of Customers", value: "80" },
  { label: "Number of Products", value: "5" },
];

const managers: ManagerCard[] = [
  {
    name: "Andrew",
    value: "45%",
    accent: "#74d6d4",
    trendClassName: "trend-line trend-line--upward",
  },
  {
    name: "Annelie",
    value: "37.8%",
    accent: "#9aa1a5",
    trendClassName: "trend-line trend-line--steady",
  },
  {
    name: "Carlos",
    value: "38.5%",
    accent: "#77ded8",
    trendClassName: "trend-line trend-line--rebound",
  },
  {
    name: "Tina",
    value: "53.8%",
    accent: "#a3aaae",
    trendClassName: "trend-line trend-line--steady",
  },
  {
    name: "Valery",
    value: "47.2%",
    accent: "#ff8b8b",
    trendClassName: "trend-line trend-line--downward",
  },
];

const SHELL_GAP = 6;

export default function App() {
  return (
    <Screen>
      <main className="scorecard-page">
        <section className="scorecard-board" aria-label="Customer profitability dashboard scaffold">
          <header className="scorecard-toolbar">
            <div className="scorecard-search">Ask a question about your data</div>
          </header>

          <Flex className="scorecard-shell" gap={SHELL_GAP}>
            <FlexItem basis={103}>
              <Flex
                aria-label="Headline metrics"
                className="scorecard-rail"
                direction="column"
                gap={SHELL_GAP}
                role="group"
              >
                {kpis.map((kpi) => (
                  <FlexItem basis={104} className="tile tile--kpi" key={kpi.label}>
                    <h2 className="tile-title">{kpi.label}</h2>
                    <div className="kpi-value">{kpi.value}</div>
                  </FlexItem>
                ))}

                <FlexItem className="tile tile--map" grow>
                  <h2 className="tile-title">{kpi.label}</h2>
                  <div className="map-placeholder">
                    <div className="map-block map-block--north">North</div>
                    <div className="map-block map-block--east">East</div>
                    <div className="map-block map-block--west">West</div>
                    <div className="map-block map-block--south">South</div>
                    <div className="map-block map-block--tiny" />
                  </div>
                </FlexItem>
              </Flex>
            </FlexItem>

            <FlexItem grow>
              <section className="scorecard-main" aria-label="Analytical tiles">
                <div className="main-row main-row--top">
                  <article className="tile tile--chart tile--gm">
                    <h2 className="tile-title">Gross Margin %</h2>
                    <div className="tile-subtitle">by Product, Executive</div>
                    <div className="bar-chart">
                      {["60%", "50%", "40%", "30%", "20%", "10%", "0%"].map((tick) => (
                        <span className="chart-axis-label" key={tick}>
                          {tick}
                        </span>
                      ))}
                      <div className="bar-chart-bars" aria-hidden="true">
                        {[64, 58, 66, 50, 61, 53, 55, 48, 57, 44, 51, 29].map((height, index) => (
                          <div className="bar-pair" key={index}>
                            <span className="bar bar--teal" style={{ height: `${height}%` }} />
                            <span
                              className="bar bar--slate"
                              style={{ height: `${Math.max(height - 8 + (index % 3) * 4, 12)}%` }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>

                  <article className="tile tile--target">
                    <h2 className="tile-title">Target vs Actual</h2>
                    <div className="tile-subtitle">by Executive</div>
                    <div className="target-list">
                      {[
                        ["Andrew", "$64.7M", 74, 61],
                        ["Annelie Zubair", "$61.5M", 71, 63],
                        ["Carlos Grilo", "$71.4M", 84, 69],
                        ["Tina Lasula", "$23.4M", 34, 22],
                        ["Valery Uhakov", "$17.2M", 23, 18],
                      ].map(([label, value, actual, budget]) => (
                        <div className="target-row" key={label}>
                          <span className="target-label">{label}</span>
                          <div className="target-bars">
                            <span className="target-bar target-bar--actual" style={{ width: `${actual}%` }} />
                            <span className="target-bar target-bar--budget" style={{ width: `${budget}%` }} />
                          </div>
                          <span className="target-value">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="target-legend">
                      <span className="legend-item">
                        <span className="legend-swatch legend-swatch--actual" />
                        <span>Actual</span>
                      </span>
                      <span className="legend-item">
                        <span className="legend-swatch legend-swatch--budget" />
                        <span>Budget</span>
                      </span>
                    </div>
                  </article>
                </div>

                <div className="main-row main-row--middle">
                  <article className="tile tile--chart tile--revenue">
                    <h2 className="tile-title">Total Revenue</h2>
                    <div className="tile-subtitle">by Month, Scenario</div>
                    <div className="revenue-chart">
                      <div className="revenue-bars" aria-hidden="true">
                        {[
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
                        ].map(([actual, budget], index) => (
                          <div className="bar-pair bar-pair--wide" key={index}>
                            <span className="bar bar--teal" style={{ height: `${actual}%` }} />
                            <span className="bar bar--slate" style={{ height: `${budget}%` }} />
                          </div>
                        ))}
                      </div>
                      <div className="month-axis">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                          (month) => (
                            <span key={month}>{month}</span>
                          ),
                        )}
                      </div>
                    </div>
                  </article>

                  <article className="tile tile--table">
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
                  </article>
                </div>

                <article className="tile tile--line">
                  <h2 className="tile-title">Revenue % Variance to Budget</h2>
                  <div className="tile-subtitle">by Month</div>
                  <div className="line-chart">
                    <div className="line-chart__grid" aria-hidden="true" />
                    <div className="line-chart__path line-chart__path--variance" />
                    <div className="month-axis month-axis--compact">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                        (month) => (
                          <span key={month}>{month}</span>
                        ),
                      )}
                    </div>
                  </div>
                </article>
              </section>
            </FlexItem>

            <FlexItem basis={281}>
              <Flex
                aria-label="Manager rollups"
                className="scorecard-rail"
                direction="column"
                gap={SHELL_GAP}
                role="group"
              >
                {managers.map((manager) => (
                  <FlexItem className="manager-card" grow key={manager.name}>
                    <div className="manager-card__metric">
                      <h2 className="tile-title">{manager.name} Gross Margin %</h2>
                      <div className="manager-card__value">{manager.value}</div>
                    </div>
                    <div className="manager-card__trend">
                      <h2 className="tile-title">{manager.name} Gross Margin Trend</h2>
                      <div className="tile-subtitle">by Month, Executive</div>
                      <div className="mini-chart">
                        <div
                          className="mini-chart__accent"
                          aria-hidden="true"
                          style={{ backgroundColor: manager.accent }}
                        />
                        <div className={manager.trendClassName} />
                      </div>
                    </div>
                  </FlexItem>
                ))}
              </Flex>
            </FlexItem>
          </Flex>
        </section>
      </main>
    </Screen>
  );
}
