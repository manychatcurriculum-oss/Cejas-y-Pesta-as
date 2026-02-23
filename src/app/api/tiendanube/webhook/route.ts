import { NextRequest, NextResponse } from "next/server";
import { sendDeliveryEmail } from "@/lib/email";

const STORE_ID = process.env.TIENDANUBE_STORE_ID;
const ACCESS_TOKEN = process.env.TIENDANUBE_ACCESS_TOKEN;

// Track processed orders to avoid duplicate emails
const processedOrders = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const event = request.headers.get("x-tiendanube-topic") || body.event;
    const orderId = String(body.id || body.order_id || "");

    console.log("Tienda Nube webhook received:", { event, orderId, body });

    if (event === "order/paid" || event === "orders/paid") {
      if (!orderId) {
        console.warn("Webhook: Missing orderId");
        return NextResponse.json({ received: true }, { status: 200 });
      }

      if (processedOrders.has(orderId)) {
        console.log("Webhook: Order already processed, skipping:", orderId);
        return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
      }

      // Fetch full order details from Tienda Nube API
      const orderRes = await fetch(`https://api.tiendanube.com/v1/${STORE_ID}/orders/${orderId}`, {
        headers: {
          "Authentication": `bearer ${ACCESS_TOKEN}`,
          "User-Agent": "NDPROD (curriculumfacill@gmail.com)",
        },
      });

      if (!orderRes.ok) {
        console.error("Failed to fetch order:", orderId, orderRes.status);
        return NextResponse.json({ received: true }, { status: 200 });
      }

      const order = await orderRes.json();
      console.log("Order fetched:", { payment_status: order.payment_status, email: order.contact_email });

      if (order.payment_status === "paid" && order.contact_email) {
        const firstName = order.contact_name?.split(" ")[0] || "Cliente";
        processedOrders.add(orderId);
        console.log("Sending delivery email to:", order.contact_email);
        await sendDeliveryEmail(order.contact_email, firstName);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Tienda Nube webhook error:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
