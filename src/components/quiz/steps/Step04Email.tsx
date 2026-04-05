"use client";

import { useState } from "react";
import { useQuizStore } from "@/store/quizStore";
import Button from "@/components/ui/Button";

export default function Step04Email() {
  const { answers, updateAnswer, nextStep } = useQuizStore();
  const [value, setValue] = useState(answers.email);
  const [error, setError] = useState("");

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleContinue = () => {
    if (!isValidEmail(value)) {
      setError("Ingresá un email válido");
      return;
    }
    updateAnswer("email", value.trim().toLowerCase());
    nextStep();
  };

  return (
    <div className="flex flex-col items-center text-center space-y-6 pt-4">
      <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center">
        <span className="text-2xl">📩</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-gray-900">
          {answers.name ? `${answers.name}, ¿` : "¿"}a dónde te enviamos tu resultado?
        </h2>
        <p className="text-gray-500 text-sm">
          Te mandamos tu perfil personalizado y el acceso al curso si decidís continuar
        </p>
      </div>

      <div className="w-full space-y-3">
        <input
          type="email"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          placeholder="tu@email.com"
          autoFocus
          className={`w-full border-2 rounded-2xl px-5 py-4 text-base text-center font-medium text-gray-800 focus:outline-none transition-colors ${
            error ? "border-red-300 bg-red-50" : "border-pink-200 focus:border-pink-500"
          }`}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-xs text-gray-400">🔒 No compartimos tu email. Sin spam.</p>

        <Button onClick={handleContinue} disabled={!value.trim()}>
          Ver mi resultado →
        </Button>
      </div>
    </div>
  );
}
