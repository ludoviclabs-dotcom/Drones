import type {
  AcquisitionMode,
  ArmoredApsStatus,
  ArmoredLoading,
  ArmoredProgramStatus,
  ArmoredVehicleFamily,
  Brick,
  DefenseSystem,
  Indicator,
  Score,
  SourceRef,
} from "../types";

const UPDATED = "2026-06-13";

interface ArmoredSystemInput {
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
  family: ArmoredVehicleFamily;
  programStatus: ArmoredProgramStatus;
  crew: string;
  loading: ArmoredLoading;
  mainGun: string;
  secondary?: string[];
  ammunitionFamilies: string[];
  ammunitionPerimeter: string;
  ammunitionCaution?: string;
  passiveProtection: string;
  modularProtection?: string;
  apsStatus: ArmoredApsStatus;
  apsName?: string;
  crewSurvivabilityNotes?: string;
  powerpack: string;
  transmission?: string;
  mobilityNotes?: string;
  vetronics: string;
  c2: string;
  mcoNotes: string;
  recoverySupport?: string;
  modernizationNotes?: string;
  localProductionNotes?: string;
  industrialNotes: string;
  costNotes?: string;
  exportNotes?: string;
  cost: string;
  finance: string;
  supplyChain: string;
  geopolitics: string;
  export: string;
  costFrame: string;
  financeFrame: string;
  industrialFrame: string;
  exportFrame: string;
  operators: string[];
  theatres: string[];
  timeline: DefenseSystem["timeline"];
  sources: SourceRef[];
  editorial: DefenseSystem["editorial"];
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
  industrialRisk: Score["grade"] = "B",
): Score[] {
  return [
    {
      key: "efficacite-cout",
      grade: "C",
      rationale:
        "Lecture limitee au cout public, au package contractuel, au MCO, aux pieces, aux munitions et a la modernisation ; aucune comparaison d'efficacite militaire n'est produite.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Le palier reflete seulement protection publique, APS, soutien et architecture, sans angle d'attaque, ciblage ou recommandation d'emploi.",
    },
    {
      key: "exportabilite",
      grade: exportability,
      rationale:
        "L'exportabilite depend des licences nationales, de l'ITAR eventuel, des munitions, de la production locale et du soutien long terme.",
    },
    {
      key: "risque-industriel",
      grade: industrialRisk,
      rationale:
        "Risque lu par disponibilite de powerpacks, blindage, optiques, electronique, pieces, lignes de renovation et capacite MCO.",
    },
    {
      key: "maturite",
      grade: maturity,
      rationale:
        "La maturite suit livraisons, modernisations, commandes et transparence publique, sans conclure sur l'emploi operationnel.",
    },
    {
      key: "confiance-donnees",
      grade: sourceConfidence,
      rationale:
        "Le palier depend de sources constructeur, institutionnelles ou presse ; les vulnerabilites et details exploitables sont exclus.",
    },
  ];
}

function makeArmoredSystem(input: ArmoredSystemInput): DefenseSystem {
  const sourceIds = input.sources.map((source) => source.id);
  const primary = [input.sources[0]?.id ?? ""].filter(Boolean);
  const primaryOrAll = primary.length > 0 ? primary : sourceIds;
  const scores = input.scores ?? scoreSet("B", "B", "B");
  const safetyBoundary =
    "Pas de ciblage, pas de tactique, pas d'exploitation de vulnerabilites, pas de procedure d'emploi, pas d'optimisation letale.";

  const bricks: Brick[] = [
    {
      key: "cout",
      narrative: input.cost,
      indicators: [
        indicator("Perimetre cout", input.costFrame, sourceIds),
        indicator(
          "Incertitude",
          "Distinguer plateforme seule, package contractuel, modernisation, munitions, pieces, MCO, depannage et production locale.",
          primaryOrAll,
        ),
      ],
    },
    {
      key: "finance",
      narrative: input.finance,
      indicators: [
        indicator("Portage programme", input.financeFrame, sourceIds),
        indicator(
          "Lecture budgetaire",
          "Un char est un parc a maintenir : stocks, renovation, powerpack, optiques, simulateurs, munitions et depannage dominent le cout complet.",
          primaryOrAll,
        ),
      ],
    },
    {
      key: "supply-chain",
      narrative: input.supplyChain,
      indicators: [
        indicator("Chaine industrielle", input.industrialFrame, sourceIds, "haute"),
        indicator("MCO / pieces", input.mcoNotes, sourceIds),
      ],
    },
    {
      key: "geopolitique",
      narrative: input.geopolitics,
      indicators: [
        indicator("Fonction strategique", input.classLabel, primaryOrAll, "haute"),
        indicator("Souverainete / dependance", input.industrialNotes, sourceIds),
      ],
    },
    {
      key: "export",
      narrative: input.export,
      indicators: [
        indicator("Regime public", input.exportFrame, sourceIds),
        indicator("Limite Panoplie", safetyBoundary, primaryOrAll, "haute"),
      ],
    },
  ];

  return {
    slug: input.slug,
    name: input.name,
    designation: input.designation,
    reference: input.reference,
    category: "armored-vehicle",
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
      indicator("Famille", input.family, primaryOrAll, "haute"),
      indicator("Statut programme", input.programStatus, sourceIds),
      indicator("Canon public", input.mainGun, sourceIds),
      indicator("APS / protection", input.apsName ?? input.apsStatus, sourceIds),
      indicator("Garde-fou", safetyBoundary, primaryOrAll, "haute"),
    ],
    bricks,
    scores,
    editorial: input.editorial,
    legalNote:
      "Dossier OSINT strategique non operationnel : les donnees de canon, protection, APS ou mobilite sont traitees comme claims publics dependants des sources. Panoplie exclut ciblage, vulnerabilites exploitables, procedures d'emploi et optimisation lethale.",
    operators: input.operators,
    theatres: input.theatres,
    timeline: input.timeline,
    sources: input.sources,
    updated: UPDATED,
    armoredProfile: {
      family: input.family,
      programStatus: input.programStatus,
      crew: input.crew,
      loading: input.loading,
      armament: {
        mainGun: input.mainGun,
        secondary: input.secondary,
        ammunitionFamilies: input.ammunitionFamilies,
        sourcePerimeter: input.ammunitionPerimeter,
        caution: input.ammunitionCaution,
      },
      protection: {
        passive: input.passiveProtection,
        modular: input.modularProtection,
        apsStatus: input.apsStatus,
        apsName: input.apsName,
        crewSurvivabilityNotes: input.crewSurvivabilityNotes,
      },
      mobility: {
        powerpack: input.powerpack,
        transmission: input.transmission,
        mobilityNotes: input.mobilityNotes,
      },
      vetronics: input.vetronics,
      c2: input.c2,
      support: {
        mcoNotes: input.mcoNotes,
        recoverySupport: input.recoverySupport,
        modernizationNotes: input.modernizationNotes,
        localProductionNotes: input.localProductionNotes,
      },
      industrialNotes: input.industrialNotes,
      costNotes: input.costNotes,
      exportNotes: input.exportNotes,
      safetyBoundary,
    },
  };
}

export const leclercXlr = makeArmoredSystem({
  slug: "leclerc-xlr",
  name: "Leclerc XLR",
  designation: "Standard renove Scorpion",
  reference: "PNP-ARM-001",
  classLabel: "Char de bataille principal modernise",
  country: "France",
  flag: "FR",
  manufacturer: "KNDS France",
  introduced: "2020s",
  status: "Modernisation du parc Leclerc francais vers le standard XLR, integre a l'ecosysteme Scorpion.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Un dossier de renovation souveraine : cout de prolongation, vetronique Scorpion, MCO, obsolescences et base industrielle francaise.",
  summary:
    "Leclerc XLR est traite comme programme de maintien de capacite et de souverainete industrielle. Panoplie suit la renovation, les obsolescences, l'integration Scorpion, la logistique, le cout complet et les limites de preuve, sans publier d'angle d'emploi ou de vulnerabilite.",
  family: "MBT",
  programStatus: "modernized",
  crew: "3 personnes selon configuration Leclerc publique",
  loading: "automatic",
  mainGun: "120 mm lisse public, sans donnees balistiques exploitables",
  secondary: ["Armement secondaire public selon standard"],
  ammunitionFamilies: ["120 mm OTAN selon stock francais", "munitions publiques a recouper"],
  ammunitionPerimeter:
    "Familles 120 mm publiques uniquement ; aucune table, perforation ou sequence d'emploi.",
  ammunitionCaution:
    "Les performances de munitions dependent du lot, de la source et du contexte ; Panoplie ne les compare pas.",
  passiveProtection: "Blindage composite et kits de protection modernises selon sources publiques.",
  modularProtection: "Kits XLR et integration de protections additionnelles selon perimetre programme.",
  apsStatus: "planned",
  apsName: "Protection active a suivre selon futurs standards publics",
  crewSurvivabilityNotes: "Chargeur automatique et equipage reduit a lire comme choix d'architecture, pas comme avantage tactique.",
  powerpack: "Groupe motopropulseur Leclerc existant, MCO et obsolescences a suivre.",
  transmission: "Transmission et soutien parc existant.",
  mobilityNotes: "Mobilite traitee au niveau MCO, pieces et disponibilite parc, pas comme manoeuvre.",
  vetronics: "Integration Scorpion, vetronique renovee, radios et systemes de bord modernises.",
  c2: "SICS / ecosysteme Scorpion selon perimetre public.",
  mcoNotes: "MCO centre sur renovation de parc, obsolescences, pieces, simulateurs et disponibilite.",
  recoverySupport: "Depannage et soutien lourd a inclure dans cout de possession.",
  modernizationNotes: "Renovation XLR plutot qu'acquisition neuve.",
  localProductionNotes: "Base industrielle francaise KNDS et sous-traitants.",
  industrialNotes: "KNDS France, DGA, ecosysteme Scorpion, MCO terrestre francais.",
  costNotes: "Cout public a lire comme renovation de parc, pas plateforme neuve.",
  exportNotes: "Export non central ; lecture centree parc francais et souverainete.",
  cost:
    "Le cout du Leclerc XLR est celui d'une prolongation de parc : renovation, vetronique, radios, obsolescences, pieces, simulateurs et soutien, plus que prix d'un char neuf.",
  finance:
    "Le financement s'inscrit dans Scorpion et la modernisation de l'armee de Terre, avec arbitrage entre prolonger l'existant et preparer le MGCS.",
  supplyChain:
    "La chaine combine KNDS, DGA, sous-traitants Scorpion, MCO et disponibilite de composants sur un parc limite.",
  geopolitics:
    "Leclerc XLR maintient une competence francaise sur le MBT en attendant les futurs programmes europeens.",
  export:
    "L'export est secondaire ; le dossier sert surtout a lire soutien national, souverainete et cout de renovation.",
  costFrame: "Renovation XLR + obsolescences + vetronique + MCO + soutien parc",
  financeFrame: "Programme national Scorpion et maintien de capacite MBT",
  industrialFrame: "KNDS France, DGA, sous-traitants Scorpion, MCO terrestre",
  exportFrame: "Pas de dynamique export centrale dans le standard XLR",
  operators: ["France"],
  theatres: ["Europe", "Parc national"],
  timeline: [
    { date: "2010s", label: "Lancement public de la renovation Leclerc XLR dans Scorpion.", kind: "jalon" },
    { date: "2020s", label: "Livraisons et integration progressive du standard renove.", kind: "jalon" },
  ],
  sources: [
    {
      id: "dga-leclerc-xlr",
      title: "Le char Leclerc renove XLR",
      publisher: "Ministere des Armees / DGA",
      type: "institution",
      reliability: "B",
      date: "2020s",
      url: "https://www.defense.gouv.fr/dga",
    },
    {
      id: "knds-leclerc",
      title: "Leclerc main battle tank",
      publisher: "KNDS",
      type: "constructeur",
      reliability: "B",
      url: "https://knds.com/en/",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : moderniser serait moins strategique qu'acheter neuf. La realite : prolonger un parc rare peut etre le choix industriel le plus rationnel.",
    bestUseCase:
      "Comparer renovation, MCO et souverainete industrielle sans discuter d'emploi tactique.",
    weakPoint:
      "Les couts par sous-lot et les obsolescences restent peu homogenes publiquement.",
    analystNote:
      "Leclerc XLR est un excellent cas de cout complet : la valeur est dans le maintien de capacite et la coherence Scorpion.",
  },
  scores: scoreSet("B", "B", "C", "B"),
});

export const leopard2A8 = makeArmoredSystem({
  slug: "leopard-2a8",
  name: "Leopard 2A8 / 2A7A1",
  designation: "Standard Leopard 2 recent avec protection active selon configuration",
  reference: "PNP-ARM-002",
  classLabel: "Char de bataille principal nouveau standard",
  country: "Allemagne",
  flag: "DE",
  manufacturer: "KNDS Deutschland",
  introduced: "2020s",
  status: "Nouveau standard europeen et export, avec fortes dynamiques de commandes apres 2022.",
  acquisitionModes: ["production-nationale", "DCS"],
  tagline:
    "Le MBT europeen de reference : commandes, MCO, production, Trophy selon configuration et dependances de chaine allemande.",
  summary:
    "Leopard 2A8 / 2A7A1 est lu comme plateforme et ecosysteme industriel europeen. La fiche suit commandes, renovation, APS, munitions 120 mm, pieces, production allemande, export et interdependances, sans deduire de superiorite operationnelle.",
  family: "MBT",
  programStatus: "new-standard",
  crew: "4 personnes",
  loading: "manual",
  mainGun: "120 mm lisse Rheinmetall public",
  secondary: ["Armement secondaire public selon client"],
  ammunitionFamilies: ["120 mm OTAN", "familles Rheinmetall / client selon autorisations"],
  ammunitionPerimeter: "Munitions 120 mm publiques ; pas de penetration, table ou recommandation d'emploi.",
  passiveProtection: "Protection modulaire Leopard 2 recente selon standard et client.",
  modularProtection: "Kits modulaires et adaptations nationales.",
  apsStatus: "integrated",
  apsName: "Trophy sur 2A7A1 / configurations 2A8 publiques selon client",
  crewSurvivabilityNotes: "APS et protection sont presentes comme choix d'architecture et de cout, pas comme assurance tactique.",
  powerpack: "MTU / chaine powerpack Leopard 2 selon standard public.",
  transmission: "Renk / architecture Leopard 2 selon parc.",
  mobilityNotes: "Mobilite traitee par masse, soutien, pieces et parc installe.",
  vetronics: "Vetronique modernisee selon standard 2A8 et client.",
  c2: "Integration nationale OTAN selon client.",
  mcoNotes: "Grand parc installe mais pression sur pieces, renovation, ateliers et cadence.",
  recoverySupport: "Bergepanzer, pontage et soutien Leopard a integrer au cout complet.",
  modernizationNotes: "Modernisations 2A7/2A8 et retrofits par pays.",
  localProductionNotes: "Production allemande, assemblages et contrats locaux possibles selon client.",
  industrialNotes: "KNDS Deutschland, Rheinmetall, MTU, Renk, fournisseurs APS et ecosysteme europeen.",
  costNotes: "Cout public tres dependant du standard, APS, munitions, formation et soutien.",
  exportNotes: "Large base export sous autorisation allemande et accords client par client.",
  cost:
    "Leopard 2A8 est moins un prix unitaire qu'un package : char, APS, munitions, formation, pieces, depannage, simulateurs et soutien long terme.",
  finance:
    "Les commandes recentes s'inscrivent dans le rearmement europeen, la reconstitution de stocks et la mutualisation possible de parcs Leopard.",
  supplyChain:
    "La chaine allemande offre profondeur industrielle mais subit la pression des commandes, retrofits, pieces et munitions.",
  geopolitics:
    "Leopard 2 reste un standard europeen : il structure alliances, transferts, soutiens et dependances d'autorisation.",
  export:
    "L'export est fort mais encadre : licences allemandes, configurations client, APS, munitions et soutien doivent etre separes.",
  costFrame: "Plateforme + APS + munitions + formation + soutien + depannage + retrofits",
  financeFrame: "Commandes nationales et europeennes, reconstitution post-2022",
  industrialFrame: "KNDS, Rheinmetall, MTU, Renk, Trophy selon configuration",
  exportFrame: "Autorisations allemandes et contrats client par client",
  operators: ["Allemagne", "Norvege", "Italie", "Tchequie", "Pays-Bas", "Clients Leopard"],
  theatres: ["Europe", "OTAN", "Marches export"],
  timeline: [
    { date: "2020s", label: "Commandes europeennes de nouveaux standards Leopard 2.", kind: "export" },
    { date: "2023", label: "Mise en avant publique du standard 2A8 dans le contexte de rearmement europeen.", kind: "jalon" },
  ],
  sources: [
    {
      id: "knds-leopard-2a8",
      title: "Leopard 2A8 main battle tank",
      publisher: "KNDS",
      type: "constructeur",
      reliability: "B",
      url: "https://knds.com/en/",
    },
    {
      id: "rafael-trophy",
      title: "Trophy Active Protection System",
      publisher: "Rafael",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rafael.co.il/system/trophy-aps/",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : le Leopard est un produit unique. La realite : chaque standard national change cout, APS, munitions et MCO.",
    bestUseCase:
      "Lire le MBT comme standard europeen, chaine industrielle et regime export.",
    weakPoint:
      "Les packages de soutien et retrofits rendent les comparaisons publiques difficiles.",
    analystNote:
      "Leopard 2A8 est un dossier pivot pour Panoplie car il concentre industrie, geopolitique et MCO.",
  },
  scores: scoreSet("B", "B", "A", "B"),
});

export const m1a2Sepv3Abrams = makeArmoredSystem({
  slug: "m1a2-sepv3-abrams",
  name: "M1A2 SEPv3 Abrams",
  designation: "System Enhancement Package v3",
  reference: "PNP-ARM-003",
  classLabel: "Char de bataille principal modernise",
  country: "Etats-Unis",
  flag: "US",
  manufacturer: "General Dynamics Land Systems",
  introduced: "2010s-2020s",
  status: "Standard Abrams recent, produit et modernise pour US Army et clients FMS.",
  acquisitionModes: ["FMS", "production-nationale"],
  tagline:
    "La puissance d'un parc mondial : modernisation, turbine, supply chain US, FMS, munitions et cout de soutien.",
  summary:
    "M1A2 SEPv3 Abrams est documente comme ecosysteme industriel americain : modernisation, turbine, electronique, FMS, munitions, ateliers, depannage et logistique lourde. Panoplie ne traite pas les tactiques d'emploi ou vulnerabilites.",
  family: "MBT",
  programStatus: "modernized",
  crew: "4 personnes",
  loading: "manual",
  mainGun: "120 mm lisse public",
  secondary: ["Armement secondaire public selon configuration"],
  ammunitionFamilies: ["120 mm OTAN / US", "munitions US soumises a autorisation"],
  ammunitionPerimeter: "Familles 120 mm publiques ; details d'effets et emploi exclus.",
  passiveProtection: "Protection composite et kits US selon configuration publique.",
  modularProtection: "Kits et upgrades SEP selon standards.",
  apsStatus: "optional",
  apsName: "Trophy integre sur certains Abrams selon programmes publics",
  crewSurvivabilityNotes: "Architecture et protection presentees au niveau industriel uniquement.",
  powerpack: "Turbine AGT1500, poste majeur de soutien et logistique.",
  transmission: "Transmission Abrams et chaine de maintenance US.",
  mobilityNotes: "Mobilite lue par carburant, maintenance, pieces et infrastructure de soutien.",
  vetronics: "Electronique, capteurs et architecture SEP v3 modernises.",
  c2: "Integration reseau US et client FMS selon configuration.",
  mcoNotes: "MCO lourd, turbine, pieces, depot-level maintenance, formation et depannage.",
  recoverySupport: "M88A2/A3 et soutien lourd a integrer dans tout package.",
  modernizationNotes: "SEPv3 modernise une base Abrams existante ; futurs standards a suivre.",
  localProductionNotes: "Production / renovation US avec transferts FMS possibles, pas souverainete client complete.",
  industrialNotes: "GDLS, US Army, depot industriel US, Honeywell, fournisseurs electroniques et munitions.",
  costNotes: "Cout a lire via FMS : chars, kits, munitions, soutien, formation, pieces, depannage.",
  exportNotes: "FMS tres structurant ; contraintes US fortes sur reexport, soutien et munitions.",
  cost:
    "Abrams SEPv3 illustre le cout complet lourd : turbine, carburant, pieces, depot maintenance, munitions, simulateurs, depannage et support FMS.",
  finance:
    "Les ventes FMS agregent plateformes, services, munitions et soutien ; le montant annonce n'est pas un prix unitaire simple.",
  supplyChain:
    "La chaine US apporte profondeur et standardisation, mais cree une dependance forte au soutien americain.",
  geopolitics:
    "Acheter Abrams ancre un client dans l'architecture industrielle et diplomatique americaine.",
  export:
    "Le FMS donne un cadre lisible mais contraignant : autorisations, configuration, soutien, munitions et reexport.",
  costFrame: "FMS : plateformes + munitions + soutien + pieces + formation + depannage",
  financeFrame: "US Army, lignes de modernisation et ventes FMS",
  industrialFrame: "GDLS, US Army depots, turbine, electronique, munitions US",
  exportFrame: "FMS et restrictions americaines",
  operators: ["Etats-Unis", "Australie", "Pologne", "Roumanie", "Clients FMS"],
  theatres: ["Amerique du Nord", "Europe", "Indo-Pacifique", "Moyen-Orient"],
  timeline: [
    { date: "2010s", label: "Modernisation publique vers M1A2 SEPv3.", kind: "jalon" },
    { date: "2020s", label: "Nouvelles approbations FMS et livraisons clients.", kind: "export" },
  ],
  sources: [
    {
      id: "gdls-abrams",
      title: "Abrams main battle tank",
      publisher: "General Dynamics Land Systems",
      type: "constructeur",
      reliability: "B",
      url: "https://www.gdls.com/abrams-main-battle-tank/",
    },
    {
      id: "dsca-abrams",
      title: "Abrams foreign military sales notifications",
      publisher: "DSCA",
      type: "officiel",
      reliability: "A",
      url: "https://www.dsca.mil/",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : le cout Abrams serait un prix de char. La realite : le FMS vend surtout un ecosysteme de soutien.",
    bestUseCase:
      "Comparer dependance industrielle, MCO et FMS sans juger l'efficacite militaire.",
    weakPoint:
      "Les packages FMS melangent beaucoup de lignes, rendant les prix unitaires trompeurs.",
    analystNote:
      "Abrams est une lecon de cout de possession : le soutien compte autant que la plateforme.",
  },
  scores: scoreSet("A", "A", "B", "B"),
});

export const k2BlackPanther = makeArmoredSystem({
  slug: "k2-black-panther",
  name: "K2 Black Panther",
  designation: "Hyundai Rotem K2",
  reference: "PNP-ARM-004",
  classLabel: "Char de bataille principal nouveau standard",
  country: "Coree du Sud",
  flag: "KR",
  manufacturer: "Hyundai Rotem",
  introduced: "2010s",
  status: "En service en Coree du Sud et succes export majeur, notamment avec adaptation polonaise K2PL.",
  acquisitionModes: ["production-nationale", "DCS"],
  tagline:
    "Le MBT exportable a grande vitesse industrielle : production sud-coreenne, localisation, powerpack et souverainete client.",
  summary:
    "K2 Black Panther est analyse comme offre industrielle agile : production sud-coreenne, contrats export, adaptation locale, powerpack, munitions, MCO et transfert industriel. La fiche ne compare pas l'emploi tactique.",
  family: "MBT",
  programStatus: "new-standard",
  crew: "3 personnes",
  loading: "automatic",
  mainGun: "120 mm lisse public",
  secondary: ["Armement secondaire public"],
  ammunitionFamilies: ["120 mm OTAN / coreen selon autorisations"],
  ammunitionPerimeter: "Familles publiques ; pas de donnees d'effet ou tables.",
  passiveProtection: "Protection composite et modulaire selon sources publiques.",
  modularProtection: "Adaptations client, dont configuration K2PL a suivre.",
  apsStatus: "planned",
  apsName: "APS selon configurations futures / clients",
  crewSurvivabilityNotes: "Chargeur automatique et architecture a trois personnes traites comme choix industriel.",
  powerpack: "Powerpack coreen / allemand selon lots et maturite publique.",
  transmission: "Transmission selon configuration et industrialisation.",
  mobilityNotes: "Mobilite lue par powerpack, fiabilite, maintenance et localisation.",
  vetronics: "Suite electronique et capteurs Hyundai Rotem selon configuration publique.",
  c2: "Integration nationale ou client, notamment europeenne selon contrats.",
  mcoNotes: "MCO et formation lies a la montee en production et a la localisation client.",
  recoverySupport: "Vehicules de soutien et depannage a inclure dans les packages.",
  modernizationNotes: "Evolutions K2 et K2PL selon client.",
  localProductionNotes: "Transfert industriel et production locale importants dans le cas polonais.",
  industrialNotes: "Hyundai Rotem, ecosysteme sud-coreen, partenaires locaux et powerpack.",
  costNotes: "Cout public a distinguer entre lots initiaux, localisation et soutien.",
  exportNotes: "Fort potentiel export, avec offsets et production locale comme argument central.",
  cost:
    "K2 doit etre lu par lots : vehicules, munitions, formation, support, localisation, chaines polonaises et adaptation client.",
  finance:
    "La dynamique export coreenne combine financement, delai, industrialisation locale et volume.",
  supplyChain:
    "La supply chain sud-coreenne est robuste mais certains lots et powerpacks imposent de distinguer contenu local, import et maturite.",
  geopolitics:
    "K2 illustre l'arrivee de la Coree du Sud comme fournisseur terrestre majeur en Europe.",
  export:
    "L'export est structurant : localisation, offsets, licences et soutien long terme dominent la comparaison.",
  costFrame: "Plateformes + localisation + munitions + soutien + formation + adaptation client",
  financeFrame: "Commandes coreennes, export Pologne et financements client",
  industrialFrame: "Hyundai Rotem, ecosysteme coreen, partenaires locaux, powerpack",
  exportFrame: "Contrats commerciaux et production locale selon client",
  operators: ["Coree du Sud", "Pologne"],
  theatres: ["Asie du Nord-Est", "Europe", "Marches export"],
  timeline: [
    { date: "2010s", label: "Mise en service du K2 en Coree du Sud.", kind: "jalon" },
    { date: "2022", label: "Contrats polonais donnant au K2 une visibilite export majeure.", kind: "export" },
  ],
  sources: [
    {
      id: "hyundai-rotem-k2",
      title: "K2 Main Battle Tank",
      publisher: "Hyundai Rotem",
      type: "constructeur",
      reliability: "B",
      url: "https://www.hyundai-rotem.co.kr/en/",
    },
    {
      id: "poland-k2",
      title: "Polish K2 procurement public releases",
      publisher: "Ministere de la Defense nationale de Pologne",
      type: "institution",
      reliability: "B",
      url: "https://www.gov.pl/web/national-defence",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : K2 serait seulement un char moderne. La realite : son interet vient aussi des delais, de la production et de la localisation.",
    bestUseCase:
      "Comparer export industriel, offsets et montee de cadence.",
    weakPoint:
      "Les variantes clients et powerpacks imposent une lecture par lot, pas par nom.",
    analystNote:
      "K2 donne a Panoplie un excellent dossier de geopolitique industrielle.",
  },
  scores: scoreSet("B", "B", "A", "B"),
});

export const challenger3 = makeArmoredSystem({
  slug: "challenger-3",
  name: "Challenger 3",
  designation: "Modernisation britannique du Challenger 2",
  reference: "PNP-ARM-005",
  classLabel: "Char de bataille principal modernise",
  country: "Royaume-Uni",
  flag: "GB",
  manufacturer: "Rheinmetall BAE Systems Land",
  introduced: "2020s",
  status: "Programme de modernisation britannique vers un nouveau standard, avec tourelle et canon lisse.",
  acquisitionModes: ["production-nationale", "cooperatif"],
  tagline:
    "Le choix britannique de renovation profonde : tourelle, canon lisse, supply chain RBSL, Trophy et volume de parc limite.",
  summary:
    "Challenger 3 est traite comme renovation lourde d'un parc reduit. Panoplie suit le standard, la tourelle, le canon lisse, l'APS, les munitions, RBSL, le MCO britannique et le risque de volume.",
  family: "MBT",
  programStatus: "modernized",
  crew: "4 personnes",
  loading: "manual",
  mainGun: "120 mm lisse Rheinmetall L55A1 public",
  secondary: ["Armement secondaire public selon standard"],
  ammunitionFamilies: ["120 mm OTAN selon politique britannique"],
  ammunitionPerimeter: "Standard 120 mm public ; pas de donnees d'effet.",
  passiveProtection: "Protection modulaire et survivabilite modernisees selon programme.",
  modularProtection: "Nouvelle tourelle et kits selon standard Challenger 3.",
  apsStatus: "planned",
  apsName: "Trophy annonce / integre selon programme public",
  crewSurvivabilityNotes: "APS, tourelle et blindage sont lus par cout et integration.",
  powerpack: "Powerpack Challenger modernise / soutenu par chaine britannique.",
  transmission: "Soutien de parc limite.",
  mobilityNotes: "Mobilite traitee via MCO, masse et disponibilite.",
  vetronics: "Nouveaux capteurs et architecture electronique selon programme.",
  c2: "Integration britannique et OTAN.",
  mcoNotes: "MCO d'un parc reduit, avec enjeu de pieces, atelier et maintien de competence.",
  recoverySupport: "Soutien lourd britannique et depannage a inclure.",
  modernizationNotes: "Renovation profonde Challenger 2 vers Challenger 3.",
  localProductionNotes: "RBSL Telford et chaine britannique/europeenne.",
  industrialNotes: "RBSL, Rheinmetall, BAE Systems, fournisseurs britanniques et allemands.",
  costNotes: "Cout programme a lire comme renovation lourde de parc limite.",
  exportNotes: "Export non central ; programme national britannique.",
  cost:
    "Challenger 3 met en evidence le cout de moderniser un petit parc : nouvelle tourelle, canon, APS, vetronique, munitions, essais et MCO.",
  finance:
    "Le financement protege une competence terrestre britannique tout en limitant le volume modernise.",
  supplyChain:
    "La chaine RBSL combine base britannique et composants Rheinmetall, avec enjeu de volume et pieces.",
  geopolitics:
    "Challenger 3 maintient le Royaume-Uni dans le club MBT, en lien etroit avec l'industrie allemande.",
  export:
    "La fiche n'est pas export-first ; elle documente plutot souverainete, modernisation et dependances.",
  costFrame: "Renovation parc + tourelle + canon + APS + essais + MCO",
  financeFrame: "Programme national britannique a volume limite",
  industrialFrame: "RBSL, Rheinmetall, BAE Systems, fournisseurs UK/DE",
  exportFrame: "Export secondaire, autorisations britanniques si besoin",
  operators: ["Royaume-Uni"],
  theatres: ["Europe", "OTAN"],
  timeline: [
    { date: "2021", label: "Attribution publique du programme Challenger 3.", kind: "jalon" },
    { date: "2020s", label: "Essais, prototypes et preparation de production.", kind: "jalon" },
  ],
  sources: [
    {
      id: "rheinmetall-challenger-3",
      title: "Challenger 3",
      publisher: "Rheinmetall",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rheinmetall.com/en/products/tactical-vehicles/tracked-vehicles/challenger-3",
    },
    {
      id: "uk-mod-challenger-3",
      title: "Challenger 3 programme updates",
      publisher: "UK Ministry of Defence",
      type: "institution",
      reliability: "B",
      url: "https://www.gov.uk/government/organisations/ministry-of-defence",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un petit parc serait moins complexe. La realite : le volume limite peut rencherir MCO, pieces et maintien de competence.",
    bestUseCase:
      "Etudier le cout d'une renovation lourde face a une acquisition neuve.",
    weakPoint:
      "Le programme depend d'un calendrier de qualification et d'un parc limite.",
    analystNote:
      "Challenger 3 est une fiche de politique industrielle autant que de blindage.",
  },
  scores: scoreSet("B", "B", "C", "C"),
});

export const merkavaMk4mBarak = makeArmoredSystem({
  slug: "merkava-mk4m-barak",
  name: "Merkava Mk 4M / Barak",
  designation: "Famille Merkava recente avec Trophy",
  reference: "PNP-ARM-006",
  classLabel: "Char de bataille principal national",
  country: "Israel",
  flag: "IL",
  manufacturer: "IMOD / industriels israeliens",
  introduced: "2000s-2020s",
  status: "Char national israelien, modernise avec Trophy et standard Barak selon sources publiques.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Un char national comme ecosysteme : Trophy, industrie locale, numerique embarque, MCO et transparence partielle.",
  summary:
    "Merkava Mk 4M / Barak est documente comme programme national israelien avec forte integration locale. Panoplie retient Trophy, vetronique, soutien, souverainete et export indirect, sans discuter d'emploi tactique.",
  family: "MBT",
  programStatus: "modernized",
  crew: "4 personnes selon sources publiques",
  loading: "manual",
  mainGun: "120 mm lisse public",
  secondary: ["Armement secondaire public non detaille"],
  ammunitionFamilies: ["120 mm", "munitions nationales selon sources publiques"],
  ammunitionPerimeter: "Munitions citees au niveau famille ; details d'effet exclus.",
  passiveProtection: "Protection nationale et architecture Merkava selon sources publiques.",
  modularProtection: "Kits et modernisations nationales.",
  apsStatus: "integrated",
  apsName: "Trophy",
  crewSurvivabilityNotes: "Trophy est lu comme composant industriel et exportable, pas comme conseil d'emploi.",
  powerpack: "Powerpack et maintenance dans l'ecosysteme israelien.",
  transmission: "Soutien national.",
  mobilityNotes: "Mobilite lue par soutien et contraintes de parc national.",
  vetronics: "Standard Barak : numerique embarque, capteurs et interfaces selon annonces publiques.",
  c2: "Integration C2 nationale israelienne.",
  mcoNotes: "MCO national, soutien en cycle long et retours publics partiels.",
  recoverySupport: "Vehicules et soutien israeliens a integrer.",
  modernizationNotes: "Passage Mk 4M / Barak et upgrades numeriques.",
  localProductionNotes: "Ecosysteme israelien, Rafael, Elbit, IAI et industriels locaux selon sous-systemes.",
  industrialNotes: "IMOD, Rafael pour Trophy, Elbit et base industrielle israelienne.",
  costNotes: "Couts publics fragmentaires ; privilegier programme, APS et soutien.",
  exportNotes: "Merkava peu exporte ; Trophy est exporte comme sous-systeme majeur.",
  cost:
    "Merkava se lit moins par prix public que par ecosysteme national : production, Trophy, sous-systemes, MCO et modernisations.",
  finance:
    "Le financement est national et lie aux priorites israeliennes de souverainete terrestre.",
  supplyChain:
    "La chaine israelienne est integree, avec Trophy comme sous-systeme exportable et visible.",
  geopolitics:
    "Merkava illustre une doctrine industrielle nationale : produire, moderniser et exporter certains sous-systemes plutot que la plateforme.",
  export:
    "La plateforme est peu exportee, mais Trophy structure un marche APS mondial ; Panoplie reste au niveau regime et industrie.",
  costFrame: "Programme national + Trophy + vetronique + MCO + modernisations",
  financeFrame: "Financement national israelien",
  industrialFrame: "IMOD, Rafael, Elbit, industriels israeliens",
  exportFrame: "Plateforme peu exportee ; Trophy exportable selon licences",
  operators: ["Israel"],
  theatres: ["Moyen-Orient", "Parc national"],
  timeline: [
    { date: "2000s", label: "Mise en service publique du Merkava Mk 4.", kind: "jalon" },
    { date: "2010s", label: "Integration publique de Trophy sur Merkava Mk 4M.", kind: "jalon" },
    { date: "2020s", label: "Mise en avant du standard Barak.", kind: "jalon" },
  ],
  sources: [
    {
      id: "rafael-trophy-merkava",
      title: "Trophy Active Protection System",
      publisher: "Rafael",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rafael.co.il/system/trophy-aps/",
    },
    {
      id: "imod-merkava",
      title: "Merkava Barak public updates",
      publisher: "Israel Ministry of Defense",
      type: "institution",
      reliability: "C",
      url: "https://www.mod.gov.il/",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : Merkava serait seulement un char national atypique. La realite : c'est aussi une plateforme de maturation pour Trophy et la vetronique israelienne.",
    bestUseCase:
      "Lire souverainete, APS et export de sous-systemes.",
    weakPoint:
      "Couts et details de configuration restent moins transparents que dans certains programmes OTAN.",
    analystNote:
      "Merkava donne a Panoplie un cas ou la valeur export se trouve davantage dans les briques que dans la coque.",
  },
  scores: scoreSet("C", "B", "C", "B"),
});

export const type10Tank = makeArmoredSystem({
  slug: "type-10",
  name: "Type 10",
  designation: "Japanese Type 10 main battle tank",
  reference: "PNP-ARM-007",
  classLabel: "Char de bataille principal national",
  country: "Japon",
  flag: "JP",
  manufacturer: "Mitsubishi Heavy Industries",
  introduced: "2010s",
  status: "Char japonais recent, concu pour besoins nationaux et contraintes de mobilite/infrastructure.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Le MBT comme compromis national : parc japonais, industrie MHI, logistique, munitions et export tres limite.",
  summary:
    "Type 10 est traite comme choix industriel japonais : format plus compact, industrie nationale, soutien, C4I et contraintes export. Les caracteristiques restent au niveau public et non operationnel.",
  family: "MBT",
  programStatus: "new-standard",
  crew: "3 personnes",
  loading: "automatic",
  mainGun: "120 mm lisse public",
  secondary: ["Armement secondaire public"],
  ammunitionFamilies: ["120 mm japonais / OTAN selon sources publiques"],
  ammunitionPerimeter: "Familles publiques ; pas de tables ni effets.",
  passiveProtection: "Protection modulaire publique selon sources japonaises.",
  modularProtection: "Modules de protection selon configuration.",
  apsStatus: "none-public",
  crewSurvivabilityNotes: "Architecture et protection analysees sans conclusion tactique.",
  powerpack: "Powerpack diesel national selon sources publiques.",
  transmission: "Transmission nationale et soutien MHI.",
  mobilityNotes: "Mobilite lue comme adaptation aux infrastructures japonaises et au MCO.",
  vetronics: "C4I et electronique embarquee nationales.",
  c2: "Integration aux reseaux terrestres japonais.",
  mcoNotes: "MCO national sur parc limite, pieces et production MHI.",
  recoverySupport: "Soutien terrestre japonais a integrer au cout complet.",
  modernizationNotes: "Standard recent avec evolutions nationales a suivre.",
  localProductionNotes: "Production nationale Mitsubishi Heavy Industries.",
  industrialNotes: "MHI, JGSDF, base industrielle japonaise.",
  costNotes: "Couts publics dependants des budgets japonais et du volume limite.",
  exportNotes: "Export tres limite par politique et marche ; surtout souverainete nationale.",
  cost:
    "Type 10 met en avant un cout de souverainete : production nationale, parc limite, soutien et adaptation aux contraintes japonaises.",
  finance:
    "Le financement est national, lie aux arbitrages de defense japonais et au maintien de competence terrestre.",
  supplyChain:
    "La chaine MHI offre controle national mais volume reduit et exposition a sous-traitants specialises.",
  geopolitics:
    "Type 10 illustre l'autonomie japonaise dans un environnement Indo-Pacifique tendu, sans logique export massive.",
  export:
    "La dimension export reste marginale ; Panoplie retient surtout contraintes politiques et industrielles.",
  costFrame: "Production nationale + MCO + munitions + pieces + soutien",
  financeFrame: "Budget defense japonais et commandes nationales",
  industrialFrame: "MHI, JGSDF, fournisseurs japonais",
  exportFrame: "Export non central, politique japonaise prudente",
  operators: ["Japon"],
  theatres: ["Japon", "Indo-Pacifique"],
  timeline: [
    { date: "2010", label: "Presentation publique et entree progressive du Type 10.", kind: "jalon" },
    { date: "2020s", label: "Poursuite du parc et des budgets japonais de defense terrestre.", kind: "jalon" },
  ],
  sources: [
    {
      id: "mod-japan-type10",
      title: "Type 10 tank public programme material",
      publisher: "Japan Ministry of Defense",
      type: "institution",
      reliability: "B",
      url: "https://www.mod.go.jp/en/",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un char national sans export serait secondaire. La realite : il revele une strategie d'autonomie industrielle.",
    bestUseCase:
      "Comparer souverainete, volume et cout de parc national.",
    weakPoint:
      "La documentation publique anglaise reste limitee et les couts doivent etre recoupes.",
    analystNote:
      "Type 10 aide Panoplie a montrer qu'un MBT peut etre surtout une reponse industrielle nationale.",
  },
  scores: scoreSet("B", "B", "D", "B"),
});

export const altay = makeArmoredSystem({
  slug: "altay",
  name: "Altay",
  designation: "Turkish main battle tank programme",
  reference: "PNP-ARM-008",
  classLabel: "Char de bataille principal programme national",
  country: "Turquie",
  flag: "TR",
  manufacturer: "BMC / SSB",
  introduced: "2020s",
  status: "Programme turc de MBT avec enjeu de powerpack, production locale et montee en maturite.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Un programme de souverainete : powerpack, production turque, transferts initiaux et risque de calendrier.",
  summary:
    "Altay est documente comme programme national encore sensible a la maturite industrielle. Panoplie suit powerpack, production locale, cout, calendrier, MCO et sources, sans extrapoler la performance.",
  family: "MBT",
  programStatus: "future-program",
  crew: "4 personnes selon sources publiques",
  loading: "manual",
  mainGun: "120 mm lisse public",
  secondary: ["Armement secondaire public"],
  ammunitionFamilies: ["120 mm selon integration turque et fournisseurs"],
  ammunitionPerimeter: "Familles publiques ; pas de donnees d'effet.",
  passiveProtection: "Protection modulaire revendiquee par sources turques.",
  modularProtection: "Kits nationaux selon maturite.",
  apsStatus: "planned",
  apsName: "AKKOR / solutions turques selon sources publiques",
  crewSurvivabilityNotes: "APS traite comme dependance industrielle a maturer.",
  powerpack: "Powerpack turc / import selon etape programme, point critique public.",
  transmission: "Transmission et integration powerpack a suivre.",
  mobilityNotes: "Mobilite lue par maturite du powerpack et MCO.",
  vetronics: "Vetronique nationale turque selon programme.",
  c2: "Integration aux reseaux turcs.",
  mcoNotes: "MCO a construire avec production locale, pieces et formation.",
  recoverySupport: "Soutien et depannage a documenter dans les futurs lots.",
  modernizationNotes: "Programme en maturation, standards successifs probables.",
  localProductionNotes: "Production locale turque et souverainete industrielle.",
  industrialNotes: "BMC, SSB, Aselsan, Roketsan, ecosysteme turc et question powerpack.",
  costNotes: "Couts publics incertains ; distinguer developpement, serie, powerpack et soutien.",
  exportNotes: "Potentiel export lie a maturite, licences et contenu local.",
  cost:
    "Altay doit etre lu comme cout de souverainete : developpement, powerpack, industrialisation, serie, MCO et soutien.",
  finance:
    "Le financement porte une ambition nationale turque de reduire les dependances dans le terrestre lourd.",
  supplyChain:
    "La chaine progresse mais le powerpack reste le point public a surveiller pour maturite et calendrier.",
  geopolitics:
    "Altay s'inscrit dans la montee de l'industrie turque de defense et son ambition export.",
  export:
    "Le potentiel export dependra de la maturite, du contenu national et des licences ; aucune strategie de contournement n'est fournie.",
  costFrame: "Developpement + powerpack + production serie + MCO + soutien",
  financeFrame: "Programme national turc et industrialisation locale",
  industrialFrame: "BMC, SSB, Aselsan, Roketsan, powerpack et fournisseurs turcs",
  exportFrame: "Export potentiel sous autorisations turques et contraintes de composants",
  operators: ["Turquie"],
  theatres: ["Turquie", "Marches export potentiels"],
  timeline: [
    { date: "2010s", label: "Developpement public du programme Altay.", kind: "jalon" },
    { date: "2020s", label: "Premiers lots et maturation industrielle annonces publiquement.", kind: "jalon" },
  ],
  sources: [
    {
      id: "bmc-altay",
      title: "Altay Main Battle Tank",
      publisher: "BMC",
      type: "constructeur",
      reliability: "C",
      url: "https://www.bmc.com.tr/en",
    },
    {
      id: "ssb-altay",
      title: "Turkish defence industry programme releases",
      publisher: "SSB",
      type: "institution",
      reliability: "C",
      url: "https://www.ssb.gov.tr/",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : annoncer un char national suffit. La realite : powerpack, production, MCO et serie font la maturite.",
    bestUseCase:
      "Suivre risque industriel, souverainete et calendrier.",
    weakPoint:
      "La transparence sur couts, lots et powerpack reste partielle.",
    analystNote:
      "Altay est un dossier de transition : ambition claire, execution a recouper.",
  },
  scores: scoreSet("C", "C", "B", "C"),
});

export const t90m = makeArmoredSystem({
  slug: "t-90m",
  name: "T-90M",
  designation: "Russian T-90M Proryv",
  reference: "PNP-ARM-009",
  classLabel: "Char de bataille principal modernise",
  country: "Russie",
  flag: "RU",
  manufacturer: "Uralvagonzavod",
  introduced: "2010s-2020s",
  status: "Modernisation russe, documentation publique a recouper avec forte prudence de source.",
  acquisitionModes: ["production-nationale", "DCS"],
  tagline:
    "Un dossier a forte incertitude : modernisation, production russe, sanctions, export et sources contradictoires.",
  summary:
    "T-90M est conserve dans Panoplie pour lire une famille russe modernisee, mais avec prudence elevee. Les claims portent sur industrie, sanctions, export, MCO et transparence, pas sur efficacite ou emploi.",
  family: "MBT",
  programStatus: "modernized",
  crew: "3 personnes selon sources publiques",
  loading: "automatic",
  mainGun: "125 mm lisse public",
  secondary: ["Armement secondaire public non detaille"],
  ammunitionFamilies: ["125 mm russe selon sources publiques"],
  ammunitionPerimeter: "Familles publiques ; effets, vulnerabilites et emploi exclus.",
  passiveProtection: "Protection et blindage reactif revendiques par sources russes / secondaires.",
  modularProtection: "Kits modernises selon lot.",
  apsStatus: "unknown",
  crewSurvivabilityNotes: "Claims de protection a recouper fortement.",
  powerpack: "Motorisation diesel russe selon sources publiques.",
  transmission: "Chaine russe, impact sanctions et pieces a surveiller.",
  mobilityNotes: "Mobilite non comparee ; Panoplie retient production, soutien et pieces.",
  vetronics: "Optiques et electronique modernisees selon sources a recouper.",
  c2: "Integration russe, details non exploites.",
  mcoNotes: "MCO affecte par guerre, sanctions, pertes et cadence industrielle, chiffres a recouper.",
  recoverySupport: "Soutien russe non detaille.",
  modernizationNotes: "Modernisation de famille T-90.",
  localProductionNotes: "Production russe Uralvagonzavod.",
  industrialNotes: "Uralvagonzavod, fournisseurs russes, sanctions et import-substitution.",
  costNotes: "Couts publics peu fiables ; eviter toute precision non sourciee.",
  exportNotes: "Export historique de la famille T-90, mais contexte sanctions modifie les regimes.",
  cost:
    "T-90M impose une discipline de source : couts, cadence, pertes et production sont variables et souvent politises.",
  finance:
    "Le financement releve du budget russe et de la priorite a la production de guerre, avec faible transparence.",
  supplyChain:
    "La chaine russe est contrainte par sanctions, optiques, electronique et capacites de reconstitution.",
  geopolitics:
    "Le T-90M est un indicateur de capacite industrielle russe et de contraintes export sous sanctions.",
  export:
    "Panoplie decrit les regimes et incertitudes ; aucune aide a contourner sanctions ou export controls.",
  costFrame: "Production / modernisation + pieces + optiques + soutien, chiffres a recouper",
  financeFrame: "Budget russe et production de guerre peu transparents",
  industrialFrame: "Uralvagonzavod, fournisseurs russes, sanctions, import-substitution",
  exportFrame: "Export sous sanctions et controles, prudence maximale",
  operators: ["Russie", "Clients T-90 selon sources publiques"],
  theatres: ["Eurasie", "Marches export historiques"],
  timeline: [
    { date: "2010s", label: "Modernisation publique de la famille T-90 vers T-90M.", kind: "jalon" },
    { date: "2020s", label: "Production et emploi public dans le contexte de guerre, donnees a recouper.", kind: "debat" },
  ],
  sources: [
    {
      id: "uvz-t90m",
      title: "T-90M public manufacturer material",
      publisher: "Uralvagonzavod",
      type: "constructeur",
      reliability: "C",
    },
    {
      id: "iiss-russia-armour",
      title: "Russian armour industrial assessments",
      publisher: "IISS / open-source assessments",
      type: "think-tank",
      reliability: "C",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : les chiffres russes seraient directement comparables. La realite : le contexte exige un fort recoupement.",
    bestUseCase:
      "Tester la matrice de confiance et les limites de preuve.",
    weakPoint:
      "Sources politisees, sanctions, pertes et cadence rendent le dossier fragile.",
    analystNote:
      "T-90M doit afficher l'incertitude : c'est sa valeur dans Panoplie.",
  },
  scores: scoreSet("C", "B", "D", "D"),
});

export const t14Armata = makeArmoredSystem({
  slug: "t-14-armata",
  name: "T-14 Armata",
  designation: "Russian future MBT programme",
  reference: "PNP-ARM-010",
  classLabel: "Programme MBT a transparence reduite",
  country: "Russie",
  flag: "RU",
  manufacturer: "Uralvagonzavod",
  introduced: "Programme public depuis 2010s",
  status: "Programme futur / faible transparence, volumes et maturite a recouper.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Un cas de prudence : programme ambitieux, claims publics, volumes incertains et faible transparence.",
  summary:
    "T-14 Armata est traite comme programme et non comme parc mature. Panoplie retient ambition industrielle, statut public, couts incertains, chaine russe et limites de preuve.",
  family: "program",
  programStatus: "low-transparency",
  crew: "3 personnes selon claims publics",
  loading: "automatic",
  mainGun: "125 mm public selon sources russes",
  secondary: ["Armement secondaire public non detaille"],
  ammunitionFamilies: ["125 mm russe selon claims publics"],
  ammunitionPerimeter: "Claims publics a recouper ; aucune exploitation technique.",
  passiveProtection: "Architecture de protection revendiquee, transparence reduite.",
  modularProtection: "Kits et APS revendiques, maturite a recouper.",
  apsStatus: "planned",
  apsName: "Afghanit revendique publiquement",
  crewSurvivabilityNotes: "Capsule equipage revendiquee comme architecture publique, sans analyse de vulnerabilite.",
  powerpack: "Powerpack public a recouper, enjeu de maturite.",
  transmission: "Non detaillee au niveau exploitable.",
  mobilityNotes: "Mobilite non evaluee ; seule maturite programme est suivie.",
  vetronics: "Vetronique revendiquee, sources a recouper.",
  c2: "Integration russe non exploitee.",
  mcoNotes: "MCO inconnu a grande echelle ; absence de parc mature public.",
  recoverySupport: "Soutien a documenter si production de serie confirmee.",
  modernizationNotes: "Programme futur / demonstrateur selon etat public.",
  localProductionNotes: "Production russe potentielle, volumes incertains.",
  industrialNotes: "Uralvagonzavod, base industrielle russe, financement et maturite a recouper.",
  costNotes: "Couts publics tres incertains ; ne pas comparer comme char en service massif.",
  exportNotes: "Export hypothese publique, non prioritaire et sous sanctions.",
  cost:
    "T-14 Armata est un dossier de programme : R&D, industrialisation, volumes, couts et maturite sont plus importants que les claims techniques.",
  finance:
    "La transparence budgetaire est faible ; le financement doit etre lu par priorites russes et contraintes industrielles.",
  supplyChain:
    "La chaine depend d'une base russe sous sanctions et d'une industrialisation dont le volume public reste incertain.",
  geopolitics:
    "Armata est un symbole de modernisation militaire russe, mais la preuve publique de maturite reste limitee.",
  export:
    "Panoplie ne traite pas de contournement export ; le contexte sanctions impose une prudence maximale.",
  costFrame: "R&D + industrialisation + volumes incertains + soutien non mature",
  financeFrame: "Financement russe peu transparent",
  industrialFrame: "Uralvagonzavod, chaine russe, sanctions, maturite incertaine",
  exportFrame: "Export hypothetique, sanctions et controle a recouper",
  operators: ["Russie (statut public a recouper)"],
  theatres: ["Programme national", "Domaine informationnel"],
  timeline: [
    { date: "2015", label: "Presentation publique d'Armata.", kind: "jalon" },
    { date: "2020s", label: "Debats publics sur volumes, maturite et priorites industrielles.", kind: "debat" },
  ],
  sources: [
    {
      id: "uvz-armata",
      title: "Armata public manufacturer material",
      publisher: "Uralvagonzavod",
      type: "constructeur",
      reliability: "C",
    },
    {
      id: "thinktank-armata",
      title: "Armata programme open-source assessments",
      publisher: "Think-tank / open-source assessments",
      type: "think-tank",
      reliability: "C",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un demonstrateur public vaut parc mature. La realite : volumes, MCO et industrialisation font la difference.",
    bestUseCase:
      "Afficher une fiche programme a transparence reduite.",
    weakPoint:
      "Faible verification publique des volumes, couts et maturite.",
    analystNote:
      "Armata doit rester une fiche de prudence methodologique.",
  },
  scores: scoreSet("C", "D", "D", "D"),
});

export const type99a = makeArmoredSystem({
  slug: "type-99a",
  name: "Type 99A",
  designation: "Chinese Type 99A main battle tank",
  reference: "PNP-ARM-011",
  classLabel: "Char de bataille principal a transparence reduite",
  country: "Chine",
  flag: "CN",
  manufacturer: "NORINCO / industrie chinoise",
  introduced: "2010s",
  status: "Char chinois moderne, sources publiques limitees et forte prudence de transparence.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "Un dossier de transparence reduite : industrie chinoise, parc national, export indirect et claims publics a recouper.",
  summary:
    "Type 99A est integre pour couvrir le haut de gamme chinois, mais la fiche reste prudente. Panoplie suit famille, industrie, MCO, couts non transparents et sources, sans extrapoler.",
  family: "MBT",
  programStatus: "low-transparency",
  crew: "3 personnes selon sources publiques",
  loading: "automatic",
  mainGun: "125 mm lisse public",
  secondary: ["Armement secondaire public non detaille"],
  ammunitionFamilies: ["125 mm chinois selon sources publiques"],
  ammunitionPerimeter: "Claims publics ; pas de donnees d'effet.",
  passiveProtection: "Protection composite/modulaire revendiquee par sources publiques.",
  modularProtection: "Kits nationaux a recouper.",
  apsStatus: "unknown",
  crewSurvivabilityNotes: "Dossier a transparence reduite : ne pas deduire de vulnerabilites.",
  powerpack: "Powerpack chinois selon sources publiques, details a recouper.",
  transmission: "Non detaillee au niveau public fiable.",
  mobilityNotes: "Mobilite traitee par maturite industrielle et soutien, pas par usage.",
  vetronics: "Capteurs et electronique revendiques, a recouper.",
  c2: "Integration PLA non detaillee.",
  mcoNotes: "MCO national peu documente publiquement.",
  recoverySupport: "Soutien chinois non detaille.",
  modernizationNotes: "Evolution du parc chinois a suivre par sources publiques.",
  localProductionNotes: "Production nationale chinoise.",
  industrialNotes: "NORINCO et base industrielle chinoise, transparence limitee.",
  costNotes: "Couts publics fragmentaires ou absents.",
  exportNotes: "Type 99A non central a l'export ; autres familles chinoises davantage exportees.",
  cost:
    "Type 99A est surtout un dossier de limites de preuve : couts, volumes, MCO et sous-systemes sont peu transparents.",
  finance:
    "Le financement releve de budgets chinois peu detaillees publiquement.",
  supplyChain:
    "La chaine chinoise est nationale mais opaque pour composants, powerpack et electronique.",
  geopolitics:
    "Type 99A signale l'autonomie industrielle chinoise dans les plateformes lourdes.",
  export:
    "Panoplie documente le regime et les limites ; aucune interpretation de transfert ou contournement.",
  costFrame: "Couts publics non homogenes ; suivre parc, MCO et industrialisation",
  financeFrame: "Budget national chinois peu transparent",
  industrialFrame: "NORINCO, base industrielle chinoise, sous-systemes peu publics",
  exportFrame: "Export secondaire, transparence reduite",
  operators: ["Chine"],
  theatres: ["Chine", "Indo-Pacifique"],
  timeline: [
    { date: "2010s", label: "Visibilite publique du Type 99A dans le parc chinois.", kind: "jalon" },
    { date: "2020s", label: "Claims publics et observations ouvertes a recouper.", kind: "debat" },
  ],
  sources: [
    {
      id: "norinco-type99a",
      title: "Type 99A public manufacturer and parade references",
      publisher: "NORINCO / sources publiques",
      type: "constructeur",
      reliability: "C",
    },
    {
      id: "iiss-china-armour",
      title: "Chinese armour open-source assessments",
      publisher: "IISS / open-source assessments",
      type: "think-tank",
      reliability: "C",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : l'opacite permettrait d'ignorer le systeme. La realite : elle doit etre affichee comme information.",
    bestUseCase:
      "Documenter une capacite majeure avec confiance reduite.",
    weakPoint:
      "Peu de sources primaires exploitables et couts publics faibles.",
    analystNote:
      "Type 99A est une fiche de methodologie : dire ce qu'on ne sait pas est aussi utile.",
  },
  scores: scoreSet("C", "B", "D", "D"),
});

export const kf51Panther = makeArmoredSystem({
  slug: "kf51-panther",
  name: "KF51 Panther",
  designation: "Rheinmetall future MBT demonstrator",
  reference: "PNP-ARM-012",
  classLabel: "Programme / demonstrateur MBT",
  country: "Allemagne",
  flag: "DE",
  manufacturer: "Rheinmetall",
  introduced: "2020s",
  status: "Demonstrateur / programme propose, a distinguer d'un parc en service.",
  acquisitionModes: ["DCS", "cooperatif"],
  tagline:
    "Un demonstrateur comme signal industriel : canon, numerique, architecture equipage, export potentiel et maturite a verifier.",
  summary:
    "KF51 Panther est retenu comme fiche programme plutot qu'Ariete C2 afin de couvrir une proposition industrielle future. Panoplie traite maturite, couts, supply chain, export et limites de preuve, pas des performances d'emploi.",
  family: "program",
  programStatus: "future-program",
  crew: "Architecture equipage revendiquee publiquement, a recouper",
  loading: "automatic",
  mainGun: "130 mm public revendique par Rheinmetall",
  secondary: ["Sous-systemes publics selon demonstrateur"],
  ammunitionFamilies: ["130 mm Rheinmetall selon programme", "familles futures a qualifier"],
  ammunitionPerimeter:
    "Famille future/demonstrateur ; aucune donnee d'effet, table ou optimisation.",
  ammunitionCaution:
    "Un demonstrateur ne doit pas etre compare comme systeme mature en service.",
  passiveProtection: "Protection modulaire revendiquee au niveau concept.",
  modularProtection: "Architecture modulaire et options selon proposition industrielle.",
  apsStatus: "planned",
  apsName: "APS / hard-kill soft-kill selon concept public",
  crewSurvivabilityNotes: "Architecture a lire comme proposition industrielle, non comme preuve operationnelle.",
  powerpack: "Powerpack selon integration future, non fige publiquement.",
  transmission: "A definir selon client / programme.",
  mobilityNotes: "Mobilite non evaluee ; maturite programme prioritaire.",
  vetronics: "Architecture numerique et capteurs proposes par Rheinmetall.",
  c2: "Integration future selon client.",
  mcoNotes: "MCO non mature ; dependra de client, production et standard retenu.",
  recoverySupport: "Soutien a definir si programme lance.",
  modernizationNotes: "Demonstrateur pouvant servir de base a programme client.",
  localProductionNotes: "Cooperation et production locale possibles selon contrat.",
  industrialNotes: "Rheinmetall, ecosysteme allemand/europeen, nouveaux effecteurs et electronique.",
  costNotes: "Pas de cout de parc mature ; distinguer demonstrateur, developpement et serie.",
  exportNotes: "Positionne export / cooperation, mais maturite et regimes a verifier.",
  cost:
    "KF51 Panther ne doit pas etre lu comme prix de char en service : le cout pertinent est celui du developpement, de la qualification, de la serie et du soutien futur.",
  finance:
    "Le financement dependra d'un client lanceur ou d'une cooperation ; Panoplie le suit comme option industrielle future.",
  supplyChain:
    "La proposition Rheinmetall mobilise canon, munitions futures, electronique, protection et integration encore a stabiliser.",
  geopolitics:
    "KF51 signale la competition intra-europeenne autour du futur MBT et de l'apres-Leopard.",
  export:
    "L'export est potentiel, non acquis ; toute lecture doit separer marketing, contrat et qualification.",
  costFrame: "Demonstrateur + developpement + qualification + serie future + MCO non mature",
  financeFrame: "Client lanceur / cooperation a confirmer",
  industrialFrame: "Rheinmetall, canon 130 mm, munitions futures, electronique, protection",
  exportFrame: "Offre export/cooperation, maturite et licences a verifier",
  operators: ["Aucun parc mature public"],
  theatres: ["Programme industriel", "Marches export potentiels"],
  timeline: [
    { date: "2022", label: "Presentation publique du demonstrateur KF51 Panther.", kind: "jalon" },
    { date: "2020s", label: "Discussions industrielles et export potentielles a suivre.", kind: "debat" },
  ],
  sources: [
    {
      id: "rheinmetall-kf51",
      title: "Panther KF51 main battle tank",
      publisher: "Rheinmetall",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rheinmetall.com/en/products/tactical-vehicles/tracked-vehicles/panther-kf51",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un demonstrateur annonce remplace un programme. La realite : qualification, client et soutien restent a construire.",
    bestUseCase:
      "Lire signaux industriels, export potentiel et maturite programme.",
    weakPoint:
      "Peu de donnees de cout, pas de parc en service et forte composante marketing.",
    analystNote:
      "KF51 est utile si Panoplie le garde comme programme, pas comme systeme mature.",
  },
  scores: scoreSet("B", "D", "B", "C"),
});
