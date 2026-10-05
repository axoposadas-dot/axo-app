"use client";

// ================================================================
//  AXO — Formulario de Registro de Comercios y Distribuidoras
// ================================================================

import { useState } from "react";
import { X, Store, Check, Clock, ShieldCheck, ArrowRight, Sparkles, Building2, MapPin, Phone, User } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { ZONAS_POSADAS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SellerOnboardingModal() {
  const { sellerModalOpen, setSellerModalOpen, submitSellerApplication, quickLogin } = useAuth();

  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Distribuidora de Bebidas");
  const [cuit, setCuit] = useState("");
  const [address, setAddress] = useState("");
  const [zone, setZone] = useState(ZONAS_POSADAS[0]);
  const [whatsapp, setWhatsapp] = useState("");
  const [managerName, setManagerName] = useState("");
  const [schedule, setSchedule] = useState("Lunes a Sábado 18:00 a 02:00");

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!sellerModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !address || !whatsapp || !managerName) return;

    setLoading(true);
    await submitSellerApplication({
      businessName,
      category,
      cuit,
      address,
      zone,
      whatsapp,
      managerName,
      schedule,
    });
    setLoading(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setSellerModalOpen(false);
    setIsSuccess(false);
  };

  const handleDemoAccess = () => {
    quickLogin("seller");
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-axo-card-lg border border-axo-border w-full max-w-lg overflow-hidden animate-slide-up my-8">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-axo-cyan to-blue-700 text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full mb-2">
            <Building2 size={12} /> ALIANZA COMERCIAL AXO
          </div>
          <h3 className="text-xl font-black">Sumá tu Comercio o Distribuidora</h3>
          <p className="text-xs text-blue-100 mt-1">
            Vendé bebidas frías y conveniencia en Posadas con entregas express en 30 minutos.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="bg-axo-blue-light/60 border border-axo-cyan/20 rounded-2xl p-3.5 flex items-start gap-3">
                <Sparkles size={18} className="text-axo-cyan flex-shrink-0 mt-0.5" />
                <div className="text-xs text-axo-text">
                  <strong>Cero costo fijo:</strong> Sin abono mensual. Solo una pequeña comisión sobre venta confirmada. Nosotros ponemos la tecnología y los cadetes.
                </div>
              </div>

              {/* Nombre y Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-axo-text block mb-1">Nombre del Comercio *</label>
                  <div className="relative">
                    <Store size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-axo-muted" />
                    <input
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Ej: Distribuidora Norte"
                      className="axo-input pl-9 text-xs py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-axo-text block mb-1">Tipo de Comercio</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="axo-input text-xs py-2.5"
                  >
                    <option value="Distribuidora de Bebidas">Distribuidora de Bebidas</option>
                    <option value="Vinoteca Boutique">Vinoteca Boutique</option>
                    <option value="Kiosco / Minimarket 24hs">Kiosco / Minimarket 24hs</option>
                    <option value="Fábrica de Hielo / Extras">Fábrica de Hielo / Extras</option>
                    <option value="Supermercado Regional">Supermercado Regional</option>
                  </select>
                </div>
              </div>

              {/* Dirección y Zona en Posadas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-axo-text block mb-1">Dirección del Depósito / Local *</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-axo-muted" />
                    <input
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ej: Av. Uruguay 2400"
                      className="axo-input pl-9 text-xs py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-axo-text block mb-1">Zona en Posadas *</label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="axo-input text-xs py-2.5"
                  >
                    {ZONAS_POSADAS.map((z) => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Encargado y WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-axo-text block mb-1">Nombre del Titular / Encargado *</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-axo-muted" />
                    <input
                      required
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                      placeholder="Ej: Martín Rodríguez"
                      className="axo-input pl-9 text-xs py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-axo-text block mb-1">WhatsApp de Contacto *</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-axo-muted" />
                    <input
                      required
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+54 376 4000000"
                      className="axo-input pl-9 text-xs py-2.5"
                    />
                  </div>
                </div>
              </div>

              {/* CUIT / Razón social y Horarios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-axo-text block mb-1">CUIT / DNI (Opcional)</label>
                  <input
                    value={cuit}
                    onChange={(e) => setCuit(e.target.value)}
                    placeholder="20-12345678-9"
                    className="axo-input text-xs py-2.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-axo-text block mb-1">Horario Habitual de Despacho</label>
                  <input
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="Ej: Jue a Dom 19 a 03 hs"
                    className="axo-input text-xs py-2.5"
                  />
                </div>
              </div>

              {/* Botón de Envío */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-axo-cyan hover:bg-axo-cyan-dim text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? (
                    <span>Procesando registro...</span>
                  ) : (
                    <>
                      <span>Enviar Solicitud de Comercio</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Estado de Aprobación Pendiente */
            <div className="text-center py-4 flex flex-col items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-axo-emerald-light border-2 border-axo-emerald flex items-center justify-center text-3xl">
                ✓
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
                  SOLICITUD EN REVISIÓN TÉCNICA
                </span>
                <h4 className="text-lg font-black text-axo-text mt-3">¡Solicitud enviada con éxito!</h4>
                <p className="text-xs text-axo-muted mt-2 max-w-sm mx-auto leading-relaxed">
                  Registramos a <strong>{businessName}</strong> ({address}, {zone}). Nuestro equipo de operaciones en Posadas validará la información y te contactará por WhatsApp para habilitar tu catálogo y panel de ventas oficial.
                </p>
              </div>

              <div className="w-full bg-axo-bg border border-axo-border rounded-2xl p-4 text-left text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2 text-axo-text font-bold">
                  <ShieldCheck size={16} className="text-axo-emerald" /> Próximos pasos:
                </div>
                <p className="text-axo-muted">• Configuración de catálogo y lista de precios mayoristas/minoristas.</p>
                <p className="text-axo-muted">• Asignación de cadetes prioritarios para tus pedidos.</p>
                <p className="text-axo-muted">• Activación de cuenta recaudadora en Mercado Pago o cuenta bancaria.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
                <button
                  onClick={handleDemoAccess}
                  className="flex-1 py-3 px-4 rounded-xl bg-axo-emerald hover:bg-axo-emerald-dim text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} /> Explorar Panel Distribuidor Demo
                </button>
                <button
                  onClick={handleClose}
                  className="py-3 px-4 rounded-xl border border-axo-border hover:bg-axo-bg text-axo-text font-semibold text-xs transition-colors"
                >
                  Volver al Catálogo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
