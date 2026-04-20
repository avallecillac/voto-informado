import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Vote,
  FileText,
  Shield,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
            <span className="text-blue-600">informacion</span>,{" "}
            <br className="hidden sm:block" />
            no con{" "}
            <span className="text-red-500">polarizacion</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Responde preguntas sobre los temas que te importan y descubre
            cual candidato presidencial representa mejor tus ideales.
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
              Ver metodologia
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-semibold sm:text-3xl">
            Como funciona
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <StepCard
              number={1}
              icon={<CheckCircle className="h-6 w-6 text-blue-600" />}
              title="Elige tus temas"
              description="Selecciona las 3 categorias que mas te importan: economia, educacion, seguridad, medio ambiente y mas."
            />
            <StepCard
              number={2}
              icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
              title="Responde preguntas"
              description="Contesta preguntas sobre politicas publicas y califica que tan importante es cada tema para ti."
            />
            <StepCard
              number={3}
              icon={<Vote className="h-6 w-6 text-blue-600" />}
              title="Descubre tu match"
              description="Ve cual candidato coincide mas con tus ideales, con referencias directas a sus programas de gobierno."
            />
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="border-t bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-6 sm:grid-cols-3">
            <TrustCard
              icon={<FileText className="h-5 w-5" />}
              title="Fuentes oficiales"
              text="Cada posicion de candidato cita directamente su programa de gobierno registrado."
            />
            <TrustCard
              icon={<Shield className="h-5 w-5" />}
              title="Neutral y transparente"
              text="Sin sesgos editoriales. Todos los candidatos reciben el mismo tratamiento."
            />
            <TrustCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Metodologia abierta"
              text="Nuestro algoritmo y datos son publicos para que cualquiera pueda verificar."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-4xl px-4">
          <p>
            Voto Informado Colombia 2026 es una herramienta informativa
            independiente. No esta afiliada a ningun partido politico ni
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
