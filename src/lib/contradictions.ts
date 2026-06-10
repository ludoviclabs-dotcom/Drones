import type { Claim } from "@/lib/claims";

export type ContradictionSeverity = "faible" | "moyenne" | "forte";

export interface ContradictionCandidate {
  id: string;
  systemName: string;
  category: "cout" | "date" | "export" | "industriel";
  point: string;
  nature: string;
  severity: ContradictionSeverity;
  sourceCount: number;
  nextCheck: string;
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
  const candidates: ContradictionCandidate[] = [];
  const seen = new Set<string>();

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
      nextCheck:
        "Comparer périmètre, date de publication et source primaire avant de trancher.",
    });
  }

  return candidates.slice(0, 32);
}
