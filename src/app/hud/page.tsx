import type { Metadata } from "next";
import Link from "next/link";
import { HUD_BOARDS } from "@/data/hud/boards";
import { HudBoardGrid } from "@/components/hud/hud-board-card";
import { JsonLd } from "@/components/json-ld";
import { RegistrationMarks } from "@/components/registration-marks";
import { hudBreadcrumbLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Planches techniques — HUD et modélisation 3D",
  description:
    "Index des planches techniques Panoplie : modélisation 3D interactive du démonstrateur Thundart et vue éclatée d’une cellule de drone, en mode démonstration illustrative.",
  alternates: { canonical: "/hud" },
};

const EDITORIAL_FRAME = [
  "Représentations illustratives, en mode démonstration.",
  "Aucune télémétrie ni donnée connectée.",
  "Aucun ciblage ni aide à la décision.",
  "Chaque planche reste pilotable au clavier.",
] as const;

export default function HudIndexPage() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-10 sm:py-14">
      <JsonLd data={hudBreadcrumbLd()} />

      <header className="relative border border-line-bright bg-panel">
        <RegistrationMarks />
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-6 py-2.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            Planches techniques
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            {HUD_BOARDS.length} planches · démonstration illustrative
          </span>
        </div>
        <div className="p-6 sm:p-10">
          <h1 className="max-w-3xl font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Voir les objets, <span className="italic text-accent">pas seulement</span>{" "}
            les chiffres.
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
            Les planches techniques traduisent en image ce que les dossiers
            décrivent : modélisation 3D interactive, vues éclatées, sous-ensembles
            à inspecter. Chacune se manipule à la souris, au toucher ou au
            clavier, et reste une représentation illustrative sans donnée
            opérationnelle.
          </p>
        </div>
      </header>

      <div className="mt-10">
        <HudBoardGrid boards={HUD_BOARDS} headingLevel={2} eager />
      </div>

      <section
        className="mt-10 border border-line bg-panel"
        aria-labelledby="hud-frame-heading"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
          <h2
            id="hud-frame-heading"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint"
          >
            Cadre éditorial
          </h2>
          <Link
            href="/methodologie"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent motion-safe:transition-colors hover:text-ink"
          >
            Méthodologie →
          </Link>
        </div>
        <ul className="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {EDITORIAL_FRAME.map((line) => (
            <li
              key={line}
              className="flex min-h-16 items-center gap-3 px-4 py-3 font-mono text-[11px] leading-relaxed text-ink-dim"
            >
              <span className="h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
