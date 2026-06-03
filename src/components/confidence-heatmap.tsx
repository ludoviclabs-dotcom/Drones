import { getSystemSectionConfidence, type ConfidenceBand } from "@/lib/claims";

// Heatmap de confiance : quelles sections du dossier sont solidement étayées,
// lesquelles restent fragiles. Dérivée des affirmations (confiance moyenne par
// périmètre). Rendu serveur, sans dépendance.

const BAND_TOKEN: Record<ConfidenceBand, string> = {
  solide: "var(--color-grade-a)",
  moyen: "var(--color-grade-c)",
  fragile: "var(--color-grade-e)",
};

const BAND_LABEL: Record<ConfidenceBand, string> = {
  solide: "Solidement étayé",
  moyen: "Partiellement étayé",
  fragile: "Fragile",
};

export function ConfidenceHeatmap({ slug }: { slug: string }) {
  const sections = getSystemSectionConfidence(slug);
  if (sections.length === 0) return null;

  return (
    <div
      role="img"
      aria-label="Heatmap de confiance par section du dossier — du solidement étayé au fragile"
      className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
    >
      {sections.map((section) => (
        <div key={section.scope} className="bg-panel p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
              {section.label}
            </span>
            <span
              className="h-3 w-3 shrink-0"
              style={{ backgroundColor: BAND_TOKEN[section.band] }}
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 h-1.5 w-full bg-surface-2">
            <div
              className="h-full"
              style={{
                width: `${Math.round((section.score / 3) * 100)}%`,
                backgroundColor: BAND_TOKEN[section.band],
              }}
            />
          </div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
            {BAND_LABEL[section.band]} · {section.count} affirmation
            {section.count > 1 ? "s" : ""}
          </p>
        </div>
      ))}
    </div>
  );
}
