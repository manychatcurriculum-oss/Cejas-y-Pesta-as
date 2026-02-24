"use client";

import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GalioPayModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

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
      if (!res.ok) throw new Error(data.error || "Error al procesar el pago");

      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado. Intentá de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh]">

        {/* Top pink bar — fixed, never scrolls */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4 rounded-t-3xl sm:rounded-t-3xl shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-xl leading-none">✕</button>
          <p className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-0.5">Pago por transferencia bancaria</p>
          <h2 className="text-white text-xl font-extrabold">¿A dónde enviamos tu plan?</h2>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto overscroll-contain p-6 space-y-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">

          {/* How it works — combate el miedo */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2.5">
            <p className="text-green-800 text-sm font-bold">¿Cómo funciona?</p>
            {[
              { n: "1", text: "Completás el pago de forma segura en segundos" },
              { n: "2", text: "Tu Plan Personalizado Gelatina Fit llega a tu email al instante" },
              { n: "3", text: "Abrís los links y empezás hoy mismo. Acceso de por vida" },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{s.n}</span>
                <p className="text-green-700 text-sm">{s.text}</p>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between bg-pink-50 border border-pink-200 rounded-2xl px-4 py-3">
            <div>
              <p className="text-sm font-bold text-gray-900">Plan Acelerado Gelatina Fit</p>
              <p className="text-xs text-gray-500">15 guías · Pago único · Sin suscripción</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-extrabold text-pink-600">$3.900</p>
              <p className="text-xs text-gray-400">ARS</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tu nombre</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tu email <span className="text-pink-500 font-bold">← acá llega tu Plan Personalizado - Gelatina Fit</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maria@email.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <p className="text-xs text-gray-400 mt-1">Revisá también la carpeta de spam por las dudas</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-500/30 hover:from-pink-600 hover:to-pink-700 transition-all disabled:opacity-50 text-base"
            >
              {loading ? "Procesando..." : "Continuar al pago →"}
            </button>
          </form>

          {/* Guarantee — el gran killer del miedo */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 flex items-start gap-3">
            <span className="text-2xl shrink-0">🛡️</span>
            <div>
              <p className="text-sm font-bold text-gray-800">Garantía de devolución 30 días</p>
              <p className="text-xs text-gray-500">Si por cualquier motivo no te convence, te devolvemos el 100% del dinero. Sin preguntas.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
