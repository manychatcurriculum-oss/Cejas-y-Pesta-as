"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useQuizStore } from "@/store/quizStore";
import { trackStepView } from "@/lib/analytics";
import ProgressBar from "./ProgressBar";
import StepWrapper from "./StepWrapper";
import Step01Hero from "./steps/Step01Hero";
import Step02Name from "./steps/Step02Name";
import Step03Level from "./steps/Step03Level";
import Step04Goal from "./steps/Step04Goal";
import Step05Email from "./steps/Step04Email";
import Step06Loading from "./steps/Step05Loading";
import Step07Sales from "./steps/Step06Sales";

const TOTAL_STEPS = 7;

const stepComponents: Record<number, React.ComponentType> = {
  1: Step01Hero,
  2: Step02Name,
  3: Step03Level,
  4: Step04Goal,
  5: Step05Email,
  6: Step06Loading,
  7: Step07Sales,
};

export default function QuizShell() {
  const currentStep = useQuizStore((s) => s.currentStep);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);
  const StepComponent = stepComponents[currentStep];

  useEffect(() => {
    trackStepView(currentStep);
  }, [currentStep]);

  const showProgress = currentStep > 1 && currentStep < TOTAL_STEPS;

  return (
    <div className="min-h-dvh flex flex-col relative">
      {process.env.NODE_ENV === "development" && (
        <button
          onClick={resetQuiz}
          className="fixed bottom-4 right-4 z-50 bg-black/50 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm transition-all border border-white/20"
        >
          Reiniciar Quiz (Dev)
        </button>
      )}

      {showProgress && <ProgressBar current={currentStep - 1} total={TOTAL_STEPS - 2} />}

      <div className="flex-1 flex items-start justify-center px-4 py-6">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <StepWrapper stepKey={currentStep}>
              {StepComponent && <StepComponent />}
            </StepWrapper>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
