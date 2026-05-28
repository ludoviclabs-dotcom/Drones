import type { DefenseSystem } from "../types";

export const anApg81: DefenseSystem = {
  slug: "an-apg-81",
  name: "AN/APG-81",
  designation: "AN/APG-81 AESA radar",
  reference: "PNP-RD-014",
  category: "radar",
  radarRole: "aeroporte-aesa",
  classLabel:
    "Radar AESA aéroporté bande X — capteur principal du F-35 Lightning II, multifonction radar / SAR / GMTI / EW",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Northrop Grumman",
  introduced: "2006 (premier vol F-35 AA-1)",
  status:
    "En service — capteur principal des trois variantes F-35A / B / C, production active, mises à jour Block 4 en cours",
  acquisitionModes: ["FMS"],
  tagline:
    "Le radar AESA du chasseur le plus produit du monde occidental — air-air, SAR haute résolution, GMTI, guerre électronique et large-band communication sur la même antenne.",
  summary:
    "L'AN/APG-81 est le radar AESA bande X conçu par Northrop Grumman pour équiper le chasseur F-35 Lightning II. C'est l'un des AESA aéroportés les plus déployés au monde, avec plus de mille unités produites à mesure que la flotte F-35 augmente. Il assume simultanément des modes air-air longue portée, SAR haute résolution, GMTI multiple, EW et communication très large bande sur la même antenne.\n\nLa fiche AN/APG-81 est, pour Panoplie, celle du capteur de chasse le plus structurant de la décennie 2010-2030. Ses performances, son intégration au système Mission Systems du F-35 (notamment au DAS et à la fusion capteurs), et son ITAR maximal en font à la fois un produit stratégique américain et un objet de dépendance pour les nations alliées qui choisissent le F-35.",
  keySpecs: [
    {
      label: "Architecture",
      value:
        "AESA bande X — antenne fixe à modules T/R, intégrée au nez du F-35",
      confidence: "haute",
      sources: ["northrop-apg81"],
    },
    {
      label: "Portée publique",
      value:
        "> 150 km en mode air-air contre cibles standard (sources publiques ouvertes)",
      confidence: "moyenne",
      sources: ["public-apg81-range"],
    },
    {
      label: "Capacités simultanées",
      value:
        "Air-air longue portée, SAR haute résolution, GMTI multiple, EW / EA, large-band communication — déclarées simultanées",
      confidence: "haute",
      sources: ["northrop-apg81"],
    },
    {
      label: "Plateforme",
      value: "F-35 Lightning II (variantes A, B, C)",
      confidence: "haute",
      sources: ["northrop-apg81"],
    },
    {
      label: "Variantes documentées",
      value:
        "AN/APG-81 — modernisation continue par baselines logicielles Block 3F, Block 4",
      confidence: "haute",
      sources: ["public-apg81-blocks"],
    },
    {
      label: "Intégration capteurs",
      value:
        "DAS, EOTS, MADL, Link 16 — fusion capteurs complète au sein du Mission Systems F-35",
      confidence: "haute",
      sources: ["northrop-apg81"],
    },
    {
      label: "Technologie RF",
      value:
        "Modules T/R bande X — GaAs originel, transition GaN sur baselines récentes (détail non précisé homogène)",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["northrop-apg81"],
    },
    {
      label: "PRF, formes d'onde, ECCM précis",
      value: "Classifiés",
      confidence: "faible",
      status: "variable",
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût AN/APG-81 n'est pas publié de façon homogène par Northrop Grumman, le programme F-35 traitant le capteur comme une brique interne au Mission Systems. Les ordres de grandeur estimés tournent autour de 4-8 M$ par unité capteur intégré, avec une variabilité forte selon la baseline (Block 3F, Block 4) et le volume de production.\n\nLa lecture coût n'a de sens qu'au niveau du F-35 complet. Les justifications budgétaires DoD publient le coût unitaire du chasseur (≈ 80-110 M$ selon variante et année), avec une part radar généralement estimée à 5-10 %. Le MCO du capteur est intégré au MCO du F-35, lui-même structurant pour le coût total de possession de la flotte alliée.",
      indicators: [
        {
          label: "Coût unitaire capteur — estimation publique",
          value:
            "≈ 4 à 8 M$ par unité intégrée selon baseline et volume",
          confidence: "faible",
          status: "variable",
          sources: ["dod-budget-f35"],
        },
        {
          label: "Part dans le coût F-35 complet",
          value:
            "≈ 5 à 10 % du coût unitaire chasseur (estimation analyste)",
          confidence: "faible",
          status: "variable",
          sources: ["dod-budget-f35"],
        },
        {
          label: "MCO pluriannuel",
          value:
            "Intégré au MCO F-35 — capteur indissociable du Mission Systems",
          confidence: "haute",
          sources: ["dod-budget-f35"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "L'AN/APG-81 est financé via le programme F-35 sous prime contractor Lockheed Martin, Northrop Grumman étant prime du Mission Systems incluant le radar. Les justifications budgétaires DoD annuelles documentent les volumes, les baselines et le soutien. C'est l'un des programmes radar aéroportés les mieux tracés publiquement à l'échelle macro.\n\nLa montée en cadence post-2010 a fait passer la production de quelques dizaines à plusieurs centaines d'unités par an. La modernisation Block 4 documente la continuité du programme jusqu'aux années 2040+. Les ventes export F-35 ajoutent un volume substantiel sans modifier la chaîne capteur, sous contrôle ITAR strict.",
      indicators: [
        {
          label: "Financeur principal",
          value:
            "US DoD via programme F-35 — prime Lockheed Martin, Mission Systems Northrop Grumman",
          confidence: "haute",
          sources: ["dod-budget-f35"],
        },
        {
          label: "Cadence de production",
          value:
            "Plusieurs centaines d'unités par an depuis la décennie 2020",
          confidence: "moyenne",
          sources: ["dod-budget-f35"],
        },
        {
          label: "Modernisation Block 4",
          value:
            "Continuité du programme jusqu'aux années 2040+ — extension capacités radar et EW",
          confidence: "haute",
          sources: ["public-apg81-blocks"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne AN/APG-81 est entièrement américaine, intégrée par Northrop Grumman. Les modules T/R, le packaging RF, les calculateurs DSP et le logiciel sont produits sous contrôle US strict, conforme à la pratique sur les capteurs F-35. La transition GaAs → GaN partielle sur les baselines récentes accroît la pression sur les fonderies RF avancées partagées avec SPY-6, LTAMDS et autres grands programmes US.\n\nLe risque industriel principal est celui de la cadence : la production F-35 monte en charge progressivement, et le capteur radar partage des composants critiques avec plusieurs autres programmes RTX / Northrop / RTX. La résilience de la chaîne dépend de la santé des fonderies microélectroniques RF américaines.",
      indicators: [
        {
          label: "Empreinte industrielle",
          value:
            "Northrop Grumman — chaîne entièrement américaine, classification renforcée",
          confidence: "haute",
          sources: ["northrop-apg81"],
        },
        {
          label: "Technologie RF",
          value:
            "GaAs historique, transition GaN partielle sur baselines récentes",
          confidence: "moyenne",
          status: "a-recouper",
          sources: ["northrop-apg81"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Cadence partagée avec SPY-6, LTAMDS, LRDR ; pression sur fonderies RF avancées",
          confidence: "moyenne",
          sources: ["northrop-apg81"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "L'AN/APG-81 est indissociable du F-35 et porte par conséquent toute la charge géopolitique du programme : alignement profond avec les États-Unis, dépendance pour les baselines logicielles et les mises à jour, intégration ALIS / ODIN, partage de données de mission. Choisir le F-35, c'est choisir d'avoir un radar sous contrôle américain pour les trente prochaines années.\n\nPour les alliés F-35 (Royaume-Uni, Australie, Canada, Norvège, Italie, Pays-Bas, Japon, Corée du Sud, Israël, Pologne, Allemagne, Finlande, Suisse, autres), le capteur conditionne l'autonomie d'emploi : les modes radar disponibles, les mises à jour des bibliothèques de menaces, et la capacité à opérer en environnement contesté dépendent de l'écosystème Lockheed / Northrop. C'est l'un des cas-école les plus denses de la brique géopolitique Panoplie.",
      indicators: [
        {
          label: "Position stratégique",
          value:
            "Capteur indissociable du F-35 — porte toute la charge géopolitique du programme",
          confidence: "haute",
          sources: ["dod-budget-f35", "northrop-apg81"],
        },
        {
          label: "Dépendance baseline",
          value:
            "Modes radar et mises à jour conditionnés par l'écosystème Lockheed / Northrop / DoD",
          confidence: "haute",
          sources: ["public-apg81-blocks"],
        },
        {
          label: "Régime applicable",
          value:
            "ITAR niveau maximal — capteur stratégique sous contrôle Department of State strict",
          confidence: "haute",
          sources: ["itar-radar"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export AN/APG-81 suit l'export F-35. Les nations alliées qui acquièrent le F-35 reçoivent automatiquement le capteur dans la baseline logicielle correspondante (Block 3F, Block 4 progressivement). Le capteur n'est jamais vendu seul. Les notifications DSCA documentent les volumes par client et la baseline retenue.\n\nLe régime applicable est ITAR au niveau maximal, conforme à la pratique sur les composants F-35. Chaque transfert engage la diplomatie américaine et conditionne l'accès aux mises à jour pluriannuelles. L'exportabilité est large dans son cercle (≈ 15-20 nations alliées F-35), mais nulle hors de ce cercle.",
      indicators: [
        {
          label: "Canal d'export",
          value:
            "FMS — couplé à l'export F-35, capteur jamais vendu seul",
          confidence: "haute",
          sources: ["dod-budget-f35"],
        },
        {
          label: "Nombre de nations alliées F-35",
          value:
            "≈ 15 à 20 nations — Royaume-Uni, Australie, Canada, Norvège, Italie, Pays-Bas, Japon, Corée du Sud, Israël, Pologne, Allemagne, Finlande, Suisse, Belgique, Danemark, République tchèque, Roumanie, Grèce, autres",
          confidence: "haute",
          sources: ["dod-budget-f35", "dsca-f35"],
        },
        {
          label: "Régime applicable",
          value:
            "ITAR niveau maximal — capteur stratégique F-35, contrôle Department of State strict",
          confidence: "haute",
          sources: ["itar-radar"],
        },
      ],
    },
  ],
  integrationFrameworks: [
    "F-35 Mission Systems (Lockheed Martin / Northrop Grumman)",
    "ALIS / ODIN (logistique et mise à jour)",
    "Link 16 / MADL",
    "NATINAMDS (via plateforme F-35)",
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Capteur AESA aéroporté de classe mondiale, indissociable du F-35 ; l'équation coût-effet se lit au niveau du chasseur complet.",
    },
    {
      key: "survivabilite",
      grade: "A",
      rationale:
        "AESA agile + EW/EA simultanés sur plateforme furtive — combinaison défensive et offensive très forte ; performances précises classifiées.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "ITAR maximal mais déploiement large dans le cercle des alliés F-35 ; nul hors de ce cercle.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Northrop Grumman intégration verticale, mais cadence partagée avec d'autres grands programmes radar US et pression fonderies RF.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2006, plus de mille unités produites, modernisation Block 4 en cours — pleinement mature.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources Northrop Grumman et DoD abondantes sur le rôle et l'architecture macro, mais paramètres techniques fins classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un AESA « miracle » qui voit tout, partout. La réalité : un excellent capteur AESA bande X dont la valeur opérationnelle dépend autant de la fusion capteurs F-35 (DAS, EOTS, MADL) et des baselines logicielles que de l'antenne. Les modes restreints peuvent être réservés aux US Forces.",
    bestUseCase:
      "Équiper une nation alliée d'un capteur AESA aéroporté de classe mondiale, intégré dans l'écosystème F-35 — au prix d'un alignement américain profond et de longue durée.",
    weakPoint:
      "L'ITAR maximal et la dépendance baseline — chaque mise à jour Block, chaque modification de bibliothèque de menaces, chaque mode classifié reste sous contrôle américain. C'est le cas le plus extrême de la dépendance capteur US.",
    analystNote:
      "AN/APG-81 est l'archétype du capteur AESA aéroporté américain de référence. Pour Panoplie, c'est un cas-école géopolitique majeur : adopter ce radar, c'est adopter la dépendance F-35 jusqu'aux années 2050. La fiche est indissociable de la fiche F-35.",
  },
  operators: [
    "États-Unis (USAF, USMC, USN)",
    "Royaume-Uni",
    "Australie",
    "Canada",
    "Norvège",
    "Italie",
    "Pays-Bas",
    "Japon",
    "Corée du Sud",
    "Israël",
    "Pologne",
    "Allemagne",
    "Finlande",
    "Suisse",
    "Belgique",
    "Danemark",
    "Autres alliés F-35 — détail variable selon livraisons",
  ],
  theatres: [
    "Pacifique — déploiement F-35A / B / C américain et alliés",
    "Europe — déploiement F-35 OTAN, particulièrement flanc Est",
    "Moyen-Orient — F-35 israélien (employé opérationnellement, dont engagement Iran 2024-2025)",
  ],
  timeline: [
    {
      date: "2006",
      label:
        "Premier vol du F-35 AA-1 — premier emploi de l'AN/APG-81.",
      kind: "jalon",
    },
    {
      date: "2015",
      label:
        "Initial Operating Capability USMC F-35B — capteur opérationnel pour US Marines.",
      kind: "jalon",
    },
    {
      date: "2016",
      label:
        "Initial Operating Capability USAF F-35A — déploiement opérationnel US Air Force.",
      kind: "jalon",
    },
    {
      date: "2021",
      label:
        "Premiers engagements opérationnels documentés — F-35 israélien.",
      kind: "emploi",
    },
    {
      date: "2025",
      label:
        "Modernisation Block 4 en cours — capacités radar et EW étendues.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "northrop-apg81",
      title: "AN/APG-81 — page Northrop Grumman",
      publisher: "Northrop Grumman",
      type: "constructeur",
      reliability: "B",
      url: "https://www.northropgrumman.com/what-we-do/air/an-apg-81-aesa-radar",
    },
    {
      id: "dod-budget-f35",
      title: "DoD Procurement Justification Books — F-35 program",
      publisher: "DoD Comptroller — Office of the Under Secretary of Defense",
      type: "officiel",
      reliability: "A",
      url: "https://comptroller.defense.gov/Budget-Materials/",
    },
    {
      id: "dsca-f35",
      title: "DSCA F-35 FMS notifications to Congress",
      publisher: "Defense Security Cooperation Agency",
      type: "officiel",
      reliability: "A",
      url: "https://www.dsca.mil/press-media/major-arms-sales",
    },
    {
      id: "public-apg81-range",
      title:
        "AN/APG-81 portée et performances — analyses publiques tierces",
      publisher: "Sources publiques tierces",
      type: "think-tank",
      reliability: "B",
    },
    {
      id: "public-apg81-blocks",
      title:
        "F-35 Block 4 modernization — communications JPO et analyses ouvertes",
      publisher: "F-35 Joint Program Office / presse spécialisée",
      type: "officiel",
      reliability: "A",
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
