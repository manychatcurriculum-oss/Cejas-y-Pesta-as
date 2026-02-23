import { NextResponse } from "next/server";
import { appendQuizEntry } from "@/lib/quiz-storage";

export async function POST(req: Request) {
  try {
    const { answers, bmiResult } = await req.json();

    if (!answers) {
      return NextResponse.json(
        { error: "Missing quiz answers" },
        { status: 400 }
      );
    }

    // Persist quiz entry for admin dashboard
    let quizId: string | null = null;
    try {
      const entry = await appendQuizEntry(answers, bmiResult);
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
