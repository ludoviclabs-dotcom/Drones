"use client";

import { useSyncExternalStore } from "react";

/**
 * Profil de rendu de la planche Patriot, décidé avant la création du contexte
 * WebGL.
 *
 * - `hardware` : rendu accéléré, qualité complète.
 * - `software` : WebGL rendu en logiciel (GPU sur liste noire, machine
 *   virtuelle, agent de test : SwiftShader, llvmpipe…). Mesuré sur SwiftShader
 *   à ~890 × 530 px, une image complète coûte ~1,25 s ; l'éclairage
 *   d'environnement en représente la moitié, l'anticrénelage un quart. Le
 *   profil allégé les retire (ainsi que les ombres) et revient à ~0,25 s.
 * - `none` : pas de WebGL 2, que three.js exige. Sans cette détection, la
 *   création du rendu échouerait en silence et la vue resterait vide.
 */
export type PatriotRenderProfile = "hardware" | "software" | "none";

/**
 * Plafond du pas de temps par frame en rendu logiciel (ms). À ~0,25 s par
 * image, le plafond standard de 64 ms étirerait une mise en batterie de 5,5 s
 * au-delà de 20 s ; celui-ci garde les transitions proches de leur durée, en
 * moins d'images.
 */
export const SOFTWARE_MAX_FRAME_STEP_MS = 200;

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;
/** Valeurs masquées renvoyées par `RENDERER` quand le navigateur cache le GPU. */
const MASKED_RENDERER = /^(webkit webgl|mozilla)$/i;

let cachedProfile: PatriotRenderProfile | null = null;

function detectRenderProfile(): PatriotRenderProfile {
  if (typeof document === "undefined") return "hardware";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return "none";
    let renderer = String(gl.getParameter(gl.RENDERER) ?? "");
    // Chrome masque `RENDERER` ; l'extension de débogage donne alors le nom
    // réel. Firefox renvoie déjà ce nom (et y déconseille l'extension).
    if (MASKED_RENDERER.test(renderer.trim())) {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      if (info) renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) ?? "");
    }
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return SOFTWARE_RENDERER.test(renderer) ? "software" : "hardware";
  } catch {
    return "none";
  }
}

/** Détection unique et mise en cache : un seul contexte de sonde par page. */
function getProfileSnapshot(): PatriotRenderProfile {
  cachedProfile ??= detectRenderProfile();
  return cachedProfile;
}

function getServerSnapshot(): PatriotRenderProfile {
  return "hardware";
}

function subscribe(): () => void {
  return () => undefined;
}

/** Profil de rendu de ce navigateur (client uniquement ; `hardware` au serveur). */
export function useRenderProfile(): PatriotRenderProfile {
  return useSyncExternalStore(subscribe, getProfileSnapshot, getServerSnapshot);
}
