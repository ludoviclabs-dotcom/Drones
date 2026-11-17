import { describe, expect, it } from "vitest";
import { actors, getActor, getActorSlugs } from "@/data/actors";
import { ActorDossierSchema } from "@/data/actors/schema";
import { getSystem } from "@/data/systems";
import { chargerRegistre } from "../support/registre";

// Dossiers d'acteurs (/acteurs) — forme, unicité, renvois internes. La
// fidélité des chiffres au registre est vérifiée par registre-tracabilite.test.ts.

const registre = chargerRegistre();

describe("dossiers d'acteurs — schéma", () => {
  it("les cinq dossiers attendus sont présents", () => {
    expect(getActorSlugs().sort()).toEqual(
      ["anduril", "eurenco", "exail", "knds", "palantir"],
    );
  });

  it.each(actors.map((a) => [a.slug, a] as const))("%s respecte le schéma", (_slug, actor) => {
    const result = ActorDossierSchema.safeParse(actor);
    expect(result.success, result.success ? "" : result.error.message).toBe(true);
  });

  it("slugs et références sont uniques", () => {
    expect(new Set(actors.map((a) => a.slug)).size).toBe(actors.length);
    expect(new Set(actors.map((a) => a.reference)).size).toBe(actors.length);
  });

  it("getActor renvoie le dossier, et rien pour un slug inconnu", () => {
    expect(getActor("knds")?.name).toBe("KNDS");
    expect(getActor("inconnu")).toBeUndefined();
  });

  it("chaque entité citée existe au registre", () => {
    for (const actor of actors) {
      for (const id of actor.registryEntityIds) {
        expect(registre.entiteParId.has(id), `${actor.slug} : ${id}`).toBe(true);
      }
    }
  });

  it("les systèmes liés existent dans le catalogue", () => {
    for (const actor of actors) {
      for (const slug of actor.relatedSystems ?? []) {
        expect(getSystem(slug), `${actor.slug} → ${slug}`).toBeDefined();
      }
    }
  });

  it("chaque source citée par un chiffre existe dans le dossier", () => {
    for (const actor of actors) {
      const ids = new Set(actor.sources.map((s) => s.id));
      const indicateurs = [...actor.keyFigures, ...actor.bricks.flatMap((b) => b.indicators)];
      for (const ind of indicateurs) {
        for (const sid of ind.sources ?? []) {
          expect(ids.has(sid), `${actor.slug} « ${ind.label} » → ${sid}`).toBe(true);
        }
      }
    }
  });

  it("chaque chiffre clé du registre porte son metric_id et son statut", () => {
    for (const actor of actors) {
      for (const ind of actor.keyFigures) {
        expect(ind.metricIds?.length, `${actor.slug} « ${ind.label} »`).toBeGreaterThan(0);
        expect(ind.figureStatus, `${actor.slug} « ${ind.label} »`).toBeDefined();
      }
    }
  });
});
