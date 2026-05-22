"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { SystemCategory } from "@/data/types";
import { DomainChips, type DomainValue } from "./domain-filter";

// Une entrée du catalogue : la carte déjà rendue côté serveur, plus le texte
// indexable et le domaine qui servent au filtre.
export interface CatalogueEntry {
  slug: string;
  category: SystemCategory;
  haystack: string;
  card: ReactNode;
}

/**
 * Filtre du catalogue — domaine et recherche type-ahead. Les cartes restent
 * montées (les non concordantes sont seulement masquées) pour préserver le
 * tracé des schématiques déjà révélées.
 */
export function CatalogueFilter({ entries }: { entries: CatalogueEntry[] }) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<DomainValue>("all");
  const norm = query.trim().toLowerCase();

  const visible = useMemo(
    () =>
      new Set(
        entries
          .filter(
            (entry) =>
              (domain === "all" || entry.category === domain) &&
              (norm === "" || entry.haystack.includes(norm)),
          )
          .map((entry) => entry.slug),
      ),
    [entries, norm, domain],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border border-line bg-panel p-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          Filtrer
        </span>
        <DomainChips value={domain} onChange={setDomain} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nom, pays, constructeur, classe…"
          aria-label="Filtrer le catalogue des systèmes"
          className="min-w-[200px] flex-1 border border-line-bright bg-surface px-3 py-1.5 font-mono text-xs text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <span className="font-mono text-[11px] text-ink-dim">
          {visible.size} / {entries.length}
        </span>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <div
            key={entry.slug}
            className={visible.has(entry.slug) ? undefined : "hidden"}
          >
            {entry.card}
          </div>
        ))}
      </div>

      {visible.size === 0 ? (
        <p className="mt-6 border border-dashed border-line-bright bg-panel/40 px-6 py-12 text-center font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
          Aucun système ne correspond à ces filtres
        </p>
      ) : null}
    </div>
  );
}
