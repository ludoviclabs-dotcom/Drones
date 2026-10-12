/**
 * Navigation du site — quatre intentions en en-tête, plan complet en pied.
 *
 * Les groupes regroupent les neuf anciennes entrées plates autour de ce que
 * vient faire un visiteur : explorer, visualiser, analyser, comprendre la
 * méthode. Aucune route ne disparaît : ce qui ne figure pas dans un groupe
 * reste listé dans `FOOTER_LINKS`, le plan du site.
 */

export interface NavLink {
  href: string;
  label: string;
  /** Sous-titre court, pour lever l'abstraction d'un intitulé. */
  hint?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  links: readonly NavLink[];
}

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    id: "explorer",
    label: "Explorer",
    links: [
      { href: "/domaines", label: "Domaines", hint: "Onze domaines, une même grille" },
      { href: "/#catalogue", label: "Catalogue des dossiers", hint: "Recherche et filtres" },
      { href: "/eurosatory", label: "EuroSatory", hint: "Parcours salon 2026" },
    ],
  },
  {
    id: "visualisations",
    label: "Visualisations",
    links: [
      { href: "/hud", label: "Planches techniques", hint: "3D interactive et vues éclatées" },
      { href: "/matrice", label: "Matrice", hint: "Positionnement des systèmes" },
      { href: "/industrial-graph", label: "Graphe industriel", hint: "Dépendances publiques" },
    ],
  },
  {
    id: "outils",
    label: "Outils d’analyse",
    links: [
      { href: "/comparateur", label: "Comparateur", hint: "Deux à trois dossiers côte à côte" },
      { href: "/simulateur", label: "Simulateur", hint: "Arbitrages" },
      { href: "/console", label: "Console OSINT", hint: "Registre de preuves" },
      { href: "/couts", label: "Coûts publics", hint: "Registre coût et TCO" },
      { href: "/portefeuille", label: "Portefeuille", hint: "Comparaison stratégique" },
      { href: "/export-briefs", label: "Briefs export", hint: "Notes publiques" },
    ],
  },
  {
    id: "methodologie",
    label: "Méthodologie",
    links: [
      { href: "/methodologie", label: "Méthodologie", hint: "Paliers, confiance, cadre" },
      { href: "/glossaire", label: "Glossaire" },
      { href: "/audit", label: "Audit méthodologique" },
      { href: "/updates", label: "File de revue" },
      { href: "/changelog", label: "Changelog" },
      { href: "/roadmap", label: "Roadmap" },
    ],
  },
];

/** Accès direct à la recherche : elle vit dans le catalogue de l'accueil. */
export const SEARCH_HREF = "/#catalogue";

/** Plan du site en pied de page — inchangé, c'est la garantie qu'aucune route ne se perd. */
export const FOOTER_LINKS: readonly NavLink[] = [
  { href: "/eurosatory", label: "EuroSatory" },
  { href: "/domaines", label: "Domaines" },
  { href: "/hud", label: "Planches" },
  { href: "/comparateur", label: "Comparateur" },
  { href: "/matrice", label: "Matrice" },
  { href: "/simulateur", label: "Simulateur" },
  { href: "/console", label: "Console" },
  { href: "/methodologie", label: "Méthodologie" },
  { href: "/glossaire", label: "Glossaire" },
  { href: "/hud/drone-airframe", label: "HUD Drone" },
  { href: "/hud/thundart", label: "HUD Thundart" },
  { href: "/hud/patriot-pac3-mse", label: "HUD Patriot" },
  { href: "/hud/rafale-f4-meteor", label: "HUD Rafale" },
  { href: "/audit", label: "Audit" },
  { href: "/couts", label: "Coûts publics" },
  { href: "/industrial-graph", label: "Graphe industriel" },
  { href: "/updates", label: "File de revue" },
  { href: "/export-briefs", label: "Briefs export" },
  { href: "/portefeuille", label: "Portefeuille" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/changelog", label: "Changelog" },
];
