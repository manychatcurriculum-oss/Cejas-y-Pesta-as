import { NextRequest, NextResponse } from "next/server";
import { sendDeliveryEmail } from "@/lib/email";
import { getPayment } from "@/lib/galiopay";

const processedPayments = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("GalioPay webhook received:", body);

    const { paymentId, status, referenceId } = body;

    if (status !== "approved") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (!paymentId) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (processedPayments.has(paymentId)) {
      console.log("GalioPay: already processed", paymentId);
      return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
    }

    processedPayments.add(paymentId);

    // Verify payment with GalioPay API
    const payment = await getPayment(paymentId);
    console.log("GalioPay payment verified:", payment);

    if (payment.status === "approved") {
      // Extract email from referenceId (stored in Supabase lookup could go here)
      // For now log it — full order storage can be added later
      console.log("GalioPay: payment approved. referenceId:", referenceId);

      // TODO: fetch email from pending orders table by referenceId
      // await sendDeliveryEmail(email, name);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("GalioPay webhook error:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
