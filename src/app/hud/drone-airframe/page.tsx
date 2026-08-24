import type { Metadata } from "next";
import HudScene from "@/components/HudScene";
import { droneAirframeScene } from "../../../../scenes/drone-airframe";

export const metadata: Metadata = {
  title: "HUD drone — cellule éclatée",
  description:
    "Planche technique interactive d’une cellule de drone éclatée. Les panneaux restent en mode démonstration tant qu’aucune donnée source n’est branchée.",
  alternates: { canonical: "/hud/drone-airframe" },
};

const CONNECTION_ROWS = [
  {
    label: "Métaphore",
    value: "Cellule de drone éclatée selon la chaîne réelle du traitement embarqué.",
  },
  {
    label: "À brancher",
    value:
      "Roulis, tangage et cap (°) · tension (V) et consommation (A) · puissance RF (dBm) · satellites (nombre) · événements de vol (horodatage UTC).",
  },
  {
    label: "Limite",
    value:
      "Sans télémétrie ni source OSINT qualifiée, la planche décrit l’architecture mais ne mesure aucun aéronef.",
  },
] as const;

export default function DroneAirframeHudPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-3 py-8 sm:px-5 sm:py-12">
      <header className="mb-5 grid gap-5 border-y border-line py-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            Planche technique · HUD-DRN-001
          </p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-ink sm:text-4xl">
            Cellule de drone — vue éclatée
          </h1>
          <p className="mt-3 max-w-3xl font-serif text-base leading-relaxed text-ink-dim">
            Lecture structurelle d’une chaîne embarquée, du châssis à la nacelle
            capteurs. Les quatre panneaux sont prêts à recevoir des données
            qualifiées, mais n’affichent encore aucune mesure.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="h-2 w-2 bg-ink-faint" aria-hidden="true" />
          <span className="text-ink-dim">Mode démo · données hors ligne</span>
        </div>
      </header>

      <section aria-labelledby="hud-scene-heading">
        <h2 id="hud-scene-heading" className="sr-only">
          Visualisation technique interactive
        </h2>
        {/* La planche a une largeur plancher de 960 px : elle déborde donc
            jusqu'à ~1000 px de fenêtre, tablette comprise. L'indication suit ce
            seuil (lg) et non le seuil mobile (sm), sinon la tablette défilait
            sans aucun repère. */}
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint lg:hidden">
          Faire défiler horizontalement pour lire toute la planche →
        </p>
        <HudScene scene={droneAirframeScene} />
      </section>

      <section
        aria-labelledby="connection-heading"
        className="mt-5 border border-line bg-panel"
      >
        <div className="border-b border-line px-4 py-2.5">
          <h2
            id="connection-heading"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint"
          >
            Fiche de raccordement
          </h2>
        </div>
        <dl className="divide-y divide-line">
          {CONNECTION_ROWS.map((row) => (
            <div
              key={row.label}
              className="grid gap-1 px-4 py-3 sm:grid-cols-[9rem_1fr] sm:gap-5"
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                {row.label}
              </dt>
              <dd className="font-mono text-[11px] leading-relaxed text-ink-dim">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
