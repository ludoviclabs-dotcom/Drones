import type { Wireframe3DSpec } from "./types";

// Spec procédurale fallback pour le F-35A — utilisée uniquement si
// /models/aviation/f-35.glb ne charge pas. Le mesh GLB Blender prime.
//
// Convention identique au Rafale :
//   X = envergure (gauche -, droite +)
//   Y = longueur (nez +, tuyère -)
//   Z = hauteur (dessous -, dessus +)
// Échelle ~1 unité = 5m (F-35A 15.7m long, 10.7m envergure).
//
// Différences silhouette vs Rafale (à conserver même dans le fallback) :
//   - PAS de canards
//   - Ailes trapézoïdales (tip large, pas en pointe)
//   - 2 dérives verticales inclinées vers l'extérieur
//   - 1 seul nozzle central
export const f353D: Wireframe3DSpec = {
  bounds: [1.1, 1.6, 0.5],
  segments: [
    // ============ DESSUS — silhouette furtive (z = 0) ============
    // Nez court chined
    [[0, 1.55, 0], [0.15, 0.6, 0]],
    [[0, 1.55, 0], [-0.15, 0.6, 0]],
    // Fuselage massif
    [[0.15, 0.6, 0], [0.18, -0.7, 0]],
    [[-0.15, 0.6, 0], [-0.18, -0.7, 0]],

    // ============ AILES TRAPÉZOÏDALES (pas de delta) ============
    [[0.18, 0.1, 0], [1.05, -0.45, 0]],     // LE droite
    [[1.05, -0.45, 0], [1.05, -0.65, 0]],   // TIP droite (large, pas pointe)
    [[1.05, -0.65, 0], [0.18, -0.7, 0]],    // TE droite
    [[-0.18, 0.1, 0], [-1.05, -0.45, 0]],
    [[-1.05, -0.45, 0], [-1.05, -0.65, 0]],
    [[-1.05, -0.65, 0], [-0.18, -0.7, 0]],

    // ============ EMPENNAGES HORIZONTAUX (plus petits, arrière) ============
    [[0.15, -0.95, 0], [0.55, -1.20, 0]],
    [[0.55, -1.20, 0], [0.55, -1.40, 0]],
    [[0.55, -1.40, 0], [0.15, -1.45, 0]],
    [[-0.15, -0.95, 0], [-0.55, -1.20, 0]],
    [[-0.55, -1.20, 0], [-0.55, -1.40, 0]],
    [[-0.55, -1.40, 0], [-0.15, -1.45, 0]],

    // ============ VERRIÈRE MONOBLOC BOMBÉE ============
    [[0, 1.20, 0.05], [0, 1.05, 0.30]],     // pointe haute
    [[0, 1.05, 0.30], [0, 0.30, 0.30]],     // bulle apex
    [[0, 0.30, 0.30], [0, 0.10, 0.05]],     // fairing dorsal
    [[-0.10, 1.05, 0.10], [-0.10, 0.30, 0.10]],
    [[0.10, 1.05, 0.10], [0.10, 0.30, 0.10]],

    // ============ 2 DÉRIVES VERTICALES INCLINÉES (cant 25°) ============
    // Gauche
    [[-0.18, -0.50, 0.02], [-0.40, -0.78, 0.55]],   // bord d'attaque incliné
    [[-0.40, -0.78, 0.55], [-0.40, -0.92, 0.55]],   // sommet
    [[-0.40, -0.92, 0.55], [-0.18, -0.85, 0.02]],   // bord de fuite
    [[-0.18, -0.50, 0.02], [-0.18, -0.85, 0.02]],   // base
    // Droite
    [[0.18, -0.50, 0.02], [0.40, -0.78, 0.55]],
    [[0.40, -0.78, 0.55], [0.40, -0.92, 0.55]],
    [[0.40, -0.92, 0.55], [0.18, -0.85, 0.02]],
    [[0.18, -0.50, 0.02], [0.18, -0.85, 0.02]],

    // ============ NOZZLE CENTRAL (1 seul, monomoteur) ============
    [[-0.10, -1.50, -0.05], [0.10, -1.50, -0.05]],
    [[-0.10, -1.50, -0.05], [-0.10, -1.50, 0.05]],
    [[0.10, -1.50, -0.05], [0.10, -1.50, 0.05]],
    [[-0.10, -1.50, 0.05], [0.10, -1.50, 0.05]],
  ],
};
