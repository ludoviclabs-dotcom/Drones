import type { Metadata } from "next";
import Link from "next/link";
import { systems } from "@/data/systems";
import { SectionMarker } from "@/components/primitives";
import {
  ArbitrageSimulator,
  type SimSystem,
} from "@/components/arbitrage-simulator";

export const metadata: Metadata = {
  alternates: { canonical: "/simulateur" },
  title: "Simulateur d'arbitrage",
  description:
    "Outil de pondération non opérationnel : régler ses priorités d'acquisition et lire, en regard, les paliers d'évaluation et les points de vigilance de chaque système.",
};

// Forme allégée passée au composant client : identité et paliers.
const sim: SimSystem[] = systems.map((s) => ({
  slug: s.slug,
  name: s.name,
  flag: s.flag,
  classLabel: s.classLabel,
  scores: s.scores,
}));

export default function SimulateurPage() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Outil
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          Simulateur d&apos;arbitrage
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Priorités d&apos;acquisition en entrée, lecture pondérée des paliers
          et points de vigilance en sortie. L&apos;outil n&apos;établit aucun
          classement de mérite — il montre ce que vos arbitrages mettent en
          avant, et ce qu&apos;ils laissent dans l&apos;ombre.
        </p>
      </header>

      <div className="mt-6 border-l-2 border-accent bg-surface px-5 py-3.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
          Outil de lecture — pas un avis d&apos;achat
        </p>
        <p className="mt-1.5 max-w-3xl font-serif text-sm leading-relaxed text-ink-dim">
          Le simulateur met en regard des priorités déclarées et les paliers
          d&apos;évaluation publiés. Il n&apos;émet aucune recommandation
          d&apos;acquisition : une décision réelle engage le besoin
          opérationnel, le calendrier, le contexte diplomatique et le budget —
          autant de facteurs absents d&apos;ici.
        </p>
      </div>

      <section className="mt-12">
        <SectionMarker
          index="—"
          label="Pondération et lecture"
          blurb="Six critères, quatre niveaux d'importance. La lecture pondérée se recalcule à chaque réglage."
        />
        <div className="mt-8">
          <ArbitrageSimulator systems={sim} />
        </div>
      </section>

      <nav className="mt-12 flex flex-wrap gap-6 border-t border-line pt-6">
        <Link
          href="/matrice"
          className="font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
        >
          Voir la matrice stratégique →
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
