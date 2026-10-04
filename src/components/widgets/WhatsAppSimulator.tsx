"use client";

// ================================================================
//  AXO — WhatsAppSimulator
//  Simulador visual de notificaciones WhatsApp + GPS en tiempo real
// ================================================================

import { useEffect, useState, useRef } from "react";
import { Phone, Check, CheckCheck, MapPin, Navigation, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatARS } from "@/lib/data";

// ── WhatsApp Messages ──────────────────────────────────────────
interface WaMessage {
  id: string;
  from: "system" | "user" | "driver";
  senderName: string;
  avatar: string;
  text: string;
  time: string;
  status: "sent" | "delivered" | "read";
  isNew?: boolean;
  type?: "text" | "location" | "action";
}

const MESSAGES_SEQUENCE: Omit<WaMessage, "isNew">[] = [
  {
    id: "m1",
    from: "system",
    senderName: "AXO Market",
    avatar: "A",
    text: "✅ *Pedido confirmado* · #AXO-2847\n\n📦 Combo Familiar Semanal (x2)\n🍨 Helado Duomo Cuarto Kg\n\n💰 Total: *$37.700 ARS*\nMétodo: Sumo Envíos",
    time: "09:14",
    status: "read",
    type: "text",
  },
  {
    id: "m2",
    from: "driver",
    senderName: "Rodrigo (Cadete)",
    avatar: "R",
    text: "Hola! Soy Rodrigo, tu cadete AXO. Ya retiro tu pedido en el local. Aprox. 15 min y llego. 🚴",
    time: "09:16",
    status: "read",
    type: "text",
  },
  {
    id: "m3",
    from: "user",
    senderName: "Vos",
    avatar: "V",
    text: "Perfecto! El portón es el verde de la esquina 🙌",
    time: "09:17",
    status: "read",
    type: "text",
  },
  {
    id: "m4",
    from: "driver",
    senderName: "Rodrigo (Cadete)",
    avatar: "R",
    text: "📍 Saliendo ahora desde Duomo Heladerías — Sucursal Sur",
    time: "09:22",
    status: "read",
    type: "location",
  },
  {
    id: "m5",
    from: "system",
    senderName: "AXO Market",
    avatar: "A",
    text: "🛵 *Tu pedido está en camino*\n\nRodrigo está a ~2.3 km\nTiempo estimado: 8 min\n\nRastreá en tiempo real desde la app AXO.",
    time: "09:22",
    status: "read",
    type: "action",
  },
  {
    id: "m6",
    from: "driver",
    senderName: "Rodrigo (Cadete)",
    avatar: "R",
    text: "¡Llegué! Estoy en el portón verde 🟢",
    time: "09:30",
    status: "delivered",
    type: "text",
  },
];

// ── GPS Route Points (simulación Posadas) ─────────────────────
interface GpsPoint {
  x: number; // 0-100 percentage on the map canvas
  y: number;
  label: string;
}

const GPS_ROUTE: GpsPoint[] = [
  { x: 30, y: 65, label: "Duomo Sucursal Sur" },
  { x: 36, y: 60, label: "" },
  { x: 43, y: 55, label: "" },
  { x: 50, y: 50, label: "" },
  { x: 57, y: 46, label: "" },
  { x: 63, y: 42, label: "" },
  { x: 68, y: 38, label: "En camino..." },
  { x: 72, y: 35, label: "" },
  { x: 76, y: 32, label: "Destino" },
];

export function WhatsAppSimulator() {
  const [visibleMessages, setVisibleMessages] = useState<WaMessage[]>([]);
  const [gpsStep, setGpsStep] = useState(0);
  const [isDelivered, setIsDelivered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIncoming, setShowIncoming] = useState(false);
  const [incomingPreview, setIncomingPreview] = useState<WaMessage | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startSimulation = () => {
    setVisibleMessages([]);
    setGpsStep(0);
    setIsDelivered(false);
    setIsPlaying(true);
    setShowIncoming(false);
  };

  // Show messages one by one
  useEffect(() => {
    if (!isPlaying) return;
    if (visibleMessages.length >= MESSAGES_SEQUENCE.length) {
      setIsDelivered(true);
      setIsPlaying(false);
      return;
    }

    const nextMsg = {
      ...MESSAGES_SEQUENCE[visibleMessages.length],
      isNew: true,
    };

    // Show incoming notification first
    setIncomingPreview(nextMsg);
    setShowIncoming(true);
    const hidePreview = setTimeout(() => setShowIncoming(false), 2000);

    timerRef.current = setTimeout(() => {
      setVisibleMessages((prev) => [...prev, nextMsg]);
      // Scroll chat to bottom
      setTimeout(() => {
        chatRef.current?.scrollTo({ top: 999, behavior: "smooth" });
      }, 100);
    }, 500);

    return () => {
      clearTimeout(hidePreview);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, visibleMessages.length]);

  // GPS advance
  useEffect(() => {
    if (!isPlaying || gpsStep >= GPS_ROUTE.length - 1) return;
    const t = setTimeout(() => {
      setGpsStep((s) => s + 1);
    }, 1800);
    return () => clearTimeout(t);
  }, [isPlaying, gpsStep]);

  const currentPos = GPS_ROUTE[gpsStep];
  const destPos = GPS_ROUTE[GPS_ROUTE.length - 1];
  const progressPct = Math.round((gpsStep / (GPS_ROUTE.length - 1)) * 100);

  return (
    <div className="flex flex-col gap-4">

      {/* WhatsApp incoming notification (floating) */}
      {showIncoming && incomingPreview && (
        <div className="fixed top-20 right-4 z-50 animate-slide-up pointer-events-none max-w-xs w-full">
          <div className="bg-[#1A2B1F] border border-[#2A3B2F] rounded-2xl shadow-axo-card overflow-hidden">
            <div className="bg-[#128C7E] px-3 py-1.5 flex items-center gap-2">
              <Phone size={10} className="text-white" />
              <span className="text-white text-[10px] font-semibold">WhatsApp · AXO Market</span>
            </div>
            <div className="p-3 flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-[#128C7E] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {incomingPreview.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white">{incomingPreview.senderName}</p>
                <p className="text-[10px] text-gray-300 truncate mt-0.5 leading-tight">
                  {incomingPreview.text.replace(/\*/g, "").split("\n")[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WHATSAPP CHAT ── */}
      <div className="axo-card-glow border border-axo-emerald/20 rounded-2xl overflow-hidden">
        {/* WA Header */}
        <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center font-black text-white text-sm">
            A
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">AXO Market — Grupo Pedido #2847</p>
            <p className="text-green-200 text-[10px]">Vos · Rodrigo (Cadete) · AXO Market</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        </div>

        {/* Chat area */}
        <div
          ref={chatRef}
          className="bg-[#0D1B12] h-64 overflow-y-auto p-3 flex flex-col gap-2"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #1A2B1F 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        >
          {visibleMessages.length === 0 && !isPlaying && (
            <div className="flex items-center justify-center h-full">
              <p className="text-[#3A5C4A] text-xs text-center">
                Presioná &quot;Iniciar Simulación&quot;<br />para ver las alertas en tiempo real
              </p>
            </div>
          )}

          {visibleMessages.map((msg) => {
            const isMe = msg.from === "user";
            const isSystem = msg.from === "system";
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2 animate-fade-in",
                  isMe ? "flex-row-reverse" : "flex-row"
                )}
              >
                {!isMe && (
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-auto",
                      isSystem
                        ? "bg-axo-cyan text-[#0A0F1D]"
                        : "bg-[#128C7E] text-white"
                    )}
                  >
                    {msg.avatar}
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-xs",
                    isMe
                      ? "bg-[#005C4B] text-white rounded-tr-sm"
                      : isSystem
                      ? "bg-[#1A3A5E] text-blue-100 rounded-tl-sm border border-axo-cyan/20"
                      : "bg-[#1F2B23] text-gray-100 rounded-tl-sm"
                  )}
                >
                  {!isMe && (
                    <p
                      className={cn(
                        "text-[10px] font-bold mb-1",
                        isSystem ? "text-axo-cyan" : "text-[#25D366]"
                      )}
                    >
                      {msg.senderName}
                    </p>
                  )}
                  <p className="leading-relaxed whitespace-pre-line text-[11px]">
                    {msg.text.replace(/\*/g, "")}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[9px] text-gray-400">{msg.time}</span>
                    {isMe && (
                      msg.status === "read"
                        ? <CheckCheck size={10} className="text-[#53BDEB]" />
                        : <Check size={10} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isPlaying && (
            <div className="flex gap-2 items-center">
              <div className="w-6 h-6 rounded-full bg-[#128C7E] flex items-center justify-center text-[10px] text-white">R</div>
              <div className="bg-[#1F2B23] rounded-2xl rounded-tl-sm px-3 py-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delivery confirmed */}
        {isDelivered && (
          <div className="bg-[#1A3A2A] border-t border-[#25D366]/20 px-4 py-3 flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center">
              <CheckCheck size={16} className="text-[#25D366]" />
            </div>
            <div>
              <p className="text-[#25D366] font-bold text-xs">¡Pedido entregado exitosamente!</p>
              <p className="text-gray-400 text-[10px]">Calificá a Rodrigo ⭐⭐⭐⭐⭐</p>
            </div>
          </div>
        )}

        {/* Start button */}
        <div className="bg-[#1A2B1F] px-4 py-3 border-t border-[#2A3B2F]">
          <button
            onClick={startSimulation}
            disabled={isPlaying}
            className={cn(
              "w-full py-2.5 rounded-xl text-sm font-bold transition-all",
              isPlaying
                ? "bg-[#2A3B2F] text-[#3A5C4A] cursor-not-allowed"
                : "bg-[#25D366] text-[#0A1A0F] hover:bg-[#20C05A] active:scale-95"
            )}
          >
            {isPlaying
              ? "⟳ Simulación en curso..."
              : isDelivered
              ? "🔄 Reiniciar Simulación"
              : "▶ Iniciar Simulación WhatsApp"}
          </button>
        </div>
      </div>

      {/* ── GPS TRACKER ── */}
      <div className="axo-card-glow border border-purple-500/20 rounded-2xl overflow-hidden">
        <div className="bg-purple-500/10 border-b border-purple-500/20 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation size={16} className="text-purple-400" />
            <div>
              <p className="text-sm font-bold text-axo-text">GPS Rastreo en Vivo</p>
              <p className="text-[10px] text-axo-muted">Rodrigo · Sumo Envíos AXO</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isPlaying ? "bg-purple-400 animate-pulse" : "bg-axo-border"
            )} />
            <span className="text-[10px] text-axo-muted">
              {isPlaying ? "En movimiento" : "Esperando..."}
            </span>
          </div>
        </div>

        {/* Map canvas */}
        <div className="relative h-52 bg-[#0A1428] overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="absolute top-0 bottom-0 border-l border-purple-400"
                     style={{ left: `${(i + 1) * 12.5}%` }} />
                <div className="absolute left-0 right-0 border-t border-purple-400"
                     style={{ top: `${(i + 1) * 12.5}%` }} />
              </div>
            ))}
          </div>

          {/* Street decorations */}
          {[
            { x1: "0%", y1: "50%", x2: "100%", y2: "50%" },
            { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
            { x1: "20%", y1: "0%", x2: "20%", y2: "100%" },
            { x1: "75%", y1: "0%", x2: "75%", y2: "100%" },
            { x1: "0%", y1: "30%", x2: "100%", y2: "30%" },
            { x1: "0%", y1: "70%", x2: "100%", y2: "70%" },
          ].map((line, i) => (
            <div
              key={i}
              className="absolute bg-[#1a2a4a] opacity-60"
              style={{
                left: line.x1, top: line.y1,
                width: line.x1 === "0%" ? "100%" : "2px",
                height: line.y1 === "0%" ? "100%" : "2px",
              }}
            />
          ))}

          {/* Route line */}
          <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
            {GPS_ROUTE.slice(0, gpsStep + 1).map((pt, i) => {
              if (i === 0) return null;
              const prev = GPS_ROUTE[i - 1];
              return (
                <line
                  key={i}
                  x1={`${prev.x}%`} y1={`${prev.y}%`}
                  x2={`${pt.x}%`}  y2={`${pt.y}%`}
                  stroke="#A855F7" strokeWidth="2.5"
                  strokeDasharray="6,3"
                  opacity="0.8"
                />
              );
            })}
            {/* Remaining route (dimmed) */}
            {GPS_ROUTE.slice(gpsStep).map((pt, i) => {
              if (i === 0) return null;
              const prev = GPS_ROUTE[gpsStep + i - 1];
              if (!prev) return null;
              return (
                <line
                  key={`dim-${i}`}
                  x1={`${prev.x}%`} y1={`${prev.y}%`}
                  x2={`${pt.x}%`} y2={`${pt.y}%`}
                  stroke="#A855F7" strokeWidth="1.5"
                  opacity="0.2"
                />
              );
            })}
          </svg>

          {/* Origin point */}
          <div
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: `${GPS_ROUTE[0].x}%`,
              top: `${GPS_ROUTE[0].y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-3 h-3 rounded-full bg-axo-cyan border-2 border-[#0A1428]" />
            <span className="text-[9px] text-axo-cyan bg-[#0A1428] px-1 rounded whitespace-nowrap">
              Duomo
            </span>
          </div>

          {/* Destination point */}
          <div
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: `${destPos.x}%`,
              top: `${destPos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <MapPin
              size={18}
              className={cn(
                isDelivered ? "text-axo-emerald" : "text-axo-muted"
              )}
            />
            <span className="text-[9px] text-axo-muted bg-[#0A1428] px-1 rounded">
              Destino
            </span>
          </div>

          {/* Moving driver dot */}
          {(isPlaying || gpsStep > 0) && (
            <div
              className="absolute flex flex-col items-center transition-all duration-1000 ease-linear"
              style={{
                left: `${currentPos.x}%`,
                top: `${currentPos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center shadow-[0_0_12px_#A855F7]">
                  <Truck size={11} className="text-white" />
                </div>
                {isPlaying && (
                  <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-30" />
                )}
              </div>
            </div>
          )}

          {/* Labels overlay */}
          <div className="absolute bottom-2 left-2 flex flex-col gap-1">
            <div className="bg-[#0A1428]/90 border border-purple-500/30 rounded-lg px-2 py-1">
              <p className="text-[10px] text-purple-400 font-semibold">Posadas Centro</p>
              <p className="text-[9px] text-axo-muted">Misiones · Argentina</p>
            </div>
          </div>

          {/* Zoom decorative */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <button className="w-6 h-6 bg-[#0A1428] border border-axo-border rounded text-axo-muted text-xs flex items-center justify-center hover:text-axo-text">+</button>
            <button className="w-6 h-6 bg-[#0A1428] border border-axo-border rounded text-axo-muted text-xs flex items-center justify-center hover:text-axo-text">−</button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-3 bg-axo-bg-card border-t border-axo-border flex items-center gap-3">
          <Truck size={14} className="text-purple-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-axo-muted mb-1">
              <span>Duomo Sucursal Sur</span>
              <span>Tu domicilio</span>
            </div>
            <div className="h-1.5 bg-axo-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-axo-cyan rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] mt-1">
              <span className="text-purple-400 font-semibold">{progressPct}% del recorrido</span>
              <span className="text-axo-muted">
                {isDelivered
                  ? "✅ Entregado"
                  : isPlaying
                  ? `~${Math.max(0, Math.round((GPS_ROUTE.length - 1 - gpsStep) * 1.8 / 60 * 10))} min restantes`
                  : "Sin iniciar"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
