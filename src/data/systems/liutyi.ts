import type { DefenseSystem } from "../types";

export const liutyi: DefenseSystem = {
  slug: "liutyi",
  name: "AN-196 Liutyi",
  designation: "AN-196 Liutyi",
  reference: "PNP-DR-015",
  category: "drone",
  droneClass: "munition-rodeuse",
  classLabel: "Munition rôdeuse longue portée",
  country: "Ukraine",
  flag: "🇺🇦",
  manufacturer: "Antonov / Ukroboronprom",
  introduced: "2023",
  status: "En service — production série cofinancée",
  acquisitionModes: ["production-nationale"],
  tagline:
    "La réponse ukrainienne au Shahed iranien — un drone d'attaque qui frappe les raffineries russes à 1 700 kilomètres sans rien devoir aux missiles occidentaux.",
  summary:
    "Le Liutyi (Лютий, « le féroce ») d'Antonov et d'Ukroboronprom n'est pas une copie : c'est une riposte industrielle. Lancé en développement en octobre 2022, quelques mois après le début des frappes massives de Shahed-136 iraniens sur l'Ukraine, ce drone d'attaque à sens unique reprend l'idée adverse — une architecture d'avion simple, un moteur thermique, une charge militaire modeste, une portée stratégique — pour la retourner contre son émetteur : les raffineries, l'infrastructure énergétique et les bases aériennes russes en profondeur.\n\nMise en service en 2023, frappes confirmées jusqu'à 1 700 km en février 2026, production série financée par l'Allemagne à hauteur de 500 unités à l'été 2025 : le Liutyi est devenu l'instrument d'une démonstration politique autant que militaire. Le comprendre, c'est saisir comment Kyiv s'est doté d'une capacité de frappe stratégique conventionnelle propre — plus chère que le Shahed, mais plus précise, et surtout affranchie du veto occidental sur l'emploi des missiles de croisière à longue portée.",
  keySpecs: [
    {
      label: "Masse",
      value: "250–300 kg",
      confidence: "moyenne",
      sources: ["militarnyi"],
    },
    {
      label: "Dimensions",
      value: "Longueur 4,4 m · envergure 6,7 m",
      confidence: "moyenne",
      sources: ["militarnyi"],
    },
    {
      label: "Charge militaire",
      value: "50–75 kg",
      confidence: "moyenne",
      note: "Valeur de 75 kg confirmée fin 2024 par Militarnyi ; fourchette selon les lots.",
      sources: ["militarnyi"],
    },
    {
      label: "Portée",
      value: "> 1 000 km — frappes confirmées à 1 400 et 1 700 km",
      confidence: "faible",
      status: "a-recouper",
      note: "Portées de frappe issues de revendications de temps de guerre, à recouper par imagerie indépendante.",
      sources: ["militarnyi", "die-welt"],
    },
    {
      label: "Motorisation",
      value: "Moteur thermique HIRTH Engines F23 (Allemagne)",
      confidence: "moyenne",
      sources: ["arms-monitor"],
    },
    {
      label: "Guidage",
      value: "Hybride inertiel + satellite, corrigeable en vol",
      confidence: "moyenne",
      note: "Résistance accrue au brouillage revendiquée ; guidage terminal par caméra évoqué côté ukrainien.",
      sources: ["militarnyi"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le Liutyi se situe sur un segment de prix intermédiaire que la guerre d'Ukraine a rendu lisible. Estimé à environ 200 000 $ l'unité par Ukraine's Arms Monitor en 2025, il coûte près de quatre fois le prix d'un Shahed-136 (~50 000 $) et presque autant qu'un drone d'attaque ukrainien comparable comme le FP-1 (~55 000 $). Mais il reste très en deçà du coût d'un missile de croisière, qui se chiffre en millions — c'est dans cet écart que se loge sa rationalité économique.\n\nCe surcoût face au Shahed n'est pas un défaut de conception : il achète de la précision. Là où le drone iranien mise sur la saturation et un coût quasi nul, le Liutyi vise des cibles ponctuelles — une colonne de distillation, un parc de stockage — et son guidage terminal par caméra justifie un investissement par tir plus élevé. L'estimation à 200 000 $ repose toutefois sur une source unique : elle donne un ordre de grandeur, pas un prix de catalogue, et la production série a pu en faire évoluer la structure.",
      indicators: [
        {
          label: "Coût unitaire estimé",
          value: "≈ 200 000 $",
          confidence: "moyenne",
          status: "a-recouper",
          note: "Estimation de source unique (Ukraine's Arms Monitor, 2025) ; ordre de grandeur.",
          sources: ["arms-monitor"],
        },
        {
          label: "Comparaison Shahed-136",
          value: "≈ 4× le coût du Shahed (~50 000 $)",
          confidence: "moyenne",
          sources: ["arms-monitor"],
        },
        {
          label: "Comparaison missile de croisière",
          value: "Très inférieur — missile de croisière chiffré en millions",
          confidence: "moyenne",
          sources: ["arms-monitor"],
        },
        {
          label: "Logique de coût",
          value: "Surcoût vs Shahed compensé par la précision (guidage terminal)",
          confidence: "faible",
          sources: ["arms-monitor", "militarnyi"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Liutyi a d'abord été un programme intégralement national : développement et premiers lots financés par l'État ukrainien, dans l'urgence de répliquer aux frappes de Shahed. Cette logique de financement souverain en temps de guerre a permis une mise en service rapide dès 2023, sans dépendre d'un calendrier d'aide étrangère.\n\nLe tournant intervient en juillet 2025, lorsque l'Allemagne annonce le cofinancement de la production série — 500 unités, pour une « somme à neuf chiffres en euros » selon Die Welt. Ce basculement transforme le modèle économique du drone : il sécurise une cadence de série qu'un budget de guerre ukrainien seul peinait à garantir, et il fait du Liutyi un objet de financement croisé entre Kyiv et Berlin, avec les sensibilités politiques que cela emporte.",
      indicators: [
        {
          label: "Financement initial",
          value: "État ukrainien — développement et premiers lots",
          confidence: "moyenne",
          sources: ["militarnyi"],
        },
        {
          label: "Cofinancement série",
          value: "Allemagne — 500 unités (annonce juillet 2025)",
          confidence: "moyenne",
          sources: ["die-welt"],
        },
        {
          label: "Montant allemand",
          value: "« Somme à neuf chiffres en € » (Die Welt)",
          confidence: "faible",
          status: "a-recouper",
          note: "Ordre de grandeur de presse, non chiffré précisément ni confirmé officiellement.",
          sources: ["die-welt"],
        },
        {
          label: "Modèle de financement",
          value: "National à l'origine, devenu croisé Ukraine–Allemagne",
          confidence: "moyenne",
          sources: ["die-welt"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du Liutyi est largement ukrainienne : Antonov ASTC assure la maîtrise d'œuvre, Ukroboronprom coordonne, et un réseau de sous-traitants nationaux fournit la cellule et l'intégration. C'est une chaîne pensée pour la résilience en temps de guerre — production dispersée, dépendances réduites au strict nécessaire, capacité à encaisser les frappes russes sur les sites industriels.\n\nElle conserve néanmoins un point de vulnérabilité assumé : le moteur. Le Liutyi vole avec un thermique HIRTH F23 importé d'Allemagne, maillon que l'industrie ukrainienne ne fabrique pas en propre. Ce composant critique relève de la réglementation d'export allemande — une dépendance à la fois technique et politique, qui place une partie de la cadence de production du drone hors du contrôle souverain de Kyiv.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Antonov ASTC — cellule et intégration",
          confidence: "moyenne",
          sources: ["militarnyi"],
        },
        {
          label: "Coordination industrielle",
          value: "Ukroboronprom + sous-traitants ukrainiens",
          confidence: "moyenne",
          sources: ["militarnyi"],
        },
        {
          label: "Dépendance critique",
          value: "Moteur HIRTH F23 importé d'Allemagne",
          confidence: "moyenne",
          note: "Composant clé sous régime d'export allemand — point de sensibilité réglementaire.",
          sources: ["arms-monitor"],
        },
        {
          label: "Résilience",
          value: "Production dispersée, conçue pour le temps de guerre",
          confidence: "faible",
          sources: ["militarnyi"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Liutyi porte un message politique précis : l'Ukraine peut frapper la profondeur stratégique russe sans missile occidental. Tant que l'emploi des Storm Shadow/SCALP et des ATACMS est resté soumis à l'arbitrage — souvent restrictif — de Londres, Paris et Washington, Kyiv a disposé avec ce drone d'un moyen entièrement souverain, libre de tout veto extérieur sur le choix des cibles.\n\nCette autonomie a une portée stratégique réelle. En visant les raffineries, l'industrie de défense et les bases aériennes russes en profondeur, le Liutyi déplace la guerre sur le territoire de l'agresseur et impose un coût économique direct à Moscou. Il démontre qu'une capacité de frappe stratégique conventionnelle n'est plus le monopole des grandes puissances dotées de missiles de croisière : elle peut être bâtie à bas coût, dans l'urgence, par un État en guerre.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Frappe en profondeur affranchie du veto occidental",
          confidence: "moyenne",
          sources: ["arms-monitor"],
        },
        {
          label: "Alternative aux missiles",
          value: "Complément souverain à Storm Shadow/SCALP et ATACMS",
          confidence: "moyenne",
          sources: ["arms-monitor"],
        },
        {
          label: "Effet recherché",
          value: "Coût économique imposé à la Russie (raffinage, défense, bases)",
          confidence: "faible",
          status: "a-recouper",
          note: "Effet stratégique revendiqué ; mesure d'impact dépendante d'évaluations de temps de guerre.",
          sources: ["arms-monitor", "die-welt"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Liutyi n'a pas été formellement exporté : il est produit pour les seules forces armées ukrainiennes, sous régime de contrôle ukrainien, et la priorité absolue reste l'emploi national en temps de guerre. Aucune campagne commerciale, aucun client tiers identifié.\n\nLa question de l'exportabilité n'est pourtant pas vierge. Le cofinancement allemand de la production série crée déjà un lien capitalistique étranger, et le drone intègre un composant critique — le moteur HIRTH F23 — soumis à la réglementation d'export allemande. Toute diffusion future du système se heurterait donc à une double contrainte : le régime ukrainien d'une part, la sensibilité allemande sur ce moteur d'autre part. L'exportabilité est, à ce stade, théorique et étroitement encadrée.",
      indicators: [
        {
          label: "Statut export",
          value: "Aucun — production réservée aux forces ukrainiennes",
          confidence: "moyenne",
          sources: ["militarnyi"],
        },
        {
          label: "Régime applicable",
          value: "Contrôle d'export ukrainien",
          confidence: "moyenne",
          sources: ["arms-monitor"],
        },
        {
          label: "Contrainte composant",
          value: "Moteur HIRTH F23 sous réglementation d'export allemande",
          confidence: "moyenne",
          sources: ["arms-monitor"],
        },
        {
          label: "Financement étranger",
          value: "Cofinancement allemand en place — lien capitalistique existant",
          confidence: "faible",
          sources: ["die-welt"],
        },
      ],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "À environ 200 000 $ l'unité, le Liutyi est bien plus cher qu'un Shahed mais sa précision et sa portée le rendent rentable face à un missile de croisière chiffré en millions : un compromis coût-effet solide.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Guidage hybride résistant au brouillage et frappes confirmées en profondeur, mais drone à hélice lent et non furtif, vulnérable à la défense sol-air et à la chasse russes ; l'attrition réelle reste mal documentée.",
    },
    {
      key: "exportabilite",
      grade: "D",
      rationale:
        "Aucun export formel, production réservée à l'Ukraine, et le moteur HIRTH F23 soumis au contrôle allemand verrouille toute diffusion : exportabilité théorique et fortement contrainte.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Chaîne majoritairement ukrainienne et résiliente, mais dépendante d'un moteur importé d'Allemagne et exposée aux frappes russes sur les sites de production : le risque est réel mais maîtrisé.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "En service depuis 2023, employé en continu sur la profondeur russe et désormais en production série cofinancée : système opérationnel éprouvé, sans le recul d'un parc stabilisé en temps de paix.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Caractéristiques cohérentes entre sources, mais les portées de frappe, l'impact stratégique et le coût reposent sur des revendications de temps de guerre ou des estimations à source unique.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : le Liutyi est une simple copie ukrainienne du Shahed-136. La réalité : il en partage le concept — drone d'attaque à sens unique, moteur thermique, portée stratégique — mais il joue une partition différente. Quatre fois plus cher que le Shahed, il mise sur la précision plutôt que sur la saturation, vise des cibles ponctuelles et non des quartiers, et constitue pour Kyiv une capacité de frappe souveraine, pas un consommable de masse.",
    bestUseCase:
      "La frappe de précision contre des cibles stratégiques russes en grande profondeur — raffineries, parcs de stockage, industrie de défense, bases aériennes — là où un drone à bas coût mais guidé permet d'imposer un coût économique direct sans engager de missile de croisière ni dépendre d'une autorisation d'emploi occidentale.",
    weakPoint:
      "La survivabilité face à une défense aérienne dense. Drone lent, à hélice et non furtif, le Liutyi est interceptable par la chasse et le sol-air russes ; son efficacité tient à la masse des tirs et à la dégradation de la défense adverse, plus qu'à une capacité de pénétration intrinsèque. Sa dépendance à un moteur allemand ajoute une fragilité réglementaire.",
    analystNote:
      "Le Liutyi se juge moins à sa fiche technique qu'à ce qu'il prouve : un État en guerre peut bâtir, dans l'urgence et à bas coût, une capacité de frappe stratégique conventionnelle qui ne doit rien aux missiles occidentaux. L'évaluation OSINT lui reconnaît un succès opérationnel — une part majeure des perturbations du raffinage russe en 2024-2025 lui est attribuée — mais ce chiffre, comme les portées de 1 400 et 1 700 km, relève d'évaluations de temps de guerre largement alimentées par des sources ukrainiennes : à recouper. En 2026, le drone a passé l'épreuve du feu et celle de la série ; sa trajectoire dépendra de la cadence de production cofinancée et de la capacité russe à muscler sa défense en profondeur.",
  },
  operators: [
    "Forces armées ukrainiennes — 1er Centre des Unmanned Systems Forces",
  ],
  theatres: [
    "Russie continentale — raffineries (Riazan, Saratov, raffinerie de Moscou)",
    "Bases aériennes russes (Mozdok — Tu-22M3 et MiG-31)",
    "Sites industriels de défense (usine Kupol, Ijevsk — production de Tor-M)",
    "Plateforme pétrolière Lukoil en mer Caspienne",
  ],
  timeline: [
    {
      date: "2022-10",
      label:
        "Lancement du développement par Ukroboronprom et Antonov, en réponse aux frappes de Shahed-136 iraniens.",
      kind: "jalon",
    },
    {
      date: "2023",
      label: "Mise en service du AN-196 Liutyi au sein des forces armées ukrainiennes.",
      kind: "jalon",
    },
    {
      date: "2024-03",
      label: "Frappe revendiquée contre la raffinerie de Riazan (source ukrainienne, à recouper).",
      kind: "emploi",
    },
    {
      date: "2024-06",
      label:
        "Frappe revendiquée contre la base aérienne de Mozdok, visant des Tu-22M3 et MiG-31 (à recouper).",
      kind: "emploi",
    },
    {
      date: "2025-07",
      label:
        "L'Allemagne annonce le cofinancement de la production série — 500 unités.",
      kind: "jalon",
    },
    {
      date: "2025-07",
      label:
        "Frappe revendiquée à 1 400 km contre l'usine Kupol à Ijevsk, productrice de systèmes Tor-M (à recouper).",
      kind: "emploi",
    },
    {
      date: "2026-02",
      label: "Frappe revendiquée à 1 700 km contre Oukhta — portée maximale signalée (à recouper).",
      kind: "emploi",
    },
  ],
  sources: [
    {
      id: "militarnyi",
      title: "AN-196 Liutyi — caractéristiques et emploi opérationnel",
      publisher: "Militarnyi",
      type: "presse",
      reliability: "B",
    },
    {
      id: "arms-monitor",
      title: "Ukraine's Arms Monitor — drones d'attaque longue portée ukrainiens",
      publisher: "Ukraine's Arms Monitor",
      type: "think-tank",
      reliability: "B",
      date: "2025",
    },
    {
      id: "die-welt",
      title: "Cofinancement allemand de la production série du Liutyi",
      publisher: "Die Welt",
      type: "presse",
      reliability: "B",
      date: "2025-07",
    },
    {
      id: "ukroboronprom",
      title: "Programme de drones d'attaque — communication industrielle",
      publisher: "Ukroboronprom / Antonov ASTC",
      type: "constructeur",
      reliability: "C",
    },
    {
      id: "iiss-mb",
      title: "The Military Balance",
      publisher: "IISS",
      type: "institution",
      reliability: "A",
    },
  ],
  updated: "2026-05-21",
};
