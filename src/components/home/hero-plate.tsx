import Image from "next/image";
import Link from "next/link";
import type { HudBoard } from "@/data/hud/boards";
import type { DefenseSystem } from "@/data/types";
import { RegistrationMarks } from "@/components/registration-marks";

/**
 * Visuel majeur du hero : la planche technique la plus récente, annotée de
 * trois repères tirés des caractéristiques du dossier qu'elle illustre, reliés
 * à l'image par des tracés SVG dessinés à l'entrée dans la fenêtre
 * (`[data-draw]`, le langage de mouvement des schématiques).
 *
 * Aucune 3D ici : la vignette WebP et son lien suffisent ; la planche se charge
 * sur sa propre page. Toute la carte est cliquable par le lien étiré du titre,
 * les entrées de scénario passent au-dessus.
 */

/** Trois emplacements : ancre sur l'image, coude, départ, position de l'étiquette (viewBox 560 × 350). */
const CALLOUT_SLOTS = [
  {
    line: "M150 62 L150 118 L236 150",
    anchor: [236, 150],
    label: { left: "6%", top: "10%" },
  },
  {
    line: "M452 92 L452 148 L372 172",
    anchor: [372, 172],
    label: { right: "6%", top: "18%" },
  },
  {
    line: "M120 300 L188 300 L246 236",
    anchor: [246, 236],
    label: { left: "6%", bottom: "10%" },
  },
] as const;

/** Caractéristiques du dossier retenues comme repères, dans cet ordre. */
const CALLOUT_SPEC_LABELS = [
  "Capteur principal",
  "Motorisation",
  "Guerre électronique",
] as const;

export interface HeroCallout {
  label: string;
  value: string;
}

/** Repères lisibles dans `keySpecs` — la valeur publiée, coupée à sa première incise. */
export function heroCallouts(system: DefenseSystem): HeroCallout[] {
  return CALLOUT_SPEC_LABELS.flatMap((label) => {
    const spec = system.keySpecs.find((item) => item.label === label);
    return spec ? [{ label, value: spec.value.split(" — ")[0] }] : [];
  }).slice(0, CALLOUT_SLOTS.length);
}

export function HeroPlate({
  board,
  index,
  total,
  callouts,
}: {
  board: HudBoard;
  index: number;
  total: number;
  callouts: HeroCallout[];
}) {
  return (
    <article
      className="group relative flex min-w-0 flex-col border border-line-bright bg-panel motion-safe:transition-colors hover:border-accent has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-accent"
      data-hud-board={board.slug}
    >
      <RegistrationMarks />
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
        <span className="text-accent">
          Planche {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span>{board.kind}</span>
      </div>

      <div
        data-draw=""
        className="relative aspect-[16/10] overflow-hidden border-b border-line bg-[#11100c]"
      >
        <Image
          src={board.preview.src}
          alt={board.preview.alt}
          width={board.preview.width}
          height={board.preview.height}
          unoptimized
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-90 motion-safe:transition-opacity group-hover:opacity-100"
          style={{ objectPosition: `${board.preview.focusX ?? 50}% 50%` }}
        />
        <svg
          viewBox="0 0 560 350"
          preserveAspectRatio="none"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {callouts.map((_, i) => (
            <g key={CALLOUT_SLOTS[i].line}>
              <path d={CALLOUT_SLOTS[i].line} vectorEffect="non-scaling-stroke" />
              <circle
                cx={CALLOUT_SLOTS[i].anchor[0]}
                cy={CALLOUT_SLOTS[i].anchor[1]}
                r="3"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </svg>
        {callouts.map((callout, i) => (
          <span
            key={callout.label}
            className="hero-callout pointer-events-none absolute border border-line-bright bg-bg/85 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink"
            style={CALLOUT_SLOTS[i].label}
          >
            {callout.value}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3.5">
        <div className="min-w-0">
          <h2 className="font-serif text-xl leading-tight text-ink">
            <Link
              href={board.href}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {board.title}
            </Link>
          </h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            {board.features.join(" · ")}
          </p>
        </div>
        <span
          className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-accent"
          aria-hidden="true"
        >
          Ouvrir →
        </span>
      </div>

      {board.entries?.length ? (
        <ul
          className="relative z-10 grid gap-px border-t border-line bg-line sm:grid-cols-3"
          aria-label="Entrer directement dans un scénario"
        >
          {board.entries.map((entry) => (
            <li key={entry.href} className="bg-panel">
              <Link
                href={entry.href}
                className="flex min-h-11 items-center justify-between gap-3 px-3 py-2 motion-safe:transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
              >
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
                    {entry.label}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] leading-snug text-ink-faint">
                    {entry.detail}
                  </span>
                </span>
                <span
                  className="shrink-0 font-mono text-[11px] text-accent"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
