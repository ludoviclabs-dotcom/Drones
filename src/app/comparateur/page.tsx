import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import { SectionMarker } from "@/components/primitives";
import {
  ComparateurTool,
  type ComparableSystem,
} from "@/components/comparateur-tool";

export const metadata: Metadata = {
  title: "Comparateur",
  description:
    "Confronter les systèmes de défense — sélection de deux à trois dossiers : identité, modes d'acquisition et évaluation par paliers.",
};

// Forme allégée passée au composant client : seuls les champs comparés.
const comparable: ComparableSystem[] = systems.map((s) => ({
  slug: s.slug,
  name: s.name,
  flag: s.flag,
  classLabel: s.classLabel,
  country: s.country,
  manufacturer: s.manufacturer,
  acquisitionModes: s.acquisitionModes,
  scores: s.scores,
  editorial: s.editorial,
}));

export default function ComparateurPage() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Outil
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          Comparateur
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          {`${comparable.length} systèmes au catalogue. Choisissez-en deux ou trois pour les confronter dossier contre dossier — identité, modes d'acquisition et évaluation par paliers.`}
        </p>
      </header>

      <section className="mt-12">
        <SectionMarker index="—" label="Sélection et tableau comparatif" />
        <div className="mt-6">
          <ComparateurTool systems={comparable} />
        </div>
      </section>

      <nav className="mt-10 border-t border-line pt-6">
        <Link
          href="/methodologie"
          className="font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
        >
          Comment les paliers sont-ils attribués ? →
        </Link>
      </nav>
    </div>
  );
}
