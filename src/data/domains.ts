import type { SystemCategory } from "./types";

/** Métadonnée d'un domaine du catalogue — partagée par le hero et l'index. */
export interface DomainInfo {
  category: SystemCategory;
  label: string;
  href: string;
  cta: string;
  blurb: string;
}

export const DOMAINS: DomainInfo[] = [
  {
    category: "drone",
    label: "Drones & munitions rôdeuses",
    href: "/#catalogue",
    cta: "Parcourir le catalogue",
    blurb:
      "Du drone MALE au drone naval, de la munition rôdeuse au HALE stratégique.",
  },
  {
    category: "directed-energy",
    label: "Énergie dirigée",
    href: "/energie-dirigee",
    cta: "Ouvrir le domaine",
    blurb:
      "Lasers haute énergie — missions C-UAS, C-RAM, SHORAD et défense multicouche.",
  },
  {
    category: "combat-aircraft",
    label: "Aviation de combat",
    href: "/aviation-combat",
    cta: "Ouvrir le domaine",
    blurb:
      "Chasseurs 4.5e, 5e et 6e génération — lus comme des architectures de puissance aérienne.",
  },
  {
    category: "missile",
    label: "Missiles",
    href: "/missiles",
    cta: "Ouvrir le domaine",
    blurb:
      "Air-air, air-surface, surface-surface, surface-air et SEAD — un objet technique, industriel et de contrôle.",
  },
];
