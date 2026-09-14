"use client";

// React Compiler can mis-optimize R3F object graphs; keep this boundary explicit.
"use no memo";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import {
  PATRIOT_ASSET_MANIFEST,
  PATRIOT_ASSET_PATH,
  type PatriotFireMode,
  type PatriotSequenceState,
} from "@/data/hud/patriot";
import {
  PATRIOT_LAUNCH_SLOTS,
  missileLaunchState,
  missileTailPoint,
  type LaunchGeometries,
  type LaunchGeometry,
  type LaunchSlot,
  type Vec3,
} from "@/data/hud/patriot-launch";
import {
  buildPatriotMotionPlan,
  framingScaleForAspect,
  isInstantPlan,
  patriotPoseForState,
  samplePatriotMotion,
  PATRIOT_FALLBACK_CLIP_DURATIONS,
  type PatriotClipDurations,
  type PatriotMotionPlan,
  type PatriotMotionPose,
  type PatriotMotionSample,
} from "@/data/hud/patriot-motion";
import {
  patriotInspectionIdForNodeName,
  type PatriotInspectableId,
} from "@/data/hud/patriot-inspection";
import { createPatriotEffects, type PatriotEffects } from "./patriot-effects";
import { attachPatriotSurfaceDetails } from "./patriot-surface-details";

const CLIPS = PATRIOT_ASSET_MANIFEST.animationClips;
const FIN_CLIPS: Record<LaunchSlot, string> = { A: CLIPS.finsA, B: CLIPS.finsB };
const INSPECTION_ACCENT = new THREE.Color("#e07a4d");
const DEFAULT_TARGET = new THREE.Vector3(-2, 1, 13);
/** Au-delà de cette avance (m), la caméra cesse de suivre l'intercepteur. */
const TRACK_TRAVEL_LIMIT = 85;
/**
 * Pas de temps maximal par frame (ms). Même piège qu'en Thundart : en
 * `frameloop="demand"`, la première frame relancée porterait sinon toute la
 * durée d'inactivité ; plafonné, un plan est toujours VU, et sa pose finale
 * reste exacte puisque le temps écoulé est borné à sa durée. Le profil de
 * rendu logiciel passe un plafond plus haut (voir render-profile.ts).
 */
const MAX_FRAME_STEP_MS = 64;

function now(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

type InspectableMaterialRecord = {
  componentId: PatriotInspectableId | null;
  liveCanister: boolean;
  material: THREE.MeshStandardMaterial;
  color: THREE.Color;
  emissive: THREE.Color;
  emissiveIntensity: number;
};

function inspectionIdForObject(
  object: THREE.Object3D,
  root: THREE.Object3D,
): PatriotInspectableId | null {
  let current: THREE.Object3D | null = object;
  while (current) {
    const id = patriotInspectionIdForNodeName(current.name);
    if (id) return id;
    if (current === root) return null;
    current = current.parent;
  }
  return null;
}

function isWithinLiveCanister(object: THREE.Object3D, root: THREE.Object3D): boolean {
  const live = Object.values(PATRIOT_ASSET_MANIFEST.liveCanisters) as string[];
  let current: THREE.Object3D | null = object;
  while (current) {
    if (live.includes(current.name)) return true;
    if (current === root) return false;
    current = current.parent;
  }
  return false;
}

function isHeroObject(object: THREE.Object3D, root: THREE.Object3D): boolean {
  let current: THREE.Object3D | null = object;
  while (current) {
    if (current.name === PATRIOT_ASSET_MANIFEST.heroStation) return true;
    if (current.name === PATRIOT_ASSET_MANIFEST.heroTractor) return true;
    if (current === root) return false;
    current = current.parent;
  }
  return false;
}

function applyInspectionStyle(
  records: readonly InspectableMaterialRecord[],
  activeId: PatriotInspectableId | null,
  pinned: boolean,
  interceptorVisible: boolean,
) {
  const interceptor = activeId === "interceptor";
  for (const record of records) {
    const { material } = record;
    material.color.copy(record.color);
    material.emissive.copy(record.emissive);
    material.emissiveIntensity = record.emissiveIntensity;
    if (!activeId) continue;
    // L'intercepteur est dans son conteneur tant qu'il n'est pas tiré : on
    // désigne alors les conteneurs de tir qui le portent.
    const carrier = interceptor && !interceptorVisible && record.liveCanister;
    if (record.componentId === activeId || carrier) {
      material.color.lerp(INSPECTION_ACCENT, carrier ? 0.34 : pinned ? 0.24 : 0.14);
      material.emissive.copy(INSPECTION_ACCENT);
      material.emissiveIntensity = carrier ? (pinned ? 0.55 : 0.36) : pinned ? 0.4 : 0.22;
    } else {
      // Atténuation colorimétrique seulement : rien ne disparaît.
      material.color.multiplyScalar(0.6);
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

/** Couche impérative : construite dans un effet, gardée dans une ref. */
type PatriotRuntime = {
  mixer: THREE.AnimationMixer;
  actions: Map<string, THREE.AnimationAction>;
  missiles: Partial<Record<LaunchSlot, THREE.Object3D>>;
  missileRest: Partial<Record<LaunchSlot, THREE.Vector3>>;
  covers: Partial<Record<LaunchSlot, { front: THREE.Object3D | null; rear: THREE.Object3D | null }>>;
  geometries: LaunchGeometries | null;
  effects: PatriotEffects;
};

function setClip(runtime: PatriotRuntime, name: string, progress: number) {
  const action = runtime.actions.get(name);
  if (action) action.time = Math.max(0, Math.min(1, progress)) * action.getClip().duration;
}

function toVec3(v: THREE.Vector3): Vec3 {
  return [v.x, v.y, v.z];
}

/**
 * Lit, sur le modèle mis en pose « élevé », le repère monde de chaque tube de
 * tir. L'axe du conteneur est -Z local (conversion Y-up de l'export Blender) :
 * extrémité arrière à l'origine locale, extrémité avant à -longueur.
 */
function computeLaunchGeometries(
  model: THREE.Object3D,
  runtime: PatriotRuntime,
): LaunchGeometries | null {
  model.updateMatrixWorld(true);
  const out: Partial<Record<LaunchSlot, LaunchGeometry>> = {};
  for (const slot of PATRIOT_LAUNCH_SLOTS) {
    const canister = model.getObjectByName(PATRIOT_ASSET_MANIFEST.liveCanisters[slot]);
    const missile = runtime.missiles[slot];
    if (!canister || !missile) return null;
    const rear = canister.localToWorld(new THREE.Vector3(0, 0, 0));
    const front = canister.localToWorld(
      new THREE.Vector3(0, 0, -PATRIOT_ASSET_MANIFEST.canisterLength),
    );
    const axis = front.clone().sub(rear).normalize();
    const tail = missile.getWorldPosition(new THREE.Vector3());
    out[slot] = { rear: toVec3(rear), front: toVec3(front), axis: toVec3(axis), tail: toVec3(tail) };
  }
  return out as LaunchGeometries;
}

function createRuntime(
  model: THREE.Object3D,
  clips: readonly THREE.AnimationClip[],
): PatriotRuntime {
  const mixer = new THREE.AnimationMixer(model);
  const actions = new Map<string, THREE.AnimationAction>();
  for (const name of [CLIPS.emplace, CLIPS.elevate, CLIPS.finsA, CLIPS.finsB]) {
    const clip = clips.find((candidate) => candidate.name === name);
    if (!clip) continue;
    // Actions armées puis figées : le mixer évalue des poses, il ne « joue » rien.
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.enabled = true;
    action.setEffectiveWeight(1);
    action.play();
    action.paused = true;
    action.time = 0;
    actions.set(name, action);
  }
  mixer.update(0);

  const missiles: PatriotRuntime["missiles"] = {};
  const missileRest: PatriotRuntime["missileRest"] = {};
  const covers: PatriotRuntime["covers"] = {};
  for (const slot of PATRIOT_LAUNCH_SLOTS) {
    const missile = model.getObjectByName(PATRIOT_ASSET_MANIFEST.missileNodes[slot]);
    if (missile) {
      missiles[slot] = missile;
      missileRest[slot] = missile.position.clone();
    }
    const names = PATRIOT_ASSET_MANIFEST.coverNodes[slot];
    covers[slot] = {
      front: model.getObjectByName(names.front) ?? null,
      rear: model.getObjectByName(names.rear) ?? null,
    };
  }

  const effects = createPatriotEffects({ missiles });
  model.add(effects.root);
  const runtime: PatriotRuntime = {
    mixer,
    actions,
    missiles,
    missileRest,
    covers,
    geometries: null,
    effects,
  };

  // Géométrie de tir : évaluée une fois, lanceur en batterie et élevé.
  setClip(runtime, CLIPS.emplace, 1);
  setClip(runtime, CLIPS.elevate, 1);
  mixer.update(0);
  runtime.geometries = computeLaunchGeometries(model, runtime);
  setClip(runtime, CLIPS.emplace, 0);
  setClip(runtime, CLIPS.elevate, 0);
  mixer.update(0);
  effects.setGeometries(runtime.geometries);
  return runtime;
}

function disposeRuntime(runtime: PatriotRuntime) {
  runtime.effects.dispose();
  runtime.mixer.stopAllAction();
  runtime.mixer.uncacheRoot(runtime.mixer.getRoot() as THREE.Object3D);
  for (const slot of PATRIOT_LAUNCH_SLOTS) {
    const missile = runtime.missiles[slot];
    const rest = runtime.missileRest[slot];
    if (missile && rest) missile.position.copy(rest);
  }
}

export function PatriotModel({
  sequenceState,
  fireMode,
  reducedMotion,
  activeInspectionId,
  selectedInspectionId,
  onReady,
  onTransitionChange,
  onInspectionPreview,
  onInspectionToggle,
  maxFrameStepMs = MAX_FRAME_STEP_MS,
}: {
  sequenceState: PatriotSequenceState;
  fireMode: PatriotFireMode;
  reducedMotion: boolean;
  activeInspectionId: PatriotInspectableId | null;
  selectedInspectionId: PatriotInspectableId | null;
  onReady: () => void;
  onTransitionChange: (running: boolean) => void;
  onInspectionPreview: (id: PatriotInspectableId | null) => void;
  onInspectionToggle: (id: PatriotInspectableId) => void;
  maxFrameStepMs?: number;
}) {
  // Draco désactivé (son décodeur drei vient d'un CDN) ; meshopt activé : son
  // décodeur WebAssembly est embarqué par three-stdlib, aucune requête réseau.
  const { scene, animations } = useGLTF(PATRIOT_ASSET_PATH, false, true);

  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => asOrbitControls(state.controls));
  const invalidate = useThree((state) => state.invalidate);
  const size = useThree((state) => state.size);
  const gl = useThree((state) => state.gl);

  const preparedModel = useMemo(() => {
    const clone = scene.clone(true);
    // 1. Matériaux clonés par mesh : le cache `useGLTF` n'est jamais muté.
    const meshes: THREE.Mesh[] = [];
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = isHeroObject(child, clone);
      child.receiveShadow = true;
      const cloned = (Array.isArray(child.material) ? child.material : [child.material]).map(
        (material) => material.clone(),
      );
      child.material = Array.isArray(child.material) ? cloned : cloned[0];
      meshes.push(child);
    });
    // 2. Détails de surface sur ces clones (texture du réseau, numéros).
    const surfaceDetails = attachPatriotSurfaceDetails(clone);
    // 3. Couleurs de base de l'inspection, relevées après les détails.
    const materials: InspectableMaterialRecord[] = [];
    for (const mesh of meshes) {
      const componentId = inspectionIdForObject(mesh, clone);
      const liveCanister = isWithinLiveCanister(mesh, clone);
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of list) {
        if (!(material instanceof THREE.MeshStandardMaterial)) continue;
        materials.push({
          componentId,
          liveCanister,
          material,
          color: material.color.clone(),
          emissive: material.emissive.clone(),
          emissiveIntensity: material.emissiveIntensity,
        });
      }
    }
    return { model: clone, materials, surfaceDetails };
  }, [scene]);
  const model = preparedModel.model;

  const clipDurations = useMemo<PatriotClipDurations>(() => {
    const read = (name: string, fallbackMs: number) => {
      const duration = animations.find((clip) => clip.name === name)?.duration;
      return duration && duration > 0 ? duration * 1000 : fallbackMs;
    };
    return {
      emplaceMs: read(CLIPS.emplace, PATRIOT_FALLBACK_CLIP_DURATIONS.emplaceMs),
      elevateMs: read(CLIPS.elevate, PATRIOT_FALLBACK_CLIP_DURATIONS.elevateMs),
    };
  }, [animations]);

  const runtimeRef = useRef<PatriotRuntime | null>(null);
  const planRef = useRef<PatriotMotionPlan | null>(null);
  const elapsedRef = useRef(0);
  const lastFrameAtRef = useRef(0);
  const poseRef = useRef({ emplace: 0, elevate: 0, launch: 0 });
  const posedStateRef = useRef<PatriotSequenceState | null>(null);
  const lastSampleRef = useRef<PatriotMotionSample | null>(null);
  const framingScaleRef = useRef(1);
  const fireModeRef = useRef<PatriotFireMode>(fireMode);
  const inspectionMaterialsRef = useRef<InspectableMaterialRecord[]>([]);
  const inspectionVisualRef = useRef({
    activeId: null as PatriotInspectableId | null,
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
      preparedModel.surfaceDetails.dispose();
    };
  }, [preparedModel.materials, preparedModel.surfaceDetails]);

  const restyleInspection = useCallback(() => {
    const { activeId, pinned } = inspectionVisualRef.current;
    applyInspectionStyle(
      inspectionMaterialsRef.current,
      activeId,
      pinned,
      poseRef.current.launch > 0,
    );
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
    framingScaleRef.current = framingScaleForAspect(
      size.height > 0 ? size.width / size.height : 1,
    );
  }, [size]);

  useEffect(() => {
    const runtime = createRuntime(model, animations);
    runtimeRef.current = runtime;
    return () => {
      runtimeRef.current = null;
      disposeRuntime(runtime);
    };
  }, [model, animations]);

  // Gestes orbitaux : même garde qu'en Thundart (un vrai glisser n'ouvre ni
  // n'épingle aucun sous-ensemble).
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

  const trackPoint = useRef(new THREE.Vector3());

  const applySample = useCallback(
    (sample: PatriotMotionSample) => {
      const runtime = runtimeRef.current;
      lastSampleRef.current = sample;
      const wasLaunched = poseRef.current.launch > 0;
      poseRef.current = {
        emplace: sample.emplace,
        elevate: sample.elevate,
        launch: sample.launch,
      };
      const mode = fireModeRef.current;

      if (runtime) {
        setClip(runtime, CLIPS.emplace, sample.emplace);
        setClip(runtime, CLIPS.elevate, sample.elevate);
        for (const slot of PATRIOT_LAUNCH_SLOTS) {
          const state = missileLaunchState(slot, mode, sample.launch);
          setClip(runtime, FIN_CLIPS[slot], state.fins);
          const missile = runtime.missiles[slot];
          const rest = runtime.missileRest[slot];
          if (missile && rest) {
            // Avant de l'intercepteur sur -Z local, dans le repère du conteneur.
            missile.position.set(rest.x, rest.y, rest.z - state.travel);
          }
          const covers = runtime.covers[slot];
          if (covers?.rear) covers.rear.visible = !state.rearCoverGone;
          if (covers?.front) covers.front.visible = !state.frontCoverGone;
        }
        runtime.mixer.update(0);
      }

      // Cadrage (suivi éventuel de l'intercepteur A pendant le départ).
      const [tx0, ty0, tz0] = sample.camera.target;
      let tx = tx0;
      let ty = ty0;
      let tz = tz0;
      const geometries = runtime?.geometries;
      if (sample.track > 0 && geometries) {
        const geom = geometries.A;
        const clampedLaunch = sample.launch;
        const point = missileTailPoint("A", geom, mode, clampedLaunch);
        if (point) {
          const along = Math.min(
            TRACK_TRAVEL_LIMIT,
            Math.max(0, missileLaunchState("A", mode, clampedLaunch).travel),
          );
          trackPoint.current.set(
            geom.tail[0] + geom.axis[0] * along,
            geom.tail[1] + geom.axis[1] * along,
            geom.tail[2] + geom.axis[2] * along,
          );
          tx += (trackPoint.current.x - tx) * sample.track;
          ty += (trackPoint.current.y - ty) * sample.track;
          tz += (trackPoint.current.z - tz) * sample.track;
        }
      }
      const [px, py, pz] = sample.camera.position;
      const scale = framingScaleRef.current;
      camera.position.set(
        tx0 + (px - tx0) * scale,
        ty0 + (py - ty0) * scale,
        tz0 + (pz - tz0) * scale,
      );
      camera.lookAt(tx, ty, tz);
      if (controls) {
        controls.target.set(tx, ty, tz);
        controls.update();
      }
      camera.updateMatrixWorld();
      runtime?.effects.update(sample.launch, mode, camera);
      if (wasLaunched !== sample.launch > 0) restyleInspection();
    },
    [camera, controls, restyleInspection],
  );

  // Seule source de mouvement : un changement d'état (ou du réglage de
  // mouvement réduit). Le plan repart toujours de la pose RÉELLE en cours.
  useEffect(() => {
    const scale = framingScaleRef.current;
    const target = controls?.target ?? DEFAULT_TARGET;
    const from: PatriotMotionPose = {
      camera: {
        position: [
          target.x + (camera.position.x - target.x) / scale,
          target.y + (camera.position.y - target.y) / scale,
          target.z + (camera.position.z - target.z) / scale,
        ],
        target: [target.x, target.y, target.z],
      },
      emplace: poseRef.current.emplace,
      elevate: poseRef.current.elevate,
      launch: poseRef.current.launch,
    };
    const stateChanged =
      posedStateRef.current !== null && posedStateRef.current !== sequenceState;
    posedStateRef.current = sequenceState;

    const plan = buildPatriotMotionPlan(
      from,
      patriotPoseForState(sequenceState),
      clipDurations,
      { reducedMotion: reducedMotion || !stateChanged },
    );
    elapsedRef.current = 0;
    lastFrameAtRef.current = now();
    applySample(samplePatriotMotion(plan, 0));
    if (isInstantPlan(plan)) {
      planRef.current = null;
      onTransitionChange(false);
    } else {
      planRef.current = plan;
      onTransitionChange(true);
    }
    invalidate();
  }, [
    applySample,
    camera,
    clipDurations,
    controls,
    invalidate,
    onTransitionChange,
    reducedMotion,
    sequenceState,
  ]);

  // Le mode de tir est verrouillé pendant la séquence de tir ; s'il change au
  // repos, la pose courante est simplement réappliquée (sans animation).
  useEffect(() => {
    fireModeRef.current = fireMode;
    if (planRef.current || !lastSampleRef.current) return;
    applySample(lastSampleRef.current);
    invalidate();
  }, [applySample, fireMode, invalidate]);

  // Recadrage sur redimensionnement, sans jamais relancer une transition.
  useEffect(() => {
    if (planRef.current || !lastSampleRef.current) return;
    applySample(lastSampleRef.current);
    invalidate();
  }, [applySample, invalidate, size]);

  useFrame(() => {
    const plan = planRef.current;
    if (!plan) return;
    const frameAt = now();
    const step = Math.min(frameAt - lastFrameAtRef.current, maxFrameStepMs);
    lastFrameAtRef.current = frameAt;
    elapsedRef.current = Math.min(elapsedRef.current + step, plan.totalMs);
    const sample = samplePatriotMotion(plan, elapsedRef.current);
    applySample(sample);
    if (sample.done) {
      planRef.current = null;
      onTransitionChange(false);
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
      if (orbitGestureRef.current.suppressClick) {
        orbitGestureRef.current.suppressClick = false;
        return;
      }
      const id = inspectionIdForObject(event.object, model);
      if (!id) return;
      event.stopPropagation();
      onInspectionToggle(id);
    },
    [model, onInspectionToggle],
  );

  return (
    <primitive
      object={model}
      dispose={null}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
}
