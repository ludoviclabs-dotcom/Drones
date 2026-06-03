import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import {
  AIR_DEFENSE_BLURBS,
  AIR_DEFENSE_LABELS,
  AIR_DEFENSE_ORDER,
} from "@/data/labels";
import type { AirDefenseClass } from "@/data/types";
import { DomainEmblem } from "@/components/domain-emblem";
import { SectionMarker } from "@/components/primitives";
import { RegistrationMarks } from "@/components/registration-marks";
import { Stamp } from "@/components/stamp";

export const metadata: Metadata = {
  alternates: { canonical: "/defense-aerienne" },
  title: "Défense aérienne & antimissile",
  description:
    "Le domaine de la défense sol-air et antimissile — SAMP/T NG, Patriot, NASAMS, David's Sling, Arrow 3, Iron Dome. Des systèmes intégrés lus par couches, coût, chaîne industrielle et régime d'export.",
};

export default function DefenseAeriennePage() {
  const dossiers = systems.filter((s) => s.category === "air-defense");
  const countByClass = (layer: AirDefenseClass) =>
    dossiers.filter((s) => s.airDefenseClass === layer).length;

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12">
      <header className="reveal">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            Domaine
          </p>
          <Stamp tone="ink" rotate={-3}>
            PNP-AD
          </Stamp>
        </div>
        <div className="mt-4 flex items-start gap-5">
          <DomainEmblem
            category="air-defense"
            className="hidden h-16 w-16 shrink-0 text-accent sm:block"
          />
          <div>
            <h1 className="font-serif text-5xl tracking-tight text-ink sm:text-6xl">
              Défense aérienne & antimissile
            </h1>
            <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
              Les systèmes sol-air ne se lisent pas comme des missiles isolés,
              mais comme des architectures intégrées : radar, conduite de tir,
              lanceurs, intercepteurs et C2. Panoplie les classe par couche, du
              VSHORAD à l'antimissile balistique.
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-4 font-serif text-base italic leading-relaxed text-ink-dim">
          Les effecteurs (Aster, PAC-3, AMRAAM, Tamir) sont documentés côté
          missiles ; ce domaine lit les systèmes complets et leur place dans une
          défense multicouche.
        </p>
      </header>

      <section className="mt-16">
        <SectionMarker
          index="01"
          label="Couches de défense"
          blurb="La défense aérienne moderne se pense en couches superposées, du très courte portée à l'interception balistique exo-atmosphérique."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {AIR_DEFENSE_ORDER.map((layer) => {
            const count = countByClass(layer);
            return (
              <div key={layer} className="bg-panel p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                    {AIR_DEFENSE_LABELS[layer]}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {count} {count > 1 ? "dossiers" : "dossier"}
                  </span>
                </div>
                <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                  {AIR_DEFENSE_BLURBS[layer]}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="02"
          label="Les dossiers du domaine"
          blurb={`${dossiers.length} systèmes intégrés documentés — du C-RAM rapproché à l'antimissile balistique.`}
        />
        {dossiers.length > 0 ? (
          <ul className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
            {dossiers.map((system) => (
              <li key={system.slug} className="bg-panel">
                <Link
                  href={`/systemes/${system.slug}`}
                  className="group flex items-center gap-4 p-5"
                >
                  <span className="flex-1">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                      {system.reference}
                    </span>
                    <span className="block font-serif text-xl text-ink transition-colors group-hover:text-accent">
                      {system.name}
                    </span>
                    <span className="block font-mono text-[10px] text-ink-faint">
                      {system.flag} {system.country} · {system.classLabel}
                    </span>
                  </span>
                  <span className="font-mono text-ink-faint transition-colors group-hover:text-accent">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 border border-dashed border-line-bright bg-panel/40 px-6 py-12 text-center font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
            Dossiers en cours de rédaction.
          </p>
        )}
      </section>

      <section className="mt-16">
        <div className="relative border border-line bg-panel p-8">
          <RegistrationMarks />
          <h2 className="font-serif text-2xl leading-tight text-ink">
            Lire la défense aérienne par couches
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-ink-dim">
            Chaque couche a son économie et sa géopolitique : le C-RAM joue le
            coût par tir, le MRAD la défense de zone, le BMD la sensibilité
            stratégique. La grille Panoplie reste constante — coût, finance,
            supply chain, géopolitique, export.
          </p>
          <nav className="mt-5 flex flex-wrap gap-6">
            <Link
              href="/comparateur"
              className="font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
            >
              Comparer les systèmes →
            </Link>
            <Link
              href="/missiles"
              className="font-mono text-xs uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
            >
              Voir les effecteurs (missiles)
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
