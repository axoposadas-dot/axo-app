// ============================================================
//  AXO BEBIDAS — Motor de Datos
//  Plataforma Express de Bebidas & Conveniencia · Posadas
// ============================================================

export type DrinkCategory =
  | "cervezas"
  | "fernet"
  | "vinos"
  | "gaseosas"
  | "hielo"
  | "packs";

export type OrderStatus = "pendiente" | "en_camino" | "entregado" | "cancelado";
export type VehicleType = "moto" | "auto" | "bicicleta";
export type LogisticsMode = "retiro" | "delivery" | "sumo";

// ── Zonas de Posadas ──────────────────────────────────────────
export const ZONAS_POSADAS = [
  "Centro",
  "Villa Sarita",
  "Itaembé Miní",
  "Itaembé Guazú",
  "San Isidro",
  "Chacra 29",
  "Fátima",
  "Km 8",
  "Yohasá",
  "Puerto Nuevo",
];

// ── Categorías de Bebidas ─────────────────────────────────────
export const DRINK_CATEGORIES: {
  key: DrinkCategory;
  label: string;
  emoji: string;
  desc: string;
}[] = [
  { key: "cervezas", label: "Cervezas",          emoji: "🍺", desc: "Nacionales e importadas" },
  { key: "fernet",   label: "Fernet & Spirits",  emoji: "🥃", desc: "Fernet, gin, vodka, ron" },
  { key: "vinos",    label: "Vinos",              emoji: "🍷", desc: "Tintos, blancos y rosados" },
  { key: "gaseosas", label: "Gaseosas & Agua",    emoji: "🥤", desc: "Para mezclar o acompañar" },
  { key: "hielo",    label: "Hielo & Extras",     emoji: "🧊", desc: "Hielo, limones, vasos" },
  { key: "packs",    label: "Packs Eventos",      emoji: "🎉", desc: "Combos para reuniones" },
];

// ── Producto ──────────────────────────────────────────────────
export interface DrinkProduct {
  id: string;
  category: DrinkCategory;
  name: string;
  brand: string;
  description: string;
  volume: string;          // "1L", "355ml", "750ml"
  priceARS: number;
  originalPriceARS?: number;
  savingPercent?: number;
  image: string;           // emoji
  imageAlt?: string;       // alt text
  tags: string[];
  logistics: LogisticsMode[];
  stock: number;
  rating: number;
  reviews: number;
  featured?: boolean;
  flashDeal?: boolean;
  fria?: boolean;          // disponible fría
  minUnits?: number;       // mínimo por pedido
  alcoholGrade?: string;   // graduación alcohólica
}

// ── CERVEZAS ──────────────────────────────────────────────────
export const cervezas: DrinkProduct[] = [
  {
    id: "quilmes-botella-1l",
    category: "cervezas",
    name: "Quilmes Clásica Botella",
    brand: "Quilmes",
    description: "La cerveza argentina por excelencia. Rubia, suave y refrescante. Botella retornable.",
    volume: "1 L",
    priceARS: 3800,
    originalPriceARS: 4500,
    savingPercent: 16,
    image: "🍺",
    tags: ["Rubia", "Nacional", "Retornable"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 120,
    rating: 4.8,
    reviews: 1240,
    featured: true,
    fria: true,
    alcoholGrade: "4.9%",
  },
  {
    id: "corona-botella-355",
    category: "cervezas",
    name: "Corona Extra Botella",
    brand: "Corona",
    description: "Cerveza mexicana ligera y refrescante. Perfecta con un gajo de limón. Unidad 355ml.",
    volume: "355 ml",
    priceARS: 2200,
    originalPriceARS: 2800,
    savingPercent: 21,
    image: "🍺",
    tags: ["Rubia", "Importada", "Ligera"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 80,
    rating: 4.7,
    reviews: 650,
    featured: true,
    flashDeal: true,
    fria: true,
    alcoholGrade: "4.6%",
  },
  {
    id: "heineken-lata-473",
    category: "cervezas",
    name: "Heineken Lata",
    brand: "Heineken",
    description: "Cerveza holandesa premium. Sabor suave y refrescante. Lata 473ml.",
    volume: "473 ml",
    priceARS: 2800,
    originalPriceARS: 3400,
    savingPercent: 18,
    image: "🍺",
    tags: ["Rubia", "Importada", "Premium"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 60,
    rating: 4.6,
    reviews: 430,
    fria: true,
    alcoholGrade: "5.0%",
  },
  {
    id: "patagonia-weizen-730",
    category: "cervezas",
    name: "Patagonia Weizen Botella",
    brand: "Patagonia",
    description: "Cerveza de trigo artesanal estilo alemán. Notas cítricas y especiadas. 730ml.",
    volume: "730 ml",
    priceARS: 5800,
    image: "🍺",
    tags: ["Trigo", "Artesanal", "Premium"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 35,
    rating: 4.9,
    reviews: 280,
    featured: true,
    fria: true,
    alcoholGrade: "5.3%",
  },
  {
    id: "stella-artois-lata-473",
    category: "cervezas",
    name: "Stella Artois Lata",
    brand: "Stella Artois",
    description: "Cerveza belga clásica. Equilibrada, refrescante y premium. Lata 473ml.",
    volume: "473 ml",
    priceARS: 2600,
    originalPriceARS: 3200,
    savingPercent: 19,
    image: "🍺",
    tags: ["Rubia", "Importada", "Belga"],
    logistics: ["delivery", "sumo"],
    stock: 55,
    rating: 4.7,
    reviews: 390,
    fria: true,
    alcoholGrade: "5.2%",
  },
  {
    id: "schneider-bidon-3l",
    category: "cervezas",
    name: "Schneider Rubia Bidón",
    brand: "Schneider",
    description: "Clásica cerveza argentina en bidón de 3 litros. Ideal para reuniones.",
    volume: "3 L",
    priceARS: 8900,
    originalPriceARS: 10500,
    savingPercent: 15,
    image: "🍺",
    tags: ["Rubia", "Nacional", "Bidón", "Evento"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 25,
    rating: 4.5,
    reviews: 180,
    fria: true,
    alcoholGrade: "5.0%",
  },
];

// ── FERNET & ESPIRITUOSAS ─────────────────────────────────────
export const fernetYSpirits: DrinkProduct[] = [
  {
    id: "fernet-branca-750",
    category: "fernet",
    name: "Fernet Branca Original",
    brand: "Branca",
    description: "El amaro italiano más famoso de Argentina. Intenso, herbal y perfectísimo con Coca-Cola. 750ml.",
    volume: "750 ml",
    priceARS: 14800,
    originalPriceARS: 17500,
    savingPercent: 15,
    image: "🥃",
    tags: ["Fernet", "Italiano", "Classic", "Con Coca"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 45,
    rating: 4.9,
    reviews: 850,
    featured: true,
    alcoholGrade: "39%",
  },
  {
    id: "fernet-1882-750",
    category: "fernet",
    name: "Fernet 1882",
    brand: "1882",
    description: "Fernet de producción nacional. Herbal y suave, ideal para quienes prefieren un sabor menos intenso.",
    volume: "750 ml",
    priceARS: 9200,
    originalPriceARS: 11000,
    savingPercent: 16,
    image: "🥃",
    tags: ["Fernet", "Nacional", "Suave"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 60,
    rating: 4.6,
    reviews: 420,
    flashDeal: true,
    alcoholGrade: "27%",
  },
  {
    id: "gin-beefeater-750",
    category: "fernet",
    name: "Gin Beefeater London Dry",
    brand: "Beefeater",
    description: "Gin londinense clásico. Notas cítricas y enebro. Perfecto para G&T o cócteles.",
    volume: "750 ml",
    priceARS: 22000,
    originalPriceARS: 26000,
    savingPercent: 15,
    image: "🍸",
    tags: ["Gin", "Importado", "Cóctel"],
    logistics: ["retiro", "delivery"],
    stock: 20,
    rating: 4.8,
    reviews: 310,
    featured: true,
    alcoholGrade: "40%",
  },
  {
    id: "vodka-absolut-750",
    category: "fernet",
    name: "Vodka Absolut Original",
    brand: "Absolut",
    description: "Vodka sueco premium. Puro, suave y versátil. Para shots, mezclas o cócteles.",
    volume: "750 ml",
    priceARS: 19500,
    image: "🍸",
    tags: ["Vodka", "Sueco", "Premium"],
    logistics: ["retiro", "delivery"],
    stock: 18,
    rating: 4.7,
    reviews: 290,
    alcoholGrade: "40%",
  },
  {
    id: "campari-750",
    category: "fernet",
    name: "Campari Aperitivo",
    brand: "Campari",
    description: "Aperitivo italiano amargo y vibrante. Ingrediente estrella del Negroni y Spritz.",
    volume: "750 ml",
    priceARS: 16800,
    image: "🥃",
    tags: ["Aperitivo", "Italiano", "Cóctel"],
    logistics: ["retiro", "delivery"],
    stock: 15,
    rating: 4.8,
    reviews: 210,
    alcoholGrade: "25%",
  },
];

// ── VINOS ─────────────────────────────────────────────────────
export const vinos: DrinkProduct[] = [
  {
    id: "malbec-trumpeter-750",
    category: "vinos",
    name: "Trumpeter Malbec",
    brand: "Rutini Wines",
    description: "Malbec mendocino de cuerpo medio. Frutas rojas, ciruela y toques de vainilla. Maridaje: carnes rojas.",
    volume: "750 ml",
    priceARS: 11500,
    originalPriceARS: 14000,
    savingPercent: 18,
    image: "🍷",
    tags: ["Malbec", "Tinto", "Mendoza"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 40,
    rating: 4.8,
    reviews: 420,
    featured: true,
    alcoholGrade: "13.5%",
  },
  {
    id: "zuccardi-valle-tinto",
    category: "vinos",
    name: "Zuccardi Valle de Uco Tinto",
    brand: "Zuccardi",
    description: "Blend premium de Mendoza. Complejo, elegante y perfecto para regalar.",
    volume: "750 ml",
    priceARS: 28000,
    image: "🍷",
    tags: ["Tinto", "Premium", "Regalo", "Mendoza"],
    logistics: ["retiro", "delivery"],
    stock: 12,
    rating: 4.9,
    reviews: 180,
    featured: true,
    alcoholGrade: "14%",
  },
  {
    id: "santa-julia-malbec-rose",
    category: "vinos",
    name: "Santa Julia Malbec Rosado",
    brand: "Santa Julia",
    description: "Rosado fresco y afrutado. Fresas, frambuesas y toque floral. Perfecto frío.",
    volume: "750 ml",
    priceARS: 8900,
    originalPriceARS: 11000,
    savingPercent: 19,
    image: "🍷",
    tags: ["Rosado", "Fresco", "Verano"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 30,
    rating: 4.6,
    reviews: 260,
    flashDeal: true,
    alcoholGrade: "12.5%",
  },
  {
    id: "alamos-chardonnay-750",
    category: "vinos",
    name: "Alamos Chardonnay",
    brand: "Alamos",
    description: "Chardonnay mendocino. Frutas tropicales, manteca y buena acidez. Ideal con pescados.",
    volume: "750 ml",
    priceARS: 9800,
    image: "🥂",
    tags: ["Blanco", "Chardonnay", "Mariscos"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 25,
    rating: 4.7,
    reviews: 195,
    alcoholGrade: "13%",
  },
];

// ── GASEOSAS & AGUA ───────────────────────────────────────────
export const gaseosas: DrinkProduct[] = [
  {
    id: "coca-cola-2l-25",
    category: "gaseosas",
    name: "Coca-Cola Regular",
    brand: "Coca-Cola",
    description: "La Coca-Cola clásica de siempre. Pack x6 botellas de 2.25L. Imprescindible para mezclar.",
    volume: "2.25 L × 6",
    priceARS: 15000,
    originalPriceARS: 18000,
    savingPercent: 17,
    image: "🥤",
    tags: ["Cola", "Mezcla", "Pack", "Fernet+Cola"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 90,
    rating: 4.9,
    reviews: 980,
    featured: true,
    fria: false,
  },
  {
    id: "sprite-2l",
    category: "gaseosas",
    name: "Sprite 2L",
    brand: "Coca-Cola",
    description: "Gaseosa lima-limón refrescante. Ideal con vodka, gin o para tomar sola bien fría.",
    volume: "2 L",
    priceARS: 2400,
    originalPriceARS: 2900,
    savingPercent: 17,
    image: "🥤",
    tags: ["Lima-Limón", "Mezcla", "Gin+Sprite"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 75,
    rating: 4.7,
    reviews: 520,
    fria: false,
  },
  {
    id: "schweppes-tonica-1l",
    category: "gaseosas",
    name: "Schweppes Agua Tónica",
    brand: "Schweppes",
    description: "Agua tónica refrescante con quinina. Imprescindible para el G&T perfecto.",
    volume: "1 L",
    priceARS: 2100,
    image: "🥤",
    tags: ["Tónica", "Gin & Tonic", "Mixología"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 55,
    rating: 4.8,
    reviews: 340,
    featured: false,
    flashDeal: true,
  },
  {
    id: "agua-villavicencio-1l",
    category: "gaseosas",
    name: "Agua Mineral Villavicencio",
    brand: "Villavicencio",
    description: "Agua mineral natural sin gas. Para hidratarse entre tragos y para los que no toman alcohol.",
    volume: "1.5 L",
    priceARS: 1200,
    image: "💧",
    tags: ["Agua", "Sin Gas", "Hidratación"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 200,
    rating: 4.6,
    reviews: 420,
    minUnits: 6,
  },
];

// ── HIELO & EXTRAS ────────────────────────────────────────────
export const hieloYExtras: DrinkProduct[] = [
  {
    id: "hielo-bolsa-3kg",
    category: "hielo",
    name: "Hielo en Cubos 3kg",
    brand: "Hielería AXO",
    description: "Hielo en cubos perfectos de 3kg. Siempre frío y entregado dentro de los 30 minutos.",
    volume: "3 kg",
    priceARS: 2800,
    originalPriceARS: 3200,
    savingPercent: 13,
    image: "🧊",
    tags: ["Hielo", "Cubos", "Express", "Fiesta"],
    logistics: ["delivery", "sumo"],
    stock: 50,
    rating: 4.9,
    reviews: 560,
    featured: true,
    flashDeal: true,
    fria: true,
  },
  {
    id: "hielo-media-luna-5kg",
    category: "hielo",
    name: "Hielo Media Luna 5kg",
    brand: "Hielería AXO",
    description: "Hielo en bloques medios. Mayor duración para coolers y hieleras de eventos.",
    volume: "5 kg",
    priceARS: 4200,
    image: "🧊",
    tags: ["Hielo", "Media Luna", "Evento", "Hielera"],
    logistics: ["delivery", "sumo"],
    stock: 35,
    rating: 4.8,
    reviews: 280,
    fria: true,
  },
  {
    id: "vasos-descartables-x50",
    category: "hielo",
    name: "Vasos Descartables x50",
    brand: "AXO Extras",
    description: "Vasos de plástico transparente 500cc. Pack x50 unidades. Ideales para fiestas.",
    volume: "500 cc × 50 u",
    priceARS: 2100,
    image: "🥛",
    tags: ["Vasos", "Descartables", "Fiesta", "Pack"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 80,
    rating: 4.5,
    reviews: 190,
  },
  {
    id: "limon-bolsa-kg",
    category: "hielo",
    name: "Limones Bolsa 1kg",
    brand: "Verdulería Fresca",
    description: "Limones frescos seleccionados. Imprescindibles con Corona, G&T, caipirinhas y más.",
    volume: "1 kg",
    priceARS: 1800,
    image: "🍋",
    tags: ["Limón", "Fresco", "Cóctel", "Corona"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 40,
    rating: 4.7,
    reviews: 230,
  },
];

// ── PACKS PARA EVENTOS ────────────────────────────────────────
export const packs: DrinkProduct[] = [
  {
    id: "pack-futbol",
    category: "packs",
    name: "Pack Fútbol AXO ⚽",
    brand: "AXO Packs",
    description: "El combo perfecto para ver el partido: 6 Quilmes 1L + 1 Fernet Branca 750ml + 2 Coca-Cola 2.25L + Hielo 3kg.",
    volume: "Combo Fútbol",
    priceARS: 42000,
    originalPriceARS: 52000,
    savingPercent: 19,
    image: "⚽",
    tags: ["Combo", "Fútbol", "Ahorro", "Pack Completo"],
    logistics: ["delivery", "sumo"],
    stock: 20,
    rating: 5.0,
    reviews: 180,
    featured: true,
    flashDeal: true,
    fria: true,
    minUnits: 1,
  },
  {
    id: "pack-cumple",
    category: "packs",
    name: "Pack Cumpleaños 🎂",
    brand: "AXO Packs",
    description: "¡Para festejar en grande! 12 Cervezas variadas + 1 botella de vino + 4 gaseosas + Hielo 5kg + Vasos x50.",
    volume: "Combo Cumple",
    priceARS: 58000,
    originalPriceARS: 72000,
    savingPercent: 19,
    image: "🎂",
    tags: ["Combo", "Cumpleaños", "Fiesta", "Completo"],
    logistics: ["delivery", "sumo"],
    stock: 15,
    rating: 4.9,
    reviews: 140,
    featured: true,
    fria: true,
  },
  {
    id: "pack-gin-tonic",
    category: "packs",
    name: "Kit G&T Gourmet 🍸",
    brand: "AXO Packs",
    description: "Todo para el G&T perfecto: Gin Beefeater 750ml + 6 Schweppes Tónica 1L + Limones 1kg + Hielo 3kg.",
    volume: "Combo G&T",
    priceARS: 38500,
    originalPriceARS: 46000,
    savingPercent: 16,
    image: "🍸",
    tags: ["Gin Tonic", "Gourmet", "Verano", "Pack"],
    logistics: ["delivery", "sumo"],
    stock: 18,
    rating: 4.9,
    reviews: 95,
    featured: true,
  },
  {
    id: "pack-fernet-cola",
    category: "packs",
    name: "Combo Fernet + Coca 🥃",
    brand: "AXO Packs",
    description: "La combinación más argentina: Fernet Branca 750ml + Fernet 1882 750ml + 6 Coca-Cola 2.25L + Hielo 3kg.",
    volume: "Combo Fernet",
    priceARS: 49000,
    originalPriceARS: 60000,
    savingPercent: 18,
    image: "🥃",
    tags: ["Fernet", "Coca", "Clásico", "Argentina"],
    logistics: ["delivery", "sumo"],
    stock: 22,
    rating: 4.9,
    reviews: 320,
    featured: true,
    flashDeal: true,
    fria: true,
  },
];

// ── Exportaciones combinadas ───────────────────────────────────
export const allDrinkProducts: DrinkProduct[] = [
  ...cervezas,
  ...fernetYSpirits,
  ...vinos,
  ...gaseosas,
  ...hieloYExtras,
  ...packs,
];

// ── Órdenes de entrega express ────────────────────────────────
export interface DeliveryOrder {
  id: string;
  numero: number;
  customerName: string;
  phone: string;
  zona: string;
  address: string;
  items: { name: string; qty: number }[];
  totalARS: number;
  status: OrderStatus;
  paymentMethod: "efectivo" | "transferencia" | "mercadopago";
  distanceKm: number;
  earningsARS: number;
  minutesAgo: number;
  priority: "urgente" | "normal" | "baja";
}

export const deliveryOrders: DeliveryOrder[] = [
  {
    id: "ord-001",
    numero: 1048,
    customerName: "Matías Fernández",
    phone: "+54 376 4123456",
    zona: "Villa Sarita",
    address: "Calle Los Pinos 240, Villa Sarita",
    items: [
      { name: "Pack Fútbol AXO", qty: 1 },
      { name: "Hielo 3kg", qty: 2 },
    ],
    totalARS: 47600,
    status: "pendiente",
    paymentMethod: "mercadopago",
    distanceKm: 3.4,
    earningsARS: 4200,
    minutesAgo: 2,
    priority: "urgente",
  },
  {
    id: "ord-002",
    numero: 1047,
    customerName: "Laura Romero",
    phone: "+54 376 4987654",
    zona: "Centro",
    address: "Av. Roca 1850, Centro",
    items: [
      { name: "Fernet Branca 750ml", qty: 2 },
      { name: "Coca-Cola 2.25L x6", qty: 1 },
      { name: "Hielo 3kg", qty: 1 },
    ],
    totalARS: 43400,
    status: "pendiente",
    paymentMethod: "transferencia",
    distanceKm: 1.8,
    earningsARS: 2900,
    minutesAgo: 5,
    priority: "normal",
  },
  {
    id: "ord-003",
    numero: 1046,
    customerName: "Roberto Sánchez",
    phone: "+54 376 4456789",
    zona: "Itaembé Miní",
    address: "Calle Tarumá 890, Itaembé Miní",
    items: [
      { name: "Quilmes Botella 1L", qty: 6 },
      { name: "Sprite 2L", qty: 2 },
    ],
    totalARS: 27600,
    status: "en_camino",
    paymentMethod: "efectivo",
    distanceKm: 5.2,
    earningsARS: 3800,
    minutesAgo: 12,
    priority: "normal",
  },
  {
    id: "ord-004",
    numero: 1045,
    customerName: "Ana González",
    phone: "+54 376 4789012",
    zona: "Chacra 29",
    address: "Ruta Nacional 12 Km 8, Chacra 29",
    items: [
      { name: "Kit G&T Gourmet", qty: 1 },
      { name: "Vasos Descartables x50", qty: 2 },
    ],
    totalARS: 42700,
    status: "pendiente",
    paymentMethod: "mercadopago",
    distanceKm: 6.8,
    earningsARS: 5100,
    minutesAgo: 1,
    priority: "urgente",
  },
  {
    id: "ord-005",
    numero: 1044,
    customerName: "Diego López",
    phone: "+54 376 4321098",
    zona: "San Isidro",
    address: "Calle San Martín 450, San Isidro",
    items: [
      { name: "Combo Fernet + Coca", qty: 1 },
    ],
    totalARS: 49000,
    status: "entregado",
    paymentMethod: "efectivo",
    distanceKm: 2.9,
    earningsARS: 3600,
    minutesAgo: 28,
    priority: "baja",
  },
];

// ── Stats del distribuidor ────────────────────────────────────
export interface DistribuidorStats {
  pedidosHoy: number;
  ventasHoyARS: number;
  pedidosPendientes: number;
  promedioTiempoEntrega: number; // minutos
  topProducto: string;
  rating: number;
  pedidosSemana: number[];
}

export const distribuidorStats: DistribuidorStats = {
  pedidosHoy: 34,
  ventasHoyARS: 1_420_000,
  pedidosPendientes: 4,
  promedioTiempoEntrega: 22,
  topProducto: "Fernet Branca 750ml",
  rating: 4.9,
  pedidosSemana: [18, 25, 31, 22, 40, 52, 34],
};

// ── Solicitudes de viaje (para conductor) ─────────────────────
export interface RideRequest {
  id: string;
  passengerName: string;
  origin: string;
  destination: string;
  distanceKm: number;
  fareARS: number;
  rideType: VehicleType;
  timePosted: string;
}
export const rideRequests: RideRequest[] = [];

// ── Utils ─────────────────────────────────────────────────────
export function formatARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getCategoryProducts(cat: DrinkCategory): DrinkProduct[] {
  const map: Record<DrinkCategory, DrinkProduct[]> = {
    cervezas: cervezas,
    fernet: fernetYSpirits,
    vinos: vinos,
    gaseosas: gaseosas,
    hielo: hieloYExtras,
    packs: packs,
  };
  return map[cat] ?? [];
}


// ── COMPATIBILITY EXPORTS (Legacy Views & Components) ─────────
export type Category = DrinkCategory;
export type Product = DrinkProduct;
export const allProducts: DrinkProduct[] = allDrinkProducts;

export const gastroProducts: DrinkProduct[] = [
  ...cervezas.slice(0, 3),
  ...hieloYExtras.slice(0, 2),
  ...packs.slice(0, 2),
];

export const techProducts: DrinkProduct[] = [
  ...fernetYSpirits.slice(0, 3),
  ...vinos.slice(0, 3),
];

export interface RideOption {
  id: string;
  name: string;
  vehicle: VehicleType;
  description: string;
  baseFareARS: number;
  perKmARS: number;
  etaMinutes: number;
  icon: string;
  tags: string[];
  popular?: boolean;
}

export const rideOptions: RideOption[] = [
  {
    id: "axo-moto-rapida",
    name: "AXO Moto Express",
    vehicle: "moto",
    description: "Reparto ultrarrápido de bebidas y hielo en Posadas",
    baseFareARS: 1800,
    perKmARS: 420,
    etaMinutes: 3,
    icon: "🛵",
    tags: ["Ultra Rápido", "Bebidas Frías"],
    popular: true,
  },
  {
    id: "axo-auto-std",
    name: "AXO Auto / Utilitario",
    vehicle: "auto",
    description: "Ideal para packs pesados de eventos, barriles o hielo",
    baseFareARS: 3200,
    perKmARS: 700,
    etaMinutes: 6,
    icon: "🚗",
    tags: ["Packs Grandes", "Eventos"],
  },
];

export function calcRideFare(option: RideOption, km: number): number {
  return option.baseFareARS + option.perKmARS * km;
}
