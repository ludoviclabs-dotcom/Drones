import { describe, expect, it } from "vitest";
import { systems } from "@/data/systems";
import { DefenseSystemSchema } from "@/data/schema";

describe("catalogue de systèmes", () => {
  it("chaque dossier respecte le schéma DefenseSystem", () => {
    for (const system of systems) {
      const result = DefenseSystemSchema.safeParse(system);
      if (!result.success) {
        throw new Error(
          `Dossier invalide « ${system.slug} » :\n${JSON.stringify(result.error.issues, null, 2)}`,
        );
      }
    }
  });

  it("les slugs sont uniques", () => {
    const slugs = systems.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("les références sont uniques", () => {
    const refs = systems.map((s) => s.reference);
    expect(new Set(refs).size).toBe(refs.length);
  });

  it("tout id de source cité par un indicateur est déclaré dans le dossier", () => {
    for (const system of systems) {
      const declared = new Set(system.sources.map((s) => s.id));
      const indicators = [
        ...system.keySpecs,
        ...system.bricks.flatMap((b) => b.indicators),
        ...(system.physicalConstraints ?? []),
        ...(system.variants ?? []),
      ];
      for (const indicator of indicators) {
        for (const id of indicator.sources ?? []) {
          expect(
            [...declared],
            `${system.slug} → indicateur « ${indicator.label} » cite la source inconnue « ${id} »`,
          ).toContain(id);
        }
      }
    }
  });
});
