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
 */
export const GLB_AVAILABLE_SLUGS = new Set<string>([
  // Rafale : XRAY_MODEL_OVERRIDES (asset de planche, meshopt) prime sur
  // public/models/aviation/rafale.glb, qui n'est plus chargé par la vue X-Ray.
  "rafale",
  "f-35", // public/models/aviation/f-35.glb (15 KB, Draco)
  "sea-fire", // public/models/radars/sea-fire.glb (~21 KB, Draco)
  "gm400-alpha", // public/models/radars/gm400-alpha.glb (~17 KB, Draco)
  "an-tpy-2", // public/models/radars/an-tpy-2.glb (~27 KB, Draco) — BMD X-band
  "giraffe-4a", // public/models/radars/giraffe-4a.glb (~13 KB, Draco) — mât télescopique
  "ltamds", // public/models/radars/ltamds.glb (~20 KB, Draco) — 3 panneaux 360°
  "meteor", // public/models/missiles/meteor.glb (~13 KB, Draco) — AAM ramjet MBDA
  "scalp-storm-shadow", // public/models/missiles/scalp-storm-shadow.glb (~7 KB, Draco) — cruise stealth
]);

/**
 * Modèle X-Ray remplacé par un asset de planche technique. Le Rafale utilise
 * le GLB de la planche `/hud/rafale-f4-meteor` : meshopt (décodeur embarqué,
 * aucune requête vers un CDN), en mètres, nez vers -Z. Les repères X-Ray
 * restent écrits dans le repère des spécifications filaires (X envergure,
 * Y longueur nez +, Z hauteur, ~1 unité = 5 m) : la vue les tourne d'un quart
 * de tour et ramène le modèle à l'échelle 0,2.
 */
export type XrayModelOverride = {
  glbPath: string;
  /** Compression meshopt (Draco désactivé : son décodeur viendrait d'un CDN). */
  meshopt: boolean;
  /** Échelle appliquée au GLB pour rejoindre le repère des repères X-Ray. */
  scale: number;
  /** Nœuds masqués dans la vue X-Ray (autre configuration d'emport). */
  hiddenNodes: readonly string[];
  /** Position initiale de la caméra, si le préréglage « aircraft » coupe le modèle. */
  cameraPosition?: readonly [number, number, number];
};

export const XRAY_MODEL_OVERRIDES: Record<string, XrayModelOverride> = {
  rafale: {
    glbPath: "/models/hud/rafale-f4.glb",
    meshopt: true,
    scale: 0.2,
    cameraPosition: [4.6, 3.1, 5.0],
    // Configuration air-air documentée : la configuration air-sol est masquée.
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
};

export type { Wireframe3DSpec, Point3D, Segment3D } from "./types";
