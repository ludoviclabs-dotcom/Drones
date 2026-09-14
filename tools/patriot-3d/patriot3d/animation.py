"""
animation.py — clips nommés de la planche, poussés en pistes NLA.

L'exporteur glTF en mode NLA_TRACKS produit une animation par NOM de piste :
tous les objets portant une piste « PAT_EMPLACE » forment un seul clip glTF.
Chaque clip est échantillonné image par image (interpolation LINEAR) à partir
de fonctions pures : l'amorti est donc exactement celui calculé ici, et la
dernière image est une pose stable.

Aucun clip n'est une procédure : les durées sont des choix de lecture visuelle
et ne sont calées sur aucun chronométrage réel.
"""

import math

import bpy


def ease(t):
    """Amorti symétrique sans dépassement (cubique)."""
    t = max(0.0, min(1.0, t))
    return 4 * t * t * t if t < 0.5 else 1 - pow(-2 * t + 2, 3) / 2


def window(frame, f0, f1):
    """Avancement 0..1 dans la fenêtre [f0, f1]."""
    if f1 <= f0:
        return 1.0 if frame >= f1 else 0.0
    return max(0.0, min(1.0, (frame - f0) / float(f1 - f0)))


# ---------------------------------------------------------------------------
# Actions « slottées » (Blender 4.4+) — mêmes précautions que thundart-3d
# ---------------------------------------------------------------------------

def _assign_action(obj, action):
    if obj.animation_data is None:
        obj.animation_data_create()
    obj.animation_data.action = action
    if hasattr(obj.animation_data, "action_slot"):
        if obj.animation_data.action_slot is None and hasattr(action, "slots"):
            slot = action.slots.new(id_type="OBJECT", name=obj.name)
            obj.animation_data.action_slot = slot


def _iter_fcurves(action):
    if hasattr(action, "layers") and getattr(action, "is_action_layered", False):
        for layer in action.layers:
            for strip in layer.strips:
                for bag in getattr(strip, "channelbags", []):
                    for fcurve in bag.fcurves:
                        yield fcurve
        return
    for fcurve in getattr(action, "fcurves", []):
        yield fcurve


def _push_to_nla(obj, action, name, start):
    slot = getattr(obj.animation_data, "action_slot", None)
    track = obj.animation_data.nla_tracks.new()
    track.name = name
    strip = track.strips.new(name, int(start), action)
    strip.name = name
    if slot is not None and hasattr(strip, "action_slot"):
        strip.action_slot = slot
    obj.animation_data.action = None
    return track


def bake_clip(clip_name, frames, targets):
    """
    ``targets`` = [(obj, {"location": f(frame) -> (x,y,z) | None,
                          "rotation_euler": f(frame) -> (x,y,z) | None}), ...]
    Échantillonne chaque canal à chaque image, puis restaure la pose de repos.
    """
    f0, f1 = frames
    for obj, channels in targets:
        rest_loc = tuple(obj.location)
        rest_rot = tuple(obj.rotation_euler)
        action = bpy.data.actions.new("%s__%s" % (clip_name, obj.name))
        _assign_action(obj, action)
        for frame in range(f0, f1 + 1):
            for path, fn in channels.items():
                if fn is None:
                    continue
                value = fn(frame)
                setattr(obj, path, value)
                obj.keyframe_insert(path, frame=frame)
        for fcurve in _iter_fcurves(action):
            for kp in fcurve.keyframe_points:
                kp.interpolation = "LINEAR"
            fcurve.update()
        _push_to_nla(obj, action, clip_name, f0)
        obj.location = rest_loc
        obj.rotation_euler = rest_rot


# ---------------------------------------------------------------------------
# Trajectoire de départ du tracteur (modèle cinématique « bicyclette »)
# ---------------------------------------------------------------------------

def tractor_path(s, straight0, radius, turn_deg, straight1, turn_sign=1.0):
    """
    Position (x, y) du centre du tandem arrière, cap (rad) et courbure signée
    après un parcours ``s`` : ligne droite, arc, ligne droite. Cap 0 = +Y ;
    ``turn_sign`` = +1 pour un virage à droite (+X), -1 à gauche.
    """
    turn = math.radians(turn_deg)
    arc = radius * turn
    k = turn_sign / radius
    if s <= straight0:
        return 0.0, s, 0.0, 0.0
    if s <= straight0 + arc:
        a = (s - straight0) / radius
        return (turn_sign * radius * (1 - math.cos(a)), straight0 + radius * math.sin(a),
                -turn_sign * a, k)
    x0 = turn_sign * radius * (1 - math.cos(turn))
    y0 = straight0 + radius * math.sin(turn)
    d = s - straight0 - arc
    return (x0 + turn_sign * d * math.sin(turn), y0 + d * math.cos(turn),
            -turn_sign * turn, 0.0)


def build_emplace_clip(spec, objs):
    """
    PAT_EMPLACE — mise en batterie illustrative :
    béquilles, dételage et départ du tracteur, stabilisateurs, mât de liaison.
    """
    a = spec["animation"]["emplace"]
    t = spec["trailer"]
    hs = spec["hemtt"]
    clip = a["name"]
    f_start, f_end = 1, a["frames"]
    targets = []

    # béquilles avant
    lf0, lf1 = a["legs"]
    for leg in objs["legs"]:
        x, y, z = tuple(leg.location)
        targets.append((leg, {"location": (lambda f, x=x, y=y, z=z:
                                           (x, y, z * (1 - ease(window(f, lf0, lf1)))))}))

    # tracteur : trajectoire et roues
    tr = objs.get("tractor")
    if tr is not None:
        root, wheels = tr
        p = a["tractor_path"]
        tf0, tf1 = a["tractor"]
        total = p["straight0"] + p["radius"] * math.radians(p["turn_deg"]) + p["straight1"]
        rx, ry, rz = tuple(root.location)

        def path(s):
            return tractor_path(s, p["straight0"], p["radius"], p["turn_deg"],
                                p["straight1"], p.get("turn_sign", 1.0))

        def dist(f):
            return total * ease(window(f, tf0, tf1))

        def root_loc(f):
            px, py, _, _ = path(dist(f))
            return (rx + px, ry + py, rz)

        def root_rot(f):
            return (0.0, 0.0, path(dist(f))[2])

        targets.append((root, {"location": root_loc, "rotation_euler": root_rot}))
        r = hs["tire_radius"]
        for wheel in wheels:
            base_z = wheel.rotation_euler.z
            left = wheel.location.x < 0
            axle_y = wheel.location.y
            steer_gain = 0.0
            if axle_y > 2.0:  # essieux directeurs avant
                steer_gain = axle_y

            def wrot(f, base_z=base_z, left=left, steer_gain=steer_gain):
                s = dist(f)
                spin = (s / r) * (1.0 if left else -1.0)
                steer = 0.0
                if steer_gain:
                    # courbure lissée sur 1,5 m autour des raccords d'arc
                    k = 0.0
                    for ds in (-0.75, -0.25, 0.25, 0.75):
                        k += path(max(0.0, s + ds))[3]
                    k /= 4.0
                    steer = -math.atan(steer_gain * k)
                return (spin, 0.0, base_z + steer)

            targets.append((wheel, {"rotation_euler": wrot}))

    # stabilisateurs : lacet puis descente des patins
    of0, of1 = a["outriggers"]
    ff0, ff1 = a["feet"]
    for key, (arm, foot) in objs["outriggers"].items():
        cfg = t["outriggers"][key]
        y0 = math.radians(cfg["stowed_yaw_deg"])
        y1 = math.radians(cfg["deployed_yaw_deg"])
        targets.append((arm, {"rotation_euler": (lambda f, y0=y0, y1=y1:
                                                 (0.0, 0.0, y0 + (y1 - y0) * ease(window(f, of0, of1))))}))
        fx, fy, fz = tuple(foot.location)
        drop = t["outrigger_foot_drop"]
        targets.append((foot, {"location": (lambda f, fx=fx, fy=fy, fz=fz, drop=drop:
                                            (fx, fy, fz - drop * ease(window(f, ff0, ff1))))}))

    # mât de liaison (section haute)
    mf0, mf1 = a["mast"]
    top = objs["mast_top"]
    mx, my, mz = tuple(top.location)
    drop = spec["launcher"]["mast"]["stowed_drop"]
    targets.append((top, {"location": (lambda f, mx=mx, my=my, mz=mz, drop=drop:
                                       (mx, my, mz + drop * ease(window(f, mf0, mf1))))}))

    for extra_obj, channels in objs.get("extra_emplace", []):
        targets.append((extra_obj, channels))

    bake_clip(clip, (f_start, f_end), targets)
    return clip


def build_fin_clips(spec, fins_by_letter):
    """
    PAT_FINS_A / PAT_FINS_B — dépliage des quatre gouvernes d'un intercepteur,
    de la position repliée (dans le conteneur) à la position de vol. Le Web
    en règle l'avancement ; aucune dynamique n'est représentée.
    """
    a = spec["animation"]["fins"]
    fold = math.radians(spec["missile"]["control_fins"]["folded_deg"])
    clips = []
    for letter, fins in sorted(fins_by_letter.items()):
        clip = "%s_%s" % (a["name_prefix"], letter)
        targets = []
        for fin in fins:
            x, y, z = tuple(fin.rotation_euler)
            targets.append((fin, {"rotation_euler": (lambda f, x=x, y=y, z=z:
                                                     (x, y - fold * ease(window(f, 1, a["frames"])), z))}))
        bake_clip(clip, (1, a["frames"]), targets)
        clips.append(clip)
    return clips


def build_elevate_clip(spec, objs, actuator_pose):
    """
    PAT_ELEVATE — la tourelle s'oriente, la masse élevée monte au site fixe
    publié, les vérins suivent (pose recalculée à chaque image).
    """
    a = spec["animation"]["elevate"]
    lf = spec["launcher"]
    clip = a["name"]
    theta_max = math.radians(lf["elevation_deg"])
    yaw_max = math.radians(a["traverse_deg"])
    ef0, ef1 = a["elevation"]
    yf0, yf1 = a["traverse"]
    targets = []

    turret = objs["turret"]
    targets.append((turret, {"rotation_euler": (lambda f:
                                                (0.0, 0.0, yaw_max * ease(window(f, yf0, yf1))))}))

    def theta(f):
        return theta_max * ease(window(f, ef0, ef1))

    launcher = objs["launcher"]
    targets.append((launcher, {"rotation_euler": lambda f: (theta(f), 0.0, 0.0)}))
    for side_key, (barrel, rod) in objs["actuators"].items():
        bx = barrel.location.x

        def barrel_rot(f):
            _, _, phi = actuator_pose(lf, theta(f))
            return (phi, 0.0, 0.0)

        def rod_loc(f, bx=bx):
            _, (Ay, Az), _ = actuator_pose(lf, theta(f))
            return (bx, Ay, Az)

        targets.append((barrel, {"rotation_euler": barrel_rot}))
        targets.append((rod, {"location": rod_loc, "rotation_euler": barrel_rot}))

    bake_clip(clip, (1, a["frames"]), targets)
    return clip
