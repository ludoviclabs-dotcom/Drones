import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildFilmData, FILM_DOSSIER_SLUG } from "@/film/build-film-data";
import {
  CHAPTERS,
  FILM_DURATION,
  FILM_FPS,
  FILM_SECONDS,
  chapterAt,
  chapterById,
  formatTimecode,
} from "@/film/timeline";
import { getEvidenceStats } from "@/lib/claims";
import { SYSTEMS_BY_SLUG } from "@/data/systems";
import { HUD_BOARDS } from "@/data/hud/boards";
import { DOMAINS } from "@/data/domains";
import { BRICK_ORDER } from "@/data/labels";

/**
 * Film « Panoplie en N secondes » — le découpage pilote la composition, la
 * barre de chapitres et la transcription ; les données viennent du registre.
 */

describe("film — découpage", () => {
  it("enchaîne les chapitres sans trou ni chevauchement", () => {
    expect(CHAPTERS[0].from).toBe(0);
    for (let i = 1; i < CHAPTERS.length; i++) {
      const previous = CHAPTERS[i - 1];
      expect(CHAPTERS[i].from).toBe(previous.from + previous.durationInFrames);
    }
    const last = CHAPTERS.at(-1)!;
    expect(last.from + last.durationInFrames).toBe(FILM_DURATION);
    expect(FILM_SECONDS).toBe(Math.round(FILM_DURATION / FILM_FPS));
  });

  it("a des identifiants uniques et des numéros consécutifs", () => {
    expect(new Set(CHAPTERS.map((c) => c.id)).size).toBe(CHAPTERS.length);
    CHAPTERS.forEach((chapter, i) =>
      expect(chapter.num).toBe(String(i + 1).padStart(2, "0")),
    );
  });

  it("place chaque image clé dans son chapitre, après l'animation", () => {
    for (const chapter of CHAPTERS) {
      expect(chapter.keyFrame).toBeGreaterThan(0);
      expect(chapter.keyFrame).toBeLessThan(chapter.durationInFrames);
      // Une seconde avant la fin : après les apparitions, avant le fondu.
      expect(chapter.durationInFrames - chapter.keyFrame).toBe(FILM_FPS);
    }
  });

  it("retrouve le chapitre d'une image, bornes comprises", () => {
    for (const chapter of CHAPTERS) {
      expect(chapterAt(chapter.from).id).toBe(chapter.id);
      expect(chapterAt(chapter.from + chapter.durationInFrames - 1).id).toBe(
        chapter.id,
      );
    }
    expect(chapterAt(-10).id).toBe(CHAPTERS[0].id);
    expect(chapterAt(FILM_DURATION + 10).id).toBe(CHAPTERS.at(-1)!.id);
    expect(chapterById("preuve")?.id).toBe("preuve");
    expect(chapterById("inconnu")).toBeUndefined();
  });

  it("met en forme le minutage", () => {
    expect(formatTimecode(0)).toBe("0:00");
    expect(formatTimecode(FILM_FPS * 65)).toBe("1:05");
    expect(formatTimecode(-5)).toBe("0:00");
  });
});

describe("film — données du registre", () => {
  const data = buildFilmData();
  const stats = getEvidenceStats();

  it("reprend les compteurs du registre, sans saisie", () => {
    expect(data.stats.systems).toBe(stats.systems);
    expect(data.stats.sources).toBe(stats.sources);
    expect(data.stats.claims).toBe(stats.claims);
    expect(data.stats.verified).toBe(stats.byStatus.verifie);
    expect(data.stats.domains).toBe(DOMAINS.length);
    expect(data.domains).toEqual(DOMAINS.map((d) => d.label));
  });

  it("lit le dossier sous ses cinq angles, dans l'ordre du site", () => {
    const system = SYSTEMS_BY_SLUG[FILM_DOSSIER_SLUG];
    expect(data.dossier.name).toBe(system.name);
    expect(data.dossier.angles.map((a) => a.key)).toEqual(
      BRICK_ORDER.filter((key) => system.bricks.some((b) => b.key === key)),
    );
    for (const angle of data.dossier.angles) {
      const brick = system.bricks.find((b) => b.key === angle.key)!;
      expect(brick.narrative.startsWith(angle.lede)).toBe(true);
      expect(brick.indicators.map((i) => i.value)).toContain(
        angle.indicator.value,
      );
    }
  });

  it("cite une source réelle du dossier, sans date inventée", () => {
    const system = SYSTEMS_BY_SLUG[FILM_DOSSIER_SLUG];
    const source = system.sources.find(
      (s) => s.publisher === data.proof.source.publisher,
    );
    expect(source).toBeDefined();
    expect(source!.reliability).toBe(data.proof.source.reliability);
    if (!source!.date) expect(data.proof.source.dateLabel).toBeUndefined();
    const indicator = system.bricks
      .flatMap((b) => b.indicators)
      .find((i) => i.label === data.proof.claimLabel)!;
    expect(indicator.value).toBe(data.proof.value);
    expect(indicator.sources).toContain(source!.id);
  });

  it("compare des paliers réels des deux dossiers", () => {
    expect(data.compare.rows.length).toBeGreaterThan(0);
    for (const row of data.compare.rows) {
      expect(["A", "B", "C", "D", "E"]).toContain(row.left);
      expect(["A", "B", "C", "D", "E"]).toContain(row.right);
    }
  });

  it("pointe des vignettes présentes dans public/", () => {
    expect(data.boards).toHaveLength(HUD_BOARDS.length);
    for (const board of data.boards) {
      expect(existsSync(join(process.cwd(), "public", board.src))).toBe(true);
    }
  });

  it("reste sérialisable (inputProps du lecteur)", () => {
    expect(JSON.parse(JSON.stringify(data))).toEqual(data);
  });

  it("produit des sous-titres complets pour chaque chapitre", () => {
    for (const chapter of CHAPTERS) {
      const caption = chapter.caption(data);
      expect(caption.length).toBeGreaterThan(20);
      expect(caption).not.toMatch(/undefined|NaN|null/);
    }
  });
});
