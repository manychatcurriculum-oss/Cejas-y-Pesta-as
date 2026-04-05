"use client";

import Image from "next/image";
import { useQuizStore } from "@/store/quizStore";

const GOALS = [
  {
    value: "emprender",
    emoji: "💰",
    title: "Quiero emprender y ganar dinero",
    description: "Atender clientas, armar mi negocio propio o sumar ingresos extra",
  },
  {
    value: "uso_personal",
    emoji: "🪞",
    title: "Para uso personal",
    description: "Aprender para hacerme las cejas y pestañas yo sola",
  },
];

const EARNINGS = [
  { service: "Diseño de cejas", price: "$3.000 – $6.000" },
  { service: "Lifting de pestañas", price: "$8.000 – $15.000" },
  { service: "Extensiones pelo a pelo", price: "$12.000 – $22.000" },
  { service: "Volumen ruso", price: "$18.000 – $35.000" },
];

export default function Step04Goal() {
  const { answers, updateAnswer, nextStep } = useQuizStore();

  const handleSelect = (value: string) => {
    updateAnswer("goal", value);
    setTimeout(() => nextStep(), 220);
  };

  return (
    <div className="flex flex-col space-y-5 pt-2">

      {/* Image */}
      <div className="w-full rounded-2xl overflow-hidden relative bg-pink-50" style={{ height: "200px" }}>
        <Image
          src="/images/emprender.webp"
          alt="Emprendé con el curso de cejas y pestañas"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-white font-extrabold text-base leading-tight drop-shadow">
            Miles de mujeres ya cobran por estos servicios
          </p>
          <p className="text-pink-200 text-xs mt-0.5">desde su casa, sin horario fijo</p>
        </div>
      </div>

      {/* Earnings table */}
      <div className="bg-white rounded-2xl border border-pink-100 p-4 space-y-2">
        <p className="text-xs font-bold text-pink-500 uppercase tracking-wide text-center mb-3">
          Cuánto se cobra por servicio en Argentina 🇦🇷
        </p>
        {EARNINGS.map((e) => (
          <div key={e.service} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-700">{e.service}</span>
            <span className="text-sm font-bold text-pink-600">{e.price}</span>
          </div>
        ))}
        <p className="text-xs text-gray-400 text-center pt-1">
          Con 5 clientas por semana ya superás un sueldo promedio
        </p>
      </div>

      {/* Question */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-extrabold text-gray-900">¿Para qué lo vas a usar?</h2>
        <p className="text-sm text-gray-500">Elegí una opción</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {GOALS.map((goal) => (
          <button
            key={goal.value}
            onClick={() => handleSelect(goal.value)}
            className={`w-full flex items-center gap-4 rounded-2xl p-4 border-2 text-left transition-all active:scale-[0.98] ${
              answers.goal === goal.value
                ? "border-pink-500 bg-pink-50 shadow-md shadow-pink-500/10"
                : "border-gray-100 bg-white hover:border-pink-300 hover:bg-pink-50/30"
            }`}
          >
            <span className="text-3xl shrink-0">{goal.emoji}</span>
            <div>
              <p className="font-bold text-gray-900">{goal.title}</p>
              <p className="text-sm text-gray-500 mt-0.5">{goal.description}</p>
            </div>
            {answers.goal === goal.value && (
              <span className="ml-auto text-pink-500 shrink-0 text-lg">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
