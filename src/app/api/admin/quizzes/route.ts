import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getQuizEntries, getQuizCount } from "@/lib/quiz-storage";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { authorized } = requireAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const from = url.searchParams.get("from") || "";
  const to = url.searchParams.get("to") || "";

  // Use Supabase-level pagination — avoids the 1000 row default limit
  const [entries, total] = await Promise.all([
    getQuizEntries({ from: from || "2026-01-01", to: to || undefined, limit, page }),
    getQuizCount(from || "2026-01-01", to || undefined),
  ]);

  // Fetch checkout events to know which quiz IDs clicked checkout
  let checkoutQuizIds = new Set<string>();
  try {
    const { data } = await supabase
      .from("checkout_events")
      .select("quiz_id")
      .not("quiz_id", "is", null);
    checkoutQuizIds = new Set((data || []).map((e: { quiz_id: string }) => e.quiz_id));
  } catch (e) {
    console.error("Failed to fetch checkout events:", e);
  }

  // Fetch GalioPay paid orders only — match by full normalized name
  const galioFullNames = new Set<string>();
  try {
    let galioQuery = supabase
      .from("galiopay_orders")
      .select("name")
      .eq("status", "paid");
    if (from) galioQuery = galioQuery.gte("created_at", from + "T03:00:00.000Z");
    if (to) {
      const [y, m, d] = to.split("-").map(Number);
      galioQuery = galioQuery.lte("created_at", new Date(Date.UTC(y, m - 1, d + 1, 2, 59, 59, 999)).toISOString());
    }
    const { data } = await galioQuery;
    (data || []).forEach((o: { name: string }) => {
      const fn = (o.name || "").trim().toLowerCase().replace(/\s+/g, " ");
      if (fn) galioFullNames.add(fn);
    });
  } catch (e) {
    console.error("Failed to fetch GalioPay orders for quiz status:", e);
  }

  const quizzesWithStatus = entries.map((q) => {
    const fullName = (q.answers.name || "").trim().toLowerCase().replace(/\s+/g, " ");
    const purchased = fullName.length > 0 && galioFullNames.has(fullName);
    const clickedCheckout = checkoutQuizIds.has(q.id);
    return {
      ...q,
      status: purchased ? "compro" : clickedCheckout ? "checkout" : "sin_accion",
    };
  });

  return NextResponse.json({
    quizzes: quizzesWithStatus,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
