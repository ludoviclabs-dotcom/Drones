"""
airframe.py — cellule du Rafale : fuselage, radôme, entrées d'air, verrière,
épine dorsale, tuyères et petits équipements extérieurs.

Toutes les cotes viennent de specs/rafale-f4.json et s'expriment en STATIONS :
``s`` est la distance au nez (m) le long de l'axe, convertie en y = y0 - s.
Les sections du fuselage sont définies par six points de contrôle (demi-section
droite, du dos au ventre) interpolés d'une station à l'autre (PCHIP) puis
refermés par symétrie en une courbe de Catmull-Rom : les lignes restent
tendues, sans ondulation, et chaque section a le même nombre de sommets.
"""

import math

from mathutils import Vector
from mathutils.bvhtree import BVHTree

from .core import MeshBuilder, catmull_rom_closed, pchip, superellipse


class Frame:
    """Conversion station -> repère Blender, et tables interpolées de la spec."""

    def __init__(self, spec):
        self.y0 = spec["frame"]["y0"]

    def p(self, x, s, z):
        return (x, self.y0 - s, z)


# ---------------------------------------------------------------------------
# Fuselage
# ---------------------------------------------------------------------------

class FuselageTable:
    def __init__(self, table):
        self.s = [row["s"] for row in table]
        count = len(table[0]["pts"])
        self.fx = []
        self.fz = []
        for k in range(count):
            self.fx.append(pchip(self.s, [row["pts"][k][0] for row in table]))
            self.fz.append(pchip(self.s, [row["pts"][k][1] for row in table]))

    def controls(self, s):
        return [(fx(s), fz(s)) for fx, fz in zip(self.fx, self.fz)]


def section_loop(half):
    """Demi-section [dos, ..., ventre] -> boucle fermée symétrique (dos -> droite -> ventre -> gauche)."""
    mirrored = [(-x, z) for x, z in reversed(half[1:-1])]
    return list(half) + mirrored


def fuselage_ring(frame, table, s, samples):
    loop = section_loop(table.controls(s))
    return [frame.p(x, s, z) for x, z in catmull_rom_closed(loop, samples)]


def station_series(breaks, spacing):
    """
    Stations entre les bornes ``breaks`` (strictement croissantes) avec un
    pas cible par intervalle.
    """
    if any(b <= a for a, b in zip(breaks[:-1], breaks[1:])):
        raise ValueError("station_series : bornes non croissantes %r" % (breaks,))
    out = []
    for (a, b), step in zip(zip(breaks[:-1], breaks[1:]), spacing):
        n = max(1, int(math.ceil((b - a) / step)))
        for i in range(n):
            out.append(a + (b - a) * i / n)
    out.append(breaks[-1])
    return out


def build_fuselage(spec, mats):
    """Radôme (objet distinct : antenne RBE2 inspectable) et fuselage."""
    frame = Frame(spec)
    fs = spec["fuselage"]
    table = FuselageTable(fs["stations"])
    samples = fs["samples_per_segment"]
    tip = fs["nose_tip"]
    joint = fs["radome_joint_s"]
    end = fs["stations"][-1]["s"]

    radome_s = station_series([fs["stations"][0]["s"], 0.35, 1.2, joint],
                              [0.07, 0.14, 0.2])
    radome = MeshBuilder("RAF_Radome")
    rings = [[frame.p(0.0, tip[0], tip[1])]]
    rings += [fuselage_ring(frame, table, s, samples) for s in radome_s if s > 1e-6]
    radome.loft(rings, "RAF_MAT_Radome", flip=True)

    body_s = station_series(fs["breaks"], fs["spacing"])
    body = MeshBuilder("RAF_Fuselage")
    rings = [fuselage_ring(frame, table, s, samples) for s in body_s if s >= joint - 1e-6]
    body.loft(rings, "RAF_MAT_Skin", cap1=True, flip=True)
    # culot sombre derrière les tuyères (invisible une fois les tuyères posées)
    return (radome.finish(mats, recalc=False),
            body.finish(mats, recalc=False),
            {"table": table, "end": end})


# ---------------------------------------------------------------------------
# Verrière, arceaux, épine dorsale
# ---------------------------------------------------------------------------

def canopy_arc(frame, s, half_w, z_sill, z_top, count, exponent=2.3, inset=0.0):
    """Arc de verrière de seuil à seuil, par le sommet (super-ellipse)."""
    pts = []
    for i in range(count + 1):
        phi = math.pi * i / count           # 0 = seuil droit, pi = seuil gauche
        c, s_ = math.cos(phi), math.sin(phi)
        x = (half_w - inset) * math.copysign(abs(c) ** (2.0 / exponent), c)
        z = z_sill + (z_top - z_sill - inset) * (abs(s_) ** (2.0 / exponent))
        pts.append(frame.p(x, s, z))
    return pts


def _canopy_tables(cs):
    ss = [row[0] for row in cs["profile"]]
    fw = pchip(ss, [row[1] for row in cs["profile"]])
    fsill = pchip(ss, [row[2] for row in cs["profile"]])
    ftop = pchip(ss, [row[3] for row in cs["profile"]])
    return ss, fw, fsill, ftop


def build_canopy(spec, mats):
    frame = Frame(spec)
    cs = spec["canopy"]
    ss, fw, fsill, ftop = _canopy_tables(cs)
    count = cs["arc_segments"]
    stations = station_series([ss[0], ss[-1]], [0.08])

    glass = MeshBuilder("RAF_Canopy")
    rings = [canopy_arc(frame, s, fw(s), fsill(s), ftop(s), count) for s in stations]
    glass.loft(rings, "RAF_MAT_Glass", closed=False, flip=True)

    frame_mb = MeshBuilder("RAF_CanopyFrame")
    for s in cs["arches_s"]:
        arc = canopy_arc(frame, s, fw(s) + 0.012, fsill(s), ftop(s) + 0.012, count)
        frame_mb.tube(arc, cs["arch_radius"], "RAF_MAT_Frame", segments=8)
    for side in (1.0, -1.0):
        sill = [frame.p(side * (fw(s) + 0.01), s, fsill(s) + 0.01)
                for s in station_series([ss[0] + 0.15, ss[-1] - 0.05], [0.25])]
        frame_mb.tube(sill, cs["sill_radius"], "RAF_MAT_Frame", segments=8)

    cockpit = MeshBuilder("RAF_Cockpit")
    ck = spec["cockpit"]
    # plancher sombre : ferme la cuve sous la glace
    fl = ck["floor"]
    cockpit.loft([[frame.p(x * fl["half_w"], s, fl["z"]) for x in (1.0, -1.0)]
                  for s in (fl["s0"], fl["s1"])], "RAF_MAT_Cockpit", closed=False)
    # casquette de planche de bord : capot arrondi, collimateur tête haute
    gl = ck["glareshield"]
    rings = []
    for s, hw, zt in gl["profile"]:
        rings.append([frame.p(hw * math.cos(math.pi * i / 8), s,
                              gl["z_base"] + (zt - gl["z_base"]) * math.sin(math.pi * i / 8))
                      for i in range(9)])
    cockpit.loft(rings, "RAF_MAT_Cockpit", closed=False, cap1=False)
    hud = ck["hud"]
    y_hud = frame.y0 - hud["s"]
    lean = hud["lean"]
    cockpit.face([cockpit.vert((-hud["half_w"], y_hud, hud["z0"])),
                  cockpit.vert((hud["half_w"], y_hud, hud["z0"])),
                  cockpit.vert((hud["half_w"], y_hud - lean, hud["z1"])),
                  cockpit.vert((-hud["half_w"], y_hud - lean, hud["z1"]))], "RAF_MAT_HudGlass")
    # siège éjectable : dossier et têtière en sections arrondies
    seat = ck["seat"]
    rings = []
    for z, hw, d in seat["profile"]:
        rings.append([frame.p(x, seat["s"] + v, z)
                      for x, v in superellipse(hw, d, 4.0, 16)])
    cockpit.loft(rings, "RAF_MAT_Seat", cap0=True, cap1=True, flip=True)
    # pilote : torse, épaules, casque et visière (silhouette)
    hm = ck["helmet"]
    rings = []
    for z, hw, d in ck["torso"]:
        rings.append([frame.p(x, hm["s"] + 0.08 + v, z)
                      for x, v in superellipse(hw, d, 2.6, 16)])
    cockpit.loft(rings, "RAF_MAT_Suit", cap0=True, cap1=True, flip=True)
    c = Vector(frame.p(0.0, hm["s"], hm["z"]))
    r = hm["r"]
    shell = [(-r * 0.95, 0.0), (-r * 0.8, r * 0.6), (-r * 0.4, r * 0.93), (0.0, r),
             (r * 0.45, r * 0.9), (r * 0.8, r * 0.58), (r, 0.0)]
    cockpit.lathe(shell, "RAF_MAT_Helmet", segments=18, p0=tuple(c), direction=(0.0, 0.0, 1.0),
                  cap0=True, cap1=False)
    cockpit.lathe([(0.0, r * 0.86), (r * 0.3, r * 0.8), (r * 0.52, r * 0.55), (r * 0.62, 0.0)],
                  "RAF_MAT_Visor", segments=16,
                  p0=tuple(c + Vector((0.0, r * 0.28, 0.0))),
                  direction=(0.0, 1.0, 0.12), cap0=False, cap1=False)
    return (glass.finish(mats, recalc=False), frame_mb.finish(mats),
            cockpit.finish(mats, recalc=False))


def build_spine(spec, mats):
    """Carénage dorsal : prolonge la verrière jusqu'au fuselage arrière."""
    frame = Frame(spec)
    sp = spec["spine"]
    ss = [row[0] for row in sp["profile"]]
    fw = pchip(ss, [row[1] for row in sp["profile"]])
    fsill = pchip(ss, [row[2] for row in sp["profile"]])
    ftop = pchip(ss, [row[3] for row in sp["profile"]])
    stations = station_series([ss[0], ss[-1]], [0.12])
    mb = MeshBuilder("RAF_Spine")
    rings = [canopy_arc(frame, s, fw(s), fsill(s), ftop(s), spec["canopy"]["arc_segments"],
                        exponent=sp["exponent"]) for s in stations]
    mb.loft(rings, "RAF_MAT_Skin", closed=False, flip=True)
    return mb.finish(mats, recalc=False)


# ---------------------------------------------------------------------------
# Entrées d'air
# ---------------------------------------------------------------------------

def build_intakes(spec, mats):
    """
    Deux entrées d'air semi-ventrales : coque extérieure, lèvre arrondie,
    conduit intérieur sombre fermé par une face moteur. Un seul loft par
    côté, de l'arrière de la coque à la lèvre puis dans le conduit.
    """
    frame = Frame(spec)
    it = spec["intakes"]
    rows = it["shell"]
    ss = [r["s"] for r in rows]
    fxc = pchip(ss, [r["xc"] for r in rows])
    fzc = pchip(ss, [r["zc"] for r in rows])
    fa = pchip(ss, [r["a"] for r in rows])
    fb = pchip(ss, [r["b"] for r in rows])
    n_exp = it["exponent"]
    count = it["segments"]
    t = it["lip_thickness"]
    s_lip = it["lip_s"]
    slant_z, slant_x = it["lip_slant_z"], it["lip_slant_x"]
    inner = it["duct"]

    def contour(s, grow, side, xc=None, zc=None, a=None, b=None, slant=0.0, s_shift=0.0):
        xc = fxc(s) if xc is None else xc
        zc = fzc(s) if zc is None else zc
        a = (fa(s) if a is None else a) + grow
        b = (fb(s) if b is None else b) + grow
        ring = []
        for u, v in superellipse(a, b, n_exp, count, phase=it["phase"]):
            x = xc + u
            z = zc + v
            ss_pt = s + s_shift + slant * (slant_z * v + slant_x * u)
            ring.append(frame.p(side * x, ss_pt, z))
        if side < 0:
            ring.reverse()
        return ring

    meshes = []
    mb = MeshBuilder("RAF_Intakes")
    for side in (1.0, -1.0):
        rings, mats_seq = [], []
        # de la lèvre vers l'arrière, puis parcourues de l'arrière vers l'avant
        shell_s = station_series([s_lip + 0.6, ss[-1]], [0.35])
        shell_s = sorted(set(round(v, 6) for v in shell_s), reverse=True)
        for s in shell_s:
            rings.append(contour(s, t, side))
            mats_seq.append("RAF_MAT_Skin")
        # approche de la lèvre : l'inclinaison du plan d'entrée s'installe
        for k, s in enumerate([s_lip + 0.3, s_lip + 0.1, s_lip]):
            rings.append(contour(s, t, side, slant=(k + 1) / 3.0))
            mats_seq.append("RAF_MAT_Skin")
        # lèvre arrondie : de la coque (a + t) au conduit (a), en avançant de t/2
        steps = it["lip_steps"]
        a_l, b_l = fa(s_lip), fb(s_lip)
        for j in range(1, steps + 1):
            psi = math.pi * j / steps
            grow = t * (1.0 + math.cos(psi)) / 2.0
            rings.append(contour(s_lip, grow, side, a=a_l, b=b_l, slant=1.0,
                                 s_shift=-(t * 0.5) * math.sin(psi)))
            mats_seq.append("RAF_MAT_Skin" if j < steps else "RAF_MAT_Intake")
        # conduit intérieur (sombre), qui se resserre et rentre vers l'axe
        for k, (ds, scale, dx) in enumerate(inner["rings"]):
            rings.append(contour(s_lip + ds, 0.0, side, xc=fxc(s_lip) - dx,
                                 a=a_l * scale, b=b_l * scale,
                                 slant=max(0.0, 1.0 - ds / 0.5)))
            mats_seq.append("RAF_MAT_Intake")
        mb.loft(rings, "RAF_MAT_Skin", cap1=True, flip=True, materials=mats_seq)
    meshes.append(mb.finish(mats, recalc=False))
    return meshes[0]


# ---------------------------------------------------------------------------
# Tuyères M88
# ---------------------------------------------------------------------------

def build_engines(spec, mats):
    frame = Frame(spec)
    en = spec["engines"]
    mb = MeshBuilder("RAF_Engines")
    petals = en["petals"]
    for side in (1.0, -1.0):
        axis_x = side * en["x"]
        base = Vector(frame.p(axis_x, en["s0"], en["z"]))
        prof = en["profile"]
        seg = en["segments"]
        rings = []
        mats_seq = []
        for k, (dt, r, mat) in enumerate(prof):
            center = base + Vector((0.0, -dt, 0.0))
            ring = []
            for i in range(seg):
                a = 2.0 * math.pi * i / seg
                scallop = 1.0
                if mat == "RAF_MAT_Nozzle" and dt > en["petal_start"]:
                    scallop = 1.0 + en["petal_depth"] * math.cos(petals * a)
                rr = r * scallop
                ring.append(tuple(center + Vector((rr * math.cos(a), 0.0, rr * math.sin(a)))))
            rings.append(ring)
            mats_seq.append(mat)
        mb.loft(rings, "RAF_MAT_Nozzle", cap1=True, materials=mats_seq)
        # anneau de post-combustion, au fond de la tuyère
        last_t = prof[-1][0]
        mb.disc(tuple(base + Vector((0.0, -last_t - 0.001, 0.0))), (0.0, 1.0, 0.0),
                prof[-1][1] * 0.98, "RAF_MAT_NozzleInner", segments=seg)
    # carénage central entre les deux tuyères
    cf = en["center_fairing"]
    rings = []
    for s, hw, zt, zb in cf:
        rings.append([frame.p(hw, s, zt), frame.p(-hw, s, zt), frame.p(-hw, s, zb),
                      frame.p(hw, s, zb)])
    mb.loft(rings, "RAF_MAT_Skin", cap1=True)
    return mb.finish(mats)


# ---------------------------------------------------------------------------
# Petits équipements : OSF, perche, canon, sondes, feux, cocardes
# ---------------------------------------------------------------------------

def build_osf(spec, mats):
    """Optronique secteur frontal : carénage à facettes et deux hublots."""
    frame = Frame(spec)
    o = spec["osf"]
    mb = MeshBuilder("RAF_OSF")
    rings = []
    for s, hw, z0, z1 in o["profile"]:
        rings.append([frame.p(hw, s, z0), frame.p(hw * 0.7, s, z1), frame.p(-hw * 0.7, s, z1),
                      frame.p(-hw, s, z0)])
    mb.loft(rings, "RAF_MAT_Skin", cap0=True, cap1=True, flip=True)
    for x, s, z, r in o["windows"]:
        mb.disc(frame.p(x, s, z), (0.0, 1.0, 0.18), r, "RAF_MAT_Sensor", segments=14)
    return mb.finish(mats)


def build_probe(spec, mats):
    """Perche de ravitaillement en vol fixe, côté droit, devant la verrière."""
    frame = Frame(spec)
    pr = spec["probe"]
    mb = MeshBuilder("RAF_Probe")
    pts = [frame.p(x, s, z) for x, s, z in pr["path"]]
    radii = pr["radii"]
    mb.tube(pts, radii[0], "RAF_MAT_Probe", segments=12, radii=radii)
    tip = pr["path"][-1]
    mb.cyl(frame.p(tip[0], tip[1] - 0.001, tip[2]), frame.p(tip[0], tip[1] - 0.12, tip[2]),
           pr["nozzle_radius"], "RAF_MAT_Frame", segments=12, r1=pr["nozzle_radius"] * 0.6)
    return mb.finish(mats)


def build_gun(spec, mats):
    """
    Canon de 30 mm : bouche et carénage sur le flanc droit, à la jonction du
    dessus de l'entrée d'air et du fuselage, sous le plan canard.
    """
    frame = Frame(spec)
    g = spec["gun"]
    mb = MeshBuilder("RAF_Gun")
    x, s, z = g["muzzle"]
    mb.lathe([(0.0, g["fairing_radius"] * 0.6), (0.12, g["fairing_radius"]),
              (g["fairing_length"], g["fairing_radius"] * 0.9),
              (g["fairing_length"] + 0.25, 0.0)],
             "RAF_MAT_Skin", segments=16, p0=frame.p(x, s, z), direction=(0.0, -1.0, 0.0),
             cap0=False, cap1=False)
    mb.disc(frame.p(x, s - 0.002, z), (0.0, 1.0, 0.0), g["fairing_radius"] * 0.55,
            "RAF_MAT_Intake", segments=16)
    return mb.finish(mats)


def build_details(spec, mats):
    """Sondes, antennes et feux de position : fusionnés au fuselage."""
    frame = Frame(spec)
    d = spec["details"]
    mb = MeshBuilder("RAF_Details")
    for x, s, z, length, r in d["pitots"]:
        mb.cyl(frame.p(x, s, z), frame.p(x, s - length, z), r, "RAF_MAT_Frame", segments=8,
               r1=r * 0.5)
    for x, s, z, length, w, h in d["blades"]:
        mb.boxc(x, frame.y0 - s, z + h / 2, w, length, h, "RAF_MAT_Skin")
    # Feux de position : dômes posés sur le dessus des rails de saumon, derrière
    # leur carénage avant (qui les enfermerait), à côté du MICA IR emporté.
    for x, s, z, r, mat in d["lights"]:
        mb.lathe([(0.0, r), (r * 0.8, r * 0.6), (r * 1.2, 0.0)], mat, segments=10,
                 p0=frame.p(x, s, z), direction=(0.0, 0.0, 1.0), cap0=True, cap1=False)
    return mb.finish(mats)


def build_roundels(spec, mats, targets=()):
    """
    Cocardes tricolores : disques concentriques, puis plaqués sur la peau.
    Chaque sommet est projeté le long de la normale de sa cocarde sur les
    maillages ``targets`` (entrées d'air, voilure), en gardant l'étagement de
    2 à 3 mm entre les couleurs : la cocarde épouse la courbure au lieu de
    flotter à côté ou de s'enfoncer dans la peau.
    """
    frame = Frame(spec)
    rd = spec["roundels"]
    mb = MeshBuilder("RAF_Roundels")
    r = rd["radius"]
    centers = []
    for x, s, z, nx, ny, nz in rd["placements"]:
        n = Vector((nx, ny, nz)).normalized()
        c = Vector(frame.p(x, s, z))
        centers.append((c, n))
        mb.disc(tuple(c + n * 0.003), tuple(n), r * 0.34, "RAF_MAT_RoundelBlue", segments=28)
        mb.annulus(tuple(c + n * 0.0025), tuple(n), r * 0.34, r * 0.67, "RAF_MAT_RoundelWhite",
                   segments=28)
        mb.annulus(tuple(c + n * 0.002), tuple(n), r * 0.67, r, "RAF_MAT_RoundelRed",
                   segments=28)
    mesh = mb.finish(mats, recalc=False)
    if targets:
        _conform_to_skin(mesh, centers, targets, rd.get("skin_gap", 0.0015))
    return mesh


def _conform_to_skin(mesh, centers, targets, gap):
    trees = [BVHTree.FromPolygons([v.co.copy() for v in t.vertices],
                                  [tuple(p.vertices) for p in t.polygons]) for t in targets]
    missed = 0
    for v in mesh.vertices:
        c, n = min(centers, key=lambda cn: (v.co - cn[0]).length)
        lift = (v.co - c).dot(n)
        origin = v.co + n * 0.4
        best = None
        for tree in trees:
            hit, _normal, _index, dist = tree.ray_cast(origin, -n, 1.0)
            if hit is not None and (best is None or dist < best[1]):
                best = (hit, dist)
        if best is None:
            missed += 1
            continue
        v.co = best[0] + n * (gap + lift)
    if missed:
        raise RuntimeError("cocardes : %d sommets hors de la peau" % missed)
    mesh.update()
