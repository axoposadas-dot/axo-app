"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ShoppingCart, Store, Package, Search, MapPin,
  Bell, ChevronDown, X, Menu, Zap, User, Check
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
import { ZONAS_POSADAS, DRINK_CATEGORIES } from "@/lib/data";
import { cn } from "@/lib/utils";

type Role = "buyer" | "seller" | "driver";
type BuyerMode = "market" | "move";

// ── Role tabs ─────────────────────────────────────────────────
const ROLES = [
  { key: "buyer" as Role,  icon: <ShoppingCart size={15} />, label: "Comprador",    desc: "Catálogo Express & Delivery", color: "text-axo-cyan" },
  { key: "seller" as Role, icon: <Store size={15} />,        label: "Distribuidor", desc: "Deli Drinks Posadas",         color: "text-axo-emerald" },
  { key: "driver" as Role, icon: <Package size={15} />,      label: "Repartidor",   desc: "Logística Express Posadas",   color: "text-purple-700" },
];

// ── Top ticker items ──────────────────────────────────────────
const TICKER_ITEMS = [
  "🍺 AXO Bebidas Express: Entregas en 20–35 min en toda Posadas",
  "🧊 Hielo en cubos disponible · Bebidas 100% frías garantizadas",
  "🚀 Envíos gratis desde $30.000 en toda la ciudad",
  "📱 Pedidos ultrarrápidos con confirmación directa por WhatsApp",
  "💳 Pagá con MercadoPago, Transferencia o Efectivo al recibir",
  "🏪 Distribuidor Oficial: Deli Drinks Posadas / Distribuidora JB",
];

function AppShellInner() {
  const { activeCase, isDemoActive, caseConfig } = useDemo();
  const [activeRole, setActiveRole] = useState<Role>("buyer");
  const [buyerMode, setBuyerMode] = useState<BuyerMode>("market");
  const [selectedZona, setSelectedZona] = useState<string>("Villa Sarita");
  const [zonaModalOpen, setZonaModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
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

      {/* ── TOP INFO BAR — Bebidas Express Posadas ────────────── */}
      <div className="bg-axo-cyan text-white overflow-hidden h-8 flex items-center">
        <div className="flex animate-marquee whitespace-nowrap gap-16 text-xs font-semibold tracking-wide">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-2 pr-12">{item}</span>
          ))}
        </div>
      </div>

      {/* ── MAIN HEADER ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-axo-border shadow-sm">
        {/* Row 1: Logo + Selector Zona + Search + Actions */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-axo-cyan to-axo-emerald flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-xl leading-none">🍺</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-axo-text text-xl leading-none tracking-tight">AXO</span>
                <span className="text-[10px] font-black text-axo-emerald bg-axo-emerald-light px-1.5 py-0.5 rounded">EXPRESS</span>
              </div>
              <p className="text-[10px] text-axo-muted leading-tight font-medium mt-0.5">Bebidas & Conveniencia · Posadas</p>
            </div>
          </Link>

          {/* Location selector (Posadas Zones) */}
          <div className="relative">
            <button
              onClick={() => setZonaModalOpen(!zonaModalOpen)}
              className="hidden md:flex items-center gap-2 text-xs text-axo-muted hover:text-axo-cyan transition-colors flex-shrink-0 border border-axo-border rounded-xl px-3 py-2 bg-axo-bg hover:border-axo-cyan"
            >
              <MapPin size={14} className="text-axo-cyan" />
              <div className="text-left">
                <p className="font-bold text-axo-text text-xs leading-tight">Posadas · {selectedZona}</p>
                <p className="text-[10px] text-axo-muted leading-tight">Cambiar zona</p>
              </div>
              <ChevronDown size={13} className="ml-0.5 text-axo-muted" />
            </button>

            {/* Dropdown modal de zonas de Posadas */}
            {zonaModalOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-axo-border rounded-2xl shadow-axo-card-lg p-3 z-50 animate-slide-up">
                <p className="text-xs font-bold text-axo-text mb-2 px-1">Elegí tu zona de entrega:</p>
                <div className="flex flex-col gap-1 max-h-56 overflow-y-auto">
                  {ZONAS_POSADAS.map((z) => (
                    <button
                      key={z}
                      onClick={() => {
                        setSelectedZona(z);
                        setZonaModalOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all",
                        selectedZona === z
                          ? "bg-axo-blue-light text-axo-cyan font-bold"
                          : "text-axo-muted hover:bg-axo-bg hover:text-axo-text"
                      )}
                    >
                      <span>📍 {z}</span>
                      {selectedZona === z && <Check size={13} className="text-axo-cyan" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

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
              placeholder="¿Qué querés tomar hoy en Posadas? Cervezas, Fernet, Vinos, Hielo..."
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

        {/* Row 2: Role tabs + Category chips bar (desktop) */}
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
                      ? "bg-white shadow-sm text-axo-cyan border border-axo-border font-bold"
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
                {DRINK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    className="flex items-center gap-1.5 text-xs font-medium text-axo-muted hover:text-axo-cyan px-3 py-1.5 rounded-xl hover:bg-axo-blue-light transition-all whitespace-nowrap"
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Badge de Entrega Fría */}
            <div className="hidden lg:flex items-center gap-2 ml-auto text-xs font-bold text-axo-emerald bg-axo-emerald-light border border-axo-emerald/20 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-axo-emerald animate-pulse" />
              <span>Entrega Fría en ~30 min</span>
            </div>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-axo-border bg-white px-4 py-3 flex flex-col gap-2 animate-slide-up shadow-lg">
            <p className="text-[10px] text-axo-muted uppercase tracking-wider font-semibold mb-1">Cambiar Rol</p>
            {ROLES.map((role) => (
              <button
                key={role.key}
                onClick={() => { setActiveRole(role.key); setMobileMenuOpen(false); }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all text-left",
                  activeRole === role.key
                    ? "bg-axo-blue-light text-axo-cyan border border-axo-cyan/20 font-bold"
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

            {/* Mobile zone selector */}
            <div className="pt-2 border-t border-axo-border">
              <p className="text-[10px] text-axo-muted uppercase tracking-wider font-semibold mb-2">Zona en Posadas</p>
              <div className="grid grid-cols-2 gap-1.5">
                {ZONAS_POSADAS.map((z) => (
                  <button
                    key={z}
                    onClick={() => setSelectedZona(z)}
                    className={cn(
                      "py-1.5 px-2 rounded-lg text-xs font-medium text-left border transition-all truncate",
                      selectedZona === z
                        ? "bg-axo-blue-light border-axo-cyan text-axo-cyan font-bold"
                        : "border-axo-border text-axo-muted"
                    )}
                  >
                    📍 {z}
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
        {!isDemoActive && activeRole === "buyer" && <MarketView />}
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
                activeRole === role.key ? "text-axo-cyan font-bold" : "text-axo-muted"
              )}
            >
              {role.icon}
              <span className="text-[10px] leading-none">{role.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t border-axo-border bg-white mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-axo-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-axo-gradient flex items-center justify-center text-white font-black text-xs">
              🍺
            </div>
            <span className="font-black text-axo-text text-sm">AXO Bebidas Express</span>
            <span>· Posadas, Misiones, Argentina</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Deli Drinks / Distribuidora JB</span>
            <span>·</span>
            <span>Consumo responsable (+18)</span>
            <span>·</span>
            <span>© 2027 Megasion Desarrollos INC.</span>
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
