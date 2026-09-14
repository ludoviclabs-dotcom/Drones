import * as THREE from "three";
import { RAFALE_SCENARIOS, type RafaleScenario } from "@/data/hud/rafale";
import {
  RAFALE_SHOTS,
  createShotParticles,
  flameFlicker,
  mulberry32,
  samplePuff,
  shotState,
  type PuffSeed,
  type Vec3,
} from "@/data/hud/rafale-launch";

/**
 * Effets du départ illustratif : fumées, flamme de tuyère et lueur
 * d'allumage. Couche impérative Three.js pilotée par la chronologie pure de
 * `rafale-launch` : `update(t)` rend toujours la même image pour le même `t`.
 * Tout est exprimé dans le repère de l'avion (le groupe racine est enfant du
 * groupe de vol). Aucune boucle propre, aucune `Math.random`, aucune texture
 * téléchargée : tout est dessiné au montage.
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
    vUv = uv;
    float c = cos(iRot);
    float s = sin(iRot);
    vec2 q = uv - 0.5;
    vTexUv = vec2(c * q.x - s * q.y, s * q.x + c * q.y) + 0.5;
    vec4 center = modelMatrix * vec4(iOffset, 1.0);
    vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    vec3 world = center.xyz + (right * position.x + up * position.y) * iSize * 2.0;
    vec4 mvPosition = viewMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vec3 cool = mix(vec3(0.62, 0.63, 0.62), vec3(0.86, 0.86, 0.84), iShade);
    vec3 warm = vec3(1.0, 0.58, 0.24);
    float near = uFlash * exp(-distance(iOffset, uFlashPos) / 6.0);
    vColor = mix(cool, warm * 1.7, iHeat) + warm * near * 1.2;
    // Une bouffée qui frôle la caméra s'efface : jamais de voile plein cadre.
    float toCamera = distance(center.xyz, cameraPosition);
    vOpacity = iOpacity * smoothstep(iSize * 1.2, iSize * 4.0 + 6.0, toCamera);
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
    float light = mix(0.66, 1.08, smoothstep(0.05, 0.95, vUv.y));
    vec3 col = vColor * light * mix(0.86, 1.0, tex.r);
    gl_FragColor = vec4(col, a);
    #include <fog_fragment>
  }
`;

const FLAME_VERTEX = /* glsl */ `
  varying float vAlong;
  void main() {
    vAlong = uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FLAME_FRAGMENT = /* glsl */ `
  uniform float uIntensity;
  varying float vAlong;
  void main() {
    vec3 core = vec3(1.0, 0.97, 0.9);
    vec3 mid = vec3(1.0, 0.64, 0.24);
    vec3 tip = vec3(0.9, 0.28, 0.06);
    vec3 col = mix(core, mid, smoothstep(0.05, 0.4, vAlong));
    col = mix(col, tip, smoothstep(0.4, 1.0, vAlong));
    float a = (1.0 - smoothstep(0.45, 1.0, vAlong)) * uIntensity;
    gl_FragColor = vec4(col * a * 2.0, a);
  }
`;

/** Bruit de valeur 2D périodique, déterministe (grille de hachage à graine). */
export function valueNoise(seed: number, period: number): (x: number, y: number) => number {
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
 * Bouffée : bruit fractal (4 octaves) sous une enveloppe radiale douce.
 * Canal alpha = densité ; canal rouge = relief interne (ombrage).
 */
export function puffTexture(seedBase = 11): THREE.DataTexture {
  const size = 128;
  const octaves = [
    valueNoise(seedBase, 4),
    valueNoise(seedBase + 12, 8),
    valueNoise(seedBase + 26, 16),
    valueNoise(seedBase + 42, 32),
  ];
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

export function glowTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D indisponible pour les effets Rafale");
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
  group.name = "RAF_UI_Flame";
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

/** Longueur et rayon de flamme par munition (m). */
const FLAME_SIZE: Record<RafaleScenario, { length: number; radius: number }> = {
  bvr: { length: 3.6, radius: 0.14 },
  wvr: { length: 3.0, radius: 0.11 },
  sead: { length: 3.2, radius: 0.14 },
};

export type RafaleEffectsTargets = {
  /** Munition tirée dans chaque scénario (origine au milieu du corps, nez vers -Z). */
  shots: Partial<Record<RafaleScenario, THREE.Object3D>>;
  /** Points d'emport au repos (repère avion). */
  rests: Partial<Record<RafaleScenario, Vec3>>;
};

export type RafaleEffects = {
  readonly root: THREE.Group;
  readonly flashLight: THREE.PointLight;
  update: (t: number, scenario: RafaleScenario, camera: THREE.Camera) => void;
  dispose: () => void;
};

type SmokeSampleRow = {
  i: number;
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  heat: number;
  shade: number;
};

export function createRafaleEffects(targets: RafaleEffectsTargets): RafaleEffects {
  const particles: Record<RafaleScenario, readonly PuffSeed[]> = {
    bvr: createShotParticles("bvr"),
    wvr: createShotParticles("wvr"),
    sead: createShotParticles("sead"),
  };
  const capacity = Math.max(...RAFALE_SCENARIOS.map((s) => particles[s].length));
  const root = new THREE.Group();
  root.name = "RAF_UI_LaunchEffects";

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
  // `UniformsUtils.merge` clone les textures : on rattache la texture d'origine.
  smokeMaterial.uniforms.uMap.value = puffMap;
  const smoke = new THREE.Mesh(geometry, smokeMaterial);
  smoke.name = "RAF_UI_Smoke";
  smoke.frustumCulled = false;
  smoke.renderOrder = 5;
  smoke.raycast = () => undefined;
  root.add(smoke);

  // --- flammes de tuyère, enfants des munitions (elles suivent le départ)
  const flames: Partial<Record<RafaleScenario, FlameRig>> = {};
  for (const scenario of RAFALE_SCENARIOS) {
    const shot = targets.shots[scenario];
    if (!shot) continue;
    const size = FLAME_SIZE[scenario];
    const rig = createFlame(glowMap, size.length, size.radius);
    // Nez de la munition sur -Z local : la flamme part de la tuyère vers +Z.
    rig.group.rotation.set(Math.PI / 2, 0, 0);
    rig.group.position.set(0, 0, RAFALE_SHOTS[scenario].length / 2);
    shot.add(rig.group);
    flames[scenario] = rig;
  }

  // Lumière d'allumage toujours présente (intensité nulle au repos) : le
  // nombre de lumières reste stable, aucun shader n'est recompilé au tir.
  const flashLight = new THREE.PointLight("#ffb46b", 0, 40, 1.6);
  flashLight.name = "RAF_UI_FlashLight";
  root.add(flashLight);

  const order: number[] = [];
  const depth = new Float32Array(capacity);
  const scratch = new THREE.Vector3();
  const cameraPosition = new THREE.Vector3();
  const flamePosition = new THREE.Vector3();
  const samples: SmokeSampleRow[] = [];
  const viewModel = new THREE.Matrix4();

  function hideAll() {
    geometry.instanceCount = 0;
    flashLight.intensity = 0;
    smokeMaterial.uniforms.uFlash.value = 0;
    for (const scenario of RAFALE_SCENARIOS) {
      const flame = flames[scenario];
      if (flame) flame.group.visible = false;
    }
  }

  function update(t: number, scenario: RafaleScenario, camera: THREE.Camera) {
    const rest = targets.rests[scenario];
    if (!(t > 0) || !rest) {
      hideAll();
      return;
    }
    camera.getWorldPosition(cameraPosition);
    root.updateMatrixWorld();

    // Fumées : échantillonnage pur (repère avion), puis tri arrière → avant.
    samples.length = 0;
    particles[scenario].forEach((puff, i) => {
      const sample = samplePuff(puff, scenario, rest, t);
      if (!sample || sample.opacity < 0.003) return;
      samples.push({ i, ...sample });
    });
    camera.updateMatrixWorld();
    viewModel.multiplyMatrices(camera.matrixWorldInverse, root.matrixWorld);
    order.length = 0;
    samples.forEach((sample, index) => {
      scratch.set(sample.x, sample.y, sample.z).applyMatrix4(viewModel);
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

    // Flamme de tuyère et lueur d'allumage
    let flash = 0;
    for (const candidate of RAFALE_SCENARIOS) {
      const flame = flames[candidate];
      if (!flame) continue;
      if (candidate !== scenario) {
        flame.group.visible = false;
        continue;
      }
      const state = shotState(scenario, t);
      flame.group.visible = state.flame > 0.01;
      if (!flame.group.visible) continue;
      const flicker = flameFlicker(t, 3);
      flame.cone.material.uniforms.uIntensity.value = state.flame;
      flame.cone.scale.set(1, flicker, 1);
      // Au loin, la lueur garde une taille apparente minimale : on voit
      // encore où se trouve la munition quand elle n'est plus qu'un point.
      flame.glow.getWorldPosition(flamePosition);
      const distance = flamePosition.distanceTo(cameraPosition);
      flame.glow.scale.setScalar(Math.max(0.9 + 0.7 * flicker, distance * 0.018 * flicker));
      flame.glow.material.opacity = 0.9 * state.flame;
      const tau = t - RAFALE_SHOTS[scenario].ignitionS;
      flash = tau >= 0 ? Math.min(1, tau / 0.04) * Math.exp(-Math.max(0, tau - 0.04) / 0.35) : 0;
      flame.glow.getWorldPosition(flamePosition);
      root.worldToLocal(flamePosition);
      flashLight.position.copy(flamePosition);
      (smokeMaterial.uniforms.uFlashPos.value as THREE.Vector3).copy(flamePosition);
    }
    flashLight.intensity = flash * 160;
    smokeMaterial.uniforms.uFlash.value = flash;
  }

  return {
    root,
    flashLight,
    update,
    dispose: () => {
      for (const scenario of RAFALE_SCENARIOS) {
        const flame = flames[scenario];
        if (!flame) continue;
        flame.group.parent?.remove(flame.group);
        flame.cone.geometry.dispose();
        flame.cone.material.dispose();
        flame.glow.material.dispose();
      }
      base.dispose();
      geometry.dispose();
      smokeMaterial.dispose();
      puffMap.dispose();
      glowMap.dispose();
      root.parent?.remove(root);
    },
  };
}
