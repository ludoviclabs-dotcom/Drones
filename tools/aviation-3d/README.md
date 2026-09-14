# Aviation 3D — Pipeline Wireframe

Génère des meshes 3D simples (`.glb` meshopt, < 100 Ko) pour les avions de Panoplie.
L'apparence "filaire" est appliquée **côté Three.js** (`MeshBasicMaterial` avec
`wireframe=true`) — le `.glb` contient un mesh solide normal avec des faces, ce
qui est requis par GLTF 2.0 (les meshes edges-only sont ignorés à l'export).

**Pré-requis** : extension officielle "MCP" de Blender Lab
([lab.blender.org/mcp-server](https://www.blender.org/lab/mcp-server/)), pas
l'addon ahujasid (protocole incompatible).

## Structure

```
tools/aviation-3d/
├── generate-wireframe.py   Script Blender paramétré (un seul script, N avions)
├── specs/
│   ├── rafale.json         Paramètres géométriques du Rafale
│   └── <slug>.json         Un fichier par avion à ajouter
└── README.md               Ce fichier

public/models/aviation/
└── <slug>.glb              Assets générés (gitignore si volumineux, commit si < 100 Ko)
```

## Ajouter un nouvel avion

### 1. Créer le fichier de specs

Copier `specs/rafale.json`, renommer en `specs/<slug>.json`, ajuster :

| Champ | Description |
|---|---|
| `length_m` | Longueur hors-tout (m) |
| `wingspan_m` | Envergure (m) |
| `wing_sweep_deg` | Flèche de la voilure (°) |
| `has_canards` | `true` pour un configuration canard-delta |
| `engine_count` | 1 ou 2 |
| `js_mesh_names` | Noms ASCII attendus par le code JS |

### 2. Générer le GLB

**Via MCP Claude Code (interactif, R&D)** :
```python
# Dans execute_blender_code :
exec(open("tools/aviation-3d/generate-wireframe.py").read())
result = build_aircraft("mirage2000")
```

**Via CLI headless (CI, re-build)** :
```bash
blender --background --python tools/aviation-3d/generate-wireframe.py -- --spec mirage2000
```

### 3. Brancher dans Panoplie

Dans `src/data/aviation-3d/index.ts` :
```typescript
// Ajouter la spec procédurale (fallback si .glb absent)
import { mirage20003D } from "./mirage2000";
export const WIREFRAME_3D_SPECS = {
  rafale: rafale3D,
  "mirage2000": mirage20003D,
};
```

Toujours dans `src/data/aviation-3d/index.ts` :
- Ajouter le slug à `GLB_AVAILABLE_SLUGS` : `SystemXray3DView` charge alors
  `public/models/aviation/<slug>.glb` (sinon la spec procédurale sert seule).
- Ajouter son placement à `XRAY_MODEL_OVERRIDES` (voir « Placement X-Ray »).

Dans `src/data/decision-twin/panoplie-xray.ts` :
- Ajouter `mirage2000Nodes(system)` + entrée dans `SYSTEM_NODE_BUILDERS`.

## Placement X-Ray

Les repères (`position3d`) s'écrivent dans le repère des specs procédurales
(X envergure, Y longueur nez +, Z hauteur, ~1 unité = 5 m). Le GLB, lui, est
exporté en glTF Y haut, nez vers -Z, ~7 m par unité. `XRAY_MODEL_OVERRIDES`
porte le passage de l'un à l'autre : la vue tourne les repères d'un quart de
tour autour de X et applique au GLB la rotation et l'échelle de son type
(avions ×1,4 ; missiles nez -X → -Z et ×0,6 ; radars ×0,5).

Pour poser un repère sur une pièce, lire la boîte du nœud dans le GLB placé
(segment JSON : bornes `POSITION` + transformation du nœud), puis convertir le
point de la scène `(x, y, z)` en repère X-Ray `(x, -z, y)`. Déclarer ensuite la
pièce visée dans `tests/data/xray-models.test.ts`.

## Compression : meshopt, jamais Draco

Le décodeur Draco de drei est téléchargé depuis le CDN gstatic à l'exécution ;
le décodeur meshopt est embarqué par three-stdlib. Les GLB X-Ray (aviation,
missiles, radars) sont donc chargés par `useGLTF(path, false, true)` et
compressés par la passe épinglée :

```bash
npx --yes @gltf-transform/cli@4.5.0 meshopt <brut.glb> <sortie.glb> --level high
```

`generate-wireframe.py` exporte sans Draco dans `tools/aviation-3d/build/`
(ignoré par git) puis lance cette passe. Pour un ancien asset encore en Draco,
le décoder d'abord avec `@gltf-transform/core` + `draco3dgltf` (lecture avec
le décodeur, suppression de l'extension `KHR_draco_mesh_compression`,
écriture), puis appliquer la passe meshopt.

## Validation

```bash
# GLB sans Draco, repères posés sur leurs pièces une fois le modèle placé
npx vitest run tests/data/xray-models.test.ts
```

## Conventions de naming (OBLIGATOIRES pour le mapping JS)

| Nom Blender | Rôle |
|---|---|
| `Fuselage` | Corps principal |
| `Aile_G` / `Aile_D` | Voilure gauche / droite |
| `Canard_G` / `Canard_D` | Surfaces canard (si présentes) |
| `Derive` | Empennage vertical |
| `Verriere` | Verrière de cockpit |
| `Moteur_G` / `Moteur_D` | Nacelles moteur |
| `Train_Avant` / `Train_G` / `Train_D` | Trains d'atterrissage |

Noms strictement ASCII, underscores, pas d'accents — requis pour le mapping JS.
