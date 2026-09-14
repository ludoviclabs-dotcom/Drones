"""
generate-rafale.py — reconstruit l'asset 3D « Rafale F4 · Meteor » de Panoplie.

Ce que cet asset EST
    Une représentation éditoriale des formes EXTÉRIEURES visibles d'un Rafale C
    au standard F4 et de ses emports (Meteor, MICA IR et EM, AASM Hammer,
    bidons, nacelle Talios), destinée à une planche technique Web : vue
    d'ensemble, inspection, capteurs, séparation et départ illustratifs.

Ce que cet asset N'EST PAS
    Pas un modèle constructeur, pas un jumeau opérationnel. Aucun composant
    interne n'est modélisé ; aucune cible, trajectoire calculée, balistique,
    domaine de tir ni procédure n'est produite. Les cotes sont des gabarits
    publics approchés (voir specs/rafale-f4.json).

Usage
    Mode headless (CLI, reproductible) :
        blender --background --python tools/rafale-3d/generate-rafale.py -- --spec rafale-f4

    Rendus de contrôle (sans export) :
        blender --background --python tools/rafale-3d/generate-rafale.py -- \\
            --spec rafale-f4 --preview <dossier> [--engine BLENDER_WORKBENCH] --no-export

    Mode interactif (MCP Blender / Claude Code) :
        path = r"...\\tools\\rafale-3d\\generate-rafale.py"
        ns = {"__file__": path}
        exec(compile(open(path, encoding="utf-8").read(), path, "exec"), ns)
        ns["build_rafale"]()

Sortie
    public/models/hud/rafale-f4.glb
"""

import json
import os
import sys
from pathlib import Path

import bpy

SCENE_NAME = "RAFALE_F4"


def get_repo_root(explicit=None) -> Path:
    if explicit:
        return Path(explicit)
    env = os.environ.get("PANOPLIE_REPO_ROOT")
    if env and (Path(env) / "package.json").exists():
        return Path(env)
    if "__file__" in globals():
        here = Path(__file__).resolve().parent
        for candidate in (here, here.parent, here.parent.parent):
            if (candidate / "package.json").exists():
                return candidate
    raise RuntimeError(
        "Racine du dépôt introuvable : définir PANOPLIE_REPO_ROOT ou passer repo_root.")


def import_pipeline(root: Path):
    """Importe (ou recharge) le paquet ``rafale3d`` depuis le dépôt."""
    tools = str(root / "tools" / "rafale-3d")
    if tools not in sys.path:
        sys.path.insert(0, tools)
    for name in [m for m in sys.modules if m == "rafale3d" or m.startswith("rafale3d.")]:
        del sys.modules[name]
    import rafale3d.assembly as assembly  # noqa: E402
    import rafale3d.preview as preview  # noqa: E402
    return assembly, preview


def load_spec(root: Path, slug: str) -> dict:
    with open(root / "tools" / "rafale-3d" / "specs" / (slug + ".json"), "r",
              encoding="utf-8") as handle:
        return json.load(handle)


def prepare_scene() -> bpy.types.Scene:
    """Scène dédiée : en interactif, aucune autre scène du fichier n'est touchée."""
    if bpy.app.background:
        scene = bpy.context.scene
        for obj in list(scene.objects):
            bpy.data.objects.remove(obj, do_unlink=True)
        scene.name = SCENE_NAME
    else:
        scene = bpy.data.scenes.get(SCENE_NAME) or bpy.data.scenes.new(SCENE_NAME)
        for obj in list(scene.collection.objects):
            bpy.data.objects.remove(obj, do_unlink=True)
        window = getattr(bpy.context, "window", None)
        if window is not None:
            window.scene = scene
    for block in (bpy.data.meshes, bpy.data.materials):
        for item in list(block):
            if item.users == 0:
                block.remove(item)
    return scene


def build_rafale(slug: str = "rafale-f4", repo_root=None, export: bool = True,
                 preview_dir=None, engine="BLENDER_EEVEE", views=None) -> dict:
    root = get_repo_root(repo_root)
    assembly, preview = import_pipeline(root)
    spec = load_spec(root, slug)
    scene = prepare_scene()
    stats = assembly.build(scene, spec)
    if preview_dir:
        stats["previews"] = preview.render_views(scene, preview_dir, views=views, engine=engine)
        preview.cleanup(scene)
    if export:
        out = root / Path(spec["export"]["output"])
        out.parent.mkdir(parents=True, exist_ok=True)
        stats.update(assembly.export_glb(spec, out))
    return stats


if __name__ == "__main__":
    argv = sys.argv
    requested, preview_dir, engine, export, views = "rafale-f4", None, "BLENDER_EEVEE", True, None
    if "--" in argv:
        rest = argv[argv.index("--") + 1:]
        for i, arg in enumerate(rest):
            if arg == "--spec" and i + 1 < len(rest):
                requested = rest[i + 1]
            elif arg == "--preview" and i + 1 < len(rest):
                preview_dir = rest[i + 1]
            elif arg == "--engine" and i + 1 < len(rest):
                engine = rest[i + 1]
            elif arg == "--views" and i + 1 < len(rest):
                views = rest[i + 1].split(",")
            elif arg == "--no-export":
                export = False
    result = build_rafale(requested, export=export, preview_dir=preview_dir, engine=engine,
                          views=views)
    print("RAFALE_STATS " + json.dumps(result, indent=2, default=str))
