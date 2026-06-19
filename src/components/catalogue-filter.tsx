"use client";

import { useMemo, useState, type ReactNode } from "react";
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
 */
export function CatalogueFilter({ entries }: { entries: CatalogueEntry[] }) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<DomainValue>("all");
  const [autonomy, setAutonomy] = useState<AutonomyMode | "all">("all");
  const [battlefieldFunction, setBattlefieldFunction] = useState<
    BattlefieldFunction | "all"
  >("all");
  const [counterUasOnly, setCounterUasOnly] = useState(false);
  const norm = query.trim().toLowerCase();

  const visible = useMemo(
    () =>
      new Set(
        entries
          .filter(
            (entry) =>
              (domain === "all" || entry.category === domain) &&
              (autonomy === "all" ||
                entry.autonomyModes?.includes(autonomy)) &&
              (battlefieldFunction === "all" ||
                entry.battlefieldFunctions?.includes(battlefieldFunction)) &&
              (!counterUasOnly || entry.hasCounterUas) &&
              (norm === "" || entry.haystack.includes(norm)),
          )
          .map((entry) => entry.slug),
      ),
    [entries, norm, domain, autonomy, battlefieldFunction, counterUasOnly],
  );

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
          {visible.size} / {entries.length}
        </span>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
