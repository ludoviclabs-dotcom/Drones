import type { Metadata } from "next";
import Link from "next/link";
import { RafaleExperience } from "@/components/hud/rafale/RafaleExperience";
import { HudBreadcrumb } from "@/components/hud/hud-breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { hudBoardBySlug } from "@/data/hud/boards";
import { RAFALE_SCENARIOS, RAFALE_SEQUENCE_STATES } from "@/data/hud/rafale";
import { RAFALE_INSPECTABLES } from "@/data/hud/rafale-inspection";
import { hudBreadcrumbLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Rafale F4 — chasseur et tir Meteor en 3D",
  description:
    "Planche technique 3D illustrative d’un Rafale C au standard F4 et de ses emports : capteurs, séparation et départ illustratifs d’un Meteor, d’un MICA IR ou d’un AASM Hammer, sans donnée opérationnelle.",
  alternates: { canonical: "/hud/rafale-f4-meteor" },
};

const EDITORIAL_LIMITS = [
  "Représentation illustrative des formes extérieures visibles, sur gabarits publics.",
  "Aucune télémétrie, aucun ciblage, aucune aide à la décision.",
  "Départ dans l’axe de l’avion seulement : aucune trajectoire ni balistique.",
  "Tempos, ralenti, sillages et configurations d’emport : choix de lecture.",
] as const;

type SourceRef = {
  source: string;
  url: string;
};

type Milestone = SourceRef & { date: string; text: string };

type ScenarioNote = {
  title: string;
  text: string;
  sources: readonly SourceRef[];
};

const DASSAULT_KIT_2023: SourceRef = {
  source: "Dassault Aviation",
  url: "https://www.dassault-aviation.com/wp-content/blogs.dir/1/files/2023/06/RAFALE-Dossier-de-Presse-Juin-2023-Le-Bourget.pdf",
};

const AVIATIONIST_METEOR_2021: SourceRef = {
  source: "The Aviationist",
  url: "https://theaviationist.com/2021/03/09/french-rafale-performs-first-operational-flight-with-live-meteor-beyond-visual-range-air-to-air-missiles/",
};

/** Pourquoi le Meteor n'apparaît que dans le scénario BVR. */
const SCENARIO_NOTES: readonly ScenarioNote[] = [
  {
    title: "Au-delà du contact visuel · Meteor",
    text: "Missile air-air à statoréacteur, emporté sur les deux points arrière du fuselage et séparé par éjection ; le 4 mars 2021, un Rafale B de Saint-Dizier a volé avec deux Meteor, deux MICA EM, deux MICA IR et un bidon ventral.",
    sources: [
      AVIATIONIST_METEOR_2021,
      {
        source: "MBDA",
        url: "https://www.mbda-systems.com/sites/mbda/files/2024-06/2023%20METEOR%20datasheet.pdf",
      },
    ],
  },
  {
    title: "Combat rapproché · MICA IR",
    text: "En combat rapproché, le Rafale emploie le MICA — missile d’interception, de combat et d’autodéfense, employable à vue comme au-delà, figuré ici en version infrarouge au rail de saumon — et son canon interne de 30 mm. Le Meteor, lui, est conçu pour l’engagement au-delà du contact visuel.",
    sources: [
      DASSAULT_KIT_2023,
      {
        source: "MBDA",
        url: "https://www.mbda-systems.com/products/air-dominance/mica-family/mica",
      },
    ],
  },
  {
    title: "SEAD · AASM Hammer",
    text: "La France n’aligne plus de missile antiradar depuis le retrait de l’AS.37 Martel ; le standard F5 doit retrouver cette capacité avec le STRATUS RS de MBDA, annoncé à l’horizon 2035. D’ici là, SPECTRA localise précisément les menaces sol pour les éviter ou les traiter.",
    sources: [
      {
        source: "Avions légendaires",
        url: "https://www.avionslegendaires.net/2026/04/actu/le-dassault-aviation-rafale-f5-rendra-a-la-france-la-capacite-sead/",
      },
      DASSAULT_KIT_2023,
    ],
  },
];

/** Repères publics datés, vérifiés sur la source citée. */
const MILESTONES: readonly Milestone[] = [
  {
    date: "28 avr. 2015",
    text: "Premier tir guidé réussi d’un Meteor depuis un Rafale, dans une zone sécurisée de DGA Essais de missiles, à Biscarrosse.",
    source: "Opex360",
    url: "https://www.opex360.com/2015/04/30/premier-tir-guide-reussi-dun-missile-meteor-par-rafale/",
  },
  {
    date: "31 oct. 2018",
    text: "La DGA qualifie le standard F3-R : missile Meteor et nacelle de désignation Talios.",
    source: "Opex360",
    url: "https://www.opex360.com/2018/11/09/la-direction-generale-de-larmement-a-prononce-la-qualification-du-standard-f3-r-du-rafale/",
  },
  {
    date: "4 mars 2021",
    text: "Premier vol opérationnel d’un Rafale emportant des Meteor réels, depuis la base aérienne de Saint-Dizier.",
    ...AVIATIONIST_METEOR_2021,
  },
  {
    date: "13 mars 2023",
    text: "La DGA qualifie le standard F4.1 : viseur de casque Scorpion, AASM de 1 000 kg, nouvelles fonctions pour Talios, l’OSF et le RBE2.",
    source: "Ministère des Armées",
    url: "https://www.defense.gouv.fr/dga/actualites/dga-qualifie-rafale-au-standard-f41",
  },
  {
    date: "12 janv. 2024",
    text: "La DGA annonce la commande de la 5ᵉ tranche : 42 Rafale monoplaces au standard F4, premier avion livré dès 2027.",
    source: "Ministère des Armées",
    url: "https://www.defense.gouv.fr/dga/actualites/dga-commande-42-rafale-larmee-lair-lespace",
  },
  {
    date: "Été 2026",
    text: "La DGA notifie les premiers contrats d’équipements du standard F5, avant son lancement en réalisation prévu fin 2026 : radar RBE2-XG, SPECTRA F5, moteur M88 T-REX, liaison IVDL.",
    source: "Ministère des Armées",
    url: "https://www.defense.gouv.fr/dga/actualites/dga-commande-premiers-travaux-amont-du-prochain-lancement-realisation-du-standard-f5-du-rafale",
  },
];

function SourceLink({ source, url }: { source: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint underline decoration-line-bright underline-offset-2 motion-safe:transition-colors hover:text-accent"
    >
      {source}
    </a>
  );
}

export default function RafaleHudPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-3 py-7 sm:px-5 sm:py-10 lg:px-7">
      <JsonLd data={hudBreadcrumbLd(hudBoardBySlug("rafale-f4-meteor"))} />
      <HudBreadcrumb current="Rafale F4" />
      <header className="mb-4 grid gap-5 border-y border-line py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            Planche technique · modélisation 3D et séquence illustrative
          </p>
          <h1 className="mt-2 max-w-4xl font-serif text-3xl leading-[1.05] text-ink sm:text-4xl lg:text-5xl">
            Rafale F4 — chasseur et tir Meteor en 3D
          </h1>
          <p className="mt-3 max-w-3xl font-serif text-base leading-relaxed text-ink-dim sm:text-lg">
            Un Rafale C au standard F4, modélisé d’après les dimensions publiées
            et des photographies publiques, avec ses emports. Six états mènent
            du vol à l’inspection, aux capteurs, puis à une séparation, un
            allumage et un départ illustratifs — Meteor au-delà du contact
            visuel, MICA IR en combat rapproché ou AASM Hammer en mission SEAD.
          </p>
        </div>

        <div className="flex items-center gap-3 border border-line bg-panel px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim">
          <span className="h-2 w-2 bg-stamp" aria-hidden="true" />
          <span>
            {RAFALE_SEQUENCE_STATES.length} états · {RAFALE_SCENARIOS.length} scénarios ·{" "}
            {RAFALE_INSPECTABLES.length} sous-ensembles
          </span>
        </div>
      </header>

      <p className="mb-3 border-l border-stamp pl-3 font-mono text-[10px] leading-relaxed text-ink-faint">
        Vue en vol, décor figuré. Les contrôles orbitaux sont disponibles au
        repos dans les états En vol, Inspection et Fin. Le réglage système
        « mouvement réduit » remplace les transitions par un passage direct à la
        pose finale, sans rien retirer à l’information.
      </p>

      <RafaleExperience />

      <noscript>
        <p className="mt-3 border border-line bg-panel px-4 py-3 font-mono text-xs text-ink-dim">
          JavaScript est requis pour charger la vue 3D. La planche reste une
          représentation illustrative sans données connectées.
        </p>
      </noscript>

      <section className="mt-4 border border-line bg-panel" aria-labelledby="rafale-scope-heading">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
          <h2
            id="rafale-scope-heading"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint"
          >
            Cadre éditorial
          </h2>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-stamp">
            Modèle Blender reproductible · asset GLB local
          </span>
        </div>
        <ul className="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
          {EDITORIAL_LIMITS.map((limit) => (
            <li
              key={limit}
              className="flex min-h-16 items-center gap-3 px-4 py-3 font-mono text-[10px] leading-relaxed text-ink-dim"
            >
              <span className="h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
              {limit}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 border border-line bg-panel" aria-labelledby="rafale-scenarios-heading">
        <h2
          id="rafale-scenarios-heading"
          className="border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint"
        >
          Pourquoi trois scénarios ?
        </h2>
        <ul className="grid divide-y divide-line lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {SCENARIO_NOTES.map((note) => (
            <li key={note.title} className="px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                {note.title}
              </p>
              <p className="mt-1.5 font-serif text-[0.95rem] leading-relaxed text-ink-dim">
                {note.text}
                {note.sources.map((ref) => (
                  <span key={ref.url}>
                    {" "}
                    <SourceLink source={ref.source} url={ref.url} />
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="border border-line bg-panel" aria-labelledby="rafale-milestones-heading">
          <h2
            id="rafale-milestones-heading"
            className="border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint"
          >
            Repères publics 2015 – 2026
          </h2>
          <ol className="divide-y divide-line">
            {MILESTONES.map((milestone) => (
              <li
                key={milestone.date}
                className="grid gap-1 px-4 py-3 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                  {milestone.date}
                </p>
                <p className="font-serif text-[0.95rem] leading-relaxed text-ink-dim">
                  {milestone.text} <SourceLink source={milestone.source} url={milestone.url} />
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border border-line bg-panel" aria-labelledby="rafale-method-heading">
          <h2
            id="rafale-method-heading"
            className="border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint"
          >
            Méthode
          </h2>
          <div className="space-y-3 px-4 py-3 font-serif text-[0.95rem] leading-relaxed text-ink-dim">
            <p>
              Le modèle est reconstruit par un script Blender paramétré : sections
              de fuselage interpolées, voilure et plans canard en profils,
              emports aux gabarits publiés (Dassault Aviation, MBDA, Safran,
              Thales). Aucune cote fine n’est revendiquée.
            </p>
            <p>
              L’attitude de l’avion et les cadrages sont pilotés par l’état ; la
              séparation et le départ sont une chronologie déterministe, rejouée
              à l’identique à chaque passage, dans un ralenti assumé.
            </p>
          </div>
          <ul className="grid gap-px border-t border-line bg-line">
            {[
              ["/systemes/rafale", "Dossier système Rafale"],
              ["/systemes/rafale/xray", "System X-Ray du dossier"],
              ["/systemes/meteor", "Fiche missile Meteor"],
              ["/systemes/mica-ng", "Fiche missile MICA NG"],
            ].map(([href, label]) => (
              <li key={href} className="bg-panel">
                <Link
                  href={href}
                  className="flex min-h-11 items-center justify-between gap-3 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-dim motion-safe:transition-colors hover:bg-surface hover:text-accent"
                >
                  {label}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
