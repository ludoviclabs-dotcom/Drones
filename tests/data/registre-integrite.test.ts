import { describe, expect, it } from "vitest";
import {
  chargerCsv,
  chargerRegistre,
  lireFichier,
  sha256,
  STATUT_VERS_FIGURE,
} from "../support/registre";

// Garde-fou de la source : les fichiers du registre sont copiés octet pour
// octet. Ce test échoue si l'un d'eux est modifié, converti (fins de ligne,
// encodage) ou si les vues à plat divergent du JSON principal.

const FICHIERS = [
  "panoplie_registre.json",
  "panoplie_metriques.csv",
  "panoplie_entites.csv",
  "panoplie_jalons.csv",
  "panoplie_verifications.csv",
  "panoplie_calculs.csv",
  "panoplie_ecarts_site.csv",
];

describe("registre — intégrité des fichiers sources", () => {
  it("chaque fichier correspond à son empreinte SHA-256", () => {
    const somme = new Map(
      lireFichier("SHA256SUMS")
        .toString("utf8")
        .split(/\r?\n/)
        .filter(Boolean)
        .map((ligne) => {
          const [hash, nom] = ligne.split(/\s+\*?/);
          return [nom, hash] as const;
        }),
    );
    expect([...somme.keys()].sort()).toEqual([...FICHIERS].sort());
    for (const nom of FICHIERS) {
      expect(sha256(nom), `${nom} a été modifié`).toBe(somme.get(nom));
    }
  });

  it("les CSV conservent leur BOM UTF-8 et leurs fins de ligne CRLF d'origine", () => {
    for (const nom of FICHIERS.filter((n) => n.endsWith(".csv"))) {
      const octets = lireFichier(nom);
      expect([...octets.subarray(0, 3)], `${nom} : BOM`).toEqual([0xef, 0xbb, 0xbf]);
      expect(octets.includes(Buffer.from("\r\n")), `${nom} : CRLF`).toBe(true);
    }
  });
});

describe("registre — cohérence interne", () => {
  const registre = chargerRegistre();

  it("les effectifs annoncés par `meta` sont ceux des tables", () => {
    expect(registre.entites).toHaveLength(registre.meta.nb_entites);
    expect(registre.metriques).toHaveLength(registre.meta.nb_metriques);
    expect(registre.entites).toHaveLength(398);
    expect(registre.metriques).toHaveLength(2051);
  });

  it("les identifiants sont uniques et chaque métrique a une entité connue", () => {
    expect(registre.entiteParId.size).toBe(registre.entites.length);
    expect(registre.metriqueParId.size).toBe(registre.metriques.length);
    for (const m of registre.metriques) {
      expect(registre.entiteParId.has(m.entity_id), `${m.metric_id} → ${m.entity_id}`).toBe(true);
    }
  });

  it("tout `statut_chiffre` a une correspondance de rendu", () => {
    for (const m of registre.metriques) {
      expect(STATUT_VERS_FIGURE[m.statut_chiffre], `${m.metric_id} : ${m.statut_chiffre}`).toBeTruthy();
    }
  });

  it("panoplie_metriques.csv reprend exactement les métriques du JSON", () => {
    const lignes = chargerCsv("panoplie_metriques.csv");
    expect(lignes).toHaveLength(registre.metriques.length);
    for (const ligne of lignes) {
      const m = registre.metriqueParId.get(ligne.metric_id);
      expect(m, ligne.metric_id).toBeTruthy();
      if (!m) continue;
      expect(ligne.entity_id).toBe(m.entity_id);
      expect(ligne.statut_chiffre).toBe(m.statut_chiffre);
      expect(ligne.libelle).toBe(m.libelle);
      expect(ligne.valeur_texte_originale).toBe(m.valeur_texte_originale ?? "");
    }
  });

  it("panoplie_entites.csv et panoplie_jalons.csv reprennent les entités et jalons du JSON", () => {
    const entites = chargerCsv("panoplie_entites.csv");
    expect(entites.map((e) => e.entity_id).sort()).toEqual(
      registre.entites.map((e) => e.entity_id).sort(),
    );
    const jalons = chargerCsv("panoplie_jalons.csv");
    const attendus = registre.entites.flatMap((e) => e.jalons_a_surveiller);
    expect(jalons).toHaveLength(attendus.length);
  });

  it("panoplie_verifications.csv reprend les 154 vérifications externes du JSON", () => {
    const lignes = chargerCsv("panoplie_verifications.csv");
    const avecVerif = registre.metriques.filter((m) => m.verification_externe);
    expect(lignes).toHaveLength(154);
    expect(avecVerif).toHaveLength(154);
    for (const ligne of lignes) {
      const m = registre.metriqueParId.get(ligne.metric_id);
      expect(m?.verification_externe?.verdict, ligne.metric_id).toBe(ligne.verdict);
      expect(m?.verification_externe?.source_url ?? "", ligne.metric_id).toBe(ligne.source_url);
    }
  });

  it("panoplie_calculs.csv (112 formules) et panoplie_ecarts_site.csv (23 écarts) sont complets", () => {
    expect(chargerCsv("panoplie_calculs.csv")).toHaveLength(112);
    expect(chargerCsv("panoplie_ecarts_site.csv")).toHaveLength(23);
  });
});
