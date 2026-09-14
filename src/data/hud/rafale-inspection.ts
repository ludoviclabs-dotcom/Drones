import type { RafaleLoadout } from "./rafale";

/**
 * Planche Rafale F4 · Meteor — catalogue des sous-ensembles inspectables.
 *
 * Chaque sous-ensemble est relié à des nœuds réels du GLB (préfixe RAF_) et
 * décrit par des faits PUBLICS, chacun avec son niveau de confiance et ses
 * sources. Rien d'opérationnel : ni domaine de tir, ni performance d'emploi,
 * ni procédure. Les emports propres à une configuration (air-air ou air-sol)
 * ne sont proposés que lorsqu'ils sont visibles sur le modèle.
 */

export const RAFALE_INSPECTABLE_IDS = [
  "radar",
  "osf",
  "cockpit",
  "canards",
  "wing",
  "airframe",
  "engines",
  "spectra",
  "probe",
  "gun",
  "meteor",
  "mica",
  "hammer",
  "talios",
  "tanks",
] as const;

export type RafaleInspectableId = (typeof RAFALE_INSPECTABLE_IDS)[number];

export type RafaleConfidence = "haute" | "moyenne";

export type RafaleFact = {
  readonly label: string;
  readonly value: string;
  readonly confidence: RafaleConfidence;
};

export type RafaleInspectableGroup = "airframe" | "stores";

export const RAFALE_SOURCES = {
  "dassault-specs": {
    title: "Rafale — caractéristiques et performances",
    publisher: "Dassault Aviation",
    url: "https://www.dassault-aviation.com/fr/defense/rafale/caracteristiques-et-performances/",
  },
  "dassault-kit-2023": {
    title: "Rafale — dossier de presse, salon du Bourget 2023",
    publisher: "Dassault Aviation",
    url: "https://www.dassault-aviation.com/wp-content/blogs.dir/1/files/2023/06/RAFALE-Dossier-de-Presse-Juin-2023-Le-Bourget.pdf",
  },
  "defense-rafale-f4": {
    title: "Rafale F4",
    publisher: "Ministère des Armées",
    url: "https://www.defense.gouv.fr/air/nos-aeronefs/nos-avions/rafale-f4",
  },
  "aviationist-f41": {
    title: "Rafale F4.1 standard qualified for fielding",
    publisher: "The Aviationist",
    url: "https://theaviationist.com/2023/04/02/rafale-f4-1-standard-qualified-for-fielding/",
  },
  "wiki-osf": {
    title: "Optronique secteur frontal",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Optronique_secteur_frontal",
  },
  "mbda-spectra": {
    title: "SPECTRA",
    publisher: "MBDA",
    url: "https://www.mbda-systems.com/products/air-dominance/spectra",
  },
  "knds-30m791": {
    title: "Le 300e canon du Rafale",
    publisher: "KNDS",
    url: "https://knds.com/en/press-releases/nexter-a-company-of-knds-produces-the-300th-rafale-gun",
  },
  "mbda-meteor": {
    title: "METEOR",
    publisher: "MBDA",
    url: "https://www.mbda-systems.com/products/air-dominance/meteor",
  },
  "dga-meteor": {
    title: "Missile Meteor",
    publisher: "Ministère des Armées — DGA",
    url: "https://www.defense.gouv.fr/dga/missile-meteor",
  },
  "aviationist-meteor-2021": {
    title: "French Rafale performs first operational flight with live Meteor",
    publisher: "The Aviationist",
    url: "https://theaviationist.com/2021/03/09/french-rafale-performs-first-operational-flight-with-live-meteor-beyond-visual-range-air-to-air-missiles/",
  },
  "mbda-mica": {
    title: "MICA",
    publisher: "MBDA",
    url: "https://www.mbda-systems.com/products/air-dominance/mica-family/mica",
  },
  "safran-aasm": {
    title: "AASM Hammer — highly agile modular munition extended range",
    publisher: "Safran",
    url: "https://www.safran-group.com/products-services/aasm-hammer-tm-highly-agile-modular-munition-extended-range",
  },
  "opex360-talios": {
    title: "La nouvelle nacelle optronique Talios a été qualifiée par la DGA",
    publisher: "Opex360",
    url: "https://www.opex360.com/2018/11/19/la-nouvelle-nacelle-optronique-talios-a-ete-qualifiee-par-la-direction-generale-de-larmement/",
  },
  "dga-f5": {
    title: "Premiers travaux en amont du lancement en réalisation du standard F5",
    publisher: "Ministère des Armées — DGA",
    url: "https://www.defense.gouv.fr/dga/actualites/dga-commande-premiers-travaux-amont-du-prochain-lancement-realisation-du-standard-f5-du-rafale",
  },
  "wiki-rafale-fr": {
    title: "Dassault Rafale",
    publisher: "Wikipédia",
    url: "https://fr.wikipedia.org/wiki/Dassault_Rafale",
  },
  "mbda-meteor-datasheet": {
    title: "METEOR — fiche technique 2023",
    publisher: "MBDA",
    url: "https://www.mbda-systems.com/sites/mbda/files/2024-06/2023%20METEOR%20datasheet.pdf",
  },
} as const;

export type RafaleSourceId = keyof typeof RAFALE_SOURCES;

export type RafaleInspectable = {
  readonly id: RafaleInspectableId;
  readonly group: RafaleInspectableGroup;
  readonly label: string;
  readonly description: string;
  readonly facts: readonly RafaleFact[];
  readonly sources: readonly RafaleSourceId[];
  /** Configurations où le sous-ensemble est emporté (toutes si absent). */
  readonly loadouts?: readonly RafaleLoadout[];
};

export const RAFALE_INSPECTABLES: readonly RafaleInspectable[] = [
  {
    id: "radar",
    group: "airframe",
    label: "RADÔME · RADAR RBE2 AESA",
    description:
      "Le radôme du nez abrite l’antenne du radar RBE2 à antenne active (AESA) de Thales, capteur principal de l’avion, en air-air comme en air-sol.",
    facts: [
      { label: "Antenne", value: "Active à balayage électronique (AESA)", confidence: "haute" },
      { label: "Standard F4.1", value: "Nouveaux modes SAR et GMTI (2023)", confidence: "haute" },
      { label: "Standard F5", value: "RBE2-XG, premiers contrats en 2026", confidence: "haute" },
    ],
    sources: ["dassault-kit-2023", "aviationist-f41", "dga-f5"],
  },
  {
    id: "osf",
    group: "airframe",
    label: "OPTRONIQUE SECTEUR FRONTAL",
    description:
      "Carénage devant le pare-brise : l’optronique secteur frontal (OSF) détecte et poursuit de façon passive, donc discrète. Sa tête gauche est infrarouge ; sa tête droite associe télévision et télémètre laser.",
    facts: [
      { label: "Principe", value: "Détection et poursuite passives", confidence: "haute" },
      { label: "Têtes", value: "Infrarouge · télévision et télémètre laser", confidence: "moyenne" },
      { label: "Standard F4.1", value: "Nouveau capteur infrarouge (IRST) intégré", confidence: "haute" },
    ],
    sources: ["wiki-osf", "dassault-kit-2023", "aviationist-f41"],
  },
  {
    id: "cockpit",
    group: "airframe",
    label: "VERRIÈRE ET COCKPIT",
    description:
      "Pare-brise et verrière du Rafale C monoplace, verrière traitée d’une teinte dorée. Siège éjectable incliné, collimateur tête haute, écrans tête moyenne et latéraux ; viseur de casque au standard F4.1.",
    facts: [
      { label: "Équipage", value: "1 (Rafale C et M) · 2 (Rafale B)", confidence: "haute" },
      { label: "Siège", value: "Incliné à 29°", confidence: "haute" },
      { label: "Standard F4.1", value: "Viseur de casque, écrans latéraux agrandis", confidence: "haute" },
    ],
    sources: ["dassault-kit-2023", "aviationist-f41"],
  },
  {
    id: "canards",
    group: "airframe",
    label: "PLANS CANARD",
    description:
      "Plans canard monoblocs, montés haut sur les épaules d’entrée d’air juste derrière le cockpit ; avec la voilure delta, ils définissent la formule du Rafale, pilotée par commandes de vol électriques.",
    facts: [
      { label: "Formule", value: "Delta à plans canard rapprochés", confidence: "haute" },
      { label: "Pièces", value: "Gauche et droit identiques", confidence: "haute" },
      { label: "Aérofrein", value: "Aucun, supprimé dès la conception", confidence: "haute" },
    ],
    sources: ["dassault-kit-2023"],
  },
  {
    id: "wing",
    group: "airframe",
    label: "VOILURE DELTA ET ÉLEVONS",
    description:
      "Aile delta médiane, deux élevons par demi-aile au bord de fuite, trois points d’emport sous chaque aile et un rail lance-missile à chaque saumon.",
    facts: [
      { label: "Envergure", value: "10,90 m (Dassault) · 10,80 m (fiche F4)", confidence: "moyenne" },
      { label: "Surface alaire", value: "45,7 m²", confidence: "moyenne" },
      { label: "Gouvernes", value: "Deux élevons par demi-aile", confidence: "haute" },
    ],
    sources: ["dassault-specs", "defense-rafale-f4", "wiki-rafale-fr"],
  },
  {
    id: "airframe",
    group: "airframe",
    label: "CELLULE ET ENTRÉES D’AIR",
    description:
      "Fuselage, épine dorsale et deux entrées d’air semi-ventrales fixes, logées sous les plans canard et séparées du fuselage ; cocardes de l’Armée de l’Air et de l’Espace.",
    facts: [
      { label: "Longueur · hauteur", value: "15,30 m · 5,30 m", confidence: "haute" },
      { label: "Points d’emport", value: "14 (Rafale C et B) · 13 (Rafale M)", confidence: "haute" },
      { label: "Composites", value: "70 % de la surface mouillée", confidence: "haute" },
    ],
    sources: ["dassault-specs", "dassault-kit-2023"],
  },
  {
    id: "engines",
    group: "airframe",
    label: "MOTEURS M88 · TUYÈRES",
    description:
      "Deux turboréacteurs Safran M88-2 à postcombustion, côte à côte dans le fuselage arrière, à tuyères variables ; seules les tuyères sont visibles de l’extérieur.",
    facts: [
      { label: "Moteurs", value: "2 × Safran M88-2", confidence: "haute" },
      { label: "Poussée unitaire", value: "5 t à sec · 7,5 t avec postcombustion", confidence: "haute" },
      { label: "Standard F5", value: "M88 T-REX : 9 t (contre 7,5 t)", confidence: "haute" },
    ],
    sources: ["dassault-kit-2023", "dga-f5"],
  },
  {
    id: "spectra",
    group: "airframe",
    label: "DÉRIVE ET SPECTRA",
    description:
      "SPECTRA, suite d’autoprotection de MBDA et Thales : des antennes et détecteurs logés au sommet et au pied de la dérive, aux racines des plans canard et sur les flancs avant, un brouilleur et des leurres.",
    facts: [
      { label: "Détection", value: "Menaces radar, infrarouge et laser", confidence: "haute" },
      { label: "Contre-mesures", value: "Brouillage, lance-leurres", confidence: "haute" },
      { label: "Carénages figurés", value: "Sommet et pied de dérive, flancs avant", confidence: "moyenne" },
    ],
    sources: ["mbda-spectra", "dassault-kit-2023"],
  },
  {
    id: "probe",
    group: "airframe",
    label: "PERCHE DE RAVITAILLEMENT",
    description:
      "Perche fixe et démontable, à droite devant le pare-brise, pour le ravitaillement en vol au panier. Sa courbure est lue sur des photographies publiques.",
    facts: [
      { label: "Type", value: "Fixe, sans mécanisme de rentrée", confidence: "haute" },
      { label: "Emplacement", value: "Avant droit, devant le pare-brise", confidence: "moyenne" },
      { label: "Gabarit", value: "Courbure lue sur photographies", confidence: "moyenne" },
    ],
    sources: ["dassault-kit-2023"],
  },
  {
    id: "gun",
    group: "airframe",
    label: "CANON DE 30 MM",
    description:
      "Canon interne de 30 mm, sur le flanc droit, côté entrée d’air droite : l’arme du combat au plus près, avec le MICA.",
    facts: [
      { label: "Désignation", value: "30M791 (Nexter, groupe KNDS)", confidence: "haute" },
      { label: "Cadence", value: "2 500 coups par minute", confidence: "haute" },
      { label: "Emplacement", value: "Flanc droit, côté entrée d’air droite", confidence: "moyenne" },
    ],
    sources: ["knds-30m791", "dassault-kit-2023"],
  },
  {
    id: "meteor",
    group: "stores",
    label: "MISSILE METEOR",
    description:
      "Missile air-air de MBDA pour l’engagement au-delà du contact visuel, propulsé par un statoréacteur à propergol solide et à débit variable ; une liaison de données le relie à l’avion après le départ. Emporté sous le fuselage arrière et séparé par éjection.",
    facts: [
      { label: "Dimensions", value: "3,65 m (DGA) · 3,7 m (MBDA) · diamètre 178 mm", confidence: "haute" },
      { label: "Masse", value: "190 kg (MBDA) · ≈ 200 kg (DGA)", confidence: "moyenne" },
      { label: "Emport figuré", value: "Deux points arrière du fuselage", confidence: "haute" },
    ],
    sources: ["mbda-meteor", "mbda-meteor-datasheet", "dga-meteor", "aviationist-meteor-2021"],
    loadouts: ["air"],
  },
  {
    id: "mica",
    group: "stores",
    label: "MISSILES MICA IR ET EM",
    description:
      "Missiles air-air MICA de MBDA — interception, combat et autodéfense —, employables à vue comme au-delà : autodirecteur infrarouge (IR) figuré aux saumons, électromagnétique (EM) sous voilure.",
    facts: [
      { label: "Dimensions", value: "3,1 m · diamètre 160 mm · 112 kg", confidence: "haute" },
      { label: "Autodirecteurs", value: "Infrarouge ou radar actif", confidence: "haute" },
      { label: "Emport figuré", value: "Rails de saumon, pylônes extérieurs", confidence: "haute" },
    ],
    sources: ["mbda-mica", "aviationist-meteor-2021"],
  },
  {
    id: "hammer",
    group: "stores",
    label: "AASM HAMMER",
    description:
      "Armement air-sol modulaire de Safran : un kit de guidage à l’avant et un kit propulsif à l’arrière, sur un corps de bombe. Il n’a pas d’autodirecteur antiradar ; il illustre ici le scénario SEAD.",
    facts: [
      { label: "Architecture", value: "Kit de guidage + kit propulsif", confidence: "haute" },
      { label: "Corps", value: "125, 250, 500 ou 1 000 kg", confidence: "haute" },
      { label: "Corps figuré", value: "Classe 250 kg, pylônes médians", confidence: "moyenne" },
    ],
    sources: ["safran-aasm"],
    loadouts: ["sead"],
  },
  {
    id: "talios",
    group: "stores",
    label: "NACELLE TALIOS",
    description:
      "Nacelle optronique de désignation laser et de reconnaissance de Thales, qualifiée avec le standard F3-R ; fixée sous l’entrée d’air droite en configuration air-sol.",
    facts: [
      { label: "Fonction", value: "Désignation laser, reconnaissance", confidence: "haute" },
      { label: "Qualification", value: "Standard F3-R, 2018", confidence: "haute" },
      { label: "Emport figuré", value: "Sous l’entrée d’air droite", confidence: "moyenne" },
    ],
    sources: ["opex360-talios"],
    loadouts: ["sead"],
  },
  {
    id: "tanks",
    group: "stores",
    label: "RÉSERVOIRS ET PYLÔNES",
    description:
      "Réservoirs largables sur les points lourds ; les pylônes et adaptateurs changent avec la configuration. Un bidon ventral en air-air, trois en air-sol.",
    facts: [
      { label: "Carburant", value: "4,7 t interne · 6,7 t externe", confidence: "haute" },
      { label: "Points lourds", value: "5 sur 14, dont ventral et voilure intérieure", confidence: "moyenne" },
      { label: "Charge externe", value: "9,5 t", confidence: "haute" },
    ],
    sources: ["dassault-specs", "dassault-kit-2023"],
  },
];

export const RAFALE_INSPECTION_GROUP_COPY: Record<RafaleInspectableGroup, string> = {
  airframe: "Cellule et capteurs",
  stores: "Emports",
};

export const RAFALE_SOURCE_STATUS = "SOURCES PUBLIQUES · REPRÉSENTATION ILLUSTRATIVE";

export type RafaleInspectionState = {
  readonly previewId: RafaleInspectableId | null;
  readonly selectedId: RafaleInspectableId | null;
};

export type RafaleInspectionAction =
  | { type: "PREVIEW"; id: RafaleInspectableId | null }
  | { type: "TOGGLE"; id: RafaleInspectableId }
  | { type: "CLEAR_SELECTION" };

export const RAFALE_INITIAL_INSPECTION_STATE: RafaleInspectionState = {
  previewId: null,
  selectedId: null,
};

export function isRafaleInspectableId(value: unknown): value is RafaleInspectableId {
  return (
    typeof value === "string" &&
    RAFALE_INSPECTABLE_IDS.some((id) => id === value)
  );
}

export function rafaleInspectionReducer(
  state: RafaleInspectionState,
  action: RafaleInspectionAction,
): RafaleInspectionState {
  switch (action.type) {
    case "PREVIEW":
      if (action.id !== null && !isRafaleInspectableId(action.id)) return state;
      return state.previewId === action.id ? state : { ...state, previewId: action.id };
    case "TOGGLE":
      if (!isRafaleInspectableId(action.id)) return state;
      return { ...state, selectedId: state.selectedId === action.id ? null : action.id };
    case "CLEAR_SELECTION":
      return state.selectedId === null && state.previewId === null
        ? state
        : RAFALE_INITIAL_INSPECTION_STATE;
  }
}

export function activeRafaleInspectionId(
  state: RafaleInspectionState,
): RafaleInspectableId | null {
  return state.selectedId ?? state.previewId;
}

export function rafaleInspectableById(
  id: RafaleInspectableId | null,
): RafaleInspectable | null {
  if (!id) return null;
  return RAFALE_INSPECTABLES.find((item) => item.id === id) ?? null;
}

/** Le sous-ensemble est-il emporté (donc visible) dans cette configuration ? */
export function isInspectableCarried(
  item: RafaleInspectable,
  loadout: RafaleLoadout,
): boolean {
  return !item.loadouts || item.loadouts.includes(loadout);
}

/** Sous-ensembles proposés à l'inspection pour une configuration donnée. */
export function rafaleInspectablesFor(loadout: RafaleLoadout): readonly RafaleInspectable[] {
  return RAFALE_INSPECTABLES.filter((item) => isInspectableCarried(item, loadout));
}

/**
 * Nom de nœud GLB -> sous-ensemble. Préfixes les plus spécifiques d'abord ;
 * les nœuds de structure (RAF_Root, RAF_Airframe, RAF_Stores) et les objets
 * créés côté Web (RAF_UI_*) ne désignent rien.
 */
export function rafaleInspectionIdForNodeName(nodeName: string): RafaleInspectableId | null {
  const name = nodeName;
  if (!name.startsWith("RAF_") || name.startsWith("RAF_UI_")) return null;
  if (name.startsWith("RAF_Meteor_") || name.startsWith("RAF_Pylon_Meteor_")) return "meteor";
  if (
    name.startsWith("RAF_MicaIR_") ||
    name.startsWith("RAF_MicaEM_") ||
    name.startsWith("RAF_Pylon_Outer_")
  ) {
    return "mica";
  }
  if (name.startsWith("RAF_Hammer_") || name.startsWith("RAF_Pylon_Mid_")) return "hammer";
  if (name.startsWith("RAF_Talios") || name.startsWith("RAF_Pylon_Fwd_")) return "talios";
  if (
    name.startsWith("RAF_Tank") ||
    name.startsWith("RAF_Pylon_Inner_") ||
    name === "RAF_Pylon_Center"
  ) {
    return "tanks";
  }
  if (name === "RAF_Radome") return "radar";
  if (name === "RAF_OSF") return "osf";
  if (name === "RAF_Canopy" || name === "RAF_CanopyFrame" || name === "RAF_Cockpit") {
    return "cockpit";
  }
  if (name.startsWith("RAF_Canard_")) return "canards";
  if (name.startsWith("RAF_Wing_") || name.startsWith("RAF_Elevon_")) return "wing";
  if (name === "RAF_Engines") return "engines";
  if (name === "RAF_Fin" || name === "RAF_Spectra") return "spectra";
  if (name === "RAF_Probe") return "probe";
  if (name === "RAF_Gun") return "gun";
  if (
    name === "RAF_Fuselage" ||
    name === "RAF_Spine" ||
    name === "RAF_Intakes" ||
    name === "RAF_Details" ||
    name === "RAF_Roundels"
  ) {
    return "airframe";
  }
  return null;
}
