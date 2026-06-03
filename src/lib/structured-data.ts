import type { DefenseSystem } from "@/data/types";
import { DOMAINS } from "@/data/domains";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// Données structurées schema.org. Une fiche système = un jeu de preuves OSINT
// sourcé et daté → type `Dataset` (pas `Product` : aucune offre commerciale).
type Ld = Record<string, unknown>;

export function organizationLd(): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  };
}

export function webSiteLd(): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "fr-FR",
    description: SITE_DESCRIPTION,
  };
}

export function systemDatasetLd(system: DefenseSystem): Ld {
  const url = `${SITE_URL}/systemes/${system.slug}`;
  const keywords = [
    system.classLabel,
    system.country,
    system.manufacturer,
    system.category,
  ].filter(Boolean);
  const isBasedOn = system.sources
    .map((s) => s.url)
    .filter((u): u is string => Boolean(u));

  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: system.name,
    description: system.tagline,
    url,
    inLanguage: "fr-FR",
    dateModified: system.updated,
    keywords,
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    ...(isBasedOn.length > 0 ? { isBasedOn } : {}),
  };
}

/** Fil d'Ariane Accueil > Domaine > Système — enrichit les rich results. */
export function systemBreadcrumbLd(system: DefenseSystem): Ld {
  const domain = DOMAINS.find((d) => d.category === system.category);
  const crumbs = [
    { name: "Accueil", url: SITE_URL },
    // Le domaine « drone » pointe vers une ancre (#catalogue) : on l'omet.
    ...(domain && !domain.href.includes("#")
      ? [{ name: domain.label, url: `${SITE_URL}${domain.href}` }]
      : []),
    { name: system.name, url: `${SITE_URL}/systemes/${system.slug}` },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}
