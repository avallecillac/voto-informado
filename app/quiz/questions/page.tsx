"use client";

import { useRouter } from "next/navigation";
import { useQuizStore } from "@/lib/store/quiz-store";
import { useHydration } from "@/lib/hooks/use-hydration";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  SkipForward,
  Info,
  ThumbsDown,
  Minus,
  ThumbsUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getCategoryById } from "@/data";

// StemWijzer-style 3-option format. Mapped to the underlying -2/0/+2 scale
// so that existing candidate stance data (-2 to +2) continues to work.
type AnswerOption = {
  value: number;
  label: string;
  short: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  selectedClass: string;
};

const ANSWER_OPTIONS: AnswerOption[] = [
  {
    value: -2,
    label: "En desacuerdo",
    short: "No",
    icon: ThumbsDown,
    colorClass: "text-red-600",
    selectedClass: "border-red-500 bg-red-50 ring-1 ring-red-500",
  },
  {
    value: 0,
    label: "Neutral",
    short: "?",
    icon: Minus,
    colorClass: "text-gray-600",
    selectedClass: "border-gray-500 bg-gray-100 ring-1 ring-gray-500",
  },
  {
    value: 2,
    label: "De acuerdo",
    short: "Sí",
    icon: ThumbsUp,
    colorClass: "text-green-600",
    selectedClass: "border-green-500 bg-green-50 ring-1 ring-green-500",
  },
];

export default function QuestionsPage() {
  const router = useRouter();
  const hydrated = useHydration();
  const currentQuestionIndex = useQuizStore((s) => s.currentQuestionIndex);
  const getActiveQuestions = useQuizStore((s) => s.getActiveQuestions);
  const answerQuestion = useQuizStore((s) => s.answerQuestion);
  const getAnswer = useQuizStore((s) => s.getAnswer);
  const nextQuestion = useQuizStore((s) => s.nextQuestion);
  const prevQuestion = useQuizStore((s) => s.prevQuestion);
  const getProgress = useQuizStore((s) => s.getProgress);
  const getAnsweredCount = useQuizStore((s) => s.getAnsweredCount);

  const questions = getActiveQuestions();
  const question = hydrated ? questions[currentQuestionIndex] : undefined;
  const progress = getProgress();
  const answeredCount = getAnsweredCount();

  const existingAnswer = question ? getAnswer(question.id) : undefined;
  const [selectedValue, setSelectedValue] = useState<number | null>(
    existingAnswer?.value ?? null
  );
  const [showContext, setShowContext] = useState(false);

  useEffect(() => {
    if (question) {
      const existing = getAnswer(question.id);
      setSelectedValue(existing?.value ?? null);
      setShowContext(false);
    }
  }, [question, getAnswer]);

  if (!question) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay preguntas disponibles.</p>
        <Button className="mt-4" onClick={() => router.push("/quiz/intro")}>
          Volver al inicio
        </Button>
      </div>
    );
  }

  const category = getCategoryById(question.categoryId);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = () => {
    if (selectedValue === null) return;
    answerQuestion(question.id, selectedValue);

    if (isLastQuestion) {
      router.push("/quiz/priorities");
    } else {
      nextQuestion();
    }
  };

  const handleSkip = () => {
    if (isLastQuestion) {
      router.push("/quiz/priorities");
    } else {
      nextQuestion();
    }
  };

  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </span>
          <span className="text-muted-foreground">
            {answeredCount} respondidas
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Category badge */}
      {category && (
        <Badge variant="secondary" className="mb-4">
          {category.name}
        </Badge>
      )}

      {/* Question */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold leading-relaxed sm:text-xl">
            {question.text}
          </h2>

          {/* Context toggle */}
          <button
            className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            onClick={() => setShowContext(!showContext)}
          >
            <Info className="h-3.5 w-3.5" />
            {showContext ? "Ocultar contexto" : "Ver contexto"}
          </button>
          {showContext && (
            <p className="mt-2 rounded-md bg-blue-50 p-3 text-sm text-muted-foreground">
              {question.context}
            </p>
          )}

          {/* 3-option answer (StemWijzer-style) */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {ANSWER_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedValue === option.value;
              return (
                <button
                  key={option.value}
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-all ${
                    isSelected
                      ? option.selectedClass
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedValue(option.value)}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      isSelected ? option.colorClass : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isSelected ? option.colorClass : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>

        <Button variant="ghost" size="sm" onClick={handleSkip} className="gap-1">
          Saltar
          <SkipForward className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          onClick={handleAnswer}
          disabled={selectedValue === null}
          className="gap-1"
        >
          {isLastQuestion ? "Continuar" : "Siguiente"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Go to priorities/results early */}
      {answeredCount >= 5 && !isLastQuestion && (
        <div className="mt-4 text-center">
          <Button
            variant="link"
            size="sm"
            onClick={() => router.push("/quiz/priorities")}
            className="text-muted-foreground"
          >
            Ya respondí suficientes. Ver resultados parciales
          </Button>
        </div>
      )}
    </div>
  );
}
