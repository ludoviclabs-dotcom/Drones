"use client";

// React Compiler can mis-optimize R3F re-renders in some cases; opt-out for safety.
"use no memo";

import { useMemo, useState, Suspense } from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { DecisionTwinNode } from "@/data/decision-twin/types";
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

function GlbWireframe({ path }: { path: string }) {
  const { scene } = useGLTF(path);

  const styledScene = useMemo(() => {
    const clone = scene.clone(true);
    // Collecte des paires (mesh source → edges overlay) à ajouter en post-traversal
    // pour éviter de muter l'arbre pendant qu'on l'itère.
    const edgeOverlays: Array<{ parent: THREE.Object3D; line: THREE.LineSegments }> = [];

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name.toLowerCase();
        const isCanopy = name.includes("verriere") || name.includes("canopy");

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
  }, [scene]);

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
 *   1. glbPath → charge l'asset Blender (.glb Draco) via useGLTF
 *   2. spec    → wireframe procédural (fallback JS, 0 Ko réseau)
 *
 * L'un des deux doit être fourni ; si glbPath est fourni sans spec,
 * le Suspense affiche un état de chargement neutre.
 */
export function SystemXray3DView({
  spec,
  glbPath,
  nodes,
  selectedNodeId,
  onSelectNode,
}: {
  spec?: Wireframe3DSpec;
  glbPath?: string;
  nodes: DecisionTwinNode[];
  selectedNodeId?: string;
  onSelectNode: (node: DecisionTwinNode) => void;
}) {
  return (
    <div className="relative aspect-square w-full overflow-hidden border border-line bg-surface">
      {/* fov réduit (~110mm équivalent) : focale longue → moins de distorsion
          du nez, silhouette plus proche d'une vue plan-trois-quart industrielle.
          Caméra reculée en conséquence pour conserver le cadrage. */}
      <Canvas camera={{ position: [3.8, 2.6, 4.1], fov: 22 }}>
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
          <Suspense fallback={spec ? <ProceduralWireframe spec={spec} /> : null}>
            <GlbWireframe path={glbPath} />
          </Suspense>
        ) : spec ? (
          <ProceduralWireframe spec={spec} />
        ) : null}

        {nodes.map((node) => (
          <Hotspot
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            onSelect={onSelectNode}
          />
        ))}

        <OrbitControls
          enablePan={false}
          minDistance={3.5}
          maxDistance={10}
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
