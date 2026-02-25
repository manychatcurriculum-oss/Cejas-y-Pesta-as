"use client";

interface MPPayment {
  id?: number;
  status?: string;
  status_detail?: string;
  date_created?: string;
  date_approved?: string;
  transaction_amount?: number;
  payer?: { email?: string; first_name?: string; last_name?: string };
  description?: string;
  payment_method_id?: string;
}

interface Props {
  payments: MPPayment[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const statusStyles: Record<string, string> = {
  approved: "bg-green-500/20 text-green-400",
  pending: "bg-yellow-500/20 text-yellow-400",
  in_process: "bg-blue-500/20 text-blue-400",
  rejected: "bg-red-500/20 text-red-400",
  refunded: "bg-purple-500/20 text-purple-400",
  cancelled: "bg-gray-500/20 text-gray-400",
};

const statusLabels: Record<string, string> = {
  approved: "Aprobado",
  pending: "Pendiente",
  in_process: "En proceso",
  rejected: "Rechazado",
  refunded: "Devuelto",
  cancelled: "Cancelado",
};

export default function PaymentTable({ payments, total, page, totalPages, onPageChange }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-white font-semibold">Pagos Tienda Nube ({total})</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-left border-b border-gray-800">
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Monto</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Método</th>
              <th className="px-4 py-3 font-medium">ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/50 text-gray-300">
                <td className="px-4 py-3">
                  {p.date_created
                    ? new Date(p.date_created).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Argentina/Buenos_Aires" })
                    : "—"}
                </td>
                <td className="px-4 py-3 text-white font-medium">
                  ${p.transaction_amount?.toLocaleString("es-AR") || "0"}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[p.status || ""] || "bg-gray-500/20 text-gray-400"}`}>
                    {statusLabels[p.status || ""] || p.status || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{p.payer?.email || "—"}</td>
                <td className="px-4 py-3">{p.payment_method_id || "—"}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{p.id || "—"}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No hay pagos en este período
                </td>
              </tr>
            )}
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
