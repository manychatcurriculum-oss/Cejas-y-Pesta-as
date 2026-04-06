import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getQuizEntries, getQuizCount } from "@/lib/quiz-storage";
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

    // Get GalioPay paid orders
    type GalioOrder = { id: string; name: string; email: string; amount: number; status: string; created_at: string; paid_at: string | null };
    let galioOrders: GalioOrder[] = [];
    try {
      const PAGE_SIZE = 1000;
      let offset = 0;
      while (true) {
        let galioQuery = supabase
          .from("galiopay_orders")
          .select("*")
          .eq("status", "paid")
          .gte("created_at", (from || "2026-01-01") + "T03:00:00.000Z")
          .range(offset, offset + PAGE_SIZE - 1);
        if (to) {
          const [y, m, d] = to.split("-").map(Number);
          galioQuery = galioQuery.lte("created_at", new Date(Date.UTC(y, m - 1, d + 1, 2, 59, 59, 999)).toISOString());
        }
        const { data } = await galioQuery;
        const page = data || [];
        galioOrders.push(...page);
        if (page.length < PAGE_SIZE) break;
        offset += PAGE_SIZE;
      }
    } catch (e) {
      console.error("Failed to fetch galiopay orders for stats:", e);
    }

    const galioRevenue = galioOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const totalQuizzes = totalQuizzesCount;
    const totalSales = galioOrders.length;
    const totalRevenue = galioRevenue;
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

    // Pattern analysis from quizzes
    const patterns: Record<string, Record<string, number>> = {
      level: {},
      goal: {},
    };

    for (const q of quizzes) {
      const a = q.answers;
      if (a.level) patterns.level[a.level] = (patterns.level[a.level] || 0) + 1;
      if (a.goal)  patterns.goal[a.goal]   = (patterns.goal[a.goal]   || 0) + 1;
    }

    // Fetch checkout events to tag recent quizzes
    let checkoutQuizIds = new Set<string>();
    let debugCheckout: { totalRows: number; nullQuizIds: number; sampleQuizIds: string[]; error?: string } = { totalRows: 0, nullQuizIds: 0, sampleQuizIds: [] };
    try {
      const { data, error } = await supabase
        .from("checkout_events")
        .select("quiz_id")
        .order("timestamp", { ascending: false })
        .limit(10000);
      if (error) debugCheckout.error = error.message;
      const rows = data || [];
      debugCheckout.totalRows = rows.length;
      debugCheckout.nullQuizIds = rows.filter((e: { quiz_id: string | null }) => !e.quiz_id).length;
      const withId = rows.filter((e: { quiz_id: string | null }) => e.quiz_id);
      debugCheckout.sampleQuizIds = withId.slice(0, 5).map((e: { quiz_id: string }) => e.quiz_id);
      checkoutQuizIds = new Set(withId.map((e: { quiz_id: string }) => e.quiz_id));
    } catch (e) {
      console.error("Failed to fetch checkout events for stats:", e);
    }

    // "compró" is exclusive to GalioPay section — quizzes only show checkout/sin_accion
    const recentQuizzes = quizzes.slice(0, 5).map((q) => ({
      ...q,
      status: checkoutQuizIds.has(q.id) ? "checkout" : "sin_accion",
    }));

    const allRecentPayments = [
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
      _debug: {
        checkoutEvents: debugCheckout,
        recentQuizIds: quizzes.slice(0, 5).map((q) => q.id),
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
