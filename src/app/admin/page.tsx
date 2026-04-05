"use client";

import { useState, useEffect, useCallback } from "react";
import LoginForm from "@/components/admin/LoginForm";
import OverviewCards from "@/components/admin/OverviewCards";
import RevenueChart from "@/components/admin/RevenueChart";
import QuizTable from "@/components/admin/QuizTable";
import PaymentTable from "@/components/admin/PaymentTable";
import PatternAnalysis from "@/components/admin/PatternAnalysis";
import DateRangePicker from "@/components/admin/DateRangePicker";
import GalioPayTable from "@/components/admin/GalioPayTable";
import AdsLog from "@/components/admin/AdsLog";

type Tab = "resumen" | "quizzes" | "ventas" | "galiopay" | "patrones" | "ads";

interface Stats {
  totalQuizzes: number;
  totalCheckouts: number;
  totalSales: number;
  conversionRate: number;
  totalRevenue: number;
  revenueByDay: Record<string, number>;
  patterns: Record<string, Record<string, number>>;
  recentQuizzes: unknown[];
  recentPayments: unknown[];
}

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("resumen");
  const [stats, setStats] = useState<Stats | null>(null);
  const [quizData, setQuizData] = useState<{ quizzes: unknown[]; total: number; page: number; totalPages: number } | null>(null);
  const [paymentData, setPaymentData] = useState<{ payments: unknown[]; total: number; page: number; totalPages: number } | null>(null);
  const [galioData, setGalioData] = useState<{ orders: unknown[]; total: number; page: number; totalPages: number; totalRevenue: number; totalPaid: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateLabel, setDateLabel] = useState("Todo");

  useEffect(() => {
    const saved = sessionStorage.getItem("admin-password");
    if (saved) setPassword(saved);
  }, []);

  function handleLogin(pw: string) {
    sessionStorage.setItem("admin-password", pw);
    setPassword(pw);
  }

  function handleLogout() {
    sessionStorage.removeItem("admin-password");
    setPassword(null);
    setStats(null);
  }

  const headers = useCallback(() => ({
    "x-admin-password": password || "",
  }), [password]);

  const dateParams = useCallback(() => {
    const params = new URLSearchParams();
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    return params.toString();
  }, [dateFrom, dateTo]);

  useEffect(() => {
    if (!password) return;
    setLoading(true);
    fetch(`/api/admin/stats?${dateParams()}`, { headers: headers() })
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [password, dateFrom, dateTo, headers, dateParams]);

  const fetchQuizzes = useCallback((page: number) => {
    if (!password) return;
    fetch(`/api/admin/quizzes?page=${page}&${dateParams()}`, { headers: headers() })
      .then((r) => r.json())
      .then(setQuizData)
      .catch(console.error);
  }, [password, dateFrom, dateTo, headers, dateParams]);

  useEffect(() => {
    if (tab === "quizzes") fetchQuizzes(1);
  }, [tab, fetchQuizzes]);

  const fetchPayments = useCallback((page: number) => {
    if (!password) return;
    fetch(`/api/admin/payments?page=${page}&${dateParams()}`, { headers: headers() })
      .then((r) => r.json())
      .then(setPaymentData)
      .catch(console.error);
  }, [password, dateFrom, dateTo, headers, dateParams]);

  useEffect(() => {
    if (tab === "ventas") fetchPayments(1);
  }, [tab, fetchPayments]);

  const fetchGalioOrders = useCallback((page: number) => {
    if (!password) return;
    fetch(`/api/admin/galiopay-orders?page=${page}&${dateParams()}`, { headers: headers() })
      .then((r) => r.json())
      .then(setGalioData)
      .catch(console.error);
  }, [password, dateFrom, dateTo, headers, dateParams]);

  useEffect(() => {
    if (tab === "galiopay") fetchGalioOrders(1);
  }, [tab, fetchGalioOrders]);

  function handleDateChange(from: string, to: string, label: string) {
    setDateFrom(from);
    setDateTo(to);
    setDateLabel(label);
  }

  if (!password) return <LoginForm onLogin={handleLogin} />;

  const tabs: { key: Tab; label: string }[] = [
    { key: "resumen", label: "Resumen" },
    { key: "quizzes", label: "Quizzes" },
    { key: "ventas", label: "Ventas TN" },
    { key: "galiopay", label: "GalioPay 💳" },
    { key: "patrones", label: "Patrones" },
    { key: "ads", label: "Ads 📢" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Gelatina Fit Admin</h1>
        <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm transition-colors">
          Cerrar sesión
        </button>
      </div>

      <div className="flex gap-1 mb-4 bg-gray-900 rounded-lg p-1 w-fit flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.key ? "bg-pink-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <DateRangePicker from={dateFrom} to={dateTo} activeLabel={dateLabel} onChange={handleDateChange} />
      </div>

      {loading && !stats && (
        <div className="text-gray-400 text-center py-12">Cargando...</div>
      )}

      {/* Resumen */}
      {tab === "resumen" && stats && (
        <div className="space-y-6">
          <OverviewCards
            totalQuizzes={stats.totalQuizzes}
            totalCheckouts={stats.totalCheckouts}
            totalSales={stats.totalSales}
            conversionRate={stats.conversionRate}
            totalRevenue={stats.totalRevenue}
          />
          <RevenueChart revenueByDay={stats.revenueByDay} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h3 className="text-white font-semibold mb-3">Últimos quizzes</h3>
              <div className="space-y-2">
                {(stats.recentQuizzes as Array<{ id: string; timestamp: string; answers: { name: string }; status?: string }>).map((q) => (
                  <div key={q.id} className="flex justify-between items-center text-sm gap-2">
                    <span className="text-gray-300 truncate">{q.answers.name || "Sin nombre"}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {q.status === "checkout" ? (
                        <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded-full">Checkout</span>
                      ) : (
                        <span className="bg-gray-700 text-gray-500 text-xs px-1.5 py-0.5 rounded-full">—</span>
                      )}
                      <span className="text-gray-500">
                        {new Date(q.timestamp).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Argentina/Buenos_Aires" })}
                      </span>
                    </div>
                  </div>
                ))}
                {stats.recentQuizzes.length === 0 && <p className="text-gray-500 text-sm">No hay quizzes aún</p>}
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h3 className="text-white font-semibold mb-3">Últimas ventas</h3>
              <div className="space-y-2">
                {(stats.recentPayments as Array<{ id: number; transaction_amount: number; date_approved: string; source?: string }>).map((p) => (
                  <div key={p.id} className="flex justify-between items-center text-sm gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300 font-semibold">${p.transaction_amount?.toLocaleString("es-AR")}</span>
                      {p.source === "GalioPay" ? (
                        <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">GP</span>
                      ) : (
                        <span className="bg-gray-700 text-gray-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">TN</span>
                      )}
                    </div>
                    <span className="text-gray-500 shrink-0">
                      {p.date_approved ? new Date(p.date_approved).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Argentina/Buenos_Aires" }) : "—"}
                    </span>
                  </div>
                ))}
                {stats.recentPayments.length === 0 && <p className="text-gray-500 text-sm">No hay ventas aún</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "quizzes" && quizData && (
        <QuizTable quizzes={quizData.quizzes as never[]} total={quizData.total} page={quizData.page} totalPages={quizData.totalPages} onPageChange={fetchQuizzes} />
      )}

      {tab === "ventas" && paymentData && (
        <PaymentTable payments={paymentData.payments as never[]} total={paymentData.total} page={paymentData.page} totalPages={paymentData.totalPages} onPageChange={fetchPayments} />
      )}

      {tab === "galiopay" && (
        <GalioPayTable
          orders={(galioData?.orders ?? []) as never[]}
          total={galioData?.total ?? 0}
          page={galioData?.page ?? 1}
          totalPages={galioData?.totalPages ?? 1}
          totalRevenue={galioData?.totalRevenue ?? 0}
          totalPaid={galioData?.totalPaid ?? 0}
          onPageChange={fetchGalioOrders}
          password={password || ""}
        />
      )}

      {tab === "patrones" && stats && (
        <PatternAnalysis patterns={stats.patterns} totalQuizzes={stats.totalQuizzes} />
      )}

      {tab === "ads" && <AdsLog />}
    </div>
  );
}
