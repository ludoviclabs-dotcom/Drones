import { systems, SYSTEMS_BY_SLUG } from "@/data/systems";
import { DOMAINS } from "@/data/domains";
import { HUD_BOARDS } from "@/data/hud/boards";
import { INDUSTRIAL_GRAPH_PILOT } from "@/data/panoplie-workflows";
import type { IndustrialEdge } from "@/data/panoplie-workflows";
import {
  BRICK_ANGLE_LABELS,
  BRICK_ORDER,
  CONFIDENCE_META,
  RELIABILITY_LABELS,
  SCORE_LABELS,
  SOURCE_TYPE_LABELS,
  STATUS_LABELS,
} from "@/data/labels";
import type { ClaimStatus, DefenseSystem, Indicator } from "@/data/types";
import { getEvidenceStats } from "@/lib/claims";
import { formatDateFr } from "@/lib/format";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type {
  FilmAngle,
  FilmData,
  FilmGraphRow,
  FilmIndicator,
  FilmProof,
} from "./types";

/**
 * Construit le paquet de données du film à partir du registre — côté serveur
 * (pages Next) ou dans le bundle de rendu Remotion, jamais dans le navigateur.
 *
 * Rien n'est saisi à la main : compteurs, angles, source, paliers et vignettes
 * viennent des mêmes fonctions que l'accueil. Quand le registre évolue, le
 * film suit sans remontage.
 */

/** Dossier lu par le film — le même que la démonstration de l'accueil. */
export const FILM_DOSSIER_SLUG = "rafale";
/** Dossier mis en regard au chapitre « Comparer ». */
export const FILM_COMPARE_SLUG = "gripen";
/** Systèmes du graphe pilote repris au chapitre « Instruments ». */
const FILM_GRAPH_SYSTEM_IDS = ["mq9", "tb2", "eurodrone"] as const;
/** Libellé de l'indicateur mis en avant au chapitre « La preuve ». */
const PROOF_PREFERRED_LABEL = "Carnet de commandes";

const RELATION_LABELS: Record<IndustrialEdge["relation"], string> = {
  produces: "produit",
  funds: "finance",
  exports: "exporte",
  depends_on: "dépend de",
  documents: "documente",
};

/** Première phrase d'un narratif — même règle que l'accueil. */
function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : text;
}

/** Statut au registre : explicite, sinon dérivé de la confiance (règle du registre). */
function indicatorStatus(indicator: Indicator): ClaimStatus {
  return (
    indicator.status ??
    (indicator.confidence === "haute" ? "verifie" : "a-recouper")
  );
}

function toFilmIndicator(indicator: Indicator): FilmIndicator {
  return {
    label: indicator.label,
    value: indicator.value,
    confidence: indicator.confidence,
    statusLabel: STATUS_LABELS[indicatorStatus(indicator)],
  };
}

function requireSystem(slug: string): DefenseSystem {
  const system = SYSTEMS_BY_SLUG[slug] ?? systems[0];
  if (!system) throw new Error("Registre vide : aucun dossier pour le film.");
  return system;
}

function buildAngles(system: DefenseSystem): FilmAngle[] {
  const angles = BRICK_ORDER.flatMap((key) => {
    const brick = system.bricks.find((b) => b.key === key);
    // L'indicateur affiché est le plus solide de la brique : le film montre
    // ce qui est établi, la confiance de chacun reste visible.
    const indicator =
      brick?.indicators.find((item) => item.confidence === "haute") ??
      brick?.indicators[0];
    if (!brick || !indicator) return [];
    return [
      {
        key,
        num: "",
        label: BRICK_ANGLE_LABELS[key],
        lede: firstSentence(brick.narrative),
        indicator: toFilmIndicator(indicator),
      },
    ];
  });
  // Numérotation continue, même si une brique manque au dossier.
  return angles.map((angle, i) => ({ ...angle, num: String(i + 1).padStart(2, "0") }));
}

function buildProof(system: DefenseSystem): FilmProof {
  const sourceById = new Map(system.sources.map((s) => [s.id, s] as const));
  const candidates = BRICK_ORDER.flatMap((key) => {
    const brick = system.bricks.find((b) => b.key === key);
    return (brick?.indicators ?? []).flatMap((indicator) => {
      const source = (indicator.sources ?? [])
        .map((id) => sourceById.get(id))
        .find((item) => item !== undefined);
      return source ? [{ key, indicator, source }] : [];
    });
  });
  // Une source datée d'abord : la preuve montre alors source, date et confiance.
  const dated = candidates.filter((c) => c.source.date);
  const pick =
    dated.find((c) => c.indicator.label === PROOF_PREFERRED_LABEL) ??
    dated.find((c) => c.indicator.confidence === "haute") ??
    candidates.find((c) => c.indicator.label === PROOF_PREFERRED_LABEL) ??
    candidates.find((c) => c.indicator.confidence === "haute") ??
    candidates[0];
  if (!pick) {
    throw new Error(`Dossier ${system.slug} : aucun indicateur sourcé pour le film.`);
  }
  const { key, indicator, source } = pick;
  return {
    angleLabel: BRICK_ANGLE_LABELS[key],
    claimLabel: indicator.label,
    value: indicator.value,
    confidence: indicator.confidence,
    confidenceLabel: CONFIDENCE_META[indicator.confidence].label,
    statusLabel: STATUS_LABELS[indicatorStatus(indicator)],
    source: {
      publisher: source.publisher,
      title: source.title,
      typeLabel: SOURCE_TYPE_LABELS[source.type],
      reliability: source.reliability,
      reliabilityLabel: RELIABILITY_LABELS[source.reliability],
      dateLabel: source.date ? formatDateFr(source.date) : undefined,
    },
  };
}

function buildGraph(): FilmGraphRow[] {
  const byId = new Map(
    INDUSTRIAL_GRAPH_PILOT.nodes.map((node) => [node.id, node] as const),
  );
  return FILM_GRAPH_SYSTEM_IDS.flatMap((id) => {
    const system = byId.get(id);
    if (!system) return [];
    const pick = (kind: "company" | "country") => {
      const edge = INDUSTRIAL_GRAPH_PILOT.edges.find(
        (item) => item.to === id && byId.get(item.from)?.kind === kind,
      );
      const node = edge ? byId.get(edge.from) : undefined;
      return edge && node
        ? { label: node.label, relation: RELATION_LABELS[edge.relation] }
        : undefined;
    };
    return [{ system: system.label, company: pick("company"), country: pick("country") }];
  });
}

export function buildFilmData(): FilmData {
  const stats = getEvidenceStats();
  const dossier = requireSystem(FILM_DOSSIER_SLUG);
  const other = requireSystem(FILM_COMPARE_SLUG);

  return {
    site: { name: SITE_NAME, host: new URL(SITE_URL).host },
    stats: {
      systems: stats.systems,
      domains: DOMAINS.length,
      sources: stats.sources,
      claims: stats.claims,
      verified: stats.byStatus.verifie,
      unsourced: stats.claimsWithoutSources,
      updatedLabel: formatDateFr(stats.updated),
    },
    domains: DOMAINS.map((domain) => domain.label),
    dossier: {
      slug: dossier.slug,
      name: dossier.name,
      reference: dossier.reference,
      manufacturer: dossier.manufacturer,
      classLabel: dossier.classLabel,
      country: dossier.country,
      updatedLabel: dossier.updated ? formatDateFr(dossier.updated) : undefined,
      angles: buildAngles(dossier),
    },
    proof: buildProof(dossier),
    compare: {
      left: { name: dossier.name, reference: dossier.reference, country: dossier.country },
      right: { name: other.name, reference: other.reference, country: other.country },
      rows: dossier.scores.flatMap((score) => {
        const match = other.scores.find((item) => item.key === score.key);
        return match
          ? [{ label: SCORE_LABELS[score.key], left: score.grade, right: match.grade }]
          : [];
      }),
    },
    boards: HUD_BOARDS.map((board) => ({
      title: board.title,
      kind: board.kind,
      src: board.preview.src,
    })),
    graph: buildGraph(),
  };
}
