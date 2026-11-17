import { describe, expect, it } from "vitest";
import { systems } from "@/data/systems";
import type { SourceRef } from "@/data/types";
import {
  buildSourceIndex,
  formatNoteNumber,
  notesFor,
  numberCitedSources,
} from "@/lib/source-notes";

const sources: SourceRef[] = [
  { id: "a", title: "A", publisher: "Pa", type: "officiel", reliability: "A" },
  { id: "b", title: "B", publisher: "Pb", type: "presse", reliability: "B" },
  { id: "c", title: "C", publisher: "Pc", type: "constructeur", reliability: "C" },
];

describe("renvois de sources", () => {
  it("numérote dans l'ordre de la liste du dossier", () => {
    const index = buildSourceIndex(sources, "fiche-x");
    expect(notesFor(["c", "a"], index).map((note) => note.n)).toEqual([3, 1]);
    expect(index.get("b")?.anchor).toBe("fiche-x-source-b");
  });

  it("ignore les ids inconnus et les doublons", () => {
    const index = buildSourceIndex(sources, "fiche-x");
    expect(notesFor(["a", "zz", "a"], index)).toHaveLength(1);
    expect(notesFor(undefined, index)).toEqual([]);
  });

  it("numérotation locale : ordre de première citation", () => {
    const { cited, index } = numberCitedSources(
      [["c"], ["a", "c"], undefined],
      sources,
      "demo-cout",
    );
    expect(cited.map((note) => [note.n, note.title])).toEqual([
      [1, "C"],
      [2, "A"],
    ]);
    expect(index.get("a")?.anchor).toBe("demo-cout-source-a");
  });

  it("format sur deux chiffres, comme la liste « Sources »", () => {
    expect(formatNoteNumber(3)).toBe("03");
    expect(formatNoteNumber(12)).toBe("12");
  });

  it("les renvois du registre pointent vers des sources du dossier", () => {
    // Un id cité mais absent de `sources` produirait un renvoi muet.
    const dangling: string[] = [];
    for (const system of systems) {
      const ids = new Set(system.sources.map((source) => source.id));
      const cited = [
        ...system.bricks.flatMap((brick) => brick.indicators),
        ...system.keySpecs,
        ...(system.variants ?? []),
        ...(system.physicalConstraints ?? []),
      ].flatMap((indicator) => indicator.sources ?? []);
      for (const id of cited) {
        if (!ids.has(id)) dangling.push(`${system.slug}:${id}`);
      }
    }
    expect(dangling).toEqual([]);
  });
});
