import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { authorized } = requireAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const from = url.searchParams.get("from") || "2026-01-01";
  const to = url.searchParams.get("to") || undefined;

  let query = supabase
    .from("galiopay_orders")
    .select("*", { count: "exact" })
    .gte("created_at", from + "T03:00:00.000Z")
    .order("created_at", { ascending: false });

  if (to) {
    const [y, m, d] = to.split("-").map(Number);
    query = query.lte("created_at", new Date(Date.UTC(y, m - 1, d + 1, 2, 59, 59, 999)).toISOString());
  }

  const { data, count, error } = await query.range((page - 1) * limit, page * limit - 1);

  if (error) {
    console.error("Failed to fetch galiopay orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }

  // Fetch total paid count and revenue across all pages
  let totalRevenue = 0;
  let totalPaid = 0;
  try {
    let revenueQuery = supabase
      .from("galiopay_orders")
      .select("amount")
      .eq("status", "paid")
      .gte("created_at", from + "T03:00:00.000Z");
    if (to) {
      const [y, m, d] = to.split("-").map(Number);
      revenueQuery = revenueQuery.lte("created_at", new Date(Date.UTC(y, m - 1, d + 1, 2, 59, 59, 999)).toISOString());
    }
    const { data: paidOrders } = await revenueQuery;
    totalPaid = (paidOrders || []).length;
    totalRevenue = (paidOrders || []).reduce((sum, o) => sum + (o.amount || 0), 0);
  } catch (e) {
    console.error("Failed to fetch total revenue:", e);
  }

  return NextResponse.json({
    orders: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
    totalRevenue,
    totalPaid,
  });
}
