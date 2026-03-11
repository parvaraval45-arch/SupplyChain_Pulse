// ═══════════════════════════════════════════════════════════════════════════════
// Mock data for Supply Chain Pulse — AbbVie ($61B pharma)
// All values synthetic, modeled on pharma industry supply chain benchmarks.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Shared Types ────────────────────────────────────────────────────────────

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
export type RiskType =
  | "GEOPOLITICAL"
  | "SUPPLIER"
  | "TARIFF"
  | "REGULATORY"
  | "WEATHER"
  | "CAPACITY";

// ─── 1. Tier 1 KPI ──────────────────────────────────────────────────────────

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
    // Monthly: Apr 2025 → Mar 2026 — gradual climb from post-Humira rebase
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
    // Slight erosion from Humira wind-down logistics and Aesthetics cold chain issues
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
    // Pressure from biologics ramp, dual-source strategy, tariff headwinds
    history: [7.6, 7.5, 7.7, 7.8, 7.9, 8.0, 7.9, 8.1, 8.0, 8.2, 8.1, 8.3],
  },
];

// ─── 2. Therapeutic Area Breakdown ───────────────────────────────────────────

export interface TherapeuticArea {
  area: string;
  monthsOfSupply: number;
  target: number;
  forecastAccuracy: number;
  otif: number;
  status: StatusColor;
  // Extended fields
  costPercentRevenue: number;
  trend: TrendDirection;
  keyProducts: string[];
  priorPeriodAccuracy: number;
}

export const THERAPEUTIC_AREA_DATA: TherapeuticArea[] = [
  {
    area: "Immunology",
    monthsOfSupply: 3.8,
    target: 3,
    forecastAccuracy: 91.2,
    priorPeriodAccuracy: 89.5,
    otif: 96.8,
    costPercentRevenue: 6.9,
    trend: "up",
    status: "green",
    keyProducts: ["Skyrizi", "Rinvoq", "Humira"],
  },
  {
    area: "Oncology",
    monthsOfSupply: 3.1,
    target: 3,
    forecastAccuracy: 88.5,
    priorPeriodAccuracy: 87.1,
    otif: 94.7,
    costPercentRevenue: 9.2,
    trend: "up",
    status: "amber",
    keyProducts: ["Imbruvica", "Venclexta", "Epkinly"],
  },
  {
    area: "Neuroscience",
    monthsOfSupply: 2.9,
    target: 3,
    forecastAccuracy: 86.3,
    priorPeriodAccuracy: 85.8,
    otif: 93.2,
    costPercentRevenue: 8.5,
    trend: "up",
    status: "amber",
    keyProducts: ["Vraylar", "Ubrelvy", "Qulipta"],
  },
  {
    area: "Eye Care",
    monthsOfSupply: 3.2,
    target: 3,
    forecastAccuracy: 89.1,
    priorPeriodAccuracy: 88.4,
    otif: 95.4,
    costPercentRevenue: 7.8,
    trend: "up",
    status: "green",
    keyProducts: ["Vuity", "Ozurdex", "Lumigan"],
  },
  {
    area: "Aesthetics",
    monthsOfSupply: 2.4,
    target: 3,
    forecastAccuracy: 83.7,
    priorPeriodAccuracy: 85.2,
    otif: 91.5,
    costPercentRevenue: 10.1,
    trend: "down",
    status: "red",
    keyProducts: ["Botox", "Juvederm", "CoolSculpting"],
  },
];

// ─── 3. Manufacturing Site Data ──────────────────────────────────────────────

export interface ManufacturingSite {
  id: string;
  name: string;
  location: string;
  country: string;
  capacityUtilization: number;
  yield: number;
  oee: number;
  deviationRate: number;
  primaryProducts: string[];
  status: StatusColor;
}

export const MANUFACTURING_SITES: ManufacturingSite[] = [
  {
    id: "site-001",
    name: "Barceloneta",
    location: "Barceloneta, PR",
    country: "US",
    capacityUtilization: 87,
    yield: 94.2,
    oee: 82.1,
    deviationRate: 1.8,
    primaryProducts: ["Lupron", "Synthroid", "AndroGel", "Creon"],
    status: "green",
  },
  {
    id: "site-002",
    name: "Sligo",
    location: "Sligo, Ireland",
    country: "IE",
    capacityUtilization: 91,
    yield: 96.5,
    oee: 85.3,
    deviationRate: 1.2,
    primaryProducts: ["Humira", "Skyrizi", "Rinvoq"],
    status: "green",
  },
  {
    id: "site-003",
    name: "Singapore Tuas",
    location: "Tuas, Singapore",
    country: "SG",
    capacityUtilization: 42,
    yield: 91.8,
    oee: 72.4,
    deviationRate: 2.4,
    primaryProducts: ["Skyrizi", "Rinvoq"],
    status: "amber",
  },
  {
    id: "site-004",
    name: "Campoverde",
    location: "Campoverde, Italy",
    country: "IT",
    capacityUtilization: 78,
    yield: 95.1,
    oee: 81.7,
    deviationRate: 1.5,
    primaryProducts: ["Humira", "Imbruvica"],
    status: "green",
  },
  {
    id: "site-005",
    name: "Irvine",
    location: "Irvine, CA",
    country: "US",
    capacityUtilization: 93,
    yield: 92.6,
    oee: 78.9,
    deviationRate: 2.1,
    primaryProducts: ["Botox", "Juvederm", "CoolSculpting"],
    status: "red",
  },
  {
    id: "site-006",
    name: "Ludwigshafen",
    location: "Ludwigshafen, Germany",
    country: "DE",
    capacityUtilization: 74,
    yield: 97.3,
    oee: 86.8,
    deviationRate: 0.9,
    primaryProducts: ["Venclexta", "Mavyret"],
    status: "green",
  },
];

// ─── 4. Supplier Performance ─────────────────────────────────────────────────

export interface Supplier {
  name: string;
  category: SupplierCategory;
  score: number;
  onTimeDelivery: number;
  qualityScore: number;
  status: StatusColor;
}

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

// ─── 5. Supplier Performance Radar ───────────────────────────────────────────

export interface SupplierRadarDimension {
  dimension: string;
  value: number;
  benchmark: number;
}

export interface SupplierRadarProfile {
  supplierName: string;
  dimensions: SupplierRadarDimension[];
}

export const SUPPLIER_RADAR_DATA: SupplierRadarProfile[] = [
  {
    supplierName: "Lonza Group",
    dimensions: [
      { dimension: "Quality", value: 96, benchmark: 90 },
      { dimension: "On-Time Delivery", value: 94, benchmark: 90 },
      { dimension: "Lead Time", value: 82, benchmark: 85 },
      { dimension: "Cost Variance", value: 88, benchmark: 90 },
      { dimension: "Responsiveness", value: 91, benchmark: 85 },
      { dimension: "Risk Compliance", value: 95, benchmark: 90 },
    ],
  },
  {
    supplierName: "Samsung Biologics",
    dimensions: [
      { dimension: "Quality", value: 94, benchmark: 90 },
      { dimension: "On-Time Delivery", value: 91, benchmark: 90 },
      { dimension: "Lead Time", value: 78, benchmark: 85 },
      { dimension: "Cost Variance", value: 85, benchmark: 90 },
      { dimension: "Responsiveness", value: 87, benchmark: 85 },
      { dimension: "Risk Compliance", value: 92, benchmark: 90 },
    ],
  },
  {
    supplierName: "West Pharmaceutical",
    dimensions: [
      { dimension: "Quality", value: 93, benchmark: 90 },
      { dimension: "On-Time Delivery", value: 88, benchmark: 90 },
      { dimension: "Lead Time", value: 91, benchmark: 85 },
      { dimension: "Cost Variance", value: 79, benchmark: 90 },
      { dimension: "Responsiveness", value: 84, benchmark: 85 },
      { dimension: "Risk Compliance", value: 90, benchmark: 90 },
    ],
  },
  {
    supplierName: "Schott AG",
    dimensions: [
      { dimension: "Quality", value: 95, benchmark: 90 },
      { dimension: "On-Time Delivery", value: 85, benchmark: 90 },
      { dimension: "Lead Time", value: 86, benchmark: 85 },
      { dimension: "Cost Variance", value: 82, benchmark: 90 },
      { dimension: "Responsiveness", value: 76, benchmark: 85 },
      { dimension: "Risk Compliance", value: 88, benchmark: 90 },
    ],
  },
  {
    supplierName: "DHL Life Sciences",
    dimensions: [
      { dimension: "Quality", value: 91, benchmark: 90 },
      { dimension: "On-Time Delivery", value: 93, benchmark: 90 },
      { dimension: "Lead Time", value: 95, benchmark: 85 },
      { dimension: "Cost Variance", value: 86, benchmark: 90 },
      { dimension: "Responsiveness", value: 94, benchmark: 85 },
      { dimension: "Risk Compliance", value: 89, benchmark: 90 },
    ],
  },
  {
    supplierName: "Marken (UPS)",
    dimensions: [
      { dimension: "Quality", value: 84, benchmark: 90 },
      { dimension: "On-Time Delivery", value: 79, benchmark: 90 },
      { dimension: "Lead Time", value: 88, benchmark: 85 },
      { dimension: "Cost Variance", value: 72, benchmark: 90 },
      { dimension: "Responsiveness", value: 81, benchmark: 85 },
      { dimension: "Risk Compliance", value: 77, benchmark: 90 },
    ],
  },
];

// ─── 6. Cash-to-Cash Cycle (Expanded) ────────────────────────────────────────

export interface CashToCash {
  month: string;
  value: number;
}

export interface CashToCashDetailed {
  month: string;
  dio: number;
  dso: number;
  dpo: number;
  c2c: number;
}

// Simple C2C for area chart (12 months)
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

// Detailed DIO/DSO/DPO breakdown — last 6 months
// C2C = DIO + DSO - DPO; pharma range 45-75 days
export const CASH_TO_CASH_DETAILED: CashToCashDetailed[] = [
  { month: "Oct 2025", dio: 98, dso: 52, dpo: 83, c2c: 67 },
  { month: "Nov 2025", dio: 95, dso: 50, dpo: 82, c2c: 63 },
  { month: "Dec 2025", dio: 93, dso: 51, dpo: 83, c2c: 61 },
  { month: "Jan 2026", dio: 90, dso: 49, dpo: 81, c2c: 58 },
  { month: "Feb 2026", dio: 87, dso: 48, dpo: 80, c2c: 55 },
  { month: "Mar 2026", dio: 84, dso: 47, dpo: 79, c2c: 52 },
];

// ─── 7. Forecast Accuracy Comparison ─────────────────────────────────────────

export interface ForecastComparison {
  area: string;
  currentPeriod: number;
  priorPeriod: number;
  target: number;
}

export const FORECAST_COMPARISON: ForecastComparison[] = [
  { area: "Immunology", currentPeriod: 91.2, priorPeriod: 89.5, target: 90 },
  { area: "Oncology", currentPeriod: 88.5, priorPeriod: 87.1, target: 90 },
  { area: "Neuroscience", currentPeriod: 86.3, priorPeriod: 85.8, target: 90 },
  { area: "Eye Care", currentPeriod: 89.1, priorPeriod: 88.4, target: 90 },
  { area: "Aesthetics", currentPeriod: 83.7, priorPeriod: 85.2, target: 90 },
];

// ─── 8. Strategic Initiatives ────────────────────────────────────────────────

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

export const INITIATIVES: Initiative[] = [
  {
    id: "init-001",
    name: "Singapore Biologics Expansion",
    owner: "VP Manufacturing",
    dueDate: "2026-09-30",
    progress: 62,
    status: "green",
    description:
      "New large-scale biologics manufacturing facility in Tuas, Singapore to support Skyrizi and Rinvoq volume growth across Asia-Pacific markets. $450M investment, 3 bioreactor trains.",
    milestone: "Equipment qualification phase — bioreactor train 1 on track for Q3 validation",
  },
  {
    id: "init-002",
    name: "Blue Yonder Planning Rollout",
    owner: "SVP Supply Chain",
    dueDate: "2026-06-15",
    progress: 45,
    status: "amber",
    description:
      "Enterprise-wide deployment of Blue Yonder demand sensing and inventory optimization replacing legacy SAP APO modules across 14 planning nodes.",
    milestone: "UAT delayed 3 weeks — master data migration issues at 2 of 6 sites",
  },
  {
    id: "init-003",
    name: "Supplier Risk Platform v2",
    owner: "Chief Procurement Officer",
    dueDate: "2026-04-30",
    progress: 78,
    status: "green",
    description:
      "AI-driven supplier risk scoring integrating financial health (Dun & Bradstreet), geopolitical exposure, and ESG signals for Tier 1-3 suppliers. Covers 1,200+ suppliers.",
    milestone: "Pilot live with 120 critical suppliers — real-time alerts active",
  },
  {
    id: "init-004",
    name: "Cold Chain Digitization",
    owner: "VP Quality & Compliance",
    dueDate: "2026-12-01",
    progress: 31,
    status: "amber",
    description:
      "IoT-enabled real-time temperature monitoring across Botox and biologics cold chain with predictive excursion alerts. 12,000 sensors across 340 shipping lanes.",
    milestone: "Sensor deployment 40% complete — EU lanes pending regulatory clearance",
  },
  {
    id: "init-005",
    name: "Allergan Integration Program",
    owner: "Chief Integration Officer",
    dueDate: "2026-08-15",
    progress: 85,
    status: "green",
    description:
      "Final phase of Allergan supply chain network harmonization including ERP consolidation (SAP S/4HANA) and distribution center rationalization from 22 to 16 DCs.",
    milestone: "3 of 4 remaining DCs migrated — LATAM DC cutover scheduled Jun 2026",
  },
];

// ─── 9. Risk Signals ─────────────────────────────────────────────────────────

export interface Risk {
  id: string;
  category: RiskCategory;
  type: RiskType;
  title: string;
  description: string;
  severity: RiskSeverity;
  severityScore: 1 | 2 | 3;
  region: string;
  affectedProducts: string[];
}

export const RISK_DATA: Risk[] = [
  {
    id: "risk-001",
    category: "Geopolitical",
    type: "GEOPOLITICAL",
    title: "Taiwan Strait Shipping Disruption",
    description:
      "Escalating military exercises near key shipping lanes threaten API supply from Taiwanese CDMO partners and transit routes for Asia-Pacific distribution. 18% of AbbVie intermediates route through Taiwan Strait. Lead time extension of 12-18 days if rerouting via Lombok Strait required.",
    severity: "High",
    severityScore: 3,
    region: "Asia-Pacific",
    affectedProducts: ["Rinvoq", "Venclexta", "Mavyret"],
  },
  {
    id: "risk-002",
    category: "Supplier",
    type: "SUPPLIER",
    title: "Lonza Capacity Constraint — Biologics",
    description:
      "Lonza Visp facility running at 94% utilization with limited surge capacity. Any unplanned downtime could impact Skyrizi bulk drug substance supply within 6 weeks. Dual-source qualification with Samsung Biologics 70% complete but not yet validated for commercial scale.",
    severity: "High",
    severityScore: 3,
    region: "Europe",
    affectedProducts: ["Skyrizi", "Rinvoq"],
  },
  {
    id: "risk-003",
    category: "Tariff",
    type: "TARIFF",
    title: "US-China API Tariff Escalation",
    description:
      "Proposed 25% tariff increase on Chinese-origin intermediates and starting materials could raise COGS by $40-60M annually across the small molecule portfolio. Affects 34 SKUs sourced from 8 Chinese suppliers. Reshoring alternatives 18-24 months from qualification.",
    severity: "High",
    severityScore: 3,
    region: "Global",
    affectedProducts: ["Mavyret", "Synthroid", "Creon", "Lupron"],
  },
  {
    id: "risk-004",
    category: "Regulatory",
    type: "REGULATORY",
    title: "EU MDR Packaging Compliance",
    description:
      "New EU Medical Device Regulation serialization requirements effective Q3 2026. Packaging line modifications needed at Sligo, Campoverde, and Ludwigshafen. Estimated $12M capex. Non-compliance risks product holds at EU border.",
    severity: "Medium",
    severityScore: 2,
    region: "Europe",
    affectedProducts: ["Botox", "Juvederm", "CoolSculpting"],
  },
  {
    id: "risk-005",
    category: "Weather",
    type: "WEATHER",
    title: "Hurricane Season — Puerto Rico Facilities",
    description:
      "NOAA forecasts above-average Atlantic hurricane season (16-20 named storms). Barceloneta manufacturing site produces 23% of AbbVie's US small molecule volume. Business continuity plan activated; 6-week safety stock build in progress.",
    severity: "Medium",
    severityScore: 2,
    region: "North America",
    affectedProducts: ["Lupron", "Synthroid", "AndroGel", "Creon"],
  },
  {
    id: "risk-006",
    category: "Capacity",
    type: "CAPACITY",
    title: "Botox Fill-Finish Bottleneck — Irvine",
    description:
      "Irvine fill-finish line operating at 93% capacity utilization. Aesthetics demand surge in Q2/Q3 (seasonal peak + new indication launch) may exceed available slots by ~8%, risking backorders in US and EU markets. Line 3 expansion approved but not operational until Q1 2027.",
    severity: "Medium",
    severityScore: 2,
    region: "North America",
    affectedProducts: ["Botox Cosmetic", "Botox Therapeutic"],
  },
];

// ─── 10. Structured Risk Briefs ──────────────────────────────────────────────

export interface StructuredRiskBrief {
  impactAssessment: string;
  financialExposure: string;
  mitigations: string[];
  confidence: RiskSeverity; // reuses High/Medium/Low
}

export const STRUCTURED_RISK_BRIEFS: Record<string, StructuredRiskBrief> = {
  "risk-001": {
    impactAssessment:
      "Taiwan Strait closure would disrupt 18% of AbbVie's intermediate supply and extend lead times by 12-18 days across 3 key products, with cascading effects on Asia-Pacific distribution timelines.",
    financialExposure: "$32M – $48M per quarter",
    mitigations: [
      "Pre-position 8-week buffer stock for Rinvoq and Venclexta at regional DCs",
      "Activate Lombok Strait routing contracts with DHL Life Sciences",
      "Qualify secondary CDMO in South Korea for Mavyret intermediates",
    ],
    confidence: "High",
  },
  "risk-002": {
    impactAssessment:
      "Single-source dependency on Lonza Visp for Skyrizi bulk drug substance creates stockout risk within 6 weeks of any unplanned downtime at a facility running at 94% capacity utilization.",
    financialExposure: "$120M – $180M annual revenue at risk",
    mitigations: [
      "Accelerate Samsung Biologics dual-source validation to Q3 2026",
      "Increase Skyrizi safety stock from 6 to 10 weeks",
      "Negotiate priority capacity slots in Lonza maintenance windows",
    ],
    confidence: "High",
  },
  "risk-003": {
    impactAssessment:
      "Proposed 25% tariff increase on Chinese-origin intermediates would raise COGS by $40-60M annually across 34 SKUs from 8 Chinese suppliers, with no qualified alternatives available for 18-24 months.",
    financialExposure: "$40M – $60M annual COGS increase",
    mitigations: [
      "Pre-buy 6 months of inventory at current tariff rates",
      "Accelerate API reshoring to India via Biocon partnership",
      "File tariff exclusion requests for essential pharmaceutical intermediates",
    ],
    confidence: "Medium",
  },
  "risk-004": {
    impactAssessment:
      "EU MDR serialization deadline in Q3 2026 requires packaging line modifications at 3 European sites. Non-compliance risks product holds at EU borders for Aesthetics portfolio.",
    financialExposure: "$12M capex + $5M – $8M potential delay costs",
    mitigations: [
      "Authorize weekend shifts at Campoverde to close 3-week schedule gap",
      "Deploy dedicated project team for cross-site coordination",
    ],
    confidence: "High",
  },
  "risk-005": {
    impactAssessment:
      "Above-average Atlantic hurricane season threatens Barceloneta site which produces 23% of US small molecule volume. Extended facility shutdown could impact supply of 4 key products.",
    financialExposure: "$85M – $130M production at risk",
    mitigations: [
      "Complete 6-week safety stock build by end of Q2",
      "Replace 15-year-old backup generator at Building 7",
      "Pre-stage FEMA coordination and activate mutual aid agreements",
    ],
    confidence: "Medium",
  },
  "risk-006": {
    impactAssessment:
      "Irvine fill-finish at 93% utilization cannot absorb projected Q2/Q3 Aesthetics demand surge. Approximately 8% overflow projected, risking backorders in US and EU markets.",
    financialExposure: "$25M – $40M in potential lost revenue",
    mitigations: [
      "Negotiate contract fill-finish slots with Catalent for 500K Botox Cosmetic units",
      "Implement demand allocation protocol prioritizing high-margin markets",
      "Fast-track Irvine Line 3 commissioning timeline",
    ],
    confidence: "Medium",
  },
};

// ─── 11. Fallback AI Narratives ──────────────────────────────────────────────

export interface FallbackNarratives {
  overallSummary: string;
  inventoryHealth: string;
  supplierPerformance: string;
  forecastAccuracy: string;
  cashToCash: string;
  riskBriefs: Record<string, string>;
}

export const FALLBACK_NARRATIVES: FallbackNarratives = {
  overallSummary:
    "Supply chain performance is mixed heading into Q2 2026. Demand forecast accuracy improved to 87.4% (+1.2pp QoQ) driven by Skyrizi/Rinvoq stabilization, but remains below the 90% target as Humira biosimilar erosion creates volume uncertainty. OTIF slipped to 94.1% — the Aesthetics cold chain and Allergan DC consolidation are the primary drag. Supply chain cost at 8.3% of revenue reflects tariff exposure and biologics dual-sourcing investment. The Immunology franchise remains the operational bright spot; Aesthetics requires immediate capacity intervention at Irvine.",

  inventoryHealth:
    "Immunology leads with 3.8 months of supply, providing a comfortable buffer for Skyrizi launch ramp. Aesthetics is critically low at 2.4 months against a 3-month target, driven by Irvine fill-finish constraints and higher-than-forecast Botox demand. Neuroscience inventory dipped below target as Vraylar uptake exceeded planning assumptions. Recommend expediting Irvine Line 3 qualification and initiating contract manufacturing discussions for Botox overflow capacity.",

  supplierPerformance:
    "Lonza and Samsung Biologics continue strong API supply performance (>93% OTD). Marken logistics is the weakest link at 82.3% on-time delivery, driven by cold chain failures on 3 EU-to-LATAM lanes. West Pharmaceutical packaging lead times extended 2 weeks due to glass vial shortage. Recommend activating secondary logistics partner for temperature-sensitive shipments and accelerating Schott AG vial qualification.",

  forecastAccuracy:
    "Immunology accuracy at 91.2% now exceeds the 90% target, reflecting maturing Skyrizi/Rinvoq demand patterns. Aesthetics declined to 83.7% from 85.2% prior period — seasonal volatility and the new Botox indication launch created upside variance the planning system did not capture. Oncology and Neuroscience show steady improvement. The Blue Yonder demand sensing rollout should close 2-3 points of the gap once fully operational.",

  cashToCash:
    "Cash-to-cash cycle improved from 68 to 52 days over 12 months, primarily driven by DIO reduction (98 to 84 days) through SKU rationalization and the Allergan DC consolidation. DSO held steady at ~48 days. DPO optimization with strategic suppliers contributed 4 days of improvement. The trajectory is favorable, but biologics inventory builds for Singapore ramp-up may temporarily reverse DIO gains in Q3.",

  riskBriefs: {
    "risk-001":
      "Taiwan Strait disruption is AbbVie's highest-impact geopolitical risk. If primary shipping lanes close, rerouting adds 12-18 days lead time and $8-12M in freight costs per quarter. Immediate actions: pre-position 8-week buffer stock for Rinvoq and Venclexta at regional DCs; activate Lombok Strait routing contracts with DHL.",

    "risk-002":
      "Lonza single-source dependency for Skyrizi biologic drug substance is the top supply continuity risk. At 94% utilization, any maintenance event creates stockout risk within 6 weeks. Samsung Biologics dual-source qualification is 70% complete — recommend accelerating to full commercial validation by Q3 2026. Interim mitigation: increase Skyrizi safety stock to 10 weeks.",

    "risk-003":
      "A 25% tariff on Chinese-origin intermediates would add $40-60M to annual COGS. 34 SKUs across the small molecule portfolio are exposed. Near-term: pre-buy 6 months of inventory at current tariff rates. Medium-term: accelerate API reshoring to India (Biocon partnership) and Puerto Rico (Barceloneta expansion).",

    "risk-004":
      "EU MDR packaging compliance is a medium-severity regulatory risk with hard Q3 2026 deadline. Three European sites require line modifications. At current pace, Sligo and Ludwigshafen will be compliant on time; Campoverde is 3 weeks behind schedule. Recommend dedicated project team and weekend shift authorization for Campoverde.",

    "risk-005":
      "Above-average hurricane season threatens Barceloneta, which produces 23% of US small molecule volume. Business continuity plan is activated with 6-week safety stock build in progress. Key gap: backup power generator at Building 7 is 15 years old and due for replacement. Recommend immediate generator upgrade and pre-staged FEMA coordination.",

    "risk-006":
      "Irvine fill-finish is the binding constraint for the entire Aesthetics franchise. At 93% utilization with seasonal Q2/Q3 peak approaching, ~8% demand overflow is projected. Line 3 expansion is approved but won't be operational until Q1 2027. Immediate actions: negotiate contract fill-finish slots with Catalent for 500K units of Botox Cosmetic; implement demand allocation protocol for low-margin markets.",
  },
};
