import Link from "next/link";
import { systems } from "@/data/systems";
import { BRICK_BLURBS, BRICK_LABELS, BRICK_ORDER } from "@/data/labels";
import { SystemCard } from "@/components/system-card";
import { SectionMarker } from "@/components/primitives";

export default function Home() {
  return (
    <div className="mx-auto max-w-[1180px] px-5">
      <section className="reveal border-b border-line py-20 sm:py-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Intelligence open source · Systèmes de défense
        </p>
        <h1 className="mt-7 max-w-4xl font-serif text-5xl leading-[1.04] tracking-tight text-ink sm:text-7xl">
          Un système d'armes n'est jamais un{" "}
          <span className="italic text-accent">simple achat</span>.
        </h1>
        <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Derrière chaque drone : un coût réel, un financement, une chaîne
          industrielle, une dépendance géopolitique, un régime d'export.
          Panoplie rend cette réalité lisible à partir de sources ouvertes —
          peu de fiches, mais documentées, sourcées et comparables. On commence
          par les drones.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="#catalogue"
            className="inline-flex h-11 items-center border border-accent bg-accent px-5 font-mono text-xs uppercase tracking-[0.14em] text-bg transition-colors hover:bg-accent-deep hover:border-accent-deep"
          >
            Explorer les systèmes →
          </Link>
          <Link
            href="/methodologie"
            className="inline-flex h-11 items-center border border-line-bright px-5 font-mono text-xs uppercase tracking-[0.14em] text-ink-dim transition-colors hover:border-accent hover:text-accent"
          >
            Méthodologie
          </Link>
        </div>
      </section>

      <section className="border-b border-line py-16">
        <SectionMarker
          index="—"
          label="La grille de lecture"
          blurb="Cinq briques d'analyse, appliquées à chaque système — la trame qui relie l'objet technique à son contexte stratégique."
        />
        <div className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {BRICK_ORDER.map((key, i) => (
            <div key={key} className="bg-panel p-5">
              <span className="font-mono text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-mono text-sm uppercase tracking-[0.1em] text-ink">
                {BRICK_LABELS[key]}
              </h3>
              <p className="mt-2 font-serif text-[0.92rem] leading-relaxed text-ink-dim">
                {BRICK_BLURBS[key]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="catalogue" className="scroll-mt-24 py-16">
        <SectionMarker
          index="—"
          label="Catalogue des systèmes"
          blurb="Trois drones contrastés, choisis pour illustrer trois modèles d'acquisition différents."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {systems.map((system, i) => (
            <SystemCard key={system.slug} system={system} index={i} />
          ))}
        </div>
      </section>

      <section className="border-t border-line py-16">
        <div className="grid gap-8 border border-line bg-panel p-8 md:grid-cols-[1.6fr_1fr] md:items-center">
          <div>
            <h2 className="font-serif text-3xl leading-tight text-ink">
              Comparer vaut mieux que décrire.
            </h2>
            <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-ink-dim">
              Le comparateur confronte deux ou trois systèmes côte à côte, brique
              par brique. La page Méthodologie explique comment les paliers sont
              attribués et comment lire le niveau de confiance des données.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/comparateur"
              className="inline-flex h-11 items-center justify-center border border-accent bg-accent px-5 font-mono text-xs uppercase tracking-[0.14em] text-bg transition-colors hover:bg-accent-deep hover:border-accent-deep"
            >
              Ouvrir le comparateur →
            </Link>
            <Link
              href="/methodologie"
              className="inline-flex h-11 items-center justify-center border border-line-bright px-5 font-mono text-xs uppercase tracking-[0.14em] text-ink-dim transition-colors hover:border-accent hover:text-accent"
            >
              Lire la méthodologie
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
