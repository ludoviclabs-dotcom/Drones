import * as THREE from "three";

export const THUNDART_LAUNCHER_RACK_NODE = "THD_Launcher_Rack";
export const THUNDART_PROJECTILE_NODE = "THD_Rocket_Demo";

export type ThundartForwardLauncherRig = {
  rack: THREE.Object3D;
  rackRestPosition: THREE.Vector3;
  rackRestQuaternion: THREE.Quaternion;
  rearHingeOffset: THREE.Vector3;
  projectile: THREE.Object3D;
  projectileRestPosition: THREE.Vector3;
};

function rearHingeOffsetForRack(rack: THREE.Object3D): THREE.Vector3 {
  if (rack instanceof THREE.Mesh) {
    if (!rack.geometry.boundingBox) rack.geometry.computeBoundingBox();
    const rearZ = rack.geometry.boundingBox?.max.z;
    if (rearZ !== undefined && Number.isFinite(rearZ)) {
      return new THREE.Vector3(0, 0, rearZ);
    }
  }

  // Repli pour un futur export où le rack redeviendrait un groupe : les
  // bornes sont ramenées dans son repère sans modifier aucun parent.
  rack.updateWorldMatrix(true, true);
  const inverseRackWorld = rack.matrixWorld.clone().invert();
  const localBounds = new THREE.Box3().makeEmpty();
  const corner = new THREE.Vector3();
  const transform = new THREE.Matrix4();

  rack.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
    const bounds = child.geometry.boundingBox;
    if (!bounds) return;
    transform.multiplyMatrices(inverseRackWorld, child.matrixWorld);
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) {
          localBounds.expandByPoint(corner.set(x, y, z).applyMatrix4(transform));
        }
      }
    }
  });

  return new THREE.Vector3(0, 0, localBounds.isEmpty() ? 0 : localBounds.max.z);
}

/**
 * Capture les repères nécessaires à la correction sans toucher à la structure
 * du clone GLB. OVERVIEW reste donc pixel-identique à l'asset exporté.
 */
export function createThundartForwardLauncherRig(
  model: THREE.Object3D,
): ThundartForwardLauncherRig | null {
  const rack = model.getObjectByName(THUNDART_LAUNCHER_RACK_NODE);
  const projectile = model.getObjectByName(THUNDART_PROJECTILE_NODE);
  if (!rack || !projectile) return null;

  return {
    rack,
    rackRestPosition: rack.position.clone(),
    rackRestQuaternion: rack.quaternion.clone(),
    rearHingeOffset: rearHingeOffsetForRack(rack),
    projectile,
    projectileRestPosition: projectile.position.clone(),
  };
}

/** Pose les valeurs sources lues directement dans les pistes glTF. */
export function setThundartLauncherSourcePose(
  rig: ThundartForwardLauncherRig,
  rackQuaternion: ArrayLike<number>,
  projectilePosition: ArrayLike<number>,
): void {
  rig.rack.position.copy(rig.rackRestPosition);
  rig.rack.quaternion.fromArray(rackQuaternion);
  rig.projectile.position.fromArray(projectilePosition);
}

/**
 * Le mixer vient d'évaluer les clips exportés. On inverse uniquement leurs
 * deltas cinématiques :
 *
 * - la rotation du rack est réfléchie autour de sa pose de repos ;
 * - sa position compense cette rotation pour garder la charnière arrière fixe ;
 * - le déplacement du projectile est réfléchi autour de sa position initiale.
 *
 * Aucun objet n'est retourné, déplacé ou reparanté dans la pose de repos.
 */
export function applyThundartForwardLauncherPose(
  rig: ThundartForwardLauncherRig,
): void {
  const sourceDelta = rig.rackRestQuaternion
    .clone()
    .invert()
    .multiply(rig.rack.quaternion);
  const rackAtRest =
    Math.abs(sourceDelta.x) < 1e-12 &&
    Math.abs(sourceDelta.y) < 1e-12 &&
    Math.abs(sourceDelta.z) < 1e-12 &&
    Math.abs(Math.abs(sourceDelta.w) - 1) < 1e-12;

  if (rackAtRest) {
    // Évite même l'écart flottant infinitésimal d'une recomposition matricielle.
    rig.rack.position.copy(rig.rackRestPosition);
    rig.rack.quaternion.copy(rig.rackRestQuaternion);
  } else {
    const correctedQuaternion = rig.rackRestQuaternion
      .clone()
      .multiply(sourceDelta.invert());
    const restHinge = rig.rearHingeOffset
      .clone()
      .applyQuaternion(rig.rackRestQuaternion);
    const correctedHinge = rig.rearHingeOffset
      .clone()
      .applyQuaternion(correctedQuaternion);

    rig.rack.quaternion.copy(correctedQuaternion);
    rig.rack.position
      .copy(rig.rackRestPosition)
      .add(restHinge)
      .sub(correctedHinge);
  }

  const sourceProjectileDelta = rig.projectile.position
    .clone()
    .sub(rig.projectileRestPosition);
  if (sourceProjectileDelta.lengthSq() < 1e-24) {
    rig.projectile.position.copy(rig.projectileRestPosition);
  } else {
    rig.projectile.position
      .copy(rig.projectileRestPosition)
      .sub(sourceProjectileDelta);
  }
}
