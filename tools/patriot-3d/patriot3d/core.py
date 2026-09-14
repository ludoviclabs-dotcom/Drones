"""
core.py — briques géométriques communes du pipeline Patriot.

Toute la géométrie est construite en bmesh, dans l'espace LOCAL de l'objet qui
la porte : les pivots exportés sont donc exactement les origines choisies, sans
transformation à appliquer après coup. Un ``MeshBuilder`` accumule des
primitives (boîtes chanfreinées, révolutions, extrusions, tubes) et associe
chaque face à un matériau NOMMÉ ; l'ordre des slots est celui de la première
utilisation.

Conventions (identiques à tools/thundart-3d) : repère Blender Z-up, +Y vers
l'avant du véhicule, z = 0 au plan de contact des roues, unités en mètres.
"""

import math
from contextlib import contextmanager

import bmesh
import bpy
from mathutils import Matrix, Vector

# Au-delà de cet angle entre deux faces, l'arête est marquée vive. Les surfaces
# de révolution (24 à 32 facettes) restent lissées ; les chanfreins à 45° des
# caisses gardent une arête franche qui accroche la lumière.
SHARP_EDGE_ANGLE_RAD = math.radians(31.0)


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


def V(*co):
    if len(co) == 1:
        return Vector(co[0])
    return Vector(co)


def basis_for(direction):
    """Base orthonormée (u, w) perpendiculaire à ``direction`` avec u × w = d."""
    d = Vector(direction).normalized()
    helper = Vector((0.0, 0.0, 1.0)) if abs(d.z) < 0.9 else Vector((1.0, 0.0, 0.0))
    u = helper.cross(d).normalized()
    w = d.cross(u).normalized()
    return d, u, w


def rounded_rect(half_w, half_h, radius, corner_segments=3, cx=0.0, cy=0.0):
    """Contour 2D (CCW) d'un rectangle à coins arrondis."""
    r = max(0.0, min(radius, half_w, half_h))
    pts = []
    corners = [
        (cx + half_w - r, cy + half_h - r, 0.0),
        (cx - half_w + r, cy + half_h - r, 0.5 * math.pi),
        (cx - half_w + r, cy - half_h + r, math.pi),
        (cx + half_w - r, cy - half_h + r, 1.5 * math.pi),
    ]
    for ccx, ccy, a0 in corners:
        if r <= 1e-6:
            pts.append((ccx, ccy))
            continue
        for i in range(corner_segments + 1):
            a = a0 + 0.5 * math.pi * i / corner_segments
            pts.append((ccx + r * math.cos(a), ccy + r * math.sin(a)))
    return pts


def chamfered_rect(half_w, half_h, c, cx=0.0, cy=0.0):
    """Contour 2D (CCW) d'un rectangle à coins chanfreinés."""
    c = max(0.0, min(c, half_w, half_h))
    return [
        (cx + half_w, cy - half_h + c), (cx + half_w, cy + half_h - c),
        (cx + half_w - c, cy + half_h), (cx - half_w + c, cy + half_h),
        (cx - half_w, cy + half_h - c), (cx - half_w, cy - half_h + c),
        (cx - half_w + c, cy - half_h), (cx + half_w - c, cy - half_h),
    ]


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
        self._uv_jobs = []

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

    def _bevel(self, faces, amount):
        if amount <= 0.0:
            return
        # Liste dédoublonnée dans l'ordre des faces : un `set` d'arêtes
        # itérerait selon les adresses mémoire, et l'ordre des faces produites
        # par le biseau (donc le GLB) changerait d'un build à l'autre.
        edges = []
        seen = set()
        for face in faces:
            if face is None:
                continue
            for edge in face.edges:
                if edge not in seen:
                    seen.add(edge)
                    edges.append(edge)
        if not edges:
            return
        bmesh.ops.bevel(
            self.bm, geom=edges, offset=amount, offset_type="OFFSET",
            segments=1, profile=0.5, affect="EDGES", clamp_overlap=True,
            material=-1, loop_slide=True)

    # -- boîtes -------------------------------------------------------------
    def box(self, x0, x1, y0, y1, z0, z1, material, bevel=0.0):
        """Boîte alignée sur les axes locaux, chanfreinée si ``bevel`` > 0."""
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
        faces = [self.face([vs[i] for i in q], material) for q in quads]
        limit = 0.45 * min(x1 - x0, y1 - y0, z1 - z0)
        self._bevel(faces, min(bevel, limit))
        return faces

    def boxc(self, cx, cy, cz, sx, sy, sz, material, bevel=0.0):
        """Boîte définie par son centre et ses dimensions complètes."""
        return self.box(cx - sx / 2, cx + sx / 2, cy - sy / 2, cy + sy / 2,
                        cz - sz / 2, cz + sz / 2, material, bevel)

    def wedge(self, x0, x1, y0, y1, z0, z1_front, z1_back, material, bevel=0.0):
        """Boîte dont le dessus est incliné (hauteur z1_front en y1, z1_back en y0)."""
        c = [
            (x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
            (x0, y0, z1_back), (x1, y0, z1_back), (x1, y1, z1_front), (x0, y1, z1_front),
        ]
        vs = [self.vert(p) for p in c]
        quads = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4),
                 (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
        faces = [self.face([vs[i] for i in q], material) for q in quads]
        self._bevel(faces, bevel)
        return faces

    # -- extrusions ---------------------------------------------------------
    def prism(self, poly, axis, t0, t1, material, bevel=0.0, cap0=True, cap1=True):
        """
        Extrude un contour 2D ``poly`` [(a, b), ...] le long d'un axe local.

        axis = "X" : contour dans le plan (Y, Z), extrusion de x=t0 à x=t1
        axis = "Y" : contour dans le plan (X, Z), extrusion de y=t0 à y=t1
        axis = "Z" : contour dans le plan (X, Y), extrusion de z=t0 à z=t1
        """
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
        self._bevel(faces, bevel)
        return faces

    def plate(self, poly, axis, center, thickness, material, bevel=0.0):
        """Plaque d'épaisseur ``thickness`` centrée sur ``center`` le long de ``axis``."""
        return self.prism(poly, axis, center - thickness / 2, center + thickness / 2,
                          material, bevel)

    # -- révolutions --------------------------------------------------------
    def lathe(self, profile, material, segments=24, p0=(0.0, 0.0, 0.0),
              direction=(0.0, 1.0, 0.0), cap0=True, cap1=True, angle0=0.0,
              materials=None):
        """
        Surface de révolution autour de l'axe (p0, direction).
        ``profile`` = [(t, r), ...] avec t la position axiale depuis p0.
        Un rayon nul produit une pointe (éventail de triangles).
        ``materials`` (optionnel) donne un matériau par tronçon de profil.
        """
        d, u, w = basis_for(direction)
        origin = Vector(p0)
        rings = []
        for t, r in profile:
            center = origin + d * t
            if r <= 1e-7:
                rings.append([self.vert(center)])
                continue
            ring = []
            for i in range(segments):
                a = angle0 + 2.0 * math.pi * i / segments
                ring.append(self.vert(center + r * (math.cos(a) * u + math.sin(a) * w)))
            rings.append(ring)

        faces = []
        for k in range(len(rings) - 1):
            lo, hi = rings[k], rings[k + 1]
            mat = materials[k] if materials else material
            if len(lo) == 1 and len(hi) == 1:
                continue
            if len(lo) == 1:
                for i in range(segments):
                    j = (i + 1) % segments
                    faces.append(self.face([lo[0], hi[j], hi[i]], mat))
            elif len(hi) == 1:
                for i in range(segments):
                    j = (i + 1) % segments
                    faces.append(self.face([lo[i], lo[j], hi[0]], mat))
            else:
                for i in range(segments):
                    j = (i + 1) % segments
                    faces.append(self.face([lo[i], lo[j], hi[j], hi[i]], mat))
        if cap0 and len(rings[0]) > 2:
            faces.append(self.face(list(reversed(rings[0])),
                                   materials[0] if materials else material))
        if cap1 and len(rings[-1]) > 2:
            faces.append(self.face(rings[-1],
                                   materials[-1] if materials else material))
        return faces

    def cyl(self, p0, p1, radius, material, segments=16, r1=None, cap0=True,
            cap1=True, angle0=0.0):
        """Cylindre (ou tronc de cône si ``r1``) entre deux points locaux."""
        a, b = Vector(p0), Vector(p1)
        length = (b - a).length
        if length < 1e-7:
            return []
        return self.lathe([(0.0, radius), (length, radius if r1 is None else r1)],
                          material, segments, a, b - a, cap0, cap1, angle0)

    def ring(self, p0, direction, r_in, r_out, width, material, segments=24):
        """Anneau épais (collerette) : cylindre creux fermé."""
        d = Vector(direction).normalized()
        start = Vector(p0)
        return self.lathe([(0.0, r_in), (0.0, r_out), (width, r_out), (width, r_in),
                           (0.0, r_in)], material, segments, start, d,
                          cap0=False, cap1=False)

    def disc(self, center, direction, radius, material, segments=24):
        d, u, w = basis_for(direction)
        c = Vector(center)
        ring = [self.vert(c + radius * (math.cos(2 * math.pi * i / segments) * u
                                        + math.sin(2 * math.pi * i / segments) * w))
                for i in range(segments)]
        return [self.face(ring, material)]

    # -- tubes le long d'un chemin ---------------------------------------
    def tube(self, points, radius, material, segments=10, cap=True):
        """Tube lisse suivant une polyligne (flexibles, mains courantes)."""
        pts = [Vector(p) for p in points]
        if len(pts) < 2:
            return []
        tangents = []
        for i in range(len(pts)):
            a = pts[max(0, i - 1)]
            b = pts[min(len(pts) - 1, i + 1)]
            tangents.append((b - a).normalized())
        # Transport parallèle du repère pour éviter les torsions.
        _, u, _ = basis_for(tangents[0])
        rings = []
        for i, (p, t) in enumerate(zip(pts, tangents)):
            if i > 0:
                u = (u - t * u.dot(t))
                if u.length < 1e-6:
                    _, u, _ = basis_for(t)
                u.normalize()
            w = t.cross(u).normalized()
            scale = 1.0
            if 0 < i < len(pts) - 1:
                cos_half = max(0.5, (pts[i] - pts[i - 1]).normalized().dot(t))
                scale = 1.0 / cos_half
            ring = [self.vert(p + radius * scale * (math.cos(2 * math.pi * k / segments) * u
                                                    + math.sin(2 * math.pi * k / segments) * w))
                    for k in range(segments)]
            rings.append(ring)
        faces = []
        for k in range(len(rings) - 1):
            lo, hi = rings[k], rings[k + 1]
            for i in range(segments):
                j = (i + 1) % segments
                faces.append(self.face([lo[i], lo[j], hi[j], hi[i]], material))
        if cap:
            faces.append(self.face(list(reversed(rings[0])), material))
            faces.append(self.face(rings[-1], material))
        return faces

    def beam(self, p0, p1, width, height, material, up=(0.0, 0.0, 1.0), bevel=0.0):
        """Poutre rectangulaire entre deux points (entretoises, bras, longerons)."""
        a, b = Vector(p0), Vector(p1)
        axis = b - a
        length = axis.length
        if length < 1e-7:
            return []
        d = axis.normalized()
        up_v = Vector(up)
        side = d.cross(up_v)
        if side.length < 1e-6:
            side = d.cross(Vector((1.0, 0.0, 0.0)))
        side.normalize()
        up_v = side.cross(d).normalized()
        frame = Matrix((
            (side.x, d.x, up_v.x, a.x),
            (side.y, d.y, up_v.y, a.y),
            (side.z, d.z, up_v.z, a.z),
            (0.0, 0.0, 0.0, 1.0),
        ))
        with self.at(frame):
            return self.box(-width / 2, width / 2, 0.0, length, -height / 2,
                            height / 2, material, bevel)

    # -- UV planaires ---------------------------------------------------
    def planar_uv(self, faces, origin, u_axis, v_axis, u_size, v_size):
        """
        Réserve une projection UV planaire pour ``faces`` (repère LOCAL courant).
        Utilisé par les rares faces qui reçoivent une texture générée côté Web.
        """
        o = self.M @ Vector(origin)
        rot = self.M.to_3x3()
        ua = (rot @ Vector(u_axis)).normalized()
        va = (rot @ Vector(v_axis)).normalized()
        self._uv_jobs.append(([f for f in faces if f is not None], o, ua, va,
                              u_size, v_size))

    # -- finalisation ---------------------------------------------------
    def finish(self, materials, weld=1e-5, recalc=True):
        """bmesh -> data-block mesh (réutilisable par plusieurs objets)."""
        bm = self.bm
        if self._uv_jobs:
            layer = bm.loops.layers.uv.new("UVMap")
            for faces, o, ua, va, us, vs in self._uv_jobs:
                for face in faces:
                    if not face.is_valid:
                        continue
                    for loop in face.loops:
                        rel = loop.vert.co - o
                        loop[layer].uv = (rel.dot(ua) / us, rel.dot(va) / vs)
        if weld:
            bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=weld)
        if recalc:
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        for face in bm.faces:
            face.smooth = True
        for edge in bm.edges:
            if len(edge.link_faces) == 2:
                edge.smooth = edge.calc_face_angle(0.0) <= SHARP_EDGE_ANGLE_RAD
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
    même data-block : l'exporteur glTF le mutualise en une seule mesh
    instanciée, ce qui évite de dupliquer roues, conteneurs ou vérins.
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


# ---------------------------------------------------------------------------
# Fusion de maillages statiques (réduction des appels de rendu)
# ---------------------------------------------------------------------------

def merge_meshes(name, parts, materials):
    """
    Fusionne ``parts`` = [(mesh, Matrix)] en un nouveau data-block. Les slots
    de matériaux sont réunis par NOM ; les arêtes vives et les UV sont
    conservées. Aucun mesh source n'est modifié (ils peuvent rester partagés).
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


def collect_meshes(root):
    """Tous les objets maillés sous ``root`` (récursif), avec leur matrice relative."""
    root_inv = root.matrix_world.inverted()
    parts = []
    stack = list(root.children)
    while stack:
        obj = stack.pop()
        stack.extend(obj.children)
        if obj.type == "MESH":
            parts.append((obj.data, root_inv @ obj.matrix_world))
    return parts


def delete_hierarchy(root):
    stack = [root]
    doomed = []
    while stack:
        obj = stack.pop()
        doomed.append(obj)
        stack.extend(obj.children)
    for obj in doomed:
        bpy.data.objects.remove(obj, do_unlink=True)


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
        mat.diffuse_color = (*rgb, 1.0)
        mat.metallic = cfg.get("metallic", 0.0)
        mat.roughness = cfg.get("roughness", 0.8)
        mats[name] = mat
    return mats
