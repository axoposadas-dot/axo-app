"use client";

// ================================================================
//  AXO — Caso 3: Movilidad Urbana AXO Move + GPS Simulado
// ================================================================

import { useState, useEffect, useRef } from "react";
import {
  MapPin, Navigation, Car, Clock, CheckCircle2, Phone,
  Star, Bike, Zap, User,
} from "lucide-react";
import { rideOptions, formatARS, calcRideFare } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// Posadas GPS waypoints — simulated route
const POSADAS_ROUTE = [
  { x: 22, y: 72, name: "Terminal de Ómnibus" },
  { x: 28, y: 66, name: "" },
  { x: 35, y: 60, name: "" },
  { x: 42, y: 54, name: "Centro" },
  { x: 50, y: 49, name: "" },
  { x: 57, y: 43, name: "" },
  { x: 63, y: 38, name: "" },
  { x: 69, y: 33, name: "" },
  { x: 75, y: 28, name: "Hotel Julio César" },
];

const POI_MARKERS = [
  { x: 22, y: 72, icon: "🚌", label: "Terminal" },
  { x: 50, y: 49, icon: "⭐", label: "Centro" },
  { x: 80, y: 20, icon: "🛒", label: "Shopping" },
  { x: 15, y: 35, icon: "🎓", label: "UNaM" },
  { x: 65, y: 70, icon: "🏥", label: "Hospital" },
  { x: 75, y: 28, icon: "🏨", label: "Hotel" },
];

type TripPhase = "idle" | "searching" | "driver_found" | "in_progress" | "arrived";

const DRIVER_MOCK = {
  nombre: "Alejandro G.",
  vehiculo: "Toyota Etios — Negro",
  patente: "AE 742 XH",
  calificacion: 4.9,
  viajes: 1284,
  foto: "A",
};

export function Caso3View() {
  const [selectedRide, setSelectedRide] = useState(rideOptions[0]);
  const [origin, setOrigin] = useState("Terminal de Ómnibus, Posadas");
  const [destination, setDestination] = useState("Hotel Julio César, Centro");
  const [phase, setPhase] = useState<TripPhase>("idle");
  const [gpsStep, setGpsStep] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const estimatedKm = 3.2;
  const fare = calcRideFare(selectedRide, estimatedKm);
  const currentPos = POSADAS_ROUTE[gpsStep];

  // GPS animation during trip
  useEffect(() => {
    if (phase !== "in_progress") return;
    if (gpsStep >= POSADAS_ROUTE.length - 1) {
      setTimeout(() => setPhase("arrived"), 800);
      return;
    }
    timerRef.current = setInterval(() => {
      setGpsStep((s) => {
        const next = s + 1;
        if (next >= POSADAS_ROUTE.length - 1) {
          if (timerRef.current) clearInterval(timerRef.current);
        }
        return next;
      });
    }, 1600);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, gpsStep]);

  const startTrip = () => {
    setPhase("searching");
    setGpsStep(0);
    let c = 4;
    const t = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(t);
        setPhase("driver_found");
        setCountdown(4);
      }
    }, 900);
  };

  const confirmTrip = () => {
    setPhase("in_progress");
  };

  const reset = () => {
    setPhase("idle");
    setGpsStep(0);
    setCountdown(4);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const progressPct = Math.round((gpsStep / (POSADAS_ROUTE.length - 1)) * 100);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="axo-card-glow border border-purple-500/20 p-5 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">🚗</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-xl font-black text-axo-text">Movilidad Urbana AXO Move</h2>
              <Badge variant="purple">Caso 3</Badge>
            </div>
            <p className="text-sm text-axo-muted">
              Solicitá un viaje dentro de Posadas, seguí al conductor en{" "}
              <strong className="text-purple-400">tiempo real con GPS</strong>, confirmá y
              disfrutá del traslado. Incluye opción al{" "}
              <strong className="text-axo-cyan">Puente Internacional</strong>.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <div className="flex flex-col gap-4">

          {/* Vehicle selection */}
          {phase === "idle" && (
            <>
              <div>
                <p className="text-xs font-semibold text-axo-muted uppercase tracking-wider mb-3">
                  Tipo de servicio
                </p>
                <div className="flex flex-col gap-2">
                  {rideOptions.slice(0, 4).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedRide(opt)}
                      className={cn(
                        "axo-card p-3 flex items-center gap-3 text-left transition-all",
                        selectedRide.id === opt.id
                          ? "border-purple-400/50 bg-purple-500/5"
                          : "hover:border-axo-muted"
                      )}
                    >
                      <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-axo-text">{opt.name}</p>
                          {opt.popular && <Badge variant="amber">Popular</Badge>}
                        </div>
                        <p className="text-[10px] text-axo-muted truncate">{opt.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-purple-400">
                          {formatARS(calcRideFare(opt, estimatedKm))}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-axo-muted justify-end">
                          <Clock size={9} />
                          {opt.etaMinutes} min
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Route inputs */}
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Navigation size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="axo-input pl-10 text-sm"
                    placeholder="Origen..."
                  />
                </div>
                <div className="w-px h-3 bg-axo-border ml-3.5" />
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-axo-cyan" />
                  <input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="axo-input pl-10 text-sm"
                    placeholder="Destino..."
                  />
                </div>
              </div>

              {/* Fare summary */}
              <div className="axo-card-glow p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-axo-muted">Tarifa estimada · {estimatedKm} km</p>
                  <p className="text-3xl font-black text-purple-400">{formatARS(fare)}</p>
                </div>
                <button
                  onClick={startTrip}
                  disabled={!origin || !destination}
                  className="bg-gradient-to-r from-purple-600 to-axo-cyan text-white font-bold text-sm py-3 px-6 rounded-xl hover:shadow-[0_0_20px_#A855F730] active:scale-95 transition-all disabled:opacity-40"
                >
                  {selectedRide.icon} Solicitar
                </button>
              </div>
            </>
          )}

          {/* Searching */}
          {phase === "searching" && (
            <div className="axo-card p-6 flex flex-col items-center gap-4 text-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-purple-400/20 animate-ping-slow" />
                <div className="absolute inset-2 rounded-full border-2 border-purple-400/40 animate-ping-slow" style={{ animationDelay: "0.4s" }} />
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-2xl">
                  {selectedRide.icon}
                </div>
              </div>
              <div>
                <p className="font-bold text-axo-text">Buscando conductor...</p>
                <p className="text-xs text-axo-muted">Conectando con conductores cercanos</p>
              </div>
              <div className="text-5xl font-black text-purple-400">{countdown}</div>
              <button onClick={reset} className="axo-btn-secondary text-xs py-2 px-6 hover:text-red-400 hover:border-red-500/30">
                Cancelar
              </button>
            </div>
          )}

          {/* Driver found */}
          {phase === "driver_found" && (
            <div className="flex flex-col gap-3 animate-slide-up">
              <div className="axo-card-glow border border-purple-500/30 p-4">
                <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap size={10} /> Conductor encontrado
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-axo-cyan flex items-center justify-center text-2xl font-black text-white flex-shrink-0">
                    {DRIVER_MOCK.foto}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-axo-text text-base">{DRIVER_MOCK.nombre}</p>
                    <p className="text-xs text-axo-muted">{DRIVER_MOCK.vehiculo}</p>
                    <p className="text-xs text-axo-muted font-mono">{DRIVER_MOCK.patente}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400">
                          {DRIVER_MOCK.calificacion}
                        </span>
                      </div>
                      <span className="text-[10px] text-axo-muted">
                        {DRIVER_MOCK.viajes.toLocaleString()} viajes
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button className="p-2.5 rounded-xl bg-axo-emerald/10 border border-axo-emerald/30 hover:bg-axo-emerald/20 transition-all">
                      <Phone size={16} className="text-axo-emerald" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-axo-cyan/10 border border-axo-cyan/30 hover:bg-axo-cyan/20 transition-all">
                      <Bike size={16} className="text-axo-cyan" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="axo-card p-3 flex items-center justify-between">
                <div className="text-xs text-axo-muted">
                  ETA: <span className="text-purple-400 font-bold">{selectedRide.etaMinutes} min</span>
                </div>
                <div className="text-xs text-axo-muted">
                  Tarifa: <span className="text-axo-text font-bold">{formatARS(fare)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Car size={12} className="text-axo-muted" />
                  <span className="text-axo-muted">Aprox. {estimatedKm} km</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={reset} className="axo-btn-secondary flex-1 text-sm py-3 hover:text-red-400 hover:border-red-500/30">
                  Cancelar
                </button>
                <button
                  onClick={confirmTrip}
                  className="bg-gradient-to-r from-purple-600 to-axo-cyan text-white font-bold text-sm py-3 flex-1 rounded-xl hover:shadow-[0_0_20px_#A855F730] active:scale-95 transition-all"
                >
                  ✓ Confirmar viaje
                </button>
              </div>
            </div>
          )}

          {/* In progress */}
          {phase === "in_progress" && (
            <div className="axo-card-glow border border-purple-500/20 p-4 flex flex-col gap-4 animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-axo-cyan flex items-center justify-center text-base font-black text-white">
                    A
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-purple-400 border-2 border-axo-bg flex items-center justify-center">
                    <Car size={7} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-axo-text">{DRIVER_MOCK.nombre}</p>
                  <p className="text-[10px] text-axo-muted">{DRIVER_MOCK.vehiculo} · {DRIVER_MOCK.patente}</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-[10px] text-purple-400 font-semibold">En ruta</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-axo-muted mb-1.5">
                  <span>📍 {origin.split(",")[0]}</span>
                  <span>🏁 {destination.split(",")[0]}</span>
                </div>
                <div className="h-2 bg-axo-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-axo-cyan transition-all duration-1600"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] mt-1">
                  <span className="text-purple-400 font-semibold">{progressPct}%</span>
                  <span className="text-axo-muted">
                    ~{Math.max(0, Math.round((POSADAS_ROUTE.length - 1 - gpsStep) * 0.5))} min restantes
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 bg-axo-bg rounded-xl border border-axo-border p-2.5 text-center">
                  <p className="text-xs font-bold text-axo-text">{formatARS(fare)}</p>
                  <p className="text-[10px] text-axo-muted">Tarifa</p>
                </div>
                <div className="flex-1 bg-axo-bg rounded-xl border border-axo-border p-2.5 text-center">
                  <p className="text-xs font-bold text-purple-400">{estimatedKm} km</p>
                  <p className="text-[10px] text-axo-muted">Distancia</p>
                </div>
              </div>
            </div>
          )}

          {/* Arrived */}
          {phase === "arrived" && (
            <div className="axo-card-glow border border-axo-emerald/30 p-6 flex flex-col items-center gap-4 text-center animate-slide-up">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-axo-emerald/10 border-2 border-axo-emerald/40 flex items-center justify-center text-3xl">
                  🏁
                </div>
                <div className="absolute inset-0 rounded-full bg-axo-emerald/10 animate-ping-slow" />
              </div>
              <div>
                <p className="text-xl font-black text-axo-emerald">¡Llegaste!</p>
                <p className="text-sm text-axo-muted mt-1">{destination}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="axo-card p-3 text-center">
                  <p className="text-lg font-black text-axo-cyan">{formatARS(fare)}</p>
                  <p className="text-[10px] text-axo-muted">Total viaje</p>
                </div>
                <div className="axo-card p-3 text-center">
                  <p className="text-lg font-black text-amber-400">
                    {"⭐".repeat(5)}
                  </p>
                  <p className="text-[10px] text-axo-muted">Calificá a {DRIVER_MOCK.nombre.split(" ")[0]}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full">
                {[5, 4, 3].map((stars) => (
                  <button
                    key={stars}
                    className="flex-1 axo-btn-secondary text-xs py-2"
                    onClick={reset}
                  >
                    {"⭐".repeat(stars)}
                  </button>
                ))}
              </div>
              <button onClick={reset} className="text-axo-muted text-xs hover:text-axo-text">
                Omitir → Nuevo viaje
              </button>
            </div>
          )}
        </div>

        {/* Right: GPS Map */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-axo-text">Rastreo GPS</h3>
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "w-2 h-2 rounded-full transition-all",
                phase === "in_progress" ? "bg-purple-400 animate-pulse" : "bg-axo-border"
              )} />
              <span className="text-[10px] text-axo-muted">
                {phase === "in_progress" ? "Rastreando..." : "Esperando viaje"}
              </span>
            </div>
          </div>

          {/* Map */}
          <div className="relative rounded-2xl overflow-hidden border border-purple-500/20 h-96 bg-[#0A1428]">
            {/* Grid */}
            <div className="absolute inset-0 opacity-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="absolute top-0 bottom-0 border-l border-purple-400" style={{ left: `${(i + 1) * 12.5}%` }} />
                  <div className="absolute left-0 right-0 border-t border-purple-400" style={{ top: `${(i + 1) * 12.5}%` }} />
                </div>
              ))}
            </div>

            {/* Streets */}
            {[
              { dir: "h", pos: "45%" }, { dir: "h", pos: "65%" }, { dir: "h", pos: "25%" },
              { dir: "v", pos: "30%" }, { dir: "v", pos: "55%" }, { dir: "v", pos: "75%" },
            ].map((st, i) => (
              <div
                key={i}
                className="absolute bg-[#1a2a4a] opacity-70"
                style={
                  st.dir === "h"
                    ? { top: st.pos, left: 0, right: 0, height: "3px" }
                    : { left: st.pos, top: 0, bottom: 0, width: "3px" }
                }
              />
            ))}

            {/* SVG route */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Full route dim */}
              {POSADAS_ROUTE.map((pt, i) => {
                if (i === 0) return null;
                const prev = POSADAS_ROUTE[i - 1];
                return (
                  <line key={`r-${i}`}
                    x1={`${prev.x}%`} y1={`${prev.y}%`}
                    x2={`${pt.x}%`} y2={`${pt.y}%`}
                    stroke="#A855F7" strokeWidth="2" opacity="0.15"
                  />
                );
              })}
              {/* Travelled route */}
              {POSADAS_ROUTE.slice(0, gpsStep + 1).map((pt, i) => {
                if (i === 0) return null;
                const prev = POSADAS_ROUTE[i - 1];
                return (
                  <line key={`t-${i}`}
                    x1={`${prev.x}%`} y1={`${prev.y}%`}
                    x2={`${pt.x}%`} y2={`${pt.y}%`}
                    stroke="#A855F7" strokeWidth="3" opacity="0.9"
                    strokeDasharray="8,4"
                  />
                );
              })}
            </svg>

            {/* POI markers */}
            {POI_MARKERS.map((poi) => (
              <div
                key={poi.label}
                className="absolute flex flex-col items-center gap-0.5"
                style={{ left: `${poi.x}%`, top: `${poi.y}%`, transform: "translate(-50%,-50%)" }}
              >
                <div className="bg-[#0A1428]/80 border border-axo-border rounded-lg px-1.5 py-0.5 flex items-center gap-1">
                  <span className="text-xs">{poi.icon}</span>
                  <span className="text-[9px] text-axo-muted">{poi.label}</span>
                </div>
              </div>
            ))}

            {/* Origin */}
            <div
              className="absolute"
              style={{
                left: `${POSADAS_ROUTE[0].x}%`,
                top: `${POSADAS_ROUTE[0].y}%`,
                transform: "translate(-50%,-50%)",
              }}
            >
              <div className="w-4 h-4 rounded-full bg-axo-cyan border-2 border-[#0A1428] shadow-axo-glow-sm" />
            </div>

            {/* Destination */}
            <div
              className="absolute"
              style={{
                left: `${POSADAS_ROUTE[POSADAS_ROUTE.length - 1].x}%`,
                top: `${POSADAS_ROUTE[POSADAS_ROUTE.length - 1].y}%`,
                transform: "translate(-50%,-100%)",
              }}
            >
              <MapPin
                size={20}
                className={phase === "arrived" ? "text-axo-emerald" : "text-red-500"}
              />
            </div>

            {/* Driver marker */}
            {(phase === "in_progress" || phase === "arrived") && (
              <div
                className="absolute transition-all duration-1600 ease-linear"
                style={{
                  left: `${currentPos.x}%`,
                  top: `${currentPos.y}%`,
                  transform: "translate(-50%,-50%)",
                }}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center shadow-[0_0_15px_#A855F7]">
                    <User size={13} className="text-white" />
                  </div>
                  {phase === "in_progress" && (
                    <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-30" />
                  )}
                </div>
              </div>
            )}

            {/* Label */}
            <div className="absolute top-3 left-3">
              <div className="bg-[#0A1428]/90 border border-purple-500/30 rounded-xl px-3 py-2">
                <p className="text-[10px] text-purple-400 font-bold">Posadas · Misiones</p>
                <p className="text-[9px] text-axo-muted">Mapa simulado AXO</p>
              </div>
            </div>

            {/* Zoom */}
            <div className="absolute top-3 right-3 flex flex-col gap-1">
              <button className="w-7 h-7 bg-[#0A1428] border border-axo-border rounded-lg text-axo-muted text-xs flex items-center justify-center hover:text-axo-text">+</button>
              <button className="w-7 h-7 bg-[#0A1428] border border-axo-border rounded-lg text-axo-muted text-xs flex items-center justify-center hover:text-axo-text">−</button>
            </div>

            {/* Idle overlay */}
            {phase === "idle" && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0A1428]/60">
                <div className="text-center">
                  <MapPin size={32} className="text-purple-400 mx-auto mb-2 opacity-40" />
                  <p className="text-axo-muted text-sm">Solicitá un viaje para activar el GPS</p>
                </div>
              </div>
            )}

            {/* Arrived overlay */}
            {phase === "arrived" && (
              <div className="absolute inset-0 flex items-center justify-center bg-axo-emerald/10">
                <div className="text-center">
                  <CheckCircle2 size={40} className="text-axo-emerald mx-auto mb-2" />
                  <p className="text-axo-emerald font-bold text-sm">Destino alcanzado</p>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 flex-wrap text-[10px] text-axo-muted">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-axo-cyan" />
              <span>Origen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Conductor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Destino</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
