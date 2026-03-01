import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getQuizEntries, getQuizCount } from "@/lib/quiz-storage";
import { fetchTNOrders } from "@/lib/tiendanube";
import { ageToRange } from "@/lib/label-map";
import { supabase } from "@/lib/supabase";

// Argentina = UTC-3, no DST. Returns "YYYY-MM-DD" for any UTC timestamp.
function artDate(utcMs: number): string {
  return new Date(utcMs - 3 * 3600000).toISOString().split("T")[0];
}

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

    // Get checkout events count from 2026
    let totalCheckouts = 0;
    try {
      const { count } = await supabase
        .from("checkout_events")
        .select("*", { count: "exact", head: true })
        .gte("timestamp", (from || "2026-01-01") + "T03:00:00.000Z");
      totalCheckouts = count || 0;
    } catch (e) {
      console.error("Failed to fetch checkout events:", e);
    }

    // Get quizzes (newest first, filtered by date)
    const quizzes = await getQuizEntries({ from: from || "2026-01-01", to });
    const totalQuizzesCount = await getQuizCount(from || "2026-01-01", to);

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
    const tnRevenue = approvedOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);

    // Get GalioPay paid orders
    type GalioOrder = { id: string; name: string; email: string; amount: number; status: string; created_at: string; paid_at: string | null };
    let galioOrders: GalioOrder[] = [];
    try {
      let galioQuery = supabase
        .from("galiopay_orders")
        .select("*")
        .eq("status", "paid")
        .gte("created_at", (from || "2026-01-01") + "T03:00:00.000Z");
      if (to) {
        const [y, m, d] = to.split("-").map(Number);
        galioQuery = galioQuery.lte("created_at", new Date(Date.UTC(y, m - 1, d + 1, 2, 59, 59, 999)).toISOString());
      }
      const { data } = await galioQuery;
      galioOrders = data || [];
    } catch (e) {
      console.error("Failed to fetch galiopay orders for stats:", e);
    }

    const galioRevenue = galioOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const totalQuizzes = totalQuizzesCount;
    const totalSales = approvedOrders.length + galioOrders.length;
    const totalRevenue = tnRevenue + galioRevenue;
    const conversionRate = totalQuizzes > 0 ? (totalSales / totalQuizzes) * 100 : 0;

    // Revenue by day — uses the selected date range (capped at 60 days for display)
    const today = artDate(Date.now());
    const chartEnd = to || today;

    // Build day list: noon UTC pivot per day, max 60 days (most recent)
    const endMs   = new Date(chartEnd + "T15:00:00Z").getTime(); // 15:00 UTC = noon ART
    const startMs = Math.max(
      new Date(from + "T15:00:00Z").getTime(),
      endMs - 59 * 86400000
    );
    const revenueByDay: Record<string, number> = {};
    for (let ms = startMs; ms <= endMs + 1000; ms += 86400000) {
      revenueByDay[artDate(ms)] = 0;
    }

    // Aggregate GalioPay paid orders by paid_at (Argentina date)
    for (const o of galioOrders) {
      const day = artDate(new Date(o.paid_at || o.created_at).getTime());
      if (day in revenueByDay) revenueByDay[day] += o.amount || 0;
    }
    // Aggregate TN approved orders by closed_at (Argentina date)
    for (const o of approvedOrders) {
      const day = artDate(new Date(o.closed_at || o.created_at).getTime());
      if (day in revenueByDay) revenueByDay[day] += parseFloat(o.total);
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

    // Fetch checkout events to tag recent quizzes
    // Only need events from the last 30 days to match recent quizzes
    let checkoutQuizIds = new Set<string>();
    try {
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const { data } = await supabase
        .from("checkout_events")
        .select("quiz_id")
        .not("quiz_id", "is", null)
        .gte("timestamp", since)
        .limit(10000);
      checkoutQuizIds = new Set((data || []).map((e: { quiz_id: string }) => e.quiz_id));
    } catch (e) {
      console.error("Failed to fetch checkout events for stats:", e);
    }

    // "compró" is exclusive to GalioPay section — quizzes only show checkout/sin_accion
    const recentQuizzes = quizzes.slice(0, 5).map((q) => ({
      ...q,
      status: checkoutQuizIds.has(q.id) ? "checkout" : "sin_accion",
    }));

    const allRecentPayments = [
      ...approvedOrders.map((o) => ({
        id: o.id,
        status: "approved",
        date_approved: o.closed_at || o.created_at,
        transaction_amount: parseFloat(o.total),
        source: "TN",
      })),
      ...galioOrders.map((o) => ({
        id: o.id,
        status: "paid",
        date_approved: o.paid_at || o.created_at,
        transaction_amount: o.amount || 0,
        source: "GalioPay",
      })),
    ].sort((a, b) => new Date(b.date_approved).getTime() - new Date(a.date_approved).getTime());

    const recentPayments = allRecentPayments.slice(0, 5);

    return NextResponse.json({
      totalQuizzes,
      totalCheckouts,
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
