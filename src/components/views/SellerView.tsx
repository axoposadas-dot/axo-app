"use client";

import { useState } from "react";
import {
  TrendingUp, Package, Star, Clock,
  Zap, BarChart2, ShoppingBag, AlertCircle, X
} from "lucide-react";
import {
  sellerStats, flashCombos, allProducts, formatARS, type FlashCombo
} from "@/lib/data";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";

interface NewComboForm {
  name: string;
  price: string;
  stock: string;
  hours: string;
}

export function SellerView() {
  const [showComboForm, setShowComboForm] = useState(false);
  const [combos, setCombos] = useState<FlashCombo[]>(flashCombos);
  const [form, setForm] = useState<NewComboForm>({ name: "", price: "", stock: "", hours: "4" });
  const [successMsg, setSuccessMsg] = useState("");

  const handlePublishCombo = () => {
    if (!form.name || !form.price || !form.stock) return;
    const newCombo: FlashCombo = {
      id: `flash-${Date.now()}`,
      name: form.name,
      priceARS: Number(form.price),
      stock: Number(form.stock),
      expiresIn: `${form.hours}h 00min`,
      sold: 0,
    };
    setCombos((prev) => [newCombo, ...prev]);
    setForm({ name: "", price: "", stock: "", hours: "4" });
    setShowComboForm(false);
    setSuccessMsg("¡Combo Flash publicado exitosamente! 🚀");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleteCombo = (id: string) => {
    setCombos((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-axo-text">Mi Negocio AXO</h2>
          <p className="text-xs text-axo-muted">Panel de control · Posadas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-axo-emerald animate-pulse-slow" />
          <span className="text-xs text-axo-emerald font-medium">En línea</span>
        </div>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="axo-card border-axo-emerald/30 bg-axo-emerald/5 p-4 flex items-center gap-3 animate-slide-up">
          <Zap size={16} className="text-axo-emerald flex-shrink-0" />
          <p className="text-axo-emerald text-sm font-medium">{successMsg}</p>
        </div>
      )}

      {/* Stats grid */}
      <div>
        <p className="text-xs font-semibold text-axo-muted uppercase tracking-wider mb-3">
          Resumen del mes
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Ventas totales"
            value={formatARS(sellerStats.totalSalesARS)}
            sub="+12% vs. mes anterior"
            icon={<TrendingUp size={16} />}
            color="cyan"
          />
          <StatCard
            label="Pedidos"
            value={String(sellerStats.ordersThisMonth)}
            sub={`${sellerStats.pendingOrders} pendientes`}
            icon={<Package size={16} />}
            color="emerald"
          />
          <StatCard
            label="Calificación"
            value={`${sellerStats.avgRating} ★`}
            sub="Basado en 127 reseñas"
            icon={<Star size={16} />}
            color="amber"
          />
          <StatCard
            label="Conversión"
            value={`${sellerStats.conversionRate}%`}
            sub={`${sellerStats.activeListings} publicaciones activas`}
            icon={<BarChart2 size={16} />}
            color="purple"
          />
        </div>
      </div>

      {/* Flash Combos section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-axo-muted uppercase tracking-wider">
              Combos Flash Activos
            </p>
            <p className="text-[11px] text-axo-muted mt-0.5">
              {combos.length} combos publicados
            </p>
          </div>
          <button
            onClick={() => setShowComboForm(!showComboForm)}
            className="axo-btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Zap size={12} />
            Publicar Combo Flash
          </button>
        </div>

        {/* Combo form */}
        {showComboForm && (
          <div className="axo-card-glow p-5 mb-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-axo-text text-sm flex items-center gap-2">
                <Zap size={14} className="text-axo-cyan" />
                Nuevo Combo Flash
              </h3>
              <button onClick={() => setShowComboForm(false)}>
                <X size={16} className="text-axo-muted hover:text-axo-text" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[10px] text-axo-muted uppercase tracking-wider font-semibold block mb-1.5">
                  Nombre del combo *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="axo-input"
                  placeholder="Ej: Combo Verano: Helado + Medialunas"
                />
              </div>
              <div>
                <label className="text-[10px] text-axo-muted uppercase tracking-wider font-semibold block mb-1.5">
                  Precio ARS *
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="axo-input"
                  placeholder="7800"
                />
              </div>
              <div>
                <label className="text-[10px] text-axo-muted uppercase tracking-wider font-semibold block mb-1.5">
                  Stock disponible *
                </label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="axo-input"
                  placeholder="30"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] text-axo-muted uppercase tracking-wider font-semibold block mb-1.5">
                  Duración de la oferta
                </label>
                <div className="flex gap-2">
                  {["2", "4", "6", "8", "12"].map((h) => (
                    <button
                      key={h}
                      onClick={() => setForm({ ...form, hours: h })}
                      className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                        form.hours === h
                          ? "border-axo-cyan text-axo-cyan bg-axo-cyan/10"
                          : "border-axo-border text-axo-muted hover:text-axo-text"
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={handlePublishCombo}
              disabled={!form.name || !form.price || !form.stock}
              className="axo-btn-primary w-full mt-4 text-sm py-3 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Zap size={14} />
              Publicar en 1 clic
            </button>
          </div>
        )}

        {/* Combos list */}
        <div className="flex flex-col gap-3">
          {combos.map((combo) => {
            const soldPct = Math.round((combo.sold / (combo.sold + combo.stock)) * 100);
            return (
              <div key={combo.id} className="axo-card p-4 flex items-center gap-4">
                <div className="text-2xl">⚡</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-axo-text text-sm truncate">{combo.name}</p>
                    <Badge variant="amber">Flash</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-axo-muted">
                    <span className="text-axo-cyan font-bold">{formatARS(combo.priceARS)}</span>
                    <span>·</span>
                    <Clock size={10} />
                    <span>Vence en {combo.expiresIn}</span>
                    <span>·</span>
                    <span>{combo.sold} vendidos</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2">
                    <div className="h-1.5 bg-axo-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-axo-gradient rounded-full transition-all"
                        style={{ width: `${soldPct}%`, background: "linear-gradient(90deg, #00F2FE, #00FF88)" }}
                      />
                    </div>
                    <p className="text-[10px] text-axo-muted mt-1">
                      {combo.stock} disponibles · {soldPct}% vendido
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCombo(combo.id)}
                  className="text-axo-muted hover:text-red-400 transition-colors p-1 flex-shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top products */}
      <div>
        <p className="text-xs font-semibold text-axo-muted uppercase tracking-wider mb-3">
          Mis publicaciones activas
        </p>
        <div className="flex flex-col gap-2">
          {allProducts.slice(0, 5).map((p) => (
            <div key={p.id} className="axo-card p-3 flex items-center gap-3">
              <span className="text-xl flex-shrink-0">{p.image}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-axo-text truncate">{p.name}</p>
                <p className="text-xs text-axo-muted">{formatARS(p.priceARS)} · Stock: {p.stock}</p>
              </div>
              <div className="flex items-center gap-2">
                {p.flashDeal && <Badge variant="red">Flash</Badge>}
                <ShoppingBag size={14} className="text-axo-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="axo-card p-4 flex gap-3">
        <AlertCircle size={16} className="text-axo-cyan flex-shrink-0 mt-0.5" />
        <div className="text-xs text-axo-muted">
          <p className="text-axo-text font-semibold mb-1">💡 Consejo AXO</p>
          Los combos Flash con descuento de 20%+ generan un 3× más ventas en las primeras 2 horas. ¡Prueba publicar uno esta tarde!
        </div>
      </div>
    </div>
  );
}
