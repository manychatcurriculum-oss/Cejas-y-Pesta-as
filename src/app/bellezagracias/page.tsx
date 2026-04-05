"use client";

import { useEffect, Suspense } from "react";
import { PRODUCT_NAME, STATS, DELIVERABLES } from "@/lib/constants";

function BellezaGraciasContent() {
  // Confetti effect
  useEffect(() => {
    const colors = ["#ec4899", "#f472b6", "#f9a8d4", "#fce7f3", "#fbbf24", "#fcd34d"];
    const confetti: HTMLDivElement[] = [];

    for (let i = 0; i < 50; i++) {
      const el = document.createElement("div");
      el.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -10px;
        left: ${Math.random() * 100}%;
        border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
        z-index: 9999;
        pointer-events: none;
        animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
      `;
      document.body.appendChild(el);
      confetti.push(el);
    }

    const style = document.createElement("style");
    style.textContent = `
      @keyframes confetti-fall {
        to {
          transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      confetti.forEach((el) => el.remove());
      style.remove();
    };
  }, []);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-pink-50 to-white pb-16">
      {/* HEADER */}
      <div className="bg-white border-b border-pink-100 py-12 px-4 shadow-sm shadow-pink-500/5">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-pink-100 flex items-center justify-center animate-bounce">
            <span className="text-4xl">✨</span>
          </div>
          <p className="text-xs font-bold text-pink-500 uppercase tracking-widest">
            ✦ Acceso completo desbloqueado ✦
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Bienvenida a {PRODUCT_NAME}
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Todo tu material está listo. Hacé clic en cada sección para acceder.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-10 space-y-10">

        {/* STATS BAR */}
        <div className="bg-white rounded-2xl border border-pink-100 p-5">
          <div className="flex items-center justify-around">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-extrabold text-pink-600">{stat.num}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.icon} {stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DELIVERABLES CARDS */}
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-extrabold text-gray-900">Tus materiales</h2>
            <p className="text-gray-500 text-sm">Acceso de por vida — sin fecha de vencimiento</p>
          </div>

          <div className="space-y-4">
            {DELIVERABLES.map((item) => (
              <div
                key={item.name}
                className={`group rounded-3xl overflow-hidden border-2 flex flex-col transition-all hover:shadow-xl ${
                  item.isMain
                    ? "border-pink-400 shadow-lg shadow-pink-500/10"
                    : "border-pink-100 hover:border-pink-300"
                }`}
              >
                {/* Card header */}
                <div className={`px-6 py-5 ${item.isMain ? "bg-gradient-to-r from-pink-50 to-white" : "bg-white"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      {item.isMain && (
                        <span className="inline-block bg-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                          Material principal ⭐
                        </span>
                      )}
                      <h3 className="text-lg font-extrabold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <span className="text-3xl shrink-0">🎬</span>
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-6 py-4 bg-white border-t border-pink-50">
                  {item.driveUrl === "REEMPLAZAR_DRIVE_VIDEOS" || item.driveUrl === "REEMPLAZAR_DRIVE_MANUAL" ? (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      <span className="text-amber-500">⏳</span>
                      <p className="text-sm text-amber-700 font-medium">Link en proceso — llegará a tu email pronto</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => window.open(item.driveUrl, "_blank")}
                      className={`w-full font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98] ${
                        item.isMain
                          ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30 hover:from-pink-600 hover:to-pink-700"
                          : "border-2 border-pink-300 text-pink-600 hover:bg-pink-50"
                      }`}
                    >
                      {item.isMain ? "Acceder al curso →" : "Descargar manual →"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRÓXIMOS PASOS */}
        <div className="bg-pink-600 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl shadow-pink-500/40">
          <h2 className="text-2xl font-extrabold text-center">¿Qué hacés ahora?</h2>
          <div className="space-y-4">
            {[
              "Revisá tu email — te llegó el comprobante de compra",
              "Accedé a los videos arriba y empezá con el Módulo 1",
              "Descargá el manual PDF para tener siempre a mano",
              "Practicá con los materiales del módulo correspondiente",
            ].map((step, i) => (
              <div key={step} className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <p className="text-pink-50/90 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SOPORTE */}
        <div className="text-center space-y-3">
          <p className="text-gray-500 text-sm">
            ¿Problemas para acceder?{" "}
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "manychatcurriculum@gmail.com"}`}
              className="text-pink-600 font-semibold underline"
            >
              Escribinos
            </a>{" "}
            y te ayudamos a la brevedad.
          </p>
          <p className="text-xs text-gray-400">{PRODUCT_NAME} — Acceso de por vida ✦</p>
        </div>
      </div>
    </div>
  );
}

export default function BellezaGraciasPage() {
  return (
    <Suspense>
      <BellezaGraciasContent />
    </Suspense>
  );
}
