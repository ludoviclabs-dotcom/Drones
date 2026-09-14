"""
preview.py — rendus de contrôle (interactif uniquement, jamais exportés).

Caméra, lumières et sol de contrôle portent le préfixe PAT_PREVIEW_ et sont
retirés par ``cleanup`` avant tout export : le GLB n'embarque ni caméra, ni
lumière, ni sol.
"""

import math

import bpy
from mathutils import Vector

PREFIX = "PAT_PREVIEW_"


def _get_or_create_light(scene, name, kind):
    obj = scene.objects.get(name)
    if obj is None:
        data = bpy.data.lights.new(name, kind)
        obj = bpy.data.objects.new(name, data)
        scene.collection.objects.link(obj)
    return obj


def setup(scene, ground_size=240.0):
    scene.render.engine = "BLENDER_EEVEE"
    world = scene.world or bpy.data.worlds.new(PREFIX + "World")
    scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg is not None:
        bg.inputs["Color"].default_value = (0.42, 0.47, 0.52, 1.0)
        bg.inputs["Strength"].default_value = 0.9

    sun = _get_or_create_light(scene, PREFIX + "Sun", "SUN")
    sun.data.energy = 3.2
    sun.data.angle = math.radians(2.5)
    sun.rotation_euler = (math.radians(52), math.radians(8), math.radians(-35))

    fill = _get_or_create_light(scene, PREFIX + "Fill", "SUN")
    fill.data.energy = 0.6
    fill.data.color = (0.8, 0.85, 1.0)
    fill.rotation_euler = (math.radians(70), 0.0, math.radians(150))

    ground = scene.objects.get(PREFIX + "Ground")
    if ground is None:
        mesh = bpy.data.meshes.new(PREFIX + "Ground")
        s = ground_size / 2
        mesh.from_pydata([(-s, -s, 0), (s, -s, 0), (s, s, 0), (-s, s, 0)], [],
                         [(0, 1, 2, 3)])
        ground = bpy.data.objects.new(PREFIX + "Ground", mesh)
        scene.collection.objects.link(ground)
        mat = bpy.data.materials.new(PREFIX + "GroundMat")
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        bsdf.inputs["Base Color"].default_value = (0.19, 0.18, 0.15, 1.0)
        bsdf.inputs["Roughness"].default_value = 1.0
        mesh.materials.append(mat)

    cam = scene.objects.get(PREFIX + "Cam")
    if cam is None:
        cam = bpy.data.objects.new(PREFIX + "Cam", bpy.data.cameras.new(PREFIX + "Cam"))
        scene.collection.objects.link(cam)
    scene.camera = cam
    return cam


def look_at(cam, position, target, lens=50.0):
    cam.location = Vector(position)
    direction = Vector(target) - Vector(position)
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    cam.data.lens = lens
    cam.data.clip_end = 2000.0


def render(scene, path, position, target, lens=50.0, resolution=(1280, 720),
           samples=32):
    cam = setup(scene)
    look_at(cam, position, target, lens)
    scene.render.resolution_x, scene.render.resolution_y = resolution
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(path)
    try:
        scene.eevee.taa_render_samples = samples
    except AttributeError:
        pass
    window = bpy.context.window
    previous = window.scene if window else None
    if window:
        window.scene = scene
    bpy.ops.render.render(write_still=True, scene=scene.name)
    if window and previous:
        window.scene = previous
    return str(path)


def cleanup(scene):
    for obj in list(scene.objects):
        if obj.name.startswith(PREFIX):
            data = obj.data
            bpy.data.objects.remove(obj, do_unlink=True)
            if data is not None and getattr(data, "users", 1) == 0:
                if isinstance(data, bpy.types.Mesh):
                    bpy.data.meshes.remove(data)
                elif isinstance(data, bpy.types.Light):
                    bpy.data.lights.remove(data)
                elif isinstance(data, bpy.types.Camera):
                    bpy.data.cameras.remove(data)
