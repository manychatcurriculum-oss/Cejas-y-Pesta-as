"use client";

interface Props {
  patterns: Record<string, Record<string, number>>;
  totalQuizzes: number;
}

const SECTION_CONFIG = [
  {
    key: "level",
    title: "Nivel de experiencia",
    labelMap: {
      beginner: "Principiante",
      intermediate: "Con experiencia",
      professional: "Trabaja en belleza",
    } as Record<string, string>,
    color: "bg-pink-500",
  },
  {
    key: "goal",
    title: "Objetivo principal",
    labelMap: {
      emprender: "Emprender / ganar dinero",
      uso_personal: "Uso personal",
    } as Record<string, string>,
    color: "bg-purple-500",
  },
];

export default function PatternAnalysis({ patterns, totalQuizzes }: Props) {
  if (totalQuizzes === 0) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center text-gray-500">
        No hay datos de quizzes para analizar
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SECTION_CONFIG.map(({ key, title, labelMap, color }) => {
        const data = patterns[key] || {};
        const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
        const max = entries[0]?.[1] || 1;

        return (
          <div key={key} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h4 className="text-white font-semibold mb-3">{title}</h4>
            <div className="space-y-3">
              {entries.map(([value, count]) => {
                const label = labelMap[value] || value;
                const pct = ((count / totalQuizzes) * 100).toFixed(0);
                const width = (count / max) * 100;

                return (
                  <div key={value}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{label}</span>
                      <span className="text-gray-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {entries.length === 0 && (
                <p className="text-gray-500 text-sm">Sin datos aún</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
