// Mémorise le lien (carte du catalogue, vignette de domaine…) qui a ouvert une
// fiche dossier : la mise en scène « Déclassification » part de sa position à
// l'ouverture, y revient à la fermeture et lui rend le focus.
//
// La carte se soulève dès le clic, sans attendre le chargement de la fiche :
// la fiche reprend ensuite la chronologie là où la carte l'a laissée.

const FICHE_PATH = /^\/systemes\/([^/?#]+)\/?$/;

/** Durée du soulèvement de la carte (ms) — premier temps de la transition. */
export const LIFT_MS = 150;
const LIFT_FRAMES: Keyframe[] = [
  { transform: "none", boxShadow: "0 0 0 rgba(0,0,0,0)" },
  {
    transform: "translateY(-6px) rotate(-0.8deg) scale(1.015)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
  },
];
// Si la fiche ne s'ouvre pas en surimpression (navigation complète, échec),
// la carte reprend sa place.
const UNCLAIMED_TIMEOUT = 2500;

interface Origin {
  slug: string;
  el: HTMLElement;
  lift: Animation | null;
  at: number;
  claimed: boolean;
}

let origin: Origin | null = null;

/** Slug de fiche visé par un lien interne, ou `null` si ce n'en est pas un. */
export function ficheSlugFromHref(anchor: HTMLAnchorElement): string | null {
  if (anchor.origin !== window.location.origin) return null;
  const match = FICHE_PATH.exec(anchor.pathname);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setDossierOrigin(slug: string, el: HTMLElement) {
  if (origin && !origin.claimed) origin.lift?.cancel();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lift = reduced
    ? null
    : el.animate(LIFT_FRAMES, {
        duration: LIFT_MS,
        fill: "forwards",
        easing: "cubic-bezier(.22,1,.36,1)",
      });
  const current: Origin = {
    slug,
    el,
    lift,
    at: performance.now(),
    claimed: false,
  };
  origin = current;
  window.setTimeout(() => {
    if (!current.claimed) current.lift?.cancel();
  }, UNCLAIMED_TIMEOUT);
}

/**
 * Carte d'origine de la fiche `slug`, si elle est encore dans le document. La
 * fiche en prend possession : l'animation de soulèvement lui est confiée
 * (à elle de l'annuler) et `elapsed` indique le temps déjà écoulé depuis le
 * clic.
 */
export function claimDossierOrigin(slug: string): {
  el: HTMLElement;
  lift: Animation | null;
  elapsed: number;
} | null {
  if (!origin || origin.slug !== slug || !origin.el.isConnected) return null;
  origin.claimed = true;
  return {
    el: origin.el,
    lift: origin.lift,
    elapsed: performance.now() - origin.at,
  };
}
