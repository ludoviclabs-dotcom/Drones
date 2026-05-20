import type { Metadata } from "next";
import Link from "next/link";
import type { ScoreKey } from "@/data/types";
import { systems } from "@/data/systems";
import { MODE_LABELS, SCORE_LABELS } from "@/data/labels";
import { GradeBadge, SectionMarker } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Comparateur",
  description:
    "Confronter les systèmes de défense côte à côte — identité, modes d'acquisition et évaluation par paliers.",
};

const SCORE_KEYS: ScoreKey[] = [
  "efficacite-cout",
  "survivabilite",
  "exportabilite",
  "risque-industriel",
  "maturite",
  "confiance-donnees",
];

function GroupRow({ label }: { label: string }) {
  return (
    <tr>
      <th
        colSpan={1 + systems.length}
        scope="colgroup"
        className="border border-line bg-surface-2 px-4 py-2 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-accent"
      >
        {label}
      </th>
    </tr>
  );
}

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
          Les trois systèmes documentés, confrontés côte à côte. La V1 compare
          l'ensemble du catalogue ; la sélection viendra avec le volume.
        </p>
      </header>

      <section className="mt-12">
        <SectionMarker index="—" label="Tableau comparatif" />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr>
                <td className="w-[200px] border border-line bg-bg" />
                {systems.map((system) => (
                  <th
                    key={system.slug}
                    scope="col"
                    className="border border-line bg-panel px-4 py-4 text-left align-bottom"
                  >
                    <span className="text-lg">{system.flag}</span>
                    <Link
                      href={`/systemes/${system.slug}`}
                      className="mt-1 block font-serif text-xl text-ink transition-colors hover:text-accent"
                    >
                      {system.name}
                    </Link>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                      {system.classLabel}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <GroupRow label="Identité" />
              {(
                [
                  ["Pays", (s: (typeof systems)[number]) => s.country],
                  ["Constructeur", (s: (typeof systems)[number]) => s.manufacturer],
                  [
                    "Acquisition",
                    (s: (typeof systems)[number]) =>
                      s.acquisitionModes
                        .map((m) => MODE_LABELS[m].short)
                        .join(" · "),
                  ],
                ] as const
              ).map(([label, accessor]) => (
                <tr key={label}>
                  <th
                    scope="row"
                    className="border border-line bg-surface px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.1em] text-ink-dim"
                  >
                    {label}
                  </th>
                  {systems.map((system) => (
                    <td
                      key={system.slug}
                      className="border border-line bg-panel px-4 py-3 font-mono text-xs text-ink"
                    >
                      {accessor(system)}
                    </td>
                  ))}
                </tr>
              ))}

              <GroupRow label="Évaluation — paliers A à E" />
              {SCORE_KEYS.map((key) => (
                <tr key={key}>
                  <th
                    scope="row"
                    className="border border-line bg-surface px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.1em] text-ink-dim"
                  >
                    {SCORE_LABELS[key]}
                  </th>
                  {systems.map((system) => {
                    const score = system.scores.find((s) => s.key === key);
                    return (
                      <td
                        key={system.slug}
                        className="border border-line bg-panel px-4 py-3 align-top"
                      >
                        {score ? (
                          <div className="flex items-start gap-3">
                            <GradeBadge grade={score.grade} size="sm" />
                            <span className="font-serif text-xs leading-relaxed text-ink-dim">
                              {score.rationale}
                            </span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              <GroupRow label="Lecture" />
              {(
                [
                  ["Meilleur emploi", "bestUseCase"],
                  ["Point faible", "weakPoint"],
                ] as const
              ).map(([label, field]) => (
                <tr key={field}>
                  <th
                    scope="row"
                    className="border border-line bg-surface px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.1em] text-ink-dim"
                  >
                    {label}
                  </th>
                  {systems.map((system) => (
                    <td
                      key={system.slug}
                      className="border border-line bg-panel px-4 py-3 align-top font-serif text-sm leading-relaxed text-ink-dim"
                    >
                      {system.editorial[field] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
