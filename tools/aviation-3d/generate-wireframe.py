"""
generate-wireframe.py — Script Blender paramétré pour générer des mesh 3D
filaires d'avions de chasse, exportés en GLB Draco pour Panoplie.

Usage :
  Mode interactif (via MCP Claude Code) :
    exec(open(r"...generate-wireframe.py", encoding="utf-8").read())
    build_aircraft("rafale")

  Mode headless (CLI, CI) :
    blender --background --python tools/aviation-3d/generate-wireframe.py -- --spec rafale

  Sortie :
    public/models/aviation/<slug>.glb  (< 100 Ko, mesh solide, Draco)

Pourquoi des meshes avec faces et pas seulement des arêtes ?
    GLTF 2.0 ignore les meshes sans faces lors de l'export — d'où ce choix.
    Le rendu filaire ("wireframe") est appliqué CÔTÉ THREE.JS dans
    SystemXray3DView (MeshBasicMaterial avec wireframe=true). Le mesh
    Blender contient des faces ; seul l'affichage est filaire.

Paramètres : tools/aviation-3d/specs/<slug>.json.

Conventions de naming ASCII (obligatoires pour le mapping JS — voir
src/data/decision-twin/panoplie-xray.ts hotspots Rafale) :
  Fuselage, Aile_G, Aile_D, Canard_G, Canard_D, Derive, Verriere,
  Moteur_G, Moteur_D, Intake_G, Intake_D,
  Pylon_G_Int, Pylon_G_Med, Pylon_G_Ext,
  Pylon_D_Int, Pylon_D_Med, Pylon_D_Ext, Pylon_Ventral,
  Train_Avant, Train_G, Train_D
"""

import bpy
import bmesh
import json
import math
import os
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Helpers I/O
# ---------------------------------------------------------------------------

def get_repo_root() -> Path:
    if "__file__" in globals():
        script_dir = Path(__file__).resolve().parent
        for candidate in [script_dir, script_dir.parent, script_dir.parent.parent]:
            if (candidate / "package.json").exists():
                return candidate
    # Fallback hardcodé pour le contexte MCP qui n'expose pas __file__
    return Path(r"C:\Users\Ludo\Drones\.claude\worktrees\admiring-kapitsa-a325be")


def load_spec(slug: str) -> dict:
    spec_path = get_repo_root() / "tools" / "aviation-3d" / "specs" / f"{slug}.json"
    with open(spec_path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_output_path(slug: str) -> Path:
    out_dir = get_repo_root() / "public" / "models" / "aviation"
    out_dir.mkdir(parents=True, exist_ok=True)
    return out_dir / f"{slug}.glb"


def clear_meshes():
    bpy.ops.object.select_all(action="DESELECT")
    for obj in list(bpy.data.objects):
        if obj.type == "MESH":
            bpy.data.objects.remove(obj, do_unlink=True)
    for m in list(bpy.data.meshes):
        if m.users == 0:
            bpy.data.meshes.remove(m)


# ---------------------------------------------------------------------------
# Composants de mesh (réutilisables pour les 15 chasseurs)
# ---------------------------------------------------------------------------

def build_fuselage_sections(sections: list, n_pts: int = 12) -> bpy.types.Object:
    """
    Fuselage en tube modulé par sections elliptiques.
    sections : liste de (y, scale_x, scale_z, z_offset) — du nez (y+) à la tuyère (y-).
    Section ovale aplatie en bas (fuselage portant).
    """
    mesh = bpy.data.meshes.new("Fuselage")
    obj = bpy.data.objects.new("Fuselage", mesh)
    bpy.context.scene.collection.objects.link(obj)
    bm = bmesh.new()

    rings = []
    for y, sx, sz, z0 in sections:
        ring = []
        for i in range(n_pts):
            angle = 2 * math.pi * i / n_pts
            x = sx * math.cos(angle)
            sin_a = math.sin(angle)
            z = z0 + sz * sin_a * (0.8 if sin_a < 0 else 1.0)  # bas aplati
            ring.append(bm.verts.new((x, y, z)))
        rings.append(ring)

    # Quads entre sections
    for i in range(len(rings) - 1):
        a, b = rings[i], rings[i + 1]
        for j in range(n_pts):
            k = (j + 1) % n_pts
            bm.faces.new([a[j], a[k], b[k], b[j]])

    # Bouchons nez + tuyère
    nose = bm.verts.new((0, sections[0][0], 0))
    for j in range(n_pts):
        k = (j + 1) % n_pts
        bm.faces.new([rings[0][j], rings[0][k], nose])
    tail = bm.verts.new((0, sections[-1][0], sections[-1][3]))
    for j in range(n_pts):
        k = (j + 1) % n_pts
        bm.faces.new([rings[-1][k], rings[-1][j], tail])

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return obj


def build_delta_wing(name: str, sign: int, vertices: dict) -> bpy.types.Object:
    """
    Voilure delta 3-section (root / mid / tip) avec épaisseur.
    sign : -1 (gauche) ou +1 (droite).
    vertices : dict avec clés root_le, root_te, mid_le, mid_te, tip_le, tip_te
               valeurs = (x, y, z_top, z_bot) -- x sera multiplié par sign.
    """
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    bm = bmesh.new()

    pts = {}
    for key, (x, y, zt, zb) in vertices.items():
        pts[key + "_t"] = bm.verts.new((sign * x, y, zt))
        pts[key + "_b"] = bm.verts.new((sign * x, y, zb))

    def quad(a, b, c, d):
        if sign > 0:
            bm.faces.new([a, b, c, d])
        else:
            bm.faces.new([d, c, b, a])

    # Extrados (top)
    quad(pts["root_le_t"], pts["mid_le_t"], pts["mid_te_t"], pts["root_te_t"])
    quad(pts["mid_le_t"], pts["tip_le_t"], pts["tip_te_t"], pts["mid_te_t"])
    # Intrados (bot)
    quad(pts["root_te_b"], pts["mid_te_b"], pts["mid_le_b"], pts["root_le_b"])
    quad(pts["mid_te_b"], pts["tip_te_b"], pts["tip_le_b"], pts["mid_le_b"])
    # Bord d'attaque (LE)
    quad(pts["root_le_b"], pts["mid_le_b"], pts["mid_le_t"], pts["root_le_t"])
    quad(pts["mid_le_b"], pts["tip_le_b"], pts["tip_le_t"], pts["mid_le_t"])
    # Bord de fuite (TE)
    quad(pts["root_te_t"], pts["mid_te_t"], pts["mid_te_b"], pts["root_te_b"])
    quad(pts["mid_te_t"], pts["tip_te_t"], pts["tip_te_b"], pts["mid_te_b"])
    # Tip + raccord fuselage
    quad(pts["tip_le_t"], pts["tip_le_b"], pts["tip_te_b"], pts["tip_te_t"])
    quad(pts["root_le_t"], pts["root_te_t"], pts["root_te_b"], pts["root_le_b"])

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return obj


def build_vertical_fin(thickness: float) -> bpy.types.Object:
    """Dérive verticale avec fairing à la base (3 sections), flèche arrière marquée."""
    mesh = bpy.data.meshes.new("Derive")
    obj = bpy.data.objects.new("Derive", mesh)
    bpy.context.scene.collection.objects.link(obj)
    bm = bmesh.new()

    t = thickness
    # Hauteur cible : sol (z=-0.115) à sommet → 0.70 → tip à z≈0.585.
    # Flèche arrière : le bord d'attaque recule de y=-0.10 (base) à y=-0.45 (tip).
    levels = [
        # (z, half_t, le_y, te_y) — base, mid, tip
        (0.025, t * 1.2, -0.10, -0.78),
        (0.260, t * 0.9, -0.25, -0.70),
        (0.580, t * 0.4, -0.45, -0.60),
    ]
    rings = []
    for z, ht, le_y, te_y in levels:
        ring = {
            "le_g": bm.verts.new((-ht, le_y, z)),
            "le_d": bm.verts.new((+ht, le_y, z)),
            "te_g": bm.verts.new((-ht, te_y, z)),
            "te_d": bm.verts.new((+ht, te_y, z)),
        }
        rings.append(ring)

    # Faces droite/gauche entre niveaux
    for i in range(len(rings) - 1):
        a, b = rings[i], rings[i + 1]
        bm.faces.new([a["le_d"], b["le_d"], b["te_d"], a["te_d"]])
        bm.faces.new([a["te_g"], b["te_g"], b["le_g"], a["le_g"]])
        bm.faces.new([a["le_g"], b["le_g"], b["le_d"], a["le_d"]])     # LE
        bm.faces.new([a["te_d"], b["te_d"], b["te_g"], a["te_g"]])     # TE
    # Bouchon top
    t = rings[-1]
    bm.faces.new([t["le_g"], t["le_d"], t["te_d"], t["te_g"]])
    # Bouchon base
    b = rings[0]
    bm.faces.new([b["le_d"], b["te_d"], b["te_g"], b["le_g"]])

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return obj


def build_verriere_bubble(sections: list, n_pts: int = 10,
                           name: str = "Verriere") -> bpy.types.Object:
    """
    Verrière bulle effilée — demi-sections en Z+ uniquement.
    Le nom par défaut "Verriere" reste détecté par le composant Three.js
    (matériau fumé) ; passer name="F35A_Canopy" ou autre est aussi détecté
    via la substring "canopy".
    """
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    bm = bmesh.new()

    rings = []
    for y, hw, hh, z0 in sections:
        ring = []
        for i in range(n_pts):
            angle = math.pi * i / (n_pts - 1)  # demi-cercle, 0 → π
            x = hw * math.cos(angle)
            z = z0 + hh * math.sin(angle)
            ring.append(bm.verts.new((x, y, z)))
        rings.append(ring)

    for i in range(len(rings) - 1):
        a, b = rings[i], rings[i + 1]
        for j in range(n_pts - 1):
            bm.faces.new([a[j], a[j + 1], b[j + 1], b[j]])

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return obj


def build_engine_nozzle(name: str, sign: int) -> bpy.types.Object:
    """
    Tuyère moteur abstraite — Rafale bi-réacteur (M88 ×2).

    Géométrie : 4 cercles concentriques (entrée → col → évasement → sortie).
    Écartement : centres à x=±0.075, rayons max 0.038 → 2 tuyères clairement
    séparées (gap visuel ≈0.075 entre bords intérieurs), dépassant légèrement
    du fuselage à l'arrière comme sur un Rafale réel.
    """
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    bm = bmesh.new()

    n = 16
    x_offset = sign * 0.082  # ±0.082 → distance entre centres = 0.164
    # 5 sections : entrée → diffuseur → col → évasement PC → anneau sortie.
    # Tuyères proéminentes dépassant nettement du fuselage (jusqu'à y=-1.14),
    # rayon max 0.052 → diamètre 0.104 (gap entre bords ≈0.060, bien visible).
    sections = [
        # (y, r, z_center)
        (-0.72, 0.042, -0.028),   # entrée canalisée
        (-0.86, 0.046, -0.030),   # diffuseur
        (-0.98, 0.052, -0.032),   # évasement maximum (zone PC)
        (-1.08, 0.050, -0.032),   # anneau de sortie
        (-1.14, 0.046, -0.032),   # lèvre arrière effilée
    ]
    rings = []
    for y, r, z0 in sections:
        ring = []
        for i in range(n):
            angle = 2 * math.pi * i / n
            x = x_offset + r * math.cos(angle)
            z = z0 + r * math.sin(angle)
            ring.append(bm.verts.new((x, y, z)))
        rings.append(ring)

    for k in range(len(rings) - 1):
        a, b = rings[k], rings[k + 1]
        for j in range(n):
            jn = (j + 1) % n
            bm.faces.new([a[j], a[jn], b[jn], b[j]])

    # Fond de tuyère ouvert (anneau plat noir abstrait, pas de cône intérieur)
    inner_r = 0.020
    inner_ring = []
    y_back, _, z_back = sections[-1]
    for i in range(n):
        angle = 2 * math.pi * i / n
        ix = x_offset + inner_r * math.cos(angle)
        iz = z_back + inner_r * math.sin(angle)
        inner_ring.append(bm.verts.new((ix, y_back, iz)))
    for j in range(n):
        jn = (j + 1) % n
        bm.faces.new([rings[-1][jn], rings[-1][j], inner_ring[j], inner_ring[jn]])

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return obj


def build_air_intake(name: str, sign: int) -> bpy.types.Object:
    """Entrée d'air sous le fuselage devant la voilure."""
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    bm = bmesh.new()
    s = sign

    y_f, y_b = +0.18, -0.05
    x_in, x_out = s * 0.085, s * 0.135
    z_t, z_b = 0.00, -0.075

    p = {}
    for y, ky in [(y_f, "F"), (y_b, "B")]:
        for x, kx in [(x_in, "i"), (x_out, "o")]:
            for z, kz in [(z_t, "T"), (z_b, "B")]:
                p[ky + kx + kz] = bm.verts.new((x, y, z))

    def quad(a, b, c, d):
        if sign > 0:
            bm.faces.new([a, b, c, d])
        else:
            bm.faces.new([d, c, b, a])

    quad(p["FiT"], p["FoT"], p["BoT"], p["BiT"])    # top
    quad(p["FiB"], p["BiB"], p["BoB"], p["FoB"])    # bot
    quad(p["FoT"], p["FoB"], p["BoB"], p["BoT"])    # outer
    quad(p["FiT"], p["FiB"], p["FoB"], p["FoT"])    # front (lèvre)
    quad(p["BiT"], p["BoT"], p["BoB"], p["BiB"])    # back

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return obj


def build_pylon(name: str, x: float, y: float, length=0.08, width=0.012, height=0.025):
    """Pylône d'emport sous une aile (cube aplati)."""
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    bm = bmesh.new()
    z_t = -0.005
    z_b = z_t - height
    hw, hl = width / 2, length / 2
    p = {}
    for ix, kx in [(-hw, "L"), (+hw, "R")]:
        for iy, ky in [(-hl, "B"), (+hl, "F")]:
            for iz, kz in [(z_b, "B"), (z_t, "T")]:
                p[kx + ky + kz] = bm.verts.new((x + ix, y + iy, iz))
    bm.faces.new([p["LFT"], p["RFT"], p["RBT"], p["LBT"]])
    bm.faces.new([p["LFB"], p["LBB"], p["RBB"], p["RFB"]])
    bm.faces.new([p["LFT"], p["LBT"], p["LBB"], p["LFB"]])
    bm.faces.new([p["RFT"], p["RFB"], p["RBB"], p["RBT"]])
    bm.faces.new([p["LFT"], p["LFB"], p["RFB"], p["RFT"]])
    bm.faces.new([p["LBT"], p["RBT"], p["RBB"], p["LBB"]])
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return obj


# ---------------------------------------------------------------------------
# Composants spécifiques aux silhouettes furtives (F-35, J-20…)
# ---------------------------------------------------------------------------

def build_faceted_fuselage(name: str, sections: list, n_pts: int = 6) -> bpy.types.Object:
    """
    Fuselage à sections polygonales (hexagonales par défaut) pour les silhouettes
    furtives anguleuses (style F-35). À la différence du fuselage Rafale en
    sections elliptiques continues, on a ici des facettes alignées plutôt qu'une
    courbe douce — c'est ce qui donne le look "stealth" plutôt qu'"aéronautique".

    sections : liste de (y, halfwidth, halfheight, z_center).
               halfwidth ≠ halfheight pour aplatir la section (chine plate).
    """
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    bm = bmesh.new()

    rings = []
    for y, hw, hh, z0 in sections:
        ring = []
        for i in range(n_pts):
            # Section polygonale aplatie : on étire X (hw) plus que Z (hh)
            # → silhouette furtive avec "chine" latérale plate.
            angle = 2 * math.pi * i / n_pts + math.pi / n_pts  # rotation pour avoir 2 faces plates haut/bas
            x = hw * math.cos(angle)
            z = z0 + hh * math.sin(angle) * (0.7 if math.sin(angle) < 0 else 1.0)
            ring.append(bm.verts.new((x, y, z)))
        rings.append(ring)

    for i in range(len(rings) - 1):
        a, b = rings[i], rings[i + 1]
        for j in range(n_pts):
            k = (j + 1) % n_pts
            bm.faces.new([a[j], a[k], b[k], b[j]])

    # Bouchon nez (plat polygonal — pas de pointe acérée, look "chined")
    front = bm.verts.new((0, sections[0][0], sections[0][3]))
    for j in range(n_pts):
        k = (j + 1) % n_pts
        bm.faces.new([rings[0][j], rings[0][k], front])
    # Bouchon arrière (ouvert au nozzle — on bouche pour valider GLTF)
    back = bm.verts.new((0, sections[-1][0], sections[-1][3]))
    for j in range(n_pts):
        k = (j + 1) % n_pts
        bm.faces.new([rings[-1][k], rings[-1][j], back])

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return obj


def build_trapezoidal_wing(name: str, sign: int, vertices: dict) -> bpy.types.Object:
    """
    Aile trapézoïdale (style F-35, sans canards). Même topologie que la voilure
    delta mais avec un tip plus large (pas en pointe) et un bord de fuite cassé.
    Réutilise la fonction build_delta_wing — la différence se joue dans les
    vertices_dict passés en argument.
    """
    return build_delta_wing(name, sign, vertices)


def build_canted_fin(name: str, sign: int, cant_deg: float, x_offset: float,
                     y_base: float, y_tip: float, height: float,
                     chord_base: float, chord_tip: float, thickness: float) -> bpy.types.Object:
    """
    Dérive verticale inclinée vers l'extérieur (style F-35, F-22, F/A-18).
    L'inclinaison `cant_deg` donne la signature visuelle furtive — la dérive
    n'est plus parallèle au plan ZY mais s'écarte vers l'extérieur en montant.
    """
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    bm = bmesh.new()

    cant = math.radians(cant_deg) * sign
    # Vecteur d'élévation incliné : combiné Z (vertical) + X (latéral)
    dx = math.sin(cant) * height
    dz = math.cos(cant) * height

    base_le = (sign * x_offset, y_base, 0)
    base_te = (sign * x_offset, y_base - chord_base, 0)
    tip_le = (sign * x_offset + dx, y_tip, dz)
    tip_te = (sign * x_offset + dx, y_tip - chord_tip, dz)

    # 2 surfaces inclinées (recto/verso) + bord arrondi sommet
    t = thickness
    nx = -math.cos(cant) * sign * t  # normale au plan dérive, vers l'intérieur
    nz = math.sin(cant) * sign * t

    def shift(p, s):
        return (p[0] + s * nx, p[1], p[2] + s * nz)

    pts = {
        "ble_i": bm.verts.new(shift(base_le, -1)),
        "ble_o": bm.verts.new(shift(base_le, +1)),
        "bte_i": bm.verts.new(shift(base_te, -1)),
        "bte_o": bm.verts.new(shift(base_te, +1)),
        "tle_i": bm.verts.new(shift(tip_le, -1)),
        "tle_o": bm.verts.new(shift(tip_le, +1)),
        "tte_i": bm.verts.new(shift(tip_te, -1)),
        "tte_o": bm.verts.new(shift(tip_te, +1)),
    }

    def quad(a, b, c, d):
        if sign > 0:
            bm.faces.new([a, b, c, d])
        else:
            bm.faces.new([d, c, b, a])

    quad(pts["ble_o"], pts["tle_o"], pts["tte_o"], pts["bte_o"])    # face extérieure
    quad(pts["bte_i"], pts["tte_i"], pts["tle_i"], pts["ble_i"])    # face intérieure
    quad(pts["ble_i"], pts["tle_i"], pts["tle_o"], pts["ble_o"])    # bord d'attaque
    quad(pts["bte_o"], pts["tte_o"], pts["tte_i"], pts["bte_i"])    # bord de fuite
    quad(pts["tle_o"], pts["tle_i"], pts["tte_i"], pts["tte_o"])    # sommet
    quad(pts["ble_i"], pts["ble_o"], pts["bte_o"], pts["bte_i"])    # base

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return obj


def build_central_nozzle(name: str) -> bpy.types.Object:
    """
    Nozzle moteur central unique (style F-35 monomoteur F135).
    Plus large et plus court que les tuyères Rafale — 1 seul mesh au centre.
    """
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    bm = bmesh.new()

    n = 18
    # Sections plus petites (rayon max 0.075 vs 0.090) et reculées (y=-0.92 à -1.12)
    # pour s'intégrer à la queue fuselage qui s'amincit → fini la "boule disproportionnée".
    sections = [
        # (y, r, z_center) — entrée (raccord fuselage) → col → évasement → sortie
        (-0.92, 0.072, -0.022),
        (-1.00, 0.065, -0.024),
        (-1.06, 0.075, -0.026),
        (-1.12, 0.068, -0.026),  # sortie
    ]
    rings = []
    for y, r, z0 in sections:
        ring = []
        for i in range(n):
            angle = 2 * math.pi * i / n
            x = r * math.cos(angle)
            z = z0 + r * math.sin(angle)
            ring.append(bm.verts.new((x, y, z)))
        rings.append(ring)

    for k in range(len(rings) - 1):
        a, b = rings[k], rings[k + 1]
        for j in range(n):
            jn = (j + 1) % n
            bm.faces.new([a[j], a[jn], b[jn], b[j]])

    # Anneau de sortie (fond ouvert sombre)
    inner_r = 0.045
    inner_ring = []
    y_back, _, z_back = sections[-1]
    for i in range(n):
        angle = 2 * math.pi * i / n
        ix = inner_r * math.cos(angle)
        iz = z_back + inner_r * math.sin(angle)
        inner_ring.append(bm.verts.new((ix, y_back, iz)))
    for j in range(n):
        jn = (j + 1) % n
        bm.faces.new([rings[-1][jn], rings[-1][j], inner_ring[j], inner_ring[jn]])

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return obj


def build_eots_bump(name: str, y_pos: float, x_half: float = 0.060,
                    z_top: float = -0.020, z_bot: float = -0.070,
                    length: float = 0.18) -> bpy.types.Object:
    """
    Bump EOTS facetté sous le nez (Electro-Optical Targeting System).
    Petit volume polygonal asymétrique typique du F-35, sans détail interne.
    """
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    bm = bmesh.new()

    y_f = y_pos + length / 2
    y_b = y_pos - length / 2

    # 8 vertices : 4 en haut (raccord fuselage), 4 en bas (apex bump)
    top_pts = [
        bm.verts.new((-x_half * 0.6, y_f, z_top)),  # 0 top front L
        bm.verts.new((+x_half * 0.6, y_f, z_top)),  # 1 top front R
        bm.verts.new((+x_half * 0.9, y_b, z_top)),  # 2 top back R
        bm.verts.new((-x_half * 0.9, y_b, z_top)),  # 3 top back L
    ]
    bot_pts = [
        bm.verts.new((-x_half * 0.4, y_f, z_top)),       # 4 nose-merge L
        bm.verts.new((+x_half * 0.4, y_f, z_top)),       # 5 nose-merge R
        bm.verts.new((+x_half * 0.7, y_b * 0.7 + y_f * 0.3, z_bot)),  # 6 apex back R
        bm.verts.new((-x_half * 0.7, y_b * 0.7 + y_f * 0.3, z_bot)),  # 7 apex back L
    ]

    # Faces du dessous (apex facetté)
    bm.faces.new([bot_pts[0], bot_pts[1], bot_pts[2], bot_pts[3]])  # apex flat
    bm.faces.new([top_pts[0], bot_pts[0], bot_pts[3], top_pts[3]])  # left flank
    bm.faces.new([top_pts[1], top_pts[2], bot_pts[2], bot_pts[1]])  # right flank
    bm.faces.new([top_pts[0], top_pts[1], bot_pts[1], bot_pts[0]])  # front facet
    bm.faces.new([top_pts[3], bot_pts[3], bot_pts[2], top_pts[2]])  # back facet
    # Pas de face top (volume collé sous fuselage)
    bm.faces.new([top_pts[0], top_pts[3], top_pts[2], top_pts[1]])  # top closing (intérieur)

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return obj


def build_lateral_intake(name: str, sign: int, y_front: float, y_back: float,
                         x_in: float, x_out: float, z_top: float, z_bot: float) -> bpy.types.Object:
    """
    Prise d'air latérale angulaire (style F-35 : forme trapézoïdale, lèvre
    déportée vers l'arrière, pas d'entrée ventrale).
    Distincte de build_air_intake qui faisait des prises rectangulaires plus
    discrètes — ici la lèvre est marquée et la forme plus prononcée.
    """
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    bm = bmesh.new()
    s = sign

    p = {}
    for y, ky in [(y_front, "F"), (y_back, "B")]:
        for x, kx in [(x_in, "i"), (x_out, "o")]:
            for z, kz in [(z_top, "T"), (z_bot, "B")]:
                p[ky + kx + kz] = bm.verts.new((s * x, y, z))

    def quad(a, b, c, d):
        if sign > 0:
            bm.faces.new([a, b, c, d])
        else:
            bm.faces.new([d, c, b, a])

    quad(p["FiT"], p["FoT"], p["BoT"], p["BiT"])    # top
    quad(p["FiB"], p["BiB"], p["BoB"], p["FoB"])    # bot
    quad(p["FoT"], p["FoB"], p["BoB"], p["BoT"])    # outer
    quad(p["FiT"], p["FiB"], p["FoB"], p["FoT"])    # front lip
    quad(p["BiT"], p["BoT"], p["BoB"], p["BiB"])    # back

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return obj


def build_landing_gear(name: str, x: float, y: float, length=0.10) -> bpy.types.Object:
    """Train d'atterrissage simplifié (cylindre fin)."""
    bpy.ops.mesh.primitive_cylinder_add(
        radius=1.0, depth=1.0, location=(x, y, -0.115),
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (0.012, 0.012, length / 2)
    bpy.ops.object.transform_apply(scale=True)
    return obj


# ---------------------------------------------------------------------------
# Assembly Rafale (delta-canard bimoteur)
# ---------------------------------------------------------------------------

def build_rafale() -> list:
    """
    Construit l'ensemble du mesh Rafale (delta-canard bimoteur).

    Échelle : 1 unité Blender = 7.65 m (modèle de longueur 2.0 unités → 15.30 m).
    Ratios cibles (gabarit public Rafale) :
        envergure / longueur  = 0.71  → halfSpan ±0.71
        hauteur / longueur    = 0.35  → 0.70 du train au sommet de la dérive

    Zones fonctionnelles (% de la longueur, y=+1 au nez à y=-1 à la tuyère) :
        nose         0–18%   → y > +0.64
        cockpit      18–32%  → +0.36 à +0.64
        canard       30–40%  → +0.20 à +0.40
        main wing    38–82%  → +0.24 à -0.64
        tail         68–92%  → -0.36 à -0.84
        exhaust      90–100% → y < -0.80
    """
    objects = []

    # FUSELAGE — 16 sections.
    # Nez plus effilé (pointe r=0.012 + ogive Sears-Haack progressive) inspiré
    # des photos de référence : cône radar fin, transition douce vers le maître-couple.
    # Queue élargie en X (boattail aplati à -1.10) pour englober la base des deux
    # tuyères latérales, comme le carrossage central entre les M88 sur un Rafale réel.
    objects.append(build_fuselage_sections([
        (+1.06, 0.012, 0.015, 0.000),   # pointe nez fine (cône radar)
        (+0.98, 0.030, 0.034, 0.005),   # ogive avant
        (+0.88, 0.058, 0.062, 0.010),
        (+0.76, 0.088, 0.090, 0.016),   # raccord cockpit
        (+0.60, 0.115, 0.108, 0.020),   # volume avant charnu
        (+0.42, 0.130, 0.116, 0.020),
        (+0.22, 0.138, 0.118, 0.016),   # maître-couple
        (+0.02, 0.140, 0.118, 0.010),
        (-0.18, 0.135, 0.114, 0.000),
        (-0.38, 0.124, 0.106, -0.010),
        (-0.58, 0.110, 0.094, -0.020),
        (-0.76, 0.094, 0.082, -0.028),
        (-0.90, 0.084, 0.072, -0.032),
        (-1.00, 0.085, 0.060, -0.032),  # début boattail — X préservé
        (-1.08, 0.095, 0.045, -0.034),  # boattail aplati englobant les tuyères
        (-1.14, 0.075, 0.035, -0.034),  # queue effilée
    ]))

    # VOILURE DELTA — root plus avant (zone 38–82%), tip étendu à x=0.71 (envergure réelle).
    wing_verts = {
        "root_le": (0.10, +0.24, 0.012, -0.012),   # bord d'attaque racine avancé
        "root_te": (0.10, -0.62, 0.012, -0.012),   # bord de fuite reculé
        "mid_le":  (0.38, -0.10, 0.012, -0.012),   # mi-aile : bord d'attaque marqué
        "mid_te":  (0.38, -0.58, 0.009, -0.009),
        "tip_le":  (0.71, -0.40, 0.005, -0.005),   # tip à l'envergure cible
        "tip_te":  (0.71, -0.50, 0.005, -0.005),
    }
    objects.append(build_delta_wing("Aile_G", -1, wing_verts))
    objects.append(build_delta_wing("Aile_D", +1, wing_verts))

    # CANARDS — petits plans triangulaires, devant l'aile, bien séparés.
    # Zone 30–40% : y entre +0.20 et +0.40. Surélevés (z ~0.07) pour rester visibles.
    canard_verts = {
        "root_le": (0.10, +0.40, 0.078, 0.058),
        "root_te": (0.10, +0.22, 0.078, 0.058),
        "mid_le":  (0.22, +0.36, 0.074, 0.054),
        "mid_te":  (0.22, +0.24, 0.070, 0.052),
        "tip_le":  (0.33, +0.32, 0.068, 0.050),    # tip étendu (+38% vs ancien)
        "tip_te":  (0.33, +0.26, 0.068, 0.050),
    }
    objects.append(build_delta_wing("Canard_G", -1, canard_verts))
    objects.append(build_delta_wing("Canard_D", +1, canard_verts))

    # DERIVE — montée à z=0.58 (hauteur sol→sommet ≈ 0.70 cible), flèche arrière marquée
    objects.append(build_vertical_fin(thickness=0.018))

    # VERRIERE — bulle franchement plus bombée (hh=0.112 vs 0.090) en goutte
    # allongée, inspirée des photos de référence. La hauteur max se déplace
    # légèrement en avant pour évoquer un cockpit relevé. Le fairing dorsal
    # se prolonge plus loin en arrière (jusqu'à y=-0.32) pour le profil
    # caractéristique du Rafale.
    objects.append(build_verriere_bubble([
        (+0.56, 0.012, 0.032, 0.108),   # pointe avant cadre verrière
        (+0.48, 0.042, 0.080, 0.110),
        (+0.40, 0.060, 0.108, 0.114),   # apex bulle — max hauteur
        (+0.30, 0.066, 0.112, 0.116),   # plateau max (cockpit relevé)
        (+0.18, 0.060, 0.096, 0.116),
        (+0.04, 0.050, 0.070, 0.112),
        (-0.10, 0.038, 0.044, 0.110),
        (-0.22, 0.024, 0.022, 0.108),
        (-0.32, 0.012, 0.008, 0.105),   # fairing dorsal allongé
    ]))

    # MOTEURS — tuyères évasées
    objects.append(build_engine_nozzle("Moteur_G", -1))
    objects.append(build_engine_nozzle("Moteur_D", +1))

    # ENTREES D'AIR latérales
    objects.append(build_air_intake("Intake_G", -1))
    objects.append(build_air_intake("Intake_D", +1))

    # PYLONES d'emport (3 par aile + 1 ventral)
    for side, sign in [("G", -1), ("D", +1)]:
        objects.append(build_pylon(f"Pylon_{side}_Int", x=sign * 0.18, y=-0.30, length=0.10))
        objects.append(build_pylon(f"Pylon_{side}_Med", x=sign * 0.30, y=-0.32, length=0.09))
        objects.append(build_pylon(f"Pylon_{side}_Ext", x=sign * 0.42, y=-0.35, length=0.08))
    objects.append(build_pylon("Pylon_Ventral", x=0.0, y=-0.12, length=0.14, width=0.025, height=0.04))

    # TRAINS d'atterrissage simplifiés
    objects.append(build_landing_gear("Train_Avant", 0.0, +0.52, length=0.08))
    objects.append(build_landing_gear("Train_G", -0.13, -0.08, length=0.10))
    objects.append(build_landing_gear("Train_D", +0.13, -0.08, length=0.10))

    return objects


# ---------------------------------------------------------------------------
# Registry des chasseurs supportés (extensible)
# ---------------------------------------------------------------------------

def build_f35a() -> list:
    """
    Construit l'ensemble du mesh F-35A Lightning II (chasseur furtif monomoteur).

    Échelle : 1 unité Blender = 7.85 m (modèle de longueur 2.0 unités → 15.7 m).
    Ratios cibles (gabarit public F-35A) :
        envergure / longueur  = 0.68  → halfSpan ±0.68
        hauteur / longueur    = 0.28  → 0.56 du train au sommet de la dérive

    Marqueurs visuels distinctifs vs Rafale :
        - PAS de canards
        - Fuselage hexagonal facetté (vs elliptique aéronautique)
        - Ailes trapézoïdales (vs delta)
        - 2 dérives inclinées vers l'extérieur (vs 1 dérive centrale verticale)
        - 1 seul nozzle central (vs 2 latéraux)
        - Bump EOTS facetté sous le nez

    Naming des objets : F35A_<Component> (cf. brief, distinct du naming Rafale).
    """
    objects = []

    # ------------------------------------------------------------------
    # FUSELAGE MAIN — refonte v2 : massif, intégré, chine continue
    # ------------------------------------------------------------------
    # Largeurs (hw) revues à la hausse pour donner le corps "massif" du F-35.
    # La zone cockpit-intakes (y +0.55 à +0.10) atteint hw=0.225 pour englober
    # visuellement les intakes plutôt que les laisser flotter à côté.
    # La queue (y < -0.40) s'amincit progressivement vers le nozzle.
    objects.append(build_faceted_fuselage("F35A_Fuselage_Main", [
        (+0.96, 0.048, 0.045, 0.012),    # raccord nez (large)
        (+0.82, 0.115, 0.075, 0.012),    # base cockpit
        (+0.64, 0.175, 0.092, 0.008),    # chine cockpit (hw >> hh = facette plate)
        (+0.42, 0.220, 0.108, 0.000),    # maître-couple intakes intégrés
        (+0.18, 0.230, 0.115, -0.005),   # max volume corps
        (-0.06, 0.225, 0.115, -0.012),
        (-0.30, 0.205, 0.108, -0.020),   # début amincissement
        (-0.52, 0.175, 0.095, -0.024),
        (-0.72, 0.140, 0.082, -0.026),   # tail booms
        (-0.88, 0.105, 0.068, -0.027),
        (-0.96, 0.080, 0.058, -0.028),   # raccord nozzle
    ], n_pts=6))

    # ------------------------------------------------------------------
    # NOSE CHINED — contenu dans la silhouette fuselage (ne dépasse plus)
    # ------------------------------------------------------------------
    # 3 sections progressives, hw max = 0.048 (matche le raccord fuselage),
    # pointe ramassée 0.012. Pas de dépassement latéral du fuselage main.
    objects.append(build_faceted_fuselage("F35A_Nose_Chined", [
        (+1.06, 0.012, 0.010, 0.015),    # pointe nez courte et arrondie
        (+1.02, 0.028, 0.026, 0.014),
        (+0.96, 0.048, 0.045, 0.012),    # raccord parfait avec fuselage main
    ], n_pts=6))

    # ------------------------------------------------------------------
    # EOTS — bump facetté sous le nez (zone cockpit)
    # ------------------------------------------------------------------
    objects.append(build_eots_bump("F35A_EOTS_UnderNose",
                                    y_pos=+0.86,
                                    x_half=0.055,
                                    z_top=0.000,
                                    z_bot=-0.060,
                                    length=0.20))

    # ------------------------------------------------------------------
    # CANOPY — bulle assise sur le fuselage élargi (z plus bas)
    # ------------------------------------------------------------------
    # z des sections réduit de 0.108 → 0.080 : la bulle pose plus bas sur le
    # fuselage massif, sans paraître flotter en l'air.
    objects.append(build_verriere_bubble([
        (+0.78, 0.020, 0.028, 0.075),    # cadre verrière avant
        (+0.70, 0.052, 0.078, 0.078),
        (+0.62, 0.068, 0.104, 0.082),    # apex bulle
        (+0.52, 0.072, 0.112, 0.084),    # max hauteur
        (+0.42, 0.068, 0.098, 0.082),
        (+0.30, 0.054, 0.072, 0.078),
        (+0.16, 0.034, 0.040, 0.073),
        (+0.02, 0.016, 0.014, 0.070),    # fairing dorsal qui meurt sur le fuselage
    ], name="F35A_Canopy"))

    # ------------------------------------------------------------------
    # INTAKES — collés contre le flanc du fuselage massif
    # ------------------------------------------------------------------
    # x_in matche hw du fuselage à la zone intake (≈ 0.205-0.230) pour qu'ils
    # paraissent intégrés au flanc, pas suspendus en orbite.
    objects.append(build_lateral_intake("F35A_Intake_Left", -1,
                                         y_front=+0.48, y_back=+0.16,
                                         x_in=0.195, x_out=0.265,
                                         z_top=0.030, z_bot=-0.060))
    objects.append(build_lateral_intake("F35A_Intake_Right", +1,
                                         y_front=+0.48, y_back=+0.16,
                                         x_in=0.195, x_out=0.265,
                                         z_top=0.030, z_bot=-0.060))

    # ------------------------------------------------------------------
    # AILES TRAPÉZOÏDALES — root collée au flanc fuselage élargi
    # ------------------------------------------------------------------
    # root_le à x=0.225 (matche hw fuselage à y=+0.10). Tip à x=0.71 → envergure
    # 10.7 m respectée.
    wing_verts = {
        "root_le": (0.225, +0.10, 0.010, -0.010),
        "root_te": (0.225, -0.52, 0.010, -0.010),
        "mid_le":  (0.450, -0.10, 0.008, -0.008),
        "mid_te":  (0.450, -0.46, 0.007, -0.007),
        "tip_le":  (0.710, -0.30, 0.005, -0.005),
        "tip_te":  (0.710, -0.42, 0.005, -0.005),
    }
    objects.append(build_trapezoidal_wing("F35A_Wing_Left", -1, wing_verts))
    objects.append(build_trapezoidal_wing("F35A_Wing_Right", +1, wing_verts))

    # ------------------------------------------------------------------
    # DÉRIVES VERTICALES INCLINÉES (cant 25°) — ancrées sur tail booms
    # ------------------------------------------------------------------
    # x_offset = 0.140 matche hw fuselage à y=-0.55 (tail boom). Hauteur 0.46
    # pour respecter le ratio hauteur/longueur 0.28 (apex z ≈ 0.44, soit 3.4 m
    # au-dessus du fuselage central + dépassement latéral du cant).
    objects.append(build_canted_fin("F35A_Tail_Vertical_Left", -1,
                                     cant_deg=25, x_offset=0.140,
                                     y_base=-0.42, y_tip=-0.74,
                                     height=0.46, chord_base=0.40, chord_tip=0.15,
                                     thickness=0.012))
    objects.append(build_canted_fin("F35A_Tail_Vertical_Right", +1,
                                     cant_deg=25, x_offset=0.140,
                                     y_base=-0.42, y_tip=-0.74,
                                     height=0.46, chord_base=0.40, chord_tip=0.15,
                                     thickness=0.012))

    # ------------------------------------------------------------------
    # EMPENNAGES HORIZONTAUX — tip à x=0.44 → 6.86 m (cible brief)
    # ------------------------------------------------------------------
    tail_verts = {
        "root_le": (0.115, -0.58, 0.005, -0.005),
        "root_te": (0.115, -0.92, 0.005, -0.005),
        "mid_le":  (0.290, -0.70, 0.005, -0.005),
        "mid_te":  (0.290, -0.88, 0.005, -0.005),
        "tip_le":  (0.440, -0.78, 0.004, -0.004),
        "tip_te":  (0.440, -0.86, 0.004, -0.004),
    }
    objects.append(build_trapezoidal_wing("F35A_Tailplane_Left", -1, tail_verts))
    objects.append(build_trapezoidal_wing("F35A_Tailplane_Right", +1, tail_verts))

    # ------------------------------------------------------------------
    # NOZZLE MOTEUR — central, proportionné (r max 0.075, sortie y=-1.12)
    # ------------------------------------------------------------------
    objects.append(build_central_nozzle("F35A_Engine_Nozzle"))

    return objects


AIRCRAFT_BUILDERS = {
    "rafale": build_rafale,
    "f-35": build_f35a,
    # Ajouter ici : "mirage2000": build_mirage2000, "j-20": build_j20, etc.
}


# ---------------------------------------------------------------------------
# Export GLB Draco
# ---------------------------------------------------------------------------

def export_glb(output_path: Path) -> int:
    bpy.ops.object.select_all(action="DESELECT")
    for o in bpy.data.objects:
        if o.type == "MESH":
            o.select_set(True)

    kwargs = dict(
        filepath=str(output_path),
        use_selection=True,
        export_format="GLB",
        export_apply=True,
        export_animations=False,
        export_lights=False,
        export_cameras=False,
        export_materials="NONE",
    )
    try:
        kwargs["export_draco_mesh_compression_enable"] = True
        kwargs["export_draco_mesh_compression_level"] = 6
    except Exception:
        pass

    bpy.ops.export_scene.gltf(**kwargs)
    size = output_path.stat().st_size
    print(f"[generate-wireframe] Exported: {output_path} ({size / 1024:.1f} KB)")
    if size > 100 * 1024:
        print(
            f"[generate-wireframe] WARNING: file exceeds 100 KB target "
            f"({size / 1024:.1f} KB)"
        )
    return size


# ---------------------------------------------------------------------------
# Entrée principale
# ---------------------------------------------------------------------------

def build_aircraft(slug: str) -> dict:
    builder = AIRCRAFT_BUILDERS.get(slug)
    if builder is None:
        raise ValueError(
            f"Aucun builder enregistré pour '{slug}'. "
            f"Disponibles : {list(AIRCRAFT_BUILDERS.keys())}"
        )
    # Spec utilisée pour valider l'existence du fichier et exposer des métadonnées
    spec = load_spec(slug)
    clear_meshes()
    objects = builder()
    out_path = get_output_path(slug)
    size = export_glb(out_path)
    return {
        "slug": slug,
        "name": spec.get("name", slug),
        "objects": [o.name for o in objects],
        "object_count": len(objects),
        "total_faces": sum(len(o.data.polygons) for o in objects),
        "output": str(out_path),
        "size_bytes": size,
        "size_kb": round(size / 1024, 2),
    }


if __name__ == "__main__":
    argv = sys.argv
    slug = "rafale"
    if "--" in argv:
        rest = argv[argv.index("--") + 1:]
        for i, arg in enumerate(rest):
            if arg == "--spec" and i + 1 < len(rest):
                slug = rest[i + 1]
    print(build_aircraft(slug))
