import { supabase } from "@/lib/supabase";
import type { QuizAnswers } from "@/store/types";

export interface QuizEntry {
  id: string;
  timestamp: string;
  answers: QuizAnswers;
}

export async function appendQuizEntry(answers: QuizAnswers, id?: string): Promise<QuizEntry> {
  const entry = {
    id: id || `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    answers,
  };

  const { error } = await supabase.from("quiz_entries").insert(entry);
  if (error) {
    console.error("Failed to insert quiz entry:", error);
    throw error;
  }

  return { id: entry.id, timestamp: entry.timestamp, answers };
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
    query = query.gte("timestamp", options.from + "T03:00:00.000Z");
  }
  if (options?.to) {
    const [y, m, d] = options.to.split("-").map(Number);
    query = query.lte("timestamp", new Date(Date.UTC(y, m - 1, d + 1, 2, 59, 59, 999)).toISOString());
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
  }));
}

export async function getQuizCount(from?: string, to?: string): Promise<number> {
  let query = supabase
    .from("quiz_entries")
    .select("*", { count: "exact", head: true });

  if (from) query = query.gte("timestamp", from + "T03:00:00.000Z");
  if (to) {
    const [y, m, d] = to.split("-").map(Number);
    query = query.lte("timestamp", new Date(Date.UTC(y, m - 1, d + 1, 2, 59, 59, 999)).toISOString());
  }

  const { count } = await query;
  return count || 0;
}
