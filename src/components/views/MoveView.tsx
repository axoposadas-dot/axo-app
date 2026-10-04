"use client";

import { useState } from "react";
import { MapPin, Navigation, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { rideOptions, formatARS, calcRideFare, type RideOption } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type TripStep = "select" | "details" | "confirm" | "searching";

const popularRoutes = [
  { from: "Mi ubicación actual", to: "Terminal de Ómnibus" },
  { from: "Centro", to: "Puente Internacional (Encarnación)" },
  { from: "UNaM", to: "Shopping del Sol" },
  { from: "Aeropuerto", to: "Centro Posadas" },
];

export function MoveView() {
  const [step, setStep] = useState<TripStep>("select");
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [estimatedKm] = useState(3.5);
  const [countdown, setCountdown] = useState(5);

  const estimatedFare = selectedRide
    ? calcRideFare(selectedRide, estimatedKm)
    : 0;

  const handleConfirm = () => {
    setStep("searching");
    let c = 5;
    const timer = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(timer);
        setStep("select");
        setSelectedRide(null);
        setOrigin("");
        setDestination("");
        setCountdown(5);
      }
    }, 1000);
  };

  const fillRoute = (route: typeof popularRoutes[0]) => {
    setOrigin(route.from);
    setDestination(route.to);
    setStep("details");
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-axo-text">AXO Move</h2>
        <p className="text-xs text-axo-muted">Traslados urbanos y regionales — Posadas & Encarnación</p>
      </div>

      {/* Searching overlay */}
      {step === "searching" && (
        <div className="axo-card-glow p-8 flex flex-col items-center gap-4 text-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-axo-cyan/30 animate-ping-slow" />
            <div className="absolute inset-2 rounded-full border-2 border-axo-cyan/50 animate-ping-slow" style={{ animationDelay: "0.4s" }} />
            <div className="w-20 h-20 rounded-full bg-axo-cyan/10 flex items-center justify-center text-3xl">
              {selectedRide?.icon}
            </div>
          </div>
          <div>
            <p className="font-bold text-axo-text text-lg">Buscando conductor...</p>
            <p className="text-axo-muted text-sm">
              {selectedRide?.name} · {formatARS(estimatedFare)}
            </p>
          </div>
          <div className="axo-card px-8 py-4 text-center">
            <p className="text-4xl font-black text-axo-cyan">{countdown}</p>
            <p className="text-xs text-axo-muted">Demo: regresando en {countdown}s</p>
          </div>
          <button
            onClick={() => setStep("select")}
            className="axo-btn-secondary text-sm py-2 px-6 text-axo-red border-red-500/30 hover:border-red-500/60 hover:text-red-400"
          >
            Cancelar viaje
          </button>
        </div>
      )}

      {/* Step: Select ride type */}
      {step === "select" && (
        <>
          {/* Popular routes */}
          <div>
            <p className="text-xs font-semibold text-axo-muted uppercase tracking-wider mb-3">
              Rutas frecuentes
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {popularRoutes.map((route, i) => (
                <button
                  key={i}
                  onClick={() => fillRoute(route)}
                  className="axo-card p-3 text-left hover:border-axo-cyan/30 transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs text-axo-muted group-hover:text-axo-text">
                    <Navigation size={12} className="text-axo-cyan" />
                    <span className="truncate">{route.from}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-axo-text mt-1">
                    <MapPin size={12} className="text-axo-emerald" />
                    <span className="truncate">{route.to}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle options */}
          <div>
            <p className="text-xs font-semibold text-axo-muted uppercase tracking-wider mb-3">
              Elige tu servicio
            </p>
            <div className="flex flex-col gap-3">
              {rideOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedRide(opt);
                    setStep("details");
                  }}
                  className={cn(
                    "axo-card p-4 flex items-center gap-4 text-left transition-all",
                    "hover:border-axo-cyan/30 hover:shadow-axo-glow-sm",
                    selectedRide?.id === opt.id && "border-axo-cyan/50 bg-axo-cyan/5"
                  )}
                >
                  <div className="text-3xl w-12 h-12 bg-axo-bg rounded-xl flex items-center justify-center flex-shrink-0">
                    {opt.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-axo-text text-sm">{opt.name}</span>
                      {opt.popular && <Badge variant="amber">Popular</Badge>}
                    </div>
                    <p className="text-xs text-axo-muted">{opt.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {opt.tags.map((t) => (
                        <span key={t} className="text-[10px] text-axo-muted bg-axo-bg px-2 py-0.5 rounded-full border border-axo-border">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-axo-cyan">
                      {formatARS(opt.baseFareARS)}
                    </p>
                    <p className="text-[10px] text-axo-muted">base</p>
                    <div className="flex items-center gap-1 mt-2 text-axo-emerald justify-end">
                      <Clock size={10} />
                      <span className="text-[10px]">{opt.etaMinutes} min</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Step: Enter details */}
      {step === "details" && selectedRide && (
        <div className="flex flex-col gap-4 animate-slide-up">
          <button
            onClick={() => setStep("select")}
            className="text-axo-muted text-sm hover:text-axo-text flex items-center gap-1 w-fit"
          >
            ← Cambiar servicio
          </button>

          {/* Selected ride summary */}
          <div className="axo-card-glow p-4 flex items-center gap-3">
            <span className="text-2xl">{selectedRide.icon}</span>
            <div className="flex-1">
              <p className="font-bold text-axo-text text-sm">{selectedRide.name}</p>
              <p className="text-xs text-axo-muted">{selectedRide.description}</p>
            </div>
            <Badge variant="cyan">{selectedRide.etaMinutes} min</Badge>
          </div>

          {/* Origin & Destination inputs */}
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Navigation size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-axo-cyan" />
              <input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="¿Desde dónde?"
                className="axo-input pl-10"
              />
            </div>
            <div className="w-px h-4 bg-axo-border ml-3.5" />
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-axo-emerald" />
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="¿A dónde vas?"
                className="axo-input pl-10"
              />
            </div>
          </div>

          {/* Fare estimate */}
          <div className="axo-card-glow p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-axo-muted uppercase tracking-wider font-semibold">
                Estimación de tarifa
              </p>
              <Badge variant="default">{estimatedKm} km aprox.</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-axo-cyan">
                {formatARS(estimatedFare)}
              </span>
              <span className="text-axo-muted text-sm">ARS</span>
            </div>
            <p className="text-xs text-axo-muted mt-1">
              Tarifa base {formatARS(selectedRide.baseFareARS)} + {formatARS(selectedRide.perKmARS)}/km
            </p>
          </div>

          <button
            onClick={() => setStep("confirm")}
            disabled={!origin || !destination}
            className={cn(
              "axo-btn-primary py-3.5 text-sm font-bold",
              (!origin || !destination) && "opacity-40 cursor-not-allowed"
            )}
          >
            Ver confirmación →
          </button>
        </div>
      )}

      {/* Step: Confirm */}
      {step === "confirm" && selectedRide && (
        <div className="flex flex-col gap-4 animate-slide-up">
          <button
            onClick={() => setStep("details")}
            className="text-axo-muted text-sm hover:text-axo-text flex items-center gap-1 w-fit"
          >
            ← Editar viaje
          </button>

          <div className="axo-card-glow p-5 flex flex-col gap-4">
            <h3 className="font-bold text-axo-text">Confirmar viaje</h3>

            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <Navigation size={16} className="text-axo-cyan mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-axo-muted uppercase tracking-wider">Origen</p>
                  <p className="text-sm text-axo-text font-medium">{origin}</p>
                </div>
              </div>
              <div className="w-px h-3 bg-axo-border ml-2" />
              <div className="flex gap-3 items-start">
                <MapPin size={16} className="text-axo-emerald mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-axo-muted uppercase tracking-wider">Destino</p>
                  <p className="text-sm text-axo-text font-medium">{destination}</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-axo-border" />

            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-black text-axo-cyan">{formatARS(estimatedFare)}</p>
                <p className="text-[10px] text-axo-muted">Tarifa estimada</p>
              </div>
              <div>
                <p className="text-2xl font-black text-axo-emerald">{selectedRide.etaMinutes}</p>
                <p className="text-[10px] text-axo-muted">Min. espera</p>
              </div>
              <div>
                <p className="text-2xl font-black text-axo-text">{estimatedKm}</p>
                <p className="text-[10px] text-axo-muted">Km aprox.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-axo-muted axo-card p-3">
            <AlertCircle size={14} className="text-amber-400 flex-shrink-0" />
            La tarifa final puede variar según tráfico y ruta real del conductor.
          </div>

          <button
            onClick={handleConfirm}
            className="axo-btn-primary py-4 text-base font-bold flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} />
            Confirmar Viaje — {formatARS(estimatedFare)}
          </button>
        </div>
      )}
    </div>
  );
}
