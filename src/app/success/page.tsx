"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trackPurchase } from "@/lib/analytics";
import { PRICE } from "@/lib/constants";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (!orderId) return;
    // Prevent firing more than once per orderId (reloads, back-navigation, StrictMode)
    const storageKey = `gf_px_${orderId}`;
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
    // eventId matches CAPI webhook "gp_${referenceId}" — FB deduplicates browser+server
    trackPurchase(PRICE, `gp_${orderId}`);
  }, [orderId]);

  useEffect(() => {
    if (seconds <= 0) {
      router.push("/gracias");
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-5">

        {/* Icono */}
        <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-5xl">✅</span>
        </div>

        {/* Título */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">¡Pago confirmado!</h1>
          <p className="text-gray-500 text-base">
            Tu plan Gelatina Fit está en camino. Te enviamos el acceso completo a tu email ahora mismo.
          </p>
        </div>

        {/* Spam warning — destacado */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 text-left space-y-1">
          <p className="text-yellow-800 font-bold text-sm">📬 Revisá tu email ahora</p>
          <p className="text-yellow-700 text-sm">
            Si no lo ves en los próximos minutos, <span className="font-bold">revisá la carpeta de SPAM o correo no deseado</span>. A veces los emails automáticos caen ahí.
          </p>
        </div>

        {/* Qué incluye */}
        <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 text-left space-y-2">
          <p className="text-pink-800 font-bold text-sm">Lo que vas a recibir:</p>
          <ul className="space-y-1">
            {[
              "15 recetas con gelatina para adelgazar",
              "Plan paso a paso para deshinchar la panza",
              "Acceso de por vida — descargá cuando quieras",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-pink-700">
                <span className="mt-0.5 shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA principal */}
        <a
          href="/gracias"
          className="block w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-500/30 hover:from-pink-600 hover:to-pink-700 transition-all text-base"
        >
          Ver mi plan ahora →
        </a>

        <p className="text-xs text-gray-400">
          Redirigiendo automáticamente en{" "}
          <span className="font-bold text-pink-500">{seconds}s</span>…
        </p>

        <p className="text-xs text-gray-400">
          ¿Problemas con tu compra? Escribinos a{" "}
          <a href="mailto:manychatcurriculum@gmail.com" className="underline">
            manychatcurriculum@gmail.com
          </a>
        </p>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
