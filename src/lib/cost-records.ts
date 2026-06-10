import type { Confidence, Indicator, SourceRef } from "@/data/types";
import { systems } from "@/data/systems";

export type CostType =
  | "acquisition"
  | "maintenance"
  | "lifecycle"
  | "program"
  | "unit_public";

export type CostUncertainty = "low" | "medium" | "high";

export interface CostRecord {
  systemId: string;
  systemName: string;
  costType: CostType;
  amount: number | null;
  currency: string;
  year: number | null;
  perimeter: string;
  rawValue: string;
  sourceIds: string[];
  sources: SourceRef[];
  uncertainty: CostUncertainty;
}

function uncertaintyOf(confidence: Confidence): CostUncertainty {
  if (confidence === "haute") return "low";
  if (confidence === "moyenne") return "medium";
  return "high";
}

function costTypeOf(label: string, value: string): CostType {
  const text = `${label} ${value}`.toLowerCase();
  if (/programme|program/.test(text)) return "program";
  if (/maintenance|mco|soutien|refit|iper/.test(text)) return "maintenance";
  if (/cycle|vie|life/.test(text)) return "lifecycle";
  if (/unitaire|unit|flyaway|intercepteur/.test(text)) return "unit_public";
  return "acquisition";
}

function currencyOf(value: string): string {
  if (/cad|c\$/i.test(value)) return "CAD";
  if (/£|gbp/i.test(value)) return "GBP";
  if (/€|eur/i.test(value)) return "EUR";
  if (/\$|usd|us\$/i.test(value)) return "USD";
  return "N/A";
}

function extractYear(...values: (string | undefined)[]): number | null {
  for (const value of values) {
    const match = value?.match(/\b(20\d{2}|19\d{2})\b/);
    if (match) return Number(match[1]);
  }
  return null;
}

function extractAmount(value: string): number | null {
  if (!/[€$£]|eur|usd|cad|gbp|milliard|million|gross weapon|coût|cost/i.test(value)) {
    return null;
  }

  const match = value.match(/([0-9]+(?:[,.][0-9]+)?)/);
  if (!match) return null;

  const numeric = Number(match[1].replace(",", "."));
  if (!Number.isFinite(numeric)) return null;

  if (/md|milliard|billion|bn/i.test(value)) return numeric * 1_000_000_000;
  if (/m€|m\$|million|gross weapon| M\b/i.test(value)) {
    return numeric * 1_000_000;
  }
  return numeric;
}

function isCostIndicator(indicator: Indicator, brickKey?: string): boolean {
  const text = `${indicator.label} ${indicator.value} ${indicator.note ?? ""}`;
  return (
    brickKey === "cout" ||
    /coût|cout|cost|prix|budget|programme|maintenance|mco|lifecycle|cycle de vie|flyaway|unit/i.test(
      text,
    )
  );
}

export function getCostRecords(): CostRecord[] {
  const records: CostRecord[] = [];

  for (const system of systems) {
    const byId = new Map(system.sources.map((source) => [source.id, source]));
    const addIndicator = (indicator: Indicator, brickKey?: string) => {
      if (!isCostIndicator(indicator, brickKey)) return;

      const sourceIds = indicator.sources ?? [];
      const sources = sourceIds
        .map((id) => byId.get(id))
        .filter((source): source is SourceRef => Boolean(source));
      const firstSourceYear = extractYear(...sources.map((source) => source.date));

      records.push({
        systemId: system.slug,
        systemName: system.name,
        costType: costTypeOf(indicator.label, indicator.value),
        amount: extractAmount(indicator.value),
        currency: currencyOf(indicator.value),
        year: firstSourceYear ?? extractYear(system.updated),
        perimeter: indicator.label,
        rawValue: indicator.value,
        sourceIds,
        sources,
        uncertainty: uncertaintyOf(indicator.confidence),
      });
    };

    for (const indicator of system.keySpecs) addIndicator(indicator);
    for (const brick of system.bricks) {
      for (const indicator of brick.indicators) {
        addIndicator(indicator, brick.key);
      }
    }
  }

  return records.sort((a, b) => {
    if (a.amount === null && b.amount !== null) return 1;
    if (a.amount !== null && b.amount === null) return -1;
    return (b.amount ?? 0) - (a.amount ?? 0);
  });
}
