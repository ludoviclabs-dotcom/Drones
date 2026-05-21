// Radar décoratif — anneaux, réticule, graduations et faisceau rotatif.
// Pur SVG ; le faisceau tourne via la classe .radar-beam (globals.css), donc
// inerte si l'utilisateur a demandé moins d'animations.

const RINGS = [70, 130, 190];
const TICKS = Array.from({ length: 24 }, (_, i) => i * 15);

export function RadarSweep({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {RINGS.map((r) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          stroke="var(--color-line-bright)"
          strokeWidth="1"
        />
      ))}

      <line
        x1="200"
        y1="10"
        x2="200"
        y2="390"
        stroke="var(--color-line-bright)"
        strokeWidth="1"
        strokeDasharray="2 7"
      />
      <line
        x1="10"
        y1="200"
        x2="390"
        y2="200"
        stroke="var(--color-line-bright)"
        strokeWidth="1"
        strokeDasharray="2 7"
      />

      {TICKS.map((deg) => {
        const a = ((deg - 90) * Math.PI) / 180;
        const inner = deg % 90 === 0 ? 180 : 190;
        return (
          <line
            key={deg}
            x1={200 + inner * Math.cos(a)}
            y1={200 + inner * Math.sin(a)}
            x2={200 + 199 * Math.cos(a)}
            y2={200 + 199 * Math.sin(a)}
            stroke="var(--color-ink-faint)"
            strokeWidth="1"
          />
        );
      })}

      <g className="radar-beam">
        <polygon
          points="200,200 200,12 40,104"
          fill="var(--color-accent)"
          opacity="0.16"
        />
        <line
          x1="200"
          y1="200"
          x2="200"
          y2="12"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
      </g>

      <circle cx="200" cy="200" r="3" fill="var(--color-accent)" />
    </svg>
  );
}
