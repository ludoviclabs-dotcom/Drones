"""
battery.py — éléments de batterie hors lanceur, à niveau de détail moyen :
poste de conduite de tir (ECS), centrale électrique (EPP III), groupe mât
d'antennes (AMG). Formes extérieures seulement, d'après photographies
publiques et gabarits publiés ; aucun équipement intérieur n'est modélisé.
"""

import math

from .core import MeshBuilder, new_empty, new_object
from .fmtv import build_fmtv
from .hemtt import build_hemtt

PAINT = "PAT_MAT_Paint"
DARK = "PAT_MAT_PaintDark"
BLACK = "PAT_MAT_Black"
METAL = "PAT_MAT_Metal"


def _span(a, b):
    return (min(a, b), max(a, b))


def build_ecs_shelter_mesh(mats, s):
    mb = MeshBuilder("PAT_ECS_Shelter")
    hw = s["half_width"]
    y0, y1, h = s["y0"], s["y1"], s["height"]
    mb.box(-hw, hw, y0, y1, 0.0, h, PAINT, bevel=0.035)
    for sx in (-1.0, 1.0):
        for yy in (y0, y1):
            mb.box(sx * hw - 0.06, sx * hw + 0.06, yy - 0.06, yy + 0.06, h - 0.08, h + 0.04,
                   DARK, bevel=0.01)
    # groupe de climatisation en façade (côté cabine)
    mb.box(-0.8, 0.8, y1, y1 + 0.42, h * 0.3, h * 0.92, PAINT, bevel=0.02)
    for k in range(9):
        z = h * 0.34 + k * 0.1
        mb.box(-0.72, 0.72, y1 + 0.41, y1 + 0.44, z - 0.02, z + 0.02, DARK)
    # porte arrière, échelle, panneaux latéraux, connecteurs
    mb.box(-0.45, 0.45, y0 - 0.012, y0, 0.1, h - 0.2, DARK)
    mb.box(0.3, 0.38, y0 - 0.05, y0 - 0.012, h * 0.45, h * 0.55, METAL)
    for k in range(4):
        z = -0.2 - k * 0.28
        mb.box(-0.35, 0.35, y0 - 0.35, y0 - 0.2, z - 0.02, z + 0.02, METAL)
    for x in (-0.37, 0.37):
        mb.beam((x, y0 - 0.02, 0.0), (x, y0 - 0.4, -1.15), 0.04, 0.04, DARK)
    for side in (-1.0, 1.0):
        n = 5
        for k in range(1, n):
            y = y0 + (y1 - y0) * k / n
            xa, xb = _span(side * hw, side * (hw + 0.01))
            mb.box(xa, xb, y - 0.012, y + 0.012, 0.05, h - 0.08, DARK)
        for k in range(6):
            z = h - 0.6 + k * 0.07
            xa, xb = _span(side * hw, side * (hw + 0.025))
            mb.box(xa, xb, y0 + 0.5, y0 + 1.5, z - 0.015, z + 0.015, DARK)
    mb.box(hw, hw + 0.03, y1 - 1.8, y1 - 0.8, 0.4, 1.2, DARK)
    for k in range(5):
        y = y1 - 1.7 + k * 0.2
        mb.cyl((hw + 0.03, y, 0.8), (hw + 0.08, y, 0.8), 0.04, METAL, 10)
    # antennes fouets sur le toit
    for x, y in ((-0.8, y0 + 0.4), (0.8, y0 + 0.4)):
        mb.cyl((x, y, h), (x, y, h + 0.12), 0.06, DARK, 10)
        mb.cyl((x, y, h + 0.12), (x, y, h + 2.4), 0.012, BLACK, 6, r1=0.006)
    return mb.finish(mats)


def build_genset_mesh(mats, g):
    """Groupe électrogène 150 kW sous capot (EPP III), d'après photographies."""
    mb = MeshBuilder("PAT_EPP_Genset")
    L, hw, h = g["length"], g["half_width"], g["height"]
    mb.box(-hw, hw, -L / 2, L / 2, 0.08, h, PAINT, bevel=0.03)
    mb.box(-hw + 0.06, hw - 0.06, -L / 2 + 0.06, L / 2 - 0.06, 0.0, 0.08, DARK)
    for side in (-1.0, 1.0):
        xa, xb = _span(side * hw, side * (hw + 0.012))
        for d0, d1 in ((-L / 2 + 0.12, -0.04), (0.04, L / 2 - 0.12)):
            mb.box(xa, xb, d0, d1, 0.2, h - 0.15, PAINT, bevel=0.006)
        for k in range(8):
            z = 0.35 + k * 0.1
            xg0, xg1 = _span(side * hw, side * (hw + 0.03))
            mb.box(xg0, xg1, -L / 2 + 0.25, -0.2, z - 0.02, z + 0.02, DARK)
    # radiateur en bout, échappement vertical à chapeau
    mb.box(-hw + 0.2, hw - 0.2, L / 2, L / 2 + 0.03, 0.25, h - 0.2, BLACK)
    for k in range(8):
        z = 0.3 + k * 0.14
        mb.box(-hw + 0.22, hw - 0.22, L / 2 + 0.02, L / 2 + 0.05, z - 0.02, z + 0.02, DARK)
    mb.cyl((-hw + 0.3, -L / 2 + 0.4, h), (-hw + 0.3, -L / 2 + 0.4, h + 0.75), 0.07, METAL, 12)
    mb.wedge(-hw + 0.21, -hw + 0.39, -L / 2 + 0.31, -L / 2 + 0.49, h + 0.75, h + 0.8,
             h + 0.86, DARK)
    mb.box(-0.4, 0.4, -0.3, 0.3, h, h + 0.06, DARK)
    return mb.finish(mats)


def build_amg_meshes(mats, a):
    """Mât télescopique (sections empilées) et tête d'antennes (2 paires)."""
    mb = MeshBuilder("PAT_AMG_Mast")
    height = a["mast_height"]
    n = a["sections"]
    seg = height / n
    for k in range(n):
        r = 0.16 - k * 0.022
        z0 = k * seg - (0.3 if k else 0.0)
        mb.cyl((0.0, 0.0, z0), (0.0, 0.0, (k + 1) * seg), r, PAINT, 14)
        mb.cyl((0.0, 0.0, (k + 1) * seg - 0.08), (0.0, 0.0, (k + 1) * seg), r + 0.025, DARK, 14)
    # embase et vérin de relevage
    mb.box(-0.4, 0.4, -0.4, 0.4, -0.2, 0.25, DARK, bevel=0.02)
    mb.cyl((0.0, 0.5, -0.2), (0.0, 0.12, 2.2), 0.08, PAINT, 12)
    # tête : croisillon et 4 antennes log-périodiques (2 paires)
    top = height
    mb.cyl((0.0, 0.0, top), (0.0, 0.0, top + 0.5), 0.06, DARK, 10)
    for side in (-1.0, 1.0):
        arm = (side * 1.1, 0.0, top + 0.45)
        mb.beam((0.0, 0.0, top + 0.45), arm, 0.06, 0.06, DARK)
        for dz in (-0.35, 0.35):
            base = (side * 1.1, 0.0, top + 0.45 + dz)
            mb.beam(base, (side * 1.1, 1.6, top + 0.45 + dz), 0.04, 0.04, METAL)
            for k in range(7):
                y = 0.15 + k * 0.22
                half = 0.55 - k * 0.06
                mb.beam((side * 1.1 - half, y, top + 0.45 + dz),
                        (side * 1.1 + half, y, top + 0.45 + dz), 0.016, 0.016, METAL)
        mb.beam((side * 1.1, 0.0, top + 0.1), (side * 1.1, 0.0, top + 0.8), 0.05, 0.05, DARK)
    mesh = mb.finish(mats)
    box = MeshBuilder("PAT_AMG_Equipment")
    box.box(-1.1, 1.1, 0.4, 2.8, 0.0, 1.45, PAINT, bevel=0.03)
    for k in range(6):
        z = 0.4 + k * 0.12
        box.box(1.1, 1.13, 0.8, 2.2, z - 0.02, z + 0.02, DARK)
    box.box(-0.9, 0.9, 0.5, 2.7, 1.45, 1.5, DARK)
    for k in range(3):
        x = -0.6 + k * 0.6
        box.cyl((x, 0.2, 0.35), (x + 0.001, 0.2, 0.36), 0.32, DARK, 16)
    return mesh, box.finish(mats)


def build_ecs(scene, spec, mats, name, parent, location, rotation, cache):
    root, _ = build_fmtv(scene, spec, mats, name, parent, location, rotation, cache)
    if "ecs_shelter" not in cache:
        cache["ecs_shelter"] = build_ecs_shelter_mesh(mats, spec["ecs"]["shelter"])
    shelter = new_object(scene, name + "_Shelter", cache["ecs_shelter"], root,
                         (0.0, 0.0, spec["fmtv"]["bed"]["z"]))
    return root, shelter


def build_amg(scene, spec, mats, name, parent, location, rotation, cache):
    root, _ = build_fmtv(scene, spec, mats, name, parent, location, rotation, cache)
    if "amg_mast" not in cache:
        cache["amg_mast"], cache["amg_box"] = build_amg_meshes(mats, spec["amg"])
    bed = spec["fmtv"]["bed"]
    equipment = new_object(scene, name + "_Equipment", cache["amg_box"], root,
                           (0.0, 0.0, bed["z"]))
    mast = new_object(scene, name + "_Mast", cache["amg_mast"], root,
                      (0.0, bed["y0"] + 0.55, bed["z"] + 0.2))
    return root, mast, equipment


def build_epp(scene, spec, mats, name, parent, location, rotation, cache):
    root, body, wheels, spare, _ = build_hemtt(
        scene, spec, mats, name, parent, location, rotation, variant="cargo",
        wheel_mesh=cache.get("hemtt_wheel"), body_mesh_cache=cache.setdefault("hemtt", {}))
    cache["hemtt_wheel"] = wheels[0].data
    if "genset" not in cache:
        cache["genset"] = build_genset_mesh(mats, spec["epp"]["genset"])
    gensets = []
    for k, y in enumerate(spec["epp"]["positions_y"], start=1):
        gensets.append(new_object(scene, "%s_Genset_%d" % (name, k), cache["genset"], root,
                                  (0.0, y, spec["hemtt"]["frame"]["rail_z1"] + 0.18)))
    return root, gensets
