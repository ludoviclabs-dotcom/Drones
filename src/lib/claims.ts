import type {
  BrickKey,
  ClaimStatus,
  Confidence,
  SourceRef,
  SystemCategory,
} from "@/data/types";
import { systems } from "@/data/systems";
import { BRICK_LABELS } from "@/data/labels";

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

/** Libellés des périmètres d'affirmation — partagés Console / heatmap. */
export const SCOPE_LABELS: Record<ClaimScope, string> = {
  ...BRICK_LABELS,
  specs: "Caractéristiques",
  contraintes: "Contraintes physiques",
  versions: "Versions & standards",
  "architecture-navale": "Architecture navale",
};

// === Fraîcheur ===
// Paliers (pas de score chiffré, cohérent avec la méthodologie Panoplie) dérivés
// de l'écart entre la date d'arrêté du dossier et aujourd'hui.
export type FreshnessBand = "frais" | "recent" | "a-rafraichir" | "perime";

export const FRESHNESS_LABELS: Record<FreshnessBand, string> = {
  frais: "Frais",
  recent: "Récent",
  "a-rafraichir": "À rafraîchir",
  perime: "Périmé",
};

/** Jeton de couleur (palier A→E) par bande de fraîcheur. */
export const FRESHNESS_TOKEN: Record<FreshnessBand, string> = {
  frais: "var(--color-grade-a)",
  recent: "var(--color-grade-b)",
  "a-rafraichir": "var(--color-grade-c)",
  perime: "var(--color-grade-e)",
};

export function freshnessBand(updatedISO: string, now: Date = new Date()): FreshnessBand {
  const updated = new Date(`${updatedISO}T00:00:00Z`);
  const ageDays = (now.getTime() - updated.getTime()) / 86_400_000;
  if (Number.isNaN(ageDays)) return "a-rafraichir";
  if (ageDays <= 90) return "frais";
  if (ageDays <= 270) return "recent";
  if (ageDays <= 540) return "a-rafraichir";
  return "perime";
}

// === Source primaire / secondaire ===
// Primaire = producteur (constructeur), institution opérante ou document officiel.
// Secondaire = think-tank et presse. Dérivation, pas un champ stocké.
const PRIMARY_SOURCE_TYPES: ReadonlySet<SourceRef["type"]> = new Set([
  "constructeur",
  "institution",
  "officiel",
]);

export function isPrimaryClaim(claim: Claim): boolean {
  return claim.sources.some((source) => PRIMARY_SOURCE_TYPES.has(source.type));
}

// === Confiance par section (heatmap de fiche) ===
export type ConfidenceBand = "solide" | "moyen" | "fragile";

export interface SectionConfidence {
  scope: ClaimScope;
  label: string;
  count: number;
  /** Moyenne de confiance 1 (faible) → 3 (haute). */
  score: number;
  band: ConfidenceBand;
}

const CONFIDENCE_VALUE: Record<Confidence, number> = {
  haute: 3,
  moyenne: 2,
  faible: 1,
};

/** Confiance moyenne par section pour un système — alimente la heatmap de fiche. */
export function getSystemSectionConfidence(slug: string): SectionConfidence[] {
  const byScope = new Map<ClaimScope, Claim[]>();
  for (const claim of getAllClaims()) {
    if (claim.systemSlug !== slug) continue;
    const list = byScope.get(claim.scope) ?? [];
    list.push(claim);
    byScope.set(claim.scope, list);
  }

  return Array.from(byScope.entries()).map(([scope, list]) => {
    const score =
      list.reduce((sum, claim) => sum + CONFIDENCE_VALUE[claim.confidence], 0) /
      list.length;
    const band: ConfidenceBand =
      score >= 2.5 ? "solide" : score >= 1.75 ? "moyen" : "fragile";
    return { scope, label: SCOPE_LABELS[scope], count: list.length, score, band };
  });
}
