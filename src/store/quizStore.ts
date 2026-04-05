import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuizState } from "./types";

const initialAnswers = {
  name: "",
  level: "",
  goal: "",
  email: "",
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      answers: { ...initialAnswers },
      quizEntryId: null,

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 7) {
          set({ currentStep: currentStep + 1 });
        }
      },

      setStep: (step: number) => {
        set({ currentStep: step });
      },

      updateAnswer: (key, value) => {
        set((state) => ({
          answers: { ...state.answers, [key]: value },
        }));
      },

      setQuizEntryId: (id: string) => {
        set({ quizEntryId: id });
      },

      resetQuiz: () => {
        set({
          currentStep: 1,
          answers: { ...initialAnswers },
          quizEntryId: null,
        });
      },
    }),
    {
      name: "cejas-quiz",
      partialize: (state) => ({
        currentStep: state.currentStep,
        answers: state.answers,
        quizEntryId: state.quizEntryId,
      }),
    }
  )
);
