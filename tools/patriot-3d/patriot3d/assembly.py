"""
assembly.py — assemble la batterie, pose les clips et exporte le GLB.

Le lanceur principal (PAT_LS1) et son tracteur (PAT_TR1) gardent une
hiérarchie complète : ils portent les clips et les sous-ensembles
inspectables. Les autres éléments, immobiles sur la planche, sont fusionnés en
un maillage par véhicule : moins d'appels de rendu, aucune perte visible.
"""

import math
from pathlib import Path

import bpy

from . import animation, battery, hemtt, launcher, radar
from .core import (collect_meshes, delete_hierarchy, ensure_materials, merge_meshes,
                   new_empty, new_object)
from .wheels import build_wheel_mesh


def _freeze(scene, root, mesh_name, mats, parent, keep_transform=True, keep=()):
    """
    Fusionne toute la hiérarchie sous ``root`` en un seul objet statique.
    Les objets de ``keep`` restent distincts (reparentés à ``parent`` sans
    changer leur position) : utile quand une pièce porte des UV propres.
    """
    bpy.context.view_layer.update()
    for obj in keep:
        # Parent inverse gardé à l'identité (convention du pipeline) : la pose
        # est réécrite directement dans le repère du nouveau parent.
        local = parent.matrix_world.inverted() @ obj.matrix_world
        obj.parent = parent
        obj.matrix_parent_inverse.identity()
        obj.matrix_basis = local
    bpy.context.view_layer.update()
    parts = collect_meshes(root)
    mesh = merge_meshes(mesh_name, parts, mats)
    location = tuple(root.location)
    rotation = tuple(root.rotation_euler)
    name = root.name
    delete_hierarchy(root)
    return new_object(scene, name, mesh, parent,
                      location if keep_transform else (0.0, 0.0, 0.0),
                      rotation if keep_transform else (0.0, 0.0, 0.0))


def _xy_yaw(entry):
    x, y = entry["location"]
    return (x, y, 0.0), (0.0, 0.0, math.radians(entry.get("yaw_deg", 0.0)))


def build(scene, spec, parts=None, animate=True):
    parts = set(parts or ["all"])
    everything = "all" in parts
    mats = ensure_materials(spec["materials"])
    scene.render.fps = spec["animation"]["fps"]
    scene.frame_start = 1
    scene.frame_end = max(spec["animation"]["emplace"]["frames"],
                          spec["animation"]["elevate"]["frames"])
    root = new_empty(scene, "PAT_Root")
    cache = {"hemtt": {}, "launcher": {}, "radar": {}, "misc": {}}
    made = {}

    station = None
    if everything or "launcher" in parts:
        station = launcher.build_launching_station(scene, spec, mats, "PAT_LS1", root,
                                                   cache=cache["launcher"], hero=True)
        made["station"] = station["root"].name
    tractor = None
    if everything or "hemtt" in parts:
        kingpin_y = spec["trailer"]["gooseneck"]["kingpin_y"]
        tractor = hemtt.build_hemtt(scene, spec, mats, "PAT_TR1", root,
                                    location=(0.0, kingpin_y, 0.0),
                                    body_mesh_cache=cache["hemtt"])
        made["tractor"] = tractor[0].name

    if everything or "battery" in parts:
        bat = spec["battery"]
        group = new_empty(scene, "PAT_Battery", root)
        # lanceurs d'arrière-plan : une pose « en batterie », un maillage partagé
        tmp = launcher.build_launching_station(scene, spec, mats, "PAT_LS_Static_Src",
                                               group, cache=cache["launcher"], hero=False)
        launcher.pose_station_deployed(spec, tmp, math.radians(
            spec["launcher"]["elevation_deg"]))
        static_ls = _freeze(scene, tmp["root"], "PAT_LS_Static", mats, group,
                            keep_transform=False)
        static_mesh = static_ls.data
        bpy.data.objects.remove(static_ls, do_unlink=True)
        for entry in bat["launchers"]:
            loc, rot = _xy_yaw(entry)
            new_object(scene, entry["name"], static_mesh, group, loc, rot)

        loc, rot = _xy_yaw(bat["radar"])
        rs = radar.build_radar_set(scene, spec, mats, "PAT_RS", group, loc, rot,
                                   cache["launcher"])
        # le réseau garde ses UV (texture de face générée côté Web) : il reste
        # un objet distinct, le reste de l'ensemble radar est fusionné
        _freeze(scene, rs["root"], "PAT_RS_Static", mats, group, keep=(rs["array"],))

        hs = spec["hemtt"]
        low_hemtt_wheel = build_wheel_mesh(mats, "PAT_Wheel_HEMTT_Low", hs["tire_radius"],
                                           hs["tire_half_width"], hs["rim_radius"],
                                           detail="low")
        loc, rot = _xy_yaw(bat["radar_tractor"])
        hemtt.build_hemtt(scene, spec, mats, "PAT_TR2", group, loc, rot,
                          wheel_mesh=low_hemtt_wheel, body_mesh_cache=cache["hemtt"])

        loc, rot = _xy_yaw(bat["ecs"])
        ecs_root, _ = battery.build_ecs(scene, spec, mats, "PAT_ECS", group, loc, rot,
                                        cache["misc"])
        _freeze(scene, ecs_root, "PAT_ECS_Static", mats, group)

        loc, rot = _xy_yaw(bat["epp"])
        cache["misc"]["hemtt"] = cache["hemtt"]
        cache["misc"]["hemtt_wheel"] = low_hemtt_wheel
        epp_root, _ = battery.build_epp(scene, spec, mats, "PAT_EPP", group, loc, rot,
                                        cache["misc"])
        _freeze(scene, epp_root, "PAT_EPP_Static", mats, group)

        loc, rot = _xy_yaw(bat["amg"])
        amg_root, _, _ = battery.build_amg(scene, spec, mats, "PAT_AMG", group, loc, rot,
                                           cache["misc"])
        _freeze(scene, amg_root, "PAT_AMG_Static", mats, group)
        made["battery"] = group.name

    clips = []
    if animate and station is not None:
        objs = {
            "legs": station["legs"],
            "outriggers": station["outriggers"],
            "mast_top": station["mast_top"],
            "turret": station["turret"],
            "launcher": station["launcher"],
            "actuators": station["actuators"],
        }
        if tractor is not None:
            objs["tractor"] = (tractor[0], tractor[2])
        clips.append(animation.build_emplace_clip(spec, objs))
        clips.append(animation.build_elevate_clip(spec, objs, launcher.actuator_pose))
        clips.extend(animation.build_fin_clips(spec, station.get("fins", {})))
    scene.frame_set(1)

    # purge des data-blocks orphelins laissés par les fusions
    for block in (bpy.data.meshes,):
        for item in list(block):
            if item.users == 0:
                block.remove(item)

    bpy.context.view_layer.update()
    out = stats(scene, made)
    out["clips"] = clips
    return out


def stats(scene, made):
    mesh_objects = [o for o in scene.objects if o.type == "MESH"]
    unique = {o.data.name: o.data for o in mesh_objects}

    def tris(data):
        return sum(max(1, len(p.vertices) - 2) for p in data.polygons)

    primitives = sum(len({p.material_index for p in o.data.polygons}) for o in mesh_objects)
    return {
        "made": made,
        "objects": len(scene.objects),
        "mesh_objects": len(mesh_objects),
        "unique_meshes": len(unique),
        "draw_calls_estimate": primitives,
        "triangles_unique": sum(tris(d) for d in unique.values()),
        "triangles_instanced": sum(tris(o.data) for o in mesh_objects),
        "vertices_unique": sum(len(d.vertices) for d in unique.values()),
    }


def optimize_glb(spec, raw_path: Path, output_path: Path) -> dict:
    """
    Passe de compression meshopt + quantification (gltf-transform, version
    épinglée dans la spec). Le décodeur meshopt est embarqué par three-stdlib
    (WebAssembly en ligne, aucune requête réseau) et activé par défaut par
    ``useGLTF`` : l'asset reste utilisable sans dépendance externe à
    l'exécution. Si Node/npx est absent, le GLB brut est publié tel quel.
    """
    import shutil
    import subprocess

    cfg = spec["export"].get("optimize") or {}
    tool = cfg.get("tool")
    if not tool or shutil.which("npx") is None:
        shutil.copyfile(raw_path, output_path)
        return {"optimized": False}
    cmd = "npx --yes %s meshopt \"%s\" \"%s\" --level %s" % (
        tool, raw_path, output_path, cfg.get("level", "medium"))
    run = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=600)
    if run.returncode != 0:
        raise RuntimeError("gltf-transform a échoué : " + (run.stderr or run.stdout)[-800:])
    return {"optimized": True, "tool": tool}


def export_glb(spec, output_path: Path, optimize=True) -> dict:
    """Export brut Blender, puis compression vers ``output_path``."""
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
    return info


def _export_raw(output_path: Path) -> dict:
    bpy.context.scene.frame_set(1)
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
        export_animations=True,
        export_animation_mode="NLA_TRACKS",
        export_bake_animation=False,
        export_anim_slide_to_zero=True,
        export_optimize_animation_size=True,
        export_optimize_animation_keep_anim_object=True,
    )
    bpy.ops.export_scene.gltf(**kwargs)
    return {"raw_output": str(output_path)}
