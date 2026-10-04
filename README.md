# AXO App

## Ecosistema Comercial Regional — Posadas & Encarnación

> **MVP Interactivo v1.0** by Megasion Desarrollos INC.

---

### 🚀 Inicio rápido

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev
# → http://localhost:3000

# Build de producción
npm run build
npm start
```

---

### 📁 Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx          # Root layout con SEO y fuentes
│   ├── page.tsx            # Página principal
│   └── globals.css         # Sistema de diseño AXO
├── components/
│   ├── AppShell.tsx        # Shell principal: nav + roles
│   ├── views/
│   │   ├── MarketView.tsx  # 🛒 Vista Comprador — Productos
│   │   ├── MoveView.tsx    # 🚗 Vista Comprador — Movilidad
│   │   ├── SellerView.tsx  # 🏪 Vista Vendedor — Panel
│   │   └── DriverView.tsx  # 📦 Vista Conductor — Radar
│   ├── products/
│   │   └── ProductCard.tsx # Tarjeta de producto
│   └── ui/
│       ├── Badge.tsx       # Insignias de estado
│       ├── SearchBar.tsx   # Buscador inteligente
│       └── StatCard.tsx    # Tarjeta de métricas
└── lib/
    ├── data.ts             # Motor de datos regional (mock)
    └── utils.ts            # Utilidades (cn, formatARS)
```

---

### 🌐 Deploy en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Vercel detecta Next.js automáticamente
3. Variables de entorno: ver `.env.example`
4. Deploy automático en cada push a `main`

---

### 🎨 Paleta AXO (Dark Fintech)

| Token | Valor | Uso |
|-------|-------|-----|
| `axo-bg` | `#0A0F1D` | Fondo principal |
| `axo-bg-card` | `#111827` | Tarjetas |
| `axo-cyan` | `#00F2FE` | Acción primaria |
| `axo-emerald` | `#00FF88` | Éxito / Delivery |
| `axo-border` | `#1E293B` | Bordes sutiles |

---

### 📱 Vistas principales

| Vista | Rol | Descripción |
|-------|-----|-------------|
| **Market** | Comprador | Productos, ofertas, filtros, logística |
| **Move** | Comprador | Solicitar traslados urbanos y al puente |
| **Mi Negocio** | Vendedor | Panel, Combos Flash 1 clic, stock |
| **Radar** | Conductor | Entregas pendientes, viajes, ganancias |

---

*AXO © 2027 Megasion Desarrollos INC. — Posadas, Misiones, Argentina*
