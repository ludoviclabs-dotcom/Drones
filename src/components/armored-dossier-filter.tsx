"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ARMORED_APS_LABELS,
  ARMORED_FAMILY_LABELS,
  ARMORED_LOADING_LABELS,
  ARMORED_STATUS_LABELS,
} from "@/data/labels";
import type {
  ArmoredApsStatus,
  ArmoredLoading,
  ArmoredProgramStatus,
  ArmoredVehicleFamily,
} from "@/data/types";
import { SystemSchematic } from "@/components/system-schematic";

export interface ArmoredDossierListItem {
  slug: string;
  reference: string;
  name: string;
  flag: string;
  country: string;
  manufacturer: string;
  classLabel: string;
  family: ArmoredVehicleFamily;
  programStatus: ArmoredProgramStatus;
  apsStatus: ArmoredApsStatus;
  loading: ArmoredLoading;
}

type FamilyFilter = "all" | ArmoredVehicleFamily;
type StatusFilter = "all" | ArmoredProgramStatus;
type ApsFilter = "all" | ArmoredApsStatus;
type LoadingFilter = "all" | ArmoredLoading;
type CountryFilter = "all" | string;
type ManufacturerFilter = "all" | string;

const FAMILY_ORDER: ArmoredVehicleFamily[] = [
  "MBT",
  "light-tank",
  "IFV",
  "APC",
  "support-vehicle",
  "program",
];

const STATUS_ORDER: ArmoredProgramStatus[] = [
  "modernized",
  "new-standard",
  "future-program",
  "low-transparency",
];

const APS_ORDER: ArmoredApsStatus[] = [
  "integrated",
  "optional",
  "planned",
  "none-public",
  "unknown",
];

const LOADING_ORDER: ArmoredLoading[] = [
  "manual",
  "automatic",
  "assisted",
  "unknown",
];

function primaryCountry(country: string): string {
  return country.split("·")[0]?.trim() ?? country;
}

function groupByCountry(dossiers: ArmoredDossierListItem[]) {
  const groups: { country: string; dossiers: ArmoredDossierListItem[] }[] = [];
  const byCountry = new Map<string, ArmoredDossierListItem[]>();

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

function ArmoredDossierCard({ dossier }: { dossier: ArmoredDossierListItem }) {
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
            {dossier.flag} {dossier.country} · {ARMORED_FAMILY_LABELS[dossier.family]}
          </span>
          <span className="mt-1 block font-mono text-[10px] text-ink-faint">
            {ARMORED_STATUS_LABELS[dossier.programStatus]} ·{" "}
            {ARMORED_APS_LABELS[dossier.apsStatus]} ·{" "}
            {ARMORED_LOADING_LABELS[dossier.loading]}
          </span>
        </span>
        <span className="font-mono text-ink-faint transition-colors group-hover:text-accent">
          -&gt;
        </span>
      </Link>
    </li>
  );
}

function selectClassName() {
  return "mt-2 w-full border border-line-bright bg-surface px-3 py-2 font-mono text-xs text-ink outline-none transition-colors hover:border-accent focus:border-accent";
}

export function ArmoredDossierFilter({
  dossiers,
}: {
  dossiers: ArmoredDossierListItem[];
}) {
  const [selectedFamily, setSelectedFamily] = useState<FamilyFilter>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
  const [selectedAps, setSelectedAps] = useState<ApsFilter>("all");
  const [selectedLoading, setSelectedLoading] = useState<LoadingFilter>("all");
  const [selectedCountry, setSelectedCountry] = useState<CountryFilter>("all");
  const [selectedManufacturer, setSelectedManufacturer] =
    useState<ManufacturerFilter>("all");

  const familyOptions = useMemo(
    () =>
      FAMILY_ORDER.filter((family) =>
        dossiers.some((dossier) => dossier.family === family),
      ).map((family) => ({
        value: family,
        label: ARMORED_FAMILY_LABELS[family],
      })),
    [dossiers],
  );

  const statusOptions = useMemo(
    () =>
      STATUS_ORDER.filter((status) =>
        dossiers.some((dossier) => dossier.programStatus === status),
      ).map((status) => ({
        value: status,
        label: ARMORED_STATUS_LABELS[status],
      })),
    [dossiers],
  );

  const apsOptions = useMemo(
    () =>
      APS_ORDER.filter((apsStatus) =>
        dossiers.some((dossier) => dossier.apsStatus === apsStatus),
      ).map((apsStatus) => ({
        value: apsStatus,
        label: ARMORED_APS_LABELS[apsStatus],
      })),
    [dossiers],
  );

  const loadingOptions = useMemo(
    () =>
      LOADING_ORDER.filter((loading) =>
        dossiers.some((dossier) => dossier.loading === loading),
      ).map((loading) => ({
        value: loading,
        label: ARMORED_LOADING_LABELS[loading],
      })),
    [dossiers],
  );

  const countryOptions = useMemo(
    () =>
      Array.from(
        new Set(dossiers.map((dossier) => primaryCountry(dossier.country))),
      ).map((country) => ({ value: country, label: country })),
    [dossiers],
  );

  const manufacturerOptions = useMemo(
    () =>
      Array.from(new Set(dossiers.map((dossier) => dossier.manufacturer))).map(
        (manufacturer) => ({ value: manufacturer, label: manufacturer }),
      ),
    [dossiers],
  );

  const filteredDossiers = useMemo(
    () =>
      dossiers.filter((dossier) => {
        const familyMatch =
          selectedFamily === "all" || dossier.family === selectedFamily;
        const statusMatch =
          selectedStatus === "all" || dossier.programStatus === selectedStatus;
        const apsMatch =
          selectedAps === "all" || dossier.apsStatus === selectedAps;
        const loadingMatch =
          selectedLoading === "all" || dossier.loading === selectedLoading;
        const countryMatch =
          selectedCountry === "all" ||
          primaryCountry(dossier.country) === selectedCountry;
        const manufacturerMatch =
          selectedManufacturer === "all" ||
          dossier.manufacturer === selectedManufacturer;

        return (
          familyMatch &&
          statusMatch &&
          apsMatch &&
          loadingMatch &&
          countryMatch &&
          manufacturerMatch
        );
      }),
    [
      dossiers,
      selectedAps,
      selectedCountry,
      selectedFamily,
      selectedLoading,
      selectedManufacturer,
      selectedStatus,
    ],
  );

  const groupedDossiers = useMemo(
    () => groupByCountry(filteredDossiers),
    [filteredDossiers],
  );

  const renderGrid = (items: ArmoredDossierListItem[]) => (
    <ul className="grid gap-px border border-line bg-line sm:grid-cols-2">
      {items.map((dossier) => (
        <ArmoredDossierCard key={dossier.slug} dossier={dossier} />
      ))}
    </ul>
  );

  return (
    <div className="mt-6">
      <div className="grid gap-3 border border-line bg-panel px-4 py-3 md:grid-cols-3 xl:grid-cols-6">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Famille
          </span>
          <select
            value={selectedFamily}
            onChange={(event) =>
              setSelectedFamily(event.target.value as FamilyFilter)
            }
            className={selectClassName()}
          >
            <option value="all">Toutes les familles</option>
            {familyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Statut
          </span>
          <select
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value as StatusFilter)
            }
            className={selectClassName()}
          >
            <option value="all">Tous les statuts</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            APS
          </span>
          <select
            value={selectedAps}
            onChange={(event) => setSelectedAps(event.target.value as ApsFilter)}
            className={selectClassName()}
          >
            <option value="all">Tous les APS</option>
            {apsOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Chargeur
          </span>
          <select
            value={selectedLoading}
            onChange={(event) =>
              setSelectedLoading(event.target.value as LoadingFilter)
            }
            className={selectClassName()}
          >
            <option value="all">Tous les chargeurs</option>
            {loadingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Pays
          </span>
          <select
            value={selectedCountry}
            onChange={(event) => setSelectedCountry(event.target.value)}
            className={selectClassName()}
          >
            <option value="all">Tous les pays</option>
            {countryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Constructeur
          </span>
          <select
            value={selectedManufacturer}
            onChange={(event) => setSelectedManufacturer(event.target.value)}
            className={selectClassName()}
          >
            <option value="all">Tous les constructeurs</option>
            {manufacturerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredDossiers.length === 0 ? (
        <p className="mt-5 border border-dashed border-line-bright bg-panel/40 px-5 py-6 font-serif text-sm italic leading-relaxed text-ink-faint">
          Aucun dossier blinde ne correspond a ces filtres.
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
