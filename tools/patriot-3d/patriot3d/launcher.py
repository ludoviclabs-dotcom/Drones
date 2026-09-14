"""
launcher.py — station de lancement M903 sur semi-remorque M860A1.

Formes extérieures lues sur des photographies publiques (US Army, JASDF,
Bundeswehr) et sur les gabarits publiés (FM 3-01.85, Lockheed Martin) :
remorque à tandem, col de cygne portant le groupe électrogène, électronique
de lancement (ELES) entre le lanceur et le col de cygne, quatre stabilisateurs
à bras pivotants et vérins à patins, tourelle de gisement, masse élevée
articulée à l'arrière et relevée par deux vérins, douze conteneurs PAC-3 MSE
individuels en 3 rangées × 4, mât d'antenne de liaison sur la tourelle.

Hiérarchie produite (préfixe = nom de la station, ex. PAT_LS1) :

    PAT_LS1                         racine, au sol, milieu du tandem
    ├── _Trailer                    châssis, plateau, col de cygne, coffres
    ├── _Wheel_1L.._2R              4 roues (mesh partagé)
    ├── _Outrigger_{FL,FR,RL,RR}    bras pivotant (lacet), pivot à la charnière
    │   └── _Foot                   tige + patin, translation verticale
    ├── _LegSleeve_L/R, _Leg_L/R    béquilles avant (translation verticale)
    ├── _PowerUnit                  groupe électrogène 15 kW sur col de cygne
    ├── _ELES                       électronique de lancement
    └── _Turret                     tourelle de gisement (rotation autour de Z)
        ├── _Mast / _MastTop        mât de liaison (section haute télescopique)
        ├── _Launcher               masse élevée, pivot EXACT sur la charnière
        │   ├── _Canister_01..12    conteneurs MSE (deux meshes partagés)
        │   │   ├── _CoverRear_NN   opercules (conteneurs de tir seulement)
        │   │   ├── _CoverFront_NN
        │   │   └── _Missile_A/B    intercepteur (pivot culot) + _Fin1..4
        ├── _ActuatorBarrel_L/R     corps de vérin (pivot bas)
        └── _ActuatorRod_L/R        tige de vérin (pivot haut)

Repère local : +Y vers le col de cygne (avant, direction de tir à gisement
nul), z = 0 au sol.
"""

import math

from mathutils import Matrix

from .core import MeshBuilder, merge_meshes, new_empty, new_object, rounded_rect
from .missile import build_control_fin_mesh, build_missile_mesh, fin_placement
from .wheels import build_wheel_mesh, wheel_rotation

PAINT = "PAT_MAT_Paint"
DARK = "PAT_MAT_PaintDark"
BLACK = "PAT_MAT_Black"
METAL = "PAT_MAT_Metal"
CHROME = "PAT_MAT_Chrome"
AMBER = "PAT_MAT_LampAmber"
RED = "PAT_MAT_LampRed"
TAN = "PAT_MAT_CanisterTan"
TAN_DARK = "PAT_MAT_CanisterTanDark"
COVER = "PAT_MAT_CanisterCover"
REFLECT = "PAT_MAT_Reflector"


def _span(a, b):
    return (min(a, b), max(a, b))


# ---------------------------------------------------------------------------
# Semi-remorque : châssis, plateau, col de cygne, coffres
# ---------------------------------------------------------------------------

def build_trailer_frame(mb, t, variant="launcher"):
    """Châssis M860A1 commun (lanceur et radar)."""
    hw = t["half_width"]
    rear, front = t["rear_y"], t["deck_front_y"]
    dz = t["deck_z"]
    rz0 = t["rail_z0"]
    g = t["gooseneck"]
    r = t["tire_radius"]

    # longerons principaux et semelles
    for side in (-1.0, 1.0):
        x = side * t["rail_half"]
        mb.box(x - 0.07, x + 0.07, rear + 0.1, front + 0.3, rz0, dz - 0.04, DARK,
               bevel=0.008)
        mb.box(x - 0.13, x + 0.13, rear + 0.1, front + 0.3, dz - 0.07, dz - 0.03, DARK)
    # longerons de rive (bord de plateau très lisible sur les photos)
    for side in (-1.0, 1.0):
        x0, x1 = _span(side * (hw - 0.09), side * hw)
        mb.box(x0, x1, rear, front, dz - 0.2, dz, PAINT, bevel=0.012)
        xa, xb = _span(side * (hw - 0.02), side * (hw + 0.004))
        mb.box(xa, xb, rear + 0.05, front - 0.05, dz - 0.16, dz - 0.14, DARK)
    # traverses et plancher
    y = rear + 0.15
    while y < front:
        mb.box(-hw + 0.08, hw - 0.08, y - 0.06, y + 0.06, dz - 0.18, dz - 0.04, DARK)
        y += 0.78
    mb.box(-hw + 0.09, hw - 0.09, rear + 0.02, front - 0.02, dz - 0.03, dz, PAINT)

    # col de cygne : rampe, plateau surélevé, plaque et pivot d'attelage
    step0 = front - 0.28
    mb.wedge(-hw, hw, step0, front + 0.02, dz - 0.2, g["z_top"], dz, PAINT, bevel=0.012)
    mb.box(-hw, hw, front, g["y1"], g["z_bottom"] + 0.04, g["z_top"], PAINT, bevel=0.02)
    for side in (-1.0, 1.0):
        x = side * 0.62
        mb.box(x - 0.06, x + 0.06, front - 0.4, g["y1"] - 0.1, g["z_bottom"] - 0.1,
               g["z_bottom"] + 0.04, DARK)
    mb.box(-0.55, 0.55, g["kingpin_y"] - 0.55, g["kingpin_y"] + 0.55,
           g["z_bottom"], g["z_bottom"] + 0.04, METAL)
    mb.cyl((0.0, g["kingpin_y"], g["z_bottom"]), (0.0, g["kingpin_y"], g["z_bottom"] - 0.1),
           0.045, METAL, 12)
    mb.box(-hw, hw, g["y1"] - 0.02, g["y1"] + 0.03, g["z_bottom"] - 0.06, g["z_top"], DARK)
    for side in (-1.0, 1.0):
        x = side * (hw - 0.12)
        mb.box(x - 0.05, x + 0.05, g["y1"] + 0.03, g["y1"] + 0.05, g["z_top"] - 0.12,
               g["z_top"] - 0.04, AMBER)

    # essieux et suspension à balancier (roues sous le plateau, sans ailes)
    for ay in t["axles_y"]:
        mb.cyl((-0.82, ay, r), (0.82, ay, r), 0.085, DARK, 14)
    a0, a1 = t["axles_y"]
    for side in (-1.0, 1.0):
        x = side * t["rail_half"]
        mb.box(x - 0.07, x + 0.07, a1 - 0.18, a0 + 0.18, r + 0.06, r + 0.2, DARK, bevel=0.01)
        mb.box(x - 0.1, x + 0.1, -0.22, 0.22, r + 0.18, rz0, DARK)
        for ay in t["axles_y"]:
            mb.cyl((x, ay + 0.12, r + 0.05), (x, ay + 0.25, rz0), 0.035, BLACK, 8)

    # arrière : pare-chocs, feux ronds, catadioptres, plaque, marchepied, échelle
    mb.box(-hw + 0.05, hw - 0.05, rear - 0.12, rear + 0.04, 0.72, 1.12, DARK, bevel=0.015)
    for side in (-1.0, 1.0):
        for k, mat in enumerate((RED, RED, AMBER)):
            x = side * (0.78 + 0.16 * k)
            mb.cyl((x, rear - 0.12, 0.92), (x, rear - 0.15, 0.92), 0.055, mat, 14)
        xa, xb = _span(side * 0.35, side * 0.62)
        mb.box(xa, xb, rear - 0.14, rear - 0.12, 0.8, 0.86, REFLECT)
    mb.box(-0.26, 0.26, rear - 0.14, rear - 0.12, 0.96, 1.08, METAL)
    for k in range(7):
        x = -0.9 + k * 0.3
        mb.box(x - 0.012, x + 0.012, rear - 0.46, rear - 0.12, dz - 0.05, dz - 0.02, METAL)
    for yy in (rear - 0.44, rear - 0.14):
        mb.box(-0.95, 0.95, yy - 0.015, yy + 0.015, dz - 0.06, dz - 0.02, DARK)
    for k in range(4):
        z = 0.35 + k * 0.26
        mb.box(-0.92, -0.62, rear - 0.44, rear - 0.4, z - 0.015, z + 0.015, METAL)
    for xx in (-0.92, -0.62):
        mb.box(xx - 0.02, xx + 0.02, rear - 0.46, rear - 0.38, 0.28, dz, DARK)

    # platines de charnière des stabilisateurs (communes aux deux variantes)
    for hinge in t["outriggers"].values():
        hx, hy, hz = hinge["hinge"]
        x0, x1 = _span(hx - (0.14 if hx > 0 else -0.14), hx)
        mb.box(x0, x1, hy - 0.16, hy + 0.16, hz - 0.2, dz - 0.18, DARK, bevel=0.01)
        mb.cyl((hx, hy, hz - 0.18), (hx, hy, hz + 0.16), 0.07, METAL, 12)

    if variant != "launcher":
        return

    # coffres latéraux sous plateau (droite), touret de câble et coffre (gauche)
    c0, c1 = t["side_boxes_y"]
    mb.box(0.62, hw - 0.1, c0, c1, 0.6, dz - 0.2, PAINT, bevel=0.02)
    mid = 0.5 * (c0 + c1)
    for yy in (c0 + 0.03, mid, c1 - 0.03):
        mb.box(hw - 0.105, hw - 0.09, yy - 0.015, yy + 0.015, 0.62, dz - 0.22, DARK)
    for yy in (0.5 * (c0 + mid), 0.5 * (mid + c1)):
        mb.box(hw - 0.1, hw - 0.07, yy - 0.08, yy + 0.08, 0.95, 1.0, METAL)
    reel_y = c0 + 0.6
    mb.cyl((-hw + 0.12, reel_y, 0.86), (-0.66, reel_y, 0.86), 0.33, DARK, 22)
    mb.cyl((-hw + 0.1, reel_y, 0.86), (-hw + 0.16, reel_y, 0.86), 0.42, PAINT, 22)
    mb.cyl((-0.72, reel_y, 0.86), (-0.66, reel_y, 0.86), 0.42, PAINT, 22)
    mb.box(-hw + 0.08, -0.62, c0 + 1.15, c1, 0.66, dz - 0.2, PAINT, bevel=0.02)


def build_outrigger(scene, mats, name, parent, hinge, stowed_yaw, arm_len, drop,
                    arm_mesh_cache):
    """Bras pivotant + patin. Le bras pointe sur +Y local ; le lacet le place."""
    if "arm" not in arm_mesh_cache:
        mb = MeshBuilder("PAT_Outrigger_Arm")
        mb.beam((0.0, 0.0, 0.0), (0.0, arm_len, -0.04), 0.14, 0.16, PAINT, bevel=0.012)
        mb.beam((0.0, 0.12, -0.22), (0.0, arm_len - 0.1, -0.3), 0.08, 0.08, DARK, bevel=0.006)
        mb.box(-0.06, 0.06, -0.05, 0.2, -0.3, -0.06, DARK)
        mb.cyl((0.0, arm_len, 0.1), (0.0, arm_len, -0.6), 0.1, PAINT, 16)
        mb.cyl((0.0, arm_len, 0.1), (0.0, arm_len, 0.16), 0.075, DARK, 16)
        mb.beam((0.0, arm_len, 0.13), (0.22, arm_len, 0.13), 0.025, 0.025, METAL)
        mb.beam((0.22, arm_len, 0.13), (0.22, arm_len, 0.28), 0.022, 0.022, METAL)
        mb.cyl((0.0, 0.0, -0.1), (0.0, 0.0, 0.12), 0.085, DARK, 14)
        arm_mesh_cache["arm"] = mb.finish(mats)
        mb = MeshBuilder("PAT_Outrigger_Foot")
        mb.cyl((0.0, 0.0, 0.0), (0.0, 0.0, 0.6), 0.068, METAL, 14)
        mb.cyl((0.0, 0.0, 0.0), (0.0, 0.0, -0.05), 0.1, DARK, 14)
        mb.lathe([(0.0, 0.0), (0.0, 0.3), (0.035, 0.3), (0.06, 0.24), (0.06, 0.0)],
                 DARK, 28, (0.0, 0.0, -0.13), (0.0, 0.0, 1.0), cap0=False, cap1=False)
        mb.lathe([(0.0, 0.1), (0.06, 0.085), (0.08, 0.05)], METAL, 14,
                 (0.0, 0.0, -0.08), (0.0, 0.0, 1.0), cap0=False, cap1=True)
        arm_mesh_cache["foot"] = mb.finish(mats)
    arm = new_object(scene, name, arm_mesh_cache["arm"], parent, hinge, (0.0, 0.0, stowed_yaw))
    # Pied rentré : le patin affleure à ``drop`` m au-dessus du sol. Déployé,
    # une translation locale de -drop le pose exactement au sol.
    foot_z = 0.13 - hinge[2] + drop
    foot = new_object(scene, name + "_Foot", arm_mesh_cache["foot"], arm,
                      (0.0, arm_len, foot_z))
    return arm, foot


def build_power_unit_mesh(mats, p):
    """Caisson avant (groupe électrogène 15 kW) sur le col de cygne."""
    mb = MeshBuilder("PAT_PowerUnit")
    hw = p["half_width"]
    y0, y1 = p["y0"], p["y1"]
    z1 = p["height"]
    mb.box(-hw, hw, y0, y1, 0.12, z1, PAINT, bevel=0.03)
    mb.box(-hw + 0.05, hw - 0.05, y0 + 0.05, y1 - 0.05, 0.0, 0.12, DARK)
    for side in (-1.0, 1.0):
        xa, xb = _span(side * hw, side * (hw + 0.012))
        doors = [(y0 + 0.12, 0.5 * (y0 + y1) - 0.03), (0.5 * (y0 + y1) + 0.03, y1 - 0.12)]
        for d0, d1 in doors:
            mb.box(xa, xb, d0, d1, 0.3, z1 - 0.18, PAINT, bevel=0.006)
            xh0, xh1 = _span(side * hw, side * (hw + 0.035))
            mb.box(xh0, xh1, d1 - 0.16, d1 - 0.1, 0.5 * z1 - 0.1, 0.5 * z1 + 0.1, METAL)
            for zz in (0.45, z1 - 0.35):
                mb.box(xh0, xh1, d0 + 0.02, d0 + 0.08, zz - 0.06, zz + 0.06, DARK)
        for k in range(6):
            zz = z1 - 0.3 + k * 0.035
            xg0, xg1 = _span(side * hw, side * (hw + 0.03))
            mb.box(xg0, xg1, y1 - 0.9, y1 - 0.2, zz - 0.009, zz + 0.009, DARK)
    # face avant : grille de refroidissement ; capot d'échappement à l'arrière
    mb.box(-hw + 0.25, hw - 0.25, y1, y1 + 0.02, 0.4, z1 - 0.35, DARK)
    for k in range(9):
        zz = 0.47 + k * 0.08
        mb.box(-hw + 0.28, hw - 0.28, y1 + 0.015, y1 + 0.045, zz - 0.012, zz + 0.012, PAINT)
    mb.wedge(-hw + 0.1, -hw + 0.6, y0 - 0.32, y0 + 0.02, z1 - 0.55, z1 - 0.02, z1 - 0.18,
             DARK, bevel=0.008)
    # toit : garde-corps, anneaux de levage, trappe
    rail_z = z1 + 0.62
    corners = [(-hw + 0.06, y0 + 0.06), (hw - 0.06, y0 + 0.06), (hw - 0.06, y1 - 0.06),
               (-hw + 0.06, y1 - 0.06)]
    for x, y in corners:
        mb.cyl((x, y, z1), (x, y, rail_z), 0.022, METAL, 8)
    for i in range(4):
        a, b = corners[i], corners[(i + 1) % 4]
        mb.tube([(a[0], a[1], rail_z), (b[0], b[1], rail_z)], 0.024, METAL, 8)
        mb.tube([(a[0], a[1], z1 + 0.32), (b[0], b[1], z1 + 0.32)], 0.018, METAL, 8)
    for x, y in corners:
        mb.lathe([(0.0, 0.05), (0.03, 0.06), (0.06, 0.05)], METAL, 10,
                 (x * 0.85, y + (0.12 if y < 0.5 * (y0 + y1) else -0.12), z1), (0.0, 0.0, 1.0))
    mb.box(-0.4, 0.2, y0 + 0.3, y0 + 0.9, z1, z1 + 0.06, DARK)
    # échelle d'accès côté gauche
    for k in range(6):
        zz = 0.25 + k * 0.28
        mb.box(-hw - 0.08, -hw - 0.02, y0 + 0.2, y0 + 0.55, zz - 0.014, zz + 0.014, METAL)
    for yy in (y0 + 0.2, y0 + 0.55):
        mb.box(-hw - 0.1, -hw - 0.04, yy - 0.02, yy + 0.02, 0.0, z1 + 0.65, METAL)
    return mb.finish(mats)


def build_eles_mesh(mats, e):
    """Électronique de lancement (ELES) entre le lanceur et le col de cygne."""
    mb = MeshBuilder("PAT_ELES")
    x0, x1 = e["x0"], e["x1"]
    y0, y1 = e["y0"], e["y1"]
    h = e["height"]
    mb.box(x0, x1, y0, y1, 0.0, h, PAINT, bevel=0.025)
    # trois compartiments, lamelles, connecteurs, gaines vers le lanceur
    for k in (-0.38, 0.38):
        mb.box(k - 0.012, k + 0.012, y0 - 0.012, y0, 0.08, h - 0.08, DARK)
    for k in range(7):
        zz = 0.22 + k * 0.07
        mb.box(-0.3, 0.3, y0 - 0.025, y0, zz - 0.014, zz + 0.014, DARK)
    for side in (-1.0, 1.0):
        xs0, xs1 = _span(side * (x1 - 0.02), side * (x1 + 0.005))
        mb.box(xs0, xs1, y0 + 0.08, y1 - 0.08, 0.1, h - 0.12, DARK)
    for k in range(4):
        x = -0.75 + k * 0.5
        mb.cyl((x, y0, h * 0.35), (x, y0 - 0.06, h * 0.35), 0.035, METAL, 10)
        mb.tube([(x, y0 - 0.06, h * 0.35), (x * 0.9, y0 - 0.35, h * 0.2),
                 (x * 0.7, y0 - 1.2, 0.08)], 0.026, BLACK, 8)
    mb.box(-0.55, 0.55, y0 + 0.1, y1 - 0.1, h, h + 0.05, DARK)
    return mb.finish(mats)


def build_mast_meshes(mats, m):
    mb = MeshBuilder("PAT_Mast_Lower")
    mb.cyl((0.0, 0.0, 0.0), (0.0, 0.0, m["lower_len"]), m["lower_r"], PAINT, 14)
    mb.cyl((0.0, 0.0, m["lower_len"]), (0.0, 0.0, m["lower_len"] + 0.06),
           m["lower_r"] + 0.018, DARK, 14)
    for zz in (0.3, 1.4):
        mb.box(0.0, 0.3, -0.04, 0.04, zz - 0.05, zz + 0.05, DARK)
    mb.box(-0.14, 0.14, -0.14, 0.14, -0.05, 0.12, DARK, bevel=0.01)
    lower = mb.finish(mats)
    mb = MeshBuilder("PAT_Mast_Upper")
    mb.cyl((0.0, 0.0, -m["upper_len"] + 0.3), (0.0, 0.0, 0.0), m["upper_r"], PAINT, 10)
    mb.cyl((0.0, 0.0, 0.0), (0.0, 0.0, m["whip_len"]), m["upper_r"] * 0.45, BLACK, 8,
           r1=m["upper_r"] * 0.2)
    mb.cyl((0.0, 0.0, -0.02), (0.0, 0.0, 0.08), m["upper_r"] + 0.012, DARK, 10)
    upper = mb.finish(mats)
    return lower, upper


# ---------------------------------------------------------------------------
# Lanceur : tourelle, masse élevée, conteneurs, vérins
# ---------------------------------------------------------------------------

def build_turret_mesh(mats, lf):
    """Tourelle de gisement : plateau, couronne, chapes de charnière, pieds de vérins."""
    tr = lf["turret"]
    ox, oy, oz = tr["origin"]
    mb = MeshBuilder("PAT_Turret")
    y0, y1 = tr["y0"], tr["y1"]
    hw = tr["half_width"]
    h = tr["height"]
    mb.box(-hw, hw, y0, y1, 0.0, h, DARK, bevel=0.02)
    mb.box(-hw - 0.03, hw + 0.03, y0 - 0.03, y1 + 0.03, h - 0.05, h, PAINT, bevel=0.01)
    mb.lathe([(0.0, tr["ring_radius"] - 0.06), (0.0, tr["ring_radius"]),
              (0.07, tr["ring_radius"]), (0.07, tr["ring_radius"] - 0.06)], METAL, 44,
             (0.0, 0.0, -0.05), (0.0, 0.0, 1.0), cap0=False, cap1=False)
    hy, hz = lf["hinge"][1] - oy, lf["hinge"][2] - oz
    for side in (-1.0, 1.0):
        x = side * lf["hinge_half_span"]
        mb.box(x - 0.09, x + 0.09, hy - 0.26, hy + 0.2, h, hz + 0.02, PAINT, bevel=0.015)
        mb.cyl((x - 0.13, hy, hz), (x + 0.13, hy, hz), 0.09, METAL, 16)
        ax, ay, az = lf["actuator_base"]
        xa = side * ax
        ly, lz = ay - oy, az - oz
        for dx in (-0.1, 0.1):
            mb.box(xa + dx - 0.03, xa + dx + 0.03, ly - 0.16, ly + 0.16, h, lz + 0.08, PAINT,
                   bevel=0.01)
        mb.cyl((xa - 0.15, ly, lz), (xa + 0.15, ly, lz), 0.05, METAL, 12)
    # support de mât (côté gauche arrière)
    mx, my, mz = lf["mast"]["base"]
    mb.beam((-hw + 0.05, my, h - 0.04), (mx, my, h - 0.04), 0.14, 0.1, DARK)
    mb.beam((-hw + 0.05, my, 0.05), (mx, my, h - 0.06), 0.06, 0.06, DARK)
    # boîtiers de jonction et faisceaux au pied du lanceur
    for k, x in enumerate((-0.55, -0.2, 0.25, 0.6)):
        mb.box(x - 0.13, x + 0.13, y0 + 0.08, y0 + 0.45, h, h + 0.26 + 0.05 * (k % 2), PAINT,
               bevel=0.01)
        mb.tube([(x, y0 + 0.2, h + 0.28), (x + 0.05, y0 + 0.05, h + 0.42),
                 (x * 0.6, hy + 0.1, hz - 0.12)], 0.028, BLACK, 8)
    return mb.finish(mats)


def canister_positions(c):
    """Centres (x, z) des conteneurs dans le repère du lanceur, ordre 01..12
    (rangée haute d'abord, de gauche à droite vu de l'arrière)."""
    out = []
    for row in range(c["rows"]):
        z = c["z0"] + c["height"] * (c["rows"] - 1 - row) + 0.5 * c["height"]
        for col in range(c["cols"]):
            x = (col - (c["cols"] - 1) / 2.0) * c["width"]
            out.append((x, z))
    return out


def build_canister_mesh(mats, c, name, closed=True):
    """
    Conteneur PAC-3 MSE « One-Pack » (arrière à y = 0, avant à y = length) :
    tube à section rectangulaire arrondie, cadres d'empilage, panneaux latéraux,
    collerettes d'extrémité, ferrures d'angle, boîtier de transition arrière.
    """
    mb = MeshBuilder(name)
    w, h, L = c["width"] - 0.014, c["height"] - 0.014, c["length"]
    hw, hh = w / 2, h / 2
    # Profils à deux segments d'angle et sans chanfrein : le conteneur est
    # répété douze fois par lanceur, chaque triangle compte.
    body = rounded_rect(hw - 0.03, hh - 0.03, 0.06, 2)
    mb.prism(body, "Y", 0.11, L - 0.11, TAN, cap0=False, cap1=False)
    # cadres d'empilage (pleine section) et panneaux latéraux entre cadres
    frame = rounded_rect(hw, hh, 0.05, 2)
    for y in c["frames"]:
        mb.prism(frame, "Y", y - 0.06, y + 0.06, TAN)
    frames = c["frames"]
    for fa, fb in zip(frames[:-1], frames[1:]):
        for side in (-1.0, 1.0):
            xa, xb = _span(side * (hw - 0.032), side * (hw - 0.012))
            mb.box(xa, xb, fa + 0.14, fb - 0.14, -hh + 0.1, hh - 0.1, TAN_DARK)
        mb.box(-hw + 0.1, hw - 0.1, fa + 0.14, fb - 0.14, hh - 0.032, hh - 0.014, TAN_DARK)
    # collerettes d'extrémité, couronne de face, tunnel court
    inner = rounded_rect(hw - 0.06, hh - 0.06, 0.05, 2)
    for y0, y1 in ((0.0, 0.11), (L - 0.11, L)):
        mb.prism(frame, "Y", y0, y1, TAN_DARK, cap0=False, cap1=False)
        yy = y0 if y0 == 0.0 else y1
        outer_v = [mb.vert((x, yy, z)) for x, z in frame]
        inner_v = [mb.vert((x, yy, z)) for x, z in inner]
        for i in range(len(frame)):
            j = (i + 1) % len(frame)
            mb.face([outer_v[i], outer_v[j], inner_v[j], inner_v[i]], TAN_DARK)
        if not closed:
            # tunnel sombre visible seulement quand l'opercule a disparu
            depth = 0.09 if y0 == 0.0 else -0.09
            mb.prism(inner, "Y", min(yy, yy + depth), max(yy, yy + depth), BLACK,
                     cap0=False, cap1=False)
        for sx in (-1.0, 1.0):
            for sz in (-1.0, 1.0):
                cx, cz = sx * (hw - 0.04), sz * (hh - 0.04)
                mb.box(cx - 0.04, cx + 0.04, y0 - 0.012, y1 + 0.012, cz - 0.04, cz + 0.04,
                       TAN_DARK)
    # boîtier de transition (liaison ombilicale) sous l'arrière, patins
    mb.box(-0.12, 0.12, 0.15, 0.55, -hh - 0.05, -hh + 0.005, TAN_DARK)
    mb.cyl((0.0, 0.15, -hh - 0.025), (0.0, 0.05, -hh - 0.025), 0.03, TAN_DARK, 6)
    for y in (0.8, L - 0.8):
        mb.box(-hw + 0.05, hw - 0.05, y - 0.15, y + 0.15, -hh - 0.02, -hh + 0.005, TAN_DARK)
    # poignées latérales (barres)
    for side in (-1.0, 1.0):
        xa, xb = _span(side * hw, side * (hw + 0.035))
        for y in (1.2, L - 1.4):
            mb.box(xa, xb, y, y + 0.22, -0.1, -0.07, TAN_DARK)
    if closed:
        add_canister_covers(mb, c)
    return mb.finish(mats)


def build_canister_low_mesh(mats, c, name="PAT_Canister_MSE_Low"):
    """Conteneur économique des lanceurs d'arrière-plan (~150 triangles)."""
    mb = MeshBuilder(name)
    w, h, L = c["width"] - 0.014, c["height"] - 0.014, c["length"]
    hw, hh = w / 2, h / 2
    body = rounded_rect(hw - 0.03, hh - 0.03, 0.05, 1)
    mb.prism(body, "Y", 0.0, L, TAN, cap0=False, cap1=False)
    frame = rounded_rect(hw, hh, 0.05, 1)
    for y in c["frames"]:
        mb.prism(frame, "Y", y - 0.06, y + 0.06, TAN_DARK)
    face = rounded_rect(hw - 0.03, hh - 0.03, 0.05, 1)
    mb.prism(face, "Y", 0.0, 0.02, COVER)
    mb.prism(face, "Y", L - 0.02, L, COVER)
    return mb.finish(mats)


def add_canister_covers(mb, c, which=("rear", "front")):
    w, h, L = c["width"] - 0.014, c["height"] - 0.014, c["length"]
    hw, hh = w / 2, h / 2
    face = rounded_rect(hw - 0.06, hh - 0.06, 0.05, 2)
    if "rear" in which:
        # opercule arrière : panneau plan, plaque centrale, fixations
        mb.prism(face, "Y", 0.07, 0.09, COVER)
        mb.box(-w * 0.2, w * 0.2, 0.05, 0.07, -h * 0.05, h * 0.28, TAN_DARK)
        for sx in (-1.0, 1.0):
            for sz in (-1.0, 1.0):
                mb.cyl((sx * (hw - 0.1), 0.05, sz * (hh - 0.1)),
                       (sx * (hw - 0.1), 0.07, sz * (hh - 0.1)), 0.016, TAN_DARK, 6,
                       cap1=False)
    if "front" in which:
        # opercule avant : membrane plane, nervures de rupture
        mb.prism(face, "Y", L - 0.09, L - 0.075, COVER)
        for k in (-1, 0, 1):
            mb.box(-hw + 0.08, hw - 0.08, L - 0.075, L - 0.068, k * hh * 0.45 - 0.006,
                   k * hh * 0.45 + 0.006, TAN_DARK)
        mb.box(-0.006, 0.006, L - 0.075, L - 0.068, -hh + 0.08, hh - 0.08, TAN_DARK)


def build_cover_meshes(mats, c):
    rear = MeshBuilder("PAT_CoverRear")
    add_canister_covers(rear, c, ("rear",))
    front = MeshBuilder("PAT_CoverFront")
    add_canister_covers(front, c, ("front",))
    return rear.finish(mats), front.finish(mats)


def build_launcher_frame_mesh(mats, lf, c):
    """Masse élevée hors conteneurs : poutres maîtresses, cadres, longerons."""
    mb = MeshBuilder("PAT_LauncherFrame")
    L = c["length"]
    y_rear = lf["rear_overhang"]
    y_front = y_rear + L
    stack_w = c["cols"] * c["width"]
    stack_h = c["rows"] * c["height"]
    xh = stack_w / 2 + 0.05
    z0 = c["z0"]
    z1 = z0 + stack_h
    bar = 0.06

    # poutres maîtresses (caissons) et bossages de charnière
    for side in (-1.0, 1.0):
        x = side * lf["beam_half_span"]
        mb.box(x - 0.1, x + 0.1, y_rear + 0.2, y_front - 0.25, -0.06, z0 - 0.012, PAINT,
               bevel=0.015)
        mb.cyl((side * (lf["hinge_half_span"] - 0.1), 0.0, 0.0),
               (side * (lf["hinge_half_span"] + 0.1), 0.0, 0.0), 0.12, DARK, 18)
        mb.box(side * lf["hinge_half_span"] - 0.09, side * lf["hinge_half_span"] + 0.09,
               -0.22, 0.3, -0.1, z0 - 0.012, DARK)
    ay, az = lf["actuator_attach"]
    for side in (-1.0, 1.0):
        x = side * lf["actuator_base"][0]
        mb.box(x - 0.14, x + 0.14, ay - 0.24, ay + 0.24, az - 0.06, z0 - 0.012, DARK,
               bevel=0.01)
        mb.cyl((x - 0.16, ay, az), (x + 0.16, ay, az), 0.055, METAL, 12)
    for k in range(7):
        y = y_rear + 0.3 + (L - 0.75) * k / 6.0
        mb.box(-xh, xh, y - 0.06, y + 0.06, z0 - 0.07, z0 - 0.012, DARK)
    # longerons d'angle et cadres d'extrémité
    for sx in (-1.0, 1.0):
        for zz in (z0, z1):
            mb.box(sx * xh - bar, sx * xh + bar, y_rear + 0.02, y_front - 0.02,
                   zz - bar, zz + bar, PAINT, bevel=0.01)
    for yy in (y_rear + 0.05, y_front - 0.12):
        for zz in (z0, z1):
            mb.box(-xh - bar, xh + bar, yy - 0.05, yy + 0.05, zz - bar, zz + bar, PAINT,
                   bevel=0.01)
        for sx in (-1.0, 1.0):
            mb.box(sx * xh - bar, sx * xh + bar, yy - 0.05, yy + 0.05, z0, z1, PAINT,
                   bevel=0.01)
            x = sx * (xh + bar + 0.012)
            inward = 1.0 if yy < 0.5 * (y_rear + y_front) else -1.0
            mb.beam((x, yy, z0 + 0.05), (x, yy + inward * 0.7, z1 - 0.05), 0.05, 0.05, PAINT)
            mb.beam((x, yy + inward * 0.7, z0 + 0.05), (x, yy, z1 - 0.05), 0.05, 0.05, PAINT)
    # montants intermédiaires sur les joues, sangles sur le dessus
    for k in range(1, 6):
        y = y_rear + L * k / 6.0
        for sx in (-1.0, 1.0):
            mb.box(sx * xh - 0.045, sx * xh + 0.045, y - 0.045, y + 0.045, z0, z1, DARK)
    for k in range(3):
        y = y_rear + 1.0 + (L - 2.0) * k / 2.0
        mb.box(-xh, xh, y - 0.04, y + 0.04, z1 + bar - 0.01, z1 + bar + 0.02, DARK)
    # boîte de jonction arrière et faisceaux vers les conteneurs
    mb.box(-0.4, 0.4, y_rear - 0.1, y_rear + 0.25, z0 - 0.34, z0 - 0.08, PAINT, bevel=0.012)
    for k in range(6):
        x = -1.0 + 0.4 * k
        mb.tube([(x, y_rear + 0.25, z0 - 0.02), (x * 0.8, y_rear - 0.08, z0 - 0.2),
                 (x * 0.3, y_rear + 0.1, z0 - 0.3)], 0.02, BLACK, 6)
    return mb.finish(mats)


def build_actuator_meshes(mats, a):
    barrel = MeshBuilder("PAT_ActuatorBarrel")
    barrel.cyl((0.0, 0.0, 0.0), (0.0, a["barrel_len"], 0.0), a["barrel_r"], PAINT, 16)
    barrel.cyl((0.0, a["barrel_len"] - 0.06, 0.0), (0.0, a["barrel_len"], 0.0),
               a["barrel_r"] + 0.015, DARK, 16)
    barrel.cyl((-0.06, 0.0, 0.0), (0.06, 0.0, 0.0), 0.075, DARK, 14)
    barrel.box(-0.05, 0.05, 0.0, 0.18, -0.06, 0.06, DARK)
    barrel.tube([(0.0, 0.3, a["barrel_r"]), (0.03, 0.6, a["barrel_r"] + 0.05),
                 (0.0, a["barrel_len"] - 0.15, a["barrel_r"])], 0.014, BLACK, 6)
    rod = MeshBuilder("PAT_ActuatorRod")
    rod.cyl((0.0, 0.0, 0.0), (0.0, -a["rod_len"], 0.0), a["rod_r"], CHROME, 14)
    rod.cyl((-0.055, 0.0, 0.0), (0.055, 0.0, 0.0), 0.07, DARK, 14)
    rod.box(-0.045, 0.045, -0.16, 0.0, -0.055, 0.055, DARK)
    return barrel.finish(mats), rod.finish(mats)


def pose_station_deployed(spec, made, elevation_rad, yaw_rad=0.0):
    """Pose statique « en batterie » (lanceurs d'arrière-plan, non animés)."""
    t = spec["trailer"]
    lf = spec["launcher"]
    for key, (arm, foot) in made["outriggers"].items():
        arm.rotation_euler.z = math.radians(t["outriggers"][key]["deployed_yaw_deg"])
        foot.location.z -= t["outrigger_foot_drop"]
    for leg in made["legs"]:
        leg.location.z = 0.0
    made["mast_top"].location.z += lf["mast"]["stowed_drop"]
    made["turret"].rotation_euler.z = yaw_rad
    made["launcher"].rotation_euler.x = elevation_rad
    _, (Ay, Az), phi = actuator_pose(lf, elevation_rad)
    for barrel, rod in made["actuators"].values():
        barrel.rotation_euler.x = phi
        rod.location.y, rod.location.z = Ay, Az
        rod.rotation_euler.x = phi


def actuator_pose(lf, theta):
    """
    Pose des vérins pour une élévation ``theta`` (radians), dans le repère de
    la tourelle. Renvoie (pied B, tête A, angle phi autour de X local). Les deux
    points ont la même abscisse : la tige reste dans un plan YZ.
    """
    ox, oy, oz = lf["turret"]["origin"]
    hy, hz = lf["hinge"][1] - oy, lf["hinge"][2] - oz
    ay, az = lf["actuator_attach"]
    c, s = math.cos(theta), math.sin(theta)
    Ay = hy + ay * c - az * s
    Az = hz + ay * s + az * c
    by, bz = lf["actuator_base"][1] - oy, lf["actuator_base"][2] - oz
    phi = math.atan2(Az - bz, Ay - by)
    return (by, bz), (Ay, Az), phi


# ---------------------------------------------------------------------------
# Station complète
# ---------------------------------------------------------------------------

def trailer_wheel(cache, mats, t, detail="high"):
    """Roue M860 mutualisée ; « low » pour les véhicules d'arrière-plan fusionnés."""
    key = "trailer_wheel" if detail == "high" else "trailer_wheel_low"
    if key not in cache:
        cache[key] = build_wheel_mesh(
            mats, "PAT_Wheel_M860" + ("" if detail == "high" else "_Low"), t["tire_radius"],
            t["tire_half_width"], t["rim_radius"], "rib", nuts=10, detail=detail)
    return cache[key]


def build_launching_station(scene, spec, mats, name, parent=None,
                            location=(0.0, 0.0, 0.0), rotation=(0.0, 0.0, 0.0),
                            cache=None, hero=True):
    cache = cache if cache is not None else {}
    t = spec["trailer"]
    lf = spec["launcher"]
    c = spec["canister"]
    root = new_empty(scene, name, parent, location, rotation)
    made = {"root": root}

    if "trailer" not in cache:
        mb = MeshBuilder("PAT_Trailer_M860")
        build_trailer_frame(mb, t, "launcher")
        cache["trailer"] = mb.finish(mats)
    made["trailer"] = new_object(scene, name + "_Trailer", cache["trailer"], root)

    wheel = trailer_wheel(cache, mats, t, "high" if hero else "low")
    made["wheels"] = []
    for index, ay in enumerate(t["axles_y"], start=1):
        for side_key, side in (("L", -1.0), ("R", 1.0)):
            made["wheels"].append(new_object(
                scene, "%s_Wheel_%d%s" % (name, index, side_key), wheel,
                root, (side * t["track_half"], ay, t["tire_radius"]), wheel_rotation(side)))

    arm_cache = cache.setdefault("outrigger", {})
    made["outriggers"] = {}
    for key, cfg in t["outriggers"].items():
        made["outriggers"][key] = build_outrigger(
            scene, mats, "%s_Outrigger_%s" % (name, key), root, tuple(cfg["hinge"]),
            math.radians(cfg["stowed_yaw_deg"]), t["outrigger_arm_len"],
            t["outrigger_foot_drop"], arm_cache)

    if "leg" not in cache:
        mb = MeshBuilder("PAT_LandingLeg")
        mb.cyl((0.0, 0.0, 0.04), (0.0, 0.0, 0.8), 0.05, METAL, 12)
        mb.box(-0.16, 0.16, -0.12, 0.12, 0.0, 0.04, DARK, bevel=0.01)
        cache["leg"] = mb.finish(mats)
        mb = MeshBuilder("PAT_LandingLegSleeve")
        mb.cyl((0.0, 0.0, 0.56), (0.0, 0.0, t["deck_z"] - 0.2), 0.075, PAINT, 14)
        mb.box(-0.05, 0.05, -0.08, 0.08, t["deck_z"] - 0.5, t["deck_z"] - 0.2, DARK)
        cache["leg_sleeve"] = mb.finish(mats)
    made["legs"] = []
    for side_key, side in (("L", -1.0), ("R", 1.0)):
        x = side * t["landing_leg_x"]
        new_object(scene, "%s_LegSleeve_%s" % (name, side_key), cache["leg_sleeve"], root,
                   (x, t["landing_leg_y"], 0.0))
        made["legs"].append(new_object(scene, "%s_Leg_%s" % (name, side_key), cache["leg"],
                                       root, (x, t["landing_leg_y"],
                                              t["landing_leg_stowed_z"])))

    if "power_unit" not in cache:
        cache["power_unit"] = build_power_unit_mesh(mats, t["power_unit"])
    made["power_unit"] = new_object(scene, name + "_PowerUnit", cache["power_unit"], root,
                                    (0.0, 0.0, t["gooseneck"]["z_top"]))
    if "eles" not in cache:
        cache["eles"] = build_eles_mesh(mats, t["eles"])
    made["eles"] = new_object(scene, name + "_ELES", cache["eles"], root, (0.0, 0.0, t["deck_z"]))

    # tourelle de gisement (pivot sur son axe de rotation, au ras du plateau)
    tr = lf["turret"]
    if "turret" not in cache:
        cache["turret"] = build_turret_mesh(mats, lf)
    turret = new_object(scene, name + "_Turret", cache["turret"], root, tuple(tr["origin"]))
    made["turret"] = turret

    # mât de liaison sur la tourelle (section haute rentrée)
    m = lf["mast"]
    if "mast_lower" not in cache:
        cache["mast_lower"], cache["mast_upper"] = build_mast_meshes(mats, m)
    mast = new_object(scene, name + "_Mast", cache["mast_lower"], turret, tuple(m["base"]))
    made["mast"] = mast
    # Déployée, la section haute garde 0,3 m d'engagement dans le tube fixe.
    made["mast_top"] = new_object(scene, name + "_MastTop", cache["mast_upper"], mast,
                                  (0.0, 0.0, m["lower_len"] + m["upper_len"] - 0.6
                                   - m["stowed_drop"]))

    # masse élevée : pivot exactement sur la charnière
    hinge_local = (lf["hinge"][0] - tr["origin"][0], lf["hinge"][1] - tr["origin"][1],
                   lf["hinge"][2] - tr["origin"][2])
    if "launcher_frame" not in cache:
        cache["launcher_frame"] = build_launcher_frame_mesh(mats, lf, c)
    launcher = new_object(scene, name + "_Launcher", cache["launcher_frame"], turret,
                          hinge_local)
    made["launcher"] = launcher

    if "canister_closed" not in cache:
        cache["canister_closed"] = build_canister_mesh(mats, c, "PAT_Canister_MSE", True)
        cache["canister_open"] = build_canister_mesh(mats, c, "PAT_Canister_MSE_Live", False)
        cache["cover_rear"], cache["cover_front"] = build_cover_meshes(mats, c)
        cache["missile"] = build_missile_mesh(mats, spec)
        cache["fin"] = build_control_fin_mesh(mats, spec)
    live = {int(k): v for k, v in lf["live_cells"].items()} if hero else {}
    made["canisters"] = []
    made["missiles"] = {}
    # Les conteneurs non tirés ne bougent jamais par rapport au lanceur : ils
    # sont fusionnés en un seul bloc (3 matériaux, 3 appels de rendu au lieu
    # de 30). Seuls les conteneurs de tir restent des objets distincts.
    block_key = "canister_block_" + ("_".join(str(k) for k in sorted(live)) or "low")
    if not hero and "canister_low" not in cache:
        cache["canister_low"] = build_canister_low_mesh(mats, c)
    closed_mesh = cache["canister_closed"] if hero else cache["canister_low"]
    closed_parts = [
        (closed_mesh, Matrix.Translation((x, lf["rear_overhang"], z)))
        for index, (x, z) in enumerate(canister_positions(c), start=1)
        if index not in live
    ]
    if block_key not in cache:
        cache[block_key] = merge_meshes("PAT_Canister_Block_%d" % len(closed_parts),
                                        closed_parts, mats)
    made["canister_block"] = new_object(scene, name + "_Canisters", cache[block_key],
                                        launcher)
    for index, (x, z) in enumerate(canister_positions(c), start=1):
        if index not in live:
            continue
        can = new_object(scene, "%s_Canister_%02d" % (name, index), cache["canister_open"],
                         launcher, (x, lf["rear_overhang"], z))
        made["canisters"].append(can)
        if index in live:
            letter = live[index]
            new_object(scene, "%s_CoverRear_%02d" % (name, index), cache["cover_rear"], can)
            new_object(scene, "%s_CoverFront_%02d" % (name, index), cache["cover_front"], can)
            missile = new_object(scene, "%s_Missile_%s" % (name, letter), cache["missile"],
                                 can, (0.0, lf["missile_tail_offset"], 0.0))
            fins = []
            for k in range(4):
                loc, rot = fin_placement(spec, k, folded=True)
                fins.append(new_object(scene, "%s_Missile_%s_Fin%d" % (name, letter, k + 1),
                                       cache["fin"], missile, loc, rot))
            made["missiles"][letter] = missile
            made.setdefault("fins", {})[letter] = fins

    if "actuator_barrel" not in cache:
        cache["actuator_barrel"], cache["actuator_rod"] = build_actuator_meshes(
            mats, lf["actuator"])
    (by, bz), (Ay, Az), phi = actuator_pose(lf, 0.0)
    made["actuators"] = {}
    for side_key, side in (("L", -1.0), ("R", 1.0)):
        x = side * lf["actuator_base"][0]
        barrel = new_object(scene, "%s_ActuatorBarrel_%s" % (name, side_key),
                            cache["actuator_barrel"], turret, (x, by, bz), (phi, 0.0, 0.0))
        rod = new_object(scene, "%s_ActuatorRod_%s" % (name, side_key), cache["actuator_rod"],
                         turret, (x, Ay, Az), (phi, 0.0, 0.0))
        made["actuators"][side_key] = (barrel, rod)
    return made
