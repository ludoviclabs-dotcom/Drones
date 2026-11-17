import { z } from "zod";
import {
  BrickSchema,
  IndicatorSchema,
  IndustrialLinkSchema,
  ProgrammeNodeSchema,
  SourceRefSchema,
  SovereigntyProfileSchema,
  TimelineEventSchema,
  WatchpointSchema,
} from "../schema";

// Schéma de validation runtime des dossiers d'acteurs — miroir de `types.ts`,
// exécuté par tests/data/actors.schema.test.ts.

export const ActorDossierSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug en minuscules, chiffres et tirets"),
  name: z.string().min(1),
  reference: z.string().regex(/^PNP-ACT-\d{3}$/, "référence attendue : PNP-ACT-000"),
  kind: z.enum(["groupe-industriel", "defense-tech"]),
  country: z.string().min(1),
  flag: z.string().min(1),
  tagline: z.string().min(1),
  summary: z.string().min(1),
  keyFigures: z.array(IndicatorSchema).min(1),
  bricks: z.array(BrickSchema),
  relatedSystems: z.array(z.string()).optional(),
  registryEntityIds: z.array(z.string().regex(/^ENT-[A-Z0-9-]+$/)).min(1),
  sovereignty: z.array(SovereigntyProfileSchema).optional(),
  industrialChain: z.array(IndustrialLinkSchema).optional(),
  watchpoints: z.array(WatchpointSchema).optional(),
  programmeTree: z.array(ProgrammeNodeSchema).optional(),
  timeline: z.array(TimelineEventSchema).optional(),
  analystNote: z.string().optional(),
  sources: z.array(SourceRefSchema).min(1),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "updated doit être au format YYYY-MM-DD"),
});

export type ActorDossierParsed = z.infer<typeof ActorDossierSchema>;
