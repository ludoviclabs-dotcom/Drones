import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/400-italic.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import { continueRender, delayRender } from "remotion";

/**
 * Fontes du rendu CLI (Studio, MP4), embarquées depuis @fontsource : le rendu
 * ne dépend d'aucun réseau et reste identique d'une machine à l'autre.
 * Dans le lecteur du site, next/font les fournit déjà via les variables CSS :
 * ce module n'est importé que par le point d'entrée Remotion.
 *
 * Les fontes CSS ne se chargent qu'à l'usage : on les demande explicitement
 * et on retient la première image tant qu'elles ne sont pas prêtes.
 */
const FACES = [
  '400 40px "Newsreader"',
  'italic 400 40px "Newsreader"',
  '400 40px "IBM Plex Mono"',
  '600 40px "IBM Plex Mono"',
  '400 40px "IBM Plex Sans"',
  '500 40px "IBM Plex Sans"',
];

if (typeof document !== "undefined") {
  const handle = delayRender("Chargement des fontes du film");
  Promise.all(FACES.map((face) => document.fonts.load(face, "Éé0")))
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
}
