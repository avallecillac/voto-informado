"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CategoryId, UserAnswer, MatchResult } from "@/lib/types";
import { candidates, allQuestions } from "@/data";
import { computeAllMatches, getMatchConfidence } from "@/lib/matching/algorithm";
import type { MatchConfidence } from "@/lib/types";

interface QuizState {
  // Important categories (StemWijzer-style: chosen AFTER answering to weight results)
  // Users pick up to 3 priority topics; those get 2x weight in matching.
  importantCategories: CategoryId[];
  toggleImportantCategory: (id: CategoryId) => void;
  setImportantCategories: (ids: CategoryId[]) => void;

  // Excluded candidates (optional filter on results page)
  excludedCandidates: string[];
  toggleExcludedCandidate: (id: string) => void;

  // Question navigation
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;

  // Answers
  answers: UserAnswer[];
  answerQuestion: (questionId: string, value: number) => void;
  getAnswer: (questionId: string) => UserAnswer | undefined;

  // Computed
  getActiveQuestions: () => typeof allQuestions;
  getMatchResults: () => MatchResult[];
  getConfidence: () => MatchConfidence;
  getTotalQuestions: () => number;
  getAnsweredCount: () => number;
  getProgress: () => number;

  // Reset
  reset: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      importantCategories: [],
      excludedCandidates: [],
      currentQuestionIndex: 0,
      answers: [],

      toggleImportantCategory: (id) =>
        set((state) => {
          if (state.importantCategories.includes(id)) {
            return {
              importantCategories: state.importantCategories.filter(
                (c) => c !== id
              ),
            };
          }
          // Enforce max 3 priorities (StemWijzer-style)
          if (state.importantCategories.length >= 3) return state;
          return {
            importantCategories: [...state.importantCategories, id],
          };
        }),

      setImportantCategories: (ids) =>
        set({ importantCategories: ids }),

      toggleExcludedCandidate: (id) =>
        set((state) => ({
          excludedCandidates: state.excludedCandidates.includes(id)
            ? state.excludedCandidates.filter((c) => c !== id)
            : [...state.excludedCandidates, id],
        })),

      setCurrentQuestionIndex: (index) =>
        set({ currentQuestionIndex: index }),

      nextQuestion: () =>
        set((state) => {
          const questions = get().getActiveQuestions();
          if (state.currentQuestionIndex < questions.length - 1) {
            return { currentQuestionIndex: state.currentQuestionIndex + 1 };
          }
          return state;
        }),

      prevQuestion: () =>
        set((state) => {
          if (state.currentQuestionIndex > 0) {
            return { currentQuestionIndex: state.currentQuestionIndex - 1 };
          }
          return state;
        }),

      answerQuestion: (questionId, value) =>
        set((state) => {
          const existing = state.answers.findIndex(
            (a) => a.questionId === questionId
          );
          const answer: UserAnswer = {
            questionId,
            value,
            importance: 1,
            answeredAt: Date.now(),
          };
          if (existing >= 0) {
            const newAnswers = [...state.answers];
            newAnswers[existing] = answer;
            return { answers: newAnswers };
          }
          return { answers: [...state.answers, answer] };
        }),

      getAnswer: (questionId) =>
        get().answers.find((a) => a.questionId === questionId),

      getActiveQuestions: () => allQuestions,

      getMatchResults: () => {
        const { answers, importantCategories } = get();
        if (answers.length === 0) return [];
        return computeAllMatches(answers, candidates, importantCategories);
      },

      getConfidence: () => getMatchConfidence(get().answers.length),

      getTotalQuestions: () => get().getActiveQuestions().length,

      getAnsweredCount: () => get().answers.length,

      getProgress: () => {
        const total = get().getTotalQuestions();
        if (total === 0) return 0;
        return Math.round((get().answers.length / total) * 100);
      },

      reset: () =>
        set({
          importantCategories: [],
          excludedCandidates: [],
          currentQuestionIndex: 0,
          answers: [],
        }),
    }),
    {
      name: "voto-informado-quiz",
      partialize: (state) => ({
        importantCategories: state.importantCategories,
        excludedCandidates: state.excludedCandidates,
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
      }),
    }
  )
);
