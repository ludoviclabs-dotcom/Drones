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
      <lineBasicMaterial color="#d8cfb5" />
    </lineSegments>
  );
}

// ---------------------------------------------------------------------------
// Wireframe GLB (Blender export — lignes ou mesh en mode wireframe)
// ---------------------------------------------------------------------------

function GlbWireframe({ path }: { path: string }) {
  const { scene } = useGLTF(path);

  const wireframeScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Mesh solide : passer en wireframe filaire (compatible matériau existant)
        child.material = new THREE.MeshBasicMaterial({
          color: "#d8cfb5",
          wireframe: true,
        });
      } else if (child instanceof THREE.LineSegments || child instanceof THREE.Line) {
        // Lignes exportées depuis Blender (edge-only mesh)
        child.material = new THREE.LineBasicMaterial({ color: "#d8cfb5" });
      }
    });
    return clone;
  }, [scene]);

  return <primitive object={wireframeScene} />;
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
  const color = isSelected ? "#d2683c" : hovered ? "#e8a875" : "#8a8a82";
  const scale = isSelected ? 1.25 : hovered ? 1.1 : 1;

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
      <Canvas camera={{ position: [2.2, 1.8, 2.4], fov: 38 }}>
        <color attach="background" args={["#16150f"]} />
        <ambientLight intensity={0.7} />

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
          minDistance={1.6}
          maxDistance={6}
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
