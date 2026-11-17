import { ind, src } from "../systems/registry-helpers";
import type { ActorDossier } from "./types";

// KNDS — dossier d'acteur issu du registre « Souveraineté industrielle » du
// 17/11/2026. Le prix du rachat des 50 % de la famille Bode-Wegmann est un
// chiffre de presse non officiel : le registre signale un écart entre deux
// sources (≈ 6,5 Md€ chez Bloomberg, 6,6 Md€ chez Reuters) et retient 6,6 Md€.

export const knds: ActorDossier = {
  slug: "knds",
  name: "KNDS",
  reference: "PNP-ACT-001",
  kind: "groupe-industriel",
  country: "France · Allemagne",
  flag: "🇫🇷🇩🇪",
  tagline:
    "Nexter et Krauss-Maffei Wegmann réunis : 4,4 Md€ de chiffre d'affaires, 33,1 Md€ de carnet, et un capital que Berlin s'apprête à racheter à moitié.",
  summary:
    "KNDS est le groupe franco-allemand de l'armement terrestre, né en 2015 de la fusion de Nexter et de Krauss-Maffei Wegmann. Il construit le Leopard 2, le Puma et le PzH 2000 côté allemand, le Leclerc, le CAESAR et le VBCI côté français. En 2025, il affiche 4,4 Md€ de chiffre d'affaires et 33,1 Md€ de carnet de commandes, soit 7,5 ans d'activité.\n\nLe capital est à l'arrêt sur une opération en cours : l'introduction en Bourse a été suspendue début juillet 2026, et Berlin a conclu le 5 novembre un accord de principe pour reprendre les 50 % de la famille Bode-Wegmann. Le prix — 6,6 Md€ selon Reuters — n'est confirmé par aucun communiqué officiel, et le contrat n'était pas signé au 9 novembre 2026. Pour Panoplie, le dossier lit ce qui est publié, signale ce qui ne l'est pas, et ne tranche pas la gouvernance à venir.",
  keyFigures: [
    ind("Chiffre d'affaires 2025", "4,4 Md€", "haute", {
      ids: ["MET-0009"],
      fs: "officiel",
      src: ["knds-resultats-2025"],
      note: "Communiqué de résultats de KNDS du 26 mai 2026.",
    }),
    ind("Carnet de commandes fin 2025", "33,1 Md€", "haute", {
      ids: ["MET-0016"],
      fs: "officiel",
      src: ["knds-resultats-2025"],
    }),
    ind("Prises de commandes 2025", "13,5 Md€", "haute", {
      ids: ["MET-0143"],
      fs: "officiel",
      src: ["knds-resultats-2025"],
    }),
    ind("EBIT 2025", "661 M€", "haute", {
      ids: ["MET-0017"],
      fs: "officiel",
      src: ["knds-resultats-2025"],
    }),
    ind("Effectifs du groupe", "≈ 11 000 salariés", "haute", {
      ids: ["MET-0018"],
      fs: "officiel",
      src: ["knds-resultats-2025"],
    }),
  ],
  bricks: [
    {
      key: "finance",
      narrative:
        "L'activité tient en deux entités et une division : 2,5 Md€ pour Land Systems Germany (57 % du chiffre d'affaires, calcul), 1,3 Md€ pour Land Systems France (30 %, calcul) et 0,61 Md€ pour les Munitions. Ni la trésorerie ni la dette nette ne sont communiquées.\n\nLa valeur du capital n'est pas publiée : les chiffres qui circulent — 20 Md€ fin 2025, plus de 12 Md€ que les actionnaires peinaient à faire accepter en juillet — viennent de la presse et ne se recoupent pas.",
      indicators: [
        ind("Chiffre d'affaires de Land Systems Germany", "2,5 Md€ — Leopard 2, Puma, PzH 2000", "haute", {
          ids: ["MET-0010"],
          fs: "officiel",
          src: ["knds-resultats-2025"],
        }),
        ind("Chiffre d'affaires de Land Systems France", "1,3 Md€ — Leclerc, CAESAR, VBCI", "haute", {
          ids: ["MET-0011"],
          fs: "officiel",
          src: ["knds-resultats-2025"],
        }),
        ind("Chiffre d'affaires de la division Munitions", "0,61 Md€", "haute", {
          ids: ["MET-0012"],
          fs: "officiel",
          src: ["knds-resultats-2025"],
        }),
        ind("Part de l'activité allemande dans le CA 2025", "57 % (calc.)", "moyenne", {
          ids: ["MET-0013"],
          fs: "calcule",
          src: ["knds-resultats-2025"],
        }),
        ind("Part de l'activité française dans le CA 2025", "30 % (calc.)", "moyenne", {
          ids: ["MET-0014"],
          fs: "calcule",
          src: ["knds-resultats-2025"],
        }),
        ind("Part de la division Munitions dans le CA 2025", "14 % (calc.)", "moyenne", {
          ids: ["MET-0015"],
          fs: "calcule",
          src: ["knds-resultats-2025"],
        }),
        ind("Valeur des fonds propres fin 2025", "≈ 20 Md€ — estimation de presse sans source primaire", "faible", {
          ids: ["MET-0007"],
          fs: "presse",
          src: ["opex360-knds-nationalisation"],
        }),
        ind("Valorisation visée pour l'introduction en Bourse", "Plus de 12 Md€ — valorisation que les actionnaires peinaient à faire accepter (juillet 2026)", "moyenne", {
          ids: ["MET-0008"],
          fs: "presse",
          src: ["ats-sudostschweiz-knds"],
        }),
      ],
    },
    {
      key: "cout",
      narrative:
        "Le rachat des 50 % de la famille Bode-Wegmann par l'État allemand est un accord de principe, pas un contrat. Le prix de 6,6 Md€ est rapporté par Reuters, Handelsblatt et Spiegel ; Bloomberg avançait environ 6,5 Md€ à partir d'une source unique, et Reuters donnait aussi une borne haute à moins de 7,2 Md€. Aucun communiqué officiel ne chiffre l'opération.\n\nLe Bundestag avait budgété 7,2 Md€ en juin pour 40 % du capital : c'est un plafond budgétaire d'un schéma abandonné, pas un prix.",
      indicators: [
        ind("Part du capital que l'État allemand rachèterait", "50 % — accord de principe du 5 novembre 2026, contrat non signé au 9 novembre", "moyenne", {
          ids: ["MET-0001"],
          fs: "presse",
          src: ["afp-boursorama-knds"],
        }),
        ind("Prix rapporté du rachat de 50 %", "6,6 Md€ — chiffre non officiel (Reuters, Handelsblatt, Spiegel)", "moyenne", {
          ids: ["MET-0002"],
          fs: "source-unique",
          src: ["reuters-euronext-knds", "israeldefense-knds"],
          note: "Bloomberg, relayé par IsraelDefense, rapportait environ 6,5 Md€ à partir d'une source unique : écart faible, non retenu. Aucun communiqué officiel ne confirme le prix.",
        }),
        ind("Prix du rachat : borne haute selon Reuters", "Moins de 7,2 Md€", "faible", {
          ids: ["MET-0003"],
          fs: "presse",
          src: ["wiwo-knds"],
          note: "Une borne, pas un prix : elle ne confirme aucun des deux chiffres précédents.",
        }),
        ind("Montant budgété par le Bundestag pour 40 % du capital", "7,2 Md€ en juin 2026 — plafond budgétaire d'un schéma abandonné, pas un prix", "moyenne", {
          ids: ["MET-0004"],
          fs: "requete-budgetaire",
          src: ["dts-finanznachrichten-knds"],
        }),
        ind("Valeur implicite des fonds propres — schéma de juin", "18 Md€ (calc.) — 7,2 Md€ rapportés à 40 %", "faible", {
          ids: ["MET-0005"],
          fs: "calcule",
          src: ["dts-finanznachrichten-knds"],
        }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "L'empreinte industrielle est double. À Kassel, site de l'ex-Krauss-Maffei Wegmann, KNDS emploie environ 2 000 personnes, dont plus de 1 000 recrutées en cinq ans. Côté français, KNDS France a consenti un préfinancement équivalent à 500 M€ sur deux ans, soit environ un tiers de son chiffre d'affaires annuel.",
      indicators: [
        ind("Effectifs de KNDS à Kassel", "Environ 2 000 personnes (2026)", "moyenne", {
          ids: ["MET-0021"],
          fs: "presse",
          src: ["hessenschau-knds"],
        }),
        ind("Recrutements à Kassel en cinq ans", "Plus de 1 000 salariés", "moyenne", {
          ids: ["MET-0022"],
          fs: "presse",
          src: ["hessenschau-knds"],
        }),
        ind("Préfinancement consenti par KNDS France sur deux ans", "L'équivalent de 500 M€ sur deux ans (2023-2024)", "haute", {
          ids: ["MET-0226"],
          fs: "officiel",
          src: ["an-audition-2024"],
        }),
        ind("Préfinancement rapporté au chiffre d'affaires annuel de KNDS France", "Environ un tiers (2024)", "haute", {
          ids: ["MET-0227"],
          fs: "officiel",
          src: ["an-audition-2024"],
        }),
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le dossier suit une escalade de la participation fédérale : 25,1 % visés au départ, 40 % dans le schéma de juin (avec 20 % cotés à Paris et à Francfort), puis 50 % dans l'accord de novembre. Chaque État envisagerait ensuite de céder 10 % par une cotation différée — une information à source unique, qui dépend de la présidentielle française du printemps 2027.\n\nLe contrôle est de coopération multinationale, avec approbation parlementaire requise. Le registre relève deux points de tension : le report de la double cotation Paris-Francfort, et le décalage de dix ans du MGCS avec la rivalité de Rheinmetall.",
      indicators: [
        ind("Participation initialement visée par le gouvernement fédéral", "25,1 % (avant juin 2026)", "moyenne", {
          ids: ["MET-0023"],
          fs: "presse",
          src: ["opex360-knds-berlin-14-oct"],
        }),
        ind("Part de chaque État dans le schéma de juin (avant cotation)", "40 % pour chaque État", "moyenne", {
          ids: ["MET-0024"],
          fs: "presse",
          src: ["ats-sudostschweiz-knds"],
        }),
        ind("Part du capital à coter à Paris et Francfort (schéma de juin)", "20 % cotés", "moyenne", {
          ids: ["MET-0025"],
          fs: "presse",
          src: ["ats-sudostschweiz-knds"],
        }),
        ind("Part que chaque État envisagerait de céder plus tard", "10 % chacun — cotation différée", "faible", {
          ids: ["MET-0026"],
          fs: "source-unique",
          src: ["israeldefense-knds"],
          note: "Dépend de la présidentielle française du printemps 2027 ; aucune source ne fixe d'échéance.",
        }),
      ],
    },
  ],
  relatedSystems: ["leclerc-xlr", "caesar-mk2", "caesar-8x8", "leopard-2a8", "pzh-2000"],
  registryEntityIds: ["ENT-KNDS", "ENT-KNDS-FRANCE", "ENT-KNDS-DEUTSCHLAND"],
  timeline: [
    { date: "2015", label: "En 2015, fusion de Nexter et de Krauss-Maffei Wegmann : naissance de KNDS.", kind: "jalon", metricIds: ["MET-0031"] },
    { date: "2026-06", label: "Le 22 juin 2026, accord franco-allemand sur la stratégie et la gouvernance de KNDS.", kind: "jalon", metricIds: ["MET-0032"] },
    { date: "2026-07", label: "Les 1er et 2 juillet 2026, suspension de l'introduction en Bourse de KNDS.", kind: "debat", metricIds: ["MET-0033"] },
    { date: "2026-11", label: "Les 5 et 6 novembre 2026, accord de principe entre Berlin et la famille Bode-Wegmann.", kind: "jalon", metricIds: ["MET-0034"] },
    { date: "2026-11", label: "Novembre 2026 : signature visée du contrat de rachat par l'État allemand.", kind: "jalon", metricIds: ["MET-0035"] },
    { date: "2026-12", label: "Décembre 2026 : finalisation visée du rachat par l'État allemand.", kind: "jalon", metricIds: ["MET-0036"] },
  ],
  industrialChain: [
    { entityId: "ENT-KNDS", entityName: "KNDS", actor: "État français (via GIAT Industries)", role: "Actionnaire", country: "France", scope: "50 % du capital" },
    { entityId: "ENT-KNDS", entityName: "KNDS", actor: "Famille Bode-Wegmann (holding Wegmann & Co)", role: "Actionnaire", country: "Allemagne", scope: "50 % du capital ; accord de principe de cession à l'État fédéral le 05/11/2026" },
    { entityId: "ENT-KNDS", entityName: "KNDS", actor: "État fédéral allemand", role: "Actionnaire", country: "Allemagne", scope: "Acquéreur pressenti des 50 % Wegmann (contrat non signé au 09/11/2026)" },
    { entityId: "ENT-KNDS", entityName: "KNDS", actor: "Bundeswehr", role: "Client", country: "Allemagne", scope: "Premier client du groupe" },
    { entityId: "ENT-KNDS-FRANCE", entityName: "KNDS France (Land Systems France)", actor: "État français", role: "Actionnaire", country: "France", scope: "Action spécifique (Golden Share)" },
  ],
  sovereignty: [
    { entityId: "ENT-KNDS", scope: "KNDS", localContentRule: "Cooperation_Multinationale", thirdPartyLock: "Approbation_Parlementaire_Requise", sourceCodeAccess: "Non_specifie", chokepoints: ["Tensions de gouvernance franco-allemande : report de la double cotation Paris/Francfort (1er juil. 2026), rachat envisagé par Berlin (fr.md renvoi 88)", "Décalage de 10 ans du MGCS et rivalité avec Rheinmetall (fr.md renvoi 14)"] },
  ],
  watchpoints: [
    { entityId: "ENT-KNDS", entityName: "KNDS", horizon: "Nov. 2026", event: "Signature du contrat d'achat : prix définitif et éventuelle approbation de la commission du budget du Bundestag." },
    { entityId: "ENT-KNDS", entityName: "KNDS", horizon: "Déc. 2026", event: "Finalisation de l'opération : KNDS devient détenue à 100 % par les deux États." },
    { entityId: "ENT-KNDS", entityName: "KNDS", horizon: "Après le printemps 2027", event: "Position officielle de Paris : maintien ou abandon de la cession de 10 % envisagée par chaque État." },
    { entityId: "ENT-KNDS", entityName: "KNDS", horizon: "Ouvert", event: "Gouvernance capitalistique après la suspension de l'IPO du 1er juillet 2026 (§12)" },
  ],
  programmeTree: [
    { entityId: "ENT-KNDS", name: "KNDS", kind: "Acteur_Industriel", children: [
      { entityId: "ENT-KNDS-FRANCE", name: "KNDS France (Land Systems France)", kind: "Acteur_Industriel", children: [
        { entityId: "ENT-LECLERC", name: "Char Leclerc", kind: "Plateforme_Vecteur", children: [
          { entityId: "ENT-LECLERC-XLR", name: "Leclerc XLR (rénové)", kind: "Plateforme_Vecteur" },
        ] },
        { entityId: "ENT-CAESAR", name: "CAESAR", kind: "Plateforme_Vecteur", children: [
          { entityId: "ENT-CAESAR-MKII", name: "CAESAR NG / MkII", kind: "Plateforme_Vecteur" },
        ] },
        { entityId: "ENT-VBCI", name: "VBCI", kind: "Plateforme_Vecteur" },
      ] },
      { entityId: "ENT-KNDS-DEUTSCHLAND", name: "KNDS Deutschland (Land Systems Germany)", kind: "Acteur_Industriel", children: [
        { entityId: "ENT-LEOPARD-2", name: "Leopard 2", kind: "Plateforme_Vecteur" },
        { entityId: "ENT-PUMA", name: "Puma", kind: "Plateforme_Vecteur" },
        { entityId: "ENT-PZH-2000", name: "PzH 2000", kind: "Plateforme_Vecteur" },
      ] },
      { entityId: "ENT-MGCS", name: "MGCS (char du futur)", kind: "Programme_Cadre" },
      { entityId: "ENT-LORAS", name: "LORAS", kind: "Plateforme_Vecteur" },
    ] },
  ],
  analystNote:
    "Le prix et le calendrier du rachat reposent sur la presse : tant que le contrat n'est pas signé et qu'aucun communiqué ne le chiffre, 6,6 Md€ reste une valeur rapportée, pas un montant acquis. À suivre fin novembre 2026 : signature, prix définitif, approbation de la commission du budget du Bundestag.",
  sources: [
    src("knds-resultats-2025", "KNDS", "KNDS achieves strong revenue growth and record order intake in 2025", "constructeur", "B", "2026-05-26", "https://knds.com/en/press-releases/knds-achieves-strong-revenue-growth-and-record-order-intake-in-2025"),
    src("afp-boursorama-knds", "AFP via Boursorama", "Armement : « accord de principe » pour l'entrée de Berlin au capital de KNDS (source gouvernementale)", "presse", "C", "2026-11-05", "https://www.boursorama.com/actualite-economique/actualites/armement-accord-de-principe-pour-l-entree-de-berlin-au-capital-de-knds-source-gouvernementale-9af84708128b33e23044747bd9f963a1"),
    src("reuters-euronext-knds", "Reuters via Euronext", "Germany to pay €6.6 billion for 50% stake in Leopard tank maker KNDS", "presse", "C", "2026-11-10", "https://live.euronext.com/en/financial-news/germany-pay-eu66-billion-50-stake-leopard-tank-maker-knds"),
    src("israeldefense-knds", "IsraelDefense (reprenant Bloomberg)", "Germany to Acquire 50% Stake in Tank Maker KNDS for €6.5 Billion", "presse", "C", "2026-11-08", "https://www.israeldefense.co.il/en/node/72552"),
    src("wiwo-knds", "WirtschaftsWoche (Reuters)", "Rüstung: Offenbar Einigung über Einstieg des Bundes bei KNDS mit 50 Prozent", "presse", "C", "2026-11-05", "https://www.wiwo.de/unternehmen/industrie/ruestung-offenbar-einigung-ueber-einstieg-des-bundes-bei-knds-mit-50-prozent/100267582.html"),
    src("dts-finanznachrichten-knds", "Agence dts via finanznachrichten.de", "Bericht: Bund und Eigentümer einigen sich auf KNDS-Übernahme", "presse", "C", "2026-11-05", "https://www.finanznachrichten.de/nachrichten-2026-11/70043419-bericht-bund-und-eigentuemer-einigen-sich-auf-knds-uebernahme-003.htm"),
    src("opex360-knds-nationalisation", "Opex360 (Zone Militaire)", "Armement terrestre : La nationalisation totale du groupe franco-allemand KNDS se précise", "presse", "C", "2026-11-06", "https://www.opex360.com/2026/11/06/armement-terrestre-la-nationalisation-totale-du-groupe-franco-allemand-knds-se-precise/"),
    src("opex360-knds-berlin-14-oct", "Opex360", "Armement terrestre : Berlin envisage d'acquérir 50 % du groupe franco-allemand KNDS", "presse", "C", "2026-10-14", "https://www.opex360.com/2026/10/14/armement-terrestre-berlin-envisage-dacquerir-50-du-groupe-franco-allemand-knds/"),
    src("ats-sudostschweiz-knds", "ATS via Südostschweiz", "Rüstungskonzern KNDS bläst Börsengang ab", "presse", "C", "2026-07-02", "https://www.suedostschweiz.ch/schweiz-und-welt/ruestungskonzern-knds-blaest-boersengang-ab-2-1947783"),
    src("hessenschau-knds", "hessenschau.de", "Deutschland steigt wohl mit 50 Prozent beim Rüstungskonzern KNDS ein", "presse", "C", "2026-10-15", "https://www.hessenschau.de/wirtschaft/deutschland-steigt-mit-50-prozent-beim-ruestungskonzern-knds-ein-v1,knds-kassel-staatskonzern-100.html"),
    src("elysee-knds-accord", "Présidence de la République", "La France et l'Allemagne ont conclu un accord sur la stratégie et la gouvernance de KNDS (communiqué conjoint)", "officiel", "A", "2026-06-22", "https://www.elysee.fr/emmanuel-macron/2026/06/22/la-france-et-lallemagne-ont-conclu-un-accord-sur-la-strategie-et-la-gouvernance-de-knds"),
    src("an-audition-2024", "Assemblée nationale — commission de la défense", "Compte rendu n°26 : audition de MBDA, KNDS France et Thales", "officiel", "A", "2024-11-27", "https://www.assemblee-nationale.fr/dyn/17/comptes-rendus/cion_def/l17cion_def2425026_compte-rendu.pdf"),
  ],
  updated: "2026-11-17",
};
