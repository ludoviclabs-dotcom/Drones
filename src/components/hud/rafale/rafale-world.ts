import * as THREE from "three";
import { mulberry32 } from "@/data/hud/rafale-launch";
import { puffTexture } from "./rafale-effects";

/**
 * Environnement de vol : dôme de ciel, terrain procédural à grille technique,
 * couche de nuages. Repère MONDE (horizon toujours horizontal) ; l'avion reste
 * à l'origine et c'est le décor qui recule pendant les transitions. Au repos,
 * rien ne bouge. Tout est généré localement : aucune texture téléchargée.
 */

/** Palette du décor (valeurs d'affichage, comme les shaders Patriot). */
export const RAFALE_WORLD_PALETTE = {
  zenith: "#0f1419",
  horizon: "#4a4b44",
  sun: "#ffc98a",
  fog: "#3c3d37",
  terrainLow: "#1b1c17",
  terrainHigh: "#2e2d25",
  grid: "#5a5337",
} as const;

/** Direction du soleil (bas sur l'horizon, en avant à gauche). */
export const RAFALE_SUN_DIRECTION = new THREE.Vector3(-0.55, 0.26, -0.79).normalize();

const SKY_VERTEX = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const SKY_FRAGMENT = /* glsl */ `
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uGround;
  uniform vec3 uSun;
  uniform vec3 uSunDir;
  varying vec3 vDir;
  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    // Sous l'horizon, le dôme prend la couleur de la brume : le bord du
    // terrain, entièrement embrumé, s'y fond sans arête visible.
    vec3 col = h > 0.0
      ? mix(uHorizon, uZenith, pow(clamp(h, 0.0, 1.0), 0.55))
      : mix(uHorizon, uGround, smoothstep(0.0, 0.05, -h));
    float sun = max(dot(d, uSunDir), 0.0);
    float aboveHorizon = smoothstep(-0.05, 0.03, h);
    col += uSun * aboveHorizon *
      (pow(sun, 900.0) * 1.6 + pow(sun, 18.0) * 0.22 + pow(sun, 3.0) * 0.06);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const TERRAIN_VERTEX = /* glsl */ `
  varying vec2 vWorld;
  #include <fog_pars_vertex>
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xz;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const TERRAIN_FRAGMENT = /* glsl */ `
  uniform float uScroll;
  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform vec3 uGrid;
  uniform vec3 uSunTint;
  varying vec2 vWorld;
  #include <fog_pars_fragment>
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }
  float gridLine(vec2 p, float cell) {
    vec2 g = abs(fract(p / cell - 0.5) - 0.5) / fwidth(p / cell);
    return 1.0 - clamp(min(g.x, g.y), 0.0, 1.0);
  }
  void main() {
    vec2 p = vWorld - vec2(0.0, uScroll);
  #ifdef LITE
    // Rendu logiciel : une seule couche de bruit, ni champs ni versants.
    float relief = noise(p * 0.0022);
    vec3 col = mix(uLow, uHigh, smoothstep(0.25, 0.8, relief));
  #else
    float relief = fbm(p * 0.0011);
    float fields = fbm(p * 0.006 + 7.3);
    vec3 col = mix(uLow, uHigh, smoothstep(0.32, 0.78, relief));
    col *= mix(0.86, 1.08, fields);
    // Versants tournés vers le soleil, suggérés par la pente du relief.
    float dx = fbm((p + vec2(24.0, 0.0)) * 0.0011) - relief;
    col += uSunTint * clamp(-dx * 9.0, 0.0, 1.0) * 0.08;
  #endif
    float grid = gridLine(p, 400.0) * 0.55 + gridLine(p, 100.0) * 0.18;
    col = mix(col, uGrid, grid * 0.5);
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`;

const CLOUD_VERTEX = /* glsl */ `
  attribute vec3 iOffset;
  attribute float iSize;
  attribute float iOpacity;
  attribute float iRot;
  varying vec2 vUv;
  varying vec2 vTexUv;
  varying float vOpacity;
  #include <fog_pars_vertex>
  void main() {
    vUv = uv;
    float c = cos(iRot);
    float s = sin(iRot);
    vec2 q = uv - 0.5;
    vTexUv = vec2(c * q.x - s * q.y, s * q.x + c * q.y) + 0.5;
    vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    vec3 world = iOffset + (right * position.x + up * position.y * 0.38) * iSize * 2.0;
    vec4 mvPosition = viewMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vOpacity = iOpacity;
    #include <fog_vertex>
  }
`;

const CLOUD_FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uLit;
  uniform vec3 uShade;
  varying vec2 vUv;
  varying vec2 vTexUv;
  varying float vOpacity;
  #include <fog_pars_fragment>
  void main() {
    vec4 tex = texture2D(uMap, vTexUv);
    float a = tex.a * vOpacity;
    if (a < 0.004) discard;
    vec3 col = mix(uShade, uLit, smoothstep(0.0, 1.0, vUv.y) * mix(0.8, 1.0, tex.r));
    gl_FragColor = vec4(col, a);
    #include <fog_fragment>
  }
`;

type CloudSeed = { x: number; z: number; dy: number; size: number; opacity: number; rot: number };

const CLOUD_COUNT = 72;
/** Nuages conservés en rendu logiciel (les premiers de la liste à graine). */
const LITE_CLOUD_COUNT = 18;
/** Demi-étendue (m) de la bande de nuages le long de l'axe de vol. */
const CLOUD_SPAN = 2400;

function createCloudSeeds(): CloudSeed[] {
  const rand = mulberry32(4242);
  return Array.from({ length: CLOUD_COUNT }, () => ({
    x: (rand() - 0.5) * 3600,
    z: (rand() - 0.5) * CLOUD_SPAN * 2,
    dy: (rand() - 0.5) * 90,
    size: 150 + rand() * 260,
    opacity: 0.07 + rand() * 0.11,
    rot: rand() * Math.PI * 2,
  }));
}

export type RafaleWorld = {
  readonly root: THREE.Group;
  /** Recul cumulé du décor (m) : le terrain et les nuages glissent vers +Z. */
  setScroll: (meters: number) => void;
  /** Hauteur de vol figurée (m) : le terrain est à -altitude. */
  setAltitude: (meters: number) => void;
  /** Tri des nuages pour la caméra courante (à appeler avant chaque rendu). */
  sortClouds: (camera: THREE.Camera) => void;
  dispose: () => void;
};

/**
 * `lite` : profil de rendu logiciel (SwiftShader, postes sans accélération) —
 * terrain à une seule couche de bruit et couche de nuages réduite, pour que
 * les transitions gardent un rythme lisible.
 */
export function createRafaleWorld({ lite = false }: { lite?: boolean } = {}): RafaleWorld {
  const palette = RAFALE_WORLD_PALETTE;
  const root = new THREE.Group();
  root.name = "RAF_UI_World";

  // --- ciel
  const skyGeometry = new THREE.SphereGeometry(6000, 48, 24);
  const skyMaterial = new THREE.ShaderMaterial({
    vertexShader: SKY_VERTEX,
    fragmentShader: SKY_FRAGMENT,
    uniforms: {
      uZenith: { value: new THREE.Color(palette.zenith) },
      uHorizon: { value: new THREE.Color(palette.horizon) },
      uGround: { value: new THREE.Color(palette.fog) },
      uSun: { value: new THREE.Color(palette.sun) },
      uSunDir: { value: RAFALE_SUN_DIRECTION.clone() },
    },
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });
  // Couleurs d'affichage écrites telles quelles (pas de conversion d'espace).
  for (const key of ["uZenith", "uHorizon", "uGround", "uSun"]) {
    (skyMaterial.uniforms[key].value as THREE.Color).convertLinearToSRGB();
  }
  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  sky.name = "RAF_UI_Sky";
  sky.renderOrder = -10;
  sky.frustumCulled = false;
  sky.raycast = () => undefined;
  root.add(sky);

  // --- terrain
  const terrainGeometry = new THREE.PlaneGeometry(14000, 14000, 1, 1);
  const terrainMaterial = new THREE.ShaderMaterial({
    vertexShader: TERRAIN_VERTEX,
    fragmentShader: TERRAIN_FRAGMENT,
    defines: lite ? { LITE: "" } : {},
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uScroll: { value: 0 },
        uLow: { value: new THREE.Color(palette.terrainLow) },
        uHigh: { value: new THREE.Color(palette.terrainHigh) },
        uGrid: { value: new THREE.Color(palette.grid) },
        uSunTint: { value: new THREE.Color(palette.sun) },
      },
    ]),
    fog: true,
  });
  for (const key of ["uLow", "uHigh", "uGrid", "uSunTint"]) {
    (terrainMaterial.uniforms[key].value as THREE.Color).convertLinearToSRGB();
  }
  const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
  terrain.name = "RAF_UI_Terrain";
  terrain.rotation.x = -Math.PI / 2;
  terrain.raycast = () => undefined;
  root.add(terrain);

  // --- nuages : billboards instanciés, triés d'arrière en avant
  const seeds = createCloudSeeds();
  const cloudMap = puffTexture(71);
  const base = new THREE.PlaneGeometry(1, 1);
  const cloudGeometry = new THREE.InstancedBufferGeometry();
  cloudGeometry.index = base.index;
  cloudGeometry.setAttribute("position", base.getAttribute("position"));
  cloudGeometry.setAttribute("uv", base.getAttribute("uv"));
  const offsets = new Float32Array(CLOUD_COUNT * 3);
  const sizes = new Float32Array(CLOUD_COUNT);
  const opacities = new Float32Array(CLOUD_COUNT);
  const rotations = new Float32Array(CLOUD_COUNT);
  const attr = (array: Float32Array, size: number) =>
    new THREE.InstancedBufferAttribute(array, size).setUsage(THREE.DynamicDrawUsage);
  cloudGeometry.setAttribute("iOffset", attr(offsets, 3));
  cloudGeometry.setAttribute("iSize", attr(sizes, 1));
  cloudGeometry.setAttribute("iOpacity", attr(opacities, 1));
  cloudGeometry.setAttribute("iRot", attr(rotations, 1));
  const cloudCount = lite ? LITE_CLOUD_COUNT : CLOUD_COUNT;
  cloudGeometry.instanceCount = cloudCount;
  const cloudMaterial = new THREE.ShaderMaterial({
    vertexShader: CLOUD_VERTEX,
    fragmentShader: CLOUD_FRAGMENT,
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uMap: { value: cloudMap },
        uLit: { value: new THREE.Color("#a9a79c") },
        uShade: { value: new THREE.Color("#5d5e59") },
      },
    ]),
    transparent: true,
    depthWrite: false,
    fog: true,
  });
  cloudMaterial.uniforms.uMap.value = cloudMap;
  for (const key of ["uLit", "uShade"]) {
    (cloudMaterial.uniforms[key].value as THREE.Color).convertLinearToSRGB();
  }
  const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
  clouds.name = "RAF_UI_Clouds";
  clouds.frustumCulled = false;
  clouds.renderOrder = 1;
  clouds.raycast = () => undefined;
  root.add(clouds);

  let scroll = 0;
  let altitude = 1500;
  const positions = seeds.map(() => new THREE.Vector3());
  const depth = new Float32Array(CLOUD_COUNT);
  const order: number[] = [];
  const scratch = new THREE.Vector3();

  function layout() {
    terrain.position.y = -altitude;
    // Le motif est lu en `vWorld - uScroll` : il recule vers +Z (vers la
    // queue), comme les nuages et la fumée, quand le recul cumulé augmente.
    terrainMaterial.uniforms.uScroll.value = scroll;
    const layer = -altitude * 0.52;
    seeds.forEach((seed, i) => {
      // Bande bouclée : un nuage sorti à l'arrière revient à l'avant.
      const span = CLOUD_SPAN * 2;
      const z = ((((seed.z + scroll + CLOUD_SPAN) % span) + span) % span) - CLOUD_SPAN;
      positions[i].set(seed.x, layer + seed.dy, z);
    });
  }

  function sortClouds(camera: THREE.Camera) {
    camera.updateMatrixWorld();
    const view = camera.matrixWorldInverse;
    order.length = 0;
    for (let index = 0; index < cloudCount; index += 1) {
      scratch.copy(positions[index]).applyMatrix4(view);
      depth[index] = scratch.z;
      order.push(index);
    }
    order.sort((a, b) => depth[a] - depth[b]);
    order.forEach((index, k) => {
      const seed = seeds[index];
      offsets[k * 3] = positions[index].x;
      offsets[k * 3 + 1] = positions[index].y;
      offsets[k * 3 + 2] = positions[index].z;
      sizes[k] = seed.size;
      // Les nuages proches de la caméra s'effacent : jamais de voile plein cadre.
      const distance = -depth[index];
      opacities[k] = seed.opacity * THREE.MathUtils.smoothstep(distance, 60, 260);
      rotations[k] = seed.rot;
    });
    for (const name of ["iOffset", "iSize", "iOpacity", "iRot"]) {
      (cloudGeometry.getAttribute(name) as THREE.InstancedBufferAttribute).needsUpdate = true;
    }
  }

  layout();

  return {
    root,
    setScroll: (meters) => {
      if (meters === scroll) return;
      scroll = meters;
      layout();
    },
    setAltitude: (meters) => {
      if (meters === altitude) return;
      altitude = meters;
      layout();
    },
    sortClouds,
    dispose: () => {
      skyGeometry.dispose();
      skyMaterial.dispose();
      terrainGeometry.dispose();
      terrainMaterial.dispose();
      base.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      cloudMap.dispose();
      root.parent?.remove(root);
    },
  };
}
