import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        axo: {
          // ── Surfaces & Backgrounds ──────────────────────────
          bg:           "#F8F9FA",   // page background — light gray
          "bg-card":    "#FFFFFF",   // card / panel surface
          "bg-card-hover": "#F0F4FF", // card hover
          "bg-section": "#EEF2FF",   // section accent (blue-tinted)

          // ── Borders ──────────────────────────────────────────
          border:       "#E5E7EB",   // default border
          "border-focus": "#2563EB", // focus ring

          // ── Brand Blue — Corporate / Trust ───────────────────
          cyan:         "#2563EB",   // primary action blue (renamed alias)
          "cyan-dim":   "#1D4ED8",   // hover state
          "blue-light": "#DBEAFE",   // light blue tint for badges
          "blue-mid":   "#93C5FD",   // mid blue

          // ── Brand Green — CTA / Savings / Success ─────────────
          emerald:      "#059669",   // primary green
          "emerald-dim":"#047857",   // hover
          "emerald-light":"#D1FAE5", // light green tint

          // ── Semantic ──────────────────────────────────────────
          purple:       "#7C3AED",
          amber:        "#D97706",
          red:          "#DC2626",

          // ── Typography ────────────────────────────────────────
          text:         "#111827",   // headings / primary text
          "text-2":     "#374151",   // body text
          muted:        "#6B7280",   // secondary / placeholder
          "muted-2":    "#9CA3AF",   // very subtle text
        },
      },
      transitionDuration: {
        "1600": "1600ms",
      },
      backgroundImage: {
        "axo-gradient":        "linear-gradient(135deg, #2563EB 0%, #059669 100%)",
        "axo-gradient-hero":   "linear-gradient(135deg, #1E40AF 0%, #065F46 100%)",
        "axo-gradient-purple": "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
        "axo-card-glow":       "radial-gradient(ellipse at top left, #2563EB08 0%, transparent 60%)",
        "axo-hero-pattern":    "linear-gradient(135deg, #EEF2FF 0%, #ECFDF5 100%)",
      },
      boxShadow: {
        "axo-glow":    "0 0 0 3px #2563EB25",
        "axo-glow-sm": "0 0 0 2px #2563EB20",
        "axo-emerald": "0 0 0 3px #05966925",
        "axo-card":    "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
        "axo-card-md": "0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
        "axo-card-lg": "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-slow":  "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow":   "spin 8s linear infinite",
        "fade-in":     "fadeIn 0.3s ease-in-out",
        "slide-up":    "slideUp 0.4s ease-out",
        "radar-ping":  "radarPing 2s ease-out infinite",
        "bounce-sm":   "bounceSm 1s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        radarPing: {
          "0%":   { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        bounceSm: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-3px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
