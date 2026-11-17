// Chargeur du registre « Souveraineté industrielle » — lecture seule, utilisé par
// les tests de données. Les fichiers vivent sous `donnees_registre/`, copiés
// tels quels (octet pour octet) : toute altération est détectée par
// `tests/data/registre-integrite.test.ts` via `SHA256SUMS`.
//
// Ce module n'est importé par aucun code de production : le registre brut
// (≈ 5 Mo) ne doit jamais entrer dans un bundle du site.

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const REGISTRE_DIR = join(process.cwd(), "donnees_registre");

export interface RegistreFournisseur {
  acteur: string;
  role: string;
  pays: string | null;
  perimetre: string | null;
  source: string | null;
}

export interface RegistreSouverainete {
  regle_contenu_local: string;
  verrou_autorisation_tiers: string;
  acces_code_source_et_ip: string;
  goulets_etranglement: string[];
  justification: string | null;
}

export interface RegistreJalon {
  date_ou_horizon: string;
  evenement: string;
  source_fichier: string;
}

export interface RegistreEntite {
  entity_id: string;
  nom_principal: string;
  alias_et_designations: string[];
  type_noeud: string;
  parent_id: string | null;
  programme_concurrent_id: string | null;
  categorie_panoply: string;
  pays_porteur: string | null;
  maitre_oeuvre: string | null;
  chaine_valeur_fournisseurs: RegistreFournisseur[];
  souverainete_et_controle: RegistreSouverainete;
  jalons_a_surveiller: RegistreJalon[];
  sources_fichiers: unknown;
  notes_fusion: unknown;
}

export interface RegistreVerification {
  verdict: string;
  valeur_trouvee: string | null;
  source_url: string | null;
  source_titre: string | null;
  source_date: string | null;
  extrait: string | null;
  commentaire: string | null;
}

export interface RegistreMetrique {
  metric_id: string;
  entity_id: string;
  cle_fait: string;
  libelle: string;
  type_metrique: string;
  exercice_ou_horizon: string | null;
  valeur_numerique: number | null;
  borne: unknown;
  valeur_texte_originale: string | null;
  unite: string | null;
  devise: string | null;
  multiplicateur: number | null;
  statut_chiffre: string;
  est_lecture_analytique: boolean;
  alerte_audit: string | null;
  tracabilite: {
    fichier: string | null;
    date_arrete_fichier: string | null;
    section: string | null;
    numero_note_bas_de_page: string | null;
    reference_source_complete: string | null;
    citation_courte: string | null;
  };
  controle_interne: string;
  verification_externe: RegistreVerification | null;
}

export interface Registre {
  meta: Record<string, unknown> & {
    nb_entites: number;
    nb_metriques: number;
  };
  entites: RegistreEntite[];
  metriques: RegistreMetrique[];
  entiteParId: Map<string, RegistreEntite>;
  metriqueParId: Map<string, RegistreMetrique>;
}

export function lireFichier(nom: string): Buffer {
  return readFileSync(join(REGISTRE_DIR, nom));
}

export function sha256(nom: string): string {
  return createHash("sha256").update(lireFichier(nom)).digest("hex");
}

let cache: Registre | null = null;

export function chargerRegistre(): Registre {
  if (cache) return cache;
  const brut = JSON.parse(lireFichier("panoplie_registre.json").toString("utf8")) as {
    meta: Registre["meta"];
    entites_et_programmes: RegistreEntite[];
    registre_metriques_et_audit: RegistreMetrique[];
  };
  const entites = brut.entites_et_programmes;
  const metriques = brut.registre_metriques_et_audit;
  cache = {
    meta: brut.meta,
    entites,
    metriques,
    entiteParId: new Map(entites.map((e) => [e.entity_id, e])),
    metriqueParId: new Map(metriques.map((m) => [m.metric_id, m])),
  };
  return cache;
}

/**
 * Lecture CSV conforme à la RFC 4180 : champs entre guillemets (virgules, sauts
 * de ligne et guillemets doublés), BOM UTF-8 ignoré, fins de ligne CRLF ou LF.
 */
export function parserCsv(texte: string): Record<string, string>[] {
  const contenu = texte.charCodeAt(0) === 0xfeff ? texte.slice(1) : texte;
  const lignes: string[][] = [];
  let champ = "";
  let ligne: string[] = [];
  let guillemets = false;

  for (let i = 0; i < contenu.length; i++) {
    const c = contenu[i];
    if (guillemets) {
      if (c === '"') {
        if (contenu[i + 1] === '"') {
          champ += '"';
          i++;
        } else {
          guillemets = false;
        }
      } else {
        champ += c;
      }
      continue;
    }
    if (c === '"') {
      guillemets = true;
    } else if (c === ",") {
      ligne.push(champ);
      champ = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && contenu[i + 1] === "\n") i++;
      ligne.push(champ);
      champ = "";
      lignes.push(ligne);
      ligne = [];
    } else {
      champ += c;
    }
  }
  if (champ !== "" || ligne.length > 0) {
    ligne.push(champ);
    lignes.push(ligne);
  }

  const [entetes, ...corps] = lignes;
  return corps
    .filter((l) => l.length > 1 || (l.length === 1 && l[0] !== ""))
    .map((l) => Object.fromEntries(entetes.map((nom, i) => [nom, l[i] ?? ""])));
}

export function chargerCsv(nom: string): Record<string, string>[] {
  return parserCsv(lireFichier(nom).toString("utf8"));
}

/** Correspondance `statut_chiffre` du registre → `FigureStatus` du site. */
export const STATUT_VERS_FIGURE: Record<string, string> = {
  officiel_publie: "officiel",
  commande_ferme: "commande-ferme",
  requete_budgetaire: "requete-budgetaire",
  presse_specialisee: "presse",
  source_unique_alerte: "source-unique",
  calcule_auteur: "calcule",
  non_communique: "non-communique",
  plafond_cadre_IDIQ: "plafond-cadre",
  classifie: "classifie",
};
