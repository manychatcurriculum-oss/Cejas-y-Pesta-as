"use client";

import Button from "@/components/ui/Button";
import {
  PRICE,
  ORIGINAL_PRICE,
  PRODUCT_NAME,
  COMBO_DELIVERABLES,
  ALL_DELIVERABLES,
} from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

interface PricingCardProps {
  onCheckout: (plan: "basico" | "acelerado") => void;
  loading?: boolean;
}

export default function PricingCard({ onCheckout, loading }: PricingCardProps) {
  const discount = Math.round(((ORIGINAL_PRICE - PRICE) / ORIGINAL_PRICE) * 100);

  return (
    <div
      id="plan-acelerado"
      className="bg-white rounded-3xl border-[3px] border-pink-500 overflow-hidden shadow-2xl shadow-pink-500/20 relative"
    >
      {/* Badge */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 py-2.5 text-center">
        <p className="text-white text-sm font-bold uppercase tracking-wide">
          OFERTA ESPECIAL 🔥 {discount}% OFF
        </p>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900 text-center">
          {PRODUCT_NAME} — Pack Completo
        </h3>

        {/* Price */}
        <div className="text-center space-y-1">
          <p className="text-gray-400 line-through text-lg">
            {formatPrice(ORIGINAL_PRICE)}
          </p>
          <p className="text-4xl font-extrabold text-pink-600">
            {formatPrice(PRICE)}{" "}
            <span className="text-2xl font-bold">ARS 🇦🇷</span>
          </p>
          <p className="text-xs text-gray-500">Pago único — Sin suscripción — Pesos Argentinos</p>
        </div>

        {/* Deliverables */}
        <div className="space-y-2 pt-2">
          <p className="text-sm font-semibold text-gray-700">Todo incluido:</p>

          {/* Main product — primero y destacado */}
          {ALL_DELIVERABLES.filter((d) => d.main).map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-100 to-pink-50 -mx-2 px-2 py-2.5 rounded-lg border-2 border-pink-500"
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              <span className="text-sm text-pink-800 font-extrabold flex-1">
                {item.name}
              </span>
              <span className="bg-pink-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0">
                Principal
              </span>
            </div>
          ))}

          {/* Highlighted items */}
          {COMBO_DELIVERABLES.filter((d) => d.highlighted).map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2 bg-pink-50 -mx-2 px-2 py-2 rounded-lg border-2 border-pink-400"
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              <span className="text-sm text-pink-700 font-bold flex-1">
                {item.name} 🔥
              </span>
              <span className="bg-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                Premium
              </span>
            </div>
          ))}

          {/* Rest */}
          {COMBO_DELIVERABLES.filter((d) => !d.highlighted).map((item) => (
            <div key={item.name} className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0">{item.icon}</span>
              <span className="text-sm text-gray-600">{item.name}</span>
            </div>
          ))}
        </div>

        <Button onClick={() => onCheckout("acelerado")} pulse disabled={loading}>
          {loading ? "Procesando..." : "Obtener mi plan ahora 🔥"}
        </Button>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>🔒</span>
            <span>Pago protegido por Tienda Nube</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>📧</span>
            <span>Entrega inmediata</span>
          </div>
        </div>
      </div>
    </div>
  );
}
