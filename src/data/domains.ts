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
  {
    category: "radar",
    label: "Radars",
    href: "/radars",
    cta: "Ouvrir le domaine",
    blurb:
      "Alerte avancée, multi-mission, naval, BMD, aéroporté, C-UAS — des capteurs lus comme des nœuds de réseau, pas comme des produits.",
  },
  {
    category: "naval-vessel",
    label: "Bâtiments navals",
    href: "/batiments-navals",
    cta: "Ouvrir le domaine",
    blurb:
      "Porte-avions, frégates, corvettes, sous-marins et patrouilleurs — des architectures de mission, pas seulement des coques.",
  },
  {
    category: "air-defense",
    label: "Défense aérienne & antimissile",
    href: "/defense-aerienne",
    cta: "Ouvrir le domaine",
    blurb:
      "Du VSHORAD à l'antimissile balistique — SAMP/T, Patriot, NASAMS, David's Sling, Arrow 3, Iron Dome lus comme des systèmes intégrés.",
  },
  {
    category: "combat-system",
    label: "Systèmes de combat & C2",
    href: "/systemes-combat",
    cta: "Ouvrir le domaine",
    blurb:
      "Aegis, TACTICOS, PAAMS, SETIS, IBCS — le cerveau des plateformes et de la défense aérienne intégrée.",
  },
  {
    category: "spatial",
    label: "Spatial militaire",
    href: "/spatial",
    cta: "Ouvrir le domaine",
    blurb:
      "Observation, écoute, télécommunications, navigation, alerte avancée et surveillance de l'espace — des satellites lus comme des architectures de souveraineté, pas comme des objets en orbite.",
  },
];
