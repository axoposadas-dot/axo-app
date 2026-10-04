"use client";

// ================================================================
//  AXO — DemoBar
//  Barra flotante de selección de Caso de Prueba para inversores
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

  return (
    <div className="relative z-40">
      {/* ── COLLAPSED BAR ── */}
      <div
        className={cn(
          "w-full border-b transition-all duration-300",
          isDemoActive
            ? "bg-[#0A0F1D] border-axo-cyan/30"
            : "bg-[#060B16] border-axo-border"
        )}
      >
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          {/* Left: label */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border",
                isDemoActive
                  ? "text-axo-cyan border-axo-cyan/40 bg-axo-cyan/10"
                  : "text-axo-muted border-axo-border"
              )}
            >
              <FlaskConical size={11} />
              {isDemoActive ? "DEMO ACTIVO" : "MODO DEMO"}
            </div>

            {isDemoActive && (
              <div className="flex items-center gap-1 animate-fade-in">
                <Sparkles size={11} className="text-axo-cyan" />
                <span className="text-xs text-axo-cyan font-semibold hidden sm:inline">
                  {demoCases.find((d) => d.id === activeCase)?.emoji}{" "}
                  {demoCases.find((d) => d.id === activeCase)?.label}
                </span>
              </div>
            )}
          </div>

          {/* Center: caso pills (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {demoCases.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={cn(
                  "flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200",
                  activeCase === c.id
                    ? c.color
                    : "border-axo-border text-axo-muted hover:text-axo-text hover:border-axo-muted"
                )}
              >
                <span>{c.emoji}</span>
                <span className="hidden lg:inline">
                  Caso {c.id.replace("caso", "")}: {c.label}
                </span>
                <span className="lg:hidden">Caso {c.id.replace("caso", "")}</span>
              </button>
            ))}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile expand */}
            <button
              className="md:hidden flex items-center gap-1 text-xs text-axo-muted hover:text-axo-text px-2 py-1 rounded-lg border border-axo-border"
              onClick={() => setExpanded(!expanded)}
            >
              Casos {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {isDemoActive && (
              <button
                onClick={exitDemo}
                className="flex items-center gap-1 text-[11px] text-axo-muted hover:text-red-400 border border-axo-border hover:border-red-500/30 px-2.5 py-1.5 rounded-full transition-all"
              >
                <X size={11} /> Salir Demo
              </button>
            )}
          </div>
        </div>

        {/* Mobile expanded panel */}
        {expanded && (
          <div className="md:hidden border-t border-axo-border px-4 py-3 flex flex-col gap-2 animate-slide-up bg-[#060B16]">
            {demoCases.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border text-left transition-all",
                  activeCase === c.id
                    ? c.color
                    : "border-axo-border text-axo-muted hover:border-axo-muted hover:text-axo-text"
                )}
              >
                <span className="text-xl flex-shrink-0">{c.emoji}</span>
                <div>
                  <p className="text-xs font-bold">
                    Caso {c.id.replace("caso", "")}: {c.label}
                  </p>
                  <p className="text-[10px] opacity-70 mt-0.5">{c.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── ACTIVATION TOAST ── */}
      {justActivated && (
        <div className="absolute left-1/2 -translate-x-1/2 top-14 z-50 animate-slide-up pointer-events-none">
          <div className="bg-axo-bg-card border border-axo-cyan/40 shadow-axo-glow rounded-2xl px-5 py-3 flex items-center gap-3 whitespace-nowrap">
            <Sparkles size={14} className="text-axo-cyan" />
            <span className="text-sm font-bold text-axo-cyan">
              {demoCases.find((d) => d.id === justActivated)?.emoji}{" "}
              {demoCases.find((d) => d.id === justActivated)?.label} activado
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
