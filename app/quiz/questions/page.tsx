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
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getCategoryById, candidates as allCandidates } from "@/data";
import { getCategoryColor } from "@/lib/category-colors";
import type { Candidate } from "@/lib/types";

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
  const [showCandidates, setShowCandidates] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState<string | null>(null);

  useEffect(() => {
    if (question) {
      const existing = getAnswer(question.id);
      setSelectedValue(existing?.value ?? null);
      setShowContext(false);
      setShowCandidates(false);
      setActiveCandidate(null);
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
  const color = getCategoryColor(question.categoryId);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  /**
   * Group candidates by their normalized stance on the current question.
   * Normalization (see lib/matching/algorithm): -2/-1 → -2, 0 → 0, +1/+2 → +2.
   * Candidates without a documented position on this question go to a
   * separate "sin posición" bucket (shown only if any candidates lack a
   * position, and only as a subtle note - not above a button).
   */
  const candidatesByStance: Record<number, Candidate[]> = { [-2]: [], 0: [], 2: [] };
  const candidatesWithoutPosition: Candidate[] = [];
  for (const cand of allCandidates) {
    const pos = cand.positions.find((p) => p.questionId === question.id);
    if (!pos) {
      candidatesWithoutPosition.push(cand);
      continue;
    }
    const normalized = pos.stance <= -1 ? -2 : pos.stance >= 1 ? 2 : 0;
    candidatesByStance[normalized].push(cand);
  }

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
        <Badge className={`mb-4 ${color.badge} border-transparent`}>
          {category.name}
        </Badge>
      )}

      {/* Question - colored accent bar on top indicates category */}
      <Card className="overflow-hidden p-0">
        <div className={`h-1.5 w-full ${color.accentBg}`} />
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold leading-relaxed sm:text-xl">
            {question.text}
          </h2>

          {/* Context + candidate-positions toggles side by side */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              className={`flex items-center gap-1 text-sm ${color.text} hover:opacity-80`}
              onClick={() => setShowContext(!showContext)}
            >
              <Info className="h-3.5 w-3.5" />
              {showContext ? "Ocultar contexto" : "Ver contexto"}
            </button>
            <button
              className={`flex items-center gap-1 text-sm ${color.text} hover:opacity-80`}
              onClick={() => setShowCandidates(!showCandidates)}
            >
              <Users className="h-3.5 w-3.5" />
              {showCandidates
                ? "Ocultar posición de candidatos"
                : "Qué piensan los candidatos"}
            </button>
          </div>
          {showContext && (
            <p className={`mt-2 rounded-md ${color.softBg} p-3 text-sm text-muted-foreground`}>
              {question.context}
            </p>
          )}

          {/* Candidate positions row - appears above the answer buttons.
              Each candidate badge is shown above the button matching their
              documented stance, colored to match the stance (red / gray /
              green). Clicking a chip opens a detail card with the
              justification from the candidate's program. */}
          {showCandidates && (
            <>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {ANSWER_OPTIONS.map((option) => (
                  <div
                    key={`cands-${option.value}`}
                    className="flex min-h-[2rem] flex-col items-center gap-1"
                  >
                    {candidatesByStance[option.value].length === 0 ? (
                      <span className="text-xs text-muted-foreground/60">
                        —
                      </span>
                    ) : (
                      candidatesByStance[option.value].map((cand) => (
                        <CandidateChip
                          key={cand.id}
                          candidate={cand}
                          stance={option.value}
                          isActive={activeCandidate === cand.id}
                          onClick={() =>
                            setActiveCandidate(
                              activeCandidate === cand.id ? null : cand.id
                            )
                          }
                        />
                      ))
                    )}
                  </div>
                ))}
              </div>
              {candidatesWithoutPosition.length > 0 && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Sin posición documentada:{" "}
                  {candidatesWithoutPosition
                    .map((c) => c.name.split(" ")[0])
                    .join(", ")}
                </p>
              )}

              {/* Detail panel shown when a chip is clicked - works on both
                  mobile (tap) and desktop (click). Shows justification
                  quote and program reference. */}
              {activeCandidate &&
                (() => {
                  const cand = allCandidates.find(
                    (c) => c.id === activeCandidate
                  );
                  const pos = cand?.positions.find(
                    (p) => p.questionId === question.id
                  );
                  if (!cand || !pos) return null;
                  const stanceLabel =
                    pos.stance <= -1
                      ? "En desacuerdo"
                      : pos.stance >= 1
                      ? "De acuerdo"
                      : "Neutral";
                  const stanceStyle =
                    pos.stance <= -1
                      ? "text-red-700 bg-red-100"
                      : pos.stance >= 1
                      ? "text-green-700 bg-green-100"
                      : "text-gray-700 bg-gray-100";
                  return (
                    <div className="mt-3 rounded-md border bg-white p-3 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">{cand.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {cand.party}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${stanceStyle}`}
                        >
                          {stanceLabel}
                        </span>
                        <button
                          onClick={() => setActiveCandidate(null)}
                          className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-gray-100"
                          aria-label="Cerrar"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-3 w-3"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {pos.justification}
                      </p>
                      <p className="mt-2 text-xs text-blue-600">
                        {pos.programReference}
                      </p>
                      {pos.confidence === "inferred" && (
                        <p className="mt-1 text-xs text-yellow-700">
                          Posición inferida (no explícita en el programa)
                        </p>
                      )}
                    </div>
                  );
                })()}
            </>
          )}

          {/* 3-option answer (StemWijzer-style) */}
          <div className={`${showCandidates ? "mt-3" : "mt-6"} grid grid-cols-3 gap-3`}>
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

/**
 * Compact candidate chip shown above the matching answer option to reveal
 * where each candidate stands on the current statement.
 *
 * Colored by stance (red / gray / green) to reinforce the position at a
 * glance. Clickable on both mobile and desktop: opens a detail card with
 * the candidate's justification and program reference.
 */
type ChipColor = {
  base: string;
  active: string;
  initial: string;
};

const CHIP_COLORS: Record<number, ChipColor> = {
  [-2]: {
    base: "border-red-200 bg-red-50 text-red-900 hover:bg-red-100",
    active: "border-red-500 ring-2 ring-red-500",
    initial: "bg-red-200 text-red-800",
  },
  0: {
    base: "border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100",
    active: "border-gray-500 ring-2 ring-gray-400",
    initial: "bg-gray-200 text-gray-700",
  },
  2: {
    base: "border-green-200 bg-green-50 text-green-900 hover:bg-green-100",
    active: "border-green-500 ring-2 ring-green-500",
    initial: "bg-green-200 text-green-800",
  },
};

function CandidateChip({
  candidate,
  stance,
  isActive,
  onClick,
}: {
  candidate: Candidate;
  stance: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const parts = candidate.name.split(" ");
  const first = parts[0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
  const label = lastInitial ? `${first} ${lastInitial}.` : first;
  const initial = first[0];
  const chipColor = CHIP_COLORS[stance] ?? CHIP_COLORS[0];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs shadow-sm transition-all ${
        chipColor.base
      } ${isActive ? chipColor.active : ""}`}
      title={`${candidate.name} - toca para ver justificación`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${chipColor.initial}`}
      >
        {initial}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}
