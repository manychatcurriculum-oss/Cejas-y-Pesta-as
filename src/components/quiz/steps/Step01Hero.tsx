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
    <div className="flex flex-col space-y-5 pt-2">

      {/* Hero image */}
      <div className="w-full rounded-2xl overflow-hidden relative bg-pink-50" style={{ height: "220px" }}>
        <Image
          src="/images/quiz-hero.webp"
          alt="Masterclass Cejas & Pestañas"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-white font-extrabold text-xl leading-tight drop-shadow-lg">
            Masterclass Cejas & Pestañas
          </p>
          <p className="text-pink-200 text-xs font-medium mt-0.5">
            De cero a profesional — 13 módulos en video
          </p>
        </div>
      </div>

      {/* Headline */}
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
          Aprendé las técnicas de belleza{" "}
          <span className="text-pink-600">más pedidas y mejor pagadas</span>{" "}
          de Argentina
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Cejas perfectas, lifting, pestañas pelo a pelo y volumen ruso. Todo en un solo curso, desde tu casa, a tu ritmo.
        </p>
      </div>

      {/* What's included */}
      <div className="bg-white rounded-2xl border border-pink-100 p-4 space-y-2.5">
        <p className="text-xs font-bold text-pink-500 uppercase tracking-wide">Incluye</p>
        {[
          { icon: "🎬", text: "13 módulos en video HD — acceso de por vida" },
          { icon: "✂️", text: "4 técnicas profesionales: cejas, lifting, pelo a pelo y volumen ruso" },
          { icon: "📲", text: "Módulo de marketing para conseguir clientas desde el primer mes" },
          { icon: "🏆", text: "Certificado digital al completar el curso" },
          { icon: "🛡️", text: "Garantía de devolución de 30 días" },
        ].map((item) => (
          <div key={item.text} className="flex items-start gap-2.5">
            <span className="text-base shrink-0 leading-snug">{item.icon}</span>
            <p className="text-sm text-gray-700">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Social proof */}
      <div className="flex items-center justify-around bg-pink-50 rounded-2xl p-3 border border-pink-100">
        <div className="text-center">
          <p className="text-xl font-extrabold text-pink-600">+500</p>
          <p className="text-[11px] text-gray-500">alumnas</p>
        </div>
        <div className="w-px h-8 bg-pink-200" />
        <div className="text-center">
          <p className="text-xl font-extrabold text-pink-600">⭐ 5.0</p>
          <p className="text-[11px] text-gray-500">calificación</p>
        </div>
        <div className="w-px h-8 bg-pink-200" />
        <div className="text-center">
          <p className="text-xl font-extrabold text-pink-600">$4.900</p>
          <p className="text-[11px] text-gray-500">pesos ARG</p>
        </div>
      </div>

      <Button onClick={handleStart} pulse>
        Ver precio y acceder →
      </Button>

      <p className="text-center text-xs text-gray-400">
        Solo 2 preguntas rápidas antes de mostrarte el precio completo
      </p>

    </div>
  );
}
