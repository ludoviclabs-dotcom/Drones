"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Compte de 0 à la valeur cible, en ease-out, via requestAnimationFrame. */
function animateCount(el: HTMLElement) {
  const target = Number(el.dataset.countup);
  if (!Number.isFinite(target)) return;
  const duration = 950;
  const startTime = performance.now();
  const step = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * Observateur de scroll unique : révèle les `.reveal`, trace les `[data-draw]`,
 * remplit les `[data-fill]`, incrémente les `[data-countup]`. Aucune librairie.
 * Inactif si l'utilisateur a demandé moins d'animations.
 */
export function MotionController() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document
      .querySelectorAll<HTMLElement>("[data-countup]")
      .forEach((el) => {
        el.textContent = "0";
      });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("in-view");
          if (el.dataset.countup !== undefined) animateCount(el);
          observer.unobserve(el);
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );

    document
      .querySelectorAll<HTMLElement>(
        ".reveal, [data-draw], [data-fill], [data-countup]",
      )
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
