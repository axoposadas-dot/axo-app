"use client";

// ================================================================
//  AXO — DriverView (Light Design)
// ================================================================

import { useState } from "react";
import { Package, Car, MapPin, Clock, CheckCircle2, DollarSign, Zap, TrendingUp, Navigation } from "lucide-react";
import { deliveryOrders, rideRequests, formatARS } from "@/lib/data";
import { cn } from "@/lib/utils";

type DriverTab = "entregas" | "viajes";

export function DriverView() {
  const [tab, setTab] = useState<DriverTab>("entregas");
  const [accepted, setAccepted] = useState<string[]>([]);

  const accept = (id: string) =>
    setAccepted((prev) => prev.includes(id) ? prev : [...prev, id]);

  const dailyEarnings = 18450;
  const completedToday = 7;

  return (
    <div className="flex flex-col gap-6">

      {/* Header card */}
      <div className="bg-white border border-axo-border rounded-2xl p-5 shadow-axo-card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-2xl">
              🛵
            </div>
            <div>
              <h2 className="text-xl font-black text-axo-text">Sumo Envíos & AXO Move</h2>
              <p className="text-sm text-axo-muted">Panel de conductor · Rodrigo G.</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-semibold bg-axo-emerald-light text-axo-emerald border border-axo-emerald/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-axo-emerald animate-pulse" />
                  En línea
                </span>
                <span className="text-[10px] text-axo-muted">Posadas · 3.2 km de radio</span>
              </div>
            </div>
          </div>

          {/* Quick earnings */}
          <div className="bg-axo-emerald-light border border-axo-emerald/20 rounded-2xl px-5 py-3 text-center">
            <p className="text-[10px] text-axo-emerald font-semibold uppercase tracking-wider">Ganado hoy</p>
            <p className="text-3xl font-black text-axo-emerald">{formatARS(dailyEarnings)}</p>
            <p className="text-[10px] text-axo-muted">{completedToday} servicios completados</p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Servicios hoy", value: completedToday, icon: <CheckCircle2 size={16} className="text-axo-emerald" />, bg: "bg-axo-emerald-light", border: "border-axo-emerald/20" },
          { label: "Calificación", value: "4.9 ★", icon: <span className="text-amber-400 text-base">★</span>, bg: "bg-amber-50", border: "border-amber-200" },
          { label: "En cola ahora", value: deliveryOrders.filter(o => o.status === "pendiente").length, icon: <Package size={16} className="text-axo-cyan" />, bg: "bg-axo-blue-light", border: "border-axo-cyan/20" },
          { label: "Km recorridos", value: "24.3", icon: <Navigation size={16} className="text-purple-600" />, bg: "bg-purple-50", border: "border-purple-200" },
        ].map((s) => (
          <div key={s.label} className={cn("bg-white rounded-2xl border p-4 shadow-axo-card", s.border)}>
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-2", s.bg)}>
              {s.icon}
            </div>
            <p className="text-xl font-black text-axo-text">{s.value}</p>
            <p className="text-[10px] text-axo-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Orders/Rides list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Tab selector */}
          <div className="flex gap-1 bg-axo-bg border border-axo-border rounded-2xl p-1.5">
            <button
              onClick={() => setTab("entregas")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
                tab === "entregas"
                  ? "bg-white text-axo-cyan shadow-axo-card border border-axo-border"
                  : "text-axo-muted hover:text-axo-text"
              )}
            >
              <Package size={15} /> Entregas
              <span className={cn(
                "text-[10px] font-black px-1.5 py-0.5 rounded-full",
                tab === "entregas" ? "bg-axo-cyan text-white" : "bg-axo-border text-axo-muted"
              )}>
                {deliveryOrders.filter(o => o.status === "pendiente").length}
              </span>
            </button>
            <button
              onClick={() => setTab("viajes")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
                tab === "viajes"
                  ? "bg-white text-purple-700 shadow-axo-card border border-axo-border"
                  : "text-axo-muted hover:text-axo-text"
              )}
            >
              <Car size={15} /> Viajes AXO Move
              <span className={cn(
                "text-[10px] font-black px-1.5 py-0.5 rounded-full",
                tab === "viajes" ? "bg-purple-600 text-white" : "bg-axo-border text-axo-muted"
              )}>
                {rideRequests.length}
              </span>
            </button>
          </div>

          {/* Entregas */}
          {tab === "entregas" && (
            <div className="flex flex-col gap-3 animate-fade-in">
              {deliveryOrders.map((order) => {
                const isAccepted = accepted.includes(order.id);
                const statusConfig = {
                  pendiente: { label: "Pendiente", color: "bg-amber-50 text-amber-700 border-amber-200" },
                  en_camino: { label: "En camino", color: "bg-axo-blue-light text-axo-cyan border-axo-cyan/20" },
                  entregado: { label: "Entregado", color: "bg-axo-emerald-light text-axo-emerald border-axo-emerald/20" },
                  cancelado: { label: "Cancelado", color: "bg-red-50 text-red-600 border-red-200" },
                }[order.status];

                return (
                  <div key={order.id} className="bg-white border border-axo-border rounded-2xl shadow-axo-card overflow-hidden">
                    <div className="px-5 py-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-axo-bg border border-axo-border flex items-center justify-center text-xl flex-shrink-0">
                        📦
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-axo-text text-sm">{order.customerName}</p>
                          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", statusConfig.color)}>
                            {isAccepted ? "✓ Aceptado" : statusConfig.label}
                          </span>
                        </div>
                        <p className="text-xs text-axo-muted mt-0.5 truncate">{order.productName}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-axo-muted flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin size={10} className="text-axo-cyan" /> {order.destination}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {Math.round(order.distanceKm * 3)} min
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-axo-emerald">
                            <DollarSign size={10} /> +{formatARS(order.earningsARS)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {order.status === "pendiente" && !isAccepted && (
                      <div className="border-t border-axo-border px-5 py-3 bg-axo-bg flex gap-2">
                        <button
                          onClick={() => accept(order.id)}
                          className="axo-btn-green flex-1 text-sm py-2.5"
                        >
                          <CheckCircle2 size={14} /> Aceptar entrega
                        </button>
                        <button className="axo-btn-secondary text-sm py-2.5 px-4 hover:text-red-600 hover:border-red-300">
                          Rechazar
                        </button>
                      </div>
                    )}

                    {isAccepted && (
                      <div className="border-t border-axo-emerald/20 bg-axo-emerald-light px-5 py-3 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-axo-emerald" />
                        <p className="text-xs text-axo-emerald font-semibold">
                          ¡Entrega aceptada! Dirigite a {order.origin}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Viajes */}
          {tab === "viajes" && (
            <div className="flex flex-col gap-3 animate-fade-in">
              {rideRequests.map((ride) => {
                const isAccepted = accepted.includes(ride.id);
                return (
                  <div key={ride.id} className="bg-white border border-axo-border rounded-2xl shadow-axo-card overflow-hidden">
                    <div className="px-5 py-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-xl flex-shrink-0">
                        🚗
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-axo-text text-sm">{ride.passengerName}</p>
                          {isAccepted && (
                            <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                              ✓ Aceptado
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 mt-2">
                          <div className="flex items-center gap-2 text-xs text-axo-muted">
                            <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                            <span>{ride.origin}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-axo-muted">
                            <MapPin size={12} className="text-axo-emerald flex-shrink-0" />
                            <span>{ride.destination}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-axo-muted flex-wrap">
                          <span className="flex items-center gap-1"><Clock size={10} /> {Math.round(ride.distanceKm * 2.5)} min</span>
                          <span className="flex items-center gap-1">{ride.distanceKm} km</span>
                          <span className="flex items-center gap-1 font-bold text-purple-700">
                            <DollarSign size={10} /> {formatARS(ride.fareARS)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!isAccepted && (
                      <div className="border-t border-axo-border px-5 py-3 bg-axo-bg flex gap-2">
                        <button
                          onClick={() => accept(ride.id)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-axo-cyan text-white font-bold text-sm py-2.5 rounded-xl hover:shadow-md active:scale-95 transition-all"
                        >
                          <Car size={14} className="inline mr-1" /> Aceptar viaje
                        </button>
                        <button className="axo-btn-secondary text-sm py-2.5 px-4 hover:text-red-600 hover:border-red-300">
                          Pasar
                        </button>
                      </div>
                    )}

                    {isAccepted && (
                      <div className="border-t border-purple-200 bg-purple-50 px-5 py-3 flex items-center gap-2">
                        <Car size={14} className="text-purple-600" />
                        <p className="text-xs text-purple-700 font-semibold">
                          Viaje aceptado · Dirigite a {ride.origin}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Radar / mini-map */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card overflow-hidden">
            <div className="px-4 py-3 border-b border-axo-border flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-axo-text">Radar de zona</p>
                <p className="text-[10px] text-axo-muted">Posadas · Radio 3.2 km</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-axo-emerald font-semibold">
                <div className="w-1.5 h-1.5 rounded-full bg-axo-emerald animate-pulse" />
                Activo
              </div>
            </div>

            {/* Radar visual */}
            <div className="p-4">
              <div className="relative w-full aspect-square bg-gradient-to-br from-axo-bg to-white rounded-2xl border border-axo-border overflow-hidden flex items-center justify-center">
                {/* Circles */}
                {[90, 65, 40].map((size) => (
                  <div
                    key={size}
                    className="absolute rounded-full border border-axo-border/60"
                    style={{ width: `${size}%`, height: `${size}%` }}
                  />
                ))}
                {/* Sweep */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-1/2 h-0.5 origin-left radar-spinner"
                    style={{ background: "linear-gradient(to right, transparent, #2563EB40)" }}
                  />
                </div>

                {/* Package dots */}
                {[
                  { x: 65, y: 30, type: "pkg" }, { x: 25, y: 55, type: "pkg" },
                  { x: 75, y: 65, type: "ride" }, { x: 40, y: 25, type: "ride" },
                  { x: 55, y: 75, type: "pkg" },
                ].map((dot, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${dot.x}%`, top: `${dot.y}%`,
                      transform: "translate(-50%,-50%)",
                    }}
                  >
                    <div className="relative">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px]",
                        dot.type === "pkg" ? "bg-axo-cyan" : "bg-purple-500"
                      )}>
                        {dot.type === "pkg" ? "📦" : "🚗"}
                      </div>
                      <div className={cn(
                        "absolute inset-0 rounded-full animate-ping-slow opacity-30",
                        dot.type === "pkg" ? "bg-axo-cyan" : "bg-purple-500"
                      )} style={{ animationDelay: `${i * 0.4}s` }} />
                    </div>
                  </div>
                ))}

                {/* Center = you */}
                <div className="relative z-10">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-axo-emerald flex items-center justify-center shadow-md text-base">
                    🛵
                  </div>
                  <div className="absolute inset-0 rounded-full bg-axo-emerald animate-ping opacity-20" />
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="px-4 pb-4 flex items-center justify-center gap-4 text-[10px] text-axo-muted">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-axo-cyan" />
                <span>Entregas ({deliveryOrders.filter(o => o.status === "pendiente").length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Viajes ({rideRequests.length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-axo-emerald" />
                <span>Vos</span>
              </div>
            </div>
          </div>

          {/* Earnings breakdown */}
          <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-axo-emerald" />
              <p className="text-sm font-bold text-axo-text">Ganancias de la semana</p>
            </div>
            <div className="flex items-end gap-1 h-16">
              {[60, 85, 45, 92, 78, 100, 72].map((h, i) => {
                const days = ["L","M","X","J","V","S","D"];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center" style={{ height: "52px" }}>
                      <div
                        className={cn("w-full rounded-t-md", i === 5 ? "bg-axo-emerald" : "bg-axo-emerald/20")}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                    <span className={cn("text-[9px]", i === 5 ? "text-axo-emerald font-bold" : "text-axo-muted")}>
                      {days[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
