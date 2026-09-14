"""
missile.py — silhouette extérieure de l'intercepteur PAC-3 MSE.

Formes publiques (Lockheed Martin, photographies d'essais) : radôme conique,
avant-corps d'environ 10 in, section de contrôle d'attitude (couronnes de
petits orifices) juste derrière l'autodirecteur, décrochement vers le corps
moteur de 11,4 in, quatre ailettes fixes longues et basses sur le moteur,
quatre gouvernes arrière REPLIABLES (repliées dans le conteneur, déployées à la
sortie du tube). Livrée d'essai lue sur les photos de tirs publiques : nez
argent, avant-corps orange à bande blanche, moteur sable, arrière orange,
gouvernes noires.

Aucun composant interne n'est modélisé : ni autodirecteur, ni moteur, ni
charge, ni électronique.

Repère local : axe du corps sur +Y (pointe vers +Y), pivot au CULOT (y = 0) —
une avance de ``s`` le long de +Y local suffit à décrire le départ côté Web.
Les gouvernes sont des objets enfants : pivot sur leur ligne d'articulation.
"""

import math

from .core import MeshBuilder, Ry

ORANGE = "PAT_MAT_MissileOrange"
SAND = "PAT_MAT_MissileSand"
WHITE = "PAT_MAT_MissileWhite"
SILVER = "PAT_MAT_MissileSilver"
DARK = "PAT_MAT_PaintDark"
BLACK = "PAT_MAT_Black"


def _band_material(y, m):
    """Livrée d'essai : matériau du tronçon qui commence en ``y``."""
    if y < 0.66:
        return ORANGE
    if y < m["step_y"]:
        return SAND
    wb0, wb1 = m["white_band"]
    if wb0 <= y < wb1:
        return WHITE
    return ORANGE


def build_missile_mesh(materials, spec, name="PAT_PAC3_MSE"):
    m = spec["missile"]
    L = m["length"]
    r_aft = m["motor_radius"]
    r_fwd = m["forebody_radius"]
    step_y = m["step_y"]
    seg = m.get("segments", 28)
    mb = MeshBuilder(name)

    # --- culot : dôme aplati et tuyère en retrait
    mb.lathe([(0.03, r_aft * 0.24), (0.0, r_aft * 0.34)], BLACK, seg, cap0=True, cap1=False)
    mb.lathe([(0.0, r_aft * 0.34), (0.012, r_aft * 0.62), (0.035, r_aft * 0.84),
              (0.07, r_aft * 0.96), (0.11, r_aft)], ORANGE, seg, cap0=False, cap1=False)

    # --- corps : tronçons de livrée, décrochement court vers l'avant-corps
    y_nose = L - m["nose_length"]
    stations = sorted({0.11, 0.66, step_y, step_y + m["step_len"], y_nose,
                       *m["white_band"]})
    profile = []
    for y in stations:
        if y <= step_y:
            r = r_aft
        elif y >= step_y + m["step_len"]:
            r = r_fwd
        else:
            r = r_aft + (r_fwd - r_aft) * (y - step_y) / m["step_len"]
        profile.append((y, r))
    for (y0, r0), (y1, r1) in zip(profile[:-1], profile[1:]):
        mb.lathe([(y0, r0), (y1, r1)], _band_material(y0, m), seg, cap0=False, cap1=False)

    # --- nez : cône gris puis radôme argent, bague orange à sa base
    y_radome = L - m["radome_length"]
    cone = []
    n = 16
    for i in range(n + 1):
        t = i / n
        y = y_nose + m["nose_length"] * t
        cone.append((y, max(0.003, r_fwd * (1.0 - t) ** 1.08)))
    cone.append((L + 0.003, 0.0))
    split = next(i for i, (y, _) in enumerate(cone) if y >= y_radome)
    mb.lathe(cone[:split + 1], "PAT_MAT_Metal", seg, cap0=False, cap1=False)
    mb.lathe(cone[split:], SILVER, seg, cap0=False, cap1=False)
    r_ring = r_fwd * (1.0 - (y_radome - y_nose) / m["nose_length"]) ** 1.08
    mb.ring((0.0, y_radome - 0.012, 0.0), (0.0, 1.0, 0.0), r_ring - 0.004, r_ring + 0.003,
            0.024, ORANGE, seg)

    # --- jonctions de tronçons (bagues fines en léger relief)
    for y in m["joint_stations"]:
        r = r_aft if y < step_y else r_fwd
        mb.ring((0.0, y - 0.01, 0.0), (0.0, 1.0, 0.0), r - 0.002, r + 0.003, 0.02, DARK, seg)

    # --- section de contrôle d'attitude : couronnes de petits orifices
    acs = m["acm_section"]
    for row in range(acs["rows"]):
        y = acs["y0"] + (acs["y1"] - acs["y0"]) * (row + 0.5) / acs["rows"]
        for k in range(acs["per_row"]):
            a = 2.0 * math.pi * (k + 0.5 * (row % 2)) / acs["per_row"]
            c, s = math.cos(a), math.sin(a)
            mb.cyl((r_fwd * 0.985 * c, y, r_fwd * 0.985 * s),
                   (r_fwd * 1.006 * c, y, r_fwd * 1.006 * s),
                   acs["port_radius"], BLACK, segments=5, cap0=False)

    # --- goulottes de câblage (dessus et dessous)
    rw = m["raceway"]
    for side in (1.0, -1.0):
        for y0, y1, r0 in ((rw["y0"], step_y - 0.06, r_aft),
                           (step_y + m["step_len"] + 0.04, rw["y1"], r_fwd)):
            za, zb = side * (r0 - 0.004), side * (r0 + rw["height"])
            mb.box(-rw["half_width"], rw["half_width"], y0, y1, min(za, zb), max(za, zb),
                   DARK, bevel=0.004)

    # --- ailettes fixes longues et basses sur le moteur (en X)
    st = m["strakes"]
    for k in range(4):
        a = 0.25 * math.pi + 0.5 * math.pi * k
        with mb.at(Ry(-a)):
            poly = [(r_aft - 0.004, st["y0"]), (r_aft - 0.004, st["y1"]),
                    (r_aft + st["height"], st["y1"] - 0.12),
                    (r_aft + st["height"], st["y0"] + 0.06)]
            mb.prism(poly, "Z", -st["thickness"] / 2, st["thickness"] / 2, SAND)

    # --- carénages d'actionneurs des gouvernes
    cf = m["control_fins"]
    for k in range(4):
        a = 0.25 * math.pi + 0.5 * math.pi * k
        with mb.at(Ry(-a)):
            mb.box(r_aft - 0.012, r_aft + 0.022, cf["y0"] - 0.03, cf["y1"] + 0.05,
                   -0.026, 0.026, DARK, bevel=0.005)
    return mb.finish(materials)


def build_control_fin_mesh(materials, spec, name="PAT_PAC3_MSE_Fin"):
    """Gouverne repliable : ligne d'articulation sur l'axe Y local (x = 0)."""
    cf = spec["missile"]["control_fins"]
    mb = MeshBuilder(name)
    poly = [(0.0, cf["y0"]), (0.0, cf["y1"]),
            (cf["span"], cf["y1"] - cf["tip_sweep"]),
            (cf["span"], cf["y1"] - cf["tip_sweep"] - cf["tip_chord"])]
    mb.prism(poly, "Z", -cf["thickness"] / 2, cf["thickness"] / 2, BLACK, bevel=0.002)
    # ferrure d'articulation
    mb.cyl((0.0, cf["y0"] + 0.02, 0.0), (0.0, cf["y1"] - 0.02, 0.0), 0.012, DARK, 8)
    return mb.finish(materials)


def fin_placement(spec, k, folded=True):
    """Position et rotation (euler XYZ) de la gouverne ``k`` dans le repère missile."""
    m = spec["missile"]
    a = 0.25 * math.pi + 0.5 * math.pi * k
    r = m["motor_radius"]
    fold = math.radians(m["control_fins"]["folded_deg"]) if folded else 0.0
    return (r * math.cos(a), 0.0, r * math.sin(a)), (0.0, -a + fold, 0.0)
