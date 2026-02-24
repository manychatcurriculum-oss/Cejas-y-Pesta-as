import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { sendDeliveryEmail } from "@/lib/email";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { authorized } = requireAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await request.json();
  if (!orderId) {
    return NextResponse.json({ error: "orderId requerido" }, { status: 400 });
  }

  const { data: order, error } = await supabase
    .from("galiopay_orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  }

  const firstName = (order.name || "Cliente").split(" ")[0];
  await sendDeliveryEmail(order.email, firstName);

  // Mark as paid
  await supabase
    .from("galiopay_orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", orderId);

  return NextResponse.json({ success: true, email: order.email });
}
