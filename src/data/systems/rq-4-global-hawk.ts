import type { DefenseSystem } from "../types";

export const rq4GlobalHawk: DefenseSystem = {
  slug: "rq-4-global-hawk",
  name: "RQ-4 Global Hawk",
  designation: "RQ-4B Block 40",
  reference: "PNP-DR-005",
  category: "drone",
  droneClass: "HALE",
  classLabel: "Drone HALE ISR",
  country: "États-Unis",
  flag: "🇺🇸",
  manufacturer: "Northrop Grumman",
  introduced: "2001",
  status: "En service — retrait planifié vers 2027",
  acquisitionModes: ["FMS"],
  tagline:
    "L'œil stratégique de l'Amérique à 18 000 mètres — non armé, démesuré, et déjà en fin de carrière.",
  summary:
    "Le RQ-4 Global Hawk de Northrop Grumman est le plus grand drone opérationnel au monde et le pilier du renseignement aérien stratégique américain. Successeur partiel du U-2 piloté, ce HALE ISR survole les théâtres pendant plus de trente heures à très haute altitude, sans jamais emporter d'arme : sa mission est de voir, pas de frapper.\n\nVingt ans après son entrée en service, le programme est entré en phase de désengagement. Les Block 20 et 30 ont été retirés, et l'US Air Force a annoncé le retrait des derniers Block 40 vers 2027. Le comprendre, c'est saisir à la fois la valeur d'une permanence ISR sans équivalent et les limites d'une plateforme coûteuse, lente et vulnérable face aux défenses sol-air modernes — une vulnérabilité démontrée par l'Iran en 2019.",
  keySpecs: [
    {
      label: "Envergure",
      value: "≈ 39,9 m",
      confidence: "haute",
      sources: ["usaf-factsheet"],
    },
    {
      label: "Endurance",
      value: "> 32 h",
      confidence: "haute",
      note: "Mission ISR à haute altitude.",
      sources: ["usaf-factsheet"],
    },
    {
      label: "Plafond opérationnel",
      value: "≈ 18 300 m (60 000 ft)",
      confidence: "haute",
      sources: ["usaf-factsheet"],
    },
    {
      label: "Charge utile",
      value: "≈ 1 360 kg de capteurs",
      confidence: "moyenne",
      note: "Capteurs uniquement — le RQ-4 n'emporte aucun armement.",
      sources: ["usaf-factsheet"],
    },
    {
      label: "Rayon d'action",
      value: "≈ 22 800 km",
      confidence: "moyenne",
      note: "Distance franchissable annoncée ; varie selon la configuration de mission.",
      sources: ["ng-rq4"],
    },
    {
      label: "Motorisation",
      value: "Rolls-Royce F137-RR-100 (turbofan)",
      confidence: "haute",
      sources: ["ng-rq4"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le Global Hawk est l'exemple type du programme dont le coût a dérapé. La cellule, annoncée autour de 10 M$ au lancement en 1994, atteignait 131 M$ en 2013 ; intégré au coût complet du programme, le prix unitaire grimpe vers 220 M$ après dépassements. Un drone non armé y revient ainsi plus cher qu'un chasseur de combat.\n\nLe coût horaire raconte une autre histoire, plus encourageante : cité à environ 40 600 $/h en 2010, il serait redescendu autour de 18 900 $/h en 2013 à mesure que la flotte volait davantage. Ces chiffres restent des estimations gouvernementales anciennes, dispersées et difficiles à comparer — à manier avec prudence.",
      indicators: [
        {
          label: "Coût unitaire (cellule)",
          value: "≈ 131 M$ (2013)",
          confidence: "faible",
          status: "variable",
          note: "De ≈ 10 M$ en 1994 à ≈ 131 M$ en 2013 — forte dérive sur la durée du programme.",
          sources: ["af-budget", "csis-uav"],
        },
        {
          label: "Coût unitaire (acquisition complète)",
          value: "≈ 222 M$",
          confidence: "faible",
          status: "variable",
          note: "Estimation après dépassements de coûts, budget USAF 2012.",
          sources: ["af-budget"],
        },
        {
          label: "Coût horaire de vol",
          value: "≈ 18 900 $/h (2013)",
          confidence: "faible",
          status: "variable",
          note: "Contre ≈ 40 600 $/h en 2010 ; baisse attribuée à un taux d'utilisation accru.",
          sources: ["reuters-rq4"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le Global Hawk est financé sur le budget fédéral de l'US Air Force, dans le cadre d'un programme arrivé à maturité — et désormais en phase de retrait, ce qui assèche progressivement ses lignes de modernisation. À l'export, l'acquisition passe par le canal FMS : l'État américain contractualise au nom de l'acheteur.\n\nLes contrats étrangers connus se chiffrent en centaines de millions de dollars par parc — environ 657 M$ pour la Corée du Sud, 490 M$ pour le Japon — et incluent les stations sol et le soutien. Comme pour tout système ISR de ce gabarit, le maintien en condition pluriannuel reste le poste le plus régulièrement sous-estimé.",
      indicators: [
        {
          label: "Cadre de financement",
          value: "Budget fédéral US ; FMS à l'export",
          confidence: "haute",
          sources: ["usaf-factsheet"],
        },
        {
          label: "Contrat export — Corée du Sud",
          value: "≈ 657 M$ pour 4 vecteurs (2014)",
          confidence: "moyenne",
          sources: ["sipri-at", "csis-uav"],
        },
        {
          label: "Contrat export — Japon",
          value: "≈ 490 M$ pour 3 vecteurs + 2 stations sol (2018)",
          confidence: "moyenne",
          sources: ["sipri-at"],
        },
        {
          label: "Poste sous-estimé",
          value: "Soutien et maintien en condition pluriannuels",
          confidence: "moyenne",
          sources: ["csis-uav"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du Global Hawk repose sur une base industrielle entièrement nationale : Northrop Grumman en intégrateur, Raytheon et L3Harris pour les sous-systèmes majeurs — capteurs, charges utiles, liaisons. Peu de dépendance étrangère, donc peu de leviers de pression extérieurs sur le programme.\n\nLa contrepartie tient à la fin de vie : avec le retrait planifié, la base de fournisseurs se contracte, l'obsolescence des composants progresse et le soutien des appareils encore en service — ainsi que des exemplaires exportés — devient plus délicat et plus onéreux à mesure que la production s'éteint.",
      indicators: [
        {
          label: "Intégrateur",
          value: "Northrop Grumman",
          confidence: "haute",
          sources: ["ng-rq4"],
        },
        {
          label: "Sous-systèmes principaux",
          value: "Raytheon · L3Harris (capteurs, charges utiles)",
          confidence: "moyenne",
          sources: ["ng-rq4", "csis-uav"],
        },
        {
          label: "Dépendance étrangère",
          value: "Faible — base industrielle nationale",
          confidence: "moyenne",
          sources: ["csis-uav"],
        },
        {
          label: "Risque de fin de vie",
          value: "Obsolescence et contraction des fournisseurs",
          confidence: "faible",
          status: "a-recouper",
          note: "Lié au retrait planifié vers 2027 — soutien plus coûteux pour la flotte résiduelle.",
          sources: ["usaf-factsheet"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le Global Hawk est l'ossature du renseignement stratégique aérien des États-Unis et de quelques alliés. Ses déploiements — Japon, Guam, Italie, Koweït — dessinent une carte de la surveillance américaine, du Pacifique au Moyen-Orient. Vendre un RQ-4, c'est arrimer un partenaire à l'architecture ISR de Washington.\n\nLe programme OTAN AGS, avec ses cinq RQ-4D, illustre cette fonction d'intégration : une capacité de surveillance mutualisée bâtie sur la plateforme américaine. Mais la destruction d'un RQ-4A par l'Iran en 2019 a rappelé que ce drone, lent et non furtif, devient un enjeu diplomatique majeur dès qu'il s'approche d'un espace contesté.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Surveillance ISR et intégration alliée",
          confidence: "moyenne",
          sources: ["csis-uav"],
        },
        {
          label: "Programme multinational",
          value: "OTAN AGS — 5 RQ-4D, contrat ≈ 1,7 Md$ (2012)",
          confidence: "moyenne",
          sources: ["sipri-at"],
        },
        {
          label: "Empreinte de déploiement",
          value: "Japon, Guam, Italie, Koweït",
          confidence: "moyenne",
          sources: ["csis-uav"],
        },
        {
          label: "Incident stratégique",
          value: "RQ-4A abattu par l'Iran le 20 juin 2019 (détroit d'Ormuz)",
          confidence: "haute",
          sources: ["reuters-rq4", "newamerica-drones"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le Global Hawk relève du régime ITAR — catégorie XIII des munitions — et son exportation suppose une autorisation américaine, un certificat d'utilisateur final et des restrictions d'emploi. L'acheteur n'obtient jamais une pleine liberté d'usage : capteurs et liaisons restent sous contrôle de Washington.\n\nLes ventes connues sont peu nombreuses et réservées à des alliés proches — Corée du Sud, Japon — auxquelles s'ajoute la variante RQ-4D du programme OTAN AGS. Le retrait progressif du modèle côté américain referme par ailleurs la fenêtre commerciale : un acheteur potentiel s'engagerait aujourd'hui sur une plateforme en fin de cycle de vie.",
      indicators: [
        {
          label: "Régime applicable",
          value: "ITAR — catégorie XIII",
          confidence: "haute",
          sources: ["sipri-at"],
        },
        {
          label: "Conditions",
          value: "Autorisation US, certificat d'utilisateur final",
          confidence: "haute",
          sources: ["sipri-at"],
        },
        {
          label: "Clients export",
          value: "Corée du Sud, Japon, OTAN AGS (RQ-4D)",
          confidence: "moyenne",
          sources: ["sipri-at", "iiss-mb"],
        },
        {
          label: "Marge d'emploi de l'acheteur",
          value: "Restreinte",
          confidence: "moyenne",
          sources: ["csis-uav"],
        },
      ],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "D",
      rationale:
        "Capacité ISR réelle et sans équivalent, mais coût d'acquisition très élevé pour une plateforme non armée, et dérive budgétaire historique mal maîtrisée.",
    },
    {
      key: "survivabilite",
      grade: "E",
      rationale:
        "Lent, non furtif, non armé et tributaire de liaisons brouillables ; un RQ-4A a été abattu par l'Iran en 2019 — inadapté à tout espace aérien sérieusement défendu.",
    },
    {
      key: "exportabilite",
      grade: "D",
      rationale:
        "Exportable sous ITAR catégorie XIII vers de rares alliés proches, mais la fenêtre commerciale se referme avec le retrait planifié du modèle.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne nationale et intégrateur unique, faible exposition extérieure ; nuance défavorable liée à la fin de vie — obsolescence et contraction des fournisseurs.",
    },
    {
      key: "maturite",
      grade: "A",
      rationale:
        "Plus de vingt ans de service, doctrine ISR éprouvée sur de multiples théâtres ; programme désormais en phase de retrait assumée.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Système bien documenté côté caractéristiques et opérations ; seules les données de coût restent anciennes et dispersées d'une source à l'autre.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un satellite à demeure, un œil omniscient qui veille sans relâche et sans risque. La réalité : le Global Hawk est un avion lent, immense et non furtif, optimisé pour des espaces aériens permissifs. Dès qu'une défense sol-air capable est en jeu, il devient une cible — l'Iran l'a démontré en 2019 en abattant un RQ-4A au-dessus du détroit d'Ormuz.",
    bestUseCase:
      "La surveillance stratégique de très longue durée à haute altitude dans un environnement peu ou pas contesté : veille de zone, renseignement d'imagerie et électronique, soutien ISR persistant au profit d'états-majors et d'alliances comme l'OTAN AGS.",
    weakPoint:
      "La survivabilité, doublée d'une obsolescence assumée. Non armé et non furtif, le RQ-4 ne peut ni se défendre ni se soustraire à une menace moderne ; son retrait planifié vers 2027 confirme que l'US Air Force ne mise plus sur cette plateforme.",
    analystNote:
      "Le Global Hawk restera dans l'histoire comme la première tentative d'industrialiser la surveillance stratégique sans pilote — une réussite capacitaire entachée d'une dérive de coûts sévère. Son retrait, alors que le U-2 qu'il devait remplacer vole encore, en dit long sur les limites du pari HALE non furtif. Sa valeur résiduelle en 2026 tient à la permanence ISR et au lien d'alliance, non au combat de haute intensité.",
  },
  operators: [
    "États-Unis",
    "OTAN (AGS — RQ-4D)",
    "Japon",
    "Corée du Sud",
  ],
  theatres: [
    "Afghanistan",
    "Irak",
    "Libye",
    "Syrie",
    "Pacifique occidental",
    "Détroit d'Ormuz",
  ],
  sources: [
    {
      id: "ng-rq4",
      title: "RQ-4 Global Hawk — documentation système",
      publisher: "Northrop Grumman",
      type: "constructeur",
      reliability: "B",
      url: "https://www.northropgrumman.com",
    },
    {
      id: "usaf-factsheet",
      title: "RQ-4 Global Hawk — Fact Sheet",
      publisher: "U.S. Air Force",
      type: "officiel",
      reliability: "A",
    },
    {
      id: "af-budget",
      title: "Budget de l'US Air Force — programme Global Hawk",
      publisher: "U.S. Air Force",
      type: "officiel",
      reliability: "A",
      date: "2012",
    },
    {
      id: "reuters-rq4",
      title: "Reportages sur les coûts et les pertes du Global Hawk",
      publisher: "Reuters",
      type: "presse",
      reliability: "B",
    },
    {
      id: "sipri-at",
      title: "Arms Transfers Database",
      publisher: "SIPRI",
      type: "institution",
      reliability: "A",
      url: "https://www.sipri.org/databases/armstransfers",
    },
    {
      id: "iiss-mb",
      title: "The Military Balance",
      publisher: "IISS",
      type: "institution",
      reliability: "A",
    },
    {
      id: "newamerica-drones",
      title: "World of Drones — Tracking Armed Drone Use",
      publisher: "New America",
      type: "think-tank",
      reliability: "B",
      url: "https://www.newamerica.org/insights/world-drones/",
    },
    {
      id: "csis-uav",
      title: "Analyses sur les drones et la puissance aérienne",
      publisher: "CSIS",
      type: "think-tank",
      reliability: "B",
      url: "https://www.csis.org",
    },
  ],
  updated: "2026-05-21",
};
