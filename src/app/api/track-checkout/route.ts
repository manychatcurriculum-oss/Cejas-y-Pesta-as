import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  try {
    const entry = {
      id: `co_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
    };

    await supabase.from("checkout_events").insert(entry);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track checkout:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
