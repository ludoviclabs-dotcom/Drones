import type { Metadata } from "next";
import { getAllClaims, getEvidenceStats } from "@/lib/claims";
import { SectionMarker } from "@/components/primitives";
import { StatGrid, type Stat } from "@/components/stat-cards";
import { ConsoleTable } from "@/components/console-table";

export const metadata: Metadata = {
  alternates: { canonical: "/console" },
  title: "Console OSINT",
  description:
    "Registre de preuves filtrable — chaque affirmation publiée par Panoplie, tracée, sourcée et statuée.",
};

export default function ConsolePage() {
  const claims = getAllClaims();
  const stats = getEvidenceStats();

  const cards: Stat[] = [
    { label: "Systèmes documentés", value: stats.systems },
    { label: "Sources indexées", value: stats.sources },
    { label: "Affirmations", value: stats.claims },
    { label: "Affirmations variables", value: stats.byStatus.variable },
    { label: "Confiance haute", value: stats.byConfidence.haute },
    { label: "Confiance moyenne", value: stats.byConfidence.moyenne },
    { label: "Confiance faible", value: stats.byConfidence.faible },
    { label: "Affirmations vérifiées", value: stats.byStatus.verifie },
  ];

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Outil
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          Console OSINT
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Le registre de preuves : chaque affirmation publiée par Panoplie,
          rattachée à sa source, son niveau de confiance et son statut. Les
          compteurs sont dérivés des données — aucun n'est saisi à la main.
        </p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          Registre arrêté au {stats.updated}
        </p>
      </header>

      <div className="mt-8">
        <StatGrid stats={cards} />
      </div>

      <section className="mt-14">
        <SectionMarker
          index="—"
          label="Registre de preuves"
          blurb="Filtrer par système, brique, niveau de confiance ou statut."
        />
        <div className="mt-6">
          <ConsoleTable claims={claims} />
        </div>
      </section>
    </div>
  );
}
