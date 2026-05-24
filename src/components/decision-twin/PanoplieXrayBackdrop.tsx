"use client";

// React Compiler may mis-optimize R3F components; opt-out explicitly.
"use no memo";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Fond 3D abstrait pour le canvas X-Ray.
 *
 * Esthétique « salle d'analyse OSINT » :
 *   - grille radar subtile au sol (XZ plane)
 *   - 3 anneaux concentriques discrets (cible passive)
 *   - ~24 marqueurs "sources" dispersés sur une dôme englobante
 *   - 6 lignes fines reliant certains marqueurs (constellation OSINT)
 *   - 3 marqueurs ambre rares (preuves saillantes)
 *
 * Tous les éléments sont statiques — le sentiment de mouvement vient de
 * l'orbit utilisateur. Conforme `prefers-reduced-motion` par construction.
 *
 * À monter à l'intérieur d'un `<Canvas>` R3F. Pose un `<fog />` qui s'applique
 * à toute la scène : tout mesh placé après bénéficie de la profondeur.
 *
 * Réutilisable pour d'autres pages système (TB2, F-35, etc.) — aucune
 * dépendance au slug de l'avion.
 */
export function PanoplieXrayBackdrop() {
  // --- Marqueurs OSINT (positions déterministes — seed) ---
  const { neutralPositions, accentPositions } = useMemo(() => {
    const rng = mulberry32(20260524); // seed déterministe
    const neutral: number[] = [];
    const accent: number[] = [];
    const total = 24;
    for (let i = 0; i < total; i++) {
      // Distribution sur une demi-sphère englobante (haut + côtés, pas sous l'avion)
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(rng() * 0.85); // 0..~0.5π → hémisphère supérieur
      const r = 3.2 + rng() * 0.6; // rayon 3.2..3.8
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi) * 0.55; // aplati en hauteur
      const z = r * Math.sin(phi) * Math.sin(theta);
      // 3 points sur 24 en ambre — preuves saillantes
      if (i % 8 === 0) {
        accent.push(x, y, z);
      } else {
        neutral.push(x, y, z);
      }
    }
    return {
      neutralPositions: new Float32Array(neutral),
      accentPositions: new Float32Array(accent),
    };
  }, []);

  // --- Constellation : quelques lignes reliant des marqueurs neutres ---
  const constellationGeometry = useMemo(() => {
    const pts: number[] = [];
    const n = neutralPositions.length / 3;
    // 6 segments aléatoires entre marqueurs neutres (déterministe)
    const rng = mulberry32(819273); // seed constellation
    for (let i = 0; i < 6; i++) {
      const a = Math.floor(rng() * n);
      let b = Math.floor(rng() * n);
      if (b === a) b = (b + 1) % n;
      pts.push(
        neutralPositions[a * 3],
        neutralPositions[a * 3 + 1],
        neutralPositions[a * 3 + 2],
        neutralPositions[b * 3],
        neutralPositions[b * 3 + 1],
        neutralPositions[b * 3 + 2],
      );
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    return geom;
  }, [neutralPositions]);

  const neutralGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(neutralPositions, 3));
    return geom;
  }, [neutralPositions]);

  const accentGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(accentPositions, 3));
    return geom;
  }, [accentPositions]);

  return (
    <group>
      {/* Brouillard de profondeur — base de la palette */}
      <fog attach="fog" args={["#16150f", 4.5, 9]} />

      {/* Grille radar sous l'avion (XZ plane) */}
      <gridHelper
        args={[12, 24, "#4c4731", "#33301f"]}
        position={[0, -1.4, 0]}
      />

      {/* Anneaux radar concentriques au sol */}
      {[1.6, 2.6, 3.6].map((radius, idx) => (
        <mesh
          key={radius}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.39, 0]}
        >
          <ringGeometry args={[radius, radius + 0.008, 96]} />
          <meshBasicMaterial
            color={idx === 1 ? "#6d8a9a" : "#4c4731"}
            transparent
            opacity={idx === 1 ? 0.22 : 0.16}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Constellation : segments reliant les marqueurs neutres */}
      <lineSegments geometry={constellationGeometry}>
        <lineBasicMaterial color="#4c4731" transparent opacity={0.35} />
      </lineSegments>

      {/* Marqueurs OSINT neutres */}
      <points geometry={neutralGeometry}>
        <pointsMaterial
          color="#9c9783"
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </points>

      {/* Marqueurs preuves saillantes (ambre rares) */}
      <points geometry={accentGeometry}>
        <pointsMaterial
          color="#d2683c"
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// --- Mulberry32 : PRNG déterministe, 1 ligne, 0 dépendance ---
// On veut une distribution reproductible des marqueurs OSINT pour que la
// composition reste stable d'un rendu à l'autre (et entre SSR/CSR si jamais).
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
