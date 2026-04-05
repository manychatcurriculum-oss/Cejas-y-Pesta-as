import { NextRequest, NextResponse } from "next/server";
import { createPaymentLink } from "@/lib/galiopay";
import { supabase } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const PRICE = 4900;

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y email requeridos" }, { status: 400 });
    }

    const referenceId = `cb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const link = await createPaymentLink({
      items: [
        {
          title: `Masterclass Cejas & Pestañas - ${name.split(" ")[0]}`,
          quantity: 1,
          unitPrice: PRICE,
          currencyId: "ARS",
        },
      ],
      referenceId,
      description: "Masterclass Cejas & Pestañas - Acceso de por vida",
      backUrl: {
        success: `${SITE_URL}/success?orderId=${referenceId}`,
        failure: `${SITE_URL}/?error=1`,
      },
    });

    const { error: insertError } = await supabase.from("galiopay_orders").insert({
      reference_id: referenceId,
      name,
      email,
      amount: PRICE,
      status: "pending",
    });
    if (insertError) console.error("Supabase insert error:", insertError.message);

    return NextResponse.json({ url: link.url, referenceId }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    console.error("GalioPay create-payment error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
