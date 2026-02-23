"use client";

interface Props {
  totalQuizzes: number;
  totalCheckouts: number;
  totalSales: number;
  conversionRate: number;
  totalRevenue: number;
}

function formatMoney(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount.toLocaleString("es-AR")}`;
}

export default function OverviewCards({ totalQuizzes, totalCheckouts, totalSales, conversionRate, totalRevenue }: Props) {
  const cards = [
    { label: "Quizzes", icon: "📋", value: totalQuizzes.toLocaleString("es-AR") },
    { label: "Initiate Checkout", icon: "🛒", value: totalCheckouts.toLocaleString("es-AR") },
    { label: "Ventas", icon: "💰", value: totalSales.toLocaleString("es-AR") },
    { label: "Conversión", icon: "📈", value: `${conversionRate}%` },
    { label: "Ingresos", icon: "💵", value: formatMoney(totalRevenue) },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{card.icon}</span>
            <span className="text-gray-400 text-sm">{card.label}</span>
          </div>
          <p className="text-2xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
