import * as THREE from "three";

/** Noms conservés dans le GLB : le rack est le seul sous-ensemble animé. */
export const THUNDART_LAUNCHER_RACK_NODE = "THD_Launcher_Rack";
export const THUNDART_LAUNCHER_FORWARD_PIVOT_NODE =
  "THD_UI_LauncherForwardPivot";

/**
 * Dans l'asset, la cabine est sur -Z tandis que la géométrie locale du rack
 * sort initialement sur +Z. Ce pivot conserve les clips existants (rotation X
 * et translation du projectile) mais retourne leur repère autour de l'axe
 * vertical de l'articulation : le rack et le projectile se dirigent alors vers
 * la cabine, donc l'avant du véhicule.
 */
export const THUNDART_LAUNCHER_FORWARD_ROTATION_Y = Math.PI;

/**
 * Insère un pivot R3F local sans modifier le GLB. Le rack reste nommé et son
 * AnimationMixer continue donc de recevoir les pistes `THD_Launcher_Rack.*`.
 */
export function orientThundartLauncherForward(model: THREE.Object3D): boolean {
  const rack = model.getObjectByName(THUNDART_LAUNCHER_RACK_NODE);
  const parent = rack?.parent;
  if (!rack || !parent) return false;

  const pivot = new THREE.Group();
  pivot.name = THUNDART_LAUNCHER_FORWARD_PIVOT_NODE;
  pivot.position.copy(rack.position);
  pivot.rotation.y = THUNDART_LAUNCHER_FORWARD_ROTATION_Y;

  parent.add(pivot);
  parent.remove(rack);
  rack.position.set(0, 0, 0);
  pivot.add(rack);
  return true;
}
