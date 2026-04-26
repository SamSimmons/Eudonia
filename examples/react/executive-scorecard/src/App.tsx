import { useState } from "react";

import type { PaletteProp } from "eudonia/color";
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
  StatCard,
  TableCard,
  TreemapChart,
  XAxis,
  YAxis,
} from "eudonia/components";

import { DevMenu } from "./DevMenu";
import {
  GROSS_MARGIN_BY_BU,
  GROSS_MARGIN_BY_MONTH,
  GROWTH_ROWS,
  KPIS,
  MANAGERS,
  REVENUE_BY_MONTH_SCENARIO,
  REVENUE_BY_REGION,
  TARGET_VS_ACTUAL,
  VARIANCE_BY_MONTH,
} from "./data/scorecardData";

const BOARD_COLUMNS = ["1fr", "2fr", "1fr", "1fr"] as const;
const BOARD_ROWS = ["1fr", "1fr", "1fr", "1fr", "1fr", "1fr", "1fr"] as const;
const BOARD_GAP = 12;

export default function App() {
  const [palette, setPalette] = useState<PaletteProp>("default");

  return (
    <Screen palette={palette}>
      <Grid
        aria-label="Customer profitability dashboard"
        columns={BOARD_COLUMNS}
        gap={BOARD_GAP}
        padding={12}
        rows={BOARD_ROWS}
      >
        {KPIS.map((kpi) => (
          <GridItem column={1} key={kpi.label} row={kpi.row}>
            <StatCard title={kpi.label} value={kpi.value} />
          </GridItem>
        ))}

        <GridItem column={1} row={5}>
          <ChartCard title="Gross Margin %" subtitle="By Month">
            <LineChart
              data={GROSS_MARGIN_BY_MONTH}
              dataKey="gmPct"
              margin={{ top: 8, right: 8, bottom: 20, left: 35 }}
              yAxis={{ density: "low", tickFormat: (v) => `${v}%` }}
            />
          </ChartCard>
        </GridItem>

        <GridItem column={1} row={6}>
          <ChartCard title="Total Revenue" subtitle="by Region">
            <TreemapChart data={REVENUE_BY_REGION} aria-label="Total Revenue by Region" />
          </ChartCard>
        </GridItem>

        <GridItem column={2} row={1} rowSpan={2}>
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

        <GridItem column={2} row={3} rowSpan={2}>
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

        <GridItem column={2} row={5} rowSpan={2}>
          <TableCard
            title="Year Over Year Revenue Growth"
            subtitle="by Product"
            data={GROWTH_ROWS}
            columns={[
              { key: "product", label: "Product" },
              { key: "totalRevenue", label: "Total Revenue", format: "currency-compact" },
              { key: "lyRevenue", label: "LY Revenue", format: "currency-compact" },
              { key: "yoyRevGrowth", label: "YoY Rev Growth", format: "percent", signal: "delta" },
            ]}
            footer={{
              product: "Grand Total",
              totalRevenue: { agg: "sum" },
              lyRevenue: { agg: "sum" },
              yoyRevGrowth: (rows) => {
                let total = 0;
                let ly = 0;
                for (const r of rows) {
                  if (typeof r.totalRevenue !== "number" || typeof r.lyRevenue !== "number") continue;
                  total += r.totalRevenue;
                  ly += r.lyRevenue;
                }
                if (ly === 0) return "-";
                const blended = ((total - ly) / ly) * 100;
                return `${blended.toFixed(1)}%`;
              },
            }}
          />
        </GridItem>

        <GridItem column={3} columnSpan={2} row={1} rowSpan={2}>
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
              <Bar dataKey="low" stackId="range" />
              <Bar dataKey="mid" stackId="range" />
              <Bar dataKey="high" stackId="range" />
              <BarOverlay dataKey="actual" size={0.35} />
              <BarTick dataKey="target" size={1} strokeWidth={3} />
              <XAxis />
              <YAxis />
            </Chart>
          </ChartCard>
        </GridItem>

        {MANAGERS.map((manager, index) => (
          <GridItem column={3} key={`${manager.name}-metric`} row={index + 3}>
            <StatCard title={`${manager.name} Gross Margin %`} value={manager.value} />
          </GridItem>
        ))}

        {MANAGERS.map((manager, index) => (
          <GridItem column={4} key={`${manager.name}-trend`} row={index + 3}>
            <StatCard title={`${manager.name} Gross Margin Trend`}>
              <StatCard.Body>
                <StatCard.Sparkline
                  aria-label={`${manager.name} gross margin trend by month`}
                  fill
                  values={manager.trend}
                />
              </StatCard.Body>
            </StatCard>
          </GridItem>
        ))}

        <GridItem column={1} columnSpan={2} row={7}>
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
      <DevMenu onPaletteChange={setPalette} />
    </Screen>
  );
}
