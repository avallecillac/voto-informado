"use client";

import { useQuizStore } from "@/lib/store/quiz-store";
import { useHydration } from "@/lib/hooks/use-hydration";
import { candidates } from "@/data";
import { Badge } from "@/components/ui/badge";

export function MatchTrackerMini() {
  const answers = useQuizStore((s) => s.answers);
  const getMatchResults = useQuizStore((s) => s.getMatchResults);
  const hydrated = useHydration();

  if (!hydrated || answers.length === 0) {
    return (
      <div className="text-xs text-muted-foreground">
        0 respuestas
      </div>
    );
  }

  const results = getMatchResults();
  const top3 = results.slice(0, 3);

  return (
    <div className="flex items-center gap-2">
      {top3.map((result) => {
        const candidate = candidates.find((c) => c.id === result.candidateId);
        if (!candidate) return null;
        return (
          <Badge
            key={result.candidateId}
            variant="secondary"
            className="gap-1 text-xs"
          >
            <span className="max-w-[60px] truncate sm:max-w-[100px]">
              {candidate.name.split(" ")[0]}
            </span>
            <span className="font-semibold text-blue-600">
              {Math.round(result.overallMatch)}%
            </span>
          </Badge>
        );
      })}
    </div>
  );
}
