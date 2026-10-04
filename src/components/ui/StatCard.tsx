"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
  color?: "cyan" | "emerald" | "amber" | "purple";
  className?: string;
}

const colorMap = {
  cyan: "text-axo-cyan",
  emerald: "text-axo-emerald",
  amber: "text-amber-400",
  purple: "text-purple-400",
};

export function StatCard({ label, value, sub, icon, color = "cyan", className }: StatCardProps) {
  return (
    <div className={cn("axo-card-glow p-4 flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-axo-muted text-xs font-medium uppercase tracking-wider">{label}</span>
        {icon && <span className={cn("text-sm", colorMap[color])}>{icon}</span>}
      </div>
      <div className={cn("axo-stat-value", colorMap[color])}>{value}</div>
      {sub && <div className="text-xs text-axo-muted">{sub}</div>}
    </div>
  );
}
