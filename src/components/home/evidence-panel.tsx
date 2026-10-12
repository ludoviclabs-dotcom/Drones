import Link from "next/link";
import type { Confidence, SourceRef } from "@/data/types";
import { systems } from "@/data/systems";
import {
  CONFIDENCE_META,
  RELIABILITY_LABELS,
  SOURCE_TYPE_LABELS,
} from "@/data/labels";
import { getEvidenceStats } from "@/lib/claims";
import {
  scoreSource,
  sourceKey,
  SOURCE_CONFIDENCE_META,
  type SourceConfidenceBand,
} from "@/lib/source-confidence";
import { formatCount, formatDateFr } from "@/lib/format";

const CONFIDENCES: Confidence[] = ["haute", "moyenne", "faible"];
const BANDS: SourceConfidenceBand[] = ["forte", "moyenne", "faible", "a-recouper"];

/** Barres de confiance sur papier — la version encre de `ConfidenceMark`. */
function PaperConfidenceMark({ confidence }: { confidence: Confidence }) {
  const meta = CONFIDENCE_META[confidence];
  return (
    <span
      role="img"
      aria-label={meta.label}
      className="inline-flex items-center gap-[3px]"
    >
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className="h-1 w-2.5"
          style={{
            backgroundColor:
              n <= meta.level
                ? "var(--color-accent-paper)"
                : "var(--color-line-paper)",
          }}
        />
      ))}
    </span>
  );
}

/**
 * Insert papier de l'accueil : comment chaque chiffre est qualifié.
 * Tout est dérivé du registre — effectifs par confiance, bandes de sources,
 * fenêtre de révision des dossiers, part des sources datées — et un exemple
 * réel scoré par la même fonction que la console.
 */
export function EvidencePanel({ example }: { example: SourceRef }) {
  const stats = getEvidenceStats();

  const unique = new Map<string, SourceRef>();
  for (const system of systems) {
    for (const source of system.sources) unique.set(sourceKey(source), source);
  }
  const sourcesUnique = unique.size;
  const sourcesDated = Array.from(unique.values()).filter((s) => s.date).length;

  const updates = systems
    .map((system) => system.updated)
    .filter((value): value is string => Boolean(value))
    .sort();
  const updatedFrom = updates[0];
  const updatedTo = updates[updates.length - 1];

  const exampleScore = scoreSource(example);
  const nextBand = exampleScore.band === "forte" ? null : "forte";

  return (
    <div className="bg-paper text-ink-paper">
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:py-20">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs font-semibold text-accent-paper">
            05
          </span>
          <h2
            id="methode-title"
            className="font-mono text-sm uppercase tracking-[0.22em] text-ink-paper"
          >
            Méthode
          </h2>
          <span className="h-px flex-1 bg-line-paper" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-14">
          <p className="max-w-[22ch] font-serif text-4xl leading-[1.08] tracking-tight text-ink-paper sm:text-5xl">
            Chaque chiffre porte une source, une date et un niveau de
            confiance.
          </p>
          <p className="font-sans text-[17px] leading-relaxed text-ink-paper-dim">
            Les données de défense sont incomplètes, estimées, parfois
            contradictoires. Panoplie ne masque pas ce flou : il l'affiche,
            indicateur par indicateur.
          </p>
        </div>

        <div className="mt-10 grid gap-px border border-line-paper bg-line-paper lg:grid-cols-3">
          {/* Confiance des données */}
          <div className="bg-paper p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-paper">
              Confiance des données
            </p>
            <p className="mt-2.5 font-serif text-lg leading-snug">
              Trois barres sur chaque indicateur chiffré : ce qui est établi, ce
              qui reste estimé.
            </p>
            <dl className="mt-6 flex flex-col gap-3.5 font-mono text-[11px]">
              {CONFIDENCES.map((confidence) => {
                const count = stats.byConfidence[confidence];
                const width = stats.claims
                  ? Math.max(2, Math.round((count / stats.claims) * 100))
                  : 0;
                return (
                  <div
                    key={confidence}
                    className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3"
                  >
                    <dt>
                      <PaperConfidenceMark confidence={confidence} />
                    </dt>
                    <dd className="m-0">
                      <span className="block h-1.5 bg-paper-shade">
                        <span
                          className="block h-full bg-accent-paper"
                          style={{ width: `${width}%` }}
                        />
                      </span>
                    </dd>
                    <dd className="m-0 whitespace-nowrap text-ink-paper-dim">
                      {CONFIDENCE_META[confidence].label.replace("Confiance ", "")}{" "}
                      · {formatCount(count)}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-paper-dim">
              {formatCount(stats.claims)} affirmations tracées ·{" "}
              {formatCount(stats.byStatus.verifie)} vérifiées
            </p>
          </div>

          {/* Fiabilité des sources */}
          <div className="bg-paper p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-paper">
              Fiabilité des sources
            </p>
            <p className="mt-2.5 font-serif text-lg leading-snug">
              Chaque source est notée de A ({RELIABILITY_LABELS.A.toLowerCase()})
              à D ({RELIABILITY_LABELS.D.toLowerCase()}), puis scorée sur 100 :
              fiabilité, type, fraîcheur, URL publique, date.
            </p>
            <div
              className="mt-6 flex h-2.5 bg-paper-shade"
              role="img"
              aria-label={`Répartition des ${formatCount(sourcesUnique)} sources uniques : ${BANDS.map(
                (band) =>
                  `${stats.sourceConfidence[band]} ${SOURCE_CONFIDENCE_META[band].label.toLowerCase()}`,
              ).join(", ")}.`}
            >
              {BANDS.map((band) => (
                <span
                  key={band}
                  style={{
                    width: `${sourcesUnique ? (stats.sourceConfidence[band] / sourcesUnique) * 100 : 0}%`,
                    backgroundColor: SOURCE_CONFIDENCE_META[band].token,
                  }}
                />
              ))}
            </div>
            <ul className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[11px] text-ink-paper-dim">
              {BANDS.map((band) => (
                <li key={band} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0"
                    style={{ backgroundColor: SOURCE_CONFIDENCE_META[band].token }}
                  />
                  {SOURCE_CONFIDENCE_META[band].label} ·{" "}
                  {stats.sourceConfidence[band]}
                </li>
              ))}
            </ul>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-paper-dim">
              {formatCount(sourcesUnique)} sources uniques ·{" "}
              {Object.keys(SOURCE_TYPE_LABELS).length} types
            </p>
          </div>

          {/* Datation */}
          <div className="bg-paper p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-paper">
              Datation
            </p>
            <p className="mt-2.5 font-serif text-lg leading-snug">
              Chaque dossier porte sa date de révision ; chaque source, sa date
              de publication quand elle est connue — jamais déduite.
            </p>
            <dl className="mt-6 flex flex-col gap-2.5 font-mono text-[11px] text-ink-paper-dim">
              {updatedFrom && updatedTo ? (
                <div className="flex justify-between gap-3 border-t border-line-paper pt-2">
                  <dt>Dossiers révisés</dt>
                  <dd className="m-0 text-right text-ink-paper">
                    {updatedFrom === updatedTo
                      ? formatDateFr(updatedTo)
                      : `${formatDateFr(updatedFrom)} → ${formatDateFr(updatedTo)}`}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-3 border-t border-line-paper pt-2">
                <dt>Sources datées</dt>
                <dd className="m-0 text-ink-paper">
                  {sourcesDated} / {formatCount(sourcesUnique)}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-line-paper pt-2">
                <dt>Sans source</dt>
                <dd className="m-0 text-ink-paper">
                  {stats.claimsWithoutSources} affirmation
                  {stats.claimsWithoutSources > 1 ? "s" : ""}
                </dd>
              </div>
            </dl>
            <div className="mt-5 border border-line-paper px-3.5 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-paper-dim">
                Exemple · {example.publisher}
              </p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink-paper">
                {SOURCE_TYPE_LABELS[example.type]} · fiabilité {example.reliability}{" "}
                ·{" "}
                {example.url ? "URL publique" : "URL absente"} ·{" "}
                {example.date ? `publiée en ${example.date}` : "date absente"}
              </p>
              <p className="mt-1.5 font-mono text-[11px] text-accent-paper">
                Score {exampleScore.score} / 100 · {exampleScore.label}
                {nextBand && !example.date
                  ? " — une date publiée relèverait son score."
                  : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2">
          <Link
            href="/methodologie"
            className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.16em] text-accent-paper transition-colors hover:text-ink-paper"
          >
            Lire la méthodologie →
          </Link>
          <Link
            href="/console"
            className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-paper-dim transition-colors hover:text-ink-paper"
          >
            Console OSINT
          </Link>
          <Link
            href="/audit"
            className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-paper-dim transition-colors hover:text-ink-paper"
          >
            Audit méthodologique
          </Link>
        </div>
      </div>
    </div>
  );
}
