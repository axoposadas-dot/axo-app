"use client";

// ================================================================
//  AXO — Demo Context
//  Gestiona el estado global de los Casos de Prueba para inversores
// ================================================================

import {
  createContext, useContext, useState, useCallback, type ReactNode,
} from "react";

export type DemoCase = "none" | "caso1" | "caso2" | "caso3";

export interface DemoCaseConfig {
  id: DemoCase;
  label: string;
  emoji: string;
  subtitle: string;
  color: string;          // Tailwind color class
  glowColor: string;      // CSS hex for glow effects
  role: "buyer" | "seller" | "driver";
  buyerMode?: "market" | "move";
}

export const demoCases: DemoCaseConfig[] = [
  {
    id: "caso1",
    label: "Compra Transfronteriza Tech",
    emoji: "🖥️",
    subtitle: "Litany Encarnación · Puente Monitor · AFIP/ARCA",
    color: "text-axo-cyan border-axo-cyan bg-axo-cyan/10",
    glowColor: "#00F2FE",
    role: "buyer",
    buyerMode: "market",
  },
  {
    id: "caso2",
    label: "Gastronomía & Logística Híbrida",
    emoji: "🍨",
    subtitle: "Sumo Envíos · Alerta WhatsApp · Duomo",
    color: "text-axo-emerald border-axo-emerald bg-axo-emerald/10",
    glowColor: "#00FF88",
    role: "driver",
  },
  {
    id: "caso3",
    label: "Movilidad Urbana AXO Move",
    emoji: "🚗",
    subtitle: "AXO Move · Rastreo GPS simulado",
    color: "text-purple-400 border-purple-500 bg-purple-500/10",
    glowColor: "#A855F7",
    role: "buyer",
    buyerMode: "move",
  },
];

interface DemoContextValue {
  activeCase: DemoCase;
  caseConfig: DemoCaseConfig | null;
  setCase: (c: DemoCase) => void;
  isDemoActive: boolean;
  exitDemo: () => void;
}

const DemoContext = createContext<DemoContextValue>({
  activeCase: "none",
  caseConfig: null,
  setCase: () => {},
  isDemoActive: false,
  exitDemo: () => {},
});

export function DemoProvider({ children }: { children: ReactNode }) {
  const [activeCase, setActiveCase] = useState<DemoCase>("none");

  const setCase = useCallback((c: DemoCase) => setActiveCase(c), []);
  const exitDemo = useCallback(() => setActiveCase("none"), []);

  const caseConfig =
    activeCase === "none"
      ? null
      : demoCases.find((d) => d.id === activeCase) ?? null;

  return (
    <DemoContext.Provider
      value={{
        activeCase,
        caseConfig,
        setCase,
        isDemoActive: activeCase !== "none",
        exitDemo,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  return useContext(DemoContext);
}
