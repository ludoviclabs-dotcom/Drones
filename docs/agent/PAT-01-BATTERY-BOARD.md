# PAT-01 — Planche Patriot PAC-3 MSE : batterie et lanceur en 3D

Nouvelle planche technique `/hud/patriot-pac3-mse`, construite sur le modèle de
la planche Thundart (THD-01 à THD-08) : asset Blender reproductible piloté par
le MCP Blender, séquence en plusieurs états strictement pilotée par l'état,
inspection accessible, mouvement réduit respecté. Branche
`claude/pac3-mse-3d-model-263de2`.

## 1. Ce qui a été livré

| Livrable | Emplacement |
|---|---|
| Pipeline Blender paramétré (11 modules, spec JSON) | `tools/patriot-3d/` (voir son README) |
| Asset GLB compressé meshopt (~0,8 Mo, 4 clips) | `public/models/hud/patriot-pac3-mse.glb` |
| Page éditoriale (Server Component) | `src/app/hud/patriot-pac3-mse/page.tsx` |
| Expérience 3D client | `src/components/hud/patriot/` |
| Logique pure (séquence, mouvement, chronologie de tir, inspection) | `src/data/hud/patriot*.ts` |
| Vignette 1280 × 720 (46 Ko) | `public/images/hud/patriot-pac3-mse-preview.webp` |
| Tests | `tests/unit/patriot-*.test.ts` (4 fichiers, 55 tests), `tests/e2e/patriot-*.spec.ts` (2 fichiers, 29 tests) |

Intégration au site, toute additive :

- `src/data/hud/boards.ts` : la planche entre au registre (en tête) ; nouveau
  champ optionnel `systemSlugs` et `hudBoardForSystem()` pour les liens croisés.
- `src/app/systemes/[slug]/xray/page.tsx` : lien « Planche 3D interactive → »
  sur le System X-Ray des dossiers illustrés (`patriot-pac3-mse`, `pac-3-mse`).
- `src/app/layout.tsx` : lien de pied de page « HUD Patriot ».
- `src/app/globals.css` : `.patriotExperience` reprend la marge d'ancre et le
  gel du grain décoratif déjà en place pour Thundart.
- Trois planches au lieu de deux : sur l'accueil, la première vignette occupe
  les deux colonnes quand le nombre est impair (`HudBoardTeaser featured`) ;
  l'index `/hud` passe à trois colonnes dès 1024 px ; description de l'index
  mise à jour.
- `tests/e2e/hud-hub.spec.ts` (trois planches, grille sans orpheline) et
  `tests/e2e/smoke.spec.ts` (`A11Y_PAGES`).

Aucune dépendance ajoutée (`package.json` inchangé). `@gltf-transform/cli`
n'est appelé qu'au build de l'asset, via `npx`, version épinglée dans la spec.

## 2. Sources

Vérifiées et citées sur la planche ou dans la spec : FM 3-01.85 annexe B
(gabarits lanceur, conteneurs, tracteur, groupe 15 kW, EPP 2 × 150 kW, mât
OE-349, radar dressé à 67,5°), présentation partenaires Lockheed Martin 2024
(One-Pack, 12 MSE en 3 × 4, mixte 6 MSE + 8 CRI, moteur 11,4 in, gouvernes
repliables), page produit Lockheed Martin, GlobalSecurity, CSIS Missile Threat,
RTX (LTAMDS), Wikipedia DE (site fixe de 38°, confiance moyenne). Repères datés
de la page : Opex360 (16 août 2024), Lockheed Martin (4 nov. 2024,
6 janv. 2026, 29 juil. 2026), MetaDefense (21 juil. 2026).

Non retenus : i24news et Les Echos n'ont fourni aucun élément vérifiable
propre à l'objet de la planche ; rien n'en est cité. Aucun document source
n'est ajouté au dépôt : la planche et la spec citent leurs URL.

Photographies de l'utilisateur (lanceur polonais sur remorque, départ à
Taïwan, lanceur allemand sur MAN, tir à White Sands) : lecture des formes et de
la livrée d'essai de l'intercepteur (nez argent, avant-corps orange à bande
blanche, moteur sable, gouvernes noires), jamais de cotes.

## 3. Séquence et modes

Sept états, pilotés uniquement par Suivant / Précédent / Réinitialiser ou par la
liste des états (accès direct) :

| État | Pose | Caméra |
|---|---|---|
| `overview` | batterie, lanceur attelé | vue haute de la batterie, orbite libre au repos |
| `inspect` | idem | trois-quarts arrière du lanceur, orbite libre |
| `emplace` | clip `PAT_EMPLACE` joué | profil : départ du tracteur, stabilisateurs |
| `elevate` | clip `PAT_ELEVATE` joué | contre-plongée : gisement et site |
| `fire` | chronologie figée à 0,36 s | plan serré de l'allumage |
| `launch` | chronologie figée à 1,6 s | plan perpendiculaire à l'axe de tir, suivi de l'intercepteur pendant la transition |
| `complete` | chronologie figée à 7,4 s | plan large final, orbite libre |

Deux modes de tir, choisis avant la mise à feu puis verrouillés : **tir
unitaire** (conteneur 04) et **salve « ripple »** (04 puis 03, à 1,25 s — un
choix de lecture ; le mode lui-même est documenté publiquement, cf. l'essai
Lockheed Martin du 4 nov. 2024).

## 4. Mouvement et effets

Même contrat que Thundart : **NO STATE CHANGE = NO MOTION**. `patriot-motion.ts`
construit un plan à quatre canaux (caméra, `emplace`, `elevate`, `launch`) qui
repart toujours de la pose réelle, se termine sur une pose exacte et ne dépend
pas du framerate. En marche arrière, la chronologie de tir revient d'un coup
(on ne « rembobine » pas un départ), puis le lanceur redescend, plus vite qu'à
l'aller. Horloge de tir par paliers : allumage à ×0,4, départ à ×0,6, puis
temps réel. Mouvement réduit : chaque état est posé directement, même
information.

`patriot-launch.ts` décrit la mise à feu comme des fonctions pures du temps :
course dans le tube puis hors du tube (accélérations illustratives, aucune
physique), rupture des opercules, dépliage des gouvernes à la sortie du tube,
éclair d'allumage, et 1 128 bouffées de fumée et 28 éclats tirés d'une graine
fixe (mulberry32, aucune `Math.random`). `patriot-effects.ts` les rend en
billboards instanciés (un seul appel de rendu pour la fumée), triés d'arrière en
avant. L'intercepteur ne suit que l'axe du tube : aucune trajectoire.

## 5. Inspection

Douze sous-ensembles (station : lanceur, conteneurs, intercepteur, remorque,
groupe électrogène, ELES ; batterie : tracteur, radar, ECS, EPP, mât, autres
lanceurs), chacun relié à des nœuds réels du GLB, décrit par des faits sourcés
avec un repère « conf. moyenne » quand il le faut (site de tir, longueur de
l'intercepteur, autodirecteur en bande Ka, bande du radar). Survol, focus,
toucher et clic ; Entrée / Espace épinglent, Échap désépingle. Tant que
l'intercepteur est dans son conteneur, le désigner met en évidence les
conteneurs 04 et 03.

## 6. Profils de rendu

`render-profile.ts` sonde une fois le WebGL du navigateur, avant de créer le
contexte de la scène, et en déduit trois profils (exposés dans
`data-patriot-render-profile`) :

- **`hardware`** : rendu complet, inchangé.
- **`software`** : WebGL rendu en logiciel (SwiftShader des navigateurs de
  test, postes sans accélération). Mesuré à ~890 × 530 px : **1,25 s par
  image**, dont la moitié pour l'éclairage d'environnement et un quart pour
  l'anticrénelage — cinq fois Thundart. Le profil allégé retire environnement,
  anticrénelage et ombres, fixe `dpr` à 1, remonte l'ambiance pour compenser,
  et passe le plafond de pas de temps de 64 à 200 ms pour que les transitions
  gardent leur durée. Résultat : **~0,25 s par image** ; un changement d'état
  en mouvement réduit passe de 3–8 s à ~0,6 s.
- **`none`** : pas de WebGL 2 (que three.js exige). Sans détection, la
  création du rendu échouait en silence (promesse rejetée hors de toute
  frontière d'erreur) et la vue restait sur « Chargement de l'asset GLB
  local ». La planche affiche désormais un repli explicite, ne télécharge pas
  le GLB, et la séquence, les modes de tir et l'inspection restent
  utilisables. Les tests e2e purement DOM tournent dans ce mode : ils le
  vérifient, et n'imposent aucun rendu logiciel à l'agent de test.

La planche Thundart a le même angle mort sans WebGL 2 ; il n'est pas corrigé
ici (hors périmètre).

## 7. Vérifications exécutées

| Commande | Résultat |
|---|---|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS — 17 fichiers, 168 tests (dont 55 Patriot) |
| `npm run build` | PASS — `/hud/patriot-pac3-mse` pré-rendue (○) |
| `npm run test:e2e` | PASS — 98 tests, 2 workers, 5,0 min, dont 29 Patriot (axe WCAG 2.2 AA strict, contraste compris, à 5 largeurs) |
| `blender --background … generate-patriot.py` | PASS — ~40 s ; structure identique au build interactif (voir README, « Reproductibilité ») |

Le test de contrat `tests/unit/patriot-inspection.test.ts` lit le segment JSON
du GLB publié : extensions requises (meshopt et quantification seulement, pas de
Draco), nœuds pilotés présents une seule fois, chaque entrée du catalogue
désignable, clips et durées cohérents avec les valeurs de repli.

Premier passage complet : 96/97, un test Thundart (glisser sur la vue) hors
délai pendant que l'autre worker jouait les transitions Thundart ; seul, il
passe en 8 s. Après l'allègement du rendu logiciel et le passage des tests
DOM hors WebGL, la suite complète est verte et passe de 7,7 à 5,0 min.

## 8. Cadre non opérationnel

Aucune cible, coordonnée, trajectoire calculée, balistique, portée ni
procédure. Les tempos, panaches et la disposition de batterie (compressée)
sont des choix de lecture, dits comme tels sur la page (« Cadre éditorial »),
dans la description accessible et au pied du panneau d'inspection. Les tests
unitaires refusent le vocabulaire de ciblage dans les textes des états et du
catalogue.

## 9. Limitations connues

- L'asset reste une silhouette : pas de câblage, pas d'intérieur, pas de
  marquages réels ; la face du radar porte une texture illustrative générée
  localement.
- La disposition de batterie est compressée pour tenir dans le cadre : les
  distances réelles entre éléments sont bien plus grandes.
- Le chunk 3D différé reste le coût de R3F/three (comme Thundart).
- Sous rendu logiciel, la planche reste lente (~4 images/s) : c'est la limite
  du matériel, pas une boucle.
