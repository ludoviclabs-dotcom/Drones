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
