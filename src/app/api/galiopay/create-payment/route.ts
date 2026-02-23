import { NextRequest, NextResponse } from "next/server";
import { createPaymentLink } from "@/lib/galiopay";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gelatina-delta.vercel.app";
const PRICE = 3900;

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y email requeridos" }, { status: 400 });
    }

    const referenceId = `gf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const link = await createPaymentLink({
      items: [
        {
          title: "Gelatina Fit - Plan Acelerado",
          quantity: 1,
          unitPrice: PRICE,
          currencyId: "ARS",
        },
      ],
      referenceId,
      description: "Gelatina Fit - Plan Acelerado Digital",
      backUrl: {
        success: `${SITE_URL}/test/success?orderId=${referenceId}`,
        failure: `${SITE_URL}/test?error=1`,
      },
    });

    return NextResponse.json({ url: link.url, referenceId }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    console.error("GalioPay create-payment error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
