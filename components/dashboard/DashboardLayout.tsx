"use client";

import { useState, useCallback } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  CheckSquare,
  ShieldAlert,
  Calendar,
  Printer,
  X,
} from "lucide-react";
import clsx from "clsx";

type Tab = "overview" | "performance" | "initiatives" | "risk";

const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "performance", label: "Performance", icon: TrendingUp },
  { id: "initiatives", label: "Initiatives", icon: CheckSquare },
  { id: "risk", label: "Risk Radar", icon: ShieldAlert },
];

const PAGE_TITLES: Record<Tab, string> = {
  overview: "Supply Chain Overview",
  performance: "Performance Analytics",
  initiatives: "Strategic Initiatives",
  risk: "Risk Radar",
};

export default function DashboardLayout({
  children,
}: {
  children?: (props: {
    activeTab: Tab;
    ceoMode: boolean;
    setActiveTab: (tab: Tab) => void;
  }) => React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [ceoMode, setCeoMode] = useState(false);
  const [toast, setToast] = useState(false);

  const handleExport = useCallback(() => {
    setToast(true);
    setTimeout(() => {
      window.print();
      setToast(false);
    }, 600);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="print:hidden flex flex-col justify-between w-[220px] shrink-0 bg-white border-r border-border">
        {/* Logo + nav */}
        <div>
          {/* Brand */}
          <div className="px-5 pt-6 pb-5">
            <h1 className="font-display text-[22px] leading-tight text-primary">
              AbbVie
            </h1>
            <span className="text-[11px] uppercase tracking-widest text-text-secondary font-sans">
              Supply Chain Pulse
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-0.5 px-2">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={clsx(
                    "flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors text-left",
                    active
                      ? "border-l-[3px] border-primary bg-[#F0F6FF] text-primary"
                      : "border-l-[3px] border-transparent text-text-secondary hover:bg-surface hover:text-text-primary"
                  )}
                >
                  <Icon size={18} strokeWidth={active ? 2 : 1.5} />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom badge */}
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 text-[11px] text-text-secondary">
            <Calendar size={14} />
            <span>Q2 2026 Review</span>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="print:hidden flex items-center justify-between h-14 px-6 bg-white border-b border-border shrink-0">
          <h2 className="text-[18px] font-bold text-text-primary">
            {PAGE_TITLES[activeTab]}
          </h2>

          <div className="flex items-center gap-3">
            {/* CEO View toggle */}
            <button
              onClick={() => {
                setCeoMode((prev) => !prev);
                if (!ceoMode) setActiveTab("overview");
              }}
              className={clsx(
                "px-3 py-1.5 rounded text-[12px] font-medium border transition-colors",
                ceoMode
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-text-secondary border-border hover:border-primary hover:text-primary"
              )}
            >
              CEO View
            </button>

            {/* Export PDF */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-white text-[12px] font-medium hover:bg-dark transition-colors"
            >
              <Printer size={14} />
              Export PDF
            </button>

            {/* Timestamp */}
            <span className="text-[12px] text-text-secondary whitespace-nowrap">
              Updated 09:41 AM CT
            </span>
          </div>
        </header>

        {/* CEO Mode banner */}
        {ceoMode && (
          <div className="print:hidden flex items-center justify-between px-6 py-2 bg-primary text-white text-[12px] font-medium">
            <span>CEO View — Showing top-line summary only</span>
            <button
              onClick={() => setCeoMode(false)}
              className="p-0.5 rounded hover:bg-white/20 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-surface p-6 print:bg-white print:p-0 print:overflow-visible">
          {children?.({ activeTab, ceoMode, setActiveTab })}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="print:hidden fixed bottom-6 right-6 px-4 py-2.5 bg-dark text-white text-[13px] font-medium rounded-lg shadow-lg animate-fade-in z-50">
          Preparing export...
        </div>
      )}
    </div>
  );
}
