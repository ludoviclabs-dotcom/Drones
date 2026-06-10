import type { SourceRef } from "@/data/types";

export type SourceConfidenceBand = "forte" | "moyenne" | "faible" | "a-recouper";

export interface SourceConfidenceScore {
  score: number;
  band: SourceConfidenceBand;
  label: string;
  reasons: string[];
}

const REFERENCE_YEAR = 2026;

const RELIABILITY_POINTS: Record<SourceRef["reliability"], number> = {
  A: 35,
  B: 26,
  C: 14,
  D: 4,
};

const TYPE_POINTS: Record<SourceRef["type"], number> = {
  officiel: 25,
  institution: 24,
  constructeur: 18,
  "think-tank": 16,
  presse: 12,
};

function extractYear(date?: string): number | null {
  if (!date) return null;
  const match = date.match(/\b(20\d{2}|19\d{2})\b/);
  return match ? Number(match[1]) : null;
}

function freshnessPoints(year: number | null): number {
  if (!year) return 4;
  const age = Math.max(0, REFERENCE_YEAR - year);
  if (age <= 1) return 20;
  if (age <= 3) return 15;
  if (age <= 6) return 10;
  return 5;
}

function bandFor(score: number): SourceConfidenceBand {
  if (score >= 78) return "forte";
  if (score >= 58) return "moyenne";
  if (score >= 38) return "faible";
  return "a-recouper";
}

export const SOURCE_CONFIDENCE_META: Record<
  SourceConfidenceBand,
  { label: string; token: string }
> = {
  forte: { label: "Source forte", token: "var(--color-grade-a)" },
  moyenne: { label: "Source moyenne", token: "var(--color-grade-c)" },
  faible: { label: "Source faible", token: "var(--color-grade-d)" },
  "a-recouper": { label: "À recouper", token: "var(--color-grade-e)" },
};

export function scoreSource(source: SourceRef): SourceConfidenceScore {
  const year = extractYear(source.date);
  const score = Math.min(
    100,
    RELIABILITY_POINTS[source.reliability] +
      TYPE_POINTS[source.type] +
      freshnessPoints(year) +
      (source.url ? 10 : 0) +
      (source.date ? 6 : 0),
  );
  const band = bandFor(score);
  const reasons = [
    `fiabilité ${source.reliability}`,
    source.type,
    year ? `source ${year}` : "date absente",
    source.url ? "URL publique" : "URL absente",
  ];

  return {
    score,
    band,
    label: SOURCE_CONFIDENCE_META[band].label,
    reasons,
  };
}

export function sourceKey(source: SourceRef): string {
  return source.url ?? `${source.publisher}:${source.title}`;
}
