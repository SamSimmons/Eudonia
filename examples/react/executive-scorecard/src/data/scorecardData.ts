import type { TreemapNode } from "eudonia/components";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export const KPIS = [
  { label: "Gross Margin %", value: "42.5%", row: 1 },
  { label: "Total Revenue", value: "$235M", row: 2 },
  { label: "Number of Customers", value: "80", row: 3 },
  { label: "Number of Products", value: "5", row: 4 },
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

export const MANAGERS = [
  { name: "Andrew", value: "45%", trend: [38, 41, 39, 44, 42, 46, 45, 48, 47, 50, 49, 52] },
  { name: "Annelie", value: "37.8%", trend: [36, 37, 36, 36, 37, 37, 38, 37, 38, 38, 38, 38] },
  { name: "Carlos", value: "38.5%", trend: [42, 40, 36, 32, 30, 29, 31, 34, 37, 38, 39, 39] },
  { name: "Tina", value: "53.8%", trend: [53, 54, 53, 54, 54, 53, 54, 54, 53, 54, 54, 54] },
  { name: "Valery", value: "47.2%", trend: [58, 56, 55, 53, 52, 50, 49, 49, 48, 48, 47, 47] },
] as const;

export const VARIANCE_BY_MONTH = [
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

export const GROSS_MARGIN_BY_MONTH = GROSS_MARGIN_BARS.map((gmPct, i) => ({
  month: MONTHS[i],
  gmPct,
}));

export const GROSS_MARGIN_BY_BU = GROSS_MARGIN_BARS.map((actual, i) => ({
  bu: MONTHS[i],
  actual,
  scenario: Math.max(actual - 8 + (i % 3) * 4, 12),
}));

export const REVENUE_BY_MONTH_SCENARIO = REVENUE_BARS.map(([actual, scenario], i) => ({
  month: MONTHS[i],
  actual,
  scenario,
}));

export const TARGET_VS_ACTUAL = TARGETS.map((target) => {
  const lowBound = Math.round(target.budget * 0.6);
  const midBound = Math.round(target.budget * 0.9);
  const highBound = Math.round(target.budget * 1.1);

  return {
    label: target.label,
    low: lowBound,
    mid: midBound - lowBound,
    high: highBound - midBound,
    actual: target.actual,
    target: target.budget,
    value: target.value,
  };
});

export const GROWTH_ROWS = [
  { product: "Droga", totalRevenue: 7362616, lyRevenue: 7458542, yoyRevGrowth: -1.3 },
  { product: "Gladius", totalRevenue: 90906436, lyRevenue: 15227134, yoyRevGrowth: 288.1 },
  { product: "Gunner", totalRevenue: 78300, lyRevenue: "-", yoyRevGrowth: "-" },
  { product: "MI-72", totalRevenue: 690550, lyRevenue: "-", yoyRevGrowth: "-" },
  { product: "Primus", totalRevenue: 120834182, lyRevenue: 25728279, yoyRevGrowth: 369.7 },
  { product: "Svova", totalRevenue: 8511302, lyRevenue: 1493617, yoyRevGrowth: 469.8 },
] as const;

export const REVENUE_BY_REGION: TreemapNode = {
  name: "Regions",
  children: [
    { name: "North", value: 92 },
    { name: "East", value: 64 },
    { name: "South", value: 38 },
    { name: "West", value: 22 },
    { name: "Central", value: 9 },
  ],
};
