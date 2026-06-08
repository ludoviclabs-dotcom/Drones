// Source de vérité partagée des slugs dont le X-Ray est éditorialement curé
// (par opposition au fallback `genericNodes()`).
//
// Liste dupliquée des clés de `SYSTEM_NODE_BUILDERS` dans `panoplie-xray.ts` :
// le fichier panoplie-xray pèse > 1200 lignes et son import depuis le bundle
// client (system-card, etc.) serait inutilement lourd. La cohérence des deux
// listes est validée par `tests/data/xray-scenarios.test.ts`.

export const XRAY_EDITED_SLUGS: ReadonlySet<string> = new Set([
  "bayraktar-tb2",
  "rafale",
  "f-35",
  "f-15ex",
  "mq-9-reaper",
  "shahed-136",
  "spy-6",
  "fremm-france",
  "eurofighter-typhoon",
  "charles-de-gaulle",
  "helma-p",
  "aster-30-b1nt",
  "j-20",
  "sea-fire",
  "dragonfire",
  "meteor",
  "mica-ng",
]);

export function isXrayEdited(slug: string): boolean {
  return XRAY_EDITED_SLUGS.has(slug);
}
