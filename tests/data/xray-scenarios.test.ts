import { describe, expect, it } from "vitest";
import { systems } from "@/data/systems";
import {
  buildPanoplieXrayScenario,
  SYSTEM_NODE_BUILDERS,
} from "@/data/decision-twin/panoplie-xray";
import { XRAY_EDITED_SLUGS } from "@/data/decision-twin/coverage";

// Smoke test des scénarios X-Ray.
//
// Garantit que :
//   - aucun système du catalogue ne provoque une exception au build ;
//   - chaque scénario satisfait les invariants minimaux (couches, hotspots) ;
//   - le set partagé `XRAY_EDITED_SLUGS` reste aligné avec les clés réelles
//     de `SYSTEM_NODE_BUILDERS` (la duplication est volontaire pour éviter
//     d'importer panoplie-xray côté client — voir coverage.ts).

describe("scénarios System X-Ray", () => {
  it("se construit sans erreur pour chaque système du catalogue", () => {
    for (const system of systems) {
      expect(() => buildPanoplieXrayScenario(system)).not.toThrow();
    }
  });

  it("expose 6 couches et au moins 6 hotspots par système", () => {
    for (const system of systems) {
      const scenario = buildPanoplieXrayScenario(system);
      expect(scenario.layers).toHaveLength(6);
      expect(scenario.nodes.length).toBeGreaterThanOrEqual(6);
    }
  });

  it("expose un coverage cohérent avec le dispatch", () => {
    for (const system of systems) {
      const scenario = buildPanoplieXrayScenario(system);
      const isEdited = system.slug in SYSTEM_NODE_BUILDERS;
      expect(scenario.coverage).toBe(isEdited ? "edited" : "auto");
    }
  });

  it("les dossiers édités produisent au moins 8 hotspots curés", () => {
    for (const slug of XRAY_EDITED_SLUGS) {
      const system = systems.find((s) => s.slug === slug);
      expect(system, `dossier ${slug} absent du catalogue`).toBeTruthy();
      if (!system) continue;
      const scenario = buildPanoplieXrayScenario(system);
      expect(scenario.coverage).toBe("edited");
      expect(scenario.nodes.length).toBeGreaterThanOrEqual(8);
    }
  });

  it("XRAY_EDITED_SLUGS reste synchronisé avec SYSTEM_NODE_BUILDERS", () => {
    const dispatchSlugs = new Set(Object.keys(SYSTEM_NODE_BUILDERS));
    const editedSlugs = new Set(XRAY_EDITED_SLUGS);
    expect(editedSlugs).toEqual(dispatchSlugs);
  });

  it("chaque hotspot d'un dossier édité porte une layer connue", () => {
    const knownLayers = new Set([
      "cout",
      "finance",
      "supply-chain",
      "geopolitique",
      "export",
      "sources",
    ]);
    for (const slug of XRAY_EDITED_SLUGS) {
      const system = systems.find((s) => s.slug === slug);
      if (!system) continue;
      const scenario = buildPanoplieXrayScenario(system);
      for (const node of scenario.nodes) {
        expect(
          knownLayers.has(node.layer),
          `hotspot ${node.id} a une layer inconnue: ${node.layer}`,
        ).toBe(true);
      }
    }
  });
});
