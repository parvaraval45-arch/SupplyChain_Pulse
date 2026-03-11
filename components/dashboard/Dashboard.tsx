"use client";

import DashboardLayout from "./DashboardLayout";
import KPICards from "./KPICards";
import AIInsightPanel from "./AIInsightPanel";
import DrillDownSection from "./DrillDownSection";
import { InitiativeTable, CEOInitiativeStrip } from "./InitiativeTracker";
import RiskRadar from "./RiskRadar";
import PerformanceTab from "./PerformanceTab";
import clsx from "clsx";

export default function Dashboard() {
  return (
    <DashboardLayout>
      {({ activeTab, ceoMode, setActiveTab }) => (
        <div
          key={activeTab}
          className={clsx("tab-enter", ceoMode && "ceo-mode")}
          data-active-tab={activeTab}
        >
          {activeTab === "overview" && (
            <div data-tab="overview" className="flex flex-col gap-8">
              <KPICards ceoMode={ceoMode} />
              <AIInsightPanel />
              {ceoMode && (
                <CEOInitiativeStrip
                  onNavigate={() => setActiveTab("initiatives")}
                />
              )}
              {!ceoMode && <DrillDownSection />}
            </div>
          )}
          {activeTab === "initiatives" && (
            <div data-tab="initiatives" className="flex flex-col gap-8">
              <InitiativeTable />
            </div>
          )}
          {activeTab === "risk" && (
            <div data-tab="risk" className="flex flex-col gap-8">
              <RiskRadar />
            </div>
          )}
          {activeTab === "performance" && (
            <div data-tab="performance" className="flex flex-col gap-8">
              <PerformanceTab />
            </div>
          )}
          <span className="sr-only">{String(ceoMode)}</span>
        </div>
      )}
    </DashboardLayout>
  );
}
