import { rafale3D } from "./rafale";
import type { Wireframe3DSpec } from "./types";

export const WIREFRAME_3D_SPECS: Record<string, Wireframe3DSpec> = {
  rafale: rafale3D,
};

/**
 * Slugs pour lesquels un asset GLB Blender est disponible dans
 * public/models/aviation/<slug>.glb.
 * Ajouter ici uniquement après avoir généré et commité le fichier .glb.
 */
export const GLB_AVAILABLE_SLUGS = new Set<string>([
  "rafale", // public/models/aviation/rafale.glb (19 KB, Draco)
]);

export type { Wireframe3DSpec, Point3D, Segment3D } from "./types";
