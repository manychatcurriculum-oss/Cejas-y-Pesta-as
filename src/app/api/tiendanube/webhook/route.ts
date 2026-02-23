import { NextRequest, NextResponse } from "next/server";
import { sendDeliveryEmail } from "@/lib/email";

// Track processed orders to avoid duplicate emails
const processedOrders = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const event = request.headers.get("x-tiendanube-topic") || body.event;
    const orderId = String(body.id || body.order_id || "");

    console.log("Tienda Nube webhook:", { event, orderId });

    if (event === "order/paid" || event === "orders/paid") {
      if (!orderId) {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      if (processedOrders.has(orderId)) {
        console.log("Order already processed, skipping:", orderId);
        return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
      }

      const email = body.contact_email || body.customer?.email;
      const firstName = body.contact_name?.split(" ")[0] || body.customer?.name?.split(" ")[0] || "Cliente";

      if (email) {
        processedOrders.add(orderId);
        console.log("Sending delivery email to:", email);
        await sendDeliveryEmail(email, firstName);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Tienda Nube webhook error:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
