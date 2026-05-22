import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import { SectionMarker } from "@/components/primitives";
import { Narrative } from "@/components/narrative";
import { GenerationScale } from "@/components/generation-scale";
import { SystemSchematic } from "@/components/system-schematic";
import { RegistrationMarks } from "@/components/registration-marks";
import { Stamp } from "@/components/stamp";

export const metadata: Metadata = {
  title: "Aviation de combat",
  description:
    "Le domaine des avions de combat — générations 4.5, 5e et 6e, couches de coût, chaîne industrielle, versions et standards, régimes d'export.",
};

// Les couches de coût d'un chasseur — le prix unitaire ne dit presque rien.
const COST_LAYERS: [string, string][] = [
  [
    "Coût flyaway",
    "La cellule seule — parfois citée sans moteur ni équipements fournis par l'État.",
  ],
  [
    "Coût d'acquisition unitaire",
    "L'avion complet : moteur, capteurs, équipements gouvernementaux inclus.",
  ],
  [
    "Coût de programme",
    "Recherche, essais, infrastructures et outillage de production amortis.",
  ],
  [
    "MCO / sustainment",
    "Disponibilité, pièces, main-d'œuvre, logiciel, moteur — le poste le plus lourd dans la durée.",
  ],
  [
    "Coût d'écosystème",
    "Simulateurs, formation, armement, bases, hangars, sécurité.",
  ],
  [
    "Coût politique",
    "Dépendance fournisseur, restrictions d'export, autorisations d'emploi.",
  ],
];

// Chaîne industrielle d'un chasseur — chaque maillon engage une dépendance.
const SUPPLY_CHAIN = [
  "Cellule",
  "Moteur",
  "Radar AESA",
  "Guerre électronique",
  "Calculateur de mission",
  "Armements",
  "Datalinks",
  "MCO",
  "Standards logiciels",
];

const EXPORT_TIERS: [string, string][] = [
  [
    "Export réel",
    "Rafale, F-35, Eurofighter, Gripen — vendus et livrés à des forces étrangères.",
  ],
  [
    "Export interdit",
    "F-22 — réservé à l'US Air Force, flotte fermée, jamais exporté.",
  ],
  [
    "Export restreint, politique",
    "F-35 et Eurofighter selon les pays — soumis à autorisation et arbitrage.",
  ],
  [
    "Export émergent ou incertain",
    "KAAN — accord d'export annoncé avant la fin du développement ; J-35, perspectives ouvertes.",
  ],
];

export default function AviationCombatPage() {
  const dossiers = systems.filter((s) => s.category === "combat-aircraft");

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12">
      <header className="reveal">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            Domaine transversal
          </p>
          <Stamp tone="ink" rotate={-3}>
            PNP-AC
          </Stamp>
        </div>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink sm:text-6xl">
          Aviation de combat
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Chasseurs 4.5e, 5e et 6e génération · versions navales · guerre
          électronique. Un domaine que Panoplie lit à la même grille que les
          drones — coût, finance, supply chain, géopolitique, export.
        </p>
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-4 font-serif text-base italic leading-relaxed text-ink-dim">
          Un avion de chasse moderne n'est pas une cellule volante : c'est un
          écosystème industriel, logiciel, logistique, financier et
          géopolitique. C'est lui que Panoplie analyse — pas un classement du
          « meilleur avion ».
        </p>
      </header>

      <section className="mt-16">
        <SectionMarker
          index="01"
          label="Comprendre les générations"
          blurb="« 4.5 », « 5e », « 6e » ne sont pas des notes — ce sont des architectures."
        />
        <p className="mt-6 max-w-3xl font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          La catégorie « 4.5 » n'est pas une norme officielle : c'est une
          convention analytique, utile mais variable selon les industriels. La
          5e génération se définit par la furtivité conçue dès l'origine ; la
          6e n'est plus un avion isolé, mais une famille de systèmes.
        </p>
        <div className="mt-6">
          <GenerationScale />
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="02"
          label="Lire un chasseur, pas une cellule"
          blurb="L'angle de Panoplie — et la distinction qui le porte."
        />
        <Narrative
          className="mt-6 max-w-3xl"
          text={
            "Panoplie ne désigne pas le meilleur avion du monde — ce serait fragile et peu utile. La plateforme compare les chasseurs comme des architectures de puissance aérienne : coût, logiciel, souveraineté, dépendance moteur, exportabilité, version navale, maintien en condition, capteurs, armements et maturité réelle.\n\nChaque fiche distingue deux lectures de la génération : celle revendiquée — par l'industriel ou la nation — et celle évaluée par Panoplie. L'écart entre les deux, quand il existe, est lui-même une information."
          }
        />
      </section>

      <section className="mt-16">
        <SectionMarker
          index="03"
          label="Les couches de coût"
          blurb="Pour un chasseur, le prix unitaire ne dit presque rien."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {COST_LAYERS.map(([term, detail]) => (
            <div key={term} className="bg-panel p-5">
              <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                {term}
              </h3>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="04"
          label="La chaîne industrielle"
          blurb="Un avion exporté n'est jamais seulement « livré »."
        />
        <p className="mt-6 max-w-3xl font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          Chaque maillon engage une dépendance durable — moteur, logiciel,
          pièces, autorisations d'emploi. C'est cette relation, autant que
          l'avion, qui se vend ou se refuse.
        </p>
        <ol className="mt-6 flex flex-wrap gap-2">
          {SUPPLY_CHAIN.map((link, i) => (
            <li
              key={link}
              className="flex items-center gap-2 border border-line bg-surface px-3 py-2 font-mono text-[11px] text-ink-dim"
            >
              <span className="text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              {link}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="05"
          label="Versions, standards et navalisation"
          blurb="Une fiche avion sans ses versions est trompeuse."
        />
        <Narrative
          className="mt-6 max-w-3xl"
          text={
            "Un même nom recouvre des avions très différents : Rafale C, B ou M ; standards F3R, F4, F5 ; F-35 A, B ou C ; blocs logiciels TR-3, Block 4. Chaque fiche du domaine porte donc un bloc « Versions & standards ».\n\nLa navalisation — appontage CATOBAR ou décollage court STOVL — est un autre marqueur structurant : elle sépare les avions des marines de ceux des seules armées de l'air, et conditionne train d'atterrissage, structure et coût."
          }
        />
      </section>

      <section className="mt-16">
        <SectionMarker
          index="06"
          label="Régimes d'export"
          blurb="De l'export libre au refus de principe — chaque avion a son régime."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {EXPORT_TIERS.map(([term, detail]) => (
            <div key={term} className="bg-panel p-5">
              <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                {term}
              </h3>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="07"
          label="Les dossiers du domaine"
          blurb={`${dossiers.length} chasseurs documentés — France, États-Unis, Europe, Suède, Chine, Turquie.`}
        />
        {dossiers.length > 0 ? (
          <ul className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
            {dossiers.map((system) => (
              <li key={system.slug} className="bg-panel">
                <Link
                  href={`/systemes/${system.slug}`}
                  className="group flex items-center gap-4 p-5"
                >
                  <SystemSchematic
                    slug={system.slug}
                    className="h-14 w-14 shrink-0 text-ink-faint transition-colors group-hover:text-accent"
                  />
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
            Lire ces dossiers avec la bonne grille
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-ink-dim">
            Les paliers d'évaluation et la confiance des données obéissent aux
            mêmes règles que pour les drones. Pour les avions, la prudence
            s'impose sur les plateformes les moins documentées — la confiance
            des données le reflète sans complaisance.
          </p>
          <nav className="mt-5 flex flex-wrap gap-6">
            <Link
              href="/comparateur"
              className="font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
            >
              Comparer les systèmes →
            </Link>
            <Link
              href="/methodologie"
              className="font-mono text-xs uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
            >
              Lire la méthodologie
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
