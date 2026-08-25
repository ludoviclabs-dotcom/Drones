"""
generate-thundart.py — Script Blender paramétré qui reconstruit l'asset 3D
« THUNDART » de Panoplie : une planche technique éditoriale, PAS un simulateur.

Ce que cet asset EST
    Une représentation volontairement simplifiée des formes EXTÉRIEURES visibles
    d'un système démonstratif présenté publiquement en salon. Destinée à un
    récit visuel Web en 4 temps : vue d'ensemble, inspection des composants
    externes, pose de démonstration, séparation illustrative d'un projectile.

Ce que cet asset N'EST PAS
    Pas un modèle CAO. Pas un jumeau opérationnel. Aucune cible, aucune
    coordonnée, aucun calcul balistique, aucune solution de tir, aucune portée,
    aucune télémétrie, aucun angle réel, aucune procédure. Aucun composant
    interne (charge, électronique, guidage, propulsion, mécanismes) n'est
    modélisé ni déduit.

Aucune cote réelle n'étant vérifiée dans ce dépôt, AUCUNE dimension réelle
n'est revendiquée : toute la géométrie est exprimée en proportions relatives
sans unité (« asset units »), lues sur des photos publiques.

Usage
    Mode interactif (via MCP Claude Code) :
        exec(open(PATH_TO_THIS_FILE, encoding="utf-8").read())
        build_thundart()

    Mode headless (CLI, CI) :
        blender --background --python tools/thundart-3d/generate-thundart.py -- --spec thundart

Sortie
    public/models/hud/thundart.glb

Conventions
    Repère Blender Z-up : +Y = avant du véhicule, -Y = arrière (bouches des
    conteneurs), z=0 = plan de contact des roues. L'export GLB convertit en
    Y-up (export_yup=True), convention glTF standard attendue par Three.js.

    Noms d'objets strictement ASCII (requis pour le mapping JS côté THD-02).

Différences assumées avec tools/aviation-3d/generate-wireframe.py
    - matériaux PBR simples exportés (l'aviation exporte export_materials="NONE",
      le rendu filaire étant appliqué côté Three.js) ;
    - animations exportées (l'aviation n'en a pas) ;
    - Draco désactivé : le décodeur Draco de drei est téléchargé depuis un CDN
      externe au runtime, or THD-01 exige zéro dépendance externe.
    Le pipeline aviation n'est volontairement PAS refactoré pour autant.
"""

import json
import math
import os
import sys
from pathlib import Path

import bmesh
import bpy

SCENE_NAME = "THUNDART_THD01"

# Amplitude visuelle arbitraire de la pose de démonstration, en radians.
# Ce n'est PAS une élévation, ce n'est calibré sur aucun équipement réel, et
# aucune valeur opérationnelle n'en est dérivée ni documentée. Le facteur
# normalisé 0..1 de la spec est simplement multiplié par cette amplitude.
DEMO_POSE_VISUAL_SPAN_RAD = 1.0


# ---------------------------------------------------------------------------
# I/O — mêmes conventions que tools/aviation-3d/generate-wireframe.py
# ---------------------------------------------------------------------------

def get_repo_root() -> Path:
    env = os.environ.get("PANOPLIE_REPO_ROOT")
    if env and (Path(env) / "package.json").exists():
        return Path(env)
    if "__file__" in globals():
        script_dir = Path(__file__).resolve().parent
        for candidate in [script_dir, script_dir.parent, script_dir.parent.parent]:
            if (candidate / "package.json").exists():
                return candidate
    # Fallback pour le contexte MCP, qui n'expose pas __file__.
    return Path(r"C:\Users\Ludo\Drones\.claude\worktrees\sweet-black-0be338")


def load_spec(slug: str = "thundart") -> dict:
    spec_path = get_repo_root() / "tools" / "thundart-3d" / "specs" / (slug + ".json")
    with open(spec_path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def get_output_path(spec: dict) -> Path:
    out = get_repo_root() / Path(spec["export"]["output"])
    out.parent.mkdir(parents=True, exist_ok=True)
    return out


def validate_spec(spec: dict) -> list:
    """
    Garde-fous d'interpénétration. Les proportions de la spec sont libres, mais
    certaines combinaisons feraient se traverser des volumes — ce qui se voit
    immédiatement à l'écran. On échoue tôt plutôt que d'exporter un GLB fautif.
    """
    can = spec["launcher"]["canisters"]
    rack = spec["launcher"]["rack"]
    rk = spec["rocket_demo"]
    collar = can["outer_radius"] + can["rim_thickness"]
    checks = [
        ("collerettes voisines qui se traversent",
         2.0 * collar < can["column_spacing"]),
        ("collerettes superposees qui se traversent",
         2.0 * collar < can["row_spacing"]),
        ("bloc de conteneurs plus large que le cadre du rack",
         (can["columns"] - 1) / 2.0 * can["column_spacing"] + collar
         < rack["half_width"]),
        ("bloc de conteneurs plus haut que le cadre du rack",
         can["row_base_z_local"] + (can["rows"] - 1) * can["row_spacing"] + collar
         < rack["top_z_local"]),
        ("empennage plus large que le conteneur",
         rk["body_radius"] + rk["fin_span"] < can["outer_radius"]),
        ("projectile plus long que son conteneur",
         rk["total_length"] < can["front_y_local"] - can["rear_y_local"]),
    ]
    failed = [label for label, ok in checks if not ok]
    if failed:
        raise ValueError("Spec incoherente : " + " ; ".join(failed))
    return [label for label, _ in checks]


# ---------------------------------------------------------------------------
# Scène — non destructif : en interactif on travaille dans une scène dédiée
# ---------------------------------------------------------------------------

def prepare_scene() -> bpy.types.Scene:
    if bpy.app.background:
        scene = bpy.context.scene
        for obj in list(scene.objects):
            bpy.data.objects.remove(obj, do_unlink=True)
        # Le nom de scene finit dans le JSON du glTF : on l'aligne sur celui du
        # mode interactif pour que les deux chemins produisent le meme fichier.
        scene.name = SCENE_NAME
    else:
        scene = bpy.data.scenes.get(SCENE_NAME)
        if scene is None:
            scene = bpy.data.scenes.new(SCENE_NAME)
        for obj in list(scene.collection.objects):
            bpy.data.objects.remove(obj, do_unlink=True)
        window = getattr(bpy.context, "window", None)
        if window is not None:
            window.scene = scene
    for block in (bpy.data.meshes, bpy.data.actions):
        for item in list(block):
            if item.users == 0:
                block.remove(item)
    return scene


# ---------------------------------------------------------------------------
# Matériaux PBR simples (pas de texture, pas de dépendance externe)
# ---------------------------------------------------------------------------

def ensure_materials(spec: dict) -> dict:
    mats = {}
    for name, cfg in spec["materials"].items():
        mat = bpy.data.materials.get(name)
        if mat is None:
            mat = bpy.data.materials.new(name)
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf is not None:
            bsdf.inputs["Base Color"].default_value = tuple(cfg["base_color"])
            bsdf.inputs["Roughness"].default_value = cfg["roughness"]
            bsdf.inputs["Metallic"].default_value = cfg["metallic"]
        mat.diffuse_color = tuple(cfg["base_color"])
        mats[name] = mat
    return mats


# ---------------------------------------------------------------------------
# Helpers bmesh — toute la géométrie est construite en espace LOCAL de l'objet,
# ce qui donne des pivots propres sans transformation à appliquer après coup.
# ---------------------------------------------------------------------------

def bm_box(bm, x0, x1, y0, y1, z0, z1, mat=0):
    coords = [
        (x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
        (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1),
    ]
    verts = [bm.verts.new(c) for c in coords]
    for quad in [(0, 1, 2, 3), (4, 5, 6, 7), (0, 1, 5, 4),
                 (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]:
        face = bm.faces.new([verts[i] for i in quad])
        face.material_index = mat


def bm_loft_y(bm, profile, segments, mat=0, cap_start=True, cap_end=True,
              x=0.0, z=0.0):
    """Surface de révolution autour de l'axe Y, définie par [(y, rayon), ...]."""
    rings = []
    for pos, radius in profile:
        ring = []
        for i in range(segments):
            angle = 2.0 * math.pi * i / segments
            ring.append(bm.verts.new((
                x + radius * math.cos(angle),
                pos,
                z + radius * math.sin(angle),
            )))
        rings.append(ring)
    for k in range(len(rings) - 1):
        lo, hi = rings[k], rings[k + 1]
        for i in range(segments):
            j = (i + 1) % segments
            bm.faces.new((lo[i], lo[j], hi[j], hi[i])).material_index = mat
    if cap_start:
        bm.faces.new(rings[0]).material_index = mat
    if cap_end:
        bm.faces.new(list(reversed(rings[-1]))).material_index = mat


def bm_tube_y(bm, radius, y0, y1, segments, mat=0, cap_start=True, cap_end=True,
              x=0.0, z=0.0):
    bm_loft_y(bm, [(y0, radius), (y1, radius)], segments, mat,
              cap_start, cap_end, x, z)


def bm_disc_y(bm, radius, y, segments, mat=0, x=0.0, z=0.0):
    ring = []
    for i in range(segments):
        angle = 2.0 * math.pi * i / segments
        ring.append(bm.verts.new((x + radius * math.cos(angle), y,
                                  z + radius * math.sin(angle))))
    bm.faces.new(ring).material_index = mat


def bm_cyl_x(bm, radius, x0, x1, segments, mat=0, cap=True, y=0.0, z=0.0):
    """Cylindre autour de l'axe X (roues)."""
    rings = []
    for pos in (x0, x1):
        ring = []
        for i in range(segments):
            angle = 2.0 * math.pi * i / segments
            ring.append(bm.verts.new((pos, y + radius * math.cos(angle),
                                      z + radius * math.sin(angle))))
        rings.append(ring)
    lo, hi = rings
    for i in range(segments):
        j = (i + 1) % segments
        bm.faces.new((lo[i], lo[j], hi[j], hi[i])).material_index = mat
    if cap:
        bm.faces.new(lo).material_index = mat
        bm.faces.new(list(reversed(hi))).material_index = mat


def bm_fin_y(bm, r_root, r_tip, y_root_le, y_root_te, y_tip_le, y_tip_te,
             half_thickness, angle, mat=0):
    """Empennage trapézoïdal plaqué autour de l'axe Y, tourné de `angle`."""
    cos_a, sin_a = math.cos(angle), math.sin(angle)

    def place(radial, y, side):
        return bm.verts.new((radial * cos_a - side * half_thickness * sin_a, y,
                             radial * sin_a + side * half_thickness * cos_a))

    plan = [(r_root, y_root_le), (r_root, y_root_te),
            (r_tip, y_tip_te), (r_tip, y_tip_le)]
    lo = [place(rr, yy, -1.0) for rr, yy in plan]
    hi = [place(rr, yy, +1.0) for rr, yy in plan]
    bm.faces.new(lo).material_index = mat
    bm.faces.new(list(reversed(hi))).material_index = mat
    for i in range(4):
        j = (i + 1) % 4
        bm.faces.new((lo[i], lo[j], hi[j], hi[i])).material_index = mat


# Au-dela de cet angle entre deux faces, l'arete est marquee vive. Les surfaces
# de revolution (roues, conteneurs, projectile) restent donc lissees et
# partagent leurs sommets a l'export, tandis que les caisses gardent des aretes
# franches. Sans cela, tout est facettise : l'exporteur duplique alors un jeu de
# sommets par face et le GLB double de volume pour un rendu moins bon.
SHARP_EDGE_ANGLE_RAD = math.radians(34.0)


def shade_smooth_with_sharp_edges(bm):
    for face in bm.faces:
        face.smooth = True
    for edge in bm.edges:
        if len(edge.link_faces) == 2:
            edge.smooth = edge.calc_face_angle(0.0) <= SHARP_EDGE_ANGLE_RAD
        else:
            edge.smooth = False


def mesh_from_bm(name, bm, slots, mats):
    """bmesh -> data-block mesh, matériaux dans l'ordre des slots utilisés."""
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    shade_smooth_with_sharp_edges(bm)
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    mesh.validate(verbose=False)
    for slot_name in slots:
        mesh.materials.append(mats[slot_name])
    return mesh


def object_from_mesh(scene, name, mesh, parent=None, location=(0.0, 0.0, 0.0)):
    """
    Objet Blender à transformations neutres. Plusieurs objets peuvent partager
    le même data-block mesh : l'exporteur glTF le mutualise alors en une seule
    mesh instanciée par N noeuds, ce qui évite de dupliquer 8 roues identiques.
    """
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    # Pas d'échelle, pas de rotation : seule la translation place l'objet, donc
    # le pivot exporté est exactement l'origine choisie ci-dessus.
    obj.location = location
    if parent is not None:
        # parent_inverse laissé à l'identité : `location` EST l'offset local.
        obj.parent = parent
    return obj


def finalize(scene, name, bm, slots, mats, parent=None, location=(0.0, 0.0, 0.0)):
    return object_from_mesh(scene, name, mesh_from_bm(name, bm, slots, mats),
                            parent, location)


def new_empty(scene, name, parent=None, location=(0.0, 0.0, 0.0)):
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_type = "PLAIN_AXES"
    obj.empty_display_size = 0.6
    scene.collection.objects.link(obj)
    obj.location = location
    if parent is not None:
        obj.parent = parent
    return obj


# ---------------------------------------------------------------------------
# Véhicule — silhouette extérieure simplifiée (châssis, cabine, roues)
# ---------------------------------------------------------------------------

def build_chassis(scene, spec, mats, parent):
    """Longerons + plateau. Pivot au datum véhicule (0, 0, 0) = origine sol."""
    veh = spec["vehicle"]
    ch, deck = veh["chassis"], veh["deck"]
    bm = bmesh.new()

    rail_half = 0.09
    for side in (-1.0, 1.0):
        cx = side * ch["rail_half_width"]
        bm_box(bm, cx - rail_half, cx + rail_half, ch["rear_y"], ch["front_y"],
               ch["rail_z"] - ch["rail_half_height"],
               ch["rail_z"] + ch["rail_half_height"], mat=0)

    # Plateau porteur
    bm_box(bm, -deck["half_width"], deck["half_width"],
           deck["rear_y"], deck["front_y"],
           deck["top_z"] - deck["thickness"], deck["top_z"], mat=0)

    # Traverses + bavolets latéraux (détail structurel discret)
    for y in (2.05, 0.35, -1.35, -3.05, -4.60):
        bm_box(bm, -deck["half_width"] + 0.02, deck["half_width"] - 0.02,
               y - 0.07, y + 0.07, 1.02, 1.16, mat=1)
    for side in (-1.0, 1.0):
        cx = side * (deck["half_width"] - 0.03)
        bm_box(bm, cx - 0.04, cx + 0.04, deck["rear_y"], deck["front_y"],
               deck["top_z"], deck["top_z"] + 0.11, mat=1)

    # Pare-chocs arrière et protection anti-encastrement
    bm_box(bm, -deck["half_width"], deck["half_width"],
           deck["rear_y"] - 0.16, deck["rear_y"], 1.05, 1.45, mat=1)
    bm_box(bm, -0.95, 0.95, deck["rear_y"] - 0.12, deck["rear_y"] + 0.02,
           0.44, 0.60, mat=1)

    return finalize(scene, "THD_Chassis", bm,
                    ["THD_MAT_Vehicle", "THD_MAT_Detail"], mats, parent)


def build_cab(scene, spec, mats, parent):
    """Cabine simplifiée. Pivot au centre de son empreinte, au niveau plancher."""
    cab = spec["vehicle"]["cab"]
    center_y = 0.5 * (cab["front_y"] + cab["back_y"])
    pivot = (0.0, center_y, cab["floor_z"])
    half_len = 0.5 * (cab["front_y"] - cab["back_y"])
    hw = cab["half_width"]
    height = cab["roof_z"] - cab["floor_z"]
    bm = bmesh.new()

    # Volume principal
    bm_box(bm, -hw, hw, -half_len, half_len, 0.0, height, mat=0)

    # Pare-brise : bandeau affleurant sur la face avant (matériau vitrage)
    inset = cab["screen_inset"]
    bm_box(bm, -hw + 0.16, hw - 0.16, half_len - 0.01, half_len + inset,
           height - 1.02, height - 0.28, mat=1)

    # Custodes latérales
    for side in (-1.0, 1.0):
        cx = side * hw
        bm_box(bm, cx - inset, cx + inset, -half_len + 0.30, -half_len + 1.20,
               height - 1.02, height - 0.34, mat=1)

    # Casquette de pavillon (teinte caisse) + trappe de toit (détail)
    bm_box(bm, -hw, hw, half_len - 0.30, half_len + 0.06,
           height, height + 0.09, mat=0)
    bm_box(bm, -0.42, 0.42, -0.55, 0.25, height, height + 0.14, mat=2)

    # Pare-chocs et marchepied
    bm_box(bm, -hw - 0.04, hw + 0.04, half_len - 0.02, half_len + 0.20,
           0.02, 0.46, mat=2)
    for side in (-1.0, 1.0):
        cx = side * (hw - 0.05)
        bm_box(bm, cx - 0.13, cx + 0.13, -half_len + 0.55, -half_len + 1.05,
               -0.44, -0.34, mat=2)

    return finalize(scene, "THD_Cab", bm,
                    ["THD_MAT_Vehicle", "THD_MAT_Glass", "THD_MAT_Detail"],
                    mats, parent, pivot)


def build_wheels(scene, spec, mats, parent):
    """
    8 roues (4 essieux). Pivot au centre de chaque roue -> rotation propre.
    La roue est symétrique (moyeu des deux côtés), donc les 8 objets partagent
    un seul data-block mesh, instancié 8 fois dans le GLB.
    """
    wcfg = spec["vehicle"]["wheels"]
    radius = wcfg["radius"]
    half_w = wcfg["half_width"]
    segments = wcfg["segments"]
    hub_r = radius * wcfg["hub_radius_ratio"]

    bm = bmesh.new()
    bm_cyl_x(bm, radius, -half_w, half_w, segments, mat=0, cap=True)
    for side in (-1.0, 1.0):
        outer = side * (half_w + 0.03)
        inner = side * (half_w - 0.06)
        bm_cyl_x(bm, hub_r, min(inner, outer), max(inner, outer),
                 segments, mat=1, cap=True)
    mesh = mesh_from_bm("THD_Wheel", bm, ["THD_MAT_Tire", "THD_MAT_Detail"], mats)

    made = []
    for axle_index, axle_y in enumerate(wcfg["axle_y"], start=1):
        for side_key, side in (("L", -1.0), ("R", 1.0)):
            made.append(object_from_mesh(
                scene, "THD_Wheel_%s%d" % (side_key, axle_index), mesh, parent,
                (side * wcfg["track_half"], axle_y, radius)))
    return made


# ---------------------------------------------------------------------------
# Lanceur — base, rack, conteneurs
# ---------------------------------------------------------------------------

def build_launcher_base(scene, spec, mats, parent):
    """Embase sur le plateau. Pivot au datum plateau (0, 0, top_z)."""
    base = spec["launcher"]["base"]
    rack = spec["launcher"]["rack"]
    pivot = (0.0, 0.0, spec["vehicle"]["deck"]["top_z"])
    hw = base["half_width"]
    top = base["top_z"] - base["bottom_z"]
    bm = bmesh.new()

    bm_box(bm, -hw, hw, base["rear_y"], base["front_y"], 0.0, top, mat=0)

    # Berceaux longitudinaux (détail)
    for side in (-1.0, 1.0):
        cx = side * (hw - 0.10)
        bm_box(bm, cx - 0.08, cx + 0.08, base["rear_y"] + 0.05,
               base["front_y"] - 0.05, top, top + 0.07, mat=1)

    # Chapes d'articulation, de part et d'autre du pivot du rack
    hinge_y = rack["hinge_y"]
    hinge_z = rack["hinge_z"] - base["bottom_z"]
    for side in (-1.0, 1.0):
        cx = side * (hw - 0.16)
        bm_box(bm, cx - 0.09, cx + 0.09, hinge_y - 0.22, hinge_y + 0.22,
               top - 0.05, hinge_z + 0.10, mat=1)

    # Vérin de manoeuvre stylisé (volume extérieur uniquement, non fonctionnel)
    bm_box(bm, -0.16, 0.16, base["front_y"] - 0.55, base["front_y"] - 0.10,
           top, top + 0.55, mat=1)

    return finalize(scene, "THD_Launcher_Base", bm,
                    ["THD_MAT_Vehicle", "THD_MAT_Detail"], mats, parent, pivot)


def build_launcher_rack(scene, spec, mats, parent):
    """Cadre ouvert du rack. Pivot EXACTEMENT sur l'axe d'articulation."""
    rack = spec["launcher"]["rack"]
    base = spec["launcher"]["base"]
    deck_top = spec["vehicle"]["deck"]["top_z"]
    # Offset local par rapport a THD_Launcher_Base (dont le pivot est a deck_top)
    location = (0.0, rack["hinge_y"], rack["hinge_z"] - deck_top)

    hw = rack["half_width"]
    y_front, y_rear = rack["front_y_local"], rack["rear_y_local"]
    z_bot, z_top = rack["bottom_z_local"], rack["top_z_local"]
    t = rack["rail_thickness"]
    bm = bmesh.new()

    # 4 longerons d'angle
    for side in (-1.0, 1.0):
        cx = side * hw
        for cz in (z_bot, z_top):
            bm_box(bm, cx - t, cx + t, y_rear, y_front, cz - t, cz + t, mat=0)

    # Traverses transversales réparties
    ribs = rack["rib_count"]
    span = y_front - y_rear
    rt = rack["rib_thickness"]
    for i in range(ribs):
        ry = y_front - span * (i + 0.04) / max(1, ribs - 0.08)
        for cz in (z_bot, z_top):
            bm_box(bm, -hw - t, hw + t, ry - rt, ry + rt, cz - t, cz + t, mat=1)
        for side in (-1.0, 1.0):
            cx = side * hw
            bm_box(bm, cx - t, cx + t, ry - rt, ry + rt, z_bot, z_top, mat=1)

    # Platine avant fermée (côté articulation)
    bm_box(bm, -hw - t, hw + t, y_front - 0.06, y_front + t,
           z_bot - t, z_top + t, mat=0)

    # Sabots d'articulation + patins arrière
    for side in (-1.0, 1.0):
        cx = side * (hw - 0.12)
        bm_box(bm, cx - 0.10, cx + 0.10, -0.20, 0.20, z_bot - 0.16, z_bot + t,
               mat=1)
        bm_box(bm, cx - 0.08, cx + 0.08, y_rear + 0.05, y_rear + 0.45,
               z_bot - 0.12, z_bot - t, mat=1)

    return finalize(scene, "THD_Launcher_Rack", bm,
                    ["THD_MAT_Vehicle", "THD_MAT_Detail"], mats, parent, location)


def canister_positions(spec):
    """Positions locales (x, z) des 8 conteneurs, dans l'ordre 01..08."""
    can = spec["launcher"]["canisters"]
    cols, rows = can["columns"], can["rows"]
    cs, rs = can["column_spacing"], can["row_spacing"]
    out = []
    for row in range(rows):
        # Rangée 0 = haute (01..04), rangée 1 = basse (05..08).
        cz = can["row_base_z_local"] + (rows - 1 - row) * rs
        for col in range(cols):
            cx = (col - (cols - 1) / 2.0) * cs
            out.append((cx, cz))
    return out


def _canister_mesh(spec, mats, name, loaded):
    can = spec["launcher"]["canisters"]
    radius = can["outer_radius"]
    length = can["front_y_local"] - can["rear_y_local"]
    segments = can["segments"]
    half = length / 2.0
    bm = bmesh.new()

    # Tube extérieur : culasse fermée, bouche ouverte.
    bm_tube_y(bm, radius, -half, half, segments, mat=0,
              cap_start=False, cap_end=True)

    # Collerette de bouche (lit comme les cercles visibles sur les photos)
    collar = radius + can["rim_thickness"]
    bm_tube_y(bm, collar, -half, -half + can["rim_depth"], segments,
              mat=1, cap_start=False, cap_end=False)
    bm_disc_y(bm, collar, -half, segments, mat=1)

    # Obturateur en retrait, sauf sur le conteneur qui porte le projectile de
    # démonstration (sinon il le traverserait en s'écartant).
    if not loaded:
        bm_disc_y(bm, radius * 0.94, -half + 0.16, segments, mat=1)

    # Sangles de maintien extérieures
    for frac in (0.24, 0.76):
        band_y = -half + length * frac
        bm_tube_y(bm, radius + 0.012, band_y - 0.045, band_y + 0.045,
                  segments, mat=1, cap_start=False, cap_end=False)

    return mesh_from_bm(name, bm, ["THD_MAT_Canister", "THD_MAT_Detail"], mats)


def build_canisters(scene, spec, mats, parent):
    """
    8 conteneurs extérieurs. Pivot au centre de chaque tube, sur son axe.
    Deux data-blocks mesh seulement : le conteneur obturé (x7) et celui qui
    porte le projectile de démonstration, bouche dégagée (x1).
    """
    can = spec["launcher"]["canisters"]
    mid_y = (can["rear_y_local"] + can["front_y_local"]) / 2.0
    host = spec["rocket_demo"]["host_canister"]
    shared = {
        False: _canister_mesh(spec, mats, "THD_Canister_Closed", False),
        True: _canister_mesh(spec, mats, "THD_Canister_Loaded", True),
    }
    made = []
    for index, (cx, cz) in enumerate(canister_positions(spec), start=1):
        made.append(object_from_mesh(
            scene, "THD_Canister_%02d" % index, shared[index == host],
            parent, (cx, mid_y, cz)))
    return made


# ---------------------------------------------------------------------------
# Projectile de démonstration — silhouette extérieure uniquement
# ---------------------------------------------------------------------------

def build_rocket_demo(scene, spec, mats, parent):
    """
    Pivot au centre géométrique, axe du corps aligné sur l'axe Y local : la
    translation de séparation est donc strictement le long de son axe local.
    Aucun composant interne n'est modélisé.
    """
    rk = spec["rocket_demo"]
    can = spec["launcher"]["canisters"]
    radius = rk["body_radius"]
    total = rk["total_length"]
    half = total / 2.0
    segments = rk["segments"]

    # Nez vers -Y (côté bouche des conteneurs).
    y_tip = -half
    y_nose_base = y_tip + rk["nose_length"]
    y_tail_start = half - rk["tail_taper_length"]

    profile = []
    for i in range(rk["nose_sections"] + 1):
        t = 1.0 - i / float(rk["nose_sections"])  # t=1 a la pointe
        shape = max(0.0, 1.0 - t ** 1.75) ** 0.62
        r = max(rk["nose_tip_radius"], radius * shape)
        profile.append((y_tip + rk["nose_length"] * (1.0 - t), r))
    profile.append((y_nose_base, radius))
    profile.append((y_tail_start, radius))
    profile.append((half, radius * rk["tail_radius_ratio"]))

    bm = bmesh.new()
    bm_loft_y(bm, profile, segments, mat=0, cap_start=True, cap_end=True)

    # Ceintures extérieures (repères de structure visibles sur les photos)
    band_r = radius + rk["band_radius_extra"]
    bw = rk["band_width"] / 2.0
    usable = y_tail_start - y_nose_base
    for i in range(rk["band_count"]):
        by = y_nose_base + usable * (i + 1) / (rk["band_count"] + 1.0)
        bm_tube_y(bm, band_r, by - bw, by + bw, segments, mat=1,
                  cap_start=False, cap_end=False)

    # Empennage arrière : 4 plans trapézoïdaux. L'envergure reste inférieure au
    # rayon intérieur du conteneur (garanti par validate_spec).
    y_te = half - rk["fin_offset_from_tail"]
    r_tip = radius + rk["fin_span"]
    for i in range(rk["fin_count"]):
        bm_fin_y(bm,
                 r_root=radius * 0.94,
                 r_tip=r_tip,
                 y_root_le=y_te - rk["fin_root_chord"],
                 y_root_te=y_te,
                 y_tip_le=y_te - rk["fin_tip_chord"],
                 y_tip_te=y_te,
                 half_thickness=rk["fin_thickness"] / 2.0,
                 angle=2.0 * math.pi * i / rk["fin_count"] + math.pi / 4.0,
                 mat=1)

    # Placement : dans le conteneur hôte, nez légèrement en retrait de la bouche.
    cx, cz = canister_positions(spec)[rk["host_canister"] - 1]
    can_mid = (can["rear_y_local"] + can["front_y_local"]) / 2.0
    can_half = (can["front_y_local"] - can["rear_y_local"]) / 2.0
    recess = 0.45
    center_y = can_mid - can_half + recess + half

    return finalize(scene, "THD_Rocket_Demo", bm,
                    ["THD_MAT_Rocket", "THD_MAT_Detail"], mats,
                    parent, (cx, center_y, cz))


# ---------------------------------------------------------------------------
# Animations démonstratives (2 clips nommés, poussés en pistes NLA)
# ---------------------------------------------------------------------------

def _assign_action(obj, action):
    if obj.animation_data is None:
        obj.animation_data_create()
    obj.animation_data.action = action
    # Blender 4.4+ : les actions sont « slottées ». Si aucun slot n'a été
    # attribué automatiquement, on en crée un explicitement.
    if hasattr(obj.animation_data, "action_slot"):
        if obj.animation_data.action_slot is None and hasattr(action, "slots"):
            slot = action.slots.new(id_type="OBJECT", name=obj.name)
            obj.animation_data.action_slot = slot


def _push_to_nla(obj, action, name, start):
    """
    Une piste NLA par clip : l'exporteur glTF en mode NLA_TRACKS produit une
    animation glTF par NOM de piste, ce qui garantit des noms de clips stables
    (THD_CONFIGURE_DEMO / THD_DEPARTURE_DEMO) côté Three.js.
    """
    slot = getattr(obj.animation_data, "action_slot", None)
    track = obj.animation_data.nla_tracks.new()
    track.name = name
    strip = track.strips.new(name, int(start), action)
    strip.name = name
    # Blender 4.4+ : la strip doit pointer le slot d'action correspondant.
    if slot is not None and hasattr(strip, "action_slot"):
        strip.action_slot = slot
    obj.animation_data.action = None
    return track


def _iter_fcurves(action):
    """
    Blender 4.4+ « slotte » les actions : les courbes ne sont plus sur
    action.fcurves mais sous action.layers[].strips[].channelbags[].fcurves.
    On gère les deux formes pour rester portable.
    """
    if hasattr(action, "layers") and getattr(action, "is_action_layered", False):
        for layer in action.layers:
            for strip in layer.strips:
                for bag in getattr(strip, "channelbags", []):
                    for fcurve in bag.fcurves:
                        yield fcurve
        return
    for fcurve in getattr(action, "fcurves", []):
        yield fcurve


def _set_interpolation(action, mode):
    for fcurve in _iter_fcurves(action):
        for kp in fcurve.keyframe_points:
            kp.interpolation = mode
        fcurve.update()


def build_animations(spec, rack, rocket):
    """
    THD_CONFIGURE_DEMO : le rack passe de sa pose de présentation à une seconde
    pose visuellement distincte. Non calibrée, aucune procédure, aucun angle
    opérationnel documenté.

    THD_DEPARTURE_DEMO : le projectile de démonstration se sépare de son
    conteneur et glisse sur une courte distance le long de son axe local.
    Interpolation LINÉAIRE volontaire : aucune accélération, aucune physique,
    aucune balistique, aucun profil de vol, aucune portée, aucune cible.
    """
    anims = spec["animations"]
    out = {}

    # --- A. Pose de démonstration -----------------------------------------
    cfg = anims["configure_demo"]
    tilt = -spec["launcher"]["rack"]["demo_pose_factor"] * DEMO_POSE_VISUAL_SPAN_RAD
    action = bpy.data.actions.new(cfg["name"])
    _assign_action(rack, action)
    rack.rotation_euler = (0.0, 0.0, 0.0)
    rack.keyframe_insert("rotation_euler", frame=cfg["frame_start"])
    rack.rotation_euler = (tilt, 0.0, 0.0)
    rack.keyframe_insert("rotation_euler", frame=cfg["frame_end"])
    _set_interpolation(action, "BEZIER")  # simple amorti visuel
    _push_to_nla(rack, action, cfg["name"], cfg["frame_start"])
    rack.rotation_euler = (0.0, 0.0, 0.0)  # la scène reste en pose de présentation
    out[cfg["name"]] = action

    # --- B. Séparation illustrative ---------------------------------------
    dep = anims["departure_demo"]
    rest = tuple(rocket.location)
    action = bpy.data.actions.new(dep["name"])
    _assign_action(rocket, action)
    rocket.location = rest
    rocket.keyframe_insert("location", frame=dep["frame_start"])
    rocket.location = (rest[0], rest[1] - dep["travel_local"], rest[2])
    rocket.keyframe_insert("location", frame=dep["frame_end"])
    _set_interpolation(action, "LINEAR")
    _push_to_nla(rocket, action, dep["name"], dep["frame_start"])
    rocket.location = rest  # la scène reste en pose de présentation
    out[dep["name"]] = action

    return out


# ---------------------------------------------------------------------------
# Export GLB
# ---------------------------------------------------------------------------

def export_glb(spec, output_path: Path) -> int:
    kwargs = dict(
        filepath=str(output_path),
        export_format="GLB",
        use_selection=False,
        # Sans ceci l'exporteur balaie TOUTES les scenes du fichier .blend et
        # embarque le contenu de la scene par defaut (le cube de demarrage).
        use_active_scene=True,
        export_shared_accessors=True,
        export_yup=True,
        export_apply=False,
        export_materials="EXPORT",
        export_image_format="NONE",
        export_cameras=False,
        export_lights=False,
        export_extras=False,
        export_animations=True,
        export_animation_mode="NLA_TRACKS",
        export_bake_animation=False,
        # Cale chaque clip sur t=0 (sinon la frame 1 tombe a 1/fps seconde).
        export_anim_slide_to_zero=True,
        # Sans cette optimisation l'exporteur echantillonne chaque frame et
        # ecrit AUSSI les canaux constants (par ex. la rotation et l'echelle du
        # projectile, qui ne bougent pas). Ces canaux constants ecraseraient
        # toute transformation appliquee par le code Three.js pendant la lecture
        # du clip : on ne garde donc que les canaux reellement animes.
        export_optimize_animation_size=True,
        export_optimize_animation_keep_anim_object=True,
    )
    if spec["export"].get("draco"):
        kwargs["export_draco_mesh_compression_enable"] = True
        kwargs["export_draco_mesh_compression_level"] = 6

    bpy.ops.export_scene.gltf(**kwargs)
    size = output_path.stat().st_size
    budget = spec["export"].get("size_budget_kb", 0) * 1024
    print("[thundart] Exported: %s (%.1f KB)" % (output_path, size / 1024.0))
    if budget and size > budget:
        print("[thundart] WARNING: depasse le budget de %d KB" % (budget // 1024))
    return size


# ---------------------------------------------------------------------------
# Entrée principale
# ---------------------------------------------------------------------------

def build_thundart(slug: str = "thundart") -> dict:
    spec = load_spec(slug)
    checks = validate_spec(spec)
    scene = prepare_scene()
    scene.render.fps = spec["animations"]["fps"]
    scene.frame_start = 1
    scene.frame_end = max(spec["animations"]["configure_demo"]["frame_end"],
                          spec["animations"]["departure_demo"]["frame_end"])
    mats = ensure_materials(spec)

    root = new_empty(scene, "THD_Root")
    vehicle = new_empty(scene, "THD_Vehicle", root)
    axles = new_empty(scene, "THD_Axles", vehicle)

    build_cab(scene, spec, mats, vehicle)
    build_chassis(scene, spec, mats, vehicle)
    build_wheels(scene, spec, mats, axles)

    base = build_launcher_base(scene, spec, mats, root)
    rack = build_launcher_rack(scene, spec, mats, base)
    build_canisters(scene, spec, mats, rack)
    rocket = build_rocket_demo(scene, spec, mats, rack)

    actions = build_animations(spec, rack, rocket)

    bpy.context.view_layer.update()
    out_path = get_output_path(spec)
    size = export_glb(spec, out_path)

    mesh_objects = [o for o in scene.objects if o.type == "MESH"]
    unique = {o.data.name: o.data for o in mesh_objects}

    def tris_of(data):
        return sum(max(1, len(p.vertices) - 2) for p in data.polygons)

    return {
        "slug": slug,
        "scene": scene.name,
        "clearance_checks_passed": checks,
        "objects": [o.name for o in scene.objects],
        "mesh_object_count": len(mesh_objects),
        "unique_mesh_count": len(unique),
        "empty_count": len([o for o in scene.objects if o.type == "EMPTY"]),
        # « unique » = ce qui pèse réellement dans le GLB (meshes mutualisées).
        # « instanced » = ce que la scène affiche une fois les noeuds instanciés.
        "vertices_unique": sum(len(d.vertices) for d in unique.values()),
        "vertices_instanced": sum(len(o.data.vertices) for o in mesh_objects),
        "triangles_unique": sum(tris_of(d) for d in unique.values()),
        "triangles_instanced": sum(tris_of(o.data) for o in mesh_objects),
        "polygons_unique": sum(len(d.polygons) for d in unique.values()),
        "materials": sorted({m.name for d in unique.values() for m in d.materials if m}),
        "animations": sorted(actions.keys()),
        "output": str(out_path),
        "size_bytes": size,
        "size_kb": round(size / 1024.0, 2),
    }


if __name__ == "__main__":
    argv = sys.argv
    requested = "thundart"
    if "--" in argv:
        rest = argv[argv.index("--") + 1:]
        for i, arg in enumerate(rest):
            if arg == "--spec" and i + 1 < len(rest):
                requested = rest[i + 1]
    print(json.dumps(build_thundart(requested), indent=2))
