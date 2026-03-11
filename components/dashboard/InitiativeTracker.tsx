"use client";

import { useState } from "react";
import {
  User,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";
import { INITIATIVES, type StatusColor } from "@/data/mockData";
import { useDelayedLoad, SkeletonRows } from "@/components/ui/Skeleton";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<
  StatusColor,
  { label: string; bg: string; text: string; hex: string; Icon: React.ElementType }
> = {
  green: {
    label: "On Track",
    bg: "bg-[#ECFDF3]",
    text: "text-[#0D7C3D]",
    hex: "#0D7C3D",
    Icon: CheckCircle2,
  },
  amber: {
    label: "At Risk",
    bg: "bg-[#FFF7ED]",
    text: "text-[#B45309]",
    hex: "#B45309",
    Icon: AlertTriangle,
  },
  red: {
    label: "Delayed",
    bg: "bg-[#FFF1F0]",
    text: "text-[#C4320A]",
    hex: "#C4320A",
    Icon: XCircle,
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Full Table View ────────────────────────────────────────────────────────

export function InitiativeTable() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const ready = useDelayedLoad(800);

  if (!ready) return <SkeletonRows count={5} />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <h3 className="text-[13px] uppercase tracking-widest text-text-secondary font-semibold">
          Strategic Initiatives
        </h3>
        <span className="px-2 py-1 rounded-md text-[11px] font-semibold uppercase text-text-secondary bg-surface">
          {INITIATIVES.length} Programs
        </span>
      </div>

      {/* Table — no outer border per spec */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_140px_100px_160px_100px_1fr] gap-2 px-5 py-3 border-b border-gray-100 text-[11px] uppercase tracking-widest text-text-secondary font-semibold">
          <span>Initiative</span>
          <span>Owner</span>
          <span>Due Date</span>
          <span>Progress</span>
          <span>Status</span>
          <span>Milestone</span>
        </div>

        {/* Rows */}
        {INITIATIVES.map((init) => {
          const expanded = expandedId === init.id;
          const cfg = STATUS_CFG[init.status];

          return (
            <div key={init.id}>
              <button
                onClick={() => setExpandedId(expanded ? null : init.id)}
                className={clsx(
                  "grid grid-cols-[1fr_140px_100px_160px_100px_1fr] gap-2 items-center w-full px-5 h-[44px] text-left border-b border-gray-100 transition-colors",
                  "hover:bg-surface",
                  expanded && "bg-surface"
                )}
              >
                {/* Name */}
                <div className="flex items-center gap-2 min-w-0">
                  <p className="text-[14px] font-semibold text-text-primary truncate">
                    {init.name}
                  </p>
                  <ChevronDown
                    size={14}
                    className={clsx(
                      "text-text-secondary shrink-0 transition-transform duration-200",
                      expanded && "rotate-180"
                    )}
                  />
                </div>

                {/* Owner */}
                <div className="flex items-center gap-1.5 text-[14px] text-text-primary">
                  <User size={13} className="text-text-secondary shrink-0" />
                  <span className="truncate">{init.owner}</span>
                </div>

                {/* Due date */}
                <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
                  <CalendarDays size={13} className="shrink-0" />
                  <span>{formatDate(init.dueDate)}</span>
                </div>

                {/* Progress bar — 8px height, rounded-full */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${init.progress}%`, backgroundColor: cfg.hex }}
                    />
                  </div>
                  <span className="text-[12px] font-semibold tabular-nums text-text-primary w-8 text-right">
                    {init.progress}%
                  </span>
                </div>

                {/* Status badge — colored pill */}
                <span
                  className={clsx(
                    "inline-flex items-center justify-center px-2 py-1 rounded-md text-[11px] font-semibold uppercase w-fit",
                    cfg.bg,
                    cfg.text
                  )}
                >
                  {cfg.label}
                </span>

                {/* Milestone */}
                <p className="text-[12px] italic text-text-secondary truncate">
                  {init.milestone}
                </p>
              </button>

              {/* Expanded detail */}
              {expanded && (
                <div className="px-5 py-4 bg-surface border-b border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-[14px]">
                    <div>
                      <span className="text-[11px] uppercase tracking-widest text-text-secondary font-semibold block mb-1">
                        Description
                      </span>
                      <p className="text-text-primary leading-[1.5]">
                        {init.description}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-widest text-text-secondary font-semibold block mb-1">
                        Current Milestone
                      </span>
                      <p className="text-text-primary leading-[1.5]">
                        {init.milestone}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-[12px] text-text-secondary">
                        <span>
                          Owner: <strong className="text-text-primary">{init.owner}</strong>
                        </span>
                        <span>
                          Due: <strong className="text-text-primary">{formatDate(init.dueDate)}</strong>
                        </span>
                        <span className={clsx("font-semibold", cfg.text)}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CEO Summary Card ───────────────────────────────────────────────────────

export function InitiativeSummaryCard({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const counts: Record<StatusColor, number> = { green: 0, amber: 0, red: 0 };
  INITIATIVES.forEach((i) => counts[i.status]++);

  const stats = [
    { ...STATUS_CFG.green, count: counts.green },
    { ...STATUS_CFG.amber, count: counts.amber },
    { ...STATUS_CFG.red, count: counts.red },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-widest text-text-secondary font-semibold">
          Strategic Initiatives
        </span>
        <span className="px-2 py-1 rounded-md text-[11px] font-semibold uppercase text-text-secondary bg-surface">
          {INITIATIVES.length} Programs
        </span>
      </div>

      <div className="flex items-center gap-6">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <s.Icon size={16} style={{ color: s.hex }} />
            <span
              className="text-[22px] font-bold font-heading tabular-nums"
              style={{ color: s.hex }}
            >
              {s.count}
            </span>
            <span className="text-[12px] text-text-secondary">{s.label}</span>
          </div>
        ))}
      </div>

      {onNavigate && (
        <button
          onClick={onNavigate}
          className="flex items-center gap-1 mt-4 h-8 text-[12px] font-semibold text-primary hover:text-dark transition-colors"
        >
          View all initiatives
          <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}
