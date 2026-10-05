"use client";

// ================================================================
//  AXO — Modal de Inicio de Sesión y Acceso Rápido para Pruebas
// ================================================================

import { useState } from "react";
import { X, Lock, Mail, ArrowRight, Store, Package, UserCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/authContext";

export function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, quickLogin, setSellerModalOpen, setDriverModalOpen } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!loginModalOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // En producción se conecta a Supabase: supabase.auth.signInWithPassword({ email, password })
    if (email.toLowerCase().includes("driver") || email.toLowerCase().includes("moto")) {
      quickLogin("driver");
    } else {
      quickLogin("seller");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-axo-card-lg border border-axo-border w-full max-w-md overflow-hidden animate-slide-up">

        {/* Header */}
        <div className="p-6 border-b border-axo-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-axo-gradient flex items-center justify-center text-white font-black text-sm">
              A
            </div>
            <div>
              <h3 className="font-black text-axo-text text-base">Acceso a Paneles de Gestión</h3>
              <p className="text-[11px] text-axo-muted">Comercios Aliados & Red de Repartidores</p>
            </div>
          </div>
          <button
            onClick={() => setLoginModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-axo-bg text-axo-muted hover:text-axo-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Accesos rápidos para Demos / Inversores */}
          <div className="bg-axo-bg border border-axo-border rounded-2xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-axo-text">
              <Sparkles size={14} className="text-axo-cyan" />
              <span>Accesos Rápidos de Prueba (Demo en 1 Clic):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => quickLogin("seller")}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-axo-border hover:border-axo-cyan text-left transition-all group"
              >
                <Store size={16} className="text-axo-cyan group-hover:scale-110 transition-transform flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-axo-text truncate">Deli Drinks</p>
                  <p className="text-[10px] text-axo-muted">Comercio Aprobado</p>
                </div>
              </button>

              <button
                onClick={() => quickLogin("driver")}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-axo-border hover:border-purple-400 text-left transition-all group"
              >
                <Package size={16} className="text-purple-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-axo-text truncate">Móvil #08 Rodrigo</p>
                  <p className="text-[10px] text-axo-muted">Repartidor Activo</p>
                </div>
              </button>
            </div>
          </div>

          {/* Formulario tradicional simulado */}
          <form onSubmit={handleManualLogin} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold text-axo-text block mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-axo-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ej: comercio@posadas.com"
                  className="axo-input pl-9 text-xs py-2.5"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-axo-text block mb-1">Contraseña</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-axo-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="axo-input pl-9 text-xs py-2.5"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-axo-cyan hover:bg-axo-cyan-dim text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 mt-1"
            >
              <UserCheck size={14} />
              <span>Iniciar Sesión</span>
            </button>
          </form>

          {/* Enlaces de registro */}
          <div className="pt-2 border-t border-axo-border text-center flex flex-col gap-2">
            <p className="text-xs text-axo-muted">¿Todavía no formás parte del ecosistema AXO?</p>
            <div className="flex items-center justify-center gap-3 text-xs font-bold">
              <button
                onClick={() => {
                  setLoginModalOpen(false);
                  setSellerModalOpen(true);
                }}
                className="text-axo-cyan hover:underline"
              >
                Sumar mi Comercio
              </button>
              <span className="text-axo-muted">•</span>
              <button
                onClick={() => {
                  setLoginModalOpen(false);
                  setDriverModalOpen(true);
                }}
                className="text-purple-600 hover:underline"
              >
                Ser Repartidor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
