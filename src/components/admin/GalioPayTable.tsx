"use client";

import { useState } from "react";

interface Order {
  id: string;
  reference_id: string;
  payment_id: string | null;
  name: string;
  email: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  created_at: string;
  paid_at: string | null;
}

interface Props {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
  totalRevenue: number;
  totalPaid: number;
  onPageChange: (page: number) => void;
  password: string;
}

function StatusBadge({ status }: { status: Order["status"] }) {
  if (status === "paid") return (
    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full">✅ Pagado</span>
  );
  if (status === "pending") return (
    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full">⏳ Pendiente</span>
  );
  return (
    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-full">❌ Fallido</span>
  );
}

export default function GalioPayTable({ orders, total, page, totalPages, totalRevenue, totalPaid, onPageChange, password }: Props) {
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());

  async function handleResend(orderId: string, password: string) {
    setSending(orderId);
    try {
      const res = await fetch("/api/admin/galiopay-resend", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        setSent((prev) => new Set([...prev, orderId]));
        // Refresh after short delay
        setTimeout(() => window.location.reload(), 1000);
      }
    } finally {
      setSending(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Total órdenes</p>
          <p className="text-2xl font-bold text-white">{total}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Pagadas</p>
          <p className="text-2xl font-bold text-green-400">{totalPaid}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Ingresos totales</p>
          <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString("es-AR")}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-white font-semibold">Órdenes GalioPay ({total})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-left border-b border-gray-800">
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Monto</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No hay órdenes aún</td>
                </tr>
              )}
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-800/50 text-gray-300">
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(o.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{o.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{o.email || "—"}</td>
                  <td className="px-4 py-3 font-semibold text-white">${(o.amount || 0).toLocaleString("es-AR")}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3">
                    {o.status !== "paid" ? (
                      <button
                        onClick={() => handleResend(o.id, password)}
                        disabled={sending === o.id || sent.has(o.id)}
                        className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors whitespace-nowrap"
                      >
                        {sending === o.id ? "Enviando..." : sent.has(o.id) ? "✅ Enviado" : "📧 Enviar acceso"}
                      </button>
                    ) : (
                      <span className="text-gray-500 text-xs">—</span>
                    )}
                  </td>
                </tr>
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
            <span className="text-gray-400 text-sm py-1">{page} / {totalPages}</span>
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
    </div>
  );
}
