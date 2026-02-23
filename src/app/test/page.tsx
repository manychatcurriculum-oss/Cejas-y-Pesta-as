"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function TestCheckout() {
  const searchParams = useSearchParams();
  const hasError = searchParams.get("error") === "1";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(hasError ? "El pago no pudo procesarse. Intentá de nuevo." : "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/galiopay/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al crear el pago");

      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            🧪 PÁGINA DE TEST — GalioPay
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Gelatina Fit</h1>
          <p className="text-gray-500 text-sm">Plan Acelerado · Pago por transferencia bancaria</p>
        </div>

        {/* Product card */}
        <div className="bg-white border border-pink-200 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-gray-900">Plan Acelerado Gelatina Fit</p>
              <p className="text-sm text-gray-500">15 guías digitales · Acceso inmediato</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-pink-600">$3.900</p>
              <p className="text-xs text-gray-400">ARS · Pago único</p>
            </div>
          </div>
          <div className="flex gap-3 text-xs text-gray-500">
            <span>✅ Entrega inmediata</span>
            <span>🔒 Pago seguro</span>
            <span>↩️ Garantía 30 días</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg">Tus datos</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="María García"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria@email.com"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-2xl transition-colors disabled:opacity-50 text-base"
          >
            {loading ? "Procesando..." : "Pagar por transferencia →"}
          </button>

          <p className="text-center text-xs text-gray-400">
            Serás redirigido a GalioPay para completar el pago
          </p>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          ← <a href="/" className="underline">Volver al sitio principal</a>
        </p>
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense>
      <TestCheckout />
    </Suspense>
  );
}
