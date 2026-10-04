"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart, Car, Store, Package, Menu, X, Zap, Bell,
} from "lucide-react";
import { MarketView } from "@/components/views/MarketView";
import { MoveView } from "@/components/views/MoveView";
import { SellerView } from "@/components/views/SellerView";
import { DriverView } from "@/components/views/DriverView";
import { DemoBar } from "@/components/demo/DemoBar";
import { Caso1View } from "@/components/cases/Caso1View";
import { Caso2View } from "@/components/cases/Caso2View";
import { Caso3View } from "@/components/cases/Caso3View";
import { DemoProvider, useDemo, demoCases } from "@/lib/demoContext";
import { cn } from "@/lib/utils";

type Role = "buyer" | "seller" | "driver";
type BuyerMode = "market" | "move";

interface RoleTab {
  key: Role;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const roles: RoleTab[] = [
  {
    key: "buyer",
    label: "Comprador",
    icon: <ShoppingCart size={18} />,
    description: "AXO Market & Move",
    color: "text-axo-cyan border-axo-cyan bg-axo-cyan/10",
  },
  {
    key: "seller",
    label: "Vendedor",
    icon: <Store size={18} />,
    description: "Mi Negocio AXO",
    color: "text-axo-emerald border-axo-emerald bg-axo-emerald/10",
  },
  {
    key: "driver",
    label: "Conductor",
    icon: <Package size={18} />,
    description: "Sumo Envíos & Move",
    color: "text-purple-400 border-purple-400 bg-purple-500/10",
  },
];

// ── Inner shell (needs context) ─────────────────────────────────
function AppShellInner() {
  const { activeCase, isDemoActive, caseConfig } = useDemo();
  const [activeRole, setActiveRole] = useState<Role>("buyer");
  const [buyerMode, setBuyerMode] = useState<BuyerMode>("market");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);

  // When a demo case activates, route to the right role/mode
  useEffect(() => {
    if (!caseConfig) return;
    setActiveRole(caseConfig.role);
    if (caseConfig.buyerMode) setBuyerMode(caseConfig.buyerMode);
    setMobileMenuOpen(false);
  }, [caseConfig]);

  // Derive glow color from active case
  const glowColor = caseConfig?.glowColor ?? "#00F2FE";

  return (
    <div
      className="min-h-screen bg-axo-bg flex flex-col transition-all duration-500"
      style={
        isDemoActive
          ? { boxShadow: `inset 0 0 120px ${glowColor}08` }
          : undefined
      }
    >
      {/* ── TOP NAV ────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 bg-axo-bg/90 backdrop-blur-md border-b border-axo-border"
        style={
          isDemoActive
            ? { borderBottomColor: `${glowColor}30` }
            : undefined
        }
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-axo-glow-sm transition-all duration-500"
              style={{
                background: isDemoActive
                  ? `linear-gradient(135deg, ${glowColor} 0%, #00FF88 100%)`
                  : "linear-gradient(135deg, #00F2FE 0%, #00FF88 100%)",
              }}
            >
              <span className="text-[#0A0F1D] font-black text-lg leading-none">A</span>
            </div>
            <div>
              <span className="font-black text-axo-text text-lg tracking-tight leading-none">AXO</span>
              <p className="text-[10px] text-axo-muted leading-none">Megasion Desarrollos</p>
            </div>
          </div>

          {/* Desktop role tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-axo-bg-card rounded-xl p-1 border border-axo-border flex-1 max-w-sm mx-auto">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => { setActiveRole(role.key); setMobileMenuOpen(false); }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all",
                  activeRole === role.key
                    ? role.color + " border"
                    : "text-axo-muted hover:text-axo-text"
                )}
              >
                {role.icon}
                <span>{role.label}</span>
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="relative p-2 rounded-xl hover:bg-axo-bg-card transition-colors">
              <Bell size={18} className="text-axo-muted" />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-axo-cyan" />
              )}
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#0A0F1D] text-xs font-black"
              style={{ background: "linear-gradient(135deg, #00F2FE 0%, #00FF88 100%)" }}
            >
              U
            </div>
            {/* Mobile menu */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-axo-bg-card transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X size={18} className="text-axo-text" />
              ) : (
                <Menu size={18} className="text-axo-text" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-axo-border bg-axo-bg-card px-4 py-3 flex flex-col gap-2 animate-slide-up">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => { setActiveRole(role.key); setMobileMenuOpen(false); }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all",
                  activeRole === role.key
                    ? role.color + " border"
                    : "text-axo-muted hover:text-axo-text hover:bg-axo-bg-card-hover"
                )}
              >
                {role.icon}
                <div className="text-left">
                  <p>{role.label}</p>
                  <p className="text-[10px] font-normal opacity-70">{role.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── DEMO BAR ─────────────────────────────────────────── */}
      <DemoBar />

      {/* ── BUYER MODE SELECTOR ─────────────────────────────── */}
      {activeRole === "buyer" && !isDemoActive && (
        <div className="sticky top-[61px] z-40 bg-axo-bg/90 backdrop-blur-md border-b border-axo-border">
          <div className="max-w-6xl mx-auto px-4 py-2.5 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setBuyerMode("market")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border flex-shrink-0",
                buyerMode === "market"
                  ? "bg-axo-cyan/10 border-axo-cyan text-axo-cyan"
                  : "border-axo-border text-axo-muted hover:text-axo-text bg-axo-bg-card"
              )}
            >
              <ShoppingCart size={15} />
              Compras & Ofertas
            </button>
            <button
              onClick={() => setBuyerMode("move")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border flex-shrink-0",
                buyerMode === "move"
                  ? "bg-purple-500/10 border-purple-400 text-purple-400"
                  : "border-axo-border text-axo-muted hover:text-axo-text bg-axo-bg-card"
              )}
            >
              <Car size={15} />
              Movilidad & Traslados
            </button>
          </div>
        </div>
      )}

      {/* ── DEMO CASE BREADCRUMB ─────────────────────────────── */}
      {isDemoActive && caseConfig && (
        <div
          className="border-b py-2.5 px-4"
          style={{ borderColor: `${glowColor}25`, backgroundColor: `${glowColor}06` }}
        >
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs">
            <span className="text-axo-muted">Ejecutando:</span>
            <span className="font-bold" style={{ color: glowColor }}>
              {caseConfig.emoji} {caseConfig.label}
            </span>
            <span className="text-axo-muted">·</span>
            <span className="text-axo-muted">{caseConfig.subtitle}</span>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* Demo cases take priority */}
        {isDemoActive && activeCase === "caso1" && <Caso1View />}
        {isDemoActive && activeCase === "caso2" && <Caso2View />}
        {isDemoActive && activeCase === "caso3" && <Caso3View />}

        {/* Normal views when no demo active */}
        {!isDemoActive && activeRole === "buyer" && buyerMode === "market" && <MarketView />}
        {!isDemoActive && activeRole === "buyer" && buyerMode === "move" && <MoveView />}
        {!isDemoActive && activeRole === "seller" && <SellerView />}
        {!isDemoActive && activeRole === "driver" && <DriverView />}
      </main>

      {/* ── BOTTOM NAV (Mobile) ──────────────────────────────── */}
      <nav className="md:hidden sticky bottom-0 z-50 bg-axo-bg/95 backdrop-blur-md border-t border-axo-border">
        <div className="flex items-center px-2 py-1.5">
          {roles.map((role) => (
            <button
              key={role.key}
              onClick={() => setActiveRole(role.key)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all",
                activeRole === role.key
                  ? role.color.split(" ")[0]
                  : "text-axo-muted"
              )}
            >
              {role.icon}
              <span className="text-[10px] font-semibold leading-none">{role.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="hidden md:block border-t border-axo-border py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] text-axo-muted">
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-axo-cyan" />
            <span>
              <strong className="text-axo-text">AXO</strong> by Megasion Desarrollos INC. — Posadas, Misiones · MVP 2027
            </span>
          </div>
          <div className="flex items-center gap-4">
            {isDemoActive && (
              <span className="text-axo-cyan font-semibold animate-pulse">
                ● Modo Demo Activo — {demoCases.find((d) => d.id === activeCase)?.label}
              </span>
            )}
            <span>🌐 Posadas · Encarnación · Región NEA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Public export wraps with provider ──────────────────────────
export function AppShell() {
  return (
    <DemoProvider>
      <AppShellInner />
    </DemoProvider>
  );
}
