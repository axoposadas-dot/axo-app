"use client";

// ================================================================
//  AXO — Formulario de Registro de Repartidores Express (Posadas)
// ================================================================

import { useState } from "react";
import { X, Navigation, Check, ShieldCheck, ArrowRight, Sparkles, Phone, User, Bike, CheckSquare, Square } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { ZONAS_POSADAS } from "@/lib/data";

export function DriverOnboardingModal() {
  const { driverModalOpen, setDriverModalOpen, submitDriverApplication, quickLogin } = useAuth();

  const [fullName, setFullName] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState<"moto" | "auto" | "bici">("moto");
  const [hasThermalBag, setHasThermalBag] = useState(true);
  const [preferredZone, setPreferredZone] = useState(ZONAS_POSADAS[0]);
  const [availability, setAvailability] = useState("Viernes a Domingo (Noche)");

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!driverModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !dni) return;

    setLoading(true);
    await submitDriverApplication({
      fullName,
      dni,
      phone,
      vehicle,
      hasThermalBag,
      preferredZone,
      availability,
    });
    setLoading(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setDriverModalOpen(false);
    setIsSuccess(false);
  };

  const handleDemoAccess = () => {
    quickLogin("driver");
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-axo-card-lg border border-axo-border w-full max-w-lg overflow-hidden animate-slide-up my-8">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full mb-2">
            <Navigation size={12} /> RED LOGÍSTICA AXO
          </div>
          <h3 className="text-xl font-black">Sumate como Repartidor Express</h3>
          <p className="text-xs text-purple-100 mt-1">
            Ganá más repartiendo bebidas y hielo en Posadas. Tarifas justas, cobro rápido y soporte en vivo.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5 flex items-start gap-3">
                <span className="text-xl">🛵</span>
                <div className="text-xs text-purple-900 leading-snug">
                  <strong>Ganancias transparentes:</strong> Retenés el 100% de tus propinas y cobrás un fee fijo competitivo por entrega en mano o billetera digital.
                </div>
              </div>

              {/* Nombre y DNI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-axo-text block mb-1">Nombre y Apellido *</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-axo-muted" />
                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej: Rodrigo Giménez"
                      className="axo-input pl-9 text-xs py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-axo-text block mb-1">DNI / Cédula *</label>
                  <input
                    required
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Ej: 38.450.123"
                    className="axo-input text-xs py-2.5"
                  />
                </div>
              </div>

              {/* Teléfono WhatsApp y Vehículo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-axo-text block mb-1">WhatsApp / Celular *</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-axo-muted" />
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+54 376 4000000"
                      className="axo-input pl-9 text-xs py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-axo-text block mb-1">Tipo de Vehículo *</label>
                  <select
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value as "moto" | "auto" | "bici")}
                    className="axo-input text-xs py-2.5 font-medium"
                  >
                    <option value="moto">🛵 Moto (Recomendado)</option>
                    <option value="auto">🚗 Auto / Utilitario (Packs grandes)</option>
                    <option value="bici">🚲 Bicicleta con cambios</option>
                  </select>
                </div>
              </div>

              {/* Zona y Disponibilidad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-axo-text block mb-1">Zona Preferida en Posadas</label>
                  <select
                    value={preferredZone}
                    onChange={(e) => setPreferredZone(e.target.value)}
                    className="axo-input text-xs py-2.5"
                  >
                    {ZONAS_POSADAS.map((z) => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-axo-text block mb-1">Disponibilidad</label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="axo-input text-xs py-2.5"
                  >
                    <option value="Viernes a Domingo (Noche)">Viernes a Domingo (Noche)</option>
                    <option value="Tardes y Noches (Todos los días)">Tardes y Noches (Todos los días)</option>
                    <option value="Tiempo Completo">Tiempo Completo</option>
                    <option value="Solo Fines de Semana">Solo Fines de Semana</option>
                  </select>
                </div>
              </div>

              {/* Checkbox Mochila Térmica */}
              <div
                onClick={() => setHasThermalBag(!hasThermalBag)}
                className="flex items-center gap-3 p-3 bg-axo-bg border border-axo-border rounded-xl cursor-pointer hover:border-purple-300 transition-colors"
              >
                <div className="text-purple-600 flex-shrink-0">
                  {hasThermalBag ? <CheckSquare size={18} /> : <Square size={18} className="text-axo-muted" />}
                </div>
                <div className="text-xs text-axo-text">
                  <span className="font-bold">Cuento con conservadora térmica / mochila de delivery</span>
                  <p className="text-[11px] text-axo-muted">Necesario para conservar la temperatura de bebidas frías y hielo.</p>
                </div>
              </div>

              {/* Botón Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? (
                    <span>Procesando solicitud...</span>
                  ) : (
                    <>
                      <span>Enviar Solicitud de Repartidor</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Estado de Aprobación Pendiente */
            <div className="text-center py-4 flex flex-col items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-purple-100 border-2 border-purple-400 flex items-center justify-center text-3xl">
                🛵
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
                  VALIDACIÓN DE DOCUMENTACIÓN PENDIENTE
                </span>
                <h4 className="text-lg font-black text-axo-text mt-3">¡Solicitud recibida, {fullName}!</h4>
                <p className="text-xs text-axo-muted mt-2 max-w-sm mx-auto leading-relaxed">
                  Te registraste como repartidor para la zona de <strong>{preferredZone}</strong>. Nuestro equipo de logística te contactará por WhatsApp ({phone}) para validar tu cédula/seguro vehicular y habilitarte en el radar de entregas en vivo.
                </p>
              </div>

              <div className="w-full bg-axo-bg border border-axo-border rounded-2xl p-4 text-left text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2 text-axo-text font-bold">
                  <ShieldCheck size={16} className="text-purple-600" /> Beneficios activos al ser aprobado:
                </div>
                <p className="text-axo-muted">• Acceso al radar de pedidos con prioridad por cercanía.</p>
                <p className="text-axo-muted">• Visualización de ruta GPS y datos de cliente en 1 clic.</p>
                <p className="text-axo-muted">• Cobro directo en efectivo y liquidación diaria de saldo virtual.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
                <button
                  onClick={handleDemoAccess}
                  className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} /> Explorar Radar de Repartidor Demo
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
