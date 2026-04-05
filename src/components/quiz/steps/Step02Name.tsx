"use client";

import { useState } from "react";
import { useQuizStore } from "@/store/quizStore";
import Button from "@/components/ui/Button";

export default function Step02Name() {
  const { answers, updateAnswer, nextStep } = useQuizStore();
  const [value, setValue] = useState(answers.name);

  const handleContinue = () => {
    if (!value.trim()) return;
    updateAnswer("name", value.trim());
    nextStep();
  };

  return (
    <div className="flex flex-col items-center text-center space-y-6 pt-4">
      <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center">
        <span className="text-2xl">👋</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-gray-900">¿Cómo te llamás?</h2>
        <p className="text-gray-500 text-sm">Para personalizar tu experiencia</p>
      </div>

      <div className="w-full space-y-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          placeholder="Tu nombre..."
          autoFocus
          className="w-full border-2 border-pink-200 focus:border-pink-500 rounded-2xl px-5 py-4 text-lg text-center font-semibold text-gray-800 focus:outline-none transition-colors placeholder:text-gray-300"
        />

        <Button onClick={handleContinue} disabled={!value.trim()}>
          Continuar →
        </Button>
      </div>
    </div>
  );
}
