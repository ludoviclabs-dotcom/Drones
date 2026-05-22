// Diagramme de défense multicouche — la chaîne menace → effecteur.
// Le laser n'est qu'une couche parmi d'autres, choisie selon la menace.
const STEPS: { label: string; detail: string }[] = [
  {
    label: "Menace",
    detail:
      "Drones, roquettes, obus de mortier — souvent nombreux et peu coûteux, en attaque de saturation.",
  },
  {
    label: "Détection",
    detail: "Radar et capteurs optroniques repèrent et pistent la cible.",
  },
  {
    label: "Classification",
    detail:
      "Identification, évaluation du danger et priorisation des menaces simultanées.",
  },
  {
    label: "Choix de l'effecteur",
    detail:
      "Le commandement arbitre selon le coût, la disponibilité et les règles d'engagement.",
  },
  {
    label: "Effecteur",
    detail:
      "Brouillage, laser, canon ou missile : la couche engagée dépend de la menace traitée.",
  },
];

export function LayeredDefenseDiagram() {
  return (
    <ol className="space-y-0">
      {STEPS.map((step, i) => (
        <li key={step.label}>
          <div className="border border-line bg-surface px-5 py-4">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] font-semibold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink">
                {step.label}
              </span>
            </div>
            <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
              {step.detail}
            </p>
          </div>
          {i < STEPS.length - 1 ? (
            <div
              className="flex justify-center py-1.5 font-mono text-sm text-ink-faint"
              aria-hidden="true"
            >
              ↓
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
