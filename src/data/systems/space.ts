import type {
  AcquisitionMode,
  Brick,
  DefenseSystem,
  Indicator,
  Score,
  SourceRef,
  SpaceMission,
  SpaceOrbitClass,
  SpacePayloadProfile,
} from "../types";

const UPDATED = "2026-06-12";

interface SpaceSystemInput {
  slug: string;
  name: string;
  designation: string;
  reference: string;
  classLabel: string;
  country: string;
  flag: string;
  manufacturer: string;
  introduced: string;
  status: string;
  acquisitionModes: AcquisitionMode[];
  tagline: string;
  summary: string;
  missions: SpaceMission[];
  missionText: string;
  orbitClasses: SpaceOrbitClass[];
  orbitText: string;
  altitude?: string;
  inclination?: string;
  orbitNotes?: string;
  payloads: SpacePayloadProfile[];
  payloadText: string;
  constellationSize?: string;
  satellitesLaunched?: string;
  formationFlying?: boolean;
  groundSegment: string[];
  dataChain: string;
  launchDependency?: string[];
  serviceContinuityNotes?: string;
  resilienceNotes?: string;
  sovereigntyNotes?: string;
  cost: string;
  finance: string;
  supplyChain: string;
  geopolitics: string;
  export: string;
  costPerimeter: string;
  programFrame: string;
  industrialFrame: string;
  exportFrame: string;
  operators: string[];
  theatres: string[];
  timeline: DefenseSystem["timeline"];
  sources: SourceRef[];
  editorial: DefenseSystem["editorial"];
  legalNote?: string;
  scores?: Score[];
}

function indicator(
  label: string,
  value: string,
  sources: string[],
  confidence: Indicator["confidence"] = "moyenne",
  status?: Indicator["status"],
  note?: string,
): Indicator {
  return { label, value, confidence, status, note, sources };
}

function scoreSet(
  sourceConfidence: Score["grade"],
  maturity: Score["grade"],
  exportability: Score["grade"],
): Score[] {
  return [
    {
      key: "efficacite-cout",
      grade: "C",
      rationale:
        "Lecture limitée au coût public et au périmètre programme ; aucune comparaison d'efficacité militaire n'est produite.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "La résilience est lue comme redondance, continuité de service et dépendances publiques, pas comme vulnérabilité exploitable.",
    },
    {
      key: "exportabilite",
      grade: exportability,
      rationale:
        "Le score reflète le régime public, la nature dual-use ou alliée et les restrictions institutionnelles connues.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Les risques se concentrent sur maîtres d'oeuvre, segment sol, lancement, cycles de remplacement et dépendances souveraines.",
    },
    {
      key: "maturite",
      grade: maturity,
      rationale:
        "La maturité suit le statut programme public : service établi, constellation en renouvellement ou capacité en construction.",
    },
    {
      key: "confiance-donnees",
      grade: sourceConfidence,
      rationale:
        "Le palier dépend de sources officielles, institutionnelles ou industrielles ; les paramètres orbitaux fins restent exclus.",
    },
  ];
}

function makeSpaceSystem(input: SpaceSystemInput): DefenseSystem {
  const sourceIds = input.sources.map((source) => source.id);
  const primary = [input.sources[0]?.id ?? ""].filter(Boolean);
  const sources = primary.length > 0 ? primary : sourceIds;
  const scores = input.scores ?? scoreSet("B", "B", "C");

  const bricks: Brick[] = [
    {
      key: "cout",
      narrative: input.cost,
      indicators: [
        indicator("Périmètre coût", input.costPerimeter, sources),
        indicator(
          "Incertitude",
          "Coût à lire par programme, segment sol, lancement, MCO et renouvellement ; pas au satellite isolé.",
          sources,
          "moyenne",
        ),
      ],
    },
    {
      key: "finance",
      narrative: input.finance,
      indicators: [
        indicator("Portage programme", input.programFrame, sources, "haute"),
        indicator(
          "Logique budgétaire",
          "Capacité souveraine ou alliée financée sur cycles longs, avec arbitrages de renouvellement.",
          sourceIds,
        ),
      ],
    },
    {
      key: "supply-chain",
      narrative: input.supplyChain,
      indicators: [
        indicator("Chaîne industrielle", input.industrialFrame, sourceIds, "haute"),
        indicator("Segment sol", input.groundSegment.join(" · "), sourceIds),
      ],
    },
    {
      key: "geopolitique",
      narrative: input.geopolitics,
      indicators: [
        indicator("Fonction stratégique", input.missionText, sources, "haute"),
        indicator(
          "Souveraineté",
          input.sovereigntyNotes ?? "Dépendance et autonomie à vérifier par sources publiques.",
          sourceIds,
        ),
      ],
    },
    {
      key: "export",
      narrative: input.export,
      indicators: [
        indicator("Régime public", input.exportFrame, sourceIds),
        indicator(
          "Limite Panoplie",
          "Brief non juridique : aucune stratégie de contournement export ni conseil d'emploi.",
          sources,
          "haute",
        ),
      ],
    },
  ];

  return {
    slug: input.slug,
    name: input.name,
    designation: input.designation,
    reference: input.reference,
    category: "space",
    classLabel: input.classLabel,
    country: input.country,
    flag: input.flag,
    manufacturer: input.manufacturer,
    introduced: input.introduced,
    status: input.status,
    acquisitionModes: input.acquisitionModes,
    tagline: input.tagline,
    summary: input.summary,
    keySpecs: [
      indicator("Mission", input.missionText, sources, "haute"),
      indicator("Orbite", input.orbitText, sources, "moyenne", "a-recouper", input.orbitNotes),
      indicator("Charge utile", input.payloadText, sourceIds, "moyenne"),
      indicator("Segment sol", input.groundSegment.join(" · "), sourceIds, "moyenne"),
      indicator(
        "Garde-fou",
        "Pas de TLE, pas de suivi temps réel, pas d'aide au ciblage ni de paramètre contre-spatial exploitable.",
        sources,
        "haute",
      ),
    ],
    bricks,
    scores,
    editorial: input.editorial,
    legalNote:
      input.legalNote ??
      "Dossier OSINT stratégique non opérationnel : seules des informations publiques de mission, d'architecture, de coût, d'industrie, d'export et de preuve sont exposées.",
    operators: input.operators,
    theatres: input.theatres,
    timeline: input.timeline,
    sources: input.sources,
    updated: UPDATED,
    spaceProfile: {
      missions: input.missions,
      orbit: {
        classes: input.orbitClasses,
        altitude: input.altitude,
        inclination: input.inclination,
        notes: input.orbitNotes,
      },
      payloads: input.payloads,
      architecture: {
        constellationSize: input.constellationSize,
        satellitesLaunched: input.satellitesLaunched,
        formationFlying: input.formationFlying,
        groundSegment: input.groundSegment,
        dataChain: input.dataChain,
        launchDependency: input.launchDependency,
        serviceContinuityNotes: input.serviceContinuityNotes,
      },
      resilienceNotes: input.resilienceNotes,
      sovereigntyNotes: input.sovereigntyNotes,
    },
  };
}

export const csoMusis = makeSpaceSystem({
  slug: "cso-musis",
  name: "CSO / MUSIS",
  designation: "Composante Spatiale Optique · programme MUSIS",
  reference: "PNP-SP-001",
  classLabel: "Observation optique militaire",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Airbus Defence and Space · Thales Alenia Space · CNES / DGA",
  introduced: "2018-2025",
  status:
    "Constellation française d'imagerie militaire très haute résolution, avec CSO-3 lancé en 2025 selon le CNES.",
  acquisitionModes: ["production-nationale", "cooperatif"],
  tagline:
    "Le socle français d'observation optique militaire : souveraineté image, partage européen sélectif et chaîne sol protégée.",
  summary:
    "CSO est la composante spatiale optique du programme MUSIS. Pour Panoplie, ce n'est pas une fiche de ciblage, mais une lecture de souveraineté : maîtrise de l'imagerie publique, segment sol, partage allié, coût programme et dépendances industrielles. Les informations orbitales restent limitées aux classes publiques.",
  missions: ["observation"],
  missionText: "Observation / IMINT / GEOINT",
  orbitClasses: ["LEO", "SSO"],
  orbitText: "LEO héliosynchrone publique, sans paramètres orbitaux exploitables",
  altitude: "Classe publique CNES : environ 480 à 800 km selon mission",
  inclination: "SSO / polaire publique",
  orbitNotes: "Aucun TLE, éphéméride ou suivi temps réel n'est intégré.",
  payloads: [
    {
      type: "optical",
      name: "Imagerie optique très haute résolution",
      supplier: "Airbus Defence and Space / Thales Alenia Space",
      description:
        "Charge utile optique militaire décrite publiquement au niveau mission et industriel.",
      sensitivity: "haute",
    },
  ],
  payloadText: "Optique très haute résolution, niveau public uniquement",
  constellationSize: "3 satellites CSO",
  satellitesLaunched: "CSO-1, CSO-2, CSO-3",
  groundSegment: ["CNES", "DGA", "segment sol utilisateur MUSIS"],
  dataChain:
    "Collecte image -> segment sol souverain -> exploitation gouvernementale et partage allié encadré.",
  launchDependency: ["ArianeGroup / Arianespace selon lancements", "Capacité européenne de lancement"],
  serviceContinuityNotes:
    "La continuité dépend du renouvellement de constellation, du segment sol et des accords de partage.",
  resilienceNotes:
    "Résilience analysée par redondance de satellites, segment sol et coopération, sans exposer de paramètre orbital fin.",
  sovereigntyNotes:
    "Capacité nationale centrale pour l'autonomie française d'appréciation de situation.",
  cost:
    "Le coût de CSO se lit au niveau programme : satellites, lancement, segment sol, exploitation et renouvellement. Panoplie ne compare pas la valeur opérationnelle de l'image.",
  finance:
    "Programme porté par la France, avec logique MUSIS et accès partenaires selon accords. Le financement relève de cycles capacitaires longs.",
  supplyChain:
    "La chaîne associe CNES/DGA, Airbus Defence and Space et Thales Alenia Space, avec un poids fort du segment sol souverain.",
  geopolitics:
    "CSO matérialise la souveraineté française d'observation et la capacité à partager de l'information image avec partenaires sans dépendre entièrement de sources tierces.",
  export:
    "Le système n'est pas un produit export standard ; la question pertinente est l'accès partenaire, la coopération et les restrictions de diffusion des produits image.",
  costPerimeter: "Satellite + lancement + segment sol + exploitation + renouvellement",
  programFrame: "Programme national français dans le cadre MUSIS",
  industrialFrame: "Airbus Defence and Space, Thales Alenia Space, CNES, DGA",
  exportFrame: "Accès partenaire et partage encadré, pas export commercial simple",
  operators: ["France · Armées / DGA / CNES", "Partenaires européens selon accords"],
  theatres: ["Europe", "Afrique", "Indo-Pacifique", "Global · observation stratégique"],
  timeline: [
    { date: "2018", label: "Lancement de CSO-1.", kind: "jalon" },
    { date: "2020", label: "Lancement de CSO-2.", kind: "jalon" },
    { date: "2025", label: "CSO-3 complète la constellation selon le CNES.", kind: "jalon" },
  ],
  sources: [
    {
      id: "cnes-cso",
      title: "CSO / MUSIS",
      publisher: "CNES",
      type: "institution",
      reliability: "A",
      date: "2025",
      url: "https://cnes.fr/en/projects/cso",
    },
    {
      id: "airbus-cso",
      title: "CSO programme overview",
      publisher: "Airbus Defence and Space",
      type: "constructeur",
      reliability: "B",
      url: "https://www.airbus.com/en/products-services/space/earth-observation/cso",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : une simple caméra en orbite. La réalité : une architecture souveraine complète, où le segment sol et le partage de preuve comptent autant que le satellite.",
    bestUseCase:
      "Analyse stratégique non opérationnelle : souveraineté image, partenaires, coût programme et dépendances.",
    weakPoint:
      "Les performances fines et les accès produits ne sont pas publics ; Panoplie les remplace par une lecture de confiance des sources.",
    analystNote:
      "CSO est le bon point d'entrée français : il parle industrie, autonomie, preuve et coopération plutôt qu'emploi tactique.",
  },
});

export const ceres = makeSpaceSystem({
  slug: "ceres",
  name: "CERES",
  designation: "Capacité de Renseignement Électromagnétique Spatiale",
  reference: "PNP-SP-002",
  classLabel: "SIGINT / ROEM spatial",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Airbus Defence and Space · Thales · CNES / DGA",
  introduced: "2021",
  status:
    "Constellation française de trois satellites de renseignement électromagnétique lancée en 2021, décrite publiquement par le CNES.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le pendant électromagnétique de l'autonomie française : détecter et caractériser des émissions, sans exposer les paramètres sensibles.",
  summary:
    "CERES est présenté publiquement comme une capacité française de renseignement électromagnétique spatial. Panoplie le documente comme un cas de souveraineté ROEM : architecture de constellation, industriels, segment sol, preuve publique et limites de divulgation.",
  missions: ["sigint"],
  missionText: "SIGINT / ROEM stratégique",
  orbitClasses: ["LEO"],
  orbitText: "LEO publique, trois satellites en formation selon le CNES",
  orbitNotes: "Pas de trajectoire, TLE ou fenêtre de passage exploitable.",
  payloads: [
    {
      type: "RF-SIGINT",
      name: "Charge utile ROEM",
      supplier: "Thales / Airbus Defence and Space",
      description:
        "Détection et localisation de signaux électromagnétiques au niveau de description public.",
      sensitivity: "haute",
    },
  ],
  payloadText: "RF-SIGINT / ROEM, description limitée au niveau mission",
  constellationSize: "3 satellites",
  satellitesLaunched: "3 satellites lancés ensemble en 2021",
  formationFlying: true,
  groundSegment: ["CNES", "DGA", "segment sol de mission"],
  dataChain:
    "Collecte électromagnétique -> traitement sol -> exploitation renseignement, sans détail de signaux ou méthodes.",
  launchDependency: ["Vega / Arianespace (lancement 2021)"],
  serviceContinuityNotes:
    "Capacité dépendante de la disponibilité des trois satellites, du segment sol et de futurs remplacements.",
  resilienceNotes:
    "La résilience est abordée au niveau constellation et cycle programme, pas par modes opératoires.",
  sovereigntyNotes:
    "CERES réduit la dépendance française aux sources ROEM alliées pour l'appréciation stratégique.",
  cost:
    "Le coût public se lit comme constellation complète : trois satellites, lancement, sol, traitement et maintien en condition.",
  finance:
    "Programme souverain français piloté par la DGA avec rôle CNES et industriels nationaux.",
  supplyChain:
    "Airbus porte les satellites, Thales contribue à la charge utile et le CNES intervient sur la maîtrise spatiale publique.",
  geopolitics:
    "CERES renforce l'autonomie française dans un domaine très sensible où les informations restent par nature fragmentaires.",
  export:
    "Capacité souveraine non export standard ; les enjeux publics portent sur coopération, partage et confidentialité.",
  costPerimeter: "Constellation de 3 satellites + lancement + segment sol + traitement",
  programFrame: "Programme national DGA / CNES",
  industrialFrame: "Airbus Defence and Space, Thales, CNES",
  exportFrame: "Capacité souveraine, partage très encadré",
  operators: ["France · Armées / DGA"],
  theatres: ["Global · renseignement stratégique"],
  timeline: [
    { date: "2021", label: "Lancement des trois satellites CERES.", kind: "jalon" },
    { date: "2022", label: "Montée en service publicisée au niveau programme.", kind: "jalon" },
  ],
  sources: [
    {
      id: "cnes-ceres",
      title: "CERES",
      publisher: "CNES",
      type: "institution",
      reliability: "A",
      date: "2021",
      url: "https://cnes.fr/en/projects/ceres",
    },
    {
      id: "airbus-ceres",
      title: "Airbus-built CERES satellites successfully launched",
      publisher: "Airbus Defence and Space",
      type: "constructeur",
      reliability: "B",
      date: "2021",
      url: "https://www.airbus.com/en/newsroom/press-releases/2021-11-airbus-built-french-ceres-satellites-successfully-launched",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un catalogue de signaux. La réalité Panoplie : un programme de souveraineté ROEM dont on ne documente que les couches publiques.",
    bestUseCase:
      "Comprendre l'indépendance industrielle et informationnelle française sans entrer dans les méthodes de collecte.",
    weakPoint:
      "Peu de données publiques vérifiables sur performance, traitement et exploitation ; il faut accepter une forte zone d'incertitude.",
    analystNote:
      "CERES est précieux pour la méthode Panoplie : la fiche doit montrer ce qui est prouvé, et surtout ce qui ne doit pas être extrapolé.",
  },
});

export const syracuseIv = makeSpaceSystem({
  slug: "syracuse-iv",
  name: "Syracuse IV",
  designation: "Système de télécommunications militaires par satellite",
  reference: "PNP-SP-003",
  classLabel: "SATCOM militaire souverain",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Airbus Defence and Space · Thales Alenia Space · CNES / DGA",
  introduced: "2021-2023",
  status:
    "Deux satellites Syracuse IV lancés selon le CNES, avec communications militaires sécurisées en bandes X et Ka.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le coeur SATCOM souverain français : communications militaires protégées, segment sol, terminaux et continuité de service.",
  summary:
    "Syracuse IV est une architecture de communications militaires, plus qu'un satellite isolé. Panoplie le lit par les coûts de programme, la chaîne industrielle, la souveraineté, les dépendances de terminaux et la robustesse publiée, sans conseil d'emploi réseau.",
  missions: ["satcom"],
  missionText: "SATCOM militaire sécurisé",
  orbitClasses: ["GEO"],
  orbitText: "GEO publique",
  orbitNotes: "Position orbitale et disponibilité opérationnelle non détaillées.",
  payloads: [
    {
      type: "SATCOM-X",
      name: "Communications militaires bande X",
      supplier: "Airbus Defence and Space / Thales Alenia Space",
      description: "Capacité de télécommunications militaires sécurisées décrite publiquement.",
      sensitivity: "haute",
    },
    {
      type: "SATCOM-Ka",
      name: "Communications militaires bande Ka",
      supplier: "Airbus Defence and Space / Thales Alenia Space",
      description: "Capacité haut débit militaire, sans détail de plan de fréquences exploitable.",
      sensitivity: "haute",
    },
  ],
  payloadText: "SATCOM X / Ka sécurisé, anti-brouillage au niveau public",
  constellationSize: "2 satellites Syracuse IV publiés",
  satellitesLaunched: "Syracuse 4A et 4B",
  groundSegment: ["DGA", "CNES", "segment sol militaire", "terminaux utilisateurs"],
  dataChain:
    "Terminals utilisateurs -> satellite GEO -> segment sol et réseaux militaires, sans plan opérationnel.",
  launchDependency: ["Ariane 5 / Ariane 6 selon calendrier public"],
  serviceContinuityNotes:
    "Continuité liée aux satellites GEO, aux terminaux, aux capacités de remplacement et au segment sol.",
  resilienceNotes:
    "Robustesse analysée par anti-brouillage public, redondance et gouvernance, pas par procédures réseau.",
  sovereigntyNotes:
    "Pilier souverain de communications militaires françaises et de contribution alliée.",
  cost:
    "Le coût de Syracuse IV combine satellites GEO, lancement, segment sol, terminaux, sécurité et MCO.",
  finance:
    "Financement national français sur cycle long, avec forte composante de sécurité et de continuité de service.",
  supplyChain:
    "Airbus Defence and Space et Thales Alenia Space structurent la chaîne industrielle, appuyée par CNES/DGA.",
  geopolitics:
    "Syracuse IV est un marqueur d'autonomie stratégique : communiquer sans dépendre entièrement d'infrastructures commerciales ou étrangères.",
  export:
    "Capacité souveraine, non produit export générique ; la lecture export porte sur briques industrielles et coopération sécurisée.",
  costPerimeter: "Satellites GEO + lancement + segment sol + terminaux + MCO",
  programFrame: "Programme national français de télécommunications militaires",
  industrialFrame: "Airbus Defence and Space, Thales Alenia Space, CNES, DGA",
  exportFrame: "Souverain, coopérations éventuelles encadrées",
  operators: ["France · Ministère des Armées"],
  theatres: ["Global · communications gouvernementales et militaires"],
  timeline: [
    { date: "2021", label: "Lancement de Syracuse 4A.", kind: "jalon" },
    { date: "2023", label: "Lancement de Syracuse 4B.", kind: "jalon" },
  ],
  sources: [
    {
      id: "cnes-syracuse-4",
      title: "Syracuse IV",
      publisher: "CNES",
      type: "institution",
      reliability: "A",
      date: "2023",
      url: "https://cnes.fr/en/projects/syracuse-4",
    },
    {
      id: "airbus-syracuse-iv",
      title: "Syracuse IV telecommunications satellites",
      publisher: "Airbus Defence and Space",
      type: "constructeur",
      reliability: "B",
      url: "https://www.airbus.com/en/products-services/space/telecommunications-satellites/syracuse-iv",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un relais radio géant. La réalité : une architecture complète de satellites, sol, terminaux, sécurité et gouvernance.",
    bestUseCase:
      "Comparer souveraineté SATCOM, coût programme et dépendances industrielles européennes.",
    weakPoint:
      "Les paramètres de protection et d'exploitation réseau ne sont pas publics et ne doivent pas être inférés.",
    analystNote:
      "Syracuse IV montre pourquoi Panoplie doit raisonner en système : le satellite n'est qu'un nœud visible.",
  },
});

export const galileoPrs = makeSpaceSystem({
  slug: "galileo-prs",
  name: "Galileo PRS",
  designation: "Public Regulated Service · Galileo",
  reference: "PNP-SP-004",
  classLabel: "PNT gouvernemental européen",
  country: "Union européenne",
  flag: "🇪🇺",
  manufacturer: "EUSPA · ESA · Commission européenne · industriels Galileo",
  introduced: "Service Galileo en montée progressive",
  status:
    "Service de navigation réglementé pour utilisateurs gouvernementaux autorisés, décrit par EUSPA comme robuste et chiffré.",
  acquisitionModes: ["cooperatif"],
  tagline:
    "Le PNT souverain européen : positionnement, navigation et temps pour usages gouvernementaux sensibles, sous accès autorisé.",
  summary:
    "Galileo PRS est un service, pas seulement une constellation. Panoplie le documente comme brique de souveraineté PNT : gouvernance européenne, accès autorisé, dépendance au segment sol, coût de programme et limites de comparabilité avec GPS.",
  missions: ["pnt"],
  missionText: "PNT gouvernemental autorisé",
  orbitClasses: ["MEO"],
  orbitText: "MEO GNSS publique",
  orbitNotes: "Aucune aide au guidage, au contournement ou à l'emploi tactique.",
  payloads: [
    {
      type: "PNT",
      name: "Signal PRS",
      supplier: "Programme Galileo",
      description:
        "Service de positionnement, navigation et temps chiffré pour utilisateurs gouvernementaux autorisés.",
      sensitivity: "haute",
    },
  ],
  payloadText: "Signal PRS chiffré, accès gouvernemental autorisé",
  constellationSize: "Constellation Galileo",
  groundSegment: ["EUSPA", "ESA", "centres de contrôle Galileo", "autorités PRS nationales"],
  dataChain:
    "Signal GNSS -> terminaux autorisés -> gouvernance PRS nationale et européenne.",
  serviceContinuityNotes:
    "La continuité se lit par robustesse de service, gouvernance et renouvellement de constellation.",
  resilienceNotes:
    "Robustesse PRS décrite publiquement contre certaines interférences, sans détail technique exploitable.",
  sovereigntyNotes:
    "Réduit la dépendance européenne au GPS pour les usages gouvernementaux sensibles.",
  cost:
    "Le coût de Galileo PRS ne se lit pas au satellite isolé : il dépend de la constellation Galileo, du segment sol et des autorités d'accès.",
  finance:
    "Programme européen financé et gouverné par les institutions de l'UE, avec ESA/EUSPA et autorités nationales.",
  supplyChain:
    "Chaîne Galileo multi-industrielle européenne ; la fiche PRS se concentre sur le service et la gouvernance.",
  geopolitics:
    "Galileo PRS est une réponse directe à la dépendance PNT : souveraineté, résilience civile-militaire et autonomie stratégique européenne.",
  export:
    "Accès réservé aux utilisateurs autorisés ; la question n'est pas l'export produit, mais la gouvernance d'accès et les accords institutionnels.",
  costPerimeter: "Constellation Galileo + segment sol + gouvernance PRS + terminaux autorisés",
  programFrame: "Programme spatial de l'Union européenne",
  industrialFrame: "EUSPA, ESA, Commission européenne, industriels Galileo",
  exportFrame: "Accès gouvernemental autorisé, restrictions institutionnelles",
  operators: ["Union européenne", "États membres et utilisateurs PRS autorisés"],
  theatres: ["Europe", "Global · services GNSS"],
  timeline: [
    { date: "2016", label: "Déclaration de services initiaux Galileo.", kind: "jalon" },
    { date: "2020s", label: "Montée progressive des usages PRS nationaux.", kind: "jalon" },
  ],
  sources: [
    {
      id: "euspa-galileo-services",
      title: "Galileo services",
      publisher: "EUSPA",
      type: "institution",
      reliability: "A",
      url: "https://www.euspa.europa.eu/eu-space-programme/galileo/services",
    },
    {
      id: "ec-galileo",
      title: "Galileo",
      publisher: "European Commission",
      type: "institution",
      reliability: "A",
      url: "https://defence-industry-space.ec.europa.eu/eu-space/galileo_en",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : Galileo serait seulement un GPS européen civil. La réalité : PRS est une couche gouvernementale à gouvernance stricte.",
    bestUseCase:
      "Analyser la souveraineté PNT, les coûts de service et les dépendances institutionnelles européennes.",
    weakPoint:
      "L'accès, les terminaux et les mécanismes de protection ne peuvent pas être détaillés dans un outil public.",
    analystNote:
      "Galileo PRS est un bon exemple dual-use : stratégique, sensible, mais documentable de façon non opérationnelle.",
  },
  scores: scoreSet("A", "B", "D"),
});

export const gpsIii = makeSpaceSystem({
  slug: "gps-iii",
  name: "GPS III",
  designation: "Global Positioning System Block III",
  reference: "PNP-SP-005",
  classLabel: "PNT militaire et civil américain",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "U.S. Space Force · Lockheed Martin",
  introduced: "2018-2020s",
  status:
    "Génération GPS modernisée en déploiement, avec satellites Block III et contrôle par l'écosystème américain.",
  acquisitionModes: ["production-nationale", "FMS"],
  tagline:
    "La référence mondiale du PNT : un service stratégique américain dont la valeur tient autant au segment sol qu'aux satellites.",
  summary:
    "GPS III est la modernisation d'une infrastructure PNT mondiale. Panoplie l'analyse par la gouvernance américaine, la supply chain Lockheed Martin, les coûts de renouvellement, la dépendance alliée et la qualité des sources publiques, sans fournir de méthode d'emploi.",
  missions: ["pnt"],
  missionText: "PNT global, civil et militaire",
  orbitClasses: ["MEO"],
  orbitText: "MEO GNSS publique",
  orbitNotes: "Aucune donnée de constellation exploitable en temps réel n'est intégrée.",
  payloads: [
    {
      type: "PNT",
      name: "Navigation payload GPS III",
      supplier: "Lockheed Martin",
      description:
        "Charge utile de navigation GNSS modernisée décrite au niveau programme.",
      sensitivity: "moyenne",
    },
  ],
  payloadText: "PNT GNSS modernisé, signaux publics et militaires au niveau descriptif",
  constellationSize: "Constellation GPS modernisée",
  groundSegment: ["U.S. Space Force", "GPS control segment", "terminaux utilisateurs"],
  dataChain:
    "Signal GNSS -> terminaux -> synchronisation et navigation ; Panoplie reste au niveau gouvernance.",
  launchDependency: ["EELV / National Security Space Launch"],
  serviceContinuityNotes:
    "Continuité liée au renouvellement de blocs satellites, au segment sol et à la gestion américaine.",
  resilienceNotes:
    "Robustesse lue par modernisation et redondance de service, sans paramètres de brouillage ou spoofing.",
  sovereigntyNotes:
    "Dépendance structurante des alliés au PNT américain, même lorsque des alternatives régionales existent.",
  cost:
    "Le coût de GPS III se lit comme programme de renouvellement : satellites, lancement, contrôle sol, terminaux et maintien global.",
  finance:
    "Financé par les États-Unis, avec externalités mondiales pour les alliés et utilisateurs civils.",
  supplyChain:
    "Lockheed Martin est le maître d'oeuvre des satellites GPS III ; l'écosystème sol et lancement reste américain.",
  geopolitics:
    "GPS III prolonge un bien public stratégique contrôlé par les États-Unis, central pour alliances, finance, réseaux et défense.",
  export:
    "Le service est mondial ; les aspects militaires et équipements associés relèvent de règles américaines, FMS/ITAR selon cas.",
  costPerimeter: "Satellites Block III + lancement + contrôle sol + modernisation utilisateurs",
  programFrame: "Programme U.S. Space Force",
  industrialFrame: "Lockheed Martin, U.S. Space Force, National Security Space Launch",
  exportFrame: "Service global, équipements sensibles sous contrôle américain",
  operators: ["États-Unis · U.S. Space Force"],
  theatres: ["Global · PNT"],
  timeline: [
    { date: "2018", label: "Premier lancement GPS III.", kind: "jalon" },
    { date: "2020s", label: "Déploiement progressif des satellites Block III.", kind: "jalon" },
  ],
  sources: [
    {
      id: "gps-gov-space",
      title: "GPS space segment",
      publisher: "GPS.gov",
      type: "officiel",
      reliability: "A",
      url: "https://www.gps.gov/systems/gps/space/",
    },
    {
      id: "lockheed-gps",
      title: "GPS III",
      publisher: "Lockheed Martin",
      type: "constructeur",
      reliability: "B",
      url: "https://www.lockheedmartin.com/en-us/products/gps.html",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : GPS serait une commodité neutre. La réalité : c'est une infrastructure géopolitique américaine globale.",
    bestUseCase:
      "Lire la dépendance PNT, le coût de renouvellement et la place des alternatives européennes.",
    weakPoint:
      "Les paramètres militaires et mesures de protection ne sont pas publics et ne doivent pas être inférés.",
    analystNote:
      "Comparer GPS III à Galileo PRS doit rester institutionnel et industriel, pas opérationnel.",
  },
  scores: scoreSet("A", "A", "C"),
});

export const aehf = makeSpaceSystem({
  slug: "aehf",
  name: "AEHF",
  designation: "Advanced Extremely High Frequency System",
  reference: "PNP-SP-006",
  classLabel: "MILSATCOM protégé EHF",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "U.S. Space Force · Lockheed Martin · Northrop Grumman",
  introduced: "2010-2020",
  status:
    "Système SATCOM protégé américain en GEO, six satellites lancés selon la fiche U.S. Space Force.",
  acquisitionModes: ["production-nationale", "FMS"],
  tagline:
    "Le SATCOM protégé américain : communications EHF survivables, interopérabilité alliée et dépendance à l'écosystème US.",
  summary:
    "AEHF est documenté comme une architecture MILSATCOM protégée : segment spatial, segment sol, terminaux et gouvernance alliée. Panoplie ne décrit pas d'emploi réseau, mais la valeur stratégique, industrielle et export.",
  missions: ["satcom"],
  missionText: "SATCOM militaire protégé",
  orbitClasses: ["GEO"],
  orbitText: "GEO publique",
  orbitNotes: "Pas de position orbitale exploitable ni plan de couverture.",
  payloads: [
    {
      type: "SATCOM-EHF",
      name: "Protected EHF communications",
      supplier: "Lockheed Martin / Northrop Grumman",
      description:
        "Communications protégées décrites publiquement comme sécurisées, robustes et résistantes au brouillage.",
      sensitivity: "haute",
    },
  ],
  payloadText: "SATCOM EHF protégé, description publique",
  constellationSize: "6 satellites",
  satellitesLaunched: "Lancements AEHF-1 à AEHF-6",
  groundSegment: ["U.S. Space Force", "mission control segment", "terminaux utilisateurs"],
  dataChain:
    "Terminaux autorisés -> satellites GEO AEHF -> réseaux protégés alliés, sans procédure d'emploi.",
  launchDependency: ["National Security Space Launch"],
  serviceContinuityNotes:
    "La continuité dépend du segment sol, des terminaux et du renouvellement vers Evolved Strategic SATCOM.",
  resilienceNotes:
    "Résilience lue par qualificatifs publics : protected, survivable, jam-resistant.",
  sovereigntyNotes:
    "AEHF étend la dépendance alliée à l'infrastructure américaine protégée, avec accès contrôlé.",
  cost:
    "Le coût AEHF se lit comme programme stratégique complet : satellites GEO complexes, segment sol, terminaux et renouvellement.",
  finance:
    "Programme américain à très forte intensité budgétaire, amorti par usage national et allié autorisé.",
  supplyChain:
    "Lockheed Martin et Northrop Grumman forment la chaîne industrielle centrale autour de l'US Space Force.",
  geopolitics:
    "AEHF est une infrastructure de dissuasion et de commandement allié, sous gouvernance américaine.",
  export:
    "L'accès allié est politique et contrôlé ; les équipements et technologies sont soumis aux régimes américains.",
  costPerimeter: "Satellites GEO + contrôle sol + terminaux + renouvellement stratégique",
  programFrame: "Programme U.S. Space Force MILSATCOM",
  industrialFrame: "Lockheed Martin, Northrop Grumman, U.S. Space Force",
  exportFrame: "Accès allié contrôlé, ITAR et gouvernance américaine",
  operators: ["États-Unis", "Partenaires AEHF autorisés"],
  theatres: ["Global · communications protégées"],
  timeline: [
    { date: "2010", label: "Premier satellite AEHF lancé.", kind: "jalon" },
    { date: "2020", label: "Sixième satellite AEHF lancé.", kind: "jalon" },
  ],
  sources: [
    {
      id: "ussf-aehf",
      title: "Advanced Extremely High Frequency System",
      publisher: "U.S. Space Force",
      type: "officiel",
      reliability: "A",
      date: "2020",
      url: "https://www.spaceforce.mil/About-Us/Fact-Sheets/Article/2197713/advanced-extremely-high-frequency-system/",
    },
    {
      id: "lockheed-aehf",
      title: "Advanced Extremely High Frequency",
      publisher: "Lockheed Martin",
      type: "constructeur",
      reliability: "B",
      url: "https://www.lockheedmartin.com/en-us/products/advanced-extremely-high-frequency--aehf-.html",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un satellite de communication comme un autre. La réalité : une architecture protégée, politique et coûteuse.",
    bestUseCase:
      "Analyser dépendance alliée, coût programme, renouvellement et gouvernance d'accès.",
    weakPoint:
      "La partie réellement sensible est le réseau et les terminaux ; Panoplie reste volontairement au niveau public.",
    analystNote:
      "AEHF est le miroir américain de Syracuse IV, mais à l'échelle d'une architecture stratégique alliée.",
  },
  scores: scoreSet("A", "A", "C"),
});

export const sbirs = makeSpaceSystem({
  slug: "sbirs",
  name: "SBIRS",
  designation: "Space Based Infrared System",
  reference: "PNP-SP-007",
  classLabel: "Alerte avancée / OPIR",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "U.S. Space Force · Lockheed Martin · Northrop Grumman",
  introduced: "2011-2020s",
  status:
    "Architecture OPIR américaine de détection infrarouge, progressivement complétée par les programmes Next-Gen OPIR.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "La couche infrarouge d'alerte avancée américaine : preuve publique, coûts élevés et transition vers Next-Gen OPIR.",
  summary:
    "SBIRS illustre l'alerte avancée spatiale : capteurs infrarouges, segment sol, données d'alerte et transition industrielle. Panoplie traite l'objet au niveau programme et preuve, sans trajectoire, couverture exploitable ou conseil d'emploi.",
  missions: ["missile-warning"],
  missionText: "Alerte avancée missile / OPIR",
  orbitClasses: ["GEO", "HEO", "multi-orbit"],
  orbitText: "Architecture publique multi-orbite, incluant GEO et capteurs associés",
  orbitNotes: "Pas de couverture temps réel ni de géométrie d'alerte exploitable.",
  payloads: [
    {
      type: "OPIR",
      name: "Infrared missile warning payload",
      supplier: "Lockheed Martin / Northrop Grumman",
      description:
        "Capteurs infrarouges d'alerte et de surveillance décrits au niveau programme.",
      sensitivity: "haute",
    },
    {
      type: "infrared",
      name: "IR scanning / staring sensors",
      supplier: "Northrop Grumman",
      description: "Fonction infrarouge publique, sans paramètre de détection exploitable.",
      sensitivity: "haute",
    },
  ],
  payloadText: "OPIR / infrarouge d'alerte avancée",
  constellationSize: "Architecture SBIRS multi-segments",
  groundSegment: ["U.S. Space Force", "mission control segment", "alert dissemination chains"],
  dataChain:
    "Détection infrarouge -> traitement sol -> chaînes d'alerte institutionnelles, sans scénario d'emploi.",
  launchDependency: ["National Security Space Launch"],
  serviceContinuityNotes:
    "Continuité assurée par SBIRS et transition vers Next-Gen OPIR selon cycles publics.",
  resilienceNotes:
    "Résilience abordée par architecture multi-segments et renouvellement, pas par seuils de détection.",
  sovereigntyNotes:
    "Capacité centrale pour l'alerte américaine et alliée, fortement contrôlée par les États-Unis.",
  cost:
    "SBIRS est l'un des cas où le coût programme prime : satellites, capteurs IR, sol, transition Next-Gen et exploitation.",
  finance:
    "Financement américain stratégique, avec dépenses de renouvellement et montée vers Next-Gen OPIR.",
  supplyChain:
    "Lockheed Martin et Northrop Grumman structurent les segments publicisés, sous maîtrise U.S. Space Force.",
  geopolitics:
    "L'alerte avancée spatiale est un pilier de dissuasion et de gestion de crise ; les accès restent politiques.",
  export:
    "Pas d'export standard ; la coopération porte sur alerte, partage allié et architecture institutionnelle.",
  costPerimeter: "Capteurs OPIR + satellites + segment sol + transition Next-Gen",
  programFrame: "Programme U.S. Space Force d'alerte avancée",
  industrialFrame: "Lockheed Martin, Northrop Grumman, U.S. Space Force",
  exportFrame: "Partage allié contrôlé, non produit export",
  operators: ["États-Unis · U.S. Space Force"],
  theatres: ["Global · alerte avancée stratégique"],
  timeline: [
    { date: "2011", label: "Mise en orbite du premier satellite GEO SBIRS.", kind: "jalon" },
    { date: "2020s", label: "Transition publique vers architectures OPIR de nouvelle génération.", kind: "jalon" },
  ],
  sources: [
    {
      id: "ussf-sbirs",
      title: "Space Based Infrared System",
      publisher: "U.S. Space Force",
      type: "officiel",
      reliability: "A",
      url: "https://www.spaceforce.mil/About-Us/Fact-Sheets/Article/2197768/space-based-infrared-system/",
    },
    {
      id: "lockheed-sbirs",
      title: "Space Based Infrared System",
      publisher: "Lockheed Martin",
      type: "constructeur",
      reliability: "B",
      url: "https://www.lockheedmartin.com/en-us/products/sbirs.html",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : une alarme en orbite. La réalité : un système de systèmes coûteux, sol compris, où le partage d'alerte est politique.",
    bestUseCase:
      "Comprendre OPIR comme infrastructure stratégique et programme industriel de long terme.",
    weakPoint:
      "Les seuils, latences, couvertures et chaînes d'alerte fines ne sont pas documentables publiquement.",
    analystNote:
      "SBIRS doit être traité par preuve et limites : ce que l'on ne sait pas fait partie de la fiche.",
  },
  scores: scoreSet("B", "A", "D"),
});

export const natoApssAquila = makeSpaceSystem({
  slug: "nato-apss-aquila",
  name: "NATO APSS / Aquila",
  designation: "Alliance Persistent Surveillance from Space",
  reference: "PNP-SP-008",
  classLabel: "ISR spatial allié fédéré",
  country: "OTAN",
  flag: "🇪🇺",
  manufacturer: "OTAN · pays alliés · industriels contractants",
  introduced: "2020s",
  status:
    "Initiative OTAN de surveillance persistante depuis l'espace, structurée comme capacité alliée fédérée.",
  acquisitionModes: ["cooperatif"],
  tagline:
    "Une constellation virtuelle alliée : mutualiser l'accès ISR spatial sans prétendre posséder un seul système unique.",
  summary:
    "APSS/Aquila est utile à Panoplie parce qu'il casse le réflexe fiche-satellite. Le sujet est une capacité fédérée : financement allié, accès aux données, contrats industriels, gouvernance et limites de preuve.",
  missions: ["observation", "data-relay"],
  missionText: "ISR spatial allié fédéré",
  orbitClasses: ["multi-orbit"],
  orbitText: "Multi-orbite / constellation virtuelle selon sources OTAN",
  orbitNotes: "Pas de liste opérationnelle de satellites ni de flux temps réel.",
  payloads: [
    {
      type: "hosted-payload",
      name: "Capacités ISR fédérées",
      supplier: "Alliés et fournisseurs sous contrat",
      description:
        "Données et services spatiaux combinés au niveau alliance, sans inventaire exploitable.",
      sensitivity: "moyenne",
    },
  ],
  payloadText: "ISR fédéré, services et données alliés",
  constellationSize: "Capacité fédérée / constellation virtuelle",
  groundSegment: ["NATO", "commandements alliés", "fournisseurs de données", "centres d'exploitation"],
  dataChain:
    "Sources alliées et commerciales -> fédération OTAN -> produits de situation, niveau stratégique public.",
  serviceContinuityNotes:
    "Continuité dépendante de contrats, disponibilité alliée, gouvernance et diversité de fournisseurs.",
  resilienceNotes:
    "Résilience par mutualisation et multi-source, non par paramètres orbitaux.",
  sovereigntyNotes:
    "Capacité d'alliance : elle augmente le partage mais crée aussi une dépendance à la gouvernance collective.",
  cost:
    "Le coût porte surtout sur services, accès données, infrastructure de fusion, contrats et gouvernance, plus que sur un satellite unique.",
  finance:
    "Financement OTAN et allié, avec logique de capacité commune et achats de services.",
  supplyChain:
    "La supply chain est fédérée : sources gouvernementales, alliées et fournisseurs commerciaux sous contrat.",
  geopolitics:
    "APSS/Aquila renforce l'OTAN comme plateforme de partage spatial, dans un contexte où l'espace est reconnu comme domaine opérationnel.",
  export:
    "Pas d'export produit ; le régime pertinent est l'accès allié, la classification des données et les contrats.",
  costPerimeter: "Services ISR + accès données + fusion + gouvernance + contrats",
  programFrame: "Initiative OTAN de surveillance persistante depuis l'espace",
  industrialFrame: "OTAN, pays alliés, fournisseurs publics et commerciaux",
  exportFrame: "Accès alliance, classification et contrats, non export classique",
  operators: ["OTAN", "Pays alliés contributeurs"],
  theatres: ["Zone euro-atlantique", "Global · ISR stratégique"],
  timeline: [
    { date: "2020s", label: "Développement public d'une capacité OTAN de surveillance persistante depuis l'espace.", kind: "jalon" },
  ],
  sources: [
    {
      id: "nato-space-approach",
      title: "NATO's approach to space",
      publisher: "NATO",
      type: "institution",
      reliability: "A",
      url: "https://www.nato.int/en/what-we-do/deterrence-and-defence/natos-approach-to-space",
    },
    {
      id: "nato-space-policy",
      title: "NATO's overarching Space Policy",
      publisher: "NATO",
      type: "officiel",
      reliability: "A",
      date: "2019",
      url: "https://www.nato.int/en/about-us/official-texts-and-resources/official-texts/2019/06/27/natos-overarching-space-policy",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : l'OTAN lancerait simplement sa propre constellation. La réalité : une capacité fédérée, contractuelle et gouvernée.",
    bestUseCase:
      "Analyser l'accès aux données, la mutualisation alliée et le coût de services spatiaux.",
    weakPoint:
      "Le périmètre exact des sources et contrats est évolutif ; la fiche doit rester prudente.",
    analystNote:
      "APSS/Aquila est plus un modèle d'organisation qu'un satellite : c'est précisément ce qui le rend intéressant pour Panoplie.",
  },
  scores: scoreSet("B", "C", "D"),
});

export const nato3sas = makeSpaceSystem({
  slug: "nato-3sas",
  name: "NATO 3SAS",
  designation: "Space Situational Awareness System of Systems",
  reference: "PNP-SP-009",
  classLabel: "SDA / SSA allié",
  country: "OTAN",
  flag: "🇪🇺",
  manufacturer: "OTAN · nations alliées · réseaux de capteurs",
  introduced: "2020s",
  status:
    "Capacité OTAN de connaissance de la situation spatiale décrite au niveau fonctionnel public.",
  acquisitionModes: ["cooperatif"],
  tagline:
    "Regarder l'espace plutôt que la Terre : cataloguer, recouper et partager la situation spatiale au niveau allié.",
  summary:
    "3SAS est le versant SDA/SSA du domaine spatial OTAN. Pour Panoplie, il doit rester non opérationnel : types de capteurs, gouvernance, partage, coût, dépendances et qualité de preuve, sans trajectoires d'objets ni prévision de rencontre.",
  missions: ["sda-ssa"],
  missionText: "SDA / SSA, connaissance de situation spatiale",
  orbitClasses: ["ground-network", "multi-orbit"],
  orbitText: "Réseau sol + données multi-sources",
  orbitNotes: "Aucun catalogue d'objets, TLE, alerte de conjonction ou RPO exploitable.",
  payloads: [
    {
      type: "space-surveillance",
      name: "Capteurs et données SSA fédérés",
      supplier: "Alliés et fournisseurs de données",
      description:
        "Agrégation de capteurs et données publiques/institutionnelles au niveau architecture.",
      sensitivity: "haute",
    },
  ],
  payloadText: "Space surveillance / SSA fédérée",
  constellationSize: "Système de systèmes",
  groundSegment: ["capteurs sol alliés", "centres de données", "NATO Space Centre"],
  dataChain:
    "Capteurs et catalogues alliés -> fusion -> connaissance de situation spatiale, sans prédiction exploitable.",
  serviceContinuityNotes:
    "Continuité dépendante de la diversité des capteurs, des accords de partage et de la qualité des données.",
  resilienceNotes:
    "Résilience par recoupement multi-capteurs et gouvernance alliée, pas par publication de catalogues dynamiques.",
  sovereigntyNotes:
    "Capacité collective qui améliore la conscience spatiale mais dépend de contributions nationales.",
  cost:
    "Le coût réside dans capteurs, logiciels, fusion, réseau et gouvernance, pas dans un satellite unique.",
  finance:
    "Programme coopératif de l'Alliance, financé par contributions et capacités nationales connectées.",
  supplyChain:
    "Chaîne hétérogène : radars, télescopes, logiciels, centres de données et contrats d'intégration.",
  geopolitics:
    "La SDA/SSA alliée devient un préalable de résilience spatiale, de dissuasion et de transparence entre alliés.",
  export:
    "Pas d'export ; l'accès dépend de classification, accords alliés et règles de partage.",
  costPerimeter: "Capteurs + logiciels + fusion + réseau + gouvernance",
  programFrame: "Architecture OTAN de connaissance de situation spatiale",
  industrialFrame: "OTAN, nations alliées, capteurs et intégrateurs",
  exportFrame: "Partage allié classifié ou contrôlé, non export",
  operators: ["OTAN", "Nations alliées contributrices"],
  theatres: ["Espace orbital · connaissance de situation", "Europe · centres alliés"],
  timeline: [
    { date: "2019", label: "L'OTAN adopte une politique spatiale globale.", kind: "jalon" },
    { date: "2020s", label: "Renforcement public des capacités SDA/SSA de l'Alliance.", kind: "jalon" },
  ],
  sources: [
    {
      id: "nato-approach-space-3sas",
      title: "NATO's approach to space",
      publisher: "NATO",
      type: "institution",
      reliability: "A",
      url: "https://www.nato.int/en/what-we-do/deterrence-and-defence/natos-approach-to-space",
    },
    {
      id: "esa-orbits",
      title: "Types of orbits",
      publisher: "ESA",
      type: "institution",
      reliability: "A",
      url: "https://www.esa.int/Enabling_Support/Space_Transportation/Types_of_orbits",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : SSA signifie suivre n'importe quel objet en direct. La réalité Panoplie : on explique la fonction, pas les données exploitables.",
    bestUseCase:
      "Comprendre pourquoi la résilience spatiale dépend de capteurs, données et accords de partage.",
    weakPoint:
      "Le détail des catalogues, performances de capteurs et alertes dynamiques est exclu.",
    analystNote:
      "3SAS est la fiche garde-fou par excellence : montrer la valeur stratégique sans fournir de suivi orbital.",
  },
  scores: scoreSet("B", "C", "D"),
});

export const skynet6 = makeSpaceSystem({
  slug: "skynet-6",
  name: "Skynet 6",
  designation: "UK military satellite communications programme",
  reference: "PNP-SP-010",
  classLabel: "SATCOM militaire britannique",
  country: "Royaume-Uni",
  flag: "🇬🇧",
  manufacturer: "UK Ministry of Defence · Airbus · Babcock · partenaires Skynet",
  introduced: "2020s-2030s",
  status:
    "Programme britannique de renouvellement MILSATCOM, avec Skynet 6A et transformation du segment sol et services.",
  acquisitionModes: ["production-nationale", "cooperatif"],
  tagline:
    "La continuité SATCOM britannique : programme, service, industrie et transition depuis Skynet 5.",
  summary:
    "Skynet 6 est un programme plus qu'une fiche satellite : renouvellement du segment spatial, transformation du service, contrats de soutien et souveraineté britannique. Panoplie le compare à Syracuse et AEHF au niveau coût/industrie, sans emploi réseau.",
  missions: ["satcom"],
  missionText: "SATCOM militaire britannique",
  orbitClasses: ["GEO"],
  orbitText: "GEO publique pour le segment satellitaire principal",
  orbitNotes: "Pas de position, plan de couverture ou procédure de réseau.",
  payloads: [
    {
      type: "SATCOM-X",
      name: "MILSATCOM X-band",
      supplier: "Airbus / partenaires Skynet",
      description: "Télécommunications militaires britanniques au niveau programme.",
      sensitivity: "haute",
    },
    {
      type: "SATCOM-Ka",
      name: "Capacités haut débit selon architecture programme",
      supplier: "Partenaires Skynet",
      description: "Architecture SATCOM de renouvellement, sans plan de fréquences exploitable.",
      sensitivity: "haute",
    },
  ],
  payloadText: "SATCOM militaire X / Ka au niveau programme",
  constellationSize: "Renouvellement Skynet 5 / Skynet 6",
  groundSegment: ["UK MOD", "Skynet Service Delivery", "terminaux et stations sol"],
  dataChain:
    "Terminaux militaires -> satellite GEO -> réseau et service Skynet, sans mode d'emploi.",
  launchDependency: ["Accès lancement commercial / institutionnel selon contrat"],
  serviceContinuityNotes:
    "Transition Skynet 5 vers Skynet 6, avec contrats de service et soutien long terme.",
  resilienceNotes:
    "Résilience lue par continuité de programme, service managé et modernisation, pas par architecture réseau détaillée.",
  sovereigntyNotes:
    "Capacité souveraine britannique avec forte dimension contractuelle privée.",
  cost:
    "Le coût Skynet 6 combine satellite 6A, services, segment sol, soutien et transition de Skynet 5.",
  finance:
    "Programme MOD à long terme, structuré par contrats industriels et service delivery.",
  supplyChain:
    "Airbus, Babcock et partenaires Skynet jouent un rôle dans satellites, services et soutien.",
  geopolitics:
    "Skynet est un marqueur de souveraineté britannique et un actif allié de communications sécurisées.",
  export:
    "Capacité souveraine ; les enjeux export sont surtout industriels et service, pas vente de satellite complet.",
  costPerimeter: "Satellite 6A + services + segment sol + soutien + transition Skynet 5",
  programFrame: "Programme UK MOD Skynet 6",
  industrialFrame: "Airbus, Babcock, UK MOD, partenaires de service",
  exportFrame: "Capacité nationale, contrats industriels et services associés",
  operators: ["Royaume-Uni · Ministry of Defence"],
  theatres: ["Global · communications militaires britanniques"],
  timeline: [
    { date: "2020s", label: "Contrats de transition et préparation Skynet 6.", kind: "jalon" },
    { date: "2030s", label: "Horizon public de renouvellement et service Skynet futur.", kind: "jalon" },
  ],
  sources: [
    {
      id: "uk-mod-skynet-6",
      title: "Skynet 6",
      publisher: "UK Ministry of Defence",
      type: "officiel",
      reliability: "A",
      url: "https://www.gov.uk/government/collections/skynet-6",
    },
    {
      id: "airbus-skynet-6a",
      title: "Skynet 6A",
      publisher: "Airbus Defence and Space",
      type: "constructeur",
      reliability: "B",
      url: "https://www.airbus.com/en/products-services/space/telecommunications-satellites/skynet-6a",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : Skynet 6 serait un seul satellite. La réalité : un programme de service, sol, soutien et transition.",
    bestUseCase:
      "Comparer modèles nationaux SATCOM : France, Royaume-Uni, États-Unis et OTAN.",
    weakPoint:
      "Calendrier, périmètre de service et coûts consolidés peuvent évoluer avec les contrats.",
    analystNote:
      "Skynet 6 introduit une excellente lecture programme : satellite, mais surtout service et gouvernance.",
  },
});

export const sarah = makeSpaceSystem({
  slug: "sarah",
  name: "SARah",
  designation: "German radar reconnaissance satellite system",
  reference: "PNP-SP-011",
  classLabel: "Imagerie radar militaire",
  country: "Allemagne",
  flag: "🇩🇪",
  manufacturer: "OHB · Airbus Defence and Space · Bundeswehr",
  introduced: "2020s",
  status:
    "Programme allemand de reconnaissance radar en orbite basse, successeur de SAR-Lupe, avec informations publiques à recouper.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le complément allemand à l'imagerie optique : observation radar, souveraineté et dépendances industrielles européennes.",
  summary:
    "SARah illustre la logique SAR : capacité d'imagerie radar documentée publiquement, utile pour comprendre autonomie, industrie et coût programme. Panoplie évite toute exploitation d'images, de passes orbitales ou de paramètres de résolution fins.",
  missions: ["observation"],
  missionText: "Observation radar / GEOINT",
  orbitClasses: ["LEO"],
  orbitText: "LEO publique",
  orbitNotes: "Pas de TLE ni calendrier de revisite exploitable.",
  payloads: [
    {
      type: "SAR",
      name: "Synthetic Aperture Radar payload",
      supplier: "OHB / Airbus Defence and Space",
      description:
        "Charge utile radar d'observation, documentée au niveau industriel et programme.",
      sensitivity: "haute",
    },
  ],
  payloadText: "SAR militaire, description publique",
  constellationSize: "Constellation SARah",
  groundSegment: ["Bundeswehr", "segment sol allemand", "centres de traitement image"],
  dataChain:
    "Collecte SAR -> traitement sol -> produit image institutionnel, sans exploitation opérationnelle.",
  launchDependency: ["Lancements commerciaux/institutionnels selon calendrier public"],
  serviceContinuityNotes:
    "Continuité dépendante de la constellation, du remplacement SAR-Lupe et du segment sol.",
  resilienceNotes:
    "Résilience lue par diversité radar/optique et constellation, pas par modes d'acquisition image.",
  sovereigntyNotes:
    "Renforce l'autonomie allemande et européenne en imagerie radar, complémentaire des capacités optiques.",
  cost:
    "Le coût SARah se lit comme constellation et segment sol radar, avec incertitude forte sur consolidation publique.",
  finance:
    "Programme national allemand, avec industriels européens et logique de remplacement capacitaire.",
  supplyChain:
    "OHB et Airbus structurent la chaîne, avec le segment utilisateur Bundeswehr.",
  geopolitics:
    "SARah complète les capacités européennes d'observation, notamment lorsque l'optique est limitée par météo ou luminosité.",
  export:
    "Capacité nationale sensible ; export non standard, mais compétences SAR européennes exportables par ailleurs.",
  costPerimeter: "Constellation radar + lancement + segment sol + traitement image",
  programFrame: "Programme national allemand de reconnaissance radar",
  industrialFrame: "OHB, Airbus Defence and Space, Bundeswehr",
  exportFrame: "Capacité souveraine, compétences industrielles transférables selon contrats",
  operators: ["Allemagne · Bundeswehr"],
  theatres: ["Europe", "Global · observation stratégique"],
  timeline: [
    { date: "2022", label: "Premier lancement public associé au programme SARah.", kind: "jalon" },
    { date: "2020s", label: "Montée en constellation et remplacement progressif de SAR-Lupe.", kind: "jalon" },
  ],
  sources: [
    {
      id: "ohb-sarah",
      title: "SARah satellite reconnaissance system",
      publisher: "OHB",
      type: "constructeur",
      reliability: "B",
      url: "https://www.ohb.de/en/satellite-fleet/sarah",
    },
    {
      id: "airbus-sarah",
      title: "SARah radar satellites",
      publisher: "Airbus Defence and Space",
      type: "constructeur",
      reliability: "B",
      url: "https://www.airbus.com/en/newsroom/press-releases/2022-06-airbus-built-second-and-third-sarah-radar-satellites-are-ready-for",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : SAR veut dire voir partout sans limite. La réalité : c'est un programme coûteux, sourcé avec prudence, dont les performances fines restent sensibles.",
    bestUseCase:
      "Analyser l'autonomie européenne radar et la complémentarité avec CSO.",
    weakPoint:
      "Plusieurs informations programme sont fragmentaires ; la fiche doit garder des statuts à recouper.",
    analystNote:
      "SARah doit être comparé à CSO au niveau mission et industrie, jamais comme recette d'exploitation d'image.",
  },
  scores: scoreSet("C", "C", "D"),
});

export const iris2Govsatcom = makeSpaceSystem({
  slug: "iris2-govsatcom",
  name: "IRIS² / GOVSATCOM UE",
  designation: "Infrastructure for Resilience, Interconnectivity and Security by Satellite",
  reference: "PNP-SP-012",
  classLabel: "Connectivité gouvernementale européenne",
  country: "Union européenne",
  flag: "🇪🇺",
  manufacturer: "Commission européenne · EUSPA · ESA · consortium industriel",
  introduced: "2020s-2030s",
  status:
    "Programme européen de connectivité sécurisée et GOVSATCOM, en construction ; données à traiter comme programme évolutif.",
  acquisitionModes: ["cooperatif"],
  tagline:
    "Le futur SATCOM souverain européen : résilience, connectivité sécurisée et modèle public-privé à suivre avec prudence.",
  summary:
    "IRIS² et GOVSATCOM incarnent la montée européenne sur la connectivité souveraine. Panoplie les documente comme programme : gouvernance, coûts publics, industriels, orbites envisagées, accès gouvernemental et incertitudes, sans promettre une capacité déjà figée.",
  missions: ["satcom", "data-relay"],
  missionText: "Connectivité sécurisée gouvernementale et relais de données",
  orbitClasses: ["multi-orbit"],
  orbitText: "Architecture multi-orbite envisagée publiquement",
  orbitNotes: "Programme évolutif ; pas de carte de couverture, fréquence ou calendrier exploitable.",
  payloads: [
    {
      type: "SATCOM-Ka",
      name: "Secure connectivity payloads",
      supplier: "Consortium industriel européen",
      description: "Connectivité gouvernementale sécurisée au niveau programme.",
      sensitivity: "moyenne",
    },
    {
      type: "hosted-payload",
      name: "GOVSATCOM services",
      supplier: "EUSPA / fournisseurs européens",
      description: "Services gouvernementaux mutualisés, selon gouvernance européenne.",
      sensitivity: "moyenne",
    },
  ],
  payloadText: "SATCOM sécurisé / GOVSATCOM, architecture programme",
  constellationSize: "Architecture multi-orbite à construire",
  groundSegment: ["Commission européenne", "EUSPA", "ESA", "fournisseurs GOVSATCOM"],
  dataChain:
    "Services satellitaires sécurisés -> accès gouvernemental européen -> utilisateurs autorisés.",
  launchDependency: ["Accès européen et commercial aux lancements", "cadence programme à suivre"],
  serviceContinuityNotes:
    "Continuité encore programmatique : dépend de contrats, déploiement, gouvernance et opérateurs.",
  resilienceNotes:
    "Résilience visée par multi-orbite et services mutualisés, mais à vérifier au fur et à mesure des jalons publics.",
  sovereigntyNotes:
    "Ambition de souveraineté européenne face aux dépendances de connectivité critiques.",
  cost:
    "Le coût d'IRIS² doit être suivi comme programme public-privé : constellation, services, segment sol, gouvernance et exploitation.",
  finance:
    "Programme européen avec modèle public-privé et rôle des institutions spatiales européennes.",
  supplyChain:
    "Consortium européen et agences UE/ESA/EUSPA ; périmètre industriel évolutif selon contrats.",
  geopolitics:
    "IRIS² est autant une réponse à la dépendance numérique qu'un programme spatial : souveraineté, résilience et autonomie européenne.",
  export:
    "L'accès est gouvernemental et européen ; les questions export relèvent de services, contrats et gouvernance, pas d'une vente simple.",
  costPerimeter: "Constellation multi-orbite + services + sol + gouvernance + exploitation",
  programFrame: "Programme spatial de l'Union européenne, modèle public-privé",
  industrialFrame: "Commission européenne, EUSPA, ESA, consortium industriel européen",
  exportFrame: "Services gouvernementaux autorisés, cadre institutionnel européen",
  operators: ["Union européenne", "États membres et utilisateurs gouvernementaux autorisés"],
  theatres: ["Europe", "Global · connectivité gouvernementale"],
  timeline: [
    { date: "2022", label: "Proposition européenne de connectivité sécurisée.", kind: "jalon" },
    { date: "2020s", label: "Structuration IRIS² / GOVSATCOM et contractualisation progressive.", kind: "jalon" },
  ],
  sources: [
    {
      id: "ec-iris2",
      title: "IRIS² secure connectivity",
      publisher: "European Commission",
      type: "institution",
      reliability: "A",
      url: "https://defence-industry-space.ec.europa.eu/eu-space/iris2-secure-connectivity_en",
    },
    {
      id: "euspa-govsatcom",
      title: "GOVSATCOM",
      publisher: "EUSPA",
      type: "institution",
      reliability: "A",
      url: "https://www.euspa.europa.eu/eu-space-programme/govsatcom",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : IRIS² serait déjà une constellation équivalente aux systèmes établis. La réalité : c'est un programme stratégique en construction.",
    bestUseCase:
      "Suivre gouvernance, financement, industriels, risques de calendrier et souveraineté européenne.",
    weakPoint:
      "Le périmètre industriel, le calendrier et les services exacts évoluent ; la fiche doit être révisée régulièrement.",
    analystNote:
      "IRIS² est parfait pour la console de preuve : chaque jalon doit être daté, sourcé et révisable.",
  },
  scores: scoreSet("B", "D", "C"),
});
