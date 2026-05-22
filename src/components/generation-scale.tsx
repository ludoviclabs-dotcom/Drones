// Frise des générations de chasseurs — la grille de lecture du domaine.
// Le numéro ne dit pas « meilleur » : il dit une architecture différente.
const GENERATIONS: {
  gen: string;
  title: string;
  detail: string;
  examples: string;
}[] = [
  {
    gen: "4.5",
    title: "Quatre-et-demi",
    detail:
      "Cellule de 4ᵉ génération profondément modernisée — radar AESA, IRST, guerre électronique, datalinks, forte capacité multirôle. Pas de furtivité native ; armement principalement externe.",
    examples: "Rafale · Eurofighter · Gripen E/F · F-15EX · Super Hornet",
  },
  {
    gen: "5",
    title: "Cinquième génération",
    detail:
      "Furtivité conçue dès l'origine, soutes internes, fusion de capteurs, nœud de réseau et architecture logicielle profonde. Acquisition et maintien en condition lourds.",
    examples: "F-22 · F-35 · J-20 · J-35",
  },
  {
    gen: "6",
    title: "Sixième génération — futur",
    detail:
      "Non pas un avion isolé mais une famille de systèmes : chasseur habité, drones ailiers, cloud de combat, capteurs distribués, architecture ouverte.",
    examples: "F-47 / NGAD · SCAF / FCAS · GCAP / Tempest",
  },
];

export function GenerationScale() {
  return (
    <ol className="grid gap-px border border-line bg-line md:grid-cols-3">
      {GENERATIONS.map((generation) => (
        <li key={generation.gen} className="flex flex-col bg-panel p-5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-serif text-4xl leading-none text-accent">
              {generation.gen}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
              génération
            </span>
          </div>
          <h3 className="mt-3 font-mono text-sm uppercase tracking-[0.1em] text-ink">
            {generation.title}
          </h3>
          <p className="mt-2 flex-1 font-serif text-sm leading-relaxed text-ink-dim">
            {generation.detail}
          </p>
          <p className="mt-3 border-t border-line pt-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
            {generation.examples}
          </p>
        </li>
      ))}
    </ol>
  );
}
