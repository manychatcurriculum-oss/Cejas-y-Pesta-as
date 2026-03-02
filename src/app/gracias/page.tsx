"use client";

import { useEffect, Suspense } from "react";
import { PRODUCT_NAME, ALL_DELIVERABLES } from "@/lib/constants";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useQuizStore } from "@/store/quizStore";
import GelatinaChatbot from "@/components/gracias/GelatinaChatbot";

function GraciasContent() {
  const { name: storedName } = useQuizStore((state) => state.answers);
  const displayName = storedName || "Cliente";

  // Confetti effect
  useEffect(() => {
    const colors = ["#ec4899", "#f472b6", "#f9a8d4", "#fce7f3", "#fbbf24"];
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
    <div className="min-h-dvh bg-gradient-to-b from-pink-50 to-white pb-12">
      {/* Hero Section */}
      <div className="bg-white border-b border-pink-100 py-12 px-4 shadow-sm shadow-pink-500/5">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-pink-100 flex items-center justify-center animate-bounce">
            <span className="text-4xl text-pink-600">🎉</span>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            ¡Tu transformación empieza hoy!
          </h1>

          <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
            ¡Felicitaciones {displayName} por dar el primer paso! Ya tenés acceso a todo tu material de {PRODUCT_NAME}.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-12">

        {/* Chatbot */}
        <div className="space-y-3">
          <div className="text-center space-y-1">
            <p className="text-xs font-bold text-pink-500 uppercase tracking-wide">Asistente Gelatina Fit</p>
            <h2 className="text-2xl font-extrabold text-gray-900">¿Tenés dudas sobre cómo empezar?</h2>
            <p className="text-gray-500 text-sm">Preguntanos sobre recetas, consejos y cómo arrancar con el plan 💬</p>
          </div>
          <GelatinaChatbot />
        </div>

        {/* All Deliverables with images */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-gray-900">Tus {ALL_DELIVERABLES.length} Recursos</h2>
            <p className="text-gray-500">Todo tu material listo para descargar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ALL_DELIVERABLES.map((item) => (
              <div
                key={item.name}
                className={`group rounded-3xl overflow-hidden border flex flex-col transition-all hover:shadow-xl ${
                  item.highlighted
                    ? "border-pink-500 border-[3px] shadow-xl shadow-pink-500/15 md:col-span-2 lg:col-span-1"
                    : item.main
                    ? "border-pink-400 border-2 shadow-lg shadow-pink-500/10"
                    : "border-pink-100 hover:border-pink-300 hover:shadow-pink-500/10"
                }`}
              >
                {/* Image */}
                <div className={`relative w-full aspect-[3/4] ${
                  item.highlighted ? "bg-gradient-to-br from-pink-100 to-pink-50" : item.main ? "bg-pink-50" : "bg-gray-50"
                }`}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {item.highlighted && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                        Premium 🔥
                      </span>
                    </div>
                  )}
                  {item.main && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                        Plan Principal ⭐
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4 bg-white">
                  <h3 className={`text-lg font-bold leading-tight ${
                    item.highlighted ? "text-pink-700" : "text-gray-900"
                  }`}>
                    {item.name}
                  </h3>
                  <Button
                    onClick={() => window.open(item.driveUrl, "_blank")}
                    variant={item.highlighted || item.main ? undefined : "outline"}
                    className={
                      item.highlighted || item.main
                        ? "w-full"
                        : "w-full border-pink-200 text-pink-600 hover:bg-pink-50"
                    }
                    pulse={item.highlighted || item.main}
                  >
                    {item.highlighted ? "Abrir Ahora 🔥" : item.main ? "Abrir Plan Principal →" : "Abrir PDF →"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-pink-600 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden relative shadow-2xl shadow-pink-500/40">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold leading-tight">
                ¿Qué tenés que hacer ahora?
              </h2>
              <div className="space-y-4">
                {[
                  "Revisá tu email (spam incluido) para el comprobante",
                  "Descargá todos tus PDFs arriba",
                  "Unite a nuestra comunidad en Instagram",
                  "Mañana recibís tu primer tip por email",
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
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center space-y-4">
              <div className="text-4xl">💬</div>
              <h3 className="text-xl font-bold">¿Necesitás ayuda?</h3>
              <p className="text-pink-50 text-sm">
                Nuestro equipo de soporte está listo para acompañarte. Escribinos a:
                <br />
                <span className="font-bold underline">gelatinafit@gmail.com</span>
              </p>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-pink-600 w-full"
                onClick={() => window.location.href = "mailto:gelatinafit@gmail.com"}
              >
                Enviar Email de Soporte
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-gray-400 hover:text-pink-600 transition-colors text-sm font-medium"
          >
            ← Volver al inicio de {PRODUCT_NAME}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense>
      <GraciasContent />
    </Suspense>
  );
}
