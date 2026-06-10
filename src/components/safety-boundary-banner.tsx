export function SafetyBoundaryBanner({
  variant = "global",
}: {
  variant?: "global" | "panel";
}) {
  const isPanel = variant === "panel";

  return (
    <div
      className={
        isPanel
          ? "border border-line bg-panel p-4"
          : "border-b border-line bg-surface/80"
      }
    >
      <div
        className={
          isPanel
            ? "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            : "mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2"
        }
      >
        <div className="flex items-center gap-2.5">
          <span
            className="transmission-dot h-1.5 w-1.5 shrink-0 bg-accent"
            aria-hidden="true"
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
            OSINT stratégique · aucun usage opérationnel
          </p>
        </div>
        <p className="max-w-3xl font-serif text-xs leading-relaxed text-ink-dim">
          Panoplie observe les coûts, sources, programmes, chaînes
          industrielles, export et dépendances publiques. Pas de ciblage, pas de
          planification tactique, pas d'optimisation d'arme.
        </p>
      </div>
    </div>
  );
}
