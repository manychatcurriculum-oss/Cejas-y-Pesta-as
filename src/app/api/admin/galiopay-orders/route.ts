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
    .gte("created_at", from)
    .order("created_at", { ascending: false });

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    query = query.lte("created_at", toDate.toISOString());
  }

  const { data, count, error } = await query.range((page - 1) * limit, page * limit - 1);

  if (error) {
    console.error("Failed to fetch galiopay orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }

  return NextResponse.json({
    orders: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
