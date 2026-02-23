import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { fetchTNOrders } from "@/lib/tiendanube";

let cachedPayments: { data: ReturnType<typeof fetchTNOrders> extends Promise<infer T> ? T : never; fetchedAt: number } | null = null;
const CACHE_TTL = 60_000;

export async function GET(request: Request) {
  const { authorized } = requireAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const from = url.searchParams.get("from") || undefined;
    const to = url.searchParams.get("to") || undefined;

    let allOrders;
    if (cachedPayments && Date.now() - cachedPayments.fetchedAt < CACHE_TTL) {
      allOrders = cachedPayments.data;
    } else {
      allOrders = await fetchTNOrders(from, to);
      cachedPayments = { data: allOrders, fetchedAt: Date.now() };
    }

    // Map to format compatible with admin dashboard
    const payments = allOrders.map((o) => ({
      id: o.id,
      status: o.payment_status === "paid" ? "approved" : o.payment_status,
      status_detail: o.status,
      date_created: o.created_at,
      date_approved: o.closed_at || o.created_at,
      transaction_amount: parseFloat(o.total),
      payer: {
        email: o.contact_email,
        first_name: o.contact_name?.split(" ")[0] || "",
        last_name: o.contact_name?.split(" ").slice(1).join(" ") || "",
      },
      description: "Gelatina Fit",
      payment_method_id: o.gateway_name,
    }));

    const total = payments.length;
    const start = (page - 1) * limit;
    const paginated = payments.slice(start, start + limit);

    return NextResponse.json({
      payments: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}
