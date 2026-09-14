"""
radar.py — ensemble radar AN/MPQ-65 sur semi-remorque M860.

Formes extérieures lues sur des photographies publiques (JASDF, US Army) :
abri d'équipements sur le plateau, réseau multifonction à l'avant, dressé en
batterie (angle fixe publié : 67,5°), soufflet de toile entre le dos du réseau
et l'abri, petites antennes auxiliaires sur la même face (IFF, TVM, annuleurs
de lobes secondaires), quatre stabilisateurs.

Aucune caractéristique électromagnétique n'est modélisée : la face du réseau
reçoit seulement, côté Web, une texture illustrative générée localement.

Hiérarchie : PAT_RS (racine) → _Trailer, _Shelter, _Array (pivot charnière),
_Wheel_*, _Outrigger_* / _Foot.
"""

import math

from mathutils import Matrix, Vector

from .core import MeshBuilder, Rx, chamfered_rect, new_empty, new_object
from .launcher import build_outrigger, build_trailer_frame, trailer_wheel
from .wheels import wheel_rotation

PAINT = "PAT_MAT_Paint"
DARK = "PAT_MAT_PaintDark"
BLACK = "PAT_MAT_Black"
METAL = "PAT_MAT_Metal"
CANVAS = "PAT_MAT_Canvas"
FACE = "PAT_MAT_ArrayFace"
PANEL = "PAT_MAT_ArrayPanel"
AMBER = "PAT_MAT_LampAmber"


def _span(a, b):
    return (min(a, b), max(a, b))


def build_shelter_mesh(mats, s, name="PAT_RS_Shelter"):
    mb = MeshBuilder(name)
    hw = s["half_width"]
    y0, y1 = s["y0"], s["y1"]
    h = s["height"]
    mb.box(-hw, hw, y0, y1, 0.0, h, PAINT, bevel=0.035)
    mb.box(-hw - 0.03, hw + 0.03, y0 - 0.03, y1 + 0.03, h - 0.06, h + 0.02, PAINT,
           bevel=0.012)
    # joints verticaux des panneaux et ferrures d'angle
    n = int((y1 - y0) / 1.1)
    for k in range(1, n + 1):
        y = y0 + (y1 - y0) * k / (n + 1)
        for side in (-1.0, 1.0):
            xa, xb = _span(side * hw, side * (hw + 0.01))
            mb.box(xa, xb, y - 0.012, y + 0.012, 0.05, h - 0.08, DARK)
    for sx in (-1.0, 1.0):
        for yy in (y0, y1):
            mb.box(sx * hw - 0.07, sx * hw + 0.07, yy - 0.07, yy + 0.07, h - 0.1, h + 0.05,
                   DARK, bevel=0.01)
    # porte arrière double, charnières, poignées, marchepied
    mb.box(-0.72, 0.72, y0 - 0.012, y0, 0.1, h - 0.28, DARK)
    for x in (-0.7, 0.0, 0.7):
        mb.box(x - 0.012, x + 0.012, y0 - 0.02, y0 - 0.012, 0.12, h - 0.3, BLACK)
    for x in (-0.12, 0.12):
        mb.box(x - 0.03, x + 0.03, y0 - 0.05, y0 - 0.012, h * 0.5 - 0.12, h * 0.5 + 0.12,
               METAL)
    for k in range(3):
        z = -0.25 - k * 0.3
        mb.box(-0.4, 0.4, y0 - 0.45 + k * 0.1, y0 - 0.2 + k * 0.1, z - 0.02, z + 0.02, METAL)
    for x in (-0.42, 0.42):
        mb.beam((x, y0 - 0.02, 0.0), (x, y0 - 0.5, -1.05), 0.04, 0.04, DARK)
    # groupes de climatisation (côté droit) : caissons à grilles
    for yy in (y0 + 1.2, y0 + 3.6):
        mb.box(hw, hw + 0.32, yy - 0.55, yy + 0.55, h * 0.45, h * 0.9, PAINT, bevel=0.02)
        for k in range(8):
            z = h * 0.48 + k * 0.1
            mb.box(hw + 0.31, hw + 0.34, yy - 0.48, yy + 0.48, z - 0.02, z + 0.02, DARK)
    # panneau de connecteurs (côté gauche) et lamelles
    mb.box(-hw - 0.03, -hw, y1 - 1.6, y1 - 0.5, 0.35, 1.2, DARK)
    for k in range(6):
        y = y1 - 1.5 + k * 0.18
        mb.cyl((-hw - 0.03, y, 0.8), (-hw - 0.08, y, 0.8), 0.04, METAL, 10)
    for k in range(7):
        z = h - 0.7 + k * 0.07
        mb.box(-hw - 0.025, -hw, y0 + 0.4, y0 + 1.6, z - 0.015, z + 0.015, DARK)
    # toit : passerelle, garde-corps, anneaux de levage
    mb.box(-0.35, 0.35, y0 + 0.3, y1 - 0.3, h + 0.02, h + 0.05, DARK)
    for side in (-1.0, 1.0):
        x = side * (hw - 0.1)
        for k in range(5):
            y = y0 + 0.4 + (y1 - y0 - 0.8) * k / 4
            mb.cyl((x, y, h), (x, y, h + 0.55), 0.02, METAL, 8)
        mb.tube([(x, y0 + 0.4, h + 0.55), (x, y1 - 0.4, h + 0.55)], 0.022, METAL, 8)
    return mb.finish(mats)


def build_array_mesh(mats, a, name="PAT_RS_Array"):
    """
    Réseau : repère local, pivot sur l'arête basse (charnière), face en y = 0
    tournée vers +Y, +Z le long de la face (bas vers haut).
    """
    mb = MeshBuilder(name)
    hw = a["half_width"]
    L = a["length"]
    t = a["thickness"]
    c = a["chamfer"]
    outline = [(-hw, 0.0), (hw, 0.0), (hw, L - c), (hw - c, L), (-hw + c, L), (-hw, L - c)]
    mb.prism(outline, "Y", -t, 0.0, PANEL, bevel=0.02)
    # bordure en relief et raidisseurs arrière
    inset = [(x * 0.985, z * 0.99 + 0.02) for x, z in outline]
    mb.prism(inset, "Y", 0.0, 0.012, PANEL)
    for k in range(4):
        z = 0.4 + (L - 0.9) * k / 3
        mb.box(-hw + 0.1, hw - 0.1, -t - 0.08, -t, z - 0.06, z + 0.06, DARK)
    for x in (-hw * 0.6, 0.0, hw * 0.6):
        mb.box(x - 0.06, x + 0.06, -t - 0.08, -t, 0.1, L - 0.2, DARK)

    # ouverture principale : disque texturé (UV planaires) dans un anneau
    cz = a["main_center"]
    r = a["main_radius"]
    mb.ring((0.0, 0.004, cz), (0.0, 1.0, 0.0), r - 0.02, r + 0.06, 0.03, DARK, 64)
    disc = mb.lathe([(0.012, 0.0), (0.012, r)], FACE, 64, (0.0, 0.0, cz), (0.0, 1.0, 0.0),
                    cap0=False, cap1=False)
    mb.planar_uv(disc, (-r, 0.0, cz - r), (1.0, 0.0, 0.0), (0.0, 0.0, 1.0), 2 * r, 2 * r)

    # bandeau IFF : rangée d'éléments rectangulaires en relief
    iz = a["iff_z"]
    mb.box(-hw * 0.82, hw * 0.82, 0.0, 0.05, iz - 0.2, iz + 0.2, DARK, bevel=0.01)
    n = 12
    for k in range(n):
        x = -hw * 0.78 + (2 * hw * 0.78) * (k + 0.5) / n
        mb.box(x - 0.08, x + 0.08, 0.05, 0.09, iz - 0.17, iz + 0.17, PANEL, bevel=0.006)
    # panneaux inférieurs (annuleurs), antenne TVM circulaire, petits disques
    lz = a["lower_z"]
    for k in range(4):
        x = -hw * 0.62 + k * 0.34
        mb.box(x - 0.14, x + 0.14, 0.0, 0.05, lz - 0.24, lz + 0.24, PANEL, bevel=0.01)
    tvm = mb.lathe([(0.03, 0.0), (0.03, a["tvm_radius"])], FACE, 32,
                   (hw * 0.55, 0.0, lz + 0.04), (0.0, 1.0, 0.0), cap0=False, cap1=False)
    mb.planar_uv(tvm, (hw * 0.55 - a["tvm_radius"], 0.0, lz + 0.04 - a["tvm_radius"]),
                 (1.0, 0.0, 0.0), (0.0, 0.0, 1.0), 2 * a["tvm_radius"], 2 * a["tvm_radius"])
    mb.ring((hw * 0.55, 0.0, lz + 0.04), (0.0, 1.0, 0.0), a["tvm_radius"] - 0.01,
            a["tvm_radius"] + 0.04, 0.04, DARK, 32)
    for k in range(3):
        x = -hw * 0.55 + k * 0.3
        mb.cyl((x, 0.0, 0.2), (x, 0.045, 0.2), 0.1, PANEL, 20)
    for x in (hw * 0.12, hw * 0.34):
        mb.box(x - 0.1, x + 0.1, 0.0, 0.045, 0.1, 0.3, PANEL, bevel=0.008)
    # charnières basses
    for x in (-hw * 0.7, hw * 0.7):
        mb.cyl((x - 0.12, -t * 0.5, 0.0), (x + 0.12, -t * 0.5, 0.0), 0.09, METAL, 14)
    return mb.finish(mats)


def build_radar_set(scene, spec, mats, name, parent, location, rotation, cache):
    t = spec["trailer"]
    r = spec["radar"]
    root = new_empty(scene, name, parent, location, rotation)
    made = {"root": root}
    if "radar_trailer" not in cache:
        mb = MeshBuilder("PAT_Trailer_M860_Radar")
        build_trailer_frame(mb, t, "radar")
        # pied du réseau sur le col de cygne, vérins de dressage fixes
        g = t["gooseneck"]
        hy, hz = r["array_hinge"]
        a = r["array"]
        for side in (-1.0, 1.0):
            x = side * a["half_width"] * 0.7
            mb.box(x - 0.14, x + 0.14, hy - 0.4, hy + 0.25, g["z_top"], hz + 0.05, DARK,
                   bevel=0.015)
        # soufflet de toile entre le dos du réseau et la face avant de l'abri
        tilt = math.radians(90.0 - r["array_elevation_deg"])
        up = Vector((0.0, -math.sin(tilt), math.cos(tilt)))
        back = Vector((0.0, -math.cos(tilt), -math.sin(tilt)))
        hinge = Vector((0.0, hy, hz))
        p_low = hinge + back * a["thickness"] + up * 0.3
        p_high = hinge + back * a["thickness"] + up * (a["length"] * 0.72)
        s = r["shelter"]
        poly = [(p_low.y, p_low.z), (s["y1"], t["deck_z"] + 0.4),
                (s["y1"], t["deck_z"] + s["height"] - 0.1), (p_high.y, p_high.z)]
        mb.prism(poly, "X", -a["half_width"] * 0.82, a["half_width"] * 0.82, CANVAS)
        cache["radar_trailer"] = mb.finish(mats)
        cache["radar_shelter"] = build_shelter_mesh(mats, r["shelter"])
        cache["radar_array"] = build_array_mesh(mats, r["array"])
    made["trailer"] = new_object(scene, name + "_Trailer", cache["radar_trailer"], root)
    made["shelter"] = new_object(scene, name + "_Shelter", cache["radar_shelter"], root,
                                 (0.0, 0.0, t["deck_z"]))
    hy, hz = r["array_hinge"]
    made["array"] = new_object(scene, name + "_Array", cache["radar_array"], root,
                               (0.0, hy, hz),
                               (math.radians(90.0 - r["array_elevation_deg"]), 0.0, 0.0))

    wheel = trailer_wheel(cache, mats, t, "low")
    for index, ay in enumerate(t["axles_y"], start=1):
        for side_key, side in (("L", -1.0), ("R", 1.0)):
            new_object(scene, "%s_Wheel_%d%s" % (name, index, side_key), wheel, root,
                       (side * t["track_half"], ay, t["tire_radius"]), wheel_rotation(side))
    arm_cache = cache.setdefault("outrigger", {})
    for key, cfg in t["outriggers"].items():
        arm, foot = build_outrigger(scene, mats, "%s_Outrigger_%s" % (name, key), root,
                                    tuple(cfg["hinge"]), math.radians(cfg["deployed_yaw_deg"]),
                                    t["outrigger_arm_len"], t["outrigger_foot_drop"], arm_cache)
        foot.location.z -= t["outrigger_foot_drop"]
    return made
