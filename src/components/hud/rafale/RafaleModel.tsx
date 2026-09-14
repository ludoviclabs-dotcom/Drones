"use client";

// React Compiler can mis-optimize R3F object graphs; keep this boundary explicit.
"use no memo";

import { useCallback, useEffect, useMemo, useRef, type RefObject } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import {
  RAFALE_ASSET_MANIFEST,
  RAFALE_ASSET_PATH,
  RAFALE_SCENARIOS,
  loadoutForScenario,
  type RafaleScenario,
  type RafaleSequenceState,
} from "@/data/hud/rafale";
import {
  RAFALE_AIRFLOW,
  shotCenter,
  shotState,
  type Vec3,
} from "@/data/hud/rafale-launch";
import {
  buildRafaleMotionPlan,
  framingScaleForAspect,
  isInstantPlan,
  rafalePoseForState,
  sampleRafaleMotion,
  type RafaleMotionPlan,
  type RafaleMotionPose,
  type RafaleMotionSample,
} from "@/data/hud/rafale-motion";
import {
  rafaleInspectionIdForNodeName,
  type RafaleInspectableId,
} from "@/data/hud/rafale-inspection";
import { createRafaleEffects, type RafaleEffects } from "./rafale-effects";
import { createRafaleSensors, type RafaleSensors } from "./rafale-sensors";

const INSPECTION_ACCENT = new THREE.Color("#e07a4d");
const DEFAULT_TARGET = new THREE.Vector3(0, 0.2, -0.5);
/** Au-delà de cette avance (m), la cible caméra cesse de suivre la munition. */
const TRACK_TRAVEL_LIMIT = 60;
/** Braquage des gouvernes en virage (°) : plans canard cabrés, élevons levés. */
const CANARD_PULL_DEG = 5;
const ELEVON_PULL_DEG = 8;
/**
 * Pas de temps maximal par frame (ms). Même piège qu'en Thundart et Patriot :
 * en `frameloop="demand"`, la première frame relancée porterait sinon toute
 * la durée d'inactivité. Le profil de rendu logiciel passe un plafond plus
 * haut (voir render-profile.ts).
 */
const MAX_FRAME_STEP_MS = 64;

function now(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

type InspectableMaterialRecord = {
  componentId: RafaleInspectableId | null;
  material: THREE.MeshStandardMaterial;
  color: THREE.Color;
  emissive: THREE.Color;
  emissiveIntensity: number;
};

/**
 * Sous-ensemble désigné par un objet touché. Un objet masqué — emport de
 * l'autre configuration — ne désigne rien : ni three.js ni R3F ne filtrent
 * `visible` au lancer de rayon, et il masquerait la voilure visible derrière.
 */
function inspectionIdForObject(
  object: THREE.Object3D,
  root: THREE.Object3D,
): RafaleInspectableId | null {
  let id: RafaleInspectableId | null = null;
  let current: THREE.Object3D | null = object;
  while (current) {
    if (!current.visible) return null;
    id ??= rafaleInspectionIdForNodeName(current.name);
    if (current === root) return id;
    current = current.parent;
  }
  return id;
}

function isShown(object: THREE.Object3D): boolean {
  for (let current: THREE.Object3D | null = object; current; current = current.parent) {
    if (!current.visible) return false;
  }
  return true;
}

/**
 * Filtre des intersections R3F : un objet masqué est retiré AVANT la
 * distribution. R3F réserve le survol par objet porteur des gestionnaires
 * (ici le groupe de vol) ; un emport masqué touché en premier priverait sinon
 * la pièce visible derrière lui de son `pointerover`.
 */
function visibleHits(items: THREE.Intersection[]): THREE.Intersection[] {
  return items.filter((hit) => isShown(hit.object));
}

function applyInspectionStyle(
  records: readonly InspectableMaterialRecord[],
  activeId: RafaleInspectableId | null,
  pinned: boolean,
) {
  for (const record of records) {
    const { material } = record;
    material.color.copy(record.color);
    material.emissive.copy(record.emissive);
    material.emissiveIntensity = record.emissiveIntensity;
    if (!activeId) continue;
    if (record.componentId === activeId) {
      material.color.lerp(INSPECTION_ACCENT, pinned ? 0.28 : 0.16);
      material.emissive.copy(INSPECTION_ACCENT);
      material.emissiveIntensity = pinned ? 0.42 : 0.24;
    } else {
      // Atténuation colorimétrique seulement : rien ne disparaît.
      material.color.multiplyScalar(0.62);
      material.emissiveIntensity = 0;
    }
  }
}

type OrbitLikeControls = { target: THREE.Vector3; update: () => unknown };

function asOrbitControls(value: unknown): OrbitLikeControls | null {
  return value && typeof value === "object" && "target" in value
    ? (value as OrbitLikeControls)
    : null;
}

type SurfaceRest = { node: THREE.Object3D; rest: number };

/** Couche impérative : construite dans un effet, gardée dans une ref. */
type RafaleRuntime = {
  shots: Partial<Record<RafaleScenario, THREE.Object3D>>;
  rests: Partial<Record<RafaleScenario, Vec3>>;
  loadout: { air: THREE.Object3D[]; sead: THREE.Object3D[] };
  canards: SurfaceRest[];
  elevons: SurfaceRest[];
  effects: RafaleEffects;
  sensors: RafaleSensors;
};

function createRuntime(model: THREE.Object3D, flight: THREE.Object3D): RafaleRuntime {
  const manifest = RAFALE_ASSET_MANIFEST;
  const shots: RafaleRuntime["shots"] = {};
  const rests: RafaleRuntime["rests"] = {};
  for (const scenario of RAFALE_SCENARIOS) {
    const node = model.getObjectByName(manifest.shotNodes[scenario]);
    if (!node) continue;
    shots[scenario] = node;
    rests[scenario] = [node.position.x, node.position.y, node.position.z];
  }
  const pick = (names: readonly string[]) =>
    names.map((name) => model.getObjectByName(name)).filter((node): node is THREE.Object3D => Boolean(node));
  const surface = (names: readonly string[]) =>
    pick(names).map((node) => ({ node, rest: node.rotation.x }));
  const effects = createRafaleEffects({ shots, rests });
  const sensors = createRafaleSensors();
  flight.add(effects.root, sensors.root);
  return {
    shots,
    rests,
    loadout: { air: pick(manifest.loadoutNodes.air), sead: pick(manifest.loadoutNodes.sead) },
    canards: surface(Object.values(manifest.canardNodes)),
    elevons: surface(Object.values(manifest.elevonNodes)),
    effects,
    sensors,
  };
}

/** Ombres portées : jamais sur la verrière (transparente). */
function applyShadowFlags(meshes: readonly THREE.Mesh[], enabled: boolean) {
  for (const mesh of meshes) {
    const glass = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).some(
      (material) => material.transparent,
    );
    mesh.castShadow = enabled && !glass;
    mesh.receiveShadow = enabled;
  }
}

/**
 * Pose la couche impérative pour un échantillon : configuration d'emport,
 * braquage des gouvernes, munition du scénario le long de sa chronologie.
 */
function poseRuntime(
  runtime: RafaleRuntime,
  flight: THREE.Object3D,
  sample: RafaleMotionSample,
  scenario: RafaleScenario,
) {
  flight.rotation.set(0, 0, -THREE.MathUtils.degToRad(sample.bank));
  const loadout = loadoutForScenario(scenario);
  for (const node of runtime.loadout.air) node.visible = loadout === "air";
  for (const node of runtime.loadout.sead) node.visible = loadout === "sead";
  const pull = Math.min(1, Math.abs(sample.bank) / 55);
  for (const { node, rest } of runtime.canards) {
    node.rotation.x = rest + THREE.MathUtils.degToRad(CANARD_PULL_DEG) * pull;
  }
  for (const { node, rest } of runtime.elevons) {
    node.rotation.x = rest - THREE.MathUtils.degToRad(ELEVON_PULL_DEG) * pull;
  }
  for (const candidate of RAFALE_SCENARIOS) {
    const node = runtime.shots[candidate];
    const rest = runtime.rests[candidate];
    if (!node || !rest) continue;
    if (candidate === scenario && sample.launch > 0) {
      const state = shotState(candidate, sample.launch);
      node.position.set(rest[0] + state.offset[0], rest[1] + state.offset[1], rest[2] + state.offset[2]);
      node.rotation.set(state.pitch, 0, 0);
    } else {
      node.position.set(rest[0], rest[1], rest[2]);
      node.rotation.set(0, 0, 0);
    }
  }
}

function disposeRuntime(runtime: RafaleRuntime) {
  runtime.effects.dispose();
  runtime.sensors.dispose();
  for (const scenario of RAFALE_SCENARIOS) {
    const node = runtime.shots[scenario];
    const rest = runtime.rests[scenario];
    if (node && rest) {
      node.position.set(rest[0], rest[1], rest[2]);
      node.rotation.set(0, 0, 0);
    }
  }
  for (const { node, rest } of [...runtime.canards, ...runtime.elevons]) node.rotation.x = rest;
  for (const node of [...runtime.loadout.air, ...runtime.loadout.sead]) node.visible = true;
}

export function RafaleModel({
  sequenceState,
  scenario,
  reducedMotion,
  activeInspectionId,
  selectedInspectionId,
  scrollRef,
  castShadows,
  onReady,
  onTransitionChange,
  onInspectionPreview,
  onInspectionToggle,
  maxFrameStepMs = MAX_FRAME_STEP_MS,
}: {
  sequenceState: RafaleSequenceState;
  scenario: RafaleScenario;
  reducedMotion: boolean;
  activeInspectionId: RafaleInspectableId | null;
  selectedInspectionId: RafaleInspectableId | null;
  /** Recul cumulé du décor (m), lu par la couche de décor à chaque rendu. */
  scrollRef: RefObject<number>;
  castShadows: boolean;
  onReady: () => void;
  onTransitionChange: (running: boolean) => void;
  onInspectionPreview: (id: RafaleInspectableId | null) => void;
  onInspectionToggle: (id: RafaleInspectableId) => void;
  maxFrameStepMs?: number;
}) {
  // Draco désactivé (son décodeur drei vient d'un CDN) ; meshopt activé : son
  // décodeur WebAssembly est embarqué par three-stdlib, aucune requête réseau.
  const { scene } = useGLTF(RAFALE_ASSET_PATH, false, true);

  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => asOrbitControls(state.controls));
  const invalidate = useThree((state) => state.invalidate);
  // Largeur et hauteur seulement : R3F renouvelle `size` (top/left) à chaque
  // défilement de la page, ce qui recadrerait la vue sous l'orbite de
  // l'utilisateur (correctif repris de Thundart).
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const gl = useThree((state) => state.gl);
  const setEvents = useThree((state) => state.setEvents);

  useEffect(() => {
    setEvents({ filter: visibleHits });
    return () => setEvents({ filter: undefined });
  }, [setEvents]);

  const preparedModel = useMemo(() => {
    const model = scene.clone(true);
    // Groupe de vol : porte l'inclinaison ; l'ordre YXZ applique le roulis
    // d'abord, comme sur un avion.
    const flight = new THREE.Group();
    flight.name = "RAF_UI_Flight";
    flight.rotation.order = "YXZ";
    flight.add(model);
    // Matériaux clonés par mesh : le cache `useGLTF` n'est jamais muté.
    const meshes: THREE.Mesh[] = [];
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const cloned = (Array.isArray(child.material) ? child.material : [child.material]).map(
        (material) => material.clone(),
      );
      child.material = Array.isArray(child.material) ? cloned : cloned[0];
      meshes.push(child);
    });
    const materials: InspectableMaterialRecord[] = [];
    for (const mesh of meshes) {
      const componentId = inspectionIdForObject(mesh, model);
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of list) {
        if (!(material instanceof THREE.MeshStandardMaterial)) continue;
        // Verrière et visière : reflets plus présents, la glace reste lisible.
        if (material.name === "RAF_MAT_Glass") {
          material.envMapIntensity = 1.6;
          material.depthWrite = false;
        }
        materials.push({
          componentId,
          material,
          color: material.color.clone(),
          emissive: material.emissive.clone(),
          emissiveIntensity: material.emissiveIntensity,
        });
      }
    }
    return { model, flight, meshes, materials };
  }, [scene]);
  const { model, flight } = preparedModel;

  useEffect(() => {
    applyShadowFlags(preparedModel.meshes, castShadows);
    invalidate();
  }, [castShadows, invalidate, preparedModel.meshes]);

  const runtimeRef = useRef<RafaleRuntime | null>(null);
  const planRef = useRef<RafaleMotionPlan | null>(null);
  const elapsedRef = useRef(0);
  const lastFrameAtRef = useRef(0);
  const poseRef = useRef({ bank: 0, sensors: 0, launch: 0 });
  const posedStateRef = useRef<RafaleSequenceState | null>(null);
  const lastSampleRef = useRef<RafaleMotionSample | null>(null);
  const framingScaleRef = useRef(1);
  const scenarioRef = useRef<RafaleScenario>(scenario);
  const inspectionMaterialsRef = useRef<InspectableMaterialRecord[]>([]);
  const inspectionVisualRef = useRef({
    activeId: null as RafaleInspectableId | null,
    pinned: false,
  });
  const orbitGestureRef = useRef({
    pointerId: null as number | null,
    startX: 0,
    startY: 0,
    dragging: false,
    suppressClick: false,
  });

  useEffect(() => {
    inspectionMaterialsRef.current = preparedModel.materials;
    return () => {
      for (const record of inspectionMaterialsRef.current) record.material.dispose();
      inspectionMaterialsRef.current = [];
    };
  }, [preparedModel.materials]);

  const restyleInspection = useCallback(() => {
    const { activeId, pinned } = inspectionVisualRef.current;
    applyInspectionStyle(inspectionMaterialsRef.current, activeId, pinned);
  }, []);

  useEffect(() => {
    inspectionVisualRef.current = {
      activeId: activeInspectionId,
      pinned: selectedInspectionId === activeInspectionId,
    };
    restyleInspection();
    invalidate();
  }, [activeInspectionId, invalidate, restyleInspection, selectedInspectionId]);

  useEffect(() => {
    framingScaleRef.current = framingScaleForAspect(height > 0 ? width / height : 1);
  }, [width, height]);

  useEffect(() => {
    const runtime = createRuntime(model, flight);
    runtimeRef.current = runtime;
    return () => {
      runtimeRef.current = null;
      disposeRuntime(runtime);
    };
  }, [model, flight]);

  // Gestes orbitaux : un vrai glisser n'ouvre ni n'épingle aucun sous-ensemble.
  useEffect(() => {
    const element = gl.domElement;
    const begin = (event: PointerEvent) => {
      orbitGestureRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        dragging: false,
        suppressClick: false,
      };
    };
    const move = (event: PointerEvent) => {
      const gesture = orbitGestureRef.current;
      if (gesture.pointerId !== event.pointerId || gesture.dragging) return;
      if (Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) < 6) return;
      gesture.dragging = true;
      gesture.suppressClick = true;
      onInspectionPreview(null);
    };
    const finish = (event: PointerEvent) => {
      const gesture = orbitGestureRef.current;
      if (gesture.pointerId !== event.pointerId) return;
      gesture.pointerId = null;
      gesture.dragging = false;
    };
    element.addEventListener("pointerdown", begin, true);
    element.addEventListener("pointermove", move, true);
    element.addEventListener("pointerup", finish, true);
    element.addEventListener("pointercancel", finish, true);
    return () => {
      element.removeEventListener("pointerdown", begin, true);
      element.removeEventListener("pointermove", move, true);
      element.removeEventListener("pointerup", finish, true);
      element.removeEventListener("pointercancel", finish, true);
    };
  }, [gl, onInspectionPreview]);

  const scratch = useRef({
    target: new THREE.Vector3(),
    unblended: new THREE.Vector3(),
    position: new THREE.Vector3(),
    track: new THREE.Vector3(),
  });

  const applySample = useCallback(
    (sample: RafaleMotionSample) => {
      const runtime = runtimeRef.current;
      lastSampleRef.current = sample;
      poseRef.current = { bank: sample.bank, sensors: sample.sensors, launch: sample.launch };
      const current = scenarioRef.current;

      if (runtime) poseRuntime(runtime, flight, sample, current);
      else flight.rotation.set(0, 0, -THREE.MathUtils.degToRad(sample.bank));

      // Cadrage : poses dans le repère de l'avion, horizon du monde conservé.
      const s = scratch.current;
      s.unblended.set(...sample.camera.target);
      s.target.copy(s.unblended);
      const rest = runtime?.rests[current];
      if (sample.track > 0 && rest) {
        const center = shotCenter(current, rest, sample.launch);
        const ahead = Math.min(TRACK_TRAVEL_LIMIT, Math.max(0, rest[2] - center[2]));
        s.track.set(center[0], center[1], rest[2] - ahead);
        s.target.lerp(s.track, sample.track);
      }
      const [px, py, pz] = sample.camera.position;
      const scale = framingScaleRef.current;
      s.position.set(
        s.unblended.x + (px - s.unblended.x) * scale,
        s.unblended.y + (py - s.unblended.y) * scale,
        s.unblended.z + (pz - s.unblended.z) * scale,
      );
      flight.updateMatrixWorld(true);
      flight.localToWorld(s.position);
      flight.localToWorld(s.target);
      camera.position.copy(s.position);
      camera.up.set(0, 1, 0);
      camera.lookAt(s.target);
      if (controls) {
        controls.target.copy(s.target);
        controls.update();
      }
      camera.updateMatrixWorld();

      if (runtime) {
        runtime.effects.update(sample.launch, current, camera);
        const shot = shotState(current, sample.launch);
        const link =
          current === "bvr" && shot.ignited && rest ? shotCenter(current, rest, sample.launch) : null;
        runtime.sensors.update(sample.sensors, current, link);
      }
    },
    [camera, controls, flight],
  );

  // Plan vers la pose de l'état posé, pour le scénario courant. Il repart
  // toujours de la pose RÉELLE en cours, ramenée dans le repère de l'avion.
  const startPlan = useCallback(
    (animate: boolean) => {
      const state = posedStateRef.current;
      if (!state) return;
      const scale = framingScaleRef.current;
      const worldTarget = (controls?.target ?? DEFAULT_TARGET).clone();
      flight.updateMatrixWorld(true);
      const target = flight.worldToLocal(worldTarget);
      const position = flight.worldToLocal(camera.position.clone());
      const from: RafaleMotionPose = {
        camera: {
          position: [
            target.x + (position.x - target.x) / scale,
            target.y + (position.y - target.y) / scale,
            target.z + (position.z - target.z) / scale,
          ],
          target: [target.x, target.y, target.z],
        },
        bank: poseRef.current.bank,
        sensors: poseRef.current.sensors,
        launch: poseRef.current.launch,
      };
      const plan = buildRafaleMotionPlan(
        scenarioRef.current,
        from,
        rafalePoseForState(state, scenarioRef.current),
        { reducedMotion: !animate },
      );
      elapsedRef.current = 0;
      lastFrameAtRef.current = now();
      applySample(sampleRafaleMotion(plan, 0));
      if (isInstantPlan(plan)) {
        planRef.current = null;
        onTransitionChange(false);
      } else {
        planRef.current = plan;
        onTransitionChange(true);
      }
      invalidate();
    },
    [applySample, camera, controls, flight, invalidate, onTransitionChange],
  );

  // Seule source de mouvement : un changement d'état (ou du réglage de
  // mouvement réduit, qui pose directement).
  useEffect(() => {
    const stateChanged =
      posedStateRef.current !== null && posedStateRef.current !== sequenceState;
    posedStateRef.current = sequenceState;
    startPlan(stateChanged && !reducedMotion);
  }, [reducedMotion, sequenceState, startPlan]);

  // Le scénario est verrouillé pendant la séquence de tir ; s'il change au
  // repos, la pose de l'état pour ce scénario est appliquée directement (sans
  // animation). S'il change pendant une transition encore libre (Inspection →
  // Capteurs, où l'inclinaison dépend du scénario), la transition repart de
  // la pose réelle vers celle du nouveau scénario.
  useEffect(() => {
    if (scenarioRef.current === scenario) return;
    scenarioRef.current = scenario;
    startPlan(planRef.current !== null);
  }, [scenario, startPlan]);

  // Recadrage sur redimensionnement, sans jamais relancer une transition.
  useEffect(() => {
    if (planRef.current || !lastSampleRef.current) return;
    applySample(lastSampleRef.current);
    invalidate();
  }, [applySample, invalidate, width, height]);

  // Point de vue du dernier tri des fumées au repos.
  const sortedViewRef = useRef(new THREE.Matrix4());

  useFrame(() => {
    const plan = planRef.current;
    if (!plan) {
      // Au repos, l'orbite (état Fin) déplace la caméra sans nouvel
      // échantillon : les bouffées translucides sont re-triées d'arrière en
      // avant pour ce point de vue. Rien ne bouge dans la scène.
      const runtime = runtimeRef.current;
      if (
        runtime &&
        poseRef.current.launch > 0 &&
        !camera.matrixWorld.equals(sortedViewRef.current)
      ) {
        sortedViewRef.current.copy(camera.matrixWorld);
        runtime.effects.update(poseRef.current.launch, scenarioRef.current, camera);
      }
      return;
    }
    const frameAt = now();
    const step = Math.min(frameAt - lastFrameAtRef.current, maxFrameStepMs);
    lastFrameAtRef.current = frameAt;
    elapsedRef.current = Math.min(elapsedRef.current + step, plan.totalMs);
    const previousLaunch = poseRef.current.launch;
    const sample = sampleRafaleMotion(plan, elapsedRef.current);
    applySample(sample);
    // Le décor recule au rythme du vol ; pendant le départ, au rythme de la
    // chronologie (ralenti compris), comme la fumée.
    const advance =
      sample.launch > previousLaunch ? sample.launch - previousLaunch : step / 1000;
    scrollRef.current = (scrollRef.current ?? 0) + RAFALE_AIRFLOW * advance;
    if (sample.done) {
      planRef.current = null;
      onTransitionChange(false);
      invalidate();
      return;
    }
    invalidate();
  });

  useEffect(() => {
    onReady();
  }, [onReady]);

  const handlePointerOver = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (event.pointerType === "touch") return;
      if (orbitGestureRef.current.dragging) return;
      const id = inspectionIdForObject(event.object, model);
      if (!id) return;
      event.stopPropagation();
      onInspectionPreview(id);
    },
    [model, onInspectionPreview],
  );

  const handlePointerOut = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (event.pointerType === "touch") return;
      if (orbitGestureRef.current.dragging) return;
      event.stopPropagation();
      onInspectionPreview(null);
    },
    [onInspectionPreview],
  );

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      // R3F remet ce clic à chaque mesh traversé par le rayon : le drapeau
      // n'est PAS réarmé ici (le prochain pointerdown s'en charge), sinon le
      // mesh suivant épinglerait son sous-ensemble à la fin d'un glisser.
      if (orbitGestureRef.current.suppressClick) return;
      const id = inspectionIdForObject(event.object, model);
      if (!id) return;
      event.stopPropagation();
      onInspectionToggle(id);
    },
    [model, onInspectionToggle],
  );

  return (
    <primitive
      object={flight}
      dispose={null}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
}
