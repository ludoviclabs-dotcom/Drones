"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type {
  AcquisitionMode,
  CombatAircraftClass,
  EditorialBlocks,
  Score,
  ScoreKey,
  SystemCategory,
} from "@/data/types";
import { GENERATION_LABELS, MODE_LABELS, SCORE_LABELS } from "@/data/labels";
import { DomainChips, type DomainValue } from "./domain-filter";
import { GradeBadge } from "./primitives";
import { ScoreProfile } from "./score-profile";
import { ScoreRadar } from "./score-radar";
import { SystemSchematic } from "./system-schematic";

// Forme allégée — le comparateur n'a besoin que de l'identité, des modes
// d'acquisition, des paliers et de deux blocs de lecture.
export interface ComparableSystem {
  slug: string;
  name: string;
  flag: string;
  classLabel: string;
  category: SystemCategory;
  combatAircraftClass?: CombatAircraftClass;
  claimedGeneration?: string;
  naval?: string;
  country: string;
  manufacturer: string;
  acquisitionModes: AcquisitionMode[];
  scores: Score[];
  editorial: EditorialBlocks;
}

const SCORE_KEYS: ScoreKey[] = [
  "efficacite-cout",
  "survivabilite",
  "exportabilite",
  "risque-industriel",
  "maturite",
  "confiance-donnees",
];

const MIN_SELECTION = 2;
const MAX_SELECTION = 3;

// Couleurs de série du diagramme radar — accent, bleu tampon, vert palier A.
const SERIES_COLORS = ["#d2683c", "#6d8a9a", "#61805a"];

function GroupRow({ label, span }: { label: string; span: number }) {
  return (
    <tr>
      <th
        colSpan={span}
        scope="colgroup"
        className="border border-line bg-surface-2 px-4 py-2 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-accent"
      >
        {label}
      </th>
    </tr>
  );
}

const ROW_HEAD =
  "border border-line bg-surface px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.1em] text-ink-dim";

export function ComparateurTool({ systems }: { systems: ComparableSystem[] }) {
  const [selected, setSelected] = useState<string[]>(() =>
    systems.slice(0, MIN_SELECTION).map((s) => s.slug),
  );
  const [domain, setDomain] = useState<DomainValue>("all");
  const tableRef = useRef<HTMLDivElement>(null);

  // Le filtre de domaine ne restreint que la grille de sélection — les
  // systèmes déjà choisis restent confrontés, fût-ce d'un domaine à l'autre.
  const visibleSystems = useMemo(
    () => systems.filter((s) => domain === "all" || s.category === domain),
    [systems, domain],
  );

  // Colonnes en ordre de catalogue — les colonnes ne se déplacent pas quand
  // on coche ou décoche un système.
  const chosen = useMemo(
    () => systems.filter((s) => selected.includes(s.slug)),
    [systems, selected],
  );

  // Le contrôleur de mouvement n'observe le DOM qu'au montage : on remplit
  // nous-mêmes les barres de paliers rendues après une sélection.
  useEffect(() => {
    tableRef.current
      ?.querySelectorAll<HTMLElement>("[data-fill]")
      .forEach((el) => el.classList.add("in-view"));
  }, [chosen]);

  function toggle(slug: string) {
    setSelected((current) => {
      if (current.includes(slug)) {
        return current.filter((s) => s !== slug);
      }
      if (current.length >= MAX_SELECTION) return current;
      return [...current, slug];
    });
  }

  const span = 1 + chosen.length;
  // Le groupe « aviation de combat » ne s'affiche que si tous les systèmes
  // confrontés relèvent du domaine — sinon ses lignes seraient vides.
  const allAircraft =
    chosen.length > 0 &&
    chosen.every((s) => s.category === "combat-aircraft");

  return (
    <div>
      <div className="border border-line bg-panel p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Sélection — confronter 2 à 3 systèmes
          </span>
          <span className="font-mono text-[11px] text-ink-dim">
            {selected.length} / {MAX_SELECTION}
          </span>
        </div>
        <div className="mt-3">
          <DomainChips value={domain} onChange={setDomain} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {visibleSystems.map((system) => {
            const isSelected = selected.includes(system.slug);
            const isDisabled =
              !isSelected && selected.length >= MAX_SELECTION;
            return (
              <button
                key={system.slug}
                type="button"
                onClick={() => toggle(system.slug)}
                disabled={isDisabled}
                aria-pressed={isSelected}
                className={`flex items-center gap-2.5 border px-3 py-2 text-left transition-colors ${
                  isSelected
                    ? "border-accent bg-accent/10"
                    : isDisabled
                      ? "cursor-not-allowed border-line bg-surface opacity-40"
                      : "border-line-bright bg-surface hover:border-ink-faint"
                }`}
              >
                <span
                  className={`h-3 w-3 shrink-0 border ${
                    isSelected
                      ? "border-accent bg-accent"
                      : "border-line-bright"
                  }`}
                  aria-hidden="true"
                />
                <span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">{system.flag}</span>
                    <span className="font-serif text-sm text-ink">
                      {system.name}
                    </span>
                  </span>
                  <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-ink-faint">
                    {system.classLabel}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {chosen.length < MIN_SELECTION ? (
        <div className="mt-6 border border-dashed border-line-bright bg-panel/40 px-6 py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
            Sélectionnez au moins deux systèmes
          </p>
          <p className="mt-2 font-serif text-sm italic leading-relaxed text-ink-dim">
            Le tableau comparatif s&apos;affiche dès que deux dossiers sont
            confrontés.
          </p>
        </div>
      ) : (
        <div ref={tableRef} className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <td className="w-[170px] border border-line bg-bg" />
                {chosen.map((system) => (
                  <th
                    key={system.slug}
                    scope="col"
                    className="border border-line bg-panel px-4 py-4 text-left align-bottom"
                  >
                    <SystemSchematic
                      slug={system.slug}
                      className="h-12 w-12 text-ink-faint"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-base">{system.flag}</span>
                      <Link
                        href={`/systemes/${system.slug}`}
                        className="font-serif text-xl text-ink transition-colors hover:text-accent"
                      >
                        {system.name}
                      </Link>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                      {system.classLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggle(system.slug)}
                      className="mt-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-accent"
                    >
                      ✕ Retirer
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <GroupRow label="Identité" span={span} />
              {(
                [
                  ["Pays", (s: ComparableSystem) => s.country],
                  [
                    "Constructeur",
                    (s: ComparableSystem) => s.manufacturer,
                  ],
                  [
                    "Acquisition",
                    (s: ComparableSystem) =>
                      s.acquisitionModes
                        .map((m) => MODE_LABELS[m].short)
                        .join(" · "),
                  ],
                ] as const
              ).map(([label, accessor]) => (
                <tr key={label}>
                  <th scope="row" className={ROW_HEAD}>
                    {label}
                  </th>
                  {chosen.map((system) => (
                    <td
                      key={system.slug}
                      className="border border-line bg-panel px-4 py-3 font-mono text-xs text-ink"
                    >
                      {accessor(system)}
                    </td>
                  ))}
                </tr>
              ))}

              {allAircraft ? (
                <>
                  <GroupRow label="Aviation de combat" span={span} />
                  {(
                    [
                      [
                        "Génération revendiquée",
                        (s: ComparableSystem) =>
                          s.claimedGeneration ?? "—",
                      ],
                      [
                        "Génération — lecture Panoplie",
                        (s: ComparableSystem) =>
                          s.combatAircraftClass
                            ? GENERATION_LABELS[s.combatAircraftClass]
                            : "—",
                      ],
                      [
                        "Navalisation",
                        (s: ComparableSystem) => s.naval ?? "—",
                      ],
                    ] as const
                  ).map(([label, accessor]) => (
                    <tr key={label}>
                      <th scope="row" className={`${ROW_HEAD} align-top`}>
                        {label}
                      </th>
                      {chosen.map((system) => (
                        <td
                          key={system.slug}
                          className="border border-line bg-panel px-4 py-3 font-serif text-sm leading-relaxed text-ink-dim"
                        >
                          {accessor(system)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ) : null}

              <GroupRow label="Évaluation — paliers A à E" span={span} />
              <tr>
                <th scope="row" className={`${ROW_HEAD} align-top`}>
                  Radar
                </th>
                <td
                  colSpan={chosen.length}
                  className="border border-line bg-panel px-4 py-5"
                >
                  <ScoreRadar
                    series={chosen.map((system, i) => ({
                      name: system.name,
                      color: SERIES_COLORS[i % SERIES_COLORS.length],
                      scores: system.scores,
                    }))}
                  />
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className={`${ROW_HEAD} align-top`}
                >
                  Profil
                </th>
                {chosen.map((system) => (
                  <td
                    key={system.slug}
                    className="border border-line bg-panel px-4 py-3"
                  >
                    <ScoreProfile scores={system.scores} showLabels={false} />
                  </td>
                ))}
              </tr>
              {SCORE_KEYS.map((key) => (
                <tr key={key}>
                  <th scope="row" className={`${ROW_HEAD} align-top`}>
                    {SCORE_LABELS[key]}
                  </th>
                  {chosen.map((system) => {
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

              <GroupRow label="Lecture" span={span} />
              {(
                [
                  ["Meilleur emploi", "bestUseCase"],
                  ["Point faible", "weakPoint"],
                ] as const
              ).map(([label, field]) => (
                <tr key={field}>
                  <th scope="row" className={`${ROW_HEAD} align-top`}>
                    {label}
                  </th>
                  {chosen.map((system) => (
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
      )}
    </div>
  );
}
