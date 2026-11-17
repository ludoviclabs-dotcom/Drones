import type { SourceRef } from "../types";
import { src } from "./registry-helpers";

// Sources communes aux fiches HYDIS et HYDEF (appel FED « Endo-Atmospheric
// Interceptor »). Titres et dates repris du registre ; chaque fiche en retient
// celles qu'elle cite.

export const FED_SOURCES: Record<string, SourceRef> = {
  "defensenews-hydis-1105": src(
    "defensenews-hydis-1105",
    "Defense News (R. Ruitenberg)",
    "MBDA plans to fly 'fat' hypersonic interceptor demonstrator before end-2029",
    "presse",
    "C",
    "2026-11-05",
    "https://www.defensenews.com/global/europe/2026/11/05/mbda-plans-to-fly-fat-hypersonic-interceptor-demonstrator-before-end-2029/",
  ),
  "defensenews-hydis-0713": src(
    "defensenews-hydis-0713",
    "Defense News",
    "Europe's Hydis project settles on concept for hypersonic interceptor",
    "presse",
    "C",
    "2026-07-13",
    "https://www.defensenews.com/global/europe/2026/07/13/europes-hydis-project-settles-on-concept-for-hypersonic-interceptor/",
  ),
  "navalnews-hydis-grant": src(
    "navalnews-hydis-grant",
    "Naval News (X. Vavasseur)",
    "EU Signs Grant for MBDA-Led HYDIS Hypersonic Interceptor Project",
    "presse",
    "C",
    "2026-07-10",
    "https://www.navalnews.com/?p=88920",
  ),
  "breaking-eai-1106": src(
    "breaking-eai-1106",
    "Breaking Defense",
    "Europe nears decision on competing hypersonic interceptor programs",
    "presse",
    "C",
    "2026-11-06",
    "https://breakingdefense.com/2026/11/europe-nears-decision-on-competing-hypersonic-interceptor-programs/",
  ),
  "metadefense-hydis-hydef": src(
    "metadefense-hydis-hydef",
    "Meta-Defense (F. Wolf)",
    "Hydis contre Hydef : 2 intercepteurs antimissiles concurrents",
    "presse",
    "C",
    "2026-11-05",
    "https://meta-defense.fr/2026/11/05/hydis-hydef-intercepteurs-europe/",
  ),
  "defencematters-eai": src(
    "defencematters-eai",
    "Defence Matters (citant Breaking Defense)",
    "Europe Faces Critical Hypersonic Missile Defence Decision",
    "presse",
    "C",
    undefined,
    "https://defencematters.eu/europe-hypersonic-missile-defence-hydef-hydis-decision-2026/",
  ),
  "ec-defis-hydis2": src(
    "ec-defis-hydis2",
    "Commission européenne — DG DEFIS",
    "EDF 2023 project Hypersonic Defence Interceptor Study (HYDIS²) entrusted to OCCAR",
    "officiel",
    "A",
    "2023-12-11",
    "https://defence-industry-space.ec.europa.eu/edf-2023-project-hypersonic-defence-interceptor-study-hydis2-entrusted-occar-2023-12-11_en",
  ),
  "sener-hydef": src(
    "sener-hydef",
    "Sener (coordinateur EU HYDEF)",
    "SENER Aeroespacial will lead the main project from the European Defence Fund",
    "constructeur",
    "C",
    "2022-07-21",
    "https://www.group.sener/en/?p=51410",
  ),
  "defence-industry-hydef-amendment": src(
    "defence-industry-hydef-amendment",
    "defence-industry.eu",
    "HYDEF programme: first Amendment to the Grant Agreement signed",
    "presse",
    "C",
    "2024-05-06",
    "https://defence-industry.eu/hydef-programme-first-amendment-to-the-grant-agreement-signed/",
  ),
  "defence-industry-hydef-review": src(
    "defence-industry-hydef-review",
    "defence-industry.eu",
    "Europe's HYDEF hypersonic interceptor programme passes feasibility review, advancing technologies towards a TRL 6 prototype",
    "presse",
    "C",
    undefined,
    "https://defence-industry.eu/europes-hydef-hypersonic-interceptor-programme-passes-feasibility-review-advancing-technologies-towards-a-trl-6-prototype/",
  ),
};

export function fedSources(ids: string[]): SourceRef[] {
  return ids.map((id) => {
    const found = FED_SOURCES[id];
    if (!found) throw new Error(`Source FED inconnue : ${id}`);
    return found;
  });
}
