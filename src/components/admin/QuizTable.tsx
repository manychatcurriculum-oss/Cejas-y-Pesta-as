"use client";

import { useState } from "react";
import type { QuizAnswers } from "@/store/types";

interface QuizEntry {
  id: string;
  timestamp: string;
  answers: QuizAnswers;
  status?: "compro" | "checkout" | "sin_accion";
}

interface Props {
  quizzes: QuizEntry[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Con experiencia",
  professional: "Trabaja en belleza",
};

const GOAL_LABEL: Record<string, string> = {
  emprender: "Emprender",
  uso_personal: "Uso personal",
};

export default function QuizTable({ quizzes, total, page, totalPages, onPageChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Nivel</th>
              <th className="px-4 py-3 font-medium">Objetivo</th>
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
                    {new Date(q.timestamp).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Argentina/Buenos_Aires" })}
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{q.answers.name || "—"}</td>
                  <td className="px-4 py-3">{q.answers.email || "—"}</td>
                  <td className="px-4 py-3">{LEVEL_LABEL[q.answers.level] || q.answers.level || "—"}</td>
                  <td className="px-4 py-3">{GOAL_LABEL[q.answers.goal] || q.answers.goal || "—"}</td>
                  <td className="px-4 py-3">
                    {q.status === "checkout" ? (
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">🛒 Checkout</span>
                    ) : (
                      <span className="bg-gray-700 text-gray-400 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">— Sin acción</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{expandedId === q.id ? "▲" : "▼"}</td>
                </tr>

                {expandedId === q.id && (
                  <tr key={`${q.id}-detail`} className="bg-gray-800/30">
                    <td colSpan={7} className="px-4 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Nombre: </span>
                          <span className="text-gray-200">{q.answers.name || "—"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Email: </span>
                          <span className="text-gray-200">{q.answers.email || "—"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Nivel: </span>
                          <span className="text-gray-200">{LEVEL_LABEL[q.answers.level] || q.answers.level || "—"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Objetivo: </span>
                          <span className="text-gray-200">{GOAL_LABEL[q.answers.goal] || q.answers.goal || "—"}</span>
                        </div>
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
