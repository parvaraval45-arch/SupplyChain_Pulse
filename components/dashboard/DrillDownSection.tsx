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
import { useDelayedLoad } from "@/components/ui/Skeleton";

// ─── Status colors ───────────────────────────────────────────────────────────

const STATUS_HEX: Record<StatusColor, string> = {
  green: "#0D7C3D",
  amber: "#B45309",
  red: "#C4320A",
};

// ─── AI Insight fetcher (calls /api/narrative with panel type) ───────────────

function usePanelInsight(narrativeType: string) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchInsight = useCallback(async () => {
    if (fetched) return;
    setLoading(true);
    try {
      const res = await fetch("/api/narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: narrativeType, data: {} }),
      });
      const body = await res.json();
      setInsight(body.narrative ?? "");
    } catch {
      setInsight("");
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }, [fetched, narrativeType]);

  return { insight, loading, fetchInsight };
}

// ─── Collapsible Panel ──────────────────────────────────────────────────────

function CollapsiblePanel({
  title,
  narrativeType,
  children,
}: {
  title: string;
  narrativeType: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { insight, loading, fetchInsight } = usePanelInsight(narrativeType);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) fetchInsight();
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden card-hover">
      {/* Header */}
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[15px] font-semibold text-text-primary">
            {title}
          </span>
          <span className="flex items-center gap-1 px-2 py-1 rounded-md text-primary text-[11px] font-semibold bg-[#EFF6FF]">
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
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg px-4 py-3">
            {loading ? (
              <div className="flex flex-col gap-1.5">
                <div className="shimmer-bar rounded h-3 w-full" />
                <div className="shimmer-bar rounded h-3 w-[85%]" />
                <div className="shimmer-bar rounded h-3 w-[65%]" />
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
      narrativeType="inventory"
    >
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
            <XAxis
              type="number"
              domain={[0, 5]}
              tick={{ fontSize: 11, fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Months of Supply",
                position: "bottom",
                offset: 0,
                style: { fontSize: 11, fill: "#64748B" },
              }}
            />
            <YAxis
              type="category"
              dataKey="area"
              tick={{ fontSize: 12, fill: "#0F172A" }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip
              formatter={(value) => [`${value} months`, "Supply"]}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
            />
            <ReferenceLine
              x={3}
              stroke="#0066CC"
              strokeDasharray="4 4"
              label={{
                value: "Target",
                position: "top",
                style: { fontSize: 10, fill: "#0066CC" },
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

  const colClass = "px-3 h-11 text-left text-[11px] uppercase tracking-widest text-text-secondary font-semibold cursor-pointer hover:text-primary select-none";
  const cellClass = "px-3 h-11 text-[14px] text-text-primary align-middle";

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortAsc ? " ↑" : " ↓") : "";

  return (
    <CollapsiblePanel
      title="Supplier Performance"
      narrativeType="supplier"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
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
              <tr key={s.name} className="border-b border-gray-100 last:border-0 hover:bg-surface transition-colors">
                <td className={clsx(cellClass, "font-medium")}>{s.name}</td>
                <td className={cellClass}>{s.category}</td>
                <td className={clsx(cellClass, "font-semibold tabular-nums")}>{s.onTimeDelivery}%</td>
                <td className={clsx(cellClass, "font-semibold tabular-nums")}>{s.qualityScore}</td>
                <td className={cellClass}>
                  <span
                    className="inline-block px-2 py-1 rounded-md text-[11px] font-semibold uppercase text-white"
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
      narrativeType="forecast"
    >
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis
              dataKey="area"
              tick={{ fontSize: 11, fill: "#0F172A" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[70, 100]}
              tick={{ fontSize: 10, fill: "#64748B" }}
              tickCount={4}
            />
            <Radar
              name="Target"
              dataKey="target"
              stroke="#E2E8F0"
              fill="#E2E8F0"
              fillOpacity={0.15}
              strokeDasharray="4 4"
            />
            <Radar
              name="Actual"
              dataKey="actual"
              stroke="#0066CC"
              fill="#0066CC"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
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
      narrativeType="cashcycle"
    >
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={shortMonths} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="short"
              tick={{ fontSize: 10, fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[40, 80]}
              tick={{ fontSize: 11, fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Days",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "#64748B" },
              }}
            />
            <Tooltip
              formatter={(value) => [`${value} days`, "C2C"]}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
            />
            <ReferenceArea
              y1={45}
              y2={65}
              fill="#0D7C3D"
              fillOpacity={0.06}
              label={{
                value: "Healthy Range",
                position: "insideTopRight",
                style: { fontSize: 10, fill: "#0D7C3D" },
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0066CC"
              strokeWidth={2}
              fill="#DBEAFE"
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
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="shimmer-bar rounded h-5 w-48" />
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
