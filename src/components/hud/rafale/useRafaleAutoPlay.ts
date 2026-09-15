"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { RafaleSequenceState } from "@/data/hud/rafale";
import { autoPlayStepDurationMs, isFinalRafaleStep } from "@/data/hud/rafale-autoplay";

export type RafaleAutoPlay = {
  /** De LECTURE AUTO jusqu'à Pause, une commande manuelle ou la fin de 06. */
  playing: boolean;
  /**
   * Durée (ms) du décompte de l'étape active, ou null s'il n'y en a pas :
   * lecture arrêtée, ou recomposition 3D en cours (le décompte l'attend).
   */
  countdownMs: number | null;
  toggle: () => void;
  stop: () => void;
};

/**
 * Lecture automatique de la séquence Rafale. Elle ne connaît pas les étapes :
 * pour avancer, elle appelle `nextStep`, la fonction du bouton Suivant.
 */
export function useRafaleAutoPlay({
  state,
  reducedMotion,
  transitionRunning,
  nextStep,
  restart,
}: {
  state: RafaleSequenceState;
  reducedMotion: boolean;
  /** Recomposition 3D en cours : le décompte de l'étape ne part qu'à son terme. */
  transitionRunning: boolean;
  nextStep: () => void;
  /** Retour à 01, quand la lecture est lancée depuis la dernière étape. */
  restart: () => void;
}): RafaleAutoPlay {
  const [playing, setPlaying] = useState(false);
  // L'unique minuteur de la lecture : tout nouveau décompte annule d'abord
  // celui qui court, il n'y en a jamais deux.
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current === null) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    setPlaying(false);
  }, [clearTimer]);

  const toggle = useCallback(() => {
    if (playing) {
      stop();
      return;
    }
    if (isFinalRafaleStep(state)) restart();
    setPlaying(true);
  }, [playing, restart, state, stop]);

  // Dérivé dans le même rendu que le bouton et la barre de progression : ils
  // montrent un décompte si et seulement si l'effet ci-dessous en pose un.
  const countdownMs =
    playing && !transitionRunning ? autoPlayStepDurationMs(state, reducedMotion) : null;

  // Effet de mise en page, pas effet passif : le minuteur est posé dans le
  // commit même qui affiche l'étape, jamais un instant après. Le nettoyage
  // l'annule à chaque changement (étape, pause, transition, démontage).
  useLayoutEffect(() => {
    if (countdownMs === null) return;
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      if (isFinalRafaleStep(state)) setPlaying(false);
      else nextStep();
    }, countdownMs);
    return clearTimer;
  }, [clearTimer, countdownMs, nextStep, state]);

  return { playing, countdownMs, toggle, stop };
}
