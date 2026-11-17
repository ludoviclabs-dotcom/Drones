import { describe, expect, it } from "vitest";
import { systems } from "@/data/systems";
import type { Indicator, SourceRef } from "@/data/types";
import { chargerRegistre } from "../support/registre";
import {
  nombres,
  verifierDossier,
  verifierIndicateur,
  type DossierTracable,
} from "../support/tracabilite";

// Tout chiffre issu du registre « Souveraineté industrielle » est traçable :
// son metric_id existe, sa valeur, sa devise et son statut sont ceux du
// registre, sa source est citée, et un chiffre « divergent » ou « erreur
// d'extraction » est remplacé par la valeur trouvée à la vérification.

const registre = chargerRegistre();

function dossiers(): DossierTracable[] {
  return systems.map((s) => ({
    slug: s.slug,
    indicators: [
      ...s.keySpecs,
      ...s.bricks.flatMap((b) => b.indicators),
      ...(s.physicalConstraints ?? []),
      ...(s.variants ?? []),
    ],
    timeline: s.timeline,
    sources: s.sources,
    registryEntityIds: s.registryEntityIds,
    sovereignty: s.sovereignty,
    industrialChain: s.industrialChain,
    watchpoints: s.watchpoints,
    programmeTree: s.programmeTree,
  }));
}

describe("traçabilité — dossiers réels", () => {
  it("chaque chiffre du registre affiché est conforme au registre", () => {
    const erreurs = dossiers().flatMap((d) => verifierDossier(d, registre));
    expect(erreurs, erreurs.join("\n")).toEqual([]);
  });
});

// ── Le garde-fou doit mordre : cas défectueux construits ───────────────────

const SRC_PRESSE: SourceRef = {
  id: "presse",
  title: "Article de presse",
  publisher: "Presse",
  type: "presse",
  reliability: "C",
  url: "https://example.test/presse",
};

function indic(partiel: Partial<Indicator> & Pick<Indicator, "label" | "value">): Indicator {
  return { confidence: "moyenne", sources: ["presse"], ...partiel } as Indicator;
}

function ecarts(ind: Indicator, sources: SourceRef[] = [SRC_PRESSE]): string {
  return verifierIndicateur(ind, sources, registre).join("\n");
}

describe("traçabilité — le garde-fou détecte les dérives", () => {
  it("nombres() normalise séparateurs, virgules décimales et zéros", () => {
    expect(nombres("13 960 M$")).toEqual(["13960"]);
    expect(nombres("≈ 6,3 Md€ — 05/11/2026")).toEqual(["6.3", "5", "11", "2026"]);
    expect(nombres("jusqu'à 20,0 Md$")).toEqual(["20"]);
  });

  it("refuse un metric_id inconnu", () => {
    expect(ecarts(indic({ label: "x", value: "1", metricIds: ["MET-9999"] }))).toMatch(
      /absent du registre/,
    );
  });

  it("refuse un plafond d'accord-cadre présenté comme une commande ferme (MET-2009, Anduril 20 Md$)", () => {
    const sortie = ecarts(
      indic({
        label: "Accord Army",
        value: "Commande de 20 Md$",
        metricIds: ["MET-2009"],
        figureStatus: "plafond-cadre",
      }),
    );
    expect(sortie).toMatch(/plafond d'accord-cadre/);
  });

  it("accepte le même chiffre quand il est dit « jusqu'à » et sourcé", () => {
    // La source primaire de MET-2009 est celle de sa vérification externe (army.mil).
    const url = registre.metriqueParId.get("MET-2009")?.verification_externe?.source_url ?? undefined;
    expect(url).toMatch(/^https:\/\/www\.army\.mil\//);
    const sortie = ecarts(
      indic({
        label: "Accord Army",
        value: "jusqu'à 20 Md$ (plafond)",
        metricIds: ["MET-2009"],
        figureStatus: "plafond-cadre",
        sources: ["presse"],
      }),
      [{ ...SRC_PRESSE, reliability: "A", type: "officiel", url: url ?? SRC_PRESSE.url }],
    );
    expect(sortie).toBe("");
  });

  it("impose le statut du registre (source unique ≠ officiel)", () => {
    // MET-0002 : prix des 50 % de KNDS — source unique, divergent (6,5 → 6,6).
    const sortie = ecarts(
      indic({ label: "Prix", value: "6,6 Md€", metricIds: ["MET-0002"], figureStatus: "officiel" }),
    );
    expect(sortie).toMatch(/figureStatus « officiel », le registre impose « source-unique »/);
  });

  it("impose la valeur trouvée pour un chiffre « divergent » (MET-0002 : 6,5 → 6,6 Md€)", () => {
    const sortie = ecarts(
      indic({ label: "Prix", value: "≈ 6,5 Md€", metricIds: ["MET-0002"], figureStatus: "source-unique" }),
    );
    expect(sortie).toMatch(/divergent[\s\S]*doit être appliquée/);
  });

  it("interdit de citer un « erreur_extraction » sans valeur de remplacement (MET-0986, cadence CAESAR)", () => {
    const sortie = ecarts(
      indic({ label: "Cadence", value: "6–8 par mois", metricIds: ["MET-0986"], figureStatus: "presse" }),
    );
    expect(sortie).toMatch(/ne pas le citer/);
  });

  it("refuse la conversion de devise (MET-0446 est en EUR)", () => {
    const sortie = ecarts(
      indic({ label: "F126", value: "≈ 11 Md$", metricIds: ["MET-0446"], figureStatus: "presse" }),
    );
    expect(sortie).toMatch(/aucune conversion|devise d'origine/);
  });

  it("exige « (calc.) » pour une valeur calculée (MET-0459)", () => {
    const sortie = ecarts(
      indic({ label: "Total", value: "≈ 11,6 Md€", metricIds: ["MET-0459"], figureStatus: "calcule" }),
    );
    expect(sortie).toMatch(/\(calc\.\)/);
  });

  it("refuse une presse notée A sans source primaire", () => {
    const sortie = ecarts(
      indic({ label: "F126", value: "environ 10 Md€", metricIds: ["MET-0449"], figureStatus: "presse" }),
      [{ ...SRC_PRESSE, reliability: "A" }],
    );
    expect(sortie).toMatch(/fiabilité de source supérieure à C/);
  });

  it("refuse un nombre qui s'écarte du registre (MET-0446 : 10 Md€)", () => {
    const sortie = ecarts(
      indic({ label: "F126", value: "environ 12 Md€", metricIds: ["MET-0446"], figureStatus: "presse" }),
    );
    expect(sortie).toMatch(/nombre\(s\) absent\(s\)/);
  });

  it("refuse la structure parent / enfant inventée", () => {
    const erreurs = verifierDossier(
      {
        slug: "faux",
        indicators: [],
        sources: [],
        registryEntityIds: ["ENT-RAFALE-F5"],
        programmeTree: [
          {
            entityId: "ENT-RAFALE-F5",
            name: "Rafale F5",
            kind: "Programme_Cadre",
            children: [{ entityId: "ENT-THAAD", name: "THAAD", kind: "Munition_Effecteur" }],
          },
        ],
      },
      registre,
    );
    expect(erreurs.join("\n")).toMatch(/a pour parent .* au registre, pas ENT-RAFALE-F5/);
  });
});
