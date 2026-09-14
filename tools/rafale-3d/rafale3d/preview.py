"""
preview.py — rendus de contrôle (jamais exportés).

Sert à confronter le modèle aux photographies de référence : caméras aux
angles des clichés, ciel uniforme, soleil et contre-jour. Tous les objets de
contrôle portent le préfixe RAF_PREVIEW_ et sont retirés par ``cleanup``
avant l'export : le GLB n'embarque ni caméra, ni lumière.
"""

import math
from pathlib import Path

import bpy
from mathutils import Quaternion, Vector

PREFIX = "RAF_PREVIEW_"

# Vues de contrôle : position caméra, cible, focale (mm), roulis (°). Repère
# Blender : +Y nez, +X aile droite, +Z haut ; l'avion est centré à l'origine.
# Les vues « ref_* » reprennent les angles des photographies de référence.
VIEWS = {
    "front_3q_left": ((-13.0, 17.0, -2.5), (0.0, 0.6, 0.2), 55, 0.0),
    "front_low": ((1.2, 26.0, -3.4), (0.0, 0.0, 0.1), 70, 0.0),
    "side_left": ((-30.0, 0.8, 0.4), (0.0, 0.8, 0.4), 60, 0.0),
    "top": ((0.0, 0.8, 30.0), (0.0, 0.8, 0.0), 40, 90.0),
    "below": ((0.0, 0.8, -30.0), (0.0, 0.8, 0.0), 40, -90.0),
    "rear_3q_right": ((14.0, -19.0, 3.8), (0.0, -0.4, 0.3), 55, 0.0),
    "front_3q_high": ((12.0, 16.0, 7.0), (0.0, 0.6, 0.2), 55, 0.0),
    "front": ((0.0, 30.0, 0.35), (0.0, 0.0, 0.35), 85, 0.0),
    "ref_front_left_below": ((-10.5, 15.0, -5.5), (0.0, 0.8, 0.0), 50, -12.0),
    "ref_front_banked": ((1.5, 24.0, 2.6), (0.0, 0.5, 0.2), 60, 14.0),
    "ref_side_right": ((24.0, 2.0, 5.0), (0.0, 0.8, 0.3), 55, 0.0),
    "ref_rear_right_below": ((13.0, -13.0, -3.5), (0.0, 0.0, 0.2), 45, 8.0),
    "close_nose": ((5.5, 10.5, 2.4), (0.0, 3.2, 0.2), 45, 0.0),
    "close_rear": ((-5.0, -11.5, 2.6), (0.0, -5.5, 0.3), 45, 0.0),
    "close_under": ((3.5, 4.0, -5.0), (0.0, -1.5, -0.5), 35, 0.0),
    "meteor_side": ((2.0, -0.6, -2.9), (0.74, -2.6, -0.95), 40, 0.0),
}


def _light(scene, name, kind):
    obj = scene.objects.get(name)
    if obj is None:
        data = bpy.data.lights.new(name, kind)
        obj = bpy.data.objects.new(name, data)
        scene.collection.objects.link(obj)
    return obj


def setup(scene, engine="BLENDER_EEVEE"):
    scene.render.engine = engine
    world = bpy.data.worlds.get(PREFIX + "World") or bpy.data.worlds.new(PREFIX + "World")
    scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg is not None:
        bg.inputs["Color"].default_value = (0.46, 0.53, 0.62, 1.0)
        bg.inputs["Strength"].default_value = 0.85
    sun = _light(scene, PREFIX + "Sun", "SUN")
    sun.data.energy = 3.4
    sun.data.angle = math.radians(1.5)
    sun.rotation_euler = (math.radians(38), math.radians(12), math.radians(-150))
    fill = _light(scene, PREFIX + "Fill", "SUN")
    fill.data.energy = 0.8
    fill.data.color = (0.82, 0.88, 1.0)
    fill.rotation_euler = (math.radians(118), 0.0, math.radians(20))
    cam = scene.objects.get(PREFIX + "Cam")
    if cam is None:
        cam = bpy.data.objects.new(PREFIX + "Cam", bpy.data.cameras.new(PREFIX + "Cam"))
        scene.collection.objects.link(cam)
    scene.camera = cam
    if engine == "BLENDER_WORKBENCH":
        shading = scene.display.shading
        shading.light = "STUDIO"
        shading.color_type = "MATERIAL"
        shading.show_cavity = True
        shading.show_object_outline = False
    return cam


def render_views(scene, out_dir, views=None, engine="BLENDER_EEVEE",
                 resolution=(1280, 720), samples=24):
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    cam = setup(scene, engine)
    scene.render.resolution_x, scene.render.resolution_y = resolution
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    try:
        scene.eevee.taa_render_samples = samples
    except AttributeError:
        pass
    written = []
    for name in (views or VIEWS):
        position, target, lens, roll = VIEWS[name]
        cam.location = Vector(position)
        direction = Vector(target) - Vector(position)
        quat = direction.to_track_quat("-Z", "Y")
        if roll:
            quat = quat @ Quaternion((0.0, 0.0, 1.0), math.radians(roll))
        cam.rotation_mode = "XYZ"
        cam.rotation_euler = quat.to_euler()
        cam.data.lens = lens
        cam.data.clip_end = 500.0
        path = out_dir / ("%s.png" % name)
        scene.render.filepath = str(path)
        bpy.ops.render.render(write_still=True, scene=scene.name)
        written.append(str(path))
    return written


def cleanup(scene):
    for obj in list(scene.objects):
        if obj.name.startswith(PREFIX):
            data = obj.data
            bpy.data.objects.remove(obj, do_unlink=True)
            if data is not None and getattr(data, "users", 1) == 0:
                if isinstance(data, bpy.types.Light):
                    bpy.data.lights.remove(data)
                elif isinstance(data, bpy.types.Camera):
                    bpy.data.cameras.remove(data)
