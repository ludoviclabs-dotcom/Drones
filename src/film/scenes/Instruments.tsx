import type { SceneProps } from "../types";
import { C, FONT } from "../theme";
import { SceneArea, useLayout } from "../primitives";

/** Chapitre provisoire — remplacé par la scène définitive. */
export function InstrumentsScene({ data }: SceneProps) {
  const { s } = useLayout();
  return (
    <SceneArea style={{ justifyContent: "center" }}>
      <div style={{ fontFamily: FONT.serif, fontSize: s.title, color: C.ink }}>
        Instruments · {data.dossier.name}
      </div>
    </SceneArea>
  );
}
