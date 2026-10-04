"use client";

// ================================================================
//  AXO — DemoBar (Light Design)
// ================================================================

import { useState } from "react";
import { FlaskConical, X, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useDemo, demoCases, type DemoCase } from "@/lib/demoContext";
import { cn } from "@/lib/utils";

export function DemoBar() {
  const { activeCase, setCase, exitDemo, isDemoActive } = useDemo();
  const [expanded, setExpanded] = useState(false);
  const [justActivated, setJustActivated] = useState<DemoCase | null>(null);

  const handleSelect = (id: DemoCase) => {
    setCase(id);
    setJustActivated(id);
    setExpanded(false);
    setTimeout(() => setJustActivated(null), 2500);
  };

  const CASE_STYLES: Record<string, string> = {
    caso1: "border-axo-cyan/40 bg-axo-blue-light text-axo-cyan",
    caso2: "border-axo-emerald/40 bg-axo-emerald-light text-axo-emerald",
    caso3: "border-purple-300 bg-purple-50 text-purple-700",
  };

  return (
    <div className="relative z-40">
      <div className={cn(
        "w-full border-b transition-all",
        isDemoActive
          ? "bg-axo-blue-light border-axo-cyan/20"
          : "bg-white border-axo-border"
      )}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          {/* Label */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className={cn(
              "flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full border",
              isDemoActive
                ? "text-axo-cyan border-axo-cyan/30 bg-white"
                : "text-axo-muted border-axo-border bg-axo-bg"
            )}>
              <FlaskConical size={11} />
              {isDemoActive ? "DEMO ACTIVO" : "MODO DEMO — Para inversores"}
            </div>

            {isDemoActive && (
              <div className="flex items-center gap-1.5 animate-fade-in">
                <Sparkles size={11} className="text-axo-cyan" />
                <span className="text-xs text-axo-cyan font-semibold hidden sm:inline">
                  {demoCases.find((d) => d.id === activeCase)?.emoji}{" "}
                  {demoCases.find((d) => d.id === activeCase)?.label}
                </span>
              </div>
            )}
          </div>

          {/* Desktop case pills */}
          <div className="hidden md:flex items-center gap-2">
            {demoCases.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={cn(
                  "flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all duration-200",
                  activeCase === c.id
                    ? CASE_STYLES[c.id] ?? ""
                    : "border-axo-border text-axo-muted bg-white hover:border-axo-cyan/30 hover:text-axo-text"
                )}
              >
                <span>{c.emoji}</span>
                <span className="hidden lg:inline">Caso {c.id.replace("caso", "")}: </span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Right: mobile + exit */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="md:hidden flex items-center gap-1 text-xs text-axo-muted hover:text-axo-text px-2 py-1.5 rounded-xl border border-axo-border bg-white"
              onClick={() => setExpanded(!expanded)}
            >
              Casos {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {isDemoActive && (
              <button
                onClick={exitDemo}
                className="flex items-center gap-1 text-[11px] text-axo-muted hover:text-red-600 border border-axo-border hover:border-red-300 hover:bg-red-50 px-2.5 py-1.5 rounded-xl transition-all bg-white"
              >
                <X size={11} /> Salir
              </button>
            )}
          </div>
        </div>

        {/* Mobile expanded */}
        {expanded && (
          <div className="md:hidden border-t border-axo-border px-4 py-3 flex flex-col gap-2 bg-white animate-slide-up">
            {demoCases.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border text-left transition-all",
                  activeCase === c.id
                    ? CASE_STYLES[c.id] ?? ""
                    : "border-axo-border text-axo-muted hover:border-axo-cyan/30 hover:text-axo-text"
                )}
              >
                <span className="text-xl flex-shrink-0">{c.emoji}</span>
                <div>
                  <p className="text-xs font-bold">Caso {c.id.replace("caso", "")}: {c.label}</p>
                  <p className="text-[10px] opacity-70 mt-0.5">{c.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Activation toast */}
      {justActivated && (
        <div className="absolute left-1/2 -translate-x-1/2 top-14 z-50 animate-slide-up pointer-events-none">
          <div className="bg-white border border-axo-cyan/30 shadow-axo-card-md rounded-2xl px-5 py-3 flex items-center gap-3 whitespace-nowrap">
            <Sparkles size={14} className="text-axo-cyan" />
            <span className="text-sm font-bold text-axo-text">
              {demoCases.find((d) => d.id === justActivated)?.emoji}{" "}
              {demoCases.find((d) => d.id === justActivated)?.label} activado
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
