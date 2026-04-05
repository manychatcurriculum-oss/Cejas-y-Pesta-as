"use client";

import { useEffect, useState } from "react";
import { useQuizStore } from "@/store/quizStore";

const MESSAGES = [
  "Analizando tu nivel de conocimiento...",
  "Eligiendo el recorrido ideal para vos...",
  "Preparando tu acceso personalizado...",
  "¡Casi listo!",
];

export default function Step05Loading() {
  const { answers, nextStep } = useQuizStore();
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const total = 4000;
    const interval = 50;
    const step = (interval / total) * 100;
    let current = 0;

    const progressTimer = setInterval(() => {
      current += step;
      setProgress(Math.min(current, 100));
      if (current >= 100) clearInterval(progressTimer);
    }, interval);

    const messageTimer = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 1000);

    const doneTimer = setTimeout(() => {
      nextStep();
    }, total);

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
      clearTimeout(doneTimer);
    };
  }, [nextStep]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 px-4">
      {/* Spinner animado */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-pink-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">✨</span>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Armando tu perfil{answers.name ? `, ${answers.name}` : ""}...
        </h2>
        <p className="text-pink-600 font-medium min-h-[1.5rem] transition-all duration-500">
          {MESSAGES[messageIndex]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="w-full bg-pink-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-pink-400 to-pink-600 h-2.5 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
