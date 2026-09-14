import type { Metadata } from "next";
import Link from "next/link";
import { PatriotExperience } from "@/components/hud/patriot/PatriotExperience";
import { HudBreadcrumb } from "@/components/hud/hud-breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { hudBoardBySlug } from "@/data/hud/boards";
import { PATRIOT_SEQUENCE_STATES } from "@/data/hud/patriot";
import { PATRIOT_INSPECTABLES } from "@/data/hud/patriot-inspection";
import { hudBreadcrumbLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Patriot PAC-3 MSE — batterie et lanceur en 3D",
  description:
    "Planche technique 3D illustrative d’une batterie Patriot PAC-3 MSE : lanceur M903 détaillé, mise en batterie, élévation, mise à feu et départ illustratifs, sans donnée opérationnelle.",
  alternates: { canonical: "/hud/patriot-pac3-mse" },
};

const EDITORIAL_LIMITS = [
  "Représentation illustrative des formes extérieures visibles, sur gabarits publics.",
  "Aucune télémétrie, aucun ciblage, aucune aide à la décision.",
  "Départ dans l’axe du tube seulement : aucune trajectoire ni balistique.",
  "Tempos, panaches et disposition de batterie : choix de lecture.",
] as const;

type Milestone = {
  date: string;
  text: string;
  source: string;
  url: string;
};

/** Repères publics datés, vérifiés sur la source citée. */
const MILESTONES: readonly Milestone[] = [
  {
    date: "16 août 2024",
    text: "L’Allemagne demande l’autorisation d’acquérir 600 PAC-3 MSE, pour environ 5 Md$ (≈ 4,5 Md€), selon l’annonce de l’agence américaine DSCA.",
    source: "Opex360",
    url: "https://www.opex360.com/2024/08/16/defense-aerienne-lallemagne-veut-commander-600-missiles-patriot-pac-3-mse-pour-45-milliards-deuros/",
  },
  {
    date: "4 nov. 2024",
    text: "Essai en vol : un PAC-3 MSE et un PAC-3 CRI tirés « in a ripple configuration », avec le nouveau radar LTAMDS.",
    source: "Lockheed Martin",
    url: "https://news.lockheedmartin.com/2024-11-04-pac-3-engages-advanced-target-in-flight-test-supporting-u-s-army-modernization-strategy",
  },
  {
    date: "6 janv. 2026",
    text: "Accord-cadre de sept ans : capacité portée d’environ 600 à environ 2 000 MSE par an ; 620 intercepteurs livrés en 2025.",
    source: "Lockheed Martin · Opex360",
    url: "https://news.lockheedmartin.com/2026-01-06-Lockheed-Martin-and-Department-of-War-Advance-Landmark-Acquisition-Transformation-to-Accelerate-PAC-3-R-MSE-Production",
  },
  {
    date: "21 juil. 2026",
    text: "Présentation du PAC-3 ACE, intercepteur dérivé tirable depuis les lanceurs Patriot existants, annoncé à « moins de la moitié » du coût d’un MSE.",
    source: "MetaDefense",
    url: "https://meta-defense.fr/2026/07/21/pac-3-ace-intercepteur-patriot-low-cost/",
  },
  {
    date: "29 juil. 2026",
    text: "Contrat pluriannuel de 58,62 Md$ au total pour la production du PAC-3 MSE sur sept ans ; capacité triplée d’ici fin 2030.",
    source: "Lockheed Martin",
    url: "https://news.lockheedmartin.com/2026-07-29-Department-of-War-Awards-Lockheed-Martin-58-62B-for-Multiyear-PAC-3-MSE-Production-to-Strengthen-the-Arsenal-of-Freedom",
  },
];

export default function PatriotHudPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-3 py-7 sm:px-5 sm:py-10 lg:px-7">
      <JsonLd data={hudBreadcrumbLd(hudBoardBySlug("patriot-pac3-mse"))} />
      <HudBreadcrumb current="Patriot PAC-3 MSE" />
      <header className="mb-4 grid gap-5 border-y border-line py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            Planche technique · modélisation 3D et séquence illustrative
          </p>
          <h1 className="mt-2 max-w-4xl font-serif text-3xl leading-[1.05] text-ink sm:text-4xl lg:text-5xl">
            Patriot PAC-3 MSE — batterie et lanceur en 3D
          </h1>
          <p className="mt-3 max-w-3xl font-serif text-base leading-relaxed text-ink-dim sm:text-lg">
            Une batterie Patriot en disposition illustrative, et son lanceur M903
            modélisé en détail. Sept états mènent de l’arrivée du lanceur à sa mise
            en batterie, à son élévation, puis à une mise à feu et un départ
            illustratifs, en tir unitaire ou en salve.
          </p>
        </div>

        <div className="flex items-center gap-3 border border-line bg-panel px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim">
          <span className="h-2 w-2 bg-stamp" aria-hidden="true" />
          <span>
            {PATRIOT_SEQUENCE_STATES.length} états · {PATRIOT_INSPECTABLES.length} sous-ensembles
          </span>
        </div>
      </header>

      <p
        id="patriot-view-description"
        className="mb-3 border-l border-stamp pl-3 font-mono text-[10px] leading-relaxed text-ink-faint"
      >
        Vue industrielle en plan large, puis rapprochée. Les contrôles orbitaux
        sont disponibles au repos dans les états Batterie, Inspection et Fin. Le
        réglage système « mouvement réduit » remplace les transitions par un
        passage direct à la pose finale, sans rien retirer à l’information.
      </p>

      <PatriotExperience />

      <noscript>
        <p className="mt-3 border border-line bg-panel px-4 py-3 font-mono text-xs text-ink-dim">
          JavaScript est requis pour charger la vue 3D. La planche reste une
          représentation illustrative sans données connectées.
        </p>
      </noscript>

      <section className="mt-4 border border-line bg-panel" aria-labelledby="patriot-scope-heading">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
          <h2
            id="patriot-scope-heading"
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

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="border border-line bg-panel" aria-labelledby="patriot-milestones-heading">
          <h2
            id="patriot-milestones-heading"
            className="border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint"
          >
            Repères publics 2024 – 2026
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
                  {milestone.text}{" "}
                  <a
                    href={milestone.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint underline decoration-line-bright underline-offset-2 motion-safe:transition-colors hover:text-accent"
                  >
                    {milestone.source}
                  </a>
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border border-line bg-panel" aria-labelledby="patriot-method-heading">
          <h2
            id="patriot-method-heading"
            className="border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint"
          >
            Méthode
          </h2>
          <div className="space-y-3 px-4 py-3 font-serif text-[0.95rem] leading-relaxed text-ink-dim">
            <p>
              Le modèle est reconstruit par un script Blender paramétré, à partir
              des gabarits publiés (manuel FM 3-01.85, Lockheed Martin) et de
              photographies publiques : aucune cote fine n’est revendiquée.
            </p>
            <p>
              Les mouvements du lanceur sont des clips pilotés par l’état ; la mise
              à feu est une chronologie déterministe, rejouée à l’identique à
              chaque passage.
            </p>
          </div>
          <ul className="grid gap-px border-t border-line bg-line">
            {[
              ["/systemes/patriot-pac3-mse", "Dossier système Patriot PAC-3 MSE"],
              ["/systemes/patriot-pac3-mse/xray", "System X-Ray du dossier"],
              ["/systemes/pac-3-mse", "Fiche intercepteur PAC-3 MSE"],
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
