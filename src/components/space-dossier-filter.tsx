"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  SPACE_MISSION_LABELS,
  SPACE_ORBIT_LABELS,
  SPACE_PAYLOAD_LABELS,
} from "@/data/labels";
import type {
  SpaceMission,
  SpaceOrbitClass,
  SpacePayloadType,
} from "@/data/types";
import { SystemSchematic } from "@/components/system-schematic";

export interface SpaceDossierListItem {
  slug: string;
  reference: string;
  name: string;
  flag: string;
  country: string;
  classLabel: string;
  missions: SpaceMission[];
  orbits: SpaceOrbitClass[];
  payloads: SpacePayloadType[];
}

type MissionFilter = "all" | SpaceMission;
type OrbitFilter = "all" | SpaceOrbitClass;
type CountryFilter = "all" | string;

const MISSION_ORDER: SpaceMission[] = [
  "observation",
  "sigint",
  "satcom",
  "pnt",
  "missile-warning",
  "sda-ssa",
  "metoc",
  "maritime-surveillance",
  "data-relay",
];

const ORBIT_ORDER: SpaceOrbitClass[] = [
  "LEO",
  "MEO",
  "GEO",
  "GSO",
  "SSO",
  "polar",
  "HEO",
  "Molniya",
  "multi-orbit",
  "ground-network",
  "unknown",
];

function primaryCountry(country: string): string {
  return country.split("·")[0]?.trim() ?? country;
}

function groupByCountry(dossiers: SpaceDossierListItem[]) {
  const groups: { country: string; dossiers: SpaceDossierListItem[] }[] = [];
  const byCountry = new Map<string, SpaceDossierListItem[]>();

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

function SpaceDossierCard({ dossier }: { dossier: SpaceDossierListItem }) {
  const missionLabels = dossier.missions
    .map((mission) => SPACE_MISSION_LABELS[mission])
    .join(" · ");
  const orbitLabels = dossier.orbits
    .map((orbit) => SPACE_ORBIT_LABELS[orbit])
    .join(" · ");
  const payloadLabels = dossier.payloads
    .map((payload) => SPACE_PAYLOAD_LABELS[payload])
    .join(" · ");

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
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
            {dossier.reference}
          </span>
          <span className="block font-serif text-xl text-ink transition-colors group-hover:text-accent">
            {dossier.name}
          </span>
          <span className="block font-mono text-[10px] text-ink-faint">
            {dossier.flag} {dossier.country} · {missionLabels}
          </span>
          <span className="mt-1 block font-mono text-[10px] text-ink-faint">
            {orbitLabels} · {payloadLabels}
          </span>
        </span>
        <span className="font-mono text-ink-faint transition-colors group-hover:text-accent">
          →
        </span>
      </Link>
    </li>
  );
}

export function SpaceDossierFilter({
  dossiers,
}: {
  dossiers: SpaceDossierListItem[];
}) {
  const [selectedMission, setSelectedMission] = useState<MissionFilter>("all");
  const [selectedOrbit, setSelectedOrbit] = useState<OrbitFilter>("all");
  const [selectedCountry, setSelectedCountry] = useState<CountryFilter>("all");

  const missionOptions = useMemo(
    () =>
      MISSION_ORDER.filter((mission) =>
        dossiers.some((dossier) => dossier.missions.includes(mission)),
      ).map((mission) => ({
        value: mission,
        label: SPACE_MISSION_LABELS[mission],
      })),
    [dossiers],
  );

  const orbitOptions = useMemo(
    () =>
      ORBIT_ORDER.filter((orbit) =>
        dossiers.some((dossier) => dossier.orbits.includes(orbit)),
      ).map((orbit) => ({
        value: orbit,
        label: SPACE_ORBIT_LABELS[orbit],
      })),
    [dossiers],
  );

  const countryOptions = useMemo(
    () =>
      Array.from(new Set(dossiers.map((dossier) => primaryCountry(dossier.country)))).map(
        (country) => ({ value: country, label: country }),
      ),
    [dossiers],
  );

  const filteredDossiers = useMemo(
    () =>
      dossiers.filter((dossier) => {
        const missionMatch =
          selectedMission === "all" || dossier.missions.includes(selectedMission);
        const orbitMatch =
          selectedOrbit === "all" || dossier.orbits.includes(selectedOrbit);
        const countryMatch =
          selectedCountry === "all" ||
          primaryCountry(dossier.country) === selectedCountry;
        return missionMatch && orbitMatch && countryMatch;
      }),
    [dossiers, selectedCountry, selectedMission, selectedOrbit],
  );

  const groupedDossiers = useMemo(
    () => groupByCountry(filteredDossiers),
    [filteredDossiers],
  );

  const renderGrid = (items: SpaceDossierListItem[]) => (
    <ul className="grid gap-px border border-line bg-line sm:grid-cols-2">
      {items.map((dossier) => (
        <SpaceDossierCard key={dossier.slug} dossier={dossier} />
      ))}
    </ul>
  );

  return (
    <div className="mt-6">
      <div className="grid gap-3 border border-line bg-panel px-4 py-3 md:grid-cols-3">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Mission
          </span>
          <select
            value={selectedMission}
            onChange={(event) =>
              setSelectedMission(event.target.value as MissionFilter)
            }
            className="mt-2 w-full border border-line-bright bg-surface px-3 py-2 font-mono text-xs text-ink outline-none transition-colors hover:border-accent focus:border-accent"
          >
            <option value="all">Toutes les missions</option>
            {missionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Orbite
          </span>
          <select
            value={selectedOrbit}
            onChange={(event) =>
              setSelectedOrbit(event.target.value as OrbitFilter)
            }
            className="mt-2 w-full border border-line-bright bg-surface px-3 py-2 font-mono text-xs text-ink outline-none transition-colors hover:border-accent focus:border-accent"
          >
            <option value="all">Toutes les orbites</option>
            {orbitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Pays / organisation
          </span>
          <select
            value={selectedCountry}
            onChange={(event) => setSelectedCountry(event.target.value)}
            className="mt-2 w-full border border-line-bright bg-surface px-3 py-2 font-mono text-xs text-ink outline-none transition-colors hover:border-accent focus:border-accent"
          >
            <option value="all">Tous les pays</option>
            {countryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredDossiers.length === 0 ? (
        <p className="mt-5 border border-dashed border-line-bright bg-panel/40 px-5 py-6 font-serif text-sm italic leading-relaxed text-ink-faint">
          Aucun dossier spatial ne correspond à ces filtres.
        </p>
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
