import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSystem, getSystemSlugs } from "@/data/systems";
import { MODE_LABELS } from "@/data/labels";
import {
  AnalystNote,
  BrickSection,
  EditorialTriptych,
  ScoreGrid,
  SourceList,
  SpecsPanel,
} from "@/components/fiche-sections";
import { Narrative } from "@/components/narrative";
import { SectionMarker } from "@/components/primitives";
import { SystemSchematic } from "@/components/system-schematic";
import { RegistrationMarks } from "@/components/registration-marks";
import { Stamp } from "@/components/stamp";
import { ScoreProfile } from "@/components/score-profile";

export function generateStaticParams() {
  return getSystemSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const system = getSystem(slug);
  if (!system) return { title: "Système introuvable" };
  return { title: system.name, description: system.tagline };
}

export default async function SystemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const system = getSystem(slug);
  if (!system) notFound();

  const identity = [
    { label: "Pays d'origine", value: `${system.flag} ${system.country}` },
    { label: "Constructeur", value: system.manufacturer },
    { label: "Classe", value: system.classLabel },
    { label: "Mise en service", value: system.introduced ?? "—" },
    { label: "Statut", value: system.status },
  ];

  return (
    <article className="mx-auto max-w-[1100px] px-5 py-10">
      <Link
        href="/"
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
      >
        ← Tous les systèmes
      </Link>

      {/* Couverture de dossier */}
      <header className="reveal relative mt-5 border border-line-bright bg-panel">
        <RegistrationMarks />
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-2.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            {system.reference}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            Dossier système · Mise à jour {system.updated}
          </span>
        </div>

        <div className="grid md:grid-cols-[300px_1fr]">
          <div className="flex items-center justify-center border-b border-line p-8 md:border-b-0 md:border-r">
            <SystemSchematic
              slug={system.slug}
              className="h-52 w-52 text-accent"
            />
          </div>
          <div className="p-7">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-dim">
              {system.classLabel}
            </span>
            <h1 className="mt-3 font-serif text-5xl leading-[0.98] tracking-tight text-ink sm:text-6xl">
              {system.name}
            </h1>
            {system.designation ? (
              <p className="mt-3 font-mono text-sm text-ink-faint">
                {system.designation}
              </p>
            ) : null}
            <p className="mt-5 max-w-xl font-serif text-xl italic leading-snug text-ink-dim">
              {system.tagline}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {system.acquisitionModes.map((mode, i) => (
                <Stamp key={mode} tone="ink" rotate={i % 2 === 0 ? -3 : 2}>
                  {MODE_LABELS[mode].short}
                </Stamp>
              ))}
              <Stamp tone="accent" rotate={3}>
                OSINT
              </Stamp>
            </div>
          </div>
        </div>

        <dl className="grid border-t border-line sm:grid-cols-3 lg:grid-cols-5">
          {identity.map((row, i) => (
            <div
              key={row.label}
              className={`border-line px-4 py-3 ${
                i < identity.length - 1 ? "border-b sm:border-b-0 sm:border-r" : ""
              }`}
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                {row.label}
              </dt>
              <dd className="mt-1 font-mono text-xs text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="mt-16">
        <SectionMarker index="01" label="Résumé exécutif" />
        <Narrative text={system.summary} className="mt-6 max-w-3xl" />
      </section>

      <section className="mt-16">
        <SectionMarker
          index="02"
          label="Lecture rapide"
          blurb="Ce qu'il faut retenir avant d'entrer dans le détail."
        />
        <div className="mt-6">
          <EditorialTriptych editorial={system.editorial} />
        </div>
      </section>

      <div className="mt-16 space-y-12">
        {system.bricks.map((brick, i) => (
          <BrickSection
            key={brick.key}
            brick={brick}
            index={String(i + 3).padStart(2, "0")}
          />
        ))}
      </div>

      <section className="mt-16">
        <SectionMarker
          index="08"
          label="Évaluation"
          blurb="Six paliers, de A (excellent) à E (critique). Chacun est argumenté — aucun n'est un score chiffré."
        />
        <div className="mt-6 border border-line bg-panel p-6">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            Profil d'évaluation
          </p>
          <ScoreProfile scores={system.scores} />
        </div>
        <div className="mt-4">
          <ScoreGrid scores={system.scores} />
        </div>
      </section>

      {system.editorial.analystNote ? (
        <section className="mt-16">
          <SectionMarker index="09" label="Note d'analyste" />
          <div className="mt-6">
            <AnalystNote note={system.editorial.analystNote} />
          </div>
        </section>
      ) : null}

      <section className="mt-16">
        <SectionMarker
          index="10"
          label="Caractéristiques"
          blurb="Données techniques de référence — en appui de l'analyse, non comme finalité."
        />
        <div className="mt-6">
          <SpecsPanel specs={system.keySpecs} />
        </div>
      </section>

      <section className="mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <SectionMarker index="11" label="Opérateurs" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {system.operators.map((operator) => (
              <li
                key={operator}
                className="border border-line px-2.5 py-1 font-mono text-xs text-ink-dim"
              >
                {operator}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionMarker index="12" label="Théâtres d'emploi" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {system.theatres.map((theatre) => (
              <li
                key={theatre}
                className="border border-line px-2.5 py-1 font-mono text-xs text-ink-dim"
              >
                {theatre}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="13"
          label="Sources"
          blurb="Chaque source est notée de A (fiable) à D (douteuse). Les données restent des estimations open source."
        />
        <div className="mt-6">
          <SourceList sources={system.sources} />
        </div>
      </section>

      <nav className="mt-16 flex flex-wrap gap-6 border-t border-line pt-6">
        <Link
          href="/comparateur"
          className="font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
        >
          Comparer ce système →
        </Link>
        <Link
          href="/methodologie"
          className="font-mono text-xs uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
        >
          Comment lire ces données ?
        </Link>
      </nav>
    </article>
  );
}
