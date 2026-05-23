import { BRICK_BLURBS, BRICK_LABELS, SCORE_LABELS } from "@/data/labels";
import type {
  Brick,
  BrickKey,
  Confidence,
  DefenseSystem,
  Indicator,
  Score,
  SourceRef,
} from "@/data/types";
import { getAllClaims } from "@/lib/claims";
import type {
  DecisionTwinLayerDefinition,
  DecisionTwinNode,
  DecisionTwinRisk,
  PanoplieXrayScenario,
} from "./types";

const LAYERS: DecisionTwinLayerDefinition[] = [
  {
    id: "cout",
    label: BRICK_LABELS.cout,
    summary: BRICK_BLURBS.cout,
  },
  {
    id: "finance",
    label: BRICK_LABELS.finance,
    summary: BRICK_BLURBS.finance,
  },
  {
    id: "supply-chain",
    label: BRICK_LABELS["supply-chain"],
    summary: BRICK_BLURBS["supply-chain"],
  },
  {
    id: "geopolitique",
    label: BRICK_LABELS.geopolitique,
    summary: BRICK_BLURBS.geopolitique,
  },
  {
    id: "export",
    label: BRICK_LABELS.export,
    summary: BRICK_BLURBS.export,
  },
  {
    id: "sources",
    label: "Sources / confiance",
    summary:
      "Sources ouvertes, niveau de confiance et limites de lecture associes au dossier.",
  },
];

const DEFAULT_LIMITATION =
  "Analyse OSINT strategique, non operationnelle, non prescriptive. La silhouette est pedagogique et ne constitue pas un plan technique.";

const DEFAULT_NEXT_ACTION =
  "Verifier la source ouverte associee, puis documenter la limite avant toute decision.";

function sourceById(system: DefenseSystem): Map<string, SourceRef> {
  return new Map(system.sources.map((source) => [source.id, source]));
}

function brickByKey(system: DefenseSystem, key: BrickKey): Brick | undefined {
  return system.bricks.find((brick) => brick.key === key);
}

function scoreByKey(system: DefenseSystem, key: Score["key"]): Score | undefined {
  return system.scores.find((score) => score.key === key);
}

function firstIndicator(brick: Brick | undefined): Indicator | undefined {
  return brick?.indicators[0];
}

function searchable(value: string): string {
  return value
    .toLowerCase()
    .replaceAll("œ", "oe")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function indicatorByLabel(
  indicators: Indicator[],
  labelPart: string,
): Indicator | undefined {
  const needle = searchable(labelPart);
  return indicators.find((indicator) =>
    searchable(indicator.label).includes(needle),
  );
}

function confidenceFromScore(score: Score | undefined): Confidence {
  if (!score) return "moyenne";
  if (score.grade === "A" || score.grade === "B") return "haute";
  if (score.grade === "C") return "moyenne";
  return "faible";
}

function sourceFromIndicator(
  sources: Map<string, SourceRef>,
  indicator?: Indicator,
): Pick<DecisionTwinNode, "sourceLabel" | "sourceUrl"> {
  const sourceId = indicator?.sources?.[0];
  const source = sourceId ? sources.get(sourceId) : undefined;
  return {
    sourceLabel: source?.title,
    sourceUrl: source?.url,
  };
}

function evidenceFromIndicator(indicator: Indicator | undefined): string {
  if (!indicator) return "A relier au registre de preuves OSINT du dossier.";
  return indicator.note
    ? `${indicator.label}: ${indicator.value}. ${indicator.note}`
    : `${indicator.label}: ${indicator.value}.`;
}

function scoreEvidence(
  system: DefenseSystem,
  key: Score["key"],
): Pick<DecisionTwinNode, "confidence" | "evidence" | "metadata"> {
  const score = scoreByKey(system, key);
  return {
    confidence: confidenceFromScore(score),
    evidence: score
      ? `${SCORE_LABELS[key]}: palier ${score.grade}. ${score.rationale}`
      : "Palier non renseigne pour ce systeme.",
    metadata: score
      ? {
          scoreKey: score.key,
          grade: score.grade,
        }
      : undefined,
  };
}

function makeNode(
  node: Omit<DecisionTwinNode, "limitation" | "nextAction"> &
    Partial<Pick<DecisionTwinNode, "limitation" | "nextAction">>,
): DecisionTwinNode {
  return {
    limitation: DEFAULT_LIMITATION,
    nextAction: DEFAULT_NEXT_ACTION,
    ...node,
  };
}

function bayraktarTb2Nodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");
  const motor = indicatorByLabel(system.keySpecs, "Motorisation");
  const link = indicatorByLabel(system.keySpecs, "Liaison");
  const payload = indicatorByLabel(system.keySpecs, "Charge utile");
  const wingspan = indicatorByLabel(system.keySpecs, "Envergure");
  const sensitiveComponent = indicatorByLabel(
    supply?.indicators ?? [],
    "sensible",
  );
  const prime = indicatorByLabel(supply?.indicators ?? [], "oeuvre");
  const confidenceClaims = getAllClaims().filter(
    (claim) => claim.systemSlug === system.slug,
  );
  const confidenceScore = scoreEvidence(system, "confiance-donnees");

  return [
    makeNode({
      id: `${system.slug}-fuselage`,
      label: "Cellule / fuselage",
      type: "component",
      layer: "cout",
      risk: "medium",
      confidence: "moyenne",
      claim:
        "La plateforme doit etre lue comme un compromis cout, endurance et attrition, pas comme une performance isolee.",
      evidence: evidenceFromIndicator(firstIndicator(cost)),
      ...sourceFromIndicator(sources, firstIndicator(cost)),
      nextAction:
        "Garder le cout complet separe du prix d'appel: vecteurs, stations sol, formation, maintenance et attrition.",
      position2d: { x: 50, y: 50 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-wings`,
      label: "Ailes / endurance",
      type: "component",
      layer: "cout",
      risk: "low",
      confidence: wingspan?.confidence ?? "moyenne",
      claim:
        "L'envergure et l'endurance donnent une lecture de format, sans suffire a juger la survivabilite.",
      evidence: evidenceFromIndicator(wingspan),
      ...sourceFromIndicator(sources, wingspan),
      nextAction:
        "Relier cette lecture aux paliers de maturite et de survivabilite, sans extrapoler vers un usage tactique.",
      position2d: { x: 25, y: 44 },
      position3d: { x: -0.7, y: 0.05, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-engine`,
      label: "Motorisation",
      type: "component",
      layer: "supply-chain",
      risk: "high",
      confidence: motor?.confidence ?? "moyenne",
      claim:
        "La motorisation est un point de dependance industrielle a suivre dans le temps.",
      evidence: evidenceFromIndicator(motor),
      ...sourceFromIndicator(sources, motor),
      nextAction:
        "Verifier l'origine industrielle actuelle et distinguer composants historiques, substitutions et production nationale.",
      position2d: { x: 50, y: 78 },
      position3d: { x: 0, y: -0.65, z: 0.15 },
    }),
    makeNode({
      id: `${system.slug}-sensor`,
      label: "Optronique",
      type: "component",
      layer: "supply-chain",
      risk: "critical",
      confidence: sensitiveComponent?.confidence ?? "moyenne",
      claim:
        "L'optronique illustre la dependance la plus visible: un controle d'export peut deplacer toute la chaine.",
      evidence: evidenceFromIndicator(sensitiveComponent),
      ...sourceFromIndicator(sources, sensitiveComponent),
      nextAction:
        "Documenter la chronologie de substitution et relier chaque etat a une source ouverte datee.",
      position2d: { x: 50, y: 25 },
      position3d: { x: 0, y: 0.8, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-datalink`,
      label: "Liaison de donnees",
      type: "component",
      layer: "export",
      risk: "medium",
      confidence: link?.confidence ?? "moyenne",
      claim:
        "La liaison borne l'architecture du systeme et doit etre presentee comme contrainte de lecture, pas comme parametre d'emploi.",
      evidence: evidenceFromIndicator(link),
      ...sourceFromIndicator(sources, link),
      nextAction:
        "Conserver la formulation au niveau capacitaire public et eviter toute recommandation operationnelle.",
      position2d: { x: 65, y: 37 },
      position3d: { x: 0.45, y: 0.45, z: 0.25 },
    }),
    makeNode({
      id: `${system.slug}-ground-station`,
      label: "Station sol",
      type: "component",
      layer: "finance",
      risk: "medium",
      confidence: firstIndicator(finance)?.confidence ?? "moyenne",
      claim:
        "Le systeme s'achete comme ensemble: vecteurs, stations sol, formation, soutien et conditions contractuelles.",
      evidence: evidenceFromIndicator(firstIndicator(finance)),
      ...sourceFromIndicator(sources, firstIndicator(finance)),
      nextAction:
        "Afficher separement cout unitaire, cout systeme et mecanisme d'acquisition pour eviter la confusion.",
      position2d: { x: 78, y: 70 },
      position3d: { x: 0.9, y: -0.45, z: -0.15 },
    }),
    makeNode({
      id: `${system.slug}-payload`,
      label: "Charge utile",
      type: "component",
      layer: "export",
      risk: "high",
      confidence: payload?.confidence ?? "moyenne",
      claim:
        "La charge utile est volontairement traitee comme categorie non operationnelle et non prescriptive.",
      evidence: evidenceFromIndicator(payload),
      ...sourceFromIndicator(sources, payload),
      limitation:
        "Analyse OSINT strategique. Aucun schema d'emploi, combinaison tactique ou optimisation d'usage n'est fourni.",
      nextAction:
        "Limiter la lecture aux contraintes d'export, au niveau de confiance et a la trace des sources publiques.",
      position2d: { x: 35, y: 62 },
      position3d: { x: -0.35, y: -0.25, z: 0.25 },
    }),
    makeNode({
      id: `${system.slug}-manufacturer`,
      label: system.manufacturer,
      type: "supplier",
      layer: "finance",
      risk: "medium",
      confidence: prime?.confidence ?? "haute",
      claim:
        "Le maitre d'oeuvre concentre une partie de la lecture industrielle, commerciale et diplomatique du systeme.",
      evidence: evidenceFromIndicator(prime ?? firstIndicator(finance)),
      ...sourceFromIndicator(sources, prime ?? firstIndicator(finance)),
      nextAction:
        "Relier le fabricant aux modes d'acquisition, aux sources constructeur et aux limites d'independance industrielle.",
      position2d: { x: 18, y: 72 },
      position3d: { x: -1, y: -0.6, z: -0.2 },
    }),
    makeNode({
      id: `${system.slug}-country`,
      label: system.country,
      type: "country",
      layer: "geopolitique",
      risk: "medium",
      confidence: firstIndicator(geopolitics)?.confidence ?? "moyenne",
      claim:
        "Le pays d'origine porte une lecture d'influence, d'autonomie et de dependance diplomatique.",
      evidence: evidenceFromIndicator(firstIndicator(geopolitics)),
      ...sourceFromIndicator(sources, firstIndicator(geopolitics)),
      nextAction:
        "Comparer l'effet d'influence avec les theatres, utilisateurs et restrictions publiees.",
      position2d: { x: 84, y: 22 },
      position3d: { x: 1, y: 0.75, z: -0.2 },
    }),
    makeNode({
      id: `${system.slug}-critical-dependency`,
      label: "Dependance critique",
      type: "source",
      layer: "supply-chain",
      risk: "critical",
      confidence: "moyenne",
      claim:
        "Le dossier montre comment une dependance externe peut devenir un risque, puis un moteur de substitution industrielle.",
      evidence: evidenceFromIndicator(
        indicatorByLabel(supply?.indicators ?? [], "Trajectoire"),
      ),
      ...sourceFromIndicator(
        sources,
        indicatorByLabel(supply?.indicators ?? [], "Trajectoire"),
      ),
      nextAction:
        "Suivre la dependance sous forme de chronologie sourcee plutot que comme certitude definitive.",
      position2d: { x: 70, y: 55 },
      position3d: { x: 0.7, y: -0.05, z: 0.35 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "medium",
      confidence: confidenceScore.confidence,
      claim:
        "La fiabilite de la fiche depend du nombre d'affirmations sourcees, de leur statut et du niveau de confiance des donnees.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Les donnees ouvertes restent variables: certaines estimations de cout, d'export ou de performance doivent etre recoupees.",
      nextAction:
        "Ouvrir la Console OSINT et prioriser les affirmations variables ou a recouper.",
      position2d: { x: 18, y: 28 },
      position3d: { x: -1, y: 0.7, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-export-regime`,
      label: "Regime d'export",
      type: "source",
      layer: "export",
      risk: "high",
      confidence: firstIndicator(exportBrick)?.confidence ?? "moyenne",
      claim:
        "L'exportabilite est une couche strategique: elle combine reglementation, diplomatie et dependances industrielles.",
      evidence: evidenceFromIndicator(firstIndicator(exportBrick)),
      ...sourceFromIndicator(sources, firstIndicator(exportBrick)),
      nextAction:
        "Relier le regime d'export aux organismes cites et aux limites diplomatiques du dossier.",
      position2d: { x: 51, y: 91 },
      position3d: { x: 0, y: -1.05, z: -0.05 },
    }),
  ];
}

function genericNodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const claims = getAllClaims().filter((claim) => claim.systemSlug === system.slug);
  const confidenceScore = scoreEvidence(system, "confiance-donnees");
  const positions = [
    { x: 50, y: 28 },
    { x: 30, y: 43 },
    { x: 70, y: 43 },
    { x: 50, y: 58 },
    { x: 34, y: 74 },
    { x: 66, y: 74 },
  ];

  const brickNodes = system.bricks.map((brick, index) => {
    const indicator = firstIndicator(brick);
    const risk: DecisionTwinRisk =
      brick.key === "supply-chain" || brick.key === "export"
        ? "high"
        : "medium";
    return makeNode({
      id: `${system.slug}-${brick.key}`,
      label: BRICK_LABELS[brick.key],
      type: "source",
      layer: brick.key,
      risk,
      confidence: indicator?.confidence ?? "moyenne",
      claim: brick.narrative.split("\n")[0] ?? BRICK_BLURBS[brick.key],
      evidence: evidenceFromIndicator(indicator),
      ...sourceFromIndicator(sources, indicator),
      position2d: positions[index] ?? { x: 50, y: 50 },
      position3d: {
        x: ((positions[index]?.x ?? 50) - 50) / 50,
        y: (50 - (positions[index]?.y ?? 50)) / 50,
        z: 0,
      },
    });
  });

  return [
    makeNode({
      id: `${system.slug}-system`,
      label: system.name,
      type: "system",
      layer: "sources",
      risk: "medium",
      confidence: confidenceScore.confidence,
      claim:
        "Le X-Ray agrège les briques du dossier systeme en points de preuve navigables.",
      evidence: `${confidenceScore.evidence} Registre: ${claims.length} affirmations tracees.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      position2d: { x: 50, y: 50 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    ...brickNodes,
  ];
}

export function buildPanoplieXrayScenario(
  system: DefenseSystem,
): PanoplieXrayScenario {
  const nodes =
    system.slug === "bayraktar-tb2" ? bayraktarTb2Nodes(system) : genericNodes(system);

  return {
    id: `panoplie-xray-${system.slug}`,
    systemSlug: system.slug,
    title: `${system.name} — System X-Ray`,
    subtitle:
      "Lecture visuelle des preuves, limites et dependances du dossier Panoplie.",
    isMock: false,
    generatedAt: `${system.updated}T00:00:00.000Z`,
    layers: LAYERS,
    nodes,
    limitations: [
      DEFAULT_LIMITATION,
      "Les points X-Ray contextualisent des sources ouvertes; ils ne decrivent ni plans detailles, ni parametres sensibles, ni recommandations tactiques.",
      "Les couts, regimes d'export et dependances industrielles peuvent varier selon contrats, periodes et sources.",
    ],
    recommendedActions: [
      "Ouvrir les sources primaires quand elles sont disponibles.",
      "Prioriser les affirmations a recouper dans la Console OSINT.",
      "Comparer le systeme avec deux alternatives avant de tirer une conclusion strategique.",
    ],
  };
}
