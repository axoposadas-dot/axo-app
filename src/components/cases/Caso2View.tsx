"use client";

// ================================================================
//  AXO — Caso 2: Gastronomía y Logística Híbrida
//  Sumo Envíos + Alerta WhatsApp + Duomo
// ================================================================

import { useState } from "react";
import { ShoppingCart, Package, Zap } from "lucide-react";
import { WhatsAppSimulator } from "@/components/widgets/WhatsAppSimulator";
import { gastroProducts, formatARS } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";

const featuredGastro = gastroProducts.slice(0, 4);

export function Caso2View() {
  const [cart, setCart] = useState<string[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const cartItems = featuredGastro.filter((p) => cart.includes(p.id));
  const total = cartItems.reduce((s, p) => s + p.priceARS, 0);

  const toggle = (id: string) =>
    setCart((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const placeOrder = () => {
    if (cartItems.length === 0) return;
    setOrderPlaced(true);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="axo-card-glow border border-axo-emerald/20 p-5 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">🍨</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-xl font-black text-axo-text">Gastronomía & Logística Híbrida</h2>
              <Badge variant="emerald">Caso 2</Badge>
            </div>
            <p className="text-sm text-axo-muted">
              Pedí helados Duomo, combos de supermercado y panificados artesanales.{" "}
              <strong className="text-axo-emerald">Sumo Envíos</strong> lo lleva a tu puerta,
              con alerta en <strong className="text-white">WhatsApp</strong> y rastreo GPS en vivo.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Producto + pedido */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-axo-text">Elegí tu pedido</h3>
            {cart.length > 0 && (
              <span className="text-xs text-axo-emerald font-semibold">
                {cart.length} seleccionado{cart.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {featuredGastro.map((p) => {
              const inCart = cart.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  disabled={orderPlaced}
                  className={`axo-card p-4 flex items-center gap-4 text-left transition-all w-full ${
                    inCart
                      ? "border-axo-emerald/40 bg-axo-emerald/5"
                      : "hover:border-axo-muted"
                  } ${orderPlaced ? "opacity-50" : ""}`}
                >
                  <div className="text-3xl flex-shrink-0">{p.image}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-axo-emerald font-semibold uppercase tracking-wider">
                      {p.brand}
                    </p>
                    <p className="font-bold text-axo-text text-sm leading-tight">{p.name}</p>
                    <StarRating rating={p.rating} reviews={p.reviews} className="mt-1" />
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {p.flashDeal && <Badge variant="red">⚡ Flash</Badge>}
                      {p.savingPercent && (
                        <Badge variant="emerald">−{p.savingPercent}%</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-axo-text">{formatARS(p.priceARS)}</p>
                    {p.originalPriceARS && (
                      <p className="text-[10px] text-axo-muted line-through">
                        {formatARS(p.originalPriceARS)}
                      </p>
                    )}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-2 ml-auto transition-all ${
                        inCart
                          ? "border-axo-emerald bg-axo-emerald text-[#0A0F1D]"
                          : "border-axo-border"
                      }`}
                    >
                      {inCart && <span className="text-[10px] font-black">✓</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Logistics selector + order */}
          {!orderPlaced ? (
            <div className="axo-card-glow p-4 flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold text-axo-muted uppercase tracking-wider mb-2">
                  Método de entrega
                </p>
                <div className="flex gap-2">
                  {[
                    { key: "sumo", label: "📦 Sumo Envíos", active: true },
                    { key: "delivery", label: "🛵 Delivery", active: false },
                  ].map((m) => (
                    <button
                      key={m.key}
                      className={`flex-1 text-xs font-semibold py-2 rounded-xl border transition-all ${
                        m.active
                          ? "border-purple-400/40 text-purple-400 bg-purple-500/10"
                          : "border-axo-border text-axo-muted hover:text-axo-text"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-axo-muted text-xs">Total del pedido</p>
                  <p className="text-2xl font-black text-axo-text">
                    {formatARS(total || 0)}
                  </p>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={cartItems.length === 0}
                  className={`axo-btn-primary text-sm py-3 px-6 flex items-center gap-2 ${
                    cartItems.length === 0 ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                >
                  <ShoppingCart size={15} />
                  Confirmar pedido
                </button>
              </div>
            </div>
          ) : (
            <div className="axo-card-glow border border-axo-emerald/30 p-4 flex items-center gap-3 animate-slide-up">
              <div className="w-10 h-10 rounded-full bg-axo-emerald/10 border border-axo-emerald/30 flex items-center justify-center flex-shrink-0">
                <Package size={18} className="text-axo-emerald" />
              </div>
              <div>
                <p className="font-bold text-axo-emerald text-sm">
                  ¡Pedido enviado a Sumo Envíos!
                </p>
                <p className="text-xs text-axo-muted">
                  Rodrigo está en camino · Simulá las alertas →
                </p>
              </div>
              <div className="ml-auto">
                <Zap size={16} className="text-axo-emerald animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Right: WhatsApp + GPS */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-axo-text">Alertas en tiempo real</h3>
          <WhatsAppSimulator />
        </div>
      </div>
    </div>
  );
}
