"use client";

import { useState, useEffect } from "react";

interface Props {
  totalQuizzes: number;
  totalCheckouts: number;
  totalSales: number;
  conversionRate: number;
  totalRevenue: number;
}

function formatMoney(amount: number, prefix = "$"): string {
  if (amount >= 1_000_000) return `${prefix}${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `${prefix}${(amount / 1_000).toFixed(1)}K`;
  return `${prefix}${amount.toLocaleString("es-AR")}`;
}

const PRECIO_NETO = 3680;
const COTIZACION_REAL = 290;

export default function OverviewCards({ totalQuizzes, totalCheckouts, totalSales, conversionRate, totalRevenue }: Props) {
  const [adsReais, setAdsReais] = useState<string>("");

  // Persistir el valor en localStorage
  useEffect(() => {
    const saved = localStorage.getItem("admin-ads-reais");
    if (saved) setAdsReais(saved);
  }, []);

  function handleAdsChange(val: string) {
    setAdsReais(val);
    localStorage.setItem("admin-ads-reais", val);
  }

  const facturacion = totalSales * PRECIO_NETO;
  const adsNum = parseFloat(adsReais) || 0;
  const adsARS = adsNum * COTIZACION_REAL;
  const lucro = facturacion - adsARS;
  const roas = adsARS > 0 ? facturacion / adsARS : null;
  const costoPorVenta = totalSales > 0 && adsARS > 0 ? adsARS / totalSales : null;

  const topCards = [
    { label: "Quizzes", icon: "📋", value: totalQuizzes.toLocaleString("es-AR"), sub: null },
    { label: "Initiate Checkout", icon: "🛒", value: totalCheckouts.toLocaleString("es-AR"), sub: null },
    { label: "Ventas", icon: "💰", value: totalSales.toLocaleString("es-AR"), sub: null },
    { label: "Conversión", icon: "📈", value: `${conversionRate}%`, sub: null },
    { label: "Ingresos", icon: "💵", value: formatMoney(totalRevenue), sub: null },
    { label: "Facturación neta", icon: "🏦", value: formatMoney(facturacion), sub: `R$${(facturacion / COTIZACION_REAL).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · ${totalSales} × $3.680` },
  ];

  return (
    <div className="space-y-4">
      {/* Cards principales */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {topCards.map((card) => (
          <div key={card.label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{card.icon}</span>
              <span className="text-gray-400 text-sm">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            {card.sub && <p className="text-xs text-gray-500 mt-1">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Sección Ads */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📢</span>
          <h3 className="text-white font-semibold">Inversión en Ads del día</h3>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <label className="text-gray-400 text-sm whitespace-nowrap">Gasto en R$:</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">R$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={adsReais}
              onChange={(e) => handleAdsChange(e.target.value)}
              placeholder="0,00"
              className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white text-sm w-40 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          {adsNum > 0 && (
            <span className="text-gray-500 text-sm">
              = {formatMoney(adsARS)} ARS <span className="text-gray-600">(× $290)</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Gasto ARS */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">💸</span>
              <span className="text-gray-400 text-xs">Gasto en ARS</span>
            </div>
            <p className="text-xl font-bold text-white">
              {adsARS > 0 ? formatMoney(adsARS) : <span className="text-gray-600">—</span>}
            </p>
            {adsNum > 0 && <p className="text-xs text-gray-500 mt-1">R${adsNum.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>}
          </div>

          {/* Lucro */}
          <div className={`bg-gray-800 rounded-xl p-4 border ${lucro >= 0 && adsARS > 0 ? "border-green-800" : adsARS > 0 ? "border-red-800" : "border-gray-700"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">📊</span>
              <span className="text-gray-400 text-xs">Lucro neto</span>
            </div>
            <p className={`text-xl font-bold ${adsARS > 0 ? (lucro >= 0 ? "text-green-400" : "text-red-400") : "text-white"}`}>
              {adsARS > 0 ? formatMoney(Math.abs(lucro)) : <span className="text-gray-600">—</span>}
            </p>
            {adsARS > 0 && (
              <p className="text-xs text-yellow-400 mt-1">
                R${(Math.abs(lucro) / COTIZACION_REAL).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                {" · "}<span className="text-gray-500">{lucro >= 0 ? "ganancia" : "pérdida"}</span>
              </p>
            )}
          </div>

          {/* ROAS */}
          <div className={`bg-gray-800 rounded-xl p-4 border ${roas !== null && roas >= 2 ? "border-green-800" : roas !== null && roas >= 1 ? "border-yellow-800" : roas !== null ? "border-red-800" : "border-gray-700"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🎯</span>
              <span className="text-gray-400 text-xs">ROAS</span>
            </div>
            <p className={`text-xl font-bold ${roas !== null ? (roas >= 2 ? "text-green-400" : roas >= 1 ? "text-yellow-400" : "text-red-400") : "text-white"}`}>
              {roas !== null ? `${roas.toFixed(2)}x` : <span className="text-gray-600">—</span>}
            </p>
            {roas !== null && (
              <p className="text-xs text-gray-500 mt-1">
                {roas >= 2 ? "excelente" : roas >= 1 ? "neutral" : "negativo"}
              </p>
            )}
          </div>

          {/* Costo por venta */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🏷️</span>
              <span className="text-gray-400 text-xs">Costo por venta</span>
            </div>
            <p className="text-xl font-bold text-white">
              {costoPorVenta !== null ? formatMoney(costoPorVenta) : <span className="text-gray-600">—</span>}
            </p>
            {costoPorVenta !== null && (
              <p className="text-xs text-yellow-400 mt-1">
                R${(costoPorVenta / COTIZACION_REAL).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>
        </div>

        {/* Consejo de escalado */}
        {roas !== null && (() => {
          let bg: string, border: string, dot: string, titulo: string, consejo: string, detalle: string;

          if (roas >= 3) {
            bg = "bg-green-950/40"; border = "border-green-700"; dot = "bg-green-400";
            titulo = "Escalá sin miedo";
            consejo = `Tu ROAS es ${roas.toFixed(2)}x — por cada peso invertido en ads estás recuperando ${roas.toFixed(2)}x. Es momento de aumentar el presupuesto.`;
            detalle = "Subí el gasto entre un 20–30% y monitoreá el ROAS al día siguiente. Si se mantiene, seguí escalando.";
          } else if (roas >= 2) {
            bg = "bg-green-950/20"; border = "border-green-800"; dot = "bg-green-500";
            titulo = "Podés escalar con cuidado";
            consejo = `ROAS de ${roas.toFixed(2)}x — estás ganando, pero hay margen para optimizar antes de escalar fuerte.`;
            detalle = "Probá subir el presupuesto un 15–20%. Si el CPV sube mucho, frenás y revisás el creativo.";
          } else if (roas >= 1.5) {
            bg = "bg-yellow-950/30"; border = "border-yellow-700"; dot = "bg-yellow-400";
            titulo = "Mantené, no escales aún";
            consejo = `ROAS ${roas.toFixed(2)}x — el negocio es rentable pero el margen es ajustado. Escalar ahora puede comprometer el lucro.`;
            detalle = "Optimizá el creativo o el público primero. Buscá bajar el CPV antes de invertir más.";
          } else if (roas >= 1) {
            bg = "bg-orange-950/30"; border = "border-orange-700"; dot = "bg-orange-400";
            titulo = "No escales — revisá la campaña";
            consejo = `ROAS ${roas.toFixed(2)}x — casi en el punto de equilibrio. Cualquier variación te puede llevar a pérdida.`;
            detalle = "Pausá los ad sets con peor rendimiento. Revisá el público, el creativo y el copy de la landing.";
          } else {
            bg = "bg-red-950/30"; border = "border-red-700"; dot = "bg-red-400";
            titulo = "Pausá los ads — estás perdiendo dinero";
            consejo = `ROAS ${roas.toFixed(2)}x — estás gastando más de lo que facturás. Cada real invertido genera menos de R$1 de retorno.`;
            detalle = "Pausá la campaña, analizá qué cambió (creativo, público, oferta) y relanzá con ajustes concretos.";
          }

          return (
            <div className={`mt-4 rounded-xl border ${border} ${bg} p-4`}>
              <div className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${dot}`} />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{titulo}</p>
                  <p className="text-gray-300 text-xs leading-relaxed mb-1">{consejo}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{detalle}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
