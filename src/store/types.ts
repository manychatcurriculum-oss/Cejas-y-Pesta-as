export interface QuizAnswers {
  name: string;
  level: string; // "beginner" | "intermediate" | "professional"
  goal: string;  // "emprender" | "uso_personal"
  email: string;
}

export interface QuizState {
  currentStep: number;
  answers: QuizAnswers;
  quizEntryId: string | null;

  nextStep: () => void;
  setStep: (step: number) => void;
  updateAnswer: <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => void;
  setQuizEntryId: (id: string) => void;
  resetQuiz: () => void;
}
