"use client";

// React Compiler can mis-optimize R3F re-renders in some cases; opt-out for safety.
"use no memo";

import { useMemo, useState, Suspense } from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { DecisionTwinNode } from "@/data/decision-twin/types";
import type { XrayModelOverride } from "@/data/aviation-3d";
import type { Wireframe3DSpec } from "@/data/aviation-3d/types";
import { PanoplieXrayBackdrop } from "./PanoplieXrayBackdrop";

// ---------------------------------------------------------------------------
// Wireframe procédural (fallback — données générées en JS sans asset externe)
// ---------------------------------------------------------------------------

function ProceduralWireframe({ spec }: { spec: Wireframe3DSpec }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(
      spec.segments.flatMap(([a, b]) => [...a, ...b]),
    );
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [spec]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#d8ded9" />
    </lineSegments>
  );
}

// ---------------------------------------------------------------------------
// Wireframe GLB (Blender export) — rendu « X-Ray premium »
//
// Stratégie double-matériau : pour chaque mesh source, on superpose
//   1. une coque solide gris-bleu semi-transparente (matière aéronautique)
//   2. un overlay edges blanc cassé (lecture wireframe pédagogique préservée)
//
// Le cockpit (mesh nommé "Verriere" / "Canopy") reçoit un matériau distinct
// fumé bleu-noir pour ressortir comme zone abstraite non détaillée.
// ---------------------------------------------------------------------------

// Palette Rafale OSINT — alignée sur les vars CSS du design system
const RAFALE = {
  bodyColor: "#8f9a9d", // bluegrey — coque gris-bleu aéronautique
  edgeColor: "#d8ded9", // light-edge — overlay arêtes blanc cassé
  canopyColor: "#172022", // cockpit-smoke — verrière fumée
} as const;

/** Référence stable : un `[]` par défaut relancerait le clonage à chaque rendu. */
const NO_HIDDEN_NODES: readonly string[] = [];

function GlbWireframe({
  path,
  hiddenNodes = NO_HIDDEN_NODES,
}: {
  path: string;
  hiddenNodes?: readonly string[];
}) {
  // GLB meshopt : décodeur embarqué par three-stdlib, aucune requête réseau.
  // Draco désactivé — son décodeur drei viendrait du CDN gstatic.
  const { scene } = useGLTF(path, false, true);

  const styledScene = useMemo(() => {
    const clone = scene.clone(true);
    // Retirés du clone, pas seulement masqués : la passe d'arêtes ci-dessous
    // parcourt aussi les nœuds invisibles et accroche ses contours au parent.
    for (const name of hiddenNodes) {
      clone.getObjectByName(name)?.removeFromParent();
    }
    // Collecte des paires (mesh source → edges overlay) à ajouter en post-traversal
    // pour éviter de muter l'arbre pendant qu'on l'itère.
    const edgeOverlays: Array<{ parent: THREE.Object3D; line: THREE.LineSegments }> = [];

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // La compression meshopt peut glisser un nœud sans nom sous le nœud
        // nommé : on lit alors le nom du parent.
        const name = (child.name || child.parent?.name || "").toLowerCase();
        const isCanopy =
          name.includes("verriere") || (name.includes("canopy") && !name.includes("frame"));

        // 1. Coque solide
        child.material = isCanopy
          ? new THREE.MeshPhysicalMaterial({
              color: RAFALE.canopyColor,
              roughness: 0.25,
              metalness: 0.1,
              transmission: 0.55, // léger effet verre fumé
              transparent: true,
              opacity: 0.7,
              depthWrite: false,
            })
          : new THREE.MeshStandardMaterial({
              color: RAFALE.bodyColor,
              roughness: 0.65,
              metalness: 0.2,
              transparent: true,
              opacity: 0.45, // X-Ray : on voit le wireframe à travers
              depthWrite: false,
              side: THREE.DoubleSide,
            });

        // 2. Overlay arêtes (skip pour la verrière — on garde le verre lisse)
        if (!isCanopy && child.geometry) {
          const edges = new THREE.EdgesGeometry(child.geometry, 25); // angle seuil 25°
          const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({
              color: RAFALE.edgeColor,
              transparent: true,
              opacity: 0.85,
            }),
          );
          line.position.copy(child.position);
          line.rotation.copy(child.rotation);
          line.scale.copy(child.scale);
          edgeOverlays.push({ parent: child.parent ?? clone, line });
        }
      } else if (child instanceof THREE.LineSegments || child instanceof THREE.Line) {
        child.material = new THREE.LineBasicMaterial({ color: RAFALE.edgeColor });
      }
    });

    // Ajout des overlays edges en dehors de la traversée
    for (const { parent, line } of edgeOverlays) {
      parent.add(line);
    }

    return clone;
  }, [hiddenNodes, scene]);

  return <primitive object={styledScene} />;
}

// ---------------------------------------------------------------------------
// Hotspot 3D cliquable
// ---------------------------------------------------------------------------

function Hotspot({
  node,
  isSelected,
  onSelect,
}: {
  node: DecisionTwinNode;
  isSelected: boolean;
  onSelect: (node: DecisionTwinNode) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pos = node.position3d ?? { x: 0, y: 0, z: 0 };
  // Palette Panoplie : ambre actif, ambre clair au survol, gris-bleu au repos
  const color = isSelected ? "#c8793f" : hovered ? "#e8a875" : "#8f9a9d";
  const scale = isSelected ? 1.3 : hovered ? 1.12 : 1;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(node);
  };
  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "";
  };

  return (
    <mesh
      position={[pos.x, pos.y, pos.z]}
      scale={scale}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

/**
 * Viewer 3D orbitale pour le System X-Ray.
 *
 * Priorité de rendu :
 *   1. glbPath → charge l'asset Blender (.glb meshopt) via useGLTF
 *   2. spec    → wireframe procédural (fallback JS, 0 Ko réseau)
 *
 * L'un des deux doit être fourni ; si glbPath est fourni sans spec,
 * le Suspense affiche un état de chargement neutre.
 */
// Paramètres caméra par type de modèle. Avec un placement (XRAY_MODEL_OVERRIDES),
// missiles et radars tiennent dans ~3 unités, comme un chasseur : la caméra
// trois-quarts, un peu latérale, recule assez pour cadrer aussi les repères
// de contexte qui orbitent autour du modèle. La position « aircraft » reste
// celle des chasseurs sans placement ; un placement peut fournir la sienne.
const CAMERA_PRESETS = {
  aircraft: { position: [3.8, 2.6, 4.1] as [number, number, number], fov: 22, minDist: 3.5, maxDist: 10 },
  radar: { position: [6.7, 4.7, 4.7] as [number, number, number], fov: 24, minDist: 4.5, maxDist: 14 },
  missile: { position: [6.3, 4.2, 3.6] as [number, number, number], fov: 26, minDist: 3.0, maxDist: 10 },
} as const;

/**
 * Repère des repères X-Ray (X envergure, Y longueur nez +, Z hauteur) vers le
 * repère glTF (Y haut, nez vers -Z) : un quart de tour autour de X.
 */
const SPEC_TO_GLTF_ROTATION: [number, number, number] = [-Math.PI / 2, 0, 0];

export function SystemXray3DView({
  spec,
  glbPath,
  modelOverride,
  nodes,
  selectedNodeId,
  onSelectNode,
  modelType = "aircraft",
}: {
  spec?: Wireframe3DSpec;
  glbPath?: string;
  /** Placement du GLB dans le repère des repères (voir XRAY_MODEL_OVERRIDES). */
  modelOverride?: XrayModelOverride;
  nodes: DecisionTwinNode[];
  selectedNodeId?: string;
  onSelectNode: (node: DecisionTwinNode) => void;
  modelType?: keyof typeof CAMERA_PRESETS;
}) {
  const cam = CAMERA_PRESETS[modelType];
  // Avec un placement, repères et filaire de repli sont tournés dans le
  // repère glTF du modèle ; sans placement, rien ne change.
  const specRotation = modelOverride ? SPEC_TO_GLTF_ROTATION : undefined;
  return (
    <div className="relative aspect-square w-full overflow-hidden border border-line bg-surface">
      {/* fov réduit (~110mm équivalent) : focale longue → moins de distorsion
          du nez, silhouette plus proche d'une vue plan-trois-quart industrielle.
          Caméra reculée en conséquence pour conserver le cadrage. */}
      <Canvas
        camera={{
          position: modelOverride?.cameraPosition
            ? [...modelOverride.cameraPosition]
            : cam.position,
          fov: cam.fov,
        }}
      >
        <color attach="background" args={["#16150f"]} />

        {/* Éclairage X-Ray premium :
            - ambient froid : remplit les zones d'ombre sans écraser
            - key light haut-droite : modèle la coque gris-bleu
            - rim ambre rasant gauche : détache la silhouette du fond OSINT */}
        <ambientLight intensity={0.55} color="#9fb0b8" />
        <directionalLight position={[4, 5, 3]} intensity={0.9} color="#e8e6dc" />
        <directionalLight position={[-3, 1.5, -2]} intensity={0.55} color="#c8793f" />

        {/* Fond OSINT abstrait — grille radar + constellation de sources */}
        <PanoplieXrayBackdrop />

        {glbPath ? (
          <Suspense
            fallback={
              spec ? (
                <group rotation={specRotation}>
                  <ProceduralWireframe spec={spec} />
                </group>
              ) : null
            }
          >
            <group
              rotation={modelOverride?.rotation ? [...modelOverride.rotation] : undefined}
              scale={modelOverride?.scale ?? 1}
            >
              <GlbWireframe path={glbPath} hiddenNodes={modelOverride?.hiddenNodes} />
            </group>
          </Suspense>
        ) : spec ? (
          <ProceduralWireframe spec={spec} />
        ) : null}

        <group rotation={specRotation}>
          {nodes.map((node) => (
            <Hotspot
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              onSelect={onSelectNode}
            />
          ))}
        </group>

        <OrbitControls
          enablePan={false}
          minDistance={cam.minDist}
          maxDistance={cam.maxDist}
          enableDamping
          dampingFactor={0.1}
        />
      </Canvas>
      <span className="pointer-events-none absolute right-3 top-3 border border-line-bright bg-panel/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
        glisser pour pivoter · molette pour zoomer
      </span>
    </div>
  );
}
