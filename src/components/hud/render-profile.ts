"use client";

import { useSyncExternalStore } from "react";

/**
 * Profil de rendu des planches HUD 3D, décidé avant la création du contexte
 * WebGL.
 *
 * - `hardware` : rendu accéléré, qualité complète.
 * - `software` : WebGL rendu en logiciel (GPU sur liste noire, machine
 *   virtuelle, agent de test : SwiftShader, llvmpipe…). Une image y coûte de
 *   l'ordre du dixième de seconde ; chaque scène décide de ce qu'elle allège
 *   (anticrénelage, ombres, éclairage d'environnement…).
 * - `none` : pas de WebGL 2, que three.js exige. R3F crée le rendu dans un
 *   effet asynchrone, hors de toute frontière d'erreur React, et la prop
 *   `fallback` de `<Canvas>` ne sert qu'aux navigateurs sans `<canvas>` : sans
 *   cette détection, l'échec serait silencieux et la vue resterait vide.
 */
export type RenderProfile = "hardware" | "software" | "none";

/**
 * Plafond du pas de temps par frame en rendu logiciel (ms). À ~0,1–0,25 s par
 * image, le plafond standard de 64 ms étirerait chaque transition d'autant en
 * temps réel ; celui-ci la garde proche de sa durée, en moins d'images, sans
 * qu'une seule frame puisse en consommer plus de 200 ms.
 */
export const SOFTWARE_MAX_FRAME_STEP_MS = 200;

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;
/** Valeurs masquées renvoyées par `RENDERER` quand le navigateur cache le GPU. */
const MASKED_RENDERER = /^(webkit webgl|mozilla)$/i;

/**
 * Sonde WebGL 2, sans cache. Exportée pour les tests ; les composants passent
 * par `useRenderProfile`, qui ne sonde qu'une fois par page.
 */
export function detectRenderProfile(
  doc: Pick<Document, "createElement"> | undefined = globalThis.document,
): RenderProfile {
  if (!doc) return "hardware";
  try {
    const gl = doc.createElement("canvas").getContext("webgl2");
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

let cachedProfile: RenderProfile | null = null;

/** Détection unique et mise en cache : un seul contexte de sonde par page. */
function getProfileSnapshot(): RenderProfile {
  cachedProfile ??= detectRenderProfile();
  return cachedProfile;
}

function getServerSnapshot(): RenderProfile {
  return "hardware";
}

function subscribe(): () => void {
  return () => undefined;
}

/** Profil de rendu de ce navigateur (client uniquement ; `hardware` au serveur). */
export function useRenderProfile(): RenderProfile {
  return useSyncExternalStore(subscribe, getProfileSnapshot, getServerSnapshot);
}
