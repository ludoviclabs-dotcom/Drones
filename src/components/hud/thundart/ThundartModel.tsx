"use client";

// React Compiler can mis-optimize R3F object graphs; keep this boundary explicit.
"use no memo";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  THUNDART_ASSET_MANIFEST,
  THUNDART_ASSET_PATH,
  type ThundartSequenceState,
} from "@/data/hud/thundart";
import {
  buildThundartMotionPlan,
  framingScaleForAspect,
  isInstantPlan,
  sampleThundartMotion,
  thundartPoseForState,
  THUNDART_FALLBACK_CLIP_DURATIONS,
  type ThundartClipDurations,
  type ThundartMotionPlan,
  type ThundartMotionPose,
  type ThundartMotionSample,
} from "@/data/hud/thundart-motion";

const [CONFIGURE_CLIP, DEPARTURE_CLIP] = THUNDART_ASSET_MANIFEST.animationClips;
const FLASH_HOST_NODE = "THD_Canister_01";
const DEFAULT_TARGET = new THREE.Vector3(0, 1.65, 0);

/**
 * Pas de temps maximal appliqué à une frame, en millisecondes (plancher ~15 fps).
 *
 * Deux pièges se referment ici, et le plafonnement les neutralise tous les deux.
 * D'abord, en `frameloop="demand"`, l'horloge continue de courir pendant que la
 * scène est au repos : la première frame relancée porterait sinon un delta égal
 * à toute la durée d'inactivité. Ensuite, si le navigateur est saturé (onglet en
 * arrière-plan, plusieurs contextes WebGL en parallèle), une frame peut arriver
 * plusieurs secondes après la précédente. Dans les deux cas, sans plafond, la
 * transition serait consommée d'un bloc et ne serait jamais vue.
 *
 * La pose finale reste exacte quoi qu'il arrive : le temps écoulé est borné à
 * la durée du plan, et l'échantillonnage à cette borne rend exactement `plan.to`.
 */
const MAX_FRAME_STEP_MS = 64;

/** Horloge monotone du navigateur. */
function now(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

/**
 * Contrat minimal attendu des contrôles orbitaux, décrit structurellement pour
 * ne pas dépendre d'un type interne de `three-stdlib`.
 */
type OrbitLikeControls = {
  target: THREE.Vector3;
  update: () => unknown;
};

function asOrbitControls(value: unknown): OrbitLikeControls | null {
  return value && typeof value === "object" && "target" in value
    ? (value as OrbitLikeControls)
    : null;
}

/**
 * Couche impérative Three.js. Elle est construite dans un effet et gardée dans
 * une ref : jamais retournée par un hook, jamais listée en dépendance, jamais
 * lue pendant le rendu. C'est ce qui permet de piloter le mixer et le flash par
 * écriture directe sans violer les règles d'immutabilité du React Compiler.
 */
type ThundartRuntime = {
  mixer: THREE.AnimationMixer;
  actions: Map<string, THREE.AnimationAction>;
  flash: THREE.Mesh;
  flashMaterial: THREE.MeshBasicMaterial;
  flashHost: THREE.Object3D | null;
};

function createRuntime(
  model: THREE.Object3D,
  clips: readonly THREE.AnimationClip[],
): ThundartRuntime {
  const mixer = new THREE.AnimationMixer(model);
  const actions = new Map<string, THREE.AnimationAction>();

  // Les actions sont armées une fois puis figées. `play()` les rend actives,
  // `paused` les empêche d'avancer seules : le mixer devient un évaluateur de
  // pose, pas un lecteur. Aucun clip ne court, donc aucune course entre clips.
  for (const name of [CONFIGURE_CLIP, DEPARTURE_CLIP]) {
    const clip = clips.find((candidate) => candidate.name === name);
    if (!clip) continue;
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

  const flashMaterial = new THREE.MeshBasicMaterial({
    color: "#ffd9a8",
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const flash = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 12, 8),
    flashMaterial,
  );
  flash.name = "THD_UI_DepartureFlash";
  flash.visible = false;
  flash.renderOrder = 2;

  // Ancrage à la bouche du conteneur porteur, déduit de la géométrie de l'asset
  // plutôt que d'une constante : le flash suit donc le rack quand il bouge.
  let flashHost: THREE.Object3D | null = null;
  const host = model.getObjectByName(FLASH_HOST_NODE);
  if (host instanceof THREE.Mesh) {
    if (!host.geometry.boundingBox) host.geometry.computeBoundingBox();
    flash.position.set(0, 0, (host.geometry.boundingBox?.max.z ?? 0) + 0.12);
    host.add(flash);
    flashHost = host;
  }

  return { mixer, actions, flash, flashMaterial, flashHost };
}

function disposeRuntime(runtime: ThundartRuntime) {
  runtime.flashHost?.remove(runtime.flash);
  runtime.flash.geometry.dispose();
  runtime.flashMaterial.dispose();
  runtime.mixer.stopAllAction();
  runtime.mixer.uncacheRoot(runtime.mixer.getRoot() as THREE.Object3D);
}

/**
 * Porte le graphe GLB **et** son mouvement.
 *
 * Un seul propriétaire du `AnimationMixer` : il n'existe pas de seconde
 * implémentation concurrente. Aucun `setTimeout` — toute la chronologie est
 * lue à partir du temps écoulé cumulé dans la boucle de rendu, et le plan est
 * échantillonné par une fonction pure. La pose finale est donc exacte quel que
 * soit le framerate.
 *
 * Le canvas est en `frameloop="demand"` : tant qu'aucun plan n'est actif,
 * aucune frame n'est demandée. NO STATE CHANGE = NO MOTION, littéralement.
 */
export function ThundartModel({
  sequenceState,
  reducedMotion,
  onReady,
  onTransitionChange,
}: {
  sequenceState: ThundartSequenceState;
  reducedMotion: boolean;
  onReady: () => void;
  onTransitionChange: (running: boolean) => void;
}) {
  const { scene, animations } = useGLTF(THUNDART_ASSET_PATH);

  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => asOrbitControls(state.controls));
  const invalidate = useThree((state) => state.invalidate);
  const size = useThree((state) => state.size);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  const clipDurations = useMemo<ThundartClipDurations>(() => {
    const read = (name: string, fallbackMs: number) => {
      const duration = animations.find((clip) => clip.name === name)?.duration;
      return duration && duration > 0 ? duration * 1000 : fallbackMs;
    };
    return {
      configureMs: read(
        CONFIGURE_CLIP,
        THUNDART_FALLBACK_CLIP_DURATIONS.configureMs,
      ),
      departureMs: read(
        DEPARTURE_CLIP,
        THUNDART_FALLBACK_CLIP_DURATIONS.departureMs,
      ),
    };
  }, [animations]);

  const runtimeRef = useRef<ThundartRuntime | null>(null);
  const planRef = useRef<ThundartMotionPlan | null>(null);
  const elapsedRef = useRef(0);
  const lastFrameAtRef = useRef(0);
  const poseRef = useRef({ configure: 0, departure: 0 });
  const posedStateRef = useRef<ThundartSequenceState | null>(null);
  const lastSampleRef = useRef<ThundartMotionSample | null>(null);
  const framingScaleRef = useRef(1);

  // Déclaré en premier : le recul responsive est connu avant la première pose.
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

  const applySample = useCallback(
    (sample: ThundartMotionSample) => {
      const runtime = runtimeRef.current;
      lastSampleRef.current = sample;
      poseRef.current = {
        configure: sample.configure,
        departure: sample.departure,
      };

      if (runtime) {
        for (const [name, progress] of [
          [CONFIGURE_CLIP, sample.configure],
          [DEPARTURE_CLIP, sample.departure],
        ] as const) {
          const action = runtime.actions.get(name);
          if (action) action.time = progress * action.getClip().duration;
        }
        runtime.mixer.update(0);

        runtime.flash.visible = sample.flash > 0.001;
        runtime.flashMaterial.opacity = sample.flash * 0.85;
        runtime.flash.scale.setScalar(0.65 + sample.flash * 0.9);
      }

      const [tx, ty, tz] = sample.camera.target;
      const [px, py, pz] = sample.camera.position;
      const scale = framingScaleRef.current;
      camera.position.set(
        tx + (px - tx) * scale,
        ty + (py - ty) * scale,
        tz + (pz - tz) * scale,
      );
      camera.lookAt(tx, ty, tz);
      if (controls) {
        controls.target.set(tx, ty, tz);
        // Resynchronise l'état sphérique interne des contrôles sur la caméra
        // qu'on vient de déplacer : sans cela, leur première mise à jour après
        // réactivation ramènerait la caméra à sa position d'avant la transition.
        controls.update();
      }
    },
    [camera, controls],
  );

  // Seule source de mouvement : un changement d'état (ou du réglage de mouvement
  // réduit). Le plan repart toujours de la pose RÉELLE en cours — caméra
  // comprise, même si l'utilisateur vient de l'orbiter, et même si une
  // transition était encore en vol — ce qui rend toute interruption continue.
  useEffect(() => {
    const scale = framingScaleRef.current;
    const target = controls?.target ?? DEFAULT_TARGET;
    const from: ThundartMotionPose = {
      camera: {
        position: [
          target.x + (camera.position.x - target.x) / scale,
          target.y + (camera.position.y - target.y) / scale,
          target.z + (camera.position.z - target.z) / scale,
        ],
        target: [target.x, target.y, target.z],
      },
      configure: poseRef.current.configure,
      departure: poseRef.current.departure,
    };

    // NO STATE CHANGE = NO MOTION, appliqué à la lettre. Cet effet se réexécute
    // aussi pour des raisons qui ne sont PAS un changement d'état : montage
    // initial, arrivée tardive des contrôles orbitaux dans le contexte R3F,
    // bascule du réglage de mouvement réduit. Dans tous ces cas la pose est
    // posée d'un coup ; seule une vraie transition d'état s'anime.
    const stateChanged =
      posedStateRef.current !== null && posedStateRef.current !== sequenceState;
    posedStateRef.current = sequenceState;

    const plan = buildThundartMotionPlan(
      from,
      thundartPoseForState(sequenceState),
      clipDurations,
      { reducedMotion: reducedMotion || !stateChanged },
    );

    elapsedRef.current = 0;
    lastFrameAtRef.current = now();
    applySample(sampleThundartMotion(plan, 0));

    if (isInstantPlan(plan)) {
      // Mouvement réduit, ou transition sans écart : la pose finale est déjà
      // posée et aucune frame animée n'est demandée.
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
    const step = Math.min(frameAt - lastFrameAtRef.current, MAX_FRAME_STEP_MS);
    lastFrameAtRef.current = frameAt;
    elapsedRef.current = Math.min(elapsedRef.current + step, plan.totalMs);

    const sample = sampleThundartMotion(plan, elapsedRef.current);
    applySample(sample);

    if (sample.done) {
      // Pose exacte atteinte : on relâche le plan et on cesse de demander des
      // frames. Rien ne bouge plus jusqu'au prochain changement d'état.
      planRef.current = null;
      onTransitionChange(false);
      return;
    }

    invalidate();
  });

  useEffect(() => {
    onReady();
  }, [onReady]);

  return <primitive object={model} dispose={null} />;
}
