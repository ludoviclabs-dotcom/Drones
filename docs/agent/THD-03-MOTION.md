# THD-03 — Séquence cinématique pilotée par l’état

Transforme le prototype THD-02 en séquence technique animée. Principe unique et
non négociable : **NO STATE CHANGE = NO MOTION**. Aucune boucle décorative,
aucune animation d’attente, aucun mouvement gratuit — au repos, la boucle de
rendu est littéralement arrêtée.

Le cadre éditorial de THD-01/THD-02 est inchangé : représentation illustrative
des formes extérieures visibles, aucune donnée connectée, aucun ciblage, aucune
trajectoire, aucune balistique, aucun calcul physique. La « configuration » et
la « séparation » sont des lectures visuelles, jamais une séquence de tir.

## 1. Clips Blender utilisés

Les deux clips du GLB ont été inspectés directement dans le binaire avant tout
codage (lecture du chunk JSON glTF de `public/models/hud/thundart.glb`) :

| Clip | Nœud cible | Durée | Canal réellement animé | Canaux constants |
|---|---|---|---|---|
| `THD_CONFIGURE_DEMO` | `THD_Launcher_Rack` | 2,458 s | `rotation` — 60 clés LINEAR | `translation`, `scale` (2 clés STEP) |
| `THD_DEPARTURE_DEMO` | `THD_Rocket_Demo` | 1,958 s | `translation` — 48 clés LINEAR | `rotation`, `scale` (2 clés STEP) |

**Verdict : les clips sont propres, ils sont utilisés tels quels.** Pivots
corrects (rack sur son axe d’articulation, projectile sur son propre axe), les
deux clips visent des nœuds différents donc ne peuvent pas se marcher dessus, et
le GLB ne déclare aucune extension (chargement par `GLTFLoader` nu).

## 2. Clips corrigés

**Aucun.** L’asset `public/models/hud/thundart.glb` n’a pas été modifié, et
`tools/thundart-3d/` n’a pas été touché — aucune correction de pivot ou d’action
ne s’est révélée nécessaire. Les durées ne sont d’ailleurs pas codées en dur :
elles sont lues sur les `AnimationClip` chargés, avec les valeurs de THD-01 en
simple repli (`THUNDART_FALLBACK_CLIP_DURATIONS`), pour que le mouvement reste
aligné si l’asset est régénéré.

## 3. Architecture

Toute la logique de mouvement est **pure et testable**, séparée de la couche R3F :

| Fichier | Rôle |
|---|---|
| `src/data/hud/thundart-motion.ts` | Poses par état, construction et échantillonnage des plans. Aucune dépendance à React ou Three. |
| `src/components/hud/thundart/ThundartModel.tsx` | Graphe GLB + `AnimationMixer` + boucle de rendu + caméra. Propriétaire unique du mouvement. |
| `src/components/hud/thundart/usePrefersReducedMotion.ts` | Suivi de `prefers-reduced-motion`, sûr au rendu serveur. |

### Le mixer est un évaluateur de pose, pas un lecteur

Les deux `AnimationAction` sont armées une fois (`play()`), puis immédiatement
mises en `paused`. On n’écrit ensuite que leur `.time`, suivi d’un
`mixer.update(0)`. Conséquences directes :

- aucun clip ne « court » de lui-même, donc **aucune course entre clips** ;
- **aucun `setTimeout`** nulle part — toute la chronologie vient du temps
  cumulé dans la boucle de rendu ;
- la pose est une fonction pure de l’avancement, donc reproductible à l’identique.

`useAnimations` de drei a été écarté au profit d’un `THREE.AnimationMixer` créé
directement : les règles d’immutabilité du React Compiler interdisent d’écrire
sur une valeur retournée par un hook (`action.time = …`), et drei n’apportait
rien ici puisqu’on ne se sert d’aucune de ses facilités de lecture. Toute la
couche impérative vit derrière une seule ref, jamais lue pendant le rendu.

### Modèle de pose

Chaque état déclare un cadrage **et** un avancement 0/1 pour chacun des deux
clips. Une transition n’est qu’une interpolation bornée vers ces cibles, ce qui
rend la marche arrière et les sauts d’état symétriques par construction.

| État | `configure` | `departure` | Cadrage |
|---|---|---|---|
| `overview` | 0 | 0 | trois-quarts avant, silhouette générale |
| `inspect` | 0 | 0 | trois-quarts arrière rapproché : 8 conteneurs, cadre, essieux |
| `configure` | 1 | 0 | recul + hauteur, le rack tient entier dans le cadre |
| `departure` | 1 | 1 | cadre élargi pour contenir la séparation |
| `complete` | 1 | 1 | **géométrie identique à `departure`** ; seul le cadre s’ouvre |

## 4. Timeline logique

Ordre choisi : en marche avant on configure le rack **puis** on sépare ; en
marche arrière le projectile réintègre son conteneur **avant** que le rack ne
redescende.

```
inspect → configure
  0 ────────────────────────────────────────────► 2578 ms
  caméra   ████████ (0 → 560)
  rack             ███████████████████████████ (120 → 2578)

configure → departure
  0 ────────────────────────────────────────────► 2278 ms
  caméra   ████████ (0 → 560)
  pause    ┄┄┄┄┄ (0 → 320)   ← courte pause visuelle
  projectile     ██████████████████████████ (320 → 2278)
  flash          ████ (320 → 740)

departure → complete
  0 ──────────► 560 ms
  caméra   ████████     ← arrêt sur image : aucun clip ne rejoue
```

## 5. Durées des transitions UI

Réglages (`THUNDART_MOTION_TIMING`) :

| Réglage | Valeur |
|---|---|
| Recomposition caméra | 560 ms |
| Avance du cadrage sur le rack | 120 ms |
| Pause avant séparation | 320 ms |
| Respiration entre deux clips en marche arrière | 140 ms |
| Rembobinage du rack | 900 ms |
| Rembobinage du projectile | 700 ms |
| Flash de séparation | 420 ms |

Durées effectives, par transition atteignable :

| Transition | Durée |
|---|---|
| `overview → inspect` / `inspect → overview` | 560 ms |
| `inspect → configure` | 2578 ms |
| `configure → inspect` | 1020 ms |
| `configure → departure` | 2278 ms |
| `departure → configure` | 700 ms |
| `departure → complete` / `complete → departure` | 560 ms |
| `RESET` depuis `configure` | 1020 ms |
| `RESET` depuis `departure` ou `complete` | 1740 ms |

Un test unitaire vérifie qu’aucune transition atteignable ne dépasse 3 s.

La marche avant emprunte la durée réelle du clip ; la marche arrière est
volontairement plus rapide — rembobiner n’est pas le propos de la planche. Une
transition interrompue à mi-course ne coûte que sa fraction restante, donc le
rythme apparent reste constant.

### Caméra

Un déplacement de caméra est court, prévisible, interruptible, et n’existe que
parce que l’état a changé : passer en trois-quarts arrière pour lire les huit
conteneurs, reculer quand le rack puis le projectile montent dans le cadre.
Aucun orbit automatique, aucun zoom permanent, aucun tremblement, aucun
« handheld ».

Les contrôles orbitaux ne sont actifs que **au repos et dans `overview` /
`inspect`**. Pendant une transition, la caméra n’a qu’un propriétaire : le
directeur de mouvement. Deux détails d’implémentation en découlent :

- `<Bounds>` a été retiré. Il recadrait la caméra de son côté et serait entré en
  concurrence avec les poses par état. Le cadrage responsive est repris par
  `framingScaleForAspect()`, purement géométrique et déterministe : à champ
  vertical constant, un cadre plus haut que large voit moins en largeur, donc on
  recule (facteur borné à 2,1).
- `controls.update()` est appelé après chaque écriture de caméra, pour
  resynchroniser l’état sphérique interne d’OrbitControls. Sans cela, leur
  première mise à jour après réactivation ramènerait la caméra à sa position
  d’avant la transition.

## 6. Effet de départ

Une sphère additive unique, ancrée à la bouche du conteneur porteur — position
déduite de la boîte englobante de `THD_Canister_01`, pas d’une constante, donc
elle suit le rack quand il bouge. Opacité et échelle pilotées par une impulsion
déterministe (attaque rapide, extinction quadratique), nulle aux deux bords.

Pas de simulation volumétrique, pas de fumée, pas de flamme photoréaliste, pas
de particules, aucune physique. Vérifié visuellement : un bref halo pâle,
confiné au tube chargé.

## 7. Logique de mouvement réduit

Sous `prefers-reduced-motion: reduce`, `buildThundartMotionPlan()` renvoie un
plan **instantané** : `totalMs === 0`, aucun segment. L’échantillonnage rend
alors directement `plan.to`, c’est-à-dire la pose finale de l’état visé.

- aucune interpolation de caméra ;
- aucune animation de rack ;
- aucune animation de départ ;
- aucun flash ;
- **exactement la même information** : les cinq états restent parcourables et
  chaque pose finale est identique, au bit près, à celle du mode complet.

Un test unitaire compare, pour les 25 couples d’états, la pose du plan réduit à
la pose finale du plan complet. Le réglage est suivi en direct
(`useSyncExternalStore` sur `matchMedia`), donc un changement système en cours de
session est pris en compte sans rechargement, et sans animer la bascule.

L’interface le signale explicitement : mention « Mouvement réduit actif · poses
appliquées sans transition » dans le panneau, et attribut
`data-thundart-reduced-motion` sur la scène.

## 8. Comportement d’interruption

`Suivant`, `Précédent` et `Réinitialiser` restent cliquables **pendant** une
transition — aucun verrouillage, donc aucun état d’où l’on ne pourrait pas
sortir. Chaque changement d’état construit un nouveau plan à partir de la pose
**réellement en cours** : avancement des clips échantillonné à l’instant de la
coupure, et position de caméra lue sur la caméra elle-même, y compris si
l’utilisateur venait de l’orbiter. Une interruption est donc continue, sans
à-coup ni retour en arrière visuel.

Garanties structurelles :

- un seul `AnimationMixer`, deux actions en pause permanente → pas de course ;
- aucun `setTimeout` → rien à nettoyer, rien à laisser fuir ;
- un seul plan actif à la fois, remplacé et non empilé ;
- `RESET` ramène à `overview` depuis n’importe quel point, y compris en plein vol.

### Deux défauts trouvés et corrigés en cours de route

1. **Une transition pouvait être consommée en une seule frame.** En
   `frameloop="demand"`, l’horloge continue de courir pendant que la scène est au
   repos : la première frame relancée portait un delta égal à toute la durée
   d’inactivité. Le même effet se produit quand le navigateur est saturé
   (plusieurs contextes WebGL en parallèle). Le pas de temps est désormais
   plafonné à 64 ms par frame (`MAX_FRAME_STEP_MS`) : sous charge, la transition
   dure plus longtemps en temps réel mais reste **vue**, et la pose finale reste
   exacte puisque le temps écoulé est borné à la durée du plan.

2. **La scène bougeait sans changement d’état.** L’effet de mouvement se
   réexécute aussi pour des raisons qui n’en sont pas : montage initial, arrivée
   tardive des contrôles orbitaux dans le contexte R3F, bascule du réglage de
   mouvement réduit. Le montage produisait ainsi une recomposition de caméra de
   560 ms. Désormais, seule une **vraie** transition d’état s’anime ; toute autre
   réexécution applique la pose d’un coup. C’est la traduction littérale de
   NO STATE CHANGE = NO MOTION.

## 9. Déterminisme

- Aucun `Math.random`.
- `sampleThundartMotion(plan, elapsedMs)` est une fonction pure : même plan et
  même temps écoulé ⇒ même pose, quel que soit le framerate.
- Au-delà de `totalMs`, l’échantillon rendu est exactement `plan.to`.
- Vérifié par test : rejouer une transition à 10 fps, 250 fps et à pas irrégulier
  donne la même pose finale, au bit près.
- Vérifié par test : le chemin long (`overview → … → complete` état par état) et
  le saut direct aboutissent à la même pose.

## 10. Tests

### Unitaires — `tests/unit/thundart-motion.test.ts` (30 tests)

Poses et sémantique des cinq états ; construction des plans (recomposition seule,
clip à sa durée réelle, pause puis séparation, arrêt sur image, ordre de
rembobinage, rembobinage plus rapide, durée bornée, échelonnement sur une
transition partielle) ; échantillonnage déterministe (pose finale exacte pour les
25 couples, indépendance au pas de temps, pureté, monotonie, bornes,
immobilité pendant la pause, fenêtre du flash, terminaison en un nombre fini de
frames) ; mouvement réduit (instantanéité, information identique, aucun flash) ;
interruption (reset depuis n’importe quel point, reprise sans à-coup, convergence
après une rafale, équivalence chemin long / saut direct) ; primitives numériques.

### End-to-end — `tests/e2e/thundart-motion.spec.ts` (6 tests, navigateur réel)

Progression état par état avec passage `running → idle` à chaque fois ;
**absence de mouvement au repos** (le journal des mutations ne bouge plus pendant
2,5 s après une transition) ; **mouvement réduit réellement testé** via
`emulateMedia({ reducedMotion: "reduce" })`, avec vérification qu’aucun
`running` n’apparaît jamais ; réinitialisation en plein vol ; rafale de huit
clics sans attente, convergence vers un état unique et stable, sans erreur page ;
disponibilité des contrôles orbitaux limitée aux états d’observation au repos.

Les états transitoires sont observés par `MutationObserver` plutôt que par
sondage : un sondage régulier peut manquer une bascule brève, l’observateur non.
Le bloc est sérialisé (`test.describe.configure({ mode: "default" })`) car
plusieurs contextes WebGL en parallèle se privent mutuellement de frames et
rendent les mesures ininterprétables ; contrairement à `"serial"`, un échec
n’entraîne pas le saut des suivants, donc rien n’est masqué.

### Résultats

| Commande | Résultat |
|---|---|
| `npm run test` | **PASS** — 10 fichiers, 83 tests |
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS**, sans avertissement |
| `npm run build` | **PASS** — `/hud/thundart` pré-rendu statiquement |
| `npx playwright test` | **PASS** — 27 tests, dont les 21 préexistants |

Vérification visuelle complémentaire (Chromium headless, 1440 × 900) : capture de
chacun des cinq états, du parcours en mouvement réduit, et de la fenêtre du flash.

## 11. Fichiers

| Fichier | État |
|---|---|
| `src/data/hud/thundart-motion.ts` | créé — logique de mouvement pure |
| `src/components/hud/thundart/usePrefersReducedMotion.ts` | créé |
| `tests/unit/thundart-motion.test.ts` | créé — 30 tests |
| `tests/e2e/thundart-motion.spec.ts` | créé — 6 tests navigateur |
| `src/components/hud/thundart/ThundartModel.tsx` | réécrit — mixer, caméra, boucle |
| `src/components/hud/thundart/ThundartScene3D.tsx` | modifié — `Bounds` retiré, mouvement réduit, attributs de test, brume et sol élargis |
| `src/components/hud/thundart/ThundartExperience.tsx` | modifié — détection du mouvement réduit |
| `src/components/hud/thundart/ThundartControls.tsx` | modifié — mention mouvement réduit |
| `src/data/hud/thundart.ts` | modifié — libellés d’états mis à jour |
| `src/app/hud/thundart/page.tsx` | modifié — cadre éditorial et intitulés |

`public/models/hud/thundart.glb` et `tools/thundart-3d/` sont **inchangés**.

## 12. Points ouverts pour la suite

- Les annotations extérieures (callouts par sous-ensemble) évoquées dans la dette
  THD-02 ne sont pas faites : `inspect` se contente d’un cadrage dédié. Les nœuds
  `THD_*` sont nommés et adressables, le branchement reste ouvert.
- Aucun test de contraste ni d’axe n’a été ajouté sur `/hud/thundart` ; la route
  n’est pas dans la liste `A11Y_PAGES` de `tests/e2e/smoke.spec.ts`.
- Le plafond de 64 ms par frame allonge la durée réelle d’une transition sur une
  machine très chargée. C’est un compromis assumé : mieux vaut une transition
  lente qu’une transition sautée.
