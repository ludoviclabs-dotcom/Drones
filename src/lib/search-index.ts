import { systems } from "@/data/systems";
import { DOMAINS } from "@/data/domains";
import { glossary } from "@/data/glossary";
import { organisms } from "@/data/organisms";
import { HUD_BOARDS } from "@/data/hud/boards";
import { NAV_GROUPS } from "@/data/navigation";
import {
  glossaryTermAnchor,
  normalizeSearch,
  type SearchEntry,
} from "./search";

function keywords(parts: (string | undefined | null)[]): string {
  return normalizeSearch(parts.filter(Boolean).join(" "));
}

/**
 * Index de la palette ⌘K : systèmes, domaines, pages et glossaire. Servi en
 * JSON statique (`/api/search-index`), chargé à la première ouverture.
 */
export function buildSearchIndex(): SearchEntry[] {
  const domainLabel = new Map(
    DOMAINS.map((domain) => [domain.category, domain.label] as const),
  );

  const systemEntries: SearchEntry[] = systems.map((system) => {
    const domain = domainLabel.get(system.category);
    return {
      kind: "systeme",
      title: system.name,
      subtitle: [system.reference, domain, system.manufacturer, system.country]
        .filter(Boolean)
        .join(" · "),
      href: `/systemes/${system.slug}`,
      keywords: keywords([
        system.designation,
        system.reference,
        system.classLabel,
        system.manufacturer,
        system.country,
        domain,
        system.slug.replace(/-/g, " "),
      ]),
    };
  });

  const domainEntries: SearchEntry[] = DOMAINS.map((domain) => ({
    kind: "domaine",
    title: domain.label,
    subtitle: domain.blurb,
    href: domain.href,
    keywords: keywords([domain.blurb]),
  }));

  const seen = new Set<string>(["/"]);
  const pageEntries: SearchEntry[] = [
    {
      kind: "page",
      title: "Accueil",
      subtitle: "Panoplie — observatoire OSINT stratégique",
      href: "/",
      keywords: keywords(["panoplie home"]),
    },
  ];
  for (const group of NAV_GROUPS) {
    for (const link of group.links) {
      if (seen.has(link.href)) continue;
      seen.add(link.href);
      pageEntries.push({
        kind: "page",
        title: link.label,
        subtitle: link.hint ? `${group.label} · ${link.hint}` : group.label,
        href: link.href,
        keywords: keywords([group.label, link.hint]),
      });
    }
  }
  for (const board of HUD_BOARDS) {
    if (seen.has(board.href)) continue;
    seen.add(board.href);
    pageEntries.push({
      kind: "page",
      title: board.title,
      subtitle: `Planche technique · ${board.kind}`,
      href: board.href,
      keywords: keywords(["planche hud 3d", board.kind]),
    });
  }

  const glossaryEntries: SearchEntry[] = [
    ...glossary.map(
      (term): SearchEntry => ({
        kind: "glossaire",
        title: term.acronym ? `${term.term} (${term.acronym})` : term.term,
        subtitle: "Terme du glossaire",
        href: `/glossaire#${glossaryTermAnchor(term.slug)}`,
        keywords: keywords([term.acronym]),
      }),
    ),
    ...organisms.map(
      (org): SearchEntry => ({
        kind: "glossaire",
        title: org.acronym ? `${org.acronym} — ${org.name}` : org.name,
        subtitle: `Organisme · ${org.scope}`,
        href: `/glossaire#org-${org.slug}`,
        keywords: keywords([org.scope]),
      }),
    ),
  ];

  return [...systemEntries, ...domainEntries, ...pageEntries, ...glossaryEntries];
}
