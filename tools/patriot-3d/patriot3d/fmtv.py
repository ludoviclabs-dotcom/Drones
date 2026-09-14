"""
fmtv.py — camion 5 t 6x6 à cabine avancée (famille FMTV), porteur de l'ECS et
du mât d'antennes. Silhouette extérieure simplifiée d'après photographies
publiques ; aucune cote constructeur n'est revendiquée.

Repère local : origine au sol au milieu du tandem arrière, +Y vers l'avant.
"""

from .core import MeshBuilder, new_empty, new_object
from .hemtt import plane_frame
from .wheels import build_wheel_mesh, wheel_rotation

PAINT = "PAT_MAT_Paint"
DARK = "PAT_MAT_PaintDark"
BLACK = "PAT_MAT_Black"
METAL = "PAT_MAT_Metal"
GLASS = "PAT_MAT_Glass"
AMBER = "PAT_MAT_LampAmber"
RED = "PAT_MAT_LampRed"
WHITE = "PAT_MAT_LampWhite"
RUBBER = "PAT_MAT_Rubber"


def _span(a, b):
    return (min(a, b), max(a, b))


def build_fmtv_body(mb, f):
    c = f["cab"]
    fr = f["frame"]
    r = f["tire_radius"]
    hw = c["half_width"]
    fy, by = c["front_y"], c["back_y"]
    fz, rz = c["floor_z"], c["roof_z"]

    # cabine avancée : face presque verticale, léger fruit du pare-brise
    belt = fz + 0.78
    profile = [(by, fz), (fy - 0.04, fz), (fy, belt), (fy - 0.12, rz - 0.06),
               (fy - 0.2, rz), (by + 0.04, rz), (by, rz - 0.04)]
    mb.prism(profile, "X", -hw, hw, PAINT, bevel=0.035)
    frame, length = plane_frame((0.0, fy, belt), (0.0, fy - 0.12, rz - 0.06))
    with mb.at(frame):
        for side in (-1.0, 1.0):
            x0, x1 = _span(side * 0.05, side * (hw - 0.1))
            mb.box(x0, x1, 0.004, 0.016, 0.1, length - 0.1, GLASS)
        mb.box(-0.045, 0.045, 0.0, 0.025, 0.05, length - 0.05, DARK)
    # calandre (grille noire à barreaux) et phares dans le pare-chocs
    frame, length = plane_frame((0.0, fy - 0.04, fz), (0.0, fy, belt))
    with mb.at(frame):
        mb.box(-hw + 0.25, hw - 0.25, 0.0, 0.02, 0.12, length - 0.08, BLACK)
        for k in range(7):
            z = 0.16 + k * 0.08
            mb.box(-hw + 0.28, hw - 0.28, 0.02, 0.035, z - 0.012, z + 0.012, DARK)
    for side in (-1.0, 1.0):
        xa, xb = _span(side * (hw + 0.004), side * (hw - 0.01))
        mb.box(xa, xb, fy - 1.3, fy - 0.35, belt + 0.06, rz - 0.18, GLASS)
        xh0, xh1 = _span(side * hw, side * (hw + 0.03))
        mb.box(xh0, xh1, fy - 1.2, fy - 1.05, belt - 0.12, belt - 0.08, METAL)
        # ailes avant évasées au-dessus de la roue
        wy = f["axles_y"][0]
        xw0, xw1 = _span(side * (hw - 0.3), side * (hw + 0.05))
        mb.box(xw0, xw1, wy - 0.72, wy + 0.72, r + 0.62, r + 0.68, PAINT, bevel=0.015)
        for yy in (wy - 0.72, wy + 0.72):
            mb.box(xw0, xw1, yy - 0.03, yy + 0.03, r + 0.3, r + 0.68, PAINT)
        # rétroviseurs
        mb.beam((side * (hw - 0.02), fy - 0.3, belt + 0.1),
                (side * (hw + 0.3), fy - 0.15, belt + 0.3), 0.03, 0.03, DARK)
        xm0, xm1 = _span(side * (hw + 0.24), side * (hw + 0.38))
        mb.box(xm0, xm1, fy - 0.22, fy - 0.1, belt + 0.2, belt + 0.62, BLACK)
        # marchepieds
        for k, z in enumerate((fz - 0.35, fz - 0.7)):
            xs0, xs1 = _span(side * (hw - 0.02), side * (hw - 0.3))
            mb.box(xs0, xs1, fy - 1.6, fy - 1.3, z - 0.02, z + 0.02, METAL)
    # pare-chocs, phares, clignotants
    mb.box(-hw, hw, fy - 0.1, fy + 0.12, 0.72, 1.02, DARK, bevel=0.02)
    for side in (-1.0, 1.0):
        x = side * (hw - 0.3)
        mb.cyl((x, fy + 0.12, 0.87), (x, fy + 0.15, 0.87), 0.09, WHITE, 16)
        mb.box(x - side * 0.2 - 0.05, x - side * 0.2 + 0.05, fy + 0.12, fy + 0.14, 0.82,
               0.92, AMBER)
    # toit : trappe, feux
    mb.cyl((0.35, by + 0.7, rz), (0.35, by + 0.7, rz + 0.05), 0.3, DARK, 16)
    for x in (-0.3, 0.0, 0.3):
        mb.box(x - 0.05, x + 0.05, fy - 0.3, fy - 0.22, rz, rz + 0.04, AMBER)

    # châssis, ponts, réservoir, échappement vertical derrière la cabine
    for side in (-1.0, 1.0):
        x = side * fr["rail_half"]
        mb.box(x - 0.05, x + 0.05, fr["rear_y"], fr["front_y"], fr["rail_z0"], fr["rail_z1"],
               DARK, bevel=0.006)
    for ay in f["axles_y"]:
        mb.cyl((-0.82, ay, r), (0.82, ay, r), 0.09, DARK, 14)
        mb.lathe([(0.0, 0.09), (0.1, 0.2), (0.3, 0.2), (0.4, 0.09)], DARK, 14,
                 (0.0, ay - 0.2, r), (0.0, 1.0, 0.0))
    for side in (-1.0, 1.0):
        x = side * (fr["rail_half"] + 0.12)
        mb.box(x - 0.05, x + 0.05, f["axles_y"][2] - 0.1, f["axles_y"][1] + 0.1, r + 0.06,
               r + 0.18, DARK)
    mb.cyl((0.0, f["axles_y"][1], r + 0.1), (0.0, f["axles_y"][0] - 0.4, r + 0.18), 0.06,
           METAL, 10)
    mb.cyl((0.95, 1.6, 0.88), (0.95, 2.9, 0.88), 0.26, PAINT, 20)
    mb.box(-1.15, -0.62, 1.6, 2.7, 0.62, 1.1, PAINT, bevel=0.02)
    ex = (-0.95, by - 0.18)
    mb.cyl((ex[0], ex[1], fr["rail_z1"]), (ex[0], ex[1], rz + 0.35), 0.06, METAL, 12)
    mb.cyl((ex[0], ex[1], rz - 0.3), (ex[0], ex[1], rz + 0.2), 0.085, DARK, 12)
    # plateau porteur
    bed = f["bed"]
    mb.box(-1.18, 1.18, bed["y0"], bed["y1"], fr["rail_z1"], bed["z"], DARK, bevel=0.015)
    for side in (-1.0, 1.0):
        xa, xb = _span(side * 1.12, side * 1.2)
        mb.box(xa, xb, bed["y0"], bed["y1"], bed["z"] - 0.22, bed["z"], PAINT)
        # bavettes derrière le tandem
        xm0, xm1 = _span(side * 0.8, side * 1.2)
        mb.box(xm0, xm1, f["axles_y"][2] - 0.7, f["axles_y"][2] - 0.68, 0.3, 1.08, RUBBER)
    mb.box(-1.18, 1.18, bed["y0"] - 0.08, bed["y0"], 0.6, bed["z"], DARK)
    for side in (-1.0, 1.0):
        for k, mat in enumerate((RED, AMBER)):
            x = side * (0.85 + 0.14 * k)
            mb.box(x - 0.05, x + 0.05, bed["y0"] - 0.1, bed["y0"] - 0.08, 0.72, 0.84, mat)


def build_fmtv(scene, spec, mats, name, parent, location, rotation, cache):
    f = spec["fmtv"]
    root = new_empty(scene, name, parent, location, rotation)
    if "fmtv_body" not in cache:
        mb = MeshBuilder("PAT_FMTV_Body")
        build_fmtv_body(mb, f)
        cache["fmtv_body"] = mb.finish(mats)
        cache["fmtv_wheel"] = build_wheel_mesh(mats, "PAT_Wheel_FMTV", f["tire_radius"],
                                               f["tire_half_width"], f["rim_radius"], "lug",
                                               lugs=20, nuts=8, detail="low")
    body = new_object(scene, name + "_Body", cache["fmtv_body"], root)
    for index, ay in enumerate(f["axles_y"], start=1):
        for side_key, side in (("L", -1.0), ("R", 1.0)):
            new_object(scene, "%s_Wheel_%d%s" % (name, index, side_key), cache["fmtv_wheel"],
                       root, (side * f["track_half"], ay, f["tire_radius"]),
                       wheel_rotation(side))
    return root, body
