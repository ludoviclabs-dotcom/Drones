import Link from "next/link";
import { HUD_INDEX_PATH } from "@/data/hud/boards";

/**
 * Fil d'Ariane Accueil › Planches techniques › planche courante.
 *
 * Relie chaque planche à l'index `/hud` : on arrive sur une planche par un lien
 * partagé, on en repart vers les autres sans repasser par l'accueil.
 */
export function HudBreadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Fil d’Ariane" className="mb-3">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
        <li>
          <Link href="/" className="motion-safe:transition-colors hover:text-accent">
            Accueil
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li>
          <Link
            href={HUD_INDEX_PATH}
            className="motion-safe:transition-colors hover:text-accent"
          >
            Planches techniques
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li aria-current="page" className="text-ink-dim">
          {current}
        </li>
      </ol>
    </nav>
  );
}
