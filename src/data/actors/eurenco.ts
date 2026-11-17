import { ind, src } from "../systems/registry-helpers";
import type { ActorDossier } from "./types";

// Eurenco — dossier d'acteur issu du registre « Souveraineté industrielle » du
// 17/11/2026. Toutes les données d'entreprise viennent d'un seul relais,
// Forces Operations Blog (9 juillet 2026) : le registre les classe « officiel »
// parce qu'elles reprennent des chiffres de l'entreprise, la source reste un
// blog spécialisé, notée C.

const FOB = ["fob-eurenco-2026"];

export const eurenco: ActorDossier = {
  slug: "eurenco",
  name: "Eurenco",
  reference: "PNP-ACT-003",
  kind: "groupe-industriel",
  country: "France",
  flag: "🇫🇷",
  tagline:
    "Les poudres et les charges modulaires de l'artillerie européenne : 570 M€ de chiffre d'affaires en 2025, 80 % à l'export, 1,2 million de charges par an visé dès 2027.",
  summary:
    "Eurenco produit les poudres propulsives et les charges modulaires, un maillon critique de la chaîne de munitions européenne. Son chiffre d'affaires a quasi triplé depuis 2020 pour atteindre 570 M€ en 2025 ; 80 % se font à l'export et 7 % seulement en France. L'État français est actionnaire.\n\nLe site de Bergerac concentre l'effort : relocalisation de la poudre gros calibre en 2025, nouvel investissement de 50 M€ en juillet 2026, objectif de 1,2 million de charges modulaires par an dès 2027. Toutes les données d'entreprise viennent d'un seul relais, Forces Operations Blog, du 9 juillet 2026 : Panoplie les signale comme telles, et note que le registre ne trouve aucune capacité de production de poudres pour 2026.",
  keyFigures: [
    ind("Chiffre d'affaires 2025", "570 M€ en 2025", "moyenne", {
      ids: ["MET-1481"],
      fs: "officiel",
      src: FOB,
      note: "Données d'entreprise relayées par Forces Operations Blog.",
    }),
    ind("Part de l'export dans le chiffre d'affaires 2025", "80 % à l'export", "moyenne", {
      ids: ["MET-1484"],
      fs: "officiel",
      src: FOB,
    }),
    ind("Salariés en 2026", "1 750 salariés", "moyenne", {
      ids: ["MET-1489"],
      fs: "officiel",
      src: FOB,
    }),
    ind("Production de charges modulaires visée dès 2027", "1,2 million par an dès 2027", "moyenne", {
      ids: ["MET-1494"],
      fs: "officiel",
      src: FOB,
      note: "Valeur confirmée par la source citée (Forces Operations Blog, 9 juillet 2026) : 1,2 million par an à compter de 2027, à Bergerac.",
    }),
  ],
  bricks: [
    {
      key: "finance",
      narrative:
        "Le chiffre d'affaires est passé de 483–500 M€ en 2024 à 570 M€ en 2025, soit un quasi-triplement depuis 2020. Les objectifs — environ 700 M€ en 2026, 1,0 Md€ en 2028, 1,5 Md€ en 2030 — sont ceux de l'entreprise : ce sont des cibles, pas des résultats.",
      indicators: [
        ind("Chiffre d'affaires 2024", "483–500 M€ en 2024", "moyenne", {
          ids: ["MET-1482"],
          fs: "officiel",
          src: FOB,
        }),
        ind("Multiplication du chiffre d'affaires depuis 2020", "Quasi triplé depuis 2020", "moyenne", {
          ids: ["MET-1483"],
          fs: "officiel",
          src: FOB,
        }),
        ind("Part de la France dans le chiffre d'affaires 2025", "7 % en France", "moyenne", {
          ids: ["MET-1485"],
          fs: "officiel",
          src: FOB,
        }),
        ind("Objectif de chiffre d'affaires 2026", "Cible 2026 : environ 700 M€", "moyenne", {
          ids: ["MET-1486"],
          fs: "officiel",
          src: FOB,
          note: "Objectif de l'entreprise, pas un résultat.",
        }),
        ind("Objectif de chiffre d'affaires 2028", "Vise 1,0 Md€ en 2028", "moyenne", {
          ids: ["MET-1487"],
          fs: "officiel",
          src: FOB,
          note: "Objectif de l'entreprise, pas un résultat.",
        }),
        ind("Objectif de chiffre d'affaires 2030", "1,5 Md€ en 2030", "moyenne", {
          ids: ["MET-1488"],
          fs: "officiel",
          src: FOB,
          note: "Objectif de l'entreprise, pas un résultat.",
        }),
        ind("Cible de salariés d'Eurenco", "Vers 2 000 à l'horizon 2030", "moyenne", {
          ids: ["MET-1490"],
          fs: "officiel",
          src: FOB,
        }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "La capacité de poudre gros calibre à Bergerac est de 1 200 tonnes par an depuis la relocalisation de 2025 ; un nouvel investissement de 50 M€, en juillet 2026, doit la doubler, sans valeur cible chiffrée. La production de charges modulaires passe de 150 000 en 2020 à 1,2 million par an visé dès 2027.\n\nLe chiffre de 800 000 coups de 155 mm ne se lit pas à Bergerac en 2027 : la source citée le rattache à l'ensemble du groupe, avec les coentreprises de Pologne et de Slovaquie, à la fin de la décennie. Pour 2026, aucune capacité de production de poudres n'a été trouvée.",
      indicators: [
        ind("Capacité de production de poudre gros calibre à Bergerac", "1 200 t/an (2025)", "moyenne", {
          ids: ["MET-1491"],
          fs: "officiel",
          src: FOB,
          note: "Capacité dite « doublée » par l'investissement de juillet 2026, sans valeur cible chiffrée.",
        }),
        ind("Nouvel investissement à Bergerac", "50 M€ en juillet 2026", "moyenne", {
          ids: ["MET-1492"],
          fs: "officiel",
          src: FOB,
        }),
        ind("Production de charges modulaires en 2020", "150 000 charges modulaires en 2020", "moyenne", {
          ids: ["MET-1493"],
          fs: "officiel",
          src: FOB,
        }),
        ind("Coups de 155 mm correspondants", "800 000 coups de 155 mm — à l'échelle du groupe, d'ici la fin de la décennie", "faible", {
          ids: ["MET-1495"],
          fs: "officiel",
          src: FOB,
          note: "Le registre rattache ce chiffre à 2027 ; la source vérifiée ne le fait pas : il correspond à environ 4,8 millions de charges pour le groupe, avec les coentreprises de Pologne et de Slovaquie.",
        }),
        ind("Capacité de production de poudres en 2026", "n.c. — aucune capacité 2026 trouvée", "faible", {
          ids: ["MET-0217"],
          fs: "non-communique",
        }),
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Eurenco vend l'essentiel de sa production hors de France et s'associe à des partenaires étrangers : Helsing pour les têtes militaires de drones, et ZVS en Slovaquie dans une coentreprise de mars 2026. L'État français reste actionnaire.\n\nLe registre relève trois fragilités : des poudres « totalement saturées » en novembre 2024, une chaîne de munitions européenne dont Eurenco est un maillon critique, et une transition de gouvernance doublée de survols de drones suspects à Bergerac.",
      indicators: [
        ind("Règle de contenu local et accès au code source", "non documenté", "faible"),
      ],
    },
  ],
  registryEntityIds: ["ENT-EURENCO"],
  industrialChain: [
    { entityId: "ENT-EURENCO", entityName: "Eurenco", actor: "État français", role: "Actionnaire", country: "France", scope: "Actionnaire" },
    { entityId: "ENT-EURENCO", entityName: "Eurenco", actor: "Helsing", role: "Partenaire", country: "Allemagne / Europe", scope: "Têtes militaires de drones" },
    { entityId: "ENT-EURENCO", entityName: "Eurenco", actor: "ZVS", role: "Partenaire", country: "Slovaquie", scope: "Coentreprise (mars 2026)" },
  ],
  sovereignty: [
    { entityId: "ENT-EURENCO", localContentRule: "Non_specifie", thirdPartyLock: "Non_specifie", sourceCodeAccess: "Non_specifie", chokepoints: ["Poudres : « totalement saturé » en novembre 2024 (note13 [^9])", "Maillon critique de la chaîne de munitions européenne : poudres propulsives et charges modulaires (fr.md renvoi 200)", "Transition de gouvernance (départ du PDG Thierry Francou en 2026) et survols de drones suspects à Bergerac (fr.md renvoi 200)"] },
  ],
  watchpoints: [
    { entityId: "ENT-EURENCO", entityName: "Eurenco", horizon: "2027", event: "Bergerac : 1,2 million de charges modulaires/an" },
    { entityId: "ENT-EURENCO", entityName: "Eurenco", horizon: "2028", event: "CA visé 1,0 Md€" },
    { entityId: "ENT-EURENCO", entityName: "Eurenco", horizon: "2030", event: "CA visé 1,5 Md€" },
  ],
  analystNote:
    "Tout le dossier repose sur un seul relais de presse spécialisée : aucun communiqué d'Eurenco n'est cité. À suivre : la capacité réelle de poudres en 2026 et la montée en charge de Bergerac en 2027.",
  sources: [
    src("fob-eurenco-2026", "Forces Operations Blog", "Armer les drones et poursuivre son expansion, la double mission d'Eurenco", "presse", "C", "2026-07-09", "https://forcesoperations.com/armer-les-drones-et-poursuivre-son-expansion-la-double-mission-deurenco/"),
  ],
  updated: "2026-11-17",
};
