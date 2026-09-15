/**
 * Planche Rafale F4 · Meteor — lecture automatique de la séquence.
 *
 * Régler les durées : STEP_DURATIONS_MS donne une durée (ms) par étape,
 * numérotée comme la barre 01 → 06. C'est le temps de lecture de l'étape au
 * repos : le décompte ne démarre qu'une fois la recomposition 3D de l'étape
 * terminée (jusqu'à ~5 s pour le départ). Il est doublé quand l'utilisateur
 * demande un mouvement réduit. La lecture s'arrête au terme du décompte de 06.
 */

import { RAFALE_SEQUENCE_STATES, rafaleStateIndex, type RafaleSequenceState } from "./rafale";

/** Numéro affiché d'une étape, de 01 à 06. */
export type RafaleStepNumber = 1 | 2 | 3 | 4 | 5 | 6;

export const STEP_DURATIONS_MS = {
  1: 4000, // 01 · En vol
  2: 5000, // 02 · Inspection
  3: 5000, // 03 · Capteurs
  4: 4500, // 04 · Séparation
  5: 6000, // 05 · Départ
  6: 3000, // 06 · Fin : la lecture s'arrête au terme de ce décompte
} as const satisfies Record<RafaleStepNumber, number>;

/** prefers-reduced-motion : chaque étape reste deux fois plus longtemps. */
export const REDUCED_MOTION_DURATION_FACTOR = 2;

export function rafaleStepNumber(state: RafaleSequenceState): RafaleStepNumber {
  return (rafaleStateIndex(state) + 1) as RafaleStepNumber;
}

/** Durée du décompte de l'étape pendant la lecture automatique. */
export function autoPlayStepDurationMs(
  state: RafaleSequenceState,
  reducedMotion: boolean,
): number {
  const duration = STEP_DURATIONS_MS[rafaleStepNumber(state)];
  return reducedMotion ? duration * REDUCED_MOTION_DURATION_FACTOR : duration;
}

/** Dernière étape : la lecture s'y arrête ; lancée depuis là, elle repart de 01. */
export function isFinalRafaleStep(state: RafaleSequenceState): boolean {
  return rafaleStateIndex(state) === RAFALE_SEQUENCE_STATES.length - 1;
}
