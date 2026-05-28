import type { DefenseSystem } from "../types";

export const kurfs: DefenseSystem = {
  slug: "kurfs",
  name: "KuRFS",
  designation: "Ku-band Radio Frequency System",
  reference: "PNP-RD-015",
  category: "radar",
  radarRole: "cuas",
  classLabel:
    "Radar AESA bande Ku C-UAS — détection, suivi et fire control contre drones et menaces RAM",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "RTX (Raytheon)",
  introduced: "2018 (déploiement opérationnel initial)",
  status:
    "En service — utilisé par l'US Army et l'US Marine Corps, déployé en théâtre, intégré au système Coyote anti-drone et à plusieurs architectures C-UAS alliées",
  acquisitionModes: ["FMS"],
  tagline:
    "Le radar bande Ku qui voit les drones — résolution fine, mobilité tactique, intégration native avec l'intercepteur Coyote, conçu pour le combat de la décennie 2020.",
  summary:
    "Le KuRFS est le radar AESA bande Ku conçu par RTX pour la détection, le suivi et la fire control contre les menaces drones, roquettes, artillerie et mortier (C-UAS / C-RAM). Sa bande Ku donne une résolution fine qui permet de distinguer de très petites cibles à courte et moyenne portée, dans des contextes encombrés (zones urbaines, théâtres saturés de signaux). Il est intégré nativement à l'intercepteur Coyote anti-drone de RTX et à plusieurs architectures C-UAS américaines.\n\nLa fiche KuRFS est, pour Panoplie, celle du capteur C-UAS le plus opérationnellement éprouvé. Sa diffusion post-2020, en particulier dans les théâtres du Moyen-Orient et du Pacifique, documente concrètement la montée en puissance de la lutte anti-drone comme nouvelle mission radar à part entière — distincte des architectures GBAD classiques.",
  keySpecs: [
    {
      label: "Architecture",
      value:
        "AESA bande Ku — panneau compact rotatif ou fixe selon variante, modules T/R GaN",
      confidence: "haute",
      sources: ["rtx-kurfs"],
    },
    {
      label: "Mission principale",
      value:
        "C-UAS (Counter-Unmanned Aerial Systems), C-RAM (Counter-Rocket, Artillery, Mortar)",
      confidence: "haute",
      sources: ["rtx-kurfs"],
    },
    {
      label: "Avantage bande Ku",
      value:
        "Résolution fine permettant de distinguer de petites cibles (drones < 25 kg) à courte / moyenne portée",
      confidence: "haute",
      sources: ["rtx-kurfs"],
    },
    {
      label: "Intégration intercepteur",
      value:
        "Native avec Coyote (anti-drone RTX) ; intégré à des architectures C-UAS américaines (LIDS, MFIX, etc.)",
      confidence: "haute",
      sources: ["rtx-kurfs", "us-army-cuas"],
    },
    {
      label: "Mobilité",
      value:
        "Tactique — déployable sur véhicule léger ou shelter, opérationnel rapidement",
      confidence: "haute",
      sources: ["rtx-kurfs"],
    },
    {
      label: "Portée et détection",
      value:
        "Non publiée précisément ; capacité à détecter drones de classe 1-3 à plusieurs kilomètres, selon configuration",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["rtx-kurfs"],
    },
    {
      label: "Technologie RF",
      value:
        "Modules T/R GaN — RTX intégration verticale microélectronique",
      confidence: "haute",
      sources: ["rtx-kurfs", "rtx-microelectronics"],
    },
    {
      label: "PRF, formes d'onde, ECCM précis",
      value: "Non précisé publiquement",
      confidence: "faible",
      status: "variable",
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût KuRFS n'est pas publié de façon homogène par RTX. Les ordres de grandeur estimés tournent autour de 5-15 M$ par capteur intégré, avec une variabilité forte selon la configuration et le lot logistique. Pour les architectures C-UAS complètes — capteur + intercepteurs Coyote + C2 + soutien — les contrats US Army / USMC documentés atteignent des centaines de millions de dollars.\n\nLa lecture coût C-UAS est structurellement différente des grands GBAD : le rapport coût-effet se mesure face à des menaces très bon marché (drones FPV à quelques centaines de dollars, drones Shahed à quelques dizaines de milliers). Un Coyote à environ 100 k$ contre un drone Shahed à 50 k$ pose une équation économique débattue, et reste plus favorable qu'un Patriot à plusieurs millions contre la même menace.",
      indicators: [
        {
          label: "Coût unitaire capteur — estimation publique",
          value: "≈ 5 à 15 M$ par capteur intégré selon configuration",
          confidence: "faible",
          status: "variable",
          sources: ["us-army-cuas"],
        },
        {
          label: "Coût Coyote intercepteur",
          value: "≈ 100 k$ par intercepteur (estimation analyste publique)",
          confidence: "moyenne",
          status: "a-recouper",
          sources: ["press-cuas-cost"],
        },
        {
          label: "Équation coût-effet C-UAS",
          value:
            "Plus favorable qu'un Patriot face à la même menace, mais asymétrique face aux drones FPV à coût marginal",
          confidence: "moyenne",
          sources: ["press-cuas-cost"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le programme KuRFS est financé principalement par l'US Army et l'US Marine Corps au titre des programmes C-UAS post-2018, en réponse directe à la montée en puissance de la menace drone documentée en Irak, en Syrie, en Ukraine et au Moyen-Orient. Le programme s'inscrit dans l'effort plus large de l'US Joint C-UAS Office (JCO).\n\nLes notifications FMS récentes confirment l'intérêt export — partenaires du Moyen-Orient, partenaires européens en évaluation. La montée en cadence de production est documentée chez RTX, dans un contexte de demande mondiale en forte croissance post-2022 (Ukraine, Israël, Moyen-Orient).",
      indicators: [
        {
          label: "Financeurs principaux",
          value:
            "US Army (JCO), US Marine Corps — programmes C-UAS post-2018",
          confidence: "haute",
          sources: ["us-army-cuas"],
        },
        {
          label: "Pistes export documentées",
          value:
            "Partenaires Moyen-Orient (UAE, Arabie saoudite en discussion) ; partenaires européens en évaluation",
          confidence: "moyenne",
          sources: ["press-cuas-cost"],
        },
        {
          label: "Effet post-2022",
          value:
            "Forte accélération de la demande mondiale C-UAS — Ukraine, Israël, Moyen-Orient",
          confidence: "haute",
          sources: ["press-cuas-cost"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne KuRFS est entièrement américaine, intégrée par RTX avec intégration verticale GaN. Les modules T/R bande Ku, le packaging RF, les calculateurs DSP et le logiciel sont produits sous contrôle RTX. C'est une déclinaison de l'effort de souveraineté microélectronique RF du constructeur, dans la lignée de SPY-6 et LTAMDS.\n\nLe risque industriel principal est celui de la cadence : la demande C-UAS mondiale a explosé post-2022, et RTX doit tenir le rythme tout en livrant SPY-6, LTAMDS et autres grands programmes. La pression sur les semiconducteurs RF avancés est partagée avec ces programmes.",
      indicators: [
        {
          label: "Empreinte industrielle",
          value:
            "RTX intégration verticale — chaîne entièrement américaine",
          confidence: "haute",
          sources: ["rtx-kurfs", "rtx-microelectronics"],
        },
        {
          label: "Technologie RF",
          value: "GaN bande Ku intégration verticale RTX — souveraineté composants",
          confidence: "haute",
          sources: ["rtx-microelectronics"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Cadence face à la demande C-UAS mondiale post-2022 ; pression composants RF partagée avec SPY-6 et LTAMDS",
          confidence: "moyenne",
          sources: ["rtx-kurfs"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le KuRFS porte la doctrine C-UAS américaine post-Irak / post-Ukraine. Adopter KuRFS, c'est s'inscrire dans l'écosystème C-UAS RTX (Coyote, intégrations LIDS, MFIX) et accepter la dépendance baseline et mise à jour bibliothèques anti-drone. Cet écosystème devient structurant pour les forces alliées confrontées à la menace drone.\n\nL'enjeu géopolitique du C-UAS est nouveau dans l'IAMD : il transforme la défense aérienne tactique en couche additionnelle face à des menaces très bon marché et très saturantes. Pour Panoplie, KuRFS documente concrètement cette nouvelle couche, et la position dominante américaine sur les capteurs C-UAS haut de gamme.",
      indicators: [
        {
          label: "Position stratégique",
          value:
            "Pilier de la doctrine C-UAS américaine post-Irak / post-Ukraine",
          confidence: "haute",
          sources: ["us-army-cuas"],
        },
        {
          label: "Écosystème dépendant",
          value:
            "Couplage natif avec Coyote, intégration LIDS / MFIX — alignement opérationnel US implicite",
          confidence: "haute",
          sources: ["rtx-kurfs"],
        },
        {
          label: "Régime applicable",
          value: "ITAR — capteur sensible sous contrôle Department of State",
          confidence: "haute",
          sources: ["itar-radar"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export KuRFS suit le modèle FMS, avec contrôle ITAR sur la couche capteur et l'intégration Coyote. Les premiers clients export documentés sont des partenaires moyen-orientaux et des forces alliées du Pacifique. Les discussions européennes sont à un stade variable.\n\nLe régime applicable est ITAR au niveau standard pour les capteurs RF tactiques, avec une couche additionnelle pour les algorithmes de classification anti-drone particulièrement sensibles. L'exportabilité reste modérée — un cercle d'alliés stratégiques, et chaque transfert s'inscrit dans la coopération C-UAS plus large.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value: "FMS — couplé à l'export Coyote et aux architectures C-UAS US",
          confidence: "haute",
          sources: ["us-army-cuas"],
        },
        {
          label: "Pistes export documentées",
          value:
            "Partenaires Moyen-Orient (UAE, Arabie saoudite en discussion), partenaires Pacifique, partenaires européens en évaluation",
          confidence: "moyenne",
          sources: ["press-cuas-cost"],
        },
        {
          label: "Régime applicable",
          value:
            "ITAR — couche capteur + couche algorithmes anti-drone classifiés",
          confidence: "haute",
          sources: ["itar-radar"],
        },
      ],
    },
  ],
  integrationFrameworks: [
    "Coyote (RTX anti-drone)",
    "LIDS (Low, Slow, Small Unmanned Aircraft Integrated Defeat System)",
    "MFIX (Multi-Mission Launcher)",
    "US Joint C-UAS Office",
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Coût modéré pour un AESA bande Ku ; équation coût-effet structurellement asymétrique face aux drones FPV à coût marginal.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Mobilité tactique forte, agilité de faisceau AESA, signature compacte ; ECCM précis classifiés.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "ITAR niveau standard, couche algorithmes classifiée — accès limité au cercle d'alliés stratégiques ; demande mondiale forte mais cadence US limitante.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne RTX maîtrisée, mais cadence partagée avec d'autres grands programmes et demande mondiale post-2022 en forte croissance.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "En service opérationnel depuis 2018, employé en théâtre (Moyen-Orient notamment), production active ; périmètre fonctionnel continu en consolidation.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources RTX et US Army abondantes sur le rôle et l'architecture, mais paramètres techniques fins et algorithmes anti-drone classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un radar qui « tue tous les drones ». La réalité : un excellent capteur C-UAS bande Ku dont la performance dépend autant de l'algorithmique de classification, de l'intégration Coyote et du C2 que de l'antenne. Face aux drones FPV à coût marginal, l'équation économique reste asymétrique.",
    bestUseCase:
      "Doter une force alliée d'une capacité C-UAS de classe US, intégrée à l'écosystème Coyote / LIDS, conçue pour les théâtres saturés et les menaces drone de classe 1-3.",
    weakPoint:
      "Le couplage natif avec Coyote et l'ITAR sur les algorithmes de classification — adopter KuRFS sans l'écosystème C-UAS US complet a peu de sens opérationnel. Et la pression industrielle américaine sur les composants RF avancés.",
    analystNote:
      "KuRFS documente, pour Panoplie, l'émergence de la couche C-UAS comme nouveau pilier de l'IAMD tactique post-2022. Sa fiche est l'archétype d'une menace devenue centrale en quelques années, et d'une réponse industrielle américaine qui se consolide rapidement. À suivre de près sur la décennie.",
  },
  operators: [
    "États-Unis (US Army — JCO, US Marine Corps)",
    "Pistes export — partenaires Moyen-Orient, Pacifique et Europe en évaluation",
  ],
  theatres: [
    "Moyen-Orient — déploiement opérationnel US contre menaces drones documenté post-2020",
    "Théâtre américain — protection de bases et de troupes en posture forward",
    "Ukraine — engagements indirects via partenaires C-UAS US",
  ],
  timeline: [
    {
      date: "2018",
      label:
        "Déploiement opérationnel initial — premier emploi US Army en théâtre.",
      kind: "jalon",
    },
    {
      date: "2021",
      label:
        "Intégration officielle au système LIDS — architecture C-UAS multicouche US Army.",
      kind: "jalon",
    },
    {
      date: "2022",
      label:
        "Accélération de la production — réponse à la montée en puissance de la menace drone post-Ukraine.",
      kind: "jalon",
    },
    {
      date: "2023",
      label:
        "Engagements opérationnels documentés au Moyen-Orient — démonstrations contre drones Shahed et menaces RAM.",
      kind: "emploi",
    },
    {
      date: "2025",
      label:
        "Pistes export multiples — partenaires Moyen-Orient et Pacifique en discussion.",
      kind: "export",
    },
  ],
  sources: [
    {
      id: "rtx-kurfs",
      title: "KuRFS — page produit RTX",
      publisher: "RTX (Raytheon)",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rtx.com/raytheon/what-we-do/integrated-air-and-missile-defense/kurfs",
    },
    {
      id: "us-army-cuas",
      title:
        "US Joint C-UAS Office — programmes et architectures C-UAS",
      publisher: "US Army Joint C-UAS Office (JCO)",
      type: "officiel",
      reliability: "A",
      url: "https://www.army.mil/",
    },
    {
      id: "rtx-microelectronics",
      title: "RTX Microelectronics — intégration verticale GaN",
      publisher: "RTX (Raytheon)",
      type: "constructeur",
      reliability: "B",
      url: "https://www.rtx.com/raytheon/what-we-do/advanced-technology/microelectronics",
    },
    {
      id: "press-cuas-cost",
      title:
        "Coyote et équation coût-effet C-UAS — analyses publiques et presse spécialisée",
      publisher: "Think tanks et presse spécialisée défense",
      type: "think-tank",
      reliability: "B",
    },
    {
      id: "itar-radar",
      title:
        "International Traffic in Arms Regulations — 22 CFR 121 USML Category XI",
      publisher: "U.S. Department of State — DDTC",
      type: "officiel",
      reliability: "A",
      url: "https://www.pmddtc.state.gov/",
    },
  ],
  updated: "2026-05-27",
};
