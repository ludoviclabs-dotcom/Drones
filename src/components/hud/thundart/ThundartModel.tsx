"use client";

// React Compiler can mis-optimize R3F object graphs; keep this boundary explicit.
"use no memo";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { THUNDART_ASSET_PATH } from "@/data/hud/thundart";

export function ThundartModel({ onReady }: { onReady: () => void }) {
  const { scene } = useGLTF(THUNDART_ASSET_PATH);

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

  useEffect(() => {
    onReady();
  }, [onReady]);

  return <primitive object={model} dispose={null} />;
}
