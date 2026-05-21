import Link from "next/link";
import { systems } from "@/data/systems";
import { BRICK_BLURBS, BRICK_LABELS, BRICK_ORDER } from "@/data/labels";
import { SystemCard } from "@/components/system-card";
import { SectionMarker } from "@/components/primitives";
import { SystemSchematic } from "@/components/system-schematic";
import { RegistrationMarks } from "@/components/registration-marks";
import { Stamp } from "@/components/stamp";
import { StatGrid, type Stat } from "@/components/stat-cards";
import { getEvidenceStats } from "@/lib/claims";

export default function Home() {
  const stats = getEvidenceStats();
  const observatory: Stat[] = [
    { label: "Systèmes documentés", value: stats.systems },
    { label: "Sources indexées", value: stats.sources },
    { label: "Affirmations tracées", value: stats.claims },
    { label: "Affirmations vérifiées", value: stats.byStatus.verifie },
  ];

  return (
    <div className="mx-auto max-w-[1180px] px-5">
      <section className="reveal py-14">
        <div className="relative border border-line-bright bg-panel">
          <RegistrationMarks />

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-6 py-2.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              Panoplie — Recueil de renseignement ouvert
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Éd. 2026 · Systèmes de défense
            </span>
          </div>

          <div className="grid lg:grid-cols-[1.55fr_1fr]">
            <div className="border-b border-line p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <h1 className="font-serif text-5xl leading-[1.03] tracking-tight text-ink sm:text-6xl">
                Un système d'armes n'est jamais un{" "}
                <span className="italic text-accent">simple achat</span>.
              </h1>
              <p className="mt-7 max-w-xl font-serif text-lg leading-relaxed text-ink-dim">
                Derrière chaque drone : un coût réel, un financement, une chaîne
                industrielle, une dépendance géopolitique, un régime d'export.
                Panoplie rend cette réalité lisible à partir de sources
                ouvertes — peu de dossiers, mais documentés et comparables.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Stamp tone="accent" rotate={-3}>
                  OSINT
                </Stamp>
                <Stamp tone="ink" rotate={2}>
                  Sources ouvertes
                </Stamp>
                <Stamp tone="dim" rotate={-1}>
                  Analyse — pas d'usage opérationnel
                </Stamp>
              </div>
              <div className="mt-9">
                <Link
                  href="#catalogue"
                  className="inline-flex h-11 items-center border border-accent px-5 font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-bg"
                >
                  Ouvrir le recueil →
                </Link>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                Sommaire — {systems.length} dossiers
              </p>
              <ul className="mt-3 border-y border-line">
                {systems.map((system) => (
                  <li key={system.slug} className="border-b border-line last:border-0">
                    <Link
                      href={`/systemes/${system.slug}`}
                      className="group flex items-center gap-4 py-3"
                    >
                      <SystemSchematic
                        slug={system.slug}
                        className="h-12 w-12 shrink-0 text-ink-faint transition-colors group-hover:text-accent"
                      />
                      <span className="flex-1">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                          {system.reference}
                        </span>
                        <span className="block font-serif text-lg text-ink transition-colors group-hover:text-accent">
                          {system.name}
                        </span>
                        <span className="block font-mono text-[10px] text-ink-faint">
                          {system.classLabel}
                        </span>
                      </span>
                      <span className="font-mono text-ink-faint transition-colors group-hover:text-accent">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line py-14">
        <SectionMarker
          index="—"
          label="L'observatoire en chiffres"
          blurb="Compteurs dérivés du registre de preuves — aucun n'est saisi à la main."
        />
        <div className="mt-8">
          <StatGrid stats={observatory} />
        </div>
        <div className="mt-5">
          <Link
            href="/console"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
          >
            Ouvrir la Console OSINT →
          </Link>
        </div>
      </section>

      <section className="border-t border-line py-16">
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

      <section id="catalogue" className="scroll-mt-24 border-t border-line py-16">
        <SectionMarker
          index="—"
          label="Catalogue des systèmes"
          blurb={`${systems.length} systèmes contrastés — du drone MALE à la munition rôdeuse, du HALE stratégique au drone naval.`}
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {systems.map((system) => (
            <SystemCard key={system.slug} system={system} />
          ))}
        </div>
      </section>

      <section className="border-t border-line py-16">
        <div className="relative border border-line bg-panel p-8 sm:p-10">
          <RegistrationMarks />
          <div className="grid gap-8 md:grid-cols-[1.6fr_1fr] md:items-center">
            <div>
              <h2 className="font-serif text-3xl leading-tight text-ink">
                Comparer vaut mieux que décrire.
              </h2>
              <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-ink-dim">
                Le comparateur confronte deux à trois systèmes côte à côte —
                identité, paliers d'évaluation et lecture critique. La page
                Méthodologie explique comment les paliers sont attribués et
                comment lire le niveau de confiance des données.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/comparateur"
                className="inline-flex h-11 items-center justify-center border border-accent px-5 font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-bg"
              >
                Ouvrir le comparateur →
              </Link>
              <Link
                href="/methodologie"
                className="inline-flex h-11 items-center justify-center border border-line-bright px-5 font-mono text-xs uppercase tracking-[0.16em] text-ink-dim transition-colors hover:border-accent hover:text-accent"
              >
                Lire la méthodologie
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
