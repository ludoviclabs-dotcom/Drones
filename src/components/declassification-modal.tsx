"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { claimDossierOrigin, LIFT_MS } from "@/lib/dossier-origin";

/**
 * « Transition de déclassification » — l'ouverture d'une fiche depuis le
 * catalogue est mise en scène comme la sortie d'un dossier réel :
 *
 * 1. la carte se soulève (élévation, rotation imperceptible), le catalogue
 *    s'assombrit ;
 * 2. une chemise glisse de la carte vers le centre et s'ouvre ;
 * 3. le code PNP-XX-XXX se tape, le tampon « Déclassifié » est apposé
 *    (impact, bavure d'encre) ;
 * 4. la fiche se dévoile par sections, dans l'ordre de lecture ; les lettres
 *    de palier sont cerclées comme des mentions manuscrites.
 *
 * La fermeture rejoue l'inverse en 300 ms et laisse sur la carte une trace
 * estompée du tampon. Tout passe par la Web Animations API sur un DOM déjà
 * complet : la fiche reste lisible et indexable, la mise en scène n'est
 * qu'une couche visuelle. Un second clic pendant l'ouverture saute à l'état
 * final ; Échap referme à tout moment. Si l'utilisateur a demandé moins
 * d'animations, la fiche s'affiche et se referme instantanément.
 */

// Chronologie d'ouverture (ms). Transition complète : 880 ms.
const TL = {
  lift: LIFT_MS,
  travel: [150, 380],
  flap: [520, 300],
  panel: [470, 160],
  code: [560, 260],
  stamp: [700, 260],
  ink: [880, 480],
  shake: [880, 160],
  done: 880,
  sections: 960,
  close: 300,
} as const;

const EASE_OUT = "cubic-bezier(.22,1,.36,1)";
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const CloseContext = createContext<() => void>(() => {});

/** Referme la fiche ouverte en surimpression (bouton, lien de retour…). */
export function useCloseDossier() {
  return useContext(CloseContext);
}

/** Rectangle de la carte au repos, hors transformation du soulèvement. */
function restingRect(card: HTMLElement, lift: Animation | null): DOMRect {
  if (!lift || lift.currentTime === null) return card.getBoundingClientRect();
  const time = lift.currentTime;
  lift.currentTime = 0;
  const rect = card.getBoundingClientRect();
  lift.currentTime = time;
  return rect;
}

interface Stage {
  open(): void;
  skip(): boolean;
  close(): void;
  dispose(): void;
}

function createStage(
  overlay: HTMLElement,
  veil: HTMLElement,
  chemise: HTMLElement,
  slug: string,
  onClosed: () => void,
): Stage {
  const panel = overlay.querySelector<HTMLElement>("[data-dossier-panel]");
  const pick = (sel: string) => panel?.querySelector<HTMLElement>(sel) ?? null;
  const cover = pick("[data-dossier-cover]");
  const code = pick("[data-dossier-code]");
  const stamp = pick("[data-dossier-stamp]");
  const ink = pick("[data-dossier-ink]");
  const title = pick("[data-dossier-title]");
  const flap = chemise.firstElementChild as HTMLElement | null;
  const origin = claimDossierOrigin(slug);
  const card = origin?.el ?? null;
  // La carte s'est déjà soulevée au clic : la chronologie reprend d'autant.
  const offset = Math.min(origin?.elapsed ?? 0, TL.lift);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let phase: "opening" | "open" | "closing" | "closed" = "opening";
  let anims: Animation[] = origin?.lift ? [origin.lift] : [];
  let timer = 0;
  const inerted: HTMLElement[] = [];
  const body = document.body;
  const previous = {
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight,
  };

  const play = (
    el: Element | null,
    frames: Keyframe[],
    options: KeyframeAnimationOptions & { duration: number },
  ) => {
    if (!el) return;
    const delay = Math.max(0, (options.delay ?? 0) - offset);
    anims.push(
      el.animate(frames, { fill: "both", easing: EASE_OUT, ...options, delay }),
    );
  };

  const placeChemise = (rect: DOMRect, top = rect.top) => {
    Object.assign(chemise.style, {
      display: "block",
      left: `${rect.left}px`,
      top: `${top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
  };

  const settle = () => {
    chemise.style.display = "none";
    panel?.setAttribute("aria-busy", "false");
    if (phase === "opening") phase = "open";
  };

  // Piège à focus : Tab et Maj+Tab bouclent dans la fiche.
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = Array.from(
      overlay.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((el) => el.getClientRects().length > 0);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const current = document.activeElement;
    if (!overlay.contains(current)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && (current === first || current === title)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus();
    }
  };

  function open() {
    // Verrou de défilement, sans décalage dû à la disparition de la barre.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    // Le catalogue sort de l'arbre d'accessibilité et du parcours au clavier.
    for (const el of Array.from(body.children)) {
      if (!(el instanceof HTMLElement) || el.inert || el.contains(overlay))
        continue;
      if (el.tagName === "SCRIPT") continue;
      el.inert = true;
      inerted.push(el);
    }
    document.addEventListener("keydown", onKey, true);
    // Schématique et barres de paliers : état final, animé ici plutôt que
    // par l'observateur de scroll.
    panel
      ?.querySelectorAll("[data-draw], [data-fill]")
      .forEach((el) => el.classList.add("in-view"));
    title?.focus({ preventScroll: true });

    if (reduced || !panel || !cover) {
      settle();
      return;
    }
    panel.setAttribute("aria-busy", "true");

    const tr = cover.getBoundingClientRect();
    play(veil, [{ opacity: 0 }, { opacity: 1 }], { duration: 320 });

    // 1. La carte, soulevée dès le clic, cède la place à la chemise.
    let from: string;
    if (card) {
      const cr = restingRect(card, origin?.lift ?? null);
      play(card, [{ opacity: 1 }, { opacity: 0 }], {
        duration: 1,
        delay: TL.lift,
        easing: "linear",
      });
      from = `translate(${cr.left - tr.left}px, ${cr.top - 6 - tr.top}px) scale(${cr.width / tr.width}, ${cr.height / tr.height}) rotate(-0.8deg)`;
    } else {
      // Ouverture sans carte d'origine visible : la chemise monte du centre.
      from = `translate(${tr.width * 0.2}px, ${Math.min(tr.height, window.innerHeight) * 0.25}px) scale(0.6)`;
    }

    // 2. La chemise glisse vers le centre et s'ouvre.
    placeChemise(tr);
    play(
      chemise,
      [
        { transform: from, opacity: 0 },
        { transform: from, opacity: 1, offset: 0.01 },
        { transform: "none", opacity: 1 },
      ],
      {
        duration: TL.travel[1],
        delay: TL.travel[0],
        easing: "cubic-bezier(.65,0,.25,1)",
      },
    );
    play(
      flap,
      [
        { transform: "rotateY(0deg)", opacity: 1 },
        { transform: "rotateY(-70deg)", opacity: 0.85, offset: 0.6 },
        { transform: "rotateY(-104deg)", opacity: 0 },
      ],
      {
        duration: TL.flap[1],
        delay: TL.flap[0],
        easing: "cubic-bezier(.55,0,.35,1)",
      },
    );
    play(panel, [{ opacity: 0 }, { opacity: 1 }], {
      duration: TL.panel[1],
      delay: TL.panel[0],
      easing: "linear",
    });

    // 3. Le code se tape, le tampon est apposé.
    play(
      code,
      [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
      {
        duration: TL.code[1],
        delay: TL.code[0],
        easing: `steps(${code?.textContent?.length || 11}, end)`,
      },
    );
    play(
      stamp,
      [
        {
          opacity: 0,
          transform: "rotate(-10deg) scale(2.4)",
          easing: "cubic-bezier(.55,0,.8,.2)",
        },
        {
          opacity: 1,
          transform: "rotate(-4deg) scale(0.92)",
          offset: 0.68,
          easing: "cubic-bezier(.2,.8,.3,1)",
        },
        { opacity: 1, transform: "rotate(-4deg) scale(1)" },
      ],
      { duration: TL.stamp[1], delay: TL.stamp[0], easing: "linear" },
    );
    play(
      ink,
      [
        { opacity: 0, transform: "rotate(-4deg) scale(0.96)" },
        { opacity: 0.6, transform: "rotate(-4deg) scale(1.02)", offset: 0.12 },
        { opacity: 0, transform: "rotate(-4deg) scale(1.3)" },
      ],
      {
        duration: TL.ink[1],
        delay: TL.ink[0],
        easing: "cubic-bezier(.2,.7,.3,1)",
      },
    );
    play(
      cover,
      [
        { transform: "none" },
        { transform: "translate(1.5px,1px)" },
        { transform: "translate(-1px,0)" },
        { transform: "none" },
      ],
      {
        duration: TL.shake[1],
        delay: TL.shake[0],
        easing: "linear",
        fill: "none",
      },
    );

    // 4. Révélation dans l'ordre de lecture : d'abord la couverture…
    const rise: Keyframe[] = [
      { opacity: 0, transform: "translateY(10px)" },
      { opacity: 1, transform: "none" },
    ];
    panel.querySelectorAll<HTMLElement>("[data-dossier-reveal]").forEach((el) =>
      play(el, rise, {
        duration: 420,
        delay: Number(el.dataset.dossierReveal) || 0,
      }),
    );
    // … puis chaque section, en cascade (plafonnée : les dernières sont
    // de toute façon sous la ligne de flottaison).
    const sectionDelay = new Map<Element, number>();
    const sections = Array.from(panel.children).slice(
      Array.from(panel.children).indexOf(cover) + 1,
    );
    let rank = 0;
    for (const section of sections) {
      const parts = section.hasAttribute("data-dossier-group")
        ? Array.from(section.children)
        : [section];
      for (const part of parts) {
        const delay = TL.sections + Math.min(rank++, 10) * 110;
        sectionDelay.set(part, delay);
        play(part, rise, { duration: 420, delay });
      }
    }
    const baseOf = (el: Element) => {
      for (const [section, delay] of sectionDelay) {
        if (section.contains(el)) return delay;
      }
      return TL.sections;
    };
    // Paliers : barres qui se remplissent, lettres cochées à la main.
    panel.querySelectorAll(".score-bar").forEach((el, i) =>
      play(el, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
        duration: 550,
        delay: baseOf(el) + 60 + i * 80,
      }),
    );
    panel.querySelectorAll("[data-dossier-letter]").forEach((el, i) =>
      play(
        el,
        [
          { transform: "scale(1.35) rotate(-6deg)", opacity: 0 },
          { transform: "scale(1) rotate(0)", opacity: 1 },
        ],
        {
          duration: 240,
          delay: baseOf(el) + 160 + i * 90,
          easing: "cubic-bezier(.3,1.4,.5,1)",
        },
      ),
    );
    panel.querySelectorAll("[data-dossier-check]").forEach((el, i) =>
      play(
        el,
        [
          { strokeDashoffset: 170, opacity: 0.95 },
          { strokeDashoffset: 0, opacity: 0.95, offset: 0.7 },
          { strokeDashoffset: 0, opacity: 0.55 },
        ],
        {
          duration: 560,
          delay: baseOf(el) + 220 + i * 90,
          easing: "cubic-bezier(.6,0,.3,1)",
        },
      ),
    );

    timer = window.setTimeout(settle, TL.done - offset + 20);
  }

  // Clic répété pendant l'ouverture : on saute à l'état final.
  function skip() {
    if (phase !== "opening") return false;
    window.clearTimeout(timer);
    anims.forEach((a) => a.finish());
    settle();
    return true;
  }

  // Transition inverse accélérée (300 ms), puis retour au catalogue.
  function close() {
    if (phase === "closing" || phase === "closed") return;
    window.clearTimeout(timer);
    if (reduced || !panel || !cover) {
      phase = "closed";
      onClosed();
      return;
    }
    phase = "closing";
    anims.forEach((a) => a.finish());
    panel.setAttribute("aria-busy", "false");

    play(panel, [{ opacity: 1 }, { opacity: 0 }], {
      duration: 110,
      easing: "ease-in",
    });
    play(veil, [{ opacity: 1 }, { opacity: 0 }], {
      duration: 240,
      delay: 40,
      easing: "ease-in",
    });
    if (card) {
      const tr = cover.getBoundingClientRect();
      const cr = restingRect(card, origin?.lift ?? null);
      const top = Math.max(tr.top, 24);
      flap?.getAnimations().forEach((a) => a.cancel());
      placeChemise(tr, top);
      const to = `translate(${cr.left - tr.left}px, ${cr.top - top}px) scale(${cr.width / tr.width}, ${cr.height / tr.height})`;
      play(
        chemise,
        [
          { transform: "none", opacity: 0 },
          { transform: "none", opacity: 1, offset: 0.2 },
          { transform: to, opacity: 1 },
        ],
        { duration: 230, delay: 40, easing: "cubic-bezier(.4,0,.2,1)" },
      );
    }
    timer = window.setTimeout(() => {
      phase = "closed";
      onClosed();
    }, TL.close);
  }

  // Démontage (fermeture, bouton Précédent, navigation) : tout est restitué.
  function dispose() {
    window.clearTimeout(timer);
    document.removeEventListener("keydown", onKey, true);
    anims.forEach((a) => a.cancel());
    anims = [];
    chemise.style.display = "none";
    inerted.forEach((el) => (el.inert = false));
    body.style.overflow = previous.overflow;
    body.style.paddingRight = previous.paddingRight;
    phase = "closed";
    // Après le retrait effectif du DOM (et non lors du double montage du mode
    // strict) : focus rendu à la carte, trace estompée du tampon.
    window.setTimeout(() => {
      if (overlay.isConnected || !card?.isConnected) return;
      card.setAttribute("data-dossier-visited", "");
      card.focus({ preventScroll: true });
      const trace = card.querySelector("[data-dossier-trace]");
      if (trace && !reduced) {
        trace.animate(
          [
            { opacity: 0.8, transform: "rotate(-9deg) scale(1.06)" },
            { opacity: 0.22, transform: "rotate(-9deg) scale(1)" },
          ],
          { duration: 700, easing: "ease-out" },
        );
      }
    });
  }

  return { open, skip, close, dispose };
}

function DossierStage({
  slug,
  title,
  children,
}: {
  slug: string;
  title: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const chemiseRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Stage | null>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const veil = veilRef.current;
    const chemise = chemiseRef.current;
    if (!overlay || !veil || !chemise) return;
    const stage = createStage(overlay, veil, chemise, slug, () => router.back());
    stageRef.current = stage;
    stage.open();
    // Les métadonnées d'un emplacement parallèle ne sont pas appliquées par
    // Next.js : le titre du document suit donc la fiche à la main.
    const previousTitle = document.title;
    document.title = title;
    return () => {
      document.title = previousTitle;
      stage.dispose();
      stageRef.current = null;
    };
  }, [slug, title, router]);

  const close = useCallback(() => stageRef.current?.close(), []);

  const onBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (stageRef.current?.skip()) return;
    if (event.target === event.currentTarget) close();
  };

  return (
    <CloseContext.Provider value={close}>
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-titre"
        className="fixed inset-0 z-[55]"
      >
        <div
          ref={veilRef}
          className="absolute inset-0 bg-[rgba(12,11,8,0.8)] backdrop-blur-[2px]"
        />
        <div
          onClick={onBackdrop}
          className="absolute inset-0 overflow-y-auto overscroll-contain"
        >
          {children}
        </div>
        <div
          ref={chemiseRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[3] hidden origin-top-left [perspective:1800px]"
        >
          <div className="absolute inset-0 origin-left border border-line-bright bg-surface-2 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
            <span className="absolute -top-px left-[18px] h-1.5 w-[22%] bg-line-bright" />
          </div>
        </div>
      </div>
    </CloseContext.Provider>
  );
}

/**
 * Fiche ouverte en surimpression du catalogue (route interceptée). Ne s'affiche
 * que tant que l'URL désigne cette fiche : une navigation vers une autre page
 * (X-Ray, comparateur…) la démonte sans attendre.
 */
export function DeclassificationModal({
  slug,
  title,
  children,
}: {
  slug: string;
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.replace(/\/$/, "") !== `/systemes/${slug}`) return null;
  return (
    <DossierStage key={slug} slug={slug} title={title}>
      {children}
    </DossierStage>
  );
}

/** Barre haute de la fiche en surimpression : retour et fermeture. */
export function DossierTopBar() {
  const close = useCloseDossier();
  return (
    <div className="flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={close}
        className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
      >
        ← Tous les systèmes
      </button>
      <button
        type="button"
        onClick={close}
        aria-label="Fermer le dossier"
        className="inline-flex cursor-pointer items-center gap-2.5 border border-line-bright bg-panel/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:border-accent hover:text-accent"
      >
        Échap<span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}
