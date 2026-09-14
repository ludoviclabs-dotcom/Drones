"""
stores.py — emports : Meteor, MICA IR / EM, AASM Hammer, bidons, nacelle
Talios, pylônes et adaptateurs.

Chaque emport est construit dans son repère LOCAL : axe du corps sur +Y (nez
vers +Y), origine au milieu de la longueur, sur l'axe. Les emports d'un même
type partagent un seul data-block (instanciation glTF). Silhouettes
extérieures seulement : aucun composant interne n'est représenté.
"""

import math

from mathutils import Vector

from .core import MeshBuilder, pchip


def _split_at_bands(profile, bands, default):
    """
    Insère un rang de profil à chaque bord de bande (rayon interpolé, matériau
    du tronçon coupé) : chaque bande devient un tronçon à part entière. Sans
    cela, une bande étroite tombée au milieu d'un long tronçon disparaîtrait.
    """
    rows = [tuple(row) for row in profile]
    for y0, y1, _mat in bands:
        for y in (y0, y1):
            for k in range(len(rows) - 1):
                ya, yb = rows[k][0], rows[k + 1][0]
                if ya + 1e-6 < y < yb - 1e-6:
                    t = (y - ya) / (yb - ya)
                    r = rows[k][1] + (rows[k + 1][1] - rows[k][1]) * t
                    mat = rows[k][2] if len(rows[k]) > 2 else default
                    rows.insert(k + 1, (y, r, mat))
                    break
    return rows


def _body(mb, profile, segments, bands=None, default="RAF_MAT_Missile"):
    """
    Corps de révolution le long de +Y. ``profile`` = [(y, r, mat?)], de la
    queue au nez. ``bands`` = [(y0, y1, mat)] recolore les tronçons compris,
    après découpe du profil à leurs bords.
    """
    if bands:
        profile = _split_at_bands(profile, bands, default)
    pts = [(row[0], row[1]) for row in profile]
    mats = []
    for k in range(len(profile) - 1):
        mat = profile[k][2] if len(profile[k]) > 2 else default
        if bands:
            y_mid = 0.5 * (profile[k][0] + profile[k + 1][0])
            for y0, y1, band_mat in bands:
                if y0 <= y_mid <= y1:
                    mat = band_mat
        mats.append(mat)
    y_first = pts[0][0]
    return mb.lathe([(y - y_first, r) for y, r in pts], default, segments=segments,
                    p0=(0.0, y_first, 0.0), direction=(0.0, 1.0, 0.0), cap0=True,
                    cap1=True, materials=mats + [mats[-1]])


def _fin(mb, angle, r_body, y_root_te, root_chord, tip_chord, span, sweep, thickness, mat):
    """Ailette trapézoïdale plate, rayonnant à ``angle`` autour de l'axe +Y."""
    radial = Vector((math.cos(angle), 0.0, math.sin(angle)))
    normal = Vector((-math.sin(angle), 0.0, math.cos(angle)))
    fwd = Vector((0.0, 1.0, 0.0))
    root_le = y_root_te + root_chord
    tip_te = y_root_te + sweep
    tip_le = tip_te + tip_chord
    base = radial * (r_body * 0.92)
    tip = radial * (r_body + span)
    outline = [base + fwd * y_root_te, base + fwd * root_le, tip + fwd * tip_le,
               tip + fwd * tip_te]
    h = thickness / 2
    top = [mb.vert(tuple(p + normal * h)) for p in outline]
    bot = [mb.vert(tuple(p - normal * h)) for p in outline]
    faces = [mb.face(top, mat), mb.face(list(reversed(bot)), mat)]
    for i in range(4):
        j = (i + 1) % 4
        faces.append(mb.face([bot[i], bot[j], top[j], top[i]], mat))
    return faces


def _ogive(y_base, length, radius, steps=8, blunt=0.0):
    """Profil d'ogive tangente (de la base vers la pointe)."""
    out = []
    rho = (radius * radius + length * length) / (2.0 * radius)
    for k in range(steps + 1):
        t = length * k / steps
        x = length - t
        r = math.sqrt(max(rho * rho - (length - x) ** 2, 0.0)) + radius - rho
        r = max(r, 0.0)
        if k == steps:
            r = blunt
        out.append((y_base + t, r))
    return out


# ---------------------------------------------------------------------------
# Missiles
# ---------------------------------------------------------------------------

def build_meteor(spec, mats):
    m = spec["stores"]["meteor"]
    L, R = m["length"], m["radius"]
    y_tail, y_nose = -L / 2, L / 2
    mb = MeshBuilder("RAF_Meteor")
    nose_len = m["nose_length"]
    profile = [(y_tail, R * 0.62, "RAF_MAT_Exhaust"), (y_tail + 0.012, R * 0.9),
               (y_tail + 0.03, R)]
    profile += [(y, R) for y in (y_tail + 0.4, 0.0)]
    # radôme blanc : ogive et court tronçon cylindrique (rendu MBDA)
    profile.append((y_nose - m["radome_length"], R, "RAF_MAT_MissileRadome"))
    profile.append((y_nose - nose_len, R, "RAF_MAT_MissileRadome"))
    ogive = _ogive(y_nose - nose_len, nose_len, R, steps=8, blunt=0.0)
    profile += [(y, r, "RAF_MAT_MissileRadome") for y, r in ogive[1:]]
    bands = [(b[0], b[1], b[2]) for b in m["bands"]]
    _body(mb, profile, m["segments"], bands=bands)
    # prises d'air du statoréacteur : deux carénages ventraux à ±45°
    it = m["intakes"]
    for sgn in (1.0, -1.0):
        ang = -math.pi / 2 + sgn * math.radians(it["angle_from_bottom_deg"])
        radial = Vector((math.cos(ang), 0.0, math.sin(ang)))
        tang = Vector((-math.sin(ang), 0.0, math.cos(ang)))
        rings = []
        mats_seq = []
        for y, scale in it["stations"]:
            c = radial * (R + it["height"] * 0.5 * scale - 0.006)
            hw = it["half_width"] * (0.35 + 0.65 * scale)
            hh = it["height"] * 0.5 * scale
            ring = [c + tang * hw + radial * hh, c - tang * hw + radial * hh,
                    c - tang * hw - radial * hh, c + tang * hw - radial * hh]
            rings.append([tuple(p + Vector((0.0, y, 0.0))) for p in ring])
            mats_seq.append("RAF_MAT_Missile")
        mb.loft(rings, "RAF_MAT_Missile", cap0=False, cap1=True,
                materials=mats_seq[:-1] + ["RAF_MAT_Exhaust"], flip=sgn < 0)
    fn = m["fins"]
    for k in range(4):
        _fin(mb, math.radians(45.0 + 90.0 * k), R, y_tail + fn["y_offset"], fn["root_chord"],
             fn["tip_chord"], fn["span"], fn["sweep"], fn["thickness"], "RAF_MAT_Missile")
    return mb.finish(mats)


def build_mica(spec, mats, variant):
    m = spec["stores"]["mica"]
    L, R = m["length"], m["radius"]
    y_tail, y_nose = -L / 2, L / 2
    name = "RAF_Mica" + variant
    mb = MeshBuilder(name)
    nose_len = m["nose_length"]
    profile = [(y_tail, R * 0.6, "RAF_MAT_Exhaust"), (y_tail + 0.01, R * 0.92),
               (y_tail + 0.03, R), (0.0, R), (y_nose - nose_len, R)]
    if variant == "IR":
        # dôme d'autodirecteur infrarouge : ogive courte émoussée, dôme vitré
        ogive = _ogive(y_nose - nose_len, nose_len * 0.72, R, steps=6, blunt=R * 0.58)
        profile += [(y, r) for y, r in ogive[1:]]
        tip_y = ogive[-1][0]
        profile += [(tip_y + 0.03, R * 0.5, "RAF_MAT_Seeker"),
                    (tip_y + 0.055, R * 0.34, "RAF_MAT_Seeker"),
                    (tip_y + 0.07, 0.0, "RAF_MAT_Seeker")]
    else:
        ogive = _ogive(y_nose - nose_len, nose_len, R, steps=8, blunt=0.0)
        profile += [(y, r, "RAF_MAT_MissileRadome") for y, r in ogive[1:]]
    _body(mb, profile, m["segments"], bands=[tuple(b) for b in m["bands"]])
    st = m["strakes"]
    for k in range(4):
        _fin(mb, math.radians(45.0 + 90.0 * k), R, st["y0"], st["y1"] - st["y0"],
             st["tip_chord"], st["span"], st["sweep"], st["thickness"], "RAF_MAT_Missile")
    fn = m["fins"]
    for k in range(4):
        _fin(mb, math.radians(45.0 + 90.0 * k), R, y_tail + fn["y_offset"], fn["root_chord"],
             fn["tip_chord"], fn["span"], fn["sweep"], fn["thickness"], "RAF_MAT_Missile")
    return mb.finish(mats)


def build_hammer(spec, mats):
    """AASM Hammer (kit de guidage avant, corps de bombe, kit propulsif arrière)."""
    h = spec["stores"]["hammer"]
    mb = MeshBuilder("RAF_Hammer")
    profile = [tuple(row) for row in h["profile"]]
    _body(mb, profile, h["segments"], default="RAF_MAT_Hammer")
    for fin in (h["canards"], h["tail_fins"]):
        for k in range(4):
            _fin(mb, math.radians(45.0 + 90.0 * k), fin["r"], fin["y_te"], fin["root_chord"],
                 fin["tip_chord"], fin["span"], fin["sweep"], fin["thickness"],
                 "RAF_MAT_HammerKit")
    # fenêtre d'autodirecteur au nez
    tip = profile[-1][0]
    mb.disc((0.0, tip + 0.0005, 0.0), (0.0, 1.0, 0.0), h["window_radius"], "RAF_MAT_Seeker",
            segments=14)
    return mb.finish(mats)


# ---------------------------------------------------------------------------
# Bidons, nacelle, pylônes
# ---------------------------------------------------------------------------

def build_tank(spec, mats, key):
    t = spec["stores"][key]
    L, R = t["length"], t["radius"]
    mb = MeshBuilder("RAF_" + ("Tank" if key == "tank_wing" else "TankCenter"))
    y_tail, y_nose = -L / 2, L / 2
    profile = [(y_tail, 0.0), (y_tail + 0.05, R * 0.2)]
    tail = t["tail_length"]
    for k in range(1, 6):
        f = k / 5
        profile.append((y_tail + tail * f, R * (0.2 + 0.8 * math.sin(f * math.pi / 2))))
    profile.append((y_nose - t["nose_length"], R))
    profile += _ogive(y_nose - t["nose_length"], t["nose_length"], R, steps=9, blunt=0.0)[1:]
    _body(mb, profile, t["segments"], default="RAF_MAT_Tank")
    return mb.finish(mats)


def build_talios(spec, mats):
    p = spec["stores"]["talios"]
    mb = MeshBuilder("RAF_Talios")
    L, R = p["length"], p["radius"]
    y_tail = -L / 2
    profile = [(y_tail, 0.0), (y_tail + 0.08, R * 0.55), (y_tail + 0.35, R),
               (L / 2 - p["head_length"], R)]
    _body(mb, profile, 20, default="RAF_MAT_Pod")
    # tête optronique : boule orientable et hublots
    hc = Vector((0.0, L / 2 - p["head_length"] * 0.45, 0.0))
    hr = p["head_radius"]
    sphere = []
    for k in range(9):
        a = -math.pi / 2 + math.pi * k / 8
        sphere.append((math.sin(a) * hr, math.cos(a) * hr))
    mb.lathe(sphere, "RAF_MAT_Pod", segments=20, p0=tuple(hc), direction=(0.0, 1.0, 0.0),
             cap0=False, cap1=False)
    for ang, rr in p["windows"]:
        d = Vector((0.0, math.cos(math.radians(ang)), -math.sin(math.radians(ang))))
        mb.disc(tuple(hc + d * (hr + 0.002)), tuple(d), rr, "RAF_MAT_PodGlass", segments=16)
    return mb.finish(mats)


def _blade(mb, y0, y1, y0b, y1b, z_top, z_bot, half_t, mat, count=12):
    """Pylône en lame : contours profilés au sommet et à la base, reliés."""
    def contour(ya, yb, z):
        chord = ya - yb
        pts = []
        for i in range(count):
            a = 2 * math.pi * i / count
            u = 0.5 * (1 - math.cos(a))           # 0 -> 1 -> 0 le long de la corde
            thick = half_t * (1.0 - (2 * u - 1) ** 6) ** 0.5
            side = 1.0 if math.sin(a) >= 0 else -1.0
            pts.append((side * max(thick, 0.004), ya - u * chord, z))
        return pts
    rings = [contour(y0, y1, z_top), contour(y0b, y1b, z_bot)]
    mb.loft(rings, mat, cap0=True, cap1=True)


def build_pylon(spec, mats, key):
    """Pylône générique ; origine au point d'accrochage (sous la voilure)."""
    p = spec["pylons"][key]
    mb = MeshBuilder("RAF_Pylon_" + key)
    _blade(mb, p["chord_top"] / 2, -p["chord_top"] / 2,
           p["chord_bottom"] / 2 + p["bottom_shift"], -p["chord_bottom"] / 2 + p["bottom_shift"],
           p["z_top"], -p["height"], p["half_thickness"], "RAF_MAT_Pylon")
    if p.get("launcher"):
        ln = p["launcher"]
        mb.box(-ln["half_width"], ln["half_width"], -ln["length"] / 2 + ln["shift"],
               ln["length"] / 2 + ln["shift"], -p["height"] - ln["height"],
               -p["height"] + 0.01, "RAF_MAT_Pylon")
    return mb.finish(mats)
