// ============================================================
//  AXO APP — Mock Data Engine
//  Ecosistema Comercial Regional: Posadas & Encarnación
// ============================================================

export type Category = "movilidad" | "gastronomia" | "tecnologia";
export type LogisticsMode = "retiro" | "delivery" | "sumo";
export type VehicleType = "auto" | "moto" | "ejecutivo";
export type OrderStatus = "pendiente" | "en_camino" | "entregado" | "cancelado";

// ─── MOVILIDAD ────────────────────────────────────────────────
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
    id: "axo-auto-std",
    name: "AXO Auto Estándar",
    vehicle: "auto",
    description: "Traslado urbano cómodo y seguro dentro de Posadas",
    baseFareARS: 2800,
    perKmARS: 650,
    etaMinutes: 4,
    icon: "🚗",
    tags: ["Económico", "Urbano"],
    popular: true,
  },
  {
    id: "axo-moto-rapida",
    name: "AXO Moto Rápida",
    vehicle: "moto",
    description: "La opción más veloz para trayectos cortos en la ciudad",
    baseFareARS: 1500,
    perKmARS: 380,
    etaMinutes: 2,
    icon: "🏍️",
    tags: ["Ultra Rápido", "Económico"],
  },
  {
    id: "axo-ejecutivo",
    name: "Traslado Ejecutivo",
    vehicle: "ejecutivo",
    description: "Vehículo premium, aire acondicionado y WiFi a bordo",
    baseFareARS: 5200,
    perKmARS: 1100,
    etaMinutes: 7,
    icon: "🚙",
    tags: ["Premium", "WiFi", "A/C"],
  },
  {
    id: "axo-puente",
    name: "Compras al Puente",
    vehicle: "auto",
    description: "Traslado especial Posadas ↔ Encarnación — ideal para compras",
    baseFareARS: 18000,
    perKmARS: 0,
    etaMinutes: 15,
    icon: "🌉",
    tags: ["Especial", "Encarnación", "Compras"],
    popular: true,
  },
  {
    id: "axo-grupal",
    name: "AXO Grupal / Van",
    vehicle: "ejecutivo",
    description: "Hasta 6 pasajeros, ideal para grupos o equipos de trabajo",
    baseFareARS: 6500,
    perKmARS: 900,
    etaMinutes: 10,
    icon: "🚐",
    tags: ["Grupal", "Capacidad 6"],
  },
];

// ─── GASTRONOMÍA Y CONSUMO MASIVO ────────────────────────────
export interface Product {
  id: string;
  category: Category;
  name: string;
  brand: string;
  description: string;
  priceARS: number;
  originalPriceARS?: number;
  savingPercent?: number;
  unit: string;
  image: string;
  tags: string[];
  logistics: LogisticsMode[];
  stock: number;
  rating: number;
  reviews: number;
  featured?: boolean;
  flashDeal?: boolean;
  origin?: string;
}

export const gastroProducts: Product[] = [
  {
    id: "duomo-cuarto-kg",
    category: "gastronomia",
    name: "Helado Cuarto Kg — Sabores Seleccionados",
    brand: "Duomo Heladerías",
    description: "Crema americana, Dulce de leche granizado o Maracuyá sorbet. El sabor de Posadas.",
    priceARS: 4800,
    originalPriceARS: 6200,
    savingPercent: 23,
    unit: "250g",
    image: "🍨",
    tags: ["Helado Artesanal", "Posadas", "Duomo"],
    logistics: ["retiro", "delivery"],
    stock: 45,
    rating: 4.9,
    reviews: 312,
    featured: true,
    origin: "Posadas",
  },
  {
    id: "duomo-torta-hela",
    category: "gastronomia",
    name: "Torta Helada Familiar",
    brand: "Duomo Heladerías",
    description: "Torta helada 1kg. Perfecta para celebraciones. Doble sabor a elección.",
    priceARS: 18500,
    originalPriceARS: 22000,
    savingPercent: 16,
    unit: "1 kg",
    image: "🎂",
    tags: ["Torta", "Familiar", "Ocasión Especial"],
    logistics: ["retiro", "delivery"],
    stock: 12,
    rating: 4.8,
    reviews: 87,
    origin: "Posadas",
  },
  {
    id: "combo-super-familiar",
    category: "gastronomia",
    name: "Combo Familiar Semanal — Supermercado",
    brand: "AXO Market",
    description: "Leche x6, arroz 2kg, aceite 900ml, fideos 500g x3, azúcar 1kg. Canasta básica cubierta.",
    priceARS: 29900,
    originalPriceARS: 38500,
    savingPercent: 22,
    unit: "Pack 12 productos",
    image: "🛒",
    tags: ["Despensa", "Ahorro", "Combo"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 200,
    rating: 4.7,
    reviews: 543,
    featured: true,
    flashDeal: true,
    origin: "Posadas",
  },
  {
    id: "pan-artesanal",
    category: "gastronomia",
    name: "Pan Casero Artesanal — Docena",
    brand: "Panadería Don Ramón",
    description: "Pan de masa madre, horneado cada mañana. Sin conservantes. Entrega antes de las 9am.",
    priceARS: 3200,
    unit: "12 unidades",
    image: "🍞",
    tags: ["Panadería", "Artesanal", "Sin Conservantes"],
    logistics: ["retiro", "delivery"],
    stock: 80,
    rating: 4.6,
    reviews: 189,
    origin: "Posadas",
  },
  {
    id: "medialunas-combo",
    category: "gastronomia",
    name: "Medialunas de Manteca — 24 unidades",
    brand: "Panadería Don Ramón",
    description: "Crocantes por fuera, suaves por dentro. El desayuno perfecto para toda la familia.",
    priceARS: 5600,
    originalPriceARS: 6800,
    savingPercent: 18,
    unit: "24 unidades",
    image: "🥐",
    tags: ["Desayuno", "Oferta", "Medialunas"],
    logistics: ["retiro", "delivery"],
    stock: 60,
    rating: 4.8,
    reviews: 214,
    flashDeal: true,
    origin: "Posadas",
  },
  {
    id: "mate-premium-pack",
    category: "gastronomia",
    name: "Yerba Mate Premium + Bombilla",
    brand: "Campo Verde",
    description: "Yerba seleccionada de campos misioneros + bombilla de alpaca. Combo listo para usar.",
    priceARS: 8900,
    originalPriceARS: 11500,
    savingPercent: 23,
    unit: "1kg + bombilla",
    image: "🧉",
    tags: ["Mate", "Misiones", "Regional"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 95,
    rating: 4.9,
    reviews: 408,
    featured: true,
    origin: "Misiones",
  },
];

// ─── TECNOLOGÍA Y BIENES ─────────────────────────────────────
export const techProducts: Product[] = [
  {
    id: "auriculares-tws",
    category: "tecnologia",
    name: "Auriculares TWS Pro 5.3",
    brand: "SoundAXO",
    description: "Bluetooth 5.3, cancelación activa de ruido, 32h batería. Disponible en local Posadas.",
    priceARS: 42500,
    originalPriceARS: 58000,
    savingPercent: 27,
    unit: "1 unidad",
    image: "🎧",
    tags: ["Audio", "Bluetooth", "ANC", "Oferta"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 18,
    rating: 4.7,
    reviews: 93,
    featured: true,
    origin: "Corredor Regional",
  },
  {
    id: "smartwatch-fit",
    category: "tecnologia",
    name: "Smartwatch FitPro X2",
    brand: "TechZone",
    description: "Monitor cardíaco, GPS, SpO2, 7 días batería. Compatible Android e iOS.",
    priceARS: 68000,
    originalPriceARS: 95000,
    savingPercent: 28,
    unit: "1 unidad",
    image: "⌚",
    tags: ["Wearable", "Salud", "GPS"],
    logistics: ["retiro", "sumo"],
    stock: 9,
    rating: 4.5,
    reviews: 61,
    flashDeal: true,
    origin: "Encarnación / Importado",
  },
  {
    id: "cargador-rapido-65w",
    category: "tecnologia",
    name: "Cargador Rápido GaN 65W",
    brand: "PowerAXO",
    description: "Carga 3 dispositivos simultáneos. USB-C + USB-A. Compatible con notebooks.",
    priceARS: 22800,
    originalPriceARS: 31000,
    savingPercent: 26,
    unit: "1 unidad",
    image: "⚡",
    tags: ["Accesorios", "Carga Rápida", "GaN"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 34,
    rating: 4.8,
    reviews: 177,
    origin: "Corredor Regional",
  },
  {
    id: "mochila-antirrobo",
    category: "tecnologia",
    name: "Mochila Antirrobo TechPack 20L",
    brand: "SafeCarry",
    description: "Puerto USB externo, tela impermeable, compartimento para laptop 15.6\". Ideal viajes.",
    priceARS: 38500,
    unit: "1 unidad",
    image: "🎒",
    tags: ["Accesorios", "Viaje", "Seguridad"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 22,
    rating: 4.6,
    reviews: 88,
    origin: "Posadas",
  },
  {
    id: "mouse-gaming",
    category: "tecnologia",
    name: "Mouse Gaming RGB 16000 DPI",
    brand: "ClickPro",
    description: "Sensor óptico preciso, 7 botones programables, RGB personalizable. Cable trenzado.",
    priceARS: 18900,
    originalPriceARS: 26000,
    savingPercent: 27,
    unit: "1 unidad",
    image: "🖱️",
    tags: ["Gaming", "RGB", "Periférico"],
    logistics: ["retiro", "delivery", "sumo"],
    stock: 41,
    rating: 4.7,
    reviews: 203,
    flashDeal: true,
    origin: "Corredor Regional",
  },
  {
    id: "tablet-10-pulgadas",
    category: "tecnologia",
    name: "Tablet 10\" Android 14 — 4GB/128GB",
    brand: "ViewTab",
    description: "Pantalla Full HD, cámara 13MP, 6000mAh. Ideal trabajo y estudio. Stock limitado.",
    priceARS: 185000,
    originalPriceARS: 240000,
    savingPercent: 23,
    unit: "1 unidad",
    image: "📱",
    tags: ["Tablet", "Android", "Estudio"],
    logistics: ["retiro", "sumo"],
    stock: 5,
    rating: 4.4,
    reviews: 34,
    featured: true,
    origin: "Encarnación / Importado",
  },
];

export const allProducts: Product[] = [...gastroProducts, ...techProducts];

// ─── ÓRDENES LOGÍSTICA (Sumo Envíos) ─────────────────────────
export interface DeliveryOrder {
  id: string;
  customerName: string;
  productName: string;
  origin: string;
  destination: string;
  distanceKm: number;
  earningsARS: number;
  status: OrderStatus;
  priority: "alta" | "normal" | "baja";
  timePosted: string;
  lat: number;
  lng: number;
}

export const deliveryOrders: DeliveryOrder[] = [
  {
    id: "ord-001",
    customerName: "María González",
    productName: "Combo Familiar Semanal (x2)",
    origin: "AXO Market — Centro",
    destination: "Barrio Itaembé Miní, Posadas",
    distanceKm: 4.2,
    earningsARS: 3800,
    status: "pendiente",
    priority: "alta",
    timePosted: "hace 2 min",
    lat: -27.3669,
    lng: -55.8967,
  },
  {
    id: "ord-002",
    customerName: "Carlos Ruiz",
    productName: "Auriculares TWS Pro 5.3",
    origin: "TechZone — Local Shopping",
    destination: "Av. Rademacher 1200, Posadas",
    distanceKm: 2.8,
    earningsARS: 2600,
    status: "pendiente",
    priority: "normal",
    timePosted: "hace 5 min",
    lat: -27.3720,
    lng: -55.9012,
  },
  {
    id: "ord-003",
    customerName: "Laura Benítez",
    productName: "Helado + Torta Duomo",
    origin: "Duomo Heladerías — Sucursal Sur",
    destination: "Calle San Lorenzo 450, Posadas",
    distanceKm: 1.5,
    earningsARS: 1900,
    status: "pendiente",
    priority: "alta",
    timePosted: "hace 1 min",
    lat: -27.3608,
    lng: -55.8934,
  },
  {
    id: "ord-004",
    customerName: "Roberto Aquino",
    productName: "Pack Yerba Mate + Accesorios",
    origin: "AXO Market — Sucursal Norte",
    destination: "Barrio A4, Posadas",
    distanceKm: 6.1,
    earningsARS: 4500,
    status: "en_camino",
    priority: "normal",
    timePosted: "hace 12 min",
    lat: -27.3455,
    lng: -55.9087,
  },
  {
    id: "ord-005",
    customerName: "Ana Monzón",
    productName: "Cargador GaN 65W + Mouse Gaming",
    origin: "TechZone — Centro",
    destination: "Av. Quaranta 2800, Posadas",
    distanceKm: 3.3,
    earningsARS: 3100,
    status: "pendiente",
    priority: "baja",
    timePosted: "hace 8 min",
    lat: -27.3789,
    lng: -55.8845,
  },
];

// ─── SOLICITUDES DE VIAJE ─────────────────────────────────────
export interface RideRequest {
  id: string;
  passengerName: string;
  origin: string;
  destination: string;
  distanceKm: number;
  fareARS: number;
  rideType: VehicleType;
  timePosted: string;
  special?: string;
}

export const rideRequests: RideRequest[] = [
  {
    id: "ride-001",
    passengerName: "Sofía Ramírez",
    origin: "Terminal de Ómnibus, Posadas",
    destination: "Hotel Julio César, Centro",
    distanceKm: 3.2,
    fareARS: 4880,
    rideType: "auto",
    timePosted: "hace 30 seg",
  },
  {
    id: "ride-002",
    passengerName: "Diego Pereira",
    origin: "Av. López Torres 1500",
    destination: "Puente Internacional Posadas–Encarnación",
    distanceKm: 11.5,
    fareARS: 18000,
    rideType: "ejecutivo",
    timePosted: "hace 1 min",
    special: "Viaje al Puente 🌉",
  },
  {
    id: "ride-003",
    passengerName: "Valentina López",
    origin: "UNaM — Facultad de Ciencias Exactas",
    destination: "Barrio San Isidro",
    distanceKm: 2.1,
    fareARS: 2265,
    rideType: "moto",
    timePosted: "hace 2 min",
  },
];

// ─── ESTADÍSTICAS VENDEDOR ─────────────────────────────────────
export interface SellerStats {
  totalSalesARS: number;
  ordersThisMonth: number;
  avgRating: number;
  pendingOrders: number;
  topProduct: string;
  conversionRate: number;
  activeListings: number;
}

export const sellerStats: SellerStats = {
  totalSalesARS: 847500,
  ordersThisMonth: 127,
  avgRating: 4.8,
  pendingOrders: 8,
  topProduct: "Combo Familiar Semanal",
  conversionRate: 68.4,
  activeListings: 23,
};

// ─── COMBOS FLASH (Vendedor) ──────────────────────────────────
export interface FlashCombo {
  id: string;
  name: string;
  priceARS: number;
  stock: number;
  expiresIn: string;
  sold: number;
}

export const flashCombos: FlashCombo[] = [
  {
    id: "flash-001",
    name: "Combo Verano: Helado + Medialunas",
    priceARS: 7800,
    stock: 30,
    expiresIn: "2h 45min",
    sold: 18,
  },
  {
    id: "flash-002",
    name: "Pack Gaming: Mouse + Pad + Auricular",
    priceARS: 32000,
    stock: 10,
    expiresIn: "5h 10min",
    sold: 4,
  },
];

// ─── UTILS ────────────────────────────────────────────────────
export function formatARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function calcRideFare(option: RideOption, km: number): number {
  return option.baseFareARS + option.perKmARS * km;
}
