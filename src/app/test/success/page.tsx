"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trackPurchase } from "@/lib/analytics";
import { PRICE } from "@/lib/constants";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("galio_payment_id");

  useEffect(() => {
    if (!orderId) return;
    const storageKey = `gf_px_${orderId}`;
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
    trackPurchase(PRICE, `gp_${orderId}`);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">

        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-4xl">✅</span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">¡Pago recibido!</h1>
          <p className="text-gray-500">Tu plan Gelatina Fit está siendo procesado. Recibirás el acceso en tu email en breve.</p>
        </div>

        <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 text-sm text-pink-800">
          Revisá tu email (incluyendo la carpeta de spam) en los próximos minutos.
        </div>

        <a href="/" className="text-sm text-gray-400 underline">← Volver al inicio</a>
      </div>
    </div>
  );
}

export default function TestSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
