export interface QuizAnswers {
  age: string;
  bodyType: string;
  fatZones: string[];
  name: string;
  weightImpact: string;
  happyWithAppearance: string;
  barriers: string[];
  goals: string[];
  currentWeight: number;
  height: number;
  desiredWeight: number;
  pregnancies: string;
  dailyRoutine: string;
  sleepHours: string;
  waterIntake: string;
}

export interface PersonalizedTip {
  icon: string;
  title: string;
  description: string;
}

export interface PersonalizedTips {
  greeting: string;
  analysis: string;
  tips: PersonalizedTip[];
  motivation: string;
}

export interface BMIResult {
  value: number;
  category: "bajo" | "normal" | "sobrepeso" | "obesidad1" | "obesidad2" | "obesidad3";
  label: string;
  color: string;
  weightToLose: number;
  idealWeight: number;
  timeEstimate: string;
}

export interface QuizState {
  currentStep: number;
  answers: QuizAnswers;
  bmiResult: BMIResult | null;
  personalizedTips: PersonalizedTips | null;
  quizStartedAt: number | null;
  quizEntryId: string | null;

  nextStep: () => void;
  setStep: (step: number) => void;
  updateAnswer: <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => void;
  toggleArrayAnswer: (key: "fatZones" | "barriers" | "goals", value: string) => void;
  calculateBMI: () => void;
  setPersonalizedTips: (tips: PersonalizedTips) => void;
  setQuizEntryId: (id: string) => void;
  resetQuiz: () => void;
}
