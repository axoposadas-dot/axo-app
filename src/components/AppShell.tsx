"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ShoppingCart, Store, Package, Search, MapPin,
  Bell, ChevronDown, X, Menu, Zap, User, TrendingUp,
} from "lucide-react";
import { MarketView } from "@/components/views/MarketView";
import { MoveView } from "@/components/views/MoveView";
import { SellerView } from "@/components/views/SellerView";
import { DriverView } from "@/components/views/DriverView";
import { DemoBar } from "@/components/demo/DemoBar";
import { Caso1View } from "@/components/cases/Caso1View";
import { Caso2View } from "@/components/cases/Caso2View";
import { Caso3View } from "@/components/cases/Caso3View";
import { DemoProvider, useDemo } from "@/lib/demoContext";
import { cn } from "@/lib/utils";

type Role = "buyer" | "seller" | "driver";
type BuyerMode = "market" | "move";

// ── Category chips ────────────────────────────────────────────
const CATEGORIES = [
  { emoji: "🍨", label: "Gastronomía" },
  { emoji: "💻", label: "Tecnología" },
  { emoji: "🚗", label: "Movilidad" },
  { emoji: "🛒", label: "Supermercado" },
  { emoji: "🥖", label: "Panificados" },
  { emoji: "🌉", label: "Frontera" },
];

// ── Role tabs ─────────────────────────────────────────────────
const ROLES = [
  { key: "buyer" as Role,  icon: <ShoppingCart size={15} />, label: "Comprador",  desc: "AXO Market & Move", color: "text-axo-cyan" },
  { key: "seller" as Role, icon: <Store size={15} />,        label: "Vendedor",   desc: "Mi Negocio AXO",   color: "text-axo-emerald" },
  { key: "driver" as Role, icon: <Package size={15} />,      label: "Conductor",  desc: "Sumo Envíos",      color: "text-purple-700" },
];

// ── Bridge status mini-banner (rotating) ─────────────────────
const BRIDGE_ITEMS = [
  "🌉 Puente Posadas–Encarnación: FLUIDO · 8 min espera",
  "🟢 Aduana abierta · Control normal",
  "💱 USD 1 = ARS 1.285 · Tipo de cambio referencial",
  "📦 Franquicia exenta: USD 300 por persona",
  "⚡ AXO Move disponible al puente — pedí tu traslado ahora",
];

function AppShellInner() {
  const { activeCase, isDemoActive, caseConfig } = useDemo();
  const [activeRole, setActiveRole] = useState<Role>("buyer");
  const [buyerMode, setBuyerMode] = useState<BuyerMode>("market");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [cartCount] = useState(2);
  const searchRef = useRef<HTMLInputElement>(null);

  // Auto-route when demo activates
  useEffect(() => {
    if (!caseConfig) return;
    setActiveRole(caseConfig.role);
    if (caseConfig.buyerMode) setBuyerMode(caseConfig.buyerMode);
    setMobileMenuOpen(false);
  }, [caseConfig]);

  const isBuyer = activeRole === "buyer";

  return (
    <div className="min-h-screen bg-axo-bg flex flex-col font-sans">

      {/* ── TOP INFO BAR — Bridge status ─────────────────────── */}
      <div className="bg-axo-cyan text-white overflow-hidden h-8 flex items-center">
        <div className="flex animate-marquee whitespace-nowrap gap-16 text-xs font-medium">
          {[...BRIDGE_ITEMS, ...BRIDGE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-2 pr-12">{item}</span>
          ))}
        </div>
      </div>

      {/* ── MAIN HEADER ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-axo-border shadow-sm">
        {/* Row 1: Logo + Search + Actions */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-axo-gradient flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-lg leading-none">A</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-black text-axo-text text-xl leading-none tracking-tight">AXO</p>
              <p className="text-[9px] text-axo-muted leading-none font-medium">Posadas · Encarnación</p>
            </div>
          </Link>

          {/* Location selector */}
          <button className="hidden md:flex items-center gap-1.5 text-xs text-axo-muted hover:text-axo-cyan transition-colors flex-shrink-0 border border-axo-border rounded-xl px-3 py-2.5 bg-axo-bg hover:border-axo-cyan">
            <MapPin size={13} className="text-axo-cyan" />
            <div className="text-left">
              <p className="font-semibold text-axo-text text-[11px] leading-tight">Posadas, Misiones</p>
              <p className="text-[10px] text-axo-muted leading-tight">Cambiar ubicación</p>
            </div>
            <ChevronDown size={12} className="ml-1 text-axo-muted" />
          </button>

          {/* Search bar — CENTRAL */}
          <div className="flex-1 relative max-w-2xl">
            <Search
              size={18}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none",
                searchFocused ? "text-axo-cyan" : "text-axo-muted"
              )}
            />
            <input
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="¿Qué buscás hoy en Posadas o Encarnación?"
              className="axo-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-axo-muted hover:text-axo-text"
              >
                <X size={15} />
              </button>
            )}
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-axo-cyan hover:bg-axo-cyan-dim text-white rounded-xl px-3 py-2 text-xs font-bold transition-colors">
              Buscar
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl hover:bg-axo-bg transition-colors">
              <Bell size={20} className="text-axo-muted" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* Cart */}
            {isBuyer && (
              <button className="relative p-2.5 rounded-xl hover:bg-axo-bg transition-colors">
                <ShoppingCart size={20} className="text-axo-muted" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-axo-cyan text-white text-[10px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Avatar */}
            <button className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl hover:bg-axo-bg transition-colors border border-axo-border">
              <div className="w-7 h-7 rounded-full bg-axo-gradient flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <span className="hidden sm:block text-xs font-semibold text-axo-text">Mi cuenta</span>
              <ChevronDown size={13} className="text-axo-muted" />
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-axo-bg transition-colors"
            >
              {mobileMenuOpen ? <X size={20} className="text-axo-text" /> : <Menu size={20} className="text-axo-text" />}
            </button>
          </div>
        </div>

        {/* Row 2: Role tabs + Category bar (desktop) */}
        <div className="border-t border-axo-border bg-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
            {/* Role switcher */}
            <div className="flex items-center gap-1 bg-axo-bg rounded-xl p-1 border border-axo-border flex-shrink-0">
              {ROLES.map((role) => (
                <button
                  key={role.key}
                  onClick={() => { setActiveRole(role.key); setMobileMenuOpen(false); }}
                  className={cn(
                    "flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                    activeRole === role.key
                      ? "bg-white shadow-sm text-axo-cyan border border-axo-border"
                      : "text-axo-muted hover:text-axo-text"
                  )}
                >
                  {role.icon}
                  <span className="hidden sm:inline">{role.label}</span>
                </button>
              ))}
            </div>

            {/* Category chips (desktop) */}
            {isBuyer && (
              <div className="hidden md:flex items-center gap-1 overflow-x-auto">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    className="flex items-center gap-1.5 text-xs font-medium text-axo-muted hover:text-axo-cyan px-3 py-1.5 rounded-xl hover:bg-axo-blue-light transition-all whitespace-nowrap"
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Buyer mode pills */}
            {isBuyer && !isDemoActive && (
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => setBuyerMode("market")}
                  className={cn(
                    "text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all",
                    buyerMode === "market"
                      ? "bg-axo-blue-light border-axo-cyan text-axo-cyan"
                      : "border-axo-border text-axo-muted hover:text-axo-cyan hover:border-axo-cyan/50"
                  )}
                >
                  🛒 Compras
                </button>
                <button
                  onClick={() => setBuyerMode("move")}
                  className={cn(
                    "text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all",
                    buyerMode === "move"
                      ? "bg-purple-50 border-purple-400 text-purple-700"
                      : "border-axo-border text-axo-muted hover:text-purple-700 hover:border-purple-400/50"
                  )}
                >
                  🚗 Movilidad
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-axo-border bg-white px-4 py-3 flex flex-col gap-2 animate-slide-up shadow-lg">
            {ROLES.map((role) => (
              <button
                key={role.key}
                onClick={() => { setActiveRole(role.key); setMobileMenuOpen(false); }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all text-left",
                  activeRole === role.key
                    ? "bg-axo-blue-light text-axo-cyan border border-axo-cyan/20"
                    : "text-axo-muted hover:bg-axo-bg hover:text-axo-text"
                )}
              >
                {role.icon}
                <div>
                  <p>{role.label}</p>
                  <p className="text-[10px] font-normal opacity-70">{role.desc}</p>
                </div>
              </button>
            ))}
            {/* Mobile categories */}
            <div className="pt-2 border-t border-axo-border">
              <p className="text-[10px] text-axo-muted uppercase tracking-wider font-semibold mb-2">Categorías</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    className="flex items-center gap-1 text-xs font-medium bg-axo-bg border border-axo-border rounded-xl px-3 py-1.5 text-axo-muted hover:text-axo-cyan hover:border-axo-cyan/40 transition-all"
                  >
                    <span>{cat.emoji}</span> {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── DEMO BAR ─────────────────────────────────────────── */}
      <DemoBar />

      {/* ── DEMO BREADCRUMB ──────────────────────────────────── */}
      {isDemoActive && caseConfig && (
        <div className="bg-axo-blue-light border-b border-axo-cyan/20 py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs">
            <span className="text-axo-muted">Caso activo:</span>
            <span className="font-bold text-axo-cyan">
              {caseConfig.emoji} {caseConfig.label}
            </span>
            <span className="text-axo-muted">·</span>
            <span className="text-axo-muted">{caseConfig.subtitle}</span>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {isDemoActive && activeCase === "caso1" && <Caso1View />}
        {isDemoActive && activeCase === "caso2" && <Caso2View />}
        {isDemoActive && activeCase === "caso3" && <Caso3View />}
        {!isDemoActive && activeRole === "buyer" && buyerMode === "market" && <MarketView />}
        {!isDemoActive && activeRole === "buyer" && buyerMode === "move"   && <MoveView />}
        {!isDemoActive && activeRole === "seller" && <SellerView />}
        {!isDemoActive && activeRole === "driver" && <DriverView />}
      </main>

      {/* ── BOTTOM MOBILE NAV ────────────────────────────────── */}
      <nav className="md:hidden sticky bottom-0 z-50 bg-white border-t border-axo-border shadow-lg">
        <div className="flex items-center px-2 py-1">
          {ROLES.map((role) => (
            <button
              key={role.key}
              onClick={() => setActiveRole(role.key)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all",
                activeRole === role.key ? "text-axo-cyan" : "text-axo-muted"
              )}
            >
              {role.icon}
              <span className="text-[10px] font-semibold">{role.label}</span>
            </button>
          ))}
          <button className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-axo-muted">
            <Search size={15} />
            <span className="text-[10px] font-semibold">Buscar</span>
          </button>
        </div>
      </nav>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="hidden md:block bg-white border-t border-axo-border">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-axo-gradient flex items-center justify-center">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <div>
              <p className="text-sm font-bold text-axo-text">AXO — Megasion Desarrollos INC.</p>
              <p className="text-xs text-axo-muted">Posadas, Misiones · Encarnación, Itapúa · NEA 2027</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-axo-muted">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={13} className="text-axo-emerald" />
              <span>+1.200 comercios activos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={13} className="text-axo-cyan" />
              <span>MVP Interactivo v2.0</span>
            </div>
            {isDemoActive && (
              <span className="text-axo-cyan font-semibold">
                ● Modo Demo — {caseConfig?.label}
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export function AppShell() {
  return (
    <DemoProvider>
      <AppShellInner />
    </DemoProvider>
  );
}
