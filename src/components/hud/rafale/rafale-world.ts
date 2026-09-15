import * as THREE from "three";
import type { RafaleBiome } from "@/data/hud/rafale";
import { mulberry32 } from "@/data/hud/rafale-launch";
import { puffTexture } from "./rafale-effects";

/**
 * Environnement de vol : dôme de ciel, surface (mer ou désert) et couche de
 * nuages. Repère MONDE (horizon toujours horizontal) ; l'avion reste à
 * l'origine et c'est le décor qui recule pendant les transitions. Au repos,
 * rien ne bouge. Tout est généré localement : aucune texture téléchargée.
 *
 * La surface n'a pas de maillage : le dôme la calcule par pixel, en coupant
 * le rayon de vue avec le plan y = -altitude. Elle s'étend donc jusqu'à
 * l'horizon, sans bord, et la brume de distance la fond exactement dans le
 * ciel à l'horizon.
 */

/** Réglages d'un décor (couleurs d'affichage, converties à la création). */
export type RafaleBiomeLook = {
  zenith: string;
  horizon: string;
  sun: string;
  /** Éclairement solaire relatif (reflet sur la mer, versants au soleil). */
  sunPower: number;
  /** Mer : eau profonde ; désert : sable des creux et versants. */
  surfaceLow: string;
  /** Mer : diffusion sous la surface ; désert : sable des crêtes. */
  surfaceHigh: string;
  /** Mer : écume ; désert : reg (plaines caillouteuses entre les cordons). */
  surfaceAccent: string;
  /** Distance (m) à laquelle la brume couvre 63 % de la surface. */
  hazeDistance: number;
  cloudLit: string;
  cloudShade: string;
  /** Facteur d'opacité des nuages (1 = graine brute). */
  cloudOpacity: number;
  /** Brume de la scène (nuages, fumée lointaine). */
  fogNear: number;
  fogFar: number;
  /** Lumière renvoyée par la surface vers l'avion (hémisphère, reflets). */
  ground: string;
  groundIntensity: number;
};

export const RAFALE_BIOMES: Record<RafaleBiome, RafaleBiomeLook> = {
  // Mer : fin d'après-midi, brume marine claire, soleil bas en avant à gauche.
  sea: {
    zenith: "#245a96",
    horizon: "#aec2d1",
    sun: "#fff0da",
    sunPower: 2.4,
    surfaceLow: "#03192a",
    surfaceHigh: "#0f5577",
    surfaceAccent: "#dfe7ea",
    hazeDistance: 42000,
    cloudLit: "#f5f3ee",
    cloudShade: "#8f9ca8",
    cloudOpacity: 1.1,
    fogNear: 1200,
    fogFar: 22000,
    ground: "#1d3542",
    groundIntensity: 0.55,
  },
  // Désert : erg de dunes transverses, air sec et poussiéreux.
  desert: {
    zenith: "#3a6c9d",
    horizon: "#d6c6a6",
    sun: "#fff0d8",
    sunPower: 2.1,
    surfaceLow: "#94623c",
    surfaceHigh: "#dcae7a",
    surfaceAccent: "#7a5f4a",
    hazeDistance: 9500,
    cloudLit: "#f2e9da",
    cloudShade: "#a99880",
    cloudOpacity: 0.6,
    fogNear: 500,
    fogFar: 10000,
    ground: "#8a6a46",
    groundIntensity: 0.95,
  },
};

/** Direction du soleil (bas sur l'horizon, en avant à gauche). */
export const RAFALE_SUN_DIRECTION = new THREE.Vector3(-0.55, 0.26, -0.79).normalize();

const SKY_VERTEX = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const SKY_FRAGMENT = /* glsl */ `
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uSun;
  uniform vec3 uSunDir;
  uniform float uSunPower;
  uniform float uBiome;
  uniform float uAltitude;
  uniform float uScroll;
  uniform float uHazeDistance;
  uniform vec3 uSurfaceLow;
  uniform vec3 uSurfaceHigh;
  uniform vec3 uSurfaceAccent;
  varying vec3 vWorld;

  #ifdef LITE
    #define SEA_OCTAVES 3
  #else
    #define SEA_OCTAVES 7
  #endif

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float noise(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
               mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  // Bruit de valeur et ses dérivées analytiques (valeur, d/dx, d/dy).
  vec3 noised(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);
    vec2 u = f * f * (3.0 - 2.0 * f);
    vec2 du = 6.0 * f * (1.0 - f);
    float a = hash12(i);
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));
    float k = a - b - c + d;
    return vec3(a + (b - a) * u.x + (c - a) * u.y + k * u.x * u.y,
                du * (vec2(b - a, c - a) + k * u.yx));
  }

  vec3 skyColor(vec3 d) {
    // Bande claire serrée sur l'horizon, bleu franc dès quelques degrés.
    float h = clamp(d.y, 0.0, 1.0);
    vec3 col = mix(uHorizon, uZenith, 1.0 - exp(-h * 7.0));
    // Halo de diffusion autour du soleil : il réchauffe aussi la brume
    // d'horizon de ce côté, donc la mer ou le sable au loin.
    float s = max(dot(d, uSunDir), 0.0);
    col += uSun * (pow(s, 24.0) * 0.42 + pow(s, 4.0) * 0.1);
    return col;
  }

  // --- mer ----------------------------------------------------------------

  // Pente de la houle (dh/dx, dh/dz) et, en z, la variance des vagues trop
  // fines pour le pixel : elle passe dans la rugosité du reflet solaire.
  vec3 seaSlope(vec2 p, float footprint) {
    vec2 slope = vec2(0.0);
    float filtered = 0.0;
    float wavelength = 140.0;
    float steepness = 0.1;
    for (int i = 0; i < SEA_OCTAVES; i++) {
      float angle = 0.45 + 0.5 * sin(float(i) * 2.4);
      float c = cos(angle);
      float s = sin(angle);
      mat2 m = mat2(c, s, -s, c);
      vec2 q = (m * p) / wavelength;
      q.y *= 0.5; // crêtes allongées, perpendiculaires au vent
      vec3 n = noised(q + float(i) * 13.7);
      float lod = 1.0 - smoothstep(0.12, 0.45, footprint / wavelength);
      slope += steepness * lod * (transpose(m) * vec2(n.y, n.z * 0.5));
      filtered += steepness * steepness * 0.2 * (1.0 - lod);
      wavelength *= 0.52;
      steepness *= 0.92;
    }
    return vec3(slope, filtered);
  }

  vec3 shadeSea(vec3 d, vec2 p, float footprint) {
    vec3 sl = seaSlope(p, footprint);
    // Risées : la rugosité varie lentement, le reflet du soleil se morcelle.
    float gust = noise(p * 0.00055 + 3.3);
    vec3 n = normalize(vec3(-sl.x, 1.0, -sl.y));
    vec3 v = -d;
    float ndv = max(dot(n, v), 0.02);
    // Fresnel un peu tempéré : au loin, les faces masquées par les crêtes
    // voisines renvoient moins de ciel qu'un miroir parfait.
    float fresnel = 0.02 + 0.8 * pow(1.0 - ndv, 5.0);
    vec3 r = reflect(d, n);
    r.y = max(abs(r.y), 0.06);
    r = normalize(r);
    vec3 body = mix(uSurfaceLow, uSurfaceHigh, 0.25 + 0.35 * gust);
    vec3 col = mix(body, skyColor(r), fresnel);
    // Reflet du soleil : microfacettes (Beckmann).
    float rough = 0.004 + sl.z + gust * gust * 0.012;
    vec3 hv = normalize(uSunDir + v);
    float c2 = max(dot(n, hv), 1e-3);
    c2 *= c2;
    float D = exp(-(1.0 - c2) / (c2 * rough)) / (3.14159 * rough * c2 * c2);
    float fh = 0.02 + 0.98 * pow(1.0 - max(dot(hv, v), 0.0), 5.0);
    float ndl = smoothstep(0.0, 0.06, dot(n, uSunDir));
    // Épaule douce : les facettes restent éblouissantes, mais la traînée
    // lointaine ne sature plus un quart du cadre.
    float glint = 0.18 * uSunPower * D * fh * ndl / (4.0 * max(ndv, 0.1));
    col += uSun * glint / (1.0 + 0.5 * glint);
  #ifndef LITE
    // Moutons : écume clairsemée, remplacée au loin par sa moyenne.
    float foamLod = 1.0 - smoothstep(1.5, 7.0, footprint);
    float f = noise(p / 5.0) * noise(p / 31.0 + 7.1);
    float foam = mix(0.006, smoothstep(0.6, 0.82, f), foamLod) * (0.2 + 0.7 * gust);
    col = mix(col, uSurfaceAccent * (0.55 + 0.2 * uSunPower), foam);
  #endif
    return col;
  }

  // --- désert -------------------------------------------------------------

  const vec2 DUNE_WIND = vec2(0.8, 0.6);
  const float DUNE_WAVELENGTH = 240.0;
  const float DUNE_HEIGHT = 22.0;

  // Profil transverse : versant au vent en pente douce (~8°), face
  // d'avalanche raide (~35°), crête vive entre les deux.
  float duneProfile(float x) {
    float ph = fract(x);
    return ph < 0.8 ? pow(ph / 0.8, 1.3) : pow(1.0 - (ph - 0.8) / 0.2, 1.6);
  }

  // Hauteur (m). « lod » efface les motifs trop fins pour le pixel.
  float duneHeight(vec2 p, vec2 lod) {
    vec2 w = vec2(noise(p * 0.0011), noise(p * 0.0011 + 17.3)) - 0.5;
  #ifndef LITE
    w += (vec2(noise(p * 0.004 + 4.1), noise(p * 0.004 + 9.7)) - 0.5) * 0.3;
  #endif
    vec2 across = vec2(-DUNE_WIND.y, DUNE_WIND.x);
    vec2 q = vec2(dot(p, DUNE_WIND), dot(p, across)) + w * 380.0;
    // Hauteur variable le long des crêtes : cordons qui s'abaissent, se
    // rompent et reprennent (dunes barkhanoïdes).
    float swell = smoothstep(0.28, 0.78, noise(q * vec2(0.0014, 0.0058) + 2.7));
    float amp = DUNE_HEIGHT * (0.08 + 1.2 * swell);
    float h = duneProfile(q.x / DUNE_WAVELENGTH) * amp * lod.x;
  #ifndef LITE
    // Second réseau, plus bas et presque perpendiculaire : il casse la
    // régularité des cordons.
    float q3 = dot(p, vec2(-0.45, 0.89)) + w.y * 520.0;
    h += duneProfile(q3 / 410.0) * 7.0 * lod.x;
    // Petites dunes obliques sur les grands versants.
    float q2 = dot(p, vec2(0.96, -0.28)) + w.x * 160.0;
    h += duneProfile(q2 / 70.0) * 3.5 * lod.y;
  #endif
    // Grands cordons (draa) : ondulation lente de tout l'erg.
    h += noise(p * 0.00032) * 55.0;
    return h;
  }

  vec3 shadeDesert(vec2 p, float footprint) {
    vec2 lod = vec2(
      1.0 - smoothstep(0.18, 0.5, footprint / DUNE_WAVELENGTH),
      1.0 - smoothstep(0.18, 0.5, footprint / 70.0)
    );
    float e = clamp(footprint * 0.75, 1.0, 40.0);
    float h0 = duneHeight(p, lod);
    float hx = duneHeight(p + vec2(e, 0.0), lod);
    float hz = duneHeight(p + vec2(0.0, e), lod);
    vec3 n = normalize(vec3(h0 - hx, e, h0 - hz));

    float shadow = 1.0;
  #ifndef LITE
    // Ombre portée des crêtes : quatre pas vers le soleil (10 à 93 m).
    if (footprint < 30.0) {
      vec2 toSun = normalize(uSunDir.xz);
      float rise = uSunDir.y / length(uSunDir.xz);
      float occlusion = 0.0;
      for (int i = 0; i < 4; i++) {
        float s = 10.0 * pow(2.1, float(i));
        occlusion = max(occlusion, duneHeight(p + toSun * s, lod) - (h0 + s * rise));
      }
      shadow = mix(1.0 - smoothstep(0.0, 4.0, occlusion), 1.0, smoothstep(12.0, 30.0, footprint));
    }
  #endif

    float tone = noise(p * 0.0024) * 0.65 + noise(p * 0.021) * 0.35;
    vec3 albedo = mix(uSurfaceLow, uSurfaceHigh, 0.3 + 0.55 * tone);
    // Reg : plaques caillouteuses plus sombres dans les couloirs entre cordons.
    float reg = smoothstep(0.62, 0.8, noise(p * 0.00075 + 8.8)) * (1.0 - smoothstep(0.3, 0.7, tone));
    albedo = mix(albedo, uSurfaceAccent, reg * 0.7);

    float ndl = max(dot(n, uSunDir), 0.0);
    // Ombres éclairées par le ciel et par le sable voisin : brun chaud,
    // jamais gris.
    vec3 light = uSun * uSunPower * ndl * shadow
      + (uZenith * 0.3 + uHorizon * 0.3) * (0.6 + 0.4 * n.y)
      + uSurfaceHigh * 0.22;
    return albedo * light;
  }

  void main() {
    vec3 d = normalize(vWorld - cameraPosition);
    // Intersection avec la surface, calculée pour tous les pixels (dérivées
    // hors branche) ; au-dessus de l'horizon, elle part au loin et s'efface.
    float height = max(uAltitude + cameraPosition.y, 1.0);
    float t = height / max(-d.y, 0.0015);
    vec2 p = cameraPosition.xz + d.xz * t;
    // Le motif est lu en « monde - recul » : il recule vers +Z (vers la
    // queue), comme les nuages et la fumée, quand le recul cumulé augmente.
    p.y -= uScroll;
    vec2 fw = fwidth(p);
    float footprint = max(fw.x, fw.y);

    vec3 col;
    if (d.y >= 0.0) {
      col = skyColor(d);
      float s = max(dot(d, uSunDir), 0.0);
      col += uSun * (smoothstep(0.99996, 0.99998, s) * 14.0 + pow(s, 900.0) * 1.2);
    } else {
      vec3 surface = uBiome < 0.5 ? shadeSea(d, p, footprint) : shadeDesert(p, footprint);
      // Perspective aérienne : la surface tend vers la couleur du ciel à
      // l'horizon dans le même azimut, ce qui supprime toute arête.
      vec3 haze = skyColor(normalize(vec3(d.x, 0.0, d.z)));
      col = mix(surface, haze, 1.0 - exp(-t / uHazeDistance));
    }
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
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
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec2 vTexUv;
  varying float vOpacity;
  #include <fog_pars_fragment>
  void main() {
    vec4 tex = texture2D(uMap, vTexUv);
    float a = min(tex.a * vOpacity * uOpacity, 0.9);
    if (a < 0.004) discard;
    vec3 col = mix(uShade, uLit, smoothstep(0.0, 1.0, vUv.y) * mix(0.8, 1.0, tex.r));
    gl_FragColor = vec4(col, a);
    #include <fog_fragment>
    #include <colorspace_fragment>
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
  /** Recul cumulé du décor (m) : la surface et les nuages glissent vers +Z. */
  setScroll: (meters: number) => void;
  /** Hauteur de vol figurée (m) : la surface est à -altitude. */
  setAltitude: (meters: number) => void;
  /** Mer ou désert : simple changement d'uniformes, aucune recompilation. */
  setBiome: (biome: RafaleBiome) => void;
  /** Tri des nuages pour la caméra courante (à appeler avant chaque rendu). */
  sortClouds: (camera: THREE.Camera) => void;
  dispose: () => void;
};

/**
 * `lite` : profil de rendu logiciel (SwiftShader, postes sans accélération) —
 * houle à trois octaves sans écume, dunes sans petites dunes ni ombres
 * portées, couche de nuages réduite, pour que les transitions gardent un
 * rythme lisible.
 */
export function createRafaleWorld({
  lite = false,
  biome = "sea",
}: { lite?: boolean; biome?: RafaleBiome } = {}): RafaleWorld {
  const root = new THREE.Group();
  root.name = "RAF_UI_World";

  // --- ciel et surface (un seul dôme). Les couleurs sont converties en
  // linéaire par THREE.Color ; le shader repasse en sRGB à la sortie.
  const skyGeometry = new THREE.SphereGeometry(6000, 48, 24);
  const skyMaterial = new THREE.ShaderMaterial({
    vertexShader: SKY_VERTEX,
    fragmentShader: SKY_FRAGMENT,
    defines: lite ? { LITE: "" } : {},
    uniforms: {
      uZenith: { value: new THREE.Color() },
      uHorizon: { value: new THREE.Color() },
      uSun: { value: new THREE.Color() },
      uSunDir: { value: RAFALE_SUN_DIRECTION.clone() },
      uSunPower: { value: 1 },
      uBiome: { value: 0 },
      uAltitude: { value: 1500 },
      uScroll: { value: 0 },
      uHazeDistance: { value: 10000 },
      uSurfaceLow: { value: new THREE.Color() },
      uSurfaceHigh: { value: new THREE.Color() },
      uSurfaceAccent: { value: new THREE.Color() },
    },
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });
  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  sky.name = "RAF_UI_Sky";
  sky.renderOrder = -10;
  sky.frustumCulled = false;
  sky.raycast = () => undefined;
  root.add(sky);

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
        uLit: { value: new THREE.Color() },
        uShade: { value: new THREE.Color() },
        uOpacity: { value: 1 },
      },
    ]),
    transparent: true,
    depthWrite: false,
    fog: true,
  });
  cloudMaterial.uniforms.uMap.value = cloudMap;
  const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
  clouds.name = "RAF_UI_Clouds";
  clouds.frustumCulled = false;
  clouds.renderOrder = 1;
  clouds.raycast = () => undefined;
  root.add(clouds);

  let scroll = 0;
  let altitude = 1500;
  let currentBiome: RafaleBiome | null = null;
  const positions = seeds.map(() => new THREE.Vector3());
  const depth = new Float32Array(CLOUD_COUNT);
  const order: number[] = [];
  const scratch = new THREE.Vector3();

  function applyBiome(next: RafaleBiome) {
    currentBiome = next;
    const look = RAFALE_BIOMES[next];
    const sky = skyMaterial.uniforms;
    (sky.uZenith.value as THREE.Color).set(look.zenith);
    (sky.uHorizon.value as THREE.Color).set(look.horizon);
    (sky.uSun.value as THREE.Color).set(look.sun);
    (sky.uSurfaceLow.value as THREE.Color).set(look.surfaceLow);
    (sky.uSurfaceHigh.value as THREE.Color).set(look.surfaceHigh);
    (sky.uSurfaceAccent.value as THREE.Color).set(look.surfaceAccent);
    sky.uSunPower.value = look.sunPower;
    sky.uHazeDistance.value = look.hazeDistance;
    sky.uBiome.value = next === "sea" ? 0 : 1;
    const cloud = cloudMaterial.uniforms;
    (cloud.uLit.value as THREE.Color).set(look.cloudLit);
    (cloud.uShade.value as THREE.Color).set(look.cloudShade);
    cloud.uOpacity.value = look.cloudOpacity;
  }

  function layout() {
    skyMaterial.uniforms.uAltitude.value = altitude;
    skyMaterial.uniforms.uScroll.value = scroll;
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

  applyBiome(biome);
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
    setBiome: (next) => {
      if (next !== currentBiome) applyBiome(next);
    },
    sortClouds,
    dispose: () => {
      skyGeometry.dispose();
      skyMaterial.dispose();
      base.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      cloudMap.dispose();
      root.parent?.remove(root);
    },
  };
}
