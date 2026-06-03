import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import {
  COMBAT_SYSTEM_BLURBS,
  COMBAT_SYSTEM_LABELS,
  COMBAT_SYSTEM_ORDER,
} from "@/data/labels";
import type { CombatSystemClass } from "@/data/types";
import { DomainEmblem } from "@/components/domain-emblem";
import { SectionMarker } from "@/components/primitives";
import { RegistrationMarks } from "@/components/registration-marks";
import { Stamp } from "@/components/stamp";

export const metadata: Metadata = {
  alternates: { canonical: "/systemes-combat" },
  title: "Systèmes de combat & C2",
  description:
    "Le domaine des systèmes de combat et de commandement — Aegis, TACTICOS, PAAMS / Sea Viper, SETIS, IBCS. Le cerveau des plateformes et de la défense aérienne intégrée, lu par coût, dépendance et interopérabilité.",
};

export default function SystemesCombatPage() {
  const dossiers = systems.filter((s) => s.category === "combat-system");
  const countByClass = (family: CombatSystemClass) =>
    dossiers.filter((s) => s.combatSystemClass === family).length;

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12">
      <header className="reveal">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            Domaine transversal
          </p>
          <Stamp tone="ink" rotate={-3}>
            PNP-C2
          </Stamp>
        </div>
        <div className="mt-4 flex items-start gap-5">
          <DomainEmblem
            category="combat-system"
            className="hidden h-16 w-16 shrink-0 text-accent sm:block"
          />
          <div>
            <h1 className="font-serif text-5xl tracking-tight text-ink sm:text-6xl">
              Systèmes de combat & C2
            </h1>
            <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
              Sous les capteurs et les missiles, c'est le système de combat qui
              décide : fusion de pistes, conduite de tir, priorisation des
              menaces, partage en réseau. Aegis, TACTICOS, PAAMS, SETIS et IBCS
              sont le vrai centre de gravité d'une plateforme ou d'une défense
              aérienne intégrée.
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-4 font-serif text-base italic leading-relaxed text-ink-dim">
          Ces systèmes sont aussi des verrous d'interopérabilité et de
          souveraineté : choisir un CMS, c'est choisir un écosystème de
          capteurs, d'effecteurs et d'alliances.
        </p>
      </header>

      <section className="mt-16">
        <SectionMarker
          index="01"
          label="Familles de systèmes"
          blurb="Du système de combat naval au commandement de la défense aérienne intégrée — quatre familles, une même fonction : relier capteurs et effecteurs."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {COMBAT_SYSTEM_ORDER.map((family) => {
            const count = countByClass(family);
            return (
              <div key={family} className="bg-panel p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                    {COMBAT_SYSTEM_LABELS[family]}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {count} {count > 1 ? "dossiers" : "dossier"}
                  </span>
                </div>
                <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                  {COMBAT_SYSTEM_BLURBS[family]}
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
          blurb={`${dossiers.length} systèmes de combat et de commandement documentés — du CMS naval au C2 IAMD terrestre.`}
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
            Le système de combat, vrai centre de gravité
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-ink-dim">
            On compare souvent des radars et des missiles ; on oublie le logiciel
            qui les fait travailler ensemble. Un CMS ou un C2 IAMD conditionne la
            survivabilité, l'interopérabilité et la dépendance — et donc la
            lecture industrielle et géopolitique.
          </p>
          <nav className="mt-5 flex flex-wrap gap-6">
            <Link
              href="/batiments-navals"
              className="font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
            >
              Voir les plateformes navales →
            </Link>
            <Link
              href="/radars/architecture"
              className="font-mono text-xs uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
            >
              Architecture IAMD
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
