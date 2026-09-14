/**
 * Registre des planches techniques publiées sous `/hud`.
 *
 * Source unique de la page d'index `/hud`, de la vitrine de l'accueil et du
 * sitemap : une nouvelle planche s'ajoute ici et apparaît partout, sans lien à
 * recopier. L'ordre du tableau est l'ordre d'affichage.
 *
 * Les textes restent ceux des planches elles-mêmes : aucune caractéristique
 * n'est ajoutée ici, et chaque planche demeure une représentation illustrative
 * en mode démonstration.
 */

export type HudBoardPreview = {
  /** Chemin public de la vignette (WebP pré-optimisé, voir `public/images/hud`). */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type HudBoard = {
  slug: string;
  href: `/hud/${string}`;
  /** Titre repris tel quel du `<h1>` de la planche. */
  title: string;
  /** Nature de la planche, affichée en surtitre. */
  kind: string;
  summary: string;
  /** Trois repères factuels au plus, vérifiables sur la planche. */
  features: readonly string[];
  preview: HudBoardPreview;
};

export const HUD_INDEX_PATH = "/hud";

export const HUD_BOARDS: readonly HudBoard[] = [
  {
    slug: "thundart",
    href: "/hud/thundart",
    title: "Thundart — inspection extérieure 3D",
    kind: "Modélisation 3D interactive",
    summary:
      "Représentation illustrative des formes extérieures visibles du démonstrateur Thundart. Une séquence en cinq états et une inspection des sous-ensembles à la souris, au toucher ou au clavier.",
    features: [
      "Séquence en 5 états",
      "5 sous-ensembles inspectables",
      "Mouvement réduit respecté",
    ],
    preview: {
      src: "/images/hud/thundart-preview.webp",
      alt: "Modèle 3D du démonstrateur Thundart posé sur une grille technique, le rack de conteneurs mis en évidence en orange.",
      width: 1280,
      height: 720,
    },
  },
  {
    slug: "drone-airframe",
    href: "/hud/drone-airframe",
    title: "Cellule de drone — vue éclatée",
    kind: "Vue éclatée interactive",
    summary:
      "Lecture structurelle d’une chaîne embarquée, du châssis à la nacelle capteurs : six pièces reliées à quatre panneaux prêts à recevoir des données qualifiées.",
    features: [
      "6 pièces · 4 panneaux",
      "Sélection au clavier",
      "Mode démonstration",
    ],
    preview: {
      src: "/images/hud/drone-airframe-preview.webp",
      alt: "Planche technique d’une cellule de drone éclatée en six pièces empilées, entourée de quatre panneaux de données en mode démonstration.",
      width: 1280,
      height: 720,
    },
  },
];

export function hudBoardBySlug(slug: string): HudBoard | undefined {
  return HUD_BOARDS.find((board) => board.slug === slug);
}
