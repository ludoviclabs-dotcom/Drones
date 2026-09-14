import * as THREE from "three";
import {
  PATRIOT_LAUNCH_SLOTS,
  createLaunchParticleSet,
  flameFlicker,
  ignitionFlash,
  ignitionTime,
  missileLaunchState,
  mulberry32,
  sampleDebris,
  samplePuff,
  type LaunchGeometries,
  type LaunchSlot,
} from "@/data/hud/patriot-launch";
import type { PatriotFireMode } from "@/data/hud/patriot";

/**
 * Effets de la mise à feu illustrative : fumées, flammes, jet arrière, éclats
 * et éclair. Couche impérative Three.js, entièrement pilotée par la
 * chronologie pure de `patriot-launch` : `update(t)` rend toujours la même
 * image pour le même `t`. Aucune boucle propre, aucune `Math.random`, aucune
 * texture téléchargée (tout est dessiné en Canvas 2D au montage).
 */

const SMOKE_VERTEX = /* glsl */ `
  attribute vec3 iOffset;
  attribute float iSize;
  attribute float iOpacity;
  attribute float iHeat;
  attribute float iShade;
  attribute float iRot;
  uniform vec3 uFlashPos;
  uniform float uFlash;
  varying vec2 vUv;
  varying vec2 vTexUv;
  varying float vOpacity;
  varying vec3 vColor;
  #include <fog_pars_vertex>
  void main() {
    // Quad face caméra, jamais tourné : l'ombrage haut/bas reste cohérent ;
    // seule la lecture de la texture tourne, pour varier les bouffées.
    vUv = uv;
    float c = cos(iRot);
    float s = sin(iRot);
    vec2 q = uv - 0.5;
    vTexUv = vec2(c * q.x - s * q.y, s * q.x + c * q.y) + 0.5;
    vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    vec3 world = iOffset + (right * position.x + up * position.y) * iSize * 2.0;
    vec4 mvPosition = viewMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vec3 cool = mix(vec3(0.66, 0.66, 0.63), vec3(0.88, 0.87, 0.84), iShade);
    vec3 warm = vec3(1.0, 0.56, 0.22);
    float near = uFlash * exp(-distance(iOffset, uFlashPos) / 11.0);
    vColor = mix(cool, warm * 1.8, iHeat) + warm * near * 1.4;
    vOpacity = iOpacity;
    #include <fog_vertex>
  }
`;

const SMOKE_FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  varying vec2 vUv;
  varying vec2 vTexUv;
  varying float vOpacity;
  varying vec3 vColor;
  #include <fog_pars_fragment>
  void main() {
    vec4 tex = texture2D(uMap, vTexUv);
    float a = tex.a * vOpacity;
    if (a < 0.004) discard;
    // Volume suggéré : sommet éclairé, base dans l'ombre, cœur plus dense.
    float light = mix(0.62, 1.1, smoothstep(0.05, 0.95, vUv.y));
    vec3 col = vColor * light * mix(0.86, 1.0, tex.r);
    gl_FragColor = vec4(col, a);
    #include <fog_fragment>
  }
`;

const FLAME_VERTEX = /* glsl */ `
  varying float vAlong;
  varying float vRadial;
  void main() {
    vAlong = uv.y;
    vRadial = abs(uv.x - 0.5) * 2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FLAME_FRAGMENT = /* glsl */ `
  uniform float uIntensity;
  varying float vAlong;
  varying float vRadial;
  void main() {
    // vAlong = 0 à la base (tuyère), 1 à la pointe ; cœur presque blanc.
    vec3 core = vec3(1.0, 0.98, 0.92);
    vec3 mid = vec3(1.0, 0.66, 0.26);
    vec3 tip = vec3(0.92, 0.3, 0.07);
    vec3 col = mix(core, mid, smoothstep(0.05, 0.4, vAlong));
    col = mix(col, tip, smoothstep(0.4, 1.0, vAlong));
    float a = (1.0 - smoothstep(0.5, 1.0, vAlong)) * uIntensity;
    gl_FragColor = vec4(col * a * 2.0, a);
  }
`;

function makeCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D indisponible pour les effets Patriot");
  return [canvas, context];
}

/** Bruit de valeur 2D périodique, déterministe (grille de hachage à graine). */
function valueNoise(seed: number, period: number): (x: number, y: number) => number {
  const rand = mulberry32(seed);
  const grid = Array.from({ length: period * period }, () => rand());
  const at = (ix: number, iy: number) =>
    grid[(((iy % period) + period) % period) * period + (((ix % period) + period) % period)];
  const fade = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = fade(x - ix);
    const fy = fade(y - iy);
    const a = at(ix, iy) + (at(ix + 1, iy) - at(ix, iy)) * fx;
    const b = at(ix, iy + 1) + (at(ix + 1, iy + 1) - at(ix, iy + 1)) * fx;
    return a + (b - a) * fy;
  };
}

/**
 * Bouffée de fumée : bruit fractal (4 octaves) sous une enveloppe radiale
 * douce. Canal alpha = densité ; canal rouge = relief interne (ombrage).
 */
function puffTexture(): THREE.DataTexture {
  const size = 128;
  const octaves = [valueNoise(11, 4), valueNoise(23, 8), valueNoise(37, 16), valueNoise(53, 32)];
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const v = y / size;
      let n = 0;
      let amp = 0.5;
      let total = 0;
      octaves.forEach((noise, k) => {
        const f = 4 * Math.pow(2, k);
        n += noise(u * f, v * f) * amp;
        total += amp;
        amp *= 0.5;
      });
      n /= total;
      const dx = u - 0.5;
      const dy = v - 0.5;
      const r = Math.sqrt(dx * dx + dy * dy) * 2;
      // Enveloppe large (1 - r²) : la densité reste haute jusqu'à mi-rayon,
      // les bouffées se recouvrent et la traînée forme une colonne continue.
      const envelope = Math.max(0, 1 - r * r);
      const density = Math.max(0, Math.min(1, Math.pow(envelope, 1.6) * (0.45 + 0.95 * n) - 0.05));
      const i = (y * size + x) * 4;
      data[i] = Math.round(255 * Math.min(1, 0.55 + n * 0.6));
      data[i + 1] = data[i];
      data[i + 2] = data[i];
      data[i + 3] = Math.round(255 * density);
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function groundGlowTexture(): THREE.CanvasTexture {
  const size = 128;
  const [canvas, ctx] = makeCanvas(size);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,196,120,0.9)");
  g.addColorStop(0.35, "rgba(255,130,50,0.45)");
  g.addColorStop(1, "rgba(255,90,20,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function glowTexture(): THREE.CanvasTexture {
  const size = 64;
  const [canvas, ctx] = makeCanvas(size);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,244,214,1)");
  g.addColorStop(0.25, "rgba(255,190,110,0.75)");
  g.addColorStop(0.6, "rgba(255,120,40,0.18)");
  g.addColorStop(1, "rgba(255,90,20,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

type FlameRig = {
  group: THREE.Group;
  cone: THREE.Mesh<THREE.ConeGeometry, THREE.ShaderMaterial>;
  glow: THREE.Sprite;
};

function createFlame(glowMap: THREE.Texture, length: number, radius: number): FlameRig {
  const group = new THREE.Group();
  const geometry = new THREE.ConeGeometry(radius, length, 18, 1, true);
  // Base à l'origine, pointe vers +Y local ; la rotation du groupe l'oriente.
  geometry.translate(0, length / 2, 0);
  const material = new THREE.ShaderMaterial({
    vertexShader: FLAME_VERTEX,
    fragmentShader: FLAME_FRAGMENT,
    uniforms: { uIntensity: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const cone = new THREE.Mesh(geometry, material);
  cone.frustumCulled = false;
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowMap,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  group.add(cone, glow);
  group.visible = false;
  for (const object of [cone, glow]) object.raycast = () => undefined;
  return { group, cone, glow };
}

type PlumeRig = {
  group: THREE.Group;
  sprites: THREE.Sprite[];
};

/** Profil du panache arrière : [position le long du jet (m), taille (m), opacité]. */
const PLUME_PROFILE: readonly (readonly [number, number, number])[] = [
  [0.2, 2.0, 1.0],
  [1.3, 3.0, 0.9],
  [2.6, 3.9, 0.75],
  [3.9, 4.6, 0.55],
  [5.2, 5.2, 0.38],
  [6.6, 5.8, 0.22],
];

/**
 * Panache du jet arrière : chaîne de lueurs additives le long de l'axe local
 * +Y, du blanc à l'orangé. Plus organique qu'un cône, sans aucune particule.
 */
function createPlume(glowMap: THREE.Texture): PlumeRig {
  const group = new THREE.Group();
  const sprites = PLUME_PROFILE.map(([along], index) => {
    const t = index / (PLUME_PROFILE.length - 1);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowMap,
        color: new THREE.Color().setRGB(1, 0.95 - 0.4 * t, 0.85 - 0.62 * t),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    sprite.position.set(0, along, 0);
    sprite.raycast = () => undefined;
    group.add(sprite);
    return sprite;
  });
  group.visible = false;
  return { group, sprites };
}

export type PatriotEffectsTargets = {
  /** Nœuds des intercepteurs (pivot au culot, avant sur -Z local). */
  missiles: Partial<Record<LaunchSlot, THREE.Object3D>>;
};

export type PatriotEffects = {
  readonly root: THREE.Group;
  readonly flashLight: THREE.PointLight;
  setGeometries: (geometries: LaunchGeometries | null) => void;
  update: (t: number, mode: PatriotFireMode, camera: THREE.Camera) => void;
  dispose: () => void;
};

export function createPatriotEffects(targets: PatriotEffectsTargets): PatriotEffects {
  const set = createLaunchParticleSet();
  const capacity = set.puffs.length;
  const root = new THREE.Group();
  root.name = "PAT_UI_LaunchEffects";

  const puffMap = puffTexture();
  const glowMap = glowTexture();

  // --- fumées : un quad instancié, attributs par bouffée
  const base = new THREE.PlaneGeometry(1, 1);
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = base.index;
  geometry.setAttribute("position", base.getAttribute("position"));
  geometry.setAttribute("uv", base.getAttribute("uv"));
  const offsets = new Float32Array(capacity * 3);
  const sizes = new Float32Array(capacity);
  const opacities = new Float32Array(capacity);
  const heats = new Float32Array(capacity);
  const shades = new Float32Array(capacity);
  const rotations = new Float32Array(capacity);
  const attr = (array: Float32Array, size: number) =>
    new THREE.InstancedBufferAttribute(array, size).setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("iOffset", attr(offsets, 3));
  geometry.setAttribute("iSize", attr(sizes, 1));
  geometry.setAttribute("iOpacity", attr(opacities, 1));
  geometry.setAttribute("iHeat", attr(heats, 1));
  geometry.setAttribute("iShade", attr(shades, 1));
  geometry.setAttribute("iRot", attr(rotations, 1));
  geometry.instanceCount = 0;
  const smokeMaterial = new THREE.ShaderMaterial({
    vertexShader: SMOKE_VERTEX,
    fragmentShader: SMOKE_FRAGMENT,
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uMap: { value: puffMap },
        uFlashPos: { value: new THREE.Vector3() },
        uFlash: { value: 0 },
      },
    ]),
    transparent: true,
    depthWrite: false,
    fog: true,
  });
  smokeMaterial.uniforms.uMap.value = puffMap;
  const smoke = new THREE.Mesh(geometry, smokeMaterial);
  smoke.name = "PAT_UI_Smoke";
  smoke.frustumCulled = false;
  smoke.renderOrder = 5;
  smoke.raycast = () => undefined;
  root.add(smoke);

  // --- éclats d'opercules
  const debrisGeometry = new THREE.BoxGeometry(1, 0.06, 0.8);
  const debrisMaterial = new THREE.MeshStandardMaterial({
    color: "#6f6a4c",
    roughness: 0.85,
  });
  const debrisMesh = new THREE.InstancedMesh(debrisGeometry, debrisMaterial, set.debris.length);
  debrisMesh.name = "PAT_UI_Debris";
  debrisMesh.count = 0;
  debrisMesh.frustumCulled = false;
  debrisMesh.raycast = () => undefined;
  root.add(debrisMesh);

  // --- panaches arrière (un par créneau), ancrés en coordonnées monde
  const exhaust: Record<LaunchSlot, PlumeRig> = {
    A: createPlume(glowMap),
    B: createPlume(glowMap),
  };
  for (const slot of PATRIOT_LAUNCH_SLOTS) root.add(exhaust[slot].group);

  // --- lueur au sol, là où le jet arrière frappe le terrain
  const groundMap = groundGlowTexture();
  const groundGeometry = new THREE.CircleGeometry(1, 32);
  const groundGlow: Record<LaunchSlot, THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>> = {
    A: new THREE.Mesh(groundGeometry, new THREE.MeshBasicMaterial({
      map: groundMap, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
    })),
    B: new THREE.Mesh(groundGeometry, new THREE.MeshBasicMaterial({
      map: groundMap, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
    })),
  };
  for (const slot of PATRIOT_LAUNCH_SLOTS) {
    const disc = groundGlow[slot];
    disc.rotation.x = -Math.PI / 2;
    disc.visible = false;
    disc.renderOrder = 4;
    disc.raycast = () => undefined;
    root.add(disc);
  }

  // --- flammes de culot, enfants des intercepteurs (elles suivent le départ)
  const flames: Partial<Record<LaunchSlot, FlameRig>> = {};
  for (const slot of PATRIOT_LAUNCH_SLOTS) {
    const missile = targets.missiles[slot];
    if (!missile) continue;
    const rig = createFlame(glowMap, 3.2, 0.13);
    // Avant du missile sur -Z local : la flamme part vers +Z local.
    rig.group.rotation.set(Math.PI / 2, 0, 0);
    missile.add(rig.group);
    flames[slot] = rig;
  }

  const flashLight = new THREE.PointLight("#ffb46b", 0, 70, 1.6);
  flashLight.name = "PAT_UI_FlashLight";
  root.add(flashLight);

  let geometries: LaunchGeometries | null = null;
  const order: number[] = [];
  const depth = new Float32Array(capacity);
  const scratch = new THREE.Vector3();
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const axisVector = new THREE.Vector3();

  function orientExhaust(rig: PlumeRig, slot: LaunchSlot) {
    if (!geometries) return;
    const geom = geometries[slot];
    rig.group.position.set(geom.rear[0], geom.rear[1], geom.rear[2]);
    axisVector.set(-geom.axis[0], -geom.axis[1], -geom.axis[2]).normalize();
    rig.group.quaternion.setFromUnitVectors(up, axisVector);
  }

  const cameraPosition = new THREE.Vector3();
  const flamePosition = new THREE.Vector3();

  function update(t: number, mode: PatriotFireMode, camera: THREE.Camera) {
    if (!geometries) {
      geometry.instanceCount = 0;
      debrisMesh.count = 0;
      flashLight.intensity = 0;
      for (const slot of PATRIOT_LAUNCH_SLOTS) {
        exhaust[slot].group.visible = false;
        groundGlow[slot].visible = false;
        const flame = flames[slot];
        if (flame) flame.group.visible = false;
      }
      return;
    }
    camera.getWorldPosition(cameraPosition);

    // Fumées : échantillonnage pur, puis tri arrière → avant.
    const samples: { i: number; x: number; y: number; z: number; size: number; opacity: number; heat: number; shade: number }[] = [];
    set.puffs.forEach((puff, i) => {
      const sample = samplePuff(puff, geometries![puff.slot], mode, t);
      if (!sample || sample.opacity < 0.003) return;
      samples.push({ i, ...sample });
    });
    camera.updateMatrixWorld();
    const view = camera.matrixWorldInverse;
    order.length = 0;
    samples.forEach((sample, index) => {
      scratch.set(sample.x, sample.y, sample.z).applyMatrix4(view);
      depth[index] = scratch.z;
      order.push(index);
    });
    order.sort((a, b) => depth[a] - depth[b]);
    order.forEach((index, k) => {
      const sample = samples[index];
      offsets[k * 3] = sample.x;
      offsets[k * 3 + 1] = sample.y;
      offsets[k * 3 + 2] = sample.z;
      sizes[k] = sample.size;
      opacities[k] = sample.opacity;
      heats[k] = sample.heat;
      shades[k] = sample.shade;
      rotations[k] = sample.i * 2.39996;
    });
    geometry.instanceCount = samples.length;
    for (const name of ["iOffset", "iSize", "iOpacity", "iHeat", "iShade", "iRot"]) {
      (geometry.getAttribute(name) as THREE.InstancedBufferAttribute).needsUpdate = true;
    }

    // Éclats
    let visibleDebris = 0;
    for (const seed of set.debris) {
      const sample = sampleDebris(seed, geometries[seed.slot], mode, t);
      if (!sample.visible) continue;
      position.set(sample.x, sample.y, sample.z);
      quaternion.setFromEuler(euler.set(sample.rx, sample.ry, sample.rz));
      scale.setScalar(sample.size);
      matrix.compose(position, quaternion, scale);
      debrisMesh.setMatrixAt(visibleDebris, matrix);
      visibleDebris += 1;
    }
    debrisMesh.count = visibleDebris;
    debrisMesh.instanceMatrix.needsUpdate = true;

    // Éclair, jets arrière, flammes de culot
    let flash = 0;
    let flashSlot: LaunchSlot = "A";
    for (const slot of PATRIOT_LAUNCH_SLOTS) {
      const value = ignitionFlash(slot, mode, t);
      if (value > flash) {
        flash = value;
        flashSlot = slot;
      }
      const ignition = ignitionTime(slot, mode);
      const tau = ignition === null ? -1 : t - ignition;
      const jet = tau > 0 ? Math.min(1, tau / 0.05) * Math.exp(-Math.max(0, tau - 0.25) / 0.35) : 0;
      const rig = exhaust[slot];
      rig.group.visible = jet > 0.01;
      if (rig.group.visible) {
        orientExhaust(rig, slot);
        rig.sprites.forEach((sprite, index) => {
          const [along, size, alpha] = PLUME_PROFILE[index];
          const flicker = flameFlicker(t + index * 0.037, (slot === "A" ? 1 : 2) + index);
          sprite.position.set(0, along * (0.55 + 0.45 * jet), 0);
          sprite.scale.setScalar(size * (0.55 + 0.55 * jet) * flicker);
          sprite.material.opacity = Math.min(1, alpha * jet * 1.15);
        });
      }
      // Lueur au sol : point d'impact du jet (le long de -axe jusqu'à y = 0).
      const disc = groundGlow[slot];
      const g = geometries[slot];
      const glowLevel = Math.max(jet, ignitionFlash(slot, mode, t) * 0.6);
      disc.visible = glowLevel > 0.01 && g.axis[1] > 0.05;
      if (disc.visible) {
        const reach = g.rear[1] / g.axis[1];
        disc.position.set(g.rear[0] - g.axis[0] * reach, 0.04, g.rear[2] - g.axis[2] * reach);
        disc.scale.setScalar(3 + 5 * glowLevel);
        disc.material.opacity = Math.min(1, glowLevel * 1.1);
      }
      const flame = flames[slot];
      if (flame) {
        const state = missileLaunchState(slot, mode, t);
        flame.group.visible = state.flame > 0.01;
        if (flame.group.visible) {
          const flicker = flameFlicker(t, slot === "A" ? 3 : 4);
          flame.cone.material.uniforms.uIntensity.value = state.flame;
          flame.cone.scale.set(1, flicker, 1);
          // Au loin, la lueur garde une taille apparente minimale : on voit
          // encore où se trouve l'intercepteur quand il n'est plus qu'un point.
          flame.glow.getWorldPosition(flamePosition);
          const distance = flamePosition.distanceTo(cameraPosition);
          flame.glow.scale.setScalar(Math.max(1.6 + 1.4 * flicker, distance * 0.012 * flicker));
          flame.glow.material.opacity = 0.9 * state.flame;
        }
      }
    }
    const geom = geometries[flashSlot];
    flashLight.position.set(geom.rear[0], geom.rear[1] + 1.2, geom.rear[2]);
    flashLight.intensity = flash * 380;
    smokeMaterial.uniforms.uFlash.value = flash;
    (smokeMaterial.uniforms.uFlashPos.value as THREE.Vector3).set(geom.rear[0], geom.rear[1], geom.rear[2]);
  }

  return {
    root,
    flashLight,
    setGeometries: (next) => {
      geometries = next;
    },
    update,
    dispose: () => {
      for (const slot of PATRIOT_LAUNCH_SLOTS) {
        for (const sprite of exhaust[slot].sprites) sprite.material.dispose();
        const flame = flames[slot];
        if (flame) {
          flame.group.parent?.remove(flame.group);
          flame.cone.geometry.dispose();
          flame.cone.material.dispose();
          flame.glow.material.dispose();
        }
      }
      for (const slot of PATRIOT_LAUNCH_SLOTS) groundGlow[slot].material.dispose();
      groundGeometry.dispose();
      groundMap.dispose();
      base.dispose();
      geometry.dispose();
      smokeMaterial.dispose();
      debrisGeometry.dispose();
      debrisMaterial.dispose();
      debrisMesh.dispose();
      puffMap.dispose();
      glowMap.dispose();
      root.parent?.remove(root);
    },
  };
}
