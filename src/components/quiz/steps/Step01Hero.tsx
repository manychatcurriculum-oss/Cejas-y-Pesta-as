"use client";

import { useQuizStore } from "@/store/quizStore";
import { trackQuizStart } from "@/lib/analytics";
import Button from "@/components/ui/Button";
import { STATS } from "@/lib/constants";

export default function Step01Hero() {
  const nextStep = useQuizStore((s) => s.nextStep);

  const handleStart = () => {
    useQuizStore.setState({ quizEntryId: null });
    trackQuizStart();
    nextStep();
  };

  return (
    <div className="flex flex-col items-center text-center space-y-5 pt-4">
      {/* Icono animado */}
      <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center">
        <span className="text-4xl">✨</span>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold text-pink-500 uppercase tracking-widest">
          Mini quiz de belleza
        </p>
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
          ¿Cuánto sabés sobre el arte de las{" "}
          <span className="text-pink-600">cejas y pestañas</span>?
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Respondé 3 preguntas rápidas y te armamos{" "}
          <span className="font-semibold text-pink-600">un camino personalizado</span>{" "}
          para convertirte en profesional.
        </p>
      </div>

      {/* Stats bar */}
      <div className="w-full bg-white rounded-2xl border border-pink-100 p-4">
        <div className="flex items-center justify-around">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xl font-extrabold text-pink-600">{stat.num}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{stat.icon} {stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>⏱️</span>
        <span>Solo 1 minuto</span>
        <span className="mx-1">•</span>
        <span>🔒</span>
        <span>100% gratuito</span>
      </div>

      <Button onClick={handleStart} pulse>
        Empezar quiz →
      </Button>

      <p className="text-xs text-gray-400">
        Ya lo completaron +1.200 mujeres argentinas
      </p>
    </div>
  );
}
