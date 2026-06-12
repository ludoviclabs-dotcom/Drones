import type {
  BrickKey,
  ClaimStatus,
  Confidence,
  SourceRef,
  SystemCategory,
} from "@/data/types";
import { systems } from "@/data/systems";
import {
  BRICK_LABELS,
  SPACE_MISSION_LABELS,
  SPACE_ORBIT_LABELS,
  SPACE_PAYLOAD_LABELS,
} from "@/data/labels";
import {
  scoreSource,
  sourceKey,
  type SourceConfidenceBand,
} from "@/lib/source-confidence";

export type ClaimScope =
  | BrickKey
  | "specs"
  | "contraintes"
  | "versions"
  | "architecture-navale"
  | "orbite"
  | "charge-utile"
  | "segment-sol"
  | "resilience-spatiale";

export type ClaimReviewStatus =
  | "verified"
  | "uncertain"
  | "contradicted"
  | "obsolete";

/** Une affirmation atomique du registre de preuves. */
export interface Claim {
  claimId: string;
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
  reviewStatus: ClaimReviewStatus;
  nonOperational: true;
  sources: SourceRef[];
  date: string;
}

type DraftClaim = Omit<
  Claim,
  "claimId" | "reviewStatus" | "nonOperational"
>;

/** Statut effectif : explicite si fourni, sinon dérivé de la confiance. */
function statusOf(confidence: Confidence, explicit?: ClaimStatus): ClaimStatus {
  if (explicit) return explicit;
  return confidence === "haute" ? "verifie" : "a-recouper";
}

function reviewStatusOf(status: ClaimStatus): ClaimReviewStatus {
  if (status === "verifie") return "verified";
  return "uncertain";
}

function slugifyClaimPart(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

/** Aplatit tous les indicateurs (specs + briques) des systèmes en affirmations. */
export function getAllClaims(): Claim[] {
  const claims: DraftClaim[] = [];
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
    if (system.spaceProfile) {
      const { missions, orbit, payloads, architecture, resilienceNotes, sovereigntyNotes } =
        system.spaceProfile;
      const addSpaceClaim = (
        scope: Extract<
          ClaimScope,
          "orbite" | "charge-utile" | "segment-sol" | "resilience-spatiale"
        >,
        label: string,
        value?: string | null,
      ) => {
        if (!value) return;
        claims.push({
          ...base,
          scope,
          label,
          value,
          confidence: "moyenne",
          status: "a-recouper",
          sources: allSystemSources,
        });
      };

      addSpaceClaim(
        "orbite",
        "Mission spatiale",
        missions.map((mission) => SPACE_MISSION_LABELS[mission]).join(" · "),
      );
      addSpaceClaim(
        "orbite",
        "Classe d'orbite",
        orbit.classes.map((orbitClass) => SPACE_ORBIT_LABELS[orbitClass]).join(" · "),
      );
      addSpaceClaim("orbite", "Altitude publique", orbit.altitude);
      addSpaceClaim("orbite", "Inclinaison publique", orbit.inclination);
      addSpaceClaim("orbite", "Limite orbitale", orbit.notes);
      addSpaceClaim(
        "charge-utile",
        "Charges utiles",
        payloads
          .map((payload) =>
            [
              SPACE_PAYLOAD_LABELS[payload.type],
              payload.name,
              payload.supplier,
            ]
              .filter(Boolean)
              .join(" · "),
          )
          .join(" · "),
      );
      addSpaceClaim(
        "segment-sol",
        "Segment spatial",
        [
          architecture.constellationSize,
          architecture.satellitesLaunched,
          architecture.formationFlying ? "vol en formation public" : null,
        ]
          .filter(Boolean)
          .join(" · "),
      );
      addSpaceClaim("segment-sol", "Segment sol", architecture.groundSegment.join(" · "));
      addSpaceClaim("segment-sol", "Chaîne de données", architecture.dataChain);
      addSpaceClaim(
        "segment-sol",
        "Dépendances lancement",
        architecture.launchDependency?.join(" · "),
      );
      addSpaceClaim(
        "resilience-spatiale",
        "Continuité de service",
        architecture.serviceContinuityNotes,
      );
      addSpaceClaim("resilience-spatiale", "Résilience", resilienceNotes);
      addSpaceClaim("resilience-spatiale", "Souveraineté", sovereigntyNotes);
    }
  }
  return claims.map((claim) => {
    const reviewStatus = reviewStatusOf(claim.status);

    return {
      ...claim,
      claimId: [
        claim.systemSlug,
        claim.scope,
        slugifyClaimPart(claim.label),
      ].join(":"),
      reviewStatus,
      nonOperational: true,
    };
  });
}

export interface EvidenceStats {
  systems: number;
  sources: number;
  claims: number;
  claimsWithoutSources: number;
  byCategory: Record<SystemCategory, number>;
  byScope: Partial<Record<ClaimScope, number>>;
  byConfidence: Record<Confidence, number>;
  byStatus: Record<ClaimStatus, number>;
  byReviewStatus: Record<ClaimReviewStatus, number>;
  sourceConfidence: Record<SourceConfidenceBand, number>;
  updated: string;
}

/** Compteurs du registre — entièrement dérivés des données, jamais codés en dur. */
export function getEvidenceStats(): EvidenceStats {
  const claims = getAllClaims();
  const sourceIds = new Set<string>();
  const sourceConfidence: Record<SourceConfidenceBand, number> = {
    forte: 0,
    moyenne: 0,
    faible: 0,
    "a-recouper": 0,
  };
  const seenSources = new Set<string>();
  for (const system of systems) {
    for (const source of system.sources) {
      sourceIds.add(source.id);
      const key = sourceKey(source);
      if (!seenSources.has(key)) {
        seenSources.add(key);
        sourceConfidence[scoreSource(source).band] += 1;
      }
    }
  }
  const byCategory = Object.fromEntries(
    systems
      .map((system) => system.category)
      .filter((value, index, array) => array.indexOf(value) === index)
      .map((category) => [category, 0]),
  ) as Record<SystemCategory, number>;
  for (const category of [
    "drone",
    "directed-energy",
    "combat-aircraft",
    "missile",
    "radar",
    "naval-vessel",
    "air-defense",
    "combat-system",
    "space",
  ] satisfies SystemCategory[]) {
    byCategory[category] ??= 0;
  }
  const byScope: Partial<Record<ClaimScope, number>> = {};
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
  const byReviewStatus: Record<ClaimReviewStatus, number> = {
    verified: 0,
    uncertain: 0,
    contradicted: 0,
    obsolete: 0,
  };
  for (const claim of claims) {
    byCategory[claim.category] += 1;
    byScope[claim.scope] = (byScope[claim.scope] ?? 0) + 1;
    byConfidence[claim.confidence] += 1;
    byStatus[claim.status] += 1;
    byReviewStatus[claim.reviewStatus] += 1;
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
    claimsWithoutSources: claims.filter((claim) => claim.sources.length === 0)
      .length,
    byCategory,
    byScope,
    byConfidence,
    byStatus,
    byReviewStatus,
    sourceConfidence,
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
  orbite: "Orbite publique",
  "charge-utile": "Charge utile",
  "segment-sol": "Segment sol",
  "resilience-spatiale": "Résilience spatiale",
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
