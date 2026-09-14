"""
assembly.py — assemble le Rafale et ses emports, puis exporte le GLB.

Chaque sous-ensemble inspectable reste un objet distinct (radôme, OSF,
verrière, plans canard, voilure, élevons, dérive, SPECTRA, tuyères, perche,
canon) ; les emports d'un même type partagent leur maillage. Le GLB ne porte
aucune animation : les braquages de gouvernes, l'attitude de l'avion et le
départ des munitions sont des fonctions pures du temps côté Web.

Les nœuds pilotés côté Web (gouvernes, emports) sont des empties : voir
``pivot_object``.
"""

from pathlib import Path

import bpy

from . import airframe, stores, surfaces
from .core import ensure_materials, new_empty, new_object

STORE_NODE = {
    "tank_wing": "RAF_Tank_%s",
    "tank_center": "RAF_TankCenter",
    "mica_em": "RAF_MicaEM_%s",
    "mica_ir": "RAF_MicaIR_%s",
    "meteor": "RAF_Meteor_%s",
    "hammer": "RAF_Hammer_%s",
    "talios": "RAF_Talios",
}


def pivot_object(scene, name, mesh, parent, location):
    """
    Nœud piloté côté Web : un empty ``name`` porte la transformation (charnière
    d'une gouverne, point d'emport d'une munition) et le maillage devient son
    enfant ``name + "_Mesh"``, à l'origine locale.

    La quantification meshopt ré-exprime la transformation de chaque nœud de
    maillage sur la boîte englobante du maillage (translation + échelle). Sans
    cet empty, la charnière serait perdue (la gouverne pivoterait sur son
    milieu) et tout enfant ajouté côté Web — la flamme d'une munition —
    hériterait de l'échelle de quantification.
    """
    pivot = new_empty(scene, name, parent, location)
    new_object(scene, name + "_Mesh", mesh, pivot)
    return pivot


def build(scene, spec):
    mats = ensure_materials(spec["materials"])
    root = new_empty(scene, "RAF_Root")
    air = new_empty(scene, "RAF_Airframe", root)

    radome, fuselage, _info = airframe.build_fuselage(spec, mats)
    new_object(scene, "RAF_Fuselage", fuselage, air)
    new_object(scene, "RAF_Radome", radome, air)
    new_object(scene, "RAF_Spine", airframe.build_spine(spec, mats), air)
    intakes = airframe.build_intakes(spec, mats)
    new_object(scene, "RAF_Intakes", intakes, air)
    glass, frame, cockpit = airframe.build_canopy(spec, mats)
    new_object(scene, "RAF_Cockpit", cockpit, air)
    new_object(scene, "RAF_CanopyFrame", frame, air)
    new_object(scene, "RAF_Canopy", glass, air)
    new_object(scene, "RAF_OSF", airframe.build_osf(spec, mats), air)
    new_object(scene, "RAF_Probe", airframe.build_probe(spec, mats), air)
    new_object(scene, "RAF_Gun", airframe.build_gun(spec, mats), air)
    new_object(scene, "RAF_Engines", airframe.build_engines(spec, mats), air)
    new_object(scene, "RAF_Details", airframe.build_details(spec, mats), air)

    wings = []
    for side, tag in ((1.0, "R"), (-1.0, "L")):
        wing = surfaces.build_wing(spec, mats, side)
        wings.append(wing)
        new_object(scene, "RAF_Wing_" + tag, wing, air)
        for which in ("In", "Out"):
            mesh, origin = surfaces.build_elevon(spec, mats, side, which)
            pivot_object(scene, "RAF_Elevon_%s_%s" % (tag, which), mesh, air, origin)
        mesh, origin = surfaces.build_canard(spec, mats, side)
        pivot_object(scene, "RAF_Canard_" + tag, mesh, air, origin)
    new_object(scene, "RAF_Fin", surfaces.build_fin(spec, mats), air)
    # Cocardes plaquées sur les flancs d'entrée d'air et sur la voilure.
    new_object(scene, "RAF_Roundels",
               airframe.build_roundels(spec, mats, targets=[intakes, fuselage] + wings), air)
    new_object(scene, "RAF_Spectra", surfaces.build_spectra(spec, mats), air)

    store_meshes = {
        "tank_wing": stores.build_tank(spec, mats, "tank_wing"),
        "tank_center": stores.build_tank(spec, mats, "tank_center"),
        "mica_em": stores.build_mica(spec, mats, "EM"),
        "mica_ir": stores.build_mica(spec, mats, "IR"),
        "meteor": stores.build_meteor(spec, mats),
        "hammer": stores.build_hammer(spec, mats),
        "talios": stores.build_talios(spec, mats),
    }
    pylon_meshes = {}
    group = new_empty(scene, "RAF_Stores", root)
    y0 = spec["frame"]["y0"]
    stations = spec["loadout"]["stations"]
    made = {}
    for key in sorted(stations):
        st = stations[key]
        x, s, z = st["at"]
        side = key.rsplit("_", 1)[-1] if "_" in key else ""
        if st["pylon"]:
            kind = st["pylon"]
            if kind not in pylon_meshes:
                pylon_meshes[kind] = stores.build_pylon(spec, mats, kind)
            new_object(scene, "RAF_Pylon_" + key, pylon_meshes[kind], group, (x, y0 - s, z))
        pattern = STORE_NODE[st["store"]]
        name = pattern % side if "%s" in pattern else pattern
        loc = (x, y0 - s + st["store_shift"], z - st["store_drop"])
        pivot_object(scene, name, store_meshes[st["store"]], group, loc)
        made[name] = {"station": key, "group": st["group"], "location": loc}

    bpy.context.view_layer.update()
    for block in (bpy.data.meshes,):
        for item in list(block):
            if item.users == 0:
                block.remove(item)
    out = stats(scene)
    out["stores"] = made
    return out


def stats(scene):
    mesh_objects = [o for o in scene.objects if o.type == "MESH"]
    unique = {o.data.name: o.data for o in mesh_objects}

    def tris(data):
        return sum(max(1, len(p.vertices) - 2) for p in data.polygons)

    primitives = sum(len({p.material_index for p in o.data.polygons}) for o in mesh_objects)
    return {
        "inverted_normals": inverted_normals(unique.values()),
        "objects": len(scene.objects),
        "mesh_objects": len(mesh_objects),
        "unique_meshes": len(unique),
        "draw_calls_estimate": primitives,
        "triangles_unique": sum(tris(d) for d in unique.values()),
        "triangles_instanced": sum(tris(o.data) for o in mesh_objects),
        "vertices_unique": sum(len(d.vertices) for d in unique.values()),
    }


def inverted_normals(meshes):
    """
    Maillages dont le volume signé est négatif : normales tournées vers
    l'intérieur (rendu sombre ou invisible côté Web). Les surfaces ouvertes
    voulues (verrière, carénage dorsal, conduits) ne sont pas concernées.
    """
    open_surfaces = {"RAF_Canopy", "RAF_Spine", "RAF_Intakes", "RAF_Radome", "RAF_Roundels"}
    bad = []
    for data in meshes:
        if data.name in open_surfaces:
            continue
        volume = 0.0
        for poly in data.polygons:
            verts = [data.vertices[i].co for i in poly.vertices]
            for k in range(1, len(verts) - 1):
                volume += verts[0].dot(verts[k].cross(verts[k + 1])) / 6.0
        if volume < 0.0:
            bad.append((data.name, round(volume, 4)))
    return bad


def optimize_glb(spec, raw_path: Path, output_path: Path) -> dict:
    """
    Compression meshopt + quantification (gltf-transform, version épinglée
    dans la spec). Le décodeur meshopt est embarqué par three-stdlib : aucune
    requête réseau au chargement. La compression est obligatoire : sans npx,
    le script s'arrête et le GLB brut reste dans build/, jamais publié.
    """
    import shutil
    import subprocess

    cfg = spec["export"].get("optimize") or {}
    tool = cfg.get("tool")
    if not tool:
        raise RuntimeError("export.optimize.tool absent de la spec")
    if shutil.which("npx") is None:
        raise RuntimeError("npx introuvable dans le PATH : compression meshopt impossible ; "
                           "le GLB brut reste dans %s et n'est pas publié" % raw_path)
    cmd = "npx --yes %s meshopt \"%s\" \"%s\" --level %s" % (
        tool, raw_path, output_path, cfg.get("level", "medium"))
    run = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=600)
    if run.returncode != 0:
        raise RuntimeError("gltf-transform a échoué : " + (run.stderr or run.stdout)[-800:])
    return {"optimized": True, "tool": tool}


def export_glb(spec, output_path: Path, optimize=True) -> dict:
    raw_path = output_path
    if optimize and spec["export"].get("optimize"):
        build_dir = Path(__file__).resolve().parent.parent / "build"
        build_dir.mkdir(parents=True, exist_ok=True)
        raw_path = build_dir / (output_path.stem + ".raw.glb")
    info = _export_raw(raw_path)
    if raw_path != output_path:
        info.update(optimize_glb(spec, raw_path, output_path))
        info["raw_size_kb"] = round(raw_path.stat().st_size / 1024.0, 1)
    size = output_path.stat().st_size
    info.update({"output": str(output_path), "size_bytes": size,
                 "size_kb": round(size / 1024.0, 1)})
    budget = spec["export"].get("size_budget_kb")
    if budget and size / 1024.0 > budget:
        raise RuntimeError("GLB de %.1f Ko au-delà du budget de %d Ko : %s"
                           % (size / 1024.0, budget, output_path))
    return info


def _export_raw(output_path: Path) -> dict:
    kwargs = dict(
        filepath=str(output_path),
        export_format="GLB",
        use_selection=False,
        use_active_scene=True,
        export_shared_accessors=True,
        export_yup=True,
        export_apply=False,
        export_materials="EXPORT",
        export_image_format="NONE",
        export_cameras=False,
        export_lights=False,
        export_extras=False,
        export_animations=False,
    )
    bpy.ops.export_scene.gltf(**kwargs)
    return {"raw_output": str(output_path)}
