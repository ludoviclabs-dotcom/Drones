import type { Reliability, SourceRef } from "@/data/types";
import { SOURCE_TYPE_LABELS } from "@/data/labels";

/**
 * Une source citée, numérotée dans la liste du dossier (ou de l'angle).
 * Données sérialisables : construites côté serveur, lues par les renvois.
 */
export interface SourceNote {
  /** Numéro affiché — celui de l'entrée dans la liste des sources. */
  n: number;
  /** `id` de l'entrée correspondante dans la liste des sources. */
  anchor: string;
  title: string;
  publisher: string;
  typeLabel: string;
  reliability: Reliability;
  date?: string;
}

export function formatNoteNumber(n: number): string {
  return String(n).padStart(2, "0");
}

/** `id` HTML de l'entrée d'une source dans une liste préfixée. */
export function sourceAnchor(prefix: string, sourceId: string): string {
  return `${prefix}-source-${sourceId}`;
}

export function toSourceNote(
  source: SourceRef,
  n: number,
  prefix: string,
): SourceNote {
  return {
    n,
    anchor: sourceAnchor(prefix, source.id),
    title: source.title,
    publisher: source.publisher,
    typeLabel: SOURCE_TYPE_LABELS[source.type],
    reliability: source.reliability,
    date: source.date,
  };
}

/**
 * Index des sources d'un dossier : le numéro suit l'ordre de la liste
 * « Sources » de la fiche, de sorte que le renvoi 03 désigne l'entrée 03.
 */
export function buildSourceIndex(
  sources: SourceRef[],
  prefix: string,
): Map<string, SourceNote> {
  return new Map(
    sources.map((source, i) => [source.id, toSourceNote(source, i + 1, prefix)]),
  );
}

/** Renvois d'une affirmation, dans l'ordre de citation ; ids inconnus ignorés. */
export function notesFor(
  ids: readonly string[] | undefined,
  index: Map<string, SourceNote>,
): SourceNote[] {
  if (!ids) return [];
  const seen = new Set<string>();
  return ids.flatMap((id) => {
    const note = index.get(id);
    if (!note || seen.has(id)) return [];
    seen.add(id);
    return [note];
  });
}

/**
 * Numérotation locale : les sources citées par une série d'affirmations
 * (un angle de la démonstration), numérotées dans leur ordre d'apparition.
 */
export function numberCitedSources(
  citations: readonly (readonly string[] | undefined)[],
  sources: SourceRef[],
  prefix: string,
): { cited: SourceNote[]; index: Map<string, SourceNote> } {
  const byId = new Map(sources.map((source) => [source.id, source] as const));
  const index = new Map<string, SourceNote>();
  for (const ids of citations) {
    for (const id of ids ?? []) {
      const source = byId.get(id);
      if (!source || index.has(id)) continue;
      index.set(id, toSourceNote(source, index.size + 1, prefix));
    }
  }
  return { cited: [...index.values()], index };
}
