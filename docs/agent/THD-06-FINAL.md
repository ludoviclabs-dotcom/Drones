# THD-06 — Revue finale et préparation PR

Dernier audit de `claude/thundart-cinematic-hud` avant ouverture d'une pull
request vers `main`. Cette mission n'ajoute aucune fonctionnalité : elle
vérifie, de façon indépendante des handoffs THD-01 à THD-05, que la branche est
prête.

**Verdict : PR READY — PR ouverte, non fusionnée.**

## 0. Contexte d'exécution

Le worktree de cette mission (`sweet-black-0be338`) était sur
`claude/thundart-3d-blender-asset-2f4362`. La branche `claude/thundart-cinematic-hud`
était déjà extraite dans le worktree principal (`C:/Users/Ludo/Drones`) : git
interdit de l'extraire une seconde fois ici. Après `git fetch`, `origin/claude/thundart-cinematic-hud`
s'est révélée synchronisée (`8a795f8`) et strictement postérieure à ma propre
branche (`b6af63e` en est un ancêtre direct). L'audit a donc été mené sur un
`git checkout --detach origin/claude/thundart-cinematic-hud` dans ce worktree —
aucune donnée déplacée, aucun conflit avec le worktree principal.

## 1. État Git initial (avant toute modification)

| | |
|---|---|
| `origin/main` | `24e053c0cf5c9b62943e04c71ada6c1b3d7a7384` |
| Tip de la branche | `8a795f8966c891940038ddba3c517ecef9ec58aa` |
| Working tree | propre |

Ascendance complète, linéaire, vérifiée par `git log --oneline 24e053c..8a795f8` :

```
d24fcb9 feat(thundart): add reproducible Blender demo asset        (THD-01)
b2aadc9 feat(thundart): scaffold interactive 3d hud                (THD-02)
b6af63e feat(thundart): add state-driven cinematic sequence        (THD-03)
8a1f35b feat(thundart): add technical hud and accessible inspection (THD-04)
dc4abd0 perf(thundart): harden preview loading                     (THD-05)
8a795f8 test(thundart): harden cinematic hud for preview           (THD-05)
```

`git diff origin/main...HEAD --shortstat` : **30 fichiers, +5528 / −3**.

## 2. Architecture finale

| Fichier | Rôle |
|---|---|
| `src/app/hud/thundart/page.tsx` | Server Component éditorial ; racine `<div>` (le `<main>` du layout global suffit — un `<main>` local aurait dupliqué le landmark). |
| `src/components/hud/thundart/ThundartExperience.tsx` | Frontière client ; possède les deux machines d'état (séquence THD-02/03, inspection THD-04) ; importe `ThundartScene3D` via `next/dynamic({ ssr:false })`. |
| `src/components/hud/thundart/ThundartScene3D.tsx` | Canvas R3F, éclairage, sol/grille, `OrbitControls`, chrome HUD (labels SYSTEM/STATE, callout d'inspection). |
| `src/components/hud/thundart/ThundartModel.tsx` | Chargement GLB, `AnimationMixer` (THD-03), matériaux d'inspection clonés (THD-04). Propriétaire unique du mouvement et du survol/clic 3D. |
| `src/components/hud/thundart/ThundartControls.tsx` | Bandeau Précédent/Réinitialiser/Suivant. |
| `src/components/hud/thundart/ThundartInspectionPanel.tsx` | Rail HTML accessible : cinq boutons natifs, source documentée, détail épinglé. |
| `src/components/hud/thundart/usePrefersReducedMotion.ts` | Suivi live de `prefers-reduced-motion`. |
| `src/data/hud/thundart.ts`, `thundart-motion.ts`, `thundart-inspection.ts` | Logique pure : reducer de séquence, plans de mouvement, catalogue et reducer d'inspection. |

Aucune duplication trouvée entre ces fichiers : la machine de séquence
(THD-02/03) et celle d'inspection (THD-04) sont indépendantes et ne se
recouvrent pas ; `ThundartModel.tsx` est le seul point où mouvement et
inspection touchent le graphe Three.js.

### Isolation confirmée

- `package.json` / `package-lock.json` : **aucun diff** — zéro dépendance ajoutée.
- `src/components/decision-twin/`, `SystemXray*`, `HudScene*` : **aucun fichier touché**.
- Aucune référence à `SystemXray`, `PanoplieXrayBackdrop` ou `decision-twin`
  dans tout `src/components/hud/thundart/` ni `src/data/hud/` — l'isolation
  annoncée par THD-02 est réelle, pas seulement déclarée.
- Fichiers touchés hors `thundart/`/`docs/agent/` : `.gitignore` (ignore
  `*.blend`), `src/app/globals.css` (extension de la règle de gel du grain
  décoratif à `.thundartExperience`, déjà en place pour `.hudScene`),
  `src/app/layout.tsx` (lien pied de page), `src/app/sitemap.ts` (entrée
  sitemap), `tests/e2e/smoke.spec.ts` (ajout à `A11Y_PAGES`). Les cinq sont
  additifs et conformes aux conventions déjà en place sur `/hud/drone-airframe`.
- `git diff` grep sur `target(ing)|trajectoire|balistiq|portee|impact|warhead` :
  toutes les occurrences sont soit le `target` de caméra/`OrbitControls`
  (terminologie Three.js standard), soit des interdictions explicites écrites
  en commentaire/doc. **Aucun code de ciblage ou de calcul balistique.**
- `src/data/hud/thundart-inspection.ts` relu intégralement : cinq entrées,
  aucune caractéristique chiffrée inventée, `NON DOCUMENTÉ` / `—` en absence
  d'information.
- Aucun `TODO`/`FIXME`/`HACK`, aucun `console.log` résiduel dans le diff.
- `public/models/hud/thundart.glb` : MD5 `311ea46394b9a59d3e73b03b3b9094a5`,
  **identique** à celui validé en THD-01/THD-03. `tools/thundart-3d/`
  **inchangé** depuis THD-03. Aucun hack Blender/GLB.
- `public/models/hud/` ne contient que `thundart.glb` ; aucun `.blend`,
  aucun asset orphelin dans le worktree.

### Trouvaille mineure — inexactitude documentaire, sans impact

`docs/agent/THD-04-HUD-A11Y.md` mentionne un nœud `THD_Canister_Group` dans son
tableau de correspondance. Ce nœud **n'existe pas** dans le GLB (vérifié par
lecture directe du chunk JSON glTF — les 24 nœuds sont listés en §3) ni dans le
code : `thundart-inspection.ts` route déjà les huit conteneurs réels
(`THD_Canister_01`..`08`) par préfixe (`nodeName.startsWith("THD_Canister_")`).
Erreur de documentation sans conséquence fonctionnelle ; non corrigée ici pour
ne pas rouvrir un fichier de handoff clos, mais signalée pour mémoire.

## 3. Asset 3D final

Vérifié par lecture directe du binaire (pas seulement par confiance dans les
handoffs précédents) :

| | |
|---|---|
| Fichier | `public/models/hud/thundart.glb` |
| Taille | 73 036 octets (71,3 Kio) |
| MD5 | `311ea46394b9a59d3e73b03b3b9094a5` — identique THD-01→THD-06 |
| Nœuds | 24 (`THD_Root`, `THD_Vehicle`, `THD_Axles`, `THD_Cab`, `THD_Chassis`, 8×`THD_Wheel_*`, `THD_Launcher_Base`, `THD_Launcher_Rack`, 8×`THD_Canister_*`, `THD_Rocket_Demo`) |
| Nœuds maillés | 21 |
| Animations | `THD_CONFIGURE_DEMO`, `THD_DEPARTURE_DEMO` |
| `extensionsUsed`/`extensionsRequired` | vides — aucun décodeur externe requis |

### Audit du chargement et du cycle de vie (`ThundartModel.tsx`)

| Point vérifié | Constat |
|---|---|
| GLB chargé une seule fois | `useGLTF(THUNDART_ASSET_PATH)` (cache drei) ; la scène est clonée (`scene.clone(true)`) dans un `useMemo` keyé sur `scene`, jamais recréée sans raison. |
| Noms de nœuds stables | Les 24 noms lus dans le binaire correspondent exactement à ceux utilisés par `thundartInspectionIdForNodeName` et par `FLASH_HOST_NODE`. |
| Animations stables | `CONFIGURE_CLIP`/`DEPARTURE_CLIP` dérivés de `THUNDART_ASSET_MANIFEST.animationClips`, qui correspond aux deux clips réels du GLB. |
| Reset stable | Machine de mouvement THD-03 inchangée depuis `b6af63e` (diff vide) ; 30 tests unitaires + 6 tests E2E dédiés au reset/interruption, tous verts (§6). |
| Cleanup des ressources | Les matériaux clonés (un par mesh, pour ne jamais muter le cache partagé) sont disposés dans le cleanup d'un `useEffect` keyé sur `[preparedModel.materials]`. Les géométries ne sont **pas** clonées (partagées avec le cache `useGLTF`, donc `dispose={null}` sur le `<primitive>` est correct : les disposer casserait un futur remontage). |
| `AnimationMixer` cleanup | `disposeRuntime()` : retire le flash de son hôte, dispose sa géométrie/matériau, `mixer.stopAllAction()` puis `mixer.uncacheRoot(...)` — libère tous les bindings internes. Appelé dans le cleanup de l'effet `[model, animations]`. |
| `OrbitControls` cleanup | Composant `<OrbitControls>` de drei, dont le code source (`three-stdlib`) appelle `controls.dispose()` à son démontage — vérifié en lisant le paquet installé. |
| Fuites de listener | Un seul `addEventListener` dans toute la fonctionnalité (`usePrefersReducedMotion.ts`, `matchMedia("change")`), avec `removeEventListener` symétrique dans le cleanup du `subscribe()`. |
| RAF permanent | Aucun `setInterval`/`requestAnimationFrame` en dehors du `useFrame` de R3F. Canvas en `frameloop="demand"` ; le callback `useFrame` retourne immédiatement si `planRef.current` est `null` — pas de frame demandée hors transition. |

Aucune trouvaille bloquante. La mécanique décrite dans THD-03
(« NO STATE CHANGE = NO MOTION ») tient toujours sous la couche d'inspection
ajoutée par THD-04 : celle-ci n'invalide une frame que sur un changement de
matériau (survol/sélection), jamais en boucle.

## 4. Interaction finale

Cinq états (`overview`, `inspect`, `configure`, `departure`, `complete`)
pilotés uniquement par NEXT/PREVIOUS/RESET, plus une couche d'inspection
indépendante (survol/focus = aperçu, clic/Entrée/Espace = épinglage, Échap =
désélection) qui ne déclenche jamais de mouvement de caméra ni de clip.

Revue visuelle des cinq états en navigateur réel (Chromium headless,
1440 × 1400, build de production) :

- **OVERVIEW** — silhouette complète, cadrage trois-quarts avant. Clair.
- **INSPECT** — bascule en trois-quarts arrière : les huit conteneurs
  deviennent lisibles d'un coup d'œil. Le changement de caméra est net, pas
  seulement une confirmation textuelle.
- **CONFIGURE** — le rack est visiblement incliné, cadrage reculé pour le
  contenir. Perceptible sans ambiguïté.
- **DEPARTURE** — le projectile de démonstration flotte, détaché, au-dessus du
  rack. Aucune traînée, aucune fumée, aucun flou de mouvement, aucune cible au
  sol : se lit comme une séparation illustrative, pas comme un tir. Le flash
  bref (halo pâle sur le tube porteur, code inchangé depuis THD-03) n'apparaît
  que pendant la transition, jamais dans la pose figée.
- **COMPLETE** — cadrage légèrement plus large, mais surtout le bouton
  « Suivant » devient désactivé et l'onglet « FIN » s'allume : le signal de fin
  est univoque, porté par l'UI plutôt que par un mouvement de caméra
  supplémentaire — cohérent avec la consigne « arrêt sur image ».

Aucun effet n'est trop subtil pour paraître cassé (chaque état change
visiblement de cadrage et/ou de pose) ; aucun n'est assez spectaculaire pour
évoquer un jeu vidéo (palette industrielle mate, pas de particules, pas
d'éclat permanent). La mise en évidence d'un sous-ensemble sélectionné
(vérifiée sur `LAUNCHER RACK`) reste sobre : teinte accentuée sur la cible,
atténuation à 62 % ailleurs, sans transparence ni disparition.

## 5. Accessibilité et mouvement — vérifié en direct

Arbre d'accessibilité capturé (`page.locator("main").ariaSnapshot()`) et
landmarks comptés par script, pas seulement relus dans les handoffs :

- **1** seul `<main>** (le layout global le fournit ; la page Thundart avait
  initialement un second `<main>`, corrigé en THD-04 — vérifié réel en
  comparant à `src/app/layout.tsx:124`, et cohérent avec `/hud/drone-airframe`
  qui suit la même convention).
- **1** seul `<h1>`, ordre de titres `h1 → h2 → h3` bien formé.
- Cinq boutons natifs nommés (`VEHICLE`, `LAUNCHER BASE`, `LAUNCHER RACK`,
  `CANISTER GROUP`, `DEMONSTRATION PROJECTILE`), chacun avec
  `aria-describedby` et `aria-pressed`.
- Cadre de sécurité présent deux fois dans le DOM (description `sr-only` de la
  section + pied du rail HTML) : « Représentation illustrative. Aucun ciblage
  ou calcul opérationnel. »

Couverture Tab / Enter / Space / Escape / tactile / aria / axe /
`prefers-reduced-motion`, vérifiée par exécution réelle (pas de simulation) :

| Exigence | Où c'est vérifié |
|---|---|
| Tab / Shift+Tab | `thundart-inspection.spec.ts` (ordre local), `thundart-preview.spec.ts` (ordre complet des 8 contrôles, mobile 375 px) |
| Entrée / Espace | `thundart-inspection.spec.ts` — épingle puis désépingle |
| Échap | `thundart-inspection.spec.ts`, `thundart-preview.spec.ts` (tactile) |
| Tactile réel | `thundart-preview.spec.ts` — contexte `hasTouch:true`, `.tap()` |
| `aria-*` | `aria-pressed`, `aria-describedby`, `aria-live`, landmarks — asserté dans les deux specs Thundart + revue `ariaSnapshot()` manuelle ci-dessus |
| axe WCAG 2.2 AA | `thundart-preview.spec.ts` à 375/768/1024/1440/1920 px + `smoke.spec.ts` (taille par défaut) — **0 violation serious/critical**, à chaque fois |
| `prefers-reduced-motion` | `thundart-motion.spec.ts` (séquence : aucune transition, poses identiques au bit près), `thundart-inspection.spec.ts` (sélection : `transitionDuration: "0s"`), `thundart-preview.spec.ts` (tactile mobile) |

Aucune boucle clavier (le seul `onKeyDown` du composant filtre sur `"Escape"`
et ne fait ni `preventDefault` ni `stopPropagation` sur les autres touches —
Tab traverse normalement).

## 6. Tests — tous exécutés dans cette mission, pas recopiés d'un handoff

| Commande | Résultat |
|---|---|
| `npm run test` | **PASS** — 11 fichiers, **88 tests** |
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS**, sans avertissement |
| `npm run build` | **PASS** — `/hud/thundart` pré-rendu statiquement (○), aucune erreur Turbopack |
| `npm run test:e2e` | **PASS** — **48 tests**, 2 workers, 2,6 min (`smoke.spec.ts` : 22 ; `thundart-inspection.spec.ts` : 10 ; `thundart-motion.spec.ts` : 6 ; `thundart-preview.spec.ts` : 10) |

Ces chiffres correspondent exactement à ceux annoncés par THD-05, mais ont été
**réexécutés indépendamment** dans cette mission plutôt que recopiés.

## 7. Vercel Preview — vérifié via l'API, pas seulement lu dans THD-05

Interrogation directe de l'API Vercel (projet `drones`,
`prj_U9OzpP1q07xzD4Y3JJJsZCfcyHXH`) pour le déploiement le plus récent de la
branche :

| | |
|---|---|
| Déploiement | `dpl_89qLgSPTRctVMTTXmCZdLbyjF9Ki` |
| Commit déployé | `8a795f8966c891940038ddba3c517ecef9ec58aa` — **exactement** le tip audité ici |
| État | **READY** |
| Cible | Preview (`target: null`, pas `production`) |
| URL immuable | `https://drones-jhlfrozhc-ludovics-projects-159c139c.vercel.app` |
| Alias de branche | `https://drones-git-claude-thundart-ci-e75511-ludovics-projects-159c139c.vercel.app` |
| Bundler | Turbopack |

Le déploiement le plus récent correspond bit à bit au commit audité : aucune
dérive entre ce qui a été testé ici et ce qui est en ligne.

## 8. Cadre non-opérationnel — inchangé depuis THD-01

Aucune coordonnée, aucun calcul balistique, aucune solution de tir, aucune
portée calculée, aucun angle réel lié à une portée, aucune télémétrie
inventée, aucune optimisation de système d'arme. Le modèle reste une
représentation éditoriale/OSINT/industrielle : vue d'ensemble, inspection des
composants externes visibles, pose de démonstration, séparation illustrative.
Ce cadre est rappelé quatre fois dans le DOM rendu (bandeau « Cadre
éditorial », description `sr-only`, pied du rail d'inspection, section
« Représentation illustrative des formes extérieures visibles »).

## 9. Limitations connues (héritées, toujours vraies)

- R3F dépend encore de `THREE.Clock`, déprécié par Three 0.184 — avertissement
  de la dépendance elle-même, aucun impact fonctionnel observé.
- Chromium headless peut émettre un avertissement pilote `GPU stall due to
  ReadPixels` pendant les contrôles automatisés ; n'apparaît pas hors headless
  et ne correspond à aucune boucle GPU permanente (vérifié §3 : `frameloop=demand`).
- Le chunk 3D différé (~265 Kio gzip) reste le coût du rendu R3F lui-même ;
  réduire davantage supposerait un changement de moteur, hors périmètre.
- Les 404 locaux `/_vercel/insights/*` sous `next start` sans infrastructure
  Vercel disparaissent sur la Preview réelle (vérifié en THD-05, non
  re-vérifié ici car hors du périmètre applicatif).

## 10. Points volontairement non implémentés

- Callouts 3D enrichis (au-delà d'une ligne + libellé) — le rail HTML reste la
  source d'interaction accessible complète ; un callout plus élaboré n'apporte
  rien à l'accessibilité et risquerait la surcharge visuelle.
- Toute caractéristique Thundart au-delà de ce que documente
  `docs/agent/THD-01-BLENDER-ASSET.md` — discipline de source assumée.
- Correction de l'inexactitude documentaire `THD_Canister_Group` dans
  THD-04.md (§2) — sans impact fonctionnel, handoff clos non rouvert.

## 11. Verdict des portes de qualité

| Porte | État |
|---|---|
| Architecture | **VERT** — aucune duplication majeure, aucun hack, aucun asset orphelin, aucun import mort, zéro dépendance ajoutée, HudScene/SystemXray non touchés, aucune donnée inventée, aucun ciblage/trajectoire, aucune animation permanente gratuite |
| 3D | **VERT** — chargement unique, noms/animations stables, reset déterministe, cleanup mixer/matériaux/listeners complet, aucune fuite, aucun RAF permanent |
| UX | **VERT** — cinq états clairement distincts, ton industriel sobre constant |
| Accessibilité / motion | **VERT** — Tab/Enter/Space/Escape/tactile/aria/axe/reduced-motion, tous vérifiés en exécution réelle |
| Tests | **VERT** — 88 + 48 tests, typecheck, lint, build |
| Preview Vercel | **VERT** — READY, commit vérifié identique au tip audité |

**PR READY: YES.**
