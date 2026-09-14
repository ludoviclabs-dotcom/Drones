import { f353D } from "./f-35";
import { rafale3D } from "./rafale";
import type { Wireframe3DSpec } from "./types";

export const WIREFRAME_3D_SPECS: Record<string, Wireframe3DSpec> = {
  rafale: rafale3D,
  "f-35": f353D,
};

/**
 * Slugs pour lesquels un asset GLB Blender est disponible. Le chemin physique
 * dépend de la catégorie du système : aviation de combat dans
 * `public/models/aviation/<slug>.glb`, radars dans `public/models/radars/<slug>.glb`.
 * Ajouter ici uniquement après avoir généré et commité le fichier .glb.
 *
 * Tous les GLB sont compressés en meshopt (décodeur embarqué par three-stdlib) :
 * jamais de Draco, dont le décodeur drei viendrait d'un CDN à l'exécution.
 */
export const GLB_AVAILABLE_SLUGS = new Set<string>([
  // Rafale : son placement X-Ray charge l'asset de la planche (glbPath) ;
  // public/models/aviation/rafale.glb n'est plus lu par la vue X-Ray.
  "rafale",
  "f-35", // public/models/aviation/f-35.glb (~23 KB)
  "sea-fire", // public/models/radars/sea-fire.glb (~23 KB)
  "gm400-alpha", // public/models/radars/gm400-alpha.glb (~17 KB)
  "an-tpy-2", // public/models/radars/an-tpy-2.glb (~18 KB) — BMD X-band
  "giraffe-4a", // public/models/radars/giraffe-4a.glb (~17 KB) — mât télescopique
  "ltamds", // public/models/radars/ltamds.glb (~20 KB) — 3 panneaux 360°
  "meteor", // public/models/missiles/meteor.glb (~20 KB) — AAM ramjet MBDA
  "scalp-storm-shadow", // public/models/missiles/scalp-storm-shadow.glb (~11 KB) — cruise stealth
]);

/**
 * Placement d'un GLB dans le repère des repères X-Ray.
 *
 * Les repères (`position3d`) sont écrits dans le repère des spécifications
 * filaires : X envergure/largeur (gauche -, droite +), Y longueur (nez +),
 * Z hauteur, ~1 unité = 5 m pour les avions. La vue les tourne d'un quart de
 * tour vers le repère glTF (Y haut, nez vers -Z). Le placement ramène le GLB
 * dans ce même repère : rotation (Euler XYZ, radians) pour orienter le nez
 * vers -Z et le haut vers +Y, puis échelle pour retrouver les unités.
 * Sans placement, repères et GLB sont affichés tels quels.
 */
export type XrayModelOverride = {
  /** Échelle appliquée au GLB pour rejoindre le repère des repères X-Ray. */
  scale: number;
  /** Rotation du GLB, Euler XYZ en radians (défaut : aucune). */
  rotation?: readonly [number, number, number];
  /** Position initiale de la caméra, si le préréglage coupe le modèle. */
  cameraPosition?: readonly [number, number, number];
  /** GLB chargé à la place de `public/models/<catégorie>/<slug>.glb`. */
  glbPath?: string;
  /** Nœuds retirés du modèle dans la vue X-Ray (autre configuration d'emport). */
  hiddenNodes?: readonly string[];
};

// Placements par type de modèle. Les GLB X-Ray sont exportés Y haut et
// centrés sur l'origine ; seuls l'axe du nez et l'unité diffèrent.
/** Avions : nez déjà vers -Z ; ~7 m par unité, ramenés à ~5 m (F-35 ≈ 3 unités). */
const AIRCRAFT_SCALE = 1.4;
/** Missiles : nez vers -X, amené vers -Z par un quart de tour autour de Y. */
const MISSILE_ROTATION = [0, -Math.PI / 2, 0] as const;
/** Missiles : ~5,1 unités de long, ramenés à ~3 (emprise d'un chasseur). */
const MISSILE_SCALE = 0.6;
/** Radars : pas de nez ; ×0,5 garde chaque modèle au-dessus de la grille (y = -1,4). */
const RADAR_SCALE = 0.5;

/**
 * Placements X-Ray par slug. Le Rafale charge le GLB de la planche
 * `/hud/rafale-f4-meteor` (en mètres, nez vers -Z), ramené à l'échelle 0,2.
 */
export const XRAY_MODEL_OVERRIDES: Record<string, XrayModelOverride> = {
  rafale: {
    glbPath: "/models/hud/rafale-f4.glb",
    scale: 0.2,
    cameraPosition: [4.6, 3.1, 5.0],
    // Configuration air-air documentée : la configuration air-sol est retirée.
    hiddenNodes: [
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
  // Les repères de contexte (fournisseur, pays, sources) orbitent jusqu'à
  // ~2 unités de l'axe : caméra plus reculée et plus latérale que « aircraft ».
  "f-35": { scale: AIRCRAFT_SCALE, cameraPosition: [7.8, 5.0, 3.6] },
  meteor: { scale: MISSILE_SCALE, rotation: MISSILE_ROTATION },
  "scalp-storm-shadow": { scale: MISSILE_SCALE, rotation: MISSILE_ROTATION },
  "sea-fire": { scale: RADAR_SCALE },
  "gm400-alpha": { scale: RADAR_SCALE },
  "an-tpy-2": { scale: RADAR_SCALE },
  "giraffe-4a": { scale: RADAR_SCALE },
  ltamds: { scale: RADAR_SCALE },
};

export type { Wireframe3DSpec, Point3D, Segment3D } from "./types";
