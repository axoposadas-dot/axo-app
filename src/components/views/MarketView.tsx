"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { allProducts, gastroProducts, techProducts, type Product } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { SearchBar } from "@/components/ui/SearchBar";

type FilterType = "todos" | "gastronomia" | "tecnologia" | "flash" | "destacados";

const filters: { key: FilterType; label: string; emoji: string }[] = [
  { key: "todos", label: "Todos", emoji: "🏪" },
  { key: "gastronomia", label: "Gastronomía", emoji: "🍽️" },
  { key: "tecnologia", label: "Tecnología", emoji: "💻" },
  { key: "flash", label: "Flash Deals", emoji: "⚡" },
  { key: "destacados", label: "Destacados", emoji: "★" },
];

export function MarketView() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");
  const [cartItems, setCartItems] = useState<number>(0);

  const filtered = useMemo(() => {
    let base: Product[];
    switch (activeFilter) {
      case "gastronomia":
        base = gastroProducts;
        break;
      case "tecnologia":
        base = techProducts;
        break;
      case "flash":
        base = allProducts.filter((p) => p.flashDeal);
        break;
      case "destacados":
        base = allProducts.filter((p) => p.featured);
        break;
      default:
        base = allProducts;
    }
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [activeFilter, search]);

  const handleAddToCart = () => {
    setCartItems((c) => c + 1);
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-axo-text">AXO Market</h2>
          <p className="text-xs text-axo-muted">
            {filtered.length} productos disponibles
          </p>
        </div>
        {cartItems > 0 && (
          <button className="relative axo-btn-secondary py-2 px-4 text-sm flex items-center gap-2">
            🛒 Carrito
            <span className="absolute -top-2 -right-2 bg-axo-cyan text-[#0A0F1D] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {cartItems}
            </span>
          </button>
        )}
      </div>

      {/* Search */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar productos, marcas, combos..."
      />

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold px-3.5 py-2 rounded-full border transition-all flex-shrink-0 ${
              activeFilter === f.key
                ? "bg-axo-cyan/10 border-axo-cyan text-axo-cyan"
                : "bg-axo-bg-card border-axo-border text-axo-muted hover:text-axo-text"
            }`}
          >
            <span>{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-axo-muted">No encontramos productos para &quot;{search}&quot;</p>
          <button
            onClick={() => { setSearch(""); setActiveFilter("todos"); }}
            className="mt-3 text-axo-cyan text-sm hover:underline"
          >
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* Footer info */}
      <div className="axo-card p-4 flex items-center gap-3 text-sm">
        <SlidersHorizontal size={16} className="text-axo-cyan flex-shrink-0" />
        <p className="text-axo-muted text-xs">
          <span className="text-axo-text font-semibold">Sumo Envíos</span> disponible en productos marcados con 📦 — cobertura en Posadas y Gran Posadas.
        </p>
      </div>
    </div>
  );
}
