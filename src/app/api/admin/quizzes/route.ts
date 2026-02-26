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

  const [entries, total] = await Promise.all([
    getQuizEntries({ from: from || "2026-01-01", to: to || undefined, limit, page }),
    getQuizCount(from || "2026-01-01", to || undefined),
  ]);

  // Only checkout events — "compró" is exclusive to the GalioPay section
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

  const quizzesWithStatus = entries.map((q) => ({
    ...q,
    status: checkoutQuizIds.has(q.id) ? "checkout" : "sin_accion",
  }));

  return NextResponse.json({
    quizzes: quizzesWithStatus,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
