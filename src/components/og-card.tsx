import type { DefenseSystem, Grade, ScoreKey } from "@/data/types";

// Cartes Open Graph (1200×630) rendues par next/og + Satori.
// Contraintes Satori : flexbox uniquement (pas de grid), tokens en dur (les CSS
// vars ne sont pas lues), aucune police custom (police par défaut de next/og) ni
// emoji (évite toute dépendance réseau/binaire au build).

export const OG_SIZE = { width: 1200, height: 630 } as const;

const C = {
  bg: "#16150f",
  line: "#33301f",
  ink: "#ece6d5",
  inkDim: "#9c9783",
  inkFaint: "#8a8472",
  accent: "#d2683c",
} as const;

const GRADE_COLOR: Record<Grade, string> = {
  A: "#61805a",
  B: "#888a48",
  C: "#b3823a",
  D: "#b9602e",
  E: "#a83a2c",
};

const SCORE_ORDER: ScoreKey[] = [
  "efficacite-cout",
  "survivabilite",
  "exportabilite",
  "risque-industriel",
  "maturite",
  "confiance-donnees",
];

const SCORE_SHORT: Record<ScoreKey, string> = {
  "efficacite-cout": "Coût",
  survivabilite: "Surv.",
  exportabilite: "Export",
  "risque-industriel": "Indus.",
  maturite: "Matur.",
  "confiance-donnees": "Donn.",
};

export function renderSiteOgCard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: C.bg,
        color: C.ink,
        padding: 72,
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          color: C.accent,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        OSINT · Sources ouvertes
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 124, lineHeight: 1 }}>
          Panoplie
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: C.inkDim,
            marginTop: 24,
            maxWidth: 940,
          }}
        >
          Intelligence open source sur les systèmes de défense — coût, finance,
          supply chain, géopolitique, export.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          fontSize: 22,
          color: C.inkFaint,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        <div style={{ display: "flex" }}>Naval</div>
        <div style={{ display: "flex" }}>· Air</div>
        <div style={{ display: "flex" }}>· Missiles</div>
        <div style={{ display: "flex" }}>· Radars</div>
        <div style={{ display: "flex" }}>· Énergie dirigée</div>
        <div style={{ display: "flex" }}>· Drones</div>
      </div>
    </div>
  );
}

export function renderSystemOgCard(system: DefenseSystem) {
  const gradeByKey = new Map<ScoreKey, Grade>(
    system.scores.map((s) => [s.key, s.grade]),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: C.bg,
        color: C.ink,
        padding: 64,
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", color: C.accent }}>
          {system.reference}
        </div>
        <div style={{ display: "flex", color: C.inkFaint }}>
          OSINT · Panoplie
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 30, color: C.inkDim }}>
          {system.country}
        </div>
        <div style={{ display: "flex", fontSize: 88, lineHeight: 1, marginTop: 10 }}>
          {system.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: C.inkDim,
            marginTop: 18,
          }}
        >
          {system.classLabel}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {SCORE_ORDER.map((key) => {
          const grade = gradeByKey.get(key);
          return (
            <div
              key={key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexGrow: 1,
                flexBasis: 0,
                border: `1px solid ${C.line}`,
                paddingTop: 14,
                paddingBottom: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 44,
                  color: grade ? GRADE_COLOR[grade] : C.line,
                }}
              >
                {grade ?? "—"}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 16,
                  color: C.inkFaint,
                  marginTop: 8,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {SCORE_SHORT[key]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
