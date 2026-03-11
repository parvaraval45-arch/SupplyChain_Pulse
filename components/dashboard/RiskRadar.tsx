"use client";

import { useState, useEffect, useCallback } from "react";
import { ShieldAlert, Sparkles } from "lucide-react";
import clsx from "clsx";
import {
  RISK_DATA,
  type Risk,
  type RiskCategory,
  type RiskSeverity,
} from "@/data/mockData";
import { useDelayedLoad, ShimmerBlock, SkeletonRows } from "@/components/ui/Skeleton";

// ─── Category colors ─────────────────────────────────────────────────────────

const CATEGORY_STYLE: Record<RiskCategory, { bg: string; text: string }> = {
  Geopolitical: { bg: "bg-[#F3E8FF]", text: "text-[#7C3AED]" },
  Supplier:     { bg: "bg-[#FFF4E5]", text: "text-[#EA580C]" },
  Regulatory:   { bg: "bg-[#E0F2FE]", text: "text-[#0369A1]" },
  Weather:      { bg: "bg-[#E6FFFA]", text: "text-[#0D9488]" },
  Tariff:       { bg: "bg-[#FFEBE6]", text: "text-[#DE350B]" },
  Capacity:     { bg: "bg-[#FFF4E5]", text: "text-[#FF8B00]" },
};

const SEVERITY_ORDER: Record<RiskSeverity, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const SEVERITY_COLOR: Record<RiskSeverity, string> = {
  High: "#DE350B",
  Medium: "#FF8B00",
  Low: "#5A6A7A",
};

// ─── Severity squares ────────────────────────────────────────────────────────

function SeverityIndicator({ severity }: { severity: RiskSeverity }) {
  const filled = severity === "High" ? 3 : severity === "Medium" ? 2 : 1;
  const color = SEVERITY_COLOR[severity];
  return (
    <div className="flex items-center gap-1" title={severity}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-[2px]"
          style={{
            backgroundColor: i < filled ? color : "#E8ECF1",
          }}
        />
      ))}
    </div>
  );
}

// ─── Filter bar ──────────────────────────────────────────────────────────────

type FilterValue = "All" | RiskSeverity;

function FilterBar({
  value,
  onChange,
}: {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
}) {
  const options: FilterValue[] = ["All", "High", "Medium", "Low"];
  return (
    <div className="flex items-center gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={clsx(
            "h-8 px-3 rounded-[6px] text-[11px] font-semibold transition-colors",
            value === opt
              ? "bg-primary text-white"
              : "bg-surface text-text-secondary hover:text-text-primary"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── AI Risk Brief ───────────────────────────────────────────────────────────

function useRiskBrief(risk: Risk | null) {
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadedId, setLoadedId] = useState<string | null>(null);

  const fetchBrief = useCallback(async (r: Risk) => {
    setLoading(true);
    setBrief("");
    try {
      const res = await fetch("/api/drill-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metricName: `Risk: ${r.title}`,
          data: {
            category: r.category,
            severity: r.severity,
            region: r.region,
            description: r.description,
            affectedProducts: r.affectedProducts,
          },
        }),
      });
      const body = await res.json();
      setBrief(body.insight ?? "No insight returned.");
    } catch {
      setBrief("Risk brief temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (risk && risk.id !== loadedId) {
      setLoadedId(risk.id);
      fetchBrief(risk);
    }
  }, [risk, loadedId, fetchBrief]);

  return { brief, loading };
}

// ─── Detail Panel ────────────────────────────────────────────────────────────

function RiskDetailPanel({ risk }: { risk: Risk | null }) {
  const { brief, loading } = useRiskBrief(risk);

  if (!risk) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-secondary gap-3 py-16">
        <ShieldAlert size={32} strokeWidth={1.2} />
        <p className="text-[14px] text-center max-w-[200px] leading-[1.5]">
          Select a risk signal to view AI-generated impact analysis
        </p>
      </div>
    );
  }

  const cat = CATEGORY_STYLE[risk.category];

  return (
    <div className="flex flex-col gap-4">
      {/* Category + severity */}
      <div className="flex items-center justify-between">
        <span
          className={clsx(
            "px-2 py-1 rounded text-[11px] font-semibold uppercase",
            cat.bg,
            cat.text
          )}
        >
          {risk.category}
        </span>
        <div className="flex items-center gap-2">
          <SeverityIndicator severity={risk.severity} />
          <span
            className="text-[11px] font-semibold"
            style={{ color: SEVERITY_COLOR[risk.severity] }}
          >
            {risk.severity}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-text-primary leading-snug">
        {risk.title}
      </h3>

      {/* Region */}
      <div className="text-[12px] text-text-secondary">
        Region: <span className="text-text-primary font-medium">{risk.region}</span>
      </div>

      {/* Description */}
      <p className="text-[14px] leading-[1.5] text-text-primary">
        {risk.description}
      </p>

      {/* Affected products */}
      <div>
        <span className="text-[11px] uppercase tracking-[0.08em] text-text-secondary font-semibold">
          Affected Products
        </span>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {risk.affectedProducts.map((p) => (
            <span
              key={p}
              className="px-2 py-1 rounded text-[11px] font-semibold text-text-primary bg-surface border border-border"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* AI Risk Brief */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles size={12} className="text-primary" />
          <span className="text-[11px] uppercase tracking-[0.08em] text-text-secondary font-semibold">
            AI Risk Brief
          </span>
        </div>
        <div className="bg-[#F0F8FF] border border-[#D0E8F7] rounded-[6px] px-4 py-3">
          {loading ? (
            <div className="flex flex-col gap-1.5">
              <ShimmerBlock className="h-3 w-full" />
              <ShimmerBlock className="h-3 w-[85%]" />
              <ShimmerBlock className="h-3 w-[70%]" />
            </div>
          ) : (
            <p className="text-[13px] italic leading-relaxed text-text-primary">
              {brief}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function RiskRadar() {
  const ready = useDelayedLoad(800);
  const [filter, setFilter] = useState<FilterValue>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = RISK_DATA
    .filter((r) => filter === "All" || r.severity === filter)
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  const selected = RISK_DATA.find((r) => r.id === selectedId) ?? null;

  if (!ready) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 items-start">
        <SkeletonRows count={5} />
        <SkeletonRows count={3} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 items-start">
      {/* Left — risk list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] uppercase tracking-[0.08em] text-text-secondary font-semibold">
            Risk Signals
          </h3>
          <FilterBar value={filter} onChange={setFilter} />
        </div>

        <div className="flex flex-col gap-2">
          {filtered.map((risk) => {
            const isSelected = selectedId === risk.id;
            const cat = CATEGORY_STYLE[risk.category];
            return (
              <button
                key={risk.id}
                onClick={() => setSelectedId(risk.id)}
                className={clsx(
                  "flex items-start gap-3 w-full p-5 rounded-lg border text-left transition-colors",
                  isSelected
                    ? "bg-white border-l-[3px] border-l-primary border-t-border border-r-border border-b-border shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                    : "bg-white border-border hover:bg-[#F8FAFC]"
                )}
              >
                <div className="flex-1 min-w-0">
                  {/* Category badge + severity */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={clsx(
                        "px-2 py-1 rounded text-[11px] font-semibold uppercase",
                        cat.bg,
                        cat.text
                      )}
                    >
                      {risk.category}
                    </span>
                    <SeverityIndicator severity={risk.severity} />
                  </div>

                  {/* Title */}
                  <p className="text-[14px] font-semibold text-text-primary leading-snug">
                    {risk.title}
                  </p>

                  {/* Region + products */}
                  <p className="text-[12px] text-text-secondary mt-1 truncate">
                    {risk.region} &middot; {risk.affectedProducts.join(", ")}
                  </p>
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-[14px] text-text-secondary text-center py-8">
              No risks matching this filter.
            </p>
          )}
        </div>
      </div>

      {/* Right — detail panel */}
      <div className="bg-white border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 lg:sticky lg:top-6">
        <RiskDetailPanel risk={selected} />
      </div>
    </div>
  );
}
