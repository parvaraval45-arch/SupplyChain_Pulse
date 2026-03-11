"use client";

import DashboardLayout from "./DashboardLayout";
import KPICards from "./KPICards";
import AIInsightPanel from "./AIInsightPanel";
import DrillDownSection from "./DrillDownSection";
import { InitiativeTable, InitiativeSummaryCard } from "./InitiativeTracker";
import RiskRadar from "./RiskRadar";

export default function Dashboard() {
  return (
    <DashboardLayout>
      {({ activeTab, ceoMode, setActiveTab }) => (
        <div key={activeTab} className="flex flex-col gap-8 tab-enter">
          {activeTab === "overview" && (
            <>
              <KPICards />
              <AIInsightPanel />
              {ceoMode && (
                <InitiativeSummaryCard
                  onNavigate={() => setActiveTab("initiatives")}
                />
              )}
              {!ceoMode && <DrillDownSection />}
            </>
          )}
          {activeTab === "initiatives" && <InitiativeTable />}
          {activeTab === "risk" && <RiskRadar />}
          {activeTab === "performance" && (
            <div className="text-text-secondary text-[14px] leading-[1.5]">
              <span className="sr-only">{String(ceoMode)}</span>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
