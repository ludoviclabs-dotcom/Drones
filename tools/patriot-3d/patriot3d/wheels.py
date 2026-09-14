"""
wheels.py — roues mutualisées (pneus à crampons HEMTT, pneus de semi-remorque).

Chaque roue est UN data-block partagé par toutes ses instances : pivot au
centre de la roue, axe de rotation sur X local, jante tournée vers +X. Les
roues du côté gauche sont les mêmes meshes tournés de 180° autour de Z.
"""

import math

from .core import MeshBuilder, Rx, T


def _tire_profile(radius, half_width, bead_radius, shoulder=0.07):
    """Profil (x, r) d'un pneu : talon, flanc bombé, épaule arrondie, bande."""
    hw = half_width
    crown = radius
    pts = [(-hw * 0.78, bead_radius)]
    # flanc intérieur (x < 0), bombé
    for k in range(1, 5):
        t = k / 5.0
        r = bead_radius + (crown - shoulder - bead_radius) * t
        bulge = math.sin(t * math.pi) * 0.035
        pts.append((-hw * (0.82 + 0.16 * t) - bulge, r))
    # épaule
    for k in range(0, 4):
        a = 0.5 * math.pi * k / 3.0
        pts.append((-hw + shoulder * (1 - math.cos(a)) - 0.004,
                    crown - shoulder + shoulder * math.sin(a)))
    pts.append((hw - shoulder, crown))
    for k in range(1, 4):
        a = 0.5 * math.pi * k / 3.0
        pts.append((hw - shoulder + shoulder * math.sin(a) + 0.004,
                    crown - shoulder * (1 - math.cos(a))))
    for k in range(1, 5):
        t = 1.0 - k / 5.0
        r = bead_radius + (crown - shoulder - bead_radius) * t
        bulge = math.sin(t * math.pi) * 0.035
        pts.append((hw * (0.82 + 0.16 * t) + bulge, r))
    pts.append((hw * 0.78, bead_radius))
    return pts


def build_tire_and_rim(mb, radius, half_width, rim_radius, tread="lug",
                       lugs=22, segments=36, nuts=10):
    """
    Pneu + jante + moyeu dans ``mb`` (repère local de la roue). Deux matériaux
    seulement (gomme, peinture) : chaque roue instanciée coûte deux appels de
    rendu, les creux sombres réutilisent la gomme.
    """
    rubber = "PAT_MAT_Rubber"
    rim_mat = "PAT_MAT_Paint"
    metal = "PAT_MAT_Paint"
    dark = "PAT_MAT_Rubber"

    # --- pneu (surface de révolution autour de X)
    prof = _tire_profile(radius - 0.03, half_width, rim_radius + 0.012)
    mb.lathe([(x, r) for x, r in prof], rubber, segments, (0.0, 0.0, 0.0),
             (1.0, 0.0, 0.0), cap0=False, cap1=False)

    # --- bande de roulement : crampons décalés sur deux rangées
    if tread == "lug":
        lug_h = 0.034
        for i in range(lugs):
            a = 2.0 * math.pi * i / lugs
            for side in (-1.0, 1.0):
                off = a + (math.pi / lugs if side > 0 else 0.0)
                with mb.at(Rx(off)):
                    x0 = side * 0.015
                    x1 = side * (half_width - 0.01)
                    # chevron : bloc incliné par rapport à l'axe
                    mb.box(min(x0, x1), max(x0, x1), -0.055, 0.055,
                           radius - 0.035, radius - 0.035 + lug_h, rubber)
                    # épaulement du crampon, descendant sur le flanc
                    mb.box(side * (half_width - 0.04), side * (half_width + 0.012),
                           -0.05, 0.05, radius - 0.09, radius - 0.03, rubber)
    else:
        # pneu routier : nervures circonférentielles
        for x in (-0.55, -0.18, 0.18, 0.55):
            mb.lathe([(x * half_width - 0.018, radius - 0.03),
                      (x * half_width - 0.018, radius - 0.008),
                      (x * half_width + 0.018, radius - 0.008),
                      (x * half_width + 0.018, radius - 0.03)],
                     rubber, segments, (0.0, 0.0, 0.0), (1.0, 0.0, 0.0),
                     cap0=False, cap1=False)

    # --- jante : voile embouti tourné vers +X
    rx = half_width * 0.62
    mb.lathe([(-rx, rim_radius), (-rx + 0.03, rim_radius + 0.012),
              (rx - 0.03, rim_radius + 0.012), (rx, rim_radius),
              (rx, rim_radius - 0.025), (rx - 0.05, rim_radius * 0.82),
              (rx - 0.03, rim_radius * 0.52), (rx + 0.005, rim_radius * 0.45),
              (rx + 0.005, rim_radius * 0.18)],
             rim_mat, segments, (0.0, 0.0, 0.0), (1.0, 0.0, 0.0),
             cap0=False, cap1=True)
    # face intérieure (côté essieu), plus simple
    mb.lathe([(-rx, rim_radius - 0.02), (-rx + 0.06, rim_radius * 0.55),
              (-rx + 0.05, rim_radius * 0.2)], dark, 20, (0.0, 0.0, 0.0),
             (1.0, 0.0, 0.0), cap0=False, cap1=True)
    # trous d'allègement du voile
    for i in range(8):
        a = 2.0 * math.pi * (i + 0.5) / 8
        with mb.at(Rx(a)):
            mb.cyl((rx - 0.035, 0.0, rim_radius * 0.66), (rx - 0.015, 0.0, rim_radius * 0.66),
                   rim_radius * 0.085, dark, segments=10)

    # --- moyeu, écrous, valve de gonflage centralisé
    hub_r = rim_radius * 0.34
    mb.cyl((rx, 0.0, 0.0), (rx + 0.07, 0.0, 0.0), hub_r, rim_mat, segments=20)
    mb.cyl((rx + 0.07, 0.0, 0.0), (rx + 0.13, 0.0, 0.0), hub_r * 0.62, metal,
           segments=16, r1=hub_r * 0.5)
    bolt_circle = hub_r * 0.78
    for i in range(nuts):
        a = 2.0 * math.pi * i / nuts
        y = bolt_circle * math.cos(a)
        z = bolt_circle * math.sin(a)
        mb.cyl((rx + 0.065, y, z), (rx + 0.095, y, z), 0.021, metal, segments=6)
    # tuyau de gonflage centralisé (CTIS) vers la valve du moyeu
    mb.tube([(rx + 0.12, 0.0, 0.0), (rx + 0.13, 0.05, 0.03),
             (rx + 0.09, rim_radius * 0.75, 0.05)], 0.011, dark, segments=6)


def build_low_wheel(mb, radius, half_width, rim_radius, segments=20):
    """Roue économique pour les véhicules d'arrière-plan (~600 triangles)."""
    rubber = "PAT_MAT_Rubber"
    paint = "PAT_MAT_Paint"
    hw = half_width
    mb.lathe([(-hw * 0.8, rim_radius), (-hw, radius * 0.72), (-hw * 0.96, radius - 0.03),
              (-hw * 0.7, radius), (hw * 0.7, radius), (hw * 0.96, radius - 0.03),
              (hw, radius * 0.72), (hw * 0.8, rim_radius)], rubber, segments,
             (0.0, 0.0, 0.0), (1.0, 0.0, 0.0), cap0=False, cap1=False)
    rx = hw * 0.62
    mb.lathe([(-rx, rim_radius), (rx, rim_radius), (rx - 0.04, rim_radius * 0.6),
              (rx + 0.01, rim_radius * 0.4), (rx + 0.01, 0.0)], paint, segments,
             (0.0, 0.0, 0.0), (1.0, 0.0, 0.0), cap0=False, cap1=False)
    mb.lathe([(-rx, rim_radius), (-rx + 0.05, 0.0)], rubber, 12, (0.0, 0.0, 0.0),
             (1.0, 0.0, 0.0), cap0=False, cap1=False)
    mb.cyl((rx, 0.0, 0.0), (rx + 0.1, 0.0, 0.0), rim_radius * 0.3, paint, 12,
           r1=rim_radius * 0.2)


def build_wheel_mesh(materials, name, radius, half_width, rim_radius,
                     tread="lug", lugs=22, nuts=10, detail="high"):
    mb = MeshBuilder(name)
    if detail == "low":
        build_low_wheel(mb, radius, half_width, rim_radius)
    else:
        build_tire_and_rim(mb, radius, half_width, rim_radius, tread, lugs, nuts=nuts)
    return mb.finish(materials)


def wheel_rotation(side):
    """Rotation de base : jante vers l'extérieur (côté +X à droite, -X à gauche)."""
    return (0.0, 0.0, 0.0) if side > 0 else (0.0, 0.0, math.pi)


__all__ = ["build_wheel_mesh", "wheel_rotation", "build_tire_and_rim", "T"]
