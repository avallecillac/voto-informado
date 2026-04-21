/**
 * Candidates registered for the 2026 presidential election that are NOT YET
 * in our matching engine.
 *
 * A candidate is added to the main app only once we have access to their
 * official government program in enough detail to extract cited positions.
 * This file tracks who's still pending so the landing page can show full
 * transparency about coverage gaps.
 *
 * Source: Registraduría Nacional del Estado Civil - list of 14 registered
 * candidates for the May 31, 2026 presidential election.
 *
 * Statuses:
 *  - "looking": we haven't found a detailed program document yet
 *  - "processing": we have the document and are extracting positions
 *  - "partial": we have some material (e.g. only thematic docs) but not enough
 */
export type PendingCandidateStatus = "looking" | "processing" | "partial";

export interface PendingCandidate {
  name: string;
  party: string;
  status: PendingCandidateStatus;
  note?: string;
}

export const PENDING_CANDIDATES: PendingCandidate[] = [
  {
    name: "Luis Gilberto Murillo",
    party: "Colombia Nueva",
    status: "looking",
    note: "Buscando programa oficial detallado",
  },
  {
    name: "Mauricio Lizcano",
    party: "Alianza Social Independiente",
    status: "looking",
    note: "Buscando programa oficial detallado",
  },
];

export const STATUS_LABELS: Record<PendingCandidateStatus, string> = {
  looking: "Buscando programa",
  processing: "Extrayendo posiciones",
  partial: "Material parcial",
};
