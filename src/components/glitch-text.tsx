"use client";

import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#%&";

/**
 * Affiche un texte « en cours de décodage » : au montage, les lettres sont
 * brouillées puis se stabilisent une à une, de gauche à droite.
 * Le texte réel reste lisible par les lecteurs d'écran et présent au rendu
 * serveur ; l'animation est purement décorative et désactivée si
 * l'utilisateur a demandé moins d'animations.
 */
export function GlitchText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(children);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = children;
    let raf = 0;
    let tick = 0;
    const lockAt = (i: number) => i * 1.3 + 5;

    const run = () => {
      tick += 1;
      let out = "";
      let done = true;
      for (let i = 0; i < target.length; i += 1) {
        const ch = target[i];
        if (ch === " " || tick >= lockAt(i)) {
          out += ch;
        } else {
          done = false;
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(out);
      if (!done) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [children]);

  return (
    <span className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
