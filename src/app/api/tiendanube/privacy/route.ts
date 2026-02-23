import { NextResponse } from "next/server";

// Compliance webhooks required by Tienda Nube (GDPR-like)
// store/redact, customers/redact, customers/data_request
export async function POST() {
  return NextResponse.json({ received: true }, { status: 200 });
}
