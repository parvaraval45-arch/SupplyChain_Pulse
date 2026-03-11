"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import clsx from "clsx";
import { KPI_DATA, type KPI, type StatusColor } from "@/data/mockData";
import { useDelayedLoad, SkeletonCard } from "@/components/ui/Skeleton";

const STATUS_HEX: Record<StatusColor, string> = {
  green: "#0D7C3D",
  amber: "#B45309",
  red: "#C4320A",
};

function KPICard({ kpi, ceoMode = false }: { kpi: KPI; ceoMode?: boolean }) {
  const color = STATUS_HEX[kpi.status];
  const trendUp = kpi.trend === "up";
  const trendIsPositive =
    kpi.id === "supply-chain-cost" ? !trendUp : trendUp;
  const TrendIcon = trendUp ? TrendingUp : TrendingDown;

  const chartData = kpi.history.map((v, i) => ({ i, v }));

  return (
    <div
      className={clsx(
        "relative bg-white border border-gray-100 rounded-xl shadow-card flex flex-col overflow-hidden card-hover",
        ceoMode ? "p-3 gap-2" : "p-5 gap-3"
      )}
    >
      {/* Label + status dot + trend badge */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
          {kpi.label}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold tabular-nums ${
              trendIsPositive
                ? "bg-[#ECFDF3] text-[#0D7C3D]"
                : "bg-[#FFF1F0] text-[#C4320A]"
            }`}
          >
            <TrendIcon size={12} />
            {kpi.trendValue}
          </span>
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>

      {/* Main value */}
      <p
        className={clsx(
          "font-semibold tracking-tight text-text-primary tabular-nums",
          ceoMode ? "text-3xl" : "text-4xl"
        )}
      >
        {kpi.value}
        <span className="text-[18px] text-text-secondary font-normal">{kpi.unit}</span>
      </p>

      {/* Target */}
      <span className="text-[12px] text-text-secondary tabular-nums">
        Target: {kpi.target}
        {kpi.unit}
      </span>

      {/* Sparkline — hidden in CEO mode */}
      {!ceoMode && (
        <div className="h-10 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bottom 3px colored bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px]"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export default function KPICards({ ceoMode = false }: { ceoMode?: boolean }) {
  const ready = useDelayedLoad(800);

  if (!ready) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {KPI_DATA.map((kpi) => (
        <KPICard key={kpi.id} kpi={kpi} ceoMode={ceoMode} />
      ))}
    </div>
  );
}
