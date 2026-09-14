"use client";

// React Compiler can mis-optimize R3F re-renders in some cases; opt out.
"use no memo";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import {
  PATRIOT_ASSET_PATH,
  PATRIOT_FIRE_MODE_COPY,
  PATRIOT_SEQUENCE_COPY,
  type PatriotFireMode,
  type PatriotSequenceState,
} from "@/data/hud/patriot";
import {
  patriotInspectableById,
  type PatriotInspectableId,
} from "@/data/hud/patriot-inspection";
import { PATRIOT_CAMERA_POSES } from "@/data/hud/patriot-motion";
import { PatriotModel } from "./PatriotModel";
import { SOFTWARE_MAX_FRAME_STEP_MS, useRenderProfile } from "./render-profile";

type AssetStatus = "loading" | "ready" | "error" | "unavailable";

const OVERVIEW_POSE = PATRIOT_CAMERA_POSES.overview;
const SCENE_BACKGROUND = "#11100c";

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

function LoadingStandIn() {
  return (
    <group>
      <mesh position={[0, 2.4, -1]}>
        <boxGeometry args={[2.9, 1.6, 10.3]} />
        <meshBasicMaterial color="#6d8a9a" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 3.2, 0.9]}>
        <boxGeometry args={[2.3, 2, 6.1]} />
        <meshBasicMaterial color="#e07a4d" wireframe transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function ModelErrorStandIn() {
  return (
    <mesh position={[0, 2.5, -1]}>
      <boxGeometry args={[3.2, 3, 10]} />
      <meshBasicMaterial color="#b9602e" wireframe transparent opacity={0.75} />
    </mesh>
  );
}

function WebGlFallback() {
  return (
    <div className="grid h-full place-items-center px-6 text-center">
      <p className="max-w-sm border border-line bg-panel/70 px-5 py-4 font-mono text-[11px] leading-relaxed text-ink-dim">
        La vue 3D requiert WebGL 2, indisponible dans ce navigateur. La
        séquence, les modes de tir et l’inspection des sous-ensembles restent
        utilisables dans la page.
      </p>
    </div>
  );
}

/** États où l'observation libre est permise, au repos seulement. */
function isObservationState(state: PatriotSequenceState): boolean {
  return state === "overview" || state === "inspect" || state === "complete";
}

export function PatriotScene3D({
  sequenceState,
  fireMode,
  reducedMotion,
  activeInspectionId,
  selectedInspectionId,
  onInspectionPreview,
  onInspectionToggle,
}: {
  sequenceState: PatriotSequenceState;
  fireMode: PatriotFireMode;
  reducedMotion: boolean;
  activeInspectionId: PatriotInspectableId | null;
  selectedInspectionId: PatriotInspectableId | null;
  onInspectionPreview: (id: PatriotInspectableId | null) => void;
  onInspectionToggle: (id: PatriotInspectableId) => void;
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

  const controlsEnabled = !transitionRunning && isObservationState(sequenceState);
  const activeInspection = patriotInspectableById(activeInspectionId);
  const interceptorInspection = activeInspectionId === "interceptor";
  const inspectionCallout =
    interceptorInspection && (sequenceState === "overview" || sequenceState === "inspect" ||
      sequenceState === "emplace" || sequenceState === "elevate")
      ? "PAC-3 MSE · CONTENEURS 04 ET 03"
      : activeInspection?.label;

  useEffect(() => {
    if (mounted && webGlAvailable) useGLTF.preload(PATRIOT_ASSET_PATH, false, true);
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
      aria-label={`Vue 3D Patriot PAC-3 MSE. État : ${PATRIOT_SEQUENCE_COPY[sequenceState].label}.`}
      aria-describedby="patriot-a11y-description"
      data-patriot-motion={transitionRunning ? "running" : "idle"}
      data-patriot-reduced-motion={reducedMotion ? "true" : "false"}
      data-patriot-asset={assetStatus}
      data-patriot-model-active={activeInspectionId ?? "none"}
      data-patriot-model-selected={selectedInspectionId ?? "none"}
      data-patriot-fire-mode={fireMode}
      data-patriot-render-profile={renderProfile}
    >
      {mounted && webGlAvailable ? (
        <Canvas
          aria-hidden="true"
          camera={{ position: [...OVERVIEW_POSE.position], fov: 32, near: 0.2, far: 4000 }}
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
          <color attach="background" args={[SCENE_BACKGROUND]} />
          {/* La brume commence au-delà du cadrage le plus large : elle estompe
              le sol lointain et la fin de la traînée sans laver la batterie. */}
          <fog attach="fog" args={[SCENE_BACKGROUND, 150, 950]} />

          {/* Éclairage local fixe : aucune ressource externe. L'environnement
              de réflexion est rendu UNE fois au montage, à partir de simples
              panneaux lumineux (frames = 1) : aucune boucle ajoutée. */}
          {/* Sans environnement de réflexion, le profil allégé remonte
              l'ambiance pour garder la même lecture des volumes. */}
          <ambientLight intensity={softwareRendering ? 0.55 : 0.32} color="#94a2a7" />
          <hemisphereLight args={["#d8ded9", "#221f16", softwareRendering ? 1.15 : 0.85]} />
          <directionalLight
            castShadow={!softwareRendering}
            color="#ece6d5"
            intensity={2.2}
            position={[-38, 60, -30]}
            shadow-bias={-0.0003}
            shadow-normalBias={0.02}
            shadow-mapSize-height={2048}
            shadow-mapSize-width={2048}
            shadow-camera-left={-62}
            shadow-camera-right={62}
            shadow-camera-top={62}
            shadow-camera-bottom={-62}
            shadow-camera-near={10}
            shadow-camera-far={170}
          />
          <directionalLight color="#c8793f" intensity={0.8} position={[40, 18, 30]} />
          <directionalLight color="#84a8b8" intensity={0.6} position={[-40, 25, 45]} />
          {softwareRendering ? null : (
            <Environment frames={1} resolution={128} environmentIntensity={0.55}>
              <Lightformer form="rect" intensity={2.2} color="#e8e4d8" position={[0, 12, 0]} rotation-x={Math.PI / 2} scale={[20, 20, 1]} />
              <Lightformer form="rect" intensity={1.1} color="#c8793f" position={[14, 3, 6]} rotation-y={-Math.PI / 2} scale={[12, 4, 1]} />
              <Lightformer form="rect" intensity={0.9} color="#84a8b8" position={[-14, 4, -8]} rotation-y={Math.PI / 2} scale={[12, 5, 1]} />
            </Environment>
          )}

          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2400, 2400]} />
            <meshStandardMaterial color="#15140f" roughness={1} metalness={0} />
          </mesh>
          {/* Maille de 4 m ; axes centraux de la même teinte que la grille : à
              cette échelle, des axes clairs traverseraient toute la batterie. */}
          <gridHelper args={[240, 60, "#3a3727", "#2c291c"]} position={[0, 0.015, 8]} />

          <ModelErrorBoundary onError={handleError}>
            <Suspense fallback={<LoadingStandIn />}>
              <PatriotModel
                sequenceState={sequenceState}
                fireMode={fireMode}
                reducedMotion={reducedMotion}
                activeInspectionId={activeInspectionId}
                selectedInspectionId={selectedInspectionId}
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
            maxDistance={170}
            maxPolarAngle={1.42}
            minDistance={7}
            minPolarAngle={0.25}
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
          PATRIOT PAC-3 MSE — VUE ILLUSTRATIVE
        </span>
      </div>
      <div className="pointer-events-none absolute right-3 top-3 border border-line-bright bg-panel/90 px-2.5 py-1.5 text-right font-mono uppercase sm:right-4 sm:top-4">
        <span className="block text-[9px] tracking-[0.18em] text-ink-faint">STATE</span>
        <span className="mt-0.5 block text-[10px] tracking-[0.14em] text-accent">
          {sequenceState}
        </span>
      </div>
      <div className="pointer-events-none absolute right-3 top-16 hidden border border-line-bright bg-panel/85 px-2.5 py-1.5 text-right font-mono uppercase sm:right-4 sm:top-[4.6rem] sm:block">
        <span className="block text-[9px] tracking-[0.18em] text-ink-faint">MODE</span>
        <span className="mt-0.5 block text-[10px] tracking-[0.12em] text-ink-dim">
          {PATRIOT_FIRE_MODE_COPY[fireMode].label}
        </span>
      </div>

      {activeInspection ? (
        <div
          className="pointer-events-none absolute left-3 top-16 flex max-w-[70%] items-center gap-2 sm:left-4 sm:top-[4.6rem]"
          aria-hidden="true"
        >
          <span className="border-r border-accent bg-panel/90 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ink sm:text-[9px]">
            {inspectionCallout}
          </span>
          <span className="h-px w-8 shrink-0 bg-accent sm:w-12" />
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
