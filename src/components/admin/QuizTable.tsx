"use client";

import { useState } from "react";
import { LABEL_MAP, getLabel, getLabels } from "@/lib/label-map";
import type { QuizAnswers, BMIResult } from "@/store/types";

interface QuizEntry {
  id: string;
  timestamp: string;
  answers: QuizAnswers;
  bmiResult: BMIResult | null;
  status?: "compro" | "checkout" | "sin_accion";
}

interface Props {
  quizzes: QuizEntry[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const answerFields: { key: keyof QuizAnswers; label: string; isArray?: boolean }[] = [
  { key: "age", label: "Edad" },
  { key: "bodyType", label: "Tipo de cuerpo" },
  { key: "fatZones", label: "Zonas", isArray: true },
  { key: "weightImpact", label: "Impacto del peso" },
  { key: "happyWithAppearance", label: "Feliz con apariencia" },
  { key: "barriers", label: "Obstáculos", isArray: true },
  { key: "goals", label: "Objetivos", isArray: true },
  { key: "currentWeight", label: "Peso actual" },
  { key: "height", label: "Altura" },
  { key: "desiredWeight", label: "Peso deseado" },
  { key: "pregnancies", label: "Embarazos" },
  { key: "dailyRoutine", label: "Rutina" },
  { key: "sleepHours", label: "Sueño" },
  { key: "waterIntake", label: "Agua" },
];

export default function QuizTable({ quizzes, total, page, totalPages, onPageChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function formatValue(key: string, value: unknown): string {
    if (typeof value === "number") return String(value);
    if (Array.isArray(value) && key in LABEL_MAP) return getLabels(key, value);
    if (typeof value === "string" && key in LABEL_MAP) return getLabel(key, value);
    return String(value);
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h3 className="text-white font-semibold">Quizzes completados ({total})</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-left border-b border-gray-800">
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Edad</th>
              <th className="px-4 py-3 font-medium">Tipo cuerpo</th>
              <th className="px-4 py-3 font-medium">IMC</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((q) => (
              <>
                <tr
                  key={q.id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/50 cursor-pointer text-gray-300"
                  onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                >
                  <td className="px-4 py-3">
                    {new Date(q.timestamp).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{q.answers.name || "—"}</td>
                  <td className="px-4 py-3">{getLabel("age", q.answers.age)}</td>
                  <td className="px-4 py-3">{getLabel("bodyType", q.answers.bodyType)}</td>
                  <td className="px-4 py-3">
                    {q.bmiResult ? (
                      <span style={{ color: q.bmiResult.color }}>{q.bmiResult.value}</span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {q.status === "compro" ? (
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">✅ Compró</span>
                    ) : q.status === "checkout" ? (
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">🛒 Checkout</span>
                    ) : (
                      <span className="bg-gray-700 text-gray-400 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">— Sin acción</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{expandedId === q.id ? "▲" : "▼"}</td>
                </tr>

                {expandedId === q.id && (
                  <tr key={`${q.id}-detail`} className="bg-gray-800/30">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        {answerFields.map((f) => (
                          <div key={f.key}>
                            <span className="text-gray-500">{f.label}: </span>
                            <span className="text-gray-200">{formatValue(f.key, q.answers[f.key])}</span>
                          </div>
                        ))}
                        {q.bmiResult && (
                          <>
                            <div>
                              <span className="text-gray-500">IMC: </span>
                              <span style={{ color: q.bmiResult.color }}>{q.bmiResult.value} ({q.bmiResult.label})</span>
                            </div>
                            <div>
                              <span className="text-gray-500">A perder: </span>
                              <span className="text-gray-200">{q.bmiResult.weightToLose} kg</span>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-800 flex justify-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-30 hover:bg-gray-700 text-sm"
          >
            Anterior
          </button>
          <span className="text-gray-400 text-sm py-1">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-30 hover:bg-gray-700 text-sm"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
