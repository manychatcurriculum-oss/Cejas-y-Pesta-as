"use client";

type DateRange = { from: string; to: string; label: string };

function baDate(offsetDays = 0): string {
  const ms = Date.now() + offsetDays * 86400000;
  return new Date(ms).toLocaleDateString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" });
}

const presets: DateRange[] = [
  { from: baDate(0), to: baDate(0), label: "Hoy" },
  { from: baDate(-7), to: baDate(0), label: "7 días" },
  { from: baDate(-30), to: baDate(0), label: "30 días" },
  { from: "", to: "", label: "Todo" },
];

interface Props {
  from: string;
  to: string;
  activeLabel: string;
  onChange: (from: string, to: string, label: string) => void;
}

export default function DateRangePicker({ from, to, activeLabel, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {presets.map((p) => (
        <button
          key={p.label}
          onClick={() => onChange(p.from, p.to, p.label)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeLabel === p.label
              ? "bg-pink-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {p.label}
        </button>
      ))}

      <span className="text-gray-500 text-sm">|</span>

      <input
        type="date"
        value={from}
        onChange={(e) => onChange(e.target.value, to, "Custom")}
        className="bg-gray-800 text-gray-300 text-sm rounded-lg px-2 py-1.5 border border-gray-700 focus:border-pink-500 focus:outline-none"
      />
      <span className="text-gray-500 text-sm">a</span>
      <input
        type="date"
        value={to}
        onChange={(e) => onChange(from, e.target.value, "Custom")}
        className="bg-gray-800 text-gray-300 text-sm rounded-lg px-2 py-1.5 border border-gray-700 focus:border-pink-500 focus:outline-none"
      />
    </div>
  );
}
