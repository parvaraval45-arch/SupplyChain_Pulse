"use client";

import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import clsx from "clsx";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  KPI_DATA,
  THERAPEUTIC_AREA_DATA,
  MANUFACTURING_SITES,
  type StatusColor,
} from "@/data/mockData";
import { useDelayedLoad } from "@/components/ui/Skeleton";

// ─── Constants ───────────────────────────────────────────────────────────────

const MONTHS = [
  "Apr", "May", "Jun", "Jul", "Aug", "Sep",
  "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
];

const KPI_THEME = [
  { stroke: "#0066CC", fill: "url(#gradBlue)",  id: "gradBlue",  c1: "#0066CC", c2: "#0066CC20" },
  { stroke: "#7C3AED", fill: "url(#gradPurple)", id: "gradPurple", c1: "#7C3AED", c2: "#7C3AED20" },
  { stroke: "#0D9488", fill: "url(#gradTeal)",  id: "gradTeal",  c1: "#0D9488", c2: "#0D948820" },
];

const STATUS_DOT: Record<StatusColor, string> = {
  green: "bg-success",
  amber: "bg-warning",
  red: "bg-danger",
};

// ─── Section 4 — Month-over-Month Delta Cards ──────────────────────────────

function DeltaCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {KPI_DATA.map((kpi) => {
        const current = kpi.history[kpi.history.length - 1];
        const prior = kpi.history[kpi.history.length - 2];
        const delta = current - prior;
        const isCost = kpi.id === "supply-chain-cost";
        // For cost, going up is bad. For others, going up is good.
        const improving = isCost ? delta <= 0 : delta >= 0;

        return (
          <div
            key={kpi.id}
            className="bg-white border border-gray-100 rounded-xl shadow-card px-5 py-4 flex items-center justify-between card-hover"
          >
            <div>
              <p className="text-[11px] uppercase tracking-widest text-text-secondary font-semibold mb-1">
                {kpi.label}
              </p>
              <p className="text-[28px] font-heading font-semibold tabular-nums text-text-primary leading-none">
                {current}
                <span className="text-[16px] text-text-secondary font-normal">{kpi.unit}</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div
                className={clsx(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-[13px] font-semibold tabular-nums",
                  improving
                    ? "bg-[#ECFDF3] text-success"
                    : "bg-[#FFF1F0] text-danger"
                )}
              >
                {improving ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                {delta >= 0 ? "+" : ""}
                {delta.toFixed(1)}
                {kpi.unit}
              </div>
              <span className="text-[11px] text-text-secondary">vs prior month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Section 1 — KPI Trend Charts ───────────────────────────────────────────

function KPITrendCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {KPI_DATA.map((kpi, idx) => {
        const theme = KPI_THEME[idx];
        const chartData = kpi.history.map((v, i) => ({
          month: MONTHS[i],
          value: v,
        }));

        // Compute Y domain with some padding
        const vals = kpi.history;
        const min = Math.min(...vals, kpi.target);
        const max = Math.max(...vals, kpi.target);
        const pad = (max - min) * 0.3;
        const yMin = Math.floor(min - pad);
        const yMax = Math.ceil(max + pad);

        return (
          <div
            key={kpi.id}
            className="bg-white border border-gray-100 rounded-xl shadow-card p-5 card-hover"
          >
            <p className="text-[11px] uppercase tracking-widest text-text-secondary font-semibold mb-3">
              {kpi.label}
            </p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id={theme.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={theme.c1} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={theme.c2} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: "#64748B" }}
                    axisLine={false}
                    tickLine={false}
                    interval={1}
                  />
                  <YAxis
                    domain={[yMin, yMax]}
                    tick={{ fontSize: 10, fill: "#64748B" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}${kpi.unit}`}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value) => [`${value}${kpi.unit}`, kpi.label]}
                    labelFormatter={(label) => `${label} 2025/26`}
                  />
                  <ReferenceLine
                    y={kpi.target}
                    stroke={theme.stroke}
                    strokeDasharray="6 3"
                    strokeOpacity={0.5}
                    label={{
                      value: `Target ${kpi.target}${kpi.unit}`,
                      position: "right",
                      style: { fontSize: 9, fill: theme.stroke, fontWeight: 600 },
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={theme.stroke}
                    strokeWidth={2}
                    fill={theme.fill}
                    dot={false}
                    activeDot={{ r: 4, stroke: theme.stroke, fill: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Section 2 — Therapeutic Area Breakdown ──────────────────────────────────

function TherapeuticAreaTable() {
  // Sort worst-performing first (lowest composite score)
  const sorted = [...THERAPEUTIC_AREA_DATA].sort((a, b) => {
    // Composite: lower forecast + lower OTIF + higher cost = worse
    const scoreA = a.forecastAccuracy + a.otif - a.costPercentRevenue * 5;
    const scoreB = b.forecastAccuracy + b.otif - b.costPercentRevenue * 5;
    return scoreA - scoreB;
  });

  const colClass =
    "px-4 h-11 text-left text-[11px] uppercase tracking-widest text-text-secondary font-semibold";
  const cellClass = "px-4 h-12 text-[14px] text-text-primary align-middle";

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-[13px] uppercase tracking-widest text-text-secondary font-semibold">
          Therapeutic Area Breakdown
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className={colClass}>Therapeutic Area</th>
              <th className={colClass}>Forecast Accuracy</th>
              <th className={colClass}>OTIF</th>
              <th className={colClass}>Cost % Revenue</th>
              <th className={clsx(colClass, "text-center")}>Trend</th>
              <th className={clsx(colClass, "text-center")}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ta, i) => (
              <tr
                key={ta.area}
                className={clsx(
                  "border-b border-gray-100 last:border-0 transition-colors hover:bg-surface",
                  i % 2 === 1 && "bg-[#F8FAFC]"
                )}
              >
                <td className={clsx(cellClass, "font-semibold")}>
                  {ta.area}
                </td>
                <td className={cellClass}>
                  <span className="font-semibold tabular-nums">{ta.forecastAccuracy}%</span>
                  <span className="text-[11px] text-text-secondary ml-1.5">
                    (prior {ta.priorPeriodAccuracy}%)
                  </span>
                </td>
                <td className={clsx(cellClass, "font-semibold tabular-nums")}>
                  {ta.otif}%
                </td>
                <td className={clsx(cellClass, "font-semibold tabular-nums")}>
                  {ta.costPercentRevenue}%
                </td>
                <td className={clsx(cellClass, "text-center")}>
                  {ta.trend === "up" ? (
                    <TrendingUp size={16} className="inline text-success" />
                  ) : (
                    <TrendingDown size={16} className="inline text-danger" />
                  )}
                </td>
                <td className={clsx(cellClass, "text-center")}>
                  <span
                    className={clsx(
                      "inline-block w-3 h-3 rounded-full",
                      STATUS_DOT[ta.status]
                    )}
                    title={ta.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Section 3 — Site Performance Heatmap ────────────────────────────────────

interface HeatmapMetric {
  key: keyof typeof METRIC_CONFIG;
  label: string;
  target: number;
  amber: number; // threshold below which it's amber (or above for inverted)
  invert: boolean; // true = lower is better (deviation rate)
}

const METRIC_CONFIG = {
  capacityUtilization: { label: "Capacity Util.", target: 85, amber: 80, invert: false },
  yield:               { label: "Yield %",        target: 95, amber: 90, invert: false },
  oee:                 { label: "OEE %",          target: 82, amber: 77, invert: false },
  deviationRate:       { label: "Deviation Rate",  target: 1.5, amber: 2.0, invert: true },
} as const;

const METRICS: HeatmapMetric[] = Object.entries(METRIC_CONFIG).map(
  ([key, v]) => ({ key: key as keyof typeof METRIC_CONFIG, ...v })
);

function getCellColor(value: number, metric: HeatmapMetric): string {
  if (metric.invert) {
    // Lower is better: green if <= target, amber if <= amber threshold, red otherwise
    if (value <= metric.target) return "#0D7C3D";
    if (value <= metric.amber) return "#B45309";
    return "#C4320A";
  }
  // Higher is better: green if >= target, amber if >= amber threshold, red otherwise
  if (value >= metric.target) return "#0D7C3D";
  if (value >= metric.amber) return "#B45309";
  return "#C4320A";
}

function getTextColor(bgColor: string): string {
  // White text on all heatmap cells for contrast
  return bgColor === "#B45309" ? "#0F172A" : "#FFFFFF";
}

function SiteHeatmap() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-[13px] uppercase tracking-widest text-text-secondary font-semibold">
          Manufacturing Site Performance
        </h3>
      </div>
      <div className="overflow-x-auto px-5 pb-5">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-[11px] uppercase tracking-widest text-text-secondary font-semibold px-3 pb-3 w-[200px]">
                Site
              </th>
              {METRICS.map((m) => (
                <th
                  key={m.key}
                  className="text-center text-[11px] uppercase tracking-widest text-text-secondary font-semibold px-2 pb-3"
                >
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MANUFACTURING_SITES.map((site) => (
              <tr key={site.id}>
                <td className="px-3 py-1.5">
                  <div className="text-[14px] font-semibold text-text-primary leading-tight">
                    {site.name}
                  </div>
                  <div className="text-[11px] text-text-secondary leading-tight">
                    {site.location}
                  </div>
                </td>
                {METRICS.map((metric) => {
                  const value = site[metric.key];
                  const bg = getCellColor(value, metric);
                  const fg = getTextColor(bg);
                  const suffix = "%";
                  return (
                    <td key={metric.key} className="px-1.5 py-1.5">
                      <div
                        className="flex items-center justify-center rounded-lg h-11 min-w-[80px] font-semibold tabular-nums text-[14px] transition-transform hover:scale-105"
                        style={{ backgroundColor: bg, color: fg }}
                      >
                        {value}{suffix}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
          <span className="text-[11px] text-text-secondary font-semibold uppercase tracking-widest">
            Legend:
          </span>
          {[
            { color: "#0D7C3D", label: "On / above target" },
            { color: "#B45309", label: "Within 5% of target" },
            { color: "#C4320A", label: "Below target" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-[2px]"
                style={{ backgroundColor: l.color }}
              />
              <span className="text-[11px] text-text-secondary">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function PerformanceTab() {
  const ready = useDelayedLoad(800);

  if (!ready) {
    return (
      <div className="flex flex-col gap-6">
        {/* Delta cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="shimmer-bar rounded h-3 w-32 mb-3" />
              <div className="shimmer-bar rounded h-8 w-20" />
            </div>
          ))}
        </div>
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="shimmer-bar rounded h-3 w-40 mb-3" />
              <div className="shimmer-bar rounded h-[200px] w-full" />
            </div>
          ))}
        </div>
        {/* Table skeleton */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="shimmer-bar rounded h-3 w-48 mb-4" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="shimmer-bar rounded h-10 w-full mb-2" />
          ))}
        </div>
        {/* Heatmap skeleton */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="shimmer-bar rounded h-3 w-56 mb-4" />
          <div className="shimmer-bar rounded h-[280px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <DeltaCards />
      <KPITrendCharts />
      <TherapeuticAreaTable />
      <SiteHeatmap />
    </div>
  );
}
