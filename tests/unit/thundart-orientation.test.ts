import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  applyThundartForwardLauncherPose,
  createThundartForwardLauncherRig,
  setThundartLauncherSourcePose,
  THUNDART_LAUNCHER_RACK_NODE,
  THUNDART_PROJECTILE_NODE,
} from "@/data/hud/thundart-orientation";

function createModel() {
  const root = new THREE.Group();
  const base = new THREE.Group();
  const rack = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 12));
  const projectile = new THREE.Group();
  rack.name = THUNDART_LAUNCHER_RACK_NODE;
  rack.position.set(0, 0.42, -1.45);
  projectile.name = THUNDART_PROJECTILE_NODE;
  projectile.position.set(-1, 1.045, 2.95);
  rack.add(projectile);
  base.add(rack);
  root.add(base);
  return { root, base, rack, projectile };
}

describe("cinématique avant du rack Thundart", () => {
  it("ne modifie ni la hiérarchie ni la pose OVERVIEW", () => {
    const { root, base, rack, projectile } = createModel();
    const rackPosition = rack.position.clone();
    const rackQuaternion = rack.quaternion.clone();
    const projectilePosition = projectile.position.clone();

    const rig = createThundartForwardLauncherRig(root);
    expect(rig).not.toBeNull();
    applyThundartForwardLauncherPose(rig!);

    expect(rack.parent).toBe(base);
    expect(projectile.parent).toBe(rack);
    expect(rack.position.toArray()).toEqual(rackPosition.toArray());
    expect(rack.quaternion.toArray()).toEqual(rackQuaternion.toArray());
    expect(projectile.position.toArray()).toEqual(projectilePosition.toArray());
  });

  it("garde la charnière arrière fixe et lève l’extrémité côté cabine", () => {
    const { root, rack } = createModel();
    const rig = createThundartForwardLauncherRig(root)!;
    const rearHingeBefore = rig.rearHingeOffset
      .clone()
      .applyQuaternion(rig.rackRestQuaternion)
      .add(rig.rackRestPosition);

    // Valeur finale réellement exportée dans THD_CONFIGURE_DEMO.
    rack.rotation.x = THREE.MathUtils.degToRad(-31.51);
    applyThundartForwardLauncherPose(rig);

    const rearHingeAfter = rig.rearHingeOffset
      .clone()
      .applyQuaternion(rack.quaternion)
      .add(rack.position);
    const front = new THREE.Vector3(0, 0, -rig.rearHingeOffset.z)
      .applyQuaternion(rack.quaternion)
      .add(rearHingeAfter);

    expect(rearHingeAfter.distanceTo(rearHingeBefore)).toBeLessThan(1e-9);
    expect(front.y).toBeGreaterThan(rearHingeAfter.y);
    expect(front.z).toBeLessThan(rearHingeAfter.z);
  });

  it("réfléchit seulement la séparation du projectile vers -Z", () => {
    const { root, projectile } = createModel();
    const rig = createThundartForwardLauncherRig(root)!;
    projectile.position.z = 9.55;

    applyThundartForwardLauncherPose(rig);

    expect(projectile.position.x).toBeCloseTo(-1, 10);
    expect(projectile.position.y).toBeCloseTo(1.045, 10);
    expect(projectile.position.z).toBeCloseTo(-3.65, 10);
  });

  it("rend deux évaluations successives strictement idempotentes", () => {
    const { root, rack, projectile } = createModel();
    const rig = createThundartForwardLauncherRig(root)!;

    const evaluateSourceClip = () => {
      const sourceQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(THREE.MathUtils.degToRad(-31.51), 0, 0),
      );
      setThundartLauncherSourcePose(
        rig,
        sourceQuaternion.toArray(),
        [-1, 1.045, 9.55],
      );
      applyThundartForwardLauncherPose(rig);
    };

    evaluateSourceClip();
    const firstRackPosition = rack.position.clone();
    const firstRackQuaternion = rack.quaternion.clone();
    const firstProjectilePosition = projectile.position.clone();
    evaluateSourceClip();

    expect(rack.position.toArray()).toEqual(firstRackPosition.toArray());
    expect(rack.quaternion.toArray()).toEqual(firstRackQuaternion.toArray());
    expect(projectile.position.toArray()).toEqual(
      firstProjectilePosition.toArray(),
    );
  });

  it("reste sans effet si les noeuds attendus sont absents", () => {
    expect(createThundartForwardLauncherRig(new THREE.Group())).toBeNull();
  });
});
