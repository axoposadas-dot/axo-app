"use client";

// ================================================================
//  AXO — MarketView (Light Marketplace Design)
// ================================================================

import { useState, useMemo } from "react";
import { SlidersHorizontal, TrendingUp, Zap, Star, Grid3X3, List, ChevronRight } from "lucide-react";
import { allProducts, gastroProducts, techProducts, type Product } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { cn } from "@/lib/utils";

type FilterKey = "todos" | "gastronomia" | "tecnologia" | "movilidad" | "flash" | "sumo";
type SortKey = "relevancia" | "precio_asc" | "precio_desc" | "rating";
type ViewMode = "grid" | "list";

const FILTERS: { key: FilterKey; label: string; emoji: string }[] = [
  { key: "todos",       label: "Todos",        emoji: "🏪" },
  { key: "flash",       label: "Flash Deals",  emoji: "⚡" },
  { key: "gastronomia", label: "Gastronomía",  emoji: "🍨" },
  { key: "tecnologia",  label: "Tecnología",   emoji: "💻" },
  { key: "sumo",        label: "Envío Rápido", emoji: "🚀" },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "relevancia",   label: "Más relevantes" },
  { key: "precio_asc",   label: "Menor precio" },
  { key: "precio_desc",  label: "Mayor precio" },
  { key: "rating",       label: "Mejor puntuados" },
];

// Featured banner items
const BANNERS = [
  {
    emoji: "🖥️",
    title: "Tech desde Encarnación",
    subtitle: "Monitores, periféricos y más hasta 41% OFF",
    cta: "Ver ofertas",
    bg: "from-blue-50 to-indigo-50",
    accent: "text-axo-cyan",
    badge: "COMPRA TRANSFRONTERIZA",
    badgeColor: "bg-axo-cyan text-white",
  },
  {
    emoji: "🍨",
    title: "Duomo Heladerías",
    subtitle: "Combos familiares · Delivery Sumo en 30 min",
    cta: "Pedir ahora",
    bg: "from-emerald-50 to-teal-50",
    accent: "text-axo-emerald",
    badge: "ENVÍO GRATIS +$5.000",
    badgeColor: "bg-axo-emerald text-white",
  },
  {
    emoji: "🚗",
    title: "AXO Move al Puente",
    subtitle: "Traslado ejecutivo · Compras fronterizas",
    cta: "Solicitar viaje",
    bg: "from-purple-50 to-violet-50",
    accent: "text-purple-700",
    badge: "MOVILIDAD PREMIUM",
    badgeColor: "bg-purple-600 text-white",
  },
];

export function MarketView() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("todos");
  const [sortBy, setSortBy] = useState<SortKey>("relevancia");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeBanner, setActiveBanner] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const products = useMemo(() => {
    let pool: Product[] = allProducts;
    if (activeFilter === "gastronomia") pool = gastroProducts;
    else if (activeFilter === "tecnologia") pool = techProducts;
    else if (activeFilter === "flash") pool = allProducts.filter((p) => p.flashDeal);
    else if (activeFilter === "sumo") pool = allProducts.filter((p) => p.logistics.includes("sumo"));

    if (search.trim()) {
      const q = search.toLowerCase();
      pool = pool.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    return [...pool].sort((a, b) => {
      if (sortBy === "precio_asc") return a.priceARS - b.priceARS;
      if (sortBy === "precio_desc") return b.priceARS - a.priceARS;
      if (sortBy === "rating") return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [activeFilter, sortBy, search]);

  const flashCount = allProducts.filter((p) => p.flashDeal).length;

  return (
    <div className="flex flex-col gap-6">

      {/* ── HERO BANNER CAROUSEL ─────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-axo-border shadow-axo-card">
        {BANNERS.map((banner, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-all duration-500 bg-gradient-to-br",
              banner.bg,
              i === activeBanner ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <div className="relative h-full flex items-center px-6 py-8 sm:px-10">
              <div className="flex-1">
                <span className={cn("text-[10px] font-black px-3 py-1 rounded-full mb-3 inline-block", banner.badgeColor)}>
                  {banner.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-axo-text leading-tight mb-2">
                  {banner.title}
                </h2>
                <p className="text-sm text-axo-muted mb-4">{banner.subtitle}</p>
                <button className={cn("axo-btn-primary text-sm")}>
                  {banner.cta} <ChevronRight size={14} />
                </button>
              </div>
              <div className="text-8xl hidden sm:block select-none">{banner.emoji}</div>
            </div>
          </div>
        ))}
        {/* Static container for height */}
        <div className="h-44 sm:h-48" />

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveBanner(i)}
              className={cn(
                "rounded-full transition-all",
                i === activeBanner
                  ? "w-5 h-2 bg-axo-cyan"
                  : "w-2 h-2 bg-axo-muted/40 hover:bg-axo-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Productos disponibles", value: `${allProducts.length}+`, icon: "🏪", color: "text-axo-cyan" },
          { label: "Flash Deals activos", value: flashCount, icon: "⚡", color: "text-red-500" },
          { label: "Con Sumo Envíos", value: allProducts.filter(p => p.logistics.includes("sumo")).length, icon: "🚀", color: "text-axo-emerald" },
          { label: "Categorías", value: "6", icon: "📦", color: "text-purple-700" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-axo-border rounded-2xl p-4 shadow-axo-card flex items-center gap-3">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className={cn("text-xl font-black", stat.color)}>{stat.value}</p>
              <p className="text-[10px] text-axo-muted leading-tight">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── SEARCH + FILTER BAR ───────────────────────────────── */}
      <div className="bg-white border border-axo-border rounded-2xl p-4 shadow-axo-card flex flex-col gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar en AXO Market..." />

        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Filter chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all whitespace-nowrap",
                  activeFilter === f.key
                    ? "bg-axo-blue-light border-axo-cyan text-axo-cyan"
                    : "border-axo-border text-axo-muted bg-axo-bg hover:border-axo-cyan/40 hover:text-axo-cyan"
                )}
              >
                {f.emoji} {f.label}
                {f.key === "flash" && <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{flashCount}</span>}
              </button>
            ))}
          </div>

          {/* Sort + view */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="text-xs border border-axo-border rounded-xl px-3 py-2 bg-white text-axo-muted focus:outline-none focus:border-axo-cyan cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all",
                showFilters
                  ? "bg-axo-blue-light border-axo-cyan text-axo-cyan"
                  : "border-axo-border text-axo-muted hover:text-axo-cyan hover:border-axo-cyan/40"
              )}
            >
              <SlidersHorizontal size={13} /> Filtros
            </button>
            <div className="flex border border-axo-border rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-axo-blue-light text-axo-cyan" : "text-axo-muted hover:text-axo-text")}
              ><Grid3X3 size={14} /></button>
              <button
                onClick={() => setViewMode("list")}
                className={cn("p-2 transition-colors border-l border-axo-border", viewMode === "list" ? "bg-axo-blue-light text-axo-cyan" : "text-axo-muted hover:text-axo-text")}
              ><List size={14} /></button>
            </div>
          </div>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <div className="border-t border-axo-border pt-3 flex flex-wrap gap-3 animate-fade-in">
            <div>
              <p className="text-[10px] text-axo-muted font-semibold uppercase tracking-wider mb-1.5">Logística</p>
              <div className="flex gap-2">
                {["Envío Rápido", "Retiro en local", "Sumo Envíos"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 text-xs text-axo-muted cursor-pointer hover:text-axo-text">
                    <input type="checkbox" className="accent-axo-cyan rounded" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-axo-muted font-semibold uppercase tracking-wider mb-1.5">Calificación</p>
              <div className="flex gap-2">
                {["4★+", "3★+"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 text-xs text-axo-muted cursor-pointer hover:text-axo-text">
                    <input type="radio" name="rating" className="accent-axo-cyan" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── TRENDING SECTION ─────────────────────────────────── */}
      {activeFilter === "todos" && !search && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-axo-cyan" />
            <h2 className="font-bold text-axo-text">Tendencias en Posadas hoy</h2>
            <span className="text-[10px] text-axo-muted bg-axo-bg border border-axo-border rounded-full px-2 py-0.5">
              Actualizado ahora
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["Helado Duomo", "Monitor Litany", "Combo Familiar", "Teclado Mecánico", "Empanadas Artesanales", "Mouse Inalámbrico"].map((t) => (
              <button
                key={t}
                onClick={() => setSearch(t)}
                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl bg-white border border-axo-border text-axo-muted hover:text-axo-cyan hover:border-axo-cyan/40 whitespace-nowrap shadow-sm transition-all"
              >
                🔥 {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── RESULTS HEADER ───────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-axo-text">
            {activeFilter === "todos" ? "Todos los productos" :
             activeFilter === "flash" ? "⚡ Flash Deals" :
             activeFilter === "gastronomia" ? "🍨 Gastronomía" :
             activeFilter === "tecnologia" ? "💻 Tecnología" :
             "🚀 Con Sumo Envíos"}
          </h2>
          <p className="text-xs text-axo-muted mt-0.5">
            {products.length} resultado{products.length !== 1 ? "s" : ""}
            {search && ` para "${search}"`}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-axo-muted">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span>Todos verificados por AXO</span>
        </div>
      </div>

      {/* ── PRODUCT GRID ─────────────────────────────────────── */}
      {products.length > 0 ? (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              : "flex flex-col gap-3"
          )}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center bg-white rounded-2xl border border-axo-border">
          <span className="text-5xl">🔍</span>
          <div>
            <p className="font-bold text-axo-text">Sin resultados</p>
            <p className="text-sm text-axo-muted mt-1">
              Probá con otra palabra o{" "}
              <button onClick={() => { setSearch(""); setActiveFilter("todos"); }} className="text-axo-cyan font-semibold hover:underline">
                ver todo el catálogo
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ── LOAD MORE ────────────────────────────────────────── */}
      {products.length > 0 && (
        <button className="axo-btn-secondary w-full py-3 text-sm">
          Ver más productos <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}
