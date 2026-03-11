"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShieldAlert,
  Sparkles,
  DollarSign,
  CheckCircle2,
  Target,
  AlertTriangle,
} from "lucide-react";
import clsx from "clsx";
import {
  RISK_DATA,
  STRUCTURED_RISK_BRIEFS,
  FALLBACK_NARRATIVES,
  type Risk,
  type RiskCategory,
  type RiskSeverity,
} from "@/data/mockData";
import { useDelayedLoad, SkeletonRows } from "@/components/ui/Skeleton";

// ─── Category colors ─────────────────────────────────────────────────────────

const CATEGORY_STYLE: Record<RiskCategory, { bg: string; text: string; border: string }> = {
  Geopolitical: { bg: "bg-[#F3E8FF]", text: "text-[#7C3AED]", border: "border-l-[#7C3AED]" },
  Supplier:     { bg: "bg-[#FFF7ED]", text: "text-[#EA580C]", border: "border-l-[#EA580C]" },
  Regulatory:   { bg: "bg-[#E0F2FE]", text: "text-[#0369A1]", border: "border-l-[#0369A1]" },
  Weather:      { bg: "bg-[#E6FFFA]", text: "text-[#0D9488]", border: "border-l-[#0D9488]" },
  Tariff:       { bg: "bg-[#FFF1F0]", text: "text-[#C4320A]", border: "border-l-[#C4320A]" },
  Capacity:     { bg: "bg-[#FFF7ED]", text: "text-[#B45309]", border: "border-l-[#B45309]" },
};

const SEVERITY_ORDER: Record<RiskSeverity, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const SEVERITY_COLOR: Record<RiskSeverity, string> = {
  High: "#C4320A",
  Medium: "#B45309",
  Low: "#64748B",
};

const CONFIDENCE_STYLE: Record<RiskSeverity, { bg: string; text: string }> = {
  High:   { bg: "bg-[#ECFDF3]", text: "text-[#0D7C3D]" },
  Medium: { bg: "bg-[#FFF7ED]", text: "text-[#B45309]" },
  Low:    { bg: "bg-[#FFF1F0]", text: "text-[#C4320A]" },
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
            backgroundColor: i < filled ? color : "#E2E8F0",
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
            "h-8 px-3 rounded-md text-[11px] font-semibold transition-colors",
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

// ─── Section label helper ────────────────────────────────────────────────────

function SectionLabel({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      {icon}
      <span className="text-[11px] uppercase tracking-widest text-text-secondary font-semibold">
        {label}
      </span>
    </div>
  );
}

// ─── Detail panel shimmer skeleton ───────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header badges */}
      <div className="flex items-center justify-between">
        <div className="shimmer-bar rounded h-6 w-24" />
        <div className="shimmer-bar rounded h-5 w-16" />
      </div>
      {/* Title */}
      <div className="shimmer-bar rounded h-5 w-[80%]" />
      {/* Impact Assessment */}
      <div className="flex flex-col gap-1.5">
        <div className="shimmer-bar rounded h-3 w-32" />
        <div className="shimmer-bar rounded h-3 w-full" />
        <div className="shimmer-bar rounded h-3 w-[90%]" />
      </div>
      {/* Products */}
      <div className="flex gap-2">
        <div className="shimmer-bar rounded h-7 w-16" />
        <div className="shimmer-bar rounded h-7 w-20" />
        <div className="shimmer-bar rounded h-7 w-14" />
      </div>
      {/* Financial */}
      <div className="shimmer-bar rounded h-12 w-full" />
      {/* Mitigations */}
      <div className="flex flex-col gap-1.5">
        <div className="shimmer-bar rounded h-3 w-40" />
        <div className="shimmer-bar rounded h-8 w-full" />
        <div className="shimmer-bar rounded h-8 w-full" />
        <div className="shimmer-bar rounded h-8 w-[85%]" />
      </div>
      {/* Confidence */}
      <div className="shimmer-bar rounded h-7 w-28" />
    </div>
  );
}

// ─── AI Risk Brief hook ──────────────────────────────────────────────────────

function useRiskBrief(risk: Risk | null) {
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadedId, setLoadedId] = useState<string | null>(null);

  const fetchBrief = useCallback(async (r: Risk) => {
    setLoading(true);
    setBrief("");
    try {
      const res = await fetch("/api/narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "risk",
          data: { id: r.id },
        }),
      });
      const body = await res.json();
      setBrief(body.narrative ?? "");
    } catch {
      // Use fallback on any failure
      setBrief(
        FALLBACK_NARRATIVES.riskBriefs[r.id] ??
          "This risk signal requires monitoring. Review the affected products and regional exposure."
      );
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

// ─── Structured Detail Panel ─────────────────────────────────────────────────

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

  if (loading) {
    return <DetailSkeleton />;
  }

  const cat = CATEGORY_STYLE[risk.category];
  const structured = STRUCTURED_RISK_BRIEFS[risk.id];
  const confStyle = structured
    ? CONFIDENCE_STYLE[structured.confidence]
    : CONFIDENCE_STYLE.Medium;

  return (
    <div
      key={risk.id}
      className="flex flex-col gap-4 animate-[briefFadeIn_200ms_ease-out]"
    >
      {/* Category + severity */}
      <div className="flex items-center justify-between">
        <span
          className={clsx(
            "px-2 py-1 rounded-md text-[11px] font-semibold uppercase",
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
        Region:{" "}
        <span className="text-text-primary font-medium">{risk.region}</span>
      </div>

      {/* ── Impact Assessment ── */}
      <div>
        <SectionLabel
          icon={<Sparkles size={12} className="text-primary" />}
          label="Impact Assessment"
        />
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg px-4 py-3">
          <p className="text-[13px] italic leading-relaxed text-text-primary">
            {structured?.impactAssessment ?? brief}
          </p>
        </div>
      </div>

      {/* ── Affected Products ── */}
      <div>
        <SectionLabel
          icon={<Target size={12} className="text-text-secondary" />}
          label="Affected Products"
        />
        <div className="flex flex-wrap gap-1.5">
          {risk.affectedProducts.map((p) => (
            <span
              key={p}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-text-primary bg-surface border border-gray-200"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* ── Estimated Financial Exposure ── */}
      {structured && (
        <div>
          <SectionLabel
            icon={<DollarSign size={12} className="text-warning" />}
            label="Est. Financial Exposure"
          />
          <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-lg px-4 py-3 flex items-center gap-2">
            <span className="text-[18px] font-heading font-semibold tabular-nums text-text-primary">
              {structured.financialExposure}
            </span>
          </div>
        </div>
      )}

      {/* ── Recommended Mitigations ── */}
      {structured && (
        <div>
          <SectionLabel
            icon={<CheckCircle2 size={12} className="text-success" />}
            label="Recommended Mitigations"
          />
          <div className="flex flex-col gap-1.5">
            {structured.mitigations.map((m, i) => (
              <div
                key={i}
                className="flex items-start gap-2 bg-surface rounded-lg px-3 py-2.5"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[11px] font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-[13px] leading-snug text-text-primary">
                  {m}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Confidence Level ── */}
      {structured && (
        <div>
          <SectionLabel
            icon={<AlertTriangle size={12} className="text-text-secondary" />}
            label="Confidence Level"
          />
          <span
            className={clsx(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold",
              confStyle.bg,
              confStyle.text
            )}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  structured.confidence === "High"
                    ? "#0D7C3D"
                    : structured.confidence === "Medium"
                      ? "#B45309"
                      : "#C4320A",
              }}
            />
            {structured.confidence} Confidence
          </span>
        </div>
      )}

      {/* ── Full AI Brief (collapsed fallback) ── */}
      {!structured && brief && (
        <div>
          <SectionLabel
            icon={<Sparkles size={12} className="text-primary" />}
            label="AI Risk Brief"
          />
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg px-4 py-3">
            <p className="text-[13px] italic leading-relaxed text-text-primary">
              {brief}
            </p>
          </div>
        </div>
      )}
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
          <h3 className="text-[13px] uppercase tracking-widest text-text-secondary font-semibold">
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
                  "flex items-start gap-3 w-full p-5 rounded-xl border text-left transition-all",
                  isSelected
                    ? `bg-white border-l-[3px] ${cat.border} border-t-gray-100 border-r-gray-100 border-b-gray-100 shadow-card`
                    : "bg-white border-gray-100 hover:bg-surface card-hover"
                )}
              >
                <div className="flex-1 min-w-0">
                  {/* Category badge + severity */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={clsx(
                        "px-2 py-1 rounded-md text-[11px] font-semibold uppercase",
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
      <div className="bg-white border border-gray-100 rounded-xl shadow-card p-5 lg:sticky lg:top-6">
        <RiskDetailPanel risk={selected} />
      </div>
    </div>
  );
}
