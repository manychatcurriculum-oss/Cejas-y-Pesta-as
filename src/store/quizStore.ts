import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuizState } from "./types";
import { calculateBMIResult } from "@/lib/bmi";

const initialAnswers = {
  age: "",
  bodyType: "",
  fatZones: [] as string[],
  name: "",
  weightImpact: "",
  happyWithAppearance: "",
  barriers: [] as string[],
  goals: [] as string[],
  currentWeight: 70,
  height: 160,
  desiredWeight: 60,
  pregnancies: "",
  dailyRoutine: "",
  sleepHours: "",
  waterIntake: "",
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      answers: { ...initialAnswers },
      bmiResult: null,
      personalizedTips: null,
      quizStartedAt: null,
      quizEntryId: null,

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 20) {
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

      toggleArrayAnswer: (key, value) => {
        set((state) => {
          const current = state.answers[key];
          const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
          return {
            answers: { ...state.answers, [key]: updated },
          };
        });
      },

      calculateBMI: () => {
        const { answers } = get();
        const result = calculateBMIResult(
          answers.currentWeight,
          answers.height,
          answers.desiredWeight
        );
        set({ bmiResult: result });
      },

      setPersonalizedTips: (tips) => {
        set({ personalizedTips: tips });
      },

      setQuizEntryId: (id: string) => {
        set({ quizEntryId: id });
      },

      resetQuiz: () => {
        set({
          currentStep: 1,
          answers: { ...initialAnswers },
          bmiResult: null,
          personalizedTips: null,
          quizStartedAt: null,
          quizEntryId: null,
        });
      },
    }),
    {
      name: "gelatina-fit-quiz",
      partialize: (state) => ({
        currentStep: state.currentStep,
        answers: state.answers,
        bmiResult: state.bmiResult,
        personalizedTips: state.personalizedTips,
        quizStartedAt: state.quizStartedAt,
        quizEntryId: state.quizEntryId,
      }),
    }
  )
);
