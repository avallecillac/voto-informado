"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuizStore } from "@/lib/store/quiz-store";
import { useHydration } from "@/lib/hooks/use-hydration";
import { getCandidateById, allQuestions, categories } from "@/data";
import { computeMatch } from "@/lib/matching/algorithm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink, FileText, AlertTriangle } from "lucide-react";

const STANCE_LABELS: Record<number, string> = {
  "-2": "Muy en desacuerdo",
  "-1": "En desacuerdo",
  "0": "Neutral",
  "1": "De acuerdo",
  "2": "Muy de acuerdo",
};

const ORIENTATION_LABELS: Record<string, string> = {
  izquierda: "Izquierda",
  "centro-izquierda": "Centro-izquierda",
  centro: "Centro",
  "centro-derecha": "Centro-derecha",
  derecha: "Derecha",
};

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const answers = useQuizStore((s) => s.answers);
  const getAnswer = useQuizStore((s) => s.getAnswer);

  const hydrated = useHydration();
  const candidateId = params.id as string;
  const candidate = getCandidateById(candidateId);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Candidato no encontrado.</p>
        <Button
          className="mt-4"
          onClick={() => router.push("/quiz/results")}
        >
          Volver a resultados
        </Button>
      </div>
    );
  }

  const matchResult = computeMatch(answers, candidate);

  return (
    <div>
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/quiz/results")}
        className="mb-6 gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a resultados
      </Button>

      {/* Candidate header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl font-bold text-gray-400">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{candidate.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge>{candidate.party}</Badge>
              <Badge variant="outline">
                {ORIENTATION_LABELS[candidate.politicalOrientation]}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {candidate.bio}
            </p>
            {candidate.programUrl && (
              <a
                href={candidate.programUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="h-3 w-3" />
                Ver programa de gobierno completo
              </a>
            )}
          </div>
        </div>

        {/* Overall match */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Coincidencia general</span>
            <span
              className={`text-2xl font-bold ${
                matchResult.overallMatch >= 70
                  ? "text-green-600"
                  : matchResult.overallMatch >= 40
                  ? "text-blue-600"
                  : "text-orange-600"
              }`}
            >
              {Math.round(matchResult.overallMatch)}%
            </span>
          </div>
          <Progress value={matchResult.overallMatch} className="mt-2 h-3" />
        </div>
      </div>

      <Separator className="my-6" />

      {/* Position comparison */}
      <h2 className="mb-4 text-lg font-semibold">
        Comparacion pregunta por pregunta
      </h2>

      <div className="space-y-3">
        {candidate.positions.map((position) => {
          const question = allQuestions.find(
            (q) => q.id === position.questionId
          );
          if (!question) return null;

          const userAnswer = getAnswer(position.questionId);
          const category = categories.find(
            (c) => c.id === question.categoryId
          );

          const match = userAnswer
            ? 1 - Math.abs(userAnswer.value - position.stance) / 4
            : null;

          return (
            <Card key={position.questionId}>
              <CardContent className="p-4">
                {/* Category */}
                {category && (
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {category.shortName}
                  </Badge>
                )}

                {/* Question text */}
                <p className="text-sm font-medium leading-relaxed">
                  {question.text}
                </p>

                {/* Stances comparison */}
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {/* User's answer */}
                  <div className="rounded-md bg-gray-50 p-2.5">
                    <span className="text-xs text-muted-foreground">
                      Tu respuesta
                    </span>
                    <p className="mt-0.5 text-sm font-medium">
                      {userAnswer
                        ? STANCE_LABELS[userAnswer.value]
                        : "Sin respuesta"}
                    </p>
                  </div>

                  {/* Candidate's position */}
                  <div className="rounded-md bg-blue-50 p-2.5">
                    <span className="text-xs text-muted-foreground">
                      {candidate.name.split(" ")[0]}
                    </span>
                    <p className="mt-0.5 text-sm font-medium">
                      {STANCE_LABELS[position.stance]}
                    </p>
                  </div>
                </div>

                {/* Match indicator */}
                {match !== null && (
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        match >= 0.75
                          ? "bg-green-500"
                          : match >= 0.5
                          ? "bg-blue-500"
                          : "bg-orange-500"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {match >= 0.75
                        ? "Alta coincidencia"
                        : match >= 0.5
                        ? "Coincidencia parcial"
                        : "Baja coincidencia"}
                    </span>
                  </div>
                )}

                {/* Justification */}
                <div className="mt-3 rounded-md border-l-2 border-blue-300 bg-blue-50/50 p-3">
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {position.justification}
                      </p>
                      <p className="mt-1 text-xs font-medium text-blue-600">
                        {position.programReference}
                      </p>
                      {position.confidence === "inferred" && (
                        <span className="mt-1 inline-flex items-center gap-1 text-xs text-yellow-600">
                          <AlertTriangle className="h-3 w-3" />
                          Posicion inferida (no explicita en el programa)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Back to results */}
      <div className="mt-8 text-center">
        <Button
          variant="outline"
          onClick={() => router.push("/quiz/results")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a resultados
        </Button>
      </div>
    </div>
  );
}
