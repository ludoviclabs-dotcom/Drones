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
  /**
   * Point focal horizontal (0–100 %) quand la vignette est recadrée (grande
   * vignette de l'accueil) ; centre par défaut.
   */
  focusX?: number;
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
  /** Dossiers système illustrés par la planche (liens croisés, optionnel). */
  systemSlugs?: readonly string[];
  /**
   * Entrées directes de la planche (optionnel) : l'accueil les propose sous la
   * grande vignette. Chaque lien ouvre la planche dans un scénario donné.
   */
  entries?: readonly HudBoardEntry[];
};

export type HudBoardEntry = {
  href: `/hud/${string}`;
  label: string;
  detail: string;
};

export const HUD_INDEX_PATH = "/hud";

export const HUD_BOARDS: readonly HudBoard[] = [
  {
    slug: "rafale-f4-meteor",
    href: "/hud/rafale-f4-meteor",
    title: "Rafale F4 — chasseur et tir Meteor en 3D",
    kind: "Modélisation 3D · tir illustratif",
    summary:
      "Un Rafale C au standard F4 modélisé d’après les dimensions publiées, avec ses emports : capteurs, séparation et départ illustratifs d’un Meteor au-delà du contact visuel, d’un MICA IR en combat rapproché ou d’un AASM Hammer en mission SEAD.",
    features: [
      "Séquence en 6 états",
      "3 scénarios · 15 sous-ensembles",
      "Mouvement réduit respecté",
    ],
    preview: {
      src: "/images/hud/rafale-f4-meteor-preview.webp",
      alt: "Modèle 3D d’un Rafale F4 vu de l’arrière, en vol au-dessus de la mer : un missile Meteor, propulseur allumé, s’éloigne devant l’avion en laissant un sillage de fumée ; un pointillé symbolise la liaison de données.",
      width: 1280,
      height: 720,
      focusX: 38,
    },
    systemSlugs: ["rafale", "meteor"],
    entries: [
      {
        href: "/hud/rafale-f4-meteor?scenario=bvr",
        label: "Interception BVR · Meteor",
        detail: "Éjection sous le fuselage, statoréacteur.",
      },
      {
        href: "/hud/rafale-f4-meteor?scenario=wvr",
        label: "Combat rapproché · MICA IR",
        detail: "Avion en virage, départ du rail de saumon.",
      },
      {
        href: "/hud/rafale-f4-meteor?scenario=sead",
        label: "SEAD · AASM Hammer",
        detail: "Largage sous voilure, SPECTRA en avant.",
      },
    ],
  },
  {
    slug: "patriot-pac3-mse",
    href: "/hud/patriot-pac3-mse",
    title: "Patriot PAC-3 MSE — batterie et lanceur en 3D",
    kind: "Modélisation 3D · tir illustratif",
    summary:
      "Une batterie Patriot en disposition illustrative et son lanceur M903 détaillé : mise en batterie, élévation, mise à feu et départ illustratifs, en tir unitaire ou en salve.",
    features: [
      "Séquence en 7 états",
      "12 sous-ensembles sourcés",
      "Tir unitaire ou salve",
    ],
    preview: {
      src: "/images/hud/patriot-pac3-mse-preview.webp",
      alt: "Modèle 3D d’un lanceur Patriot M903 relevé au site de tir : un intercepteur PAC-3 MSE sort de son conteneur dans un nuage de fumée, deux autres lanceurs de la batterie en arrière-plan.",
      width: 1280,
      height: 720,
    },
    systemSlugs: ["patriot-pac3-mse", "pac-3-mse"],
  },
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

/** Planche illustrant un dossier système donné, s'il en existe une. */
export function hudBoardForSystem(systemSlug: string): HudBoard | undefined {
  return HUD_BOARDS.find((board) => board.systemSlugs?.includes(systemSlug));
}
