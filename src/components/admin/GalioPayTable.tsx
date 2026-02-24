"use client";

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
  onPageChange: (page: number) => void;
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

export default function GalioPayTable({ orders, total, page, totalPages, onPageChange }: Props) {
  const totalPaid = orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.amount, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Total órdenes</p>
          <p className="text-2xl font-bold text-white">{total}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Pagadas (página)</p>
          <p className="text-2xl font-bold text-green-400">{orders.filter((o) => o.status === "paid").length}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Ingresos (página)</p>
          <p className="text-2xl font-bold text-white">${totalPaid.toLocaleString("es-AR")}</p>
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
                <th className="px-4 py-3 font-medium">Pagado</th>
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
                  <td className="px-4 py-3 text-gray-400">
                    {o.paid_at
                      ? new Date(o.paid_at).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
                      : "—"}
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
