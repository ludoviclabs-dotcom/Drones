import { describe, expect, it } from "vitest";
import { detectRenderProfile } from "@/components/hud/render-profile";

const RENDERER = 0x1f01;
const UNMASKED_RENDERER_WEBGL = 0x9246;

type ProbeDocument = Pick<Document, "createElement">;

/** Document minimal dont le canvas renvoie `context` pour « webgl2 ». */
function documentWith(getContext: (type: string) => unknown): ProbeDocument {
  return { createElement: () => ({ getContext }) } as unknown as ProbeDocument;
}

/** Contexte WebGL 2 simulé : nom exposé, nom réel et libération du contexte. */
function probeContext(renderer: string, unmasked?: string) {
  const probe = {
    lost: false,
    RENDERER,
    getParameter: (parameter: number) =>
      parameter === RENDERER
        ? renderer
        : parameter === UNMASKED_RENDERER_WEBGL
          ? unmasked
          : null,
    getExtension: (name: string) => {
      if (name === "WEBGL_debug_renderer_info") {
        return unmasked === undefined ? null : { UNMASKED_RENDERER_WEBGL };
      }
      if (name === "WEBGL_lose_context") {
        return { loseContext: () => void (probe.lost = true) };
      }
      return null;
    },
  };
  return probe;
}

const profileFor = (renderer: string, unmasked?: string) =>
  detectRenderProfile(
    documentWith((type) => (type === "webgl2" ? probeContext(renderer, unmasked) : null)),
  );

describe("profil de rendu des planches HUD", () => {
  it("sans WebGL 2, ou si la sonde échoue, le profil est « none »", () => {
    // Un navigateur WebGL 1 seul ne suffit pas : three.js exige WebGL 2.
    expect(
      detectRenderProfile(documentWith((type) => (type === "webgl" ? {} : null))),
    ).toBe("none");
    expect(
      detectRenderProfile(
        documentWith(() => {
          throw new Error("contexte bloqué");
        }),
      ),
    ).toBe("none");
  });

  it("reconnaît les rendus logiciels, y compris derrière un nom masqué", () => {
    for (const unmasked of [
      "ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)",
      "llvmpipe (LLVM 15.0.7, 256 bits)",
      "Microsoft Basic Render Driver",
    ]) {
      expect(profileFor("WebKit WebGL", unmasked)).toBe("software");
    }
    // Firefox expose directement le nom réel, sans l'extension de débogage.
    expect(profileFor("llvmpipe, or similar")).toBe("software");
  });

  it("garde la qualité complète sur GPU matériel", () => {
    expect(
      profileFor(
        "WebKit WebGL",
        "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 (0x00002504) Direct3D11 vs_5_0 ps_5_0, D3D11)",
      ),
    ).toBe("hardware");
    expect(profileFor("Apple GPU")).toBe("hardware");
    // Nom masqué et extension absente : rien ne prouve un rendu logiciel.
    expect(profileFor("WebKit WebGL")).toBe("hardware");
  });

  it("libère le contexte de sonde", () => {
    const probe = probeContext("WebKit WebGL", "Apple M2");
    detectRenderProfile(documentWith(() => probe));
    expect(probe.lost).toBe(true);
  });

  it("hors navigateur, le profil optimiste est « hardware »", () => {
    expect(detectRenderProfile(undefined)).toBe("hardware");
  });
});
