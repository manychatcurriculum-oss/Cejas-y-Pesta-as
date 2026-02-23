import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const entry = {
      id: `co_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      quiz_id: body.quiz_id || null,
    };

    await supabase.from("checkout_events").insert(entry);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track checkout:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
