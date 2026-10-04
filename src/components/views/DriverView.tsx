"use client";

import { useState } from "react";
import { Package, Navigation, Clock, CheckCircle2, Star, Bike, Car, Truck } from "lucide-react";
import {
  deliveryOrders, rideRequests, formatARS, type DeliveryOrder, type RideRequest
} from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type LogisticTab = "entregas" | "viajes";

const priorityColors = {
  alta: "axo-badge-red",
  normal: "axo-badge-cyan",
  baja: "axo-badge-default",
};

// Fake radar dots (lat/lng → canvas-like percentage positions for visual demo)
const radarDots = [
  { id: 1, x: 48, y: 38, type: "delivery", label: "Entrega" },
  { id: 2, x: 62, y: 54, type: "delivery", label: "Entrega" },
  { id: 3, x: 35, y: 60, type: "ride", label: "Pasajero" },
  { id: 4, x: 72, y: 42, type: "delivery", label: "Entrega" },
  { id: 5, x: 28, y: 45, type: "ride", label: "Pasajero" },
  { id: 6, x: 55, y: 68, type: "delivery", label: "Entrega" },
];

export function DriverView() {
  const [tab, setTab] = useState<LogisticTab>("entregas");
  const [orders, setOrders] = useState<DeliveryOrder[]>(deliveryOrders);
  const [rides, setRides] = useState<RideRequest[]>(rideRequests);
  const [accepted, setAccepted] = useState<string[]>([]);
  const [earnings] = useState(28450);
  const [todayTrips] = useState(7);

  const handleAcceptOrder = (id: string) => {
    setAccepted((prev) => [...prev, id]);
    setTimeout(() => {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setAccepted((prev) => prev.filter((a) => a !== id));
    }, 1500);
  };

  const handleAcceptRide = (id: string) => {
    setAccepted((prev) => [...prev, id]);
    setTimeout(() => {
      setRides((prev) => prev.filter((r) => r.id !== id));
      setAccepted((prev) => prev.filter((a) => a !== id));
    }, 1500);
  };

  const pendingOrders = orders.filter((o) => o.status === "pendiente");
  const activeOrders = orders.filter((o) => o.status === "en_camino");

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-axo-text">Sumo Envíos & AXO Move</h2>
          <p className="text-xs text-axo-muted">Vista Conductor — Posadas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-axo-emerald animate-pulse" />
          <span className="text-xs text-axo-emerald font-bold">Activo</span>
        </div>
      </div>

      {/* Driver stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="axo-card p-3 text-center">
          <p className="text-xl font-black text-axo-cyan">{formatARS(earnings)}</p>
          <p className="text-[10px] text-axo-muted">Ganancias hoy</p>
        </div>
        <div className="axo-card p-3 text-center">
          <p className="text-xl font-black text-axo-emerald">{todayTrips}</p>
          <p className="text-[10px] text-axo-muted">Servicios hoy</p>
        </div>
        <div className="axo-card p-3 text-center">
          <p className="text-xl font-black text-amber-400">4.9 ★</p>
          <p className="text-[10px] text-axo-muted">Calificación</p>
        </div>
      </div>

      {/* Radar visual */}
      <div className="axo-card-glow p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-axo-muted uppercase tracking-wider">
            Radar de zona — Posadas Centro
          </p>
          <Badge variant="emerald">
            {pendingOrders.length + rideRequests.length} activos
          </Badge>
        </div>

        {/* Radar map */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-axo-bg border border-axo-border">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-10">
            {[25, 50, 75].map((pct) => (
              <div key={pct}>
                <div className="absolute top-0 bottom-0 border-l border-axo-cyan" style={{ left: `${pct}%` }} />
                <div className="absolute left-0 right-0 border-t border-axo-cyan" style={{ top: `${pct}%` }} />
              </div>
            ))}
          </div>

          {/* Radar circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {[60, 40, 20].map((size) => (
              <div
                key={size}
                className="absolute rounded-full border border-axo-cyan/20"
                style={{
                  width: `${size * 2.8}px`,
                  height: `${size * 2.8}px`,
                  top: `${-size * 1.4}px`,
                  left: `${-size * 1.4}px`,
                }}
              />
            ))}
            {/* Center dot (driver) */}
            <div className="relative z-10 w-4 h-4 rounded-full bg-axo-cyan shadow-axo-glow-sm">
              <div className="absolute inset-0 rounded-full bg-axo-cyan animate-ping opacity-30" />
            </div>
          </div>

          {/* Service dots */}
          {radarDots.map((dot) => (
            <div
              key={dot.id}
              className="absolute flex flex-col items-center gap-0.5"
              style={{ left: `${dot.x}%`, top: `${dot.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <div className="relative">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    dot.type === "delivery"
                      ? "bg-axo-emerald"
                      : "bg-purple-400"
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-0 rounded-full animate-ping-slow opacity-40",
                    dot.type === "delivery" ? "bg-axo-emerald" : "bg-purple-400"
                  )}
                />
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-2 left-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-axo-cyan" />
              <span className="text-[10px] text-axo-muted">Tú</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-axo-emerald" />
              <span className="text-[10px] text-axo-muted">Entrega</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-[10px] text-axo-muted">Pasajero</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex bg-axo-bg-card rounded-xl p-1 border border-axo-border">
        <button
          onClick={() => setTab("entregas")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
            tab === "entregas"
              ? "bg-axo-emerald/10 text-axo-emerald border border-axo-emerald/30"
              : "text-axo-muted hover:text-axo-text"
          )}
        >
          <Package size={14} />
          Entregas ({pendingOrders.length})
        </button>
        <button
          onClick={() => setTab("viajes")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
            tab === "viajes"
              ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
              : "text-axo-muted hover:text-axo-text"
          )}
        >
          <Car size={14} />
          Viajes ({rides.length})
        </button>
      </div>

      {/* Active delivery in progress */}
      {activeOrders.length > 0 && (
        <div className="axo-card border-axo-cyan/20 bg-axo-cyan/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Truck size={16} className="text-axo-cyan" />
            <p className="text-sm font-bold text-axo-cyan">En camino ahora</p>
          </div>
          {activeOrders.map((order) => (
            <div key={order.id} className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-axo-text">{order.customerName}</p>
                <p className="text-xs text-axo-muted">{order.destination}</p>
                <p className="text-xs text-axo-muted">{order.productName}</p>
              </div>
              <p className="text-axo-emerald font-bold text-sm">{formatARS(order.earningsARS)}</p>
            </div>
          ))}
        </div>
      )}

      {/* ENTREGAS tab */}
      {tab === "entregas" && (
        <div className="flex flex-col gap-3">
          {pendingOrders.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 size={32} className="text-axo-emerald mx-auto mb-3" />
              <p className="text-axo-muted text-sm">No hay entregas pendientes en la zona.</p>
              <p className="text-axo-muted text-xs mt-1">¡Excelente trabajo! Sigue así. 🎉</p>
            </div>
          ) : (
            pendingOrders.map((order) => {
              const isAccepted = accepted.includes(order.id);
              return (
                <div
                  key={order.id}
                  className={cn(
                    "axo-card p-4 transition-all",
                    isAccepted && "border-axo-emerald/40 bg-axo-emerald/5"
                  )}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl flex-shrink-0">📦</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-axo-text text-sm">{order.customerName}</p>
                        <Badge
                          className={priorityColors[order.priority] as string}
                        >
                          {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-axo-muted truncate">{order.productName}</p>
                    </div>
                    <div className="flex items-center gap-1 text-axo-muted text-[10px] flex-shrink-0">
                      <Clock size={10} />
                      {order.timePosted}
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Navigation size={10} className="text-axo-cyan flex-shrink-0" />
                      <span className="text-axo-muted truncate">{order.origin}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Package size={10} className="text-axo-emerald flex-shrink-0" />
                      <span className="text-axo-muted truncate">{order.destination}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-axo-emerald font-black text-lg">
                        {formatARS(order.earningsARS)}
                      </p>
                      <p className="text-[10px] text-axo-muted">{order.distanceKm} km</p>
                    </div>
                    <button
                      onClick={() => handleAcceptOrder(order.id)}
                      disabled={isAccepted}
                      className={cn(
                        "text-sm font-bold py-2.5 px-5 rounded-xl transition-all",
                        isAccepted
                          ? "bg-axo-emerald/20 text-axo-emerald cursor-default flex items-center gap-2"
                          : "axo-btn-primary"
                      )}
                    >
                      {isAccepted ? (
                        <>
                          <CheckCircle2 size={14} />
                          Aceptado
                        </>
                      ) : (
                        "Aceptar Servicio"
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIAJES tab */}
      {tab === "viajes" && (
        <div className="flex flex-col gap-3">
          {rides.length === 0 ? (
            <div className="text-center py-12">
              <Star size={32} className="text-purple-400 mx-auto mb-3" />
              <p className="text-axo-muted text-sm">Sin solicitudes de viaje actualmente.</p>
            </div>
          ) : (
            rides.map((ride) => {
              const isAccepted = accepted.includes(ride.id);
              return (
                <div
                  key={ride.id}
                  className={cn(
                    "axo-card p-4 transition-all",
                    isAccepted && "border-purple-400/40 bg-purple-500/5"
                  )}
                >
                  {ride.special && (
                    <div className="mb-2">
                      <Badge variant="amber">{ride.special}</Badge>
                    </div>
                  )}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400 flex-shrink-0">
                      {ride.passengerName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-axo-text text-sm">{ride.passengerName}</p>
                      <div className="flex items-center gap-1 text-[10px] text-axo-muted">
                        <Clock size={9} />
                        {ride.timePosted}
                        <span className="mx-1">·</span>
                        {ride.rideType === "moto" ? (
                          <Bike size={9} />
                        ) : (
                          <Car size={9} />
                        )}
                        {ride.rideType}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3 pl-1">
                    <div className="flex items-center gap-2 text-xs">
                      <Navigation size={10} className="text-axo-cyan flex-shrink-0" />
                      <span className="text-axo-muted truncate">{ride.origin}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Package size={10} className="text-purple-400 flex-shrink-0" />
                      <span className="text-axo-muted truncate">{ride.destination}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-400 font-black text-lg">
                        {formatARS(ride.fareARS)}
                      </p>
                      <p className="text-[10px] text-axo-muted">{ride.distanceKm} km</p>
                    </div>
                    <button
                      onClick={() => handleAcceptRide(ride.id)}
                      disabled={isAccepted}
                      className={cn(
                        "text-sm font-bold py-2.5 px-5 rounded-xl transition-all",
                        isAccepted
                          ? "bg-purple-500/20 text-purple-400 cursor-default flex items-center gap-2"
                          : "bg-gradient-to-r from-purple-600 to-axo-cyan text-white hover:shadow-axo-glow active:scale-95"
                      )}
                    >
                      {isAccepted ? (
                        <>
                          <CheckCircle2 size={14} />
                          Aceptado
                        </>
                      ) : (
                        "Aceptar Viaje"
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
