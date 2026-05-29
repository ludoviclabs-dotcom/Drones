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
  "rafale", // public/models/aviation/rafale.glb (~28 KB, Draco)
  "f-35", // public/models/aviation/f-35.glb (15 KB, Draco)
  "sea-fire", // public/models/radars/sea-fire.glb (~21 KB, Draco)
  "gm400-alpha", // public/models/radars/gm400-alpha.glb (~17 KB, Draco)
  "an-tpy-2", // public/models/radars/an-tpy-2.glb (~27 KB, Draco) — BMD X-band
  "giraffe-4a", // public/models/radars/giraffe-4a.glb (~13 KB, Draco) — mât télescopique
  "ltamds", // public/models/radars/ltamds.glb (~20 KB, Draco) — 3 panneaux 360°
  "meteor", // public/models/missiles/meteor.glb (~13 KB, Draco) — AAM ramjet MBDA
  "scalp-storm-shadow", // public/models/missiles/scalp-storm-shadow.glb (~7 KB, Draco) — cruise stealth
]);

export type { Wireframe3DSpec, Point3D, Segment3D } from "./types";
