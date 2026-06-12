"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ARTILLERY_ARCHITECTURE_LABELS,
  ARTILLERY_BARREL_LABELS,
  ARTILLERY_CALIBER_LABELS,
  ARTILLERY_CARRIER_LABELS,
  ARTILLERY_LOADING_LABELS,
} from "@/data/labels";
import type {
  ArtilleryArchitecture,
  ArtilleryBarrelLength,
  ArtilleryCaliber,
  ArtilleryCarrier,
  ArtilleryLoading,
} from "@/data/types";
import { SystemSchematic } from "@/components/system-schematic";

export interface ArtilleryDossierListItem {
  slug: string;
  reference: string;
  name: string;
  flag: string;
  country: string;
  classLabel: string;
  carrier: ArtilleryCarrier;
  architecture: ArtilleryArchitecture;
  caliber: ArtilleryCaliber;
  barrelLength: ArtilleryBarrelLength;
  loading: ArtilleryLoading;
}

type CarrierFilter = "all" | ArtilleryCarrier;
type ArchitectureFilter = "all" | ArtilleryArchitecture;
type CaliberFilter = "all" | ArtilleryCaliber;
type LoadingFilter = "all" | ArtilleryLoading;
type CountryFilter = "all" | string;

const CARRIER_ORDER: ArtilleryCarrier[] = [
  "tracked-heavy",
  "truck-4x4",
  "truck-6x6",
  "truck-8x8",
  "armored-8x8",
  "light-vehicle",
  "towed",
];

const ARCHITECTURE_ORDER: ArtilleryArchitecture[] = [
  "open-mount",
  "protected-cab",
  "protected-turret",
  "remote-module",
  "light-system",
];

const CALIBER_ORDER: ArtilleryCaliber[] = ["105mm", "122mm", "152mm", "155mm"];
const LOADING_ORDER: ArtilleryLoading[] = [
  "manual",
  "assisted",
  "semi-automatic",
  "automatic",
];

function primaryCountry(country: string): string {
  return country.split("·")[0]?.trim() ?? country;
}

function groupByCountry(dossiers: ArtilleryDossierListItem[]) {
  const groups: { country: string; dossiers: ArtilleryDossierListItem[] }[] = [];
  const byCountry = new Map<string, ArtilleryDossierListItem[]>();

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

function ArtilleryDossierCard({ dossier }: { dossier: ArtilleryDossierListItem }) {
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
            {dossier.flag} {dossier.country} · {ARTILLERY_CARRIER_LABELS[dossier.carrier]}
          </span>
          <span className="mt-1 block font-mono text-[10px] text-ink-faint">
            {ARTILLERY_CALIBER_LABELS[dossier.caliber]} ·{" "}
            {ARTILLERY_BARREL_LABELS[dossier.barrelLength]} ·{" "}
            {ARTILLERY_LOADING_LABELS[dossier.loading]}
          </span>
        </span>
        <span className="font-mono text-ink-faint transition-colors group-hover:text-accent">
          →
        </span>
      </Link>
    </li>
  );
}

export function ArtilleryDossierFilter({
  dossiers,
}: {
  dossiers: ArtilleryDossierListItem[];
}) {
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierFilter>("all");
  const [selectedArchitecture, setSelectedArchitecture] =
    useState<ArchitectureFilter>("all");
  const [selectedCaliber, setSelectedCaliber] = useState<CaliberFilter>("all");
  const [selectedLoading, setSelectedLoading] = useState<LoadingFilter>("all");
  const [selectedCountry, setSelectedCountry] = useState<CountryFilter>("all");

  const carrierOptions = useMemo(
    () =>
      CARRIER_ORDER.filter((carrier) =>
        dossiers.some((dossier) => dossier.carrier === carrier),
      ).map((carrier) => ({
        value: carrier,
        label: ARTILLERY_CARRIER_LABELS[carrier],
      })),
    [dossiers],
  );

  const architectureOptions = useMemo(
    () =>
      ARCHITECTURE_ORDER.filter((architecture) =>
        dossiers.some((dossier) => dossier.architecture === architecture),
      ).map((architecture) => ({
        value: architecture,
        label: ARTILLERY_ARCHITECTURE_LABELS[architecture],
      })),
    [dossiers],
  );

  const caliberOptions = useMemo(
    () =>
      CALIBER_ORDER.filter((caliber) =>
        dossiers.some((dossier) => dossier.caliber === caliber),
      ).map((caliber) => ({
        value: caliber,
        label: ARTILLERY_CALIBER_LABELS[caliber],
      })),
    [dossiers],
  );

  const loadingOptions = useMemo(
    () =>
      LOADING_ORDER.filter((loading) =>
        dossiers.some((dossier) => dossier.loading === loading),
      ).map((loading) => ({
        value: loading,
        label: ARTILLERY_LOADING_LABELS[loading],
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
        const carrierMatch =
          selectedCarrier === "all" || dossier.carrier === selectedCarrier;
        const architectureMatch =
          selectedArchitecture === "all" ||
          dossier.architecture === selectedArchitecture;
        const caliberMatch =
          selectedCaliber === "all" || dossier.caliber === selectedCaliber;
        const loadingMatch =
          selectedLoading === "all" || dossier.loading === selectedLoading;
        const countryMatch =
          selectedCountry === "all" ||
          primaryCountry(dossier.country) === selectedCountry;

        return (
          carrierMatch &&
          architectureMatch &&
          caliberMatch &&
          loadingMatch &&
          countryMatch
        );
      }),
    [
      dossiers,
      selectedArchitecture,
      selectedCaliber,
      selectedCarrier,
      selectedCountry,
      selectedLoading,
    ],
  );

  const groupedDossiers = useMemo(
    () => groupByCountry(filteredDossiers),
    [filteredDossiers],
  );

  const renderGrid = (items: ArtilleryDossierListItem[]) => (
    <ul className="grid gap-px border border-line bg-line sm:grid-cols-2">
      {items.map((dossier) => (
        <ArtilleryDossierCard key={dossier.slug} dossier={dossier} />
      ))}
    </ul>
  );

  return (
    <div className="mt-6">
      <div className="grid gap-3 border border-line bg-panel px-4 py-3 md:grid-cols-5">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Porteur
          </span>
          <select
            value={selectedCarrier}
            onChange={(event) =>
              setSelectedCarrier(event.target.value as CarrierFilter)
            }
            className="mt-2 w-full border border-line-bright bg-surface px-3 py-2 font-mono text-xs text-ink outline-none transition-colors hover:border-accent focus:border-accent"
          >
            <option value="all">Tous les porteurs</option>
            {carrierOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Architecture
          </span>
          <select
            value={selectedArchitecture}
            onChange={(event) =>
              setSelectedArchitecture(event.target.value as ArchitectureFilter)
            }
            className="mt-2 w-full border border-line-bright bg-surface px-3 py-2 font-mono text-xs text-ink outline-none transition-colors hover:border-accent focus:border-accent"
          >
            <option value="all">Toutes les architectures</option>
            {architectureOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Calibre
          </span>
          <select
            value={selectedCaliber}
            onChange={(event) =>
              setSelectedCaliber(event.target.value as CaliberFilter)
            }
            className="mt-2 w-full border border-line-bright bg-surface px-3 py-2 font-mono text-xs text-ink outline-none transition-colors hover:border-accent focus:border-accent"
          >
            <option value="all">Tous les calibres</option>
            {caliberOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Automatisation
          </span>
          <select
            value={selectedLoading}
            onChange={(event) =>
              setSelectedLoading(event.target.value as LoadingFilter)
            }
            className="mt-2 w-full border border-line-bright bg-surface px-3 py-2 font-mono text-xs text-ink outline-none transition-colors hover:border-accent focus:border-accent"
          >
            <option value="all">Tous les chargements</option>
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
          Aucun dossier artillerie ne correspond à ces filtres.
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
