"use client";

import { useEffect, useMemo, useState } from "react";
import type { Claim } from "@/lib/claims";
import {
  FRESHNESS_LABELS,
  FRESHNESS_TOKEN,
  SCOPE_LABELS,
  freshnessBand,
  isPrimaryClaim,
} from "@/lib/claims";
import { claimsToCsv, claimsToJson, downloadFile } from "@/lib/export";
import type { ClaimStatus } from "@/data/types";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/data/labels";
import { ConfidenceMark } from "./primitives";

const STATUS_TOKEN: Record<ClaimStatus, string> = {
  verifie: "var(--color-grade-a)",
  "a-recouper": "var(--color-grade-c)",
  variable: "var(--color-grade-d)",
};

const COLUMNS = [
  "Système",
  "Affirmation",
  "Brique",
  "Source",
  "Confiance",
  "Statut",
  "Fraîcheur",
];

const PAGE_SIZE = 60;

function Field({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border border-line-bright bg-surface px-2.5 py-1.5 font-mono text-xs text-ink"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ConsoleTable({ claims }: { claims: Claim[] }) {
  const [domain, setDomain] = useState("all");
  const [system, setSystem] = useState("all");
  const [scope, setScope] = useState("all");
  const [confidence, setConfidence] = useState("all");
  const [status, setStatus] = useState("all");
  const [sourceType, setSourceType] = useState("all");
  const [freshness, setFreshness] = useState("all");
  const [page, setPage] = useState(1);

  const systemNames = useMemo(
    () => Array.from(new Set(claims.map((claim) => claim.systemName))),
    [claims],
  );

  const filtered = useMemo(
    () =>
      claims.filter((claim) => {
        if (domain !== "all" && claim.category !== domain) return false;
        if (system !== "all" && claim.systemName !== system) return false;
        if (scope !== "all" && claim.scope !== scope) return false;
        if (confidence !== "all" && claim.confidence !== confidence) return false;
        if (status !== "all" && claim.status !== status) return false;
        if (sourceType !== "all") {
          const primary = isPrimaryClaim(claim);
          if (sourceType === "primaire" && !primary) return false;
          if (sourceType === "secondaire" && primary) return false;
        }
        if (freshness !== "all" && freshnessBand(claim.date) !== freshness) {
          return false;
        }
        return true;
      }),
    [claims, domain, system, scope, confidence, status, sourceType, freshness],
  );

  // Pagination : un changement de filtre ramène en page 1 ; l'export reste sur
  // l'intégralité du jeu filtré (pas seulement la page visible).
  useEffect(() => {
    setPage(1);
  }, [domain, system, scope, confidence, status, sourceType, freshness]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 border border-line bg-panel p-4">
        <Field
          label="Domaine"
          value={domain}
          onChange={setDomain}
          options={[
            { value: "all", label: "Tous" },
            ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
        <Field
          label="Système"
          value={system}
          onChange={setSystem}
          options={[
            { value: "all", label: "Tous" },
            ...systemNames.map((name) => ({ value: name, label: name })),
          ]}
        />
        <Field
          label="Brique"
          value={scope}
          onChange={setScope}
          options={[
            { value: "all", label: "Toutes" },
            ...Object.entries(SCOPE_LABELS).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
        <Field
          label="Confiance"
          value={confidence}
          onChange={setConfidence}
          options={[
            { value: "all", label: "Toutes" },
            { value: "haute", label: "Haute" },
            { value: "moyenne", label: "Moyenne" },
            { value: "faible", label: "Faible" },
          ]}
        />
        <Field
          label="Statut"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "Tous" },
            ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
        <Field
          label="Sources"
          value={sourceType}
          onChange={setSourceType}
          options={[
            { value: "all", label: "Toutes" },
            { value: "primaire", label: "Primaires" },
            { value: "secondaire", label: "Secondaires" },
          ]}
        />
        <Field
          label="Fraîcheur"
          value={freshness}
          onChange={setFreshness}
          options={[
            { value: "all", label: "Toutes" },
            ...Object.entries(FRESHNESS_LABELS).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
        <div className="ml-auto flex items-center gap-3">
          <span className="font-mono text-[11px] text-ink-dim">
            {filtered.length} / {claims.length} affirmations
          </span>
          <button
            type="button"
            onClick={() =>
              downloadFile(
                "panoplie-console-claims.csv",
                "text/csv;charset=utf-8",
                claimsToCsv(filtered),
              )
            }
            disabled={filtered.length === 0}
            className="h-9 border border-accent px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent hover:text-bg disabled:cursor-not-allowed disabled:opacity-40"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() =>
              downloadFile(
                "panoplie-console-claims.json",
                "application/json",
                claimsToJson(filtered),
              )
            }
            disabled={filtered.length === 0}
            className="h-9 border border-line-bright px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Export JSON
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto border border-line">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="border-b border-line bg-surface-2">
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((claim) => (
              <tr
                key={`${claim.systemSlug}-${claim.scope}-${claim.label}`}
                className="border-b border-line align-top last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="font-mono text-[10px] tracking-wide text-accent">
                    {claim.systemReference}
                  </div>
                  <div className="font-mono text-xs text-ink-dim">
                    {claim.systemName}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-mono text-xs text-ink">{claim.label}</div>
                  <div className="mt-0.5 font-mono text-xs text-ink-dim">
                    {claim.value}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-ink-dim">
                  {SCOPE_LABELS[claim.scope]}
                </td>
                <td className="px-4 py-3">
                  {claim.sources.length > 0 ? (
                    <ul className="space-y-1">
                      {claim.sources.map((source) => (
                        <li key={source.id} className="font-mono text-[11px]">
                          {source.url ? (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-ink-dim transition-colors hover:text-accent"
                            >
                              {source.publisher} ↗
                            </a>
                          ) : (
                            <span className="text-ink-dim">
                              {source.publisher}
                            </span>
                          )}
                          <span
                            className="ml-1 text-ink-faint"
                            title={`Fiabilité ${source.reliability}`}
                          >
                            · {source.reliability}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="font-mono text-[11px] text-ink-faint">
                      —
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <ConfidenceMark confidence={claim.confidence} />
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-dim">
                    <span
                      className="h-2 w-2 shrink-0"
                      style={{ backgroundColor: STATUS_TOKEN[claim.status] }}
                    />
                    {STATUS_LABELS[claim.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-dim">
                    <span
                      className="h-2 w-2 shrink-0"
                      style={{
                        backgroundColor: FRESHNESS_TOKEN[freshnessBand(claim.date)],
                      }}
                    />
                    {FRESHNESS_LABELS[freshnessBand(claim.date)]}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-4 py-10 text-center font-mono text-xs text-ink-faint"
                >
                  Aucune affirmation pour ces filtres.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {pageCount > 1 ? (
        <nav
          aria-label="Pagination du registre"
          className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-ink-dim"
        >
          <span>
            {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} sur{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="h-9 border border-line-bright px-3 uppercase tracking-[0.14em] transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Précédent
            </button>
            <span>
              Page {currentPage} / {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={currentPage >= pageCount}
              className="h-9 border border-line-bright px-3 uppercase tracking-[0.14em] transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              Suivant →
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
