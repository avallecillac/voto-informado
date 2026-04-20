"use client";

import { useRouter } from "next/navigation";
import { useQuizStore } from "@/lib/store/quiz-store";
import { useHydration } from "@/lib/hooks/use-hydration";
import { categories } from "@/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  TrendingUp,
  Globe,
  Sprout,
  Zap,
  TreePine,
  GraduationCap,
  Shield,
  Heart,
  Scale,
  Flag,
  Cpu,
  Home,
  Briefcase,
  Palette,
} from "lucide-react";
import type { CategoryId } from "@/lib/types";
import { getCategoryColor } from "@/lib/category-colors";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Globe,
  Sprout,
  Zap,
  TreePine,
  GraduationCap,
  Shield,
  Heart,
  Scale,
  Flag,
  Cpu,
  Home,
  Briefcase,
  Palette,
};

function CategoryIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className="h-5 w-5" />;
}

export default function PrioritiesPage() {
  const router = useRouter();
  const hydrated = useHydration();
  const importantCategories = useQuizStore((s) => s.importantCategories);
  const toggleImportantCategory = useQuizStore(
    (s) => s.toggleImportantCategory
  );
  const answeredCount = useQuizStore((s) => s.getAnsweredCount());

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (answeredCount === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          Aún no has respondido preguntas.
        </p>
        <Button className="mt-4" onClick={() => router.push("/quiz/intro")}>
          Empezar
        </Button>
      </div>
    );
  }

  const MAX_PRIORITIES = 3;
  const canSelectMore = importantCategories.length < MAX_PRIORITIES;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
          <Star className="h-6 w-6 text-yellow-600" />
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          ¿Cuáles 3 temas son más importantes para ti?
        </h1>
        <p className="mt-2 text-muted-foreground">
          Elige hasta <strong className="text-yellow-700">3 temas</strong> que
          sean especialmente importantes. Se les dará el doble de peso en tu
          resultado.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Este paso es <strong>opcional</strong>. Si no marcas ninguno, todos
          los temas tendrán el mismo peso.
        </p>
        <Badge
          variant={importantCategories.length > 0 ? "default" : "secondary"}
          className="mt-4"
        >
          {importantCategories.length} de {MAX_PRIORITIES} seleccionados
        </Badge>
      </div>

      {/* Categories */}
      <div className="grid gap-2 sm:grid-cols-2">
        {categories.map((category) => {
          const isImportant = importantCategories.includes(
            category.id as CategoryId
          );
          const isDisabled = !isImportant && !canSelectMore;
          const color = getCategoryColor(category.id);
          return (
            <Card
              key={category.id}
              className={`relative p-3 transition-all ${
                isImportant
                  ? `cursor-pointer ${color.accentBorder} ${color.softBg} ring-1 ${color.ring}`
                  : isDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => {
                if (isDisabled) return;
                toggleImportantCategory(category.id as CategoryId);
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color.iconBg} ${color.iconText}`}
                >
                  <CategoryIcon name={category.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold">
                    {category.shortName}
                  </h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                {isImportant && (
                  <Check className={`h-4 w-4 shrink-0 ${color.iconText}`} />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/quiz/questions")}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a preguntas
        </Button>

        <Button
          size="lg"
          className="gap-2"
          onClick={() => router.push("/quiz/results")}
        >
          Ver mis resultados
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
