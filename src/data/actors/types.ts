import type {
  Brick,
  Indicator,
  IndustrialLink,
  ProgrammeNode,
  SourceRef,
  SovereigntyProfile,
  TimelineEvent,
  Watchpoint,
} from "../types";

// Dossier d'acteur — groupe industriel ou entreprise de défense tech. Un acteur
// n'est pas un système d'armes : il n'a ni paliers A–E, ni X-Ray, ni place dans
// le comparateur. Il se lit par son capital, ses chiffres, sa chaîne de valeur,
// son contrôle (souveraineté) et ce qu'il reste à suivre. Les chiffres, les
// statuts et les sources suivent les mêmes règles que les fiches de systèmes :
// chacun porte son metric_id du registre « Souveraineté industrielle ».

export type ActorKind = "groupe-industriel" | "defense-tech";

export interface ActorDossier {
  slug: string;
  name: string;
  /** Référence de dossier, « PNP-ACT-001 ». */
  reference: string;
  kind: ActorKind;
  country: string;
  flag: string;
  tagline: string;
  summary: string;
  /** Chiffres clés — résultats, carnet, effectifs, capital. */
  keyFigures: Indicator[];
  /** Lectures par angle (finance, supply-chain, géopolitique…). */
  bricks: Brick[];
  /** Fiches de systèmes du catalogue liées à l'acteur. */
  relatedSystems?: string[];
  /** Entités du registre couvertes ; la première est l'entité principale. */
  registryEntityIds: string[];
  sovereignty?: SovereigntyProfile[];
  /** Actionnaires, clients, partenaires — avec le rôle de chacun. */
  industrialChain?: IndustrialLink[];
  watchpoints?: Watchpoint[];
  programmeTree?: ProgrammeNode[];
  timeline?: TimelineEvent[];
  /** Mise en garde de lecture, en une ou deux phrases. */
  analystNote?: string;
  sources: SourceRef[];
  updated: string;
}
