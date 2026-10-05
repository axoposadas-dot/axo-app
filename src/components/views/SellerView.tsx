"use client";

// ================================================================
//  AXO BEBIDAS — SellerView (Distribuidor)
//  Panel de Control · Deli Drinks / Distribuidora JB
// ================================================================

import { useState } from "react";
import {
  Package, TrendingUp, Clock, ShoppingBag,
  Plus, Edit3, Check, X, AlertTriangle, Bell,
  Star, RefreshCw, ChevronRight, DollarSign, Eye, Zap,
} from "lucide-react";
import {
  deliveryOrders, distribuidorStats, allDrinkProducts,
  DRINK_CATEGORIES, formatARS, type DrinkProduct, type DrinkCategory,
} from "@/lib/data";
import { cn } from "@/lib/utils";

type SellerTab = "dashboard" | "pedidos" | "catalogo" | "stock";

const STATUS_CONFIG = {
  pendiente:  { label: "Pendiente",  bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  en_camino:  { label: "En camino",  bg: "bg-axo-blue-light", text: "text-axo-cyan", border: "border-axo-cyan/30", dot: "bg-axo-cyan" },
  entregado:  { label: "Entregado",  bg: "bg-axo-emerald-light", text: "text-axo-emerald", border: "border-axo-emerald/30", dot: "bg-axo-emerald" },
  cancelado:  { label: "Cancelado",  bg: "bg-red-50", text: "text-red-600", border: "border-red-200", dot: "bg-red-500" },
};

const PRIORITY_BADGE = {
  urgente: "bg-red-100 text-red-700 border border-red-200",
  normal:  "bg-slate-100 text-slate-600 border border-slate-200",
  baja:    "bg-green-50 text-green-700 border border-green-200",
};

export function SellerView() {
  const [tab, setTab] = useState<SellerTab>("dashboard");
  const [activeOrders, setActiveOrders] = useState(deliveryOrders);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockValues, setStockValues] = useState<Record<string, number>>(
    Object.fromEntries(allDrinkProducts.map((p) => [p.id, p.stock]))
  );
  const [catFilter, setCatFilter] = useState<DrinkCategory | "todos">("todos");

  const pendientesCount = activeOrders.filter((o) => o.status === "pendiente").length;

  const markAs = (id: string, status: "en_camino" | "entregado" | "cancelado") => {
    setActiveOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  const stats = distribuidorStats;
  const filteredProducts = catFilter === "todos"
    ? allDrinkProducts
    : allDrinkProducts.filter((p) => p.category === catFilter);

  return (
    <div className="flex flex-col gap-6">

      {/* ── STORE HEADER ─────────────────────────────────────── */}
      <div className="bg-white border border-axo-border rounded-2xl p-5 shadow-axo-card">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-axo-cyan to-axo-emerald flex items-center justify-center text-3xl flex-shrink-0">
            🍺
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-axo-text">Deli Drinks Posadas</h2>
              <span className="text-[10px] font-bold bg-axo-emerald-light text-axo-emerald border border-axo-emerald/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-axo-emerald animate-pulse" /> ACTIVO
              </span>
              {pendientesCount > 0 && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Bell size={10} /> {pendientesCount} pedido{pendientesCount !== 1 ? "s" : ""} nuevo{pendientesCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="text-xs text-axo-muted mt-0.5">Distribuidora de bebidas · Posadas, Misiones</p>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-bold text-axo-text ml-1">{stats.rating}</span>
              <span className="text-xs text-axo-muted">· Delivery en ~{stats.promedioTiempoEntrega} min</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-axo-muted">Ventas hoy</p>
            <p className="text-2xl font-black text-axo-emerald">{formatARS(stats.ventasHoyARS)}</p>
            <p className="text-xs text-axo-muted">{stats.pedidosHoy} pedidos</p>
          </div>
        </div>
      </div>

      {/* ── TABS ─────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-axo-bg border border-axo-border rounded-2xl p-1.5">
        {([ "dashboard", "pedidos", "catalogo", "stock" ] as SellerTab[]).map((t) => {
          const labels: Record<SellerTab, string> = {
            dashboard: "📊 Resumen",
            pedidos:   `📦 Pedidos${pendientesCount > 0 ? ` (${pendientesCount})` : ""}`,
            catalogo:  "🍺 Catálogo",
            stock:     "📋 Stock",
          };
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all",
                tab === t
                  ? "bg-white text-axo-cyan shadow-axo-card border border-axo-border"
                  : "text-axo-muted hover:text-axo-text"
              )}
            >
              {labels[t]}
            </button>
          );
        })}
      </div>

      {/* ── DASHBOARD ────────────────────────────────────────── */}
      {tab === "dashboard" && (
        <div className="flex flex-col gap-5">
          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Ventas hoy", value: formatARS(stats.ventasHoyARS), icon: <DollarSign size={18} className="text-axo-cyan" />, bg: "bg-axo-blue-light", border: "border-axo-cyan/20", trend: "+18%" },
              { label: "Pedidos hoy", value: stats.pedidosHoy, icon: <Package size={18} className="text-axo-emerald" />, bg: "bg-axo-emerald-light", border: "border-axo-emerald/20", trend: "+5" },
              { label: "Entrega promedio", value: `${stats.promedioTiempoEntrega} min`, icon: <Clock size={18} className="text-purple-600" />, bg: "bg-purple-50", border: "border-purple-200", trend: "−3 min" },
              { label: "Calificación", value: `${stats.rating} ★`, icon: <Star size={18} className="text-amber-500" />, bg: "bg-amber-50", border: "border-amber-200", trend: "Excelente" },
            ].map((card) => (
              <div key={card.label} className={cn("bg-white rounded-2xl border p-4 shadow-axo-card", card.border)}>
                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3", card.bg)}>
                  {card.icon}
                </div>
                <p className="text-2xl font-black text-axo-text">{card.value}</p>
                <p className="text-xs text-axo-muted mt-0.5">{card.label}</p>
                <p className="text-[10px] text-axo-emerald font-bold mt-1">{card.trend}</p>
              </div>
            ))}
          </div>

          {/* Weekly chart */}
          <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-axo-text">Pedidos · Últimos 7 días</h3>
                <p className="text-xs text-axo-muted mt-0.5">Total: {stats.pedidosSemana.reduce((a, b) => a + b, 0)} pedidos</p>
              </div>
              <TrendingUp size={16} className="text-axo-emerald" />
            </div>
            <div className="flex items-end gap-2 h-24">
              {["L","M","X","J","V","S","D"].map((day, i) => {
                const max = Math.max(...stats.pedidosSemana);
                const h = (stats.pedidosSemana[i] / max) * 100;
                const isToday = i === 6;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[9px] text-axo-muted font-bold">{stats.pedidosSemana[i]}</span>
                    <div className="w-full flex items-end justify-center" style={{ height: "72px" }}>
                      <div
                        className={cn("w-full rounded-t-xl transition-all", isToday ? "bg-axo-cyan" : "bg-axo-blue-light")}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                    <span className={cn("text-[10px] font-semibold", isToday ? "text-axo-cyan" : "text-axo-muted")}>{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top product & quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-axo-emerald" />
                <p className="text-sm font-bold text-axo-text">Top del día</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">🥃</span>
                <div>
                  <p className="font-bold text-axo-text text-sm">{stats.topProducto}</p>
                  <p className="text-xs text-axo-muted">28 unidades vendidas hoy</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card p-4">
              <p className="text-sm font-bold text-axo-text mb-3">Acciones rápidas</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Ver pedidos pendientes", icon: <Package size={13} />, action: () => setTab("pedidos") },
                  { label: "Actualizar stock", icon: <RefreshCw size={13} />, action: () => setTab("stock") },
                ].map((a) => (
                  <button
                    key={a.label}
                    onClick={a.action}
                    className="flex items-center justify-between gap-2 text-xs font-semibold text-axo-cyan hover:text-axo-cyan-dim px-3 py-2.5 rounded-xl border border-axo-cyan/20 bg-axo-blue-light hover:bg-axo-cyan/10 transition-colors"
                  >
                    <span className="flex items-center gap-2">{a.icon} {a.label}</span>
                    <ChevronRight size={12} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PEDIDOS ───────────────────────────────────────────── */}
      {tab === "pedidos" && (
        <div className="flex flex-col gap-3">
          {/* Filter badges */}
          <div className="flex gap-2 flex-wrap">
            {(["pendiente", "en_camino", "entregado"] as const).map((s) => {
              const cfg = STATUS_CONFIG[s];
              const count = activeOrders.filter((o) => o.status === s).length;
              return (
                <div key={s} className={cn("flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border", cfg.bg, cfg.text, cfg.border)}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                  {cfg.label}: {count}
                </div>
              );
            })}
          </div>

          {activeOrders.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            return (
              <div key={order.id} className="bg-white border border-axo-border rounded-2xl shadow-axo-card overflow-hidden">
                {/* Order header */}
                <div className="px-5 py-4 flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-base font-black flex-shrink-0", cfg.bg, cfg.text)}>
                    #{order.numero}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-axo-text text-sm">{order.customerName}</p>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", cfg.bg, cfg.text, cfg.border)}>
                        {cfg.label}
                      </span>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full capitalize", PRIORITY_BADGE[order.priority])}>
                        {order.priority}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 mt-1.5">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-xs text-axo-muted">
                          • {item.qty}× {item.name}
                        </p>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap text-[11px] text-axo-muted">
                      <span>📍 {order.zona} · {order.address.substring(0, 30)}{order.address.length > 30 ? "..." : ""}</span>
                      <span>💳 {order.paymentMethod}</span>
                      <span className="font-bold text-axo-text">Total: {formatARS(order.totalARS)}</span>
                    </div>
                    <p className="text-[10px] text-axo-muted mt-1">Hace {order.minutesAgo} min</p>
                  </div>
                </div>

                {/* Action buttons */}
                {order.status === "pendiente" && (
                  <div className="border-t border-axo-border px-4 py-3 bg-axo-bg flex gap-2">
                    <button
                      onClick={() => markAs(order.id, "en_camino")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-axo-cyan text-white text-xs font-bold rounded-xl hover:bg-axo-cyan-dim transition-all"
                    >
                      <Check size={13} /> Aceptar y enviar
                    </button>
                    <button
                      onClick={() => markAs(order.id, "cancelado")}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <X size={13} /> Rechazar
                    </button>
                  </div>
                )}
                {order.status === "en_camino" && (
                  <div className="border-t border-axo-cyan/20 px-4 py-3 bg-axo-blue-light flex gap-2">
                    <button
                      onClick={() => markAs(order.id, "entregado")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-axo-emerald text-white text-xs font-bold rounded-xl hover:bg-axo-emerald-dim transition-all"
                    >
                      <Check size={13} /> Marcar como entregado
                    </button>
                  </div>
                )}
                {order.status === "entregado" && (
                  <div className="border-t border-axo-emerald/20 px-4 py-3 bg-axo-emerald-light">
                    <p className="text-xs text-axo-emerald font-semibold flex items-center gap-1.5">
                      <Check size={12} /> Entregado · +{formatARS(order.earningsARS)} para el repartidor
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── CATÁLOGO ──────────────────────────────────────────── */}
      {tab === "catalogo" && (
        <div className="flex flex-col gap-4">
          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCatFilter("todos")}
              className={cn("flex-shrink-0 text-xs font-semibold px-3 py-2 rounded-xl border transition-all",
                catFilter === "todos" ? "bg-axo-cyan text-white border-axo-cyan" : "border-axo-border text-axo-muted hover:border-axo-cyan/40"
              )}
            >🏪 Todos ({allDrinkProducts.length})</button>
            {DRINK_CATEGORIES.map((cat) => {
              const count = allDrinkProducts.filter((p) => p.category === cat.key).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => setCatFilter(cat.key)}
                  className={cn("flex-shrink-0 text-xs font-semibold px-3 py-2 rounded-xl border transition-all",
                    catFilter === cat.key ? "bg-axo-cyan text-white border-axo-cyan" : "border-axo-border text-axo-muted hover:border-axo-cyan/40"
                  )}
                >
                  {cat.emoji} {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Product table */}
          <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card overflow-hidden">
            <div className="px-5 py-3 border-b border-axo-border flex items-center justify-between">
              <p className="text-sm font-bold text-axo-text">{filteredProducts.length} productos</p>
            </div>
            <div className="divide-y divide-axo-border">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 px-5 py-3 hover:bg-axo-bg/50 transition-colors">
                  <span className="text-2xl flex-shrink-0">{product.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-axo-text text-sm truncate">{product.name}</p>
                    <p className="text-xs text-axo-muted">{product.brand} · {product.volume}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-axo-text text-sm">{formatARS(product.priceARS)}</p>
                  </div>
                  <div className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-full border flex-shrink-0",
                    product.stock > 10 ? "bg-axo-emerald-light text-axo-emerald border-axo-emerald/20" :
                    product.stock > 0  ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-red-50 text-red-600 border-red-200"
                  )}>
                    {product.stock} u.
                  </div>
                  <div className="flex items-center gap-1">
                    {product.flashDeal && <span title="Flash" className="text-red-500"><Zap size={13} /></span>}
                    {product.featured && <span title="Destacado"><Eye size={13} className="text-axo-cyan" /></span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STOCK ─────────────────────────────────────────────── */}
      {tab === "stock" && (
        <div className="flex flex-col gap-4">
          {/* Low stock alert */}
          {allDrinkProducts.filter((p) => p.stock <= 5).length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800">Stock bajo detectado</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  {allDrinkProducts.filter((p) => p.stock <= 5).map((p) => p.name).join(", ")} — reponer urgente.
                </p>
              </div>
            </div>
          )}

          {DRINK_CATEGORIES.map((cat) => {
            const catProducts = allDrinkProducts.filter((p) => p.category === cat.key);
            return (
              <div key={cat.key} className="bg-white border border-axo-border rounded-2xl shadow-axo-card overflow-hidden">
                <div className="px-5 py-3 border-b border-axo-border bg-axo-bg">
                  <p className="font-bold text-axo-text text-sm">
                    {cat.emoji} {cat.label}
                  </p>
                </div>
                <div className="divide-y divide-axo-border">
                  {catProducts.map((product) => {
                    const isEditing = editingStock === product.id;
                    return (
                      <div key={product.id} className="flex items-center gap-4 px-5 py-3">
                        <span className="text-xl flex-shrink-0">{product.image}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-axo-text text-sm truncate">{product.name}</p>
                          <p className="text-xs text-axo-muted">{product.volume}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isEditing ? (
                            <>
                              <input
                                type="number"
                                value={stockValues[product.id]}
                                onChange={(e) => setStockValues((prev) => ({ ...prev, [product.id]: parseInt(e.target.value) || 0 }))}
                                className="w-20 text-center border-2 border-axo-cyan rounded-xl px-2 py-1.5 text-sm font-bold text-axo-text focus:outline-none"
                              />
                              <button
                                onClick={() => setEditingStock(null)}
                                className="w-8 h-8 rounded-xl bg-axo-emerald text-white flex items-center justify-center hover:bg-axo-emerald-dim transition-colors"
                              >
                                <Check size={13} />
                              </button>
                            </>
                          ) : (
                            <>
                              <span className={cn(
                                "text-sm font-black px-3 py-1.5 rounded-xl border",
                                stockValues[product.id] <= 5 ? "bg-red-50 text-red-600 border-red-200" :
                                stockValues[product.id] <= 15 ? "bg-amber-50 text-amber-700 border-amber-200" :
                                "bg-axo-emerald-light text-axo-emerald border-axo-emerald/20"
                              )}>
                                {stockValues[product.id]} u.
                              </span>
                              <button
                                onClick={() => setEditingStock(product.id)}
                                className="w-8 h-8 rounded-xl border border-axo-border text-axo-muted hover:border-axo-cyan hover:text-axo-cyan bg-white flex items-center justify-center transition-colors"
                              >
                                <Edit3 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
