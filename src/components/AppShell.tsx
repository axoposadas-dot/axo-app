"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ShoppingCart, Store, Package, Search, MapPin,
  Bell, ChevronDown, X, Menu, User, Check,
  MessageCircle, LogOut, ShieldCheck, Sparkles, LogIn
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
import { AuthProvider, useAuth } from "@/lib/authContext";
import { ProtectedGate } from "@/components/auth/ProtectedGate";
import { SellerOnboardingModal } from "@/components/auth/SellerOnboardingModal";
import { DriverOnboardingModal } from "@/components/auth/DriverOnboardingModal";
import { LoginModal } from "@/components/auth/LoginModal";
import { ZONAS_POSADAS, DRINK_CATEGORIES } from "@/lib/data";
import { cn } from "@/lib/utils";

type Role = "buyer" | "seller" | "driver";

// ── Role tabs ─────────────────────────────────────────────────
const ROLES = [
  { key: "buyer" as Role,  icon: <ShoppingCart size={15} />, label: "Comprador",    desc: "Catálogo Libre & Delivery",   color: "text-axo-cyan" },
  { key: "seller" as Role, icon: <Store size={15} />,        label: "Distribuidor", desc: "Panel Comercios Aliados",    color: "text-axo-emerald" },
  { key: "driver" as Role, icon: <Package size={15} />,      label: "Repartidor",   desc: "Red Logística Express",       color: "text-purple-700" },
];

// ── Top ticker items ──────────────────────────────────────────
const TICKER_ITEMS = [
  "🍺 AXO Bebidas Express: Entregas en 20–35 min en toda Posadas",
  "🧊 Hielo en cubos disponible · Bebidas 100% frías garantizadas",
  "🚀 Envíos gratis desde $30.000 en toda la ciudad",
  "📱 Pedidos ultrarrápidos con confirmación directa por WhatsApp",
  "🏪 Sumá tu distribuidora o vinoteca a AXO sin costo fijo",
  "🛵 Unite a la red de repartidores y cobrá comisiones al instante",
];

function AppShellInner() {
  const { activeCase, isDemoActive, caseConfig } = useDemo();
  const {
    user,
    isSellerApproved,
    isDriverApproved,
    logout,
    setLoginModalOpen,
    setSellerModalOpen,
    setDriverModalOpen,
  } = useAuth();

  const [activeRole, setActiveRole] = useState<Role>("buyer");
  const [selectedZona, setSelectedZona] = useState<string>("Villa Sarita");
  const [zonaModalOpen, setZonaModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Auto-route when demo activates
  useEffect(() => {
    if (!caseConfig) return;
    setActiveRole(caseConfig.role);
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
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* WhatsApp AXO Express */}
            <a
              href="https://wa.me/543751561710?text=Hola%20AXO%20Express%2C%20quiero%20hacer%20un%20pedido%20🍺"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 border border-green-300 text-green-700 text-xs font-bold hover:bg-green-600 hover:text-white hover:border-green-600 transition-all shadow-sm"
              title="Contactar AXO Express por WhatsApp"
            >
              <MessageCircle size={14} />
              <span>WhatsApp AXO</span>
            </a>

            {/* Auth / Account Profile Button */}
            <div className="relative">
              {user ? (
                /* Usuario Autenticado / En revisión */
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-axo-bg transition-colors border border-axo-border bg-white"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-axo-cyan to-axo-emerald flex items-center justify-center text-white text-xs font-black">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-axo-text truncate max-w-[120px]">
                      {user.businessName || user.name}
                    </p>
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.2 rounded-full inline-block leading-tight",
                      user.status === "approved"
                        ? "bg-axo-emerald-light text-axo-emerald"
                        : "bg-amber-100 text-amber-800"
                    )}>
                      {user.status === "approved" ? "Verificado" : "En Revisión"}
                    </span>
                  </div>
                  <ChevronDown size={13} className="text-axo-muted" />
                </button>
              ) : (
                /* Invitado / Fricción Cero */
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-axo-border hover:border-axo-cyan hover:bg-axo-blue-light/50 text-xs font-bold text-axo-text transition-all"
                >
                  <LogIn size={14} className="text-axo-cyan" />
                  <span className="hidden sm:inline">Ingresar / Cuenta</span>
                </button>
              )}

              {/* Dropdown del perfil */}
              {userDropdownOpen && user && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-axo-border rounded-2xl shadow-axo-card-lg p-3 z-50 animate-slide-up">
                  <div className="px-2 py-1.5 border-b border-axo-border mb-2">
                    <p className="text-xs font-bold text-axo-text truncate">{user.name}</p>
                    <p className="text-[10px] text-axo-muted truncate">{user.email}</p>
                    {user.businessName && (
                      <p className="text-[10px] text-axo-cyan font-semibold mt-0.5">🏪 {user.businessName}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setActiveRole(user.role);
                        setUserDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-axo-text hover:bg-axo-bg transition-colors text-left"
                    >
                      <ShieldCheck size={14} className="text-axo-emerald" />
                      <span>Ir a mi Panel ({user.role === "seller" ? "Distribuidor" : "Repartidor"})</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        setActiveRole("buyer");
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={14} />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-axo-bg transition-colors border border-axo-border"
            >
              {mobileMenuOpen ? <X size={18} className="text-axo-text" /> : <Menu size={18} className="text-axo-text" />}
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

            {/* CTAs rápidos de incorporación */}
            <div className="hidden lg:flex items-center gap-2 ml-auto">
              <button
                onClick={() => setSellerModalOpen(true)}
                className="text-xs font-bold text-axo-cyan hover:bg-axo-blue-light px-3 py-1.5 rounded-xl transition-all"
              >
                + Sumar Comercio
              </button>
              <button
                onClick={() => setDriverModalOpen(true)}
                className="text-xs font-bold text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-xl transition-all"
              >
                + Ser Repartidor
              </button>
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

            {/* Mobile CTAs */}
            <div className="pt-2 border-t border-axo-border flex flex-col gap-2">
              <p className="text-[10px] text-axo-muted uppercase tracking-wider font-semibold">Alianzas Comerciales</p>
              <button
                onClick={() => {
                  setSellerModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl bg-axo-blue-light text-axo-cyan font-bold text-xs text-left"
              >
                🏪 ¿Querés sumar tu comercio o distribuidora?
              </button>
              <button
                onClick={() => {
                  setDriverModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs text-left"
              >
                🛵 ¿Te sumás como repartidor express?
              </button>
              <a
                href="https://wa.me/543751561710?text=Hola%20AXO%20Express%2C%20quiero%20hacer%20un%20pedido%20🍺"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-green-50 text-green-700 font-bold text-xs text-left flex items-center gap-2"
              >
                <MessageCircle size={14} /> Contactar por WhatsApp
              </a>
            </div>

            {/* Mobile zone selector */}
            <div className="pt-2 border-t border-axo-border">
              <p className="text-[10px] text-axo-muted uppercase tracking-wider font-semibold mb-2">Zona en Posadas</p>
              <div className="grid grid-cols-2 gap-1.5">
                {ZONAS_POSADAS.map((z) => (
                  <button
                    key={z}
                    onClick={() => {
                      setSelectedZona(z);
                      setMobileMenuOpen(false);
                    }}
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

      {/* ── MAIN CONTENT (CONTROLES DE ACCESO / RBAC GUARDS) ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {isDemoActive && activeCase === "caso1" && <Caso1View />}
        {isDemoActive && activeCase === "caso2" && <Caso2View />}
        {isDemoActive && activeCase === "caso3" && <Caso3View />}
        
        {/* Vista Comprador: 100% Abierta y Fricción Cero */}
        {!isDemoActive && activeRole === "buyer" && <MarketView />}

        {/* Vista Vendedor/Distribuidor: Protegida por Auth y Aprobación */}
        {!isDemoActive && activeRole === "seller" && (
          isSellerApproved ? <SellerView /> : <ProtectedGate role="seller" />
        )}

        {/* Vista Repartidor: Protegida por Auth y Verificación */}
        {!isDemoActive && activeRole === "driver" && (
          isDriverApproved ? <DriverView /> : <ProtectedGate role="driver" />
        )}
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

      {/* ── WHATSAPP FAB (Flotante) ───────────────────────────── */}
      <a
        href="https://wa.me/543751561710?text=Hola%20AXO%20Express%2C%20quiero%20hacer%20un%20pedido%20🍺"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        title="Escribir a AXO Express por WhatsApp"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={26} />
      </a>

      {/* ── MODALES GLOBALES DE AUTENTICACIÓN Y ONBOARDING ───── */}
      <SellerOnboardingModal />
      <DriverOnboardingModal />
      <LoginModal />

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
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="https://wa.me/543751561710?text=Hola%20AXO%20Express%2C%20quiero%20hacer%20un%20pedido%20🍺"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-green-700 font-bold hover:underline"
            >
              <MessageCircle size={13} /> WhatsApp AXO
            </a>
            <span>·</span>
            <button onClick={() => setSellerModalOpen(true)} className="hover:text-axo-cyan transition-colors">
              Sumar mi Comercio
            </button>
            <span>·</span>
            <button onClick={() => setDriverModalOpen(true)} className="hover:text-purple-700 transition-colors">
              Ser Repartidor
            </button>
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
    <AuthProvider>
      <DemoProvider>
        <AppShellInner />
      </DemoProvider>
    </AuthProvider>
  );
}
