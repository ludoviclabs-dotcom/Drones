import type { DefenseSystem } from "../types";

export const hermes900: DefenseSystem = {
  slug: "hermes-900",
  name: "Hermes 900 Kochav",
  designation: "Kochav",
  reference: "PNP-DR-014",
  category: "drone",
  droneClass: "MALE",
  classLabel: "MALE multimission",
  country: "Israël",
  flag: "🇮🇱",
  manufacturer: "Elbit Systems",
  introduced: "2012",
  status: "En service — environ 200 unités produites, opérateurs sur quatre continents",
  acquisitionModes: ["DCS"],
  tagline:
    "Le best-seller MALE israélien, vendu sur quatre continents — mais que deux missiles du Hezbollah ont fait redescendre du ciel en 2024.",
  summary:
    "Le Hermes 900 Kochav (« Étoile ») d'Elbit Systems est le successeur du Hermes 450 et l'un des drones militaires les plus diffusés au monde. Conçu pour le renseignement, la surveillance et la reconnaissance, le relais de communications et la patrouille maritime, il décline une cellule unique en une gamme entière : version terrestre, version navale, et StarLiner certifiée pour évoluer dans l'espace aérien civil. Premier vol en décembre 2009, entrée en service en 2012, environ deux cents exemplaires produits — la fiche commerciale est celle d'un produit phare.\n\nLe comprendre, c'est lire deux histoires en parallèle. La première est industrielle et diplomatique : un appareil qui sert d'argument à la diplomatie de défense israélienne, des Andes à l'Arctique canadien, et qui s'installe durablement en Europe via la Suisse, l'Islande et Frontex. La seconde est doctrinale : en avril puis en juin 2024, le Hezbollah a abattu deux Hermes 900 avec des missiles sol-air, rappelant qu'un drone MALE conçu pour le ciel permissif devient une cible dès que l'adversaire dispose d'une défense aérienne moderne.",
  keySpecs: [
    {
      label: "Envergure",
      value: "15 m (17 m pour la version StarLiner)",
      confidence: "haute",
      sources: ["elbit-hermes900"],
    },
    {
      label: "Longueur",
      value: "8,3 m",
      confidence: "haute",
      sources: ["elbit-hermes900"],
    },
    {
      label: "Masse maximale au décollage",
      value: "970–1 100 kg (≈ 1 600 kg pour StarLiner)",
      confidence: "moyenne",
      note: "Valeur citée en fourchette selon la version et la configuration de mission.",
      sources: ["elbit-hermes900"],
    },
    {
      label: "Charge utile",
      value: "300–450 kg",
      confidence: "moyenne",
      sources: ["elbit-hermes900"],
    },
    {
      label: "Endurance — plafond",
      value: "> 30 h (jusqu'à 36 h) · 30 000 ft (9 100 m)",
      confidence: "moyenne",
      sources: ["elbit-hermes900", "iiss-mb"],
    },
    {
      label: "Motorisation",
      value: "Rotax 914 (BRP-Powertrain, Autriche — 115 ch), en configuration propulsive",
      confidence: "haute",
      sources: ["elbit-hermes900"],
    },
    {
      label: "Capteurs et emport",
      value:
        "EO/IR · SAR/GMTI · ELINT/COMINT · guerre électronique · désignateur laser · hyperspectral ; versions armées compatibles 4 missiles Spike",
      confidence: "moyenne",
      note: "L'emport armé Spike n'équipe que les versions armées et reste minoritaire dans la flotte exportée.",
      sources: ["elbit-hermes900", "iiss-mb"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût du Hermes 900 se lit à deux échelles. À l'échelle de la cellule, les estimations secondaires retiennent environ 6,8 M$ — un chiffre de think-tank, non confirmé par le constructeur, à manier comme un ordre de grandeur plutôt que comme un prix catalogue. À l'échelle du système, les contrats publics donnent une fourchette plus large car ils intègrent stations sol, capteurs, formation et soutien : le Mexique a payé environ 50 M$ pour deux systèmes en 2012, la Suisse environ 200 M$ pour six appareils en 2015, les Philippines environ 175 M$ pour trois Hermes 900 et un Hermes 450 en 2020.\n\nCette dispersion est la règle pour un MALE : le prix dépend moins de l'appareil que du paquet capacitaire et du volume de soutien négocié. Un contrat asiatique d'environ 300 M$, annoncé par Elbit en mars 2021, illustre l'écart entre le coût d'une cellule et celui d'un programme complet. Aucune revue de coût indépendante ne vient consolider ces montants : ils proviennent de communiqués industriels et de bases de données ouvertes, d'où une confiance volontairement modérée.",
      indicators: [
        {
          label: "Coût unitaire (cellule)",
          value: "≈ 6,8 M$",
          confidence: "moyenne",
          status: "a-recouper",
          note: "Estimation secondaire (base de données ouverte) ; non confirmée par le constructeur.",
          sources: ["globalmilitary", "iiss-mb"],
        },
        {
          label: "Contrat Suisse",
          value: "≈ 200 M$ pour 6 Hermes 900 HFE (2015)",
          confidence: "haute",
          sources: ["presse-defense"],
        },
        {
          label: "Contrat Philippines",
          value: "≈ 175 M$ pour 3 Hermes 900 + 1 Hermes 450 (2020)",
          confidence: "moyenne",
          sources: ["presse-defense"],
        },
        {
          label: "Contrat asiatique",
          value: "≈ 300 M$ annoncé par Elbit (mars 2021)",
          confidence: "moyenne",
          status: "a-recouper",
          note: "Montant communiqué par le constructeur ; périmètre exact du paquet capacitaire non public.",
          sources: ["elbit-hermes900"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Hermes 900 repose sur un double circuit de financement. Côté israélien, son développement et son acquisition par Tsahal sont portés par le budget de défense national, dans la continuité du Hermes 450 qu'il remplace. Côté export — son débouché principal —, chaque vente est financée par le budget national du pays client, sans mécanisme de prêt-bail ni de financement américain : on est dans une logique de vente commerciale directe d'État à État.\n\nLa conséquence financière est nette pour l'acheteur. Contrairement à un dispositif FMS, il n'y a pas d'enveloppe d'aide à la sécurité ni de ligne de crédit dédiée : le client paie sur ses propres deniers et négocie directement le périmètre du contrat. Pour Elbit, ce modèle transforme chaque contrat en recette d'exportation immédiate, et fait du Hermes 900 une source de revenus récurrente alimentée par une base installée large et diversifiée.",
      indicators: [
        {
          label: "Financement israélien",
          value: "Budget de défense national (acquisition Tsahal)",
          confidence: "haute",
          sources: ["iiss-mb"],
        },
        {
          label: "Financement export",
          value: "Budgets nationaux des États clients — vente commerciale directe",
          confidence: "haute",
          sources: ["presse-defense"],
        },
        {
          label: "Mécanisme d'aide",
          value: "Aucun — pas de prêt-bail ni de financement de sécurité tiers",
          confidence: "moyenne",
          sources: ["iiss-mb"],
        },
        {
          label: "Modèle de revenus",
          value: "Recette d'exportation pour Elbit, alimentée par une large base installée",
          confidence: "moyenne",
          sources: ["elbit-hermes900"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne d'approvisionnement du Hermes 900 est largement intégrée chez Elbit Systems : cellule, capteurs EO/IR, charges SAR, suites ELINT/COMINT et de guerre électronique relèvent du portefeuille du groupe israélien, ce qui lui donne un contrôle inhabituellement complet de la valeur ajoutée. Cette intégration verticale est un atout commercial — un interlocuteur unique, une cohérence capteurs-plateforme — et un atout de souveraineté pour Israël.\n\nElle comporte toutefois un point de dépendance assumé : la motorisation. Le Hermes 900 vole avec un Rotax 914, moteur civil de 115 ch produit par BRP-Powertrain en Autriche. Un composant clé du système échappe ainsi au périmètre national et relève d'un fournisseur civil étranger — exposition classique des MALE de cette catégorie, qui rend l'appareil tributaire d'une filière hors du contrôle israélien et, potentiellement, de considérations d'exportation autrichiennes ou européennes.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Elbit Systems — cellule, capteurs, charges électroniques",
          confidence: "haute",
          sources: ["elbit-hermes900"],
        },
        {
          label: "Intégration verticale",
          value: "Élevée — capteurs et plateforme dans le même portefeuille",
          confidence: "moyenne",
          sources: ["elbit-hermes900"],
        },
        {
          label: "Dépendance critique",
          value: "Moteur Rotax 914 — BRP-Powertrain (Autriche), composant civil",
          confidence: "haute",
          note: "Filière de motorisation hors du périmètre industriel israélien.",
          sources: ["elbit-hermes900", "iiss-mb"],
        },
        {
          label: "Volume produit",
          value: "≈ 200 unités toutes versions",
          confidence: "moyenne",
          sources: ["elbit-hermes900"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Hermes 900 est un instrument de la diplomatie de défense israélienne autant qu'un appareil de renseignement. Sa diffusion — Amérique latine, Asie du Sud-Est, Europe, Arctique — accompagne et matérialise des rapprochements stratégiques : vendre un MALE, c'est nouer une relation de soutien, de formation et de maintenance qui dure des années. L'appareil sert ainsi de porte d'entrée à une coopération de défense plus large.\n\nSon ancrage européen est le fait marquant des dernières années. La Suisse, l'Islande et l'agence Frontex — qui l'exploite depuis Malte pour la surveillance maritime — installent un drone israélien au cœur de dispositifs civils et de sécurité européens. Cette intégration croissante est un succès commercial, mais elle expose aussi le programme aux débats politiques européens sur l'origine israélienne des capteurs et sur l'usage des drones en Méditerranée — une visibilité qui peut, selon les contextes, devenir une vulnérabilité d'image.",
      organisms: ["deca"],
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Produit phare de la diplomatie de défense israélienne",
          confidence: "moyenne",
          sources: ["iiss-mb"],
        },
        {
          label: "Ancrage européen",
          value: "Suisse, Islande, Frontex (exploitation depuis Malte)",
          confidence: "haute",
          sources: ["presse-defense"],
        },
        {
          label: "Présence Arctique",
          value: "StarLiner pour le Canada — contrat 2022",
          confidence: "moyenne",
          sources: ["presse-defense"],
        },
        {
          label: "Exposition politique",
          value: "Visibilité du capteur israélien dans des dispositifs civils européens",
          confidence: "faible",
          status: "variable",
          sources: ["iiss-mb"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Hermes 900 est un best-seller à l'exportation, vendu en vente commerciale directe (DCS) sous le régime de contrôle israélien administré par la DECA. La liste des opérateurs couvre quatre continents : Israël, Chili — première vente export en juillet 2011 —, Colombie, Mexique, Philippines, Suisse, Islande, Brésil, Singapour, Inde, et l'agence Frontex. La diversité des clients, des États sud-américains aux marines asiatiques, témoigne d'un produit calibré pour s'adapter à des doctrines très différentes.\n\nLa profondeur du carnet de commandes reste pour partie à confirmer. Le contrat asiatique d'environ 300 M$ annoncé en mars 2021 n'a vu son client identifié comme la Republic of Singapore Air Force qu'en novembre 2025, à la faveur d'une confirmation du ministère de la Défense singapourien — illustration du décalage habituel entre annonce industrielle et attribution publique. La Thaïlande figure parmi les clients annoncés mais non encore consolidés. Comme tout MALE de cette envergure, le Hermes 900 relève d'un régime d'exportation soumis à un arbitrage politique israélien.",
      organisms: ["deca"],
      indicators: [
        {
          label: "Régime d'exportation",
          value: "DCS — contrôle israélien (DECA)",
          confidence: "haute",
          sources: ["iiss-mb"],
        },
        {
          label: "Première vente export",
          value: "Chili — juillet 2011",
          confidence: "haute",
          sources: ["presse-defense"],
        },
        {
          label: "Base d'opérateurs",
          value: "Quatre continents — une douzaine d'États et l'agence Frontex",
          confidence: "moyenne",
          sources: ["elbit-hermes900", "iiss-mb"],
        },
        {
          label: "Client de Singapour",
          value: "Republic of Singapore Air Force — confirmée en novembre 2025",
          confidence: "faible",
          status: "a-recouper",
          note: "Contrat annoncé en 2021 ; client identifié tardivement via le MoD singapourien.",
          sources: ["presse-defense"],
        },
      ],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Une cellule estimée autour de 6,8 M$ pour une endurance de plus de 30 h et une suite de capteurs polyvalente : rapport capacité-prix solide pour un MALE, sans toutefois la frugalité radicale d'un drone de classe inférieure.",
    },
    {
      key: "survivabilite",
      grade: "D",
      rationale:
        "Deux Hermes 900 abattus par des missiles sol-air du Hezbollah en avril et juin 2024 : conçu pour le ciel permissif, l'appareil est une cible documentée dès que l'adversaire aligne une défense aérienne moderne.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Best-seller MALE vendu sur quatre continents, à une douzaine d'États et à Frontex, en vente commerciale directe : l'un des drones les mieux exportés de sa catégorie.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Chaîne très intégrée chez Elbit, mais dépendante du moteur Rotax 914 produit en Autriche : un composant clé hors du périmètre national, exposé à des considérations d'exportation européennes.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2012, environ 200 exemplaires produits, emploi opérationnel prouvé de Gaza à l'Arctique : un système pleinement mûr et largement éprouvé.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Caractéristiques et contrats bien documentés par le constructeur et la presse spécialisée ; les chiffres de coût restent des estimations secondaires et certaines attributions d'export n'ont été confirmées que tardivement.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un drone MALE israélien éprouvé peut surveiller n'importe quel théâtre en toute impunité. La réalité : le Hermes 900 excelle dans le ciel permissif — surveillance, patrouille maritime, secours civil — mais il a été abattu deux fois par le Hezbollah en 2024. Son efficacité dépend du niveau de la menace sol-air ; face à une défense aérienne moderne, c'est une cible, pas un observateur intouchable.",
    bestUseCase:
      "La surveillance persistante longue durée dans un environnement peu contesté : patrouille maritime et contrôle de zone économique exclusive, renseignement ISR, relais de communications, et missions civiles comme le secours en cas de catastrophe — illustré au Brésil en 2024, où un Hermes 900 a appuyé le sauvetage de 36 personnes lors des inondations du Rio Grande do Sul.",
    weakPoint:
      "La survivabilité face aux défenses sol-air. Les deux pertes infligées par le Hezbollah en 2024 ne sont pas des accidents : elles confirment qu'un MALE volant à 9 100 m, lent et peu furtif, entre dans l'enveloppe des missiles sol-air modernes. À cela s'ajoute la dépendance au moteur autrichien Rotax, point de fragilité industrielle hors du contrôle israélien.",
    analystNote:
      "Le Hermes 900 est un succès commercial incontestable — une base installée mondiale, une diplomatie de défense efficace, une maturité opérationnelle pleine. Mais 2024 a tracé sa ligne de partage : il reste excellent là où le ciel est ouvert, et exposé dès qu'il ne l'est plus. Pour un acheteur, la vraie question n'est pas la fiche technique, déjà solide, mais l'adéquation de l'appareil à la menace réelle de son théâtre — et la dépendance, rarement chiffrée, à une filière de motorisation civile étrangère.",
  },
  operators: [
    "Israël",
    "Chili",
    "Colombie",
    "Mexique",
    "Philippines",
    "Suisse",
    "Islande",
    "Brésil",
    "Singapour (Republic of Singapore Air Force — à recouper)",
    "Inde (version Mk2, marine indienne)",
    "Canada (StarLiner — usage Arctique)",
    "Frontex (exploitation depuis Malte)",
    "Thaïlande (annoncé — non confirmé)",
  ],
  theatres: [
    "Gaza — opération Protective Edge (juillet 2014), premier emploi opérationnel",
    "Israël 2023-2024 — deux Hermes 900 abattus par le Hezbollah (avril et juin 2024)",
    "Haut-Karabakh — conflit Azerbaïdjan-Arménie (2020)",
    "Brésil — inondations du Rio Grande do Sul (2024), sauvetage civil de 36 personnes",
    "Iran — opération Rising Lion (juin 2025, à recouper)",
  ],
  timeline: [
    { date: "2009-12", label: "Premier vol du Hermes 900 Kochav.", kind: "jalon" },
    { date: "2011-07", label: "Première vente à l'exportation — le Chili devient client de lancement.", kind: "export" },
    { date: "2012", label: "Entrée en service au sein des forces israéliennes.", kind: "jalon" },
    { date: "2014-07", label: "Premier emploi opérationnel à Gaza lors de l'opération Protective Edge.", kind: "emploi" },
    { date: "2015-11", label: "Contrat suisse — 6 Hermes 900 HFE pour environ 200 M$.", kind: "export" },
    { date: "2024", label: "Deux Hermes 900 abattus par le Hezbollah avec des missiles sol-air (avril et juin) — leçon de vulnérabilité.", kind: "debat" },
  ],
  sources: [
    {
      id: "elbit-hermes900",
      title: "Hermes 900 — système aérien sans pilote multimission",
      publisher: "Elbit Systems",
      type: "constructeur",
      reliability: "B",
      url: "https://elbitsystems.com",
    },
    {
      id: "iiss-mb",
      title: "The Military Balance",
      publisher: "IISS",
      type: "institution",
      reliability: "A",
    },
    {
      id: "globalmilitary",
      title: "Hermes 900 — fiche coût et caractéristiques",
      publisher: "globalmilitary.net",
      type: "think-tank",
      reliability: "C",
    },
    {
      id: "presse-defense",
      title: "Contrats et exportations du Hermes 900 — couverture spécialisée",
      publisher: "Presse spécialisée défense",
      type: "presse",
      reliability: "B",
    },
  ],
  updated: "2026-05-21",
};
