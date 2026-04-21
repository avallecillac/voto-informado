"use client";

import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { useQuizStore } from "@/lib/store/quiz-store";
import { useHydration } from "@/lib/hooks/use-hydration";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  ThumbsUp,
  Star,
  Trophy,
  Clock,
  Shield,
  RotateCcw,
  Play,
} from "lucide-react";

export default function IntroPage() {
  const router = useRouter();
  const hydrated = useHydration();
  const answeredCount = useQuizStore((s) => s.getAnsweredCount());
  const reset = useQuizStore((s) => s.reset);

  const hasExistingProgress = hydrated && answeredCount > 0;

  const handleContinue = () => {
    track(hasExistingProgress ? "quiz_resumed" : "quiz_started");
    router.push("/quiz/questions");
  };

  const handleStartFresh = () => {
    track("quiz_started_fresh");
    reset();
    router.push("/quiz/questions");
  };

  return (
    <div>
      {/* Saved progress banner - shown at top so mobile users see it immediately */}
      {hasExistingProgress && (
        <Card className="mb-6 border-yellow-300 bg-yellow-50">
          <CardContent className="p-4">
            <p className="text-sm">
              <strong>Ya tienes respuestas guardadas</strong> ({answeredCount}{" "}
              de 27 preguntas).
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Puedes continuar donde quedaste o empezar de nuevo con
              respuestas en blanco.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={handleContinue}
              >
                <Play className="h-4 w-4" />
                Continuar donde quedé
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 gap-2"
                onClick={handleStartFresh}
              >
                <RotateCcw className="h-4 w-4" />
                Empezar de nuevo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Cómo funciona</h1>
        <p className="mt-2 text-muted-foreground">
          3 pasos simples para descubrir tu candidato
        </p>
        <div className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>Tarda unos 5 minutos</span>
        </div>
      </div>

      <div className="space-y-3">
        <StepCard
          number={1}
          icon={<ThumbsUp className="h-5 w-5" />}
          title="Responde 27 afirmaciones"
          description="Para cada afirmación elige: De acuerdo, En desacuerdo, o Neutral. Puedes saltar las que no quieras responder."
        />
        <StepCard
          number={2}
          icon={<Star className="h-5 w-5" />}
          title="Elige tus 3 temas prioritarios"
          description="Al final, indica los 3 temas que son más importantes para ti. Se les dará el doble de peso en tu resultado."
        />
        <StepCard
          number={3}
          icon={<Trophy className="h-5 w-5" />}
          title="Descubre tu match"
          description="Verás un ranking de los candidatos con el porcentaje de coincidencia, con citas directas de sus programas."
        />
      </div>

      <Card className="mt-6 border-blue-200 bg-blue-50">
        <CardContent className="flex items-start gap-3 p-4 text-sm">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-900">
              Neutral y transparente
            </p>
            <p className="mt-1 text-blue-800">
              Cada posición citada viene del programa de gobierno oficial.
              No hay algoritmos secretos ni sesgo editorial.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bottom CTA only shown when there's no existing progress
          (when there IS progress, the actions are in the top banner) */}
      {!hasExistingProgress && (
        <div className="mt-8 flex justify-center">
          <Button size="lg" className="gap-2" onClick={handleContinue}>
            Empezar
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-blue-600">
              Paso {number}
            </span>
          </div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
