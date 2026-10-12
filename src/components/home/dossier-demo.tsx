"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type {
  BrickKey,
  ClaimStatus,
  Confidence,
  Grade,
  ScoreKey,
} from "@/data/types";
import { CONFIDENCE_META, STATUS_LABELS } from "@/data/labels";
import { ConfidenceMark, GradeBadge } from "@/components/primitives";

export interface DemoSource {
  publisher: string;
  type: string;
  reliability: string;
}

export interface DemoIndicator {
  label: string;
  value: string;
  confidence: Confidence;
  status: ClaimStatus;
  note?: string;
  sources: DemoSource[];
}

export interface DemoAngle {
  key: BrickKey;
  num: string;
  label: string;
  /** Première phrase du narratif, affichée sur l'onglet. */
  lede: string;
  narrative: string;
  indicators: DemoIndicator[];
}

export interface DemoScore {
  key: ScoreKey;
  label: string;
  grade: Grade;
}

export interface DossierDemoProps {
  system: {
    slug: string;
    name: string;
    reference: string;
    manufacturer: string;
    classLabel: string;
    /** Date de révision du dossier, déjà mise en forme. */
    updatedLabel?: string;
  };
  angles: DemoAngle[];
  scores: DemoScore[];
}

/**
 * Démonstration de l'accueil : un dossier réel lu à travers ses cinq angles.
 * Rail d'onglets (rôle tablist, flèches, Début/Fin) et panneau unique, remonté
 * à chaque changement pour rejouer ses entrées courtes (fondu, remplissage des
 * barres) — tout cela sous `.motion-ready` seulement.
 */
export function DossierDemo({ system, angles, scores }: DossierDemoProps) {
  const [index, setIndex] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const angle = angles[index] ?? angles[0];

  function focusTab(next: number) {
    const target = (next + angles.length) % angles.length;
    setIndex(target);
    tabsRef.current[target]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(angles.length - 1);
        break;
      default:
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-14">
      <div
        role="tablist"
        aria-label="Les cinq angles de lecture"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="flex flex-col border-b border-line"
      >
        {angles.map((item, i) => {
          const selected = i === index;
          return (
            <button
              key={item.key}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.key}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setIndex(i)}
              className={`relative flex w-full items-start gap-4 border-t border-line py-4 pl-6 text-left transition-colors ${
                selected ? "text-ink" : "text-ink-dim hover:text-ink"
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute -top-px bottom-0 left-0 w-0.5 origin-top bg-accent motion-safe:transition-transform ${
                  selected ? "scale-y-100" : "scale-y-0"
                }`}
              />
              <span className="w-6 shrink-0 pt-1 font-mono text-xs text-accent">
                {item.num}
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="font-serif text-2xl leading-tight">
                  {item.label}
                </span>
                <span className="font-sans text-sm leading-relaxed text-ink-faint">
                  {item.lede}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <article
        key={angle.key}
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${angle.key}`}
        aria-live="polite"
        className="home-fade flex min-w-0 flex-col border border-line-bright bg-panel"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
          <span>
            <span className="text-accent">{system.reference}</span> · {system.name}{" "}
            · {system.manufacturer} · {system.classLabel}
          </span>
          {system.updatedLabel ? (
            <span>Dossier révisé le {system.updatedLabel}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 px-6 pt-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            Angle {angle.num} — {angle.label}
          </p>
          <p className="whitespace-pre-line font-serif text-lg leading-relaxed text-ink sm:text-xl">
            {angle.narrative}
          </p>
        </div>

        <dl className="mt-6 border-t border-line">
          {angle.indicators.map((indicator, i) => (
            <div
              key={indicator.label}
              className="grid gap-x-4 gap-y-2 border-b border-line px-6 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_auto]"
            >
              <dt className="pt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                {indicator.label}
              </dt>
              <dd className="flex flex-col gap-1.5">
                <span className="font-sans text-[15px] leading-relaxed text-ink">
                  {indicator.value}
                </span>
                {indicator.note ? (
                  <span className="font-serif text-sm italic text-ink-dim">
                    {indicator.note}
                  </span>
                ) : null}
                {indicator.sources.length ? (
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                    Source :{" "}
                    {indicator.sources
                      .map(
                        (source) =>
                          `${source.publisher} · ${source.type} · fiabilité ${source.reliability}`,
                      )
                      .join(" ; ")}
                  </span>
                ) : null}
              </dd>
              <dd className="flex flex-col items-start gap-1.5 sm:items-end">
                <span
                  className="home-fill inline-flex"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <ConfidenceMark confidence={indicator.confidence} />
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
                    indicator.status === "variable"
                      ? "text-[var(--color-grade-c)]"
                      : "text-ink-faint"
                  }`}
                >
                  {indicator.status === "variable"
                    ? STATUS_LABELS.variable
                    : CONFIDENCE_META[indicator.confidence].label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
          <ul
            className="flex flex-wrap gap-x-3 gap-y-1.5"
            aria-label={`Paliers d'évaluation — ${system.name}`}
          >
            {scores.map((score) => (
              <li
                key={score.key}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-dim"
              >
                <GradeBadge grade={score.grade} size="sm" />
                {score.label}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href={`/systemes/${system.slug}`}
              className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
            >
              Ouvrir le dossier complet →
            </Link>
            <Link
              href="/comparateur"
              className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
            >
              Comparer
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
