import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import { SectionMarker } from "@/components/primitives";
import { Narrative } from "@/components/narrative";
import { LegalNote } from "@/components/fiche-sections";
import { LayeredDefenseDiagram } from "@/components/layered-defense-diagram";
import { SystemSchematic } from "@/components/system-schematic";
import { RegistrationMarks } from "@/components/registration-marks";
import { Stamp } from "@/components/stamp";

export const metadata: Metadata = {
  title: "Énergie dirigée",
  description:
    "Le domaine des lasers haute énergie — missions C-UAS, C-RAM et SHORAD, promesse de coût, contraintes physiques et cadre juridique.",
};

// Chaîne industrielle d'un système laser — chaque maillon conditionne le suivant.
const SUPPLY_CHAIN = [
  "Source laser",
  "Combinaison · qualité de faisceau",
  "Beam director",
  "Optiques",
  "Capteurs de poursuite",
  "C2 · logiciel",
  "Alimentation",
  "Refroidissement",
  "Plateforme",
];

const PHYSICAL_LIMITS: [string, string][] = [
  [
    "Atmosphère",
    "Pluie, brouillard, fumée, poussière et sel marin diffusent et absorbent le faisceau.",
  ],
  [
    "Ligne de visée",
    "Le laser exige une cible visible et suivie sans interruption.",
  ],
  [
    "Dwell time",
    "Le faisceau doit rester sur la cible le temps de la neutraliser — d'autant plus longtemps que la portée croît.",
  ],
  [
    "Refroidissement",
    "Il borne la cadence de tir et complique l'intégration sur une plateforme mobile.",
  ],
  [
    "Énergie disponible",
    "La puissance dépend de ce que le véhicule, le navire ou le site peut fournir.",
  ],
  [
    "Thermal blooming",
    "À forte puissance, l'échauffement de l'air traversé dégrade le faisceau lui-même.",
  ],
];

const LEGAL_NOTE =
  "Le Protocole IV de la Convention sur certaines armes classiques interdit les armes laser spécifiquement conçues pour provoquer une cécité permanente. Les systèmes documentés ici visent des drones, des roquettes ou des capteurs — non des personnels. Le CICR rappelle néanmoins l'obligation de précaution pour éviter d'aveugler lors de l'emploi de tout système laser.";

export default function EnergieDirigeePage() {
  const dossiers = systems.filter((s) => s.category === "directed-energy");

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12">
      <header className="reveal">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            Domaine transversal
          </p>
          <Stamp tone="ink" rotate={-3}>
            PNP-DE
          </Stamp>
        </div>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink sm:text-6xl">
          Énergie dirigée
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Lasers haute énergie · C-UAS · C-RAM · SHORAD · défense multicouche.
          Un domaine que Panoplie ouvre avec huit dossiers, lus à la même grille
          que les drones — coût, finance, supply chain, géopolitique, export.
        </p>
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-4 font-serif text-base italic leading-relaxed text-ink-dim">
          Les lasers ne remplacent ni les missiles ni les canons. Ce sont des
          effecteurs de couche basse — utiles contre drones, roquettes et
          menaces saturantes, à coût marginal très faible, mais sous de fortes
          contraintes physiques, industrielles et d'intégration.
        </p>
      </header>

      <section className="mt-16">
        <SectionMarker
          index="01"
          label="Ce que recouvre le domaine"
          blurb="Lasers, micro-ondes — et un vocabulaire de missions."
        />
        <Narrative
          className="mt-6 max-w-3xl"
          text={
            "Le domaine rassemble les lasers haute énergie (HEL) et, distinctes, les micro-ondes haute puissance (HPM). Les huit premiers dossiers de Panoplie sont tous des lasers.\n\nLeur emploi se pense en missions : lutte anti-drone (C-UAS), lutte contre roquettes, artillerie et mortiers (C-RAM), défense aérienne courte portée (SHORAD). À chaque fois, le laser occupe la couche basse de la défense aérienne — il complète les canons et les missiles, il ne les remplace pas."
          }
        />
      </section>

      <section className="mt-16">
        <SectionMarker
          index="02"
          label="La promesse et les pièges"
          blurb="Pourquoi le laser séduit — et pourquoi il faut s'en méfier."
        />
        <Narrative
          className="mt-6 max-w-3xl"
          text={
            "La promesse tient en deux idées. Le coût marginal par tir est très faible — quelques unités d'énergie. Et le magazine est profond : on tire tant que l'énergie et le refroidissement le permettent. Face à des drones conçus pour être nombreux et bon marché, cela inverse le ratio d'échange de coût.\n\nLe piège serait d'en conclure à une arme miracle. Un laser dépend de la météo, de la ligne de visée, de l'énergie disponible et de son intégration au commandement. Et le coût par tir ne dit rien du coût du système ni de son intégration — souvent l'essentiel de la facture. Panoplie tient les deux bouts : ni discours d'arme miracle, ni rejet d'une technologie qui devient progressivement opérationnelle."
          }
        />
      </section>

      <section className="mt-16">
        <SectionMarker
          index="03"
          label="La défense multicouche"
          blurb="Le laser n'est qu'une couche : la menace est détectée, classée, puis confiée à l'effecteur le mieux adapté."
        />
        <div className="mt-6 max-w-2xl">
          <LayeredDefenseDiagram />
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="04"
          label="La chaîne industrielle du laser"
          blurb="Un système laser n'est pas qu'une source de lumière."
        />
        <p className="mt-6 max-w-3xl font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          C'est une chaîne où chaque maillon conditionne les autres. La plupart
          des programmes butent non sur la source laser, mais sur son
          intégration — refroidissement, alimentation, conduite de tir.
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
          label="Les limites physiques"
          blurb="Ce qui borne tout effecteur à énergie dirigée — repris sur chaque fiche."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {PHYSICAL_LIMITS.map(([term, detail]) => (
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
        <SectionMarker index="06" label="Cadre juridique" />
        <div className="mt-6">
          <LegalNote note={LEGAL_NOTE} />
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="07"
          label="Les dossiers du domaine"
          blurb={`${dossiers.length} systèmes documentés — France, Israël, Royaume-Uni, États-Unis, Allemagne.`}
        />
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
      </section>

      <section className="mt-16">
        <div className="relative border border-line bg-panel p-8">
          <RegistrationMarks />
          <h2 className="font-serif text-2xl leading-tight text-ink">
            Lire ces dossiers avec la bonne grille
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-ink-dim">
            Les paliers d'évaluation et la confiance des données obéissent aux
            mêmes règles que pour les drones. Pour les lasers, la prudence sur
            les annonces industrielles est de mise — la différence entre testé,
            livré et opérationnel est critique.
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
