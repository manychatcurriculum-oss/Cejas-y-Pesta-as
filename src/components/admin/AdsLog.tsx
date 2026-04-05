"use client";

import { useState, useEffect } from "react";

interface AdsEntry {
  id: string;
  date: string;       // YYYY-MM-DD
  reais: number;
  notes: string;
}

const COTIZACION_REAL = 290;
const PRECIO_NETO = 3680;

function formatARS(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString("es-AR")}`;
}

function formatBRL(n: number) {
  return `R$${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function todayISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
}

export default function AdsLog() {
  const [entries, setEntries] = useState<AdsEntry[]>([]);
  const [formDate, setFormDate] = useState(todayISO());
  const [formReais, setFormReais] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin-ads-log");
    if (saved) {
      try { setEntries(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  function save(next: AdsEntry[]) {
    // ordenar por fecha desc
    const sorted = [...next].sort((a, b) => b.date.localeCompare(a.date));
    setEntries(sorted);
    localStorage.setItem("admin-ads-log", JSON.stringify(sorted));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const reais = parseFloat(formReais);
    if (!formDate || isNaN(reais) || reais <= 0) return;

    if (editId) {
      save(entries.map(en => en.id === editId ? { ...en, date: formDate, reais, notes: formNotes } : en));
      setEditId(null);
    } else {
      const newEntry: AdsEntry = { id: Date.now().toString(), date: formDate, reais, notes: formNotes };
      save([...entries, newEntry]);
    }
    setFormReais("");
    setFormNotes("");
    setFormDate(todayISO());
  }

  function handleEdit(en: AdsEntry) {
    setEditId(en.id);
    setFormDate(en.date);
    setFormReais(en.reais.toString());
    setFormNotes(en.notes);
  }

  function handleDelete(id: string) {
    save(entries.filter(en => en.id !== id));
    if (editId === id) { setEditId(null); setFormReais(""); setFormNotes(""); setFormDate(todayISO()); }
  }

  function handleCancel() {
    setEditId(null);
    setFormReais("");
    setFormNotes("");
    setFormDate(todayISO());
  }

  // Totales
  const totalReais = entries.reduce((s, e) => s + e.reais, 0);
  const totalARS = totalReais * COTIZACION_REAL;

  return (
    <div className="space-y-6">
      {/* Formulario */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h3 className="text-white font-semibold mb-4">
          {editId ? "✏️ Editar registro" : "➕ Registrar gasto en Ads"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs">Fecha</label>
            <input
              type="date"
              value={formDate}
              onChange={e => setFormDate(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs">Gasto en R$</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">R$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formReais}
                onChange={e => setFormReais(e.target.value)}
                placeholder="0,00"
                className="bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-white text-sm w-36 focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>
          </div>
          {formReais && parseFloat(formReais) > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-xs">Equivalente</label>
              <p className="text-gray-300 text-sm py-2">{formatARS(parseFloat(formReais) * COTIZACION_REAL)} ARS</p>
            </div>
          )}
          <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
            <label className="text-gray-400 text-xs">Notas (opcional)</label>
            <input
              type="text"
              value={formNotes}
              onChange={e => setFormNotes(e.target.value)}
              placeholder="ej: Meta Ads - campaña Stories"
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {editId ? "Guardar" : "Agregar"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabla */}
      {entries.length > 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 font-medium px-5 py-3">Fecha</th>
                  <th className="text-right text-gray-400 font-medium px-5 py-3">Gasto R$</th>
                  <th className="text-right text-gray-400 font-medium px-5 py-3">Gasto ARS</th>
                  <th className="text-right text-gray-400 font-medium px-5 py-3">CPV R$</th>
                  <th className="text-right text-gray-400 font-medium px-5 py-3">CPV ARS</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3">Notas</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((en, i) => {
                  const ars = en.reais * COTIZACION_REAL;
                  // CPV calculado solo sobre ads de ese dia (sin ventas por dia disponibles, mostramos referencia sobre 1 venta)
                  // Usamos una referencia de 1 venta = $3860 ARS para estimar breakeven
                  const breakevenVentas = ars / PRECIO_NETO;
                  const cpvARS = ars; // costo total (sin dividir - el usuario sabe cuántas ventas tuvo ese día)
                  const cpvBRL = en.reais;
                  const isToday = en.date === todayISO();
                  return (
                    <tr
                      key={en.id}
                      className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${isToday ? "bg-pink-950/20" : i % 2 === 0 ? "" : "bg-gray-800/20"}`}
                    >
                      <td className="px-5 py-3 text-white">
                        {new Date(en.date + "T12:00:00").toLocaleDateString("es-AR", { weekday: "short", day: "2-digit", month: "2-digit", year: "2-digit" })}
                        {isToday && <span className="ml-2 text-xs bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded-full">hoy</span>}
                      </td>
                      <td className="px-5 py-3 text-right text-yellow-300 font-semibold">{formatBRL(en.reais)}</td>
                      <td className="px-5 py-3 text-right text-white">{formatARS(ars)}</td>
                      <td className="px-5 py-3 text-right text-gray-300 text-xs">
                        <span className="text-gray-500">÷ ventas =</span>
                        <br />
                        <span className="text-yellow-300">{formatBRL(cpvBRL)}</span>
                      </td>
                      <td className="px-5 py-3 text-right text-gray-300 text-xs">
                        <span className="text-gray-500">breakeven: {breakevenVentas.toFixed(1)} ventas</span>
                        <br />
                        <span className="text-gray-400">{formatARS(cpvARS)}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{en.notes || <span className="text-gray-600">—</span>}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(en)}
                            className="text-gray-500 hover:text-white text-xs transition-colors"
                          >
                            editar
                          </button>
                          <button
                            onClick={() => handleDelete(en.id)}
                            className="text-gray-600 hover:text-red-400 text-xs transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-700 bg-gray-800/50">
                  <td className="px-5 py-3 text-gray-400 font-semibold text-sm">Total ({entries.length} días)</td>
                  <td className="px-5 py-3 text-right text-yellow-300 font-bold">{formatBRL(totalReais)}</td>
                  <td className="px-5 py-3 text-right text-white font-bold">{formatARS(totalARS)}</td>
                  <td colSpan={4}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-10 text-center">
          <p className="text-gray-500 text-sm">No hay registros de ads aún. Agregá el primero arriba.</p>
        </div>
      )}
    </div>
  );
}
