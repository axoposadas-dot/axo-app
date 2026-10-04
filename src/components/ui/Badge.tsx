"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "cyan" | "emerald" | "amber" | "red" | "purple" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "axo-badge",
        {
          "axo-badge-cyan":    variant === "cyan",
          "axo-badge-emerald": variant === "emerald",
          "axo-badge-amber":   variant === "amber",
          "axo-badge-red":     variant === "red",
          "axo-badge-purple":  variant === "purple",
          "bg-axo-bg border border-axo-border text-axo-muted": variant === "default",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
