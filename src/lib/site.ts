/**
 * Origine unique du site — consommée par sitemap, robots, metadataBase,
 * JSON-LD et les images Open Graph. Surcharger via NEXT_PUBLIC_SITE_URL
 * (variable d'environnement Vercel) si un domaine personnalisé est posé ;
 * sinon, l'origine de production actuelle sert de défaut.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ??
  "https://drones-mu.vercel.app";

export const SITE_NAME = "Panoplie";

export const SITE_DESCRIPTION =
  "Intelligence open source sur les systèmes de défense — coût, finance, supply chain, géopolitique et export, sourcés et datés.";
