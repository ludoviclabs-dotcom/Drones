# Aviation 3D — Pipeline Wireframe

Génère des meshes 3D simples (`.glb` Draco, < 100 Ko) pour les avions de Panoplie.
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

Dans `src/components/decision-twin/SystemXray3DView.tsx` :
- Le composant charge automatiquement `public/models/aviation/<slug>.glb` via `useGLTF`
  si le fichier existe, sinon il utilise la spec procédurale comme fallback.

Dans `src/data/decision-twin/panoplie-xray.ts` :
- Ajouter `mirage2000Nodes(system)` + entrée dans `SYSTEM_NODE_BUILDERS`.

## Validation

```bash
# Vérifie taille < 100 Ko et présence des mesh ASCII
npx ts-node scripts/check-models.ts
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
