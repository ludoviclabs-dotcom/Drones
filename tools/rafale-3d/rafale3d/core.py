"""
core.py — briques géométriques du pipeline Rafale.

Le constructeur de maillage, les matrices et les matériaux reprennent ceux de
tools/patriot-3d/patriot3d/core.py (mêmes conventions, même déterminisme). Un
avion demande en plus des surfaces lissées : ce module ajoute le loft de
sections successives (fuselage, entrées d'air, verrière), les courbes fermées
de Catmull-Rom centripètes et l'interpolation monotone (PCHIP) des tables de
stations de la spec.

Conventions : repère Blender Z-up, +Y vers le nez, +X vers l'aile droite,
z = 0 au plan de la corde d'emplanture de l'aile, unités en mètres. La
géométrie est construite dans l'espace LOCAL de l'objet qui la porte.
"""

import math
from contextlib import contextmanager

import bmesh
import bpy
from mathutils import Matrix, Vector

# Au-delà de cet angle entre deux faces, l'arête est marquée vive. Les lofts
# (40 à 72 facettes par section) restent lissés ; bords de fuite et arêtes de
# carénage gardent une arête franche.
SHARP_EDGE_ANGLE_RAD = math.radians(34.0)


# ---------------------------------------------------------------------------
# Matrices utilitaires
# ---------------------------------------------------------------------------

def T(x=0.0, y=0.0, z=0.0):
    return Matrix.Translation((x, y, z))


def Rx(angle):
    return Matrix.Rotation(angle, 4, "X")


def Ry(angle):
    return Matrix.Rotation(angle, 4, "Y")


def Rz(angle):
    return Matrix.Rotation(angle, 4, "Z")


def Sc(sx, sy=None, sz=None):
    sy = sx if sy is None else sy
    sz = sx if sz is None else sz
    m = Matrix.Identity(4)
    m[0][0], m[1][1], m[2][2] = sx, sy, sz
    return m


def basis_for(direction):
    """Base orthonormée (d, u, w) avec d normalisé et u × w = d."""
    d = Vector(direction).normalized()
    helper = Vector((0.0, 0.0, 1.0)) if abs(d.z) < 0.9 else Vector((1.0, 0.0, 0.0))
    u = helper.cross(d).normalized()
    w = d.cross(u).normalized()
    return d, u, w


# ---------------------------------------------------------------------------
# Courbes et interpolations (pures, sans bpy)
# ---------------------------------------------------------------------------

def pchip(xs, ys):
    """
    Interpolant cubique monotone (Fritsch–Carlson) : aucune oscillation entre
    les stations de la spec, ce qui garde les lignes du fuselage tendues.
    Renvoie une fonction f(x), constante hors de [xs[0], xs[-1]].
    """
    n = len(xs)
    if n == 1:
        return lambda _x: ys[0]
    h = [xs[i + 1] - xs[i] for i in range(n - 1)]
    delta = [(ys[i + 1] - ys[i]) / h[i] for i in range(n - 1)]
    m = [0.0] * n
    m[0], m[-1] = delta[0], delta[-1]
    for i in range(1, n - 1):
        if delta[i - 1] * delta[i] <= 0.0:
            m[i] = 0.0
        else:
            w1 = 2.0 * h[i] + h[i - 1]
            w2 = h[i] + 2.0 * h[i - 1]
            m[i] = (w1 + w2) / (w1 / delta[i - 1] + w2 / delta[i])

    def f(x):
        if x <= xs[0]:
            return ys[0]
        if x >= xs[-1]:
            return ys[-1]
        k = 0
        while k < n - 2 and x > xs[k + 1]:
            k += 1
        t = (x - xs[k]) / h[k]
        t2, t3 = t * t, t * t * t
        return ((2 * t3 - 3 * t2 + 1) * ys[k] + (t3 - 2 * t2 + t) * h[k] * m[k]
                + (-2 * t3 + 3 * t2) * ys[k + 1] + (t3 - t2) * h[k] * m[k + 1])

    return f


def catmull_rom_closed(points, samples_per_segment, alpha=0.5):
    """
    Courbe fermée de Catmull-Rom centripète passant par ``points`` [(a, b)].
    Échantillonnage uniforme en paramètre, identique pour chaque segment : deux
    sections qui ont le même nombre de points de contrôle ont donc des sommets
    en correspondance, ce qu'exige le loft.
    """
    n = len(points)
    out = []
    for i in range(n):
        p0 = points[(i - 1) % n]
        p1 = points[i]
        p2 = points[(i + 1) % n]
        p3 = points[(i + 2) % n]

        def tj(ti, pa, pb):
            d = math.hypot(pb[0] - pa[0], pb[1] - pa[1])
            return ti + max(d, 1e-6) ** alpha

        t0 = 0.0
        t1 = tj(t0, p0, p1)
        t2 = tj(t1, p1, p2)
        t3 = tj(t2, p2, p3)
        for k in range(samples_per_segment):
            t = t1 + (t2 - t1) * k / samples_per_segment

            def lerp(pa, pb, ta, tb):
                if abs(tb - ta) < 1e-9:
                    return pa
                wa = (tb - t) / (tb - ta)
                wb = (t - ta) / (tb - ta)
                return (wa * pa[0] + wb * pb[0], wa * pa[1] + wb * pb[1])

            a1 = lerp(p0, p1, t0, t1)
            a2 = lerp(p1, p2, t1, t2)
            a3 = lerp(p2, p3, t2, t3)
            b1 = lerp(a1, a2, t0, t2)
            b2 = lerp(a2, a3, t1, t3)
            out.append(lerp(b1, b2, t1, t2))
    return out


def superellipse(a, b, n, count, phase=0.0, cx=0.0, cy=0.0):
    """Contour fermé (CCW) d'une super-ellipse de demi-axes a, b et d'exposant n."""
    pts = []
    for i in range(count):
        t = phase + 2.0 * math.pi * i / count
        c, s = math.cos(t), math.sin(t)
        x = a * math.copysign(abs(c) ** (2.0 / n), c)
        y = b * math.copysign(abs(s) ** (2.0 / n), s)
        pts.append((cx + x, cy + y))
    return pts


def airfoil(count, thickness, te_thickness=0.0012):
    """
    Profil symétrique type NACA 00xx, corde unitaire de 0 (bord d'attaque) à 1
    (bord de fuite). Renvoie ``count`` points (u, épaisseur relative) du
    dessus, bord de fuite d'abord, puis du dessous : un contour fermé.
    Répartition en cosinus : bord d'attaque arrondi, bord de fuite net.
    """
    half = []
    for i in range(count // 2 + 1):
        beta = math.pi * i / (count // 2)
        u = 0.5 * (1.0 - math.cos(beta))
        yt = 5.0 * thickness * (0.2969 * math.sqrt(u) - 0.1260 * u - 0.3516 * u * u
                                + 0.2843 * u ** 3 - 0.1036 * u ** 4)
        half.append((u, max(yt, te_thickness * 0.5 if u > 0.98 else yt)))
    upper = list(reversed(half))                 # BF -> BA, dessus
    lower = [(u, -y) for u, y in half[1:-1]]     # BA -> BF, dessous
    return upper + lower


# ---------------------------------------------------------------------------
# Constructeur de maillage
# ---------------------------------------------------------------------------

class MeshBuilder:
    """Accumule des primitives bmesh, avec une pile de transformations locales."""

    def __init__(self, name):
        self.name = name
        self.bm = bmesh.new()
        self.slots = []
        self._stack = [Matrix.Identity(4)]

    # -- pile de transformations ------------------------------------------
    @property
    def M(self):
        return self._stack[-1]

    def push(self, matrix):
        self._stack.append(self._stack[-1] @ matrix)

    def pop(self):
        if len(self._stack) > 1:
            self._stack.pop()

    @contextmanager
    def at(self, matrix):
        self.push(matrix)
        try:
            yield self
        finally:
            self.pop()

    # -- bas niveau ---------------------------------------------------------
    def slot(self, material):
        if material not in self.slots:
            self.slots.append(material)
        return self.slots.index(material)

    def vert(self, co):
        return self.bm.verts.new(self.M @ Vector(co))

    def face(self, verts, material):
        try:
            face = self.bm.faces.new(verts)
        except ValueError:
            return None
        face.material_index = self.slot(material)
        return face

    # -- loft de sections -------------------------------------------------
    def loft(self, rings, material, cap0=False, cap1=False, closed=True,
             materials=None, flip=False):
        """
        Relie des sections successives ``rings`` = [[(x, y, z), ...], ...] de
        même nombre de points par des quadrangles. Une section d'un seul point
        est un pôle (éventail de triangles). ``closed`` referme chaque section
        sur elle-même ; ``materials`` donne un matériau par tronçon.
        ``flip`` inverse l'orientation (faces intérieures d'un conduit).
        """
        vrings = [[self.vert(p) for p in ring] for ring in rings]
        faces = []
        for k in range(len(vrings) - 1):
            lo, hi = vrings[k], vrings[k + 1]
            mat = materials[k] if materials else material
            if len(lo) == 1 and len(hi) == 1:
                continue
            if len(lo) == 1 or len(hi) == 1:
                pole, ring = (lo[0], hi) if len(lo) == 1 else (hi[0], lo)
                n = len(ring)
                last = n if closed else n - 1
                for i in range(last):
                    j = (i + 1) % n
                    tri = [pole, ring[j], ring[i]] if len(lo) == 1 else [ring[i], ring[j], pole]
                    if flip:
                        tri.reverse()
                    faces.append(self.face(tri, mat))
                continue
            n = len(lo)
            last = n if closed else n - 1
            for i in range(last):
                j = (i + 1) % n
                quad = [lo[i], lo[j], hi[j], hi[i]]
                if flip:
                    quad.reverse()
                faces.append(self.face(quad, mat))
        if cap0 and len(vrings[0]) > 2:
            cap = list(reversed(vrings[0]))
            faces.append(self.face(cap if not flip else list(reversed(cap)),
                                   materials[0] if materials else material))
        if cap1 and len(vrings[-1]) > 2:
            cap = vrings[-1]
            faces.append(self.face(cap if not flip else list(reversed(cap)),
                                   materials[-1] if materials else material))
        return faces

    # -- boîtes -------------------------------------------------------------
    def box(self, x0, x1, y0, y1, z0, z1, material):
        x0, x1 = min(x0, x1), max(x0, x1)
        y0, y1 = min(y0, y1), max(y0, y1)
        z0, z1 = min(z0, z1), max(z0, z1)
        c = [
            (x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
            (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1),
        ]
        vs = [self.vert(p) for p in c]
        quads = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4),
                 (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
        return [self.face([vs[i] for i in q], material) for q in quads]

    def boxc(self, cx, cy, cz, sx, sy, sz, material):
        return self.box(cx - sx / 2, cx + sx / 2, cy - sy / 2, cy + sy / 2,
                        cz - sz / 2, cz + sz / 2, material)

    # -- extrusions ---------------------------------------------------------
    def prism(self, poly, axis, t0, t1, material, cap0=True, cap1=True):
        """Extrude un contour 2D ``poly`` [(a, b), ...] le long d'un axe local."""
        def place(a, b, t):
            if axis == "X":
                return (t, a, b)
            if axis == "Y":
                return (a, t, b)
            return (a, b, t)

        lo = [self.vert(place(a, b, t0)) for a, b in poly]
        hi = [self.vert(place(a, b, t1)) for a, b in poly]
        faces = []
        n = len(poly)
        for i in range(n):
            j = (i + 1) % n
            faces.append(self.face([lo[i], lo[j], hi[j], hi[i]], material))
        if cap0:
            faces.append(self.face(list(reversed(lo)), material))
        if cap1:
            faces.append(self.face(hi, material))
        return faces

    # -- révolutions --------------------------------------------------------
    def lathe(self, profile, material, segments=24, p0=(0.0, 0.0, 0.0),
              direction=(0.0, 1.0, 0.0), cap0=True, cap1=True, angle0=0.0,
              materials=None):
        """
        Surface de révolution autour de l'axe (p0, direction).
        ``profile`` = [(t, r), ...] avec t la position axiale depuis p0.
        Un rayon nul produit une pointe.
        """
        d, u, w = basis_for(direction)
        origin = Vector(p0)
        rings = []
        for t, r in profile:
            center = origin + d * t
            if r <= 1e-7:
                rings.append([tuple(center)])
                continue
            ring = []
            for i in range(segments):
                a = angle0 + 2.0 * math.pi * i / segments
                ring.append(tuple(center + r * (math.cos(a) * u + math.sin(a) * w)))
            rings.append(ring)
        return self.loft(rings, material, cap0=cap0, cap1=cap1, materials=materials)

    def cyl(self, p0, p1, radius, material, segments=16, r1=None, cap0=True,
            cap1=True, angle0=0.0):
        a, b = Vector(p0), Vector(p1)
        length = (b - a).length
        if length < 1e-7:
            return []
        return self.lathe([(0.0, radius), (length, radius if r1 is None else r1)],
                          material, segments, a, b - a, cap0, cap1, angle0)

    def disc(self, center, direction, radius, material, segments=24, angle0=0.0):
        d, u, w = basis_for(direction)
        c = Vector(center)
        ring = [self.vert(c + radius * (math.cos(angle0 + 2 * math.pi * i / segments) * u
                                        + math.sin(angle0 + 2 * math.pi * i / segments) * w))
                for i in range(segments)]
        return [self.face(ring, material)]

    def annulus(self, center, direction, r_in, r_out, material, segments=32):
        """Anneau plat (couronne) — cocardes."""
        d, u, w = basis_for(direction)
        c = Vector(center)
        inner, outer = [], []
        for i in range(segments):
            a = 2 * math.pi * i / segments
            e = math.cos(a) * u + math.sin(a) * w
            inner.append(self.vert(c + r_in * e))
            outer.append(self.vert(c + r_out * e))
        faces = []
        for i in range(segments):
            j = (i + 1) % segments
            faces.append(self.face([inner[i], outer[i], outer[j], inner[j]], material))
        return faces

    # -- tubes le long d'un chemin ---------------------------------------
    def tube(self, points, radius, material, segments=12, cap=True, radii=None):
        """Tube lisse suivant une polyligne (perche de ravitaillement, sondes)."""
        pts = [Vector(p) for p in points]
        if len(pts) < 2:
            return []
        tangents = []
        for i in range(len(pts)):
            a = pts[max(0, i - 1)]
            b = pts[min(len(pts) - 1, i + 1)]
            tangents.append((b - a).normalized())
        _, u, _ = basis_for(tangents[0])
        rings = []
        for i, (p, t) in enumerate(zip(pts, tangents)):
            if i > 0:
                u = (u - t * u.dot(t))
                if u.length < 1e-6:
                    _, u, _ = basis_for(t)
                u.normalize()
            w = t.cross(u).normalized()
            r = radius if radii is None else radii[i]
            rings.append([tuple(p + r * (math.cos(2 * math.pi * k / segments) * u
                                         + math.sin(2 * math.pi * k / segments) * w))
                          for k in range(segments)])
        return self.loft(rings, material, cap0=cap, cap1=cap)

    # -- surface portante -------------------------------------------------
    def lifting_surface(self, sections, material, count=36, cap_root=True,
                        cap_tip=True):
        """
        Surface portante (aile, plan canard, dérive) : loft de profils.
        ``sections`` = [dict(le=(x, y, z), chord, thickness, span_axis)] du
        pied vers le saumon. La corde est portée par -Y (du bord d'attaque vers
        le bord de fuite) ; l'épaisseur par ``normal`` (Z pour une aile, X
        pour une dérive).
        """
        rings = []
        for sec in sections:
            le = Vector(sec["le"])
            chord = sec["chord"]
            normal = Vector(sec.get("normal", (0.0, 0.0, 1.0))).normalized()
            chord_dir = Vector(sec.get("chord_dir", (0.0, -1.0, 0.0))).normalized()
            ring = []
            for u, t in airfoil(count, sec["thickness"]):
                ring.append(tuple(le + chord_dir * (u * chord) + normal * (t * chord)))
            rings.append(ring)
        return self.loft(rings, material, cap0=cap_root, cap1=cap_tip)

    # -- finalisation ---------------------------------------------------
    def finish(self, materials, weld=1e-5, recalc=True, sharp_angle=None):
        """bmesh -> data-block mesh (réutilisable par plusieurs objets)."""
        bm = self.bm
        if weld:
            bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=weld)
        if recalc:
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        limit = SHARP_EDGE_ANGLE_RAD if sharp_angle is None else sharp_angle
        for face in bm.faces:
            face.smooth = True
        for edge in bm.edges:
            if len(edge.link_faces) == 2:
                edge.smooth = edge.calc_face_angle(0.0) <= limit
            else:
                edge.smooth = False
        mesh = bpy.data.meshes.new(self.name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.validate(verbose=False)
        for slot_name in self.slots:
            mesh.materials.append(materials[slot_name])
        return mesh


# ---------------------------------------------------------------------------
# Objets
# ---------------------------------------------------------------------------

def link_object(scene, obj):
    scene.collection.objects.link(obj)
    return obj


def new_object(scene, name, mesh, parent=None, location=(0.0, 0.0, 0.0),
               rotation=(0.0, 0.0, 0.0)):
    """
    Objet à transformations explicites. Plusieurs objets peuvent partager le
    même data-block : l'exporteur glTF le mutualise en une seule mesh.
    """
    obj = bpy.data.objects.new(name, mesh)
    link_object(scene, obj)
    obj.location = location
    obj.rotation_mode = "XYZ"
    obj.rotation_euler = rotation
    if parent is not None:
        # parent_inverse laissé à l'identité : `location` EST l'offset local.
        obj.parent = parent
    return obj


def new_empty(scene, name, parent=None, location=(0.0, 0.0, 0.0),
              rotation=(0.0, 0.0, 0.0), size=0.5):
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_type = "PLAIN_AXES"
    obj.empty_display_size = size
    link_object(scene, obj)
    obj.location = location
    obj.rotation_mode = "XYZ"
    obj.rotation_euler = rotation
    if parent is not None:
        obj.parent = parent
    return obj


def merge_meshes(name, parts, materials):
    """
    Fusionne ``parts`` = [(mesh, Matrix)] en un nouveau data-block. Les slots
    de matériaux sont réunis par NOM ; les arêtes vives sont conservées.
    """
    combined = bmesh.new()
    slot_names = []
    for mesh, matrix in parts:
        tmp = bmesh.new()
        tmp.from_mesh(mesh)
        bmesh.ops.transform(tmp, matrix=matrix, verts=tmp.verts)
        remap = []
        for mat in mesh.materials:
            key = mat.name if mat else ""
            if key not in slot_names:
                slot_names.append(key)
            remap.append(slot_names.index(key))
        for face in tmp.faces:
            if remap:
                face.material_index = remap[min(face.material_index, len(remap) - 1)]
        tmp_mesh = bpy.data.meshes.new("__merge_tmp")
        tmp.to_mesh(tmp_mesh)
        tmp.free()
        combined.from_mesh(tmp_mesh)
        bpy.data.meshes.remove(tmp_mesh)
    out = bpy.data.meshes.new(name)
    combined.to_mesh(out)
    combined.free()
    for key in slot_names:
        out.materials.append(materials[key] if key else None)
    return out


# ---------------------------------------------------------------------------
# Matériaux PBR simples (aucune texture, aucune dépendance externe)
# ---------------------------------------------------------------------------

def srgb_to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hex_to_linear(hex_color):
    h = hex_color.lstrip("#")
    rgb = [int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]
    return tuple(srgb_to_linear(c) for c in rgb)


def ensure_materials(spec_materials):
    mats = {}
    for name, cfg in spec_materials.items():
        if name.startswith("_"):
            continue
        mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        rgb = hex_to_linear(cfg["color"])
        if bsdf is not None:
            bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
            bsdf.inputs["Roughness"].default_value = cfg.get("roughness", 0.8)
            bsdf.inputs["Metallic"].default_value = cfg.get("metallic", 0.0)
            emission = cfg.get("emission")
            if emission:
                erg = hex_to_linear(emission)
                bsdf.inputs["Emission Color"].default_value = (*erg, 1.0)
                bsdf.inputs["Emission Strength"].default_value = cfg.get(
                    "emission_strength", 1.0)
            else:
                bsdf.inputs["Emission Strength"].default_value = 0.0
            alpha = cfg.get("alpha")
            if alpha is not None:
                bsdf.inputs["Alpha"].default_value = alpha
        if cfg.get("alpha") is not None:
            try:
                mat.surface_render_method = "BLENDED"
            except AttributeError:
                pass
        mat.use_backface_culling = False
        mat.diffuse_color = (*rgb, cfg.get("alpha", 1.0))
        mat.metallic = cfg.get("metallic", 0.0)
        mat.roughness = cfg.get("roughness", 0.8)
        mats[name] = mat
    return mats
