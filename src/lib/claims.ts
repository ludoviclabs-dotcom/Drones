import type {
  BrickKey,
  ClaimStatus,
  Confidence,
  SourceRef,
  SystemCategory,
} from "@/data/types";
import { systems } from "@/data/systems";

export type ClaimScope =
  | BrickKey
  | "specs"
  | "contraintes"
  | "versions"
  | "architecture-navale";

/** Une affirmation atomique du registre de preuves. */
export interface Claim {
  systemSlug: string;
  systemName: string;
  systemReference: string;
  category: SystemCategory;
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
    const allSystemSources = system.sources;

    const base = {
      systemSlug: system.slug,
      systemName: system.name,
      systemReference: system.reference,
      category: system.category,
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
    for (const indicator of system.physicalConstraints ?? []) {
      claims.push({
        ...base,
        scope: "contraintes",
        label: indicator.label,
        value: indicator.value,
        note: indicator.note,
        confidence: indicator.confidence,
        status: statusOf(indicator.confidence, indicator.status),
        sources: resolve(indicator.sources),
      });
    }
    for (const indicator of system.variants ?? []) {
      claims.push({
        ...base,
        scope: "versions",
        label: indicator.label,
        value: indicator.value,
        note: indicator.note,
        confidence: indicator.confidence,
        status: statusOf(indicator.confidence, indicator.status),
        sources: resolve(indicator.sources),
      });
    }
    if (system.navalProfile) {
      const { platform, combatSystem, sensors, effectors, propulsion, industrial, export: exportProfile, sustainment } =
        system.navalProfile;
      const addNavalClaim = (label: string, value?: string | null) => {
        if (!value) return;
        claims.push({
          ...base,
          scope: "architecture-navale",
          label,
          value,
          confidence: "moyenne",
          status: "a-recouper",
          sources: allSystemSources,
        });
      };
      addNavalClaim("Mission navale", platform.missions.join(" · "));
      addNavalClaim("Déplacement naval", platform.displacement);
      addNavalClaim("CMS naval", combatSystem?.cms);
      addNavalClaim("Radar principal", sensors?.radarPrimary);
      addNavalClaim(
        "Suite sonar",
        [sensors?.hullSonar, sensors?.towedSonar].filter(Boolean).join(" · "),
      );
      addNavalClaim(
        "Effecteurs navals",
        [
          effectors?.vlsCells,
          effectors?.vlsType,
          ...(effectors?.sam ?? []),
          ...(effectors?.antiShipMissiles ?? []),
          ...(effectors?.antiSubWeapons ?? []),
        ]
          .filter(Boolean)
          .join(" · "),
      );
      addNavalClaim(
        "Propulsion navale",
        [propulsion?.architecture, ...(propulsion?.primeMovers ?? [])]
          .filter(Boolean)
          .join(" · "),
      );
      addNavalClaim("Maître d'oeuvre naval", industrial?.primeContractor);
      addNavalClaim("Chantiers navals", industrial?.shipyards.join(" · "));
      addNavalClaim("Régime export naval", exportProfile?.regimeSummary);
      addNavalClaim(
        "Soutien naval",
        sustainment?.sustainmentNotes ?? sustainment?.industrialRiskNotes,
      );
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
