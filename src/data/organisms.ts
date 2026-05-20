import type { Organism } from "./types";

export const organisms: Organism[] = [
  {
    slug: "dsca",
    name: "Defense Security Cooperation Agency",
    acronym: "DSCA",
    scope: "États-Unis",
    type: "acquisition",
    role: "Agence du Pentagone qui pilote les ventes d'armes d'État à État (FMS) : elle contractualise, encadre et administre les cessions aux partenaires étrangers.",
  },
  {
    slug: "ddtc",
    name: "Directorate of Defense Trade Controls",
    acronym: "DDTC",
    scope: "États-Unis",
    type: "controle-export",
    role: "Direction du Département d'État américain qui administre la réglementation ITAR et autorise — ou refuse — les exportations de matériels et services de défense.",
  },
  {
    slug: "mtcr",
    name: "Régime de contrôle de la technologie des missiles",
    acronym: "MTCR",
    scope: "Multilatéral — 35 États",
    type: "controle-export",
    role: "Arrangement informel limitant la prolifération des missiles et drones capables d'emporter une charge importante. La catégorie I, la plus stricte, vaut présomption de refus d'exportation.",
  },
  {
    slug: "wassenaar",
    name: "Arrangement de Wassenaar",
    scope: "Multilatéral — 42 États",
    type: "controle-export",
    role: "Régime de contrôle des exportations d'armements conventionnels et de biens à double usage ; il harmonise les listes de contrôle entre États participants.",
  },
  {
    slug: "tca",
    name: "Traité sur le commerce des armes",
    acronym: "TCA",
    scope: "Multilatéral — ONU",
    type: "norme",
    role: "Traité des Nations unies encadrant le commerce international d'armes classiques ; il impose une évaluation du risque — droits humains, détournement — avant tout transfert.",
  },
  {
    slug: "position-commune-ue",
    name: "Position commune 2008/944/PESC",
    scope: "Union européenne",
    type: "controle-export",
    role: "Texte fixant huit critères communs d'évaluation des exportations d'armement pour les États membres de l'UE : droits humains, stabilité régionale, risque de détournement.",
  },
  {
    slug: "dga",
    name: "Direction générale de l'armement",
    acronym: "DGA",
    scope: "France",
    type: "acquisition",
    role: "Agence française responsable de la conduite des programmes d'armement, des essais et du soutien aux exportations de défense.",
  },
  {
    slug: "unscr-2231",
    name: "Résolution 2231 du Conseil de sécurité",
    acronym: "RCSNU 2231",
    scope: "ONU",
    type: "norme",
    role: "Résolution de 2015 encadrant les transferts d'armes et de technologies de missiles liés à l'Iran — au cœur des controverses sur la cession de drones iraniens.",
  },
];

export const ORGANISMS_BY_SLUG: Record<string, Organism> = Object.fromEntries(
  organisms.map((o) => [o.slug, o]),
);
