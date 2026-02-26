"use client";

interface Props {
  revenueByDay?: Record<string, number>;
}

export default function RevenueChart({ revenueByDay }: Props) {
  if (!revenueByDay) return null;

  const entries = Object.entries(revenueByDay);
  if (entries.length === 0) return null;

  const maxRevenue = Math.max(...entries.map(([, v]) => v), 1);
  const totalRevenue = entries.reduce((s, [, v]) => s + v, 0);

  // Show date label only every N bars to avoid crowding
  const step = entries.length <= 14 ? 1 : entries.length <= 30 ? 2 : 4;

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Ingresos diarios</h3>
        <span className="text-gray-400 text-sm">
          Total: <span className="text-white font-semibold">${totalRevenue.toLocaleString("es-AR")}</span>
        </span>
      </div>
      <div className="flex items-end gap-1 h-40">
        {entries.map(([date, amount], i) => {
          const height = (amount / maxRevenue) * 100;
          const day = new Date(date + "T12:00:00Z").toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            timeZone: "America/Argentina/Buenos_Aires",
          });
          const showLabel = i % step === 0 || i === entries.length - 1;

          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative min-w-0">
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {day} — ${amount.toLocaleString("es-AR")}
              </div>
              <div
                className={`w-full rounded-t transition-all ${amount > 0 ? "bg-pink-500 hover:bg-pink-400" : "bg-gray-700 hover:bg-gray-600"}`}
                style={{ height: `${Math.max(height, 3)}%` }}
              />
              <span className="text-[9px] text-gray-500 leading-none truncate w-full text-center">
                {showLabel ? day : ""}
              </span>
            </div>
          );
        })}
      </div>
      {totalRevenue === 0 && (
        <p className="text-gray-500 text-sm text-center mt-3">Sin ventas en el período seleccionado</p>
      )}
    </div>
  );
}
