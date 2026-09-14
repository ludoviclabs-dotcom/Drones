import * as THREE from "three";
import type { RafaleScenario } from "@/data/hud/rafale";
import type { Vec3 } from "@/data/hud/rafale-launch";

/**
 * Secteurs SYMBOLIQUES des capteurs, dans le repère de l'avion : éventail de
 * l'antenne RBE2 vers l'avant, cône étroit de l'optronique frontale, bulle
 * de couverture de SPECTRA, et liaison de données du Meteor après son
 * départ. Aucune échelle, aucune valeur : des repères de lecture, dessinés en
 * lignes fines additives. Rien n'y est calculé.
 */

export type RafaleSensorKey = "radar" | "osf" | "spectra";

/** Capteur mis en avant par chaque scénario (1 = en avant, sinon rappel discret). */
export const RAFALE_SENSOR_EMPHASIS: Record<RafaleScenario, Record<RafaleSensorKey, number>> = {
  bvr: { radar: 1, osf: 0.3, spectra: 0.3 },
  wvr: { radar: 0.35, osf: 1, spectra: 0.3 },
  sead: { radar: 0.35, osf: 0.3, spectra: 1 },
};

const COLORS: Record<RafaleSensorKey | "link", string> = {
  radar: "#7fb6c9",
  osf: "#e2b36a",
  spectra: "#e07a4d",
  link: "#9fd0c0",
};

/** Géométrie des repères (m, repère avion : nez vers -Z). */
const LAYOUT = {
  radarApex: [0, 0.2, -8.1] as Vec3,
  radarRadius: 72,
  radarHalfAngle: THREE.MathUtils.degToRad(60),
  osfApex: [0, 0.74, -5.5] as Vec3,
  osfLength: 58,
  osfHalfAngle: THREE.MathUtils.degToRad(8),
  spectraCenter: [0, 0.6, 0.4] as Vec3,
  spectraRadius: 19,
  linkFrom: [0, 0.95, -0.8] as Vec3,
};

function lineMaterial(color: string): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
}

function radarFan(): THREE.Group {
  const group = new THREE.Group();
  const { radarApex, radarRadius, radarHalfAngle } = LAYOUT;
  const points: THREE.Vector3[] = [];
  const arcs = [0.34, 0.67, 1];
  const steps = 48;
  for (const f of arcs) {
    for (let i = 0; i < steps; i += 1) {
      const a0 = -radarHalfAngle + (2 * radarHalfAngle * i) / steps;
      const a1 = -radarHalfAngle + (2 * radarHalfAngle * (i + 1)) / steps;
      points.push(
        new THREE.Vector3(Math.sin(a0) * radarRadius * f, 0, -Math.cos(a0) * radarRadius * f),
        new THREE.Vector3(Math.sin(a1) * radarRadius * f, 0, -Math.cos(a1) * radarRadius * f),
      );
    }
  }
  for (let k = -3; k <= 3; k += 1) {
    const a = (radarHalfAngle * k) / 3;
    points.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.sin(a) * radarRadius, 0, -Math.cos(a) * radarRadius),
    );
  }
  const lines = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(points),
    lineMaterial(COLORS.radar),
  );
  const fill = new THREE.Mesh(
    new THREE.CircleGeometry(radarRadius, 48, Math.PI / 2 - radarHalfAngle, radarHalfAngle * 2),
    new THREE.MeshBasicMaterial({
      color: COLORS.radar,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      toneMapped: false,
    }),
  );
  // Cercle dans le plan XY, ouvert vers +Y : on le couche dans le plan de l'aile, vers -Z.
  fill.rotation.x = -Math.PI / 2;
  group.add(lines, fill);
  group.position.set(...radarApex);
  return group;
}

function osfCone(): THREE.Group {
  const group = new THREE.Group();
  const { osfApex, osfLength, osfHalfAngle } = LAYOUT;
  const radius = Math.tan(osfHalfAngle) * osfLength;
  const points: THREE.Vector3[] = [];
  const steps = 32;
  for (let i = 0; i < steps; i += 1) {
    const a0 = (2 * Math.PI * i) / steps;
    const a1 = (2 * Math.PI * (i + 1)) / steps;
    points.push(
      new THREE.Vector3(Math.cos(a0) * radius, Math.sin(a0) * radius, -osfLength),
      new THREE.Vector3(Math.cos(a1) * radius, Math.sin(a1) * radius, -osfLength),
    );
  }
  for (let k = 0; k < 6; k += 1) {
    const a = (2 * Math.PI * k) / 6;
    points.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, -osfLength),
    );
  }
  group.add(
    new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), lineMaterial(COLORS.osf)),
  );
  group.position.set(...osfApex);
  return group;
}

function spectraBubble(): THREE.Group {
  const group = new THREE.Group();
  const { spectraRadius: r } = LAYOUT;
  const points: THREE.Vector3[] = [];
  const steps = 48;
  // Méridiens
  for (let m = 0; m < 8; m += 1) {
    const phi = (Math.PI * m) / 8;
    for (let i = 0; i < steps; i += 1) {
      const t0 = (2 * Math.PI * i) / steps;
      const t1 = (2 * Math.PI * (i + 1)) / steps;
      points.push(
        new THREE.Vector3(Math.cos(phi) * Math.sin(t0) * r, Math.cos(t0) * r, Math.sin(phi) * Math.sin(t0) * r),
        new THREE.Vector3(Math.cos(phi) * Math.sin(t1) * r, Math.cos(t1) * r, Math.sin(phi) * Math.sin(t1) * r),
      );
    }
  }
  // Parallèles
  for (const lat of [-0.6, -0.3, 0, 0.3, 0.6]) {
    const y = Math.sin(lat) * r;
    const rr = Math.cos(lat) * r;
    for (let i = 0; i < steps; i += 1) {
      const t0 = (2 * Math.PI * i) / steps;
      const t1 = (2 * Math.PI * (i + 1)) / steps;
      points.push(
        new THREE.Vector3(Math.cos(t0) * rr, y, Math.sin(t0) * rr),
        new THREE.Vector3(Math.cos(t1) * rr, y, Math.sin(t1) * rr),
      );
    }
  }
  group.add(
    new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), lineMaterial(COLORS.spectra)),
  );
  group.position.set(...LAYOUT.spectraCenter);
  return group;
}

export type RafaleSensors = {
  readonly root: THREE.Group;
  /**
   * `level` : présence 0..1 des secteurs (état « capteurs ») ; `link` :
   * position de la munition pour la liaison de données (null = masquée).
   */
  update: (level: number, scenario: RafaleScenario, link: Vec3 | null) => void;
  dispose: () => void;
};

export function createRafaleSensors(): RafaleSensors {
  const root = new THREE.Group();
  root.name = "RAF_UI_Sensors";
  const radar = radarFan();
  const osf = osfCone();
  const spectra = spectraBubble();
  const groups: Record<RafaleSensorKey, THREE.Group> = { radar, osf, spectra };
  root.add(radar, osf, spectra);

  const linkGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(...LAYOUT.linkFrom),
    new THREE.Vector3(...LAYOUT.linkFrom),
  ]);
  const linkMaterial = new THREE.LineDashedMaterial({
    color: COLORS.link,
    dashSize: 2.2,
    gapSize: 1.6,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    toneMapped: false,
  });
  const link = new THREE.Line(linkGeometry, linkMaterial);
  link.name = "RAF_UI_DataLink";
  link.visible = false;
  link.frustumCulled = false;
  root.add(link);

  root.traverse((child) => {
    child.raycast = () => undefined;
  });

  function setOpacity(group: THREE.Group, lines: number, fill: number) {
    group.visible = lines > 0.005;
    group.traverse((child) => {
      if (child instanceof THREE.LineSegments) {
        (child.material as THREE.LineBasicMaterial).opacity = lines;
      } else if (child instanceof THREE.Mesh) {
        (child.material as THREE.MeshBasicMaterial).opacity = fill;
      }
    });
  }

  function update(level: number, scenario: RafaleScenario, target: Vec3 | null) {
    const emphasis = RAFALE_SENSOR_EMPHASIS[scenario];
    for (const key of ["radar", "osf", "spectra"] as const) {
      const w = level * emphasis[key];
      setOpacity(groups[key], 0.55 * w, 0.07 * w);
    }
    link.visible = target !== null;
    if (target) {
      const position = linkGeometry.getAttribute("position") as THREE.BufferAttribute;
      position.setXYZ(1, target[0], target[1], target[2]);
      position.needsUpdate = true;
      linkGeometry.computeBoundingSphere();
      link.computeLineDistances();
    }
  }

  return {
    root,
    update,
    dispose: () => {
      root.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
          child.geometry.dispose();
          const material = child.material as THREE.Material | THREE.Material[];
          (Array.isArray(material) ? material : [material]).forEach((m) => m.dispose());
        }
      });
      root.parent?.remove(root);
    },
  };
}
