import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, Database, Shield, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MetodologiaPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-6 gap-1")}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio
      </Link>

      <h1 className="text-3xl font-bold">Metodologia</h1>
      <p className="mt-2 text-muted-foreground">
        Transparencia total sobre como funciona Voto Informado.
      </p>

      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5 text-blue-600" />
              Fuentes de datos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            <p>
              Las posiciones de cada candidato se extraen exclusivamente de sus
              <strong> programas de gobierno oficiales</strong>, registrados ante
              la Registraduria Nacional del Estado Civil. No usamos declaraciones
              en medios, redes sociales, ni opiniones de terceros.
            </p>
            <p className="mt-3">
              Cada posicion incluye una referencia directa al documento fuente
              (seccion y pagina) para que puedas verificar la informacion.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-blue-600" />
              Algoritmo de matching
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            <p>Usamos un algoritmo de <strong>similitud ponderada</strong>:</p>
            <ol className="mt-3 list-inside list-decimal space-y-2">
              <li>
                Cada pregunta se responde en una escala de -2 (muy en desacuerdo)
                a +2 (muy de acuerdo).
              </li>
              <li>
                Se calcula la coincidencia entre tu respuesta y la posicion del
                candidato: a menor distancia, mayor coincidencia.
              </li>
              <li>
                Tu calificacion de importancia (1-3) pondera cada pregunta. Los
                temas que mas te importan pesan mas en el resultado final.
              </li>
              <li>
                El porcentaje final es el promedio ponderado de todas las
                coincidencias.
              </li>
            </ol>
            <div className="mt-4 rounded-md bg-gray-50 p-3 font-mono text-xs">
              coincidencia = 1 - |tu_respuesta - posicion_candidato| / 4
              <br />
              resultado = sum(importancia * coincidencia) / sum(importancia)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-blue-600" />
              Posiciones explicitas vs. inferidas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            <p>Cada posicion de candidato se clasifica como:</p>
            <ul className="mt-3 space-y-2">
              <li>
                <strong>Explicita:</strong> El candidato aborda directamente el
                tema en su programa de gobierno con una posicion clara.
              </li>
              <li>
                <strong>Inferida:</strong> El programa no aborda directamente el
                tema, pero se puede inferir una posicion a partir de otras
                propuestas relacionadas. Estas posiciones se marcan visualmente.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-blue-600" />
              Neutralidad
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            <ul className="space-y-2">
              <li>
                Todos los candidatos reciben el mismo tratamiento visual y
                algoritmico.
              </li>
              <li>
                Los resultados se ordenan por porcentaje de coincidencia, no por
                encuestas ni preferencia editorial.
              </li>
              <li>
                No estamos afiliados a ningun partido politico ni campana.
              </li>
              <li>
                El codigo fuente y los datos son publicos para que cualquiera
                pueda auditar la herramienta.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/quiz/intro"
          className={cn(buttonVariants())}
        >
          Empezar el cuestionario
        </Link>
      </div>
    </main>
  );
}
