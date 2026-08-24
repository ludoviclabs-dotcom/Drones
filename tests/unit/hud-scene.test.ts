import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import HudScene, {
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
    expect(first).toContain('<div class="hudScene hudScene--graphite"');
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
