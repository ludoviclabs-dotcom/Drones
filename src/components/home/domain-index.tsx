"use client";

import Link from "next/link";
import { useState } from "react";
import type { SystemCategory } from "@/data/types";
import type { DomainInfo } from "@/data/domains";
import { DomainEmblem } from "@/components/domain-emblem";

export interface DomainEntry extends DomainInfo {
  count: number;
}

/**
 * Index compact des domaines : la liste à gauche, l'aperçu du domaine
 * survolé, focalisé ou touché à droite. Chaque ligne reste un vrai lien vers
 * le domaine : sans JavaScript, l'index fonctionne comme une simple liste.
 */
export function DomainIndex({
  domains,
  initial,
}: {
  domains: DomainEntry[];
  initial: SystemCategory;
}) {
  const [active, setActive] = useState<SystemCategory>(initial);
  const activeIndex = Math.max(
    0,
    domains.findIndex((domain) => domain.category === active),
  );
  const current = domains[activeIndex];

  return (
    <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:items-start lg:gap-14">
      <ol
        className="grid border-b border-line sm:grid-cols-2 sm:gap-x-10"
        aria-label="Domaines"
      >
        {domains.map((domain, i) => {
          const selected = domain.category === active;
          return (
            <li key={domain.category}>
              <Link
                href={domain.href}
                data-active={selected ? "" : undefined}
                onMouseEnter={() => setActive(domain.category)}
                onFocus={() => setActive(domain.category)}
                className={`flex min-h-[52px] items-center gap-3.5 border-t border-line py-3 font-sans text-[15px] font-medium transition-colors ${
                  selected ? "text-accent" : "text-ink-dim hover:text-ink"
                }`}
              >
                <span className="w-6 shrink-0 font-mono text-[11px] text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">{domain.label}</span>
                <span className="shrink-0 font-mono text-[11px] text-ink-faint">
                  {domain.count} dossiers
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <aside
        key={current.category}
        aria-live="polite"
        className="home-fade flex flex-col gap-5 border border-line-bright bg-panel p-7 lg:sticky lg:top-[calc(var(--site-header-offset)+1.5rem)]"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            Aperçu · {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(domains.length).padStart(2, "0")}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            {current.count} dossiers documentés
          </p>
        </div>
        <DomainEmblem
          category={current.category}
          className="h-28 w-28 text-accent"
        />
        <h3 className="font-serif text-3xl leading-tight text-ink">
          {current.label}
        </h3>
        <p className="font-serif text-lg leading-relaxed text-ink-dim">
          {current.blurb}
        </p>
        <Link
          href={current.href}
          className="inline-flex min-h-12 items-center self-start border border-line-bright px-5 font-mono text-xs uppercase tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
        >
          {current.cta} →
        </Link>
      </aside>
    </div>
  );
}
