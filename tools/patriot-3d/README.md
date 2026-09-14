# Patriot PAC-3 MSE 3D — pipeline de la planche technique

Génère `public/models/hud/patriot-pac3-mse.glb`, l'asset de la planche
`/hud/patriot-pac3-mse` : une batterie Patriot en disposition illustrative et
son lanceur M903 détaillé, avec les clips de mise en batterie, d'élévation et de
dépliage des gouvernes.

**Pré-requis** : Blender **5.1.2** (validé), et Node/npx pour la compression
(`@gltf-transform/cli`, version épinglée dans la spec). Le mode interactif passe
par l'extension officielle « MCP » de Blender Lab
([lab.blender.org/mcp-server](https://www.blender.org/lab/mcp-server/)).

## Périmètre — à lire avant toute modification

Cet asset sert un récit visuel Web. Ce n'est ni un modèle constructeur, ni un
jumeau opérationnel, ni un simulateur.

Modélisé, en formes **extérieures visibles** seulement : station de lancement
M903 sur semi-remorque M860A1 (tourelle, masse élevée, vérins, stabilisateurs,
groupe électrogène, ELES, mât de liaison), douze conteneurs PAC-3 MSE « One-Pack »
en 3 × 4, deux intercepteurs (conteneurs 04 et 03), tracteur HEMTT M983, radar
AN/MPQ-65 et son tracteur, poste de conduite de tir (ECS) et mât d'antennes
OE-349 sur camions 5 t, centrale électrique EPP III, trois autres lanceurs.

Ne sont **pas** modélisés, et ne doivent pas l'être : composants internes,
guidage, propulsion, électronique, tout détail non visible de l'extérieur.
Ne sont **pas** produits : cible, coordonnée, trajectoire calculée, balistique,
solution de tir, portée, procédure. Le départ de l'intercepteur, côté Web, reste
dans l'axe du tube.

### Des gabarits publics, pas des cotes

`specs/patriot.json` est en mètres, mais ses valeurs sont des **gabarits
extérieurs approchés** : enveloppes publiées (FM 3-01.85 annexe B, présentation
partenaires Lockheed Martin 2024) et proportions lues sur des photographies
publiques. Les sources sont listées dans la clé `_sources` de la spec. Aucune
cote fine n'est revendiquée ; ne jamais présenter ce fichier comme un plan.

Deux valeurs sont de confiance moyenne et signalées comme telles sur la
planche : le site de tir fixe (≈ 38°) et la longueur de l'intercepteur
(≈ 5,2 m). Les durées des clips sont des choix de lecture, calées sur aucun
chronométrage réel.

## Structure

```
tools/patriot-3d/
├── generate-patriot.py   Point d'entrée (CLI headless ou MCP interactif)
├── patriot3d/            Paquet du pipeline
│   ├── core.py           MeshBuilder bmesh, matériaux nommés, fusions, hiérarchies
│   ├── wheels.py         Roues mutualisées (HEMTT, semi-remorque, niveaux de détail)
│   ├── hemtt.py          Tracteur HEMTT M983 (et porteur de la centrale EPP)
│   ├── fmtv.py           Camion 5 t 6 × 6 (porteur de l'ECS et du mât)
│   ├── launcher.py       Station M903 : remorque, tourelle, lanceur, conteneurs
│   ├── missile.py        Silhouette de l'intercepteur, gouvernes repliables
│   ├── radar.py          Ensemble radar AN/MPQ-65 sur semi-remorque
│   ├── battery.py        ECS, EPP III, mât d'antennes OE-349
│   ├── animation.py      Clips échantillonnés image par image, pistes NLA
│   ├── assembly.py       Assemblage, fusions statiques, export et compression
│   └── preview.py        Rendus de contrôle (interactif, jamais exportés)
├── specs/patriot.json    Gabarits, disposition, matériaux, animations, export
└── build/                Export brut intermédiaire (ignoré par Git)

public/models/hud/
└── patriot-pac3-mse.glb  Asset publié (~0,8 Mo, commité)
```

Aucun `.blend` n'est nécessaire ni commité : la scène est intégralement
reconstruite par le script.

## Reconstruire l'asset

**Mode CLI headless** :

```bash
blender --background --python tools/patriot-3d/generate-patriot.py -- --spec patriot
```

**Mode interactif via le MCP Blender (Claude Code)** :

```python
# Dans execute_blender_code :
path = r"...\tools\patriot-3d\generate-patriot.py"
ns = {"__file__": path}
exec(compile(open(path, encoding="utf-8").read(), path, "exec"), ns)
ns["build_patriot"]()
```

En interactif, le script travaille dans une scène dédiée `PATRIOT_PAC3` et ne
touche pas aux autres scènes du fichier ouvert. `build_patriot(parts=[...])`
reconstruit un sous-ensemble (`"launcher"`, `"hemtt"`, `"battery"`) pour
itérer vite ; `export=False` saute l'export.

Le script renvoie un dict de statistiques : objets, meshes uniques, triangles,
estimation des appels de rendu, clips, taille brute et compressée. Le build
headless prend ~40 s.

### Reproductibilité

Les deux modes, et deux builds successifs, produisent la **même structure** :
segment JSON du GLB brut identique (nœuds, transformations, maillages,
matériaux, clips) et données de sommets identiques au bit près. Seul l'ordre
des triangles de certains maillages varie d'un build à l'autre, du fait de
l'exporteur glTF de Blender : les octets du fichier, et sa taille compressée à
±0,3 % près, changent donc à chaque build, sans différence visible. Le contrat
vérifié par les tests porte sur la structure, pas sur les octets.

### Export et compression

1. Export glTF brut de Blender vers `build/patriot-pac3-mse.raw.glb` (~3,4 Mo).
2. `npx --yes @gltf-transform/cli@4.5.0 meshopt <brut> <sortie> --level high` :
   `EXT_meshopt_compression` + `KHR_mesh_quantization` (~0,8 Mo).

Le décodeur meshopt est embarqué par three-stdlib (WebAssembly en ligne) et
activé par `useGLTF(path, false, true)` : **aucune requête réseau** au
chargement. Draco reste désactivé, parce que le décodeur Draco de drei vient
d'un CDN. Sans npx, le GLB brut est publié tel quel (fonctionnel, mais au-delà
du budget de taille). La compression ajoute des nœuds enveloppes **sans nom**
sous certains nœuds maillés : les nœuds nommés et animés sont conservés.

## Repère et conventions

Construction Blender **Z-up**, unités en mètres :

| Axe | Sens |
|---|---|
| `+Y` | avant des véhicules, et direction de tir du lanceur à gisement nul |
| `+Z` | haut ; `z = 0` = plan de contact des roues |

L'export applique `export_yup=True` : un point Blender `(x, y, z)` devient
`(x, z, -y)` dans Three.js. L'axe d'un conteneur (culot → bouche) est son `-Z`
local côté Web, extrémité arrière à l'origine du nœud.

Noms d'objets **strictement ASCII**, préfixe `PAT_`. La géométrie est construite
dans l'espace local de chaque objet : les pivots exportés sont exactement les
origines choisies (articulations des stabilisateurs, axe de la masse élevée,
pivot d'attelage).

## Hiérarchie produite — contrat avec la planche Web

```
PAT_Root
├── PAT_LS1                         station héros (hiérarchie complète)
│   ├── PAT_LS1_Trailer, PAT_LS1_PowerUnit, PAT_LS1_ELES
│   ├── PAT_LS1_Wheel_{1,2}{L,R}
│   ├── PAT_LS1_Leg_{L,R}, PAT_LS1_LegSleeve_{L,R}      béquilles d'attelage
│   ├── PAT_LS1_Outrigger_{RL,RR,FL,FR}                 pivot sur l'articulation
│   │   └── PAT_LS1_Outrigger_*_Foot                    vérin à patin
│   └── PAT_LS1_Turret                                  pivot de gisement
│       ├── PAT_LS1_Mast → PAT_LS1_MastTop              mât de liaison
│       ├── PAT_LS1_ActuatorBarrel_{L,R}, PAT_LS1_ActuatorRod_{L,R}
│       └── PAT_LS1_Launcher                            pivot sur l'axe de site
│           ├── PAT_LS1_Canisters                       10 conteneurs fusionnés
│           ├── PAT_LS1_Canister_04                     conteneur de tir A
│           │   ├── PAT_LS1_CoverFront_04, PAT_LS1_CoverRear_04
│           │   └── PAT_LS1_Missile_A → PAT_LS1_Missile_A_Fin1..4
│           └── PAT_LS1_Canister_03                     conteneur de tir B
│               ├── PAT_LS1_CoverFront_03, PAT_LS1_CoverRear_03
│               └── PAT_LS1_Missile_B → PAT_LS1_Missile_B_Fin1..4
├── PAT_TR1                         tracteur héros (Body, Wheel_*, Spare)
└── PAT_Battery                     éléments immobiles, un maillage par véhicule
    ├── PAT_LS2, PAT_LS3, PAT_LS4   même maillage « en batterie », instancié
    ├── PAT_RS, PAT_RS_Array        radar ; le réseau garde ses UV
    ├── PAT_TR2 (+ Body, Wheel_*, Spare)
    └── PAT_ECS, PAT_EPP, PAT_AMG
```

La planche lit ces noms dans `src/data/hud/patriot.ts`
(`PATRIOT_ASSET_MANIFEST`) et les route vers ses sous-ensembles inspectables
dans `src/data/hud/patriot-inspection.ts`. `tests/unit/patriot-inspection.test.ts`
lit le segment JSON du GLB publié et vérifie ce contrat : nœuds pilotés présents
une seule fois, chaque sous-ensemble du catalogue désignable, clips et durées.
**Renommer un nœud casse la planche : mettre à jour les trois ensemble.**

## Animations

Quatre clips, poussés en pistes NLA (`export_animation_mode="NLA_TRACKS"` : une
animation glTF par nom de piste, tous objets confondus). Chaque clip est
échantillonné image par image (LINEAR) à partir de fonctions pures : l'amorti
est celui calculé par `animation.py`, la dernière image est une pose stable.

| Clip | Durée | Contenu |
|---|---|---|
| `PAT_EMPLACE` | 6,625 s | béquilles, dételage et départ du tracteur (vers la gauche, hors du secteur de tir), stabilisateurs et patins, sortie du mât |
| `PAT_ELEVATE` | 3,958 s | gisement de −14°, site jusqu'à 38° (les deux se chevauchent), vérins alignés |
| `PAT_FINS_A`, `PAT_FINS_B` | 0,333 s | dépliage des gouvernes de chaque intercepteur |

Côté Web, le mixer ne « joue » rien : il évalue des poses (`action.time`) au
rythme des plans de mouvement, sans jamais boucler. Le déplacement des
intercepteurs, la fumée et les opercules sont pilotés par la chronologie pure de
`src/data/hud/patriot-launch.ts`, pas par le GLB.

## Budget et vignette

- Budget de taille : `export.size_budget_kb` (1 200 Ko) ; le test de contrat
  échoue au-delà de 1 Mo.
- ~84 000 triangles uniques, ~250 appels de rendu : les roues, conteneurs et
  lanceurs d'arrière-plan sont mutualisés ; les éléments immobiles sont
  fusionnés par véhicule. Ne pas casser ces mutualisations.
- La vignette `public/images/hud/patriot-pac3-mse-preview.webp` (1280 × 720,
  < 150 Ko) est une capture de la planche à l'état « Mise à feu », surimpressions
  HUD masquées. À refaire si le modèle change visiblement.
