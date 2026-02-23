import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getQuizEntries } from "@/lib/quiz-storage";
import { fetchTNOrders } from "@/lib/tiendanube";
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

  let entries = (await getQuizEntries()).reverse(); // newest first

  if (from) {
    const fromDate = new Date(from);
    entries = entries.filter((e) => new Date(e.timestamp) >= fromDate);
  }
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    entries = entries.filter((e) => new Date(e.timestamp) <= toDate);
  }

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

  // Fetch TN paid orders to match by first name
  let purchasedFirstNames = new Set<string>();
  try {
    const orders = await fetchTNOrders(from || "2026-01-01", to || undefined);
    purchasedFirstNames = new Set(
      orders
        .filter((o) => o.payment_status === "paid")
        .map((o) => (o.contact_name || "").trim().toLowerCase().split(" ")[0])
        .filter(Boolean)
    );
  } catch (e) {
    console.error("Failed to fetch TN orders for quiz status:", e);
  }

  const total = entries.length;
  const start = (page - 1) * limit;
  const paginated = entries.slice(start, start + limit);

  const quizzesWithStatus = paginated.map((q) => {
    const firstName = (q.answers.name || "").trim().toLowerCase();
    const purchased = firstName.length > 0 && purchasedFirstNames.has(firstName);
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
