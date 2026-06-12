"use client";

import type { SystemCategory } from "@/data/types";
import { CATEGORY_LABELS } from "@/data/labels";
import { DOMAINS } from "@/data/domains";

export type DomainValue = SystemCategory | "all";

const OPTIONS: { value: DomainValue; label: string }[] = [
  { value: "all", label: "Tous les domaines" },
  ...DOMAINS.map((domain) => ({
    value: domain.category,
    label: CATEGORY_LABELS[domain.category],
  })),
];

/** Jeu de puces de filtrage par domaine — catalogue Panoplie complet. */
export function DomainChips({
  value,
  onChange,
}: {
  value: DomainValue;
  onChange: (value: DomainValue) => void;
}) {
  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="group"
      aria-label="Filtrer par domaine"
    >
      {OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
              isActive
                ? "border-accent bg-accent/10 text-accent"
                : "border-line-bright text-ink-dim hover:border-ink-faint hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
