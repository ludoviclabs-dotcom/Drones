"use client";

// React Compiler can mis-optimize R3F re-renders in some cases; opt out.
"use no memo";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import {
  RAFALE_ASSET_PATH,
  RAFALE_SCENARIO_COPY,
  RAFALE_SEQUENCE_COPY,
  biomeForScenario,
  loadoutForScenario,
  type RafaleBiome,
  type RafaleScenario,
  type RafaleSequenceState,
} from "@/data/hud/rafale";
import {
  rafaleInspectableById,
  type RafaleInspectableId,
} from "@/data/hud/rafale-inspection";
import { RAFALE_CAMERA_POSES } from "@/data/hud/rafale-motion";
import { SOFTWARE_MAX_FRAME_STEP_MS, useRenderProfile } from "@/components/hud/render-profile";
import { RafaleModel } from "./RafaleModel";
import * as THREE from "three";
import {
  RAFALE_BIOMES,
  RAFALE_SUN_DIRECTION,
  createRafaleWorld,
  type RafaleWorld,
} from "./rafale-world";

type AssetStatus = "loading" | "ready" | "error" | "unavailable";

const OVERVIEW_POSE = RAFALE_CAMERA_POSES.bvr.overview;
/** Hauteur de vol figurée (m) : haute en air-air, basse en mission SEAD. */
const ALTITUDE: Record<"air" | "sead", number> = { air: 1500, sead: 480 };
const SUN_POSITION = RAFALE_SUN_DIRECTION.clone().multiplyScalar(60).toArray();

class ModelErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.hasError ? <ModelErrorStandIn /> : this.props.children;
  }
}

/** Repère de chargement : silhouette filaire de la cellule et de la voilure. */
function LoadingStandIn() {
  return (
    <group>
      <mesh position={[0, 0.1, -0.5]}>
        <boxGeometry args={[1.6, 1.5, 15.2]} />
        <meshBasicMaterial color="#6d8a9a" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, -0.1, 2.4]}>
        <boxGeometry args={[10.9, 0.25, 6]} />
        <meshBasicMaterial color="#e07a4d" wireframe transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function ModelErrorStandIn() {
  return (
    <mesh position={[0, 0.1, 0]}>
      <boxGeometry args={[10.9, 2.4, 15.3]} />
      <meshBasicMaterial color="#b9602e" wireframe transparent opacity={0.75} />
    </mesh>
  );
}

function WebGlFallback() {
  return (
    <div className="grid h-full place-items-center px-6 text-center">
      <p className="max-w-sm border border-line bg-panel/70 px-5 py-4 font-mono text-[11px] leading-relaxed text-ink-dim">
        La vue 3D requiert WebGL 2, indisponible dans ce navigateur. La
        séquence, les scénarios et l’inspection des sous-ensembles restent
        utilisables dans la page.
      </p>
    </div>
  );
}

/**
 * Décor de vol : créé une fois, recalé à chaque rendu (recul du décor, tri des
 * nuages). En `frameloop="demand"`, rien n'est rendu — donc rien ne bouge —
 * hors transition ou geste de l'utilisateur.
 */
function WorldLayer({
  altitude,
  biome,
  scrollRef,
  lite,
}: {
  altitude: number;
  biome: RafaleBiome;
  scrollRef: RefObject<number>;
  lite: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const worldRef = useRef<RafaleWorld | null>(null);
  const invalidate = useThree((state) => state.invalidate);
  // Création, rattachement et libération dans le même effet : la mise en
  // place et le nettoyage restent symétriques (double montage compris).
  useEffect(() => {
    const world = createRafaleWorld({ lite });
    worldRef.current = world;
    groupRef.current?.add(world.root);
    invalidate();
    return () => {
      worldRef.current = null;
      world.dispose();
    };
  }, [invalidate, lite]);
  useEffect(() => {
    worldRef.current?.setAltitude(altitude);
    worldRef.current?.setBiome(biome);
    invalidate();
  }, [altitude, biome, invalidate, lite]);
  useFrame(({ camera }) => {
    const world = worldRef.current;
    if (!world) return;
    world.setScroll(scrollRef.current ?? 0);
    world.sortClouds(camera);
  });
  return <group ref={groupRef} />;
}

/** États où l'observation libre est permise, au repos seulement. */
function isObservationState(state: RafaleSequenceState): boolean {
  return state === "overview" || state === "inspect" || state === "complete";
}

export function RafaleScene3D({
  sequenceState,
  scenario,
  reducedMotion,
  activeInspectionId,
  selectedInspectionId,
  onInspectionPreview,
  onInspectionToggle,
}: {
  sequenceState: RafaleSequenceState;
  scenario: RafaleScenario;
  reducedMotion: boolean;
  activeInspectionId: RafaleInspectableId | null;
  selectedInspectionId: RafaleInspectableId | null;
  onInspectionPreview: (id: RafaleInspectableId | null) => void;
  onInspectionToggle: (id: RafaleInspectableId) => void;
}) {
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  // Profil décidé avant la création du contexte WebGL : complet, allégé
  // (rendu logiciel : ni environnement, ni anticrénelage, ni ombres) ou
  // indisponible (pas de WebGL 2 : repli explicite, GLB non téléchargé).
  const renderProfile = useRenderProfile();
  const softwareRendering = renderProfile === "software";
  const webGlAvailable = renderProfile !== "none";
  const [loadStatus, setAssetStatus] = useState<AssetStatus>("loading");
  const assetStatus: AssetStatus = webGlAvailable ? loadStatus : "unavailable";
  const [transitionRunning, setTransitionRunning] = useState(false);
  const scrollRef = useRef(0);

  const controlsEnabled = !transitionRunning && isObservationState(sequenceState);
  const activeInspection = rafaleInspectableById(activeInspectionId);
  const altitude = ALTITUDE[loadoutForScenario(scenario)];
  const biome = biomeForScenario(scenario);
  const look = RAFALE_BIOMES[biome];
  const sensorsLegend = sequenceState === "sensors";
  const linkLegend =
    scenario === "bvr" && (sequenceState === "launch" || sequenceState === "complete");

  useEffect(() => {
    if (mounted && webGlAvailable) useGLTF.preload(RAFALE_ASSET_PATH, false, true);
  }, [mounted, webGlAvailable]);

  const handleReady = useCallback(() => setAssetStatus("ready"), []);
  const handleError = useCallback(() => setAssetStatus("error"), []);
  const handleTransitionChange = useCallback(
    (running: boolean) => setTransitionRunning(running),
    [],
  );

  const statusCopy =
    assetStatus === "unavailable"
      ? "Vue 3D indisponible sans WebGL 2 · contrôles et inspection utilisables"
      : assetStatus === "error"
        ? "Asset indisponible · repère de secours affiché"
        : assetStatus === "loading"
          ? "Chargement de l’asset GLB local"
          : reducedMotion
            ? "Mouvement réduit · poses appliquées directement"
            : transitionRunning
              ? "Transition en cours"
              : "Pose figée · aucune animation en attente";

  return (
    <div
      className="relative h-[clamp(20rem,82vw,28rem)] min-w-0 overflow-hidden border border-line bg-[#11100c] lg:h-[clamp(28rem,62vw,48rem)] xl:h-[min(74vh,48rem)]"
      role="group"
      aria-label={`Vue 3D Rafale F4. État : ${RAFALE_SEQUENCE_COPY[sequenceState].label}. Scénario : ${RAFALE_SCENARIO_COPY[scenario].label}.`}
      aria-describedby="rafale-a11y-description"
      data-rafale-motion={transitionRunning ? "running" : "idle"}
      data-rafale-reduced-motion={reducedMotion ? "true" : "false"}
      data-rafale-asset={assetStatus}
      data-rafale-model-active={activeInspectionId ?? "none"}
      data-rafale-model-selected={selectedInspectionId ?? "none"}
      data-rafale-scenario={scenario}
      data-rafale-render-profile={renderProfile}
    >
      {mounted && webGlAvailable ? (
        <Canvas
          aria-hidden="true"
          camera={{ position: [...OVERVIEW_POSE.position], fov: 34, near: 0.1, far: 14000 }}
          dpr={softwareRendering ? 1 : [1, 1.5]}
          fallback={<WebGlFallback />}
          frameloop="demand"
          gl={{
            antialias: !softwareRendering,
            alpha: false,
            powerPreference: "high-performance",
          }}
          shadows={softwareRendering ? false : "percentage"}
        >
          <color attach="background" args={[look.horizon]} />
          {/* La brume commence au-delà de l'avion : elle fond les nuages
              lointains dans la couleur de l'horizon. La surface (mer ou
              désert) porte sa propre perspective aérienne. */}
          <fog attach="fog" args={[look.horizon, look.fogNear, look.fogFar]} />

          {/* Éclairage local fixe : aucune ressource externe. L'environnement
              de réflexion est rendu UNE fois par décor (frames = 1). Sans
              lui, le profil allégé remonte l'ambiance. */}
          <ambientLight intensity={softwareRendering ? 0.5 : 0.24} color="#9fb0b8" />
          <hemisphereLight args={["#c3ccd2", look.ground, softwareRendering ? 1.2 : 0.9]} />
          <directionalLight
            castShadow={!softwareRendering}
            color="#f3e2c6"
            intensity={2.1}
            position={SUN_POSITION as [number, number, number]}
            shadow-bias={-0.0004}
            shadow-normalBias={0.03}
            shadow-mapSize-height={2048}
            shadow-mapSize-width={2048}
            shadow-camera-left={-11}
            shadow-camera-right={11}
            shadow-camera-top={11}
            shadow-camera-bottom={-11}
            shadow-camera-near={20}
            shadow-camera-far={110}
          />
          <directionalLight color="#84a8b8" intensity={0.55} position={[30, -18, 20]} />
          <directionalLight color="#c8793f" intensity={0.45} position={[-30, 8, 40]} />
          {softwareRendering ? null : (
            // Remonté à chaque changement de décor : le dessous de la cellule
            // reflète la mer ou le sable.
            <Environment key={biome} frames={1} resolution={128} environmentIntensity={0.7}>
              <Lightformer form="rect" intensity={1.6} color="#b8c4cc" position={[0, 14, 0]} rotation-x={Math.PI / 2} scale={[26, 26, 1]} />
              <Lightformer form="rect" intensity={1.4} color="#e8c090" position={[-12, 3, -14]} rotation-y={Math.PI / 4} scale={[18, 3, 1]} />
              <Lightformer form="rect" intensity={look.groundIntensity} color={look.ground} position={[0, -12, 0]} rotation-x={-Math.PI / 2} scale={[30, 30, 1]} />
              <Lightformer form="rect" intensity={0.8} color="#84a8b8" position={[16, 2, 10]} rotation-y={-Math.PI / 2} scale={[14, 4, 1]} />
            </Environment>
          )}

          <WorldLayer
            altitude={altitude}
            biome={biome}
            scrollRef={scrollRef}
            lite={softwareRendering}
          />

          <ModelErrorBoundary onError={handleError}>
            <Suspense fallback={<LoadingStandIn />}>
              <RafaleModel
                sequenceState={sequenceState}
                scenario={scenario}
                reducedMotion={reducedMotion}
                activeInspectionId={activeInspectionId}
                selectedInspectionId={selectedInspectionId}
                scrollRef={scrollRef}
                castShadows={!softwareRendering}
                onReady={handleReady}
                onTransitionChange={handleTransitionChange}
                onInspectionPreview={onInspectionPreview}
                onInspectionToggle={onInspectionToggle}
                maxFrameStepMs={softwareRendering ? SOFTWARE_MAX_FRAME_STEP_MS : undefined}
              />
            </Suspense>
          </ModelErrorBoundary>

          <OrbitControls
            makeDefault
            enabled={controlsEnabled}
            enableDamping
            dampingFactor={0.08}
            enablePan={false}
            maxDistance={120}
            minDistance={6}
          />
        </Canvas>
      ) : mounted ? (
        <WebGlFallback />
      ) : (
        <div className="grid h-full place-items-center px-8 text-center">
          <div className="max-w-sm border border-line bg-panel/70 px-5 py-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-ink-dim">
            Préparation de la vue 3D locale
          </div>
        </div>
      )}

      <span className="pointer-events-none absolute left-0 top-0 h-8 w-8 border-l border-t border-accent" />
      <span className="pointer-events-none absolute right-0 top-0 h-8 w-8 border-r border-t border-accent" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 border-b border-l border-accent" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 border-b border-r border-accent" />

      <div className="pointer-events-none absolute left-3 top-3 border border-line-bright bg-panel/90 px-2.5 py-1.5 font-mono uppercase sm:left-4 sm:top-4">
        <span className="block text-[9px] tracking-[0.18em] text-ink-faint">SYSTEM</span>
        <span className="mt-0.5 block text-[10px] tracking-[0.12em] text-ink-dim">
          RAFALE F4 — VUE ILLUSTRATIVE
        </span>
      </div>
      <div className="pointer-events-none absolute right-3 top-3 border border-line-bright bg-panel/90 px-2.5 py-1.5 text-right font-mono uppercase sm:right-4 sm:top-4">
        <span className="block text-[9px] tracking-[0.18em] text-ink-faint">STATE</span>
        <span className="mt-0.5 block text-[10px] tracking-[0.14em] text-accent">
          {sequenceState}
        </span>
      </div>
      <div className="pointer-events-none absolute right-3 top-16 hidden border border-line-bright bg-panel/85 px-2.5 py-1.5 text-right font-mono uppercase sm:right-4 sm:top-[4.6rem] sm:block">
        <span className="block text-[9px] tracking-[0.18em] text-ink-faint">SCÉNARIO</span>
        <span className="mt-0.5 block text-[10px] tracking-[0.12em] text-ink-dim">
          {RAFALE_SCENARIO_COPY[scenario].label}
        </span>
      </div>

      {activeInspection ? (
        <div
          className="pointer-events-none absolute left-3 top-16 flex max-w-[70%] items-center gap-2 sm:left-4 sm:top-[4.6rem]"
          aria-hidden="true"
        >
          <span className="border-r border-accent bg-panel/90 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ink sm:text-[9px]">
            {activeInspection.label}
          </span>
          <span className="h-px w-8 shrink-0 bg-accent sm:w-12" />
        </div>
      ) : null}

      {webGlAvailable && (sensorsLegend || linkLegend) ? (
        <div
          className="pointer-events-none absolute bottom-12 left-3 max-w-[calc(100%-1.5rem)] border border-line-bright bg-panel/85 px-2.5 py-1.5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-ink-dim sm:bottom-14 sm:left-4"
          aria-hidden="true"
        >
          {sensorsLegend ? (
            <>
              <span className="text-[#7fb6c9]">RBE2</span> ·{" "}
              <span className="text-[#e2b36a]">OSF</span> ·{" "}
              <span className="text-accent">SPECTRA</span> — secteurs symboliques, sans échelle
            </>
          ) : (
            <>Liaison de données du Meteor · tracé symbolique</>
          )}
        </div>
      ) : null}

      <div
        className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] border border-line-bright bg-panel/90 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.13em] text-ink-dim sm:bottom-4 sm:left-4 sm:text-[10px]"
        aria-live="polite"
      >
        {statusCopy}
      </div>
      {webGlAvailable ? (
        <div className="pointer-events-none absolute bottom-3 right-3 hidden border border-line-bright bg-panel/85 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.13em] text-ink-faint sm:block">
          {controlsEnabled
            ? "Glisser · pivoter / molette · zoomer"
            : transitionRunning
              ? "Recomposition en cours"
              : "Caméra verrouillée dans cet état"}
        </div>
      ) : null}
    </div>
  );
}

function subscribeToHydration() {
  return () => undefined;
}

function getClientHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}
