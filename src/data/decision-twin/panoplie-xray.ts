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

function rafaleNodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");

  const crew = indicatorByLabel(system.keySpecs, "Equipage");
  const engine = indicatorByLabel(system.keySpecs, "Motorisation");
  const radar = indicatorByLabel(system.keySpecs, "Capteur");
  const ew = indicatorByLabel(system.keySpecs, "Guerre");
  const nuclear = indicatorByLabel(system.keySpecs, "nucleaire");

  const mco = indicatorByLabel(cost?.indicators ?? [], "Maintien");
  const orderBook = indicatorByLabel(finance?.indicators ?? [], "Carnet");
  const prime = indicatorByLabel(supply?.indicators ?? [], "oeuvre");
  const criticalNodes = indicatorByLabel(supply?.indicators ?? [], "critiques");
  const foreignDep = indicatorByLabel(supply?.indicators ?? [], "etrangere");
  const strategicRole = indicatorByLabel(
    geopolitics?.indicators ?? [],
    "strategique",
  );
  const exportRegime = indicatorByLabel(
    exportBrick?.indicators ?? [],
    "applicable",
  );

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
      confidence: "haute",
      claim:
        "Le cout du Rafale se lit en quatre couches: cellule seule, acquisition complete, programme amorti et MCO. Le prix unitaire est un poste parmi quatre.",
      evidence: evidenceFromIndicator(mco),
      ...sourceFromIndicator(sources, mco),
      nextAction:
        "Distinguer prix d'appel, cout systeme et cout politique pour eviter la lecture trompeuse d'un seul chiffre.",
      position2d: { x: 50, y: 50 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-verriere`,
      label: "Verriere / cockpit",
      type: "component",
      layer: "finance",
      risk: "low",
      confidence: crew?.confidence ?? "haute",
      claim:
        "Trois cellules (C monoplace, B biplace, M naval) sortent de la meme chaine: la repartition par contrat est un proxy de la doctrine d'emploi.",
      evidence: evidenceFromIndicator(crew),
      ...sourceFromIndicator(sources, crew),
      nextAction:
        "Lire la repartition C/B/M des contrats export pour reperer l'usage prevu par chaque client.",
      position2d: { x: 50, y: 22 },
      position3d: { x: 0, y: 1.15, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-radar`,
      label: "Radar RBE2 AESA",
      type: "component",
      layer: "supply-chain",
      risk: "medium",
      confidence: radar?.confidence ?? "haute",
      claim:
        "Le radar AESA Thales RBE2 est l'un des trois noeuds qui rendent la chaine Rafale entierement francaise.",
      evidence: evidenceFromIndicator(radar),
      ...sourceFromIndicator(sources, radar),
      nextAction:
        "Suivre la trajectoire RBE2 XG (standard F5) pour reperer la prochaine etape capteur.",
      position2d: { x: 50, y: 10 },
      position3d: { x: 0, y: 1.6, z: 0.3 },
    }),
    makeNode({
      id: `${system.slug}-spectra`,
      label: "SPECTRA — guerre electronique",
      type: "component",
      layer: "sources",
      risk: "medium",
      confidence: ew?.confidence ?? "haute",
      claim:
        "SPECTRA est la pierre angulaire de la survivabilite Rafale, a defaut de furtivite native: l'autoprotection active se substitue a la signature radar minimale.",
      evidence: evidenceFromIndicator(ew),
      ...sourceFromIndicator(sources, ew),
      nextAction:
        "Comparer la logique SPECTRA (brouillage actif) aux choix furtifs des plateformes de 5e generation.",
      position2d: { x: 38, y: 38 },
      position3d: { x: -0.4, y: 0.4, z: 0.05 },
    }),
    makeNode({
      id: `${system.slug}-canards`,
      label: "Plans canards",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: "haute",
      claim:
        "La formule a canards delta est un choix de manoeuvrabilite et de signature visuelle: elle distingue le Rafale du Mirage 2000 et de la generation suivante.",
      evidence:
        "Formule aerodynamique publique. La schematique pedagogique reste indicative et ne sert pas a comparer des performances de vol.",
      sourceLabel: "Dossier Panoplie — fiche Rafale",
      nextAction:
        "Garder cette lecture comme reperage visuel, pas comme parametre d'emploi.",
      position2d: { x: 30, y: 36 },
      position3d: { x: -0.8, y: 0.55, z: 0.05 },
    }),
    makeNode({
      id: `${system.slug}-voilure`,
      label: "Voilure delta — points d'emport",
      type: "component",
      layer: "export",
      risk: "low",
      confidence: exportRegime?.confidence ?? "haute",
      claim:
        "Les points d'emport sous voilure sont la surface ou les configurations export se decident: la France garde la maitrise des standards et armements.",
      evidence: evidenceFromIndicator(exportRegime),
      ...sourceFromIndicator(sources, exportRegime),
      nextAction:
        "Documenter par contrat les armements autorises et l'ecart avec la configuration nationale.",
      position2d: { x: 22, y: 60 },
      position3d: { x: -1.1, y: -0.2, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-moteur`,
      label: "Moteur M88 (Safran)",
      type: "component",
      layer: "supply-chain",
      risk: "medium",
      confidence: engine?.confidence ?? "haute",
      claim:
        "Le M88 Safran est le troisieme noeud souverain: contrairement au Gripen, aucun moteur americain dans la chaine, aucune autorisation US a obtenir.",
      evidence: evidenceFromIndicator(engine),
      ...sourceFromIndicator(sources, engine),
      nextAction:
        "Suivre la trajectoire M88 vers une motorisation plus puissante (standard F5) comme indicateur de continuite industrielle.",
      position2d: { x: 50, y: 86 },
      position3d: { x: 0, y: -1.2, z: -0.2 },
    }),
    makeNode({
      id: `${system.slug}-asmpa`,
      label: "Emport central — ASMPA",
      type: "component",
      layer: "geopolitique",
      risk: "high",
      confidence: nuclear?.confidence ?? "haute",
      claim:
        "Le Rafale est l'un des rares avions au monde porteur d'un missile a tete nucleaire: un attribut regalien qui pese sur la lecture du programme.",
      evidence: evidenceFromIndicator(nuclear),
      ...sourceFromIndicator(sources, nuclear),
      limitation:
        "Lecture strictement strategique. La fiche n'aborde aucun parametre operationnel ou d'emploi de la composante nucleaire.",
      nextAction:
        "Distinguer le role national (composante nucleaire) du standard export (configurations adaptees, sans ASMPA).",
      position2d: { x: 50, y: 68 },
      position3d: { x: 0, y: -0.4, z: -0.3 },
    }),
    makeNode({
      id: `${system.slug}-dassault`,
      label: system.manufacturer,
      type: "supplier",
      layer: "finance",
      risk: "medium",
      confidence: prime?.confidence ?? "haute",
      claim:
        "Le maitre d'oeuvre concentre la lecture industrielle, commerciale et diplomatique: c'est par lui que le carnet de commandes record 2025 prend sens.",
      evidence: evidenceFromIndicator(orderBook ?? prime),
      ...sourceFromIndicator(sources, orderBook ?? prime),
      nextAction:
        "Croiser le carnet Dassault avec la cadence de production: 175 export sur 220 changent la nature du programme.",
      position2d: { x: 14, y: 78 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-thales`,
      label: "Thales",
      type: "supplier",
      layer: "supply-chain",
      risk: "medium",
      confidence: criticalNodes?.confidence ?? "haute",
      claim:
        "Thales porte les noeuds capteur et guerre electronique: sans Thales, pas de souverainete sur la chaine Rafale.",
      evidence: evidenceFromIndicator(criticalNodes),
      ...sourceFromIndicator(sources, criticalNodes),
      nextAction:
        "Suivre la trajectoire Thales sur le RBE2 XG et la guerre electronique du standard F5.",
      position2d: { x: 86, y: 18 },
      position3d: { x: 1.5, y: 1.1, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-france`,
      label: `${system.country} — autonomie strategique`,
      type: "country",
      layer: "geopolitique",
      risk: "medium",
      confidence: strategicRole?.confidence ?? "haute",
      claim:
        "Acheter un Rafale, c'est acheter une autonomie. L'appareil s'adresse aux Etats qui veulent une capacite de premier rang hors ecosysteme americain.",
      evidence: evidenceFromIndicator(strategicRole),
      ...sourceFromIndicator(sources, strategicRole),
      nextAction:
        "Lire la liste des clients export (Egypte, Inde, Qatar, Grece, Emirats, Indonesie, Serbie) comme celle de ceux qui ont choisi cette logique.",
      position2d: { x: 84, y: 60 },
      position3d: { x: 1.4, y: -0.2, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-itar`,
      label: "Regime hors ITAR",
      type: "source",
      layer: "export",
      risk: "high",
      confidence: foreignDep?.confidence ?? "haute",
      claim:
        "Aucun composant critique du Rafale n'est soumis a l'ITAR americain: l'acheteur n'herite d'aucune autorisation a obtenir hors de France.",
      evidence: evidenceFromIndicator(foreignDep),
      ...sourceFromIndicator(sources, foreignDep),
      nextAction:
        "Verifier que cette autonomie reste vraie contrat par contrat: sous-traitants, paliers de standard, accords specifiques.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "low",
      confidence: confidenceScore.confidence,
      claim:
        "Le dossier Rafale s'appuie sur le constructeur, la DGA, SIPRI et la presse specialisee: une chaine documentaire dense mais aux couts unitaires export disperses.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Les couts unitaires export restent variables selon contrats et configurations livrees: une lecture comparative exige de neutraliser le perimetre.",
      nextAction:
        "Prioriser dans la Console OSINT les indicateurs marques 'variable', a commencer par le cout d'acquisition unitaire.",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function f35Nodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");

  const crew = indicatorByLabel(system.keySpecs, "Equipage");
  const engine = indicatorByLabel(system.keySpecs, "Motorisation");
  const sensor = indicatorByLabel(system.keySpecs, "Capteur");
  const stealth = indicatorByLabel(system.keySpecs, "Furtivite");
  const modernization = indicatorByLabel(system.keySpecs, "modernisation");

  const lifeCycleCost = indicatorByLabel(cost?.indicators ?? [], "Maintien");
  const fundingModel = indicatorByLabel(finance?.indicators ?? [], "financement");
  const prime = indicatorByLabel(supply?.indicators ?? [], "oeuvre");
  const softwareDep = indicatorByLabel(supply?.indicators ?? [], "Dependance");
  const strategicRole = indicatorByLabel(
    geopolitics?.indicators ?? [],
    "strategique",
  );
  const itarRegime = indicatorByLabel(
    exportBrick?.indicators ?? [],
    "applicable",
  );

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
      risk: "high",
      confidence: lifeCycleCost?.confidence ?? "haute",
      claim:
        "Le cout du F-35 se loge dans la possession, pas dans l'acquisition: le maintien en condition de la flotte depasse 1580 Md$ sur le cycle de vie.",
      evidence: evidenceFromIndicator(lifeCycleCost),
      ...sourceFromIndicator(sources, lifeCycleCost),
      nextAction:
        "Comparer prix d'appel et cout de possession pour eviter la lecture trompeuse d'un seul chiffre unitaire.",
      position2d: { x: 50, y: 50 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-verriere`,
      label: "Verriere / cockpit",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: crew?.confidence ?? "haute",
      claim:
        "Le F-35 est strictement monoplace: la fusion de capteurs et l'automatisation logicielle remplacent le second equipier.",
      evidence: evidenceFromIndicator(crew),
      ...sourceFromIndicator(sources, crew),
      nextAction:
        "Lire la charge cognitive et la dependance au logiciel comme contrepartie de la formule monoplace.",
      position2d: { x: 50, y: 22 },
      position3d: { x: 0, y: 1.15, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-sensor-fusion`,
      label: "Capteurs AESA · DAS · EOTS",
      type: "component",
      layer: "supply-chain",
      risk: "medium",
      confidence: sensor?.confidence ?? "haute",
      claim:
        "Le F-35 est un noeud de capteurs autant qu'un chasseur: la fusion AESA + DAS 360° + EOTS est sa vraie capacite, et la source de sa dette logicielle.",
      evidence: evidenceFromIndicator(sensor),
      ...sourceFromIndicator(sources, sensor),
      nextAction:
        "Suivre la trajectoire Block 4 — chaque ajout capteur depend de mises a jour logicielles validees par Lockheed.",
      position2d: { x: 50, y: 10 },
      position3d: { x: 0, y: 1.6, z: 0.3 },
    }),
    makeNode({
      id: `${system.slug}-stealth`,
      label: "Furtivite native",
      type: "component",
      layer: "sources",
      risk: "medium",
      confidence: stealth?.confidence ?? "haute",
      claim:
        "La furtivite est dimensionnante pour le F-35: forme de cellule, materiaux radar-absorbants et armement en soute interne sont la raison d'etre du programme.",
      evidence: evidenceFromIndicator(stealth),
      ...sourceFromIndicator(sources, stealth),
      nextAction:
        "Distinguer furtivite face aux radars de defense aerienne modernes et face aux radars VHF — la lecture varie.",
      position2d: { x: 38, y: 38 },
      position3d: { x: -0.4, y: 0.4, z: 0.05 },
    }),
    makeNode({
      id: `${system.slug}-internal-bay`,
      label: "Soute interne — armement",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: stealth?.confidence ?? "haute",
      claim:
        "L'armement est porte en soute interne pour preserver la signature radar; cela limite la charge utile par rapport a un chasseur non furtif.",
      evidence:
        "Architecture publique du F-35. La schematique reste indicative et ne sert pas a comparer des capacites d'emport detaillees.",
      sourceLabel: "Dossier Panoplie — fiche F-35",
      nextAction:
        "Lire l'arbitrage furtivite/charge utile comme un choix doctrinal, pas comme une faiblesse.",
      position2d: { x: 24, y: 56 },
      position3d: { x: -1.0, y: -0.1, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-wing-edge`,
      label: "Bord d'aile — signature radar",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: "haute",
      claim:
        "Les bords d'aile alignes participent a la signature radar minimisee: la forme generale du F-35 est gouvernee par la furtivite avant la performance pure.",
      evidence:
        "Geometrie publique de cellule. La schematique reste pedagogique et ne decrit aucun parametre d'emploi.",
      sourceLabel: "Dossier Panoplie — fiche F-35",
      nextAction:
        "Reperer cette logique comme un trait de famille des 5e generation (F-22, F-35, J-20, J-35).",
      position2d: { x: 76, y: 56 },
      position3d: { x: 1.0, y: -0.1, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-engine-f135`,
      label: "Moteur F135 (Pratt & Whitney)",
      type: "component",
      layer: "supply-chain",
      risk: "high",
      confidence: engine?.confidence ?? "haute",
      claim:
        "Le F135 monomoteur de Pratt & Whitney est un point de dependance maximale: aucune alternative en service, et un programme de modernisation moteur encore en debat.",
      evidence: evidenceFromIndicator(engine),
      ...sourceFromIndicator(sources, engine),
      nextAction:
        "Suivre les debats ECU (Engine Core Upgrade) et la trajectoire vers une motorisation adaptative — choix dimensionnant pour la flotte.",
      position2d: { x: 50, y: 86 },
      position3d: { x: 0, y: -1.2, z: -0.2 },
    }),
    makeNode({
      id: `${system.slug}-tr3`,
      label: "Standard TR-3 / Block 4",
      type: "component",
      layer: "finance",
      risk: "critical",
      confidence: modernization?.confidence ?? "moyenne",
      claim:
        "Le TR-3 et la Block 4 cristallisent la dette logicielle du programme: le GAO documente retards, reduction de perimetre et achevement repousse vers 2031.",
      evidence: evidenceFromIndicator(modernization),
      ...sourceFromIndicator(sources, modernization),
      nextAction:
        "Inclure le calendrier Block 4 dans toute lecture financiere: le risque programmatique pese autant que le cout de possession.",
      position2d: { x: 50, y: 78 },
      position3d: { x: 0, y: -0.6, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-lockheed`,
      label: system.manufacturer,
      type: "supplier",
      layer: "finance",
      risk: "medium",
      confidence: prime?.confidence ?? "haute",
      claim:
        "Lockheed Martin orchestre une chaine mondiale repartie entre les nations du programme — la geographie industrielle est aussi une geographie diplomatique.",
      evidence: evidenceFromIndicator(prime ?? fundingModel),
      ...sourceFromIndicator(sources, prime ?? fundingModel),
      nextAction:
        "Croiser le modele de financement (US + 8 partenaires + FMS) avec les retards de livraison documentes par le GAO.",
      position2d: { x: 14, y: 78 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-usa`,
      label: `${system.country} — systeme integre`,
      type: "country",
      layer: "geopolitique",
      risk: "medium",
      confidence: strategicRole?.confidence ?? "haute",
      claim:
        "Choisir le F-35, c'est entrer dans le systeme americain: interoperabilite OTAN, partage de donnees, doctrine commune — et dependance durable a Washington.",
      evidence: evidenceFromIndicator(strategicRole),
      ...sourceFromIndicator(sources, strategicRole),
      nextAction:
        "Lire les 20+ nations operatrices comme la liste de celles qui ont accepte ce contrat d'alliance — et ses conditions.",
      position2d: { x: 84, y: 60 },
      position3d: { x: 1.4, y: -0.2, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-itar`,
      label: "ITAR — arbitrage politique US",
      type: "source",
      layer: "export",
      risk: "high",
      confidence: itarRegime?.confidence ?? "haute",
      claim:
        "L'export du F-35 est sous regime ITAR: l'acces depend de la relation politique avec Washington, et peut etre suspendu ou conditionne.",
      evidence: evidenceFromIndicator(itarRegime),
      ...sourceFromIndicator(sources, itarRegime),
      nextAction:
        "Suivre les debats sur le verrouillage logiciel a distance — fondes ou non, ils pesent sur la perception de souverainete des clients.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-software-dependency`,
      label: "Dependance logicielle",
      type: "source",
      layer: "supply-chain",
      risk: "critical",
      confidence: softwareDep?.confidence ?? "moyenne",
      claim:
        "Mises a jour, autorisations et donnees de mission transitent par des systemes americains: un F-35 n'est jamais pleinement detenu par son operateur.",
      evidence: evidenceFromIndicator(softwareDep),
      ...sourceFromIndicator(sources, softwareDep),
      nextAction:
        "Documenter pour chaque operateur le perimetre exact de souverainete sur la chaine logicielle ALIS/ODIN.",
      position2d: { x: 86, y: 18 },
      position3d: { x: 1.5, y: 1.1, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "low",
      confidence: confidenceScore.confidence,
      claim:
        "Le dossier F-35 est exceptionnellement documente — Lockheed, GAO, USNI, Defense News — y compris sur ses difficultes: une rare convergence sourciere.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Le perimetre Block 4 et les couts unitaires export evoluent annee apres annee: prendre la date du rapport GAO comme reference.",
      nextAction:
        "Prioriser dans la Console OSINT les indicateurs sur la modernisation Block 4 et le calendrier TR-3.",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function f15exNodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");

  const crew = indicatorByLabel(system.keySpecs, "Equipage");
  const engine = indicatorByLabel(system.keySpecs, "Motorisation");
  const sensor = indicatorByLabel(system.keySpecs, "Capteur");
  const payload = indicatorByLabel(system.keySpecs, "Charge utile");
  const architecture = indicatorByLabel(system.keySpecs, "Architecture");

  const costLogic = indicatorByLabel(cost?.indicators ?? [], "Logique");
  const prime = indicatorByLabel(supply?.indicators ?? [], "oeuvre");
  const strike2025 = indicatorByLabel(finance?.indicators ?? [], "Alea");
  const strategicRole = indicatorByLabel(
    geopolitics?.indicators ?? [],
    "strategique",
  );
  const doctrine = indicatorByLabel(geopolitics?.indicators ?? [], "Doctrine");
  const exportFamily = indicatorByLabel(
    exportBrick?.indicators ?? [],
    "Famille",
  );
  const itarRegime = indicatorByLabel(
    exportBrick?.indicators ?? [],
    "applicable",
  );

  const confidenceClaims = getAllClaims().filter(
    (claim) => claim.systemSlug === system.slug,
  );
  const confidenceScore = scoreEvidence(system, "confiance-donnees");

  return [
    makeNode({
      id: `${system.slug}-fuselage`,
      label: "Cellule F-15 mature",
      type: "component",
      layer: "cout",
      risk: "low",
      confidence: costLogic?.confidence ?? "haute",
      claim:
        "Reutiliser une cellule eprouvee depuis les annees 70: faible risque de developpement, mais cellule non furtive — le choix est doctrinal, pas technologique.",
      evidence: evidenceFromIndicator(costLogic),
      ...sourceFromIndicator(sources, costLogic),
      nextAction:
        "Distinguer cout unitaire eleve (chasseur lourd) et risque de programme faible (cellule connue) — c'est la specificite EX.",
      position2d: { x: 50, y: 50 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-verriere`,
      label: "Verriere / cockpit",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: crew?.confidence ?? "haute",
      claim:
        "Le F-15EX se decline en monoplace ou biplace selon la configuration — un heritage de la famille F-15 qui distingue la formation et l'emploi.",
      evidence: evidenceFromIndicator(crew),
      ...sourceFromIndicator(sources, crew),
      nextAction:
        "Lire la repartition 1/2 sieges comme proxy de doctrine d'emploi (alerte vs frappe profonde).",
      position2d: { x: 50, y: 18 },
      position3d: { x: 0, y: 1.3, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-aesa-epawss`,
      label: "Radar AESA + EPAWSS",
      type: "component",
      layer: "supply-chain",
      risk: "low",
      confidence: sensor?.confidence ?? "haute",
      claim:
        "Sans furtivite, la survivabilite du F-15EX repose sur la guerre electronique: EPAWSS est le pendant de SPECTRA cote americain.",
      evidence: evidenceFromIndicator(sensor),
      ...sourceFromIndicator(sources, sensor),
      nextAction:
        "Comparer la logique EPAWSS (autoprotection active) avec celle de SPECTRA cote Rafale — meme reponse au meme probleme.",
      position2d: { x: 50, y: 8 },
      position3d: { x: 0, y: 1.7, z: 0.3 },
    }),
    makeNode({
      id: `${system.slug}-payload-left`,
      label: "Voilure gauche — emport",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: payload?.confidence ?? "moyenne",
      claim:
        "La charge utile du F-15EX figure parmi les plus elevees du domaine — jusqu'a environ 13 tonnes citees par Boeing. C'est le « camion a missiles » assume.",
      evidence: evidenceFromIndicator(payload),
      ...sourceFromIndicator(sources, payload),
      nextAction:
        "Croiser la charge utile annoncee constructeur avec les configurations operationnelles publiees — l'ecart peut etre significatif.",
      position2d: { x: 22, y: 56 },
      position3d: { x: -1.1, y: -0.1, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-payload-right`,
      label: "Voilure droite — famille F-15 export",
      type: "component",
      layer: "export",
      risk: "medium",
      confidence: exportFamily?.confidence ?? "moyenne",
      claim:
        "Le F-15EX equipe l'US Air Force, mais la famille F-15 moderne — F-15QA, F-15SA, F-15IA — est largement exportee sous ITAR vers Qatar, Arabie saoudite et Israel.",
      evidence: evidenceFromIndicator(exportFamily),
      ...sourceFromIndicator(sources, exportFamily),
      nextAction:
        "Documenter les ecarts d'avionique entre F-15EX (US) et derives export — l'avionique commune n'est pas un dossier ouvert.",
      position2d: { x: 78, y: 56 },
      position3d: { x: 1.1, y: -0.1, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-engine-left`,
      label: "Reacteur gauche (bimoteur)",
      type: "component",
      layer: "supply-chain",
      risk: "low",
      confidence: engine?.confidence ?? "haute",
      claim:
        "Le bimoteur est un trait de famille F-15: redondance, masse utile elevee, signature thermique forte — un choix qui exclut la furtivite mais sert la charge.",
      evidence: evidenceFromIndicator(engine),
      ...sourceFromIndicator(sources, engine),
      nextAction:
        "Lire le bimoteur comme un trait doctrinal (permanence, survie panne moteur) plutot que comme une simple specification.",
      position2d: { x: 44, y: 88 },
      position3d: { x: -0.3, y: -1.3, z: -0.2 },
    }),
    makeNode({
      id: `${system.slug}-engine-right`,
      label: "Reacteur droit (bimoteur)",
      type: "component",
      layer: "supply-chain",
      risk: "low",
      confidence: engine?.confidence ?? "haute",
      claim:
        "La symetrie bimoteur change toute la lecture de risque: une panne moteur ne signifie pas perte de la cellule, contrairement au F-35 monomoteur.",
      evidence: evidenceFromIndicator(engine),
      ...sourceFromIndicator(sources, engine),
      nextAction:
        "Utiliser la redondance bimoteur comme angle de comparaison avec les monomoteurs F-35, Gripen et autres.",
      position2d: { x: 56, y: 88 },
      position3d: { x: 0.3, y: -1.3, z: -0.2 },
    }),
    makeNode({
      id: `${system.slug}-oms`,
      label: "Architecture OMS",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: architecture?.confidence ?? "haute",
      claim:
        "Open Mission Systems ouvre l'integration de capteurs et armements tiers: c'est la promesse d'une mise a jour plus rapide qu'un programme ferme.",
      evidence: evidenceFromIndicator(architecture),
      ...sourceFromIndicator(sources, architecture),
      nextAction:
        "Suivre les integrations OMS effectives — la promesse architecturale ne vaut que si elle est exercee dans les standards livres.",
      position2d: { x: 38, y: 38 },
      position3d: { x: -0.4, y: 0.4, z: 0.05 },
    }),
    makeNode({
      id: `${system.slug}-boeing`,
      label: `${system.manufacturer} — Saint-Louis`,
      type: "supplier",
      layer: "finance",
      risk: "medium",
      confidence: prime?.confidence ?? "haute",
      claim:
        "Boeing concentre la production EX sur le site historique de Saint-Louis: cellule eprouvee, mais site expose aux aleas sociaux comme l'a montre 2025.",
      evidence: evidenceFromIndicator(prime),
      ...sourceFromIndicator(sources, prime),
      nextAction:
        "Suivre la cadence post-greve: Boeing vise un doublement vers 24 appareils par an apres reprise.",
      position2d: { x: 14, y: 78 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-strike-2025`,
      label: "Greve Boeing 2025 — alea industriel",
      type: "source",
      layer: "finance",
      risk: "medium",
      confidence: strike2025?.confidence ?? "haute",
      claim:
        "La greve d'aout a novembre 2025 a interrompu la ligne Saint-Louis: une chaine mature reste exposee aux aleas sociaux et industriels.",
      evidence: evidenceFromIndicator(strike2025),
      ...sourceFromIndicator(sources, strike2025),
      nextAction:
        "Conserver l'episode comme cas d'ecole: maturite industrielle ne signifie pas immunite aux ruptures sociales.",
      position2d: { x: 86, y: 78 },
      position3d: { x: 1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-usaf`,
      label: `${system.country} — complementarite 5e gen`,
      type: "country",
      layer: "geopolitique",
      risk: "low",
      confidence: doctrine?.confidence ?? "moyenne",
      claim:
        "Pour l'US Air Force, le F-15EX porte la masse et la permanence pendant que F-22 et F-35 assurent la penetration furtive: choix de ne pas tout miser sur la furtivite.",
      evidence: evidenceFromIndicator(doctrine ?? strategicRole),
      ...sourceFromIndicator(sources, doctrine ?? strategicRole),
      nextAction:
        "Lire le programme 98 EX comme un signal doctrinal: persistance d'une flotte 4.5e malgre l'engagement massif sur la 5e generation.",
      position2d: { x: 84, y: 22 },
      position3d: { x: 1.4, y: 0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-itar`,
      label: "ITAR — derives F-15QA/SA/IA",
      type: "source",
      layer: "export",
      risk: "medium",
      confidence: itarRegime?.confidence ?? "haute",
      claim:
        "Les derives F-15 modernes sont vendus d'Etat a Etat sous ITAR: Qatar, Arabie saoudite, Israel — un export reel mais sous controle americain.",
      evidence: evidenceFromIndicator(itarRegime),
      ...sourceFromIndicator(sources, itarRegime),
      nextAction:
        "Documenter contrat par contrat les configurations livrees — l'ecart avec l'avionique US peut etre significatif.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "low",
      confidence: confidenceScore.confidence,
      claim:
        "Le dossier F-15EX s'appuie sur Boeing, l'AFMC et la presse specialisee: chaine documentaire solide mais certains chiffres restent constructeur.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "La charge utile annoncee a environ 13t reste une valeur constructeur — les configurations operationnelles publiees peuvent etre inferieures.",
      nextAction:
        "Prioriser dans la Console OSINT les indicateurs marques constructeur (charge utile et cadence post-greve).",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function mq9ReaperNodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");

  const link = indicatorByLabel(system.keySpecs, "Liaison");
  const engine = indicatorByLabel(system.keySpecs, "Motorisation");
  const endurance = indicatorByLabel(system.keySpecs, "Endurance");

  const cellCost = indicatorByLabel(cost?.indicators ?? [], "cellule");
  const systemCost = indicatorByLabel(cost?.indicators ?? [], "systeme") ??
    indicatorByLabel(cost?.indicators ?? [], "Coût d'un système");
  const hourlyCost = indicatorByLabel(cost?.indicators ?? [], "horaire");
  const sustainmentGap = indicatorByLabel(finance?.indicators ?? [], "sous-estim") ??
    indicatorByLabel(finance?.indicators ?? [], "Poste");
  const fmsCanal = indicatorByLabel(finance?.indicators ?? [], "FMS") ??
    indicatorByLabel(finance?.indicators ?? [], "Canal");
  const prime = indicatorByLabel(supply?.indicators ?? [], "oeuvre");
  const criticalComponents = indicatorByLabel(supply?.indicators ?? [], "critiques");
  const strategicRole = indicatorByLabel(geopolitics?.indicators ?? [], "strategique") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "Fonction");
  const mtcrRegime = indicatorByLabel(exportBrick?.indicators ?? [], "applicable") ??
    indicatorByLabel(exportBrick?.indicators ?? [], "MTCR");
  const buyerLatitude = indicatorByLabel(exportBrick?.indicators ?? [], "acheteur") ??
    indicatorByLabel(exportBrick?.indicators ?? [], "Marge");

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
      confidence: cellCost?.confidence ?? "faible",
      claim:
        "Le piege du cout complet: la cellule seule (~30 M$) n'est qu'une fraction du systeme operationnel (~56 a 121 M$ avec vecteurs, stations sol, capteurs, liaisons).",
      evidence: evidenceFromIndicator(cellCost),
      ...sourceFromIndicator(sources, cellCost),
      nextAction:
        "Distinguer cout cellule, cout systeme et cout de possession — comparer un prix d'achat brut induit en erreur.",
      position2d: { x: 50, y: 50 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-system-cost`,
      label: "Cout systeme",
      type: "source",
      layer: "cout",
      risk: "high",
      confidence: systemCost?.confidence ?? "faible",
      claim:
        "Un systeme MQ-9 — quatre vecteurs, stations sol, capteurs, liaisons — change l'ordre de grandeur par rapport au seul vecteur.",
      evidence: evidenceFromIndicator(systemCost),
      ...sourceFromIndicator(sources, systemCost),
      nextAction:
        "Toujours afficher cout systeme et cout horaire en regard du cout cellule pour eviter la comparaison trompeuse.",
      position2d: { x: 28, y: 64 },
      position3d: { x: -0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-hourly-cost`,
      label: "Cout horaire de vol",
      type: "source",
      layer: "cout",
      risk: "high",
      confidence: hourlyCost?.confidence ?? "faible",
      claim:
        "Les estimations basses (3 500–5 000 $/h) ignorent personnel, segment SATCOM et maintenance lourde: le cout pleinement charge est sensiblement superieur.",
      evidence: evidenceFromIndicator(hourlyCost),
      ...sourceFromIndicator(sources, hourlyCost),
      nextAction:
        "Refaire la lecture en cout par heure de mission ISR reellement disponible, pas en cout par heure de vol brute.",
      position2d: { x: 72, y: 64 },
      position3d: { x: 0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-satcom`,
      label: "Liaison SATCOM",
      type: "component",
      layer: "geopolitique",
      risk: "high",
      confidence: link?.confidence ?? "haute",
      claim:
        "SATCOM affranchit le drone de l'horizon radio — mais cree une dependance spatiale et expose au brouillage. Lecture capacitaire, pas operationnelle.",
      evidence: evidenceFromIndicator(link),
      ...sourceFromIndicator(sources, link),
      nextAction:
        "Conserver la formulation au niveau capacitaire public; ne deduire aucun parametre d'emploi.",
      position2d: { x: 50, y: 14 },
      position3d: { x: 0, y: 1.5, z: 0.3 },
    }),
    makeNode({
      id: `${system.slug}-mts-b`,
      label: "Capteur MTS-B (Raytheon)",
      type: "supplier",
      layer: "supply-chain",
      risk: "medium",
      confidence: criticalComponents?.confidence ?? "haute",
      claim:
        "Boule optronique americaine: composant critique, mais chaine entierement nationale — peu de leviers de pression exterieurs sur le programme.",
      evidence: evidenceFromIndicator(criticalComponents),
      ...sourceFromIndicator(sources, criticalComponents),
      nextAction:
        "Comparer cette souverainete capteur avec les cas TB2 (substitution post-2020) et Shahed (electronique commerciale sous sanctions).",
      position2d: { x: 36, y: 30 },
      position3d: { x: -0.55, y: 0.85, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-engine`,
      label: "Moteur TPE331 (Honeywell)",
      type: "supplier",
      layer: "supply-chain",
      risk: "low",
      confidence: engine?.confidence ?? "haute",
      claim:
        "Turbopropulseur americain Honeywell — endurance ~27h en configuration ISR, motorisation industriellement maitrisee depuis des decennies.",
      evidence: evidenceFromIndicator(engine ?? endurance),
      ...sourceFromIndicator(sources, engine ?? endurance),
      nextAction:
        "Lire l'endurance comme un capacitaire, sans extrapoler ni en doctrine ni en signature thermique.",
      position2d: { x: 50, y: 84 },
      position3d: { x: 0, y: -1.2, z: -0.15 },
    }),
    makeNode({
      id: `${system.slug}-manufacturer`,
      label: system.manufacturer,
      type: "supplier",
      layer: "finance",
      risk: "low",
      confidence: prime?.confidence ?? "haute",
      claim:
        "General Atomics — maitre d'oeuvre unique, base industrielle nationale. La concentration industrielle est un trait de force, pas une fragilite.",
      evidence: evidenceFromIndicator(prime),
      ...sourceFromIndicator(sources, prime),
      nextAction:
        "Relier le maitre d'oeuvre au canal FMS: les deux concentrent la lecture industrielle, commerciale et diplomatique du programme.",
      position2d: { x: 14, y: 78 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-fms-canal`,
      label: "Canal FMS",
      type: "source",
      layer: "finance",
      risk: "high",
      confidence: fmsCanal?.confidence ?? "haute",
      claim:
        "L'Etat americain comme intermediaire contractuel: securisant pour l'acheteur, mais dependance aux arbitrages budgetaires et politiques de Washington.",
      evidence: evidenceFromIndicator(fmsCanal),
      ...sourceFromIndicator(sources, fmsCanal),
      nextAction:
        "Documenter contrat par contrat ce que recouvre exactement le FMS — vecteurs, soutien, formation, conditions d'emploi.",
      position2d: { x: 86, y: 78 },
      position3d: { x: 1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-sustainment-gap`,
      label: "MCO sous-estime",
      type: "source",
      layer: "finance",
      risk: "high",
      confidence: sustainmentGap?.confidence ?? "moyenne",
      claim:
        "Le soutien pluriannuel est le poste regulierement sous-estime du financement d'un parc: c'est lui qui domine le cout reel sur la duree.",
      evidence: evidenceFromIndicator(sustainmentGap),
      ...sourceFromIndicator(sources, sustainmentGap),
      nextAction:
        "Pousser la lecture vers le cout de possession en regard du cout d'acquisition: rapport souvent superieur a 1.5.",
      position2d: { x: 70, y: 38 },
      position3d: { x: 0.7, y: 0.45, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-allies-circle`,
      label: "Cercle restreint d'allies",
      type: "country",
      layer: "geopolitique",
      risk: "medium",
      confidence: strategicRole?.confidence ?? "moyenne",
      claim:
        "Reserve aux allies et partenaires proches — interoperabilite et influence americaines, mais effet de dependance eleve sur pieces et autorisations d'emploi.",
      evidence: evidenceFromIndicator(strategicRole),
      ...sourceFromIndicator(sources, strategicRole),
      nextAction:
        "Croiser la liste des operateurs avec le degre d'integration aux chaines de commandement americaines.",
      position2d: { x: 84, y: 22 },
      position3d: { x: 1.4, y: 0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-mtcr`,
      label: "MTCR cat. I (assoupli 2020)",
      type: "source",
      layer: "export",
      risk: "high",
      confidence: mtcrRegime?.confidence ?? "haute",
      claim:
        "ITAR + MTCR categorie I — la plus restrictive — reinterpretee unilateralement en 2020 pour les drones lents afin d'enrayer la perte d'influence face a Turquie et Chine.",
      evidence: evidenceFromIndicator(mtcrRegime),
      ...sourceFromIndicator(sources, mtcrRegime),
      nextAction:
        "Lire l'assouplissement 2020 comme un signal de doctrine d'export, pas comme une simple modification reglementaire.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-buyer-latitude`,
      label: "Marge d'emploi de l'acheteur",
      type: "source",
      layer: "export",
      risk: "medium",
      confidence: buyerLatitude?.confidence ?? "moyenne",
      claim:
        "Acquisition conditionnee a une autorisation americaine et un certificat d'utilisateur final: l'acheteur ne dispose jamais d'une pleine liberte d'usage.",
      evidence: evidenceFromIndicator(buyerLatitude),
      ...sourceFromIndicator(sources, buyerLatitude),
      nextAction:
        "Conserver cette restriction comme cadre de lecture; ne deduire aucune procedure d'emploi specifique.",
      position2d: { x: 30, y: 20 },
      position3d: { x: -0.7, y: 1.25, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "medium",
      confidence: confidenceScore.confidence,
      claim:
        "Le dossier MQ-9 est tres documente — Air Force, SIPRI, CSIS, GA-ASI — mais les donnees de cout restent dispersees d'une source a l'autre.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Les estimations de cout cellule, systeme et horaire varient fortement selon la source, le lot et le perimetre retenu.",
      nextAction:
        "Prioriser dans la Console OSINT les indicateurs marques variables, en commencant par les couts.",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function shahed136Nodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");

  const guidance = indicatorByLabel(system.keySpecs, "Guidage");

  const mfgCost = indicatorByLabel(cost?.indicators ?? [], "fabrication");
  const productionCost = indicatorByLabel(cost?.indicators ?? [], "Alabuga") ??
    indicatorByLabel(cost?.indicators ?? [], "production");
  const transferPrice = indicatorByLabel(cost?.indicators ?? [], "cession") ??
    indicatorByLabel(cost?.indicators ?? [], "Iran-Russie");
  const exchangeRatio = indicatorByLabel(cost?.indicators ?? [], "Ratio") ??
    indicatorByLabel(cost?.indicators ?? [], "echange");
  const transferChannel = indicatorByLabel(finance?.indicators ?? [], "Canal");
  const fundingLogic = indicatorByLabel(finance?.indicators ?? [], "Logique");
  const cellMaterials = indicatorByLabel(supply?.indicators ?? [], "Cellule");
  const electronics = indicatorByLabel(supply?.indicators ?? [], "critiques") ??
    indicatorByLabel(supply?.indicators ?? [], "electronique");
  const onuControversy = indicatorByLabel(geopolitics?.indicators ?? [], "Controverse") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "ONU");
  const counterDroneRace = indicatorByLabel(geopolitics?.indicators ?? [], "induit") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "anti-drones");
  const exportRegime = indicatorByLabel(exportBrick?.indicators ?? [], "applicable") ??
    indicatorByLabel(exportBrick?.indicators ?? [], "Regime");
  const traceability = indicatorByLabel(exportBrick?.indicators ?? [], "Tracabilite") ??
    indicatorByLabel(exportBrick?.indicators ?? [], "certificat");

  const confidenceClaims = getAllClaims().filter(
    (claim) => claim.systemSlug === system.slug,
  );
  const confidenceScore = scoreEvidence(system, "confiance-donnees");

  return [
    makeNode({
      id: `${system.slug}-airframe`,
      label: "Aile delta — vecteur consommable",
      type: "component",
      layer: "cout",
      risk: "low",
      confidence: cellMaterials?.confidence ?? "moyenne",
      claim:
        "Le Shahed est pense pour etre produit en masse et perdu en masse. La cellule est volontairement frugale: matieres simples, fabrication peu exigeante.",
      evidence: evidenceFromIndicator(cellMaterials),
      ...sourceFromIndicator(sources, cellMaterials),
      nextAction:
        "Lire la simplicite de la cellule comme strategie industrielle, pas comme faiblesse technique.",
      position2d: { x: 50, y: 50 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-mfg-cost`,
      label: "Cout de fabrication (~20-50 k$)",
      type: "source",
      layer: "cout",
      risk: "medium",
      confidence: mfgCost?.confidence ?? "faible",
      claim:
        "Cout materiel estime hors marge — une des trois estimations qui coexistent dans le dossier. L'incertitude n'est pas un bruit, c'est la donnee.",
      evidence: evidenceFromIndicator(mfgCost),
      ...sourceFromIndicator(sources, mfgCost),
      nextAction:
        "Toujours afficher les trois chiffres (fabrication, Alabuga, cession) ensemble; aucun ne suffit isolement.",
      position2d: { x: 24, y: 36 },
      position3d: { x: -1.05, y: 0.55, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-alabuga-cost`,
      label: "Production Alabuga (~70-80 k$)",
      type: "source",
      layer: "cout",
      risk: "medium",
      confidence: productionCost?.confidence ?? "faible",
      claim:
        "Production russe localisee a Alabuga depuis 2024 — Moscou investit pour s'affranchir des livraisons iraniennes.",
      evidence: evidenceFromIndicator(productionCost),
      ...sourceFromIndicator(sources, productionCost),
      nextAction:
        "Suivre la cadence Alabuga comme indicateur de soutenabilite d'une economie de guerre orientee volume.",
      position2d: { x: 50, y: 26 },
      position3d: { x: 0, y: 1.05, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-transfer-price`,
      label: "Prix de cession (~190-300 k$)",
      type: "source",
      layer: "cout",
      risk: "high",
      confidence: transferPrice?.confidence ?? "faible",
      claim:
        "Selon documents ayant fuite, prix paye par la Russie a l'Iran 2022-2023 — un ordre de grandeur au-dessus du cout de production. La rente strategique d'un fournisseur sous sanctions.",
      evidence: evidenceFromIndicator(transferPrice),
      ...sourceFromIndicator(sources, transferPrice),
      nextAction:
        "Documenter la chronologie de baisse du prix au fur et a mesure que la production se localise.",
      position2d: { x: 76, y: 36 },
      position3d: { x: 1.05, y: 0.55, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-exchange-ratio`,
      label: "Ratio d'echange (cout/effet)",
      type: "source",
      layer: "cout",
      risk: "high",
      confidence: exchangeRatio?.confidence ?? "haute",
      claim:
        "Meme a 80 k$, le Shahed reste sans commune mesure avec l'intercepteur sol-air — souvent 10 a 30 fois plus cher — qu'il force le defenseur a tirer. L'essentiel n'est pas le chiffre, c'est le ratio.",
      evidence: evidenceFromIndicator(exchangeRatio),
      ...sourceFromIndicator(sources, exchangeRatio),
      nextAction:
        "Lire ce ratio comme indicateur de pression economique sur le defenseur, pas comme parametre tactique d'emploi.",
      position2d: { x: 50, y: 76 },
      position3d: { x: 0, y: -1.05, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-guidance`,
      label: "Guidage GNSS/INS",
      type: "component",
      layer: "supply-chain",
      risk: "high",
      confidence: guidance?.confidence ?? "moyenne",
      claim:
        "Navigation inertielle + GNSS, sensible au brouillage. Lecture capacitaire publique — aucun parametre d'emploi ni de contre-mesure n'est decrit ici.",
      evidence: evidenceFromIndicator(guidance),
      ...sourceFromIndicator(sources, guidance),
      nextAction:
        "Conserver cette lecture au niveau public; ne deduire ni doctrine d'emploi ni protocole de contre-mesure.",
      position2d: { x: 36, y: 24 },
      position3d: { x: -0.55, y: 1.15, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-electronics`,
      label: "Electronique commerciale (occidentale)",
      type: "supplier",
      layer: "supply-chain",
      risk: "critical",
      confidence: electronics?.confidence ?? "moyenne",
      claim:
        "Drone pauvre dans sa cellule, riche dans son electronique: semi-conducteurs, microcontroleurs et modules de navigation d'origine commerciale occidentale — constat issu d'analyses de debris.",
      evidence: evidenceFromIndicator(electronics),
      ...sourceFromIndicator(sources, electronics),
      nextAction:
        "Suivre l'efficacite des controles export sur ces puces comme indicateur de soutenabilite de la production de masse.",
      position2d: { x: 64, y: 24 },
      position3d: { x: 0.55, y: 1.15, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-iran-russia-axis`,
      label: "Axe Iran–Russie",
      type: "country",
      layer: "geopolitique",
      risk: "high",
      confidence: transferChannel?.confidence ?? "haute",
      claim:
        "Le Shahed a fait de l'Iran un fournisseur d'armes de premier plan dans une guerre majeure, et scelle un rapprochement militaro-industriel avec la Russie.",
      evidence: evidenceFromIndicator(transferChannel ?? fundingLogic),
      ...sourceFromIndicator(sources, transferChannel ?? fundingLogic),
      nextAction:
        "Lire l'axe industriel comme un trait structurant, pas comme une circonstance.",
      position2d: { x: 14, y: 64 },
      position3d: { x: -1.4, y: -0.55, z: -0.15 },
    }),
    makeNode({
      id: `${system.slug}-counter-drone-race`,
      label: "Course aux defenses anti-drones",
      type: "source",
      layer: "geopolitique",
      risk: "medium",
      confidence: counterDroneRace?.confidence ?? "haute",
      claim:
        "Effet induit majeur — le Shahed a relance partout la quete d'une defense anti-drone reellement abordable. Sa principale consequence est dans les bureaux d'etudes.",
      evidence: evidenceFromIndicator(counterDroneRace),
      ...sourceFromIndicator(sources, counterDroneRace),
      nextAction:
        "Suivre cet effet induit comme un indicateur de bascule doctrinale dans la defense aerienne.",
      position2d: { x: 86, y: 64 },
      position3d: { x: 1.4, y: -0.55, z: -0.15 },
    }),
    makeNode({
      id: `${system.slug}-onu-controversy`,
      label: "Conformite ONU contestee",
      type: "source",
      layer: "export",
      risk: "high",
      confidence: onuControversy?.confidence ?? "moyenne",
      claim:
        "Transfert juge contraire aux engagements ONU pesant sur l'Iran par plusieurs Etats — cas-type des limites du systeme quand un fournisseur s'en affranchit.",
      evidence: evidenceFromIndicator(onuControversy),
      ...sourceFromIndicator(sources, onuControversy),
      nextAction:
        "Lire la controverse comme illustration des limites du regime d'export, pas comme jugement definitif.",
      position2d: { x: 30, y: 14 },
      position3d: { x: -0.85, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-no-regime`,
      label: "Hors regime de controle",
      type: "source",
      layer: "export",
      risk: "critical",
      confidence: exportRegime?.confidence ?? "moyenne",
      claim:
        "Pas d'autorisation, pas de certificat d'utilisateur final, pas de tracabilite. Le Shahed echappe a ce que les regimes d'export cherchent precisement a garantir.",
      evidence: evidenceFromIndicator(exportRegime ?? traceability),
      ...sourceFromIndicator(sources, exportRegime ?? traceability),
      nextAction:
        "Croiser avec les regimes ITAR/MTCR/Wassenaar pour mesurer l'ecart structural, pas pour evaluer un comportement.",
      position2d: { x: 70, y: 14 },
      position3d: { x: 0.85, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "high",
      confidence: confidenceScore.confidence,
      claim:
        "Le dossier Shahed est un cas-ecole d'incertitude assumee: donnees dispersees, souvent invuerifiables — l'opacite est elle-meme une information.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Cout, portee et chiffres de production varient fortement d'une source a l'autre. Le statut 'variable' domine le dossier.",
      nextAction:
        "Prioriser dans la Console OSINT les affirmations marquees variable pour suivre leur evolution dans le temps.",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function spy6Nodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");

  const rma = indicatorByLabel(system.keySpecs, "RMA");
  const variants = indicatorByLabel(system.keySpecs, "Variantes");
  const simultaneity = indicatorByLabel(system.keySpecs, "simultanees") ??
    indicatorByLabel(system.keySpecs, "Capacites");
  const c2 = indicatorByLabel(system.keySpecs, "Integration C2") ??
    indicatorByLabel(system.keySpecs, "C2");
  const rfTech = indicatorByLabel(system.keySpecs, "Technologie RF");

  const lccArg = indicatorByLabel(cost?.indicators ?? [], "LCC") ??
    indicatorByLabel(cost?.indicators ?? [], "constructeur");
  const exportModel = indicatorByLabel(finance?.indicators ?? [], "export") ??
    indicatorByLabel(finance?.indicators ?? [], "FMS");
  const industrialInvest = indicatorByLabel(finance?.indicators ?? [], "industriel");
  const verticalIntegration = indicatorByLabel(supply?.indicators ?? [], "verticale") ??
    indicatorByLabel(supply?.indicators ?? [], "Empreinte");
  const ganTech = indicatorByLabel(supply?.indicators ?? [], "GaN") ??
    indicatorByLabel(supply?.indicators ?? [], "Technologie RF");
  const cadenceRisk = indicatorByLabel(supply?.indicators ?? [], "industriel");
  const strategicPosition = indicatorByLabel(geopolitics?.indicators ?? [], "strategique") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "Position");
  const aegisDoctrine = indicatorByLabel(geopolitics?.indicators ?? [], "doctrinal") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "Couplage");
  const itarRegime = indicatorByLabel(exportBrick?.indicators ?? [], "applicable") ??
    indicatorByLabel(exportBrick?.indicators ?? [], "Regime");
  const exportPaths = indicatorByLabel(exportBrick?.indicators ?? [], "Pistes") ??
    indicatorByLabel(exportBrick?.indicators ?? [], "documentees");

  const confidenceClaims = getAllClaims().filter(
    (claim) => claim.systemSlug === system.slug,
  );
  const confidenceScore = scoreEvidence(system, "confiance-donnees");

  return [
    makeNode({
      id: `${system.slug}-rma-panel`,
      label: "Panneau AESA — briques RMA",
      type: "component",
      layer: "cout",
      risk: "medium",
      confidence: rma?.confidence ?? "haute",
      claim:
        "Brique elementaire 0,6 m de cote — chaque RMA est un mini-radar autonome. La modularite est le seul levier LCC tangible d'un capteur dont la valeur absolue reste elevee.",
      evidence: evidenceFromIndicator(rma),
      ...sourceFromIndicator(sources, rma),
      nextAction:
        "Distinguer prix du capteur, prix de l'integration Aegis et cout LCC: trois niveaux qu'une seule valeur ne resume pas.",
      position2d: { x: 50, y: 38 },
      position3d: { x: 0, y: 0.4, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-lcc-argument`,
      label: "Argument LCC modulaire",
      type: "source",
      layer: "cout",
      risk: "medium",
      confidence: lccArg?.confidence ?? "haute",
      claim:
        "Remplacer une brique defaillante coute moins cher qu'intervenir sur un panneau monolithique — argument LCC fort de RTX, mais a verifier dans la duree.",
      evidence: evidenceFromIndicator(lccArg),
      ...sourceFromIndicator(sources, lccArg),
      nextAction:
        "Suivre les retours d'experience MCO Flight III pour confronter l'argument LCC aux couts effectivement observes.",
      position2d: { x: 28, y: 50 },
      position3d: { x: -0.85, y: 0, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-variants`,
      label: "Quatre variantes ((V)1 a (V)4)",
      type: "source",
      layer: "finance",
      risk: "low",
      confidence: variants?.confidence ?? "haute",
      claim:
        "DDG Flight III (37 RMA), LHA/LPD/CVN, FFG Constellation, backfit Flight IIA (24 RMA): un meme produit decline en quatre profils selon la classe de navire.",
      evidence: evidenceFromIndicator(variants),
      ...sourceFromIndicator(sources, variants),
      nextAction:
        "Comparer le cout systeme par variante: nombre de RMA et integration changent l'ordre de grandeur.",
      position2d: { x: 72, y: 50 },
      position3d: { x: 0.85, y: 0, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-c2-aegis`,
      label: "Integration Aegis + NIFC-CA + CEC",
      type: "system",
      layer: "geopolitique",
      risk: "high",
      confidence: c2?.confidence ?? "haute",
      claim:
        "SPY-6 n'a aucune valeur operationnelle isole. Il ne se concoit qu'inscrit dans Aegis, NIFC-CA et CEC — sa valeur depend autant des liaisons que des briques RMA.",
      evidence: evidenceFromIndicator(c2 ?? aegisDoctrine),
      ...sourceFromIndicator(sources, c2 ?? aegisDoctrine),
      nextAction:
        "Lire l'integration C2 comme prerequis a toute acquisition export — pas un module optionnel.",
      position2d: { x: 50, y: 14 },
      position3d: { x: 0, y: 1.5, z: 0.3 },
    }),
    makeNode({
      id: `${system.slug}-multi-mission`,
      label: "Capacites simultanees IAMD",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: simultaneity?.confidence ?? "haute",
      claim:
        "Veille air, defense antiaerienne, defense antimissile balistique, conduite de tir et surveillance de surface — declarees simultanees. Lecture capacitaire publique.",
      evidence: evidenceFromIndicator(simultaneity),
      ...sourceFromIndicator(sources, simultaneity),
      nextAction:
        "Conserver cette lecture au niveau capacitaire; PRF, formes d'onde et ECCM precis restent classifies.",
      position2d: { x: 38, y: 26 },
      position3d: { x: -0.55, y: 1.05, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-gan-vertical`,
      label: "Modules T/R GaN — integration verticale",
      type: "component",
      layer: "supply-chain",
      risk: "medium",
      confidence: ganTech?.confidence ?? "haute",
      claim:
        "RTX revendique une integration verticale microelectronique GaN. C'est exactement le type de souverainete capteur que les industriels europeens cherchent a reproduire.",
      evidence: evidenceFromIndicator(ganTech ?? rfTech),
      ...sourceFromIndicator(sources, ganTech ?? rfTech),
      nextAction:
        "Suivre l'integration verticale RTX comme reference comparative pour les programmes radar souverains europeens.",
      position2d: { x: 62, y: 26 },
      position3d: { x: 0.55, y: 1.05, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-rtx`,
      label: system.manufacturer,
      type: "supplier",
      layer: "finance",
      risk: "low",
      confidence: industrialInvest?.confidence ?? "haute",
      claim:
        "Ligne dediee RMA chez RTX, montee en cadence en cours pour soutenir la flotte americaine. Empreinte industrielle entierement americaine.",
      evidence: evidenceFromIndicator(industrialInvest ?? verticalIntegration),
      ...sourceFromIndicator(sources, industrialInvest ?? verticalIntegration),
      nextAction:
        "Suivre la cadence face a la convergence des programmes navals US (Flight III, Constellation, Ford, San Antonio Flight II, backfit IIA).",
      position2d: { x: 14, y: 78 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-cadence-risk`,
      label: "Pression cadence + semi-conducteurs RF",
      type: "source",
      layer: "supply-chain",
      risk: "medium",
      confidence: cadenceRisk?.confidence ?? "moyenne",
      claim:
        "Risque industriel principal: ce n'est pas une dependance etrangere, c'est la cadence face aux programmes navals simultanes et la pression sur les semi-conducteurs RF avances.",
      evidence: evidenceFromIndicator(cadenceRisk),
      ...sourceFromIndicator(sources, cadenceRisk),
      nextAction:
        "Croiser avec les autres grands programmes radar et EW americains qui partagent le meme noeud de tension semi-conducteurs.",
      position2d: { x: 86, y: 78 },
      position3d: { x: 1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-pacific`,
      label: `${system.country} — pivot Pacifique`,
      type: "country",
      layer: "geopolitique",
      risk: "medium",
      confidence: strategicPosition?.confidence ?? "haute",
      claim:
        "Coeur de la transition IAMD navale US, theatre Pacifique prioritaire. SPY-6 porte la bascule doctrinale: capteur dedie -> IAMD integree.",
      evidence: evidenceFromIndicator(strategicPosition),
      ...sourceFromIndicator(sources, strategicPosition),
      nextAction:
        "Lire le programme comme signal doctrinal — meme un capteur exprime une posture strategique.",
      position2d: { x: 84, y: 22 },
      position3d: { x: 1.4, y: 0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-itar`,
      label: "ITAR — USML categorie XI",
      type: "source",
      layer: "export",
      risk: "high",
      confidence: itarRegime?.confidence ?? "haute",
      claim:
        "Capteur strategique sous controle Department of State — chaque transfert releve d'une decision politique de haut niveau, pas d'une simple commande.",
      evidence: evidenceFromIndicator(itarRegime),
      ...sourceFromIndicator(sources, itarRegime),
      nextAction:
        "Conserver cette restriction comme cadre de lecture; ne deduire aucune procedure d'integration alliee.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-export-paths`,
      label: "Pistes export (Japon, Coree, Australie, Espagne)",
      type: "source",
      layer: "export",
      risk: "medium",
      confidence: exportPaths?.confidence ?? "moyenne",
      claim:
        "FMS restreint aux allies operant Aegis. L'integration capteur n'a de sens qu'avec une integration Aegis correspondante — la valeur geopolitique l'emporte sur la valeur commerciale.",
      evidence: evidenceFromIndicator(exportPaths ?? exportModel),
      ...sourceFromIndicator(sources, exportPaths ?? exportModel),
      nextAction:
        "Suivre les niveaux de maturite (Maya-class, Hunter-class, F-110) sans extrapoler vers des dates fermes.",
      position2d: { x: 30, y: 14 },
      position3d: { x: -0.85, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "medium",
      confidence: confidenceScore.confidence,
      claim:
        "Documents Navy / RTX abondants et justifications DoD annuelles, mais parametres techniques fins (TRM, formes d'onde, ECCM) classifies.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Le perimetre Flight IIA et Constellation evolue lot apres lot: prendre la date du document budgetaire DoD comme reference.",
      nextAction:
        "Prioriser dans la Console OSINT les indicateurs marques variable (cout unitaire capteur, pistes export).",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function fremmFranceNodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");

  const sensors = indicatorByLabel(system.keySpecs, "Capteurs");
  const weapons = indicatorByLabel(system.keySpecs, "Armements");
  const aviation = indicatorByLabel(system.keySpecs, "Aviation");

  const costReading = indicatorByLabel(cost?.indicators ?? [], "lecture") ??
    indicatorByLabel(cost?.indicators ?? [], "Cout");
  const variability = indicatorByLabel(cost?.indicators ?? [], "Variabilite");
  const cooperativeOrigin = indicatorByLabel(finance?.indicators ?? [], "programme") ??
    indicatorByLabel(finance?.indicators ?? [], "Origine");
  const frenchStandard = indicatorByLabel(finance?.indicators ?? [], "Standard");
  const primeContractors = indicatorByLabel(supply?.indicators ?? [], "Maitres") ??
    indicatorByLabel(supply?.indicators ?? [], "oeuvre");
  const sonar = indicatorByLabel(supply?.indicators ?? [], "Sonar") ??
    indicatorByLabel(supply?.indicators ?? [], "CAPTAS");
  const effectors = indicatorByLabel(supply?.indicators ?? [], "Effecteurs") ??
    indicatorByLabel(supply?.indicators ?? [], "Aster");
  const strategicRole = indicatorByLabel(geopolitics?.indicators ?? [], "Role") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "ASM");
  const europeanCoop = indicatorByLabel(geopolitics?.indicators ?? [], "Europe");
  const exportability = indicatorByLabel(exportBrick?.indicators ?? [], "Exportabilite");
  const sensitivity = indicatorByLabel(exportBrick?.indicators ?? [], "Sensibilite") ??
    indicatorByLabel(exportBrick?.indicators ?? [], "Missiles");

  const confidenceClaims = getAllClaims().filter(
    (claim) => claim.systemSlug === system.slug,
  );
  const confidenceScore = scoreEvidence(system, "confiance-donnees");

  return [
    makeNode({
      id: `${system.slug}-hull`,
      label: "Coque / plateforme 6 000 t",
      type: "component",
      layer: "cout",
      risk: "low",
      confidence: costReading?.confidence ?? "moyenne",
      claim:
        "Fregate haut de gamme — cout complet domine par capteurs, missiles et MCO. La coque seule ne donne aucune lecture utile.",
      evidence: evidenceFromIndicator(costReading),
      ...sourceFromIndicator(sources, costReading),
      nextAction:
        "Refuser la comparaison brute par tonnage; lire la fregate comme systeme-de-systemes, pas comme volume d'acier.",
      position2d: { x: 50, y: 56 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-cms-setis`,
      label: "CMS SETIS",
      type: "system",
      layer: "supply-chain",
      risk: "medium",
      confidence: primeContractors?.confidence ?? "haute",
      claim:
        "Sans CMS, la fregate n'est qu'une coque. SETIS structure la lecture de souverainete: Naval Group au coeur de l'architecture combat franco-italienne.",
      evidence: evidenceFromIndicator(primeContractors),
      ...sourceFromIndicator(sources, primeContractors),
      nextAction:
        "Comparer SETIS avec Aegis (SPY-6), TACTICOS (Thales) et 9LV (Saab) pour situer le CMS dans son ecosysteme.",
      position2d: { x: 50, y: 30 },
      position3d: { x: 0, y: 0.95, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-radar-herakles`,
      label: "Radar Herakles (Thales)",
      type: "component",
      layer: "supply-chain",
      risk: "low",
      confidence: sensors?.confidence ?? "moyenne",
      claim:
        "Radar multifonction Thales — coeur du senseur AAW de la FREMM. Lecture capacitaire publique, sans parametres de detection precis.",
      evidence: evidenceFromIndicator(sensors),
      ...sourceFromIndicator(sources, sensors),
      nextAction:
        "Distinguer Herakles (FREMM) de Sea Fire (FDI) pour suivre la trajectoire des senseurs Thales sur fregates francaises.",
      position2d: { x: 50, y: 14 },
      position3d: { x: 0, y: 1.5, z: 0.3 },
    }),
    makeNode({
      id: `${system.slug}-captas4`,
      label: "Sonar CAPTAS-4 + UMS 4110",
      type: "component",
      layer: "supply-chain",
      risk: "low",
      confidence: sonar?.confidence ?? "haute",
      claim:
        "CAPTAS-4 transforme la FREMM en plateforme ASM credible a longue portee. Marqueur ASM le plus fort de la famille — la valeur est sous-marine autant que de surface.",
      evidence: evidenceFromIndicator(sonar),
      ...sourceFromIndicator(sources, sonar),
      nextAction:
        "Lire la performance ASM comme un capacitaire structurant, pas comme une option. Refuser la comparaison FREMM ASM / FREMM DA sans le distinguer.",
      position2d: { x: 30, y: 72 },
      position3d: { x: -0.85, y: -0.55, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-vls-aster`,
      label: "Sylver A50 — missiles Aster",
      type: "component",
      layer: "supply-chain",
      risk: "medium",
      confidence: effectors?.confidence ?? "moyenne",
      claim:
        "Aster 15/30 (MBDA), Exocet MM40 et MdCN selon configuration — l'arme nucleaire navale n'est pas dans le perimetre, contrairement au SNLE. VLS Sylver est l'autre marqueur du systeme.",
      evidence: evidenceFromIndicator(effectors ?? weapons),
      ...sourceFromIndicator(sources, effectors ?? weapons),
      nextAction:
        "Documenter par standard les configurations (cellules VLS, types Aster, presence ou non du MdCN) — fortes variations.",
      position2d: { x: 36, y: 42 },
      position3d: { x: -0.55, y: 0.3, z: 0.15 },
    }),
    makeNode({
      id: `${system.slug}-helicopter`,
      label: "NH90 Caïman Marine",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: aviation?.confidence ?? "moyenne",
      claim:
        "L'helicoptere ASM embarque etend la portee de detection sous-marine bien au-dela du sonar de coque. Trait constitutif d'une fregate ASM credible.",
      evidence: evidenceFromIndicator(aviation),
      ...sourceFromIndicator(sources, aviation),
      nextAction:
        "Lire l'aviation embarquee comme integrale du systeme ASM, pas comme equipement annexe.",
      position2d: { x: 70, y: 72 },
      position3d: { x: 0.85, y: -0.55, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-naval-group`,
      label: "Naval Group — Lorient",
      type: "supplier",
      layer: "finance",
      risk: "low",
      confidence: cooperativeOrigin?.confidence ?? "haute",
      claim:
        "Maitre d'oeuvre francais sur le programme cooperatif franco-italien, chantier de Lorient. Programme de flotte, pas achat unitaire isole.",
      evidence: evidenceFromIndicator(cooperativeOrigin),
      ...sourceFromIndicator(sources, cooperativeOrigin),
      nextAction:
        "Croiser avec Fincantieri (italien) pour lire la dimension cooperative comme tronc commun + branches nationales.",
      position2d: { x: 14, y: 84 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-asm-da-variants`,
      label: "Variantes ASM vs DA",
      type: "source",
      layer: "cout",
      risk: "medium",
      confidence: variability?.confidence ?? "haute",
      claim:
        "ASM et DA ne sont pas la meme fregate. La configuration change capteurs, VLS, missiles et standard — comparer par tonnage masque tout.",
      evidence: evidenceFromIndicator(variability),
      ...sourceFromIndicator(sources, variability),
      nextAction:
        "Toujours afficher la variante dans toute comparaison; sans variante, la comparaison FREMM est trompeuse.",
      position2d: { x: 86, y: 56 },
      position3d: { x: 1.4, y: 0, z: -0.05 },
    }),
    makeNode({
      id: `${system.slug}-european-coop`,
      label: "Cooperation europeenne navale",
      type: "country",
      layer: "geopolitique",
      risk: "medium",
      confidence: europeanCoop?.confidence ?? "haute",
      claim:
        "Coeur d'une fregate europeenne: meme famille industrielle, mais doctrines nationales et exports differencies. Modele a la fois cooperatif et national.",
      evidence: evidenceFromIndicator(europeanCoop ?? strategicRole),
      ...sourceFromIndicator(sources, europeanCoop ?? strategicRole),
      nextAction:
        "Lire la cooperation FREMM comme modele de reference pour les autres programmes europeens (FCAS, MGCS).",
      position2d: { x: 86, y: 30 },
      position3d: { x: 1.4, y: 0.95, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-french-standards`,
      label: `${system.country} — standards nationaux`,
      type: "country",
      layer: "geopolitique",
      risk: "low",
      confidence: frenchStandard?.confidence ?? "haute",
      claim:
        "Marine nationale et Marina Militare articulent la famille en standards distincts. La FREMM porte une souverainete maritime europeenne, sans dependance ITAR structurante.",
      evidence: evidenceFromIndicator(frenchStandard),
      ...sourceFromIndicator(sources, frenchStandard),
      nextAction:
        "Documenter chaque standard pour eviter l'amalgame: ASM, DA, version italienne, derives export ne sont pas equivalents.",
      position2d: { x: 84, y: 22 },
      position3d: { x: 1.4, y: 1.1, z: -0.05 },
    }),
    makeNode({
      id: `${system.slug}-export-regime`,
      label: "Exportabilite — partielle ITAR",
      type: "source",
      layer: "export",
      risk: "medium",
      confidence: exportability?.confidence ?? "moyenne",
      claim:
        "Famille exportable, mais chaque vente recompose missiles, capteurs, CMS et soutien. Exposition ITAR partielle — MdCN, Aster, Exocet et sonars exigent un examen par standard.",
      evidence: evidenceFromIndicator(exportability),
      ...sourceFromIndicator(sources, exportability),
      nextAction:
        "Documenter par contrat les configurations livrees — l'export vend autant un soutien de longue duree qu'un batiment.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-export-sensitivity`,
      label: "Sensibilites export (missiles, CMS, EW)",
      type: "source",
      layer: "export",
      risk: "medium",
      confidence: sensitivity?.confidence ?? "moyenne",
      claim:
        "Missiles, CMS, guerre electronique et sonars soumis a arbitrages politiques. La fregate est exportee, mais sa configuration est negociee piece par piece.",
      evidence: evidenceFromIndicator(sensitivity),
      ...sourceFromIndicator(sources, sensitivity),
      nextAction:
        "Conserver cette grille (missiles / CMS / EW / sonars) comme cadre de lecture des contrats export navals.",
      position2d: { x: 30, y: 14 },
      position3d: { x: -0.85, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "low",
      confidence: confidenceScore.confidence,
      claim:
        "Caracteristiques et roles bien documentes — Naval Group, Thales, presse specialisee — mais configurations exactes et couts restent variables selon standard et variante.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Configurations exactes (VLS, presence MdCN, version Aster) varient entre unites et standards: prudence avant toute comparaison.",
      nextAction:
        "Prioriser dans la Console OSINT les indicateurs marques variable (configurations effecteurs, couts unitaires).",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function eurofighterTyphoonNodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");

  const crew = indicatorByLabel(system.keySpecs, "Equipage") ??
    indicatorByLabel(system.keySpecs, "Équipage");
  const engine = indicatorByLabel(system.keySpecs, "Motorisation");
  const radar = indicatorByLabel(system.keySpecs, "Capteur");
  const dass = indicatorByLabel(system.keySpecs, "electronique") ??
    indicatorByLabel(system.keySpecs, "électronique");
  const tranche5 = indicatorByLabel(system.keySpecs, "Tranche");
  const consortium = indicatorByLabel(system.keySpecs, "Industriels");

  const sharedDevelopment = indicatorByLabel(cost?.indicators ?? [], "partage") ??
    indicatorByLabel(cost?.indicators ?? [], "Modele");
  const coordinationCost = indicatorByLabel(cost?.indicators ?? [], "coordination");
  const modernization = indicatorByLabel(cost?.indicators ?? [], "Modernisation");
  const fundingModel = indicatorByLabel(finance?.indicators ?? [], "financement");
  const recentOrder = indicatorByLabel(finance?.indicators ?? [], "Commande");
  const primes = indicatorByLabel(supply?.indicators ?? [], "oeuvre");
  const distributionEffect = indicatorByLabel(supply?.indicators ?? [], "repartition") ??
    indicatorByLabel(supply?.indicators ?? [], "répartition");
  const strategicRole = indicatorByLabel(geopolitics?.indicators ?? [], "strategique") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "Fonction");
  const friction = indicatorByLabel(geopolitics?.indicators ?? [], "Friction");
  const exportRegime = indicatorByLabel(exportBrick?.indicators ?? [], "applicable") ??
    indicatorByLabel(exportBrick?.indicators ?? [], "Regime");
  const exportLimit = indicatorByLabel(exportBrick?.indicators ?? [], "Limite") ??
    indicatorByLabel(exportBrick?.indicators ?? [], "veto");

  const confidenceClaims = getAllClaims().filter(
    (claim) => claim.systemSlug === system.slug,
  );
  const confidenceScore = scoreEvidence(system, "confiance-donnees");

  return [
    makeNode({
      id: `${system.slug}-fuselage`,
      label: "Cellule delta-canard",
      type: "component",
      layer: "cout",
      risk: "medium",
      confidence: sharedDevelopment?.confidence ?? "haute",
      claim:
        "Le Typhoon est un 4.5 non furtif: cellule eprouvee, mais coût d'acquisition et de MCO alourdis par la coordination du consortium a quatre.",
      evidence: evidenceFromIndicator(sharedDevelopment),
      ...sourceFromIndicator(sources, sharedDevelopment),
      nextAction:
        "Distinguer prix de catalogue, cout systeme et cout de coordination — c'est ce dernier qui rend le Typhoon different d'un appareil souverain.",
      position2d: { x: 50, y: 50 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-cockpit`,
      label: "Cockpit (mono ou biplace)",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: crew?.confidence ?? "haute",
      claim:
        "Le Typhoon existe en monoplace ou biplace selon la version — repartition par contrat = proxy de la doctrine d'emploi de chaque nation cliente.",
      evidence: evidenceFromIndicator(crew),
      ...sourceFromIndicator(sources, crew),
      nextAction:
        "Lire la repartition 1/2 sieges comme indicateur d'emploi formation vs combat operationnel.",
      position2d: { x: 50, y: 22 },
      position3d: { x: 0, y: 1.15, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-ecrs-aesa`,
      label: "Radar AESA ECRS",
      type: "component",
      layer: "supply-chain",
      risk: "medium",
      confidence: radar?.confidence ?? "haute",
      claim:
        "ECRS Mk1 — standard germano-espagnol en cours d'integration sur Tranches 4 et 5. C'est le signe que le Typhoon entre dans son palier AESA souverain.",
      evidence: evidenceFromIndicator(radar),
      ...sourceFromIndicator(sources, radar),
      nextAction:
        "Suivre la divergence Mk0/Mk1/Mk2 par nation — chaque variante du radar dessine un Typhoon different.",
      position2d: { x: 50, y: 10 },
      position3d: { x: 0, y: 1.6, z: 0.3 },
    }),
    makeNode({
      id: `${system.slug}-dass`,
      label: "DASS — autoprotection",
      type: "component",
      layer: "sources",
      risk: "medium",
      confidence: dass?.confidence ?? "haute",
      claim:
        "Comme pour le Rafale (SPECTRA) et le F-15EX (EPAWSS): sans furtivite native, la survivabilite passe par la guerre electronique active. Logique structurante du 4.5.",
      evidence: evidenceFromIndicator(dass),
      ...sourceFromIndicator(sources, dass),
      nextAction:
        "Comparer DASS / SPECTRA / EPAWSS comme trois reponses paralleles a la meme question doctrinale.",
      position2d: { x: 38, y: 38 },
      position3d: { x: -0.4, y: 0.4, z: 0.05 },
    }),
    makeNode({
      id: `${system.slug}-ej200`,
      label: "Moteur EJ200 (consortium Eurojet)",
      type: "supplier",
      layer: "supply-chain",
      risk: "medium",
      confidence: engine?.confidence ?? "haute",
      claim:
        "Le moteur lui-meme est cooperatif (Eurojet = Rolls-Royce, MTU, Avio, ITP). La coperation reapparait jusque dans la propulsion — pas un sous-traitant unique, un mini-consortium.",
      evidence: evidenceFromIndicator(engine),
      ...sourceFromIndicator(sources, engine),
      nextAction:
        "Suivre les decisions d'evolution moteur — chaque modernisation engage les quatre membres d'Eurojet.",
      position2d: { x: 50, y: 84 },
      position3d: { x: 0, y: -1.2, z: -0.15 },
    }),
    makeNode({
      id: `${system.slug}-coordination-cost`,
      label: "Cout de coordination",
      type: "source",
      layer: "cout",
      risk: "high",
      confidence: coordinationCost?.confidence ?? "moyenne",
      claim:
        "Le surcout propre a la gouvernance partagee a quatre n'est pas une variable d'ajustement — c'est un trait structurel de tout programme cooperatif.",
      evidence: evidenceFromIndicator(coordinationCost ?? modernization),
      ...sourceFromIndicator(sources, coordinationCost ?? modernization),
      nextAction:
        "Comparer le rythme de modernisation Typhoon avec Rafale (national) et F-35 (cooperatif US-centric) pour mesurer l'effet 'consortium pur'.",
      position2d: { x: 28, y: 64 },
      position3d: { x: -0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-tranche-5`,
      label: "Tranche 5 — commande 2025",
      type: "source",
      layer: "finance",
      risk: "low",
      confidence: tranche5?.confidence ?? "haute",
      claim:
        "20 appareils signes par l'Allemagne en 2025, livraisons debut 2030s. Le signal financier le plus fort que le programme puisse recevoir.",
      evidence: evidenceFromIndicator(tranche5 ?? recentOrder),
      ...sourceFromIndicator(sources, tranche5 ?? recentOrder),
      nextAction:
        "Lire la Tranche 5 comme reaffirmation de l'engagement allemand, pas comme garantie de coordination future.",
      position2d: { x: 72, y: 64 },
      position3d: { x: 0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-primes`,
      label: "Airbus · BAE · Leonardo",
      type: "supplier",
      layer: "finance",
      risk: "medium",
      confidence: primes?.confidence ?? "haute",
      claim:
        "Trois industriels coproduisent l'appareil par nation. Charge de travail garantie a chaque pays — mais decisions ralenties par construction.",
      evidence: evidenceFromIndicator(primes ?? consortium),
      ...sourceFromIndicator(sources, primes ?? consortium),
      nextAction:
        "Documenter la repartition (cellule / avionique / radar / moteur) par nation pour evaluer la dependance reciproque.",
      position2d: { x: 14, y: 78 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-funding-model`,
      label: "Financement 4 nations + export",
      type: "source",
      layer: "finance",
      risk: "low",
      confidence: fundingModel?.confidence ?? "haute",
      claim:
        "Programme finance au prorata des commandes nationales + ventes export. Aucune nation ne decide seule, ni ne paie seule.",
      evidence: evidenceFromIndicator(fundingModel),
      ...sourceFromIndicator(sources, fundingModel),
      nextAction:
        "Croiser commandes nationales et part de production pour situer le rapport de force interne au consortium.",
      position2d: { x: 86, y: 78 },
      position3d: { x: 1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-european-pillar`,
      label: "Pilier coop. aerienne europeenne",
      type: "country",
      layer: "geopolitique",
      risk: "low",
      confidence: strategicRole?.confidence ?? "haute",
      claim:
        "Le Typhoon est rival et complement du Rafale. Pilier d'interception et de police du ciel OTAN, il occupe une place que ni le F-35 ni le Rafale ne remplissent seuls.",
      evidence: evidenceFromIndicator(strategicRole),
      ...sourceFromIndicator(sources, strategicRole),
      nextAction:
        "Lire le binome Typhoon / Rafale comme deux modeles de souverainete — cooperative vs nationale — qui coexistent en Europe.",
      position2d: { x: 84, y: 22 },
      position3d: { x: 1.4, y: 0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-friction`,
      label: "Friction de gouvernance",
      type: "source",
      layer: "geopolitique",
      risk: "high",
      confidence: friction?.confidence ?? "haute",
      claim:
        "Cas-ecole de la cooperation europeenne: la capacite est au rendez-vous, la friction de gouvernance est structurelle. Lecon que le SCAF tente d'integrer.",
      evidence: evidenceFromIndicator(friction ?? distributionEffect),
      ...sourceFromIndicator(sources, friction ?? distributionEffect),
      nextAction:
        "Suivre les decisions SCAF comme test grandeur reelle d'une cooperation europeenne moins friction-prone.",
      position2d: { x: 70, y: 38 },
      position3d: { x: 0.7, y: 0.45, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-export-veto`,
      label: "Export — accord des 4 nations",
      type: "source",
      layer: "export",
      risk: "high",
      confidence: exportRegime?.confidence ?? "haute",
      claim:
        "Chaque vente engage les quatre nations partenaires. Un veto national peut suspendre une livraison — l'acheteur depend de la cohesion d'un consortium, pas d'un Etat.",
      evidence: evidenceFromIndicator(exportRegime),
      ...sourceFromIndicator(sources, exportRegime),
      nextAction:
        "Documenter les precedents (Arabie saoudite — episode Khashoggi, etc.) comme cas concrets de friction export.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-export-clients`,
      label: "Arabie, Oman, Koweit, Qatar, Autriche",
      type: "source",
      layer: "export",
      risk: "medium",
      confidence: exportLimit?.confidence ?? "moyenne",
      claim:
        "Export reel mais politiquement plus contraint qu'un appareil souverain. Les clients connus illustrent la coexistence cooperation-friction.",
      evidence: evidenceFromIndicator(exportLimit),
      ...sourceFromIndicator(sources, exportLimit),
      nextAction:
        "Croiser la liste des clients avec les episodes de veto national pour identifier les marches a risque.",
      position2d: { x: 30, y: 14 },
      position3d: { x: -0.85, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "low",
      confidence: confidenceScore.confidence,
      claim:
        "Le dossier Typhoon s'appuie sur les industriels (Eurofighter, BAE), la presse specialisee et SIPRI: documentation dense, mais calendriers de modernisation mouvants.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Les calendriers de modernisation (ECRS Mk1/Mk2, integration capteurs) restent ouverts et negocies entre nations.",
      nextAction:
        "Prioriser dans la Console OSINT les indicateurs marques 'moyenne' confiance — surtout autour de la modernisation.",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function charlesDeGaulleNodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");

  const propulsion = indicatorByLabel(system.keySpecs, "Propulsion");
  const airGroup = indicatorByLabel(system.keySpecs, "Groupe aerien") ??
    indicatorByLabel(system.keySpecs, "Groupe aérien");
  const architecture = indicatorByLabel(system.keySpecs, "Architecture");
  const succession = indicatorByLabel(system.keySpecs, "Succession");

  const mco = indicatorByLabel(cost?.indicators ?? [], "MCO");
  const totalCost = indicatorByLabel(cost?.indicators ?? [], "complet") ??
    indicatorByLabel(cost?.indicators ?? [], "Cout");
  const sovereignChannel = indicatorByLabel(finance?.indicators ?? [], "acquisition") ??
    indicatorByLabel(finance?.indicators ?? [], "Canal");
  const successor = indicatorByLabel(finance?.indicators ?? [], "Releve");
  const nuclearChain = indicatorByLabel(supply?.indicators ?? [], "Propulsion");
  const aviationDep = indicatorByLabel(supply?.indicators ?? [], "Aviation") ??
    indicatorByLabel(supply?.indicators ?? [], "embarquee");
  const rareCompetence = indicatorByLabel(supply?.indicators ?? [], "rare") ??
    indicatorByLabel(supply?.indicators ?? [], "CATOBAR");
  const strategicRole = indicatorByLabel(geopolitics?.indicators ?? [], "Role");
  const systemicVulnerability = indicatorByLabel(geopolitics?.indicators ?? [], "Vulnerabilite") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "systemique");
  const noExport = indicatorByLabel(exportBrick?.indicators ?? [], "Exportabilite");
  const sensitiveControl = indicatorByLabel(exportBrick?.indicators ?? [], "Controle");

  const confidenceClaims = getAllClaims().filter(
    (claim) => claim.systemSlug === system.slug,
  );
  const confidenceScore = scoreEvidence(system, "confiance-donnees");

  return [
    makeNode({
      id: `${system.slug}-hull`,
      label: "Plateforme 42 000 t (CATOBAR)",
      type: "component",
      layer: "cout",
      risk: "medium",
      confidence: architecture?.confidence ?? "haute",
      claim:
        "La coque seule ne se lit pas. Le PA se compare par son groupe aerien, ses catapultes, son escorte, son MCO nucleaire et sa capacite C2 — pas par son tonnage.",
      evidence: evidenceFromIndicator(architecture),
      ...sourceFromIndicator(sources, architecture),
      nextAction:
        "Refuser la comparaison brute par tonnage; lire le PA comme architecture de puissance, pas comme bateau.",
      position2d: { x: 50, y: 56 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-air-group`,
      label: "Rafale Marine + Hawkeye",
      type: "component",
      layer: "sources",
      risk: "medium",
      confidence: airGroup?.confidence ?? "moyenne",
      claim:
        "L'aviation embarquee est constitutive du systeme, pas un accessoire. C'est elle qui transforme la coque en outil de projection.",
      evidence: evidenceFromIndicator(airGroup),
      ...sourceFromIndicator(sources, airGroup),
      nextAction:
        "Lire les fiches Rafale, E-2C Hawkeye et NH90 en regard du PA: le PA est un cluster de fiches, pas une fiche isolee.",
      position2d: { x: 50, y: 14 },
      position3d: { x: 0, y: 1.5, z: 0.3 },
    }),
    makeNode({
      id: `${system.slug}-catobar`,
      label: "Architecture CATOBAR",
      type: "component",
      layer: "supply-chain",
      risk: "high",
      confidence: rareCompetence?.confidence ?? "haute",
      claim:
        "Catapultes a vapeur, brins d'arret, pont d'envol incline: competence rare et peu exportable. C'est le coeur de la specificite francaise hors US.",
      evidence: evidenceFromIndicator(rareCompetence),
      ...sourceFromIndicator(sources, rareCompetence),
      nextAction:
        "Suivre les transferts de competences CATOBAR vers PA-NG — la rupture de continuite serait industrielle, pas seulement technique.",
      position2d: { x: 36, y: 30 },
      position3d: { x: -0.55, y: 0.85, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-nuclear`,
      label: "Chaufferies K15 — propulsion nucleaire",
      type: "component",
      layer: "supply-chain",
      risk: "high",
      confidence: nuclearChain?.confidence ?? "haute",
      claim:
        "Seul PA nucleaire non americain en service. La filiere nucleaire navale francaise est l'autre competence rare — endurance illimitee, MCO specialise.",
      evidence: evidenceFromIndicator(nuclearChain ?? propulsion),
      ...sourceFromIndicator(sources, nuclearChain ?? propulsion),
      nextAction:
        "Documenter le cycle de remplacement de coeurs K15 comme indicateur de continuite de la filiere nucleaire navale.",
      position2d: { x: 50, y: 84 },
      position3d: { x: 0, y: -1.2, z: -0.15 },
    }),
    makeNode({
      id: `${system.slug}-mco-cycles`,
      label: "ATM / IPER — arrets techniques majeurs",
      type: "source",
      layer: "cout",
      risk: "high",
      confidence: mco?.confidence ?? "haute",
      claim:
        "Les arrets techniques majeurs sont des evenements industriels autant que militaires — la disponibilite reelle se mesure entre cycles.",
      evidence: evidenceFromIndicator(mco),
      ...sourceFromIndicator(sources, mco),
      nextAction:
        "Lire chaque ATM/IPER comme jalon de planification — pas comme parenthese.",
      position2d: { x: 28, y: 64 },
      position3d: { x: -0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-total-cost`,
      label: "Cout complet — groupe aeronaval",
      type: "source",
      layer: "cout",
      risk: "medium",
      confidence: totalCost?.confidence ?? "moyenne",
      claim:
        "Le cout pertinent est celui du groupe aeronaval, pas de la coque. Aviation, escorte, ravitailleurs, soutien nucleaire, infrastructures: l'addition est l'echelle utile.",
      evidence: evidenceFromIndicator(totalCost),
      ...sourceFromIndicator(sources, totalCost),
      nextAction:
        "Construire le cout systeme PA en additionnant fiches Rafale Marine + Hawkeye + FREMM d'escorte + ravitailleur + ATM.",
      position2d: { x: 72, y: 64 },
      position3d: { x: 0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-naval-group`,
      label: "Naval Group — Brest",
      type: "supplier",
      layer: "finance",
      risk: "low",
      confidence: sovereignChannel?.confidence ?? "haute",
      claim:
        "Programme national, maitrise d'oeuvre Naval Group, ports d'attache et de maintenance souverains. Aucun mecanisme contractuel exterieur.",
      evidence: evidenceFromIndicator(sovereignChannel),
      ...sourceFromIndicator(sources, sovereignChannel),
      nextAction:
        "Croiser avec la fiche FREMM (meme MOe, meme port d'attache) pour mesurer l'effet de cluster industriel.",
      position2d: { x: 14, y: 78 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-pang`,
      label: "PA-NG — releve fin 2030s",
      type: "source",
      layer: "finance",
      risk: "high",
      confidence: successor?.confidence ?? "moyenne",
      claim:
        "Programme de releve lance, premieres pieces longue duree en production. Les decisions d'aujourd'hui conditionnent la continuite des competences nucleaires et CATOBAR.",
      evidence: evidenceFromIndicator(successor ?? succession),
      ...sourceFromIndicator(sources, successor ?? succession),
      nextAction:
        "Suivre le PA-NG comme indicateur de continuite industrielle souveraine — un retard est plus qu'un retard.",
      position2d: { x: 86, y: 78 },
      position3d: { x: 1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-air-dependency`,
      label: "Ecosysteme aviation embarquee",
      type: "supplier",
      layer: "supply-chain",
      risk: "medium",
      confidence: aviationDep?.confidence ?? "moyenne",
      claim:
        "Dependance a Dassault (Rafale Marine), Northrop Grumman (Hawkeye), soutien pont. Le PA n'est pas isole de ses fournisseurs aviation.",
      evidence: evidenceFromIndicator(aviationDep),
      ...sourceFromIndicator(sources, aviationDep),
      nextAction:
        "Lire le Hawkeye comme la seule fenetre US dans une architecture autrement souveraine.",
      position2d: { x: 70, y: 38 },
      position3d: { x: 0.7, y: 0.45, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-projection`,
      label: `${system.country} — projection souveraine`,
      type: "country",
      layer: "geopolitique",
      risk: "medium",
      confidence: strategicRole?.confidence ?? "haute",
      claim:
        "Outil de presence et de signalement politique. Permet a la France de projeter une aviation de combat depuis la mer et de maintenir une autonomie de decision dans les crises.",
      evidence: evidenceFromIndicator(strategicRole),
      ...sourceFromIndicator(sources, strategicRole),
      nextAction:
        "Lire les deploiements (Mediterranee, Indo-Pacifique) comme signaux politiques autant que militaires.",
      position2d: { x: 84, y: 22 },
      position3d: { x: 1.4, y: 0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-systemic-vulnerability`,
      label: "Concentration de valeur",
      type: "source",
      layer: "geopolitique",
      risk: "high",
      confidence: systemicVulnerability?.confidence ?? "moyenne",
      claim:
        "Outil puissant mais rare et concentre. L'effet depend d'un groupe complet disponible (escorte, ravitaillement, defense aerienne) — vulnerabilite systemique.",
      evidence: evidenceFromIndicator(systemicVulnerability),
      ...sourceFromIndicator(sources, systemicVulnerability),
      nextAction:
        "Conserver cette concentration de valeur comme cadre de lecture; ne deduire aucune posture tactique.",
      position2d: { x: 36, y: 42 },
      position3d: { x: -0.55, y: 0.3, z: 0.15 },
    }),
    makeNode({
      id: `${system.slug}-no-export`,
      label: "Non exportable en pratique",
      type: "source",
      layer: "export",
      risk: "high",
      confidence: noExport?.confidence ?? "haute",
      claim:
        "Capacite souveraine nucleaire et CATOBAR. Pas de marche, pas de regime — la valeur export est strictement indirecte (credibilite industrielle).",
      evidence: evidenceFromIndicator(noExport),
      ...sourceFromIndicator(sources, noExport),
      nextAction:
        "Lire l'effet indirect (filiere Naval Group + Dassault) comme valeur export reelle du programme PA.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-sensitive-control`,
      label: "Technologies sensibles — nucleaire + C2",
      type: "source",
      layer: "export",
      risk: "medium",
      confidence: sensitiveControl?.confidence ?? "haute",
      claim:
        "Propulsion nucleaire, catapultes, aviation embarquee et C2 restent hautement sensibles. Exposition ITAR partielle via la chaine aviation (Hawkeye).",
      evidence: evidenceFromIndicator(sensitiveControl),
      ...sourceFromIndicator(sources, sensitiveControl),
      nextAction:
        "Distinguer composants nucleaires (souverains) et composants aviation (partiellement US) dans la lecture export.",
      position2d: { x: 30, y: 14 },
      position3d: { x: -0.85, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "medium",
      confidence: confidenceScore.confidence,
      claim:
        "Caracteristiques publiques solides (Marine nationale, Naval Group). Disponibilite reelle et couts detailles restent plus sensibles, surtout sur le PA-NG.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Couts d'ATM/IPER, disponibilite reelle et planning PA-NG comportent une part publique et une part classifiee.",
      nextAction:
        "Prioriser dans la Console OSINT les indicateurs liees au PA-NG — leur trajectoire conditionne la lecture du programme entier.",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function helmaPNodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");
  const constraints = system.physicalConstraints ?? [];

  const power = indicatorByLabel(system.keySpecs, "puissance");
  const range = indicatorByLabel(system.keySpecs, "neutralisation") ??
    indicatorByLabel(system.keySpecs, "Portee de neut");
  const targets = indicatorByLabel(system.keySpecs, "Cibles");
  const mission = indicatorByLabel(system.keySpecs, "Mission");

  const marginalCost = indicatorByLabel(cost?.indicators ?? [], "marginal");
  const systemCost = indicatorByLabel(cost?.indicators ?? [], "systeme");
  const economicLogic = indicatorByLabel(cost?.indicators ?? [], "Logique");
  const dgaMaster = indicatorByLabel(finance?.indicators ?? [], "ouvrage") ??
    indicatorByLabel(finance?.indicators ?? [], "DGA");
  const l2adContract = indicatorByLabel(finance?.indicators ?? [], "L2AD") ??
    indicatorByLabel(finance?.indicators ?? [], "contractuel");
  const budgetStage = indicatorByLabel(finance?.indicators ?? [], "budgetaire") ??
    indicatorByLabel(finance?.indicators ?? [], "Stade");
  const cilas = indicatorByLabel(supply?.indicators ?? [], "oeuvre");
  const criticalSubsystems = indicatorByLabel(supply?.indicators ?? [], "critiques");
  const foreignDep = indicatorByLabel(supply?.indicators ?? [], "etrangere") ??
    indicatorByLabel(supply?.indicators ?? [], "étrangère");
  const strategicRole = indicatorByLabel(geopolitics?.indicators ?? [], "strategique") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "Fonction");
  const layerRole = indicatorByLabel(geopolitics?.indicators ?? [], "Place") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "basse");
  const exportStatus = indicatorByLabel(exportBrick?.indicators ?? [], "Statut");
  const sensitivity = indicatorByLabel(exportBrick?.indicators ?? [], "Sensibilite");

  const lineOfSight = indicatorByLabel(constraints, "Ligne");
  const atmosphere = indicatorByLabel(constraints, "Atmosphere") ??
    indicatorByLabel(constraints, "Atmosphère");
  const dwellTime = indicatorByLabel(constraints, "illumination");
  const cooling = indicatorByLabel(constraints, "Refroidissement");

  const confidenceClaims = getAllClaims().filter(
    (claim) => claim.systemSlug === system.slug,
  );
  const confidenceScore = scoreEvidence(system, "confiance-donnees");

  return [
    makeNode({
      id: `${system.slug}-laser-source`,
      label: "Source laser ~2 kW",
      type: "component",
      layer: "cout",
      risk: "medium",
      confidence: power?.confidence ?? "moyenne",
      claim:
        "Classe basse — pensee pour les drones legers (100 g a 25 kg). Pas un bouclier aerien: un effecteur de site, complementaire des autres couches.",
      evidence: evidenceFromIndicator(power),
      ...sourceFromIndicator(sources, power),
      nextAction:
        "Distinguer puissance laser et effet militaire: a 2 kW, la portee utile depend de la cible, pas seulement de la classe de puissance.",
      position2d: { x: 50, y: 50 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-targets`,
      label: "Cibles — drones 100 g a 25 kg",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: targets?.confidence ?? "moyenne",
      claim:
        "Lecture capacitaire publique. Le perimetre cibles est volontairement borne — pas d'extrapolation tactique ni doctrinale au-dela.",
      evidence: evidenceFromIndicator(targets ?? range),
      ...sourceFromIndicator(sources, targets ?? range),
      nextAction:
        "Conserver cette borne; ne deduire aucun protocole d'emploi a partir de la classe cible.",
      position2d: { x: 50, y: 14 },
      position3d: { x: 0, y: 1.5, z: 0.3 },
    }),
    makeNode({
      id: `${system.slug}-line-of-sight`,
      label: "Ligne de visee continue",
      type: "component",
      layer: "supply-chain",
      risk: "high",
      confidence: lineOfSight?.confidence ?? "haute",
      claim:
        "Contrainte physique non-negociable: la cible doit etre vue et suivie pendant tout le temps d'illumination. Premiere borne d'emploi.",
      evidence: evidenceFromIndicator(lineOfSight),
      ...sourceFromIndicator(sources, lineOfSight),
      nextAction:
        "Comparer cette contrainte avec celle d'un canon CIWS ou d'un missile — le laser n'efface pas la physique, il la deplace.",
      position2d: { x: 36, y: 30 },
      position3d: { x: -0.55, y: 0.85, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-atmosphere`,
      label: "Atmosphere — pluie, brouillard, turbulence",
      type: "component",
      layer: "sources",
      risk: "high",
      confidence: atmosphere?.confidence ?? "haute",
      claim:
        "La meteo degrade la portee utile. Un laser anti-drone n'est pas un effecteur tout-temps — c'est une fenetre d'opportunite.",
      evidence: evidenceFromIndicator(atmosphere),
      ...sourceFromIndicator(sources, atmosphere),
      nextAction:
        "Documenter l'integration HELMA-P dans des dispositifs multicouches comme reponse a cette contrainte.",
      position2d: { x: 64, y: 30 },
      position3d: { x: 0.55, y: 0.85, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-dwell-time`,
      label: "Dwell time — illumination prolongee",
      type: "source",
      layer: "supply-chain",
      risk: "medium",
      confidence: dwellTime?.confidence ?? "moyenne",
      claim:
        "Le faisceau doit rester sur la cible plusieurs secondes. Cela limite la cadence et impose le traitement sequentiel des cibles.",
      evidence: evidenceFromIndicator(dwellTime),
      ...sourceFromIndicator(sources, dwellTime),
      nextAction:
        "Lire cette contrainte comme structurante face a une attaque en saturation — le laser ne peut traiter qu'une cible a la fois.",
      position2d: { x: 28, y: 64 },
      position3d: { x: -0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-marginal-cost`,
      label: "Cout marginal: quelques euros",
      type: "source",
      layer: "cout",
      risk: "low",
      confidence: marginalCost?.confidence ?? "moyenne",
      claim:
        "Quelques euros d'electricite par tir. Face a des drones a quelques milliers de dollars, c'est un renversement du ratio d'echange — mais a ne pas confondre avec le cout complet.",
      evidence: evidenceFromIndicator(marginalCost ?? economicLogic),
      ...sourceFromIndicator(sources, marginalCost ?? economicLogic),
      nextAction:
        "Toujours afficher cout marginal et cout systeme ensemble — l'un sans l'autre induit en erreur.",
      position2d: { x: 72, y: 64 },
      position3d: { x: 0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-system-cost`,
      label: "Cout systeme (non public)",
      type: "source",
      layer: "cout",
      risk: "high",
      confidence: systemCost?.confidence ?? "faible",
      claim:
        "Source laser, tourelle, optiques, capteurs, alimentation, refroidissement: l'investissement reel se loge ici — non publie publiquement.",
      evidence: evidenceFromIndicator(systemCost),
      ...sourceFromIndicator(sources, systemCost),
      nextAction:
        "Suivre les contrats DGA / CILAS comme proxy de l'enveloppe — le seul signal public disponible.",
      position2d: { x: 36, y: 42 },
      position3d: { x: -0.55, y: 0.3, z: 0.15 },
    }),
    makeNode({
      id: `${system.slug}-cilas`,
      label: "CILAS — souverainete laser FR",
      type: "supplier",
      layer: "supply-chain",
      risk: "low",
      confidence: cilas?.confidence ?? "haute",
      claim:
        "Specialiste francais du laser, maitrise la source et la conduite de faisceau. Dependance etrangere faible — l'enjeu est la cadence, pas la souverainete.",
      evidence: evidenceFromIndicator(cilas ?? criticalSubsystems),
      ...sourceFromIndicator(sources, cilas ?? criticalSubsystems),
      nextAction:
        "Suivre la montee en cadence CILAS — un prototype reussi ne garantit pas une production reguliere.",
      position2d: { x: 14, y: 78 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-dga-l2ad`,
      label: "DGA / marche L2AD",
      type: "source",
      layer: "finance",
      risk: "low",
      confidence: dgaMaster?.confidence ?? "haute",
      claim:
        "Financement entierement etatique: recherche depuis 2017, prototypage, notification 2022, commande supplementaire 2024. Trajectoire publique nette.",
      evidence: evidenceFromIndicator(dgaMaster ?? l2adContract ?? budgetStage),
      ...sourceFromIndicator(sources, dgaMaster ?? l2adContract ?? budgetStage),
      nextAction:
        "Lire la commande supplementaire comme le signal financier le plus net qu'un laser puisse recevoir.",
      position2d: { x: 86, y: 78 },
      position3d: { x: 1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-france-counter-uas`,
      label: `${system.country} — souverainete C-UAS`,
      type: "country",
      layer: "geopolitique",
      risk: "medium",
      confidence: strategicRole?.confidence ?? "haute",
      claim:
        "Capacite souveraine de lutte anti-drone. Reponse a une mutation: la proliferation de drones legers, accessibles et difficiles a traiter par moyens classiques.",
      evidence: evidenceFromIndicator(strategicRole ?? layerRole ?? mission),
      ...sourceFromIndicator(sources, strategicRole ?? layerRole ?? mission),
      nextAction:
        "Lire HELMA-P comme reponse a une mutation — pas comme remplacement des moyens existants.",
      position2d: { x: 84, y: 22 },
      position3d: { x: 1.4, y: 0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-protocol-iv`,
      label: "Cadre Protocole IV (CCW)",
      type: "source",
      layer: "geopolitique",
      risk: "low",
      confidence: "haute",
      claim:
        "Le Protocole IV interdit les armes laser specifiquement concues pour provoquer une cecite permanente. HELMA-P vise des drones — pas des personnels.",
      evidence:
        "Cadre juridique permanent rappele dans la fiche. Le CICR rappelle l'obligation de precaution pour eviter d'aveugler lors de l'emploi de tout systeme laser.",
      sourceLabel: "Dossier Panoplie — fiche HELMA-P",
      nextAction:
        "Conserver le rappel Protocole IV comme element de cadre, pas comme element d'emploi.",
      position2d: { x: 70, y: 38 },
      position3d: { x: 0.7, y: 0.45, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-cooling`,
      label: "Refroidissement — limite mobile",
      type: "component",
      layer: "supply-chain",
      risk: "medium",
      confidence: cooling?.confidence ?? "moyenne",
      claim:
        "Limite la cadence de tir et l'integration sur plateforme mobile. C'est la contrainte SWaP-C qui distingue les classes de laser.",
      evidence: evidenceFromIndicator(cooling),
      ...sourceFromIndicator(sources, cooling),
      nextAction:
        "Lire SWaP-C comme la contrainte d'integration laser dominante — partagee avec tous les programmes DEW.",
      position2d: { x: 64, y: 50 },
      position3d: { x: 0.55, y: 0, z: 0.15 },
    }),
    makeNode({
      id: `${system.slug}-export-status`,
      label: "Statut export — capacite nationale",
      type: "source",
      layer: "export",
      risk: "medium",
      confidence: exportStatus?.confidence ?? "moyenne",
      claim:
        "D'abord une capacite nationale. Un export vers des partenaires proches est credible — mais l'energie dirigee reste un domaine sensible.",
      evidence: evidenceFromIndicator(exportStatus ?? foreignDep),
      ...sourceFromIndicator(sources, exportStatus ?? foreignDep),
      nextAction:
        "Distinguer 'capacite nationale' et 'non exportable' — le statut HELMA-P releve du premier, pas du second.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-export-sensitivity`,
      label: "Composants laser sous controle possible",
      type: "source",
      layer: "export",
      risk: "medium",
      confidence: sensitivity?.confidence ?? "moyenne",
      claim:
        "Sources laser, optiques et logiciels de conduite de tir peuvent relever de controles a l'exportation. Tout transfert resterait soumis a l'autorisation de l'Etat.",
      evidence: evidenceFromIndicator(sensitivity),
      ...sourceFromIndicator(sources, sensitivity),
      nextAction:
        "Lire les composants laser comme objets de controle export europeens et nationaux — pas comme produits banals.",
      position2d: { x: 30, y: 14 },
      position3d: { x: -0.85, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "low",
      confidence: confidenceScore.confidence,
      claim:
        "Sources industrielles (CILAS) et institutionnelles (DGA, Min. Armees) convergentes. Certaines performances de portee restent des ordres de grandeur.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Performances precises (puissance crete, portee operationnelle exacte) restent constructeur ou approximees.",
      nextAction:
        "Prioriser dans la Console OSINT les indicateurs marques 'moyenne' confiance — surtout sur les performances.",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function aster30B1NtNodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");

  const architecture = indicatorByLabel(system.keySpecs, "Architecture");
  const guidance = indicatorByLabel(system.keySpecs, "Guidage");
  const interceptRange = indicatorByLabel(system.keySpecs, "Rayon");
  const interceptAltitude = indicatorByLabel(system.keySpecs, "Altitude");
  const hostSystems = indicatorByLabel(system.keySpecs, "Systemes hotes") ??
    indicatorByLabel(system.keySpecs, "hôtes");
  const launch = indicatorByLabel(system.keySpecs, "Lancement");

  const unitCost = indicatorByLabel(cost?.indicators ?? [], "unitaire");
  const usableCostType = indicatorByLabel(cost?.indicators ?? [], "exploitable") ??
    indicatorByLabel(cost?.indicators ?? [], "Type");
  const economicLogic = indicatorByLabel(cost?.indicators ?? [], "Logique");
  const occarFsaf = indicatorByLabel(finance?.indicators ?? [], "programme") ??
    indicatorByLabel(finance?.indicators ?? [], "Maitrise");
  const recentNotif = indicatorByLabel(finance?.indicators ?? [], "Notifications");
  const stocksReplenish = indicatorByLabel(finance?.indicators ?? [], "reconstitution") ??
    indicatorByLabel(finance?.indicators ?? [], "Effort");
  const eurosam = indicatorByLabel(supply?.indicators ?? [], "oeuvre");
  const criticalComponents = indicatorByLabel(supply?.indicators ?? [], "critiques");
  const cadence = indicatorByLabel(supply?.indicators ?? [], "Cadence");
  const strategicRole = indicatorByLabel(geopolitics?.indicators ?? [], "strategique") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "Fonction");
  const nonItar = indicatorByLabel(geopolitics?.indicators ?? [], "applicable") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "Regime");
  const exportChannel = indicatorByLabel(exportBrick?.indicators ?? [], "Canal");
  const exportClients = indicatorByLabel(exportBrick?.indicators ?? [], "Utilisateurs") ??
    indicatorByLabel(exportBrick?.indicators ?? [], "connus");

  const confidenceClaims = getAllClaims().filter(
    (claim) => claim.systemSlug === system.slug,
  );
  const confidenceScore = scoreEvidence(system, "confiance-donnees");

  return [
    makeNode({
      id: `${system.slug}-airframe`,
      label: "Booster + dart — PIF/PAF",
      type: "component",
      layer: "cout",
      risk: "medium",
      confidence: architecture?.confidence ?? "haute",
      claim:
        "Architecture deux etages + dart manoeuvrable par jets lateraux (PIF/PAF). C'est ce qui distingue Aster du PAC-3 (hit-to-kill pur): deux logiques d'interception, pas un equivalent.",
      evidence: evidenceFromIndicator(architecture),
      ...sourceFromIndicator(sources, architecture),
      nextAction:
        "Comparer Aster (RF actif + PIF/PAF) et PAC-3 (hit-to-kill pur) comme deux ecoles, pas comme equivalents.",
      position2d: { x: 50, y: 50 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-guidance`,
      label: "RF actif + autodirecteur Thales",
      type: "component",
      layer: "supply-chain",
      risk: "medium",
      confidence: guidance?.confidence ?? "haute",
      claim:
        "Inertiel + uplink + autodirecteur RF actif. L'autodirecteur Thales est l'un des points critiques de souverainete capteur de la famille Aster.",
      evidence: evidenceFromIndicator(guidance),
      ...sourceFromIndicator(sources, guidance),
      nextAction:
        "Suivre la trajectoire de l'autodirecteur Thales comme indicateur de continuite souveraine — capteur central de l'enveloppe d'interception.",
      position2d: { x: 50, y: 14 },
      position3d: { x: 0, y: 1.5, z: 0.3 },
    }),
    makeNode({
      id: `${system.slug}-range`,
      label: "Rayon 150 km — altitude 25 km",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: interceptRange?.confidence ?? "haute",
      claim:
        "Annonce DGA — l'enveloppe d'interception couvre la couche superieure LRAD jusqu'a l'ATBM courte portee modernise. Lecture capacitaire publique.",
      evidence: evidenceFromIndicator(interceptRange ?? interceptAltitude),
      ...sourceFromIndicator(sources, interceptRange ?? interceptAltitude),
      nextAction:
        "Conserver l'enveloppe au niveau capacitaire; PRF, modes d'engagement et ECCM precis restent classifies.",
      position2d: { x: 38, y: 38 },
      position3d: { x: -0.4, y: 0.4, z: 0.05 },
    }),
    makeNode({
      id: `${system.slug}-host-systems`,
      label: "SAMP/T NG + PAAMS (FREMM, Horizon, FDI)",
      type: "system",
      layer: "geopolitique",
      risk: "low",
      confidence: hostSystems?.confidence ?? "haute",
      claim:
        "L'effecteur ne vaut que par son systeme hote. Aster B1NT est l'arme centrale du SAMP/T NG et de PAAMS — terre et marine partagent le meme missile.",
      evidence: evidenceFromIndicator(hostSystems ?? launch),
      ...sourceFromIndicator(sources, hostSystems ?? launch),
      nextAction:
        "Lire les fiches SAMP/T NG, FREMM, Horizon en regard — l'Aster est un noeud du systeme, pas un produit isole.",
      position2d: { x: 36, y: 30 },
      position3d: { x: -0.55, y: 0.85, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-unit-cost`,
      label: "Cout unitaire non public",
      type: "source",
      layer: "cout",
      risk: "high",
      confidence: unitCost?.confidence ?? "faible",
      claim:
        "Couvert par enveloppes SAMP/T NG et marine — pas de coût scellé missile à missile. La transparence est plus faible que pour PAC-3 / DoD.",
      evidence: evidenceFromIndicator(unitCost),
      ...sourceFromIndicator(sources, unitCost),
      nextAction:
        "Suivre les contrats programme comme proxy d'enveloppe — pas de chiffre missile-a-missile dans le domaine public.",
      position2d: { x: 28, y: 64 },
      position3d: { x: -0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-cost-type`,
      label: "Cout par batterie / par contrat",
      type: "source",
      layer: "cout",
      risk: "medium",
      confidence: usableCostType?.confidence ?? "moyenne",
      claim:
        "Le coût exploitable est celui de l'enveloppe par batterie ou par contrat, pas par missile. Logique LRAD: l'effecteur est cher, justifie pour menaces a tres forte valeur.",
      evidence: evidenceFromIndicator(usableCostType ?? economicLogic),
      ...sourceFromIndicator(sources, usableCostType ?? economicLogic),
      nextAction:
        "Refuser la comparaison missile-a-missile avec PAC-3; construire la comparaison au niveau du systeme complet.",
      position2d: { x: 72, y: 64 },
      position3d: { x: 0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-eurosam`,
      label: "Eurosam — MBDA FR + IT + Thales",
      type: "supplier",
      layer: "supply-chain",
      risk: "low",
      confidence: eurosam?.confidence ?? "haute",
      claim:
        "Chaine cooperative franco-italienne et entierement europeenne. Booster (Avio/Roxel), autodirecteur Thales, calculateur — pas de noeud ITAR.",
      evidence: evidenceFromIndicator(eurosam ?? criticalComponents),
      ...sourceFromIndicator(sources, eurosam ?? criticalComponents),
      nextAction:
        "Documenter la repartition FR/IT/europeenne par sous-systeme pour mesurer le degre d'autonomie de la chaine.",
      position2d: { x: 14, y: 78 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-cadence`,
      label: "Cadence MBDA — x2 entre 2023-2025",
      type: "source",
      layer: "supply-chain",
      risk: "high",
      confidence: cadence?.confidence ?? "haute",
      claim:
        "Doublement entre 2023 et fin 2025, +40% vise en 2026. La cadence est sous tension face a la demande post-Ukraine et a l'European Sky Shield.",
      evidence: evidenceFromIndicator(cadence),
      ...sourceFromIndicator(sources, cadence),
      nextAction:
        "Suivre la cadence MBDA comme indicateur principal de soutenabilite — la demande excède la capacite courante.",
      position2d: { x: 86, y: 78 },
      position3d: { x: 1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-occar-fsaf`,
      label: "OCCAR / FSAF (FR-IT)",
      type: "source",
      layer: "finance",
      risk: "low",
      confidence: occarFsaf?.confidence ?? "haute",
      claim:
        "Programme Famille Sol-Air Futur, FR-IT. Qualification B1NT lancee en 2016, production engagee fin de decennie. Trajectoire publique nette.",
      evidence: evidenceFromIndicator(occarFsaf ?? recentNotif),
      ...sourceFromIndicator(sources, occarFsaf ?? recentNotif),
      nextAction:
        "Croiser OCCAR / DGA / MBDA pour reconstituer le jalon B1NT — chaque acteur publie une partie du calendrier.",
      position2d: { x: 70, y: 38 },
      position3d: { x: 0.7, y: 0.45, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-ukraine-effort`,
      label: "Effort de reconstitution post-Ukraine",
      type: "source",
      layer: "finance",
      risk: "medium",
      confidence: stocksReplenish?.confidence ?? "moyenne",
      claim:
        "Dons aux Forces armees ukrainiennes ont vide des stocks. Reconstitution integree a la planification + effort budgetaire 2024-2025 confirme.",
      evidence: evidenceFromIndicator(stocksReplenish),
      ...sourceFromIndicator(sources, stocksReplenish),
      nextAction:
        "Lire l'effort de reconstitution comme test de la cadence europeenne — pas seulement comme exigence ponctuelle.",
      position2d: { x: 64, y: 50 },
      position3d: { x: 0.55, y: 0, z: 0.15 },
    }),
    makeNode({
      id: `${system.slug}-european-autonomy`,
      label: "Pilier autonomie defense aerienne EU",
      type: "country",
      layer: "geopolitique",
      risk: "low",
      confidence: strategicRole?.confidence ?? "haute",
      claim:
        "Seul intercepteur LRAD non soumis a l'ITAR couvrant la couche superieure jusqu'a l'ATBM courte portee. Marqueur capacitaire de l'autonomie europeenne.",
      evidence: evidenceFromIndicator(strategicRole),
      ...sourceFromIndicator(sources, strategicRole),
      nextAction:
        "Lire Aster B1NT comme alternative explicite a PAC-3 pour les nations cherchant l'autonomie capacitaire LRAD.",
      position2d: { x: 84, y: 22 },
      position3d: { x: 1.4, y: 0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-non-itar`,
      label: "Hors ITAR — atout export",
      type: "source",
      layer: "export",
      risk: "low",
      confidence: nonItar?.confidence ?? "haute",
      claim:
        "Aucun noeud critique soumis a l'ITAR. C'est l'argument central pour les nations cherchant a echapper aux autorisations US — Position commune UE 2008/944/PESC.",
      evidence: evidenceFromIndicator(nonItar),
      ...sourceFromIndicator(sources, nonItar),
      nextAction:
        "Conserver l'argument 'hors ITAR' comme cadre de comparaison avec PAC-3 — pas comme garantie absolue de souverainete client.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-export-clients`,
      label: "Export — UK, IT, ME, Asie",
      type: "source",
      layer: "export",
      risk: "low",
      confidence: exportClients?.confidence ?? "haute",
      claim:
        "Royaume-Uni (PAAMS), Italie (Horizon, FREMM), Singapour, Maroc, Egypte, Qatar, EAU. Large base export marine + terre — position concurrentielle forte.",
      evidence: evidenceFromIndicator(exportClients ?? exportChannel),
      ...sourceFromIndicator(sources, exportClients ?? exportChannel),
      nextAction:
        "Croiser clients export et standard livre (Aster 30 vs B1 vs B1NT) — chaque combinaison cree une lecture distincte.",
      position2d: { x: 30, y: 14 },
      position3d: { x: -0.85, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "medium",
      confidence: confidenceScore.confidence,
      claim:
        "DGA, OCCAR et MBDA publient les jalons cles. Chiffres precis d'interception (PRF, ECCM, modes d'engagement) classifies — paliers indicatifs sur ces dimensions.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Couts unitaires et performances fines (interception ATBM) restent en partie classifies. La cadence MBDA est l'indicateur public le plus fiable.",
      nextAction:
        "Prioriser dans la Console OSINT les annonces MBDA / OCCAR sur la cadence — meilleur signal d'execution programme.",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function j20Nodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");

  const stealth = indicatorByLabel(system.keySpecs, "Furtivite") ??
    indicatorByLabel(system.keySpecs, "Furtivité");
  const role = indicatorByLabel(system.keySpecs, "Role") ??
    indicatorByLabel(system.keySpecs, "Rôle");
  const fleet = indicatorByLabel(system.keySpecs, "Flotte");
  const engine = indicatorByLabel(system.keySpecs, "Motorisation");
  const exportSpec = indicatorByLabel(system.keySpecs, "Export");
  const crew = indicatorByLabel(system.keySpecs, "Equipage") ??
    indicatorByLabel(system.keySpecs, "Équipage");

  const noPublicCost = indicatorByLabel(cost?.indicators ?? [], "publies") ??
    indicatorByLabel(cost?.indicators ?? [], "publiés");
  const scaleIndicator = indicatorByLabel(cost?.indicators ?? [], "Indice");
  const prudentReading = indicatorByLabel(cost?.indicators ?? [], "prudente");
  const masterOwner = indicatorByLabel(finance?.indicators ?? [], "ouvrage");
  const budgetDetail = indicatorByLabel(finance?.indicators ?? [], "budgetaire") ??
    indicatorByLabel(finance?.indicators ?? [], "Detail");
  const readableSignal = indicatorByLabel(finance?.indicators ?? [], "Signal");
  const primeContractor = indicatorByLabel(supply?.indicators ?? [], "oeuvre");
  const sovereigntyObjective = indicatorByLabel(supply?.indicators ?? [], "Objectif");
  const motorWeakness = indicatorByLabel(supply?.indicators ?? [], "Maillon");
  const strategicFunction = indicatorByLabel(geopolitics?.indicators ?? [], "strategique") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "Fonction");
  const employmentZones = indicatorByLabel(geopolitics?.indicators ?? [], "emploi");
  const trajectory = indicatorByLabel(geopolitics?.indicators ?? [], "Trajectoire");
  const exportStatus = indicatorByLabel(exportBrick?.indicators ?? [], "Statut");
  const exportAlternative = indicatorByLabel(exportBrick?.indicators ?? [], "Alternative");

  const confidenceClaims = getAllClaims().filter(
    (claim) => claim.systemSlug === system.slug,
  );
  const confidenceScore = scoreEvidence(system, "confiance-donnees");

  return [
    makeNode({
      id: `${system.slug}-fuselage`,
      label: "Cellule furtive lourde",
      type: "component",
      layer: "sources",
      risk: "medium",
      confidence: stealth?.confidence ?? "moyenne",
      claim:
        "Furtivite concue des l'origine, armement en soute interne. Capacite reelle et produite a grande echelle — mais performances precises (RCS, portee capteur) restent classifiees ou non verifiables.",
      evidence: evidenceFromIndicator(stealth ?? role),
      ...sourceFromIndicator(sources, stealth ?? role),
      nextAction:
        "Conserver la lecture au niveau capacitaire; ne pas extrapoler les chiffres RCS ou de portee que les sources ouvertes ne soutiennent pas.",
      position2d: { x: 50, y: 50 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-cockpit`,
      label: "Cockpit — variante J-20S biplace",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: crew?.confidence ?? "moyenne",
      claim:
        "Premier chasseur furtif biplace operationnel. La variante J-20S signale une priorite donnee a l'integration avec drones d'accompagnement (loyal wingman).",
      evidence: evidenceFromIndicator(crew),
      ...sourceFromIndicator(sources, crew),
      nextAction:
        "Lire J-20S comme indicateur d'une doctrine d'emploi avec drones d'accompagnement — pas comme certitude operationnelle.",
      position2d: { x: 50, y: 22 },
      position3d: { x: 0, y: 1.15, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-engine`,
      label: "Motorisation — point faible historique",
      type: "component",
      layer: "supply-chain",
      risk: "high",
      confidence: engine?.confidence ?? "faible",
      claim:
        "Premiers J-20 dependaient de reacteurs d'origine russe. Transition vers les moteurs chinois engagee — mais l'etat exact reste difficile a etablir depuis les sources ouvertes.",
      evidence: evidenceFromIndicator(engine ?? motorWeakness),
      ...sourceFromIndicator(sources, engine ?? motorWeakness),
      nextAction:
        "Documenter chaque jalon de transition motorisation comme element separe — la chronologie publique reste partielle.",
      position2d: { x: 50, y: 84 },
      position3d: { x: 0, y: -1.2, z: -0.15 },
    }),
    makeNode({
      id: `${system.slug}-fleet-scale`,
      label: "Flotte 300+ — production ~100/an",
      type: "source",
      layer: "cout",
      risk: "low",
      confidence: fleet?.confidence ?? "moyenne",
      claim:
        "L'echelle est l'information solide du dossier: production de masse, base industrielle dimensionnee. C'est ce que les sources autorisent — pas les couts unitaires.",
      evidence: evidenceFromIndicator(fleet ?? scaleIndicator),
      ...sourceFromIndicator(sources, fleet ?? scaleIndicator),
      nextAction:
        "Suivre les chiffres de flotte annuels (DoD, IISS) comme proxy budgetaire — le seul disponible publiquement.",
      position2d: { x: 28, y: 64 },
      position3d: { x: -0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-no-public-cost`,
      label: "Cout — opacite assumee",
      type: "source",
      layer: "cout",
      risk: "high",
      confidence: noPublicCost?.confidence ?? "faible",
      claim:
        "Aucun chiffre verifiable: prix unitaire, programme, possession. La Chine ne publie pas. Toute valeur publiee est une estimation non recoupable — refuser la tentation de l'inventer.",
      evidence: evidenceFromIndicator(noPublicCost ?? prudentReading),
      ...sourceFromIndicator(sources, noPublicCost ?? prudentReading),
      nextAction:
        "Refuser l'inference: documenter l'ampleur et l'industrialisation, pas un cout que les sources ne supportent pas.",
      position2d: { x: 72, y: 64 },
      position3d: { x: 0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-plaaf`,
      label: "Etat chinois — PLAAF",
      type: "supplier",
      layer: "finance",
      risk: "medium",
      confidence: masterOwner?.confidence ?? "haute",
      claim:
        "Maitre d'ouvrage etat chinois. Detail budgetaire non communique — la part aviation n'apparait pas dans les budgets de defense publies.",
      evidence: evidenceFromIndicator(masterOwner ?? budgetDetail),
      ...sourceFromIndicator(sources, masterOwner ?? budgetDetail),
      nextAction:
        "Croiser avec les rapports DoD/IISS annuels comme seule fenetre publique sur l'effort de defense aerienne chinois.",
      position2d: { x: 14, y: 78 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-financial-signal`,
      label: "Signal financier — cadence + J-20S",
      type: "source",
      layer: "finance",
      risk: "low",
      confidence: readableSignal?.confidence ?? "moyenne",
      claim:
        "Produire en grande serie et lancer J-20S en parallele traduit une priorite budgetaire forte et durable accordee a la 5e generation. C'est le signal le plus lisible.",
      evidence: evidenceFromIndicator(readableSignal),
      ...sourceFromIndicator(sources, readableSignal),
      nextAction:
        "Lire la cadence comme signal budgetaire structurel — pas comme parametre operationnel.",
      position2d: { x: 86, y: 78 },
      position3d: { x: 1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-chengdu-avic`,
      label: "Chengdu / AVIC — souverainete",
      type: "supplier",
      layer: "supply-chain",
      risk: "medium",
      confidence: primeContractor?.confidence ?? "haute",
      claim:
        "Conception et production assurees par Chengdu et le groupe AVIC. L'objectif programme est l'affranchissement total de toute dependance etrangere.",
      evidence: evidenceFromIndicator(primeContractor ?? sovereigntyObjective),
      ...sourceFromIndicator(sources, primeContractor ?? sovereigntyObjective),
      nextAction:
        "Lire la chaine AVIC comme analogue au modele Lockheed Martin — concentration nationale, profondeur industrielle, opacite.",
      position2d: { x: 36, y: 30 },
      position3d: { x: -0.55, y: 0.85, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-indo-pacific`,
      label: "Indo-Pacifique — contestation 5e gen",
      type: "country",
      layer: "geopolitique",
      risk: "high",
      confidence: strategicFunction?.confidence ?? "haute",
      claim:
        "Conteste directement la superiorite aerienne occidentale en Indo-Pacifique. La 5e generation n'y est plus un monopole occidental — fait structurant.",
      evidence: evidenceFromIndicator(strategicFunction ?? employmentZones),
      ...sourceFromIndicator(sources, strategicFunction ?? employmentZones),
      nextAction:
        "Suivre la trajectoire de flotte (vers ~1000 appareils fin de decennie) comme indicateur de bascule capacitaire regional.",
      position2d: { x: 84, y: 22 },
      position3d: { x: 1.4, y: 0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-deployment`,
      label: "Detroit de Taiwan + mer de Chine orientale",
      type: "source",
      layer: "geopolitique",
      risk: "high",
      confidence: trajectory?.confidence ?? "moyenne",
      claim:
        "Zones d'emploi documentees. Lecture capacitaire publique — ne pas extrapoler vers des postures tactiques ou des plans d'engagement.",
      evidence: evidenceFromIndicator(trajectory ?? employmentZones),
      ...sourceFromIndicator(sources, trajectory ?? employmentZones),
      nextAction:
        "Conserver la lecture geographique au niveau ouvert (DoD, IISS); ne deduire aucune procedure ni intention.",
      position2d: { x: 70, y: 38 },
      position3d: { x: 0.7, y: 0.45, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-no-export`,
      label: "Aucun export — doctrine F-22",
      type: "source",
      layer: "export",
      risk: "low",
      confidence: exportStatus?.confidence ?? "haute",
      claim:
        "Reserve a l'armee de l'air chinoise, comme les US l'ont fait du F-22: un appareil de pointe que l'on garde pour soi. Exportabilite nulle par choix strategique.",
      evidence: evidenceFromIndicator(exportStatus ?? exportSpec),
      ...sourceFromIndicator(sources, exportStatus ?? exportSpec),
      nextAction:
        "Lire la doctrine 'non exportable' comme parallele explicite au F-22 — meme posture, meme effet.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-j35-alternative`,
      label: "J-35 — l'offre furtive export chinoise",
      type: "source",
      layer: "export",
      risk: "medium",
      confidence: exportAlternative?.confidence ?? "moyenne",
      claim:
        "Les clients etrangers cherchant un chasseur furtif chinois sont orientes vers d'autres plateformes — J-35 notamment. La distinction J-20/J-35 = doctrine F-22/F-35 cote chinois.",
      evidence: evidenceFromIndicator(exportAlternative),
      ...sourceFromIndicator(sources, exportAlternative),
      nextAction:
        "Croiser avec la fiche J-35 pour lire la complementarite du couple national / export chinois.",
      position2d: { x: 30, y: 14 },
      position3d: { x: -0.85, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale — abaissee",
      type: "confidence",
      layer: "sources",
      risk: "high",
      confidence: confidenceScore.confidence,
      claim:
        "Confiance volontairement abaissee. Le J-20 oblige a un exercice d'honnetete: reconnaitre l'ampleur d'un programme ferme sans ceder aux chiffres precis que les sources ne supportent pas.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Le dossier J-20 illustre les limites de l'OSINT face a un programme aussi ferme: ampleur documentable, performances et couts hors d'atteinte.",
      nextAction:
        "Prioriser dans la Console OSINT les indicateurs sur la motorisation et l'export J-35 — les rares fenetres ouvertes du dossier chinois.",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function seaFireNodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");

  const architecture = indicatorByLabel(system.keySpecs, "Architecture");
  const range = indicatorByLabel(system.keySpecs, "Portee") ??
    indicatorByLabel(system.keySpecs, "Portée");
  const simultaneity = indicatorByLabel(system.keySpecs, "simultanees") ??
    indicatorByLabel(system.keySpecs, "simultanées");
  const rfTech = indicatorByLabel(system.keySpecs, "Technologie RF");
  const platforms = indicatorByLabel(system.keySpecs, "Plateformes");

  const installCost = indicatorByLabel(cost?.indicators ?? [], "complete") ??
    indicatorByLabel(cost?.indicators ?? [], "complète");
  const economicReading = indicatorByLabel(cost?.indicators ?? [], "economique") ??
    indicatorByLabel(cost?.indicators ?? [], "Lecture");
  const lccArgument = indicatorByLabel(cost?.indicators ?? [], "LCC");
  const dgaFunding = indicatorByLabel(finance?.indicators ?? [], "Financeur") ??
    indicatorByLabel(finance?.indicators ?? [], "DGA");
  const greekContract = indicatorByLabel(finance?.indicators ?? [], "Grece") ??
    indicatorByLabel(finance?.indicators ?? [], "Grèce");
  const exportProspects = indicatorByLabel(finance?.indicators ?? [], "discussion");
  const thalesFootprint = indicatorByLabel(supply?.indicators ?? [], "industrielle");
  const ganTech = indicatorByLabel(supply?.indicators ?? [], "GaN");
  const sovereigntySensor = indicatorByLabel(geopolitics?.indicators ?? [], "capteur") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "Souverainete");
  const natoPosition = indicatorByLabel(geopolitics?.indicators ?? [], "OTAN") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "Position");
  const exportChannel = indicatorByLabel(exportBrick?.indicators ?? [], "Canal");
  const exportRegime = indicatorByLabel(exportBrick?.indicators ?? [], "applicable");

  const confidenceClaims = getAllClaims().filter(
    (claim) => claim.systemSlug === system.slug,
  );
  const confidenceScore = scoreEvidence(system, "confiance-donnees");

  return [
    makeNode({
      id: `${system.slug}-aesa-panel`,
      label: "4 panneaux fixes AESA bande S",
      type: "component",
      layer: "cout",
      risk: "low",
      confidence: architecture?.confidence ?? "haute",
      claim:
        "Couverture 360° native par 4 faces fixes. Suppression des servocommandes mecaniques — l'argument LCC structural du capteur.",
      evidence: evidenceFromIndicator(architecture),
      ...sourceFromIndicator(sources, architecture),
      nextAction:
        "Comparer Sea Fire (panneaux fixes Thales) et SPY-6 (panneaux fixes RTX) comme deux reponses paralleles a la meme question doctrinale.",
      position2d: { x: 50, y: 38 },
      position3d: { x: 0, y: 0.4, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-range`,
      label: "Portee ~500 km en surveillance air",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: range?.confidence ?? "moyenne",
      claim:
        "Annonce Thales — portee en surveillance air, plus en BMD partiel. Lecture capacitaire publique; PRF, formes d'onde et ECCM precis restent classifies.",
      evidence: evidenceFromIndicator(range),
      ...sourceFromIndicator(sources, range),
      nextAction:
        "Conserver les chiffres au niveau capacitaire annonce; ne pas extrapoler vers une comparaison fine avec SPY-6.",
      position2d: { x: 38, y: 26 },
      position3d: { x: -0.55, y: 1.05, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-multi-mission`,
      label: "Capacites simultanees IAMD",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: simultaneity?.confidence ?? "haute",
      claim:
        "Surveillance air, conduite de tir Aster, BMD partielle, surveillance de surface — declarees simultanees. C'est ce qui distingue un MFR moderne d'un radar dedie.",
      evidence: evidenceFromIndicator(simultaneity),
      ...sourceFromIndicator(sources, simultaneity),
      nextAction:
        "Lire la simultaneite comme caracteristique structurante; la BMD partielle est explicitement bornee dans le dossier.",
      position2d: { x: 62, y: 26 },
      position3d: { x: 0.55, y: 1.05, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-gan-thales`,
      label: "Modules T/R GaN — Thales europeen",
      type: "component",
      layer: "supply-chain",
      risk: "medium",
      confidence: ganTech?.confidence ?? "haute",
      claim:
        "Production Thales France/Pays-Bas. La maitrise GaN est l'enjeu de souverainete RF europeenne — Sea Fire est l'un des marqueurs concrets.",
      evidence: evidenceFromIndicator(ganTech ?? rfTech),
      ...sourceFromIndicator(sources, ganTech ?? rfTech),
      nextAction:
        "Croiser avec les autres programmes radar Thales (GM200, GM400, MS-MMR) pour situer la cadence semi-conducteurs RF europeens.",
      position2d: { x: 28, y: 50 },
      position3d: { x: -0.85, y: 0, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-platforms`,
      label: "FREMM FDA + FDI Amiral Ronarc'h",
      type: "system",
      layer: "supply-chain",
      risk: "low",
      confidence: platforms?.confidence ?? "haute",
      claim:
        "Le capteur n'a de sens qu'integre. FREMM FDA (Alsace, Lorraine) operationnelles, classe FDI (5 fregates programmees + Grece) en cours.",
      evidence: evidenceFromIndicator(platforms),
      ...sourceFromIndicator(sources, platforms),
      nextAction:
        "Lire les fiches FREMM, FDI en regard — Sea Fire est un noeud du systeme naval francais, pas un produit isole.",
      position2d: { x: 72, y: 50 },
      position3d: { x: 0.85, y: 0, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-install-cost`,
      label: "Cout installation ~100-150 M€",
      type: "source",
      layer: "cout",
      risk: "high",
      confidence: installCost?.confidence ?? "faible",
      claim:
        "Estimation — 10 a 15% du cout plateforme FDI. Le cout capteur isole n'est pas publie de facon homogene; il est integre dans le programme.",
      evidence: evidenceFromIndicator(installCost ?? economicReading),
      ...sourceFromIndicator(sources, installCost ?? economicReading),
      nextAction:
        "Suivre les contrats programme FDI comme proxy d'enveloppe capteur — la transparence est plus faible que pour SPY-6/DoD.",
      position2d: { x: 28, y: 64 },
      position3d: { x: -0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-lcc-argument`,
      label: "Argument LCC — modularite GaN",
      type: "source",
      layer: "cout",
      risk: "medium",
      confidence: lccArgument?.confidence ?? "moyenne",
      claim:
        "Suppression rotation mecanique, modularite GaN, upgrade logiciel. Premieres annees operationnelles FDA encourageantes — retour d'experience public limite a ce stade.",
      evidence: evidenceFromIndicator(lccArgument),
      ...sourceFromIndicator(sources, lccArgument),
      nextAction:
        "Suivre le retour d'experience FDA Lorraine / Alsace comme test grandeur reelle de l'argument LCC.",
      position2d: { x: 72, y: 64 },
      position3d: { x: 0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-thales-footprint`,
      label: "Thales — empreinte FR / NL",
      type: "supplier",
      layer: "finance",
      risk: "low",
      confidence: thalesFootprint?.confidence ?? "haute",
      claim:
        "Chaine entierement europeenne, largement francaise. Modules T/R, calculateurs, logiciel integres par Thales — base industrielle compacte vs RTX.",
      evidence: evidenceFromIndicator(thalesFootprint ?? dgaFunding),
      ...sourceFromIndicator(sources, thalesFootprint ?? dgaFunding),
      nextAction:
        "Comparer l'echelle Thales (compacte mais focalisee) avec RTX (echelle continentale) pour situer le risque cadence.",
      position2d: { x: 14, y: 78 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-greek-fdi`,
      label: "FDI Grece — 1er export confirme",
      type: "source",
      layer: "finance",
      risk: "low",
      confidence: greekContract?.confidence ?? "haute",
      claim:
        "3 FDI grecques (Kimon, Nearchos, Formion) — contrats 2021-2022. Premier export Sea Fire confirme; signal politique fort pour la cooperation industrielle FR-GR.",
      evidence: evidenceFromIndicator(greekContract ?? exportProspects),
      ...sourceFromIndicator(sources, greekContract ?? exportProspects),
      nextAction:
        "Suivre la mise en service FDI grecques comme test reel du couple Sea Fire + FDI a l'export.",
      position2d: { x: 86, y: 78 },
      position3d: { x: 1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-non-aegis`,
      label: "Alternative non-Aegis hors ITAR",
      type: "country",
      layer: "geopolitique",
      risk: "low",
      confidence: sovereigntySensor?.confidence ?? "haute",
      claim:
        "Hors ITAR — chaine europeenne. Alternative credible a Aegis pour les marines moyennes cherchant l'autonomie capacitaire sans integration politique americaine.",
      evidence: evidenceFromIndicator(sovereigntySensor),
      ...sourceFromIndicator(sources, sovereigntySensor),
      nextAction:
        "Lire Sea Fire / SPY-6 comme deux modeles concurrents de souverainete radar navale moderne.",
      position2d: { x: 84, y: 22 },
      position3d: { x: 1.4, y: 0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-natinamds`,
      label: "NATINAMDS — autonome politiquement",
      type: "source",
      layer: "geopolitique",
      risk: "low",
      confidence: natoPosition?.confidence ?? "haute",
      claim:
        "Compatible NATINAMDS — integre techniquement, autonome politiquement. C'est exactement la posture europeenne souveraine recherchee.",
      evidence: evidenceFromIndicator(natoPosition),
      ...sourceFromIndicator(sources, natoPosition),
      nextAction:
        "Lire la compatibilite NATINAMDS comme cadre technique, pas comme alignement politique automatique.",
      position2d: { x: 70, y: 38 },
      position3d: { x: 0.7, y: 0.45, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-export-channel`,
      label: "Export couple FDI — DCS via DGA",
      type: "source",
      layer: "export",
      risk: "medium",
      confidence: exportChannel?.confidence ?? "haute",
      claim:
        "DCS sous licence DGA, partenariats industriels selon contrat. Sea Fire suit l'export FDI — capteur cher, valeur dependante de l'integration fregate.",
      evidence: evidenceFromIndicator(exportChannel),
      ...sourceFromIndicator(sources, exportChannel),
      nextAction:
        "Croiser clients FDI et configurations capteur pour reconstituer le pipeline Sea Fire a l'export.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-wassenaar`,
      label: "Wassenaar — composants RF",
      type: "source",
      layer: "export",
      risk: "low",
      confidence: exportRegime?.confidence ?? "haute",
      claim:
        "Position commune UE 2008/944/PESC + controle DGA + Wassenaar pour composants RF avances. Sans ITAR — atout structurel a l'export.",
      evidence: evidenceFromIndicator(exportRegime),
      ...sourceFromIndicator(sources, exportRegime),
      nextAction:
        "Conserver Wassenaar comme cadre applicable aux modules T/R; pas un facteur bloquant en pratique pour les allies europeens.",
      position2d: { x: 30, y: 14 },
      position3d: { x: -0.85, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "low",
      confidence: confidenceScore.confidence,
      claim:
        "Sources Thales et Marine nationale abondantes sur le role et l'architecture. Parametres techniques fins (TRM, formes d'onde, ECCM) classifies.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Le perimetre BMD partielle et la performance ECCM exacte restent volontairement bornees publiquement.",
      nextAction:
        "Prioriser dans la Console OSINT le retour d'experience FDA (premier emploi operationnel) — meilleur signal de maturite.",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function dragonfireNodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");
  const constraints = system.physicalConstraints ?? [];

  const power = indicatorByLabel(system.keySpecs, "puissance");
  const accuracy = indicatorByLabel(system.keySpecs, "Precision") ??
    indicatorByLabel(system.keySpecs, "Précision");
  const targets = indicatorByLabel(system.keySpecs, "Cibles");
  const costPerShot = indicatorByLabel(system.keySpecs, "tir");

  const marginalCost = indicatorByLabel(cost?.indicators ?? [], "marginal");
  const seriesContract = indicatorByLabel(cost?.indicators ?? [], "serie") ??
    indicatorByLabel(cost?.indicators ?? [], "série");
  const productionContract = indicatorByLabel(finance?.indicators ?? [], "production");
  const politicalSignal = indicatorByLabel(finance?.indicators ?? [], "Signal");
  const consortium = indicatorByLabel(supply?.indicators ?? [], "Consortium");
  const ukIndustrial = indicatorByLabel(supply?.indicators ?? [], "oeuvre");
  const compressedSchedule = indicatorByLabel(supply?.indicators ?? [], "Enjeu") ??
    indicatorByLabel(supply?.indicators ?? [], "calendrier");
  const strategicFunction = indicatorByLabel(geopolitics?.indicators ?? [], "strategique") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "Fonction");
  const europeanFirst = indicatorByLabel(geopolitics?.indicators ?? [], "Positionnement");
  const exportStatus = indicatorByLabel(exportBrick?.indicators ?? [], "Statut");
  const exportPotential = indicatorByLabel(exportBrick?.indicators ?? [], "Potentiel");

  const lineOfSight = indicatorByLabel(constraints, "Ligne");
  const marineAtmosphere = indicatorByLabel(constraints, "marine") ??
    indicatorByLabel(constraints, "Atmosphere");
  const cooling = indicatorByLabel(constraints, "Refroidissement");

  const confidenceClaims = getAllClaims().filter(
    (claim) => claim.systemSlug === system.slug,
  );
  const confidenceScore = scoreEvidence(system, "confiance-donnees");

  return [
    makeNode({
      id: `${system.slug}-laser-source`,
      label: "Laser fibres combinees ~50 kW",
      type: "component",
      layer: "cout",
      risk: "medium",
      confidence: power?.confidence ?? "moyenne",
      claim:
        "Classe 50 kW a fibres combinees — pas un bouclier aerien, un effecteur de couche basse contre drones et embarcations. Lecture capacitaire publique.",
      evidence: evidenceFromIndicator(power),
      ...sourceFromIndicator(sources, power),
      nextAction:
        "Comparer la classe 50 kW DragonFire avec HELMA-P (~2 kW) — meme philosophie, niveau d'energie tres different selon menace.",
      position2d: { x: 50, y: 50 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-accuracy`,
      label: "Precision — cible piece a 1 km",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: accuracy?.confidence ?? "moyenne",
      claim:
        "Affirmation MoD britannique — atteindre une cible de la taille d'une piece a 1 km. Lecture capacitaire publique, sans extrapolation tactique.",
      evidence: evidenceFromIndicator(accuracy),
      ...sourceFromIndicator(sources, accuracy),
      nextAction:
        "Conserver l'affirmation au niveau MoD; ne pas extrapoler vers un protocole d'emploi naval reel.",
      position2d: { x: 50, y: 14 },
      position3d: { x: 0, y: 1.5, z: 0.3 },
    }),
    makeNode({
      id: `${system.slug}-targets`,
      label: "Cibles — drones, munitions rodeuses, embarcations",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: targets?.confidence ?? "moyenne",
      claim:
        "Perimetre cibles volontairement borne. La lecon mer Rouge (Aster vs Shahed) fait du laser naval une reponse economique structurelle.",
      evidence: evidenceFromIndicator(targets),
      ...sourceFromIndicator(sources, targets),
      nextAction:
        "Lire DragonFire comme reponse a une question economique: dispenser des Aster sur des drones a quelques milliers de livres.",
      position2d: { x: 38, y: 38 },
      position3d: { x: -0.4, y: 0.4, z: 0.05 },
    }),
    makeNode({
      id: `${system.slug}-line-of-sight`,
      label: "Ligne de visee + roulis navire",
      type: "component",
      layer: "supply-chain",
      risk: "high",
      confidence: lineOfSight?.confidence ?? "haute",
      claim:
        "La cible doit etre vue et suivie en continu depuis le navire — la conduite de faisceau doit compenser le roulis. Contrainte d'integration majeure.",
      evidence: evidenceFromIndicator(lineOfSight),
      ...sourceFromIndicator(sources, lineOfSight),
      nextAction:
        "Lire la stabilisation de faisceau sur navire comme defi d'integration distinct du laser terrestre type HELMA-P.",
      position2d: { x: 36, y: 30 },
      position3d: { x: -0.55, y: 0.85, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-marine-atmosphere`,
      label: "Atmosphere marine — embruns, sel, brouillard",
      type: "component",
      layer: "sources",
      risk: "high",
      confidence: marineAtmosphere?.confidence ?? "haute",
      claim:
        "Embruns, sel, humidite et brouillard degradent le faisceau. Effecteur de fenetre d'opportunite — pas tout-temps. Lecture honnete des limites.",
      evidence: evidenceFromIndicator(marineAtmosphere),
      ...sourceFromIndicator(sources, marineAtmosphere),
      nextAction:
        "Documenter le dispositif multicouche Type 45 — DragonFire complete CAMM/Aster, ne les remplace pas.",
      position2d: { x: 64, y: 30 },
      position3d: { x: 0.55, y: 0.85, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-marginal-cost`,
      label: "Cout marginal — ~£10 / tir",
      type: "source",
      layer: "cout",
      risk: "low",
      confidence: marginalCost?.confidence ?? "moyenne",
      claim:
        "10 £ d'electricite par tir vs centaines de milliers pour un Aster. Le contraste est reel — mais c'est le cout marginal, pas le programme.",
      evidence: evidenceFromIndicator(marginalCost),
      ...sourceFromIndicator(sources, marginalCost ?? costPerShot),
      nextAction:
        "Toujours afficher cout marginal et cout systeme ensemble — sinon le chiffre induit en erreur.",
      position2d: { x: 28, y: 64 },
      position3d: { x: -0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-series-contract`,
      label: "Contrat serie £316M — MBDA UK",
      type: "source",
      layer: "cout",
      risk: "low",
      confidence: seriesContract?.confidence ?? "haute",
      claim:
        "Novembre 2025 — £316M pour les 2 premiers systemes de serie. Le repere solide du programme — bien plus parlant que le coût par tir.",
      evidence: evidenceFromIndicator(seriesContract),
      ...sourceFromIndicator(sources, seriesContract ?? productionContract),
      nextAction:
        "Lire le contrat £316M comme l'engagement budgetaire reel; le tir a £10 est un argument media.",
      position2d: { x: 72, y: 64 },
      position3d: { x: 0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-uk-consortium`,
      label: "Consortium UK — MBDA / Leonardo / QinetiQ / Dstl",
      type: "supplier",
      layer: "supply-chain",
      risk: "low",
      confidence: consortium?.confidence ?? "haute",
      claim:
        "MBDA UK maitre d'oeuvre, Leonardo UK pour la conduite de faisceau, QinetiQ pour la source laser, Dstl pour la recherche. Chaine largement nationale.",
      evidence: evidenceFromIndicator(consortium ?? ukIndustrial),
      ...sourceFromIndicator(sources, consortium ?? ukIndustrial),
      nextAction:
        "Comparer la chaine UK (4 acteurs majeurs) avec HELMA-P (CILAS quasi-unique) — deux modeles de souverainete laser nationale.",
      position2d: { x: 14, y: 78 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-compressed-schedule`,
      label: "Calendrier accelere — -5 ans",
      type: "source",
      layer: "finance",
      risk: "high",
      confidence: compressedSchedule?.confidence ?? "haute",
      claim:
        "Le RU annonce un calendrier accelere de cinq ans. C'est le pari du programme — calendrier serie et integration Type 45 fortement comprimes.",
      evidence: evidenceFromIndicator(compressedSchedule ?? politicalSignal),
      ...sourceFromIndicator(sources, compressedSchedule ?? politicalSignal),
      nextAction:
        "Suivre la tenue du calendrier 2027 comme indicateur cle — un retard serait plus significatif qu'un retard ordinaire.",
      position2d: { x: 86, y: 78 },
      position3d: { x: 1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-type-45`,
      label: "Type 45 — premiere flotte laser europeenne",
      type: "country",
      layer: "geopolitique",
      risk: "medium",
      confidence: europeanFirst?.confidence ?? "moyenne",
      claim:
        "Premier laser de marine europeen annonce en service de premiere ligne. Le RU vise une position — etre premier sur cette capacite navale.",
      evidence: evidenceFromIndicator(europeanFirst ?? strategicFunction),
      ...sourceFromIndicator(sources, europeanFirst ?? strategicFunction),
      nextAction:
        "Lire la position 'premier laser naval europeen' comme signal politique autant que capacitaire.",
      position2d: { x: 84, y: 22 },
      position3d: { x: 1.4, y: 0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-red-sea-lesson`,
      label: "Lecon mer Rouge — Aster vs Shahed",
      type: "source",
      layer: "geopolitique",
      risk: "low",
      confidence: "haute",
      claim:
        "Lecon recente: navires allies ont depense des missiles couteux contre des drones bon marche. Le laser promet de reequilibrer cette arithmetique.",
      evidence:
        "Dossier Panoplie — fiche DragonFire et fiche Shahed-136. Le ratio d'echange Aster vs drone houthi est l'illustration la plus claire.",
      sourceLabel: "Dossier Panoplie — DragonFire et Shahed-136",
      nextAction:
        "Lire ce moteur strategique comme structurel — pas conjoncturel. Tous les programmes laser navals europeens partagent la meme genese.",
      position2d: { x: 70, y: 38 },
      position3d: { x: 0.7, y: 0.45, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-cooling`,
      label: "Refroidissement — limite cadence",
      type: "component",
      layer: "supply-chain",
      risk: "medium",
      confidence: cooling?.confidence ?? "moyenne",
      claim:
        "Conditionne la cadence et l'integration dans le navire. SWaP-C est la contrainte d'integration laser dominante — partagee avec tous les programmes DEW.",
      evidence: evidenceFromIndicator(cooling),
      ...sourceFromIndicator(sources, cooling),
      nextAction:
        "Documenter l'integration sur Type 45 (deja en service, energie embarquee finie) comme cas d'ecole SWaP-C.",
      position2d: { x: 64, y: 50 },
      position3d: { x: 0.55, y: 0, z: 0.15 },
    }),
    makeNode({
      id: `${system.slug}-export-status`,
      label: "Effort national — Royal Navy d'abord",
      type: "source",
      layer: "export",
      risk: "medium",
      confidence: exportStatus?.confidence ?? "moyenne",
      claim:
        "Effort national tourne vers la Royal Navy. Potentiel export reel via MBDA — mais subordonne a une mise en service britannique prouvee.",
      evidence: evidenceFromIndicator(exportStatus ?? exportPotential),
      ...sourceFromIndicator(sources, exportStatus ?? exportPotential),
      nextAction:
        "Lire la trajectoire export comme conditionnee par 2027 — pas avant.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-protocol-iv`,
      label: "Protocole IV (CCW)",
      type: "source",
      layer: "export",
      risk: "low",
      confidence: "haute",
      claim:
        "Le Protocole IV interdit les armes laser specifiquement concues pour provoquer une cecite permanente. DragonFire vise drones et embarcations — pas des personnels.",
      evidence:
        "Cadre juridique permanent rappele dans la fiche. CICR rappelle obligation de precaution pour eviter d'aveugler lors de l'emploi.",
      sourceLabel: "Dossier Panoplie — fiche DragonFire",
      nextAction:
        "Conserver le rappel Protocole IV comme cadre — applicable a tous les programmes laser anti-drone (HELMA-P, DragonFire, etc.).",
      position2d: { x: 30, y: 14 },
      position3d: { x: -0.85, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "medium",
      confidence: confidenceScore.confidence,
      claim:
        "Sources gouvernementales (GOV.UK) et industrielles (MBDA, Leonardo) convergentes. Performances de portee et puissance restent des ordres de grandeur.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "L'echeance 2027 est annoncee, pas acquise. Le retour d'experience operationnel post-2027 sera le veritable test.",
      nextAction:
        "Prioriser dans la Console OSINT les annonces calendaires Royal Navy — chaque trimestre est un indicateur de tenue du calendrier accelere.",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function meteorNodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");

  const propulsion = indicatorByLabel(system.keySpecs, "propulsion");
  const guidance = indicatorByLabel(system.keySpecs, "Guidage");
  const range = indicatorByLabel(system.keySpecs, "portee") ??
    indicatorByLabel(system.keySpecs, "portée");
  const warhead = indicatorByLabel(system.keySpecs, "Charge militaire");
  const platforms = indicatorByLabel(system.keySpecs, "Plateformes");
  const nez = indicatorByLabel(system.keySpecs, "No-escape");

  const unitCost = indicatorByLabel(cost?.indicators ?? [], "unitaire");
  const economicReading = indicatorByLabel(cost?.indicators ?? [], "economique") ??
    indicatorByLabel(cost?.indicators ?? [], "économique");
  const sixNations = indicatorByLabel(finance?.indicators ?? [], "financement");
  const mbdaPrime = indicatorByLabel(finance?.indicators ?? [], "oeuvre");
  const strategicLock = indicatorByLabel(finance?.indicators ?? [], "strategique") ??
    indicatorByLabel(finance?.indicators ?? [], "stratégique");
  const ramjet = indicatorByLabel(supply?.indicators ?? [], "ramjet") ??
    indicatorByLabel(supply?.indicators ?? [], "Propulsion");
  const seeker = indicatorByLabel(supply?.indicators ?? [], "Autodirecteur");
  const cadence = indicatorByLabel(supply?.indicators ?? [], "principal");
  const nonItar = indicatorByLabel(geopolitics?.indicators ?? [], "applicable");
  const f35Effect = indicatorByLabel(geopolitics?.indicators ?? [], "politique");
  const ecosystemPillar = indicatorByLabel(geopolitics?.indicators ?? [], "Position");
  const exportModality = indicatorByLabel(exportBrick?.indicators ?? [], "Modalite") ??
    indicatorByLabel(exportBrick?.indicators ?? [], "Modalité");
  const exportClients = indicatorByLabel(exportBrick?.indicators ?? [], "Utilisateurs");

  const confidenceClaims = getAllClaims().filter(
    (claim) => claim.systemSlug === system.slug,
  );
  const confidenceScore = scoreEvidence(system, "confiance-donnees");

  return [
    makeNode({
      id: `${system.slug}-ramjet`,
      label: "Statoreacteur Bayern-Chemie",
      type: "component",
      layer: "cout",
      risk: "low",
      confidence: propulsion?.confidence ?? "haute",
      claim:
        "Variable flow ducted rocket — maintient la poussee en croisiere la ou les MRAAM classiques deviennent balistiques. C'est l'origine de la 'no-escape zone'.",
      evidence: evidenceFromIndicator(propulsion),
      ...sourceFromIndicator(sources, propulsion),
      nextAction:
        "Lire le ramjet comme noeud techno-critique souverain europeen — l'un des rares ou l'Europe maitrise un domaine de bout en bout.",
      position2d: { x: 50, y: 50 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-seeker`,
      label: "Autodirecteur RF actif + datalink bidirectionnel",
      type: "component",
      layer: "supply-chain",
      risk: "medium",
      confidence: guidance?.confidence ?? "haute",
      claim:
        "Inertiel + datalink + autodirecteur RF actif terminal. Le datalink bidirectionnel rend l'evitement difficile — c'est l'autre cle de la NEZ.",
      evidence: evidenceFromIndicator(guidance ?? seeker),
      ...sourceFromIndicator(sources, guidance ?? seeker),
      nextAction:
        "Comparer Meteor (RF actif + datalink + ramjet) et AIM-260 (US, en developpement) comme reponses paralleles a la NEZ.",
      position2d: { x: 50, y: 14 },
      position3d: { x: 0, y: 1.5, z: 0.3 },
    }),
    makeNode({
      id: `${system.slug}-range`,
      label: "Longue portee — valeur dependante du profil",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: range?.confidence ?? "moyenne",
      claim:
        "La portee exacte depend du profil de tir. La valeur publique est volontairement non chiffree — la mesure reelle de NEZ reste classifiee.",
      evidence: evidenceFromIndicator(range ?? nez),
      ...sourceFromIndicator(sources, range ?? nez),
      nextAction:
        "Conserver la NEZ au niveau capacitaire annonce; ne pas extrapoler vers une table de performance comparee.",
      position2d: { x: 38, y: 38 },
      position3d: { x: -0.4, y: 0.4, z: 0.05 },
    }),
    makeNode({
      id: `${system.slug}-warhead`,
      label: "Charge blast-fragmentation + fusee proximite",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: warhead?.confidence ?? "haute",
      claim:
        "Charge classique BVRAAM — blast-fragmentation avec fusee de proximite. Lecture capacitaire publique, sans extrapolation tactique.",
      evidence: evidenceFromIndicator(warhead),
      ...sourceFromIndicator(sources, warhead),
      nextAction:
        "Conserver la charge au niveau public; ne pas en deduire des protocoles d'emploi.",
      position2d: { x: 36, y: 30 },
      position3d: { x: -0.55, y: 0.85, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-platforms`,
      label: "Rafale + Typhoon + Gripen + F-35 (intégration)",
      type: "system",
      layer: "geopolitique",
      risk: "medium",
      confidence: platforms?.confidence ?? "haute",
      claim:
        "Integration F-35 = fait industriel + effet politique. Transforme un avion americain en plateforme partiellement europeenne — point de levier MBDA durable.",
      evidence: evidenceFromIndicator(platforms ?? f35Effect),
      ...sourceFromIndicator(sources, platforms ?? f35Effect),
      nextAction:
        "Suivre l'integration F-35 / Meteor comme l'evenement structurant a venir — fait politique autant que technique.",
      position2d: { x: 62, y: 26 },
      position3d: { x: 0.55, y: 1.05, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-unit-cost`,
      label: "Cout unitaire — non public",
      type: "source",
      layer: "cout",
      risk: "high",
      confidence: unitCost?.confidence ?? "faible",
      claim:
        "Livraison par lots contractuels — pas de prix flyaway publie. Effecteur premium, plus cher qu'un AMRAAM, justifie par la NEZ et l'ECCM.",
      evidence: evidenceFromIndicator(unitCost ?? economicReading),
      ...sourceFromIndicator(sources, unitCost ?? economicReading),
      nextAction:
        "Refuser la comparaison missile-a-missile avec AMRAAM; construire au niveau enveloppe contrat.",
      position2d: { x: 28, y: 64 },
      position3d: { x: -0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-six-nations`,
      label: "Cooperation a 6 nations — UK, FR, DE, IT, ES, SE",
      type: "source",
      layer: "finance",
      risk: "low",
      confidence: sixNations?.confidence ?? "haute",
      claim:
        "Modele cooperatif a 6 — distribue le risque programme et betonne le carnet de commandes par la base nationale de chaque participant.",
      evidence: evidenceFromIndicator(sixNations),
      ...sourceFromIndicator(sources, sixNations),
      nextAction:
        "Comparer la cooperation Meteor (6 nations, MBDA centralise) et Eurofighter (4 nations, consortium friction) — modeles distincts.",
      position2d: { x: 72, y: 64 },
      position3d: { x: 0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-mbda-prime`,
      label: "MBDA — consortium europeen",
      type: "supplier",
      layer: "finance",
      risk: "low",
      confidence: mbdaPrime?.confidence ?? "haute",
      claim:
        "Chaque montee en standard ou en integration plateforme passe par MBDA — consolide la rente industrielle europeenne dans le segment longue portee.",
      evidence: evidenceFromIndicator(mbdaPrime ?? strategicLock),
      ...sourceFromIndicator(sources, mbdaPrime ?? strategicLock),
      nextAction:
        "Lire MBDA comme guichet industriel europeen unique pour BVR — pilier du systeme.",
      position2d: { x: 14, y: 78 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-cadence-risk`,
      label: "Cadence ramjet — base etroite",
      type: "source",
      layer: "supply-chain",
      risk: "high",
      confidence: cadence?.confidence ?? "moyenne",
      claim:
        "Base europeenne ramjet plus etroite que les moteurs solide US. La montee en production en conflit de haute intensite est un sujet ouvert.",
      evidence: evidenceFromIndicator(cadence ?? ramjet),
      ...sourceFromIndicator(sources, cadence ?? ramjet),
      nextAction:
        "Suivre Bayern-Chemie + MBDA cadence comme indicateur strategique — la souverainete ramjet n'est solide que si la cadence l'est.",
      position2d: { x: 86, y: 78 },
      position3d: { x: 1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-non-itar`,
      label: "Hors ITAR — pilier autonomie air-air europeenne",
      type: "country",
      layer: "geopolitique",
      risk: "low",
      confidence: nonItar?.confidence ?? "haute",
      claim:
        "Aucun noeud critique ITAR. Pilier de l'autonomie air-air europeenne — meme integre sur F-35, l'effecteur reste europeen et controle par MBDA.",
      evidence: evidenceFromIndicator(nonItar ?? ecosystemPillar),
      ...sourceFromIndicator(sources, nonItar ?? ecosystemPillar),
      nextAction:
        "Lire Meteor / AMRAAM comme deux ecosystemes paralleles — pas comme produits substituables.",
      position2d: { x: 84, y: 22 },
      position3d: { x: 1.4, y: 0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-f35-european`,
      label: "F-35 europeen — Meteor change la lecture",
      type: "source",
      layer: "geopolitique",
      risk: "medium",
      confidence: f35Effect?.confidence ?? "moyenne",
      claim:
        "Permet aux operateurs F-35 europeens de conserver un AAM longue portee non US. Un avion americain devient partiellement europeen par son effecteur.",
      evidence: evidenceFromIndicator(f35Effect),
      ...sourceFromIndicator(sources, f35Effect),
      nextAction:
        "Suivre les pays europeens F-35 qui adoptent Meteor — indicateur de leur posture d'autonomie.",
      position2d: { x: 70, y: 38 },
      position3d: { x: 0.7, y: 0.45, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-bundle-export`,
      label: "Bundle plateforme + effecteur",
      type: "source",
      layer: "export",
      risk: "low",
      confidence: exportModality?.confidence ?? "haute",
      claim:
        "Exportable via les plateformes qui l'embarquent — Rafale, Typhoon, Gripen. La nation cliente accede a Meteor parce qu'elle achete l'avion qui le tire.",
      evidence: evidenceFromIndicator(exportModality),
      ...sourceFromIndicator(sources, exportModality),
      nextAction:
        "Lire le bundle plateforme + effecteur comme norme du segment longue portee europeen — pattern reutilise pour MICA NG.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-export-clients`,
      label: "Operateurs Rafale, Typhoon, Gripen, F-35 EU",
      type: "source",
      layer: "export",
      risk: "low",
      confidence: exportClients?.confidence ?? "haute",
      claim:
        "Toute nation operant Rafale, Eurofighter ou Gripen E/F sous accord — plus utilisateurs F-35 europeens via integration. Base export naturellement large.",
      evidence: evidenceFromIndicator(exportClients),
      ...sourceFromIndicator(sources, exportClients),
      nextAction:
        "Croiser les fiches Rafale, Typhoon, Gripen, F-35 pour reconstituer le perimetre Meteor accessible mondialement.",
      position2d: { x: 30, y: 14 },
      position3d: { x: -0.85, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "low",
      confidence: confidenceScore.confidence,
      claim:
        "Constructeur et programmes nationaux publient l'essentiel. Chiffres precis de portee et NEZ classifies — la NEZ se mesure en doctrine, pas en table comparative.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Aucun emploi en combat documente a ce jour. Le retour d'experience operationnel reste a constituer.",
      nextAction:
        "Prioriser dans la Console OSINT toute annonce d'integration F-35 nation par nation — indicateur strategique majeur.",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
    }),
  ];
}

function micaNgNodes(system: DefenseSystem): DecisionTwinNode[] {
  const sources = sourceById(system);
  const cost = brickByKey(system, "cout");
  const finance = brickByKey(system, "finance");
  const supply = brickByKey(system, "supply-chain");
  const geopolitics = brickByKey(system, "geopolitique");
  const exportBrick = brickByKey(system, "export");

  const dualSeeker = indicatorByLabel(system.keySpecs, "Autodirecteurs") ??
    indicatorByLabel(system.keySpecs, "interoperables");
  const midGuidance = indicatorByLabel(system.keySpecs, "mi-course");
  const operatingModes = indicatorByLabel(system.keySpecs, "operatoires") ??
    indicatorByLabel(system.keySpecs, "opératoires");
  const warhead = indicatorByLabel(system.keySpecs, "Charge militaire");
  const surfaceLaunch = indicatorByLabel(system.keySpecs, "surface-launch");

  const unitCost = indicatorByLabel(cost?.indicators ?? [], "unitaire");
  const economicReading = indicatorByLabel(cost?.indicators ?? [], "economique") ??
    indicatorByLabel(cost?.indicators ?? [], "économique");
  const ecosystemCost = indicatorByLabel(cost?.indicators ?? [], "ecosysteme") ??
    indicatorByLabel(cost?.indicators ?? [], "écosystème");
  const dgaProgram = indicatorByLabel(finance?.indicators ?? [], "programme");
  const deliverySchedule = indicatorByLabel(finance?.indicators ?? [], "livraison") ??
    indicatorByLabel(finance?.indicators ?? [], "Calendrier");
  const fundingModel = indicatorByLabel(finance?.indicators ?? [], "financement");
  const mbdaPrime = indicatorByLabel(supply?.indicators ?? [], "oeuvre");
  const seekers = indicatorByLabel(supply?.indicators ?? [], "Seekers");
  const cadenceRisk = indicatorByLabel(supply?.indicators ?? [], "principal");
  const strategicFunction = indicatorByLabel(geopolitics?.indicators ?? [], "strategique") ??
    indicatorByLabel(geopolitics?.indicators ?? [], "stratégique");
  const nonItarRegime = indicatorByLabel(geopolitics?.indicators ?? [], "applicable");
  const ecosystemEffect = indicatorByLabel(geopolitics?.indicators ?? [], "Effet");
  const exportChannel = indicatorByLabel(exportBrick?.indicators ?? [], "Canal");
  const naturalProspects = indicatorByLabel(exportBrick?.indicators ?? [], "Prospects");

  const confidenceClaims = getAllClaims().filter(
    (claim) => claim.systemSlug === system.slug,
  );
  const confidenceScore = scoreEvidence(system, "confiance-donnees");

  return [
    makeNode({
      id: `${system.slug}-dual-seeker`,
      label: "Double seeker — RF AESA + IR FPA",
      type: "component",
      layer: "cout",
      risk: "low",
      confidence: dualSeeker?.confidence ?? "haute",
      claim:
        "RF AESA ou IR imageur refroidi FPA — interchangeables sur la meme cellule, sans modification structure ni propulsion. Caracteristique unique de la famille MICA.",
      evidence: evidenceFromIndicator(dualSeeker),
      ...sourceFromIndicator(sources, dualSeeker),
      nextAction:
        "Lire le double seeker comme avantage structurel — flexibilite d'emploi sans renoncer a la mutualisation de soutien.",
      position2d: { x: 50, y: 50 },
      position3d: { x: 0, y: 0, z: 0 },
    }),
    makeNode({
      id: `${system.slug}-mid-guidance`,
      label: "Guidage mi-course + datalink bidirectionnel",
      type: "component",
      layer: "supply-chain",
      risk: "low",
      confidence: midGuidance?.confidence ?? "haute",
      claim:
        "Inertiel + datalink bidirectionnel. NG ameliore la resilience ECCM par rapport au MICA en service — comparable a Meteor cote BVR.",
      evidence: evidenceFromIndicator(midGuidance),
      ...sourceFromIndicator(sources, midGuidance),
      nextAction:
        "Comparer la combinaison datalink + autodirecteur NG avec le MICA legacy pour mesurer le saut capacitaire.",
      position2d: { x: 50, y: 14 },
      position3d: { x: 0, y: 1.5, z: 0.3 },
    }),
    makeNode({
      id: `${system.slug}-modes`,
      label: "LOBL + LOAL — multi-cible",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: operatingModes?.confidence ?? "haute",
      claim:
        "Lock-on Before Launch + Lock-on After Launch, verrou-tir multiple. Lecture capacitaire publique sans extrapolation tactique.",
      evidence: evidenceFromIndicator(operatingModes),
      ...sourceFromIndicator(sources, operatingModes),
      nextAction:
        "Conserver les modes au niveau capacitaire annonce; ne deduire aucun protocole d'emploi specifique.",
      position2d: { x: 38, y: 38 },
      position3d: { x: -0.4, y: 0.4, z: 0.05 },
    }),
    makeNode({
      id: `${system.slug}-warhead`,
      label: "Charge focalisee HE + fusee proximite",
      type: "component",
      layer: "sources",
      risk: "low",
      confidence: warhead?.confidence ?? "haute",
      claim:
        "Charge focalisee HE avec fusee de proximite RF/laser. Lecture capacitaire publique.",
      evidence: evidenceFromIndicator(warhead),
      ...sourceFromIndicator(sources, warhead),
      nextAction:
        "Conserver la charge au niveau public; ne pas en deduire des protocoles d'emploi.",
      position2d: { x: 36, y: 30 },
      position3d: { x: -0.55, y: 0.85, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-vl-mica`,
      label: "VL MICA — mutualisation sol-air",
      type: "system",
      layer: "geopolitique",
      risk: "low",
      confidence: surfaceLaunch?.confidence ?? "moyenne",
      claim:
        "Alimente VL MICA — defense aerienne mobile terre et marine. Le seul SAM mobile francais-MBDA dans cette classe de portee. Mutualisation air-air / sol-air structurante.",
      evidence: evidenceFromIndicator(surfaceLaunch),
      ...sourceFromIndicator(sources, surfaceLaunch),
      nextAction:
        "Lire la fiche VL MICA en regard — MICA NG est l'effecteur d'un ecosysteme, pas un missile isole.",
      position2d: { x: 62, y: 26 },
      position3d: { x: 0.55, y: 1.05, z: 0.2 },
    }),
    makeNode({
      id: `${system.slug}-unit-cost`,
      label: "Cout — reutilisation cellule MICA",
      type: "source",
      layer: "cout",
      risk: "medium",
      confidence: unitCost?.confidence ?? "moyenne",
      claim:
        "Reutilisation de cellule MICA — propulsion, charge, structure — reduit le cout de developpement. Argument central de l'arbitrage DGA pour la NG plutot qu'un missile totalement nouveau.",
      evidence: evidenceFromIndicator(unitCost ?? economicReading),
      ...sourceFromIndicator(sources, unitCost ?? economicReading),
      nextAction:
        "Lire la reutilisation cellule comme strategie de cout consciente — pas comme limite capacitaire.",
      position2d: { x: 28, y: 64 },
      position3d: { x: -0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-ecosystem-cost`,
      label: "Mutualisation VL MICA — economies",
      type: "source",
      layer: "cout",
      risk: "low",
      confidence: ecosystemCost?.confidence ?? "moyenne",
      claim:
        "Mutualisation soutien et formation avec VL MICA. C'est l'effet d'ecosysteme — un meme effecteur sert sur Rafale et en batterie SAM, soutien partage.",
      evidence: evidenceFromIndicator(ecosystemCost),
      ...sourceFromIndicator(sources, ecosystemCost),
      nextAction:
        "Croiser MICA NG (air-air) et VL MICA (sol-air) pour mesurer l'effet de mutualisation — modele unique en Europe.",
      position2d: { x: 72, y: 64 },
      position3d: { x: 0.85, y: -0.3, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-mbda-france`,
      label: "MBDA France — chaine souveraine",
      type: "supplier",
      layer: "finance",
      risk: "low",
      confidence: mbdaPrime?.confidence ?? "haute",
      claim:
        "MBDA France maitre d'oeuvre. Thales (RF AESA), Safran (IR FPA). Aucun noeud ITAR — l'une des fiches les plus claires en matiere d'autonomie capacitaire.",
      evidence: evidenceFromIndicator(mbdaPrime ?? seekers),
      ...sourceFromIndicator(sources, mbdaPrime ?? seekers),
      nextAction:
        "Lire MICA NG comme cas-ecole de l'arsenal souverain francais — cherchant a verrouiller la coherence Rafale + munitions MBDA.",
      position2d: { x: 14, y: 78 },
      position3d: { x: -1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-cadence-tension`,
      label: "Cadence MBDA — concomitance Aster + SCALP",
      type: "source",
      layer: "supply-chain",
      risk: "high",
      confidence: cadenceRisk?.confidence ?? "moyenne",
      claim:
        "Concomitance MICA NG + Aster B1NT + SCALP modernise cree une demande structurelle sur MBDA. Justifie les annonces de doublement de capacite.",
      evidence: evidenceFromIndicator(cadenceRisk),
      ...sourceFromIndicator(sources, cadenceRisk),
      nextAction:
        "Suivre la cadence MBDA cumulee (MICA NG + Aster + SCALP) comme test reel de l'echelle europeenne souveraine.",
      position2d: { x: 86, y: 78 },
      position3d: { x: 1.4, y: -0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-dga-program`,
      label: "DGA — programme national 2026",
      type: "source",
      layer: "finance",
      risk: "low",
      confidence: dgaProgram?.confidence ?? "haute",
      claim:
        "Programme national, financement national integral. Premieres livraisons a partir de 2026 — armee de l'air et de l'espace. Trajectoire publique nette.",
      evidence: evidenceFromIndicator(dgaProgram ?? deliverySchedule ?? fundingModel),
      ...sourceFromIndicator(sources, dgaProgram ?? deliverySchedule ?? fundingModel),
      nextAction:
        "Lire le calendrier 2026 comme test de cohérence — la premiere annee operationnelle determinera la confiance prospects export.",
      position2d: { x: 70, y: 38 },
      position3d: { x: 0.7, y: 0.45, z: 0.1 },
    }),
    makeNode({
      id: `${system.slug}-french-autonomy`,
      label: "France — coherence Rafale + MBDA",
      type: "country",
      layer: "geopolitique",
      risk: "low",
      confidence: strategicFunction?.confidence ?? "haute",
      claim:
        "Consolide la fonction air-air court/moyen sans dependance US. Coherence non-ITAR Rafale + Meteor + MICA NG + SCALP + Exocet — distingue Paris des autres exportateurs occidentaux.",
      evidence: evidenceFromIndicator(strategicFunction ?? ecosystemEffect),
      ...sourceFromIndicator(sources, strategicFunction ?? ecosystemEffect),
      nextAction:
        "Lire la coherence Rafale + munitions MBDA comme argument central de la diplomatie d'armement francaise.",
      position2d: { x: 84, y: 22 },
      position3d: { x: 1.4, y: 0.9, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-non-itar`,
      label: "Hors ITAR — souverainete capacitaire",
      type: "source",
      layer: "geopolitique",
      risk: "low",
      confidence: nonItarRegime?.confidence ?? "haute",
      claim:
        "Controle francais + Position commune UE — hors ITAR. Un client peut acheter sans devoir negocier avec une troisieme capitale. Argument structurel.",
      evidence: evidenceFromIndicator(nonItarRegime),
      ...sourceFromIndicator(sources, nonItarRegime),
      nextAction:
        "Conserver l'argument 'hors ITAR' comme cadre — partage avec Aster B1NT, Meteor, SCALP, Exocet : toute la grille MBDA.",
      position2d: { x: 16, y: 16 },
      position3d: { x: -1.4, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-bundle-export`,
      label: "Bundle Rafale + VL MICA",
      type: "source",
      layer: "export",
      risk: "low",
      confidence: exportChannel?.confidence ?? "haute",
      claim:
        "Suivra naturellement les contrats Rafale et VL MICA. Les utilisateurs MICA actuels sont des prospects naturels — renouvellement de stock ou bundle Rafale.",
      evidence: evidenceFromIndicator(exportChannel ?? naturalProspects),
      ...sourceFromIndicator(sources, exportChannel ?? naturalProspects),
      nextAction:
        "Croiser les operateurs MICA actuels (Grece, Egypte, Inde, Qatar, Emirats, Croatie, Indonesie) avec leur flotte Rafale pour identifier le pipeline export.",
      position2d: { x: 30, y: 14 },
      position3d: { x: -0.85, y: 1.4, z: -0.1 },
    }),
    makeNode({
      id: `${system.slug}-global-confidence`,
      label: "Confiance globale",
      type: "confidence",
      layer: "sources",
      risk: "medium",
      confidence: confidenceScore.confidence,
      claim:
        "DGA et MBDA publient les jalons cles. Details seekers (RF AESA, IR FPA) et NEZ classifies — paliers indicatifs sur ces dimensions.",
      evidence: `${confidenceScore.evidence} Registre: ${confidenceClaims.length} affirmations tracees pour ce systeme.`,
      metadata: confidenceScore.metadata,
      sourceLabel: "Console OSINT Panoplie",
      limitation:
        "Maturite encore a construire — la premiere annee d'emploi operationnel sera decisive pour la confiance des prospects export.",
      nextAction:
        "Prioriser dans la Console OSINT le retour d'experience operationnel 2026 — meilleur signal de maturite reelle.",
      position2d: { x: 16, y: 88 },
      position3d: { x: -1.4, y: -1.4, z: 0.1 },
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

// Exporté pour permettre la validation croisée avec `XRAY_EDITED_SLUGS`
// (voir `tests/data/xray-scenarios.test.ts`) — pas pour usage runtime côté
// client. `Partial` est requis pour que `SYSTEM_NODE_BUILDERS[slug]` retourne
// `T | undefined` (sinon TS considère la lookup toujours définie).
export const SYSTEM_NODE_BUILDERS: Partial<Record<string, (system: DefenseSystem) => DecisionTwinNode[]>> = {
  "bayraktar-tb2": bayraktarTb2Nodes,
  rafale: rafaleNodes,
  "f-35": f35Nodes,
  "f-15ex": f15exNodes,
  "mq-9-reaper": mq9ReaperNodes,
  "shahed-136": shahed136Nodes,
  "spy-6": spy6Nodes,
  "fremm-france": fremmFranceNodes,
  "eurofighter-typhoon": eurofighterTyphoonNodes,
  "charles-de-gaulle": charlesDeGaulleNodes,
  "helma-p": helmaPNodes,
  "aster-30-b1nt": aster30B1NtNodes,
  "j-20": j20Nodes,
  "sea-fire": seaFireNodes,
  dragonfire: dragonfireNodes,
  meteor: meteorNodes,
  "mica-ng": micaNgNodes,
};

export function buildPanoplieXrayScenario(
  system: DefenseSystem,
): PanoplieXrayScenario {
  const builder = SYSTEM_NODE_BUILDERS[system.slug];
  const coverage: PanoplieXrayScenario["coverage"] = builder ? "edited" : "auto";
  const nodes = (builder ?? genericNodes)(system);

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
    coverage,
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
