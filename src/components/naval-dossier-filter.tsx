"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  NAVAL_VESSEL_LABELS,
  NAVAL_VESSEL_ORDER,
} from "@/data/labels";
import type { NavalVesselClass } from "@/data/types";
import { SystemSchematic } from "@/components/system-schematic";

export interface NavalDossierListItem {
  slug: string;
  reference: string;
  name: string;
  flag: string;
  country: string;
  classLabel: string;
  navalVesselClass: NavalVesselClass;
}

type FilterValue = "all" | NavalVesselClass;

function primaryCountry(country: string): string {
  return country.split("·")[0]?.trim() ?? country;
}

function groupByCountry(dossiers: NavalDossierListItem[]) {
  const groups: { country: string; dossiers: NavalDossierListItem[] }[] = [];
  const byCountry = new Map<string, NavalDossierListItem[]>();

  for (const dossier of dossiers) {
    const country = primaryCountry(dossier.country);
    const existing = byCountry.get(country);

    if (existing) {
      existing.push(dossier);
    } else {
      const list = [dossier];
      byCountry.set(country, list);
      groups.push({ country, dossiers: list });
    }
  }

  return groups;
}

function NavalDossierCard({ dossier }: { dossier: NavalDossierListItem }) {
  return (
    <li className="bg-panel">
      <Link
        href={`/systemes/${dossier.slug}`}
        className="group flex items-center gap-4 p-5"
      >
        <SystemSchematic
          slug={dossier.slug}
          className="h-14 w-14 shrink-0 text-ink-faint transition-colors group-hover:text-accent"
        />
        <span className="flex-1">
          <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
            {dossier.reference}
          </span>
          <span className="block font-serif text-xl text-ink transition-colors group-hover:text-accent">
            {dossier.name}
          </span>
          <span className="block font-mono text-[10px] text-ink-faint">
            {dossier.flag} {dossier.country} · {dossier.classLabel}
          </span>
        </span>
        <span className="font-mono text-ink-faint transition-colors group-hover:text-accent">
          →
        </span>
      </Link>
    </li>
  );
}

export function NavalDossierFilter({
  dossiers,
}: {
  dossiers: NavalDossierListItem[];
}) {
  const [selectedType, setSelectedType] = useState<FilterValue>("all");

  // Les options restent dérivées des données, dans l'ordre naval centralisé.
  const typeOptions = useMemo(
    () =>
      NAVAL_VESSEL_ORDER.filter((navalClass) =>
        dossiers.some((dossier) => dossier.navalVesselClass === navalClass),
      ).map((navalClass) => ({
        value: navalClass,
        label: NAVAL_VESSEL_LABELS[navalClass],
      })),
    [dossiers],
  );

  const filteredDossiers = useMemo(
    () =>
      selectedType === "all"
        ? dossiers
        : dossiers.filter(
            (dossier) => dossier.navalVesselClass === selectedType,
          ),
    [dossiers, selectedType],
  );

  const groupedDossiers = useMemo(
    () => groupByCountry(filteredDossiers),
    [filteredDossiers],
  );

  const renderGrid = (items: NavalDossierListItem[]) => (
    <ul className="grid gap-px border border-line bg-line sm:grid-cols-2">
      {items.map((dossier) => (
        <NavalDossierCard key={dossier.slug} dossier={dossier} />
      ))}
    </ul>
  );

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 border border-line bg-panel px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <label
          htmlFor="naval-type-filter"
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint"
        >
          Filtrer par type de bâtiment
        </label>
        <select
          id="naval-type-filter"
          value={selectedType}
          onChange={(event) =>
            setSelectedType(event.target.value as FilterValue)
          }
          className="w-full border border-line-bright bg-surface px-3 py-2 font-mono text-xs text-ink outline-none transition-colors hover:border-accent focus:border-accent sm:w-[280px]"
        >
          <option value="all">Tous les types</option>
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filteredDossiers.length === 0 ? (
        <p className="mt-5 border border-dashed border-line-bright bg-panel/40 px-5 py-6 font-serif text-sm italic leading-relaxed text-ink-faint">
          Aucun bâtiment ne correspond à ce filtre.
        </p>
      ) : selectedType === "all" ? (
        <div className="mt-4">{renderGrid(filteredDossiers)}</div>
      ) : (
        <div className="mt-5 space-y-7">
          {groupedDossiers.map((group) => (
            <section key={group.country}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
                  {group.country}
                </h3>
                <span className="h-px flex-1 bg-line" />
              </div>
              {renderGrid(group.dossiers)}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
