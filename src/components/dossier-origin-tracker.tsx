"use client";

import { useEffect } from "react";
import { ficheSlugFromHref, setDossierOrigin } from "@/lib/dossier-origin";

/**
 * Écoute (en phase de capture) les clics sur les liens vers une fiche
 * `/systemes/[slug]` et retient l'élément cliqué, point de départ de la
 * transition « Déclassification ». Ne modifie jamais la navigation.
 */
export function DossierOriginTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank")
        return;
      const slug = ficheSlugFromHref(anchor);
      if (slug) setDossierOrigin(slug, anchor);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
