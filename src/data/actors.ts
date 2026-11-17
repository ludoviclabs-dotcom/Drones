import type { ActorDossier } from "./actors/types";
import { anduril } from "./actors/anduril";
import { eurenco } from "./actors/eurenco";
import { exail } from "./actors/exail";
import { knds } from "./actors/knds";
import { palantir } from "./actors/palantir";

// Index des dossiers d'acteurs — groupes industriels et défense tech, lus par
// leur capital, leurs chiffres, leur chaîne de valeur et leurs jalons. La
// validation (schéma Zod, traçabilité des chiffres) est exécutée par les tests.

export const actors: ActorDossier[] = [knds, exail, eurenco, anduril, palantir];

const ACTORS_BY_SLUG: Record<string, ActorDossier> = Object.fromEntries(
  actors.map((actor) => [actor.slug, actor]),
);

export function getActor(slug: string): ActorDossier | undefined {
  return ACTORS_BY_SLUG[slug];
}

export function getActorSlugs(): string[] {
  return actors.map((actor) => actor.slug);
}
