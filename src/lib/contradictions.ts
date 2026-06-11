import { CURATED_CONTRADICTIONS } from "@/data/curated-contradictions";
import { systems } from "@/data/systems";
import type { SourceRef } from "@/data/types";
import type { Claim } from "@/lib/claims";

export type ContradictionSeverity = "faible" | "moyenne" | "forte";

export interface ContradictionCandidate {
  id: string;
  systemName: string;
  category: "cout" | "date" | "export" | "industriel";
  point: string;
  claimA?: string;
  claimB?: string;
  nature: string;
  severity: ContradictionSeverity;
  sourceCount: number;
  sourceIds: string[];
  sources: SourceRef[];
  nextCheck: string;
  curated: boolean;
}

function resolveSources(systemId: string, sourceIds: string[]): SourceRef[] {
  const system = systems.find((item) => item.slug === systemId);
  if (!system) return [];
  return sourceIds
    .map((sourceId) => system.sources.find((source) => source.id === sourceId))
    .filter(Boolean) as SourceRef[];
}

function getCuratedContradictionCandidates(): ContradictionCandidate[] {
  return CURATED_CONTRADICTIONS.map((item) => {
    const system = systems.find((entry) => entry.slug === item.systemId);
    const sources = resolveSources(item.systemId, item.sourceIds);

    return {
      id: item.id,
      systemName: system?.name ?? item.systemId,
      category: item.category,
      point: item.point,
      claimA: item.claimA,
      claimB: item.claimB,
      nature: item.nature,
      severity: item.severity,
      sourceCount: sources.length,
      sourceIds: item.sourceIds,
      sources,
      nextCheck: item.nextCheck,
      curated: true,
    };
  });
}

function categoryOf(claim: Claim): ContradictionCandidate["category"] | null {
  const text = `${claim.scope} ${claim.label}`.toLowerCase();
  if (text.includes("cout") || text.includes("coût") || text.includes("prix")) {
    return "cout";
  }
  if (/date|calendrier|programme|livraison|temporalit/.test(text)) return "date";
  if (claim.scope === "export" || text.includes("export")) return "export";
  if (
    claim.scope === "supply-chain" ||
    /industri|maître|maitre|chantier|fournisseur|supply/.test(text)
  ) {
    return "industriel";
  }
  return null;
}

function severityOf(claim: Claim): ContradictionSeverity {
  if (claim.status === "variable") return "forte";
  if (claim.confidence === "faible") return "moyenne";
  return "faible";
}

function natureOf(claim: Claim): string {
  if (claim.status === "variable") {
    return "Valeur variable selon standard, périmètre ou client";
  }
  if (claim.confidence === "faible") {
    return "Affirmation peu stabilisée dans les sources ouvertes";
  }
  if (claim.sources.length > 1) {
    return "Sources multiples à comparer avant conclusion";
  }
  return "Point à revoir lors de la prochaine mise à jour";
}

export function getContradictionCandidates(
  claims: Claim[],
): ContradictionCandidate[] {
  const candidates = getCuratedContradictionCandidates();
  const seen = new Set(candidates.map((candidate) => candidate.id));

  for (const claim of claims) {
    const category = categoryOf(claim);
    if (!category) continue;
    if (
      claim.status !== "variable" &&
      claim.confidence !== "faible" &&
      claim.sources.length < 2
    ) {
      continue;
    }

    const id = `${claim.claimId}:${category}`;
    if (seen.has(id)) continue;
    seen.add(id);

    candidates.push({
      id,
      systemName: claim.systemName,
      category,
      point: claim.label,
      nature: natureOf(claim),
      severity: severityOf(claim),
      sourceCount: claim.sources.length,
      sourceIds: claim.sources.map((source) => source.id),
      sources: claim.sources,
      nextCheck:
        "Comparer périmètre, date de publication et source primaire avant de trancher.",
      curated: false,
    });
  }

  return candidates.slice(0, 48);
}
