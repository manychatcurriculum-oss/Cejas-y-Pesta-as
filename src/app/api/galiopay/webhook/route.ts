import { NextRequest, NextResponse } from "next/server";
import { sendDeliveryEmail } from "@/lib/email";
import { getPayment } from "@/lib/galiopay";
import { supabase } from "@/lib/supabase";

const processedPayments = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("GalioPay webhook received:", body);

    const { paymentId, status, referenceId } = body;

    const isPaid = status === "paid" || status === "approved";
    if (!isPaid) {
      console.log("GalioPay webhook: ignoring status", status);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (!paymentId) {
      console.warn("GalioPay webhook: no paymentId in body", body);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (processedPayments.has(paymentId)) {
      console.log("GalioPay: already processed", paymentId);
      return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
    }

    processedPayments.add(paymentId);

    // Verify with GalioPay API
    const payment = await getPayment(paymentId);
    console.log("GalioPay payment verified:", payment);

    const paymentPaid = payment.status === "paid" || payment.status === "approved";
    if (paymentPaid) {
      // Fetch order from Supabase by referenceId
      const { data: order } = await supabase
        .from("galiopay_orders")
        .select("*")
        .eq("reference_id", referenceId)
        .single();

      if (order?.email) {
        const firstName = (order.name || "Cliente").split(" ")[0];

        // Update order status
        await supabase
          .from("galiopay_orders")
          .update({ status: "paid", payment_id: paymentId, paid_at: new Date().toISOString() })
          .eq("reference_id", referenceId);

        // Send delivery email
        console.log("GalioPay: sending delivery email to", order.email);
        await sendDeliveryEmail(order.email, firstName);
      } else {
        console.warn("GalioPay: no order found for referenceId", referenceId);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("GalioPay webhook error:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
