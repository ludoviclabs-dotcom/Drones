import type { DefenseSystem } from "../types";

export const nsm: DefenseSystem = {
  slug: "nsm",
  name: "NSM / JSM",
  designation: "Naval Strike Missile / Joint Strike Missile",
  reference: "PNP-MSL-011",
  category: "missile",
  missileRole: "ASM",
  classLabel:
    "Missile anti-navire et frappe terrestre standoff — surface- et air-launch",
  country: "Norvège",
  flag: "🇳🇴",
  manufacturer: "Kongsberg Defence & Aerospace",
  introduced: "2012",
  status:
    "En service — NSM batteries côtières et navires ; JSM en intégration F-35 (soute interne)",
  acquisitionModes: ["DCS", "cooperatif"],
  tagline:
    "Le missile anti-navire et frappe terrestre furtif scandinave — entièrement passif, sea-skimming, désormais l'option non-Harpoon de référence dans l'OTAN.",
  summary:
    "NSM est le missile anti-navire de cinquième génération développé par Kongsberg, conçu pour la frappe maritime et littorale dans un environnement saturé d'ECM. Sa caractéristique structurante : il est entièrement passif — pas de radar actif émetteur, navigation par INS + GNSS + terrain matching, et autodirecteur imageur IR avec automatic target recognition (ATR). Cela en fait l'un des missiles les plus difficiles à détecter et à brouiller du segment.\n\nJSM — Joint Strike Missile — est la déclinaison air-launch dérivée de NSM, conçue pour l'emport en soute interne du F-35. Son architecture passive, sa portée publique > 350 km et sa capacité de frappe terrestre comme maritime en font l'effecteur standoff naturel pour les opérateurs F-35 alliés. La sélection allemande récente du JSM confirme la trajectoire — NSM/JSM devient l'option crédible non-US et non-européenne classique dans l'arsenal allié.",
  keySpecs: [
    {
      label: "Architecture",
      value:
        "Entièrement passif — pas d'émission radar active, vol sea-skimming",
      confidence: "haute",
      sources: ["kongsberg-nsm"],
    },
    {
      label: "Guidage",
      value:
        "INS + GNSS + terrain matching + autodirecteur IR imageur + ATR",
      confidence: "haute",
      sources: ["kongsberg-nsm"],
    },
    {
      label: "Portée publique",
      value: "> 200 km (NSM) ; > 350 km (JSM)",
      confidence: "haute",
      sources: ["kongsberg-nsm", "kongsberg-jsm"],
    },
    {
      label: "Cibles primaires",
      value:
        "Navires de surface, cibles terrestres littorales — capacité multi-rôle",
      confidence: "haute",
      sources: ["kongsberg-nsm"],
    },
    {
      label: "Plateformes NSM",
      value:
        "Frégates Fridtjof Nansen, LCS US Navy, Constellation FFG, batteries côtières Norvège, Roumanie, Pologne",
      confidence: "haute",
      sources: ["kongsberg-nsm"],
    },
    {
      label: "Plateforme JSM",
      value:
        "F-35A — emport en soute interne (2 missiles) ; intégration F-35 sélectionnée par plusieurs nations",
      confidence: "haute",
      sources: ["kongsberg-jsm"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "NSM et JSM sont commercialisés par Kongsberg en contrats nationaux ou par DCS. Les coûts publics se lisent par batterie côtière ou par lot de missiles — la marine américaine publie une demande FY2026 d'environ 32 M$ pour 16 missiles NSM, soit un coût budgétaire moyen de l'ordre de 2 M$.\n\nC'est un missile cher par rapport au Harpoon historique mais nettement moins coûteux qu'un Tomahawk ou un LRASM. Sa valeur économique se mesure aussi à la mutualisation surface + air — la même famille équipe batteries côtières, frégates et F-35.",
      indicators: [
        {
          label: "Coût net procurement unitaire FY2026 (NSM US Navy)",
          value: "≈ 2,01 M$ par missile",
          confidence: "haute",
          note: "32,238 M$ / 16 missiles — demande FY2026.",
          sources: ["dod-p1-fy26-nsm"],
        },
        {
          label: "Type de coût publié",
          value: "Net procurement — coût budgétaire moyen US Navy",
          confidence: "haute",
          sources: ["dod-p1-fy26-nsm"],
        },
        {
          label: "Lecture économique",
          value:
            "Effecteur standoff intermédiaire — mutualisation surface, naval, air",
          confidence: "moyenne",
          sources: ["kongsberg-nsm"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Kongsberg a engagé une expansion industrielle majeure pour répondre à la demande NSM/JSM — montée en cadence en Norvège, partenariats industriels avec RTX aux États-Unis (production de composants), et discussions de localisation en Pologne.\n\nLa sélection allemande du JSM (annoncée 2024) et la commande pour les Constellation FFG américaines transforment Kongsberg en l'un des trois ou quatre fournisseurs majeurs du segment occidental, aux côtés de Lockheed (LRASM), MBDA (Exocet), Boeing (Harpoon successeur).",
      indicators: [
        {
          label: "Maîtrise programme",
          value:
            "Kongsberg Defence & Aerospace — Norvège",
          confidence: "haute",
          sources: ["kongsberg-nsm"],
        },
        {
          label: "Volume US Navy FY2026",
          value: "16 missiles NSM — frégates et LCS",
          confidence: "haute",
          sources: ["dod-p1-fy26-nsm"],
        },
        {
          label: "Effort industriel",
          value:
            "Expansion Norvège + partenariats RTX US + discussions Pologne",
          confidence: "haute",
          sources: ["kongsberg-nsm"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne NSM/JSM est norvégienne de cœur, avec un réseau de sous-traitants nordiques et européens, et un partenariat industriel structuré avec RTX aux États-Unis pour la production de composants destinés à la marine américaine.\n\nLes nœuds critiques : autodirecteur IR imageur, calculateur de navigation avec ATR, turbojet, structure composite. Aucun composant critique n'est soumis à l'ITAR ; la chaîne reste sous contrôle norvégien et européen. C'est l'un des arguments centraux face au Harpoon successeur — autonomie OTAN sans Washington dans la boucle de transfert.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Kongsberg Defence & Aerospace",
          confidence: "haute",
          sources: ["kongsberg-nsm"],
        },
        {
          label: "Composants critiques",
          value:
            "Autodirecteur IR imageur, ATR, turbojet, navigation hybride",
          confidence: "haute",
          sources: ["kongsberg-nsm"],
        },
        {
          label: "Partenariat US",
          value: "RTX — production de composants pour la US Navy",
          confidence: "haute",
          sources: ["kongsberg-nsm"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "NSM/JSM occupe une place singulière dans l'OTAN : non-US, non-ITAR, conçu en Norvège, déployé aux États-Unis, sélectionné par l'Allemagne pour son F-35, opéré par la Pologne et la Roumanie en défense côtière. C'est l'un des rares effecteurs allié à transcender la dichotomie Europe / Amérique du Nord.\n\nL'effet stratégique tient à cette transversalité. Pour un opérateur F-35 cherchant un effecteur standoff sans dépendance ITAR, JSM est l'option crédible — et la seule à pouvoir tenir le couplage soute interne F-35 + portée publique > 350 km. C'est pour cela que l'Allemagne l'a choisi, et c'est pour cela que d'autres nations F-35 suivent.",
      indicators: [
        {
          label: "Fonction stratégique",
          value:
            "Effecteur standoff non-ITAR pour opérateurs F-35 alliés",
          confidence: "haute",
          sources: ["kongsberg-jsm"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôle norvégien + Position commune UE — hors ITAR",
          confidence: "haute",
          sources: ["eu-cp-944"],
        },
        {
          label: "Effet d'écosystème",
          value:
            "Couplage F-35 + JSM — autonomie standoff pour opérateurs européens et Pacifique",
          confidence: "haute",
          sources: ["kongsberg-jsm"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export NSM se fait principalement par DCS — contrats nationaux directs avec Kongsberg. Les utilisateurs incluent Norvège, États-Unis, Pologne, Roumanie, Allemagne, Malaisie, Australie (sélectionné pour la marine), Canada (sélection en cours).\n\nLa fiche JSM est plus contrainte par la dépendance à la trajectoire d'intégration F-35 Block 4. Mais une fois cette intégration confirmée, la sélection allemande ouvre la voie aux autres opérateurs F-35 alliés — Italie, Pays-Bas, Norvège (déjà naturel), Finlande, Suisse.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value: "DCS — contrats nationaux directs avec Kongsberg",
          confidence: "haute",
          sources: ["kongsberg-nsm"],
        },
        {
          label: "Régime applicable",
          value: "Contrôle norvégien + Position commune UE — hors ITAR",
          confidence: "haute",
          sources: ["eu-cp-944"],
        },
        {
          label: "Utilisateurs export",
          value:
            "USA, Pologne, Roumanie, Allemagne, Malaisie, Australie ; UK et CA en évaluation",
          confidence: "haute",
          sources: ["kongsberg-nsm"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "NSM",
      value:
        "Standard naval et côtier — turbojet, sea-skimming, 200+ km",
      confidence: "haute",
      sources: ["kongsberg-nsm"],
    },
    {
      label: "JSM",
      value:
        "Variante air-launch dérivée de NSM — emport en soute interne F-35, portée étendue",
      confidence: "haute",
      sources: ["kongsberg-jsm"],
    },
    {
      label: "NSM Block 1A",
      value:
        "Mise à niveau software et capteurs — déployée progressivement",
      confidence: "moyenne",
      sources: ["kongsberg-nsm"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "A",
      rationale:
        "Coût modéré pour un standoff multi-rôle ; mutualisation surface + air-launch.",
    },
    {
      key: "survivabilite",
      grade: "A",
      rationale:
        "Entièrement passif, sea-skimming, autodirecteur imageur avec ATR — l'un des effecteurs les plus difficiles à brouiller du segment.",
    },
    {
      key: "exportabilite",
      grade: "A",
      rationale:
        "Hors ITAR, multi-canal DCS, sélectionné par multiples nations OTAN et Asie-Pacifique.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne norvégienne souveraine, partenariats US et européens en montée en cadence.",
    },
    {
      key: "maturite",
      grade: "B",
      rationale:
        "NSM mature depuis 2012 ; JSM en intégration finale F-35 — montée en puissance à venir.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Kongsberg et P-1 US publient l'essentiel ; performances ECCM précises classifiées.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un Harpoon scandinave. La réalité : une autre génération technologique — l'architecture passive et l'ATR placent NSM/JSM sur un plan différent en termes de résilience aux contre-mesures modernes.",
    bestUseCase:
      "Doter une marine ou une force aérienne d'un standoff multi-rôle non-ITAR — frapper une cible navale ou côtière à 200-350 km sans émettre, sans dépendre de Washington pour le transfert.",
    weakPoint:
      "Le calendrier d'intégration JSM sur F-35 Block 4 reste un facteur limitant pour l'export massif à l'écosystème F-35 international.",
    analystNote:
      "NSM/JSM est devenu l'option crédible non-US et non-européenne classique du segment standoff. Pour un opérateur F-35 cherchant l'autonomie hors ITAR, c'est la seule réponse. À suivre : la cadence Kongsberg et l'avancée Block 4 — ils diront si JSM tient sa promesse d'arsenal partagé OTAN non US.",
  },
  operators: [
    "Norvège",
    "États-Unis (US Navy, USMC)",
    "Pologne",
    "Roumanie",
    "Allemagne (JSM sélectionné)",
    "Malaisie",
    "Australie (sélectionné)",
    "Canada (sélection en cours)",
  ],
  theatres: ["Pas d'emploi en combat documenté à ce jour"],
  timeline: [
    {
      date: "2012",
      label:
        "Mise en service initiale de NSM — frégates Fridtjof Nansen, Norvège.",
      kind: "jalon",
    },
    {
      date: "2018",
      label:
        "Sélection NSM par l'US Navy — LCS puis Constellation FFG.",
      kind: "export",
    },
    {
      date: "2022",
      label:
        "Batteries côtières NSM en Pologne et Roumanie opérationnelles.",
      kind: "emploi",
    },
    {
      date: "2024",
      label:
        "L'Allemagne sélectionne JSM pour son F-35 — décision majeure de marché.",
      kind: "export",
    },
  ],
  sources: [
    {
      id: "kongsberg-nsm",
      title: "Naval Strike Missile (NSM) — page produit",
      publisher: "Kongsberg Defence & Aerospace",
      type: "constructeur",
      reliability: "B",
      url: "https://www.kongsberg.com/kda/products/defence-and-security/missile-systems/nsm/",
    },
    {
      id: "kongsberg-jsm",
      title: "Joint Strike Missile (JSM) — page produit",
      publisher: "Kongsberg Defence & Aerospace",
      type: "constructeur",
      reliability: "B",
      url: "https://www.kongsberg.com/kda/products/defence-and-security/missile-systems/jsm/",
    },
    {
      id: "dod-p1-fy26-nsm",
      title: "FY2026 Procurement Justification Book — NSM line item",
      publisher: "DoD Comptroller — Office of the Under Secretary of Defense",
      type: "officiel",
      reliability: "A",
      url: "https://comptroller.defense.gov/Budget-Materials/",
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
