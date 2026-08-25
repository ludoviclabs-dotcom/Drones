# THD-01 — Asset 3D Thundart (Blender → GLB)

Handoff de la mission THD-01 : premier asset 3D web du système démonstratif
Thundart, généré par un pipeline Blender reproductible.

**Périmètre.** Représentation **éditoriale / OSINT / industrielle** des formes
extérieures visibles, destinée à une planche technique interactive Panoplie.
Ce n'est pas un simulateur d'arme, pas un modèle CAO, pas un jumeau
opérationnel. Aucune cible, coordonnée, balistique, solution de tir, portée,
télémétrie, angle réel ni procédure n'est produite. Aucun composant interne
(charge, électronique, guidage, propulsion, mécanismes) n'est modélisé.

---

## 1. SHA de départ

| | |
|---|---|
| `origin/main` au démarrage | `24e053c0cf5c9b62943e04c71ada6c1b3d7a7384` |
| `HEAD` au démarrage | `24e053c0cf5c9b62943e04c71ada6c1b3d7a7384` |
| Dernier commit `origin/main` | `24e053c Merge pull request #23 from ludoviclabs-dotcom/claude/hud-drone-preflight-plan-b921ea` |

`origin/main` n'avait pas avancé : la référence citée dans le brief est celle
réellement observée. Worktree propre au démarrage (`git status --short` vide,
`git diff` vide) — aucune modification utilisateur en cours, aucun arbitrage
nécessaire.

## 2. Branche

Travail effectué sur **`claude/thundart-3d-blender-asset-2f4362`**, la branche
déjà associée au worktree `sweet-black-0be338`.

> **Écart assumé avec le brief.** Le brief proposait `claude/thundart-cinematic-hud`.
> La branche du worktree était déjà dédiée exactement à ce travail (son nom le
> désigne). En créer une seconde n'aurait rien isolé de plus et aurait dissocié
> la branche du worktree. Renommer reste trivial si la convention compte.

Aucune PR créée, aucun merge, aucun push. Un seul commit local.

## 3. Fichiers créés / modifiés

| Fichier | État |
|---|---|
| `tools/thundart-3d/generate-thundart.py` | créé — script Blender paramétré |
| `tools/thundart-3d/specs/thundart.json` | créé — proportions, matériaux, animations |
| `tools/thundart-3d/README.md` | créé — pipeline, conventions, garde-fous |
| `public/models/hud/thundart.glb` | créé — asset généré |
| `docs/agent/THD-01-BLENDER-ASSET.md` | créé — ce document |
| `.gitignore` | modifié — ignore `*.blend` |

**Aucun fichier TypeScript n'a été créé ni modifié.** Conformément au brief, ni
`/hud/drone-airframe`, ni `HudScene`, ni les données Meteor, ni la navigation,
ni la homepage, ni la configuration Vercel, ni les tests E2E n'ont été touchés.
Le pipeline `tools/aviation-3d/` n'a pas été refactoré.

## 4. Chemin du GLB

`public/models/hud/thundart.glb`

Chemin retenu tel que suggéré par le brief. `public/models/` héberge déjà
`aviation/`, `missiles/`, `radars/` ; `hud/` est un nouveau dossier, cohérent
avec la destination (planche HUD) plutôt qu'avec une catégorie de matériel.

## 5. Taille

| | |
|---|---|
| Taille | **73 036 octets — 71,32 Ko** |
| MD5 | `311ea46394b9a59d3e73b03b3b9094a5` |
| Format | GLB binaire glTF 2.0, autonome |
| `extensionsUsed` / `extensionsRequired` | **vides** |
| Buffers externes, images, textures | **aucun** |

Le GLB se charge avec un `GLTFLoader` nu : ni décodeur Draco, ni fichier
annexe, ni requête réseau supplémentaire. Voir §9 pour la justification.

## 6. Statistiques géométriques

| Métrique | Valeur |
|---|---|
| Noeuds glTF | 24 (21 meshes + 3 noeuds vides) |
| Data-blocks mesh **uniques** | **8** |
| Primitives glTF | 17 |
| Triangles uniques (poids réel du fichier) | **1 494** |
| Triangles instanciés (affichés) | 3 774 |
| Sommets exportés | 4 384 |
| Sommets uniques côté Blender | 1 006 |
| Matériaux | 6 |

Écart sommets Blender / glTF : l'export dédouble les sommets sur les frontières
de matériau et sur les arêtes marquées vives. C'est normal et déjà minimisé —
les surfaces de révolution sont lissées, seules les caisses gardent des arêtes
franches.

**Bounding box glTF (Y-up), pose de présentation :**

| Axe | Min | Max | Étendue |
|---|---|---|---|
| X (largeur) | −1,470 | 1,470 | 2,940 |
| Y (hauteur) | 0,000 | 3,920 | 3,920 |
| Z (longueur) | −5,200 | 5,110 | 10,310 |

`Y = 0` est le plan de contact des roues. `Z` négatif pointe vers la cabine.
Unités **relatives et sans dimension** (voir §9).

## 7. Hiérarchie utile

```
THD_Root                        noeud vide — datum général
├── THD_Launcher_Base           pivot : datum plateau, sur l'axe du véhicule
│   └── THD_Launcher_Rack       pivot : EXACTEMENT sur l'axe d'articulation
│       ├── THD_Canister_01     rangée haute — porte le projectile, bouche dégagée
│       ├── THD_Canister_02..04 rangée haute, de gauche à droite vue de l'arrière
│       ├── THD_Canister_05..08 rangée basse, même sens
│       └── THD_Rocket_Demo     pivot : centre géométrique, axe du corps sur Y local
└── THD_Vehicle                 noeud vide
    ├── THD_Axles               noeud vide
    │   ├── THD_Wheel_L1..L4    pivot au centre de chaque roue
    │   └── THD_Wheel_R1..R4
    ├── THD_Cab                 pivot : centre de l'empreinte, niveau plancher
    └── THD_Chassis             pivot : datum véhicule (0, 0, 0)
```

Tous les noms sont ASCII. Toutes les transformations sont neutres : rotation
nulle, **échelle 1 partout**, seule la translation place les noeuds.

**Ajouts par rapport à la hiérarchie cible du brief**, documentés ici :

- `THD_Axles` — noeud vide intermédiaire regroupant les 8 roues ;
- `THD_Wheel_L1..L4` / `THD_Wheel_R1..R4` — 4 essieux × 2 roues ;
- `THD_Launcher_Rack` est enfant de `THD_Launcher_Base` (et non frère), pour que
  la pose de démonstration soit une simple rotation locale du rack.

**Mutualisation des meshes** — 21 noeuds pour 8 data-blocks :

| Data-block | Instances |
|---|---|
| `THD_Wheel` | 8 |
| `THD_Canister_Closed` | 7 |
| `THD_Canister_Loaded` | 1 |
| `THD_Cab`, `THD_Chassis`, `THD_Launcher_Base`, `THD_Launcher_Rack`, `THD_Rocket_Demo` | 1 chacun |

C'est ce qui fait passer le fichier de ~125 Ko à ~71 Ko. **Ne pas casser cette
mutualisation.**

## 8. Animations disponibles

| Clip | Noeud cible | Durée | Canal réellement animé |
|---|---|---|---|
| `THD_CONFIGURE_DEMO` | `THD_Launcher_Rack` | 2,458 s | `rotation` (60 clés LINEAR) |
| `THD_DEPARTURE_DEMO` | `THD_Rocket_Demo` | 1,958 s | `translation` (48 clés LINEAR) |

Les deux clips démarrent exactement à `t = 0`.

**`THD_CONFIGURE_DEMO`** fait passer le rack de sa pose de présentation à une
seconde pose visuellement distincte, par rotation autour de son axe
d'articulation. Amorti visuel simple, échantillonné à l'export (glTF ne connaît
que LINEAR / STEP / CUBICSPLINE). **Ce n'est pas une élévation, ce n'est calibré
sur aucun équipement réel, ce n'est pas une procédure, et aucun angle n'est
documenté** — l'amplitude vient d'un facteur normalisé `demo_pose_factor` (0..1)
dans la spec, pas d'une valeur angulaire.

**`THD_DEPARTURE_DEMO`** fait glisser le projectile de démonstration hors de son
conteneur, le long de son axe local, sur une courte distance (~1,25 fois sa
propre longueur). Interpolation **linéaire volontaire** : aucune accélération,
aucune physique, aucune balistique, aucun profil de vol, aucune portée, aucune
cible. C'est une transition visuelle et rien d'autre.

Les deux clips visent des noeuds différents : ils s'enchaînent ou se superposent
sans conflit. La dernière frame de chacun est une pose stable — côté Three.js,
`action.clampWhenFinished = true` avec `THREE.LoopOnce` la fige.

## 9. Limitations connues

1. **Aucune dimension réelle n'est revendiquée.** Aucune cote vérifiée n'existait
   dans ce dépôt (`grep -ri thundart` ne renvoyait rien avant cette mission).
   Toute la géométrie est en **proportions relatives sans unité**, lues sur les
   photos publiques fournies. Ce fichier ne doit jamais être présenté comme une
   spécification CAO, et aucune cote ne doit en être déduite.

2. **Draco est désactivé.** Le décodeur Draco utilisé par `useGLTF` de drei est
   téléchargé depuis un CDN externe au chargement ; le brief exige zéro
   dépendance externe au runtime. Écart assumé avec `tools/aviation-3d/`, qui
   utilise Draco. À 71 Ko le gain ne justifiait pas la dépendance. Pour
   basculer : `export.draco = true` dans la spec **et** câblage d'un
   `DRACOLoader` local côté application.

3. **Canaux constants résiduels dans les clips.** Malgré
   `export_optimize_animation_size=True`, l'exporteur écrit encore 2 clés STEP
   de `translation`/`scale` sur `THD_CONFIGURE_DEMO` et de `rotation`/`scale`
   sur `THD_DEPARTURE_DEMO`. Les valeurs sont celles de la pose de repos, donc
   sans effet visible — mais un clip **épinglera** ces propriétés sur son noeud
   cible pendant sa lecture. Ne pas compter piloter la translation du rack ou la
   rotation du projectile par code pendant qu'un clip joue.

4. **Le conteneur 01 est modélisé bouche dégagée**, les 7 autres avec un
   obturateur en retrait. C'est délibéré (sinon le projectile traverserait
   l'obturateur en s'écartant) et cela signale visuellement quel tube est chargé.

5. **Détail de la cabine volontairement sommaire** — volume, pare-brise,
   custodes, casquette, pare-chocs. Cohérent avec le brief (low/mid poly,
   « ne cherche pas le photoréalisme »), mais c'est la pièce qui gagnerait le
   plus à être affinée si le rendu final le demande.

6. **Matériaux non définitifs.** Six matériaux PBR sans texture. Le brief prévoit
   explicitement qu'ils puissent être remplacés côté Three.js. Tous sont
   `doubleSided` — nécessaire, les tubes étant des surfaces sans épaisseur.

7. **Aucun `.blend` n'est conservé.** La scène est intégralement reconstruite par
   le script ; `*.blend` est désormais ignoré par Git.

## 10. Commandes de reconstruction

**CLI headless (recommandé) :**

```bash
blender --background --python tools/thundart-3d/generate-thundart.py -- --spec thundart
```

**Interactif via MCP Blender :**

```python
path = r"...\tools\thundart-3d\generate-thundart.py"
ns = {}
exec(compile(open(path, encoding="utf-8").read(), path, "exec"), ns)
ns["build_thundart"]()
```

Les deux chemins produisent un GLB **identique octet pour octet** (vérifié :
MD5 `311ea46394b9a59d3e73b03b3b9094a5` dans les deux cas). En mode interactif le
script travaille dans une scène dédiée `THUNDART_THD01` et ne touche à aucune
autre scène du fichier ouvert.

`validate_spec()` échoue avant toute construction si les proportions de la spec
font s'interpénétrer des volumes. **Toujours régénérer le GLB après avoir touché
à `specs/thundart.json`.**

## 11. Résultat des validations

**Blender — validation avant sortie :**

| Contrôle | Résultat |
|---|---|
| Camion + rack visibles | OK (rendus de contrôle) |
| 8 conteneurs présents et distincts | OK — 2 rangées × 4, sans interpénétration |
| `THD_Rocket_Demo` présent | OK |
| Pivots | OK — rack sur son axe d'articulation, roues centrées, projectile sur son axe |
| Échelles / rotations parasites | Aucune — échelle 1, rotation nulle sur les 24 noeuds |
| Géométrie manquante | Aucune — aucun mesh à 0 sommet |
| Bounding box | Cohérente, sol à `Y = 0` |
| Animations | 2 clips, noms exacts, durées attendues |
| Round-trip import du GLB | OK — hiérarchie, instanciation, matériaux et clips reformés à l'identique |
| Contrôles de dégagement `validate_spec()` | 6/6 passés |

Deux défauts trouvés et corrigés en cours de route : l'exporteur embarquait le
cube de la scène de démarrage (`use_active_scene` est à `False` par défaut), et
les collerettes de conteneurs voisins s'interpénétraient (Ø 0,676 pour un pas de
0,63) — d'où les garde-fous de `validate_spec()`.

**Dépôt :**

| Commande | Résultat |
|---|---|
| `npm run typecheck` | **PASS** (exit 0) |
| `npm run lint` | **PASS** (exit 0) |
| `npm run test` | **PASS** — 8 fichiers, 48 tests |

`npm run build` et `npm run test:e2e` n'ont pas été lancés : aucun TypeScript
n'a été créé ni modifié, et le brief ne les demande que dans ce cas.

## 12. Ce que THD-02 devra faire

1. **Charger l'asset** — `useGLTF("/models/hud/thundart.glb")`, sans `DRACOLoader`.
   Ne pas réutiliser `SystemXray3DView` tel quel : il est spécifique au
   decision-twin (rendu filaire, mapping `panoplie-xray`) et ne gère pas les
   animations. Prévoir un composant HUD dédié.

2. **Décider du branchement** — soit une scène `scenes/thundart.ts` sur le
   modèle de `scenes/drone-airframe.ts`, soit une page HUD dédiée. `thundart`
   n'est **pas** à ajouter à `GLB_AVAILABLE_SLUGS` (`src/data/aviation-3d/index.ts`) :
   ce set pilote le chemin decision-twin `/<glbDir>/<slug>.glb`, pas le HUD.

3. **Câbler les 4 temps du récit** — vue d'ensemble ; inspection des composants
   externes (les noeuds `THD_*` sont les cibles de sélection / callouts) ; pose
   de démonstration (`THD_CONFIGURE_DEMO`) ; séparation illustrative
   (`THD_DEPARTURE_DEMO`).

4. **Figer la dernière frame** — `AnimationMixer` + `clampWhenFinished = true`
   et `THREE.LoopOnce` sur chaque action. Tenir compte de la limitation §9.3
   (canaux constants épinglés pendant la lecture d'un clip).

5. **Reprendre la sobriété éditoriale** déjà en place sur `/hud/drone-airframe` :
   pas de télémétrie inventée, statuts explicitement en démo, aucune donnée
   opérationnelle. Les libellés doivent rappeler qu'aucune cote n'est revendiquée.

6. **Matériaux** — remplacer côté Three.js si la direction artistique HUD le
   demande ; les matériaux du GLB sont un point de départ, pas une contrainte.

7. **Ne pas régénérer le GLB à la main** — passer par
   `tools/thundart-3d/generate-thundart.py`, et régénérer après toute
   modification de `specs/thundart.json`.
