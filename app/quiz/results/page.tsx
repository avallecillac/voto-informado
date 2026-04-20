"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuizStore } from "@/lib/store/quiz-store";
import { useHydration } from "@/lib/hooks/use-hydration";
import { candidates, categories } from "@/data";
import { getMatchConfidence } from "@/lib/matching/algorithm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Info,
  Users,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";
import { useState } from "react";
import { ShareButtons } from "@/components/share/share-buttons";

const ORIENTATION_LABELS: Record<string, string> = {
  izquierda: "Izquierda",
  "centro-izquierda": "Centro-izquierda",
  centro: "Centro",
  "centro-derecha": "Centro-derecha",
  derecha: "Derecha",
};

const CONFIDENCE_COLORS: Record<string, string> = {
  baja: "bg-yellow-100 text-yellow-800",
  media: "bg-blue-100 text-blue-800",
  alta: "bg-green-100 text-green-800",
};

const CONFIDENCE_LABELS: Record<string, string> = {
  baja: "baja",
  media: "media",
  alta: "alta",
};

export default function ResultsPage() {
  const router = useRouter();
  const answers = useQuizStore((s) => s.answers);
  const getMatchResults = useQuizStore((s) => s.getMatchResults);
  const excludedCandidates = useQuizStore((s) => s.excludedCandidates);
  const toggleExcludedCandidate = useQuizStore(
    (s) => s.toggleExcludedCandidate
  );
  const reset = useQuizStore((s) => s.reset);

  const hydrated = useHydration();
  const [showFilter, setShowFilter] = useState(false);
  const allResults = getMatchResults();
  const results = allResults.filter(
    (r) => !excludedCandidates.includes(r.candidateId)
  );
  const confidence = getMatchConfidence(answers.length);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-muted-foreground">Cargando resultados...</div>
      </div>
    );
  }

  if (answers.length === 0) {
    return (
      <div className="py-12 text-center">
        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">
          Aún no has respondido preguntas
        </h2>
        <p className="mt-2 text-muted-foreground">
          Responde al menos algunas preguntas para ver tus resultados.
        </p>
        <Button className="mt-6" onClick={() => router.push("/quiz/intro")}>
          Empezar
        </Button>
      </div>
    );
  }

  const handleReset = () => {
    reset();
    router.push("/quiz/intro");
  };

  return (
    <div>
      {/* Compact meta bar: answers count + confidence + filter */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span>
            <strong className="text-foreground">{answers.length}</strong>{" "}
            respuestas
          </span>
          <Badge className={CONFIDENCE_COLORS[confidence]}>
            Confianza {confidence}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Filter className="h-3.5 w-3.5" />
            {excludedCandidates.length > 0
              ? `${excludedCandidates.length} oculto${
                  excludedCandidates.length === 1 ? "" : "s"
                }`
              : "Filtrar"}
          </button>
          {excludedCandidates.length > 0 && (
            <button
              onClick={() =>
                excludedCandidates.forEach((id) => toggleExcludedCandidate(id))
              }
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Mostrar todos
            </button>
          )}
        </div>
      </div>
      {confidence === "baja" && (
        <p className="mb-4 flex items-center gap-1 text-xs text-yellow-700">
          <Info className="h-3 w-3" />
          Responde más preguntas para resultados más precisos
        </p>
      )}

      {/* Filter panel - all candidates with show/hide toggle */}
      {showFilter && (
        <Card className="mb-4 border-dashed">
          <CardContent className="p-4">
            <p className="mb-3 text-xs text-muted-foreground">
              Oculta candidatos que no quieres ver en tus resultados.
            </p>
            <div className="space-y-2">
              {allResults.map((r) => {
                const cand = candidates.find((c) => c.id === r.candidateId);
                if (!cand) return null;
                const isHidden = excludedCandidates.includes(r.candidateId);
                return (
                  <div
                    key={r.candidateId}
                    className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm"
                  >
                    <div className="flex flex-1 items-center gap-2 min-w-0">
                      <span
                        className={
                          isHidden
                            ? "text-muted-foreground line-through"
                            : "font-medium"
                        }
                      >
                        {cand.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {cand.party}
                      </Badge>
                    </div>
                    <button
                      onClick={() => toggleExcludedCandidate(r.candidateId)}
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                      aria-label={isHidden ? "Mostrar" : "Ocultar"}
                    >
                      {isHidden ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Todos los candidatos están ocultos. Usa el filtro para mostrar alguno.
        </div>
      )}

      {/* Candidate rankings */}
      <div className="space-y-4">
        {results.map((result, index) => {
          const candidate = candidates.find(
            (c) => c.id === result.candidateId
          );
          if (!candidate) return null;

          const isTop = index === 0;

          return (
            <div key={result.candidateId}>
              <Card
                className={isTop ? "border-blue-500 ring-1 ring-blue-500" : ""}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Rank */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        isTop
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      #{index + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{candidate.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {candidate.party}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {ORIENTATION_LABELS[candidate.politicalOrientation]}
                      </p>

                      {/* Match bar */}
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Coincidencia
                          </span>
                          <span
                            className={`text-lg font-bold ${
                              result.overallMatch >= 70
                                ? "text-green-600"
                                : result.overallMatch >= 40
                                ? "text-blue-600"
                                : "text-orange-600"
                            }`}
                          >
                            {Math.round(result.overallMatch)}%
                          </span>
                        </div>
                        <Progress
                          value={result.overallMatch}
                          className="h-3"
                        />
                      </div>

                      {/* Category breakdown */}
                      {result.categoryMatches.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {result.categoryMatches.map((cm) => {
                            const cat = categories.find(
                              (c) => c.id === cm.categoryId
                            );
                            if (!cat) return null;
                            return (
                              <Badge
                                key={cm.categoryId}
                                variant="secondary"
                                className="text-xs"
                              >
                                {cat.shortName}{" "}
                                <span
                                  className={`ml-1 font-semibold ${
                                    cm.match >= 70
                                      ? "text-green-600"
                                      : cm.match >= 40
                                      ? "text-blue-600"
                                      : "text-orange-600"
                                  }`}
                                >
                                  {Math.round(cm.match)}%
                                </span>
                              </Badge>
                            );
                          })}
                        </div>
                      )}

                      {/* Detail link */}
                      <Link
                        href={`/quiz/candidate/${candidate.id}`}
                        className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        Ver detalle
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Share buttons immediately after the #1 candidate */}
              {isTop && (
                <div className="mt-4">
                  <ShareButtons
                    topCandidate={candidate.name}
                    topPercentage={result.overallMatch}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Separator className="my-8" />

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button
          variant="outline"
          onClick={() => router.push("/quiz/questions")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Responder más preguntas
        </Button>
        <Button variant="ghost" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Empezar de nuevo
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Esta herramienta es informativa y no constituye una recomendación de
        voto. Los resultados se basan en los programas de gobierno oficiales
        de los candidatos.
      </p>
    </div>
  );
}
