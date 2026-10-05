"use client";

// ================================================================
//  AXO — Protected Gate
//  Bloqueo elegante con llamadas a la acción para usuarios sin autorizar
// ================================================================

import { Shield, Store, Package, ArrowRight, Sparkles, CheckCircle2, Lock } from "lucide-react";
import { useAuth } from "@/lib/authContext";

interface ProtectedGateProps {
  role: "seller" | "driver";
}

export function ProtectedGate({ role }: ProtectedGateProps) {
  const { setSellerModalOpen, setDriverModalOpen, setLoginModalOpen, quickLogin, user } = useAuth();

  const isSeller = role === "seller";
  const isPending = user?.role === role && user?.status === "pending_approval";

  if (isPending) {
    return (
      <div className="bg-white border border-amber-200 rounded-3xl p-8 sm:p-12 shadow-axo-card text-center max-w-xl mx-auto my-8 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 text-amber-700 flex items-center justify-center text-3xl mx-auto mb-4">
          ⏳
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
          SOLICITUD EN PROCESO DE VALIDACIÓN
        </span>
        <h3 className="text-2xl font-black text-axo-text mt-3">
          Tu cuenta de {isSeller ? "Comercio" : "Repartidor"} está siendo revisada
        </h3>
        <p className="text-sm text-axo-muted mt-2 leading-relaxed">
          Ya recibimos los datos de tu postulación ({user?.name}). Nuestro equipo en Posadas se pondrá en contacto por WhatsApp ({user?.phone}) para completar la verificación y habilitar tu acceso al panel oficial.
        </p>

        <div className="mt-6 pt-6 border-t border-axo-border flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => quickLogin(role)}
            className="py-3 px-5 rounded-xl bg-axo-cyan hover:bg-axo-cyan-dim text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles size={14} /> Forzar Acceso Modo Demo (Inversores)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-axo-border rounded-3xl p-8 sm:p-12 shadow-axo-card max-w-2xl mx-auto my-6 text-center animate-fade-in">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-axo-cyan/20 to-axo-emerald/20 border border-axo-cyan/30 flex items-center justify-center text-3xl mx-auto mb-4">
        {isSeller ? <Store size={32} className="text-axo-cyan" /> : <Package size={32} className="text-purple-600" />}
      </div>

      <div className="inline-flex items-center gap-1.5 bg-axo-bg border border-axo-border px-3 py-1 rounded-full text-xs font-semibold text-axo-muted mb-2">
        <Lock size={12} className="text-amber-500" />
        <span>Acceso Restringido · Requiere Cuenta Habilitada</span>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-axo-text tracking-tight mt-1">
        {isSeller ? "Panel Exclusivo para Comercios Aliados" : "Panel Exclusivo para Repartidores Express"}
      </h3>

      <p className="text-sm text-axo-muted mt-2 max-w-md mx-auto leading-relaxed">
        {isSeller
          ? "Sumá tu distribuidora, vinoteca o kiosco en Posadas a la red AXO para gestionar catálogo, stock en tiempo real y recibir pedidos ya cobrados."
          : "Unite a la red logística de AXO en Posadas para acceder al radar de despachos en tiempo real, rutas inteligentes y cobros diarios."}
      </p>

      {/* Feature list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 text-left">
        {(isSeller ? [
          { title: "Cero Costo Fijo", desc: "Sin abonos mensuales, solo comisión por venta concretada." },
          { title: "Logística Resuelta", desc: "Los cadetes retiran y entregan en menos de 30 min." },
          { title: "Gestión en 1 Clic", desc: "Aceptá pedidos, pausá stock y mirá ventas del día." },
        ] : [
          { title: "Mejores Tarifas", desc: "Tarifa fija por envío + 100% de tus propinas en mano." },
          { title: "Radar Inteligente", desc: "Visualización de pedidos cercanos y rutas óptimas." },
          { title: "Pagos al Instante", desc: "Cobro en efectivo y liquidación diaria de saldo." },
        ]).map((item, idx) => (
          <div key={idx} className="bg-axo-bg border border-axo-border rounded-2xl p-3.5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-axo-text">
              <CheckCircle2 size={13} className="text-axo-emerald flex-shrink-0" />
              <span>{item.title}</span>
            </div>
            <p className="text-[11px] text-axo-muted leading-snug">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <button
          onClick={() => (isSeller ? setSellerModalOpen(true) : setDriverModalOpen(true))}
          className="py-3.5 px-6 rounded-xl bg-axo-cyan hover:bg-axo-cyan-dim text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span>{isSeller ? "Sumar mi Comercio a AXO" : "Quiero ser Repartidor"}</span>
          <ArrowRight size={15} />
        </button>

        <button
          onClick={() => setLoginModalOpen(true)}
          className="py-3.5 px-6 rounded-xl border border-axo-border hover:border-axo-cyan/40 hover:bg-axo-bg text-axo-text font-bold text-sm transition-all"
        >
          Ya tengo cuenta · Ingresar
        </button>
      </div>

      {/* Quick demo bypass for stakeholders */}
      <div className="mt-6 pt-4 border-t border-axo-border/80">
        <button
          onClick={() => quickLogin(role)}
          className="text-xs text-axo-muted hover:text-axo-cyan font-semibold inline-flex items-center gap-1 transition-colors"
        >
          <Sparkles size={13} className="text-amber-500" />
          <span>¿Sos evaluador o inversor? Clic aquí para probar la demo al instante</span>
        </button>
      </div>
    </div>
  );
}
