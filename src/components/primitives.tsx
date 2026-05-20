import type { Confidence, Grade } from "@/data/types";
import { CONFIDENCE_META, GRADE_META } from "@/data/labels";

export function GradeBadge({
  grade,
  size = "md",
}: {
  grade: Grade;
  size?: "sm" | "md" | "lg";
}) {
  const meta = GRADE_META[grade];
  const dims =
    size === "lg"
      ? "h-14 w-14 text-3xl"
      : size === "sm"
        ? "h-6 w-6 text-[11px]"
        : "h-10 w-10 text-lg";
  return (
    <span
      className={`inline-flex items-center justify-center border-2 font-mono font-semibold text-ink ${dims}`}
      style={{
        borderColor: meta.token,
        backgroundColor: `color-mix(in srgb, ${meta.token} 24%, transparent)`,
      }}
      title={`Palier ${grade} — ${meta.label}`}
    >
      {grade}
    </span>
  );
}

export function ConfidenceMark({ confidence }: { confidence: Confidence }) {
  const meta = CONFIDENCE_META[confidence];
  return (
    <span
      className="inline-flex items-center gap-[3px]"
      title={meta.label}
      aria-label={meta.label}
    >
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className="h-1 w-2.5"
          style={{
            backgroundColor:
              n <= meta.level
                ? "var(--color-accent)"
                : "var(--color-line-bright)",
          }}
        />
      ))}
    </span>
  );
}

export function Tag({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "accent";
}) {
  return (
    <span
      className={`inline-block border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
        tone === "accent"
          ? "border-accent/45 text-accent"
          : "border-line-bright text-ink-dim"
      }`}
    >
      {children}
    </span>
  );
}

export function SectionMarker({
  index,
  label,
  blurb,
}: {
  index: string;
  label: string;
  blurb?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs font-semibold text-accent">
          {index}
        </span>
        <h2 className="font-mono text-sm uppercase tracking-[0.22em] text-ink">
          {label}
        </h2>
        <span className="h-px flex-1 bg-line" />
      </div>
      {blurb ? (
        <p className="mt-2.5 max-w-2xl font-serif text-sm italic leading-relaxed text-ink-faint">
          {blurb}
        </p>
      ) : null}
    </div>
  );
}
