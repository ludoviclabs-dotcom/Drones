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
import { OrbitControls, useGLTF } from "@react-three/drei";
import {
  THUNDART_ASSET_PATH,
  THUNDART_SEQUENCE_COPY,
  type ThundartSequenceState,
} from "@/data/hud/thundart";
import {
  thundartInspectableById,
  type ThundartInspectableId,
} from "@/data/hud/thundart-inspection";
import { THUNDART_CAMERA_POSES } from "@/data/hud/thundart-motion";
import { ThundartModel } from "./ThundartModel";

type AssetStatus = "loading" | "ready" | "error";

const OVERVIEW_POSE = THUNDART_CAMERA_POSES.overview;

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
    <group position={[0, 0.85, 0]}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[2.7, 0.6, 7.8]} />
        <meshBasicMaterial color="#6d8a9a" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 1.35, 1.1]}>
        <boxGeometry args={[2.3, 1.3, 3.7]} />
        <meshBasicMaterial color="#e07a4d" wireframe transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function ModelErrorStandIn() {
  return (
    <mesh position={[0, 1.6, 0]}>
      <boxGeometry args={[3.2, 2.2, 6]} />
      <meshBasicMaterial color="#b9602e" wireframe transparent opacity={0.75} />
    </mesh>
  );
}

function WebGlFallback() {
  return (
    <div className="grid h-full place-items-center px-6 text-center font-mono text-xs leading-relaxed text-ink-dim">
      La vue 3D requiert WebGL. La structure éditoriale et les contrôles restent
      disponibles dans la page.
    </div>
  );
}

export function ThundartScene3D({
  sequenceState,
  reducedMotion,
  activeInspectionId,
  selectedInspectionId,
  onInspectionPreview,
  onInspectionToggle,
}: {
  sequenceState: ThundartSequenceState;
  reducedMotion: boolean;
  activeInspectionId: ThundartInspectableId | null;
  selectedInspectionId: ThundartInspectableId | null;
  onInspectionPreview: (id: ThundartInspectableId | null) => void;
  onInspectionToggle: (id: ThundartInspectableId) => void;
}) {
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const [assetStatus, setAssetStatus] = useState<AssetStatus>("loading");
  const [transitionRunning, setTransitionRunning] = useState(false);

  // La caméra n'a qu'un propriétaire à la fois : pendant une transition, c'est
  // le directeur de mouvement ; au repos, et seulement dans les deux états
  // d'observation, ce sont les contrôles orbitaux.
  const controlsEnabled =
    !transitionRunning &&
    (sequenceState === "overview" || sequenceState === "inspect");
  const activeInspection = thundartInspectableById(activeInspectionId);

  useEffect(() => {
    useGLTF.preload(THUNDART_ASSET_PATH);
  }, []);

  const handleReady = useCallback(() => setAssetStatus("ready"), []);
  const handleError = useCallback(() => setAssetStatus("error"), []);
  const handleTransitionChange = useCallback(
    (running: boolean) => setTransitionRunning(running),
    [],
  );

  const statusCopy =
    assetStatus === "error"
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
      className="relative h-[clamp(26rem,62vw,46rem)] min-w-0 overflow-hidden border border-line bg-[#11100c] xl:h-[min(72vh,46rem)]"
      role="group"
      aria-label={`Vue 3D Thundart. État : ${THUNDART_SEQUENCE_COPY[sequenceState].label}.`}
      aria-describedby="thundart-a11y-description"
      data-thundart-motion={transitionRunning ? "running" : "idle"}
      data-thundart-reduced-motion={reducedMotion ? "true" : "false"}
      data-thundart-asset={assetStatus}
      data-thundart-model-active={activeInspectionId ?? "none"}
      data-thundart-model-selected={selectedInspectionId ?? "none"}
    >
      {mounted ? (
        <Canvas
          aria-hidden="true"
          camera={{
            position: [...OVERVIEW_POSE.position],
            fov: 30,
            near: 0.1,
            far: 120,
          }}
          dpr={[1, 1.5]}
          fallback={<WebGlFallback />}
          frameloop="demand"
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          shadows
        >
          <color attach="background" args={["#11100c"]} />
          {/*
            La brume commence au-delà du plus grand recul de caméra (état
            « complete », ~28 unités) : elle estompe le fond de grille sans
            jamais laver le sujet.
          */}
          <fog attach="fog" args={["#11100c", 34, 88]} />

          <ambientLight intensity={0.65} color="#94a2a7" />
          <hemisphereLight args={["#d8ded9", "#201d14", 1.1]} />
          <directionalLight
            castShadow
            color="#ece6d5"
            intensity={2.2}
            position={[-7, 12, -8]}
            shadow-bias={-0.0004}
            shadow-mapSize-height={1024}
            shadow-mapSize-width={1024}
          />
          <directionalLight
            color="#c8793f"
            intensity={0.8}
            position={[9, 4, 7]}
          />

          {/* Sol et grille dimensionnés pour que leur bord reste hors cadre
              même au recul maximal. Maille de 1 unité, conservée. */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[90, 90]} />
            <meshStandardMaterial color="#14130e" roughness={1} metalness={0} />
          </mesh>
          <gridHelper
            args={[60, 60, "#6d8a9a", "#33301f"]}
            position={[0, 0.012, 0]}
          />

          <ModelErrorBoundary onError={handleError}>
            <Suspense fallback={<LoadingStandIn />}>
              <ThundartModel
                sequenceState={sequenceState}
                reducedMotion={reducedMotion}
                activeInspectionId={activeInspectionId}
                selectedInspectionId={selectedInspectionId}
                onReady={handleReady}
                onTransitionChange={handleTransitionChange}
                onInspectionPreview={onInspectionPreview}
                onInspectionToggle={onInspectionToggle}
              />
            </Suspense>
          </ModelErrorBoundary>

          {/*
            `Bounds` a été retiré : il recadrait la caméra de son côté et serait
            entré en concurrence avec les poses par état. Le cadrage responsive
            est désormais assuré par `framingScaleForAspect`, déterministe.
            Le `target` n'est plus passé en prop non plus — il appartient au
            directeur de mouvement, qui le fait suivre l'état courant.
          */}
          <OrbitControls
            makeDefault
            enabled={controlsEnabled}
            enableDamping
            dampingFactor={0.08}
            enablePan={false}
            maxDistance={38}
            maxPolarAngle={1.45}
            minDistance={8}
            minPolarAngle={0.55}
          />
        </Canvas>
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
        <span className="block text-[7px] tracking-[0.18em] text-ink-faint">SYSTEM</span>
        <span className="mt-0.5 block text-[8px] tracking-[0.12em] text-ink-dim sm:text-[9px]">
          THUNDART — DEMONSTRATION VIEW
        </span>
      </div>
      <div className="pointer-events-none absolute right-3 top-3 border border-line-bright bg-panel/90 px-2.5 py-1.5 text-right font-mono uppercase sm:right-4 sm:top-4">
        <span className="block text-[7px] tracking-[0.18em] text-ink-faint">STATE</span>
        <span className="mt-0.5 block text-[8px] tracking-[0.14em] text-accent sm:text-[9px]">
          {sequenceState}
        </span>
      </div>

      {activeInspection ? (
        <div
          className="pointer-events-none absolute right-3 top-16 flex max-w-[68%] items-center gap-2 sm:right-4 sm:top-20"
          aria-hidden="true"
        >
          <span className="h-px w-8 shrink-0 bg-accent sm:w-12" />
          <span className="border-l border-accent bg-panel/90 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ink sm:text-[9px]">
            {activeInspection.label}
          </span>
        </div>
      ) : null}
      <div
        className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] border border-line-bright bg-panel/90 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.13em] text-ink-dim sm:bottom-4 sm:left-4 sm:text-[10px]"
        aria-live="polite"
      >
        {statusCopy}
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 hidden border border-line-bright bg-panel/85 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.13em] text-ink-faint sm:block">
        {controlsEnabled
          ? "Glisser · pivoter / molette · zoomer"
          : transitionRunning
            ? "Recomposition en cours"
            : "Caméra verrouillée dans cet état"}
      </div>
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
