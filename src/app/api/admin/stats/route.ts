import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getQuizEntries } from "@/lib/quiz-storage";
import { fetchTNOrders } from "@/lib/tiendanube";
import { ageToRange } from "@/lib/label-map";

let cachedStats: { data: unknown; fetchedAt: number } | null = null;
const CACHE_TTL = 60_000;

export async function GET(request: Request) {
  const { authorized } = requireAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const from = url.searchParams.get("from") || "2026-01-01";
    const to = url.searchParams.get("to") || undefined;

    // Get quizzes
    let quizzes = await getQuizEntries();
    if (from) {
      const fromDate = new Date(from);
      quizzes = quizzes.filter((q) => new Date(q.timestamp) >= fromDate);
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      quizzes = quizzes.filter((q) => new Date(q.timestamp) <= toDate);
    }

    // Get orders from Tienda Nube (with cache)
    let allOrders: Awaited<ReturnType<typeof fetchTNOrders>> = [];
    const cacheKey = `${from || ""}-${to || ""}`;
    if (cachedStats && Date.now() - cachedStats.fetchedAt < CACHE_TTL) {
      const cached = cachedStats.data as { orders: typeof allOrders; key: string };
      if (cached.key === cacheKey) allOrders = cached.orders;
    }

    if (allOrders.length === 0) {
      try {
        allOrders = await fetchTNOrders(from, to);
        cachedStats = { data: { orders: allOrders, key: cacheKey }, fetchedAt: Date.now() };
      } catch (e) {
        console.error("Error fetching TN orders for stats:", e);
      }
    }

    const approvedOrders = allOrders.filter((o) => o.payment_status === "paid");
    const totalRevenue = approvedOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
    const totalQuizzes = quizzes.length;
    const totalSales = approvedOrders.length;
    const conversionRate = totalQuizzes > 0 ? (totalSales / totalQuizzes) * 100 : 0;

    // Revenue by day (last 14 days)
    const revenueByDay: Record<string, number> = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      revenueByDay[d.toISOString().split("T")[0]] = 0;
    }
    for (const o of approvedOrders) {
      const day = new Date(o.closed_at || o.created_at).toISOString().split("T")[0];
      if (day in revenueByDay) {
        revenueByDay[day] += parseFloat(o.total);
      }
    }

    // Pattern analysis from quizzes
    const patterns: Record<string, Record<string, number>> = {
      age: {}, bodyType: {}, barriers: {}, goals: {}, dailyRoutine: {}, waterIntake: {},
    };

    for (const q of quizzes) {
      const a = q.answers;
      if (a.age) { const k = ageToRange(a.age); patterns.age[k] = (patterns.age[k] || 0) + 1; }
      if (a.bodyType) patterns.bodyType[a.bodyType] = (patterns.bodyType[a.bodyType] || 0) + 1;
      if (a.dailyRoutine) patterns.dailyRoutine[a.dailyRoutine] = (patterns.dailyRoutine[a.dailyRoutine] || 0) + 1;
      if (a.waterIntake) patterns.waterIntake[a.waterIntake] = (patterns.waterIntake[a.waterIntake] || 0) + 1;
      if (a.barriers) for (const b of a.barriers) patterns.barriers[b] = (patterns.barriers[b] || 0) + 1;
      if (a.goals) for (const g of a.goals) patterns.goals[g] = (patterns.goals[g] || 0) + 1;
    }

    const recentQuizzes = quizzes.slice(-5).reverse();
    const recentPayments = approvedOrders.slice(0, 5).map((o) => ({
      id: o.id,
      status: "approved",
      date_approved: o.closed_at || o.created_at,
      transaction_amount: parseFloat(o.total),
      payer: { email: o.contact_email, first_name: o.contact_name?.split(" ")[0] || "" },
    }));

    return NextResponse.json({
      totalQuizzes,
      totalSales,
      conversionRate: Math.round(conversionRate * 10) / 10,
      totalRevenue,
      revenueByDay,
      patterns,
      recentQuizzes,
      recentPayments,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
