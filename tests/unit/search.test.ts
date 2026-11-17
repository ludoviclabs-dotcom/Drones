import { describe, expect, it } from "vitest";
import { actors } from "@/data/actors";
import { systems } from "@/data/systems";
import { glossary } from "@/data/glossary";
import {
  defaultEntries,
  groupByKind,
  normalizeSearch,
  searchEntries,
} from "@/lib/search";
import { buildSearchIndex } from "@/lib/search-index";

describe("palette ⌘K — recherche", () => {
  const index = buildSearchIndex();

  it("indexe chaque système une fois, avec sa fiche", () => {
    const entries = index.filter((entry) => entry.kind === "systeme");
    expect(entries).toHaveLength(systems.length);
    expect(new Set(entries.map((entry) => entry.href)).size).toBe(
      systems.length,
    );
    expect(entries.every((entry) => entry.href.startsWith("/systemes/"))).toBe(
      true,
    );
  });

  it("indexe chaque acteur une fois, avec son dossier", () => {
    const entries = index.filter((entry) => entry.kind === "acteur");
    expect(entries).toHaveLength(actors.length);
    expect(entries.every((entry) => entry.href.startsWith("/acteurs/"))).toBe(true);
    expect(searchEntries(index, "knds")[0].href).toBe("/acteurs/knds");
    expect(searchEntries(index, "thales exail").length).toBeGreaterThan(0);
  });

  it("indexe domaines, pages et termes du glossaire", () => {
    expect(index.filter((entry) => entry.kind === "domaine")).toHaveLength(11);
    expect(index.some((e) => e.kind === "page" && e.href === "/comparateur")).toBe(
      true,
    );
    expect(
      index.filter((entry) => entry.href.startsWith("/glossaire#terme-")),
    ).toHaveLength(glossary.length);
  });

  it("aucune entrée en double", () => {
    const keys = index.map((entry) => `${entry.kind} ${entry.href}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("normalise accents, casse et ponctuation", () => {
    expect(normalizeSearch("  Défense-Aérienne ")).toBe("defense aerienne");
  });

  it("place le titre exact en tête", () => {
    const [first] = searchEntries(index, "rafale");
    expect(first.href).toBe("/systemes/rafale");
  });

  it("trouve sans accents et exige chaque mot", () => {
    expect(
      searchEntries(index, "energie dirigee").some(
        (entry) => entry.kind === "domaine",
      ),
    ).toBe(true);
    expect(searchEntries(index, "rafale zzzz")).toHaveLength(0);
  });

  it("la famille du meilleur résultat ouvre la liste", () => {
    const groups = groupByKind(searchEntries(index, "defense aerienne"));
    expect(groups[0].kind).toBe("domaine");
    expect(groupByKind(searchEntries(index, "rafale"))[0].kind).toBe("systeme");
  });

  it("cherche aussi dans l'industriel", () => {
    const results = searchEntries(index, "dassault");
    expect(results.some((entry) => entry.href === "/systemes/rafale")).toBe(
      true,
    );
  });

  it("requête vide : aucune recherche, suggestions domaines et pages", () => {
    expect(searchEntries(index, "   ")).toHaveLength(0);
    const suggestions = defaultEntries(index);
    expect(
      suggestions.every((e) => e.kind === "domaine" || e.kind === "page"),
    ).toBe(true);
    expect(groupByKind(suggestions).map((group) => group.kind)).toEqual([
      "domaine",
      "page",
    ]);
  });
});
