import { supabase } from "@/lib/supabase";
import type { QuizAnswers, BMIResult } from "@/store/types";

export interface QuizEntry {
  id: string;
  timestamp: string;
  answers: QuizAnswers;
  bmiResult: BMIResult | null;
}

export async function appendQuizEntry(answers: QuizAnswers, bmiResult: BMIResult | null): Promise<QuizEntry> {
  const entry = {
    id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    answers,
    bmi_result: bmiResult,
  };

  const { error } = await supabase.from("quiz_entries").insert(entry);
  if (error) {
    console.error("Failed to insert quiz entry:", error);
    throw error;
  }

  return { id: entry.id, timestamp: entry.timestamp, answers, bmiResult };
}

export async function getQuizEntries(options?: {
  from?: string;
  to?: string;
  limit?: number;
  page?: number;
}): Promise<QuizEntry[]> {
  const limit = options?.limit ?? 2000;
  const offset = options?.page ? (options.page - 1) * limit : 0;

  let query = supabase
    .from("quiz_entries")
    .select("*")
    .order("timestamp", { ascending: false })
    .range(offset, offset + limit - 1);

  if (options?.from) {
    query = query.gte("timestamp", new Date(options.from).toISOString());
  }
  if (options?.to) {
    const toDate = new Date(options.to);
    toDate.setHours(23, 59, 59, 999);
    query = query.lte("timestamp", toDate.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch quiz entries:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    timestamp: row.timestamp,
    answers: row.answers,
    bmiResult: row.bmi_result,
  }));
}

export async function getQuizCount(from?: string, to?: string): Promise<number> {
  let query = supabase
    .from("quiz_entries")
    .select("*", { count: "exact", head: true });

  if (from) query = query.gte("timestamp", new Date(from).toISOString());
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    query = query.lte("timestamp", toDate.toISOString());
  }

  const { count } = await query;
  return count || 0;
}
