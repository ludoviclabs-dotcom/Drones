import type { DefenseSystem } from "../types";

export const aarok: DefenseSystem = {
  slug: "aarok",
  name: "Aarok",
  reference: "PNP-DR-010",
  category: "drone",
  droneClass: "MALE",
  classLabel: "MALE souverain",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Turgis & Gaillard",
  introduced: "2025",
  status: "Prototype / préproduction — commande série en cours d'instruction",
  acquisitionModes: ["production-nationale", "DCS"],
  tagline:
    "Le plus grand drone jamais conçu en France, né sur fonds propres et brandi comme la réponse souveraine au Reaper.",
  summary:
    "L'Aarok de Turgis & Gaillard est d'abord un geste industriel : une PME de l'armement, sans héritage de drone MALE, a développé en secret depuis juin 2020, sur ses fonds propres, le plus imposant aéronef sans pilote jamais assemblé en France — 22 mètres d'envergure, 5,5 tonnes au décollage. Le discours qui l'accompagne est explicitement souverain : ITAR-free, capteurs Safran et Thales, une alternative française au MQ-9 Reaper américain et un complément rapide à l'Eurodrone européen dont le calendrier glisse.\n\nLe premier vol — pilote à bord — a eu lieu le 11 septembre 2025 depuis l'aérodrome de Blois-Le Breuil ; le ministère des Armées a retenu l'appareil comme solution capacitaire rapide. Mais l'Aarok reste un prototype. Les performances annoncées — 24 heures d'endurance en configuration armée, charge utile de 1,5 tonne, armement compatible AASM et Hellfire — sont celles du constructeur, non d'une qualification opérationnelle. Le comprendre, c'est mesurer l'écart entre une promesse capacitaire séduisante et une maturité de système qui reste entièrement à démontrer.",
  keySpecs: [
    {
      label: "Envergure",
      value: "22 m",
      confidence: "moyenne",
      note: "Donnée constructeur ; plus grand drone conçu en France.",
      sources: ["tg-aarok"],
    },
    {
      label: "Longueur",
      value: "14 m",
      confidence: "moyenne",
      sources: ["tg-aarok"],
    },
    {
      label: "Masse maximale au décollage",
      value: "5 500 kg (à vide ≈ 2 500 kg)",
      confidence: "moyenne",
      sources: ["tg-aarok"],
    },
    {
      label: "Charge utile",
      value: "1 500 kg",
      confidence: "moyenne",
      note: "Capacité annoncée par le constructeur, non vérifiée en qualification.",
      sources: ["tg-aarok"],
    },
    {
      label: "Endurance",
      value: "24 h en configuration armée — jusqu'à 30 h en ISR",
      confidence: "faible",
      status: "a-recouper",
      note: "Performance annoncée ; aucun vol d'endurance long publié à ce stade.",
      sources: ["tg-aarok"],
    },
    {
      label: "Motorisation",
      value: "Turbopropulseur 1 200 ch — hélice 5 pales",
      confidence: "moyenne",
      note: "Moteur initial américain ; substitution annoncée pour rester ITAR-free.",
      sources: ["tg-aarok", "opex360-cout"],
    },
    {
      label: "Plafond — vitesse de croisière",
      value: "9 000 m · 250 kt (≈ 463 km/h)",
      confidence: "faible",
      status: "a-recouper",
      sources: ["tg-aarok"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût unitaire de l'Aarok est l'un de ses principaux arguments de vente — et l'une de ses données les plus incertaines. Opex360 cite en août 2025 une fourchette de 5 à 10 M€ par appareil, ce qui placerait le drone à mi-chemin entre le MQ-9 Reaper américain et le Bayraktar Akıncı turc. Cette estimation, large d'un facteur deux, n'émane pas d'un contrat notifié : aucune commande de série n'a encore fixé de prix ferme.\n\nSurtout, le coût du système complet — stations sol, liaisons SATCOM, lot de soutien, formation — n'a jamais été publié. Or c'est ce coût de possession, et non le seul prix de la cellule, qui détermine l'intérêt budgétaire réel d'un MALE. Tant qu'aucun marché n'aura été passé, le ratio capacité/coût mis en avant par le constructeur reste une promesse commerciale, pas un fait vérifié.",
      indicators: [
        {
          label: "Coût unitaire estimé",
          value: "5–10 M€ par appareil",
          confidence: "faible",
          status: "a-recouper",
          note: "Estimation de presse (août 2025) ; fourchette large, aucun contrat de série.",
          sources: ["opex360-cout"],
        },
        {
          label: "Positionnement de prix",
          value: "Entre le MQ-9 Reaper et le Bayraktar Akıncı",
          confidence: "faible",
          sources: ["opex360-cout"],
        },
        {
          label: "Coût du système complet",
          value: "Non publié — stations sol, SATCOM et soutien non chiffrés",
          confidence: "faible",
          sources: ["opex360-cout"],
        },
        {
          label: "Statut contractuel",
          value: "Aucun prix ferme — commande série en cours d'instruction",
          confidence: "moyenne",
          sources: ["mer-marine"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le modèle de financement de l'Aarok est atypique pour un programme de cette ampleur : Turgis & Gaillard a porté le développement entièrement sur ses fonds propres, sans contrat d'État préalable, depuis juin 2020. L'investissement est estimé entre 10 et 20 M€ — un montant considérable pour une PME de l'armement, qui traduit un pari industriel assumé plutôt qu'une commande sécurisée.\n\nLa DGA a apporté un soutien au développement, sans en être le commanditaire initial. La logique financière du programme dépend désormais entièrement de la transformation de l'intérêt affiché par le ministère des Armées en commande de série : sans marché ferme, l'investissement consenti reste exposé. C'est l'inversion du schéma habituel — l'industriel a financé le risque amont, et attend que l'État valide l'aval.",
      organisms: ["dga"],
      indicators: [
        {
          label: "Source de financement",
          value: "Fonds propres Turgis & Gaillard",
          confidence: "moyenne",
          note: "Développement engagé sans contrat d'État préalable.",
          sources: ["tg-aarok", "opex360-cout"],
        },
        {
          label: "Investissement estimé",
          value: "10–20 M€",
          confidence: "faible",
          status: "a-recouper",
          note: "Estimation ; le constructeur n'a pas publié de comptes du programme.",
          sources: ["opex360-cout"],
        },
        {
          label: "Soutien public",
          value: "Appui de la DGA au développement",
          confidence: "moyenne",
          sources: ["mer-marine"],
        },
        {
          label: "Commande de série",
          value: "En cours d'instruction par le ministère des Armées",
          confidence: "moyenne",
          status: "variable",
          sources: ["mer-marine"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne de l'Aarok est conçue comme une vitrine de l'industrie française. Turgis & Gaillard, maître d'œuvre, assure l'assemblage à Blois-Le Breuil dans le Loir-et-Cher, avec un sous-ensemble produit à Saint-Malo via sa filiale Gaillard ASA. Les capteurs sont français : la boule optronique Euroflir 410/610 et le nœud de communication ODIN de Safran, le radar AESA AirMaster S de Thales, crédité d'une portée supérieure à 100 km.\n\nUn point de dépendance subsiste néanmoins, et il est central pour le discours souverain : le moteur initial est d'origine américaine. Turgis & Gaillard annonce sa substitution pour garantir le statut ITAR-free de l'appareil — une opération de re-motorisation qui n'est ni triviale ni démontrée. Tant qu'elle n'est pas réalisée, la promesse de souveraineté capacitaire comporte un nœud critique non encore résolu.",
      indicators: [
        {
          label: "Maître d'œuvre et assemblage",
          value: "Turgis & Gaillard — Blois-Le Breuil ; sous-ensemble à Saint-Malo (Gaillard ASA)",
          confidence: "moyenne",
          sources: ["tg-aarok"],
        },
        {
          label: "Capteurs",
          value: "Safran (Euroflir, nœud ODIN) · Thales (AirMaster S AESA, portée > 100 km)",
          confidence: "moyenne",
          sources: ["tg-aarok"],
        },
        {
          label: "Dépendance extra-européenne",
          value: "Moteur initial américain — substitution annoncée",
          confidence: "faible",
          status: "a-recouper",
          note: "Re-motorisation ITAR-free annoncée mais non démontrée.",
          sources: ["tg-aarok", "opex360-cout"],
        },
        {
          label: "Maturité de la chaîne",
          value: "Préproduction — non industrialisée pour une cadence de série",
          confidence: "faible",
          sources: ["mer-marine"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "L'Aarok occupe une place très précise dans le discours de souveraineté capacitaire française d'après-Ukraine. Il se présente comme l'alternative nationale au MQ-9 Reaper — dont l'emploi par la France reste soumis aux restrictions américaines — et comme un complément rapide à l'Eurodrone, programme coopératif européen dont le calendrier et les coûts dérivent. Dans ce récit, un MALE armé conçu et produit en France, ITAR-free, vaut autant comme symbole d'autonomie que comme capacité militaire.\n\nLa portée politique de l'appareil dépasse ainsi sa maturité réelle. Le ministère des Armées y voit une solution capacitaire rapide ; le constructeur en fait l'étendard d'une industrie de défense agile, capable de livrer sans tutelle technologique extérieure. Mais cette fonction de démonstration souveraine ne sera consolidée qu'une fois l'appareil qualifié, commandé et mis en service — trois étapes encore devant lui.",
      organisms: ["dga"],
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Alternative souveraine au Reaper · complément de l'Eurodrone",
          confidence: "moyenne",
          sources: ["mer-marine", "opex360-cout"],
        },
        {
          label: "Discours de souveraineté",
          value: "MALE armé ITAR-free, conçu et produit en France",
          confidence: "moyenne",
          note: "Argument central du constructeur ; conditionné à la re-motorisation.",
          sources: ["tg-aarok"],
        },
        {
          label: "Reconnaissance institutionnelle",
          value: "Retenu par le ministère des Armées comme solution capacitaire rapide",
          confidence: "moyenne",
          status: "variable",
          sources: ["mer-marine"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "L'Aarok relève de la catégorie I du MTCR, la plus restrictive : sa masse maximale au décollage supérieure à 5 tonnes, sa charge utile au-delà de 500 kg et sa portée le placent dans le segment des systèmes dont l'exportation est soumise au contrôle le plus strict et à un arbitrage politique de l'État français. Toute vente à l'étranger passera donc par la DGA et relèvera d'une décision gouvernementale.\n\nLe constructeur a néanmoins déjà engagé une stratégie d'exportation. Un protocole d'accord a été signé au Salon du Bourget 2025 avec l'indien Bharat Forge, et un accord avait été conclu dès fin 2023 avec l'ukrainien Antonov pour développer une variante consommable de l'appareil. Ces partenariats restent des intentions : aucun contrat ferme, aucun opérateur étranger, et la concrétisation dépendra autant de la qualification de l'Aarok que des autorisations d'exportation.",
      organisms: ["mtcr", "dga"],
      indicators: [
        {
          label: "Régime de contrôle",
          value: "MTCR catégorie I — contrôle DGA et arbitrage politique",
          confidence: "moyenne",
          note: "MTOW > 5 t et charge > 500 kg classent l'appareil dans le segment le plus restrictif.",
          sources: ["mtcr-regime"],
        },
        {
          label: "Partenariat Inde",
          value: "MoU avec Bharat Forge — Salon du Bourget 2025",
          confidence: "faible",
          status: "a-recouper",
          note: "Protocole d'accord récent ; pas de contrat ferme.",
          sources: ["mer-marine"],
        },
        {
          label: "Partenariat Ukraine",
          value: "Accord Antonov (fin 2023) — variante consommable",
          confidence: "faible",
          status: "a-recouper",
          sources: ["opex360-cout"],
        },
        {
          label: "Opérateurs export",
          value: "Aucun — cibles France, Inde, Ukraine",
          confidence: "moyenne",
          sources: ["tg-aarok"],
        },
      ],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Le ratio capacité/coût annoncé — un MALE armé de 5,5 t pour 5 à 10 M€ — est attractif, mais l'estimation est large et le coût système n'est pas publié : promesse crédible, non encore vérifiée.",
    },
    {
      key: "survivabilite",
      grade: "D",
      rationale:
        "Un drone MALE non furtif, lent et volant à 9 000 m reste vulnérable en environnement contesté ; aucune confrontation à une défense sol-air réelle, survivabilité en haute intensité à confirmer.",
    },
    {
      key: "exportabilite",
      grade: "C",
      rationale:
        "Discours ITAR-free et deux partenariats engagés (Bharat Forge, Antonov) ouvrent des perspectives, mais le classement MTCR catégorie I impose un contrôle strict et aucun contrat ferme n'est signé.",
    },
    {
      key: "risque-industriel",
      grade: "C",
      rationale:
        "Maître d'œuvre PME développant sur fonds propres, chaîne de série non industrialisée et re-motorisation ITAR-free non démontrée : risque industriel modéré tant que la commande n'est pas confirmée.",
    },
    {
      key: "maturite",
      grade: "D",
      rationale:
        "Premier vol pilote à bord en septembre 2025, statut prototype, aucun opérateur ni qualification : la maturité technologique amorcée n'est pas une maturité de système opérationnel.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Programme jeune dont l'essentiel des performances repose sur le discours du constructeur ; chiffres de coût estimés par la presse et faits 2025 encore à recouper. Confiance source globale B.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : la France dispose enfin de son grand drone MALE armé souverain. La réalité : l'Aarok est un prototype qui a effectué son premier vol — pilote à bord — en septembre 2025. Il n'a aucun opérateur, aucune qualification opérationnelle, et ses performances annoncées (endurance, charge utile, armement) sont celles du constructeur. C'est une démonstration industrielle prometteuse, pas encore un système d'armes en service.",
    bestUseCase:
      "La surveillance et la frappe sur des théâtres permissifs ou de moyenne intensité — patrouille ISR longue durée, appui-feu contre des cibles peu défendues — où l'endurance, la charge utile élevée et un coût unitaire contenu offrent un compromis intéressant, sous réserve que les performances annoncées soient confirmées.",
    weakPoint:
      "La survivabilité et la maturité. Non furtif et lent, l'Aarok serait exposé face à une défense sol-air moderne. Surtout, tout reste à prouver : industrialisation de la chaîne, re-motorisation ITAR-free, vols d'endurance, qualification de l'armement — le risque a été assumé en amont par l'industriel et attend sa validation.",
    analystNote:
      "L'Aarok se juge à son pari plus qu'à sa fiche technique : une PME a financé seule, en cinq ans et sur fonds propres, le plus grand drone jamais conçu en France, pour proposer une réponse souveraine là où l'Eurodrone tarde. L'intention est cohérente avec le moment stratégique français. Mais en 2026 l'appareil reste un prototype : le ratio capacité/coût annoncé, le statut ITAR-free et les partenariats export sont des promesses dont la valeur dépend entièrement de trois étapes non franchies — qualification, re-motorisation, commande de série. Un prototype séduisant qui n'irait pas jusqu'à la série resterait une démonstration sans capacité.",
  },
  operators: ["Aucun en service — cibles France, Inde, Ukraine"],
  theatres: ["Aucun — en essais (aérodrome de Blois-Le Breuil)"],
  timeline: [
    { date: "2020-06", label: "Lancement du développement en secret, sur fonds propres de Turgis & Gaillard.", kind: "jalon" },
    { date: "2023", label: "Accord avec Antonov (Ukraine) pour une variante consommable de l'Aarok.", kind: "export" },
    { date: "2025-06", label: "Signature d'un protocole d'accord avec Bharat Forge (Inde) au Salon du Bourget.", kind: "export" },
    { date: "2025-09", label: "Premier vol — pilote à bord — depuis l'aérodrome de Blois-Le Breuil.", kind: "jalon" },
    { date: "2025", label: "Appareil retenu par le ministère des Armées comme solution capacitaire rapide complémentaire de l'Eurodrone.", kind: "debat" },
  ],
  sources: [
    {
      id: "tg-aarok",
      title: "Aarok — drone MALE souverain",
      publisher: "Turgis & Gaillard Groupe",
      type: "constructeur",
      reliability: "B",
    },
    {
      id: "mer-marine",
      title: "Aarok — premier vol et sélection capacitaire",
      publisher: "Mer et Marine",
      type: "presse",
      reliability: "B",
      date: "2025-09",
    },
    {
      id: "opex360-cout",
      title: "Aarok — coût unitaire et modèle de développement",
      publisher: "Opex360 (Zone Militaire)",
      type: "presse",
      reliability: "B",
      date: "2025-08",
    },
    {
      id: "mtcr-regime",
      title: "Missile Technology Control Regime — catégories de contrôle",
      publisher: "MTCR",
      type: "institution",
      reliability: "A",
    },
  ],
  updated: "2026-05-21",
};
