"use client";

import { useEffect, useState } from "react";
import { useQuizStore } from "@/store/quizStore";
import { trackQuizComplete } from "@/lib/analytics";
import { motion } from "framer-motion";

const LOADING_STEPS = [
  "Analizando tus respuestas...",
  "Calculando tu plan nutricional...",
  "Personalizando tu programa...",
  "Preparando tus resultados...",
  "¡Tu plan está listo!",
];

export default function Step19Loading() {
  const nextStep = useQuizStore((s) => s.nextStep);
  const answers = useQuizStore((s) => s.answers);
  const bmiResult = useQuizStore((s) => s.bmiResult);
  const setPersonalizedTips = useQuizStore((s) => s.setPersonalizedTips);
  const setQuizEntryId = useQuizStore((s) => s.setQuizEntryId);
  const name = answers.name;
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 1000;
    const totalDuration = LOADING_STEPS.length * stepDuration;
    const progressInterval = 50;

    // Start Gemini call immediately (runs in parallel with loading animation)
    let tipsData: Record<string, unknown> | null = null;
    const tipsPromise = fetch("/api/generate-tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, bmiResult }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.greeting) {
          setPersonalizedTips(data);
          tipsData = data;
        }
      })
      .catch(() => {});

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / (totalDuration / progressInterval));
        return Math.min(next, 100);
      });
    }, progressInterval);

    const stepTimer = setInterval(() => {
      setCurrentLoadingStep((prev) => {
        if (prev < LOADING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, stepDuration);

    const finishTimer = setTimeout(async () => {
      trackQuizComplete();

      // Wait for Gemini tips before sending email (max 3s extra wait)
      await Promise.race([
        tipsPromise,
        new Promise((r) => setTimeout(r, 3000)),
      ]);

      // Generate ID on frontend so quizEntryId is set immediately (no race condition)
      const quizId = `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      setQuizEntryId(quizId);

      fetch("/api/quiz-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, bmiResult, personalizedTips: tipsData, quizId }),
      }).catch(() => {});

      nextStep();
    }, totalDuration);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
      clearTimeout(finishTimer);
    };
  }, [nextStep, answers, bmiResult, setPersonalizedTips]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 text-center">
        {name ? `${name}, estamos` : "Estamos"} preparando tu plan
      </h2>

      {/* Animated circle */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#fce7f3"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={283}
            animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
            transition={{ duration: 0.1 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-pink-600">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Loading steps */}
      <div className="space-y-2 w-full max-w-xs">
        {LOADING_STEPS.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: i <= currentLoadingStep ? 1 : 0.3,
              x: i <= currentLoadingStep ? 0 : 20,
            }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <span className={i <= currentLoadingStep ? "text-green-500" : "text-gray-300"}>
              {i < currentLoadingStep ? "✅" : i === currentLoadingStep ? "⏳" : "○"}
            </span>
            <span className={`text-sm ${i <= currentLoadingStep ? "text-gray-700" : "text-gray-400"}`}>
              {step}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
