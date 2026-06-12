import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import { DOMAINS } from "@/data/domains";
import { DomainEmblem } from "@/components/domain-emblem";

export const metadata: Metadata = {
  alternates: { canonical: "/domaines" },
  title: "Domaines",
  description:
    "Les domaines d'analyse de Panoplie, des drones aux feux terrestres, à grille de lecture constante.",
};

export default function DomainesPage() {
  const domains = DOMAINS.map((domain) => ({
    ...domain,
    count: systems.filter((s) => s.category === domain.category).length,
  }));

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Catalogue
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink sm:text-6xl">
          Domaines
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Panoplie analyse les systèmes de défense par domaine, à grille de
          lecture constante — coût, finance, supply chain, géopolitique, export.
          {" "}
          {systems.length} dossiers répartis en {domains.length} domaines.
        </p>
      </header>

      <section className="mt-12">
        <div className="grid gap-px border border-line bg-line">
          {domains.map((domain) => (
            <Link
              key={domain.href}
              href={domain.href}
              className="group flex flex-col gap-5 bg-panel p-6 transition-colors hover:bg-surface-2 sm:flex-row sm:items-center sm:gap-7 sm:p-8"
            >
              <DomainEmblem
                category={domain.category}
                className="h-20 w-20 shrink-0 text-ink-faint transition-colors group-hover:text-accent"
              />
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-2xl text-ink transition-colors group-hover:text-accent">
                  {domain.label}
                </h2>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                  {domain.count} dossiers documentés
                </p>
                <p className="mt-3 max-w-xl font-serif text-[1.02rem] leading-relaxed text-ink-dim">
                  {domain.blurb}
                </p>
              </div>
              <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                {domain.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-line pt-6">
        <p className="max-w-2xl font-serif text-sm italic leading-relaxed text-ink-faint">
          Tous les domaines suivent la même grille — cinq briques d'analyse et
          six paliers d'évaluation. La{" "}
          <Link
            href="/methodologie"
            className="text-accent transition-colors hover:text-ink"
          >
            méthodologie
          </Link>{" "}
          en détaille la lecture ; la{" "}
          <Link
            href="/console"
            className="text-accent transition-colors hover:text-ink"
          >
            Console OSINT
          </Link>{" "}
          en trace chaque affirmation.
        </p>
      </section>
    </div>
  );
}
