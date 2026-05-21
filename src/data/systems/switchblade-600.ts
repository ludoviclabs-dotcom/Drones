import type { DefenseSystem } from "../types";

export const switchblade600: DefenseSystem = {
  slug: "switchblade-600",
  name: "AeroVironment Switchblade 600",
  reference: "PNP-DR-012",
  category: "drone",
  droneClass: "munition-rodeuse",
  classLabel: "Munition rôdeuse",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "AeroVironment",
  introduced: "2021",
  status: "En service — production active",
  acquisitionModes: ["FMS"],
  tagline:
    "La munition rôdeuse qui porte une charge de classe Javelin dans un tube — la réponse américaine aux limites de son propre Switchblade 300.",
  summary:
    "Le Switchblade 600 d'AeroVironment est l'archétype occidental de la munition rôdeuse anti-blindage. Lancé d'un tube, transportable à dos d'homme, il fusionne deux objets longtemps distincts : le drone tactique qui rôde et observe, et le missile antichar qui frappe. Sa singularité tient à sa charge militaire — de classe Javelin — qui le place sur le créneau du char de combat, là où son petit prédécesseur, le Switchblade 300, ne pouvait viser que le fantassin et le véhicule léger.\n\nLe comprendre, c'est saisir un arbitrage doctrinal en cours. Le 300, entré en service en 2011 et largement livré à l'Ukraine, y a déçu : vulnérable à la guerre électronique russe, sous-armé contre les blindés, et bien plus cher que les drones FPV ukrainiens. L'US Army avait un temps renoncé à en commander avant de signer, en octobre 2024, un contrat-cadre d'environ 990 M$ couvrant les deux variantes. Le 600 est désormais l'axe principal : il doit prouver que la munition rôdeuse « catalogue » américaine garde un sens face à des drones bricolés à quelques milliers de dollars.",
  keySpecs: [
    {
      label: "Masse",
      value: "≈ 15 kg (33 lb)",
      confidence: "haute",
      note: "Le Switchblade 300, prédécesseur, ne pèse que ≈ 2,5 kg.",
      sources: ["av-switchblade"],
    },
    {
      label: "Portée",
      value: "≈ 40–90 km (25–56 mi)",
      confidence: "moyenne",
      sources: ["av-switchblade"],
    },
    {
      label: "Endurance",
      value: "≥ 40 min",
      confidence: "moyenne",
      note: "Autorise une longue phase de rôdage avant l'engagement.",
      sources: ["av-switchblade"],
    },
    {
      label: "Vitesse",
      value: "≈ 110–185 km/h (70–115 mph)",
      confidence: "moyenne",
      sources: ["av-switchblade"],
    },
    {
      label: "Charge militaire",
      value: "Charge anti-blindage de classe Javelin",
      confidence: "moyenne",
      note: "Argument central du 600 : viser le char, là où le 300 se limitait aux cibles légères.",
      sources: ["av-switchblade", "warzone-cost"],
    },
    {
      label: "Lancement",
      value: "Tube — transportable et déployable par une équipe légère",
      confidence: "haute",
      sources: ["av-switchblade"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le Switchblade 600 coûte plus de 100 000 $ le coup, charge militaire comprise. Le chiffre n'est pas anodin : il fait du 600 une munition de prix, à mi-chemin entre le drone consommable et le missile guidé léger. Le point de comparaison le plus instructif est son propre prédécesseur — le Switchblade 300 était budgété à environ 58 000 $ le coup en FY22, 53 000 $ en FY23, et son coût « tout compris » avec lanceur a été estimé à près de 80 000 $ par The War Zone.\n\nLa vraie tension de coût n'est pas avec le missile, mais avec le bas du spectre. En Ukraine, les drones FPV qui détruisent des blindés se chiffrent entre 700 et 4 000 $ environ. Face à eux, le ratio d'échange du Switchblade — payer plus de 100 000 $ pour neutraliser une cible qu'un drone à 2 000 $ peut parfois atteindre — est un point faible structurel, que la fiche assume : le 600 monnaie une charge de classe Javelin, une portée et une fiabilité industrielle, pas un coût d'attrition compétitif.",
      indicators: [
        {
          label: "Coût unitaire (Switchblade 600)",
          value: "> 100 000 $ le coup",
          confidence: "moyenne",
          status: "a-recouper",
          note: "Ordre de grandeur public ; pas de grille tarifaire détaillée par le constructeur.",
          sources: ["warzone-cost", "av-switchblade"],
        },
        {
          label: "Référence — Switchblade 300",
          value: "≈ 58 000 $ (FY22) · ≈ 53 000 $ (FY23) ; ≈ 80 000 $ tout compris",
          confidence: "moyenne",
          note: "Coûts budgétaires DoD et estimation lanceur compris de The War Zone.",
          sources: ["warzone-cost", "iiss-mb"],
        },
        {
          label: "Ratio d'échange de coût",
          value: "Très défavorable face aux drones FPV (≈ 700–4 000 $)",
          confidence: "moyenne",
          status: "a-recouper",
          note: "Comparaison analytique issue du retour d'expérience ukrainien.",
          sources: ["warzone-cost"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le financement du Switchblade suit deux canaux. Côté américain, il relève des budgets du DoD : un contrat SOCOM de 26,1 M$ en mars 2021 pour le 600, puis un contrat-cadre majeur de l'US Army en octobre 2024, environ 990 M$ sur cinq ans couvrant les deux variantes — le signal que l'armée de terre américaine, après avoir hésité, réinvestit dans la catégorie. Côté export, l'acquisition passe par le canal gouvernemental américain : Foreign Military Sales (FMS), avec le concours de l'Agence OTAN de soutien et d'acquisition (NSPA) pour les alliés européens.\n\nCe modèle FMS donne au client une garantie d'État et un soutien intégré, mais l'inscrit dans un calendrier et une file d'attente que Washington maîtrise. Comme toute arme consommable, le Switchblade appelle un poste budgétaire récurrent souvent sous-estimé : le réapprovisionnement après emploi. Le contrat-cadre de 2024 vise précisément à sécuriser ce flux dans la durée, plutôt que de financer des commandes ponctuelles au coup par coup.",
      indicators: [
        {
          label: "Contrat SOCOM",
          value: "≈ 26,1 M$ — Switchblade 600 (mars 2021)",
          confidence: "moyenne",
          sources: ["av-switchblade", "warzone-cost"],
        },
        {
          label: "Contrat-cadre US Army",
          value: "≈ 990 M$ sur 5 ans — deux variantes (octobre 2024)",
          confidence: "moyenne",
          note: "Couvre les Switchblade 300 et 600 ; vise à stabiliser l'approvisionnement.",
          sources: ["warzone-cost", "iiss-mb"],
        },
        {
          label: "Canal d'acquisition export",
          value: "FMS — concours de la NSPA pour les alliés OTAN",
          confidence: "moyenne",
          sources: ["dsca-fms"],
        },
        {
          label: "Poste sous-estimé",
          value: "Réapprovisionnement en munitions après emploi",
          confidence: "faible",
          status: "a-recouper",
          note: "Coût récurrent propre aux armes consommables, rarement chiffré publiquement.",
          sources: ["iiss-mb"],
        },
      ],
      organisms: ["dsca"],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du Switchblade est l'un de ses atouts les plus nets : AeroVironment Inc., maître d'œuvre établi à Arlington en Virginie, l'assemble sur une base industrielle américaine, avec une intégration domestique présentée comme majeure. Les nœuds critiques — cellule, charge militaire, électronique — restent ainsi sur le sol national, à l'abri des leviers de pression extérieurs.\n\nLe paramètre décisif n'est pas l'origine des composants, mais la cadence. AeroVironment annonce une capacité de l'ordre de 6 000 Switchblade 600 par an : un chiffre élevé pour une munition aussi sophistiquée, qui répond directement à la leçon ukrainienne — un conflit de haute intensité consomme les munitions rôdeuses bien plus vite que la planification de paix ne l'anticipe. La question ouverte reste de savoir si cette cadence affichée tient face à une demande simultanée de l'US Army et de multiples clients export.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "AeroVironment Inc. — Arlington, Virginie",
          confidence: "haute",
          sources: ["av-switchblade"],
        },
        {
          label: "Origine des composants",
          value: "Base industrielle américaine — intégration domestique majeure",
          confidence: "moyenne",
          sources: ["av-switchblade"],
        },
        {
          label: "Capacité de production",
          value: "≈ 6 000 Switchblade 600 par an",
          confidence: "moyenne",
          status: "a-recouper",
          note: "Capacité annoncée par le constructeur ; non vérifiée par une source indépendante.",
          sources: ["av-switchblade"],
        },
        {
          label: "Dépendance étrangère",
          value: "Faible — chaîne intégrée aux États-Unis",
          confidence: "faible",
          status: "a-recouper",
          note: "Composition fine de la chaîne non détaillée publiquement.",
          sources: ["iiss-mb"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Switchblade est devenu un test grandeur nature de la doctrine américaine de munition rôdeuse. Le 300 a été l'un des symboles de l'aide militaire à l'Ukraine — environ 700 unités dès mars 2022, dans un paquet d'aide de 800 M$ — et son retour d'expérience a déçu : guerre électronique russe, charge insuffisante contre les blindés, coût sans commune mesure avec les drones FPV ukrainiens. Cet écart entre la promesse et le constat a nourri un débat doctrinal qui dépasse le seul matériel : la munition rôdeuse « catalogue », chère et industrielle, garde-t-elle un sens face à l'innovation low-cost de masse ?\n\nLe 600 est la réponse de Washington à cette question. En lui confiant une charge de classe Javelin et l'axe principal du contrat de 2024, l'US Army parie que la gamme haute de la munition rôdeuse — portée, létalité anti-char, fiabilité — conserve une valeur que les drones bricolés ne couvrent pas. Exporter un Switchblade, c'est donc à la fois transférer une capacité offensive lisible et inscrire un allié dans cette lecture américaine du champ de bataille.",
      indicators: [
        {
          label: "Enjeu doctrinal",
          value: "Test de la doctrine américaine de munition rôdeuse",
          confidence: "moyenne",
          sources: ["warzone-cost", "iiss-mb"],
        },
        {
          label: "Retour d'expérience Ukraine (Switchblade 300)",
          value: "Performance jugée décevante — guerre électronique, charge, coût",
          confidence: "moyenne",
          status: "a-recouper",
          note: "Jugement analytique tiré du retour d'expérience ; effets de détail mal établis.",
          sources: ["warzone-cost"],
        },
        {
          label: "Réorientation",
          value: "Le 600 devient l'axe principal après l'hésitation sur le 300",
          confidence: "moyenne",
          sources: ["warzone-cost", "iiss-mb"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export du Switchblade relève du régime américain le plus structurant : ITAR, sous le contrôle de la Direction des contrôles du commerce de défense (DDTC) du Département d'État. Les transferts se font de gouvernement à gouvernement, sans vente commerciale directe, et chaque dossier est soumis à autorisation politique américaine. Cette emprise ITAR est à double tranchant : elle garantit au client un canal d'État et un soutien, mais le rend dépendant du bon vouloir de Washington pour les livraisons, les mises à jour et le réapprovisionnement.\n\nLa base de clients déclarée s'est élargie vite. Outre l'Ukraine, les livraisons ou commandes recensées concernent la France (avril 2023), la Lituanie (décembre 2022), la Roumanie (juillet 2024, 25 systèmes 300 et 600), le Canada (février 2025, 67 M$ CAD), l'Australie (juillet 2024), la Grèce (septembre 2024, 75,2 M$), Israël (200 Switchblade 600 en juillet 2024) et Taïwan (plus de 1 000 drones armés dont 700 Switchblade début 2024). La plupart de ces contrats sont récents : les volumes exacts, les variantes et les calendriers de livraison demandent à être recoupés et doivent être lus avec prudence.",
      indicators: [
        {
          label: "Régime applicable",
          value: "ITAR — contrôle DDTC du Département d'État",
          confidence: "moyenne",
          sources: ["dsca-fms"],
        },
        {
          label: "Conditions",
          value: "Ventes de gouvernement à gouvernement ; autorisation politique au cas par cas",
          confidence: "moyenne",
          sources: ["dsca-fms"],
        },
        {
          label: "Base d'opérateurs export",
          value: "Ukraine, France, Lituanie, Roumanie, Canada, Australie, Grèce, Israël, Taïwan",
          confidence: "faible",
          status: "a-recouper",
          note: "Contrats 2022–2025 ; variantes et volumes encore mal établis.",
          sources: ["press-switchblade", "iiss-mb"],
        },
        {
          label: "Contrats export récents",
          value: "Roumanie ≈ 25 systèmes (2024) · Canada ≈ 67 M$ CAD (2025) · Grèce ≈ 75,2 M$ (2024)",
          confidence: "faible",
          status: "a-recouper",
          note: "Annonces récentes ; ventilation 300/600 non détaillée.",
          sources: ["press-switchblade"],
        },
      ],
      organisms: ["ddtc", "dsca"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "D",
      rationale:
        "Charge anti-blindage de classe Javelin réelle, mais un coût supérieur à 100 000 $ le coup qui rend le ratio d'échange très défavorable face aux drones FPV à quelques milliers de dollars employés en Ukraine.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Profil discret, rôdage et pique terminale jouent en sa faveur, mais le retour d'expérience du 300 a montré la vulnérabilité de la famille à la guerre électronique russe — évaluation prudente.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Largement exporté via FMS avec une base de clients OTAN et indo-pacifiques en expansion rapide, mais pleinement soumis à l'emprise ITAR et à l'autorisation politique américaine.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Maître d'œuvre unique sur une chaîne intégrée aux États-Unis et capacité annoncée de 6 000 unités par an ; seul aléa, la tenue de cette cadence face à une demande simultanée armée et export.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "Lignée Switchblade éprouvée au combat depuis 2011 et 600 sous contrat depuis 2021, mais le retour d'expérience opérationnel du 600 lui-même reste plus limité que celui du 300.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Caractéristiques et contrats américains étayés par des sources convergentes, mais coût unitaire en ordre de grandeur, capacité de production non vérifiée et contrats export 2024–2025 encore à consolider.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : le Switchblade, « drone kamikaze » vedette de l'aide à l'Ukraine, a révolutionné le champ de bataille. La réalité est plus nuancée. C'est le Switchblade 300, le petit modèle, qui a été massivement livré — et son bilan ukrainien a déçu : sensible à la guerre électronique russe, sous-armé contre les blindés, et de dix à cent fois plus cher que les drones FPV que les Ukrainiens fabriquent eux-mêmes. L'US Army a même brièvement cessé d'en commander. Le Switchblade 600, lui, corrige le tir avec une charge de classe Javelin, mais il reste une munition à plus de 100 000 $ le coup : une arme de précision haut de gamme, pas la solution bon marché et universelle que le terme « kamikaze » laisse imaginer.",
    bestUseCase:
      "La frappe antichar de précision à distance de sécurité, par une équipe légère sans appui d'artillerie ni d'aviation. Le 600 rôde au-dessus d'une zone, identifie un blindé de valeur — char, véhicule de commandement, système sol-air — puis l'engage avec une charge de classe Javelin, là où le Switchblade 300 ne pouvait viser que le fantassin ou le véhicule léger.",
    weakPoint:
      "Le ratio d'échange de coût. Payer plus de 100 000 $ pour neutraliser une cible qu'un drone FPV à quelques milliers de dollars atteint parfois est un handicap structurel dans un conflit d'attrition. À cela s'ajoute la vulnérabilité de la famille Switchblade à la guerre électronique, démontrée par l'emploi du 300 en Ukraine.",
    analystNote:
      "Le Switchblade 600 se juge moins sur sa fiche technique que sur le pari doctrinal qu'il incarne. Le retour d'expérience décevant du 300 a posé une question dérangeante à l'armée américaine : la munition rôdeuse « catalogue », chère et industrielle, garde-t-elle un sens face à l'innovation low-cost de masse ? En misant sur le 600 et son contrat-cadre de 990 M$, Washington répond que la gamme haute — létalité anti-char, portée, fiabilité, soutien — conserve une valeur propre. Le pari est défendable, mais la pression du bas du spectre reste entière : en 2026, le vrai juge du Switchblade 600 n'est pas le missile antichar, c'est le drone FPV à 2 000 $.",
  },
  operators: [
    "États-Unis (US Army, USMC, SOCOM)",
    "Ukraine",
    "France",
    "Lituanie",
    "Roumanie",
    "Canada",
    "Australie",
    "Grèce",
    "Israël",
    "Taïwan",
    "Royaume-Uni",
  ],
  theatres: [
    "Afghanistan (2011–2021)",
    "Syrie",
    "Irak",
    "Ukraine (depuis 2022)",
    "Israël-Gaza (2024)",
  ],
  timeline: [
    { date: "2011", label: "Entrée en service du Switchblade 300, prédécesseur du 600.", kind: "jalon" },
    { date: "2021-03", label: "Contrat SOCOM de ≈ 26,1 M$ pour le Switchblade 600.", kind: "jalon" },
    { date: "2022-03", label: "Livraison d'environ 700 Switchblade 300 à l'Ukraine (paquet d'aide de 800 M$).", kind: "export" },
    { date: "2022-05", label: "Emploi du Switchblade en Ukraine — retour d'expérience contrasté.", kind: "emploi" },
    { date: "2024-07", label: "Commande israélienne de 200 Switchblade 600.", kind: "export" },
    { date: "2024-10", label: "Contrat-cadre US Army de ≈ 990 M$ sur 5 ans couvrant les deux variantes.", kind: "jalon" },
    { date: "2025-02", label: "Contrat canadien d'environ 67 M$ CAD — à recouper.", kind: "export" },
  ],
  sources: [
    {
      id: "av-switchblade",
      title: "Switchblade 300 / 600 — Loitering Missile Systems",
      publisher: "AeroVironment",
      type: "constructeur",
      reliability: "B",
      url: "https://www.avinc.com",
    },
    {
      id: "warzone-cost",
      title: "Switchblade — analyses de coût et retour d'expérience ukrainien",
      publisher: "The War Zone",
      type: "presse",
      reliability: "B",
    },
    {
      id: "dsca-fms",
      title: "Foreign Military Sales — notifications et procédures",
      publisher: "Defense Security Cooperation Agency",
      type: "officiel",
      reliability: "A",
      url: "https://www.dsca.mil",
    },
    {
      id: "press-switchblade",
      title: "Couverture des contrats export Switchblade (2022–2025)",
      publisher: "Presse internationale de défense",
      type: "presse",
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
