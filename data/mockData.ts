// Mock data for Supply Chain Pulse — AbbVie pharma supply chain

// ─── Types ───────────────────────────────────────────────────────────────────

export type TrendDirection = "up" | "down";
export type StatusColor = "green" | "amber" | "red";
export type RiskSeverity = "High" | "Medium" | "Low";
export type SupplierCategory = "API" | "Packaging" | "Logistics";
export type RiskCategory =
  | "Geopolitical"
  | "Supplier"
  | "Regulatory"
  | "Weather"
  | "Tariff"
  | "Capacity";

export interface KPI {
  id: string;
  label: string;
  value: number;
  target: number;
  unit: string;
  trend: TrendDirection;
  trendValue: string;
  status: StatusColor;
  history: number[];
}

export interface TherapeuticArea {
  area: string;
  monthsOfSupply: number;
  target: number;
  forecastAccuracy: number;
  otif: number;
  status: StatusColor;
}

export interface Supplier {
  name: string;
  category: SupplierCategory;
  score: number;
  onTimeDelivery: number;
  qualityScore: number;
  status: StatusColor;
}

export interface Initiative {
  id: string;
  name: string;
  owner: string;
  dueDate: string;
  progress: number;
  status: StatusColor;
  description: string;
  milestone: string;
}

export interface Risk {
  id: string;
  category: RiskCategory;
  title: string;
  description: string;
  severity: RiskSeverity;
  region: string;
  affectedProducts: string[];
}

export interface CashToCash {
  month: string;
  value: number;
}

// ─── 1. KPI Data ─────────────────────────────────────────────────────────────

export const KPI_DATA: KPI[] = [
  {
    id: "demand-forecast-accuracy",
    label: "Demand Forecast Accuracy",
    value: 87.4,
    target: 90,
    unit: "%",
    trend: "up",
    trendValue: "+1.2%",
    status: "amber",
    history: [82.1, 83.5, 84.0, 83.8, 85.2, 85.9, 86.1, 85.7, 86.4, 86.8, 87.0, 87.4],
  },
  {
    id: "perfect-order-rate",
    label: "Perfect Order Rate (OTIF)",
    value: 94.1,
    target: 96,
    unit: "%",
    trend: "down",
    trendValue: "-0.8%",
    status: "amber",
    history: [95.3, 95.7, 95.1, 94.8, 95.0, 95.4, 94.9, 94.6, 94.3, 94.5, 94.2, 94.1],
  },
  {
    id: "supply-chain-cost",
    label: "Supply Chain Cost % Revenue",
    value: 8.3,
    target: 7.5,
    unit: "%",
    trend: "up",
    trendValue: "+0.3%",
    status: "red",
    history: [7.6, 7.5, 7.7, 7.8, 7.9, 8.0, 7.9, 8.1, 8.0, 8.2, 8.1, 8.3],
  },
];

// ─── 2. Therapeutic Area Data ────────────────────────────────────────────────

export const THERAPEUTIC_AREA_DATA: TherapeuticArea[] = [
  {
    area: "Immunology",
    monthsOfSupply: 3.8,
    target: 3,
    forecastAccuracy: 91.2,
    otif: 96.8,
    status: "green",
  },
  {
    area: "Oncology",
    monthsOfSupply: 3.1,
    target: 3,
    forecastAccuracy: 88.5,
    otif: 94.7,
    status: "amber",
  },
  {
    area: "Neuroscience",
    monthsOfSupply: 2.9,
    target: 3,
    forecastAccuracy: 86.3,
    otif: 93.2,
    status: "amber",
  },
  {
    area: "Eye Care",
    monthsOfSupply: 3.2,
    target: 3,
    forecastAccuracy: 89.1,
    otif: 95.4,
    status: "green",
  },
  {
    area: "Aesthetics",
    monthsOfSupply: 2.4,
    target: 3,
    forecastAccuracy: 83.7,
    otif: 91.5,
    status: "red",
  },
];

// ─── 3. Supplier Performance ─────────────────────────────────────────────────

export const SUPPLIER_PERFORMANCE: Supplier[] = [
  {
    name: "Lonza Group",
    category: "API",
    score: 94,
    onTimeDelivery: 96.2,
    qualityScore: 98.5,
    status: "green",
  },
  {
    name: "Samsung Biologics",
    category: "API",
    score: 91,
    onTimeDelivery: 93.8,
    qualityScore: 97.1,
    status: "green",
  },
  {
    name: "West Pharmaceutical",
    category: "Packaging",
    score: 88,
    onTimeDelivery: 90.4,
    qualityScore: 95.8,
    status: "amber",
  },
  {
    name: "Schott AG",
    category: "Packaging",
    score: 85,
    onTimeDelivery: 87.6,
    qualityScore: 96.3,
    status: "amber",
  },
  {
    name: "DHL Life Sciences",
    category: "Logistics",
    score: 92,
    onTimeDelivery: 94.5,
    qualityScore: 97.8,
    status: "green",
  },
  {
    name: "Marken (UPS)",
    category: "Logistics",
    score: 79,
    onTimeDelivery: 82.3,
    qualityScore: 93.1,
    status: "red",
  },
];

// ─── 4. Strategic Initiatives ────────────────────────────────────────────────

export const INITIATIVES: Initiative[] = [
  {
    id: "init-001",
    name: "Singapore Biologics Expansion",
    owner: "VP Manufacturing",
    dueDate: "2026-09-30",
    progress: 62,
    status: "green",
    description:
      "New large-scale biologics manufacturing facility in Tuas, Singapore to support Skyrizi and Rinvoq volume growth across Asia-Pacific markets.",
    milestone: "Equipment qualification phase — on track",
  },
  {
    id: "init-002",
    name: "Blue Yonder Planning Rollout",
    owner: "SVP Supply Chain",
    dueDate: "2026-06-15",
    progress: 45,
    status: "amber",
    description:
      "Enterprise-wide deployment of Blue Yonder demand sensing and inventory optimization replacing legacy APO modules.",
    milestone: "UAT delayed 3 weeks — data migration issues",
  },
  {
    id: "init-003",
    name: "Supplier Risk Platform v2",
    owner: "Chief Procurement Officer",
    dueDate: "2026-04-30",
    progress: 78,
    status: "green",
    description:
      "AI-driven supplier risk scoring integrating financial health, geopolitical exposure, and ESG signals for Tier 1–3 suppliers.",
    milestone: "Pilot live with 120 critical suppliers",
  },
  {
    id: "init-004",
    name: "Cold Chain Digitization",
    owner: "VP Quality & Compliance",
    dueDate: "2026-12-01",
    progress: 31,
    status: "amber",
    description:
      "IoT-enabled real-time temperature monitoring across Botox and biologics cold chain with predictive excursion alerts.",
    milestone: "Sensor deployment 40% complete — EU lanes pending",
  },
  {
    id: "init-005",
    name: "Allergan Integration Program",
    owner: "Chief Integration Officer",
    dueDate: "2026-08-15",
    progress: 85,
    status: "green",
    description:
      "Final phase of Allergan supply chain network harmonization including ERP consolidation and distribution center rationalization.",
    milestone: "3 of 4 DCs migrated — LATAM DC in progress",
  },
];

// ─── 5. Risk Data ────────────────────────────────────────────────────────────

export const RISK_DATA: Risk[] = [
  {
    id: "risk-001",
    category: "Geopolitical",
    title: "Taiwan Strait Shipping Disruption",
    description:
      "Escalating military exercises near key shipping lanes threaten API supply from Taiwanese CDMO partners and transit routes for Asia-Pacific distribution.",
    severity: "High",
    region: "Asia-Pacific",
    affectedProducts: ["Rinvoq", "Venclexta"],
  },
  {
    id: "risk-002",
    category: "Supplier",
    title: "Lonza Capacity Constraint — Biologics",
    description:
      "Lonza Visp facility running at 94% utilization with limited surge capacity. Any unplanned downtime could impact Skyrizi bulk drug substance supply within 6 weeks.",
    severity: "High",
    region: "Europe",
    affectedProducts: ["Skyrizi", "Rinvoq"],
  },
  {
    id: "risk-003",
    category: "Regulatory",
    title: "EU MDR Packaging Compliance",
    description:
      "New EU Medical Device Regulation serialization requirements effective Q3 2026. Packaging line modifications needed at 3 European sites.",
    severity: "Medium",
    region: "Europe",
    affectedProducts: ["Botox", "Juvederm", "CoolSculpting"],
  },
  {
    id: "risk-004",
    category: "Weather",
    title: "Hurricane Season — Puerto Rico Facilities",
    description:
      "NOAA forecasts above-average Atlantic hurricane season. Barceloneta and Jayuya manufacturing sites in exposure zone with historical vulnerability.",
    severity: "Medium",
    region: "North America",
    affectedProducts: ["Lupron", "Synthroid", "AndroGel"],
  },
  {
    id: "risk-005",
    category: "Tariff",
    title: "US-China API Tariff Escalation",
    description:
      "Proposed 25% tariff increase on Chinese-origin intermediates and starting materials could raise COGS by $40–60M annually across small molecule portfolio.",
    severity: "High",
    region: "Global",
    affectedProducts: ["Mavyret", "Synthroid", "Creon"],
  },
  {
    id: "risk-006",
    category: "Capacity",
    title: "Botox Fill-Finish Bottleneck",
    description:
      "Westport fill-finish line operating at 91% capacity. Aesthetics demand surge in Q2/Q3 may exceed available slots, risking backorders in key markets.",
    severity: "Medium",
    region: "North America",
    affectedProducts: ["Botox Cosmetic", "Botox Therapeutic"],
  },
];

// ─── 6. Cash-to-Cash Cycle ───────────────────────────────────────────────────

export const CASH_TO_CASH: CashToCash[] = [
  { month: "Apr 2025", value: 68 },
  { month: "May 2025", value: 71 },
  { month: "Jun 2025", value: 69 },
  { month: "Jul 2025", value: 72 },
  { month: "Aug 2025", value: 74 },
  { month: "Sep 2025", value: 70 },
  { month: "Oct 2025", value: 67 },
  { month: "Nov 2025", value: 63 },
  { month: "Dec 2025", value: 61 },
  { month: "Jan 2026", value: 58 },
  { month: "Feb 2026", value: 55 },
  { month: "Mar 2026", value: 52 },
];
