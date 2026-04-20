import type { Category, Candidate, Question } from "@/lib/types";
import { SELECTED_IDS_SET } from "./selected-questions";

import categoriesData from "./categories/categories.json";
import economiaQuestions from "./questions/economia.json";
import comercioExteriorQuestions from "./questions/comercio_exterior.json";
import agriculturaQuestions from "./questions/agricultura.json";
import energiaQuestions from "./questions/energia.json";
import medioAmbienteQuestions from "./questions/medio_ambiente.json";
import educacionQuestions from "./questions/educacion.json";
import seguridadQuestions from "./questions/seguridad.json";
import saludQuestions from "./questions/salud.json";
import justiciaQuestions from "./questions/justicia.json";
import politicaExteriorQuestions from "./questions/politica_exterior.json";
import tecnologiaQuestions from "./questions/tecnologia.json";
import viviendaQuestions from "./questions/vivienda.json";
import trabajoQuestions from "./questions/trabajo.json";
import culturaQuestions from "./questions/cultura.json";

// Import candidates
import ivanCepeda from "./candidates/ivan-cepeda.json";
import sergioFajardo from "./candidates/sergio-fajardo.json";
import palomaValencia from "./candidates/paloma-valencia.json";
import abelardoDeLaEspriella from "./candidates/abelardo-de-la-espriella.json";
import royBarreras from "./candidates/roy-barreras.json";
import claudiaLopez from "./candidates/claudia-lopez.json";

// Load raw category definitions. The `questionCount` field is computed dynamically
// after `allQuestions` is filtered (to reflect the curated differentiating set).
const rawCategories = categoriesData as Category[];

/**
 * All questions defined in the data files (full pool of 96).
 * Available for reference but NOT shown to users directly - see `allQuestions`.
 */
export const allQuestionsPool: Question[] = [
  ...economiaQuestions,
  ...comercioExteriorQuestions,
  ...agriculturaQuestions,
  ...energiaQuestions,
  ...medioAmbienteQuestions,
  ...educacionQuestions,
  ...seguridadQuestions,
  ...saludQuestions,
  ...justiciaQuestions,
  ...politicaExteriorQuestions,
  ...tecnologiaQuestions,
  ...viviendaQuestions,
  ...trabajoQuestions,
  ...culturaQuestions,
] as Question[];

/**
 * Curated, differentiating questions shown to users (StemWijzer-style).
 * Filtered to only statements where candidates meaningfully disagree.
 * See `data/selected-questions.ts` for criteria and full list.
 */
export const allQuestions: Question[] = allQuestionsPool.filter((q) =>
  SELECTED_IDS_SET.has(q.id)
);

// Recompute questionCount based on the curated `allQuestions` set
export const categories: Category[] = rawCategories.map((c) => ({
  ...c,
  questionCount: allQuestions.filter((q) => q.categoryId === c.id).length,
}));

export const candidates: Candidate[] = [
  ivanCepeda,
  sergioFajardo,
  palomaValencia,
  abelardoDeLaEspriella,
  royBarreras,
  claudiaLopez,
] as Candidate[];

export function getQuestionsByCategory(categoryId: string): Question[] {
  return allQuestions.filter((q) => q.categoryId === categoryId);
}

export function getCandidateById(id: string): Candidate | undefined {
  return candidates.find((c) => c.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
