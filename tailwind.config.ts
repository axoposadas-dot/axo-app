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
          bg: "#0A0F1D",
          "bg-card": "#111827",
          "bg-card-hover": "#1a2235",
          "border": "#1E293B",
          "border-glow": "#00F2FE40",
          cyan: "#00F2FE",
          "cyan-dim": "#00C5D4",
          emerald: "#00FF88",
          "emerald-dim": "#00CC6A",
          purple: "#7C3AED",
          amber: "#F59E0B",
          red: "#EF4444",
          text: "#E2E8F0",
          muted: "#64748B",
          "muted-2": "#334155",
        },
      },
      transitionDuration: {
        "1600": "1600ms",
      },
      backgroundImage: {
        "axo-gradient": "linear-gradient(135deg, #00F2FE 0%, #00FF88 100%)",
        "axo-gradient-purple": "linear-gradient(135deg, #7C3AED 0%, #00F2FE 100%)",
        "axo-card-glow": "radial-gradient(ellipse at top left, #00F2FE15 0%, transparent 60%)",
      },
      boxShadow: {
        "axo-glow": "0 0 20px #00F2FE30, 0 0 40px #00F2FE10",
        "axo-glow-sm": "0 0 10px #00F2FE25",
        "axo-emerald": "0 0 20px #00FF8830",
        "axo-card": "0 4px 24px rgba(0,0,0,0.4)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "radar-ping": "radarPing 2s ease-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        radarPing: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
