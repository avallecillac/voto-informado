import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Vote,
  FileText,
  Shield,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { candidates } from "@/data";
import { PENDING_CANDIDATES, STATUS_LABELS } from "@/data/pending-candidates";

const ORIENTATION_LABELS: Record<string, string> = {
  izquierda: "Izquierda",
  "centro-izquierda": "Centro-izquierda",
  centro: "Centro",
  "centro-derecha": "Centro-derecha",
  derecha: "Derecha",
};

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            <Vote className="h-4 w-4" />
            Elecciones Presidenciales 2026
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Vota con{" "}
            <span className="text-blue-600">información</span>,{" "}
            <br className="hidden sm:block" />
            no con{" "}
            <span className="text-red-500">polarización</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Responde preguntas sobre los temas que te importan y descubre
            cuál candidato presidencial representa mejor tus ideales.
            Basado en los{" "}
            <strong>programas de gobierno oficiales</strong>.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/quiz/intro"
              className={cn(buttonVariants({ size: "lg" }), "gap-2 text-base")}
            >
              Empezar
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/metodologia"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "text-base"
              )}
            >
              Ver metodología
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-semibold sm:text-3xl">
            Cómo funciona
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <StepCard
              number={1}
              icon={<CheckCircle className="h-6 w-6 text-blue-600" />}
              title="Responde las preguntas"
              description="Contesta 27 afirmaciones clave sobre políticas públicas: economía, educación, seguridad, medio ambiente y más."
            />
            <StepCard
              number={2}
              icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
              title="Elige tus prioridades"
              description="Al final, marca los 3 temas que son más importantes para ti. Se les dará el doble de peso en tu resultado."
            />
            <StepCard
              number={3}
              icon={<Vote className="h-6 w-6 text-blue-600" />}
              title="Descubre tu match"
              description="Ve cuál candidato coincide más con tus ideales, con referencias directas a sus programas de gobierno."
            />
          </div>
        </div>
      </section>

      {/* Candidates transparency section */}
      <section className="border-t bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Candidatos incluidos
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Transparencia total. Solo incluimos candidatos cuyo programa
              de gobierno oficial esté disponible y sea suficientemente
              detallado para citar posiciones con referencia directa.
            </p>
          </div>

          {/* Currently supported */}
          <div className="mt-10">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <h3 className="text-sm font-semibold text-green-700">
                Actualmente disponibles ({candidates.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {candidates.map((c) => (
                <CandidateCard
                  key={c.id}
                  name={c.name}
                  party={c.party}
                  subtitle={
                    ORIENTATION_LABELS[c.politicalOrientation] ??
                    c.politicalOrientation
                  }
                  status="available"
                />
              ))}
            </div>
          </div>

          {/* Pending */}
          {PENDING_CANDIDATES.length > 0 && (
            <div className="mt-10">
              <div className="mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-amber-700">
                  Trabajando en incluir ({PENDING_CANDIDATES.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PENDING_CANDIDATES.map((c) => (
                  <CandidateCard
                    key={c.name}
                    name={c.name}
                    party={c.party}
                    subtitle={STATUS_LABELS[c.status]}
                    status="pending"
                  />
                ))}
              </div>
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Los añadiremos en cuanto tengamos acceso a sus programas de
                gobierno oficiales detallados. Si conoces un enlace público
                que nos falte, escríbenos.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trust section */}
      <section className="border-t bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-6 sm:grid-cols-3">
            <TrustCard
              icon={<FileText className="h-5 w-5" />}
              title="Fuentes oficiales"
              text="Cada posición de candidato cita directamente su programa de gobierno registrado."
            />
            <TrustCard
              icon={<Shield className="h-5 w-5" />}
              title="Neutral y transparente"
              text="Sin sesgos editoriales. Todos los candidatos reciben el mismo tratamiento."
            />
            <TrustCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Metodología abierta"
              text="Nuestro algoritmo y datos son públicos para que cualquiera pueda verificar."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-4xl px-4">
          <p>
            Voto Informado Colombia 2026 es una herramienta informativa
            independiente. No está afiliada a ningún partido político ni
            candidato.
          </p>
        </div>
      </footer>
    </main>
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
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
        {icon}
      </div>
      <div className="mb-2 text-sm font-medium text-blue-600">
        Paso {number}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function TrustCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function CandidateCard({
  name,
  party,
  subtitle,
  status,
}: {
  name: string;
  party: string;
  subtitle: string;
  status: "available" | "pending";
}) {
  const initial = name.charAt(0);
  const isPending = status === "pending";

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-3 ${
        isPending
          ? "border-dashed bg-gray-50 opacity-80"
          : "bg-white shadow-sm"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-semibold ${
          isPending
            ? "bg-gray-200 text-gray-500"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-semibold ${
            isPending ? "text-gray-700" : ""
          }`}
        >
          {name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{party}</p>
        <Badge
          variant={isPending ? "outline" : "secondary"}
          className={`mt-1.5 text-[10px] ${
            isPending ? "border-amber-300 text-amber-700" : ""
          }`}
        >
          {subtitle}
        </Badge>
      </div>
    </div>
  );
}
