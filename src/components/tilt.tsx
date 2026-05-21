"use client";

import { useRef, type ReactNode } from "react";

/**
 * Enveloppe un élément d'une légère inclinaison 3D qui suit le curseur —
 * l'impression de tenir un dessin technique entre les mains.
 * Repli gracieux : sur écran tactile, aucun `mousemove`, l'élément reste à plat.
 */
export function Tilt({
  children,
  className = "",
  max = 9,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-y", `${px * max * 2}deg`);
    el.style.setProperty("--tilt-x", `${-py * max * 2}deg`);
  }

  function reset() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--tilt-x", "0deg");
  }

  return (
    <div
      className={`tilt-stage ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}
