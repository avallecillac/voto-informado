/**
 * Color theme per policy category.
 *
 * Used to visually group questions, badges and positions by topic family
 * across the quiz UI (question page, priorities picker, results, candidate
 * detail). Classes are written as full literals (not template strings) so
 * Tailwind's JIT can discover them during build.
 *
 * Palette chosen for: (a) 14 distinct hues, (b) sufficient contrast for
 * text on light backgrounds, (c) AA accessibility for text-*-700/800.
 */
import type { CategoryId } from "./types";

export type CategoryColorTheme = {
  /** Solid accent (borders, dots, progress bars) */
  accentBorder: string;
  accentBg: string;
  /** Subtle tint (card backgrounds, badge backgrounds) */
  softBg: string;
  /** Icon container */
  iconBg: string;
  iconText: string;
  /** Badge style: background + text */
  badge: string;
  /** Primary text color */
  text: string;
  /** Ring for selection state */
  ring: string;
  /** Raw hue name for reference */
  hue: string;
};

export const CATEGORY_COLORS: Record<CategoryId, CategoryColorTheme> = {
  economia: {
    accentBorder: "border-blue-500",
    accentBg: "bg-blue-500",
    softBg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    badge: "bg-blue-100 text-blue-800",
    text: "text-blue-700",
    ring: "ring-blue-500",
    hue: "blue",
  },
  comercio_exterior: {
    accentBorder: "border-indigo-500",
    accentBg: "bg-indigo-500",
    softBg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-800",
    text: "text-indigo-700",
    ring: "ring-indigo-500",
    hue: "indigo",
  },
  agricultura: {
    accentBorder: "border-green-600",
    accentBg: "bg-green-600",
    softBg: "bg-green-50",
    iconBg: "bg-green-100",
    iconText: "text-green-700",
    badge: "bg-green-100 text-green-800",
    text: "text-green-700",
    ring: "ring-green-600",
    hue: "green",
  },
  energia: {
    accentBorder: "border-amber-500",
    accentBg: "bg-amber-500",
    softBg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconText: "text-amber-700",
    badge: "bg-amber-100 text-amber-800",
    text: "text-amber-700",
    ring: "ring-amber-500",
    hue: "amber",
  },
  medio_ambiente: {
    accentBorder: "border-emerald-600",
    accentBg: "bg-emerald-600",
    softBg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-800",
    text: "text-emerald-700",
    ring: "ring-emerald-600",
    hue: "emerald",
  },
  educacion: {
    accentBorder: "border-violet-500",
    accentBg: "bg-violet-500",
    softBg: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconText: "text-violet-700",
    badge: "bg-violet-100 text-violet-800",
    text: "text-violet-700",
    ring: "ring-violet-500",
    hue: "violet",
  },
  seguridad: {
    accentBorder: "border-red-500",
    accentBg: "bg-red-500",
    softBg: "bg-red-50",
    iconBg: "bg-red-100",
    iconText: "text-red-700",
    badge: "bg-red-100 text-red-800",
    text: "text-red-700",
    ring: "ring-red-500",
    hue: "red",
  },
  salud: {
    accentBorder: "border-pink-500",
    accentBg: "bg-pink-500",
    softBg: "bg-pink-50",
    iconBg: "bg-pink-100",
    iconText: "text-pink-700",
    badge: "bg-pink-100 text-pink-800",
    text: "text-pink-700",
    ring: "ring-pink-500",
    hue: "pink",
  },
  justicia: {
    accentBorder: "border-slate-600",
    accentBg: "bg-slate-600",
    softBg: "bg-slate-50",
    iconBg: "bg-slate-100",
    iconText: "text-slate-700",
    badge: "bg-slate-100 text-slate-800",
    text: "text-slate-700",
    ring: "ring-slate-500",
    hue: "slate",
  },
  politica_exterior: {
    accentBorder: "border-sky-500",
    accentBg: "bg-sky-500",
    softBg: "bg-sky-50",
    iconBg: "bg-sky-100",
    iconText: "text-sky-700",
    badge: "bg-sky-100 text-sky-800",
    text: "text-sky-700",
    ring: "ring-sky-500",
    hue: "sky",
  },
  tecnologia: {
    accentBorder: "border-purple-500",
    accentBg: "bg-purple-500",
    softBg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconText: "text-purple-700",
    badge: "bg-purple-100 text-purple-800",
    text: "text-purple-700",
    ring: "ring-purple-500",
    hue: "purple",
  },
  vivienda: {
    accentBorder: "border-orange-500",
    accentBg: "bg-orange-500",
    softBg: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconText: "text-orange-700",
    badge: "bg-orange-100 text-orange-800",
    text: "text-orange-700",
    ring: "ring-orange-500",
    hue: "orange",
  },
  trabajo: {
    accentBorder: "border-cyan-600",
    accentBg: "bg-cyan-600",
    softBg: "bg-cyan-50",
    iconBg: "bg-cyan-100",
    iconText: "text-cyan-700",
    badge: "bg-cyan-100 text-cyan-800",
    text: "text-cyan-700",
    ring: "ring-cyan-600",
    hue: "cyan",
  },
  cultura: {
    accentBorder: "border-rose-500",
    accentBg: "bg-rose-500",
    softBg: "bg-rose-50",
    iconBg: "bg-rose-100",
    iconText: "text-rose-700",
    badge: "bg-rose-100 text-rose-800",
    text: "text-rose-700",
    ring: "ring-rose-500",
    hue: "rose",
  },
};

/**
 * Safe lookup with fallback for unknown category IDs (shouldn't happen in
 * practice, but keeps the UI from crashing).
 */
export function getCategoryColor(id: string): CategoryColorTheme {
  return (
    CATEGORY_COLORS[id as CategoryId] ?? {
      accentBorder: "border-gray-400",
      accentBg: "bg-gray-400",
      softBg: "bg-gray-50",
      iconBg: "bg-gray-100",
      iconText: "text-gray-600",
      badge: "bg-gray-100 text-gray-700",
      text: "text-gray-700",
      ring: "ring-gray-400",
      hue: "gray",
    }
  );
}
