import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getQuizEntries, getQuizCount } from "@/lib/quiz-storage";
import { fetchTNOrders } from "@/lib/tiendanube";
import { ageToRange } from "@/lib/label-map";
import { supabase } from "@/lib/supabase";

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

    // Revenue by day (last 14 days) — always independent of admin date filter
    const AR_TZ = "America/Argentina/Buenos_Aires";
    const revenueByDay: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      revenueByDay[d.toLocaleDateString("sv-SE", { timeZone: AR_TZ })] = 0;
    }

    // Chart start: midnight ART 13 days ago = T03:00Z same date
    const chartFromDate = new Date(Date.now() - 13 * 86400000);
    const chartFrom = chartFromDate.toLocaleDateString("sv-SE", { timeZone: AR_TZ }) + "T03:00:00.000Z";

    // GalioPay — fetch last 14 days independently (ignore admin date filter)
    try {
      const { data: chartGalio } = await supabase
        .from("galiopay_orders")
        .select("paid_at, created_at, amount")
        .eq("status", "paid")
        .gte("created_at", chartFrom);
      for (const o of chartGalio || []) {
        const day = new Date(o.paid_at || o.created_at).toLocaleDateString("sv-SE", { timeZone: AR_TZ });
        if (day in revenueByDay) revenueByDay[day] += o.amount || 0;
      }
    } catch (e) {
      console.error("Failed to fetch chart galiopay orders:", e);
    }

    // TN — filter already-fetched allOrders against the 14-day window (no extra API call)
    for (const o of allOrders.filter((o) => o.payment_status === "paid")) {
      const day = new Date(o.closed_at || o.created_at).toLocaleDateString("sv-SE", { timeZone: AR_TZ });
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
    let checkoutQuizIds = new Set<string>();
    try {
      const { data } = await supabase
        .from("checkout_events")
        .select("quiz_id")
        .not("quiz_id", "is", null);
      checkoutQuizIds = new Set((data || []).map((e: { quiz_id: string }) => e.quiz_id));
    } catch (e) {
      console.error("Failed to fetch checkout events for stats:", e);
    }

    // Only match against GalioPay paid orders (approved sale required), by full normalized name
    const galioFullNames = new Set(
      galioOrders
        .map((o) => (o.name || "").trim().toLowerCase().replace(/\s+/g, " "))
        .filter(Boolean)
    );

    const recentQuizzes = quizzes.slice(0, 5).map((q) => {
      const fullName = (q.answers.name || "").trim().toLowerCase().replace(/\s+/g, " ");
      const purchased = fullName.length > 0 && galioFullNames.has(fullName);
      const clickedCheckout = checkoutQuizIds.has(q.id);
      return { ...q, status: purchased ? "compro" : clickedCheckout ? "checkout" : "sin_accion" };
    });

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
