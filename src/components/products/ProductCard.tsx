"use client";

import { useState } from "react";
import { Package, Truck, Store, ShoppingCart, Plus, Minus } from "lucide-react";
import { type Product, formatARS } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";

type LogisticChoice = "retiro" | "delivery" | "sumo";

const logisticLabels: Record<LogisticChoice, { label: string; icon: React.ReactNode; color: string }> = {
  retiro: {
    label: "Retiro",
    icon: <Store size={12} />,
    color: "border-axo-cyan/40 text-axo-cyan bg-axo-cyan/5",
  },
  delivery: {
    label: "Delivery",
    icon: <Truck size={12} />,
    color: "border-axo-emerald/40 text-axo-emerald bg-axo-emerald/5",
  },
  sumo: {
    label: "Sumo Envíos",
    icon: <Package size={12} />,
    color: "border-purple-400/40 text-purple-400 bg-purple-500/5",
  },
};

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, qty: number, logistics: LogisticChoice) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [qty, setQty] = useState(1);
  const [logistics, setLogistics] = useState<LogisticChoice>(
    product.logistics[0] as LogisticChoice
  );
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart?.(product, qty, logistics);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="axo-card-glow p-4 flex flex-col gap-3 animate-fade-in">
      {/* Header badges */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.flashDeal && (
            <Badge variant="red">⚡ Flash</Badge>
          )}
          {product.featured && !product.flashDeal && (
            <Badge variant="cyan">★ Destacado</Badge>
          )}
          {product.origin && (
            <Badge variant="default">📍 {product.origin}</Badge>
          )}
        </div>
        {product.savingPercent && (
          <Badge variant="emerald">−{product.savingPercent}%</Badge>
        )}
      </div>

      {/* Product image and info */}
      <div className="flex gap-4">
        <div className="text-4xl w-14 h-14 flex items-center justify-center bg-axo-bg rounded-xl flex-shrink-0">
          {product.image}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-axo-cyan/80 uppercase tracking-wider mb-0.5">
            {product.brand}
          </p>
          <h3 className="font-bold text-axo-text text-sm leading-tight mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-axo-muted leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {product.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] text-axo-muted bg-axo-bg px-2 py-0.5 rounded-full border border-axo-border"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Rating */}
      <StarRating rating={product.rating} reviews={product.reviews} />

      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-black text-axo-text">
          {formatARS(product.priceARS)}
        </span>
        {product.originalPriceARS && (
          <span className="text-xs text-axo-muted line-through">
            {formatARS(product.originalPriceARS)}
          </span>
        )}
        <span className="text-xs text-axo-muted ml-auto">{product.unit}</span>
      </div>

      {/* Logistics selector */}
      <div>
        <p className="text-[10px] text-axo-muted uppercase tracking-wider mb-2 font-semibold">
          Método de entrega
        </p>
        <div className="flex gap-2 flex-wrap">
          {product.logistics.map((mode) => {
            const lm = logisticLabels[mode as LogisticChoice];
            const isActive = logistics === mode;
            return (
              <button
                key={mode}
                onClick={() => setLogistics(mode as LogisticChoice)}
                className={cn(
                  "flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all",
                  isActive
                    ? lm.color
                    : "border-axo-border text-axo-muted hover:border-axo-muted"
                )}
              >
                {lm.icon}
                {lm.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Qty + Add */}
      <div className="flex items-center gap-3 mt-1">
        <div className="flex items-center gap-2 bg-axo-bg rounded-xl border border-axo-border px-2 py-1">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="text-axo-muted hover:text-axo-text transition-colors p-1"
          >
            <Minus size={14} />
          </button>
          <span className="text-sm font-bold text-axo-text w-5 text-center">{qty}</span>
          <button
            onClick={() => setQty(Math.min(product.stock, qty + 1))}
            className="text-axo-muted hover:text-axo-text transition-colors p-1"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          onClick={handleAdd}
          className={cn(
            "axo-btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-2.5",
            added && "opacity-70"
          )}
        >
          {added ? (
            "✓ ¡Agregado!"
          ) : (
            <>
              <ShoppingCart size={15} />
              Agregar al carrito
            </>
          )}
        </button>
      </div>

      {/* Stock warning */}
      {product.stock <= 10 && (
        <p className="text-xs text-amber-400 font-medium">
          ⚠️ Solo quedan {product.stock} unidades
        </p>
      )}
    </div>
  );
}
