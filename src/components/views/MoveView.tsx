"use client";

// ================================================================
//  AXO — MoveView (Light Design)
// ================================================================

import { useState } from "react";
import { MapPin, Navigation, Clock, ChevronRight, Star, Shield, Zap, Car } from "lucide-react";
import { rideOptions, formatARS, calcRideFare } from "@/lib/data";
import { cn } from "@/lib/utils";

type MoveStep = "select" | "confirm" | "searching" | "found";

const POPULAR_ROUTES = [
  { from: "Terminal de Ómnibus", to: "Centro Comercial", km: 2.8, emoji: "🚌→🏙️" },
  { from: "Aeropuerto Posadas", to: "Hotel Julio César", km: 4.5, emoji: "✈️→🏨" },
  { from: "Posadas Centro", to: "Puente Internacional", km: 6.2, emoji: "🏙️→🌉" },
  { from: "UNaM Campus", to: "Costanera Sur", km: 3.1, emoji: "🎓→🌊" },
];

export function MoveView() {
  const [step, setStep] = useState<MoveStep>("select");
  const [selected, setSelected] = useState(rideOptions[0]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [countdown, setCountdown] = useState(5);

  const estimatedKm = 3.2;
  const fare = calcRideFare(selected, estimatedKm);

  const startSearch = () => {
    setStep("searching");
    let c = 5;
    const t = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) { clearInterval(t); setStep("found"); }
    }, 900);
  };

  const reset = () => { setStep("select"); setCountdown(5); };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white border border-axo-border rounded-2xl p-5 shadow-axo-card">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-2xl">🚗</div>
          <div>
            <h2 className="text-xl font-black text-axo-text">AXO Move</h2>
            <p className="text-sm text-axo-muted">Movilidad urbana · Posadas y corredor fronterizo</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-axo-emerald font-semibold bg-axo-emerald-light px-3 py-1.5 rounded-full border border-axo-emerald/20">
            <div className="w-1.5 h-1.5 rounded-full bg-axo-emerald animate-pulse" />
            {rideOptions.length} conductores cerca
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Booking form */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Step: Select vehicle */}
          {step === "select" && (
            <>
              {/* Route inputs */}
              <div className="bg-white border border-axo-border rounded-2xl p-5 shadow-axo-card flex flex-col gap-3">
                <h3 className="font-bold text-axo-text text-sm">¿A dónde vas?</h3>
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Navigation size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-axo-cyan" />
                    <input
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="axo-input pl-11"
                      placeholder="Punto de partida..."
                    />
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <div className="flex flex-col gap-0.5">
                      <div className="w-0.5 h-1.5 bg-axo-border rounded-full mx-auto" />
                      <div className="w-0.5 h-1.5 bg-axo-border rounded-full mx-auto" />
                    </div>
                  </div>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-axo-emerald" />
                    <input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="axo-input pl-11"
                      placeholder="Destino..."
                    />
                  </div>
                </div>

                {/* Quick routes */}
                <div>
                  <p className="text-[10px] font-semibold text-axo-muted uppercase tracking-wider mb-2">Rutas frecuentes</p>
                  <div className="flex flex-col gap-1.5">
                    {POPULAR_ROUTES.map((r) => (
                      <button
                        key={r.from}
                        onClick={() => { setOrigin(r.from); setDestination(r.to); }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-axo-bg transition-colors text-left border border-transparent hover:border-axo-border"
                      >
                        <span className="text-base flex-shrink-0">{r.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-axo-text truncate">
                            {r.from} → {r.to}
                          </p>
                          <p className="text-[10px] text-axo-muted">{r.km} km aprox.</p>
                        </div>
                        <ChevronRight size={13} className="text-axo-muted flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vehicle selector */}
              <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card overflow-hidden">
                <div className="px-5 py-4 border-b border-axo-border">
                  <h3 className="font-bold text-axo-text text-sm">Elegí tu servicio</h3>
                  <p className="text-xs text-axo-muted">Distancia estimada: {estimatedKm} km</p>
                </div>
                <div className="divide-y divide-axo-border">
                  {rideOptions.map((opt) => {
                    const optFare = calcRideFare(opt, estimatedKm);
                    const isSelected = selected.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelected(opt)}
                        className={cn(
                          "w-full flex items-center gap-4 px-5 py-4 text-left transition-all",
                          isSelected
                            ? "bg-purple-50 border-l-4 border-l-purple-500"
                            : "hover:bg-axo-bg border-l-4 border-l-transparent"
                        )}
                      >
                        <span className="text-3xl flex-shrink-0">{opt.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={cn("font-bold text-sm", isSelected ? "text-purple-700" : "text-axo-text")}>
                              {opt.name}
                            </p>
                            {opt.popular && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Popular</span>
                            )}
                            {opt.tags.map((tag) => (
                              <span key={tag} className="text-[10px] text-axo-muted bg-axo-bg border border-axo-border px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-axo-muted mt-0.5">{opt.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={cn("text-xl font-black", isSelected ? "text-purple-700" : "text-axo-text")}>
                            {formatARS(optFare)}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] text-axo-muted justify-end mt-0.5">
                            <Clock size={10} />
                            {opt.etaMinutes} min
                          </div>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                          isSelected ? "border-purple-500 bg-purple-500" : "border-axo-border"
                        )}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-white border border-axo-border rounded-2xl p-4 shadow-axo-card flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-axo-muted">Tarifa estimada</p>
                  <p className="text-3xl font-black text-axo-text">{formatARS(fare)}</p>
                  <div className="flex items-center gap-1 text-xs text-axo-muted mt-0.5">
                    <Shield size={11} className="text-axo-emerald" />
                    Precio final · sin sorpresas
                  </div>
                </div>
                <button
                  onClick={() => origin && destination ? startSearch() : setStep("confirm")}
                  className="bg-gradient-to-r from-purple-600 to-axo-cyan text-white font-bold text-sm py-3.5 px-8 rounded-xl hover:shadow-md active:scale-95 transition-all"
                >
                  {selected.icon} Solicitar viaje
                </button>
              </div>
            </>
          )}

          {/* Step: Searching */}
          {step === "searching" && (
            <div className="bg-white border border-axo-border rounded-2xl p-10 shadow-axo-card flex flex-col items-center gap-6 text-center animate-fade-in">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-purple-100 animate-ping-slow" />
                <div className="absolute inset-2 rounded-full border-4 border-purple-200 animate-ping-slow" style={{ animationDelay: "0.4s" }} />
                <div className="w-20 h-20 rounded-full bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-3xl">
                  {selected.icon}
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-axo-text">Buscando conductor...</p>
                <p className="text-sm text-axo-muted mt-1">Conectando con los mejores conductores de Posadas</p>
              </div>
              <div className="text-6xl font-black text-purple-600">{countdown}</div>
              <button onClick={reset} className="axo-btn-secondary text-sm">Cancelar</button>
            </div>
          )}

          {/* Step: Driver found */}
          {step === "found" && (
            <div className="flex flex-col gap-4 animate-slide-up">
              <div className="bg-axo-emerald-light border border-axo-emerald/30 rounded-2xl px-5 py-4 flex items-center gap-3">
                <Zap size={18} className="text-axo-emerald flex-shrink-0" />
                <div>
                  <p className="font-bold text-axo-emerald text-sm">¡Conductor encontrado!</p>
                  <p className="text-xs text-axo-emerald/70">Alejandro llega en {selected.etaMinutes} min</p>
                </div>
              </div>

              <div className="bg-white border border-axo-border rounded-2xl p-5 shadow-axo-card">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-axo-cyan flex items-center justify-center text-3xl font-black text-white flex-shrink-0">
                    A
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-black text-axo-text">Alejandro G.</p>
                    <p className="text-sm text-axo-muted">Toyota Etios · Negro · AE 742 XH</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-xs font-bold text-axo-text ml-1">4.9</span>
                      </div>
                      <span className="text-xs text-axo-muted">1.284 viajes</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-purple-700">{formatARS(fare)}</p>
                    <p className="text-xs text-axo-muted">{estimatedKm} km · {selected.etaMinutes} min</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { icon: "🔒", label: "Viaje seguro" },
                    { icon: "💬", label: "Chat con conductor" },
                    { icon: "📍", label: "GPS en vivo" },
                  ].map((f) => (
                    <div key={f.label} className="bg-axo-bg border border-axo-border rounded-xl p-2.5 text-center">
                      <span className="text-lg">{f.icon}</span>
                      <p className="text-[10px] text-axo-muted mt-1">{f.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={reset} className="axo-btn-secondary flex-1 text-sm py-3 hover:text-red-600 hover:border-red-300">
                  Cancelar viaje
                </button>
                <button className="bg-gradient-to-r from-purple-600 to-axo-cyan text-white font-bold text-sm flex-1 py-3 rounded-xl hover:shadow-md active:scale-95 transition-all">
                  ✓ Confirmar viaje
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Map area */}
        <div className="flex flex-col gap-4">
          {/* Simulated map */}
          <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card overflow-hidden">
            <div className="px-4 py-3 border-b border-axo-border flex items-center justify-between">
              <p className="text-sm font-bold text-axo-text">Mapa · Posadas</p>
              <div className="flex items-center gap-1.5 text-[10px] text-axo-emerald font-semibold">
                <div className="w-1.5 h-1.5 rounded-full bg-axo-emerald animate-pulse" />
                En vivo
              </div>
            </div>
            <div
              className="h-64 relative bg-[#E8EEF4] flex items-center justify-center overflow-hidden"
            >
              {/* Map grid */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="absolute top-0 bottom-0 bg-white/50" style={{ left: `${(i + 1) * 16.6}%`, width: "2px" }} />
                  <div className="absolute left-0 right-0 bg-white/50" style={{ top: `${(i + 1) * 16.6}%`, height: "2px" }} />
                </div>
              ))}
              {/* Conductores dots */}
              {[
                { x: 30, y: 40 }, { x: 55, y: 25 }, { x: 70, y: 55 },
                { x: 20, y: 65 }, { x: 80, y: 35 },
              ].map((dot, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: `${dot.x}%`, top: `${dot.y}%`, transform: "translate(-50%,-50%)" }}
                >
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-white border-2 border-purple-400 flex items-center justify-center text-sm shadow-sm">
                      🚗
                    </div>
                    {i === 0 && (
                      <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping-slow opacity-40" />
                    )}
                  </div>
                </div>
              ))}
              {/* Center label */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-axo-border rounded-xl px-3 py-2 shadow-sm">
                <p className="text-[10px] font-bold text-axo-text">Posadas, Misiones</p>
                <p className="text-[9px] text-axo-muted">5 conductores disponibles</p>
              </div>
              {/* User location */}
              <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-axo-cyan border-2 border-white shadow-md" />
                  <div className="absolute inset-0 rounded-full bg-axo-cyan animate-ping opacity-30" />
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card p-4 flex flex-col gap-3">
            <p className="text-sm font-bold text-axo-text">¿Por qué AXO Move?</p>
            {[
              { icon: "🔒", title: "100% seguro", desc: "Conductores verificados y GPS en tiempo real" },
              { icon: "💳", title: "Sin efectivo", desc: "Pagá con tarjeta o saldo AXO" },
              { icon: "🌉", title: "Al puente y más", desc: "Traslados al corredor fronterizo" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{f.icon}</span>
                <div>
                  <p className="text-xs font-bold text-axo-text">{f.title}</p>
                  <p className="text-[10px] text-axo-muted">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
