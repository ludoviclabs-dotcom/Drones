# Rafale F4 · Meteor 3D — pipeline de la planche technique

Génère `public/models/hud/rafale-f4.glb`, l’asset de la planche
`/hud/rafale-f4-meteor` : un Rafale C au standard F4 en vol, train rentré, avec
les emports de ses deux configurations (air-air et air-sol) et des gouvernes
dont le pivot est posé sur leur axe réel. Le GLB ne porte aucune animation :
braquages, attitude de l’avion et départs des munitions sont calculés côté Web.

**Pré-requis** : Blender **5.1** (l’asset publié sort de « Khronos glTF Blender
I/O v5.1.20 » ; sous Windows, `C:/Program Files/Blender Foundation/Blender 5.1/blender.exe`,
hors du `PATH`), et Node/npx pour la compression (`@gltf-transform/cli`,
version épinglée dans la spec). Le mode interactif passe par l’extension
officielle « MCP » de Blender Lab
([lab.blender.org/mcp-server](https://www.blender.org/lab/mcp-server/)).

## Périmètre — à lire avant toute modification

Cet asset sert un récit visuel Web. Ce n’est ni un modèle constructeur, ni un
jumeau opérationnel, ni un simulateur.

Modélisé, en formes **extérieures visibles** seulement :

- cellule : fuselage et radôme (objet distinct), épine dorsale, entrées d’air
  semi-ventrales (lèvre arrondie, conduit sombre), tuyères M88 à pétales et
  carénage central, cocardes ;
- verrière et cockpit vu à travers la glace : arceaux et seuils, casquette,
  collimateur tête haute, siège, silhouette du pilote ;
- surfaces : voilure delta (caisson fixe et deux élevons par demi-aile), plans
  canard monoblocs, dérive, rails lance-missile de saumon ;
- équipements : optronique secteur frontal (OSF), perche de ravitaillement
  fixe, bouche du canon de 30 mm, carénages SPECTRA (sommet et pied de dérive,
  flancs avant), sondes, antennes et feux de position ;
- emports : deux Meteor, deux MICA EM, deux MICA IR, deux AASM Hammer, une
  nacelle Talios, trois bidons (ventral et voilure), leurs pylônes et
  adaptateurs.

Ne sont **pas** modélisés :

- le train d’atterrissage : l’avion est en vol, train rentré ; ni jambes, ni
  roues, ni trappes ;
- un aérofrein : le Rafale n’en a pas, il a été supprimé dès la conception
  (dossier de presse Dassault Aviation, 2023) ;
- les bords de fuite en dents de scie de la voilure et des plans canard, ni
  les becs de bord d’attaque : bords lisses, d’un seul tenant ;
- les composants internes (antenne radar, moteurs au-delà des tuyères,
  électronique, réservoirs internes), les détecteurs et lance-leurres SPECTRA
  pris un à un (seuls leurs carénages le sont), les marquages autres que les
  cocardes ;
- les versions B (biplace) et M (marine) : les photographies de biplaces n’ont
  servi qu’à lire les formes communes.

Ne sont **pas** produits : cible, coordonnée, trajectoire calculée,
balistique, domaine de tir, procédure. Côté Web, la munition quitte son point
d’emport et s’éloigne dans l’axe de l’avion, rien de plus.

### Des gabarits publics, pas des cotes

`specs/rafale-f4.json` est en mètres, mais ses valeurs sont des **gabarits
extérieurs approchés**. Les valeurs canoniques retenues par la planche sont
celles du dossier de presse Dassault Aviation de juin 2023 : **15,30 m** de
long, **10,90 m** d’envergure, **5,30 m** de haut. Les publications divergent
de quelques centimètres (10,80 m sur la fiche F4 du ministère des Armées ;
15,27 m, 10,86 m et 5,34 m sur Wikipédia) : la planche affiche l’envergure
avec un repère « conf. moyenne ».

Les emports suivent les fiches des industriels : Meteor de **3,65 m** pour
**178 mm** de diamètre, MICA de 3,1 m pour 160 mm, AASM Hammer de la classe
250 kg. Les stations du Meteor ont été **mesurées sur le rendu officiel MBDA**
(± 5 %) : radôme blanc sur 0,57 m, bande jaune à 1,25 m du nez, bandes marron
à 1,93 et 2,52 m, entrées d’air de 1,72 à 3,18 m à ± 45° du ventre, quatre
ailettes en X (cordes 0,32 et 0,07 m, ≈ 0,72 m hors tout).

Tout le reste — sections du fuselage, entrées d’air, verrière, flèches et
cordes des plans canard (50°) et de la dérive (47°), courbure de la perche —
est **lu sur des photographies publiques** et sur celles de l’utilisateur ;
seule la flèche de bord d’attaque de la voilure (48°) vient de sources
secondaires. Les sources sont listées dans la clé `_sources` de la spec. Aucune
cote fine n’est revendiquée ; ne jamais présenter ce fichier comme un plan.

Mesurée sur le GLB publié, l’enveloppe du modèle fait 15,24 m du nez à la
sortie des tuyères. La voilure couvre 10,30 m de saumon à saumon, 10,50 m avec
les rails, ≈ 10,92 m avec les MICA IR de saumon. La hauteur publiée se mesure
au sol, train sorti : sans train, la cellule fait 4,18 m du dessous des
entrées d’air au sommet du carénage SPECTRA de la dérive.

## Structure

```
tools/rafale-3d/
├── generate-rafale.py    Point d’entrée (CLI headless, rendus de contrôle ou MCP interactif)
├── rafale3d/             Paquet du pipeline
│   ├── core.py           MeshBuilder bmesh, loft de sections, PCHIP, Catmull-Rom, profils, matériaux
│   ├── airframe.py       Cellule : table de stations du fuselage, radôme, épine, entrées d’air,
│   │                     verrière et cockpit, tuyères, OSF, perche, canon, détails, cocardes
│   ├── surfaces.py       Voilure delta et élevons séparés, plans canard monoblocs, dérive, SPECTRA
│   ├── stores.py         Emports : Meteor, MICA IR et EM, AASM Hammer, bidons, Talios, pylônes
│   ├── assembly.py       Assemblage, hiérarchie RAF_*, statistiques, export et compression
│   └── preview.py        Rendus de contrôle (vues ref_* des photographies), jamais exportés
├── specs/rafale-f4.json  Gabarits, stations, emports, matériaux, export
└── build/                Export brut intermédiaire (ignoré par Git)

public/models/hud/
└── rafale-f4.glb         Asset publié (~230 Ko, versionné)
```

Aucun `.blend` n’est nécessaire ni commité : la scène est intégralement
reconstruite par le script. `build/` et `__pycache__/` sont ignorés par Git.

### Construction

- **Fuselage en stations** (`airframe.py`). `fuselage.stations` compte 18
  stations, de `s = 0` (pointe du nez) à `s = 14,6 m` ; chacune donne six
  points de contrôle de la demi-section droite, du dos au ventre (dos, épaule,
  flanc haut, flanc bas, épaule basse, ventre). Chaque point est interpolé
  d’une station à l’autre par **PCHIP** (Fritsch–Carlson : monotone, sans
  dépassement, les lignes restent tendues), puis la demi-section est refermée
  par symétrie en une courbe de **Catmull-Rom centripète** échantillonnée
  uniformément : 60 sommets par section, en correspondance d’une section à
  l’autre, que relie `MeshBuilder.loft`. `breaks` et `spacing` règlent la
  densité des sections, plus serrée entre 4,6 et 8,6 m, où naissent plans
  canard, entrées d’air et emplanture. Le radôme (`s` ≤ 2,55 m) est un objet à
  part : c’est le sous-ensemble « radar » de l’inspection.
- **Entrées d’air** (`airframe.py`). Une super-ellipse par rang de
  `intakes.shell` (centre, demi-axes, exposant 3), interpolée par PCHIP et
  échantillonnée tous les 0,35 m de la lèvre vers l’arrière : la coque garde
  le renflement de flanc des photographies. `station_series` exige des bornes
  croissantes et lève une erreur sinon (une série inversée ne rendait que ses
  deux extrémités, soit une coque droite, 16 cm trop étroite).
- **Détails plaqués** (`airframe.py`). Les cocardes sont projetées sommet par
  sommet sur la peau réelle (flancs d’entrée d’air, voilure) le long de leur
  normale, en gardant l’étagement des couleurs : elles épousent la courbure.
  La bouche du canon et son carénage sortent de la peau à la jonction du
  dessus de l’entrée d’air droite et du fuselage, sous le plan canard ; les
  feux de position sont des dômes sur le dessus des rails de saumon, derrière
  leur carénage avant.
- **Surfaces portantes** (`surfaces.py`). Voilure, plans canard et dérive sont
  des lofts de profils symétriques type NACA 00xx (répartition en cosinus :
  bord d’attaque arrondi, bord de fuite net). La voilure est découpée dans la
  corde : un caisson fixe (tronçon d’emplanture, tronçon arrêté à la
  charnière, saumon et rail) et **deux élevons séparés** par demi-aile, de
  corde 0,62 m, dont l’origine est posée sur la ligne de charnière, à
  mi-épaisseur. Les **plans canard sont monoblocs** : pivot à 45 % de la corde
  d’emplanture, avec un petit fût d’axe dans le fuselage. La planche fait
  tourner ces nœuds autour de leur X local, sans calcul de pivot : chacun est
  un empty posé sur son axe, qui porte son maillage en enfant (voir « Export
  et compression »).
- **Emports** (`stores.py`). Chacun est construit dans son repère local (axe
  du corps sur +Y, nez vers +Y, origine au milieu de la longueur, sur l’axe) ;
  ceux d’un même type partagent un seul data-block, que l’exporteur mutualise.
  Meteor : radôme blanc, bandes de livrée, deux prises d’air ventrales,
  ailettes en X. Les bandes (15 à 50 mm) découpent le profil de révolution à
  leurs bords (`_split_at_bands`) : sans cela, une bande tombée au milieu d’un
  long tronçon disparaissait de l’export. MICA : dôme vitré pour l’IR, ogive pour l’EM, longues ailes de
  fuselage. AASM : kit de guidage avant, corps de bombe, kit propulsif arrière.
- **Aucun booléen, aucun modificateur** (`core.py`) : tout est bmesh, dans
  l’espace local de chaque objet. Normales lissées, arêtes vives au-delà de 34°
  (`SHARP_EDGE_ANGLE_RAD`). Les maillages construits en surfaces ouvertes
  (radôme, fuselage, verrière, cockpit, épine dorsale, entrées d’air,
  cocardes) gardent l’orientation que leur donne le loft (`flip`) au lieu d’un
  recalcul des normales, peu fiable sur une coque ouverte. `inverted_normals`
  contrôle l’orientation de tous les maillages, sauf cinq surfaces ouvertes
  voulues que l’on vérifie sur les rendus de contrôle (voir « Budget »).
- **Déterminisme** : aucun tirage aléatoire ; les points d’emport sont
  parcourus dans l’ordre trié de leurs clés.

## Reconstruire l’asset

**Mode CLI headless** (depuis la racine du dépôt) :

```bash
"C:/Program Files/Blender Foundation/Blender 5.1/blender.exe" --background --factory-startup \
  --python tools/rafale-3d/generate-rafale.py -- --spec rafale-f4
```

`--factory-startup` écarte les préférences et extensions de l’utilisateur. Le
script imprime ses statistiques en JSON derrière le préfixe `RAFALE_STATS` :
objets, maillages uniques, triangles, estimation des appels de rendu,
`inverted_normals`, position de chaque emport (`stores`), puis taille brute et
compressée.

**Rendus de contrôle**, sans export :

```bash
"C:/Program Files/Blender Foundation/Blender 5.1/blender.exe" --background --factory-startup \
  --python tools/rafale-3d/generate-rafale.py -- --spec rafale-f4 \
  --preview <dossier> [--views ref_side_right,meteor_side] [--engine BLENDER_WORKBENCH] --no-export
```

Sans `--views`, les seize vues de `preview.VIEWS` sont rendues (PNG,
1280 × 720). `BLENDER_EEVEE` est le moteur par défaut ; `BLENDER_WORKBENCH`
(éclairage studio, couleurs des matériaux, cavités) est plus rapide pour
vérifier des formes. Sans `--no-export`, les rendus sont faits, leurs objets
retirés, puis le GLB exporté.

**Mode interactif via le MCP Blender (Claude Code)** :

```python
# Dans execute_blender_code :
path = r"...\tools\rafale-3d\generate-rafale.py"
ns = {"__file__": path}
exec(compile(open(path, encoding="utf-8").read(), path, "exec"), ns)
ns["build_rafale"]()                     # construit et exporte
ns["build_rafale"](export=False, preview_dir=r"...\previews", views=["ref_side_right"])
```

En interactif, le script travaille dans une scène dédiée `RAFALE_F4` et ne
touche pas aux autres scènes du fichier ouvert ; il recharge le paquet
`rafale3d` à chaque appel, si bien qu’une modification des sources est prise
en compte sans redémarrer Blender. En headless, la scène courante est vidée
puis renommée `RAFALE_F4` : ce nom figure dans le glTF. La racine du dépôt est
trouvée par `__file__` (d’où le `ns = {"__file__": path}`) ou par la variable
`PANOPLIE_REPO_ROOT`. Contrairement à Patriot, il n’y a pas de reconstruction
partielle (`parts`).

### Reproductibilité

Le script est déterministe. Comme pour Patriot, l’exporteur glTF de Blender
peut toutefois réordonner les triangles de certains maillages d’un build à
l’autre : les octets du fichier, et sa taille compressée, peuvent varier
légèrement sans différence visible. Le contrat vérifié par les tests porte sur
la structure (noms, hiérarchie, pivots, bornes des munitions), pas sur les
octets.

### Export et compression

1. Export glTF brut de Blender vers `build/rafale-f4.raw.glb` (~702 Ko), sans
   animation, caméra ni lumière.
2. `npx --yes @gltf-transform/cli@4.5.0 meshopt <brut> <sortie> --level high` :
   `EXT_meshopt_compression` + `KHR_mesh_quantization` (~230 Ko).

Le décodeur meshopt est embarqué par three-stdlib (WebAssembly en ligne) et
activé par `useGLTF(path, false, true)` : **aucune requête réseau** au
chargement. Draco reste désactivé, parce que le décodeur Draco de drei vient
d’un CDN. La compression est obligatoire : sans npx, le script s’arrête en
erreur et le brut reste dans `build/`, rien n’est publié. Le script refuse un GLB publié au-delà de
`export.size_budget_kb` (900 Ko) ; le test de contrat, lui, échoue au-delà
de 1 Mo.

**La quantification déplace les nœuds maillés.** `KHR_mesh_quantization`
stocke les positions en entiers normalisés et reporte la déquantification sur
le nœud qui porte le maillage : sa translation devient le centre de la boîte
englobante du maillage et il reçoit une échelle uniforme (1,825 pour un
Meteor). Un nœud piloté qui porterait lui-même son maillage perdrait donc son
pivot (une gouverne tournerait sur son milieu) et transmettrait cette échelle à
tout enfant ajouté côté Web (la flamme d’une munition). D’où la règle
d’`assembly.pivot_object` : chaque nœud piloté — élevons, plans canard,
emports — est un **empty** à la position choisie, sans échelle, et son
maillage est un enfant `<nom>_Mesh` à l’origine locale ; seule la
transformation de cet enfant est réécrite par la compression. Le test de
contrat vérifie que les nœuds pilotés n’ont ni maillage ni échelle.

Le GLB publié ne contient à ce jour aucun nœud enveloppe sans nom (66 nœuds,
tous `RAF_*`), mais la compression peut en glisser sous un nœud maillé : la
planche et la vue X-Ray remontent toujours aux ancêtres pour lire un nom.

`extensionsUsed` contient aussi `KHR_materials_emissive_strength` : les feux
de position ont une intensité d’émission de 1,5, que l’exporteur écrit par
cette extension. Elle n’est pas requise (three.js la lit ; un lecteur qui
l’ignore affiche des feux moins lumineux) et le test ne la contraint pas.

### Rendus de contrôle

`preview.py` place une caméra par vue (`VIEWS` : position, point visé,
focale, roulis, dans le repère Blender), un ciel uniforme, un soleil et une
lumière de contre-jour. Seize vues :

- huit vues génériques : face, face basse, profil gauche, dessus, dessous,
  trois-quarts avant (gauche, haute), trois-quarts arrière droit ;
- quatre **vues de référence `ref_*`**, qui reprennent les angles des
  photographies de l’utilisateur pour confronter la silhouette aux clichés :
  `ref_front_left_below`, `ref_front_banked` (roulis de 14°),
  `ref_side_right`, `ref_rear_right_below` ;
- trois gros plans (`close_nose`, `close_rear`, `close_under`) et
  `meteor_side`, le Meteor sous le fuselage.

Tous les objets de contrôle portent le préfixe `RAF_PREVIEW_` et sont retirés
par `cleanup` avant l’export : le GLB n’embarque ni caméra, ni lumière.

## Repère et conventions

Construction Blender **Z-up**, unités en mètres :

| Axe | Sens |
|---|---|
| `+Y` | vers le nez |
| `+X` | vers l’aile droite |
| `+Z` | haut ; `z = 0` ≈ plan de la corde d’emplanture (voilure posée à `z = −0,1`) |

Les cotes longitudinales de la spec sont des **stations** `s`, distance à la
pointe du nez le long de l’axe : `y = y0 − s`, avec `y0 = 8,3` (`spec.frame`).
La pointe du nez est en `y = +8,3`, la sortie des tuyères vers `y = −6,94` ;
l’origine de l’avion tombe à la station 8,3 m. Les points d’emport
(`loadout.stations.*.at`) sont des triplets `[x, s, z]` du point d’accrochage.

L’export applique `export_yup=True` : un point Blender `(x, y, z)` devient
`(x, z, −y)` dans Three.js. Côté Web, le nez pointe vers **−Z**, l’aile droite
vers +X, le haut vers +Y. Une munition a son nez sur son −Z local et sa
tuyère à `+longueur/2` sur son Z local : c’est là que la planche accroche la
flamme.

Noms d’objets **strictement ASCII**, préfixe `RAF_` ; matériaux `RAF_MAT_*` ;
objets de contrôle `RAF_PREVIEW_*` (jamais exportés) ; objets créés par la
planche `RAF_UI_*` (jamais dans le GLB). La géométrie est construite dans
l’espace local de chaque objet, sans `transform_apply` et avec une inverse de
parent identité : les pivots exportés sont exactement les origines choisies
(charnière des élevons, axe des plans canard, milieu des munitions), portées
par des empties pour survivre à la quantification (voir « Export et
compression »).

## Hiérarchie produite — contrat avec la planche Web

```
RAF_Root                                racine, transformation identité
├── RAF_Airframe                        cellule (identité)
│   ├── RAF_Fuselage, RAF_Radome, RAF_Spine, RAF_Intakes
│   ├── RAF_Cockpit, RAF_CanopyFrame, RAF_Canopy
│   ├── RAF_OSF, RAF_Probe, RAF_Gun, RAF_Engines, RAF_Details, RAF_Roundels
│   ├── RAF_Wing_R, RAF_Wing_L          caisson de voilure et rail de saumon
│   ├── RAF_Elevon_{R,L}_{In,Out}       empty sur la ligne de charnière → …_Mesh
│   ├── RAF_Canard_R, RAF_Canard_L      empty sur l’axe du plan canard → …_Mesh
│   ├── RAF_Fin
│   └── RAF_Spectra                     quatre carénages, un seul maillage
└── RAF_Stores                          emports (identité) ; chaque emport est un
                                        empty à son point d’accrochage → …_Mesh
    ├── RAF_Pylon_Center, RAF_TankCenter              commun
    ├── RAF_Pylon_Outer_{R,L}, RAF_MicaEM_{R,L}       commun
    ├── RAF_MicaIR_{R,L}                              commun (rails de saumon)
    ├── RAF_Pylon_Meteor_{R,L}, RAF_Meteor_{R,L}      air-air
    ├── RAF_Pylon_Mid_{R,L}, RAF_Hammer_{R,L}         air-sol
    ├── RAF_Pylon_Inner_{R,L}, RAF_Tank_{R,L}         air-sol
    └── RAF_Pylon_Fwd_R, RAF_Talios                   air-sol
```

66 nœuds en tout : les 48 nœuds nommés ci-dessus, dont 18 empties pilotés
(quatre élevons, deux plans canard, douze emports), plus les 18 maillages
`<nom>_Mesh` de ces empties. Un pylône prend le nom de son point d’emport
(`RAF_Pylon_` + clé de `loadout.stations`) ; une munition, celui de
`STORE_NODE` (`assembly.py`) suivi du côté. Les enfants `_Mesh` gardent le
préfixe de leur parent : le routeur d’inspection les relie au même
sous-ensemble.

La planche lit ces noms dans `src/data/hud/rafale.ts`
(`RAFALE_ASSET_MANIFEST`) :

| Clé du manifeste | Nœuds | Ce qu’en fait la planche |
|---|---|---|
| `rootNode`, `airframeNode`, `storesNode` | `RAF_Root`, `RAF_Airframe`, `RAF_Stores` | structure ; transformation identité exigée : la position d’une munition est lue comme un point du repère avion |
| `shotNodes` | `RAF_Meteor_R` (BVR), `RAF_MicaIR_L` (combat rapproché), `RAF_Hammer_R` (SEAD) | déplacement et tangage le long de la chronologie de départ ; rotation nulle au repos, car la planche l’écrase |
| `canardNodes` | `RAF_Canard_{L,R}` | cabrés de 5° en virage (`rotation.x`) |
| `elevonNodes` | `RAF_Elevon_{L,R}_{In,Out}` | levés de 8° en virage (`rotation.x`) |
| `loadoutNodes.air` | `RAF_Meteor_{L,R}`, `RAF_Pylon_Meteor_{L,R}` | visibles en configuration air-air seulement |
| `loadoutNodes.sead` | `RAF_Hammer_{L,R}`, `RAF_Pylon_Mid_{L,R}`, `RAF_Talios`, `RAF_Pylon_Fwd_R`, `RAF_Tank_{L,R}`, `RAF_Pylon_Inner_{L,R}` | visibles en configuration air-sol seulement |

Les autres emports (bidon ventral, MICA EM et IR, leurs pylônes) sont communs
aux deux configurations. Ce que la planche ajoute (groupe de vol
`RAF_UI_Flight`, fumées, flammes, secteurs des capteurs, décor) porte le
préfixe `RAF_UI_` et n’existe pas dans le GLB.

### Contrat d’inspection

`src/data/hud/rafale-inspection.ts` route chaque nom de nœud vers l’un des
quinze sous-ensembles inspectables (`rafaleInspectionIdForNodeName`, préfixes
les plus spécifiques d’abord : `RAF_Pylon_Meteor_` désigne le Meteor,
`RAF_Pylon_Outer_` les MICA, etc.). `tests/unit/rafale-inspection.test.ts` lit
le segment JSON du GLB publié et vérifie ce contrat : nœuds pilotés présents
une seule fois, racines sans transformation, chaque entrée du catalogue
désignable et chaque nœud `RAF_*` (hors structure) relié à une entrée,
couverture propre à chaque configuration, longueur des munitions tirées et
tuyère à `+longueur/2`, position de chaque munition conforme à son scénario,
gouvernes qui pivotent sur leur charnière, nœuds pilotés sans maillage ni
échelle.

**Renommer un nœud casse la planche.** Mettre à jour ensemble : le pipeline
(`assembly.py`, `STORE_NODE`, clés de `loadout.stations`),
`RAFALE_ASSET_MANIFEST`, le routeur de `rafale-inspection.ts` (et donc le test
de contrat), et la liste `hiddenNodes` de `XRAY_MODEL_OVERRIDES.rafale`
(`src/data/aviation-3d/index.ts`), qui masque la configuration air-sol dans la
vue X-Ray. Cette vue reconnaît aussi la verrière à son nom (`canopy`, hors
`frame`).

## Budget et vignette

- Budget de taille : `export.size_budget_kb` (900 Ko), vérifié par le script ;
  le test de contrat échoue au-delà de 1 Mo (1 048 576 octets). Asset
  publié : 235 312 octets (~230 Ko), pour ~702 Ko brut.
- ~32 000 triangles uniques (32 266 au dernier build), 36 maillages uniques
  pour 45 nœuds maillés, 34 matériaux sans texture. Estimation Blender : ~97
  appels de rendu ; le GLB publié compte 73 primitives, dont une partie est
  masquée selon la configuration d’emport (décor et effets de la planche en
  sus).
- Les emports et pylônes d’un même type partagent un maillage (Meteor, MICA
  EM, MICA IR, AASM, bidons de voilure, pylônes intérieurs, médians,
  extérieurs et Meteor) : ne pas casser ces mutualisations.
- `inverted_normals`, dans les statistiques, liste les maillages dont le
  volume signé est négatif, c’est-à-dire aux normales tournées vers
  l’intérieur : rendu sombre ou invisible côté Web. Les surfaces ouvertes
  voulues (verrière, épine dorsale, entrées d’air, radôme, cocardes) en sont
  exclues. **Cette liste doit être vide** avant de publier ; un loft retourné
  se corrige par son drapeau `flip`.
- La vignette `public/images/hud/rafale-f4-meteor-preview.webp` (1280 × 720,
  17,7 Ko ; le registre exige moins de 150 Ko) est une capture de la planche à
  l’état « Allumage et départ », scénario BVR, surimpressions HUD masquées,
  canevas forcé à 1280 × 720. Sur la grande vignette de l’accueil, elle est
  recadrée autour de `preview.focusX` (38 %). À refaire si le modèle ou le
  départ changent visiblement.
