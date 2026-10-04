"use client";

// ================================================================
//  AXO — SellerView (Light Shopify/Tiendanube Design)
// ================================================================

import { useState } from "react";
import {
  TrendingUp, Package, Star, Clock, Zap, BarChart2,
  ShoppingBag, AlertCircle, X, Plus, ChevronRight,
  ArrowUp, ArrowDown, Users, DollarSign, Eye,
} from "lucide-react";
import {
  sellerStats, flashCombos, allProducts, formatARS, type FlashCombo,
} from "@/lib/data";
import { cn } from "@/lib/utils";

type DashTab = "dashboard" | "publicar" | "pedidos" | "stock";

const NAV_TABS = [
  { key: "dashboard" as DashTab, label: "Resumen", icon: <BarChart2 size={14} /> },
  { key: "publicar"  as DashTab, label: "Publicar", icon: <Plus size={14} /> },
  { key: "pedidos"   as DashTab, label: "Pedidos",  icon: <Package size={14} /> },
  { key: "stock"     as DashTab, label: "Stock",    icon: <ShoppingBag size={14} /> },
];

export function SellerView() {
  const [tab, setTab] = useState<DashTab>("dashboard");
  const [comboName, setComboName] = useState("");
  const [comboPrice, setComboPrice] = useState("");
  const [comboDesc, setComboDesc] = useState("");
  const [comboLogistics, setComboLogistics] = useState<"propio" | "sumo">("sumo");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishedCombos, setPublishedCombos] = useState<FlashCombo[]>(flashCombos);
  const [closedAlert, setClosedAlert] = useState(false);

  const handlePublish = () => {
    if (!comboName || !comboPrice) return;
    setPublishing(true);
    setTimeout(() => {
      const newCombo: FlashCombo = {
        id: `combo-${Date.now()}`,
        name: comboName,
        description: comboDesc || "Oferta especial",
        priceARS: parseInt(comboPrice.replace(/\D/g, "")),
        originalPriceARS: parseInt(comboPrice.replace(/\D/g, "")) * 1.3,
        validUntil: "Hoy 23:59",
        stock: 15,
        sold: 0,
        category: "gastronomia",
        logistics: comboLogistics,
      };
      setPublishedCombos((p) => [newCombo, ...p]);
      setPublishing(false);
      setPublished(true);
      setComboName("");
      setComboPrice("");
      setComboDesc("");
      setTimeout(() => { setPublished(false); setTab("dashboard"); }, 2500);
    }, 1800);
  };

  const METRIC_CARDS = [
    {
      label: "Ventas hoy",
      value: formatARS(sellerStats.todaySales ?? 0),
      icon: <DollarSign size={18} className="text-axo-cyan" />,
      trend: +12.5,
      bg: "bg-axo-blue-light",
      border: "border-axo-cyan/20",
    },
    {
      label: "Pedidos activos",
      value: sellerStats.activeOrders ?? 0,
      icon: <Package size={18} className="text-axo-emerald" />,
      trend: +3,
      bg: "bg-axo-emerald-light",
      border: "border-axo-emerald/20",
    },
    {
      label: "Visitas hoy",
      value: sellerStats.views?.toLocaleString("es-AR") ?? "1.240",
      icon: <Eye size={18} className="text-purple-600" />,
      trend: +8.2,
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      label: "Calificación",
      value: `${sellerStats.rating ?? sellerStats.avgRating} ★`,
      icon: <Star size={18} className="text-amber-500" />,
      trend: null,
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* ── SELLER HEADER ────────────────────────────────────── */}
      <div className="bg-white border border-axo-border rounded-2xl p-5 shadow-axo-card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-axo-gradient flex items-center justify-center text-white text-2xl font-black shadow-sm">
              🏪
            </div>
            <div>
              <h1 className="text-xl font-black text-axo-text">Mi Negocio AXO</h1>
              <p className="text-sm text-axo-muted">Duomo Heladerías — Sucursal Sur, Posadas</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-semibold bg-axo-emerald-light text-axo-emerald border border-axo-emerald/20 px-2 py-0.5 rounded-full">
                  ● Tienda activa
                </span>
                <span className="text-[10px] text-axo-muted">
                  Plan Pro · Sumo Envíos habilitado
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="axo-btn-secondary text-sm py-2">
              <Eye size={14} /> Ver tienda
            </button>
            <button
              onClick={() => setTab("publicar")}
              className="axo-btn-green text-sm py-2"
            >
              <Zap size={14} /> Publicar oferta
            </button>
          </div>
        </div>
      </div>

      {/* ── ALERT (low stock) ────────────────────────────────── */}
      {!closedAlert && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 animate-fade-in">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 flex-1">
            <strong>Stock bajo:</strong> Helado Duomo Cuarto Kg — quedan 3 unidades.{" "}
            <button className="font-semibold text-amber-700 underline hover:no-underline">Reponer</button>
          </p>
          <button onClick={() => setClosedAlert(true)} className="text-amber-500 hover:text-amber-700">
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── TAB NAV ──────────────────────────────────────────── */}
      <div className="flex gap-1 bg-axo-bg border border-axo-border rounded-2xl p-1.5">
        {NAV_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all",
              tab === t.key
                ? "bg-white text-axo-cyan shadow-axo-card border border-axo-border"
                : "text-axo-muted hover:text-axo-text"
            )}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── DASHBOARD TAB ────────────────────────────────────── */}
      {tab === "dashboard" && (
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {METRIC_CARDS.map((m) => (
              <div key={m.label} className={cn("bg-white rounded-2xl border p-4 shadow-axo-card", m.border)}>
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", m.bg)}>
                    {m.icon}
                  </div>
                  {m.trend !== null && (
                    <div className={cn(
                      "flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-full",
                      m.trend > 0
                        ? "text-axo-emerald bg-axo-emerald-light"
                        : "text-red-600 bg-red-50"
                    )}>
                      {m.trend > 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                      {Math.abs(m.trend)}%
                    </div>
                  )}
                </div>
                <p className="text-2xl font-black text-axo-text">{m.value}</p>
                <p className="text-xs text-axo-muted mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Sales chart placeholder */}
          <div className="bg-white border border-axo-border rounded-2xl p-5 shadow-axo-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-axo-text">Ventas de la semana</h3>
                <p className="text-xs text-axo-muted">Últimos 7 días</p>
              </div>
              <select className="text-xs border border-axo-border rounded-xl px-3 py-2 bg-white text-axo-muted focus:outline-none focus:border-axo-cyan">
                <option>Esta semana</option>
                <option>Este mes</option>
              </select>
            </div>
            {/* Bar chart visual */}
            <div className="flex items-end gap-2 h-28">
              {[45, 72, 38, 88, 62, 95, 74].map((h, i) => {
                const days = ["L", "M", "X", "J", "V", "S", "D"];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
                      <div
                        className={cn(
                          "w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer",
                          i === 5 ? "bg-axo-cyan" : "bg-axo-blue-light border-t-2 border-axo-cyan/30"
                        )}
                        style={{ height: `${h}%` }}
                        title={`${formatARS(h * 1200)}`}
                      />
                    </div>
                    <span className={cn("text-[10px] font-medium", i === 5 ? "text-axo-cyan font-bold" : "text-axo-muted")}>
                      {days[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active combos */}
          <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card overflow-hidden">
            <div className="px-5 py-4 border-b border-axo-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-axo-text">Ofertas activas</h3>
                <p className="text-xs text-axo-muted">{publishedCombos.length} publicaciones</p>
              </div>
              <button
                onClick={() => setTab("publicar")}
                className="axo-btn-green text-xs py-2 px-3"
              >
                <Plus size={13} /> Nueva oferta
              </button>
            </div>
            <div className="divide-y divide-axo-border">
              {publishedCombos.map((combo) => {
                const soldPct = Math.round((combo.sold / combo.stock) * 100);
                return (
                  <div key={combo.id} className="px-5 py-4 flex items-center gap-4 hover:bg-axo-bg transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-axo-bg border border-axo-border flex items-center justify-center text-xl flex-shrink-0">
                      {combo.category === "gastronomia" ? "🍨" : "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-axo-text text-sm">{combo.name}</p>
                      <div className="flex items-center gap-3 text-[10px] text-axo-muted mt-0.5">
                        <span className="flex items-center gap-1"><Clock size={9} /> Hasta {combo.validUntil}</span>
                        <span className="flex items-center gap-1"><ShoppingBag size={9} /> {combo.stock - combo.sold} restantes</span>
                        <span className={cn(
                          "font-semibold px-1.5 py-0.5 rounded-full",
                          combo.logistics === "sumo"
                            ? "text-purple-700 bg-purple-50"
                            : "text-axo-muted bg-axo-bg"
                        )}>
                          {combo.logistics === "sumo" ? "⚡ Sumo Envíos" : "🏪 Delivery propio"}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 bg-axo-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-axo-cyan rounded-full transition-all"
                          style={{ width: `${soldPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-black text-axo-text">{formatARS(combo.priceARS)}</p>
                      <p className="text-[10px] text-axo-emerald font-semibold">{combo.sold} vendidos</p>
                    </div>
                    <button className="text-axo-muted hover:text-axo-cyan">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── PUBLICAR TAB ─────────────────────────────────────── */}
      {tab === "publicar" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 animate-fade-in">
          {/* Form */}
          <div className="lg:col-span-3 bg-white border border-axo-border rounded-2xl shadow-axo-card overflow-hidden">
            <div className="bg-gradient-to-r from-axo-bg-section to-white border-b border-axo-border px-5 py-4">
              <h3 className="font-bold text-axo-text flex items-center gap-2">
                <Zap size={16} className="text-axo-cyan" />
                Publicar Combo Flash en 1 Clic
              </h3>
              <p className="text-xs text-axo-muted">Tu oferta estará visible en segundos en todo AXO Market</p>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-axo-text block mb-1.5">Nombre del combo / producto *</label>
                <input
                  value={comboName}
                  onChange={(e) => setComboName(e.target.value)}
                  className="axo-input"
                  placeholder="Ej: Combo Familiar Helado — 2 cuartos kg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-axo-text block mb-1.5">Precio oferta (ARS) *</label>
                  <input
                    value={comboPrice}
                    onChange={(e) => setComboPrice(e.target.value)}
                    className="axo-input"
                    placeholder="$ 0"
                    type="number"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-axo-text block mb-1.5">Stock disponible</label>
                  <input className="axo-input" placeholder="Unidades" type="number" defaultValue={20} />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-axo-text block mb-1.5">Descripción</label>
                <textarea
                  value={comboDesc}
                  onChange={(e) => setComboDesc(e.target.value)}
                  className="axo-input resize-none h-20 text-sm"
                  placeholder="Describe tu oferta (ingredientes, sabores, condiciones...)"
                />
              </div>

              {/* Logistics toggle */}
              <div>
                <label className="text-xs font-semibold text-axo-text block mb-2">Método de entrega</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "sumo" as const, emoji: "⚡", label: "Activar Sumo Envíos", sub: "Red de cadetes AXO · Comisión 8%", color: "border-purple-300 bg-purple-50 text-purple-700" },
                    { key: "propio" as const, emoji: "🛵", label: "Delivery propio", sub: "Tu equipo de reparto · Sin comisión", color: "border-axo-cyan/40 bg-axo-blue-light text-axo-cyan" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setComboLogistics(opt.key)}
                      className={cn(
                        "p-3 rounded-xl border-2 text-left transition-all",
                        comboLogistics === opt.key
                          ? opt.color
                          : "border-axo-border bg-white text-axo-muted hover:border-axo-border"
                      )}
                    >
                      <p className="text-sm font-bold mb-0.5">{opt.emoji} {opt.label}</p>
                      <p className="text-[10px] opacity-70">{opt.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handlePublish}
                disabled={!comboName || !comboPrice || publishing || published}
                className={cn(
                  "w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                  published
                    ? "bg-axo-emerald-light text-axo-emerald border border-axo-emerald"
                    : publishing
                    ? "bg-axo-bg border border-axo-border text-axo-muted cursor-not-allowed"
                    : (!comboName || !comboPrice)
                    ? "bg-axo-bg border border-axo-border text-axo-muted cursor-not-allowed"
                    : "axo-btn-green"
                )}
              >
                {published ? (
                  <>✅ ¡Oferta publicada exitosamente!</>
                ) : publishing ? (
                  <><div className="w-4 h-4 border-2 border-axo-muted/30 border-t-axo-emerald rounded-full animate-spin" /> Publicando...</>
                ) : (
                  <><Zap size={15} /> Publicar ahora en AXO Market</>
                )}
              </button>
            </div>
          </div>

          {/* Tips panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Preview card */}
            <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card overflow-hidden">
              <div className="bg-axo-bg border-b border-axo-border px-4 py-3 flex items-center gap-2">
                <Eye size={13} className="text-axo-muted" />
                <p className="text-xs font-semibold text-axo-muted">Vista previa</p>
              </div>
              <div className="p-4">
                <div className="bg-axo-bg rounded-xl p-3 border border-axo-border">
                  <p className="text-[10px] text-axo-cyan font-semibold uppercase tracking-wider">Duomo Heladerías</p>
                  <p className="font-bold text-axo-text text-sm mt-1">
                    {comboName || "Nombre de tu combo"}
                  </p>
                  <p className="text-axo-muted text-[11px] mt-0.5">
                    {comboDesc || "Descripción del producto"}
                  </p>
                  <p className="text-xl font-black text-axo-text mt-2">
                    {comboPrice ? `$${parseInt(comboPrice).toLocaleString("es-AR")}` : "$ Precio"}
                  </p>
                  <div className="flex gap-1 mt-2">
                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">⚡ FLASH</span>
                    <span className="text-[10px] bg-axo-emerald text-white px-2 py-0.5 rounded-full font-bold">
                      {comboLogistics === "sumo" ? "Sumo Envíos" : "Delivery propio"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-axo-blue-light border border-axo-cyan/20 rounded-2xl p-4">
              <p className="text-xs font-bold text-axo-cyan mb-3 flex items-center gap-1.5">
                <TrendingUp size={13} /> Tips para vender más
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  "Los combos con foto venden 3× más",
                  "Precios terminados en 9 convierten mejor",
                  "Activar Sumo Envíos aumenta el alcance 40%",
                  "Ofertas con stock visible generan urgencia",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-axo-text">
                    <span className="text-axo-cyan font-bold flex-shrink-0">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick stats */}
            <div className="bg-white border border-axo-border rounded-2xl p-4 shadow-axo-card">
              <p className="text-xs font-bold text-axo-text mb-3 flex items-center gap-1.5">
                <Users size={13} className="text-axo-muted" /> Compradores activos hoy
              </p>
              <div className="flex items-end gap-1">
                <p className="text-3xl font-black text-axo-cyan">1.240</p>
                <p className="text-xs text-axo-muted mb-1">usuarios en AXO Market</p>
              </div>
              <div className="mt-2 h-1.5 bg-axo-bg rounded-full overflow-hidden">
                <div className="h-full bg-axo-cyan rounded-full" style={{ width: "78%" }} />
              </div>
              <p className="text-[10px] text-axo-muted mt-1">78% buscando en tu categoría</p>
            </div>
          </div>
        </div>
      )}

      {/* ── PEDIDOS TAB ──────────────────────────────────────── */}
      {tab === "pedidos" && (
        <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card overflow-hidden animate-fade-in">
          <div className="px-5 py-4 border-b border-axo-border">
            <h3 className="font-bold text-axo-text">Pedidos recientes</h3>
            <p className="text-xs text-axo-muted">Últimos 24 hs</p>
          </div>
          <div className="divide-y divide-axo-border">
            {[
              { id: "#2847", cliente: "Carlos B.", producto: "Combo Familiar Helado", total: 18900, estado: "En camino", color: "text-axo-cyan bg-axo-blue-light" },
              { id: "#2846", cliente: "María L.", producto: "Helado Cuarto Kg x2", total: 12400, estado: "Entregado", color: "text-axo-emerald bg-axo-emerald-light" },
              { id: "#2845", cliente: "Roberto S.", producto: "Duomo Box Premium", total: 24500, estado: "Preparando", color: "text-amber-700 bg-amber-50" },
            ].map((order) => (
              <div key={order.id} className="px-5 py-4 flex items-center gap-4 hover:bg-axo-bg transition-colors">
                <div className="w-9 h-9 rounded-xl bg-axo-bg border border-axo-border flex items-center justify-center flex-shrink-0">
                  <Package size={16} className="text-axo-muted" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-axo-text text-sm">{order.id}</p>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", order.color)}>
                      {order.estado}
                    </span>
                  </div>
                  <p className="text-xs text-axo-muted">{order.cliente} · {order.producto}</p>
                </div>
                <p className="font-black text-axo-text">{formatARS(order.total)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STOCK TAB ────────────────────────────────────────── */}
      {tab === "stock" && (
        <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card overflow-hidden animate-fade-in">
          <div className="px-5 py-4 border-b border-axo-border">
            <h3 className="font-bold text-axo-text">Gestión de stock</h3>
          </div>
          <div className="divide-y divide-axo-border">
            {allProducts.slice(0, 5).map((product, i) => {
              const stock = [15, 3, 28, 7, 42][i];
              const isLow = stock <= 5;
              return (
                <div key={product.id} className="px-5 py-4 flex items-center gap-4 hover:bg-axo-bg transition-colors">
                  <span className="text-2xl flex-shrink-0">{product.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-axo-text text-sm truncate">{product.name}</p>
                    <div className="mt-1 h-1.5 w-full bg-axo-bg rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", isLow ? "bg-red-400" : "bg-axo-emerald")}
                        style={{ width: `${Math.min(100, (stock / 50) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={cn("text-sm font-black", isLow ? "text-red-500" : "text-axo-text")}>
                      {stock} u.
                    </p>
                    {isLow && <p className="text-[10px] text-red-500 font-semibold">Stock bajo</p>}
                  </div>
                  <button className="text-xs text-axo-cyan hover:underline font-semibold">Editar</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
