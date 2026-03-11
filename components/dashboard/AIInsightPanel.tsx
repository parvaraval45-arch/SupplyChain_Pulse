"use client";

import { useEffect, useState, useCallback } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { KPI_DATA } from "@/data/mockData";
import { ShimmerBlock } from "@/components/ui/Skeleton";

export default function AIInsightPanel() {
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNarrative = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kpiData: KPI_DATA }),
      });
      const data = await res.json();
      setNarrative(data.narrative ?? "No narrative returned.");
    } catch {
      setNarrative(
        "Unable to generate narrative at this time. Review KPI cards for latest metrics."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNarrative();
  }, [fetchNarrative]);

  return (
    <div className="bg-white border border-border border-l-[3px] border-l-primary rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          <span className="text-[11px] uppercase tracking-[0.08em] text-text-secondary font-semibold">
            AI Insight
          </span>
        </div>
        <button
          onClick={fetchNarrative}
          disabled={loading}
          className="flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] text-[11px] font-semibold text-text-secondary hover:text-primary hover:bg-surface transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Regenerate
        </button>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex flex-col gap-2.5">
          <ShimmerBlock className="h-4 w-full" />
          <ShimmerBlock className="h-4 w-[92%]" />
          <ShimmerBlock className="h-4 w-[78%]" />
        </div>
      ) : (
        <p className="text-[14px] leading-[1.5] text-text-primary font-sans">
          {narrative}
        </p>
      )}
    </div>
  );
}
