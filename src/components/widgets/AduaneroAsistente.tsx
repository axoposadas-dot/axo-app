"use client";

// ================================================================
//  AXO — AduaneroAsistente
//  Generador de documento aduanero simulado
//  AFIP / ARCA — Franquicia de ingreso · Importación personal
// ================================================================

import { useState } from "react";
import {
  FileText, ChevronDown, ChevronUp, CheckCircle2,
  AlertCircle, Download, Printer, Info,
} from "lucide-react";
import { formatARS } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ProductImport {
  nombre: string;
  categoriaAfip: string;
  precioUSD: number;
  precioARS: number;
  gravado: boolean;
  alicuotaIVA: number;
  derechosImport: number;
  impuestoInterno: number;
}

const USD_ARS = 1285; // tipo de cambio simulado

const PRODUCTS_LITANY: ProductImport[] = [
  {
    nombre: "Monitor LED 27\" Full HD — Litany Encarnación",
    categoriaAfip: "8528.52.00 — Monitores p/ máquinas automáticas",
    precioUSD: 185,
    precioARS: 185 * USD_ARS,
    gravado: true,
    alicuotaIVA: 21,
    derechosImport: 16,
    impuestoInterno: 0,
  },
  {
    nombre: "Teclado Mecánico RGB TKL",
    categoriaAfip: "8471.60.90 — Unidades de entrada",
    precioUSD: 42,
    precioARS: 42 * USD_ARS,
    gravado: true,
    alicuotaIVA: 21,
    derechosImport: 16,
    impuestoInterno: 0,
  },
  {
    nombre: "Mouse Inalámbrico Pro",
    categoriaAfip: "8471.60.90 — Unidades de entrada",
    precioUSD: 28,
    precioARS: 28 * USD_ARS,
    gravado: false,
    alicuotaIVA: 0,
    derechosImport: 0,
    impuestoInterno: 0,
  },
];

const FRANQUICIA_USD = 300; // franquicia exenta para personas físicas

type DocStep = "formulario" | "calculando" | "documento";

function calcImpuestos(product: ProductImport) {
  const base = product.precioUSD * USD_ARS;
  const derechos = product.gravado
    ? Math.round(base * (product.derechosImport / 100))
    : 0;
  const iva = product.gravado
    ? Math.round((base + derechos) * (product.alicuotaIVA / 100))
    : 0;
  const total = base + derechos + iva + product.impuestoInterno;
  return { base, derechos, iva, total };
}

export function AduaneroAsistente() {
  const [step, setStep] = useState<DocStep>("formulario");
  const [dni, setDni] = useState("32.145.678");
  const [nombre, setNombre] = useState("Carlos M. Benítez");
  const [declaracionExpandida, setDeclaracionExpandida] = useState<string[]>([]);
  const [documentoGenerado, setDocumentoGenerado] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const totalUSD = PRODUCTS_LITANY.reduce((s, p) => s + p.precioUSD, 0);
  const excedente = Math.max(0, totalUSD - FRANQUICIA_USD);
  const dentroDeFranquicia = excedente === 0;

  const handleGenerar = () => {
    setStep("calculando");
    setTimeout(() => {
      setStep("documento");
      setDocumentoGenerado(true);
    }, 2200);
  };

  const toggleItem = (id: string) => {
    setDeclaracionExpandida((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const timestamp = new Date().toLocaleString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="axo-card-glow border border-axo-cyan/20 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-axo-cyan/5 border-b border-axo-cyan/20 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-axo-cyan/10 border border-axo-cyan/30 flex items-center justify-center">
            <FileText size={16} className="text-axo-cyan" />
          </div>
          <div>
            <p className="font-black text-axo-text text-sm">Asistente Normativo Aduanero</p>
            <p className="text-[10px] text-axo-muted">AFIP / ARCA — Franquicia de ingreso personal</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-axo-cyan bg-axo-cyan/10 border border-axo-cyan/20 px-2.5 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-axo-cyan animate-pulse" />
          Simulado · Solo demo
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5">

        {/* STEP 1 — Formulario */}
        {step === "formulario" && (
          <>
            {/* Comprador */}
            <div>
              <p className="text-[10px] text-axo-muted uppercase tracking-wider font-semibold mb-3">
                Datos del comprador
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-axo-muted mb-1.5 block">DNI / Documento</label>
                  <input
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    className="axo-input text-sm"
                    placeholder="00.000.000"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-axo-muted mb-1.5 block">Nombre completo</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="axo-input text-sm"
                    placeholder="Nombre Apellido"
                  />
                </div>
              </div>
            </div>

            {/* Items declarados */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] text-axo-muted uppercase tracking-wider font-semibold">
                  Bienes a declarar — Litany Encarnación
                </p>
                <span className="text-[10px] text-axo-cyan font-semibold">
                  {PRODUCTS_LITANY.length} artículos
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {PRODUCTS_LITANY.map((p) => {
                  const imp = calcImpuestos(p);
                  const isOpen = declaracionExpandida.includes(p.nombre);
                  return (
                    <div
                      key={p.nombre}
                      className={cn(
                        "rounded-xl border transition-all",
                        p.gravado
                          ? "border-amber-500/20 bg-amber-400/5"
                          : "border-axo-emerald/20 bg-axo-emerald/5"
                      )}
                    >
                      <button
                        onClick={() => toggleItem(p.nombre)}
                        className="w-full flex items-center gap-3 p-3 text-left"
                      >
                        <span className="text-xl flex-shrink-0">🖥️</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-axo-text leading-tight truncate">
                            {p.nombre}
                          </p>
                          <p className="text-[10px] text-axo-muted truncate">{p.categoriaAfip}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-axo-text">
                            USD {p.precioUSD}
                          </p>
                          {p.gravado ? (
                            <span className="text-[10px] text-amber-400 font-semibold">Gravado</span>
                          ) : (
                            <span className="text-[10px] text-axo-emerald font-semibold">Exento</span>
                          )}
                        </div>
                        {isOpen ? (
                          <ChevronUp size={14} className="text-axo-muted flex-shrink-0" />
                        ) : (
                          <ChevronDown size={14} className="text-axo-muted flex-shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="border-t border-axo-border px-4 pb-3 pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
                          <div className="text-center">
                            <p className="text-[10px] text-axo-muted">Valor base ARS</p>
                            <p className="text-xs font-bold text-axo-text">{formatARS(imp.base)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-axo-muted">Derechos ({p.derechosImport}%)</p>
                            <p className="text-xs font-bold text-amber-400">{formatARS(imp.derechos)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-axo-muted">IVA ({p.alicuotaIVA}%)</p>
                            <p className="text-xs font-bold text-amber-400">{formatARS(imp.iva)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-axo-muted">Total con impuestos</p>
                            <p className="text-xs font-bold text-axo-cyan">{formatARS(imp.total)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Franquicia check */}
            <div
              className={cn(
                "rounded-xl border p-4",
                dentroDeFranquicia
                  ? "border-axo-emerald/30 bg-axo-emerald/5"
                  : "border-amber-400/30 bg-amber-400/5"
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                {dentroDeFranquicia ? (
                  <CheckCircle2 size={16} className="text-axo-emerald flex-shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-amber-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={cn("text-sm font-bold", dentroDeFranquicia ? "text-axo-emerald" : "text-amber-400")}>
                    {dentroDeFranquicia
                      ? `Dentro de franquicia exenta (USD ${FRANQUICIA_USD})`
                      : `Excede franquicia en USD ${excedente.toFixed(0)}`}
                  </p>
                  <p className="text-[10px] text-axo-muted">
                    Total declarado: USD {totalUSD} / Franquicia: USD {FRANQUICIA_USD}
                  </p>
                </div>
                <button
                  className="relative"
                  onMouseEnter={() => setShowTooltip("franquicia")}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <Info size={14} className="text-axo-muted hover:text-axo-cyan" />
                  {showTooltip === "franquicia" && (
                    <div className="absolute right-0 bottom-6 w-56 bg-axo-bg-card border border-axo-border rounded-xl p-3 text-[10px] text-axo-muted z-10 shadow-axo-card">
                      Res. AFIP 2024: Personas físicas pueden ingresar hasta USD 300 en bienes sin pagar derechos de importación, una vez cada 30 días.
                    </div>
                  )}
                </button>
              </div>
              <div className="h-1.5 bg-axo-bg rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    dentroDeFranquicia ? "bg-axo-emerald" : "bg-amber-400"
                  )}
                  style={{ width: `${Math.min(100, (totalUSD / FRANQUICIA_USD) * 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleGenerar}
              className="axo-btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2"
            >
              <FileText size={15} />
              Generar Documento Aduanero
            </button>
          </>
        )}

        {/* STEP 2 — Calculando */}
        {step === "calculando" && (
          <div className="flex flex-col items-center gap-5 py-8 text-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-axo-cyan/20 animate-spin" style={{ borderTopColor: "#00F2FE" }} />
              <div className="w-16 h-16 rounded-full bg-axo-cyan/10 flex items-center justify-center text-2xl">
                🏛️
              </div>
            </div>
            <div>
              <p className="font-bold text-axo-text">Consultando base AFIP / ARCA...</p>
              <p className="text-xs text-axo-muted mt-1">Verificando NCM, franquicias y aranceles</p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-xs text-left">
              {[
                "✓ Validando DNI en padrón AFIP",
                "✓ Consultando historial de franquicias",
                "⟳ Calculando aranceles NCM...",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-axo-muted">
                  <span className={i < 2 ? "text-axo-emerald" : "text-axo-cyan animate-pulse"}>
                    {step.slice(0, 1)}
                  </span>
                  <span>{step.slice(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 — Documento Generado */}
        {step === "documento" && (
          <div className="flex flex-col gap-4 animate-slide-up">
            {/* Document card */}
            <div className="bg-axo-bg border border-axo-border rounded-xl overflow-hidden font-mono text-xs">
              {/* Doc header */}
              <div className="bg-axo-cyan/10 border-b border-axo-cyan/20 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-axo-cyan text-sm">DECLARACIÓN ADUANERA SIMPLIFICADA</p>
                    <p className="text-axo-muted text-[10px]">AFIP / ARCA — Régimen de Equipaje e Importaciones Personales</p>
                  </div>
                  <div className="text-right text-axo-muted text-[10px]">
                    <p>Nro: AXO-{Date.now().toString().slice(-6)}</p>
                    <p>{timestamp}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-3">
                {/* Titular */}
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div>
                    <p className="text-axo-muted">TITULAR</p>
                    <p className="text-axo-text font-semibold">{nombre.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-axo-muted">CUIT / DNI</p>
                    <p className="text-axo-text font-semibold">{dni}</p>
                  </div>
                  <div>
                    <p className="text-axo-muted">ADUANA DE INGRESO</p>
                    <p className="text-axo-text font-semibold">PASO INT. POSADAS — ENCARNACIÓN</p>
                  </div>
                  <div>
                    <p className="text-axo-muted">TIPO DE CAMBIO</p>
                    <p className="text-axo-text font-semibold">USD 1 = ARS {USD_ARS.toLocaleString("es-AR")}</p>
                  </div>
                </div>

                <div className="h-px bg-axo-border" />

                {/* Table header */}
                <div className="grid grid-cols-4 text-[9px] text-axo-muted uppercase">
                  <span className="col-span-2">Descripción / NCM</span>
                  <span className="text-right">Valor USD</span>
                  <span className="text-right">Total ARS</span>
                </div>

                {/* Items */}
                {PRODUCTS_LITANY.map((p) => {
                  const imp = calcImpuestos(p);
                  return (
                    <div key={p.nombre} className="grid grid-cols-4 text-[10px] gap-1">
                      <div className="col-span-2">
                        <p className="text-axo-text leading-tight">{p.nombre}</p>
                        <p className="text-axo-muted text-[9px]">{p.categoriaAfip}</p>
                      </div>
                      <p className="text-right text-axo-text">{p.precioUSD}</p>
                      <div className="text-right">
                        <p className="text-axo-text">{formatARS(imp.total)}</p>
                        {p.gravado && (
                          <p className="text-amber-400 text-[9px]">
                            +{formatARS(imp.derechos + imp.iva)} imp.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="h-px bg-axo-border" />

                {/* Totals */}
                <div className="flex flex-col gap-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-axo-muted">Subtotal bienes (USD)</span>
                    <span className="text-axo-text font-semibold">USD {totalUSD}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-axo-muted">Franquicia exenta</span>
                    <span className="text-axo-emerald font-semibold">USD {Math.min(FRANQUICIA_USD, totalUSD)} ✓</span>
                  </div>
                  {excedente > 0 && (
                    <div className="flex justify-between">
                      <span className="text-amber-400">Excedente gravado</span>
                      <span className="text-amber-400 font-semibold">USD {excedente}</span>
                    </div>
                  )}
                  <div className="h-px bg-axo-border my-1" />
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-axo-text">TOTAL TRIBUTOS ARS</span>
                    <span className="font-black text-axo-cyan">
                      {dentroDeFranquicia
                        ? formatARS(0)
                        : formatARS(
                            PRODUCTS_LITANY.filter((p) => p.gravado).reduce(
                              (s, p) => s + calcImpuestos(p).derechos + calcImpuestos(p).iva,
                              0
                            )
                          )}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-axo-border" />

                {/* Legal note */}
                <div className="text-[9px] text-axo-muted leading-relaxed">
                  <p className="font-semibold text-axo-muted mb-1">NORMATIVA APLICABLE:</p>
                  <p>• Res. Gral. AFIP 3915/16 — Régimen de equipaje e importaciones personales</p>
                  <p>• Ley 27.430 — Derechos de importación sobre excedente de franquicia</p>
                  <p>• Nota: Documento generado con fines demostrativos por AXO. Consulte aduana oficial.</p>
                </div>

                {/* QR placeholder */}
                <div className="flex items-center gap-3 bg-axo-bg-card rounded-xl p-3 border border-axo-border">
                  <div className="w-12 h-12 bg-axo-border rounded-lg flex items-center justify-center text-[8px] text-axo-muted text-center leading-tight flex-shrink-0">
                    QR<br />AFIP
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-axo-text">Código de verificación digital</p>
                    <p className="text-[9px] text-axo-muted font-mono">AXO-{Date.now()}</p>
                    <p className="text-[9px] text-axo-muted">Válido 48hs desde emisión</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="axo-btn-primary flex-1 text-xs py-2.5 flex items-center justify-center gap-2">
                <Download size={13} /> Descargar PDF
              </button>
              <button className="axo-btn-secondary flex-1 text-xs py-2.5 flex items-center justify-center gap-2">
                <Printer size={13} /> Imprimir
              </button>
              <button
                onClick={() => { setStep("formulario"); setDocumentoGenerado(false); }}
                className="axo-btn-ghost text-xs py-2.5 px-4"
              >
                Nueva
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
