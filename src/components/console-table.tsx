"use client";

import { useMemo, useState } from "react";
import type { Claim, ClaimScope } from "@/lib/claims";
import type { ClaimStatus } from "@/data/types";
import { BRICK_LABELS, CATEGORY_LABELS, STATUS_LABELS } from "@/data/labels";
import { ConfidenceMark } from "./primitives";

const SCOPE_LABELS: Record<ClaimScope, string> = {
  ...BRICK_LABELS,
  specs: "Caractéristiques",
  contraintes: "Contraintes physiques",
  versions: "Versions & standards",
};

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
];

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

  const systemNames = useMemo(
    () => Array.from(new Set(claims.map((claim) => claim.systemName))),
    [claims],
  );

  const filtered = useMemo(
    () =>
      claims.filter(
        (claim) =>
          (domain === "all" || claim.category === domain) &&
          (system === "all" || claim.systemName === system) &&
          (scope === "all" || claim.scope === scope) &&
          (confidence === "all" || claim.confidence === confidence) &&
          (status === "all" || claim.status === status),
      ),
    [claims, domain, system, scope, confidence, status],
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
        <span className="ml-auto font-mono text-[11px] text-ink-dim">
          {filtered.length} / {claims.length} affirmations
        </span>
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
            {filtered.map((claim) => (
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
    </div>
  );
}
