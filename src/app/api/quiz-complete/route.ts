import { NextResponse } from "next/server";
import { appendQuizEntry } from "@/lib/quiz-storage";

export async function POST(req: Request) {
  try {
    const { answers, bmiResult, quizId: clientQuizId } = await req.json();

    if (!answers) {
      return NextResponse.json(
        { error: "Missing quiz answers" },
        { status: 400 }
      );
    }

    // Persist quiz entry for admin dashboard — use client-generated ID if provided
    let quizId: string | null = null;
    try {
      const entry = await appendQuizEntry(answers, bmiResult, clientQuizId);
      quizId = entry.id;
    } catch (e) {
      console.error("Failed to persist quiz entry:", e);
    }

    return NextResponse.json({ success: true, quizId });
  } catch (error) {
    console.error("Error in quiz-complete:", error);
    return NextResponse.json(
      { error: "Failed to process quiz" },
      { status: 500 }
    );
  }
}
