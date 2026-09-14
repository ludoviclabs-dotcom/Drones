"""
hemtt.py — tracteur HEMTT M983A4 (et variante porteur pour la centrale EPP).

Représentation extérieure simplifiée d'après photographies publiques : cabine
carrée à pare-brise en deux panneaux, compartiment moteur derrière la cabine
avec grande grille de radiateur latérale, quatre essieux, sellette d'attelage.
Aucune cote constructeur n'est revendiquée au-delà des gabarits publics
reportés dans la spec.

Repère local : origine au sol sous le centre de la sellette (pivot d'attelage),
+Y vers l'avant, +X côté droit.
"""

import math

from mathutils import Matrix, Vector

from .core import MeshBuilder, new_empty, new_object
from .wheels import build_wheel_mesh, wheel_rotation

PAINT = "PAT_MAT_Paint"
DARK = "PAT_MAT_PaintDark"
BLACK = "PAT_MAT_Black"
METAL = "PAT_MAT_Metal"
RUBBER = "PAT_MAT_Rubber"
GLASS = "PAT_MAT_Glass"
AMBER = "PAT_MAT_LampAmber"
RED = "PAT_MAT_LampRed"
WHITE = "PAT_MAT_LampWhite"
HOSE_RED = "PAT_MAT_HoseRed"
HOSE_BLUE = "PAT_MAT_HoseBlue"


def plane_frame(p_low, p_high):
    """
    Repère posé sur un pan incliné de la cabine (section dans le plan YZ).
    Local X = X monde, local Z = le long du pan (bas -> haut), local Y = normale
    sortante vers l'avant.
    """
    base = Vector(p_low)
    up = Vector(p_high) - base
    length = up.length
    up.normalize()
    normal = up.cross(Vector((1.0, 0.0, 0.0)))
    frame = Matrix((
        (1.0, 0.0, 0.0, 0.0),
        (0.0, normal.y, up.y, base.y),
        (0.0, normal.z, up.z, base.z),
        (0.0, 0.0, 0.0, 1.0),
    ))
    return frame, length


def _span(a, b):
    return (min(a, b), max(a, b))


def _cab(mb, c):
    """Cabine : profil latéral extrudé sur la largeur, puis vitrages et détails."""
    hw = c["half_width"]
    fy, by = c["front_y"], c["back_y"]
    fz, rz, belt = c["floor_z"], c["roof_z"], c["belt_z"]
    rake = c["windshield_rake"]
    nose_low = (0.0, fy - 0.16, fz)
    nose_high = (0.0, fy, belt - 0.12)
    shield_low = (0.0, fy + 0.02, belt)
    shield_high = (0.0, fy - rake, rz - 0.12)
    # Profil (y, z) dans le sens trigonométrique vu depuis +X.
    profile = [
        (by, fz), (nose_low[1], nose_low[2]), (nose_high[1], nose_high[2]),
        (shield_low[1], shield_low[2]), (shield_high[1], shield_high[2]),
        (fy - rake - 0.12, rz), (by + 0.04, rz), (by, rz - 0.04),
    ]
    mb.prism(profile, "X", -hw, hw, PAINT, bevel=0.035)

    # Pare-brise : deux panneaux dans le plan incliné, montant central peint.
    frame, length = plane_frame(shield_low, shield_high)
    with mb.at(frame):
        for side in (-1.0, 1.0):
            x0, x1 = _span(side * 0.06, side * (hw - 0.12))
            mb.box(x0, x1, 0.004, 0.018, 0.08, length - 0.1, GLASS)
        mb.box(-0.055, 0.055, 0.0, 0.03, 0.04, length - 0.05, DARK)
        for side in (-1.0, 1.0):
            mb.beam((side * 0.52, 0.03, 0.1), (side * 0.2, 0.03, 0.6), 0.02, 0.012,
                    BLACK)

    # Face avant basse inclinée : phares ronds encastrés, clignotants, trappe.
    frame, length = plane_frame(nose_low, nose_high)
    with mb.at(frame):
        for side in (-1.0, 1.0):
            cx = side * (hw - 0.26)
            cz = 0.34
            mb.cyl((cx, -0.02, cz), (cx, 0.035, cz), 0.13, DARK, 20)
            mb.cyl((cx, 0.035, cz), (cx, 0.04, cz), 0.1, WHITE, 20)
            ax = cx - side * 0.26
            mb.box(ax - 0.06, ax + 0.06, 0.0, 0.03, cz - 0.05, cz + 0.05, AMBER)
        mb.box(-0.42, 0.42, 0.0, 0.02, 0.08, length - 0.06, DARK, bevel=0.008)
        for k in range(6):
            z = 0.14 + k * 0.065
            mb.box(-0.36, 0.36, 0.02, 0.035, z - 0.012, z + 0.012, BLACK)

    for side in (-1.0, 1.0):
        # Vitres latérales (porte + custode) légèrement en saillie.
        xa, xb = _span(side * (hw + 0.004), side * (hw - 0.01))
        mb.box(xa, xb, fy - 1.22, fy - 0.42, belt + 0.02, rz - 0.2, GLASS)
        mb.box(xa, xb, by + 0.18, fy - 1.36, belt + 0.12, rz - 0.24, GLASS)
        # contour de porte (joints sombres)
        xa2, xb2 = _span(side * (hw + 0.006), side * (hw - 0.002))
        for y in (fy - 1.34, fy - 0.3):
            mb.box(xa2, xb2, y - 0.012, y + 0.012, fz + 0.1, rz - 0.08, DARK)
        mb.box(xa2, xb2, fy - 1.34, fy - 0.3, fz + 0.09, fz + 0.115, DARK)
        # poignée et charnières
        xa3, xb3 = _span(side * hw, side * (hw + 0.035))
        mb.box(xa3, xb3, fy - 1.2, fy - 1.02, belt - 0.12, belt - 0.08, METAL)
        for z in (fz + 0.35, belt + 0.25):
            mb.box(xa3, xb3, fy - 0.34, fy - 0.26, z - 0.05, z + 0.05, DARK)
        # marchepieds devant la roue avant, sous l'angle de cabine
        for k, z in enumerate((fz - 0.4, fz - 0.76)):
            xs0, xs1 = _span(side * (hw - 0.03 - 0.03 * k), side * (hw - 0.34))
            mb.box(xs0, xs1, fy - 0.46, fy - 0.1, z - 0.025, z + 0.025, METAL)
        for y in (fy - 0.47, fy - 0.12):
            xs0, xs1 = _span(side * (hw - 0.03), side * (hw - 0.07))
            mb.box(xs0, xs1, y - 0.03, y + 0.03, fz - 0.8, fz, DARK)
        # rétroviseurs sur bras
        arm0 = (side * (hw - 0.02), fy - 0.25, belt + 0.1)
        arm1 = (side * (hw + 0.34), fy - 0.12, belt + 0.28)
        mb.beam(arm0, arm1, 0.035, 0.035, DARK)
        mb.beam((side * (hw - 0.02), fy - 0.25, rz - 0.3), arm1, 0.03, 0.03, DARK)
        xm0, xm1 = _span(side * (hw + 0.28), side * (hw + 0.44))
        mb.box(xm0, xm1, fy - 0.2, fy - 0.08, belt + 0.18, belt + 0.62, BLACK,
               bevel=0.01)

    # Toit : feux d'encombrement, casquette, embases d'antenne.
    for x in (-0.35, 0.0, 0.35):
        mb.box(x - 0.06, x + 0.06, fy - rake - 0.2, fy - rake - 0.1, rz, rz + 0.05,
               AMBER)
    mb.box(-hw + 0.1, hw - 0.1, by + 0.3, fy - rake - 0.35, rz, rz + 0.05, DARK,
           bevel=0.01)
    for x in (-0.8, 0.8):
        mb.cyl((x, by + 0.4, rz + 0.05), (x, by + 0.4, rz + 0.16), 0.05, DARK, 10)


def _front_end(mb, spec):
    """Pare-chocs, manilles de remorquage et plaque de treuil."""
    b = spec["bumper"]
    hw = spec["cab"]["half_width"]
    mb.box(-hw + 0.02, hw - 0.02, b["front_y"] - 0.24, b["front_y"], b["z0"], b["z1"],
           DARK, bevel=0.02)
    for side in (-1.0, 1.0):
        x = side * 0.62
        mb.tube([(x - 0.07, b["front_y"], b["z0"] + 0.05),
                 (x - 0.07, b["front_y"] + 0.12, b["z0"] - 0.02),
                 (x + 0.07, b["front_y"] + 0.12, b["z0"] - 0.02),
                 (x + 0.07, b["front_y"], b["z0"] + 0.05)], 0.02, METAL, 8)
        xa, xb = _span(side * (hw - 0.05), side * (hw - 0.02))
        mb.box(xa, xb, b["front_y"] - 0.3, b["front_y"], b["z1"], b["z1"] + 0.28, DARK)
    mb.box(-0.3, 0.3, b["front_y"] - 0.02, b["front_y"] + 0.05, b["z0"] + 0.06,
           b["z1"] - 0.05, METAL)


def _chassis(mb, spec, variant):
    f = spec["frame"]
    r = spec["tire_radius"]
    axles = spec["axles_y"]
    rear_y = f["rear_y"] if variant == "tractor" else f.get("cargo_rear_y", -3.1)
    # longerons (caissons) et traverses
    for side in (-1.0, 1.0):
        x = side * f["rail_half"]
        mb.box(x - 0.055, x + 0.055, rear_y, f["front_y"], f["rail_z0"],
               f["rail_z1"], DARK, bevel=0.008)
    y = rear_y + 0.12
    while y < f["front_y"]:
        mb.box(-f["rail_half"], f["rail_half"], y - 0.05, y + 0.05,
               f["rail_z0"] + 0.04, f["rail_z1"] - 0.04, DARK)
        y += 1.05
    # ponts, différentiels, balanciers de suspension
    for ay in axles:
        mb.cyl((-0.86, ay, r), (0.86, ay, r), 0.1, DARK, 14)
        mb.lathe([(0.0, 0.1), (0.1, 0.24), (0.34, 0.24), (0.44, 0.1)], DARK, 16,
                 (0.0, ay - 0.22, r), (0.0, 1.0, 0.0))
    for pair in ((axles[0], axles[1]), (axles[2], axles[3])):
        mid = 0.5 * (pair[0] + pair[1])
        for side in (-1.0, 1.0):
            x = side * (f["rail_half"] + 0.16)
            mb.box(x - 0.06, x + 0.06, pair[1] - 0.1, pair[0] + 0.1, r + 0.08, r + 0.22,
                   DARK, bevel=0.01)
            mb.box(x - 0.08, x + 0.08, mid - 0.18, mid + 0.18, r + 0.2, f["rail_z0"],
                   DARK)
    # arbres de transmission
    mb.cyl((0.0, axles[3], r + 0.12), (0.0, axles[2], r + 0.12), 0.06, METAL, 10)
    mb.cyl((0.0, axles[2], r + 0.12), (0.0, axles[1] - 0.3, r + 0.2), 0.065, METAL, 10)
    mb.cyl((0.0, axles[1], r + 0.12), (0.0, axles[0], r + 0.12), 0.06, METAL, 10)
    # amortisseurs avant
    for ay in axles[:2]:
        for side in (-1.0, 1.0):
            x = side * (f["rail_half"] + 0.08)
            mb.cyl((x, ay + 0.2, r + 0.05), (x, ay + 0.28, f["rail_z1"]), 0.035, BLACK, 8)

    # réservoir de carburant (droite) et coffre batteries (gauche)
    tank_y0, tank_y1 = axles[2] + 0.72, axles[1] - 0.72
    mb.cyl((0.93, tank_y0, 0.92), (0.93, tank_y1, 0.92), 0.29, PAINT, 22)
    for y in (tank_y0 + 0.25, tank_y1 - 0.25):
        mb.ring((0.93, y, 0.92), (0.0, 1.0, 0.0), 0.29, 0.305, 0.05, DARK, 22)
    mb.cyl((0.93, tank_y1 - 0.25, 1.18), (0.93, tank_y1 - 0.25, 1.27), 0.06, METAL, 10)
    mb.box(-1.18, -0.62, tank_y0 + 0.1, tank_y1 - 0.1, 0.62, 1.2, PAINT, bevel=0.02)
    mb.box(-1.19, -1.17, tank_y0 + 0.2, tank_y1 - 0.2, 1.08, 1.12, DARK)
    for y in (tank_y0 + 0.4, tank_y1 - 0.4):
        mb.box(-1.2, -1.17, y - 0.06, y + 0.06, 0.95, 1.05, METAL)
    # réservoirs d'air sous le cadre
    for x in (-0.3, 0.3):
        mb.cyl((x, axles[2] + 0.5, 0.78), (x, axles[2] + 1.4, 0.78), 0.12, DARK, 12)

    if variant == "tractor":
        _tractor_deck(mb, spec)
    else:
        _cargo_bed(mb, spec, rear_y)


def _cargo_bed(mb, spec, rear_y):
    """Plateau de porteur (variante M977 de la centrale électrique)."""
    f = spec["frame"]
    axles = spec["axles_y"]
    y1 = spec["engine"]["back_y"] - 1.42
    mb.box(-1.2, 1.2, rear_y, y1, f["rail_z1"], f["rail_z1"] + 0.16, DARK, bevel=0.015)
    for side in (-1.0, 1.0):
        xa, xb = _span(side * 1.14, side * 1.22)
        mb.box(xa, xb, rear_y, y1, f["rail_z1"] - 0.08, f["rail_z1"] + 0.3, PAINT, bevel=0.01)
        xm0, xm1 = _span(side * 0.8, side * 1.2)
        mb.box(xm0, xm1, axles[3] - 0.86, axles[3] - 0.84, 0.28, 1.0, RUBBER)
    mb.box(-1.22, 1.22, y1 - 0.08, y1, f["rail_z1"], f["rail_z1"] + 0.9, PAINT, bevel=0.01)
    mb.box(-1.15, 1.15, rear_y - 0.08, rear_y + 0.02, f["rail_z0"] - 0.05, f["rail_z1"],
           DARK, bevel=0.01)
    for side in (-1.0, 1.0):
        for k, mat in enumerate((RED, AMBER)):
            x = side * (0.85 + 0.14 * k)
            mb.box(x - 0.045, x + 0.045, rear_y - 0.1, rear_y - 0.08, f["rail_z0"] + 0.06,
                   f["rail_z0"] + 0.16, mat)


def _tractor_deck(mb, spec):
    f = spec["frame"]
    fw = spec["fifth_wheel"]
    axles = spec["axles_y"]
    # plateau arrière et ailes au-dessus du tandem
    mb.box(-1.0, 1.0, f["rear_y"], spec["engine"]["back_y"] - 0.3, f["rail_z1"],
           f["rail_z1"] + 0.06, DARK, bevel=0.01)
    for side in (-1.0, 1.0):
        x0, x1 = _span(side * 0.9, side * 1.24)
        mb.box(x0, x1, axles[3] - 0.75, axles[2] + 0.75, 1.36, 1.4, PAINT, bevel=0.01)
        mb.box(x0, x1, axles[3] - 0.77, axles[3] - 0.73, 1.0, 1.4, PAINT)
        xb0, xb1 = _span(side * 0.75, side * 1.2)
        mb.box(xb0, xb1, axles[3] - 0.86, axles[3] - 0.84, 0.28, 1.0, RUBBER)
    # sellette : plateau circulaire, rampes d'engagement, fente
    z0 = fw["z"] - 0.14
    mb.lathe([(0.0, fw["radius"] * 0.3), (0.0, fw["radius"]), (0.11, fw["radius"]),
              (0.14, fw["radius"] * 0.96), (0.14, 0.0)], METAL, 28,
             (0.0, fw["y"], z0), (0.0, 0.0, 1.0), cap0=True, cap1=False)
    mb.box(-0.09, 0.09, fw["y"] - fw["radius"] - 0.02, fw["y"] - 0.05, fw["z"] - 0.005,
           fw["z"] + 0.004, BLACK)
    for side in (-1.0, 1.0):
        mb.wedge(side * 0.18 - 0.08, side * 0.18 + 0.08, fw["y"] - fw["radius"] - 0.25,
                 fw["y"] - fw["radius"] + 0.05, fw["z"] - 0.2, fw["z"] - 0.02,
                 fw["z"] - 0.14, METAL)
        mb.box(side * 0.5 - 0.1, side * 0.5 + 0.1, fw["y"] - 0.3, fw["y"] + 0.3,
               f["rail_z1"], z0, DARK)
    # traverse arrière et feux
    mb.box(-1.15, 1.15, f["rear_y"] - 0.08, f["rear_y"] + 0.04, f["rail_z0"] - 0.05,
           f["rail_z1"], DARK, bevel=0.01)
    for side in (-1.0, 1.0):
        for k, mat in enumerate((RED, AMBER, RED)):
            x = side * (0.82 + 0.12 * k)
            mb.box(x - 0.045, x + 0.045, f["rear_y"] - 0.1, f["rear_y"] - 0.08,
                   f["rail_z0"] + 0.06, f["rail_z0"] + 0.16, mat)
    # potence et flexibles spiralés (air service/secours, électricité)
    stand_y = spec["engine"]["back_y"] - 0.12
    mb.box(-0.95, 0.12, stand_y - 0.05, stand_y + 0.05, f["rail_z1"], 2.3, DARK)
    for mat, x in ((HOSE_RED, -0.7), (HOSE_BLUE, -0.45), (BLACK, -0.2)):
        pts = []
        turns = 9
        for i in range(turns * 10 + 1):
            t = i / (turns * 10.0)
            a = 2 * math.pi * turns * t
            pts.append((x + 0.07 * math.cos(a), stand_y - 0.1 - 1.4 * t,
                        2.1 - 0.35 * t + 0.07 * math.sin(a)))
        mb.tube(pts, 0.013, mat, segments=6)


def _engine_bay(mb, spec):
    """Compartiment moteur derrière la cabine, grille de radiateur, échappement."""
    e = spec["engine"]
    c = spec["cab"]
    f = spec["frame"]
    y0, y1 = e["back_y"], c["back_y"] - 0.02
    top = e["top_z"]
    mb.box(-1.0, 1.08, y0, y1, f["rail_z1"], top, PAINT, bevel=0.03)
    # grille de radiateur latérale (côté droit), à lamelles
    gx = 1.08
    mb.box(gx, gx + 0.03, y0 + 0.12, y1 - 0.12, f["rail_z1"] + 0.12, top - 0.1, DARK)
    n = 14
    for i in range(n):
        z = f["rail_z1"] + 0.2 + (top - f["rail_z1"] - 0.38) * i / (n - 1)
        mb.box(gx + 0.02, gx + 0.06, y0 + 0.16, y1 - 0.16, z - 0.018, z + 0.018, PAINT)
    # capot supérieur : prise d'air et trappes
    mb.box(-0.6, 0.7, y0 + 0.2, y1 - 0.25, top, top + 0.1, PAINT, bevel=0.015)
    mb.box(-0.4, 0.5, y0 + 0.3, y1 - 0.35, top + 0.1, top + 0.13, DARK)
    # filtre à air vertical et échappement à chapeau
    mb.cyl((-0.78, y0 + 0.35, top), (-0.78, y0 + 0.35, top + 0.42), 0.19, PAINT, 18)
    mb.cyl((-0.78, y0 + 0.35, top + 0.42), (-0.78, y0 + 0.35, top + 0.47), 0.21, DARK, 18)
    ex_x, ex_y = -0.85, y1 - 0.18
    mb.cyl((ex_x, ex_y, f["rail_z1"] + 0.2), (ex_x, ex_y, top + 0.55), 0.075, METAL, 12)
    mb.cyl((ex_x, ex_y, top - 0.25), (ex_x, ex_y, top + 0.3), 0.105, DARK, 12)
    mb.wedge(ex_x - 0.09, ex_x + 0.09, ex_y - 0.09, ex_y + 0.09, top + 0.55,
             top + 0.6, top + 0.66, DARK)
    # berceau de la roue de secours, contre la paroi arrière du compartiment
    mb.box(0.12, 0.98, y0 - 0.06, y0, f["rail_z1"], top + 0.1, DARK)


def build_hemtt(scene, spec, mats, name, parent=None, location=(0.0, 0.0, 0.0),
                rotation=(0.0, 0.0, 0.0), variant="tractor", wheel_mesh=None,
                body_mesh_cache=None):
    """
    Construit un HEMTT complet. Renvoie (racine, carrosserie, roues, secours, mesh roue).

    ``body_mesh_cache`` permet de réutiliser la carrosserie d'un premier
    tracteur : un second tracteur ne coûte alors que des nœuds, aucun sommet.
    """
    hs = spec["hemtt"]
    root = new_empty(scene, name, parent, location, rotation)
    key = "body_" + variant
    body_mesh = (body_mesh_cache or {}).get(key)
    if body_mesh is None:
        mb = MeshBuilder("PAT_HEMTT_Body_" + variant.capitalize())
        _cab(mb, hs["cab"])
        _front_end(mb, hs)
        _engine_bay(mb, hs)
        _chassis(mb, hs, variant)
        body_mesh = mb.finish(mats)
        if body_mesh_cache is not None:
            body_mesh_cache[key] = body_mesh
    body = new_object(scene, name + "_Body", body_mesh, root)

    if wheel_mesh is None:
        wheel_mesh = build_wheel_mesh(mats, "PAT_Wheel_HEMTT", hs["tire_radius"],
                                      hs["tire_half_width"], hs["rim_radius"], "lug")
    wheels = []
    for index, ay in enumerate(hs["axles_y"], start=1):
        for side_key, side in (("L", -1.0), ("R", 1.0)):
            wheels.append(new_object(
                scene, "%s_Wheel_%d%s" % (name, index, side_key), wheel_mesh, root,
                (side * hs["track_half"], ay, hs["tire_radius"]), wheel_rotation(side)))
    # roue de secours dressée derrière le compartiment moteur (axe transversal)
    spare = new_object(scene, name + "_Spare", wheel_mesh, root,
                       (0.55, hs["engine"]["back_y"] - hs["tire_radius"] - 0.08,
                        hs["frame"]["rail_z1"] + 0.06 + hs["tire_radius"]),
                       (0.0, 0.0, 0.0))
    return root, body, wheels, spare, wheel_mesh
