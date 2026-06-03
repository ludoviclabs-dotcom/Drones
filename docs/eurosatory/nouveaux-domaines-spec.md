# Spec — nouveaux domaines (Défense aérienne & Systèmes de combat / C2)

> Statut : **✅ Implémenté (juin 2026).** Les deux domaines sont en ligne — catégories
> `air-defense` et `combat-system`, pages `/defense-aerienne` et `/systemes-combat`,
> 11 dossiers sourcés (NB : IRIS-T SLM existait déjà comme `missile` ; remplacé ici par
> David's Sling). Ce document reste la référence d'architecture et liste l'évolution
> restante (généraliser la chaîne système au-delà du naval).

## Pourquoi pas tout de suite

- Les **effecteurs** de défense aérienne existent déjà comme `missile` (THAAD, PAC-3 MSE,
  IRIS-T SLM, CAMM, Aster 30). Le manque = les **systèmes intégrés** (SAMP/T, Patriot,
  NASAMS, Arrow 3, Iron Dome) et un domaine dédié.
- Aegis, TACTICOS, PAAMS, SETIS, SUBTICS sont déjà décrits comme **CMS** dans les
  `navalProfile`. Un domaine C2 autonome a une valeur marginale plus faible que le reste.
- Ajouter une catégorie touche **plusieurs maps exhaustives** `Record<SystemCategory, …>`
  → bien les traiter toutes, sinon erreur TS.

## Checklist d'ajout d'une catégorie (gotchas)

1. `src/data/types.ts` : ajouter à l'union `SystemCategory` + un enum de classe
   (ex. `AirDefenseClass = "VSHORAD" | "SHORAD" | "MRAD" | "LRAD-HIMAD" | "BMD" | "C-RAM" | "C-UAS"`),
   et un champ optionnel sur `DefenseSystem` (ex. `airDefenseClass?`).
2. `src/data/schema.ts` : ajouter la valeur à l'enum `SystemCategory` Zod + le champ optionnel.
3. **Maps exhaustives `Record<SystemCategory, …>`** (sinon build cassé) :
   - `src/components/domain-emblem.tsx` → ajouter une entrée `EMBLEMS` (SVG au trait).
   - `src/data/labels.ts` → `CATEGORY_LABELS` + (si besoin) labels de classe + blurbs.
   - vérifier tout autre `Record<SystemCategory>` (grep `Record<SystemCategory`).
4. `src/data/domains.ts` : ajouter l'entrée `DOMAINS` (label, href, cta, blurb).
5. `src/app/<route>/page.tsx` : page de domaine (copier le gabarit de `radars/page.tsx`
   ou `missiles/page.tsx` — filtre `systems.filter(s => s.category === "…")`).
6. `src/app/sitemap.ts` : ajouter la route à `STATIC_ROUTES`.
7. `src/app/<route>/page.tsx` : `metadata.alternates.canonical`.
8. Le comparateur, la console, la matrice, l'OG et le sitemap incluent les systèmes
   automatiquement (dérivés de `systems`). `grouping.familyLabel` : ajouter un `case`.
9. Tests : `tests/data/systems.schema.test.ts` valide automatiquement les nouveaux dossiers.

## Domaine 1 — Défense aérienne & antimissile (`air-defense`)

Route `/defense-aerienne`. Taxonomie de classe par couche :
`VSHORAD · SHORAD · MRAD · LRAD/HIMAD · BMD · C-RAM · C-UAS`.

| Système | Pays | Classe | Sources primaires conseillées |
|---|---|---|---|
| SAMP/T NG | France · Italie | MRAD/LRAD | MBDA, OCCAR, DGA |
| Patriot (PAC-3 MSE) | États-Unis | LRAD/BMD | RTX, US Army, CRS |
| NASAMS | Norvège · US | SHORAD/MRAD | Kongsberg, RTX |
| IRIS-T SLM | Allemagne | SHORAD/MRAD | Diehl Defence, BMVg |
| Arrow 3 | Israël · US | BMD | IAI, MDA |
| Iron Dome / C-Dome | Israël | C-RAM/SHORAD | Rafael |

> Lier chaque système à ses effecteurs déjà documentés (PAC-3 MSE, IRIS-T SLM…)
> via `integrationFrameworks` (champ existant) pour la lecture réseau.

## Domaine 2 — Systèmes de combat & C2 / IAMD (`combat-system`)

Route `/systemes-combat`. Classe : `naval-cms · iamd-c2 · c4isr · sous-marin · collaboratif`.

| Système | Pays | Sources primaires conseillées |
|---|---|---|
| Aegis (fiche dédiée) | États-Unis | Lockheed Martin, US Navy |
| TACTICOS | Pays-Bas | Thales |
| PAAMS / Sea Viper | FR · IT · UK | MBDA, Eurosam |
| SETIS / SUBTICS | France | Naval Group |
| IBCS | États-Unis | Northrop Grumman, US Army |

> Réutiliser `NavalCombatSystemFamily` (déjà dans `types.ts`) pour le rattachement
> aux navires. Beaucoup de matière existe déjà dans les `navalProfile.combatSystem`.

## Gabarit d'un dossier hand-authored

Copier la structure d'un fichier missile/radar existant (ex. `src/data/systems/thaad.ts`) :
`slug, name, reference (PNP-AD-001+ / PNP-C2-001+), category, <classe>, classLabel,
country, flag, manufacturer, status, acquisitionModes, tagline, summary, keySpecs[],
bricks[] (5, écrites à la main), scores[] (6), editorial, operators[], theatres[],
timeline?, sources[], updated`. Enregistrer dans `src/data/systems.ts`.

## Comparateur — mode « chaîne système » au-delà du naval

Aujourd'hui `RelationGraph` est gardé sur `navalProfile`. Pour étendre aux autres
domaines, généraliser une `buildChain(system)` (capteurs/effecteurs/intégration depuis
`keySpecs` + `integrationFrameworks`) ou ajouter des profils structurés par domaine.
