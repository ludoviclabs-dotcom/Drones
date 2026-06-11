export type CuratedContradictionCategory =
  | "cout"
  | "date"
  | "export"
  | "industriel";

export type CuratedContradictionSeverity = "faible" | "moyenne" | "forte";

export interface CuratedContradictionSeed {
  id: string;
  systemId: string;
  category: CuratedContradictionCategory;
  point: string;
  claimA: string;
  claimB: string;
  nature: string;
  severity: CuratedContradictionSeverity;
  sourceIds: string[];
  nextCheck: string;
}

export const CURATED_CONTRADICTIONS: CuratedContradictionSeed[] = [
  {
    id: "mq9-cellule-vs-systeme",
    systemId: "mq-9-reaper",
    category: "cout",
    point: "Prix cellule vs coût système complet",
    claimA: "La cellule MQ-9 est souvent résumée autour de 30 M$.",
    claimB:
      "Un système complet peut être cité entre 56 et 121 M$ selon stations, SATCOM, capteurs et soutien.",
    nature:
      "Divergence de périmètre : le chiffre le plus bas ne représente pas l'achat exploitable complet.",
    severity: "forte",
    sourceIds: ["ga-asi", "sipri-at", "usaf-factsheet"],
    nextCheck:
      "Maintenir deux lignes de coût séparées : cellule et système complet.",
  },
  {
    id: "eurodrone-souverainete-moteur",
    systemId: "eurodrone",
    category: "industriel",
    point: "Souveraineté européenne vs moteur GE Catalyst",
    claimA:
      "Eurodrone est présenté comme une capacité MALE européenne souveraine.",
    claimB:
      "Le moteur GE Catalyst introduit une dépendance américaine publique dans la supply chain.",
    nature:
      "Contradiction de formulation : souveraineté de programme, mais dépendance critique non européenne.",
    severity: "forte",
    sourceIds: ["airbus-eurodrone", "iiss-mb"],
    nextCheck:
      "Suivre les clauses export et la possibilité de substitutions industrielles.",
  },
  {
    id: "aarok-prix-promesse-vs-serie",
    systemId: "aarok",
    category: "cout",
    point: "Promesse de prix vs absence de contrat de série",
    claimA:
      "Le prix annoncé place l'Aarok dans une fourchette attractive de 5 à 10 M€ par appareil.",
    claimB:
      "Aucun marché de série ne fixe encore le coût système complet avec stations, soutien et formation.",
    nature:
      "Divergence de maturité : estimation commerciale avant qualification et contractualisation.",
    severity: "forte",
    sourceIds: ["tg-aarok", "opex360-cout", "mer-marine"],
    nextCheck:
      "Remplacer l'estimation par un coût contractuel dès notification d'un lot.",
  },
  {
    id: "f35-acquisition-vs-cycle-vie",
    systemId: "f-35",
    category: "cout",
    point: "Coût d'acquisition vs coût de possession",
    claimA:
      "La production de masse tend à focaliser l'attention sur le prix d'achat.",
    claimB:
      "Le GAO met en avant un coût de cycle de vie supérieur à 1 580 Md$ pour la flotte.",
    nature:
      "Divergence de lecture budgétaire : prix unitaire visible contre coût de possession dominant.",
    severity: "forte",
    sourceIds: ["lockheed", "gao"],
    nextCheck:
      "Afficher systématiquement acquisition, modernisation et lifecycle dans trois lignes distinctes.",
  },
  {
    id: "switchblade-catalogue-vs-attrition",
    systemId: "switchblade-600",
    category: "cout",
    point: "Munition catalogue vs économie d'attrition",
    claimA:
      "Switchblade 600 apporte une charge de classe Javelin et un soutien industriel américain.",
    claimB:
      "Son coût supérieur à 100 000 $ le coup se compare défavorablement aux drones FPV à bas coût dans les débats publics.",
    nature:
      "Divergence de périmètre analytique : fiabilité industrielle contre économie de masse.",
    severity: "moyenne",
    sourceIds: ["av-switchblade", "warzone-cost", "iiss-mb"],
    nextCheck:
      "Garder l'analyse sur le coût public et le modèle industriel, sans recommandation d'emploi.",
  },
  {
    id: "f110-programme-vs-configuration",
    systemId: "f110-bonifaz",
    category: "cout",
    point: "Coût programme F110 vs configuration unitaire",
    claimA: "Le programme est cité autour de 4,3 Md€ pour cinq frégates.",
    claimB:
      "La configuration détaillée par navire reste dépendante du CMS, du radar SPY-7, du sonar et des lots de soutien.",
    nature:
      "Divergence de périmètre : moyenne programme utile, mais prix par coque incomplet.",
    severity: "moyenne",
    sourceIds: ["navantia-frigates", "lm-spy7-f110", "navantia-spy7-scomba"],
    nextCheck:
      "Ajouter les lots de soutien et armement lorsqu'ils sont publiés séparément.",
  },
  {
    id: "meteor-premium-vs-prix-non-public",
    systemId: "meteor",
    category: "cout",
    point: "Effecteur premium vs coût unitaire non publié",
    claimA:
      "Meteor est décrit comme un effecteur air-air premium de coopération européenne.",
    claimB:
      "Le coût unitaire public n'est pas publié ; les livraisons passent par contrats de lots et plateformes.",
    nature:
      "Divergence de granularité : valeur stratégique affirmée, coût unitaire absent.",
    severity: "moyenne",
    sourceIds: ["mbda-meteor"],
    nextCheck:
      "Ne pas inférer de prix unitaire à partir d'un contrat plateforme non ventilé.",
  },
  {
    id: "pac3-net-procurement-vs-flyaway",
    systemId: "pac-3-mse",
    category: "cout",
    point: "Net procurement vs flyaway",
    claimA:
      "Le coût FY2026 publié donne un ratio net procurement d'environ 5,63 M$.",
    claimB:
      "Ce périmètre inclut canister, ingénierie et system engineering, donc ne vaut pas flyaway pur.",
    nature:
      "Divergence de vocabulaire budgétaire : un coût publié précis peut être mal comparé.",
    severity: "moyenne",
    sourceIds: ["dod-p1-fy26-pac3", "lm-pac3"],
    nextCheck:
      "Conserver le libellé net procurement dans les tableaux et exports.",
  },
  {
    id: "virginia-vpm-fourchette",
    systemId: "virginia-block-v",
    category: "cout",
    point: "Fourchette Block V avec VPM",
    claimA:
      "Le coût Block V avec Virginia Payload Module est cité autour de 4,3 à 4,5 Md$.",
    claimB:
      "La configuration VPM, la cadence et la base industrielle sous-marine modifient fortement le coût marginal.",
    nature:
      "Divergence d'interprétation : ordre de grandeur utile, mais coût unitaire non stable.",
    severity: "moyenne",
    sourceIds: ["crs-virginia", "navsea-blockv"],
    nextCheck:
      "Actualiser à chaque rapport CRS et isoler VPM, cadence et MRO.",
  },
  {
    id: "queen-elizabeth-programme-vs-navire",
    systemId: "queen-elizabeth-carrier",
    category: "cout",
    point: "Coût programme vs coût par navire",
    claimA:
      "La classe Queen Elizabeth est documentée comme programme britannique de plusieurs milliards de livres pour deux navires.",
    claimB:
      "Le coût réellement comparable dépend du groupe aérien F-35B, de l'escorte et de la disponibilité.",
    nature:
      "Divergence de périmètre : la plateforme seule ne capture pas le coût du carrier strike group.",
    severity: "faible",
    sourceIds: ["rn-qe-f35", "rn-f35", "rn-csg"],
    nextCheck:
      "Séparer navire, groupe aérien et disponibilité dans une future fiche TCO.",
  },
  {
    id: "heron-location-vs-cellule",
    systemId: "heron-tp",
    category: "cout",
    point: "Coût cellule vs location de capacité",
    claimA: "Le coût de cellule est estimé autour de 9,5 M$.",
    claimB:
      "Les packages allemands de location et d'armement se lisent en centaines de millions de dollars.",
    nature:
      "Divergence contractuelle : acheter une cellule et louer une capacité armée ne mesurent pas la même chose.",
    severity: "forte",
    sourceIds: ["globalmilitary", "bundestag", "presse-defense"],
    nextCheck:
      "Étiqueter explicitement cellule, location, armement et soutien dans la même fiche.",
  },
  {
    id: "scalp-prix-non-public-vs-mlr",
    systemId: "scalp-storm-shadow",
    category: "cout",
    point: "Prix unitaire non publié vs modernisation MLR",
    claimA:
      "Le coût unitaire SCALP/Storm Shadow n'est pas publié dans les fiches ouvertes.",
    claimB:
      "La rénovation mi-vie donne un signal budgétaire mais ne permet pas d'en déduire un prix missile neuf.",
    nature:
      "Divergence de source : coût de rénovation et coût d'acquisition sont deux périmètres distincts.",
    severity: "faible",
    sourceIds: ["mbda-scalp", "mbda-scalp-mlr"],
    nextCheck:
      "Conserver la ligne MLR comme modernisation, pas comme prix unitaire.",
  },
];
