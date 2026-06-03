const pptxgen = require("pptxgenjs");

const OUT =
  "C:/Users/Ludo/Drones/.claude/worktrees/sweet-black-0be338/docs/eurosatory/panoplie-eurosatory.pptx";

// Palette — thème sombre éditorial Panoplie
const BG = "16150F",
  PANEL = "1A1912",
  SURF2 = "272517",
  LINE = "33301F",
  LINEB = "4C4731",
  INK = "ECE6D5",
  DIM = "9C9783",
  FAINT = "948D79",
  ACCENT = "E07A4D";
const GRADE = { A: "61805A", B: "888A48", C: "B3823A", D: "B9602E", E: "A83A2C" };
const SERIF = "Georgia",
  MONO = "Consolas";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.author = "Panoplie";
pres.title = "Panoplie pour EuroSatory 2026";

const W = 13.3,
  M = 0.6,
  CW = W - 2 * M;
const RECT = pres.shapes.RECTANGLE;

function slideBase() {
  const s = pres.addSlide();
  s.background = { color: BG };
  return s;
}
function footer(s, n) {
  s.addText("PANOPLIE · OSINT · drones-mu.vercel.app", {
    x: M, y: 7.02, w: 9, h: 0.3, fontFace: MONO, fontSize: 9, color: FAINT,
    align: "left", margin: 0, charSpacing: 2,
  });
  s.addText(`${n} / 8`, {
    x: W - M - 1.4, y: 7.02, w: 1.4, h: 0.3, fontFace: MONO, fontSize: 9,
    color: FAINT, align: "right", margin: 0, charSpacing: 2,
  });
}
function kicker(s, t) {
  s.addText(t.toUpperCase(), {
    x: M, y: 0.5, w: CW, h: 0.35, fontFace: MONO, fontSize: 12, color: ACCENT,
    align: "left", margin: 0, charSpacing: 3,
  });
}
function title(s, t, fontSize = 32) {
  s.addText(t, {
    x: M, y: 0.92, w: CW, h: 1.15, fontFace: SERIF, fontSize, color: INK,
    align: "left", valign: "top", margin: 0,
  });
}
function card(s, x, y, w, h, header, body, accentHeader = false) {
  s.addShape(RECT, { x, y, w, h, fill: { color: PANEL }, line: { color: LINE, width: 1 } });
  s.addText(header, {
    x: x + 0.25, y: y + 0.22, w: w - 0.5, h: 0.55, fontFace: SERIF, fontSize: 17,
    color: accentHeader ? ACCENT : INK, align: "left", valign: "top", margin: 0,
  });
  s.addText(body, {
    x: x + 0.25, y: y + 0.82, w: w - 0.5, h: h - 1.02, fontFace: MONO, fontSize: 11.5,
    color: DIM, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.12,
  });
}

/* ===== Slide 1 — Couverture ===== */
{
  const s = slideBase();
  s.addText("OSINT · SOURCES OUVERTES · ANALYSE STRATÉGIQUE", {
    x: M, y: 0.8, w: CW, h: 0.4, fontFace: MONO, fontSize: 13, color: ACCENT,
    align: "left", margin: 0, charSpacing: 3,
  });
  s.addText("Panoplie", {
    x: M, y: 1.9, w: CW, h: 1.5, fontFace: SERIF, fontSize: 76, color: INK,
    align: "left", margin: 0,
  });
  s.addText(
    [
      { text: "Observatoire OSINT des systèmes de défense — ", options: { color: DIM } },
      { text: "sourcé, daté, comparable.", options: { color: ACCENT, italic: true } },
    ],
    { x: M, y: 3.45, w: CW, h: 0.7, fontFace: SERIF, fontSize: 26, align: "left", margin: 0 },
  );
  s.addText(
    "Coût · finance · supply chain · géopolitique · export. Une lecture stratégique, industrielle et financière — jamais opérationnelle.",
    { x: M, y: 4.25, w: 10.5, h: 0.9, fontFace: MONO, fontSize: 13, color: DIM, align: "left", margin: 0, lineSpacingMultiple: 1.2 },
  );
  // bandeau de tampons
  const tags = ["OSINT", "MULTI-DOMAINES", "94 SYSTÈMES · 9 MARINES · 6 DOMAINES"];
  let tx = M;
  tags.forEach((t) => {
    const tw = 0.55 + t.length * 0.092;
    s.addShape(RECT, { x: tx, y: 5.35, w: tw, h: 0.45, fill: { color: PANEL }, line: { color: LINEB, width: 1 } });
    s.addText(t, { x: tx, y: 5.35, w: tw, h: 0.45, fontFace: MONO, fontSize: 11, color: INK, align: "center", valign: "middle", margin: 0, charSpacing: 1 });
    tx += tw + 0.25;
  });
  s.addText("EuroSatory 2026 · 15–19 juin · Paris-Nord Villepinte", {
    x: M, y: 6.6, w: CW, h: 0.4, fontFace: MONO, fontSize: 13, color: FAINT, align: "left", margin: 0, charSpacing: 2,
  });
}

/* ===== Slide 2 — Le problème ===== */
{
  const s = slideBase();
  kicker(s, "01 — Le problème");
  title(s, "Un système d'armes n'est jamais un simple achat.");
  const cardsY = 2.6, cardH = 3.2, gap = 0.35, cw = (CW - 2 * gap) / 3;
  card(s, M, cardsY, cw, cardH, "Le prix catalogue ment",
    "Le coût réel se cache dans le MCO, les munitions, l'écosystème et la disponibilité — rarement dans le prix d'acquisition annoncé.", true);
  card(s, M + cw + gap, cardsY, cw, cardH, "Les dépendances sont invisibles",
    "Capteurs, CMS, missiles, logiciels, réexport : la chaîne industrielle et les contrôles (ITAR, MTCR) décident autant que la plateforme.", true);
  card(s, M + 2 * (cw + gap), cardsY, cw, cardH, "Pas de lecture comparée fiable",
    "Entre catalogue technique et marketing, il manque une lecture sourcée, datée et honnête sur sa confiance.", true);
  s.addText("→ Panoplie comble ce vide : peu de systèmes, mais mieux documentés.", {
    x: M, y: 6.2, w: CW, h: 0.5, fontFace: SERIF, fontSize: 16, italic: true, color: DIM, align: "left", margin: 0,
  });
  footer(s, 2);
}

/* ===== Slide 3 — La réponse ===== */
{
  const s = slideBase();
  kicker(s, "02 — La réponse Panoplie");
  title(s, "Un observatoire OSINT, multi-domaines et auditable");
  s.addText(
    "Chaque affirmation est tracée jusqu'à sa source, notée en confiance et datée. La grille de lecture est la même partout : cinq briques, six paliers A–E.",
    { x: M, y: 2.0, w: CW, h: 0.8, fontFace: MONO, fontSize: 13, color: DIM, align: "left", margin: 0, lineSpacingMultiple: 1.2 },
  );
  const stats = [
    ["94", "systèmes documentés"],
    ["9", "marines (France → Indo-Pacifique)"],
    ["6", "domaines à grille constante"],
    ["2 000+", "affirmations tracées & sourcées"],
  ];
  const sy = 3.1, sh = 3.0, gap = 0.35, sw = (CW - 3 * gap) / 4;
  stats.forEach(([num, label], i) => {
    const x = M + i * (sw + gap);
    s.addShape(RECT, { x, y: sy, w: sw, h: sh, fill: { color: PANEL }, line: { color: LINE, width: 1 } });
    s.addText(num, { x: x + 0.2, y: sy + 0.6, w: sw - 0.4, h: 1.2, fontFace: SERIF, fontSize: 54, color: ACCENT, align: "left", valign: "middle", margin: 0 });
    s.addText(label, { x: x + 0.2, y: sy + 1.9, w: sw - 0.4, h: 0.9, fontFace: MONO, fontSize: 12, color: DIM, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.15 });
  });
  footer(s, 3);
}

/* ===== Slide 4 — La méthode ===== */
{
  const s = slideBase();
  kicker(s, "03 — La méthode");
  title(s, "Cinq briques, six paliers, un registre de preuves");
  const colY = 2.3, colH = 4.0;
  const lw = CW * 0.52, rw = CW - lw - 0.4;
  // gauche : 5 briques
  s.addShape(RECT, { x: M, y: colY, w: lw, h: colH, fill: { color: PANEL }, line: { color: LINE, width: 1 } });
  s.addText("CINQ BRIQUES DE LECTURE", { x: M + 0.25, y: colY + 0.2, w: lw - 0.5, h: 0.35, fontFace: MONO, fontSize: 11, color: FAINT, margin: 0, charSpacing: 2 });
  const bricks = [
    ["Coût", "coût complet, pas le prix catalogue"],
    ["Finance", "canal d'acquisition, cycles budgétaires"],
    ["Supply chain", "dépendances et fournisseurs critiques"],
    ["Géopolitique", "rôle, autonomie, interopérabilité"],
    ["Export", "régime de contrôle, réexport, attractivité"],
  ];
  bricks.forEach(([n, d], i) => {
    const yy = colY + 0.75 + i * 0.62;
    s.addText([
      { text: `0${i + 1}  `, options: { color: ACCENT, fontFace: MONO, fontSize: 12 } },
      { text: `${n} — `, options: { color: INK, fontFace: SERIF, fontSize: 15, bold: true } },
      { text: d, options: { color: DIM, fontFace: MONO, fontSize: 11 } },
    ], { x: M + 0.25, y: yy, w: lw - 0.5, h: 0.55, align: "left", valign: "middle", margin: 0 });
  });
  // droite : 6 paliers + bande A–E
  const rx = M + lw + 0.4;
  s.addShape(RECT, { x: rx, y: colY, w: rw, h: colH, fill: { color: PANEL }, line: { color: LINE, width: 1 } });
  s.addText("SIX PALIERS D'ÉVALUATION", { x: rx + 0.25, y: colY + 0.2, w: rw - 0.5, h: 0.35, fontFace: MONO, fontSize: 11, color: FAINT, margin: 0, charSpacing: 2 });
  const scores = ["Efficacité-coût", "Survivabilité", "Exportabilité", "Risque industriel", "Maturité", "Confiance des données"];
  scores.forEach((sc, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const cwd = (rw - 0.5 - 0.2) / 2;
    const x = rx + 0.25 + col * (cwd + 0.2);
    const y = colY + 0.75 + row * 0.62;
    s.addShape(RECT, { x, y, w: cwd, h: 0.5, fill: { color: SURF2 }, line: { color: LINE, width: 1 } });
    s.addText(sc, { x: x + 0.12, y, w: cwd - 0.24, h: 0.5, fontFace: MONO, fontSize: 10.5, color: DIM, align: "left", valign: "middle", margin: 0 });
  });
  // bande A–E colorée
  const bandY = colY + 2.85, letters = ["A", "B", "C", "D", "E"];
  const bw = (rw - 0.5 - 4 * 0.12) / 5;
  letters.forEach((L, i) => {
    const x = rx + 0.25 + i * (bw + 0.12);
    s.addShape(RECT, { x, y: bandY, w: bw, h: 0.62, fill: { color: GRADE[L] }, line: { color: BG, width: 1 } });
    s.addText(L, { x, y: bandY, w: bw, h: 0.62, fontFace: MONO, fontSize: 20, bold: true, color: BG, align: "center", valign: "middle", margin: 0 });
  });
  s.addText("A excellent · E critique — chaque palier est argumenté, aucun n'est un score chiffré.", {
    x: rx + 0.25, y: bandY + 0.72, w: rw - 0.5, h: 0.5, fontFace: MONO, fontSize: 10, italic: true, color: FAINT, margin: 0, lineSpacingMultiple: 1.1,
  });
  footer(s, 4);
}

/* ===== Slide 5 — La preuve (Console) ===== */
{
  const s = slideBase();
  kicker(s, "04 — La preuve");
  title(s, "Tout est traçable — la Console OSINT");
  // chaîne de preuve
  const chain = ["Système", "Affirmation", "Source (A–D)", "Confiance", "Statut", "Fraîcheur"];
  const cy = 2.5, ch = 1.0, gap = 0.18, cw = (CW - (chain.length - 1) * gap - 0.0) / chain.length;
  chain.forEach((c, i) => {
    const x = M + i * (cw + gap);
    s.addShape(RECT, { x, y: cy, w: cw, h: ch, fill: { color: PANEL }, line: { color: i === 0 ? ACCENT : LINEB, width: 1 } });
    s.addText(c, { x: x + 0.08, y: cy, w: cw - 0.16, h: ch, fontFace: MONO, fontSize: 11, color: INK, align: "center", valign: "middle", margin: 0 });
    if (i < chain.length - 1)
      s.addText("→", { x: x + cw - 0.02, y: cy, w: gap + 0.04, h: ch, fontFace: MONO, fontSize: 12, color: FAINT, align: "center", valign: "middle", margin: 0 });
  });
  const feats = [
    ["Compteurs dérivés", "Aucun chiffre saisi à la main — tout vient des données. Date d'arrêté du registre affichée."],
    ["Filtres & export", "Domaine, confiance, source primaire/secondaire, fraîcheur. Export CSV / JSON du jeu filtré."],
    ["Heatmap de confiance", "Par section de dossier : où la preuve est solide, où elle reste fragile."],
  ];
  const fy = 4.0, fh = 2.5, fgap = 0.35, fw = (CW - 2 * fgap) / 3;
  feats.forEach(([h, b], i) => card(s, M + i * (fw + fgap), fy, fw, fh, h, b, true));
  footer(s, 5);
}

/* ===== Slide 6 — Les domaines ===== */
{
  const s = slideBase();
  kicker(s, "05 — Les domaines");
  title(s, "Six domaines, neuf marines");
  const domains = [
    "Drones & munitions rôdeuses", "Énergie dirigée", "Aviation de combat",
    "Missiles", "Radars & capteurs", "Bâtiments navals",
  ];
  const dy = 2.35, dgap = 0.3, dcols = 3, dw = (CW - (dcols - 1) * dgap) / dcols, dh = 0.95;
  domains.forEach((d, i) => {
    const col = i % dcols, row = Math.floor(i / dcols);
    const x = M + col * (dw + dgap), y = dy + row * (dh + dgap);
    s.addShape(RECT, { x, y, w: dw, h: dh, fill: { color: PANEL }, line: { color: LINE, width: 1 } });
    s.addText(d, { x: x + 0.25, y, w: dw - 0.5, h: dh, fontFace: SERIF, fontSize: 16, color: INK, align: "left", valign: "middle", margin: 0 });
  });
  // pack naval
  const ny = dy + 2 * (dh + dgap) + 0.15;
  s.addShape(RECT, { x: M, y: ny, w: CW, h: 1.55, fill: { color: SURF2 }, line: { color: LINEB, width: 1 } });
  s.addText("PACK NAVAL — NEUF MARINES", { x: M + 0.25, y: ny + 0.2, w: CW - 0.5, h: 0.35, fontFace: MONO, fontSize: 11, color: ACCENT, margin: 0, charSpacing: 2 });
  s.addText("France · États-Unis · Royaume-Uni · Italie · Espagne · Allemagne · Japon · Corée du Sud · Chine", {
    x: M + 0.25, y: ny + 0.6, w: CW - 0.5, h: 0.45, fontFace: SERIF, fontSize: 18, color: INK, margin: 0,
  });
  s.addText("Porte-avions, destroyers Aegis, frégates, sous-marins AIP, amphibies — Chine traitée en confiance abaissée et triangulée.", {
    x: M + 0.25, y: ny + 1.05, w: CW - 0.5, h: 0.4, fontFace: MONO, fontSize: 11, color: DIM, margin: 0,
  });
  footer(s, 6);
}

/* ===== Slide 7 — La démonstration (comparateur) ===== */
{
  const s = slideBase();
  kicker(s, "06 — La démonstration");
  title(s, "Comparer des architectures, pas des noms");
  const modes = [
    ["Par pays", "Charger toutes les unités d'une marine et les confronter dans un domaine."],
    ["Par famille", "Frégates contre frégates, destroyers contre destroyers — entre frères."],
    ["Chaîne système", "Plateforme → capteurs → CMS/C2 → effecteurs → industriels, côte à côte."],
  ];
  const my = 2.5, mh = 2.3, mgap = 0.35, mw = (CW - 2 * mgap) / 3;
  modes.forEach(([h, b], i) => card(s, M + i * (mw + mgap), my, mw, mh, h, b, true));
  s.addShape(RECT, { x: M, y: 5.2, w: CW, h: 1.3, fill: { color: PANEL }, line: { color: LINE, width: 1 } });
  s.addText("Exemple de démo", { x: M + 0.25, y: 5.35, w: CW - 0.5, h: 0.35, fontFace: MONO, fontSize: 11, color: FAINT, margin: 0, charSpacing: 2 });
  s.addText("Maya (JP) · KDX-III Batch II (KR) · Arleigh Burke (US) — même brique Aegis, lectures export et souveraineté différentes, paliers A–E argumentés.", {
    x: M + 0.25, y: 5.72, w: CW - 0.5, h: 0.7, fontFace: SERIF, fontSize: 16, color: DIM, italic: true, margin: 0, lineSpacingMultiple: 1.15,
  });
  footer(s, 7);
}

/* ===== Slide 8 — Pipeline, roadmap, contact ===== */
{
  const s = slideBase();
  kicker(s, "07 — Produit & feuille de route");
  title(s, "Un produit, pas un site");
  // pipeline
  s.addText("PIPELINE DE DONNÉES", { x: M, y: 2.0, w: CW, h: 0.3, fontFace: MONO, fontSize: 11, color: FAINT, margin: 0, charSpacing: 2 });
  const pipe = ["Source", "Extraction", "Revue éditoriale", "Confiance + fiabilité", "Publication"];
  const py = 2.4, ph = 0.85, pgap = 0.16, pw = (CW - (pipe.length - 1) * pgap) / pipe.length;
  pipe.forEach((p, i) => {
    const x = M + i * (pw + pgap);
    s.addShape(RECT, { x, y: py, w: pw, h: ph, fill: { color: PANEL }, line: { color: LINEB, width: 1 } });
    s.addText(p, { x: x + 0.06, y: py, w: pw - 0.12, h: ph, fontFace: MONO, fontSize: 10.5, color: INK, align: "center", valign: "middle", margin: 0 });
  });
  // roadmap + cas d'usage
  const ry = 3.75, rh = 2.0, rgap = 0.4, rw = (CW - rgap) / 2;
  card(s, M, ry, rw, rh, "Feuille de route (post-salon)",
    "Défense aérienne & antimissile (SAMP/T, Patriot, NASAMS, Arrow 3) · Systèmes de combat / C2 IAMD (Aegis, TACTICOS, IBCS) · vague navale (F127, Type 076, KDDX).", true);
  card(s, M + rw + rgap, ry, rw, rh, "Cas d'usage",
    "Industriels (supply chain, ITAR) · institutionnels (méthode, preuve) · analystes & presse (Console, export, sources primaires).", true);
  // cadre éthique + contact
  s.addText("Cadre éthique — analyse capacitaire, industrielle et publique uniquement. Pas d'aide au ciblage, pas de paramètres tactiques.", {
    x: M, y: 6.0, w: CW, h: 0.5, fontFace: MONO, fontSize: 10.5, italic: true, color: FAINT, margin: 0, lineSpacingMultiple: 1.1,
  });
  s.addText("drones-mu.vercel.app · ludoviclabs@gmail.com", {
    x: M, y: 6.55, w: CW, h: 0.4, fontFace: MONO, fontSize: 13, color: ACCENT, margin: 0, charSpacing: 2,
  });
  footer(s, 8);
}

pres.writeFile({ fileName: OUT }).then(() => console.log("WROTE " + OUT));
