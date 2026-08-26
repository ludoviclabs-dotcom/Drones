import type { Metadata } from "next";
import { ThundartExperience } from "@/components/hud/thundart/ThundartExperience";
import { THUNDART_ASSET_MANIFEST } from "@/data/hud/thundart";

export const metadata: Metadata = {
  title: "Thundart — planche technique 3D",
  description:
    "Prototype Web 3D illustratif de Thundart, présenté comme une planche technique en mode démonstration sans donnée opérationnelle.",
  alternates: { canonical: "/hud/thundart" },
};

const EDITORIAL_LIMITS = [
  "Représentation illustrative des formes extérieures visibles.",
  "Aucune télémétrie ni donnée connectée.",
  "Aucun ciblage ni aide à la décision.",
  "Aucune trajectoire, balistique ni calcul physique.",
] as const;

export default function ThundartHudPage() {
  return (
    <main className="mx-auto max-w-[1600px] px-3 py-7 sm:px-5 sm:py-10 lg:px-7">
      <header className="mb-4 grid gap-5 border-y border-line py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            Planche technique / démonstration · THD-03
          </p>
          <h1 className="mt-2 max-w-4xl font-serif text-3xl leading-[1.05] text-ink sm:text-4xl lg:text-5xl">
            Thundart — inspection extérieure 3D
          </h1>
          <p className="mt-3 max-w-3xl font-serif text-base leading-relaxed text-ink-dim sm:text-lg">
            Séquence technique en cinq états, jouée uniquement lorsque vous
            changez d’état. Aucune boucle décorative, aucune animation d’attente :
            sans changement d’état, rien ne bouge.
          </p>
        </div>

        <div className="flex items-center gap-3 border border-line bg-panel px-3 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-dim sm:text-[10px]">
          <span className="h-2 w-2 bg-stamp" aria-hidden="true" />
          <span>Séquence déterministe · asset local</span>
        </div>
      </header>

      <p
        id="thundart-view-description"
        className="mb-3 border-l border-stamp pl-3 font-mono text-[10px] leading-relaxed text-ink-faint"
      >
        Vue industrielle trois-quarts. Les contrôles orbitaux sont disponibles
        dans les états Vue d’ensemble et Inspection extérieure, hors transition.
        Le réglage système « mouvement réduit » remplace les transitions par un
        passage direct à la pose finale, sans rien retirer à l’information.
      </p>

      <ThundartExperience />

      <noscript>
        <p className="mt-3 border border-line bg-panel px-4 py-3 font-mono text-xs text-ink-dim">
          JavaScript est requis pour charger la vue 3D. La planche reste une
          représentation illustrative sans données connectées.
        </p>
      </noscript>

      <section
        className="mt-4 border border-line bg-panel"
        aria-labelledby="thundart-scope-heading"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
          <h2
            id="thundart-scope-heading"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint"
          >
            Cadre éditorial
          </h2>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-stamp">
            {THUNDART_ASSET_MANIFEST.meshNodeCount} objets maillés ·{" "}
            {THUNDART_ASSET_MANIFEST.animationClips.length} clips pilotés par
            l’état
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
    </main>
  );
}
