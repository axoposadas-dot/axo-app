"use client";

// ================================================================
//  AXO BEBIDAS — DriverView
//  Panel de Repartidor Express de Bebidas & Conveniencia · Posadas
// ================================================================

import { useState } from "react";
import {
  Package, MapPin, Clock, CheckCircle2, DollarSign,
  TrendingUp, Navigation, AlertCircle, Phone,
  Check, ArrowRight, ShieldCheck, Sparkles, X
} from "lucide-react";
import { deliveryOrders, formatARS, type DeliveryOrder } from "@/lib/data";
import { cn } from "@/lib/utils";

// Posadas coordinates / landmarks for simulated radar
const POSADAS_ZONES_COORDS = [
  { name: "Deli Drinks Depósito Central (Av. Corrientes)", x: 50, y: 50, type: "hub", label: "HUB" },
  { name: "Villa Sarita (Calle Los Pinos 240)", x: 58, y: 32, type: "order", orderId: "ord-001" },
  { name: "Centro (Av. Roca 1850)", x: 44, y: 42, type: "order", orderId: "ord-002" },
  { name: "Itaembé Miní (Calle Tarumá 890)", x: 26, y: 74, type: "order", orderId: "ord-003" },
  { name: "Chacra 29 (RN 12 Km 8)", x: 72, y: 62, type: "order", orderId: "ord-004" },
  { name: "San Isidro (Calle San Martín 450)", x: 40, y: 84, type: "order", orderId: "ord-005" },
];

export function DriverView() {
  const [orders, setOrders] = useState<DeliveryOrder[]>(deliveryOrders);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(orders[0]);
  const [activeRouteOrder, setActiveRouteOrder] = useState<DeliveryOrder | null>(null);
  const [filterZona, setFilterZona] = useState<string>("todas");
  const [deliveryConfirmed, setDeliveryConfirmed] = useState<string | null>(null);

  // Repartidor stats
  const completedCount = orders.filter((o) => o.status === "entregado").length;
  const inProgressCount = orders.filter((o) => o.status === "en_camino").length;
  const pendingCount = orders.filter((o) => o.status === "pendiente").length;
  const totalEarningsToday = orders
    .filter((o) => o.status === "entregado")
    .reduce((acc, o) => acc + o.earningsARS, 12600); // base + entregas

  // Actions
  const handleAcceptOrder = (order: DeliveryOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: "en_camino" } : o))
    );
    setActiveRouteOrder(order);
    setSelectedOrder(order);
  };

  const handleConfirmDelivery = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "entregado" } : o))
    );
    setDeliveryConfirmed(orderId);
    if (activeRouteOrder?.id === orderId) {
      setActiveRouteOrder(null);
    }
    setTimeout(() => setDeliveryConfirmed(null), 3500);
  };

  const filteredOrders = filterZona === "todas"
    ? orders
    : orders.filter((o) => o.zona.toLowerCase().includes(filterZona.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">

      {/* ── HEADER DE REPARTIDOR ─────────────────────────────── */}
      <div className="bg-white border border-axo-border rounded-2xl p-5 shadow-axo-card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-axo-emerald-light border border-axo-emerald/20 flex items-center justify-center text-3xl flex-shrink-0">
              🛵
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-axo-text">Repartidor Express Posadas</h2>
                <span className="text-[10px] font-bold bg-axo-emerald-light text-axo-emerald border border-axo-emerald/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-axo-emerald animate-pulse" />
                  DISPONIBLE
                </span>
              </div>
              <p className="text-xs text-axo-muted mt-0.5">Móvil Moto #08 · Rodrigo G. · Zona Centro & Alrededores</p>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-axo-muted">
                <span>⭐ 4.95 (1.420 entregas)</span>
                <span>•</span>
                <span>Mochila térmica con conservadora de hielo</span>
              </div>
            </div>
          </div>

          {/* Ganancias del turno */}
          <div className="bg-axo-blue-light border border-axo-cyan/20 rounded-2xl px-5 py-3 text-right">
            <p className="text-[10px] text-axo-cyan font-bold uppercase tracking-wider">Ganancias hoy</p>
            <p className="text-3xl font-black text-axo-cyan">{formatARS(totalEarningsToday)}</p>
            <p className="text-[10px] text-axo-muted">{completedCount} entregas completadas</p>
          </div>
        </div>
      </div>

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "En cola en Posadas", value: pendingCount, icon: <Package size={16} className="text-amber-600" />, bg: "bg-amber-50", border: "border-amber-200" },
          { label: "En viaje activo", value: inProgressCount, icon: <Navigation size={16} className="text-axo-cyan" />, bg: "bg-axo-blue-light", border: "border-axo-cyan/20" },
          { label: "Entregados hoy", value: completedCount, icon: <CheckCircle2 size={16} className="text-axo-emerald" />, bg: "bg-axo-emerald-light", border: "border-axo-emerald/20" },
          { label: "Tiempo promedio", value: "19 min", icon: <Clock size={16} className="text-purple-600" />, bg: "bg-purple-50", border: "border-purple-200" },
        ].map((s) => (
          <div key={s.label} className={cn("bg-white rounded-2xl border p-4 shadow-axo-card", s.border)}>
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-2", s.bg)}>
              {s.icon}
            </div>
            <p className="text-2xl font-black text-axo-text">{s.value}</p>
            <p className="text-[11px] text-axo-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── TOAST DE CONFIRMACIÓN ────────────────────────────── */}
      {deliveryConfirmed && (
        <div className="bg-axo-emerald-light border border-axo-emerald/30 rounded-2xl p-4 flex items-center justify-between gap-3 animate-slide-up shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-axo-emerald text-white flex items-center justify-center font-bold">
              <Check size={20} />
            </div>
            <div>
              <p className="font-bold text-axo-emerald text-sm">¡Entrega #{deliveryConfirmed} completada con éxito!</p>
              <p className="text-xs text-axo-emerald/80">Pago acreditado en tu billetera express. Cliente notificado por WhatsApp.</p>
            </div>
          </div>
          <button onClick={() => setDeliveryConfirmed(null)} className="text-axo-emerald hover:text-axo-emerald-dim p-1">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── RUTA ACTIVA EN TIEMPO REAL ───────────────────────── */}
      {activeRouteOrder && (
        <div className="bg-white border-2 border-axo-cyan rounded-2xl shadow-axo-card-md p-5 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-axo-border">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-axo-cyan animate-ping" />
              <h3 className="font-black text-axo-text text-base">Ruta Express en Curso: Pedido #{activeRouteOrder.numero}</h3>
            </div>
            <span className="text-xs font-bold text-axo-cyan bg-axo-blue-light border border-axo-cyan/30 px-3 py-1 rounded-full">
              GPS Activo · Llegada en ~{Math.round(activeRouteOrder.distanceKm * 3.5)} min
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Origen y Destino */}
            <div className="md:col-span-2 flex flex-col justify-between gap-3 bg-axo-bg rounded-xl p-4 border border-axo-border">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-axo-cyan text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  HUB
                </div>
                <div>
                  <p className="text-[10px] font-bold text-axo-muted uppercase">Origen (Retiro)</p>
                  <p className="font-bold text-axo-text text-sm">Deli Drinks Posadas (Av. Corrientes 1500)</p>
                  <p className="text-xs text-axo-muted">Bebidas empaquetadas y frías listas para entrega</p>
                </div>
              </div>

              <div className="pl-4 flex items-center gap-2 text-xs text-axo-cyan font-bold">
                <div className="w-0.5 h-6 bg-axo-cyan/30 ml-2.5" />
                <span className="bg-white border border-axo-cyan/30 px-2 py-0.5 rounded-md">
                  {activeRouteOrder.distanceKm} km por Av. Corrientes / Av. Rademacher
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-axo-emerald text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <MapPin size={15} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-axo-muted uppercase">Destino ({activeRouteOrder.zona})</p>
                  <p className="font-bold text-axo-text text-sm">{activeRouteOrder.address}</p>
                  <p className="text-xs text-axo-muted">Cliente: {activeRouteOrder.customerName} ({activeRouteOrder.phone})</p>
                </div>
              </div>
            </div>

            {/* Acciones y Confirmación */}
            <div className="flex flex-col justify-between gap-3 bg-axo-blue-light/50 border border-axo-cyan/20 rounded-xl p-4">
              <div>
                <p className="text-xs font-bold text-axo-text">Detalle a Entregar:</p>
                <div className="flex flex-col gap-1 mt-1.5">
                  {activeRouteOrder.items.map((it, idx) => (
                    <p key={idx} className="text-xs text-axo-text font-medium">
                      🧊 {it.qty}x {it.name}
                    </p>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-axo-cyan/20 flex items-center justify-between text-xs">
                  <span className="text-axo-muted">Ganancia del reparto:</span>
                  <span className="font-black text-axo-emerald text-sm">+{formatARS(activeRouteOrder.earningsARS)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={`https://wa.me/${activeRouteOrder.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-green-300 text-green-700 text-xs font-bold hover:bg-green-50 transition-colors"
                >
                  <Phone size={13} /> Avisar al cliente por WhatsApp
                </a>
                <button
                  onClick={() => handleConfirmDelivery(activeRouteOrder.id)}
                  className="w-full py-3 rounded-xl bg-axo-emerald hover:bg-axo-emerald-dim text-white font-bold text-sm shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={16} /> Confirmar Entrega Realizada
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GRID: LISTA DE PEDIDOS Y RADAR POSADAS ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Columna Izquierda: Pedidos Disponibles y en Curso */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-axo-text text-base flex items-center gap-2">
              <Package size={17} className="text-axo-cyan" />
              Entregas de Bebidas en Posadas ({filteredOrders.length})
            </h3>

            {/* Filtro rápido por zona */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {["todas", "Centro", "Villa Sarita", "Itaembé Miní", "Chacra 29"].map((z) => (
                <button
                  key={z}
                  onClick={() => setFilterZona(z)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg border font-semibold capitalize whitespace-nowrap transition-all",
                    filterZona === z
                      ? "bg-axo-cyan text-white border-axo-cyan shadow-sm"
                      : "bg-white border-axo-border text-axo-muted hover:border-axo-cyan/40"
                  )}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredOrders.map((order) => {
              const isAccepted = order.status === "en_camino";
              const isDone = order.status === "entregado";
              const isSelected = selectedOrder?.id === order.id;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={cn(
                    "bg-white border rounded-2xl shadow-axo-card transition-all cursor-pointer overflow-hidden",
                    isSelected ? "border-axo-cyan ring-1 ring-axo-cyan/20" : "border-axo-border hover:border-axo-cyan/30"
                  )}
                >
                  <div className="p-4 flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0",
                      isDone ? "bg-axo-emerald-light text-axo-emerald" :
                      isAccepted ? "bg-axo-blue-light text-axo-cyan animate-pulse" :
                      "bg-amber-50 text-amber-700"
                    )}>
                      {isDone ? "✓" : isAccepted ? "🛵" : "📦"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-axo-text text-sm">Pedido #{order.numero} · {order.customerName}</p>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                            order.priority === "urgente" ? "bg-red-50 text-red-700 border-red-200" : "bg-slate-50 text-slate-600 border-slate-200"
                          )}>
                            {order.priority.toUpperCase()}
                          </span>
                        </div>
                        <span className="font-black text-axo-emerald text-sm">
                          +{formatARS(order.earningsARS)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5 mt-1.5">
                        {order.items.map((item, i) => (
                          <p key={i} className="text-xs text-axo-text font-medium truncate">
                            • {item.qty}x {item.name}
                          </p>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 mt-2.5 text-xs text-axo-muted flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-axo-text">
                          <MapPin size={12} className="text-axo-cyan" /> {order.zona} · {order.address}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {order.distanceKm} km (~{Math.round(order.distanceKm * 3.5)} min)
                        </span>
                        <span className="bg-axo-bg border border-axo-border px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                          Pago: {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones de pedido */}
                  <div className="border-t border-axo-border px-4 py-2.5 bg-axo-bg flex items-center justify-between gap-3">
                    <span className="text-[11px] text-axo-muted">
                      {isDone ? "Entregado con éxito" : isAccepted ? "Reparto en tránsito" : "Esperando repartidor"}
                    </span>

                    <div className="flex items-center gap-2">
                      {order.status === "pendiente" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptOrder(order);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-axo-cyan hover:bg-axo-cyan-dim text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                        >
                          <Navigation size={12} /> Aceptar y ver ruta
                        </button>
                      )}

                      {order.status === "en_camino" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmDelivery(order.id);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-axo-emerald hover:bg-axo-emerald-dim text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                        >
                          <CheckCircle2 size={12} /> Confirmar Entrega
                        </button>
                      )}

                      {order.status === "entregado" && (
                        <span className="text-xs font-bold text-axo-emerald flex items-center gap-1">
                          <Check size={14} /> Listo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Radar Geográfico Interactivo de Posadas */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card overflow-hidden">
            <div className="p-4 border-b border-axo-border flex items-center justify-between">
              <div>
                <h4 className="font-bold text-axo-text text-sm">Radar Posadas Express</h4>
                <p className="text-[10px] text-axo-muted">Monitoreo de entregas en tiempo real</p>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-axo-emerald bg-axo-emerald-light px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-axo-emerald animate-pulse" /> ACTIVO
              </span>
            </div>

            {/* Gráfico de Radar de Posadas */}
            <div className="relative aspect-square w-full bg-slate-900 overflow-hidden flex items-center justify-center p-4">
              {/* Círculos concéntricos de distancia */}
              <div className="absolute w-[85%] h-[85%] rounded-full border border-slate-700/60" />
              <div className="absolute w-[60%] h-[60%] rounded-full border border-slate-700/60" />
              <div className="absolute w-[35%] h-[35%] rounded-full border border-slate-700/60" />
              <div className="absolute w-full h-[1px] bg-slate-800" />
              <div className="absolute h-full w-[1px] bg-slate-800" />

              {/* Animación de barrido de radar */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-1/2 h-0.5 origin-left radar-spinner"
                  style={{ background: "linear-gradient(to right, transparent, rgba(0, 242, 254, 0.45))" }}
                />
              </div>

              {/* Puntos en el mapa de Posadas */}
              {POSADAS_ZONES_COORDS.map((pt, idx) => {
                const isHub = pt.type === "hub";
                const isSelected = selectedOrder?.id === pt.orderId;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (pt.orderId) {
                        const target = orders.find((o) => o.id === pt.orderId);
                        if (target) setSelectedOrder(target);
                      }
                    }}
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                  >
                    <div className={cn(
                      "rounded-full flex items-center justify-center transition-transform group-hover:scale-125",
                      isHub
                        ? "w-8 h-8 bg-axo-cyan border-2 border-white shadow-lg text-white font-black text-[10px]"
                        : isSelected
                        ? "w-7 h-7 bg-amber-400 border-2 border-white shadow-md text-slate-950 font-bold text-xs animate-bounce"
                        : "w-5 h-5 bg-axo-emerald border border-white shadow text-white font-bold text-[9px]"
                    )}>
                      {isHub ? "HUB" : "🍺"}
                    </div>

                    {/* Tooltip con nombre de zona */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black/90 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-20">
                      {pt.name}
                    </div>
                  </div>
                );
              })}

              {/* Leyenda en la base del radar */}
              <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-300">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-axo-cyan" /> Depósito Posadas</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-axo-emerald" /> Pedidos activos</span>
              </div>
            </div>

            {/* Información del pedido seleccionado en el radar */}
            {selectedOrder && (
              <div className="p-4 bg-axo-bg border-t border-axo-border">
                <p className="text-[10px] font-bold text-axo-muted uppercase tracking-wider">Punto de entrega seleccionado</p>
                <p className="font-bold text-axo-text text-sm mt-0.5">{selectedOrder.customerName} ({selectedOrder.zona})</p>
                <p className="text-xs text-axo-muted">{selectedOrder.address}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-axo-emerald">Ganancia: {formatARS(selectedOrder.earningsARS)}</span>
                  {selectedOrder.status === "pendiente" && (
                    <button
                      onClick={() => handleAcceptOrder(selectedOrder)}
                      className="text-xs font-bold text-axo-cyan hover:underline flex items-center gap-1"
                    >
                      Aceptar pedido <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tips de servicio para el cadete */}
          <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card p-4 flex flex-col gap-2.5">
            <h4 className="font-bold text-axo-text text-xs uppercase tracking-wider text-axo-muted">Estándar Express AXO</h4>
            <div className="flex items-start gap-2.5 text-xs text-axo-text">
              <ShieldCheck size={16} className="text-axo-emerald flex-shrink-0 mt-0.5" />
              <span>Conservar hielo y bebidas frías dentro de la mochila térmica sellada hasta la entrega.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-axo-text">
              <Sparkles size={16} className="text-axo-cyan flex-shrink-0 mt-0.5" />
              <span>Verificar mayoría de edad del receptor (+18 años) según normativa vigente.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
