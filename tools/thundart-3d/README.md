# Thundart 3D — Pipeline planche technique

Génère `public/models/hud/thundart.glb` : un asset 3D **éditorial** low/mid poly
représentant, de manière volontairement simplifiée, les **formes extérieures
visibles** du système démonstratif Thundart tel que présenté publiquement en
salon.

**Pré-requis** : extension officielle « MCP » de Blender Lab
([lab.blender.org/mcp-server](https://www.blender.org/lab/mcp-server/)) pour le
mode interactif — le mode CLI n'a besoin que de Blender. Développé et validé
sur **Blender 5.1.2**.

## Périmètre — à lire avant toute modification

Cet asset est une **planche technique** destinée à un récit visuel Web. Ce n'est
ni un modèle CAO, ni un jumeau opérationnel, ni un simulateur.

Ne sont **pas** modélisés, et ne doivent pas l'être : charge militaire,
composants internes, électronique, guidage, propulsion, mécanismes, tout détail
non visible de l'extérieur, toute géométrie déduite non sourcée.

Ne sont **pas** produits, et ne doivent pas l'être : cible, coordonnée, calcul
balistique, solution de tir, portée, profil de vol, télémétrie, angle réel,
procédure.

### Aucune dimension réelle n'est revendiquée

Aucune cote vérifiée n'existe dans ce dépôt. `specs/thundart.json` n'exprime donc
que des **proportions relatives sans unité** (« asset units »), lues sur des
photos publiques. Si une cote réelle devient disponible et sourcée, elle peut
remplacer ces proportions — mais tant que ce n'est pas le cas, **ne pas inventer
de dimension** et ne jamais présenter ce fichier comme une spécification CAO.

De la même façon, la pose de démonstration du rack est pilotée par un facteur
normalisé `demo_pose_factor` (0..1) et non par un angle : c'est une amplitude
purement visuelle, calibrée sur rien, dont aucun angle opérationnel n'est dérivé
ni documenté.

## Structure

```
tools/thundart-3d/
├── generate-thundart.py    Script Blender paramétré (scène + animations + export)
├── specs/
│   └── thundart.json       Proportions relatives, matériaux, animations, export
└── README.md               Ce fichier

public/models/hud/
└── thundart.glb            Asset généré (~71 Ko, commité)
```

Aucun `.blend` n'est nécessaire ni commité : la scène est intégralement
reconstruite par le script. Un `.blend` de travail éventuel est ignoré par Git
(voir `.gitignore`).

## Reconstruire l'asset

**Mode CLI headless (recommandé, reproductible)** :

```bash
blender --background --python tools/thundart-3d/generate-thundart.py -- --spec thundart
```

**Mode interactif via MCP Claude Code** :

```python
# Dans execute_blender_code :
path = r"...\tools\thundart-3d\generate-thundart.py"
ns = {}
exec(compile(open(path, encoding="utf-8").read(), path, "exec"), ns)
ns["build_thundart"]()
```

Les deux chemins produisent un GLB **strictement identique octet pour octet**.
En mode interactif le script travaille dans une scène dédiée `THUNDART_THD01` et
ne touche pas aux autres scènes du fichier ouvert.

Le script renvoie un dict de statistiques (nombre de meshes uniques, sommets,
triangles, animations, taille du fichier).

## Repère et conventions

Repère de construction Blender **Z-up** :

| Axe | Sens |
|---|---|
| `+Y` | avant du véhicule (cabine) |
| `-Y` | arrière (bouches des conteneurs) |
| `+Z` | haut ; `z = 0` = plan de contact des roues |

L'export applique `export_yup=True` : le GLB est donc en **Y-up**, convention
glTF standard attendue par Three.js.

Tous les noms d'objets sont **strictement ASCII** (requis pour le mapping JS).
Toutes les transformations sont neutres : rotation nulle, échelle 1, seule la
translation place les objets — le pivot exporté est exactement l'origine voulue.

## Hiérarchie produite

```
THD_Root                        (noeud vide, datum général)
├── THD_Launcher_Base           pivot : datum plateau, sur l'axe du véhicule
│   └── THD_Launcher_Rack       pivot : EXACTEMENT sur l'axe d'articulation
│       ├── THD_Canister_01     rangée haute, 01..04 de gauche à droite vue arrière
│       ├── THD_Canister_02
│       ├── THD_Canister_03
│       ├── THD_Canister_04
│       ├── THD_Canister_05     rangée basse, 05..08 même sens
│       ├── THD_Canister_06
│       ├── THD_Canister_07
│       ├── THD_Canister_08
│       └── THD_Rocket_Demo     pivot : centre géométrique, axe du corps sur Y local
└── THD_Vehicle                 (noeud vide)
    ├── THD_Axles               (noeud vide)
    │   ├── THD_Wheel_L1..L4    pivot au centre de chaque roue
    │   └── THD_Wheel_R1..R4
    ├── THD_Cab                 pivot : centre de l'empreinte, niveau plancher
    └── THD_Chassis             pivot : datum véhicule (0, 0, 0)
```

`THD_Root`, `THD_Vehicle` et `THD_Axles` sont des noeuds vides de regroupement
(hors brief, `THD_Axles` est un ajout documenté ici pour isoler les roues).

### Meshes mutualisées

21 noeuds de mesh ne référencent que **8 data-blocks** :

| Data-block | Instances |
|---|---|
| `THD_Wheel` | 8 (roue symétrique) |
| `THD_Canister_Closed` | 7 (conteneurs obturés) |
| `THD_Canister_Loaded` | 1 (bouche dégagée, porte le projectile) |
| `THD_Cab`, `THD_Chassis`, `THD_Launcher_Base`, `THD_Launcher_Rack`, `THD_Rocket_Demo` | 1 chacun |

C'est ce qui fait passer le GLB de ~125 Ko à ~71 Ko. Ne pas casser cette
mutualisation en donnant une géométrie propre à chaque roue ou conteneur.

## Animations

Deux clips nommés, poussés en pistes NLA (`export_animation_mode="NLA_TRACKS"`,
qui garantit un nom de clip glTF stable) :

| Clip | Cible | Durée | Canal animé |
|---|---|---|---|
| `THD_CONFIGURE_DEMO` | `THD_Launcher_Rack` | ~2,46 s | rotation |
| `THD_DEPARTURE_DEMO` | `THD_Rocket_Demo` | ~1,96 s | translation |

`THD_CONFIGURE_DEMO` fait passer le rack de sa pose de présentation à une
seconde pose visuellement distincte. Amorti visuel simple (Bézier échantillonné
par l'export, glTF ne connaissant que LINEAR/STEP/CUBICSPLINE). **Ce n'est pas
une élévation, ce n'est pas une procédure, aucun angle n'en est documenté.**

`THD_DEPARTURE_DEMO` fait glisser le projectile de démonstration hors de son
conteneur, le long de son axe local, sur une **courte distance** (~1,25 fois sa
propre longueur). Interpolation **linéaire volontaire** : pas d'accélération,
pas de physique, pas de balistique, pas de profil de vol, pas de portée, pas de
cible. C'est une transition visuelle, rien d'autre.

Les deux clips visent des noeuds différents et peuvent donc être enchaînés ou
joués ensemble sans conflit. La dernière frame de chacun est une pose stable :
côté Three.js, `action.clampWhenFinished = true` avec `THREE.LoopOnce` la fige.

## Matériaux

Six matériaux PBR simples, **sans aucune texture** et sans dépendance externe :
`THD_MAT_Vehicle`, `THD_MAT_Canister`, `THD_MAT_Rocket`, `THD_MAT_Tire`,
`THD_MAT_Detail`, `THD_MAT_Glass`. Leurs facteurs sont dans `specs/thundart.json`
et peuvent être remplacés côté Three.js sans retoucher le GLB.

Tous sont exportés `doubleSided` — nécessaire : les tubes des conteneurs sont
des surfaces sans épaisseur, visibles de l'intérieur par la bouche.

## Différences assumées avec `tools/aviation-3d/`

Le pipeline aviation n'est **pas** refactoré pour Thundart. Les conventions
communes sont conservées (`specs/<slug>.json`, `build_*()`, entrée CLI
`-- --spec <slug>`, sortie sous `public/models/`), mais trois choix diffèrent :

| | aviation-3d | thundart-3d |
|---|---|---|
| Matériaux | `export_materials="NONE"` (filaire appliqué côté JS) | `"EXPORT"` (PBR simples) |
| Animations | aucune | 2 clips NLA |
| Draco | activé | **désactivé** |

Draco est désactivé délibérément : le décodeur Draco utilisé par `useGLTF` de
drei est téléchargé depuis un CDN externe au chargement, or cet asset doit être
utilisable **sans aucune dépendance externe au runtime**. Le GLB ne déclare donc
`extensionsUsed`/`extensionsRequired` vides et se charge avec un `GLTFLoader`
nu. À 71 Ko le gain Draco ne justifiait pas la dépendance ; si le budget devient
critique, basculer `export.draco` à `true` dans la spec **et** câbler un
`DRACOLoader` local côté application.

## Garde-fous

`validate_spec()` échoue avant toute construction si une combinaison de
proportions ferait s'interpénétrer des volumes (collerettes voisines, bloc de
conteneurs plus large ou plus haut que le cadre, empennage plus large que le
conteneur, projectile plus long que son conteneur). Modifier `specs/thundart.json`
sans relancer le script laisserait ces contrôles inertes : **toujours régénérer
le GLB après avoir touché à la spec.**
