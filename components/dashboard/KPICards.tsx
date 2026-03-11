"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { KPI_DATA, type KPI, type StatusColor } from "@/data/mockData";
import { useDelayedLoad, SkeletonCard } from "@/components/ui/Skeleton";

const STATUS_COLOR: Record<StatusColor, string> = {
  green: "#00875A",
  amber: "#FF8B00",
  red: "#DE350B",
};

function KPICard({ kpi }: { kpi: KPI }) {
  const color = STATUS_COLOR[kpi.status];
  const trendUp = kpi.trend === "up";
  const trendIsPositive =
    kpi.id === "supply-chain-cost" ? !trendUp : trendUp;
  const TrendIcon = trendUp ? TrendingUp : TrendingDown;
  const trendColor = trendIsPositive ? "#00875A" : "#DE350B";

  const chartData = kpi.history.map((v, i) => ({ i, v }));

  return (
    <div className="relative bg-white border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 flex flex-col gap-3 overflow-hidden">
      {/* Label + status dot */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.08em] text-text-secondary font-semibold">
          {kpi.label}
        </span>
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Main value */}
      <p className="font-display text-[36px] leading-none text-text-primary">
        {kpi.value}
        <span className="text-[20px]">{kpi.unit}</span>
      </p>

      {/* Target + trend */}
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-text-secondary">
          Target: {kpi.target}
          {kpi.unit}
        </span>
        <span
          className="flex items-center gap-1 font-semibold"
          style={{ color: trendColor }}
        >
          <TrendIcon size={14} />
          {kpi.trendValue}
        </span>
      </div>

      {/* Sparkline */}
      <div className="h-12 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom status bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px]"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export default function KPICards() {
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
        <KPICard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
