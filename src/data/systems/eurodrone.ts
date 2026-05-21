import type { DefenseSystem } from "../types";

export const eurodrone: DefenseSystem = {
  slug: "eurodrone",
  name: "Eurodrone",
  designation: "European MALE RPAS",
  reference: "PNP-DR-011",
  category: "drone",
  droneClass: "MALE",
  classLabel: "MALE coopératif",
  country: "Europe — 4 nations",
  flag: "🇪🇺",
  manufacturer: "Airbus Defence and Space",
  status: "En développement — premier vol prévu mi-2027",
  acquisitionModes: ["cooperatif"],
  tagline:
    "Le pari de l'Europe sur un drone MALE souverain — sauf le moteur, et sauf le calendrier.",
  summary:
    "L'Eurodrone est le programme phare de la souveraineté MALE européenne : un bi-turbopropulseur de surveillance et de frappe que quatre pays — Allemagne nation pilote, France, Italie, Espagne — entendent substituer à leurs MQ-9 Reaper américains à l'horizon de l'après-2030. Notifié à l'OCCAr le 24 février 2022, le contrat porte sur 7,1 Md€ et 20 systèmes, soit 60 appareils ; il matérialise l'ambition d'une chaîne industrielle continentale capable de livrer un MALE complet, du capteur à la station sol, sans dépendre d'une autorisation d'exportation venue de Washington.\n\nLe comprendre suppose de tenir deux registres en même temps. D'un côté, une démonstration politique réelle : quatre États qui mutualisent un besoin, une architecture conçue pour être ITAR-free, des observateurs — Japon, Inde — qui valident l'intérêt du produit. De l'autre, un programme qui n'a pas encore volé : calendrier glissé d'un an reconnu par le ministre, coût unitaire très supérieur à celui d'un Reaper, et un retour d'expérience ukrainien qui interroge ouvertement la pertinence d'un gros MALE dans un ciel contesté. L'Eurodrone se juge donc à son intention industrielle, pas encore à une performance prouvée.",
  keySpecs: [
    {
      label: "Charge utile maximale",
      value: "≈ 2,3 t",
      confidence: "faible",
      note: "Performances annoncées, non validées en vol.",
      sources: ["airbus-eurodrone"],
    },
    {
      label: "Endurance",
      value: "Jusqu'à 40 h",
      confidence: "faible",
      note: "Performances annoncées, non validées en vol.",
      sources: ["airbus-eurodrone"],
    },
    {
      label: "Motorisation",
      value: "2 × General Electric Catalyst (turbopropulseurs)",
      confidence: "moyenne",
      note: "Moteur retenu en mars 2022 face au Safran Ardiden 3TP ; origine américaine.",
      sources: ["airbus-eurodrone", "iiss-mb"],
    },
    {
      label: "Capteur principal",
      value: "Boule optronique Safran Euroflir 610",
      confidence: "moyenne",
      sources: ["airbus-eurodrone"],
    },
    {
      label: "Liaisons de données",
      value: "LOS et BLOS multiples",
      confidence: "faible",
      note: "Architecture annoncée ; non éprouvée en vol.",
      sources: ["airbus-eurodrone"],
    },
    {
      label: "Classe MTCR",
      value: "Catégorie I — régime d'exportation le plus restrictif",
      confidence: "haute",
      sources: ["mtcr-guidelines"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le contrat notifié à l'OCCAr le 24 février 2022 s'élève à 7,1 Md€ hors taxes pour 20 systèmes, soit 60 appareils. La lecture par unité est rude : environ 120 M€ par système et de l'ordre de 40 M€ par drone hors station sol — un ordre de grandeur très supérieur à celui d'un MQ-9 Reaper, comparaison qui revient systématiquement dans la critique du programme.\n\nCe surcoût est l'inévitable rançon d'un développement souverain : on ne paie pas seulement un drone, on paie la constitution d'une compétence MALE européenne et d'une chaîne industrielle répartie sur quatre pays. Reste que ce chiffre est celui d'un appareil qui n'a pas volé : tout glissement de calendrier — un an déjà reconnu — pèse mécaniquement sur le coût final, et aucune revue de coût en service n'existe encore.",
      indicators: [
        {
          label: "Contrat OCCAr",
          value: "7,1 Md€ HT — 20 systèmes / 60 drones",
          confidence: "haute",
          note: "Contrat de développement et de production notifié en février 2022.",
          sources: ["occar-contrat", "iiss-mb"],
        },
        {
          label: "Coût unitaire estimé",
          value: "≈ 120 M€/système · ≈ 40 M€/drone hors station sol",
          confidence: "moyenne",
          note: "Calcul dérivé du contrat ; coût de soutien en service non documenté.",
          sources: ["occar-contrat"],
        },
        {
          label: "Écart de coût face au Reaper",
          value: "Coût/unité nettement supérieur à un MQ-9",
          confidence: "moyenne",
          status: "a-recouper",
          note: "Critique récurrente ; les périmètres comparés ne sont pas strictement homogènes.",
          sources: ["iiss-mb"],
        },
        {
          label: "Risque de dérive",
          value: "Calendrier glissé d'un an — pression haussière sur le coût",
          confidence: "moyenne",
          sources: ["lecornu-2024"],
        },
      ],
      organisms: ["occar"],
    },
    {
      key: "finance",
      narrative:
        "Le financement de l'Eurodrone passe par l'OCCAr, qui contracte pour le compte de la DGA et de ses trois homologues nationales. Le montage est un cofinancement quadrinational classique, adossé à un besoin partagé : chaque État commande son volume d'appareils et contribue à proportion. La France a notifié 12 drones — 4 systèmes — avec 6 appareils en option et une cible affichée de 6 systèmes à terme.\n\nLa singularité financière du dossier tient à l'apport européen : une subvention de 100 M€ au titre du Programme européen de développement industriel pour la défense (PEDID). Le montant reste modeste au regard d'un contrat de 7,1 Md€, mais sa portée est politique — c'est l'un des premiers grands programmes d'armement où l'Union cofinance directement la phase de développement, signal d'une bascule vers une logique de défense communautaire.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "OCCAr pour le compte de la DGA et de ses homologues",
          confidence: "haute",
          sources: ["occar-contrat"],
        },
        {
          label: "Cofinancement européen",
          value: "Subvention de 100 M€ via le PEDID",
          confidence: "haute",
          sources: ["occar-contrat", "iiss-mb"],
        },
        {
          label: "Commande française",
          value: "12 drones (4 systèmes) + 6 en option — cible 6 systèmes",
          confidence: "moyenne",
          sources: ["dga-eurodrone"],
        },
        {
          label: "Modèle de partage",
          value: "Cofinancement quadrinational au prorata des volumes commandés",
          confidence: "moyenne",
          sources: ["occar-contrat"],
        },
      ],
      organisms: ["occar", "dga"],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne de l'Eurodrone est une carte de l'industrie aéronautique de défense de quatre pays. Airbus DS Allemagne assure la maîtrise d'œuvre et l'intégration ; Dassault Aviation, Leonardo et Airbus DS Espagne se partagent les lots restants ; Safran apporte la boule optronique Euroflir 610 et les systèmes de freinage. L'architecture a été pensée ITAR-free, c'est-à-dire affranchie des composants soumis à la réglementation américaine sur les exportations d'armement.\n\nCet argument souffre toutefois d'une exception majeure : le moteur. Le bimoteur retenu en mars 2022 est le General Electric Catalyst, américain, préféré au Safran Ardiden 3TP. Une plateforme conçue ITAR-free mais propulsée par un turbopropulseur des États-Unis reste, pour la part motorisation, dépendante d'une autorisation d'exportation de Washington — contradiction que la communication du programme tend à minorer et qui constitue le véritable point faible de souveraineté de la chaîne.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Airbus DS Allemagne — intégration système",
          confidence: "haute",
          sources: ["airbus-eurodrone"],
        },
        {
          label: "Partenaires industriels",
          value: "Dassault Aviation · Leonardo · Airbus DS Espagne · Safran (optronique, freinage)",
          confidence: "haute",
          sources: ["airbus-eurodrone"],
        },
        {
          label: "Dépendance extra-européenne",
          value: "Moteur GE Catalyst (États-Unis) — contredit l'argument ITAR-free",
          confidence: "moyenne",
          status: "a-recouper",
          note: "La cellule est annoncée ITAR-free ; la motorisation ne l'est pas.",
          sources: ["iiss-mb"],
        },
        {
          label: "Maturité de la chaîne",
          value: "En développement — première intégration non finalisée",
          confidence: "faible",
          sources: ["airbus-eurodrone"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "L'Eurodrone porte une charge politique au moins égale à sa charge utile. Construire en propre un MALE complet, du capteur à la station sol, c'est démontrer que l'Europe peut se doter d'une capacité de surveillance et de frappe sans dépendre du MQ-9 Reaper américain ni du veto d'exportation qui l'accompagne. Quatre nations clientes et deux observateurs — le Japon depuis novembre 2023, l'Inde depuis janvier 2025 — valident la lisibilité stratégique du produit.\n\nMais la guerre d'Ukraine a déplacé le débat. Le retour d'expérience montre qu'un gros MALE, lent et peu furtif, survit mal dans un ciel densément défendu : un constat que la ministre Catherine Vautrin a publiquement reconnu en octobre 2025. L'Eurodrone garde toute sa valeur pour la surveillance de longue durée en environnement permissif, mais sa pertinence en haute intensité — l'hypothèse même qui structure aujourd'hui les armées européennes — est ouvertement questionnée par l'état-major et la DGA.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Capacité MALE souveraine — alternative au Reaper américain",
          confidence: "moyenne",
          sources: ["iiss-mb"],
        },
        {
          label: "Nations clientes",
          value: "Allemagne (pilote), France, Italie, Espagne",
          confidence: "haute",
          sources: ["occar-contrat"],
        },
        {
          label: "Observateurs",
          value: "Japon (novembre 2023), Inde (janvier 2025)",
          confidence: "haute",
          sources: ["airbus-eurodrone"],
        },
        {
          label: "Pertinence en haute intensité",
          value: "Questionnée — inadaptation probable reconnue (octobre 2025)",
          confidence: "moyenne",
          status: "variable",
          note: "Constat porté par la ministre, l'état-major et la DGA après le retour d'expérience ukrainien.",
          sources: ["vautrin-2025", "iiss-mb"],
        },
      ],
      organisms: ["dga"],
    },
    {
      key: "export",
      narrative:
        "L'Eurodrone relève de la catégorie I du Régime de contrôle de la technologie des missiles (MTCR), la plus restrictive : tout transfert est soumis à une présomption de refus et à l'arbitrage politique des quatre États partenaires. Le positionnement export visé est cohérent — des alliés à budget de défense moyen, en quête d'un MALE complet sans s'aligner sur un fournisseur américain ou chinois.\n\nDeux réserves pèsent toutefois sur ce potentiel. D'abord le prix : un coût unitaire nettement supérieur à celui d'un Reaper restreint le marché accessible à des clients capables de payer la prime de souveraineté. Ensuite le moteur : la présence du General Electric Catalyst signifie qu'une vente à l'export pourrait, pour la part motorisation, requérir un feu vert de Washington — ce qui relativise l'argument commercial d'un produit « libre de tout veto américain ». L'exportabilité réelle de l'Eurodrone reste donc à démontrer, programme non encore volant.",
      indicators: [
        {
          label: "Régime applicable",
          value: "MTCR catégorie I — présomption de refus",
          confidence: "haute",
          sources: ["mtcr-guidelines"],
        },
        {
          label: "Cible export",
          value: "Alliés à budget de défense moyen recherchant un MALE complet",
          confidence: "faible",
          sources: ["iiss-mb"],
        },
        {
          label: "Frein au coût",
          value: "Prix unitaire élevé — marché accessible restreint",
          confidence: "moyenne",
          sources: ["iiss-mb"],
        },
        {
          label: "Limite de souveraineté à l'export",
          value: "Moteur GE Catalyst — feu vert américain possiblement requis",
          confidence: "moyenne",
          status: "a-recouper",
          sources: ["iiss-mb"],
        },
      ],
      organisms: ["mtcr"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "D",
      rationale:
        "Coût unitaire de l'ordre de 120 M€/système, très supérieur à un Reaper, pour une plateforme qui n'a pas encore volé : le rendement attendu est avant tout politique et industriel, non opérationnel.",
    },
    {
      key: "survivabilite",
      grade: "D",
      rationale:
        "Gros MALE lent et peu furtif ; le retour d'expérience ukrainien et la ministre elle-même reconnaissent une inadaptation probable au ciel contesté. Acceptable en environnement permissif seulement.",
    },
    {
      key: "exportabilite",
      grade: "D",
      rationale:
        "MTCR catégorie I, prix unitaire élevé et dépendance moteur américaine qui relativise l'argument « sans veto US » : le potentiel export existe mais reste étroit et non démontré.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Maîtrise d'œuvre solide et quatre États engagés, mais coopération quadrinationale, calendrier déjà glissé d'un an et dépendance au GE Catalyst constituent un risque réel de dérive.",
    },
    {
      key: "maturite",
      grade: "E",
      rationale:
        "Programme en développement : aucun vol, aucune livraison, premier vol prévu mi-2027 et mises en service repoussées à 2028-2030. La maturité système est nulle à ce stade.",
    },
    {
      key: "confiance-donnees",
      grade: "A",
      rationale:
        "Contrat OCCAr public, déclarations ministérielles datées et suivi institutionnel régulier ; les seules incertitudes portent sur des performances annoncées, clairement signalées comme non validées en vol.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : l'Europe dispose d'un drone MALE souverain et ITAR-free. La réalité : l'Eurodrone n'a pas volé — premier vol prévu mi-2027 — et son moteur, le General Electric Catalyst, est américain. La cellule est conçue libre de composants ITAR, mais une plateforme propulsée par un turbopropulseur des États-Unis n'est pas, pour autant, affranchie de tout contrôle d'exportation de Washington.",
    bestUseCase:
      "La surveillance et la frappe de longue durée — jusqu'à 40 h annoncées — au-dessus d'un théâtre permissif ou faiblement défendu : police du ciel, contrôle de zone, renseignement persistant, en remplacement coordonné des MQ-9 Reaper de quatre armées de l'air européennes.",
    weakPoint:
      "La pertinence en haute intensité. Un gros MALE lent et peu furtif survit mal dans un ciel densément défendu — un constat tiré de l'Ukraine et reconnu par la ministre comme par la DGA. À cela s'ajoutent un calendrier glissé d'un an et un coût unitaire qui pèse sur l'efficience d'ensemble.",
    analystNote:
      "L'Eurodrone se juge en 2026 à son intention industrielle, pas à une performance : il n'a pas volé, et toute donnée de capacité reste une annonce constructeur. Sa valeur réelle est politique — prouver qu'une chaîne quadrinationale peut livrer un MALE complet et amorcer un cofinancement européen de la défense via le PEDID. Mais le programme avance sur une ligne de crête : calendrier déjà décalé, coût/unité élevé face au Reaper, moteur américain qui fissure l'argument de souveraineté, et un format dont l'état-major doute pour la haute intensité. Un succès industriel qui livrerait, après 2030, un système déjà jugé inadapté au combat de demain serait une victoire en trompe-l'œil.",
  },
  operators: [
    "Aucun — en développement",
    "Futurs : Allemagne, France, Italie, Espagne",
    "Observateurs : Japon, Inde",
  ],
  theatres: ["Aucun — système en développement"],
  timeline: [
    { date: "2022-02", label: "Notification du contrat de l'Eurodrone à l'OCCAr — 7,1 Md€, 20 systèmes.", kind: "jalon" },
    { date: "2022-03", label: "Choix du moteur General Electric Catalyst face au Safran Ardiden 3TP.", kind: "jalon" },
    { date: "2023-11", label: "Le Japon rejoint le programme comme observateur.", kind: "debat" },
    { date: "2024-10", label: "Glissement du calendrier d'un an reconnu par le ministre Sébastien Lecornu.", kind: "debat" },
    { date: "2025-01", label: "L'Inde rejoint le programme comme observateur.", kind: "debat" },
    { date: "2027", label: "Premier vol de l'Eurodrone prévu (mi-2027).", kind: "jalon" },
  ],
  sources: [
    {
      id: "airbus-eurodrone",
      title: "Eurodrone — European MALE RPAS",
      publisher: "Airbus Defence and Space",
      type: "constructeur",
      reliability: "B",
      url: "https://www.airbus.com",
    },
    {
      id: "occar-contrat",
      title: "Contrat Eurodrone — notification et architecture du programme",
      publisher: "OCCAr",
      type: "officiel",
      reliability: "A",
      date: "2022-02",
    },
    {
      id: "dga-eurodrone",
      title: "Eurodrone — commande française et cible capacitaire",
      publisher: "Direction générale de l'armement",
      type: "officiel",
      reliability: "A",
    },
    {
      id: "lecornu-2024",
      title: "Audition sur le programme Eurodrone — calendrier",
      publisher: "Ministère des Armées",
      type: "officiel",
      reliability: "A",
      date: "2024-10",
    },
    {
      id: "vautrin-2025",
      title: "Déclaration sur la pertinence du MALE en haute intensité",
      publisher: "Ministère des Armées",
      type: "officiel",
      reliability: "A",
      date: "2025-10",
    },
    {
      id: "mtcr-guidelines",
      title: "Missile Technology Control Regime — Guidelines and Annex",
      publisher: "MTCR",
      type: "institution",
      reliability: "A",
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
