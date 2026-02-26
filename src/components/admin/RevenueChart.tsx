"use client";

interface Props {
  revenueByDay?: Record<string, number>;
}

const BAR_MAX_PX = 120;
const LABEL_PX = 20;

export default function RevenueChart({ revenueByDay }: Props) {
  if (!revenueByDay) return null;

  const entries = Object.entries(revenueByDay);
  if (entries.length === 0) return null;

  const maxRevenue = Math.max(...entries.map(([, v]) => v), 1);
  const totalRevenue = entries.reduce((s, [, v]) => s + v, 0);
  const step = entries.length <= 14 ? 1 : entries.length <= 30 ? 3 : 5;

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Ingresos diarios</h3>
        <span className="text-gray-400 text-sm">
          Total:{" "}
          <span className="text-white font-semibold">
            ${totalRevenue.toLocaleString("es-AR")}
          </span>
        </span>
      </div>

      <div
        className="flex items-end gap-px"
        style={{ height: BAR_MAX_PX + LABEL_PX + 8 }}
      >
        {entries.map(([date, amount], i) => {
          const barPx =
            amount > 0
              ? Math.max((amount / maxRevenue) * BAR_MAX_PX, 4)
              : 3;

          const day = new Date(date + "T12:00:00Z").toLocaleDateString(
            "es-AR",
            {
              day: "2-digit",
              month: "2-digit",
              timeZone: "America/Argentina/Buenos_Aires",
            }
          );
          const showLabel = i % step === 0 || i === entries.length - 1;

          return (
            <div
              key={date}
              className="flex-1 flex flex-col items-center justify-end group relative"
              style={{ height: BAR_MAX_PX + LABEL_PX + 8 }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {day} — ${amount.toLocaleString("es-AR")}
              </div>

              {/* Bar */}
              <div
                className={`w-full rounded-t transition-all ${
                  amount > 0
                    ? "bg-pink-500 hover:bg-pink-400"
                    : "bg-gray-700/50"
                }`}
                style={{ height: barPx }}
              />

              {/* Label */}
              <div
                className="flex items-center justify-center"
                style={{ height: LABEL_PX }}
              >
                <span className="text-[9px] text-gray-500 leading-none">
                  {showLabel ? day : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {totalRevenue === 0 && (
        <p className="text-gray-500 text-sm text-center mt-2">
          Sin ventas en el período seleccionado
        </p>
      )}
    </div>
  );
}
