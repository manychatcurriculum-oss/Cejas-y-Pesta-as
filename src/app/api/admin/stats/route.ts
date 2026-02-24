import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getQuizEntries } from "@/lib/quiz-storage";
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
        .gte("timestamp", from || "2026-01-01");
      totalCheckouts = count || 0;
    } catch (e) {
      console.error("Failed to fetch checkout events:", e);
    }

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
    const tnRevenue = approvedOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);

    // Get GalioPay paid orders
    type GalioOrder = { id: string; name: string; email: string; amount: number; status: string; created_at: string; paid_at: string | null };
    let galioOrders: GalioOrder[] = [];
    try {
      let galioQuery = supabase
        .from("galiopay_orders")
        .select("*")
        .eq("status", "paid")
        .gte("created_at", from || "2026-01-01");
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        galioQuery = galioQuery.lte("created_at", toDate.toISOString());
      }
      const { data } = await galioQuery;
      galioOrders = data || [];
    } catch (e) {
      console.error("Failed to fetch galiopay orders for stats:", e);
    }

    const galioRevenue = galioOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const totalQuizzes = quizzes.length;
    const totalSales = approvedOrders.length + galioOrders.length;
    const totalRevenue = tnRevenue + galioRevenue;
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
    for (const o of galioOrders) {
      const day = new Date(o.paid_at || o.created_at).toISOString().split("T")[0];
      if (day in revenueByDay) {
        revenueByDay[day] += o.amount || 0;
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

    const purchasedFirstNames = new Set([
      ...approvedOrders
        .map((o) => (o.contact_name || "").trim().toLowerCase().split(" ")[0])
        .filter(Boolean),
      ...galioOrders
        .map((o) => (o.name || "").trim().toLowerCase().split(" ")[0])
        .filter(Boolean),
    ]);

    const recentQuizzes = quizzes.slice(-5).reverse().map((q) => {
      const firstName = (q.answers.name || "").trim().toLowerCase();
      const purchased = firstName.length > 0 && purchasedFirstNames.has(firstName);
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
