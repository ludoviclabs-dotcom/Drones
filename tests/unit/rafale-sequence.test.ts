import { describe, expect, it } from "vitest";
import { hudBoardBySlug } from "@/data/hud/boards";
import {
  RAFALE_ASSET_MANIFEST,
  RAFALE_ASSET_PATH,
  RAFALE_INITIAL_STATE,
  RAFALE_SCENARIOS,
  RAFALE_SCENARIO_COPY,
  RAFALE_SEQUENCE_COPY,
  RAFALE_SEQUENCE_STATES,
  biomeForScenario,
  isRafaleScenario,
  isRafaleSequenceState,
  isScenarioLocked,
  loadoutForScenario,
  rafaleSequenceReducer,
  rafaleStateIndex,
  scenarioFromSearch,
  type RafaleLoadout,
  type RafaleSequenceState,
} from "@/data/hud/rafale";

/**
 * Vocabulaire proscrit dans les textes de la planche : ni ciblage, ni
 * performance d'engagement. `portée` sans \b attrape aussi « emportée ».
 */
const BANNED =
  /portée|\bcible[rs]?\b|probabilit|altitude d.interception|guidage terminal|no.escape|non.échappement|\bPk\b|létal|neutralis|abattre|destruction/i;
/** « NEZ » (no-escape zone) en capitales seulement : le « nez » de l'avion reste permis. */
const BANNED_CASE_SENSITIVE = /\bNEZ\b/;

function expectCleanCopy(text: string) {
  expect(text).not.toMatch(BANNED);
  expect(text).not.toMatch(BANNED_CASE_SENSITIVE);
}

describe("séquence de la planche Rafale", () => {
  it("suit l’ordre du récit, du vol stabilisé à l’arrêt sur image final", () => {
    expect(RAFALE_SEQUENCE_STATES).toEqual([
      "overview",
      "inspect",
      "sensors",
      "release",
      "launch",
      "complete",
    ]);
    expect(new Set(RAFALE_SEQUENCE_STATES).size).toBe(RAFALE_SEQUENCE_STATES.length);
    expect(RAFALE_INITIAL_STATE).toBe("overview");
    RAFALE_SEQUENCE_STATES.forEach((state, index) => {
      expect(rafaleStateIndex(state)).toBe(index);
    });
  });

  it("avance, recule et se réinitialise dans les bornes", () => {
    let state: RafaleSequenceState = RAFALE_INITIAL_STATE;
    for (const expected of RAFALE_SEQUENCE_STATES.slice(1)) {
      state = rafaleSequenceReducer(state, { type: "NEXT" });
      expect(state).toBe(expected);
    }
    expect(rafaleSequenceReducer(state, { type: "NEXT" })).toBe("complete");
    for (const expected of [...RAFALE_SEQUENCE_STATES].reverse().slice(1)) {
      state = rafaleSequenceReducer(state, { type: "PREVIOUS" });
      expect(state).toBe(expected);
    }
    expect(rafaleSequenceReducer("overview", { type: "PREVIOUS" })).toBe("overview");
    expect(rafaleSequenceReducer("release", { type: "PREVIOUS" })).toBe("sensors");
    expect(rafaleSequenceReducer("launch", { type: "RESET" })).toBe("overview");
    expect(rafaleSequenceReducer("complete", { type: "RESET" })).toBe("overview");
  });

  it("accepte un accès direct à un état connu, et rien d’autre", () => {
    for (const target of RAFALE_SEQUENCE_STATES) {
      expect(rafaleSequenceReducer("overview", { type: "GOTO", state: target })).toBe(target);
    }
    expect(
      rafaleSequenceReducer("inspect", {
        type: "GOTO",
        state: "engage" as unknown as RafaleSequenceState,
      }),
    ).toBe("inspect");
  });

  it("revient à l’état initial si l’état courant est invalide", () => {
    const bogus = "bogus" as unknown as RafaleSequenceState;
    expect(rafaleSequenceReducer(bogus, { type: "NEXT" })).toBe("overview");
    expect(rafaleSequenceReducer(bogus, { type: "PREVIOUS" })).toBe("overview");
    expect(isRafaleSequenceState("launch")).toBe(true);
    expect(isRafaleSequenceState("target")).toBe(false);
    expect(isRafaleSequenceState(3)).toBe(false);
    expect(isRafaleSequenceState(null)).toBe(false);
  });

  it("décrit chaque état sans vocabulaire de ciblage", () => {
    for (const state of RAFALE_SEQUENCE_STATES) {
      const copy = RAFALE_SEQUENCE_COPY[state];
      expect(copy.label.length).toBeGreaterThan(3);
      expect(copy.shortLabel.length).toBeGreaterThan(0);
      expect(copy.description.length).toBeGreaterThan(20);
      expectCleanCopy(`${copy.label} ${copy.shortLabel} ${copy.description}`);
    }
    const last = RAFALE_SEQUENCE_STATES[RAFALE_SEQUENCE_STATES.length - 1];
    expect(RAFALE_SEQUENCE_COPY[last].label).toBe("Planche terminée");
  });

  it("n’attrape pas le « nez » de l’avion, mais bien la « NEZ »", () => {
    expect("le radôme du nez").not.toMatch(BANNED_CASE_SENSITIVE);
    expect("hors NEZ").toMatch(BANNED_CASE_SENSITIVE);
    expect("munitions emportées").toMatch(BANNED);
  });
});

describe("scénarios d’illustration", () => {
  it("propose trois scénarios, chacun avec sa munition nommée", () => {
    expect(RAFALE_SCENARIOS).toEqual(["bvr", "wvr", "sead"]);
    expect(RAFALE_SCENARIO_COPY.bvr.weapon).toBe("Meteor");
    expect(RAFALE_SCENARIO_COPY.wvr.weapon).toBe("MICA IR");
    expect(RAFALE_SCENARIO_COPY.sead.weapon).toBe("AASM Hammer");
    for (const scenario of RAFALE_SCENARIOS) {
      const copy = RAFALE_SCENARIO_COPY[scenario];
      expect(copy.label).toContain(copy.weapon);
      expect(copy.description.length).toBeGreaterThan(20);
      expectCleanCopy(`${copy.label} ${copy.weapon} ${copy.description}`);
    }
  });

  it("montre la configuration air-air pour le Meteor et le MICA, air-sol pour le SEAD", () => {
    const loadouts: Record<string, RafaleLoadout> = {};
    for (const scenario of RAFALE_SCENARIOS) loadouts[scenario] = loadoutForScenario(scenario);
    expect(loadouts).toEqual({ bvr: "air", wvr: "air", sead: "sead" });
  });

  it("survole la mer en air-air et le désert en mission air-sol", () => {
    const biomes = Object.fromEntries(
      RAFALE_SCENARIOS.map((scenario) => [scenario, biomeForScenario(scenario)]),
    );
    expect(biomes).toEqual({ bvr: "sea", wvr: "sea", sead: "desert" });
  });

  it("verrouille le scénario dès la séparation, et pas avant", () => {
    const locked = RAFALE_SEQUENCE_STATES.filter(isScenarioLocked);
    expect(locked).toEqual(["release", "launch", "complete"]);
  });

  it("lit le scénario demandé par l’URL, et ignore tout le reste", () => {
    expect(scenarioFromSearch("?scenario=sead")).toBe("sead");
    expect(scenarioFromSearch("?scenario=wvr&x=1")).toBe("wvr");
    expect(scenarioFromSearch("scenario=bvr")).toBe("bvr");
    expect(scenarioFromSearch("?scenario=junk")).toBeNull();
    expect(scenarioFromSearch("?scenario=SEAD")).toBeNull();
    expect(scenarioFromSearch("?scenario=")).toBeNull();
    expect(scenarioFromSearch("?mode=sead")).toBeNull();
    expect(scenarioFromSearch("")).toBeNull();
    expect(isRafaleScenario("bvr")).toBe(true);
    expect(isRafaleScenario("dogfight")).toBe(false);
    expect(isRafaleScenario(undefined)).toBe(false);
  });

  it("ouvre chaque entrée directe de l’accueil sur un scénario connu, dans l’ordre", () => {
    const board = hudBoardBySlug("rafale-f4-meteor");
    expect(board).toBeDefined();
    const entries = board?.entries ?? [];
    const scenarios = entries.map((entry) =>
      scenarioFromSearch(new URL(entry.href, "https://panoplie.test").search),
    );
    expect(scenarios).toEqual([...RAFALE_SCENARIOS]);
    entries.forEach((entry, index) => {
      const scenario = RAFALE_SCENARIOS[index];
      expect(entry.label).toBe(RAFALE_SCENARIO_COPY[scenario].label);
      expectCleanCopy(`${entry.label} ${entry.detail}`);
    });
  });
});

describe("contrat de nœuds attendu du GLB", () => {
  it("désigne la munition tirée dans chaque scénario", () => {
    expect(RAFALE_ASSET_PATH).toBe("/models/hud/rafale-f4.glb");
    expect(RAFALE_ASSET_MANIFEST.shotNodes).toEqual({
      bvr: "RAF_Meteor_R",
      wvr: "RAF_MicaIR_L",
      sead: "RAF_Hammer_R",
    });
  });

  it("sépare les deux configurations d’emport, sans doublon", () => {
    const { air, sead } = RAFALE_ASSET_MANIFEST.loadoutNodes;
    expect(new Set(air).size).toBe(air.length);
    expect(new Set(sead).size).toBe(sead.length);
    const shared = air.filter((name) => (sead as readonly string[]).includes(name));
    expect(shared).toEqual([]);
  });

  it("laisse visible la munition du scénario dans sa propre configuration", () => {
    const nodes = RAFALE_ASSET_MANIFEST.loadoutNodes;
    for (const scenario of RAFALE_SCENARIOS) {
      const shot = RAFALE_ASSET_MANIFEST.shotNodes[scenario];
      const own = loadoutForScenario(scenario);
      const other: RafaleLoadout = own === "air" ? "sead" : "air";
      expect(nodes[other] as readonly string[], shot).not.toContain(shot);
    }
  });
});
