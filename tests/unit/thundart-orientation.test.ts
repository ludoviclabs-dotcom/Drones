import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  orientThundartLauncherForward,
  THUNDART_LAUNCHER_FORWARD_PIVOT_NODE,
  THUNDART_LAUNCHER_FORWARD_ROTATION_Y,
  THUNDART_LAUNCHER_RACK_NODE,
} from "@/data/hud/thundart-orientation";

describe("orientation avant du rack Thundart", () => {
  it("insère un pivot local sans renommer le rack animé", () => {
    const root = new THREE.Group();
    const base = new THREE.Group();
    const rack = new THREE.Group();
    const canister = new THREE.Group();
    rack.name = THUNDART_LAUNCHER_RACK_NODE;
    rack.position.set(0, 0.42, -1.45);
    // Le GLB porte les canisters vers +Z dans le repère local du rack.
    canister.position.set(0, 0, 3);
    rack.add(canister);
    base.add(rack);
    root.add(base);

    expect(orientThundartLauncherForward(root)).toBe(true);

    const pivot = root.getObjectByName(THUNDART_LAUNCHER_FORWARD_PIVOT_NODE);
    expect(pivot).toBeInstanceOf(THREE.Group);
    expect(pivot?.parent).toBe(base);
    expect(pivot?.position.toArray()).toEqual([0, 0.42, -1.45]);
    expect(pivot?.rotation.y).toBe(THUNDART_LAUNCHER_FORWARD_ROTATION_Y);
    expect(root.getObjectByName(THUNDART_LAUNCHER_RACK_NODE)).toBe(rack);
    expect(rack.parent).toBe(pivot);
    expect(rack.position.toArray()).toEqual([0, 0, 0]);

    // Le clip configure applique -31,5° sur X. Après le pivot, le canister
    // s'élève tout en allant vers -Z, le côté où la documentation de l'asset
    // place la cabine : il ne peut donc plus partir vers l'arrière.
    rack.rotation.x = THREE.MathUtils.degToRad(-31.5);
    root.updateWorldMatrix(true, true);
    const pivotWorld = pivot!.getWorldPosition(new THREE.Vector3());
    const canisterWorld = canister.getWorldPosition(new THREE.Vector3());
    expect(canisterWorld.y).toBeGreaterThan(pivotWorld.y);
    expect(canisterWorld.z).toBeLessThan(pivotWorld.z);
  });

  it("laisse le modèle intact si le rack attendu est absent", () => {
    const root = new THREE.Group();
    expect(orientThundartLauncherForward(root)).toBe(false);
    expect(root.children).toHaveLength(0);
  });
});
