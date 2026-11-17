/**
 * Recherche de la palette ⌘K — fonctions pures, sans donnée : le module est
 * importé côté client, l'index (`search-index.ts`) reste côté serveur et
 * n'arrive au navigateur qu'à la première ouverture de la palette.
 */

export type SearchKind = "systeme" | "acteur" | "domaine" | "page" | "glossaire";

export interface SearchEntry {
  kind: SearchKind;
  title: string;
  /** Ligne secondaire : référence, domaine, industriel, pays… */
  subtitle?: string;
  href: string;
  /** Termes supplémentaires, déjà normalisés, concaténés au titre. */
  keywords: string;
}

export const SEARCH_KIND_LABELS: Record<SearchKind, string> = {
  systeme: "Systèmes",
  acteur: "Acteurs",
  domaine: "Domaines",
  page: "Pages et outils",
  glossaire: "Glossaire",
};

export const SEARCH_KIND_ORDER: readonly SearchKind[] = [
  "systeme",
  "acteur",
  "domaine",
  "page",
  "glossaire",
];

/** Minuscules, sans accents ni ponctuation : « Défense-Aérienne » → « defense aerienne ». */
export function normalizeSearch(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenScore(title: string, haystack: string, token: string): number {
  if (title.startsWith(token)) return 30;
  if (title.includes(` ${token}`)) return 20;
  if (haystack.startsWith(token) || haystack.includes(` ${token}`)) return 10;
  if (haystack.includes(token)) return 3;
  return 0;
}

/**
 * Chaque mot de la requête doit apparaître dans le titre ou les mots-clés.
 * Classement : titre exact, puis début de titre, début de mot du titre,
 * début de mot-clé, simple inclusion ; à égalité, l'ordre des familles puis
 * l'ordre alphabétique.
 */
export function searchEntries(
  entries: readonly SearchEntry[],
  query: string,
  limit = 30,
): SearchEntry[] {
  const q = normalizeSearch(query);
  if (!q) return [];
  const tokens = q.split(" ");

  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of entries) {
    const title = normalizeSearch(entry.title);
    const haystack = `${title} ${entry.keywords}`;
    let score = 0;
    let matched = true;
    for (const token of tokens) {
      const s = tokenScore(title, haystack, token);
      if (s === 0) {
        matched = false;
        break;
      }
      score += s;
    }
    if (!matched) continue;
    if (title === q) score += 100;
    scored.push({ entry, score });
  }

  scored.sort(
    (a, b) =>
      b.score - a.score ||
      SEARCH_KIND_ORDER.indexOf(a.entry.kind) -
        SEARCH_KIND_ORDER.indexOf(b.entry.kind) ||
      a.entry.title.localeCompare(b.entry.title, "fr"),
  );
  return scored.slice(0, limit).map((item) => item.entry);
}

/**
 * Regroupe par famille en conservant le rang : la famille du meilleur
 * résultat vient en tête (« défense » ouvre sur le domaine, « rafale » sur
 * la fiche), les entrées gardent leur ordre au sein de chaque groupe.
 */
export function groupByKind(
  entries: readonly SearchEntry[],
): { kind: SearchKind; entries: SearchEntry[] }[] {
  const kinds: SearchKind[] = [];
  for (const entry of entries) {
    if (!kinds.includes(entry.kind)) kinds.push(entry.kind);
  }
  return kinds.map((kind) => ({
    kind,
    entries: entries.filter((entry) => entry.kind === kind),
  }));
}

/** Suggestions de la palette vide : les domaines, puis les pages et outils. */
export function defaultEntries(entries: readonly SearchEntry[]): SearchEntry[] {
  return entries.filter(
    (entry) => entry.kind === "domaine" || entry.kind === "page",
  );
}

/** Ancre d'un terme du glossaire (les organismes portent déjà `org-<slug>`). */
export function glossaryTermAnchor(slug: string): string {
  return `terme-${slug}`;
}
