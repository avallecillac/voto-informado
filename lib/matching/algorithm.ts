import type {
  UserAnswer,
  Candidate,
  MatchResult,
  CategoryMatch,
  MatchConfidence,
  CategoryId,
} from "@/lib/types";

/**
 * Normalize a candidate's stance (which may be -2, -1, 0, +1 or +2 in source
 * data, preserving nuance from program extraction) to the 3-choice scale the
 * user answers on: {-2: En desacuerdo, 0: Neutral, +2: De acuerdo}.
 *
 * This ensures that a candidate with a "mild support" (+1) reads as a full
 * match when the user says "De acuerdo" (+2). The extra nuance in the source
 * data is preserved for audit and potential future use.
 */
function normalizeStance(stance: number): number {
  if (stance <= -1) return -2;
  if (stance >= 1) return 2;
  return 0;
}

/**
 * Compute match between a single user answer and a candidate's stance.
 * Returns a value between 0 (complete disagreement) and 1 (perfect agreement).
 *
 * Both sides are normalized to the 3-choice scale, so:
 *   user +2 vs candidate +1 or +2 → 100% match
 *   user +2 vs candidate 0        → 50% match
 *   user +2 vs candidate -1 or -2 → 0% match
 */
function questionMatch(userValue: number, candidateStance: number): number {
  const userNorm = normalizeStance(userValue);
  const candNorm = normalizeStance(candidateStance);
  const distance = Math.abs(userNorm - candNorm);
  return 1 - distance / 4;
}

/**
 * Compute overall match between a user's answers and a candidate.
 *
 * StemWijzer-style weighting: questions in the user's "important" categories
 * get 2x weight, all others get 1x. This replaces per-question importance.
 */
export function computeMatch(
  answers: UserAnswer[],
  candidate: Candidate,
  importantCategories: CategoryId[] = []
): MatchResult {
  const positionMap = new Map(
    candidate.positions.map((p) => [p.questionId, p])
  );
  const importantSet = new Set(importantCategories);

  let weightedSum = 0;
  let totalWeight = 0;
  const perQuestion: { questionId: string; match: number; weight: number }[] =
    [];

  // Category tracking
  const categoryData = new Map<
    string,
    { weightedSum: number; totalWeight: number; count: number; total: number }
  >();

  for (const answer of answers) {
    const position = positionMap.get(answer.questionId);
    if (!position) continue;

    const match = questionMatch(answer.value, position.stance);

    // Extract category from question ID (e.g. "econ-01" -> "econ")
    const categoryPrefix = answer.questionId.split("-")[0];
    const categoryId = prefixToCategory(categoryPrefix);

    // Weight: 2x for important categories, 1x otherwise
    const weight = categoryId && importantSet.has(categoryId) ? 2 : 1;

    weightedSum += weight * match;
    totalWeight += weight;
    perQuestion.push({ questionId: answer.questionId, match, weight });

    if (categoryId) {
      const existing = categoryData.get(categoryId) || {
        weightedSum: 0,
        totalWeight: 0,
        count: 0,
        total: 0,
      };
      existing.weightedSum += weight * match;
      existing.totalWeight += weight;
      existing.count += 1;
      categoryData.set(categoryId, existing);
    }
  }

  const overallMatch = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;

  // Sort by match score to find agreements/disagreements
  const sorted = [...perQuestion].sort((a, b) => b.match - a.match);
  const topAgreements = sorted.slice(0, 3).map((q) => q.questionId);
  const topDisagreements = sorted
    .slice(-3)
    .reverse()
    .map((q) => q.questionId);

  const categoryMatches: CategoryMatch[] = Array.from(
    categoryData.entries()
  ).map(([categoryId, data]) => ({
    categoryId: categoryId as CategoryId,
    match: data.totalWeight > 0 ? (data.weightedSum / data.totalWeight) * 100 : 0,
    questionsAnswered: data.count,
    questionsTotal: data.total,
  }));

  return {
    candidateId: candidate.id,
    overallMatch: Math.round(overallMatch * 10) / 10,
    categoryMatches,
    topAgreements,
    topDisagreements,
  };
}

/**
 * Compute matches for all candidates, sorted by match percentage descending.
 */
export function computeAllMatches(
  answers: UserAnswer[],
  candidates: Candidate[],
  importantCategories: CategoryId[] = []
): MatchResult[] {
  return candidates
    .map((candidate) => computeMatch(answers, candidate, importantCategories))
    .sort((a, b) => b.overallMatch - a.overallMatch);
}

/**
 * Determine confidence level based on number of answered questions.
 */
export function getMatchConfidence(answeredCount: number): MatchConfidence {
  if (answeredCount < 5) return "baja";
  if (answeredCount < 15) return "media";
  return "alta";
}

/**
 * Map question ID prefix to category ID.
 */
function prefixToCategory(prefix: string): CategoryId | null {
  const map: Record<string, CategoryId> = {
    econ: "economia",
    com: "comercio_exterior",
    agr: "agricultura",
    ene: "energia",
    amb: "medio_ambiente",
    edu: "educacion",
    seg: "seguridad",
    sal: "salud",
    jus: "justicia",
    ext: "politica_exterior",
    tec: "tecnologia",
    viv: "vivienda",
    tra: "trabajo",
    cul: "cultura",
  };
  return map[prefix] || null;
}
