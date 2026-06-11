export type PanoplieSafetyCategory =
  | "autorisee_osint_strategique"
  | "ambigue_a_recadrer"
  | "interdite_operationnelle"
  | "interdite_arme"
  | "interdite_contournement_export";

export interface PanoplieSafetyResult {
  category: PanoplieSafetyCategory;
  allowed: boolean;
  nonOperational: true;
  reason: string;
  safeAlternatives: string[];
}

const SAFE_ALTERNATIVES = [
  "coûts publics et périmètres de comparaison",
  "qualité et fraîcheur des sources OSINT",
  "supply chain publique et dépendances industrielles",
  "cadre export public non juridique",
  "géopolitique et souveraineté non opérationnelles",
];

const OPERATIONAL_PATTERNS = [
  /\bciblage\b/,
  /\btargeting\b/,
  /\bcoordonn[ée]es?\b/,
  /\bfrappe\b/,
  /\bmission\s+planning\b/,
  /\bbattlefield\b/,
  /\bordre\s+de\s+bataille\b/,
  /\btrajectoire\s+d'?attaque\b/,
  /\bplan\s+d'?attaque\b/,
  /\bemploi\s+tactique\b/,
  /\bcomment\s+utiliser\b.*\b(arme|missile|drone|munition)\b/,
];

const WEAPONIZATION_PATTERNS = [
  /\bfabriquer\b.*\b(arme|missile|drone|munition|explosif)\b/,
  /\bconstruire\b.*\b(arme|missile|munition|charge)\b/,
  /\boptimiser\b.*\b(arme|charge|guidage|l[ée]tal|destruction)\b/,
  /\bguidage\b.*\bterminal\b/,
  /\bwarhead\b/,
  /\bcharge\s+militaire\b/,
  /\brecette\b.*\bexplosif\b/,
  /\bimprovised\b.*\bweapon\b/,
];

const EXPORT_EVASION_PATTERNS = [
  /\bcontourner\b.*\b(export|itar|sanction|embargo|contr[ôo]le)\b/,
  /\b[ée]viter\b.*\b(export|itar|sanction|embargo|contr[ôo]le)\b/,
  /\bbypass\b.*\b(itar|export|sanction)\b/,
  /\br[ée]exporter\b.*\bsans\b.*\bautorisation\b/,
];

const AMBIGUOUS_PATTERNS = [
  /\befficacit[ée]\s+(militaire|l[ée]tale|au\s+combat)\b/,
  /\bmeilleur\b.*\b(tuer|d[ée]truire|neutraliser)\b/,
  /\bperformance\s+au\s+combat\b/,
  /\bkill\s+chain\b/,
  /\bl[ée]talit[ée]\b/,
];

const STRATEGIC_PATTERNS = [
  /\bco[uû]ts?\b/,
  /\btco\b/,
  /\bfinance\b/,
  /\bbudget\b/,
  /\bsupply\s+chain\b/,
  /\bindustriel\b/,
  /\bsources?\b/,
  /\bpreuves?\b/,
  /\bexport\b/,
  /\bg[ée]opolitique\b/,
  /\bsouverainet[ée]\b/,
  /\bcontradictions?\b/,
  /\bm[ée]thodologie\b/,
  /\bosint\b/,
];

function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function matches(patterns: RegExp[], input: string): boolean {
  return patterns.some((pattern) => pattern.test(input));
}

export function classifyPanoplieRequest(input: string): PanoplieSafetyCategory {
  const normalized = normalize(input);

  if (!normalized.trim()) return "ambigue_a_recadrer";
  if (matches(EXPORT_EVASION_PATTERNS, normalized)) {
    return "interdite_contournement_export";
  }
  if (matches(WEAPONIZATION_PATTERNS, normalized)) {
    return "interdite_arme";
  }
  if (matches(OPERATIONAL_PATTERNS, normalized)) {
    return "interdite_operationnelle";
  }
  if (matches(AMBIGUOUS_PATTERNS, normalized)) {
    return "ambigue_a_recadrer";
  }
  if (matches(STRATEGIC_PATTERNS, normalized)) {
    return "autorisee_osint_strategique";
  }
  return "ambigue_a_recadrer";
}

export function panoplieSafetyGuard(input: string): PanoplieSafetyResult {
  const category = classifyPanoplieRequest(input);
  const allowed = category === "autorisee_osint_strategique";

  if (allowed) {
    return {
      category,
      allowed,
      nonOperational: true,
      reason:
        "Demande compatible avec le périmètre Panoplie : analyse OSINT stratégique, publique et non opérationnelle.",
      safeAlternatives: SAFE_ALTERNATIVES,
    };
  }

  if (category === "ambigue_a_recadrer") {
    return {
      category,
      allowed: false,
      nonOperational: true,
      reason:
        "Demande à recadrer vers une analyse stratégique sourcée, sans emploi tactique ni efficacité létale.",
      safeAlternatives: SAFE_ALTERNATIVES,
    };
  }

  return {
    category,
    allowed: false,
    nonOperational: true,
    reason:
      "Panoplie bloque les demandes opérationnelles, de weaponization ou de contournement export.",
    safeAlternatives: SAFE_ALTERNATIVES,
  };
}
