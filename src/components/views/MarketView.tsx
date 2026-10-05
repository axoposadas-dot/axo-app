"use client";

// ================================================================
//  AXO BEBIDAS — MarketView
//  Catálogo Express de Bebidas & Conveniencia · Posadas
// ================================================================

import { useState, useMemo } from "react";
import {
  Search, MapPin, ChevronDown, Clock, Truck, Star,
  ShoppingCart, Plus, Minus, X, Check, ChevronRight,
  Zap, MessageCircle, CreditCard, Package,
} from "lucide-react";
import {
  allDrinkProducts, getCategoryProducts, DRINK_CATEGORIES,
  ZONAS_POSADAS, formatARS, type DrinkProduct, type DrinkCategory,
} from "@/lib/data";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────
interface CartItem {
  product: DrinkProduct;
  qty: number;
}
type CheckoutStep = "idle" | "cart" | "address" | "whatsapp" | "pago" | "confirmado";

// ── Mini Product Card ─────────────────────────────────────────
function DrinkCard({
  product,
  onAdd,
}: {
  product: DrinkProduct;
  onAdd: (p: DrinkProduct) => void;
}) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="bg-white border border-axo-border rounded-2xl shadow-axo-card hover:shadow-axo-card-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Image / Badge area */}
      <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 aspect-square flex items-center justify-center">
        <span className="text-6xl select-none">{product.image}</span>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.flashDeal && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5">
              <Zap size={9} /> FLASH
            </span>
          )}
          {product.savingPercent && (
            <span className="bg-axo-emerald text-white text-[10px] font-black px-2 py-0.5 rounded-md">
              -{product.savingPercent}%
            </span>
          )}
          {product.fria && (
            <span className="bg-axo-cyan text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
              🧊 Fría
            </span>
          )}
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute bottom-2 right-2 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
            ¡Solo {product.stock}!
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-[10px] font-semibold text-axo-cyan uppercase tracking-wider leading-none">
          {product.brand}
        </p>
        <p className="text-sm font-bold text-axo-text leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </p>
        <p className="text-[10px] text-axo-muted">{product.volume}</p>

        <div className="flex items-center gap-1 mt-0.5">
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-semibold text-axo-text">{product.rating}</span>
          <span className="text-[10px] text-axo-muted">({product.reviews})</span>
        </div>

        <div className="mt-1">
          {product.originalPriceARS && (
            <p className="text-[10px] text-axo-muted line-through">{formatARS(product.originalPriceARS)}</p>
          )}
          <p className="text-xl font-black text-axo-text tracking-tight">{formatARS(product.priceARS)}</p>
        </div>

        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={cn(
            "w-full mt-auto flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
            added
              ? "bg-axo-emerald-light text-axo-emerald border border-axo-emerald"
              : product.stock === 0
              ? "bg-axo-bg text-axo-muted cursor-not-allowed border border-axo-border"
              : "bg-axo-cyan text-white hover:bg-axo-cyan-dim active:scale-95 shadow-sm"
          )}
        >
          {added ? (
            <><Check size={14} /> Agregado</>
          ) : product.stock === 0 ? (
            "Sin stock"
          ) : (
            <><Plus size={14} /> Agregar</>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Checkout Modal ────────────────────────────────────────────
function CheckoutModal({
  cart,
  onQtyChange,
  onClose,
  step,
  setStep,
}: {
  cart: CartItem[];
  onQtyChange: (id: string, delta: number) => void;
  onClose: () => void;
  step: CheckoutStep;
  setStep: (s: CheckoutStep) => void;
}) {
  const [zona, setZona] = useState(ZONAS_POSADAS[0]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pago, setPago] = useState<"efectivo" | "transferencia" | "mercadopago">("mercadopago");

  const total = cart.reduce((acc, item) => acc + item.product.priceARS * item.qty, 0);
  const deliveryCost = total >= 30000 ? 0 : 2500;
  const finalTotal = total + deliveryCost;

  const STEPS = ["cart", "address", "whatsapp", "pago"] as const;
  const stepIdx = STEPS.indexOf(step as typeof STEPS[number]);
  const stepLabels = ["Carrito", "Dirección", "WhatsApp", "Pago"];

  if (step === "confirmado") {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-axo-card-lg w-full max-w-sm p-8 flex flex-col items-center gap-5 text-center animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-axo-emerald-light border-2 border-axo-emerald flex items-center justify-center text-4xl">
            🍺
          </div>
          <div>
            <h3 className="text-2xl font-black text-axo-text">¡Pedido confirmado!</h3>
            <p className="text-sm text-axo-muted mt-2">
              Tu pedido está siendo preparado. Recibirás una confirmación por WhatsApp en breve.
            </p>
          </div>
          <div className="bg-axo-emerald-light border border-axo-emerald/20 rounded-2xl px-5 py-3 w-full">
            <p className="text-axo-emerald font-bold text-sm flex items-center justify-center gap-2">
              <Clock size={15} /> Tiempo estimado: 20–35 min
            </p>
          </div>
          <button onClick={onClose} className="axo-btn-green w-full py-3 text-sm">
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-axo-card-lg w-full sm:max-w-md max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-axo-border">
          <div>
            <h3 className="font-black text-axo-text text-lg">
              {step === "cart" ? "🛒 Tu pedido" : step === "address" ? "📍 ¿Dónde entregamos?" : step === "whatsapp" ? "📱 Tu WhatsApp" : "💳 Forma de pago"}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-axo-bg rounded-xl text-axo-muted hover:text-axo-text transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Progress steps */}
        {step !== "cart" && (
          <div className="flex items-center px-5 py-3 gap-1 border-b border-axo-border">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0",
                  i < stepIdx ? "bg-axo-emerald text-white" :
                  i === stepIdx ? "bg-axo-cyan text-white" :
                  "bg-axo-bg text-axo-muted border border-axo-border"
                )}>
                  {i < stepIdx ? "✓" : i + 1}
                </div>
                <span className={cn("text-[10px] font-semibold hidden sm:inline", i === stepIdx ? "text-axo-cyan" : "text-axo-muted")}>
                  {stepLabels[i]}
                </span>
                {i < STEPS.length - 1 && <div className="flex-1 h-0.5 bg-axo-border rounded mx-1" />}
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* STEP 1: Cart */}
          {step === "cart" && (
            <div className="flex flex-col gap-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <span className="text-5xl">🛒</span>
                  <p className="font-bold text-axo-text">Tu carrito está vacío</p>
                  <p className="text-sm text-axo-muted">Agregá bebidas para continuar</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 bg-axo-bg border border-axo-border rounded-2xl p-3">
                      <span className="text-3xl">{item.product.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-axo-text text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-axo-muted">{item.product.volume}</p>
                        <p className="font-black text-axo-text text-sm">{formatARS(item.product.priceARS * item.qty)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => onQtyChange(item.product.id, -1)}
                          className="w-7 h-7 rounded-full border border-axo-border bg-white flex items-center justify-center hover:border-red-300 hover:text-red-500 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-bold text-axo-text w-5 text-center">{item.qty}</span>
                        <button
                          onClick={() => onQtyChange(item.product.id, +1)}
                          className="w-7 h-7 rounded-full border border-axo-cyan bg-axo-blue-light text-axo-cyan flex items-center justify-center hover:bg-axo-cyan hover:text-white transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Envío gratis banner */}
                  {total < 30000 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
                      <strong>¡Envío gratis!</strong> Agregá {formatARS(30000 - total)} más para envío sin costo.
                    </div>
                  )}

                  {/* Totals */}
                  <div className="border-t border-axo-border pt-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-axo-muted">Subtotal</span>
                      <span className="font-semibold text-axo-text">{formatARS(total)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-axo-muted flex items-center gap-1"><Truck size={12} /> Envío</span>
                      <span className={cn("font-semibold", deliveryCost === 0 ? "text-axo-emerald" : "text-axo-text")}>
                        {deliveryCost === 0 ? "¡GRATIS!" : formatARS(deliveryCost)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-black">
                      <span className="text-axo-text">Total</span>
                      <span className="text-2xl text-axo-text">{formatARS(finalTotal)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 2: Address */}
          {step === "address" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-axo-text block mb-2">Zona de Posadas</label>
                <div className="grid grid-cols-2 gap-2">
                  {ZONAS_POSADAS.map((z) => (
                    <button
                      key={z}
                      onClick={() => setZona(z)}
                      className={cn(
                        "py-2.5 px-3 rounded-xl border text-sm font-semibold text-left transition-all",
                        zona === z
                          ? "bg-axo-blue-light border-axo-cyan text-axo-cyan"
                          : "border-axo-border text-axo-muted hover:border-axo-cyan/40 hover:text-axo-text"
                      )}
                    >
                      <MapPin size={11} className="inline mr-1" />{z}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-axo-text block mb-2">Dirección exacta</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="axo-input"
                  placeholder="Calle y número, entre calles..."
                />
              </div>
              <div className="bg-axo-blue-light border border-axo-cyan/20 rounded-xl px-4 py-3 flex items-start gap-2">
                <Clock size={14} className="text-axo-cyan flex-shrink-0 mt-0.5" />
                <p className="text-xs text-axo-text">
                  Tiempo estimado de entrega a <strong>{zona}</strong>: <strong className="text-axo-cyan">20–35 minutos</strong>
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: WhatsApp */}
          {step === "whatsapp" && (
            <div className="flex flex-col gap-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
                <MessageCircle size={20} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-green-800 text-sm">Confirmación por WhatsApp</p>
                  <p className="text-xs text-green-700 mt-1">
                    Te enviaremos la confirmación y el seguimiento de tu pedido directo por WhatsApp.
                  </p>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-axo-text block mb-2">Tu número de WhatsApp</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-axo-muted font-semibold">+54</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="axo-input pl-12"
                    placeholder="376 4123456"
                    type="tel"
                  />
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-axo-muted">
                <Check size={12} className="text-axo-emerald flex-shrink-0 mt-0.5" />
                <span>Recibirás el estado del pedido y podrás rastrear al repartidor.</span>
              </div>
            </div>
          )}

          {/* STEP 4: Pago */}
          {step === "pago" && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-bold text-axo-text mb-3">Forma de pago</p>
                <div className="flex flex-col gap-2">
                  {[
                    { key: "mercadopago" as const, label: "MercadoPago", icon: "💳", desc: "Débito, crédito o saldo MP" },
                    { key: "transferencia" as const, label: "Transferencia", icon: "🏦", desc: "CVU / CBU — alias: axo.bebidas" },
                    { key: "efectivo" as const, label: "Efectivo", icon: "💵", desc: "Al recibir el pedido" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setPago(opt.key)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all",
                        pago === opt.key
                          ? "border-axo-cyan bg-axo-blue-light"
                          : "border-axo-border hover:border-axo-cyan/40"
                      )}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <div>
                        <p className={cn("font-bold text-sm", pago === opt.key ? "text-axo-cyan" : "text-axo-text")}>
                          {opt.label}
                        </p>
                        <p className="text-[11px] text-axo-muted">{opt.desc}</p>
                      </div>
                      <div className={cn(
                        "ml-auto w-5 h-5 rounded-full border-2",
                        pago === opt.key ? "border-axo-cyan bg-axo-cyan" : "border-axo-border"
                      )}>
                        {pago === opt.key && <div className="w-full h-full rounded-full flex items-center justify-center"><Check size={10} className="text-white" /></div>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order summary */}
              <div className="bg-axo-bg border border-axo-border rounded-2xl p-4">
                <p className="text-xs font-bold text-axo-text mb-2">Resumen del pedido</p>
                <div className="flex flex-col gap-1.5">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between text-xs">
                      <span className="text-axo-muted">{item.qty}× {item.product.name}</span>
                      <span className="font-semibold text-axo-text">{formatARS(item.product.priceARS * item.qty)}</span>
                    </div>
                  ))}
                  <div className="border-t border-axo-border pt-2 mt-1 flex items-center justify-between font-black">
                    <span>Total a pagar</span>
                    <span className="text-axo-cyan text-lg">{formatARS(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-axo-border px-5 py-4">
          {step === "cart" && cart.length > 0 && (
            <button onClick={() => setStep("address")} className="axo-btn-green w-full py-3.5 text-sm">
              Continuar → {formatARS(finalTotal)} <ChevronRight size={15} />
            </button>
          )}
          {step === "address" && (
            <button
              onClick={() => setStep("whatsapp")}
              disabled={!address.trim()}
              className={cn("w-full py-3.5 text-sm font-bold rounded-xl transition-all", address.trim() ? "axo-btn-green" : "bg-axo-bg text-axo-muted border border-axo-border cursor-not-allowed")}
            >
              Confirmar dirección → <ChevronRight size={15} />
            </button>
          )}
          {step === "whatsapp" && (
            <button
              onClick={() => setStep("pago")}
              disabled={phone.length < 8}
              className={cn("w-full py-3.5 text-sm font-bold rounded-xl transition-all", phone.length >= 8 ? "axo-btn-green" : "bg-axo-bg text-axo-muted border border-axo-border cursor-not-allowed")}
            >
              Continuar al pago → <ChevronRight size={15} />
            </button>
          )}
          {step === "pago" && (
            <button
              onClick={() => setStep("confirmado")}
              className="w-full py-3.5 text-sm font-bold rounded-xl bg-axo-emerald text-white hover:bg-axo-emerald-dim active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Check size={15} /> Confirmar pedido · {formatARS(finalTotal)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main MarketView ───────────────────────────────────────────
export function MarketView() {
  const [activeCategory, setActiveCategory] = useState<DrinkCategory | "todos">("todos");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("idle");
  const [searchFocused, setSearchFocused] = useState(false);

  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const cartTotal = cart.reduce((acc, i) => acc + i.product.priceARS * i.qty, 0);

  const products = useMemo(() => {
    let pool = activeCategory === "todos" ? allDrinkProducts : getCategoryProducts(activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      pool = pool.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return pool;
  }, [activeCategory, search]);

  const flashDeals = allDrinkProducts.filter((p) => p.flashDeal).slice(0, 4);

  const addToCart = (product: DrinkProduct) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  };

  const changeQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => i.product.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    );
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ── HERO BANNER ──────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A0F1D] to-[#1E3A5F] p-6 sm:p-8">
        <div className="relative z-10 flex items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-axo-emerald/20 border border-axo-emerald/30 rounded-full px-3 py-1 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-axo-emerald animate-pulse" />
              <span className="text-axo-emerald text-[11px] font-bold tracking-wider">DISPONIBLE AHORA EN POSADAS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
              Bebidas frías<br />en 30 minutos 🍺
            </h1>
            <p className="text-sm text-slate-300 mb-4 max-w-xs">
              Cervezas, Fernet, Vinos, Gaseosas e Hielo. Express delivery en toda Posadas.
            </p>
            <button
              onClick={() => setCheckoutStep("cart")}
              className="bg-axo-emerald text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-axo-emerald-dim active:scale-95 transition-all shadow-sm flex items-center gap-2"
            >
              <ShoppingCart size={15} /> Ver pedido
              {cartCount > 0 && (
                <span className="bg-white text-axo-emerald text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          <div className="hidden sm:block text-8xl select-none opacity-90 flex-shrink-0">🍻</div>
        </div>
        {/* Subtle glow elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-axo-cyan/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-axo-emerald/10 rounded-full translate-y-1/2 blur-2xl" />
      </div>

      {/* ── BUSCADOR ─────────────────────────────────────────── */}
      <div className="relative">
        <Search
          size={18}
          className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none", searchFocused ? "text-axo-cyan" : "text-axo-muted")}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Buscar cerveza, fernet, vino..."
          className="axo-search-input"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-axo-muted hover:text-axo-text">
            <X size={15} />
          </button>
        )}
      </div>

      {/* ── CATEGORÍAS ───────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => setActiveCategory("todos")}
          className={cn(
            "flex items-center gap-2 flex-shrink-0 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all",
            activeCategory === "todos"
              ? "bg-axo-cyan text-white border-axo-cyan shadow-sm"
              : "bg-white border-axo-border text-axo-muted hover:border-axo-cyan/40 hover:text-axo-cyan"
          )}
        >
          🏪 Todo
        </button>
        {DRINK_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              "flex items-center gap-2 flex-shrink-0 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all",
              activeCategory === cat.key
                ? "bg-axo-cyan text-white border-axo-cyan shadow-sm"
                : "bg-white border-axo-border text-axo-muted hover:border-axo-cyan/40 hover:text-axo-cyan"
            )}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* ── FLASH DEALS (cuando está en "todos" sin búsqueda) ── */}
      {activeCategory === "todos" && !search && flashDeals.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-red-500" />
            <h2 className="font-bold text-axo-text">Ofertas Flash del Día</h2>
            <span className="text-[10px] bg-red-500 text-white font-black px-2 py-0.5 rounded-full">
              Hoy hasta las 23:59
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {flashDeals.map((p) => (
              <DrinkCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        </div>
      )}

      {/* ── PRODUCT GRID ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-axo-text">
              {activeCategory === "todos"
                ? "Catálogo Completo"
                : DRINK_CATEGORIES.find((c) => c.key === activeCategory)?.emoji + " " + DRINK_CATEGORIES.find((c) => c.key === activeCategory)?.label}
            </h2>
            <p className="text-xs text-axo-muted mt-0.5">{products.length} producto{products.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-axo-muted">
            <Truck size={12} className="text-axo-emerald" />
            <span>Gratis desde {formatARS(30000)}</span>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <DrinkCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center bg-white rounded-2xl border border-axo-border">
            <span className="text-5xl">🍺</span>
            <div>
              <p className="font-bold text-axo-text">Sin resultados</p>
              <p className="text-sm text-axo-muted mt-1">
                Probá con otra búsqueda o{" "}
                <button onClick={() => { setSearch(""); setActiveCategory("todos"); }} className="text-axo-cyan font-semibold hover:underline">
                  ver todo el catálogo
                </button>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── FLOATING CART BUTTON ─────────────────────────────── */}
      {cartCount > 0 && checkoutStep === "idle" && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <button
            onClick={() => setCheckoutStep("cart")}
            className="flex items-center gap-3 bg-axo-cyan text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-axo-card-lg hover:bg-axo-cyan-dim active:scale-95 transition-all"
          >
            <ShoppingCart size={18} />
            <span>Ver pedido ({cartCount} item{cartCount !== 1 ? "s" : ""})</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-lg">{formatARS(cartTotal)}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ── CHECKOUT MODAL ────────────────────────────────────── */}
      {checkoutStep !== "idle" && (
        <CheckoutModal
          cart={cart}
          onQtyChange={changeQty}
          onClose={() => {
            setCheckoutStep("idle");
            if (checkoutStep === "confirmado") setCart([]);
          }}
          step={checkoutStep}
          setStep={setCheckoutStep}
        />
      )}
    </div>
  );
}
