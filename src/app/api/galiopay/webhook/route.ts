import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { sendDeliveryEmail } from "@/lib/email";
import { supabase } from "@/lib/supabase";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

async function sendFBPurchaseEvent(opts: {
  email: string;
  firstName: string;
  amount: number;
  eventId: string;
}) {
  const accessToken = process.env.FB_ACCESS_TOKEN;
  if (!accessToken) return;

  try {
    const res = await fetch(
      "https://graph.facebook.com/v19.0/3179298592277269/events",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: "Purchase",
              event_time: Math.floor(Date.now() / 1000),
              event_id: opts.eventId,
              action_source: "website",
              event_source_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/success`,
              user_data: {
                em: [sha256(opts.email)],
                fn: [sha256(opts.firstName)],
              },
              custom_data: {
                value: opts.amount,
                currency: "ARS",
                content_ids: ["cejas-pestanas-masterclass"],
                content_type: "product",
                content_name: "Masterclass Cejas & Pestañas",
              },
            },
          ],
          access_token: accessToken,
        }),
      }
    );
    const data = await res.json();
    console.log("FB CAPI response:", data);
  } catch (e) {
    console.error("FB CAPI error:", e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("GalioPay webhook received:", JSON.stringify(body));

    const { id: paymentId, status, referenceId } = body;

    const isPaid = status === "approved" || status === "paid";
    if (!isPaid) {
      console.log("GalioPay webhook: ignoring status", status);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (!referenceId) {
      console.warn("GalioPay webhook: no referenceId in body");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Fetch order from Supabase — primary deduplication (persistent across serverless instances)
    const { data: order, error: orderError } = await supabase
      .from("galiopay_orders")
      .select("*")
      .eq("reference_id", referenceId)
      .single();

    console.log("Order lookup result:", { order: order?.id, status: order?.status, error: orderError?.message });

    if (!order?.email) {
      console.warn("GalioPay: no order found for referenceId", referenceId);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Skip if already paid — prevents duplicate CAPI events on webhook retries
    if (order.status === "paid") {
      console.log("GalioPay: order already paid, skipping duplicate webhook", referenceId);
      return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
    }

    // Update order status
    const { error: updateError } = await supabase
      .from("galiopay_orders")
      .update({
        status: "paid",
        payment_id: paymentId || null,
        paid_at: new Date().toISOString(),
      })
      .eq("reference_id", referenceId);

    if (updateError) {
      console.error("GalioPay: failed to update order", updateError.message);
    }

    const firstName = (order.name || "Cliente").split(" ")[0];

    // Send delivery email
    console.log("GalioPay: sending delivery email to", order.email);
    await sendDeliveryEmail(order.email, firstName);

    // Fire FB Conversions API (server-side Purchase event)
    await sendFBPurchaseEvent({
      email: order.email,
      firstName,
      amount: order.amount || 3900,
      eventId: `cb_${referenceId}`,
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("GalioPay webhook error:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
