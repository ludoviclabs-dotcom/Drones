import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import {
  HUD_BOARDS,
  HUD_INDEX_PATH,
  hudBoardBySlug,
} from "@/data/hud/boards";
import { hudBreadcrumbLd } from "@/lib/structured-data";

const ROOT = process.cwd();
const PREVIEW_BUDGET_BYTES = 150 * 1024;

/**
 * Lit les dimensions encodées d'un WebP (VP8 avec perte, VP8L sans perte, ou
 * conteneur étendu VP8X) — de quoi vérifier que la vignette correspond vraiment
 * aux dimensions déclarées, sans dépendance d'image.
 */
function webpSize(buffer: Buffer): { width: number; height: number } {
  if (
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP"
  ) {
    throw new Error("pas un fichier WebP");
  }
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") {
    return {
      width: buffer.readUIntLE(24, 3) + 1,
      height: buffer.readUIntLE(27, 3) + 1,
    };
  }
  throw new Error(`segment WebP inattendu : ${chunk}`);
}

describe("registre des planches techniques", () => {
  it("expose au moins les deux planches publiées", () => {
    expect(HUD_BOARDS.map((board) => board.slug)).toEqual(
      expect.arrayContaining(["thundart", "drone-airframe"]),
    );
  });

  it("n’a ni slug ni route en double", () => {
    const slugs = HUD_BOARDS.map((board) => board.slug);
    const hrefs = HUD_BOARDS.map((board) => board.href);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it.each(HUD_BOARDS)("$slug pointe vers une route existante", (board) => {
    expect(board.href).toBe(`${HUD_INDEX_PATH}/${board.slug}`);
    expect(existsSync(join(ROOT, "src/app", board.href, "page.tsx"))).toBe(true);
  });

  it.each(HUD_BOARDS)(
    "$slug reprend le titre exact de la planche",
    (board) => {
      const source = readFileSync(
        join(ROOT, "src/app", board.href, "page.tsx"),
        "utf8",
      );
      expect(source).toContain(board.title);
    },
  );

  it.each(HUD_BOARDS)(
    "$slug a une vignette WebP réelle, légère et aux bonnes dimensions",
    (board) => {
      const file = join(ROOT, "public", board.preview.src);
      expect(existsSync(file)).toBe(true);
      expect(statSync(file).size).toBeLessThan(PREVIEW_BUDGET_BYTES);
      expect(webpSize(readFileSync(file))).toEqual({
        width: board.preview.width,
        height: board.preview.height,
      });
      expect(board.preview.alt.length).toBeGreaterThan(20);
    },
  );

  it.each(HUD_BOARDS)("$slug garde trois repères au plus", (board) => {
    expect(board.features.length).toBeGreaterThan(0);
    expect(board.features.length).toBeLessThanOrEqual(3);
  });

  it("retrouve une planche par son slug", () => {
    expect(hudBoardBySlug("thundart")?.href).toBe("/hud/thundart");
    expect(hudBoardBySlug("inconnue")).toBeUndefined();
  });
});

describe("découvrabilité", () => {
  it("le sitemap liste l’index et chaque planche", () => {
    const urls = sitemap().map((entry) => new URL(entry.url).pathname);
    expect(urls).toContain(HUD_INDEX_PATH);
    for (const board of HUD_BOARDS) {
      expect(urls).toContain(board.href);
    }
  });

  it("le fil d’Ariane structuré enchaîne Accueil › Planches › planche", () => {
    const board = hudBoardBySlug("thundart");
    const ld = hudBreadcrumbLd(board) as {
      itemListElement: { position: number; name: string; item: string }[];
    };
    expect(ld.itemListElement.map((item) => item.name)).toEqual([
      "Accueil",
      "Planches techniques",
      board?.title,
    ]);
    expect(ld.itemListElement.map((item) => item.position)).toEqual([1, 2, 3]);
    expect(ld.itemListElement[2]?.item).toMatch(/\/hud\/thundart$/);

    const index = hudBreadcrumbLd() as { itemListElement: unknown[] };
    expect(index.itemListElement).toHaveLength(2);
  });
});
