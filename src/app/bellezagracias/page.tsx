"use client";

import { useEffect, Suspense } from "react";
import { PRODUCT_NAME, DELIVERABLES } from "@/lib/constants";

function BellezaGraciasContent() {
  useEffect(() => {
    const colors = ["#ec4899", "#f472b6", "#f9a8d4", "#fce7f3", "#fbbf24", "#fcd34d"];
    const confetti: HTMLDivElement[] = [];
    for (let i = 0; i < 60; i++) {
      const el = document.createElement("div");
      el.style.cssText = `
        position: fixed;
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -10px;
        left: ${Math.random() * 100}%;
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        z-index: 9999;
        pointer-events: none;
        animation: confetti-fall ${2 + Math.random() * 3}s ${Math.random() * 1.5}s linear forwards;
      `;
      document.body.appendChild(el);
      confetti.push(el);
    }
    const style = document.createElement("style");
    style.textContent = `@keyframes confetti-fall { to { transform: translateY(105vh) rotate(${360 + Math.random() * 720}deg); opacity: 0; } }`;
    document.head.appendChild(style);
    return () => { confetti.forEach((el) => el.remove()); style.remove(); };
  }, []);

  const modules = [
    { icon: "✏️", label: "Diseño y mapeo de cejas" },
    { icon: "🖌️", label: "Pigmentación y tinte" },
    { icon: "✨", label: "Laminado de cejas" },
    { icon: "💎", label: "Lifting de pestañas" },
    { icon: "🪡", label: "Extensiones pelo a pelo" },
    { icon: "🌹", label: "Volumen ruso" },
    { icon: "📲", label: "Marketing y clientas" },
  ];

  return (
    <div className="min-h-dvh bg-[#0f0a14]">

      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a0a2e] via-[#2d1054] to-[#1a0a2e] pt-14 pb-12 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(236,72,153,0.15)_0%,_transparent_60%)]" />
        <div className="relative max-w-lg mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest">
            ✦ Acceso completo desbloqueado ✦
          </div>
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-2xl shadow-pink-500/40 animate-bounce">
            <span className="text-4xl">✨</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            ¡Bienvenida a tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-200">Masterclass</span>!
          </h1>
          <p className="text-pink-200/80 text-base leading-relaxed max-w-sm mx-auto">
            Tus cursos están listos. Hacé clic en cada módulo para acceder ahora mismo.
          </p>

          {/* Stats inline */}
          <div className="flex items-center justify-center gap-6 pt-2">
            {[
              { num: "13", label: "módulos" },
              { num: "4", label: "técnicas" },
              { num: "∞", label: "acceso" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold text-pink-300">{s.num}</p>
                <p className="text-[11px] text-pink-200/50 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-10 space-y-6">

        {/* MÓDULOS INCLUIDOS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">Lo que aprendés</p>
          <div className="grid grid-cols-2 gap-2">
            {modules.map((m) => (
              <div key={m.label} className="flex items-center gap-2">
                <span className="text-base">{m.icon}</span>
                <span className="text-sm text-white/70">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CURSOS */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-pink-400 uppercase tracking-widest px-1">Tus cursos</p>
        </div>

        {DELIVERABLES.map((item, i) => (
          <div
            key={item.name}
            className={`rounded-2xl overflow-hidden border transition-all ${
              item.isMain
                ? "border-pink-500/50 shadow-xl shadow-pink-500/20"
                : "border-white/10"
            }`}
          >
            {/* Card top */}
            <div className={`p-5 ${item.isMain ? "bg-gradient-to-br from-pink-600/30 to-pink-900/20" : "bg-white/5"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl ${item.isMain ? "bg-pink-500" : "bg-white/10"}`}>
                  {item.isMain ? "🎬" : "💅"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {item.isMain && (
                      <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Principal ⭐
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${i === 0 ? "bg-yellow-500/20 text-yellow-300" : "bg-purple-500/20 text-purple-300"}`}>
                      Curso {i + 1}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-sm leading-snug">{item.name}</h3>
                  <p className="text-white/50 text-xs mt-1">{item.description}</p>
                </div>
              </div>
            </div>

            {/* Card CTA */}
            <div className={`px-5 py-4 ${item.isMain ? "bg-pink-950/40" : "bg-black/20"}`}>
              <a
                href={item.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 w-full font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] text-sm ${
                  item.isMain
                    ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30 hover:from-pink-600 hover:to-pink-700"
                    : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
                }`}
              >
                <span>▶</span>
                <span>{item.isMain ? "Acceder al curso ahora" : "Ver este curso"}</span>
              </a>
            </div>
          </div>
        ))}

        {/* PRÓXIMOS PASOS */}
        <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl p-6 space-y-4 shadow-2xl shadow-pink-500/30">
          <h2 className="text-white font-extrabold text-lg">¿Por dónde empezar?</h2>
          <div className="space-y-3">
            {[
              "Abrí el Curso 1 y mirá el Módulo 1 completo",
              "Conseguí los materiales básicos antes de practicar",
              "Avanzá a tu ritmo — los videos no tienen vencimiento",
              "Recordá que podés volver a ver cualquier módulo cuando quieras",
            ].map((step, i) => (
              <div key={step} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-pink-50/90 text-sm leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SOPORTE */}
        <div className="text-center space-y-2 pb-4">
          <p className="text-white/40 text-sm">
            ¿Problemas para acceder?{" "}
            <a href="mailto:manychatcurriculum@gmail.com" className="text-pink-400 font-semibold underline">
              Escribinos
            </a>
          </p>
          <p className="text-white/20 text-xs">{PRODUCT_NAME} — Acceso de por vida ✦</p>
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
