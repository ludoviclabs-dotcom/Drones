import type { DefenseSystem } from "../types";

export const neuron: DefenseSystem = {
  slug: "neuron",
  name: "nEUROn",
  reference: "PNP-DR-004",
  category: "drone",
  droneClass: "UCAV",
  classLabel: "UCAV furtif",
  country: "France",
  flag: "🇫🇷",
  manufacturer: "Dassault Aviation",
  introduced: "2012",
  status: "Démonstrateur — programme d'essais terminé",
  acquisitionModes: ["cooperatif"],
  tagline:
    "Le démonstrateur qui a appris à l'Europe à construire un avion de combat furtif sans plan américain.",
  summary:
    "Le nEUROn de Dassault Aviation n'est pas une arme : c'est une école. Cette aile volante furtive d'environ douze mètres d'envergure, conçue en coopération par six pays européens, avait un objectif unique — démontrer qu'un industriel européen maîtrise la signature radar réduite, la soute interne et le vol autonome sans transfert de technologie venu de Washington.\n\nPremier vol en décembre 2012, plus de cent soixante-dix vols cumulés, puis le silence : le programme s'est arrêté comme prévu, sa mission accomplie. Le comprendre, c'est saisir comment l'Europe a converti un démonstrateur sobre en brique fondatrice du futur drone de combat qui accompagnera le Rafale F5 — un pari sur la compétence, plus que sur la production.",
  keySpecs: [
    {
      label: "Envergure",
      value: "12,5 m",
      confidence: "haute",
      sources: ["dassault-neuron"],
    },
    {
      label: "Longueur",
      value: "≈ 9,2–9,5 m",
      confidence: "moyenne",
      note: "Valeur citée dans une fourchette selon les sources.",
      sources: ["dassault-neuron"],
    },
    {
      label: "Masse maximale au décollage",
      value: "≈ 7 000 kg",
      confidence: "moyenne",
      sources: ["dassault-neuron"],
    },
    {
      label: "Motorisation",
      value: "Rolls-Royce / Turbomeca Adour Mk 951 (≈ 40 kN)",
      confidence: "haute",
      sources: ["dassault-neuron"],
    },
    {
      label: "Plafond — vitesse",
      value: "≈ 14 000 m · Mach 0,8",
      confidence: "moyenne",
      sources: ["dassault-neuron"],
    },
    {
      label: "Emport",
      value: "Soute interne — 2 bombes guidées GBU-12 de 250 kg",
      confidence: "moyenne",
      note: "Capacité démontrée en essais ; le nEUROn n'a jamais été un système armé opérationnel.",
      sources: ["dassault-neuron"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le nEUROn est l'un des rares programmes d'armement à être cité comme tenu dans son budget. Le contrat principal notifié à Dassault par la DGA en février 2006 s'élevait à environ 405 M€ — un démonstrateur, pas une flotte, donc un chiffre qui couvre la conception, la cellule unique et la campagne d'essais, sans coût de série ni de soutien opérationnel.\n\nCe coût n'a pas de « prix unitaire » au sens habituel : il n'existe qu'un seul exemplaire. La vraie lecture économique est ailleurs — le programme a financé l'acquisition d'un savoir-faire (furtivité, soute interne, commandes de vol d'une aile volante) dont la valeur se mesure au coût qu'aurait représenté son rattrapage ultérieur, ou son achat à l'étranger.",
      indicators: [
        {
          label: "Contrat principal",
          value: "≈ 405 M€ (notifié 2006)",
          confidence: "moyenne",
          note: "Contrat de démonstrateur ; ni prix de série ni coût de soutien.",
          sources: ["senat-rapport", "usine-nouvelle"],
        },
        {
          label: "Coût unitaire",
          value: "Sans objet — exemplaire unique",
          confidence: "haute",
          sources: ["dassault-neuron"],
        },
        {
          label: "Discipline budgétaire",
          value: "Budget et calendrier annoncés comme respectés",
          confidence: "moyenne",
          status: "a-recouper",
          note: "Affirmation portée par le constructeur ; pas de revue de coût indépendante publiée.",
          sources: ["dassault-neuron"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le financement du nEUROn est un cas d'école de partage de la charge européenne. La France, État pilote, a assumé environ la moitié de la facture, soit près de 202 M€ ; le solde a été réparti entre la Suède, l'Italie, l'Espagne, la Grèce et la Suisse, chaque pays payant à proportion de la part industrielle confiée à son industrie nationale.\n\nCe montage — « juste retour » géographique — a permis de réunir six contributeurs autour d'un coût qu'aucun n'aurait porté seul. Sa contrepartie tient au poste rarement chiffré : un programme de démonstration ne génère aucune recette ; son rendement est différé et conditionné à la décision, bien plus tard, de lancer un programme opérationnel qui capitalise sur ses acquis.",
      indicators: [
        {
          label: "Part française",
          value: "≈ 50 % (≈ 202 M€)",
          confidence: "moyenne",
          sources: ["senat-rapport"],
        },
        {
          label: "Cofinanceurs",
          value: "Suède, Italie, Espagne, Grèce, Suisse",
          confidence: "haute",
          sources: ["dassault-neuron"],
        },
        {
          label: "Clé de répartition",
          value: "Au prorata de la part industrielle nationale",
          confidence: "moyenne",
          sources: ["senat-rapport"],
        },
        {
          label: "Retour sur investissement",
          value: "Différé — conditionné à un programme opérationnel ultérieur",
          confidence: "faible",
          sources: ["iiss-mb"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La chaîne du nEUROn est une carte de l'industrie aéronautique militaire européenne. Dassault, maître d'œuvre, conserve les fonctions souveraines — cellule furtive, commandes de vol, assemblage et intégration. Autour, chaque partenaire reçoit un lot cohérent : Saab fournit les fuselages avant et central, l'avionique et le système carburant ; Leonardo la soute à armement ; Thales le datalink ; Airbus DS Espagne les communications ; HAI en Grèce et RUAG en Suisse complètent l'attelage.\n\nLa force du montage est sa cohérence stratégique : aucun nœud critique n'échappe à l'Europe, et la furtivité reste entre les mains de Dassault. Sa fragilité est inhérente à toute coopération — un démonstrateur n'industrialise pas une chaîne ; il faudra reconstituer et fiabiliser ces flux si le futur drone de combat passe au stade de la série.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Dassault Aviation — cellule, commandes de vol, intégration",
          confidence: "haute",
          sources: ["dassault-neuron"],
        },
        {
          label: "Partenaires industriels",
          value: "Saab · Leonardo · Thales · Airbus DS Espagne · HAI · RUAG",
          confidence: "haute",
          sources: ["dassault-neuron"],
        },
        {
          label: "Dépendance extra-européenne",
          value: "Faible — chaîne intégralement européenne",
          confidence: "moyenne",
          sources: ["iiss-mb"],
        },
        {
          label: "Maturité de la chaîne",
          value: "Démonstrateur — non industrialisée pour une série",
          confidence: "moyenne",
          sources: ["senat-rapport"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le nEUROn a une portée politique qui dépasse de loin sa portée militaire. Furtivité et autonomie de combat figurent parmi les technologies que les États-Unis ne transfèrent pas : maîtriser un UCAV furtif en propre, c'est s'affranchir d'un veto américain sur une compétence stratégique. Le programme a aussi servi de banc d'essai à la coopération elle-même — six pays apprenant à partager des données sensibles sous une maîtrise d'œuvre française.\n\nSa valeur s'est révélée a posteriori. En octobre 2024, la France a annoncé un futur drone de combat furtif accompagnant le Rafale F5 : le nEUROn devient la brique fondatrice de cette filière, et l'argument selon lequel l'Europe peut tenir son rang dans le combat aérien collaboratif sans tutelle technologique extérieure.",
      indicators: [
        {
          label: "Fonction stratégique",
          value: "Autonomie technologique sur la furtivité et le vol de combat",
          confidence: "moyenne",
          sources: ["iiss-mb"],
        },
        {
          label: "Filiation",
          value: "Brique du futur drone de combat associé au Rafale F5",
          confidence: "faible",
          status: "variable",
          note: "Annonce d'octobre 2024 ; programme successeur encore en définition.",
          sources: ["dassault-f5", "iiss-mb"],
        },
        {
          label: "Acquis de coopération",
          value: "Partage de données sensibles entre six États sous maîtrise d'œuvre française",
          confidence: "moyenne",
          sources: ["dassault-neuron"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le nEUROn n'a jamais été et ne sera jamais exporté : c'est un démonstrateur, pas un produit. Aucun catalogue, aucun client, aucune campagne commerciale. Cette absence d'export est un choix de nature, non une difficulté de marché.\n\nLe sujet d'exportabilité se posera pour le programme successeur. Un futur drone de combat furtif relèverait de la catégorie I du MTCR — la plus restrictive — et resterait soumis au contrôle de la DGA et à l'arbitrage politique français. Surtout, la furtivité est typiquement la technologie qu'un État cède le plus difficilement : l'expérience du nEUROn nourrit une compétence souveraine dont l'exportabilité, à terme, serait étroitement encadrée.",
      indicators: [
        {
          label: "Statut export",
          value: "Aucun — démonstrateur non commercialisé",
          confidence: "haute",
          sources: ["dassault-neuron"],
        },
        {
          label: "Régime applicable (programme successeur)",
          value: "MTCR catégorie I · contrôle DGA",
          confidence: "faible",
          note: "Projection — aucun produit dérivé n'est encore défini.",
          sources: ["iiss-mb"],
        },
        {
          label: "Transférabilité de la furtivité",
          value: "Faible — technologie stratégique rarement cédée",
          confidence: "moyenne",
          sources: ["iiss-mb"],
        },
      ],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "B",
      rationale:
        "Un démonstrateur tenu dans une enveloppe d'environ 405 M€, mutualisée à six : rendement élevé pour de l'acquisition de compétence, mais hors logique de coût opérationnel.",
    },
    {
      key: "survivabilite",
      grade: "B",
      rationale:
        "Furtivité « excellente » selon la DGA et essais de pénétration réussis contre le Charles de Gaulle ; non confronté à une défense sol-air réelle — évaluation prudente.",
    },
    {
      key: "exportabilite",
      grade: "E",
      rationale:
        "Sans objet : démonstrateur non commercialisable. Un éventuel dérivé relèverait du MTCR catégorie I et d'un contrôle d'export strict.",
    },
    {
      key: "risque-industriel",
      grade: "B",
      rationale:
        "Chaîne intégralement européenne et programme livré ; le risque réel se reporte sur l'industrialisation, non démontrée, d'un futur programme de série.",
    },
    {
      key: "maturite",
      grade: "C",
      rationale:
        "Démonstrateur abouti — plus de 170 vols — mais ni armement opérationnel, ni opérateur, ni production : la maturité technologique n'est pas une maturité de système.",
    },
    {
      key: "confiance-donnees",
      grade: "B",
      rationale:
        "Programme bien documenté côté constructeur et institutionnel ; la filiation vers le futur drone F5 reste mouvante et certains chiffres tiennent au discours de Dassault.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : la France dispose d'un drone de combat furtif. La réalité : le nEUROn est un démonstrateur, arrêté après sa campagne d'essais. Il a prouvé des technologies — signature radar réduite, soute interne, vol autonome — mais il n'a jamais été armé en opération, n'a aucun opérateur et n'entrera jamais en service. Sa réussite est celle d'un laboratoire volant, pas d'un système d'armes.",
    bestUseCase:
      "La validation, à l'échelle d'un seul exemplaire, des briques technologiques d'un futur UCAV furtif européen : furtivité, intégration d'armement en soute, conduite d'une aile volante, et — tout aussi importante — la coopération industrielle multinationale sous maîtrise d'œuvre française.",
    weakPoint:
      "Le passage à l'opérationnel. Un démonstrateur ne dit rien du coût de série, de la fiabilité d'un parc, ni du comportement face à une défense aérienne contestée. Tout le risque a été repoussé sur le programme successeur, qui reste à financer et à définir.",
    analystNote:
      "Le nEUROn se juge à son intention, pas à sa fiche technique : conserver en Europe une compétence que les États-Unis ne transfèrent pas. À ce titre, c'est un succès — calendrier tenu, chaîne souveraine, savoir-faire acquis. Mais en 2026 il appartient au passé : sa valeur réelle dépend désormais entièrement de la capacité de la France et de ses partenaires à transformer ce capital de compétence en un drone de combat opérationnel aux côtés du Rafale F5. Un démonstrateur réussi qui ne déboucherait sur rien serait une compétence laissée à s'éroder.",
  },
  operators: ["Aucun — démonstrateur"],
  theatres: [
    "Aucun — essais en vol (Istres, Salto di Quirra, Vidsel)",
    "Tests de pénétration contre le porte-avions Charles de Gaulle (2016)",
  ],
  sources: [
    {
      id: "dassault-neuron",
      title: "nEUROn — démonstrateur de drone de combat",
      publisher: "Dassault Aviation",
      type: "constructeur",
      reliability: "B",
      url: "https://www.dassault-aviation.com",
    },
    {
      id: "dassault-f5",
      title: "Rafale F5 et drone de combat associé — annonce de programme",
      publisher: "Ministère des Armées / Dassault Aviation",
      type: "officiel",
      reliability: "B",
      date: "2024-10",
    },
    {
      id: "senat-rapport",
      title: "Rapport sur le projet de loi de finances — équipement des forces",
      publisher: "Sénat",
      type: "officiel",
      reliability: "A",
    },
    {
      id: "usine-nouvelle",
      title: "nEUROn — couverture du contrat et du programme",
      publisher: "L'Usine Nouvelle",
      type: "presse",
      reliability: "B",
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
