"use client";

// ================================================================
//  AXO — PuenteMonitor
//  Widget de estado del tráfico en el Puente Internacional
//  Posadas (ARG) ↔ Encarnación (PY)
// ================================================================

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, AlertTriangle, Clock, Car, ChevronRight, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

type TrafficLevel = "libre" | "moderado" | "congestionado";

interface BridgeStatus {
  nivel: TrafficLevel;
  esperaMin: number;
  vehiculosEnCola: number;
  aduanaAbierta: boolean;
  ultimaActualizacion: string;
  tendencia: "mejorando" | "estable" | "empeorando";
  carrilAuto: TrafficLevel;
  carrilCamion: TrafficLevel;
  carrilPeatonal: TrafficLevel;
  alertas: string[];
}

const TRAFFIC_SCENARIOS: BridgeStatus[] = [
  {
    nivel: "libre",
    esperaMin: 8,
    vehiculosEnCola: 14,
    aduanaAbierta: true,
    ultimaActualizacion: "hace 1 min",
    tendencia: "estable",
    carrilAuto: "libre",
    carrilCamion: "moderado",
    carrilPeatonal: "libre",
    alertas: [],
  },
  {
    nivel: "moderado",
    esperaMin: 22,
    vehiculosEnCola: 47,
    aduanaAbierta: true,
    ultimaActualizacion: "hace 2 min",
    tendencia: "mejorando",
    carrilAuto: "moderado",
    carrilCamion: "moderado",
    carrilPeatonal: "libre",
    alertas: ["Control reforzado en carril camiones"],
  },
  {
    nivel: "congestionado",
    esperaMin: 55,
    vehiculosEnCola: 132,
    aduanaAbierta: true,
    ultimaActualizacion: "hace 30 seg",
    tendencia: "empeorando",
    carrilAuto: "congestionado",
    carrilCamion: "congestionado",
    carrilPeatonal: "moderado",
    alertas: ["Alto tráfico — hora pico", "Se recomienda esperar 30 min"],
  },
];

const levelConfig = {
  libre: {
    label: "Fluido",
    bg: "bg-axo-emerald",
    text: "text-axo-emerald",
    border: "border-axo-emerald/40",
    glow: "shadow-axo-emerald",
    bgLight: "bg-axo-emerald/10",
    dot: "bg-axo-emerald",
  },
  moderado: {
    label: "Moderado",
    bg: "bg-amber-400",
    text: "text-amber-400",
    border: "border-amber-400/40",
    glow: "shadow-[0_0_20px_#F59E0B30]",
    bgLight: "bg-amber-400/10",
    dot: "bg-amber-400",
  },
  congestionado: {
    label: "Congestionado",
    bg: "bg-red-500",
    text: "text-red-400",
    border: "border-red-500/40",
    glow: "shadow-[0_0_20px_#EF444430]",
    bgLight: "bg-red-500/10",
    dot: "bg-red-500",
  },
};

const tendenciaConfig = {
  mejorando: { emoji: "↗", text: "text-axo-emerald", label: "Mejorando" },
  estable: { emoji: "→", text: "text-axo-muted", label: "Estable" },
  empeorando: { emoji: "↘", text: "text-red-400", label: "Empeorando" },
};

interface PuenteMonitorProps {
  compact?: boolean;
}

export function PuenteMonitor({ compact = false }: PuenteMonitorProps) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [status, setStatus] = useState<BridgeStatus>(TRAFFIC_SCENARIOS[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  // Cycle through scenarios to simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setScenarioIdx((prev) => {
        const next = (prev + 1) % TRAFFIC_SCENARIOS.length;
        setStatus(TRAFFIC_SCENARIOS[next]);
        setPulseKey((k) => k + 1);
        return next;
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      const next = (scenarioIdx + 1) % TRAFFIC_SCENARIOS.length;
      setScenarioIdx(next);
      setStatus(TRAFFIC_SCENARIOS[next]);
      setPulseKey((k) => k + 1);
      setRefreshing(false);
    }, 1200);
  }, [scenarioIdx]);

  const cfg = levelConfig[status.nivel];
  const tend = tendenciaConfig[status.tendencia];

  if (compact) {
    return (
      <div
        className={cn(
          "axo-card p-3 flex items-center gap-3 cursor-pointer hover:border-axo-cyan/30 transition-all",
          cfg.border
        )}
      >
        <div className="relative flex-shrink-0">
          <div className={cn("w-3 h-3 rounded-full", cfg.dot)} key={pulseKey} />
          <div
            className={cn(
              "absolute inset-0 rounded-full animate-ping opacity-50",
              cfg.dot
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-axo-text">🌉 Puente Monitor</p>
          <p className={cn("text-[11px] font-semibold", cfg.text)}>
            {cfg.label} · {status.esperaMin} min espera
          </p>
        </div>
        <ChevronRight size={14} className="text-axo-muted flex-shrink-0" />
      </div>
    );
  }

  return (
    <div className={cn("axo-card-glow rounded-2xl overflow-hidden", cfg.border)}>
      {/* Header bar */}
      <div
        className={cn(
          "px-5 py-3 flex items-center justify-between border-b",
          cfg.bgLight,
          cfg.border
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🌉</span>
          <div>
            <p className="text-sm font-black text-axo-text leading-none">
              Puente Monitor
            </p>
            <p className="text-[10px] text-axo-muted leading-none mt-0.5">
              Posadas (ARG) ↔ Encarnación (PY)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] text-axo-muted">
            <Wifi size={10} className="text-axo-cyan" />
            <span>En vivo</span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg hover:bg-axo-bg transition-colors"
          >
            <RefreshCw
              size={13}
              className={cn("text-axo-muted", refreshing && "animate-spin")}
            />
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Main status indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Traffic light */}
            <div className="flex flex-col gap-1.5 bg-axo-bg rounded-xl p-2 border border-axo-border">
              {(["libre", "moderado", "congestionado"] as TrafficLevel[])
                .reverse()
                .map((lvl) => (
                  <div
                    key={lvl}
                    className={cn(
                      "w-4 h-4 rounded-full transition-all duration-500",
                      status.nivel === lvl
                        ? levelConfig[lvl].bg + " shadow-sm"
                        : "bg-axo-border opacity-30"
                    )}
                  />
                ))}
            </div>
            <div>
              <p
                className={cn(
                  "text-2xl font-black leading-none",
                  cfg.text
                )}
              >
                {cfg.label}
              </p>
              <p className="text-xs text-axo-muted mt-1">
                Actualizado {status.ultimaActualizacion}
              </p>
            </div>
          </div>

          {/* Wait time badge */}
          <div
            className={cn(
              "text-center rounded-xl px-4 py-3 border",
              cfg.bgLight,
              cfg.border
            )}
          >
            <p className={cn("text-3xl font-black", cfg.text)}>
              {status.esperaMin}
            </p>
            <p className="text-[10px] text-axo-muted font-medium">min espera</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-axo-bg rounded-xl p-3 border border-axo-border text-center">
            <Car size={14} className="text-axo-cyan mx-auto mb-1" />
            <p className="text-sm font-bold text-axo-text">{status.vehiculosEnCola}</p>
            <p className="text-[10px] text-axo-muted">en cola</p>
          </div>
          <div className="bg-axo-bg rounded-xl p-3 border border-axo-border text-center">
            <p className={cn("text-sm font-bold", tend.text)}>
              {tend.emoji} {tend.label}
            </p>
            <p className="text-[10px] text-axo-muted mt-1">tendencia</p>
          </div>
          <div className="bg-axo-bg rounded-xl p-3 border border-axo-border text-center">
            <div
              className={cn(
                "w-2 h-2 rounded-full mx-auto mb-1",
                status.aduanaAbierta ? "bg-axo-emerald" : "bg-red-500"
              )}
            />
            <p className="text-[10px] text-axo-muted">
              Aduana {status.aduanaAbierta ? "abierta" : "cerrada"}
            </p>
          </div>
        </div>

        {/* Lane-by-lane breakdown */}
        <div>
          <p className="text-[10px] text-axo-muted uppercase tracking-wider font-semibold mb-2">
            Estado por carril
          </p>
          <div className="flex flex-col gap-1.5">
            {[
              { key: status.carrilAuto, label: "🚗 Automóviles" },
              { key: status.carrilCamion, label: "🚛 Camiones / Carga" },
              { key: status.carrilPeatonal, label: "🚶 Peatones / Motos" },
            ].map(({ key, label }) => {
              const lc = levelConfig[key];
              const pct =
                key === "libre" ? 25 : key === "moderado" ? 60 : 95;
              return (
                <div key={label} className="flex items-center gap-3">
                  <p className="text-xs text-axo-muted w-36 flex-shrink-0">
                    {label}
                  </p>
                  <div className="flex-1 h-2 bg-axo-bg rounded-full overflow-hidden border border-axo-border">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        lc.bg
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className={cn("text-[10px] font-semibold w-20 text-right", lc.text)}>
                    {lc.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts */}
        {status.alertas.length > 0 && (
          <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-3 flex flex-col gap-1.5">
            {status.alertas.map((alerta, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <AlertTriangle size={12} className="text-amber-400 flex-shrink-0" />
                <span className="text-amber-300">{alerta}</span>
              </div>
            ))}
          </div>
        )}

        {/* AXO tip */}
        <div className="bg-axo-cyan/5 border border-axo-cyan/20 rounded-xl p-3 flex items-center gap-2">
          <Clock size={13} className="text-axo-cyan flex-shrink-0" />
          <p className="text-[11px] text-axo-muted">
            <span className="text-axo-cyan font-semibold">AXO recomienda</span>
            {status.nivel === "libre" && " · Momento ideal para cruzar al puente. ✅"}
            {status.nivel === "moderado" && " · Considera salir en ~20 min para mejor flujo."}
            {status.nivel === "congestionado" && " · Espera 30-40 min o usa el servicio Compras al Puente."}
          </p>
        </div>
      </div>
    </div>
  );
}
