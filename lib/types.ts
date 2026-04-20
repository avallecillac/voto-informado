export type CategoryId =
  | "economia"
  | "comercio_exterior"
  | "agricultura"
  | "energia"
  | "medio_ambiente"
  | "educacion"
  | "seguridad"
  | "salud"
  | "justicia"
  | "politica_exterior"
  | "tecnologia"
  | "vivienda"
  | "trabajo"
  | "cultura";

export interface Category {
  id: CategoryId;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  questionCount: number;
}

export type PoliticalOrientation =
  | "izquierda"
  | "centro-izquierda"
  | "centro"
  | "centro-derecha"
  | "derecha";

export interface Candidate {
  id: string;
  name: string;
  party: string;
  coalition: string | null;
  photoUrl: string;
  politicalOrientation: PoliticalOrientation;
  programUrl: string;
  bio: string;
  positions: CandidatePosition[];
}

export interface CandidatePosition {
  questionId: string;
  stance: number; // -2 to +2
  justification: string;
  programReference: string;
  confidence: "explicit" | "inferred";
}

export type QuestionType = "likert" | "priority" | "budget" | "scenario";

export interface Question {
  id: string;
  categoryId: CategoryId;
  text: string;
  context: string;
  type: QuestionType;
  options?: QuestionOption[];
  weight: number; // 1-3 default importance
}

export interface QuestionOption {
  value: number;
  label: string;
  description?: string;
}

export interface UserAnswer {
  questionId: string;
  value: number; // -2 to +2 for likert
  importance: number; // 1-3
  answeredAt: number;
}

export interface CategoryMatch {
  categoryId: CategoryId;
  match: number; // 0-100
  questionsAnswered: number;
  questionsTotal: number;
}

export interface MatchResult {
  candidateId: string;
  overallMatch: number; // 0-100
  categoryMatches: CategoryMatch[];
  topAgreements: string[]; // question IDs
  topDisagreements: string[]; // question IDs
}

export type MatchConfidence = "baja" | "media" | "alta";
