import type { DefenseSystem } from "../types";

export const greenPine: DefenseSystem = {
  slug: "green-pine",
  name: "Green Pine",
  designation: "EL/M-2080 Green Pine",
  reference: "PNP-RD-012",
  category: "radar",
  radarRole: "bmd",
  classLabel:
    "Radar AESA bande L de défense antimissile balistique — capteur Arrow Weapon System",
  country: "Israël",
  flag: "🇮🇱",
  manufacturer: "IAI ELTA Systems",
  introduced: "2000",
  status:
    "En service — capteur radar du système Arrow ; variantes Block-B et Super Green Pine déployées ; exporté Inde, Corée du Sud, Azerbaïdjan",
  acquisitionModes: ["DCS", "cooperatif"],
  tagline:
    "L'autre BMD du monde occidental — un radar bande L israélien conçu pour Arrow, exporté hors écosystème américain, qui documente concrètement la souveraineté antimissile balistique non US.",
  summary:
    "Le Green Pine est le radar AESA bande L de défense antimissile balistique conçu par IAI ELTA pour le système d'armes Arrow. Doté d'une portée publique de l'ordre de 500 km en mode classique et jusqu'à 800-1 000 km sur certaines variantes (Block-B), il assume la détection, le suivi et la discrimination de menaces balistiques tactiques et intermédiaires. C'est le seul radar BMD non américain déployé en série opérationnelle dans le monde occidental.\n\nLa fiche Green Pine est, pour Panoplie, celle de la souveraineté BMD israélienne et un cas-école géopolitique majeur. Sa diffusion contrôlée — Inde (programme nucléaire et défense aérienne), Corée du Sud (Block-B), Azerbaïdjan, et l'export récent à l'Allemagne dans le cadre du programme Arrow 3 — illustre une trajectoire d'autonomie stratégique radar BMD non américaine.",
  keySpecs: [
    {
      label: "Architecture",
      value:
        "AESA bande L — antenne plane à modules T/R, panneau orientable mécaniquement",
      confidence: "haute",
      sources: ["iai-elta-green-pine"],
    },
    {
      label: "Portée publique",
      value:
        "≈ 500 km en mode classique ; jusqu'à 800 à 1 000 km sur variantes Block-B / Super Green Pine",
      confidence: "moyenne",
      sources: ["iai-elta-green-pine", "press-arrow-system"],
    },
    {
      label: "Modes opératoires",
      value:
        "Détection précoce balistique, suivi de menaces tactiques et intermédiaires, discrimination cible/leurre, guidage intercepteurs Arrow",
      confidence: "haute",
      sources: ["iai-elta-green-pine"],
    },
    {
      label: "Variantes documentées",
      value:
        "Green Pine — Block-B (portée étendue, intégrée à Arrow 2/3) — Super Green Pine (portée maximale)",
      confidence: "haute",
      sources: ["iai-elta-green-pine", "press-arrow-system"],
    },
    {
      label: "Intégration C2",
      value:
        "Arrow Weapon System (Arrow 2, Arrow 3, Arrow 4 en développement) ; IAMD intégrée israélienne",
      confidence: "haute",
      sources: ["iai-elta-green-pine"],
    },
    {
      label: "Mobilité",
      value:
        "Semi-fixe — déploiement en site préparé, transportable par éléments majeurs",
      confidence: "haute",
      sources: ["iai-elta-green-pine"],
    },
    {
      label: "Technologie RF",
      value:
        "Modules T/R bande L — détail (GaAs / GaN) non précisé homogène selon génération",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["iai-elta-green-pine"],
    },
    {
      label: "PRF, formes d'onde, algorithmes de discrimination",
      value: "Classifiés",
      confidence: "faible",
      status: "variable",
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût Green Pine n'est pas publié de façon homogène par IAI ELTA. Les ordres de grandeur estimés tournent autour de 100-200 M$ par capteur intégré selon variante et lot logistique. Pour les programmes Arrow complets — capteur + lanceurs + intercepteurs Arrow 2 / 3 + soutien — les contrats export atteignent plusieurs milliards de dollars.\n\nLa lecture coût n'a de sens qu'au niveau du système Arrow complet. Le contrat allemand Arrow 3 signé en 2023 dépasse les 4 milliards d'euros sur plusieurs années, incluant capteurs Green Pine, intercepteurs Arrow 3 et soutien — c'est le plus important contrat export d'armement de l'histoire israélienne.",
      indicators: [
        {
          label: "Coût unitaire capteur — estimation publique",
          value: "≈ 100 à 200 M$ par capteur selon variante",
          confidence: "faible",
          status: "variable",
          sources: ["press-arrow-system"],
        },
        {
          label: "Coût Arrow complet (contrat allemand 2023)",
          value:
            "≈ 4 Md€ — capteurs Green Pine + intercepteurs Arrow 3 + soutien pluriannuel",
          confidence: "haute",
          sources: ["press-arrow-germany"],
        },
        {
          label: "MCO pluriannuel",
          value:
            "Significatif — capteur BMD complexe, mises à jour continues, écosystème Arrow",
          confidence: "moyenne",
          sources: ["iai-elta-green-pine"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Green Pine est financé principalement par le ministère israélien de la Défense (IMOD), avec contribution substantielle du US DoD via les programmes de coopération bilatérale (notamment Arrow, financé conjointement Israël / États-Unis depuis le début). C'est l'un des très rares programmes BMD non US à avoir reçu un financement co-substantiel américain.\n\nLes contrats export ont accéléré significativement post-2022, marqués par la décision allemande d'acquérir Arrow 3 et par l'intérêt d'autres nations européennes. La transparence financière reste limitée côté israélien, conforme à la pratique sur les capteurs BMD stratégiques.",
      indicators: [
        {
          label: "Financeurs principaux",
          value:
            "IMOD (Israël) + US DoD (programme Arrow co-financé) + contrats export IAI ELTA",
          confidence: "haute",
          sources: ["iai-elta-green-pine", "us-state-arrow"],
        },
        {
          label: "Contrats export documentés",
          value:
            "Inde (intégration nationale), Corée du Sud, Azerbaïdjan, Allemagne (Arrow 3 — 2023)",
          confidence: "haute",
          sources: ["press-arrow-system", "press-arrow-germany"],
        },
        {
          label: "Effet post-2022",
          value:
            "Accélération européenne marquée — contrat allemand Arrow 3 historique pour Israël",
          confidence: "haute",
          sources: ["press-arrow-germany"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne Green Pine est entièrement israélienne, intégrée par IAI ELTA. Les modules T/R, le packaging RF, les calculateurs DSP et les algorithmes de discrimination sont produits sous contrôle israélien strict. Cette souveraineté capteur est un argument de vente structurant face aux radars BMD américains soumis à ITAR maximal.\n\nLe risque industriel principal est partagé avec les autres grands radars IAI ELTA (EL/M-2084, MF-STAR) : la base industrielle israélienne est compacte face à une demande mondiale en forte croissance post-2022. La cadence de production sur les capteurs BMD est un point d'attention stratégique.",
      indicators: [
        {
          label: "Empreinte industrielle",
          value:
            "IAI ELTA — chaîne entièrement israélienne, souveraineté capteur",
          confidence: "haute",
          sources: ["iai-elta-green-pine"],
        },
        {
          label: "Technologie RF",
          value:
            "Modules T/R bande L sous contrôle israélien ; transition GaN selon génération non précisée homogène",
          confidence: "moyenne",
          status: "a-recouper",
          sources: ["iai-elta-green-pine"],
        },
        {
          label: "Risque industriel principal",
          value:
            "Base industrielle compacte face à une demande mondiale en forte croissance",
          confidence: "moyenne",
          sources: ["press-arrow-system"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Green Pine est l'un des objets géopolitiques les plus chargés du catalogue Panoplie. Il porte la souveraineté BMD israélienne, le co-financement US-Israël du programme Arrow, et désormais l'export d'une capacité BMD non américaine vers des nations OTAN (Allemagne) — une rupture stratégique majeure.\n\nLa décision allemande de 2023 d'acquérir Arrow 3 plutôt que THAAD est un signal politique structurant : c'est le premier déploiement d'un radar BMD non américain sur le sol allié européen. Pour Panoplie, c'est l'un des cas-école les plus importants du domaine radar — il documente concrètement qu'une chaîne BMD européenne autonome devient possible via Israël.",
      indicators: [
        {
          label: "Position stratégique",
          value:
            "Seul radar BMD non américain crédible en service ; rupture stratégique avec adoption allemande Arrow 3",
          confidence: "haute",
          sources: ["iai-elta-green-pine", "press-arrow-germany"],
        },
        {
          label: "Co-financement US-Israël",
          value:
            "Programme Arrow co-financé US-Israël depuis le début — accord G2G structurant",
          confidence: "haute",
          sources: ["us-state-arrow"],
        },
        {
          label: "Souveraineté capteur",
          value:
            "Hors ITAR strict — chaîne israélienne, contrôle baseline et algorithmes",
          confidence: "haute",
          sources: ["iai-elta-green-pine"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'export Green Pine est strictement contrôlé par le ministère israélien de la Défense (DECA). Les clients confirmés couvrent Israël, Inde (Swordfish, dérivé local), Corée du Sud (Block-B), Azerbaïdjan, et désormais l'Allemagne (Arrow 3, contrat 2023). Chaque transfert engage la diplomatie israélienne au plus haut niveau, et nécessite l'accord américain compte tenu du co-financement Arrow.\n\nLe régime applicable cumule contrôle DECA israélien strict, accord G2G avec Washington pour les variantes co-financées, et Wassenaar pour les composants RF et les algorithmes BMD. L'exportabilité reste modérée — un cercle restreint de nations alliées, et chaque transfert est un acte diplomatique.",
      indicators: [
        {
          label: "Canal d'export dominant",
          value:
            "DCS via IAI ELTA — licence DECA + accord US-Israël G2G nécessaire",
          confidence: "haute",
          sources: ["iai-elta-green-pine", "us-state-arrow"],
        },
        {
          label: "Clients export confirmés",
          value:
            "Inde, Corée du Sud (Block-B), Azerbaïdjan, Allemagne (Arrow 3 — 2023)",
          confidence: "haute",
          sources: ["press-arrow-system", "press-arrow-germany"],
        },
        {
          label: "Régime applicable",
          value:
            "Contrôle DECA + accord US-Israël G2G + Wassenaar (BMD particulièrement sensible)",
          confidence: "haute",
          sources: ["wassenaar-list"],
        },
      ],
    },
  ],
  integrationFrameworks: [
    "Arrow Weapon System (Arrow 2, Arrow 3, Arrow 4)",
    "IAMD israélienne intégrée",
    "European Sky Shield Initiative (futur — via Allemagne)",
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "C",
      rationale:
        "Coût très élevé compensé par la rareté de la fonction BMD non US ; sans substitut crédible pour les nations cherchant l'autonomie BMD européenne.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Capteur semi-fixe sur site connu, signature électromagnétique forte, antenne orientable mécaniquement ; vulnérabilité physique sensible.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "Accès limité — accord G2G US-Israël nécessaire, sensibilité BMD maximale ; mais ouverture européenne marquée par le contrat allemand 2023.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Base industrielle israélienne compacte face à une demande mondiale en forte croissance post-2022 ; pression cadence réelle.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "En service depuis 2000, employé opérationnellement (notamment 2024 contre missiles balistiques iraniens), pleinement éprouvé.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Sources IAI ELTA, US State Department, communications allemandes abondantes sur le rôle ; paramètres techniques fins et algorithmes BMD classifiés.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un radar « israélien parfait » qui voit toute menace balistique. La réalité : un excellent radar BMD bande L dont les performances de discrimination dépendent autant des algorithmes (classifiés) et de la coopération US-Israël que de l'antenne. Le système Arrow a démontré une efficacité opérationnelle réelle en 2024 contre des tirs balistiques iraniens.",
    bestUseCase:
      "Doter une nation alliée d'une capacité BMD européenne autonome — hors écosystème américain THAAD — pour la défense antimissile balistique de territoire et la couche supérieure IAMD.",
    weakPoint:
      "Le couplage US-Israël qui implique un accord G2G pour chaque export majeur, et la base industrielle israélienne compacte qui contraint la cadence face à une demande mondiale en forte croissance.",
    analystNote:
      "Green Pine est, dans le catalogue Panoplie, le cas-école géopolitique le plus dense du domaine radar. Il documente concrètement qu'une chaîne BMD européenne sans ITAR strict devient possible via Israël — un basculement stratégique structurant pour l'autonomie européenne. La trajectoire post-2023 sera décisive.",
  },
  operators: [
    "Israël (programme Arrow — Arrow 2 et Arrow 3 en service)",
    "Inde (dérivé Swordfish — intégration nationale)",
    "Corée du Sud (Block-B — variante longue portée)",
    "Azerbaïdjan",
    "Allemagne (Arrow 3 — contrat 2023, intégration en cours pour European Sky Shield)",
  ],
  theatres: [
    "Théâtre israélien — défense antimissile balistique nationale, employé en 2024 contre les tirs iraniens",
    "Théâtre indien — surveillance balistique régionale",
    "Théâtre coréen — défense BMD couche supérieure",
    "Théâtre européen — déploiement Allemagne (en cours, programme Arrow 3 / European Sky Shield)",
  ],
  timeline: [
    {
      date: "2000",
      label:
        "Entrée en service initiale — système Arrow 2 opérationnel en Israël.",
      kind: "jalon",
    },
    {
      date: "2010",
      label:
        "Premier export — Inde (intégration locale, dérivé Swordfish).",
      kind: "export",
    },
    {
      date: "2017",
      label:
        "Entrée en service Arrow 3 — capteurs Green Pine étendus, portée maximale.",
      kind: "jalon",
    },
    {
      date: "2023",
      label:
        "Contrat allemand Arrow 3 — ≈ 4 Md€, premier déploiement BMD non américain en Europe.",
      kind: "export",
    },
    {
      date: "2024",
      label:
        "Emploi opérationnel contre les tirs balistiques iraniens — démonstration grand public d'efficacité Arrow.",
      kind: "emploi",
    },
  ],
  sources: [
    {
      id: "iai-elta-green-pine",
      title: "Green Pine — page IAI ELTA",
      publisher: "IAI ELTA Systems",
      type: "constructeur",
      reliability: "B",
      url: "https://www.iai.co.il/p/elm-2080",
    },
    {
      id: "us-state-arrow",
      title:
        "US-Israel Arrow program cooperation — State Department & MDA budget justifications",
      publisher: "US State Department / Missile Defense Agency",
      type: "officiel",
      reliability: "A",
      url: "https://www.state.gov/",
    },
    {
      id: "press-arrow-system",
      title:
        "Système Arrow — analyses publiques et presse spécialisée (CSIS, FAS, défense)",
      publisher: "Think tanks et presse spécialisée",
      type: "think-tank",
      reliability: "B",
    },
    {
      id: "press-arrow-germany",
      title:
        "Contrat allemand Arrow 3 (2023) — communications BMVg et presse spécialisée",
      publisher: "BMVg / presse spécialisée",
      type: "officiel",
      reliability: "A",
    },
    {
      id: "wassenaar-list",
      title:
        "Arrangement de Wassenaar — listes de biens et technologies à double usage",
      publisher: "Secrétariat de Wassenaar",
      type: "officiel",
      reliability: "A",
      url: "https://www.wassenaar.org/",
    },
  ],
  updated: "2026-05-27",
};
