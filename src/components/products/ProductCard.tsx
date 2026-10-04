"use client";

// ================================================================
//  AXO — ProductCard (Light Design)
//  Tarjeta de producto estilo marketplace profesional
// ================================================================

import { useState } from "react";
import { ShoppingCart, Heart, Star, Truck, MapPin, Zap } from "lucide-react";
import { type Product, formatARS } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const EMOJI_MAP: Record<string, string> = {
  "🍨": "🍨", "🛒": "🛒", "🥖": "🥖", "💻": "💻", "🖥️": "🖥️",
  "🎮": "🎮", "⌨️": "⌨️", "🖱️": "🖱️", "📱": "📱",
};

export function ProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const [logistics, setLogistics] = useState<"retiro" | "delivery" | "sumo">("delivery");
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const logisticsOptions = [
    { key: "delivery" as const, label: "Delivery", icon: <Truck size={11} /> },
    { key: "retiro" as const,   label: "Retiro",   icon: <MapPin size={11} /> },
    { key: "sumo" as const,     label: "Sumo",     icon: <Zap size={11} /> },
  ];

  return (
    <div className="axo-product-card group flex flex-col">
      {/* Image area */}
      <div className="relative bg-gradient-to-br from-axo-bg to-axo-bg-section aspect-square flex items-center justify-center overflow-hidden rounded-t-2xl">
        {/* Emoji image */}
        <span className="text-7xl select-none transition-transform duration-300 group-hover:scale-110">
          {product.image}
        </span>

        {/* Badges top-left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.flashDeal && (
            <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
              <Zap size={9} /> FLASH
            </span>
          )}
          {product.savingPercent && (
            <span className="bg-axo-emerald text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
              {product.savingPercent}% OFF
            </span>
          )}
          {product.featured && !product.flashDeal && (
            <span className="bg-axo-cyan text-white text-[10px] font-semibold px-2 py-1 rounded-lg shadow-sm">
              Destacado
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            size={15}
            className={liked ? "fill-red-500 text-red-500" : "text-axo-muted"}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Brand */}
        <p className="text-[10px] font-semibold text-axo-cyan uppercase tracking-wider leading-none">
          {product.brand}
        </p>

        {/* Name */}
        <p className="text-sm font-semibold text-axo-text leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={cn(
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-axo-border fill-axo-border"
                )}
              />
            ))}
          </div>
          <span className="text-[10px] text-axo-muted font-medium">
            ({product.reviews.toLocaleString("es-AR")})
          </span>
        </div>

        {/* Price block */}
        <div className="flex flex-col gap-0.5">
          {product.originalPriceARS && (
            <div className="flex items-center gap-2">
              <p className="text-xs text-axo-muted line-through">
                {formatARS(product.originalPriceARS)}
              </p>
              {product.savingPercent && (
                <span className="text-[10px] font-bold text-axo-emerald">
                  −{formatARS(product.originalPriceARS - product.priceARS)}
                </span>
              )}
            </div>
          )}
          <p className="text-2xl font-black text-axo-text tracking-tight">
            {formatARS(product.priceARS)}
          </p>
          {product.logistics.includes("sumo") && (
            <div className="flex items-center gap-1 text-[11px] text-axo-emerald font-semibold">
              <Truck size={11} />
              Envío Sumo disponible
            </div>
          )}
        </div>

        {/* Logistics selector */}
        <div className="flex gap-1 mt-auto pt-1">
          {logisticsOptions.filter((opt) =>
            product.logistics.includes(opt.key)
          ).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setLogistics(opt.key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 text-[10px] font-semibold py-1.5 rounded-lg border transition-all",
                logistics === opt.key
                  ? "bg-axo-blue-light border-axo-cyan text-axo-cyan"
                  : "border-axo-border text-axo-muted hover:border-axo-cyan/40 hover:text-axo-cyan"
              )}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
            addedToCart
              ? "bg-axo-emerald-light border border-axo-emerald text-axo-emerald"
              : "axo-btn-green"
          )}
        >
          {addedToCart ? (
            <>✓ Agregado al carrito</>
          ) : (
            <><ShoppingCart size={15} /> Agregar al carrito</>
          )}
        </button>
      </div>
    </div>
  );
}
