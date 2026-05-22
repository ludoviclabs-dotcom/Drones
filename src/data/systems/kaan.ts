import type { DefenseSystem } from "../types";

export const kaan: DefenseSystem = {
  slug: "kaan",
  name: "KAAN",
  designation: "Turkish Aerospace KAAN",
  reference: "PNP-AC-012",
  category: "combat-aircraft",
  combatAircraftClass: "gen-5",
  claimedGeneration: "5e génération revendiquée — appareil en développement",
  classLabel: "Chasseur furtif — programme souverain turc",
  country: "Turquie",
  flag: "🇹🇷",
  manufacturer: "Turkish Aerospace (TUSAŞ)",
  status: "En développement — premier vol en 2024, contrat d'export annoncé avec l'Indonésie",
  naval: "Non — aucune version navale annoncée.",
  acquisitionModes: ["production-nationale"],
  tagline:
    "L'ambition souveraine turque — un chasseur furtif en développement, déjà vendu, mais dépendant d'un moteur étranger.",
  summary:
    "Le KAAN de Turkish Aerospace est le chasseur furtif que la Turquie développe pour réduire sa dépendance au F-16 et compenser son exclusion du programme F-35. C'est un appareil de 5e génération revendiquée — furtivité, soutes internes, capteurs modernes — mais encore en développement : son premier vol date de février 2024.\n\nSa fiche est instructive parce qu'elle mêle une ambition stratégique forte, une montée en compétence industrielle réelle, une dépendance critique non résolue — la motorisation — et, fait rare, un contrat d'exportation signé avant même la maturité de l'avion. Le KAAN se vend avant d'exister pleinement.",
  keySpecs: [
    {
      label: "Équipage",
      value: "1",
      confidence: "moyenne",
      sources: ["tai"],
    },
    {
      label: "Furtivité",
      value: "Conçue dès l'origine — soutes internes",
      confidence: "moyenne",
      sources: ["tai"],
    },
    {
      label: "Motorisation actuelle",
      value: "General Electric F110 — moteur américain, sur prototypes et premiers lots",
      confidence: "haute",
      sources: ["turkish-minute"],
    },
    {
      label: "Motorisation visée",
      value: "TF-35000 — moteur turc en développement, horizon 2032",
      confidence: "moyenne",
      sources: ["turkish-minute"],
    },
    {
      label: "Premier vol",
      value: "21 février 2024",
      confidence: "haute",
      sources: ["reuters"],
    },
    {
      label: "Export",
      value: "Indonésie — 48 appareils annoncés (IDEF 2025)",
      confidence: "haute",
      sources: ["defense-news"],
    },
  ],
  bricks: [
    {
      key: "cout",
      narrative:
        "Le coût du KAAN est encore un coût de développement : essais, montée en compétence industrielle, mise au point d'un moteur national. C'est un investissement souverain lourd, consenti pour ne plus dépendre d'un fournisseur étranger.\n\nLe contrat indonésien — de l'ordre de dix milliards de dollars pour quarante-huit appareils — apporte un premier flux financier, mais sur un avion qui n'est pas encore mûr : le coût réel de possession reste, à ce stade, largement inconnu.",
      indicators: [
        {
          label: "Nature du coût",
          value: "Coût de développement — essais et industrialisation",
          confidence: "moyenne",
          sources: ["tai"],
        },
        {
          label: "Contrat export",
          value: "≈ 10 Md$ pour 48 appareils — Indonésie",
          confidence: "haute",
          sources: ["defense-news"],
        },
        {
          label: "Coût de possession",
          value: "Largement inconnu — appareil non encore mûr",
          confidence: "faible",
          status: "a-recouper",
          sources: ["reuters"],
        },
      ],
    },
    {
      key: "finance",
      narrative:
        "Le KAAN est financé par l'État turc, dans une logique d'autonomie stratégique. L'exclusion de la Turquie du programme F-35 a renforcé cette volonté souveraine.\n\nFait notable : la Turquie a signé un contrat d'exportation — 48 KAAN pour l'Indonésie — alors que l'avion est encore en développement. C'est un pari : l'export précoce finance le programme, mais expose à un risque si le calendrier dérape.",
      indicators: [
        {
          label: "Maître d'ouvrage",
          value: "État turc — programme d'autonomie stratégique",
          confidence: "haute",
          sources: ["tai"],
        },
        {
          label: "Export précoce",
          value: "Contrat indonésien signé avant la maturité de l'appareil",
          confidence: "haute",
          sources: ["defense-news"],
        },
        {
          label: "Pari financier",
          value: "L'export finance le programme — et l'expose au risque calendaire",
          confidence: "moyenne",
          sources: ["reuters"],
        },
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Turkish Aerospace conduit le programme et fait monter en compétence une base industrielle nationale. Mais la chaîne du KAAN n'est pas souveraine sur son maillon le plus critique : le moteur.\n\nLes prototypes et les premiers appareils sont propulsés par un General Electric F110 américain. La Turquie a reçu un premier lot de moteurs et attend l'aval des États-Unis pour les suivants. Un moteur national — le TF-35000 — est en développement, mais son entrée en service n'est pas attendue avant le début des années 2030.",
      indicators: [
        {
          label: "Maître d'œuvre",
          value: "Turkish Aerospace (TUSAŞ)",
          confidence: "haute",
          sources: ["tai"],
        },
        {
          label: "Dépendance critique",
          value: "Moteur GE F110 américain — aval des États-Unis requis",
          confidence: "haute",
          sources: ["turkish-minute"],
        },
        {
          label: "Moteur national",
          value: "TF-35000 en développement — horizon 2032",
          confidence: "moyenne",
          sources: ["turkish-minute"],
        },
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le KAAN est un projet d'émancipation. Écartée du F-35 après l'achat du système russe S-400, la Turquie a fait du chasseur national l'instrument de son autonomie aérienne et de son rang industriel.\n\nLe contrat indonésien lui ajoute une dimension : faire de la Turquie un exportateur de chasseurs de 5e génération, sur un marché dominé par les États-Unis, la Chine et la Russie. L'ambition est réelle ; sa réalisation dépend du calendrier et du moteur.",
      indicators: [
        {
          label: "Moteur stratégique",
          value: "Autonomie aérienne après l'exclusion du programme F-35",
          confidence: "haute",
          sources: ["reuters"],
        },
        {
          label: "Ambition export",
          value: "Faire de la Turquie un exportateur de chasseurs furtifs",
          confidence: "moyenne",
          sources: ["defense-news"],
        },
        {
          label: "Conditionnalité",
          value: "L'ambition dépend du calendrier et de la motorisation",
          confidence: "moyenne",
          sources: ["turkish-minute"],
        },
      ],
    },
    {
      key: "export",
      narrative:
        "Le KAAN a, fait rare, un client export avant d'être mûr : l'Indonésie, pour quarante-huit appareils. Les livraisons indonésiennes doivent s'échelonner sur une décennie.\n\nMais l'export bute sur la dépendance moteur : tant que le KAAN dépend du F110 américain, ses exportations restent soumises à l'aval de Washington. La Turquie prévoit que les appareils livrés à l'Indonésie soient motorisés par le futur moteur turc — une dépendance qu'il faudra avoir levée.",
      indicators: [
        {
          label: "Premier client export",
          value: "Indonésie — 48 appareils, livraisons sur une décennie",
          confidence: "haute",
          sources: ["defense-news"],
        },
        {
          label: "Verrou",
          value: "Le moteur américain soumet l'export à l'aval de Washington",
          confidence: "haute",
          sources: ["turkish-minute"],
        },
        {
          label: "Solution visée",
          value: "Motoriser les KAAN export avec le futur moteur turc",
          confidence: "moyenne",
          status: "a-recouper",
          sources: ["turkish-minute"],
        },
      ],
    },
  ],
  variants: [
    {
      label: "KAAN — lots initiaux",
      value:
        "Prototypes et premiers lots de production — motorisés par le GE F110 américain.",
      confidence: "moyenne",
      sources: ["turkish-minute"],
    },
    {
      label: "KAAN — moteur national",
      value:
        "Version visée avec le moteur turc TF-35000 — horizon début des années 2030.",
      confidence: "moyenne",
      status: "a-recouper",
      sources: ["turkish-minute"],
    },
    {
      label: "KAAN export",
      value:
        "Configuration destinée à l'Indonésie — 48 appareils, motorisation turque visée.",
      confidence: "moyenne",
      sources: ["defense-news"],
    },
  ],
  scores: [
    {
      key: "efficacite-cout",
      grade: "C",
      rationale:
        "Ambition réelle, mais appareil non mûr : son rapport effet/coût ne pourra être jugé qu'une fois le programme abouti et le moteur national disponible.",
    },
    {
      key: "survivabilite",
      grade: "C",
      rationale:
        "Furtivité conçue dès l'origine, mais non démontrée en service ; évaluation indicative pour un appareil encore en développement.",
    },
    {
      key: "exportabilite",
      grade: "B",
      rationale:
        "Un contrat export concret existe déjà (Indonésie), mais la dépendance au moteur américain en borne la pleine autonomie.",
    },
    {
      key: "risque-industriel",
      grade: "D",
      rationale:
        "Dépendance critique à un moteur étranger, moteur national non disponible avant le début des années 2030, montée en compétence encore en cours.",
    },
    {
      key: "maturite",
      grade: "D",
      rationale:
        "Premier vol en 2024 — appareil en développement, pas encore en service ni produit en série.",
    },
    {
      key: "confiance-donnees",
      grade: "C",
      rationale:
        "Programme jeune ; calendrier et performances annoncés, mais peu de données consolidées et vérifiables.",
    },
  ],
  editorial: {
    mythVsReality:
      "Le mythe : un chasseur furtif turc déjà opérationnel et souverain. La réalité : un appareil en développement, prometteur, mais dépendant d'un moteur américain — et vendu à l'export avant d'être mûr.",
    bestUseCase:
      "Doter la Turquie d'une capacité aérienne souveraine après son exclusion du F-35 — et, à terme, s'imposer comme exportateur de chasseurs furtifs.",
    weakPoint:
      "La motorisation : tant que le KAAN dépend du moteur américain F110, sa souveraineté et son export restent sous condition ; le moteur turc n'est pas attendu avant le début des années 2030.",
    analystNote:
      "Le KAAN combine une ambition stratégique forte et un pari risqué : vendre — 48 appareils à l'Indonésie — un avion encore en développement. Sa réussite se jouera moins sur la cellule, déjà volante, que sur le moteur national : sans lui, la souveraineté revendiquée reste inachevée.",
  },
  operators: ["Turquie (en développement)", "Indonésie (commande)"],
  theatres: ["Turquie — essais en vol"],
  timeline: [
    {
      date: "2024",
      label: "Premier vol du KAAN, le 21 février.",
      kind: "jalon",
    },
    {
      date: "2025",
      label:
        "Signature d'un contrat d'export de 48 KAAN avec l'Indonésie (IDEF, Istanbul).",
      kind: "export",
    },
    {
      date: "2025",
      label:
        "La Turquie reçoit un premier lot de moteurs F110 et attend l'aval américain pour la suite.",
      kind: "debat",
    },
    {
      date: "2032",
      label: "Entrée en service visée du moteur national TF-35000.",
      kind: "jalon",
    },
  ],
  sources: [
    {
      id: "tai",
      title: "KAAN — programme de chasseur de nouvelle génération",
      publisher: "Turkish Aerospace (TUSAŞ)",
      type: "constructeur",
      reliability: "B",
      url: "https://www.tusas.com/en/product/kaan",
    },
    {
      id: "reuters",
      title: "Turkey's KAAN fighter — premier vol et programme",
      publisher: "Reuters",
      type: "presse",
      reliability: "B",
      url: "https://www.reuters.com/",
    },
    {
      id: "defense-news",
      title: "First KAAN export prospect: Turkey to deliver 48 jets to Indonesia",
      publisher: "Defense News",
      type: "presse",
      reliability: "C",
      url: "https://www.defensenews.com/global/europe/2025/06/12/first-kaan-export-prospect-turkey-to-deliver-48-jets-to-indonesia/",
    },
    {
      id: "turkish-minute",
      title: "Turkey has received 10 engines for KAAN, awaits US approval",
      publisher: "Turkish Minute",
      type: "presse",
      reliability: "C",
      url: "https://turkishminute.com/2025/12/26/turkey-has-received-10-engines-for-kaan-awaits-us-approval-for-80-more/",
    },
  ],
  updated: "2026-05-22",
};
