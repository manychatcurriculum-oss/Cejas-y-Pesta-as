"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("galio_payment_id");

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

        {(orderId || paymentId) && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4 text-left text-sm space-y-2">
            {orderId && (
              <div className="flex justify-between">
                <span className="text-gray-500">Referencia:</span>
                <span className="font-mono text-gray-700 text-xs">{orderId}</span>
              </div>
            )}
            {paymentId && (
              <div className="flex justify-between">
                <span className="text-gray-500">Payment ID:</span>
                <span className="font-mono text-gray-700 text-xs">{paymentId}</span>
              </div>
            )}
          </div>
        )}

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
