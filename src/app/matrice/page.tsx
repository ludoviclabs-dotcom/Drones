import type { Metadata } from "next";
import Link from "next/link";
import { getMatrixPoints } from "@/lib/matrix";
import { SectionMarker } from "@/components/primitives";
import { MatrixPlot } from "@/components/matrix-plot";

export const metadata: Metadata = {
  alternates: { canonical: "/matrice" },
  title: "Matrice stratégique",
  description:
    "Positionnement des systèmes sur deux axes dérivés des paliers d'évaluation : autonomie industrielle contre dépendance géopolitique, effet par rapport au coût.",
};

const AXES_NOTES = [
  {
    label: "Axe horizontal — autonomie ↔ dépendance",
    detail:
      "Dérivé du palier Risque industriel (trois quarts) et du canal d'acquisition le plus autonome du système (un quart). À gauche, une base industrielle souveraine ; à droite, une dépendance externe — fournisseurs critiques, licences, vente d'État à État.",
  },
  {
    label: "Axe vertical — effet par rapport au coût",
    detail:
      "Dérivé du palier Efficacité / coût (trois quarts) et du palier Survivabilité (un quart). Vers le haut, un effet militaire élevé au regard du coût engagé ; vers le bas, un rapport plus mesuré.",
  },
];

export default function MatricePage() {
  const points = getMatrixPoints();

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Outil
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          Matrice stratégique
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          {`Les ${points.length} systèmes du catalogue projetés sur deux axes. Aucun chiffre nouveau : la matrice recompose les paliers d'évaluation déjà publiés pour rendre lisible, d'un coup d'œil, où se situe chaque système.`}
        </p>
      </header>

      <section className="mt-12">
        <SectionMarker
          index="—"
          label="Positionnement à deux axes"
          blurb="Survolez un point pour l'isoler ; cliquez pour ouvrir le dossier."
        />
        <div className="mt-8">
          <MatrixPlot points={points} />
        </div>
      </section>

      <section className="mt-14">
        <SectionMarker
          index="—"
          label="Comment lire les axes"
          blurb="La matrice est une dérivation transparente — pas une mesure nouvelle."
        />
        <div className="mt-6 grid gap-px border border-line bg-line md:grid-cols-2">
          {AXES_NOTES.map((note) => (
            <div key={note.label} className="bg-panel p-5">
              <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-accent">
                {note.label}
              </h3>
              <p className="mt-2.5 font-serif text-sm leading-relaxed text-ink-dim">
                {note.detail}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-2xl font-serif text-sm italic leading-relaxed text-ink-faint">
          Les paliers eux-mêmes restent des estimations open source, argumentées
          sur chaque fiche et tracées dans la Console. La matrice hérite de leurs
          limites : elle situe, elle ne classe pas.
        </p>
      </section>

      <nav className="mt-12 flex flex-wrap gap-6 border-t border-line pt-6">
        <Link
          href="/comparateur"
          className="font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
        >
          Confronter deux ou trois systèmes →
        </Link>
        <Link
          href="/methodologie"
          className="font-mono text-xs uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
        >
          Comment les paliers sont-ils attribués ?
        </Link>
      </nav>
    </div>
  );
}
