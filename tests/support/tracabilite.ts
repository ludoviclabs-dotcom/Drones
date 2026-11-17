// Règles de traçabilité des chiffres issus du registre « Souveraineté
// industrielle ». Fonctions pures : elles renvoient la liste des écarts
// constatés, vide si le dossier est conforme. Utilisées par
// `tests/data/registre-tracabilite.test.ts` sur les données réelles, et sur des
// cas défectueux construits pour prouver que le garde-fou mord.

import type {
  FigureStatus,
  Indicator,
  IndustrialLink,
  ProgrammeNode,
  Reliability,
  SourceRef,
  SovereigntyProfile,
  TimelineEvent,
  Watchpoint,
} from "@/data/types";
import {
  STATUT_VERS_FIGURE,
  type Registre,
  type RegistreMetrique,
} from "./registre";

export interface DossierTracable {
  slug: string;
  indicators: Indicator[];
  timeline?: TimelineEvent[];
  sources: SourceRef[];
  registryEntityIds?: string[];
  sovereignty?: SovereigntyProfile[];
  industrialChain?: IndustrialLink[];
  watchpoints?: Watchpoint[];
  programmeTree?: ProgrammeNode[];
}

/** Du plus fragile au plus solide — sert à choisir le statut d'un chiffre composite. */
const FRAGILE_D_ABORD: FigureStatus[] = [
  "non-communique",
  "source-unique",
  "presse",
  "calcule",
  "plafond-cadre",
  "requete-budgetaire",
  "classifie",
  "officiel",
  "commande-ferme",
];

const RANG_FIABILITE: Record<Reliability, number> = { A: 4, B: 3, C: 2, D: 1 };

const MARQUEURS_DEVISE: Record<string, RegExp> = {
  EUR: /€|\beur\b|\beuros?\b/i,
  USD: /\$|\busd\b|\bdollars?\b/i,
  GBP: /£|\bgbp\b|\blivres?\s+sterling\b/i,
  INR: /₹|\binr\b|\broupies?\b/i,
};

/** Nombres d'un texte, normalisés : « 13 960 » → 13960, « 6,3 » → 6.3, « 05 » → 5. */
export function nombres(texte: string): string[] {
  const t = texte
    .replace(/(\d)[\s  ](?=\d{3}(?!\d))/g, "$1")
    .replace(/(\d),(\d)/g, "$1.$2");
  return (t.match(/\d+(?:\.\d+)?/g) ?? []).map((n) => String(Number(n)));
}

function manque(attendus: string[], texte: string): string[] {
  const presents = new Set(nombres(texte));
  return attendus.filter((n) => !presents.has(n));
}

/** Retire la ponctuation de fin de phrase, et une parenthèse fermante non appariée. */
function nettoyerUrl(brute: string): string {
  let u = brute.replace(/[.,;:]+$/, "");
  while (u.endsWith(")") && (u.match(/\)/g) ?? []).length > (u.match(/\(/g) ?? []).length) {
    u = u.slice(0, -1).replace(/[.,;:]+$/, "");
  }
  return u;
}

function urlsDe(m: RegistreMetrique): string[] {
  const ref = m.tracabilite.reference_source_complete ?? "";
  const dansRef = ref.match(/https?:\/\/\S+/g) ?? [];
  const verif = m.verification_externe?.source_url
    ? [m.verification_externe.source_url]
    : [];
  return [...verif, ...dansRef].map(nettoyerUrl);
}

export function verifierIndicateur(
  ind: Indicator,
  sources: SourceRef[],
  registre: Registre,
): string[] {
  const erreurs: string[] = [];
  const id = `« ${ind.label} »`;
  const ids = ind.metricIds ?? [];
  if (ids.length === 0) return erreurs;

  const metriques: RegistreMetrique[] = [];
  for (const mid of ids) {
    const m = registre.metriqueParId.get(mid);
    if (!m) erreurs.push(`${id} : ${mid} est absent du registre`);
    else metriques.push(m);
  }
  if (metriques.length !== ids.length) return erreurs;

  const texte = `${ind.value} ${ind.note ?? ""}`;
  const valeur = ind.value;

  // Statut du chiffre : repris du registre, jamais embelli.
  const statuts = metriques.map((m) => STATUT_VERS_FIGURE[m.statut_chiffre] as FigureStatus);
  const attendu = [...statuts].sort(
    (a, b) => FRAGILE_D_ABORD.indexOf(a) - FRAGILE_D_ABORD.indexOf(b),
  )[0];
  if (ind.figureStatus !== attendu) {
    erreurs.push(
      `${id} : figureStatus « ${ind.figureStatus ?? "absent"} », le registre impose « ${attendu} » (${ids.join(", ")})`,
    );
  }

  const sourcesCitees = (ind.sources ?? [])
    .map((sid) => sources.find((s) => s.id === sid))
    .filter((s): s is SourceRef => Boolean(s));

  for (const m of metriques) {
    const mid = m.metric_id;
    const statut = STATUT_VERS_FIGURE[m.statut_chiffre];
    const verif = m.verification_externe;

    if (m.est_lecture_analytique) {
      erreurs.push(`${id} : ${mid} est une lecture analytique de l'auteur, pas un fait sourcé`);
      continue;
    }

    // Verdict de la vérification externe.
    const aCorriger = verif && ["divergent", "erreur_extraction"].includes(verif.verdict);
    if (aCorriger && verif) {
      const trouves = nombres(verif.valeur_trouvee ?? "");
      if (trouves.length === 0) {
        erreurs.push(
          `${id} : ${mid} est « ${verif.verdict} » sans valeur de remplacement chiffrée — ne pas le citer`,
        );
        continue;
      }
      const absents = manque(trouves, texte);
      if (absents.length > 0) {
        erreurs.push(
          `${id} : ${mid} est « ${verif.verdict} » — la valeur trouvée (${verif.valeur_trouvee}) doit être appliquée ; manque ${absents.join(", ")}`,
        );
      }
      if (verif.source_url && !sourcesCitees.some((s) => s.url === verif.source_url)) {
        erreurs.push(`${id} : ${mid} — la source de la vérification (${verif.source_url}) n'est pas citée`);
      }
    } else if (statut === "non-communique") {
      if (!/n\.c\./.test(valeur)) erreurs.push(`${id} : ${mid} non communiqué — la valeur doit s'écrire « n.c. »`);
    } else {
      // Fidélité numérique : tout nombre du registre figure dans le chiffre affiché.
      const attendus = nombres(m.valeur_texte_originale ?? "");
      const absents = manque(attendus, texte);
      if (absents.length > 0) {
        erreurs.push(
          `${id} : ${mid} (« ${m.valeur_texte_originale} ») — nombre(s) absent(s) du chiffre affiché : ${absents.join(", ")}`,
        );
      }
    }

    if (statut === "calcule" && !valeur.includes("(calc.)")) {
      erreurs.push(`${id} : ${mid} est calculé — la valeur doit porter « (calc.) »`);
    }
    if (statut === "plafond-cadre" && !/jusqu['’]à|plafond|maximum|option|au plus/i.test(valeur)) {
      erreurs.push(`${id} : ${mid} est un plafond d'accord-cadre — la valeur doit le dire (« jusqu'à », « plafond »…)`);
    }

    // Une source citée est obligatoire, sauf pour un calcul ou un « n.c. ».
    if (!["calcule", "non-communique"].includes(statut) && sourcesCitees.length === 0) {
      erreurs.push(`${id} : ${mid} n'a aucune source citée`);
    }

    // URL : si le registre en donne une, l'une d'elles est citée.
    const urls = urlsDe(m);
    if (
      !["calcule", "non-communique"].includes(statut) &&
      urls.length > 0 &&
      sourcesCitees.length > 0 &&
      !sourcesCitees.some((s) => s.url && urls.includes(nettoyerUrl(s.url)))
    ) {
      erreurs.push(`${id} : ${mid} — aucune source citée ne porte une URL du registre (${urls[0]}…)`);
    }

    // Un article de presse ou à source unique, non recoupé par une source
    // primaire, ne peut pas être noté A ou B. La règle vise les sources typées
    // « presse » : une page officielle ou un rapport d'institution cité à
    // l'appui garde sa propre note.
    const articles = sourcesCitees.filter((s) => s.type === "presse");
    if (
      ["presse", "source-unique"].includes(statut) &&
      verif?.verdict !== "confirme_source_primaire" &&
      articles.length > 0
    ) {
      const meilleure = Math.max(...articles.map((s) => RANG_FIABILITE[s.reliability]));
      if (meilleure > RANG_FIABILITE.C) {
        erreurs.push(`${id} : ${mid} (${statut}) — fiabilité d'un article de presse supérieure à C sans source primaire`);
      }
    }
  }

  // Devise d'origine conservée, sans conversion.
  const devises = new Set(metriques.map((m) => m.devise).filter((d): d is string => Boolean(d)));
  for (const [code, regle] of Object.entries(MARQUEURS_DEVISE)) {
    const presente = regle.test(valeur);
    if (devises.has(code) && !presente && nombres(valeur).length > 0) {
      erreurs.push(`${id} : la devise d'origine ${code} n'apparaît pas dans « ${valeur} »`);
    }
    if (!devises.has(code) && presente && devises.size > 0) {
      erreurs.push(`${id} : « ${valeur} » mentionne ${code}, le registre indique ${[...devises].join("/")} (aucune conversion)`);
    }
  }

  return erreurs;
}

/**
 * Repère de frise : le nombre ou la date repris du registre figure dans le
 * libellé, sans conversion de devise. Pas de source ni de statut propres : la
 * frise renvoie aux indicateurs du dossier pour cela.
 */
export function verifierEvenement(ev: TimelineEvent, registre: Registre): string[] {
  const erreurs: string[] = [];
  const id = `frise ${ev.date} « ${ev.label.slice(0, 40)}… »`;
  for (const mid of ev.metricIds ?? []) {
    const m = registre.metriqueParId.get(mid);
    if (!m) {
      erreurs.push(`${id} : ${mid} est absent du registre`);
      continue;
    }
    if (m.est_lecture_analytique) {
      erreurs.push(`${id} : ${mid} est une lecture analytique de l'auteur`);
      continue;
    }
    const verif = m.verification_externe;
    const aCorriger = verif && ["divergent", "erreur_extraction"].includes(verif.verdict);
    const attendus = nombres(aCorriger && verif ? (verif.valeur_trouvee ?? "") : (m.valeur_texte_originale ?? ""));
    if (aCorriger && attendus.length === 0) {
      erreurs.push(`${id} : ${mid} est « ${verif?.verdict} » sans valeur de remplacement — ne pas le citer`);
      continue;
    }
    const absents = manque(attendus, ev.label);
    if (absents.length > 0) {
      erreurs.push(`${id} : ${mid} — nombre(s) absent(s) du libellé : ${absents.join(", ")}`);
    }
    if (m.devise && MARQUEURS_DEVISE[m.devise] && nombres(ev.label).length > 0) {
      for (const [code, regle] of Object.entries(MARQUEURS_DEVISE)) {
        if (code !== m.devise && regle.test(ev.label)) {
          erreurs.push(`${id} : « ${code} » écrit, le registre indique ${m.devise} (aucune conversion)`);
        }
      }
    }
  }
  return erreurs;
}

export function verifierDossier(d: DossierTracable, registre: Registre): string[] {
  const erreurs: string[] = [];
  const quoi = (e: string) => `[${d.slug}] ${e}`;

  for (const ind of d.indicators) {
    for (const e of verifierIndicateur(ind, d.sources, registre)) erreurs.push(quoi(e));
  }
  for (const ev of d.timeline ?? []) {
    for (const e of verifierEvenement(ev, registre)) erreurs.push(quoi(e));
  }

  const entites = d.registryEntityIds ?? [];
  for (const eid of entites) {
    if (!registre.entiteParId.has(eid)) erreurs.push(quoi(`entité ${eid} absente du registre`));
  }
  const dansDossier = (eid: string) => entites.includes(eid);

  for (const s of d.sovereignty ?? []) {
    const e = registre.entiteParId.get(s.entityId);
    if (!e) erreurs.push(quoi(`souveraineté : entité ${s.entityId} absente du registre`));
    else {
      if (!dansDossier(s.entityId)) erreurs.push(quoi(`souveraineté : ${s.entityId} absente de registryEntityIds`));
      const r = e.souverainete_et_controle;
      if (
        s.localContentRule !== r.regle_contenu_local ||
        s.thirdPartyLock !== r.verrou_autorisation_tiers ||
        s.sourceCodeAccess !== r.acces_code_source_et_ip
      ) {
        erreurs.push(quoi(`souveraineté de ${s.entityId} différente du registre`));
      }
      if (JSON.stringify(s.chokepoints) !== JSON.stringify(r.goulets_etranglement)) {
        erreurs.push(quoi(`goulets d'étranglement de ${s.entityId} différents du registre`));
      }
    }
  }

  for (const l of d.industrialChain ?? []) {
    const e = registre.entiteParId.get(l.entityId);
    const ligne = e?.chaine_valeur_fournisseurs.find(
      (f) =>
        f.acteur === l.actor &&
        f.role === l.role &&
        (l.scope === undefined || f.perimetre === l.scope) &&
        (l.country === undefined || f.pays === l.country),
    );
    if (!ligne) erreurs.push(quoi(`chaîne de valeur : « ${l.actor} » (${l.role}) absent de ${l.entityId}`));
    if (l.entityName && e && l.entityName !== e.nom_principal && !e.alias_et_designations.includes(l.entityName)) {
      erreurs.push(quoi(`chaîne de valeur : « ${l.entityName} » n'est ni le nom ni un alias de ${l.entityId}`));
    }
    if (!dansDossier(l.entityId)) erreurs.push(quoi(`chaîne de valeur : ${l.entityId} absente de registryEntityIds`));
  }

  for (const w of d.watchpoints ?? []) {
    const e = registre.entiteParId.get(w.entityId);
    const jalon = e?.jalons_a_surveiller.find(
      (j) => j.date_ou_horizon === w.horizon && j.evenement === w.event,
    );
    if (!jalon) erreurs.push(quoi(`jalon « ${w.horizon} — ${w.event.slice(0, 40)}… » absent de ${w.entityId}`));
    if (w.entityName && e && w.entityName !== e.nom_principal && !e.alias_et_designations.includes(w.entityName)) {
      erreurs.push(quoi(`jalon : « ${w.entityName} » n'est ni le nom ni un alias de ${w.entityId}`));
    }
    if (!dansDossier(w.entityId)) erreurs.push(quoi(`jalon : ${w.entityId} absente de registryEntityIds`));
  }

  const parcourir = (nodes: ProgrammeNode[], parent: string | null) => {
    for (const n of nodes) {
      const e = registre.entiteParId.get(n.entityId);
      if (!e) {
        erreurs.push(quoi(`structure : ${n.entityId} absente du registre`));
        continue;
      }
      if (e.type_noeud !== n.kind) erreurs.push(quoi(`structure : ${n.entityId} est « ${e.type_noeud} », pas « ${n.kind} »`));
      if (n.name !== e.nom_principal && !e.alias_et_designations.includes(n.name)) {
        erreurs.push(quoi(`structure : « ${n.name} » n'est ni le nom ni un alias de ${n.entityId}`));
      }
      if (parent && e.parent_id !== parent) {
        erreurs.push(quoi(`structure : ${n.entityId} a pour parent ${e.parent_id ?? "aucun"} au registre, pas ${parent}`));
      }
      if (n.children) parcourir(n.children, n.entityId);
    }
  };
  parcourir(d.programmeTree ?? [], null);

  return erreurs;
}
