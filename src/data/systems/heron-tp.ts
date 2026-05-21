import type { DefenseSystem } from "../types";

export const heronTp: DefenseSystem = {
  slug: "heron-tp",
  name: "Heron TP",
  designation: "IAI Eitan",
  reference: "PNP-DR-013",
  category: "drone",
  droneClass: "MALE",
  classLabel: "MALE-HALE armé",
  country: "Israël",
  flag: "🇮🇱",
  manufacturer: "Israel Aerospace Industries",
  introduced: "2010",
  status: "En service — IDF/IAF et opérateurs export",
  acquisitionModes: ["DCS"],
  tagline:
    "Le plus grand drone israélien armable — un bombardier sans pilote qui croise au-dessus du trafic aérien civil pour frapper en profondeur.",
  summary:
    "Le Heron TP, baptisé Eitan (« inébranlable ») par Tsahal, est le sommet de la gamme drones d'Israel Aerospace Industries. Avec ses 26 mètres d'envergure, ses 5 400 kg au décollage et son turbopropulseur Pratt & Whitney de 1 200 ch, il occupe une catégorie à part : un MALE qui empiète sur le domaine HALE, capable de tenir plus de trente heures à 13 700 mètres — soit au-dessus des couloirs aériens commerciaux. Premier vol en juillet 2006, dévoilement public à Tel Nof en octobre 2007, mise en service au sein de l'escadron « White Eagle » en février 2010.\n\nLe comprendre, c'est saisir la doctrine israélienne de la frappe en profondeur déléguée à une plateforme inhabitée : charge utile d'une à près de trois tonnes, charges modulaires EO/IR, radar, ESM et renseignement électromagnétique, double système de décollage et d'atterrissage automatiques, liaison satellite. Combat-proven sur Gaza depuis Cast Lead, employé du Liban à l'Iran, le Heron TP est aussi un instrument diplomatique — loué à l'Allemagne via Airbus, convoité puis perdu par l'Inde sur fond de restrictions israéliennes de transfert technologique.",
  keySpecs: [
    {
      label: "Envergure",
      value: "26 m",
      confidence: "haute",
      sources: ["iai-heron-tp"],
    },
    {
      label: "Longueur",
      value: "14 m",
      confidence: "haute",
      sources: ["iai-heron-tp"],
    },
    {
      label: "Masse maximale au décollage",
      value: "5 400 kg",
      confidence: "haute",
      sources: ["iai-heron-tp"],
    },
    {
      label: "Charge utile",
      value: "1 000 – 2 700 kg",
      confidence: "moyenne",
      note: "Fourchette selon la configuration de mission et la quantité de carburant.",
      sources: ["iai-heron-tp", "iiss-mb"],
    },
    {
      label: "Endurance",
      value: "30 – 36 h",
      confidence: "moyenne",
      sources: ["iai-heron-tp"],
    },
    {
      label: "Plafond — vitesse",
      value: "13 700 m (45 000 ft) · 200 kt (≈ 370 km/h)",
      confidence: "haute",
      note: "Plafond au-dessus du trafic aérien commercial — atout d'intégration et de discrétion.",
      sources: ["iai-heron-tp"],
    },
    {
      label: "Motorisation",
      value: "Turbopropulseur Pratt & Whitney Canada PT6A-67A (1 200 ch), hélice propulsive 4 pales",
      confidence: "haute",
      sources: ["iai-heron-tp"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût d'un Heron TP est mal documenté, comme souvent pour les matériels israéliens : la cellule est estimée à environ 9,5 M$ par des compilations secondaires, sans confirmation par IAI ni par un client. Ce chiffre ne couvre que la plateforme — il faut y ajouter les stations sol, les charges utiles modulaires, le segment satellite et le soutien, qui font basculer le coût réel d'un système complet dans un tout autre ordre de grandeur.\n\nLes contrats export éclairent mieux la facture. L'Allemagne a signé en 2018 une location d'environ 600 M$ négociée via Airbus, complétée en 2022 par 166 M$ votés au Bundestag pour 140 unités d'armement. L'Inde avait approuvé en 2015 une enveloppe de 400 M$ pour dix Heron TP armés — accord finalement abandonné. Ces montants montrent qu'un parc opérationnel armé se chiffre en centaines de millions, très loin du prix de cellule cité isolément.",
      indicators: [
        {
          label: "Coût de cellule (estimation)",
          value: "≈ 9,5 M$",
          confidence: "moyenne",
          status: "a-recouper",
          note: "Estimation de compilation secondaire ; ni IAI ni un client ne confirment ce chiffre.",
          sources: ["globalmilitary"],
        },
        {
          label: "Contrat allemand",
          value: "≈ 600 M$ de location (2018) + 166 M$ d'armement (2022)",
          confidence: "moyenne",
          note: "Location montée via Airbus ; volet armement voté au Bundestag.",
          sources: ["bundestag", "presse-defense"],
        },
        {
          label: "Enveloppe indienne",
          value: "≈ 400 M$ pour 10 unités armées — approuvée puis abandonnée",
          confidence: "moyenne",
          sources: ["presse-defense"],
        },
        {
          label: "Coût du système complet",
          value: "Très supérieur à la cellule — stations sol, charges, SATCOM, soutien",
          confidence: "faible",
          sources: ["iiss-mb"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Côté israélien, le Heron TP est financé sur le budget de Tsahal et constitue un outil structurant de l'aviation de l'IDF/IAF — un investissement national assumé, sans montage particulier. Le programme s'inscrit dans la continuité de la gamme Heron d'IAI, dont les coûts de développement ont été largement amortis par les générations antérieures et par les ventes export.\n\nÀ l'exportation, le modèle financier privilégie la location plutôt que l'achat patrimonial. L'Allemagne illustre ce schéma : plutôt qu'acquérir les appareils, elle loue une capacité opérée dans un cadre contractuel négocié via Airbus, ce qui réduit l'engagement budgétaire initial et contourne en partie le débat politique sur l'armement de drones. Ce format de location-service déplace la charge du capital vers l'exploitation, mais lie durablement l'opérateur au constructeur et à son intégrateur européen.",
      indicators: [
        {
          label: "Financement israélien",
          value: "Budget de défense de l'IDF",
          confidence: "haute",
          sources: ["iiss-mb"],
        },
        {
          label: "Modèle export dominant",
          value: "Location de capacité — souvent via un intégrateur tiers",
          confidence: "moyenne",
          sources: ["presse-defense"],
        },
        {
          label: "Cas allemand",
          value: "Location opérée dans un cadre contractuel monté avec Airbus",
          confidence: "moyenne",
          sources: ["bundestag", "presse-defense"],
        },
        {
          label: "Amortissement du développement",
          value: "Mutualisé sur la gamme Heron d'IAI",
          confidence: "faible",
          sources: ["iai-heron-tp"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du Heron TP a un cœur souverain israélien : IAI Malat conçoit, intègre et assemble la plateforme, ses charges utiles et son segment de mission. Le principal nœud extérieur est la motorisation — le turbopropulseur PT6A-67A est fourni par Pratt & Whitney Canada, moteur civil-militaire très répandu dont la disponibilité n'est pas un point de fragilité particulier.\n\nLes exports ajoutent une couche industrielle locale. Pour l'Allemagne, Airbus assure l'intégration et l'opération tandis que Rheinmetall a été associé au volet armement et soutien — une condition fréquente des contrats européens, qui exigent un ancrage industriel national. Cette architecture maintient la maîtrise des briques sensibles chez IAI tout en distribuant l'exploitation et le MCO aux partenaires locaux, au prix d'une chaîne plus longue et de dépendances croisées entre constructeur, intégrateur et client.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "IAI Malat (Israël) — cellule, charges utiles, intégration",
          confidence: "haute",
          sources: ["iai-heron-tp"],
        },
        {
          label: "Motorisation",
          value: "Pratt & Whitney Canada PT6A-67A",
          confidence: "haute",
          note: "Turbopropulseur largement diffusé — risque d'approvisionnement faible.",
          sources: ["iai-heron-tp"],
        },
        {
          label: "Partenaires export",
          value: "Airbus (intégration/opération) · Rheinmetall (armement, soutien)",
          confidence: "moyenne",
          sources: ["presse-defense"],
        },
        {
          label: "Dépendance extra-israélienne",
          value: "Limitée — concentrée sur le moteur",
          confidence: "moyenne",
          sources: ["iiss-mb"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Pour Israël, le Heron TP est un instrument de frappe en profondeur : une plateforme inhabitée capable d'aller loin, de rester longtemps et d'emporter une charge utile lourde, employée du Liban à l'Iran lors de l'opération Rising Lion en juin 2025. Il prolonge la doctrine israélienne d'allègement du risque pilote sur les missions sensibles, en complément ou en substitut de l'aviation habitée.\n\nLe Heron TP est aussi un levier diplomatique. Sa vente ou sa location consolide des relations bilatérales — l'Allemagne en a fait un dossier politique majeur — mais elle reste soumise aux restrictions israéliennes de transfert technologique : Israël protège strictement ses technologies « advanced », ce qui a fait capoter l'accord indien de 2015. Le drone devient ainsi un objet à double tranchant : carte de coopération avec un partenaire, et démonstration des limites que Jérusalem impose à la diffusion de ses savoir-faire les plus sensibles.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Frappe et renseignement en profondeur — du Liban à l'Iran",
          confidence: "moyenne",
          sources: ["iiss-mb", "presse-defense"],
        },
        {
          label: "Levier diplomatique",
          value: "Dossier bilatéral structurant (Allemagne, Inde)",
          confidence: "moyenne",
          sources: ["presse-defense"],
        },
        {
          label: "Restrictions de transfert",
          value: "Protection israélienne des technologies « advanced »",
          confidence: "moyenne",
          note: "Cause de l'abandon de l'accord indien de 2015.",
          sources: ["presse-defense"],
        },
        {
          label: "Emploi en Iran",
          value: "Opération Rising Lion (juin 2025)",
          confidence: "faible",
          status: "a-recouper",
          note: "Emploi récent rapporté par la presse — à confirmer par des sources indépendantes.",
          sources: ["presse-defense"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Heron TP s'exporte par voie directe (DCS) sous le régime de contrôle israélien DECA, sans passer par un mécanisme de type FMS américain. Ses opérateurs export connus sont l'Allemagne (location via Airbus), l'Inde (variante Heron Mk II), la Grèce (configuration maritime louée) et l'Espagne. La France a étudié le Heron TP en 2010 avant de lui préférer le Reaper américain, et la RAF britannique l'a envisagé en 2012 — deux marchés majeurs perdus.\n\nLa principale contrainte d'exportabilité est interne à Israël. Le contrôle DECA, mais surtout la politique de rétention des technologies sensibles, encadrent strictement ce qui peut être cédé : l'accord indien de 2015 portant sur dix appareils armés a été abandonné précisément parce que les restrictions israéliennes de transfert technologique étaient jugées inacceptables par New Delhi. Le Heron TP est donc un produit exportable et combat-proven, mais dont la diffusion bute sur l'arbitrage souverain israélien autant que sur la concurrence du MQ-9.",
      indicators: [
        {
          label: "Régime d'export",
          value: "DCS — contrôle israélien DECA",
          confidence: "haute",
          sources: ["iiss-mb"],
        },
        {
          label: "Opérateurs export",
          value: "Allemagne · Inde (Mk II) · Grèce (maritime) · Espagne",
          confidence: "moyenne",
          sources: ["iiss-mb", "presse-defense"],
        },
        {
          label: "Marchés perdus",
          value: "France (2010, au profit du Reaper) · RAF britannique (envisagé 2012)",
          confidence: "moyenne",
          sources: ["presse-defense"],
        },
        {
          label: "Frein à l'export",
          value: "Restrictions israéliennes de transfert de technologies sensibles",
          confidence: "moyenne",
          note: "Cause directe de l'abandon de l'accord indien de 2015.",
          sources: ["presse-defense"],
        },
      ],
      organisms: ["deca"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Charge utile et endurance qui surclassent le Reaper pour un coût de cellule estimé modéré ; mais le système complet — stations sol, charges, SATCOM — reste onéreux et le prix réel mal documenté.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Le plafond de 13 700 m place l'appareil au-dessus du trafic civil et hors de portée des défenses sol-air courtes ; il demeure vulnérable aux systèmes sol-air modernes en environnement contesté.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "Plusieurs opérateurs export et un format de location attractif, mais les restrictions israéliennes de transfert technologique brident la diffusion — l'accord indien de 2015 en est la preuve.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne maîtrisée par IAI Malat avec une seule dépendance extérieure significative — un moteur P&W Canada très répandu et peu critique pour l'approvisionnement.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2010, combat-proven sur Gaza, le Liban et l'Iran, avec des opérateurs export établis : un système pleinement éprouvé.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Caractéristiques techniques bien établies et historique d'emploi documenté ; le coût repose sur des estimations secondaires et les emplois 2025 restent à recouper.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un simple drone de surveillance de plus dans la gamme Heron. La réalité : le Heron TP est le plus grand drone israélien armable, un MALE qui empiète sur le domaine HALE — 26 m d'envergure, près de trois tonnes de charge utile possible, un plafond au-dessus des avions de ligne. C'est une plateforme de frappe en profondeur, pas un appareil tactique, et il joue dans la catégorie du MQ-9 Reaper qu'il surclasse sur l'endurance et l'emport.",
    bestUseCase:
      "La frappe et le renseignement en profondeur de longue durée : tenir une zone éloignée pendant trente heures et plus, à très haute altitude, avec une suite de capteurs modulaires (EO/IR, radar, ELINT/COMINT) et une capacité d'emport lourde — typiquement les campagnes sur Gaza, le Liban ou les frappes longue distance vers l'Iran.",
    weakPoint:
      "L'exportabilité contrainte par Israël. Le drone est techniquement abouti et combat-proven, mais sa diffusion bute sur les restrictions souveraines de transfert technologique : l'accord indien de 2015, pourtant approuvé, a été abandonné pour ce motif. Le produit est meilleur que son bilan commercial ne le laisse paraître.",
    analystNote:
      "Le Heron TP est l'un des rares drones armés qui peut prétendre, sur le papier comme au combat, surclasser le MQ-9 Reaper : davantage d'endurance, davantage de charge utile, un plafond supérieur, et un historique d'emploi dense de Gaza à l'Iran. Sa limite n'est pas technique mais politique — Israël protège jalousement ses technologies sensibles, ce qui a coûté le marché indien et explique en partie le format de location retenu en Europe. En 2026, c'est un système mature et crédible dont le plafond commercial est fixé moins par la concurrence que par l'arbitrage de Jérusalem sur ce qu'il accepte de céder.",
  },
  operators: ["Israël (IDF/IAF)", "Allemagne", "Inde", "Grèce"],
  theatres: [
    "Gaza (Cast Lead 2008-2009, Protective Edge 2014, Guardian of the Walls 2021, Breaking Dawn 2022)",
    "Liban",
    "Cisjordanie",
    "Syrie",
    "Égypte",
    "Soudan",
    "Iran (Operation Rising Lion, 2025)",
  ],
  timeline: [
    { date: "2006-07", label: "Premier vol du Heron TP / Eitan.", kind: "jalon" },
    { date: "2007-10", label: "Dévoilement public à la base aérienne de Tel Nof.", kind: "jalon" },
    { date: "2010", label: "La France écarte le Heron TP au profit du MQ-9 Reaper.", kind: "debat" },
    { date: "2010-02", label: "Mise en service dans l'IDF — escadron « White Eagle ».", kind: "jalon" },
    { date: "2015", label: "Abandon de l'accord indien (10 appareils armés) pour restrictions de transfert technologique.", kind: "export" },
    { date: "2018", label: "L'Allemagne contracte une location de Heron TP montée via Airbus.", kind: "export" },
    { date: "2025-06", label: "Emploi rapporté lors de l'opération Rising Lion contre l'Iran.", kind: "emploi" },
  ],
  sources: [
    {
      id: "iai-heron-tp",
      title: "Heron TP — Multi-Mission MALE UAS",
      publisher: "Israel Aerospace Industries",
      type: "constructeur",
      reliability: "B",
      url: "https://www.iai.co.il",
    },
    {
      id: "iiss-mb",
      title: "The Military Balance",
      publisher: "IISS",
      type: "institution",
      reliability: "A",
    },
    {
      id: "bundestag",
      title: "Débats et votes sur la location de drones Heron TP et leur armement",
      publisher: "Deutscher Bundestag",
      type: "officiel",
      reliability: "A",
      date: "2022",
    },
    {
      id: "globalmilitary",
      title: "Heron TP — fiche et estimation de coût",
      publisher: "globalmilitary.net",
      type: "presse",
      reliability: "C",
    },
    {
      id: "presse-defense",
      title: "Couverture des contrats, exports et emplois opérationnels du Heron TP",
      publisher: "Presse spécialisée défense",
      type: "presse",
      reliability: "B",
    },
  ],
  updated: "2026-05-21",
};
