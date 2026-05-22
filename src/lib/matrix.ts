import type {
  AcquisitionMode,
  Grade,
  ScoreKey,
  SystemCategory,
} from "@/data/types";
import { systems } from "@/data/systems";

// Matrice stratégique — projection des systèmes sur deux axes. Tout est
// DÉRIVÉ des paliers d'évaluation déjà publiés : aucune donnée nouvelle.

const GRADE_VALUE: Record<Grade, number> = { A: 4, B: 3, C: 2, D: 1, E: 0 };

// Dépendance du canal d'acquisition : 0 = pleine autonomie, 4 = dépendance forte.
const MODE_DEPENDENCE: Record<AcquisitionMode, number> = {
  "production-nationale": 0,
  cooperatif: 1.5,
  DCS: 3,
  FMS: 4,
};

export interface MatrixPoint {
  slug: string;
  name: string;
  flag: string;
  classLabel: string;
  category: SystemCategory;
  /** 0 = autonomie industrielle · 100 = dépendance géopolitique. */
  x: number;
  /** 0 = effet/coût faible · 100 = effet/coût élevé. */
  y: number;
}

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

export function getMatrixPoints(): MatrixPoint[] {
  return systems.map((system) => {
    const grade = (key: ScoreKey): number => {
      const score = system.scores.find((s) => s.key === key);
      return score ? GRADE_VALUE[score.grade] : 2;
    };

    // Canal d'acquisition le plus autonome — la base industrielle du système.
    const channel = Math.min(
      ...system.acquisitionModes.map((mode) => MODE_DEPENDENCE[mode]),
    );
    // Autonomie : risque industriel (3/4) + canal d'acquisition (1/4). 4 = très autonome.
    const autonomy = (grade("risque-industriel") * 3 + (4 - channel)) / 4;
    const x = clamp((1 - autonomy / 4) * 100, 6, 94);

    // Effet/coût : efficacité-coût (3/4) + survivabilité (1/4).
    const effect = (grade("efficacite-cout") * 3 + grade("survivabilite")) / 4;
    const y = clamp((effect / 4) * 100, 6, 94);

    return {
      slug: system.slug,
      name: system.name,
      flag: system.flag,
      classLabel: system.classLabel,
      category: system.category,
      x,
      y,
    };
  });
}
