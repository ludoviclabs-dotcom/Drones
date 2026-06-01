import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import {
  NAVAL_VESSEL_BLURBS,
  NAVAL_VESSEL_LABELS,
} from "@/data/labels";
import type { NavalVesselClass } from "@/data/types";
import { LegalNote } from "@/components/fiche-sections";
import { Narrative } from "@/components/narrative";
import { SectionMarker } from "@/components/primitives";
import { RegistrationMarks } from "@/components/registration-marks";
import { Stamp } from "@/components/stamp";
import { SystemSchematic } from "@/components/system-schematic";

export const metadata: Metadata = {
  title: "Bâtiments navals",
  description:
    "Le domaine des bâtiments navals - porte-avions, frégates, destroyers, corvettes, sous-marins, patrouilleurs et plateformes amphibies, lus comme des architectures de mission.",
};

const CLASS_ORDER: NavalVesselClass[] = [
  "porte-avions",
  "destroyer",
  "fregate",
  "corvette",
  "sous-marin",
  "patrouilleur",
  "amphibie",
];

const MVP_FLEETS = [
  {
    country: "France",
    flag: "🇫🇷",
    classes: "Charles de Gaulle, FREMM, FDI, Gowind, Scorpène, PHA Mistral",
    architecture: "SETIS, Sea Fire, Herakles, CAPTAS, Aster, Exocet, MdCN",
    purpose: "Socle souverain et export européen",
  },
  {
    country: "États-Unis",
    flag: "🇺🇸",
    classes: "Gerald R. Ford, Arleigh Burke Flight III, Virginia Block V",
    architecture: "Aegis, SPY-6, Tomahawk, Standard Missile, VPM, propulsion nucléaire",
    purpose: "Référence haute intensité et BMD",
  },
  {
    country: "Royaume-Uni",
    flag: "🇬🇧",
    classes: "Queen Elizabeth, Type 26 City class",
    architecture: "PAAMS/CMS-1, Artisan, S1850M, Sea Ceptor, F-35B, mission bay",
    purpose: "Groupe aéronaval STOVL et escorte ASM",
  },
  {
    country: "Italie",
    flag: "🇮🇹",
    classes: "FREMM Carlo Bergamini",
    architecture: "SAAM-ESD, Kronos, CAPTAS-4, Aster, Teseo, CODLAG",
    purpose: "Variante européenne distincte de la FREMM française",
  },
  {
    country: "Espagne",
    flag: "🇪🇸",
    classes: "F110 Bonifaz",
    architecture: "SCOMBA, IAFCL, SPY-7, CAPTAS-4, Mk 41, NSM",
    purpose: "Hybridation souveraineté CMS et briques américaines",
  },
];

const ARCHITECTURE_LAYERS: [string, string][] = [
  [
    "Plateforme",
    "Déplacement, propulsion, endurance, équipage, aviation embarquée, mission bay et signature.",
  ],
  [
    "Système de combat",
    "CMS, baseline, radar principal, sonars, guerre électronique, liaisons tactiques et C2.",
  ],
  [
    "Effecteurs",
    "VLS, missiles surface-air, anti-navire, anti-sous-marin, canons, leurres, aviation et drones.",
  ],
  [
    "Soutien",
    "MCO, IPER, chantiers, fournisseurs critiques, stocks, export et dépendances de réexport.",
  ],
];

const NAVAL_SUPPLY_CHAIN = [
  {
    link: "Coque / chantier",
    suppliers: "Naval Group, Fincantieri, BAE Systems, Navantia, HII",
  },
  {
    link: "Propulsion",
    suppliers: "Nucléaire naval, CODLAG/CODLOG, IEP, diesel-électrique, AIP",
  },
  {
    link: "CMS / C2",
    suppliers: "SETIS, Aegis, SCOMBA, TACTICOS, PAAMS/CMS-1, COMBATSS-21",
  },
  {
    link: "Radar",
    suppliers: "Sea Fire, SPY-6, SPY-7, Kronos, Artisan, S1850M",
  },
  {
    link: "Sonar",
    suppliers: "CAPTAS-4, CAPTAS-4 Compact, sonar de coque, VDS, arrays remorqués",
  },
  {
    link: "Effecteurs",
    suppliers: "Aster, ESSM, SM-2/SM-6, Tomahawk, Exocet, NSM, Teseo, MU90",
  },
  {
    link: "Export / ITAR",
    suppliers: "FMS, DCS, licences missiles, capteurs américains, clauses de réexport",
  },
  {
    link: "MCO naval",
    suppliers: "Arrêts techniques, refontes, logiciels CMS, pièces propulsion, stocks missiles",
  },
];

const LEGAL_NOTE =
  "Les fiches navales restent une lecture OSINT stratégique. Elles décrivent des capacités publiques, des coûts, des dépendances et des architectures industrielles ; elles ne fournissent ni plans, ni paramètres sensibles, ni emploi tactique exploitable.";

export default function BatimentsNavalsPage() {
  const dossiers = systems.filter((s) => s.category === "naval-vessel");
  const countByClass = (navalClass: NavalVesselClass) =>
    dossiers.filter((s) => s.navalVesselClass === navalClass).length;

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12">
      <header className="reveal">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            Domaine transversal
          </p>
          <Stamp tone="ink" rotate={-3}>
            PNP-NS
          </Stamp>
        </div>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink sm:text-6xl">
          Bâtiments navals
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Porte-avions, destroyers, frégates, corvettes, sous-marins,
          patrouilleurs et plateformes amphibies. Le domaine naval de Panoplie
          lit chaque bâtiment comme une architecture de mission : capteurs,
          système de combat, effecteurs, réseau, soutien et dépendances
          industrielles.
        </p>
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-4 font-serif text-base italic leading-relaxed text-ink-dim">
          Une coque ne suffit pas à comprendre un navire de combat moderne. La
          valeur réelle vient de l'intégration entre plateforme, CMS, capteurs,
          armements, liaisons, MCO et rôle dans une force navale.
        </p>
      </header>

      <section className="mt-16">
        <SectionMarker
          index="01"
          label="Familles de plateformes"
          blurb="La taxonomie navale croise classe de coque, mission dominante et architecture de combat."
        />
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {CLASS_ORDER.map((navalClass) => {
            const count = countByClass(navalClass);
            return (
              <div key={navalClass} className="bg-panel p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-ink">
                    {NAVAL_VESSEL_LABELS[navalClass]}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {count} {count > 1 ? "dossiers" : "dossier"}
                  </span>
                </div>
                <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                  {NAVAL_VESSEL_BLURBS[navalClass]}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="02"
          label="Noyau multinational MVP"
          blurb="Le rapport ajoute un socle France, États-Unis, Royaume-Uni, Italie et Espagne pour comparer les architectures, pas seulement les tonnages."
        />
        <div className="mt-6 grid gap-px border border-line bg-line">
          {MVP_FLEETS.map((fleet) => (
            <article
              key={fleet.country}
              className="grid gap-px bg-line md:grid-cols-[160px_1fr_1fr]"
            >
              <div className="bg-panel p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                  {fleet.flag} {fleet.country}
                </p>
                <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                  {fleet.purpose}
                </p>
              </div>
              <div className="bg-panel p-5">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  Classes intégrées
                </h3>
                <p className="mt-2 font-serif text-sm leading-relaxed text-ink">
                  {fleet.classes}
                </p>
              </div>
              <div className="bg-panel p-5">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  Briques d'architecture
                </h3>
                <p className="mt-2 font-serif text-sm leading-relaxed text-ink">
                  {fleet.architecture}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="03"
          label="Plateforme -> mission -> réseau"
          blurb="Le bâtiment n'est qu'un noeud visible d'un système plus vaste."
        />
        <Narrative
          className="mt-6 max-w-3xl"
          text={
            "Panoplie sépare volontairement trois niveaux souvent mélangés. La plateforme porte les contraintes physiques : propulsion, déplacement, équipage, endurance, aviation embarquée. La mission porte l'intégration des capteurs, du CMS, des effecteurs et de la guerre électronique. Le réseau porte les liaisons, le C2, l'interopérabilité et la place du navire dans un groupe aéronaval, amphibie ou de surveillance.\n\nC'est cette lecture qui permet de comparer une FREMM ASM, une FDI compacte, une F110 espagnole, une Type 26 britannique ou un destroyer Aegis : pas selon un prestige de tonnage, mais selon le rapport entre missions, coûts, soutien et dépendances."
          }
        />
      </section>

      <section className="mt-16">
        <SectionMarker
          index="04"
          label="Quatre couches d'analyse"
          blurb="Les fiches navales reprennent la grille Panoplie et lui ajoutent un profil structuré d'architecture."
        />
        <div className="mt-6 grid gap-px border border-line bg-line md:grid-cols-2">
          {ARCHITECTURE_LAYERS.map(([term, detail]) => (
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
          index="05"
          label="Chaîne navale critique"
          blurb="Les dépendances se cachent souvent dans le CMS, le sonar, la propulsion, les missiles ou le soutien logiciel."
        />
        <p className="mt-6 max-w-3xl font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          La base industrielle navale assemble des objets très différents :
          acier, propulsion, logiciels, capteurs, missiles, intégration et
          soutien long. Pour Panoplie, un bâtiment naval est donc aussi une
          carte de dépendances, pas seulement une fiche technique.
        </p>
        <ol className="mt-6 grid gap-px border border-line bg-line md:grid-cols-2">
          {NAVAL_SUPPLY_CHAIN.map((item, i) => (
            <li key={item.link} className="bg-panel p-4">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink">
                  {item.link}
                </h3>
              </div>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                {item.suppliers}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="06"
          label="Cadre de prudence"
          blurb="Les performances fines restent rarement publiques, surtout sous l'eau, en guerre électronique et sur les signatures."
        />
        <div className="mt-6">
          <LegalNote note={LEGAL_NOTE} />
        </div>
      </section>

      <section className="mt-16">
        <SectionMarker
          index="07"
          label="Les dossiers du domaine"
          blurb={`${dossiers.length} bâtiments documentés - projection aéronavale, frégates de premier rang, destroyers Aegis, corvettes export, sous-marins, patrouille et amphibie.`}
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
            Les cinq briques Panoplie restent inchangées : coût, finance, supply
            chain, géopolitique et export. Le domaine naval ajoute une attention
            plus forte à la plateforme, au CMS, aux capteurs, au MCO, aux
            contraintes de réexport et aux limites de confiance des données.
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
