/**
 * Planche Rafale F4 · Meteor — modèle de séquence, pur et testable.
 *
 * Six états pilotent la planche. Les trois derniers mettent en scène une
 * séparation, un allumage et un départ ILLUSTRATIFS, dans l'axe de l'avion :
 * aucune cible, aucune trajectoire calculée, aucune balistique, aucun domaine
 * de tir, aucune procédure. La chronologie visuelle est un choix de lecture.
 *
 * Trois scénarios choisissent la munition et la configuration d'emport. Le
 * Meteor est un missile air-air conçu pour l'engagement au-delà du contact
 * visuel : la planche ne le montre pas en combat tournoyant (c'est le rôle du
 * MICA IR) ni contre des défenses sol-air (la mission SEAD est illustrée avec
 * l'AASM Hammer).
 */

export const RAFALE_ASSET_PATH = "/models/hud/rafale-f4.glb";

export const RAFALE_SEQUENCE_STATES = [
  "overview",
  "inspect",
  "sensors",
  "release",
  "launch",
  "complete",
] as const;

export type RafaleSequenceState = (typeof RAFALE_SEQUENCE_STATES)[number];

export type RafaleSequenceAction =
  | { type: "NEXT" }
  | { type: "PREVIOUS" }
  | { type: "RESET" }
  | { type: "GOTO"; state: RafaleSequenceState };

export const RAFALE_INITIAL_STATE: RafaleSequenceState = "overview";

export const RAFALE_SEQUENCE_COPY: Record<
  RafaleSequenceState,
  { label: string; shortLabel: string; description: string }
> = {
  overview: {
    label: "Rafale F4 en vol",
    shortLabel: "En vol",
    description:
      "Un Rafale C au standard F4 en vol stabilisé. Les emports suivent le scénario choisi : Meteor, MICA et bidon ventral en configuration air-air ; AASM Hammer, nacelle Talios et trois bidons en configuration air-sol.",
  },
  inspect: {
    label: "Inspection de la cellule",
    shortLabel: "Inspection",
    description:
      "Cadrage rapproché : radôme de l’antenne RBE2, optronique secteur frontal, verrière, plans canard, voilure delta, dérive et SPECTRA, tuyères M88. Observation libre.",
  },
  sensors: {
    label: "Capteurs et fusion de données",
    shortLabel: "Capteurs",
    description:
      "Secteurs symboliques, sans échelle ni valeur : antenne RBE2 vers l’avant, optronique frontale, couverture sphérique de SPECTRA. Le scénario choisi met un capteur en avant.",
  },
  release: {
    label: "Séparation",
    shortLabel: "Séparation",
    description:
      "Arrêt sur image : la munition quitte son point d’emport — éjection sous le fuselage, départ du rail de saumon ou largage sous la voilure, selon le scénario.",
  },
  launch: {
    label: "Allumage et départ",
    shortLabel: "Départ",
    description:
      "Le propulseur s’allume et la munition prend de l’avance dans l’axe de l’avion. Aucune trajectoire n’est calculée ni représentée au-delà de ce départ.",
  },
  complete: {
    label: "Planche terminée",
    shortLabel: "Fin",
    description:
      "Arrêt sur image final : point d’emport vide, sillage figé derrière la munition, le Rafale poursuit son vol.",
  },
};

/** Scénario d'illustration : munition, configuration et attitude de l'avion. */
export const RAFALE_SCENARIOS = ["bvr", "wvr", "sead"] as const;
export type RafaleScenario = (typeof RAFALE_SCENARIOS)[number];

/** Configuration d'emport montrée sur le modèle. */
export type RafaleLoadout = "air" | "sead";

export const RAFALE_SCENARIO_COPY: Record<
  RafaleScenario,
  {
    label: string;
    /** Munition tirée, nommée comme sur la planche. */
    weapon: string;
    loadout: RafaleLoadout;
    description: string;
  }
> = {
  bvr: {
    label: "Interception BVR · Meteor",
    weapon: "Meteor",
    loadout: "air",
    description:
      "Au-delà du contact visuel : un Meteor quitte le point d’emport arrière droit du fuselage, puis son statoréacteur prend le relais du propulseur d’accélération. Configuration air-air.",
  },
  wvr: {
    label: "Combat rapproché · MICA IR",
    weapon: "MICA IR",
    loadout: "air",
    description:
      "En combat tournoyant (« dogfight »), le Rafale emploie le MICA — ici en version infrarouge — et son canon de 30 mm, pas le Meteor. Avion en virage, MICA IR tiré du rail de saumon gauche.",
  },
  sead: {
    label: "SEAD · AASM Hammer",
    weapon: "AASM Hammer",
    loadout: "sead",
    description:
      "Suppression des défenses sol-air : le Meteor, missile air-air, n’y a pas de rôle. SPECTRA détecte les émissions, l’AASM Hammer — kit de guidage et propulseur sur corps de bombe — est largué sous la voilure. Configuration air-sol avec nacelle Talios.",
  },
};

export function loadoutForScenario(scenario: RafaleScenario): RafaleLoadout {
  return RAFALE_SCENARIO_COPY[scenario].loadout;
}

/** Décor de vol, sans géographie réelle. */
export type RafaleBiome = "sea" | "desert";

/**
 * Mer en air-air (interception et combat rapproché, haute altitude figurée),
 * désert en mission air-sol, plus basse : le relief s'y lit.
 */
export function biomeForScenario(scenario: RafaleScenario): RafaleBiome {
  return loadoutForScenario(scenario) === "sead" ? "desert" : "sea";
}

/** Le scénario se choisit avant la séparation ; il est verrouillé ensuite. */
export function isScenarioLocked(state: RafaleSequenceState): boolean {
  return state === "release" || state === "launch" || state === "complete";
}

export function isRafaleScenario(value: unknown): value is RafaleScenario {
  return (
    typeof value === "string" &&
    RAFALE_SCENARIOS.some((scenario) => scenario === value)
  );
}

export const RAFALE_ASSET_MANIFEST = {
  rootNode: "RAF_Root",
  airframeNode: "RAF_Airframe",
  storesNode: "RAF_Stores",
  canardNodes: { L: "RAF_Canard_L", R: "RAF_Canard_R" },
  elevonNodes: {
    LIn: "RAF_Elevon_L_In",
    LOut: "RAF_Elevon_L_Out",
    RIn: "RAF_Elevon_R_In",
    ROut: "RAF_Elevon_R_Out",
  },
  /** Munition tirée dans chaque scénario (origine au milieu du corps, nez vers -Z). */
  shotNodes: { bvr: "RAF_Meteor_R", wvr: "RAF_MicaIR_L", sead: "RAF_Hammer_R" },
  /**
   * Nœuds visibles dans une seule configuration d'emport. L'air-air reprend
   * une configuration documentée (vol du 4 mars 2021) : 2 Meteor, 2 MICA EM,
   * 2 MICA IR et un bidon ventral ; l'air-sol ajoute les bidons de voilure.
   */
  loadoutNodes: {
    air: ["RAF_Meteor_L", "RAF_Meteor_R", "RAF_Pylon_Meteor_L", "RAF_Pylon_Meteor_R"],
    sead: [
      "RAF_Hammer_L",
      "RAF_Hammer_R",
      "RAF_Pylon_Mid_L",
      "RAF_Pylon_Mid_R",
      "RAF_Talios",
      "RAF_Pylon_Fwd_R",
      "RAF_Tank_L",
      "RAF_Tank_R",
      "RAF_Pylon_Inner_L",
      "RAF_Pylon_Inner_R",
    ],
  },
  /** Longueurs hors tout (m), gabarits publics approchés. */
  lengths: { meteor: 3.65, mica: 3.1, hammer: 3.1 },
  /** Dimensions publiées du Rafale (m, dossier de presse Dassault 2023). */
  aircraft: { length: 15.3, span: 10.9, height: 5.3 },
} as const;

export function isRafaleSequenceState(value: unknown): value is RafaleSequenceState {
  return (
    typeof value === "string" &&
    RAFALE_SEQUENCE_STATES.some((state) => state === value)
  );
}

export function rafaleSequenceReducer(
  state: RafaleSequenceState,
  action: RafaleSequenceAction,
): RafaleSequenceState {
  if (!isRafaleSequenceState(state)) return RAFALE_INITIAL_STATE;
  const index = RAFALE_SEQUENCE_STATES.indexOf(state);

  switch (action.type) {
    case "NEXT":
      return RAFALE_SEQUENCE_STATES[Math.min(index + 1, RAFALE_SEQUENCE_STATES.length - 1)];
    case "PREVIOUS":
      return RAFALE_SEQUENCE_STATES[Math.max(index - 1, 0)];
    case "RESET":
      return RAFALE_INITIAL_STATE;
    case "GOTO":
      return isRafaleSequenceState(action.state) ? action.state : state;
  }
}

export function rafaleStateIndex(state: RafaleSequenceState): number {
  return RAFALE_SEQUENCE_STATES.indexOf(state);
}

/**
 * Scénario demandé par l'URL (`?scenario=sead`), pour les liens directs de
 * l'accueil. Toute autre valeur est ignorée.
 */
export function scenarioFromSearch(search: string): RafaleScenario | null {
  const value = new URLSearchParams(search).get("scenario");
  return isRafaleScenario(value) ? value : null;
}
