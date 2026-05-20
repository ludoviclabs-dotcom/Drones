import type {
  BrickKey,
  ClaimStatus,
  Confidence,
  SourceRef,
} from "@/data/types";
import { systems } from "@/data/systems";

export type ClaimScope = BrickKey | "specs";

/** Une affirmation atomique du registre de preuves. */
export interface Claim {
  systemSlug: string;
  systemName: string;
  systemReference: string;
  scope: ClaimScope;
  label: string;
  value: string;
  note?: string;
  confidence: Confidence;
  status: ClaimStatus;
  sources: SourceRef[];
  date: string;
}

/** Statut effectif : explicite si fourni, sinon dérivé de la confiance. */
function statusOf(confidence: Confidence, explicit?: ClaimStatus): ClaimStatus {
  if (explicit) return explicit;
  return confidence === "haute" ? "verifie" : "a-recouper";
}

/** Aplatit tous les indicateurs (specs + briques) des systèmes en affirmations. */
export function getAllClaims(): Claim[] {
  const claims: Claim[] = [];
  for (const system of systems) {
    const byId = new Map(system.sources.map((s) => [s.id, s] as const));
    const resolve = (ids?: string[]): SourceRef[] =>
      (ids ?? [])
        .map((id) => byId.get(id))
        .filter((s): s is SourceRef => Boolean(s));

    const base = {
      systemSlug: system.slug,
      systemName: system.name,
      systemReference: system.reference,
      date: system.updated,
    };

    for (const spec of system.keySpecs) {
      claims.push({
        ...base,
        scope: "specs",
        label: spec.label,
        value: spec.value,
        note: spec.note,
        confidence: spec.confidence,
        status: statusOf(spec.confidence, spec.status),
        sources: resolve(spec.sources),
      });
    }
    for (const brick of system.bricks) {
      for (const indicator of brick.indicators) {
        claims.push({
          ...base,
          scope: brick.key,
          label: indicator.label,
          value: indicator.value,
          note: indicator.note,
          confidence: indicator.confidence,
          status: statusOf(indicator.confidence, indicator.status),
          sources: resolve(indicator.sources),
        });
      }
    }
  }
  return claims;
}

export interface EvidenceStats {
  systems: number;
  sources: number;
  claims: number;
  byConfidence: Record<Confidence, number>;
  byStatus: Record<ClaimStatus, number>;
  updated: string;
}

/** Compteurs du registre — entièrement dérivés des données, jamais codés en dur. */
export function getEvidenceStats(): EvidenceStats {
  const claims = getAllClaims();
  const sourceIds = new Set<string>();
  for (const system of systems) {
    for (const source of system.sources) sourceIds.add(source.id);
  }
  const byConfidence: Record<Confidence, number> = {
    haute: 0,
    moyenne: 0,
    faible: 0,
  };
  const byStatus: Record<ClaimStatus, number> = {
    verifie: 0,
    "a-recouper": 0,
    variable: 0,
  };
  for (const claim of claims) {
    byConfidence[claim.confidence] += 1;
    byStatus[claim.status] += 1;
  }
  const updated =
    systems
      .map((s) => s.updated)
      .sort()
      .at(-1) ?? "";

  return {
    systems: systems.length,
    sources: sourceIds.size,
    claims: claims.length,
    byConfidence,
    byStatus,
    updated,
  };
}
