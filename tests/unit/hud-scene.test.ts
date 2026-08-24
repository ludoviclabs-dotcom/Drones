import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import HudScene, {
  HUD_COMPONENT_CSS,
  HUD_REDUCED_MOTION_CSS,
  HUD_THEME_TOKENS,
} from "@/components/HudScene";
import { validateScene } from "@/components/hud-scene";
import { finValStudioScene } from "../../scenes";

function relativeLuminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255) ?? [];
  const linear = channels.map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground: string, background: string) {
  const [light, dark] = [
    relativeLuminance(foreground),
    relativeLuminance(background),
  ].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

const occurrences = (haystack: string, needle: string) =>
  haystack.split(needle).length - 1;

const render = (scene: Parameters<typeof validateScene>[0]) =>
  renderToStaticMarkup(createElement(HudScene, { scene }));

/** Markup privé de sa feuille de style : les sélecteurs CSS y côtoieraient
 *  sinon les classes réellement posées sur les éléments. */
const withoutStyles = (html: string) =>
  html.replace(/<style>[\s\S]*?<\/style>/, "");

describe("moteur HudScene", () => {
  it("accepte la scène de référence", () => {
    expect(validateScene(finValStudioScene)).toEqual([]);
  });

  it("rend la scène sans avertissement React", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    try {
      const markup = renderToStaticMarkup(
        createElement(HudScene, { scene: finValStudioScene }),
      );

      expect(error).not.toHaveBeenCalled();
      expect(markup).toContain('viewBox="0 0 1600 900"');
      expect(markup).toContain(
        'aria-label="VALUATION ENGINE. FinVal-Studio · assemblage complet"',
      );
      expect(markup).toContain("DEMO DATA");
    } finally {
      error.mockRestore();
    }
  });

  it("produit un balisage SSR strictement déterministe", () => {
    const first = renderToStaticMarkup(
      createElement(HudScene, { scene: finValStudioScene }),
    );
    const second = renderToStaticMarkup(
      createElement(HudScene, { scene: finValStudioScene }),
    );

    expect(second).toBe(first);
    // L'animation d'assemblage est déclarée dès le SSR : le HTML servi ne peint
    // jamais la planche assemblée avant que l'hydratation ne la fasse sauter.
    expect(first).toContain(
      '<div class="hudScene hudScene--graphite hudScene--enter"',
    );
    expect(first).toContain("HYPOTHÈSES");
  });

  it("n'applique aucune animation ni transition en mouvement réduit", () => {
    expect(HUD_REDUCED_MOTION_CSS).toContain(
      "@media (prefers-reduced-motion: reduce)",
    );
    expect(HUD_REDUCED_MOTION_CSS).toMatch(/animation:\s*none\s*!important/);
    expect(HUD_REDUCED_MOTION_CSS).toMatch(/transition:\s*none\s*!important/);
  });

  it("maintient les libellés secondaires au contraste AA", () => {
    for (const theme of Object.values(HUD_THEME_TOKENS)) {
      expect(contrastRatio(theme.muted, theme.surface)).toBeGreaterThanOrEqual(
        4.5,
      );
    }
  });
});

describe("état d'inspection HudScene", () => {
  const markup = render(finValStudioScene);
  const targetCount =
    finValStudioScene.core.parts.length + finValStudioScene.panels.length;

  it("expose chaque pièce et chaque panneau comme cible activable", () => {
    expect(occurrences(markup, 'role="button"')).toBe(targetCount);
    expect(occurrences(markup, 'tabindex="0"')).toBe(targetCount);
    // Le nom accessible d'origine est conservé sur chaque cible.
    expect(markup).toContain('aria-label="Pièce 5 : Fourchette de valeur"');
    expect(markup).toContain('aria-label="Panneau : Sensibilité au WACC"');
  });

  it("démarre sans aucune cible sélectionnée", () => {
    expect(occurrences(markup, 'aria-pressed="false"')).toBe(targetCount);
    expect(markup).not.toContain('aria-pressed="true"');
    // La classe d'atténuation n'est posée qu'à l'épinglage (le sélecteur CSS
    // homonyme vit dans le <style>, d'où la vérification sur l'attribut).
    expect(markup).toContain(
      '<div class="hudScene hudScene--graphite hudScene--enter"',
    );
    // Aucun callout n'est tracé tant qu'aucune cible n'est sélectionnée.
    expect(withoutStyles(markup)).not.toContain("hudScene__calloutLine--draw");
    expect(withoutStyles(markup)).not.toContain('data-hud-drawn="true"');
  });

  it("n'enferme plus les cibles interactives sous un ancêtre role=\"img\"", () => {
    expect(markup).not.toContain('role="img"');
    expect(markup).toContain('role="group"');
  });

  it("décrit la planche sans inventer de mesure", () => {
    expect(markup).toContain(`<desc id="finval-engine-desc">`);
    expect(markup).toContain("aria-describedby=\"finval-engine-desc\"");
    expect(markup).toContain("mode démonstration");
    expect(markup).toContain("aucune télémétrie");
    expect(markup).toContain("Entrée ou Espace");
  });

  it("relie chaque pièce au panneau qu'elle référence, et seulement lui", () => {
    for (const part of finValStudioScene.core.parts) {
      if (!part.panelRef) continue;
      expect(markup).toContain(`aria-controls="finval-engine-panel-${part.panelRef}"`);
      expect(markup).toContain(`id="finval-engine-panel-${part.panelRef}"`);
    }
    // Une pièce sans panelRef ne porte pas d'aria-controls orphelin.
    const linked = finValStudioScene.core.parts.filter((part) => part.panelRef);
    expect(linked.length).toBeLessThan(finValStudioScene.core.parts.length);
    expect(occurrences(markup, "aria-controls=")).toBe(linked.length);
  });

  it("prépare chaque callout au tracé sans le déclencher", () => {
    // dasharray posé = longueur du trait ; dashoffset laissé à 0 => trait plein.
    expect(markup).toContain('data-hud-drawn="false"');
    expect(markup).toContain("--hud-callout-length:");
    // Le dashoffset ne vit que dans la keyframe, jamais sur un élément servi.
    expect(withoutStyles(markup)).not.toContain("stroke-dashoffset");
  });

  it("n'émet aucun identifiant aléatoire : tout dérive de scene.id", () => {
    // Deux rendus successifs dans le même processus resteraient identiques même
    // avec un compteur ; on vérifie donc que chaque id est bien préfixé par
    // l'identifiant de scène, et qu'aucun id ne varie d'une scène à l'autre.
    for (const id of markup.match(/ id="[^"]+"/g) ?? []) {
      expect(id).toMatch(/ id="finval-engine-/);
    }
    expect(render(finValStudioScene)).toBe(markup);
  });
});

describe("mouvement HudScene", () => {
  const source = readFileSync("src/components/HudScene.tsx", "utf8");

  it("n'installe aucun timer ni aucune boucle d'animation", () => {
    expect(source).not.toMatch(/setInterval|setTimeout/);
    // Aucune animation permanente : ni « infinite », ni « alternate ».
    expect(HUD_COMPONENT_CSS).not.toMatch(/infinite|alternate/);
  });

  it("trace le callout entre 250 et 400 ms, une seule fois", () => {
    const draw = HUD_COMPONENT_CSS.match(
      /\.hudScene__calloutLine--draw\s*\{\s*animation:[^;]+;/,
    )?.[0];
    expect(draw).toBeDefined();

    const duration = Number(draw?.match(/(\d+)ms/)?.[1]);
    expect(duration).toBeGreaterThanOrEqual(250);
    expect(duration).toBeLessThanOrEqual(400);
    // « both » conserve le trait visible après le tracé ; pas de répétition.
    expect(draw).toContain("both");
    expect(draw).not.toContain("infinite");

    expect(HUD_COMPONENT_CSS).toContain("stroke-dashoffset: var(--hud-callout-length)");
  });

  it("garde l'assemblage initial à 900 ms, sans boucle ni redémarrage", () => {
    expect(HUD_COMPONENT_CSS).toContain("hudScene-part-assemble 900ms");
    // La classe d'entrée est statique : aucun état React ne la fait basculer,
    // donc ni le survol ni la sélection ne relancent l'assemblage.
    expect(source).toContain("hudScene hudScene--${scene.theme} hudScene--enter");
    expect(source).not.toContain("hasEntered");
  });

  it("limite les micro-transitions à la plage 150-220 ms", () => {
    const durations = [
      ...HUD_COMPONENT_CSS.matchAll(/transition:[^;]+;/g),
    ].flatMap((match) =>
      [...match[0].matchAll(/(\d+)ms/g)].map((ms) => Number(ms[1])),
    );

    expect(durations.length).toBeGreaterThan(0);
    for (const duration of durations) {
      expect(duration).toBeGreaterThanOrEqual(150);
      expect(duration).toBeLessThanOrEqual(220);
    }
  });

  it("neutralise animations et transitions en mouvement réduit", () => {
    expect(HUD_COMPONENT_CSS).toContain(HUD_REDUCED_MOTION_CSS);
    expect(HUD_REDUCED_MOTION_CSS).toMatch(/animation:\s*none\s*!important/);
    expect(HUD_REDUCED_MOTION_CSS).toMatch(/transition:\s*none\s*!important/);
  });
});
