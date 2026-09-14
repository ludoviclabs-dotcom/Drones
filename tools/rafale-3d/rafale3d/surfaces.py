"""
surfaces.py — voilure delta, plans canard, dérive et carénages SPECTRA.

Chaque surface est un loft de profils symétriques (type NACA 00xx) : bord
d'attaque arrondi, bord de fuite net. L'aile est découpée dans la corde en un
caisson fixe et deux élevons par côté ; les plans canard sont monoblocs et
pivotent autour d'un axe transversal : ces pièces sont des objets distincts
dont l'origine est posée sur l'articulation, pour que la planche Web puisse
les braquer sans calcul de pivot.
"""

import math

from mathutils import Vector

from .airframe import Frame
from .core import MeshBuilder, T, pchip


def airfoil_segment(count, thickness, u0, u1):
    """
    Contour fermé d'un tronçon de profil entre les fractions de corde u0 et u1
    (0 = bord d'attaque, 1 = bord de fuite), dessus puis dessous. Même nombre
    de points pour toutes les sections d'un loft qui partagent (u0 == 0).
    """
    def yt(u):
        u = min(max(u, 0.0), 1.0)
        return 5.0 * thickness * (0.2969 * math.sqrt(u) - 0.1260 * u - 0.3516 * u * u
                                  + 0.2843 * u ** 3 - 0.1036 * u ** 4)

    n = count // 2
    us = [u0 + (u1 - u0) * 0.5 * (1.0 - math.cos(math.pi * i / n)) for i in range(n + 1)]
    upper = [(u, max(yt(u), 0.0008)) for u in reversed(us)]
    if u0 <= 1e-9:
        lower = [(u, -max(yt(u), 0.0008)) for u in us[1:]]
    else:
        lower = [(u, -max(yt(u), 0.0008)) for u in us]
    return upper + lower


def _surface_rings(sections, count, u0, u1):
    rings = []
    for sec in sections:
        le = Vector(sec["le"])
        chord_dir = Vector(sec["chord_dir"]).normalized()
        normal = Vector(sec["normal"]).normalized()
        a = sec.get("u0", u0)
        b = sec.get("u1", u1)
        ring = []
        for u, t in airfoil_segment(count, sec["thickness"], a, b):
            ring.append(tuple(le + chord_dir * (u * sec["chord"]) + normal * (t * sec["chord"])))
        rings.append(ring)
    return rings


# ---------------------------------------------------------------------------
# Aile delta
# ---------------------------------------------------------------------------

class WingGeometry:
    def __init__(self, spec):
        w = spec["wing"]
        self.frame = Frame(spec)
        self.le_s0 = w["le_s_at_x0"]
        self.le_tan = math.tan(math.radians(w["le_sweep_deg"]))
        self.te_s0 = w["te_s_at_x0"]
        self.te_slope = w["te_slope"]
        self.dihedral = math.tan(math.radians(w["dihedral_deg"]))
        xs = [row[0] for row in w["thickness"]]
        self.fthk = pchip(xs, [row[1] for row in w["thickness"]])
        self.z0 = w["z"]

    def le_s(self, x):
        return self.le_s0 + self.le_tan * x

    def te_s(self, x):
        return self.te_s0 + self.te_slope * x

    def chord(self, x):
        return self.te_s(x) - self.le_s(x)

    def z(self, x):
        return self.z0 + self.dihedral * x

    def section(self, x, side, **extra):
        sec = {
            "le": self.frame.p(side * x, self.le_s(x), self.z(x)),
            "chord": self.chord(x),
            "chord_dir": (0.0, -1.0, 0.0),
            "normal": (0.0, 0.0, 1.0),
            "thickness": self.fthk(x),
        }
        sec.update(extra)
        return sec


def build_wing(spec, mats, side):
    """Caisson de voilure d'un côté (sans élevons) + rail de saumon."""
    w = spec["wing"]
    geo = WingGeometry(spec)
    frame = geo.frame
    count = w["profile_points"]
    name = "RAF_Wing_" + ("R" if side > 0 else "L")
    mb = MeshBuilder(name)
    e = w["elevons"]
    x_in, x_mid, x_out = e["x_inner"], e["x_split"], e["x_outer"]
    x_root, x_tip = w["x_root"], w["x_tip"]

    def hinge_u(x):
        return 1.0 - e["chord"] / geo.chord(x)

    # tronçon d'emplanture (corde complète), puis tronçon à élevons, puis saumon
    panels = [
        [x_root, x_in - 0.02],
        [x_in - 0.02, x_in + 0.01] + [x_in + (x_out - x_in) * k / 6 for k in range(1, 6)]
        + [x_out - 0.01, x_out + 0.02],
        [x_out + 0.02, x_tip],
    ]
    # le tronçon central porte des sections tronquées à la charnière
    for idx, xs in enumerate(panels):
        xs = sorted(set(round(v, 5) for v in xs))
        if idx == 0:
            xs = [x_root, (x_root + x_in) / 2, x_in - 0.02]
        secs = []
        for x in xs:
            if idx == 1 and x_in <= x <= x_out:
                secs.append(geo.section(x, side, u1=hinge_u(x)))
            else:
                secs.append(geo.section(x, side))
        rings = _surface_rings(secs, count, 0.0, 1.0)
        mb.loft(rings, "RAF_MAT_Skin", cap0=(idx == 0), cap1=(idx == 2), flip=(side > 0))

    # rail lance-missile de saumon (MICA IR)
    r = w["tip_rail"]
    xr = side * (x_tip + r["offset"])
    s0, s1 = r["s0"], r["s1"]
    zr = geo.z(x_tip)
    mb.box(xr - r["half_width"], xr + r["half_width"], frame.y0 - s1, frame.y0 - s0,
           zr - r["half_height"], zr + r["half_height"], "RAF_MAT_Pylon")
    mb.lathe([(0.0, 0.0), (0.18, r["half_height"] * 1.1), (0.4, r["half_height"] * 1.2)],
             "RAF_MAT_Pylon", segments=10, p0=frame.p(xr, s0 - 0.35, zr),
             direction=(0.0, -1.0, 0.0), cap0=False, cap1=True)
    return mb.finish(mats)


def build_elevon(spec, mats, side, which):
    """Élevon : origine sur la charnière, braquage autour de l'axe X local."""
    w = spec["wing"]
    geo = WingGeometry(spec)
    e = w["elevons"]
    count = w["profile_points"]
    x0, x1 = ((e["x_inner"] + 0.01, e["x_split"] - 0.015) if which == "In"
              else (e["x_split"] + 0.015, e["x_outer"] - 0.01))
    xm = 0.5 * (x0 + x1)
    # charnière : la ligne u = 1 - chord_e / corde, au milieu de l'épaisseur
    hinge_s = geo.te_s(xm) - e["chord"]
    origin = Vector(geo.frame.p(side * xm, hinge_s, geo.z(xm)))
    name = "RAF_Elevon_%s_%s" % ("R" if side > 0 else "L", which)
    mb = MeshBuilder(name)
    with mb.at(T(*(-origin))):
        secs = []
        for x in [x0 + (x1 - x0) * k / 4 for k in range(5)]:
            u_h = 1.0 - e["chord"] / geo.chord(x)
            secs.append(geo.section(x, side, u0=u_h + 0.004, u1=1.0))
        rings = _surface_rings(secs, count, 0.0, 1.0)
        mb.loft(rings, "RAF_MAT_Skin", cap0=True, cap1=True, flip=(side > 0))
    return mb.finish(mats), tuple(origin)


# ---------------------------------------------------------------------------
# Plans canard
# ---------------------------------------------------------------------------

def build_canard(spec, mats, side):
    c = spec["canard"]
    frame = Frame(spec)
    count = c["profile_points"]
    tan_le = math.tan(math.radians(c["le_sweep_deg"]))
    dih = math.tan(math.radians(c["dihedral_deg"]))
    x_root, x_tip = c["x_root"], c["x_tip"]
    pivot_s = c["root_le_s"] + c["pivot_fraction"] * c["root_chord"]
    origin = Vector(frame.p(side * c["pivot_x"], pivot_s, c["z_root"]))
    name = "RAF_Canard_" + ("R" if side > 0 else "L")
    mb = MeshBuilder(name)
    secs = []
    for k in range(7):
        x = x_root + (x_tip - x_root) * k / 6
        f = (x - x_root) / (x_tip - x_root)
        le_s = c["root_le_s"] + tan_le * (x - x_root)
        chord = c["root_chord"] + (c["tip_chord"] - c["root_chord"]) * f
        secs.append({
            "le": frame.p(side * x, le_s, c["z_root"] + dih * (x - x_root)),
            "chord": chord,
            "chord_dir": (0.0, -1.0, 0.0),
            "normal": (0.0, 0.0, 1.0),
            "thickness": c["thickness"],
        })
    with mb.at(T(*(-origin))):
        rings = _surface_rings(secs, count, 0.0, 1.0)
        mb.loft(rings, "RAF_MAT_Skin", cap0=True, cap1=True, flip=(side > 0))
        # axe de pivot : petit fût dans le fuselage
        mb.cyl(tuple(origin + Vector((-side * 0.18, 0.0, 0.0))),
               tuple(origin + Vector((side * 0.02, 0.0, 0.0))), 0.05, "RAF_MAT_Frame",
               segments=10)
    return mb.finish(mats), tuple(origin)


# ---------------------------------------------------------------------------
# Dérive et carénages SPECTRA
# ---------------------------------------------------------------------------

def build_fin(spec, mats):
    f = spec["fin"]
    frame = Frame(spec)
    count = f["profile_points"]
    tan_le = math.tan(math.radians(f["le_sweep_deg"]))
    mb = MeshBuilder("RAF_Fin")
    secs = []
    for k in range(8):
        fr = k / 7
        z = f["z_root"] + (f["z_tip"] - f["z_root"]) * fr
        le_s = f["root_le_s"] + tan_le * (z - f["z_root"])
        chord = f["root_chord"] + (f["tip_chord"] - f["root_chord"]) * fr
        secs.append({
            "le": frame.p(0.0, le_s, z),
            "chord": chord,
            "chord_dir": (0.0, -1.0, 0.0),
            "normal": (1.0, 0.0, 0.0),
            "thickness": f["thickness_root"] + (f["thickness_tip"] - f["thickness_root"]) * fr,
        })
    rings = _surface_rings(secs, count, 0.0, 1.0)
    mb.loft(rings, "RAF_MAT_Skin", cap0=True, cap1=True, flip=False)
    return mb.finish(mats)


def _pod(mb, frame, s0, s1, x, z, half_w, half_h, nose, tail, mat, nose_mat=None,
         segments=16):
    """Carénage allongé à section ovale, nez arrondi, queue effilée."""
    length = s1 - s0
    profile = [(0.0, 0.0)]
    for k in range(1, 5):
        a = k / 4 * math.pi / 2
        profile.append((nose * (1 - math.cos(a)), math.sin(a)))
    profile.append((length - tail, 1.0))
    profile.append((length - tail * 0.4, 0.75))
    profile.append((length, 0.25))
    rings = []
    mats_seq = []
    for t, r in profile:
        s = s0 + t
        if r <= 1e-6:
            rings.append([frame.p(x, s, z)])
        else:
            ring = []
            for i in range(segments):
                a = 2 * math.pi * i / segments
                ring.append(frame.p(x + half_w * r * math.cos(a), s, z + half_h * r * math.sin(a)))
            rings.append(ring)
        mats_seq.append(nose_mat if (nose_mat and t < nose) else mat)
    mb.loft(rings, mat, cap1=True, materials=mats_seq[:-1] + [mat], flip=True)


def build_spectra(spec, mats):
    """Antennes et détecteurs SPECTRA visibles : sommet de dérive, avant, pied de dérive."""
    sp = spec["spectra"]
    frame = Frame(spec)
    mb = MeshBuilder("RAF_Spectra")
    for pod in sp["pods"]:
        _pod(mb, frame, pod["s0"], pod["s1"], pod["x"], pod["z"], pod["half_w"],
             pod["half_h"], pod["nose"], pod["tail"], "RAF_MAT_Spectra",
             nose_mat="RAF_MAT_Dielectric")
    return mb.finish(mats)
