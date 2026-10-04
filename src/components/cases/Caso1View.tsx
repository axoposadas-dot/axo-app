"use client";

// ================================================================
//  AXO — Caso 1: Compra Transfronteriza de Tecnología
//  Litany Encarnación · Puente Monitor · Asistente Aduanero
// ================================================================

import { useState } from "react";
import { ShoppingCart, CreditCard, Package, CheckCircle2, Globe, Zap } from "lucide-react";
import { PuenteMonitor } from "@/components/widgets/PuenteMonitor";
import { AduaneroAsistente } from "@/components/widgets/AduaneroAsistente";
import { formatARS } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";

// Productos de Litany Encarnación
const litanyProducts = [
  {
    id: "lit-01",
    nombre: "Monitor LED 27\" Full HD",
    marca: "Litany Encarnación",
    precioUSD: 185,
    precioARS: 185 * 1285,
    precioARSLocal: 285000,
    ahorroARS: 285000 - 185 * 1285,
    imagen: "🖥️",
    stock: 4,
  },
  {
    id: "lit-02",
    nombre: "Teclado Mecánico RGB TKL",
    marca: "Litany Encarnación",
    precioUSD: 42,
    precioARS: 42 * 1285,
    precioARSLocal: 68000,
    ahorroARS: 68000 - 42 * 1285,
    imagen: "⌨️",
    stock: 8,
  },
  {
    id: "lit-03",
    nombre: "Mouse Inalámbrico Pro",
    marca: "Litany Encarnación",
    precioUSD: 28,
    precioARS: 28 * 1285,
    precioARSLocal: 44000,
    ahorroARS: 44000 - 28 * 1285,
    imagen: "🖱️",
    stock: 12,
  },
];

type Caso1Step = "catalogo" | "carrito" | "puente" | "aduana" | "confirmado";

const STEPS = [
  { key: "catalogo", label: "Catálogo", emoji: "🏪" },
  { key: "carrito", label: "Carrito", emoji: "🛒" },
  { key: "puente", label: "Puente", emoji: "🌉" },
  { key: "aduana", label: "Aduana", emoji: "🏛️" },
  { key: "confirmado", label: "Listo", emoji: "✅" },
] as const;

export function Caso1View() {
  const [step, setStep] = useState<Caso1Step>("catalogo");
  const [cart, setCart] = useState<string[]>([]);

  const addToCart = (id: string) => {
    if (!cart.includes(id)) setCart((p) => [...p, id]);
  };
  const removeFromCart = (id: string) => setCart((p) => p.filter((x) => x !== id));

  const cartItems = litanyProducts.filter((p) => cart.includes(p.id));
  const totalUSD = cartItems.reduce((s, p) => s + p.precioUSD, 0);
  const totalARS = cartItems.reduce((s, p) => s + p.precioARS, 0);
  const ahorroTotal = cartItems.reduce((s, p) => s + p.ahorroARS, 0);

  const currentStepIdx = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="axo-card-glow border border-axo-cyan/20 p-5 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">🖥️</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-xl font-black text-axo-text">Compra Transfronteriza Tech</h2>
              <Badge variant="cyan">Caso 1</Badge>
            </div>
            <p className="text-sm text-axo-muted">
              Comprá tecnología en <strong className="text-axo-cyan">Litany Encarnación (PY)</strong>, cruzá el puente y procesá tu declaración aduanera con AFIP/ARCA — todo desde AXO.
            </p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-axo-muted">
                <Globe size={12} className="text-axo-cyan" />
                <span>USD → ARS tipo de cambio: $1.285</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-axo-muted">
                <Zap size={12} className="text-axo-emerald" />
                <span>Franquicia exenta hasta USD 300</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step tracker */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => {
          const isActive = s.key === step;
          const isDone = i < currentStepIdx;
          return (
            <div key={s.key} className="flex items-center flex-1 min-w-0">
              <button
                onClick={() => isDone && setStep(s.key as Caso1Step)}
                className={`flex flex-col items-center gap-1 flex-shrink-0 transition-all ${
                  isActive
                    ? "opacity-100"
                    : isDone
                    ? "opacity-80 cursor-pointer"
                    : "opacity-30"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                    isActive
                      ? "border-axo-cyan bg-axo-cyan/20 shadow-axo-glow-sm"
                      : isDone
                      ? "border-axo-emerald bg-axo-emerald/10"
                      : "border-axo-border bg-axo-bg"
                  }`}
                >
                  {isDone ? "✓" : s.emoji}
                </div>
                <span className="text-[9px] text-axo-muted hidden sm:block">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 rounded-full transition-all ${
                    i < currentStepIdx ? "bg-axo-emerald" : "bg-axo-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── CATÁLOGO ── */}
      {step === "catalogo" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-axo-text">Catálogo Litany — Encarnación</h3>
              <p className="text-xs text-axo-muted">Precios en dólares · Stock real importado</p>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setStep("carrito")}
                className="axo-btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <ShoppingCart size={13} />
                Ver carrito ({cart.length})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {litanyProducts.map((p) => {
              const inCart = cart.includes(p.id);
              const ahorroPct = Math.round((p.ahorroARS / p.precioARSLocal) * 100);
              return (
                <div key={p.id} className="axo-card p-4 flex flex-col gap-3 hover:border-axo-cyan/30 transition-all">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{p.imagen}</span>
                    <Badge variant="emerald">−{ahorroPct}% vs local</Badge>
                  </div>
                  <div>
                    <p className="text-[10px] text-axo-cyan font-semibold uppercase tracking-wider">
                      {p.marca}
                    </p>
                    <p className="font-bold text-axo-text text-sm mt-0.5">{p.nombre}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-axo-cyan">USD {p.precioUSD}</p>
                    <p className="text-xs text-axo-muted">
                      ≈ {formatARS(p.precioARS)} ARS
                    </p>
                    <p className="text-xs text-axo-muted line-through">
                      Local: {formatARS(p.precioARSLocal)}
                    </p>
                    <p className="text-xs text-axo-emerald font-semibold">
                      Ahorrás {formatARS(p.ahorroARS)}
                    </p>
                  </div>
                  <button
                    onClick={() => inCart ? removeFromCart(p.id) : addToCart(p.id)}
                    className={`text-xs font-bold py-2 rounded-xl transition-all ${
                      inCart
                        ? "bg-axo-emerald/10 border border-axo-emerald/30 text-axo-emerald"
                        : "axo-btn-primary"
                    }`}
                  >
                    {inCart ? "✓ En carrito" : "Agregar al carrito"}
                  </button>
                </div>
              );
            })}
          </div>

          {cart.length > 0 && (
            <button
              onClick={() => setStep("carrito")}
              className="axo-btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              Ir al carrito ({cart.length} artículo{cart.length > 1 ? "s" : ""}) →
            </button>
          )}
        </div>
      )}

      {/* ── CARRITO ── */}
      {step === "carrito" && (
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-axo-text">Tu carrito — Compra Encarnación</h3>
          {cartItems.map((p) => (
            <div key={p.id} className="axo-card p-4 flex items-center gap-4">
              <span className="text-2xl flex-shrink-0">{p.imagen}</span>
              <div className="flex-1">
                <p className="font-semibold text-axo-text text-sm">{p.nombre}</p>
                <p className="text-xs text-axo-muted">{p.marca}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-axo-cyan text-sm">USD {p.precioUSD}</p>
                <p className="text-[10px] text-axo-muted">{formatARS(p.precioARS)}</p>
              </div>
              <button
                onClick={() => removeFromCart(p.id)}
                className="text-axo-muted hover:text-red-400 text-xs px-2"
              >
                ✕
              </button>
            </div>
          ))}
          <div className="axo-card-glow p-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-axo-muted">Total USD</span>
              <span className="font-black text-axo-cyan text-lg">USD {totalUSD}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-axo-muted">Equivalente ARS</span>
              <span className="font-bold text-axo-text">{formatARS(totalARS)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-axo-emerald">Ahorro total vs mercado local</span>
              <span className="font-bold text-axo-emerald">{formatARS(ahorroTotal)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep("catalogo")} className="axo-btn-secondary flex-1 text-sm py-3">
              ← Seguir comprando
            </button>
            <button
              onClick={() => setStep("puente")}
              className="axo-btn-primary flex-1 text-sm py-3 flex items-center justify-center gap-2"
            >
              <CreditCard size={15} />
              Verificar Puente →
            </button>
          </div>
        </div>
      )}

      {/* ── PUENTE MONITOR ── */}
      {step === "puente" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-axo-text">Estado del Puente</h3>
            <Badge variant="cyan">Paso previo al cruce</Badge>
          </div>
          <PuenteMonitor />
          <button
            onClick={() => setStep("aduana")}
            className="axo-btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2"
          >
            <Package size={15} />
            Generar Declaración Aduanera →
          </button>
        </div>
      )}

      {/* ── ADUANA ── */}
      {step === "aduana" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-axo-text">Asistente Aduanero</h3>
            <Badge variant="amber">AFIP / ARCA</Badge>
          </div>
          <AduaneroAsistente />
          <button
            onClick={() => setStep("confirmado")}
            className="axo-btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={15} />
            Finalizar compra →
          </button>
        </div>
      )}

      {/* ── CONFIRMADO ── */}
      {step === "confirmado" && (
        <div className="axo-card-glow border border-axo-emerald/30 p-8 rounded-2xl flex flex-col items-center gap-5 text-center animate-slide-up">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-axo-emerald/10 border-2 border-axo-emerald/40 flex items-center justify-center text-4xl">
              ✅
            </div>
            <div className="absolute inset-0 rounded-full bg-axo-emerald/10 animate-ping-slow" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-axo-emerald">¡Compra completada!</h3>
            <p className="text-axo-muted text-sm mt-2">
              Tu declaración aduanera está lista. <br />
              Podés cruzar con tus productos.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
            <div className="axo-card p-3 text-center">
              <p className="text-xl font-black text-axo-cyan">USD {totalUSD}</p>
              <p className="text-[10px] text-axo-muted">Total compra</p>
            </div>
            <div className="axo-card p-3 text-center">
              <p className="text-xl font-black text-axo-emerald">{formatARS(ahorroTotal)}</p>
              <p className="text-[10px] text-axo-muted">Ahorro</p>
            </div>
            <div className="axo-card p-3 text-center">
              <p className="text-xl font-black text-amber-400">{cartItems.length}</p>
              <p className="text-[10px] text-axo-muted">Artículos</p>
            </div>
          </div>
          <button
            onClick={() => { setStep("catalogo"); setCart([]); }}
            className="axo-btn-secondary text-sm py-2.5 px-8"
          >
            ← Nueva compra
          </button>
        </div>
      )}
    </div>
  );
}
