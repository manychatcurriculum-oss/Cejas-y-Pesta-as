"use client";

import { useQuizStore } from "@/store/quizStore";

const LEVELS = [
  {
    value: "beginner",
    emoji: "🌸",
    title: "Soy principiante",
    description: "Nunca tomé un curso de cejas o pestañas",
  },
  {
    value: "intermediate",
    emoji: "✨",
    title: "Tengo algo de experiencia",
    description: "Hice algún curso o practiqué por mi cuenta",
  },
  {
    value: "professional",
    emoji: "💅",
    title: "Ya trabajo en belleza",
    description: "Quiero sumar técnicas nuevas o perfeccionarme",
  },
];

export default function Step03Level() {
  const { answers, updateAnswer, nextStep } = useQuizStore();

  const handleSelect = (value: string) => {
    updateAnswer("level", value);
    setTimeout(() => nextStep(), 200);
  };

  return (
    <div className="flex flex-col space-y-5 pt-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-gray-900">
          ¿Cuál es tu nivel actual?
        </h2>
        <p className="text-gray-500 text-sm">Elegí la opción que mejor te describe</p>
      </div>

      <div className="space-y-3">
        {LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => handleSelect(level.value)}
            className={`w-full flex items-center gap-4 rounded-2xl p-4 border-2 text-left transition-all active:scale-[0.98] ${
              answers.level === level.value
                ? "border-pink-500 bg-pink-50 shadow-md shadow-pink-500/10"
                : "border-gray-100 bg-white hover:border-pink-300 hover:bg-pink-50/30"
            }`}
          >
            <span className="text-3xl shrink-0">{level.emoji}</span>
            <div>
              <p className="font-bold text-gray-900">{level.title}</p>
              <p className="text-sm text-gray-500 mt-0.5">{level.description}</p>
            </div>
            {answers.level === level.value && (
              <span className="ml-auto text-pink-500 shrink-0 text-lg">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
