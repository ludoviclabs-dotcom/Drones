import type { DefenseSystem } from "../types";

export const meteor: DefenseSystem = {
  slug: "meteor",
  name: "Meteor",
  designation: "BVRAAM — Beyond Visual Range Air-to-Air Missile",
  reference: "PNP-MSL-001",
  category: "missile",
  missileRole: "AAM",
  classLabel: "Missile air-air longue portée à statoréacteur",
  country: "Europe",
  flag: "🇪🇺",
  manufacturer: "MBDA",
  introduced: "2016",
  status: "En service — Eurofighter, Rafale, Gripen ; intégration F-35 en cours",
  acquisitionModes: ["cooperatif"],
  tagline:
    "Le seul missile air-air longue portée à propulsion ramjet en service — l'engagement BVR pensé comme un avantage industriel européen partagé.",
  summary:
    "Meteor est l'AAM longue portée développé en coopération par six nations européennes — Royaume-Uni, France, Allemagne, Italie, Espagne, Suède — sous maîtrise d'œuvre MBDA. Sa singularité tient au mode de propulsion : un statoréacteur à débit variable (variable flow ducted rocket) qui maintient la poussée tout au long du vol, là où un missile à propergol solide finit en vol balistique.\n\nL'effet stratégique se nomme « no-escape zone » : la zone dans laquelle une cible ne peut pas s'échapper par la manœuvre, parce que le missile garde de l'énergie là où ses concurrents la perdent. Meteor n'est pas un objet isolé : il s'intègre au Rafale, à l'Eurofighter, au Gripen, et est en cours d'intégration sur le F-35 — un fait industriel autant que tactique, qui change la donne de la supériorité aérienne occidentale hors écosystème américain.",
  keySpecs: [
    {
      label: "Mode de propulsion",
      value: "Statoréacteur à débit variable — ducted rocket Bayern-Chemie",
      confidence: "haute",
      note: "Maintient la poussée en croisière, là où les MRAAM classiques deviennent balistiques.",
      sources: ["mbda-meteor"],
    },
    {
      label: "Guidage",
      value: "Inertiel + datalink bidirectionnel + autodirecteur RF actif terminal",
      confidence: "haute",
      sources: ["mbda-meteor"],
    },
    {
      label: "Classe de portée publique",
      value: "Longue portée — la valeur exacte dépend du profil de tir",
      confidence: "moyenne",
      status: "variable",
      sources: ["mbda-meteor"],
    },
    {
      label: "Charge militaire",
      value: "Blast-fragmentation avec fusée de proximité",
      confidence: "haute",
      sources: ["mbda-meteor"],
    },
    {
      label: "Plateformes intégrées",
      value: "Rafale, Eurofighter Typhoon, JAS 39 Gripen E/F ; F-35 en intégration",
      confidence: "haute",
      sources: ["mbda-meteor", "mbda-f35"],
    },
    {
      label: "No-escape zone",
      value: "Annoncée supérieure à celle des MRAAM en service",
      confidence: "moyenne",
      note: "Valeur publique, non chiffrée — la mesure exacte reste classifiée.",
      sources: ["mbda-meteor"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Meteor n'est pas vendu à l'unité dans le domaine public : il est livré par lots dans le cadre des contrats nationaux et des intégrations de plateforme. Son coût unitaire est donc une estimation contractuelle, pas un prix flyaway publié.\n\nLa logique économique est celle d'un effecteur premium : un missile plus cher qu'un AMRAAM, justifié par la portée utile et la résilience face aux contre-mesures. Le coût se lit en rapport à l'avantage tactique qu'il procure — pas en comparaison brute.",
      indicators: [
        {
          label: "Coût unitaire public",
          value: "Non publié — livraison par lots contractuels",
          confidence: "faible",
          status: "variable",
          sources: ["mbda-meteor"],
        },
        {
          label: "Lecture économique",
          value: "Effecteur premium — coût justifié par la no-escape zone et l'ECCM",
          confidence: "moyenne",
          sources: ["mbda-meteor"],
        },
        {
          label: "Coût de soutien",
          value: "Inclus dans les contrats d'intégration et MCO des plateformes",
          confidence: "moyenne",
          sources: ["mbda-meteor"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Meteor est le produit d'une coopération européenne — six nations, financement partagé, OCCAR puis MBDA comme guichet industriel unique. Ce modèle distribue le risque-programme et bétonne le carnet de commandes par la base nationale de chaque participant.\n\nL'effet est durable : chaque montée en standard ou en intégration plateforme — F-35, drone wingman demain — passe par MBDA, ce qui consolide la rente industrielle européenne dans le segment longue portée.",
      indicators: [
        {
          label: "Modèle de financement",
          value: "Coopération à 6 nations — UK, FR, DE, IT, ES, SE",
          confidence: "haute",
          sources: ["mbda-meteor"],
        },
        {
          label: "Maître d'œuvre",
          value: "MBDA — consortium européen",
          confidence: "haute",
          sources: ["mbda-meteor"],
        },
        {
          label: "Effet stratégique",
          value:
            "Verrouille l'effecteur BVR européen face aux alternatives US (AMRAAM, AIM-260 à venir)",
          confidence: "moyenne",
          sources: ["mbda-meteor"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne de Meteor est l'un des rares cas où l'Europe maîtrise un nœud techno-critique de bout en bout : le statoréacteur. Bayern-Chemie (groupe MBDA Deutschland) en porte la propulsion ; l'autodirecteur, la fusée, le datalink et l'intégration relèvent du périmètre MBDA et de ses sous-traitants nationaux.\n\nLe risque industriel principal n'est pas la dépendance étrangère, mais la cadence : la base européenne du ramjet est plus étroite que celle des moteurs à propergol solide US, et la montée en production en cas de conflit de haute intensité est un sujet ouvert.",
      indicators: [
        {
          label: "Propulsion ramjet",
          value: "Bayern-Chemie — base industrielle européenne souveraine",
          confidence: "haute",
          sources: ["mbda-meteor"],
        },
        {
          label: "Autodirecteur RF actif",
          value: "Capacité MBDA — chaîne RF européenne",
          confidence: "moyenne",
          sources: ["mbda-meteor"],
        },
        {
          label: "Risque industriel principal",
          value: "Cadence de production en environnement de haute intensité",
          confidence: "moyenne",
          sources: ["mbda-meteor"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Acheter Meteor, c'est s'inscrire dans l'écosystème AAM européen et adopter un effecteur qui n'est pas soumis à l'ITAR. Pour les nations qui exploitent un Rafale, un Eurofighter ou un Gripen, c'est la voie naturelle ; pour celles qui exploitent un F-35, c'est l'élément qui transforme la plateforme américaine en un système partiellement européen.\n\nL'intégration Meteor sur F-35 — engagée pour des utilisateurs européens — est à ce titre un signal politique autant que technique : elle dit qu'on peut acheter US sans s'enfermer dans l'arsenal US.",
      indicators: [
        {
          label: "Régime applicable",
          value: "Européen — hors ITAR américain",
          confidence: "haute",
          sources: ["mbda-meteor"],
        },
        {
          label: "Effet politique",
          value:
            "Permet à des opérateurs F-35 de conserver un AAM longue portée non US",
          confidence: "moyenne",
          sources: ["mbda-f35"],
        },
        {
          label: "Position dans l'écosystème",
          value: "Pilier de l'autonomie air-air européenne",
          confidence: "haute",
          sources: ["mbda-meteor"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Meteor est exportable, mais via les plateformes qui l'embarquent — il suit les contrats Rafale, Eurofighter, Gripen. La nation cliente accède à Meteor parce qu'elle achète l'avion qui le tire. Cette logique de bundle plateforme + effecteur est devenue la norme du segment longue portée européen.\n\nLes contrôles applicables relèvent des régimes nationaux des six co-développeurs et du régime export européen — Position commune 2008/944/PESC, liste militaire commune — sans contrainte ITAR.",
      indicators: [
        {
          label: "Modalité d'export",
          value: "Lié aux contrats de plateforme — Rafale, Eurofighter, Gripen",
          confidence: "haute",
          sources: ["mbda-meteor"],
        },
        {
          label: "Régime applicable",
          value: "Contrôles nationaux + Position commune UE 2008/944/PESC",
          confidence: "haute",
          sources: ["eu-cp-944"],
        },
        {
          label: "Utilisateurs export connus",
          value: "Toute nation Rafale, Eurofighter ou Gripen E/F sous accord",
          confidence: "haute",
          sources: ["mbda-meteor"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "Meteor en service",
      value:
        "Standard initial — Eurofighter, Rafale (depuis F3R), Gripen E/F",
      confidence: "haute",
      sources: ["mbda-meteor"],
    },
    {
      label: "Intégration F-35",
      value:
        "Travaux engagés pour utilisateurs européens — emport en soute interne, contraintes dimensionnelles",
      confidence: "moyenne",
      sources: ["mbda-f35"],
    },
    {
      label: "Évolutions futures",
      value:
        "Software upgrades, capteurs et datalink — détails publics partiels",
      confidence: "faible",
      status: "a-recouper",
      sources: ["mbda-meteor"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Effecteur premium dont l'efficacité tient à la no-escape zone et à la résilience ECCM ; le prix unitaire reste élevé et non public.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "L'autodirecteur actif, le datalink bidirectionnel et la propulsion ramjet rendent l'évitement difficile ; les contre-mesures les plus avancées restent une zone classifiée.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Hors ITAR, lié aux plateformes européennes, contrôlé par les régimes nationaux et la Position commune UE — exportable largement.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Maîtrise européenne complète du ramjet et de l'intégration ; la cadence en haute intensité reste le point de vigilance.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2016 sur trois plateformes opérationnelles, montée en intégration F-35 engagée.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Constructeur et programmes nationaux publient l'essentiel ; chiffres précis de portée et de NEZ restent classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un missile « hors catégorie » qui surclasserait tout ce qui vole. La réalité : un missile remarquable parce qu'il garde de l'énergie en croisière — la no-escape zone se mesure en doctrine, pas en table de performance comparée.",
    bestUseCase:
      "Engager une cible aérienne à longue distance avec une probabilité d'évitement par manœuvre la plus basse possible — sur Rafale, Eurofighter, Gripen ou F-35 européen intégré.",
    weakPoint:
      "La base industrielle ramjet plus étroite que celle des moteurs solide US — la cadence en environnement de haute intensité reste un sujet ouvert.",
    analystNote:
      "L'intégration Meteor sur F-35 est la donnée à suivre. Elle transforme un avion américain en plateforme partiellement européenne — c'est un fait industriel, un effet politique, et un point de levier pour MBDA dans la prochaine décennie.",
  },
  operators: [
    "Royaume-Uni",
    "France",
    "Allemagne",
    "Italie",
    "Espagne",
    "Suède",
    "Inde (Rafale)",
    "Qatar (Rafale)",
    "Croatie (Rafale)",
    "Grèce (Rafale)",
  ],
  theatres: ["Pas d'emploi en combat documenté à ce jour"],
  timeline: [
    {
      date: "2016",
      label: "Entrée en service initiale sur JAS 39 Gripen — Suède.",
      kind: "jalon",
    },
    {
      date: "2018",
      label: "Qualification opérationnelle sur Eurofighter Typhoon.",
      kind: "jalon",
    },
    {
      date: "2018",
      label: "Intégration Rafale au standard F3R — DGA et Dassault.",
      kind: "jalon",
    },
    {
      date: "2023",
      label:
        "Annonce de l'intégration Meteor sur F-35 pour utilisateurs européens.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "mbda-meteor",
      title: "Meteor — datasheet et page produit",
      publisher: "MBDA",
      type: "constructeur",
      reliability: "B",
      url: "https://www.mbda-systems.com/product/meteor/",
    },
    {
      id: "mbda-f35",
      title: "Meteor integration onto F-35",
      publisher: "MBDA",
      type: "constructeur",
      reliability: "B",
      url: "https://www.mbda-systems.com/",
    },
    {
      id: "eu-cp-944",
      title:
        "Position commune 2008/944/PESC — règles communes régissant le contrôle des exportations de technologie et d'équipements militaires",
      publisher: "Conseil de l'Union européenne",
      type: "officiel",
      reliability: "A",
      url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32008E0944",
    },
  ],
  updated: "2026-05-26",
};
