// Extraction d'un montant dans le texte libre d'un indicateur — page /couts.
//
// Règle unique : un nombre n'est un montant que s'il est accolé à une devise ou
// à une unité monétaire explicite (« 7,1 Md€ », « US$13 Md », « 20,7 milliards
// USD », « 100 000 $ »). Une année (« post-2022 »), un calibre (« 155 mm »), un
// format (« 8x8 ») ou un sigle (« C2 ») n'est jamais un montant, et la devise
// n'est jamais lue dans un mot (« capteur », « cadence », « européenne »).
// Quand la source ne donne pas de montant, on renvoie `null` : la page affiche
// alors « Non normalisé », jamais un coût fabriqué.

export interface MonetaryAmount {
  /** Montant en unités de la devise d'origine — aucune conversion. */
  amount: number;
  /** Code ISO de la devise écrite dans le texte. */
  currency: string;
}

// « 1 580 » (espaces de milliers, fines ou insécables), « 33,864 », « 4.3 », « 80 ».
const NOMBRE =
  String.raw`\d{1,3}(?:[\s  ]\d{3})+(?:[.,]\d+)?|\d+(?:[.,]\d+)?`;

// Échelle écrite : Md, Mds, Mrd, G, milliard(s), billion(s) ; M, Mn, million(s) ; k.
const ECHELLE = String.raw`milliards?|millions?|billions?|Mrd|Mds|Md|bn|Mn|M|G|k`;

const SYMBOLES = String.raw`US\$|CA\$|C\$|A\$|€|\$|£|₹`;
const CODES = String.raw`EUR|USD|GBP|CAD|INR|AUD`;
const MOTS = String.raw`euros?|dollars?|livres?\s+sterling|roupies?`;

const DEVISE = String.raw`${SYMBOLES}|\b(?:${CODES})\b|\b(?:${MOTS})\b`;
const FOURCHETTE = String.raw`(?:\s*(?:[-–—]|à|to)\s*(?:${NOMBRE}))?`;

// « 7,1 Md€ », « 5–10 M€ », « 350 à 950 M$ », « 12 milliards d'euros », « 100 000 $ ».
const NOMBRE_PUIS_DEVISE = new RegExp(
  String.raw`(?<![\w.,])(?<n>${NOMBRE})${FOURCHETTE}\s*(?<echelle>${ECHELLE})?\s*(?:(?:de|d['’])\s*)?(?<devise>${DEVISE})`,
  "giu",
);

// « US$13 Md », « €4,3 Md », « $30M », « EUR 10 Md ».
const DEVISE_PUIS_NOMBRE = new RegExp(
  String.raw`(?<devise>${SYMBOLES}|\b(?:${CODES})\b)\s*(?<n>${NOMBRE})${FOURCHETTE}\s*(?<echelle>${ECHELLE})?`,
  "giu",
);

function codeDevise(brut: string): string {
  const t = brut.trim().toLowerCase();
  if (t === "€" || t.startsWith("euro")) return "EUR";
  if (t === "£" || t.startsWith("livre")) return "GBP";
  if (t === "₹" || t.startsWith("roupie")) return "INR";
  if (t === "us$" || t === "$" || t.startsWith("dollar")) return "USD";
  if (t === "c$" || t === "ca$") return "CAD";
  if (t === "a$") return "AUD";
  return t.toUpperCase();
}

function facteur(echelle: string | undefined): number {
  if (!echelle) return 1;
  const e = echelle.toLowerCase();
  if (/^(milliards?|billions?|mrd|mds|md|bn|g)$/.test(e)) return 1_000_000_000;
  if (/^(millions?|mn|m)$/.test(e)) return 1_000_000;
  if (e === "k") return 1_000;
  return 1;
}

function lireNombre(brut: string): number {
  return Number(brut.replace(/[\s  ]/g, "").replace(",", "."));
}

/**
 * Premier montant monétaire explicite du texte, ou `null`. Une fourchette
 * (« 5–10 M€ ») donne sa borne basse ; la valeur d'origine reste affichée à
 * côté du montant par la page, qui ne la remplace jamais.
 */
export function extractMonetaryAmount(texte: string): MonetaryAmount | null {
  let premier: { index: number; amount: number; currency: string } | null = null;

  for (const motif of [NOMBRE_PUIS_DEVISE, DEVISE_PUIS_NOMBRE]) {
    motif.lastIndex = 0;
    for (const m of texte.matchAll(motif)) {
      const g = m.groups;
      if (!g || m.index === undefined) continue;
      const brut = lireNombre(g.n) * facteur(g.echelle);
      if (!Number.isFinite(brut)) continue;
      const amount = Number(brut.toPrecision(12));
      if (!premier || m.index < premier.index) {
        premier = { index: m.index, amount, currency: codeDevise(g.devise) };
      }
      break;
    }
  }

  return premier ? { amount: premier.amount, currency: premier.currency } : null;
}
