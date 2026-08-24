import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import HudScene from "@/components/HudScene";
import { validateScene } from "@/components/hud-scene";
import { droneAirframeScene, hudScenes } from "../../scenes";

describe("scènes HUD", () => {
  it("respecte le contrat pour chaque fiche disponible", () => {
    expect(hudScenes).toHaveLength(2);

    for (const scene of hudScenes) {
      expect(validateScene(scene)).toEqual([]);
      expect(scene.panels).toHaveLength(4);
      expect(
        scene.core.parts.every((part) => (part.callout?.text.length ?? 0) <= 24),
      ).toBe(true);
    }
  });

  it("reproduit la fiche de cellule de drone", () => {
    expect(droneAirframeScene.core.metaphor).toBe(
      "cellule de drone éclatée verticalement",
    );
    expect(droneAirframeScene.core.parts.map((part) => part.label)).toEqual([
      "Châssis",
      "Bloc moteurs + ESC",
      "Centrale inertielle et GPS",
      "Module radio",
      "Batterie",
      "Nacelle capteurs",
    ]);
    expect(droneAirframeScene.panels.map((panel) => panel.kind)).toEqual([
      "radial",
      "sparkline",
      "readout",
      "log",
    ]);
    expect(droneAirframeScene.panels.every((panel) => panel.demo && !panel.source)).toBe(
      true,
    );
  });

  it("rend chaque scène via le moteur existant", () => {
    for (const scene of hudScenes) {
      const markup = renderToStaticMarkup(createElement(HudScene, { scene }));

      expect(markup).toContain('viewBox="0 0 1600 900"');
      expect(markup).toContain(`aria-label="${scene.title}. ${scene.subtitle}"`);
    }
  });
});
