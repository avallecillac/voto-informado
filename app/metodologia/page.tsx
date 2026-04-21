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

      <h1 className="text-3xl font-bold">Metodología</h1>
      <p className="mt-2 text-muted-foreground">
        Transparencia total sobre cómo funciona Voto Informado.
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
              la Registraduría Nacional del Estado Civil. No usamos declaraciones
              en medios, redes sociales, ni opiniones de terceros.
            </p>
            <p className="mt-3">
              Cada posición incluye una referencia directa al documento fuente
              (sección y página) para que puedas verificar la información.
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
                Cada afirmación se responde en una escala simple:{" "}
                <strong>En desacuerdo</strong>, <strong>Neutral</strong> o{" "}
                <strong>De acuerdo</strong>.
              </li>
              <li>
                Se calcula la coincidencia entre tu respuesta y la posición del
                candidato: a menor distancia, mayor coincidencia.
              </li>
              <li>
                Al final eliges hasta <strong>3 temas prioritarios</strong> que
                son especialmente importantes para ti. Las preguntas de esos
                temas pesan el doble en tu resultado.
              </li>
              <li>
                El porcentaje final es el promedio ponderado de todas las
                coincidencias.
              </li>
            </ol>
            <div className="mt-4 rounded-md bg-gray-50 p-3 font-mono text-xs">
              coincidencia = 1 - |tu_respuesta - posición_candidato| / 4
              <br />
              resultado = sum(peso × coincidencia) / sum(peso)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-blue-600" />
              Posiciones explícitas vs. inferidas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            <p>Cada posición de candidato se clasifica como:</p>
            <ul className="mt-3 space-y-2">
              <li>
                <strong>Explícita:</strong> El candidato aborda directamente el
                tema en su programa de gobierno con una posición clara.
              </li>
              <li>
                <strong>Inferida:</strong> El programa no aborda directamente el
                tema, pero se puede inferir una posición a partir de otras
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
                algorítmico.
              </li>
              <li>
                Los resultados se ordenan por porcentaje de coincidencia, no por
                encuestas ni preferencia editorial.
              </li>
              <li>
                No estamos afiliados a ningún partido político ni campaña.
              </li>
              <li>
                El código fuente y los datos son públicos para que cualquiera
                pueda auditar la herramienta.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-blue-600" />
              Privacidad y analítica
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            <p>
              Usamos <strong>Vercel Web Analytics</strong> y{" "}
              <strong>Speed Insights</strong> para entender cuántas personas
              usan la herramienta, desde qué dispositivos y si hay problemas
              de desempeño. Es analítica respetuosa con la privacidad:
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                No usa <em>cookies</em> ni identifica visitantes entre
                sesiones.
              </li>
              <li>
                No rastrea tu actividad en otros sitios web.
              </li>
              <li>
                No recolecta datos personales (nombre, correo, dirección IP
                completa).
              </li>
              <li>
                Tus respuestas al cuestionario{" "}
                <strong>nunca salen de tu navegador</strong>. Se almacenan en{" "}
                <code>localStorage</code> local; no las enviamos a ningún
                servidor.
              </li>
              <li>
                Registramos eventos agregados y anónimos (cuántas personas
                terminan el quiz, cuáles son los canales de compartido más
                usados) para entender el impacto.
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
