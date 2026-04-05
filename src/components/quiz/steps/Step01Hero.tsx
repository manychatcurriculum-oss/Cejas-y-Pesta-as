"use client";

import Image from "next/image";
import { useQuizStore } from "@/store/quizStore";
import { trackQuizStart } from "@/lib/analytics";
import Button from "@/components/ui/Button";

export default function Step01Hero() {
  const nextStep = useQuizStore((s) => s.nextStep);

  const handleStart = () => {
    useQuizStore.setState({ quizEntryId: null });
    trackQuizStart();
    nextStep();
  };

  return (
    <div className="flex flex-col space-y-3 pt-1">

      {/* Hero image */}
      <div className="w-full rounded-xl overflow-hidden relative bg-pink-50" style={{ height: "160px" }}>
        <Image
          src="/images/quiz-hero.webp"
          alt="Masterclass Cejas & Pestañas"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-white font-extrabold text-lg leading-tight drop-shadow-lg">
            Masterclass Cejas & Pestañas
          </p>
          <p className="text-pink-200 text-xs font-medium mt-0.5">
            De cero a profesional — 13 módulos en video
          </p>
        </div>
      </div>

      {/* Headline */}
      <div className="space-y-1">
        <h1 className="text-xl font-extrabold text-gray-900 leading-tight">
          Aprendé las técnicas de belleza{" "}
          <span className="text-pink-600">más pedidas y mejor pagadas</span>
        </h1>
        <p className="text-gray-600 text-xs leading-relaxed">
          Cejas perfectas, lifting, pestañas pelo a pelo y volumen ruso. Desde tu casa, a tu ritmo.
        </p>
      </div>

      {/* What's included */}
      <div className="bg-white rounded-xl border border-pink-100 px-3 py-2.5 space-y-1.5">
        <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wide">Incluye</p>
        {[
          { icon: "🎬", text: "13 módulos en video HD — acceso de por vida" },
          { icon: "✂️", text: "4 técnicas: cejas, lifting, pelo a pelo y volumen ruso" },
          { icon: "📲", text: "Módulo de marketing para conseguir clientas" },
          { icon: "🛡️", text: "Garantía de devolución de 30 días" },
        ].map((item) => (
          <div key={item.text} className="flex items-start gap-2">
            <span className="text-sm shrink-0 leading-snug">{item.icon}</span>
            <p className="text-xs text-gray-700">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Social proof */}
      <div className="flex items-center justify-around bg-pink-50 rounded-xl py-2 px-3 border border-pink-100">
        <div className="text-center">
          <p className="text-lg font-extrabold text-pink-600">+500</p>
          <p className="text-[10px] text-gray-500">alumnas</p>
        </div>
        <div className="w-px h-7 bg-pink-200" />
        <div className="text-center">
          <p className="text-lg font-extrabold text-pink-600">⭐ 5.0</p>
          <p className="text-[10px] text-gray-500">calificación</p>
        </div>
        <div className="w-px h-7 bg-pink-200" />
        <div className="text-center">
          <p className="text-lg font-extrabold text-pink-600">$4.900</p>
          <p className="text-[10px] text-gray-500">pesos ARG</p>
        </div>
      </div>

      <Button onClick={handleStart} pulse>
        Acceder →
      </Button>

      <p className="text-center text-xs text-gray-400">
        Solo 2 preguntas rápidas antes de mostrarte el precio completo
      </p>

    </div>
  );
}
