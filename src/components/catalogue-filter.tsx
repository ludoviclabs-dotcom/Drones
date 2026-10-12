"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import type {
  AutonomyMode,
  BattlefieldFunction,
  SystemCategory,
} from "@/data/types";
import {
  AUTONOMY_MODE_LABELS,
  BATTLEFIELD_FUNCTION_LABELS,
} from "@/data/labels";
import { DomainChips, type DomainValue } from "./domain-filter";

const AUTONOMY_FILTERS = [
  "teleoperated",
  "manual-assisted",
  "autonomous-flight",
  "terminal-autonomy",
  "mission-autonomy",
  "swarm-ready",
] satisfies AutonomyMode[];

const FUNCTION_FILTERS = [
  "isr",
  "strike",
  "counter-uas",
  "air-defense",
  "ew",
  "relay-c2",
  "logistics",
  "maritime-support",
] satisfies BattlefieldFunction[];

// Une entrée du catalogue : la carte déjà rendue côté serveur, plus le texte
// indexable et le domaine qui servent au filtre.
export interface CatalogueEntry {
  slug: string;
  category: SystemCategory;
  autonomyModes?: AutonomyMode[];
  battlefieldFunctions?: BattlefieldFunction[];
  hasCounterUas?: boolean;
  haystack: string;
  card: ReactNode;
}

/**
 * Filtre du catalogue — domaine et recherche type-ahead. Les cartes restent
 * montées (les non concordantes sont seulement masquées) pour préserver le
 * tracé des schématiques déjà révélées.
 *
 * `initialLimit` : n'en montre d'abord que ce nombre (aperçu) ; un bouton
 * déplie le reste sur place, et toute recherche ou tout filtre déplie
 * d'office — un résultat ne doit jamais rester caché derrière l'aperçu.
 */
export function CatalogueFilter({
  entries,
  initialLimit,
}: {
  entries: CatalogueEntry[];
  initialLimit?: number;
}) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<DomainValue>("all");
  const [autonomy, setAutonomy] = useState<AutonomyMode | "all">("all");
  const [battlefieldFunction, setBattlefieldFunction] = useState<
    BattlefieldFunction | "all"
  >("all");
  const [counterUasOnly, setCounterUasOnly] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const gridId = useId();
  const norm = query.trim().toLowerCase();
  const filtering =
    norm !== "" ||
    domain !== "all" ||
    autonomy !== "all" ||
    battlefieldFunction !== "all" ||
    counterUasOnly;

  const matching = useMemo(
    () =>
      entries.filter(
        (entry) =>
          (domain === "all" || entry.category === domain) &&
          (autonomy === "all" || entry.autonomyModes?.includes(autonomy)) &&
          (battlefieldFunction === "all" ||
            entry.battlefieldFunctions?.includes(battlefieldFunction)) &&
          (!counterUasOnly || entry.hasCounterUas) &&
          (norm === "" || entry.haystack.includes(norm)),
      ),
    [entries, norm, domain, autonomy, battlefieldFunction, counterUasOnly],
  );
  const collapsed =
    initialLimit !== undefined && !expanded && !filtering;
  const shown = collapsed ? matching.slice(0, initialLimit) : matching;
  const visible = new Set(shown.map((entry) => entry.slug));
  const hiddenCount = matching.length - shown.length;

  const selectClass =
    "border border-line-bright bg-surface px-3 py-1.5 font-mono text-xs text-ink outline-none transition-colors hover:border-accent focus:border-accent";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border border-line bg-panel p-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          Filtrer
        </span>
        <DomainChips value={domain} onChange={setDomain} />
        <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          Autonomie
          <select
            value={autonomy}
            onChange={(event) =>
              setAutonomy(event.target.value as AutonomyMode | "all")
            }
            className={selectClass}
          >
            <option value="all">Toutes</option>
            {AUTONOMY_FILTERS.map((mode) => (
              <option key={mode} value={mode}>
                {AUTONOMY_MODE_LABELS[mode]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          Fonction
          <select
            value={battlefieldFunction}
            onChange={(event) =>
              setBattlefieldFunction(
                event.target.value as BattlefieldFunction | "all",
              )
            }
            className={selectClass}
          >
            <option value="all">Toutes</option>
            {FUNCTION_FILTERS.map((fn) => (
              <option key={fn} value={fn}>
                {BATTLEFIELD_FUNCTION_LABELS[fn]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          aria-pressed={counterUasOnly}
          onClick={() => setCounterUasOnly((value) => !value)}
          className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
            counterUasOnly
              ? "border-accent bg-accent text-bg"
              : "border-line-bright bg-surface text-ink-dim hover:border-accent hover:text-accent"
          }`}
        >
          C-UAS
        </button>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nom, pays, constructeur, classe…"
          aria-label="Filtrer le catalogue des systèmes"
          className="min-w-[200px] flex-1 border border-line-bright bg-surface px-3 py-1.5 font-mono text-xs text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <span className="font-mono text-[11px] text-ink-dim">
          {matching.length} / {entries.length}
        </span>
      </div>

      <div id={gridId} className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <div
            key={entry.slug}
            className={visible.has(entry.slug) ? undefined : "hidden"}
          >
            {entry.card}
          </div>
        ))}
      </div>

      {visible.size === 0 ? (
        <p className="mt-6 border border-dashed border-line-bright bg-panel/40 px-6 py-12 text-center font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
          Aucun système ne correspond à ces filtres
        </p>
      ) : null}

      {hiddenCount > 0 ? (
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <button
            type="button"
            aria-expanded={false}
            aria-controls={gridId}
            onClick={() => setExpanded(true)}
            className="inline-flex min-h-12 items-center justify-center border border-accent bg-accent px-6 font-mono text-xs uppercase tracking-[0.16em] text-bg transition-colors hover:border-ink hover:bg-ink"
          >
            Afficher les {hiddenCount} autres dossiers
          </button>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            Aperçu · {shown.length} dossiers sur {matching.length}
          </span>
        </div>
      ) : null}
      {expanded && initialLimit !== undefined && !filtering ? (
        <div className="mt-8">
          <button
            type="button"
            aria-expanded={true}
            aria-controls={gridId}
            onClick={() => setExpanded(false)}
            className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
          >
            Replier le catalogue ↑
          </button>
        </div>
      ) : null}
    </div>
  );
}
