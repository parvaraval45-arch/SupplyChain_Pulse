"use client";

import { useState, useCallback, type ReactNode } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import clsx from "clsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from "recharts";
import {
  THERAPEUTIC_AREA_DATA,
  SUPPLIER_PERFORMANCE,
  CASH_TO_CASH,
  type Supplier,
  type StatusColor,
} from "@/data/mockData";
import { useDelayedLoad, ShimmerBlock } from "@/components/ui/Skeleton";

// ─── Status colors ───────────────────────────────────────────────────────────

const STATUS_HEX: Record<StatusColor, string> = {
  green: "#00875A",
  amber: "#FF8B00",
  red: "#DE350B",
};

// ─── AI Insight fetcher ──────────────────────────────────────────────────────

function useAIInsight() {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetch_ = useCallback(
    async (metricName: string, data: Record<string, unknown>) => {
      if (fetched) return;
      setLoading(true);
      try {
        const res = await fetch("/api/drill-insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ metricName, data }),
        });
        const body = await res.json();
        setInsight(body.insight ?? "No insight returned.");
      } catch {
        setInsight("Insight temporarily unavailable.");
      } finally {
        setLoading(false);
        setFetched(true);
      }
    },
    [fetched]
  );

  return { insight, loading, fetchInsight: fetch_ };
}

// ─── Collapsible Panel ──────────────────────────────────────────────────────

function CollapsiblePanel({
  title,
  metricName,
  insightData,
  children,
}: {
  title: string;
  metricName: string;
  insightData: Record<string, unknown>;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { insight, loading, fetchInsight } = useAIInsight();

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) fetchInsight(metricName, insightData);
  };

  return (
    <div className="bg-white border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Header */}
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[15px] font-semibold text-text-primary">
            {title}
          </span>
          <span className="flex items-center gap-1 px-2 py-1 rounded text-primary text-[11px] font-semibold bg-[#F0F6FF]">
            <Sparkles size={10} />
            So what?
          </span>
        </div>
        <ChevronDown
          size={16}
          className={clsx(
            "text-text-secondary transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Body */}
      {open && (
        <div className="px-5 pb-5 flex flex-col gap-4">
          {children}

          {/* AI blurb */}
          <div className="bg-[#F0F8FF] border border-[#D0E8F7] rounded-[6px] px-4 py-3">
            {loading ? (
              <div className="flex flex-col gap-1.5">
                <ShimmerBlock className="h-3 w-full" />
                <ShimmerBlock className="h-3 w-[80%]" />
              </div>
            ) : (
              <p className="text-[13px] italic leading-relaxed text-text-primary">
                {insight}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Panel 1: Inventory Health ──────────────────────────────────────────────

function InventoryHealthPanel() {
  const data = [...THERAPEUTIC_AREA_DATA].reverse();

  const barColor = (months: number): string => {
    if (months >= 3) return STATUS_HEX.green;
    if (months >= 2) return STATUS_HEX.amber;
    return STATUS_HEX.red;
  };

  return (
    <CollapsiblePanel
      title="Inventory Health by Therapeutic Area"
      metricName="Inventory Health"
      insightData={{ areas: THERAPEUTIC_AREA_DATA }}
    >
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
            <XAxis
              type="number"
              domain={[0, 5]}
              tick={{ fontSize: 11, fill: "#5A6A7A" }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Months of Supply",
                position: "bottom",
                offset: 0,
                style: { fontSize: 11, fill: "#5A6A7A" },
              }}
            />
            <YAxis
              type="category"
              dataKey="area"
              tick={{ fontSize: 12, fill: "#1A1A2E" }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip
              formatter={(value) => [`${value} months`, "Supply"]}
              contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #DDE1E7" }}
            />
            <ReferenceLine
              x={3}
              stroke="#0057A8"
              strokeDasharray="4 4"
              label={{
                value: "Target",
                position: "top",
                style: { fontSize: 10, fill: "#0057A8" },
              }}
            />
            <Bar dataKey="monthsOfSupply" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, i) => (
                <Cell key={i} fill={barColor(entry.monthsOfSupply)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CollapsiblePanel>
  );
}

// ─── Panel 2: Supplier Performance ──────────────────────────────────────────

type SortKey = "name" | "category" | "onTimeDelivery" | "qualityScore" | "status";

function SupplierPerformancePanel() {
  const [sortKey, setSortKey] = useState<SortKey>("onTimeDelivery");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(key === "name" || key === "category");
    }
  };

  const sorted = [...SUPPLIER_PERFORMANCE].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
    return sortAsc ? cmp : -cmp;
  });

  const colClass = "px-3 h-11 text-left text-[11px] uppercase tracking-[0.08em] text-text-secondary font-semibold cursor-pointer hover:text-primary select-none";
  const cellClass = "px-3 h-11 text-[14px] text-text-primary align-middle";

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortAsc ? " ↑" : " ↓") : "";

  return (
    <CollapsiblePanel
      title="Supplier Performance"
      metricName="Supplier Performance"
      insightData={{ suppliers: SUPPLIER_PERFORMANCE }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className={colClass} onClick={() => handleSort("name")}>
                Supplier{arrow("name")}
              </th>
              <th className={colClass} onClick={() => handleSort("category")}>
                Category{arrow("category")}
              </th>
              <th className={colClass} onClick={() => handleSort("onTimeDelivery")}>
                On-Time %{arrow("onTimeDelivery")}
              </th>
              <th className={colClass} onClick={() => handleSort("qualityScore")}>
                Quality{arrow("qualityScore")}
              </th>
              <th className={colClass} onClick={() => handleSort("status")}>
                Status{arrow("status")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s: Supplier) => (
              <tr key={s.name} className="border-b border-border last:border-0 hover:bg-[#F8FAFC] transition-colors">
                <td className={clsx(cellClass, "font-medium")}>{s.name}</td>
                <td className={cellClass}>{s.category}</td>
                <td className={clsx(cellClass, "font-display")}>{s.onTimeDelivery}%</td>
                <td className={clsx(cellClass, "font-display")}>{s.qualityScore}</td>
                <td className={cellClass}>
                  <span
                    className="inline-block px-2 py-1 rounded text-[11px] font-semibold uppercase text-white"
                    style={{ backgroundColor: STATUS_HEX[s.status] }}
                  >
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CollapsiblePanel>
  );
}

// ─── Panel 3: Forecast Accuracy Radar ───────────────────────────────────────

function ForecastAccuracyPanel() {
  const data = THERAPEUTIC_AREA_DATA.map((ta) => ({
    area: ta.area,
    actual: ta.forecastAccuracy,
    target: 90,
  }));

  return (
    <CollapsiblePanel
      title="Forecast Accuracy by Therapeutic Area"
      metricName="Forecast Accuracy"
      insightData={{ areas: THERAPEUTIC_AREA_DATA }}
    >
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#DDE1E7" />
            <PolarAngleAxis
              dataKey="area"
              tick={{ fontSize: 11, fill: "#1A1A2E" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[70, 100]}
              tick={{ fontSize: 10, fill: "#5A6A7A" }}
              tickCount={4}
            />
            <Radar
              name="Target"
              dataKey="target"
              stroke="#DDE1E7"
              fill="#DDE1E7"
              fillOpacity={0.15}
              strokeDasharray="4 4"
            />
            <Radar
              name="Actual"
              dataKey="actual"
              stroke="#0057A8"
              fill="#0057A8"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #DDE1E7" }}
              formatter={(value, name) => [`${value}%`, name]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </CollapsiblePanel>
  );
}

// ─── Panel 4: Cash-to-Cash Cycle ────────────────────────────────────────────

function CashToCashPanel() {
  const shortMonths = CASH_TO_CASH.map((d) => ({
    ...d,
    short: d.month.replace("20", "'"),
  }));

  return (
    <CollapsiblePanel
      title="Cash-to-Cash Cycle"
      metricName="Cash-to-Cash Cycle"
      insightData={{ months: CASH_TO_CASH }}
    >
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={shortMonths} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" />
            <XAxis
              dataKey="short"
              tick={{ fontSize: 10, fill: "#5A6A7A" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[40, 80]}
              tick={{ fontSize: 11, fill: "#5A6A7A" }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Days",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "#5A6A7A" },
              }}
            />
            <Tooltip
              formatter={(value) => [`${value} days`, "C2C"]}
              contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #DDE1E7" }}
            />
            <ReferenceArea
              y1={45}
              y2={65}
              fill="#00875A"
              fillOpacity={0.06}
              label={{
                value: "Healthy Range",
                position: "insideTopRight",
                style: { fontSize: 10, fill: "#00875A" },
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0057A8"
              strokeWidth={2}
              fill="#E8F4FD"
              fillOpacity={0.8}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CollapsiblePanel>
  );
}

// ─── Section export ─────────────────────────────────────────────────────────

export default function DrillDownSection() {
  const ready = useDelayedLoad(800);

  if (!ready) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-border rounded-lg p-5">
            <ShimmerBlock className="h-5 w-48" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-print-section>
      <InventoryHealthPanel />
      <SupplierPerformancePanel />
      <ForecastAccuracyPanel />
      <CashToCashPanel />
    </div>
  );
}
