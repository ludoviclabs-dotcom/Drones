import type { ReactNode } from "react";

// Schématiques filaires — vue de dessus, dessin au trait. Stylisées, non
// cotées : elles donnent un visage au système, pas une référence technique.
const SCHEMATICS: Record<string, ReactNode> = {
  "mq-9-reaper": (
    <>
      <line
        x1="120"
        y1="22"
        x2="120"
        y2="226"
        strokeWidth="1"
        strokeDasharray="2 5"
      />
      <rect x="110" y="34" width="20" height="174" rx="10" />
      <circle cx="120" cy="45" r="11" />
      <path d="M24 99 L110 93 L110 109 L26 111 Z" />
      <path d="M216 99 L130 93 L130 109 L214 111 Z" />
      <line x1="24" y1="90" x2="24" y2="118" strokeWidth="1" />
      <line x1="216" y1="90" x2="216" y2="118" strokeWidth="1" />
      <path d="M112 190 L80 216" />
      <path d="M128 190 L160 216" />
      <ellipse cx="120" cy="210" rx="24" ry="4" />
    </>
  ),
  "bayraktar-tb2": (
    <>
      <line
        x1="120"
        y1="26"
        x2="120"
        y2="214"
        strokeWidth="1"
        strokeDasharray="2 5"
      />
      <rect x="111" y="40" width="18" height="150" rx="9" />
      <circle cx="120" cy="50" r="9" />
      <path d="M46 101 L111 95 L111 111 L48 113 Z" />
      <path d="M194 101 L129 95 L129 111 L192 113 Z" />
      <path d="M92 112 L116 198" />
      <path d="M148 112 L124 198" />
      <ellipse cx="120" cy="194" rx="17" ry="3.5" />
    </>
  ),
  "shahed-136": (
    <>
      <line
        x1="120"
        y1="20"
        x2="120"
        y2="214"
        strokeWidth="1"
        strokeDasharray="2 5"
      />
      <path d="M120 28 L208 198 L32 198 Z" />
      <path d="M113 50 L113 198 L127 198 L127 50 Z" />
      <path d="M32 198 L46 174" />
      <path d="M208 198 L194 174" />
      <ellipse cx="120" cy="203" rx="13" ry="3.5" />
    </>
  ),
  neuron: (
    <>
      <line x1="120" y1="24" x2="120" y2="190" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 34 L214 158 L150 158 L120 180 L90 158 L26 158 Z" />
      <line x1="120" y1="38" x2="120" y2="156" strokeWidth="1" />
      <circle cx="120" cy="66" r="7" />
    </>
  ),
  "rq-4-global-hawk": (
    <>
      <line x1="120" y1="14" x2="120" y2="226" strokeWidth="1" strokeDasharray="2 5" />
      <circle cx="120" cy="40" r="16" />
      <path d="M111 52 L111 190 C111 202 115 206 120 206 C125 206 129 202 129 190 L129 52 Z" />
      <path d="M16 110 L111 101 L111 117 L18 119 Z" />
      <path d="M224 110 L129 101 L129 117 L222 119 Z" />
      <path d="M111 188 L80 216" />
      <path d="M129 188 L160 216" />
      <line x1="16" y1="103" x2="16" y2="126" strokeWidth="1" />
      <line x1="224" y1="103" x2="224" y2="126" strokeWidth="1" />
    </>
  ),
  "mq-25-stingray": (
    <>
      <line x1="120" y1="20" x2="120" y2="210" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 28 L138 72 L206 150 L150 158 L132 196 L108 196 L90 158 L34 150 L102 72 Z" />
      <circle cx="120" cy="80" r="6" />
      <line x1="106" y1="124" x2="134" y2="124" strokeWidth="1" />
    </>
  ),
  "wing-loong-2": (
    <>
      <line x1="120" y1="22" x2="120" y2="226" strokeWidth="1" strokeDasharray="2 5" />
      <rect x="111" y="36" width="18" height="170" rx="9" />
      <circle cx="120" cy="47" r="9" />
      <path d="M26 108 L111 100 L111 116 L28 118 Z" />
      <path d="M214 108 L129 100 L129 116 L212 118 Z" />
      <path d="M111 192 L84 214" />
      <path d="M129 192 L156 214" />
      <ellipse cx="120" cy="210" rx="20" ry="4" />
    </>
  ),
  "magura-v5": (
    <>
      <line x1="120" y1="22" x2="120" y2="212" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 26 C132 34 138 64 138 96 L138 198 L102 198 L102 96 C102 64 108 34 120 26 Z" />
      <rect x="108" y="120" width="24" height="42" />
      <circle cx="120" cy="92" r="5" />
      <line x1="102" y1="198" x2="138" y2="198" strokeWidth="1" />
    </>
  ),
  harop: (
    <>
      <line x1="120" y1="18" x2="120" y2="216" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 24 C126 30 129 46 129 70 L129 188 C129 200 125 208 120 208 C115 208 111 200 111 188 L111 70 C111 46 114 30 120 24 Z" />
      <path d="M44 150 L111 122 L111 138 L46 156 Z" />
      <path d="M196 150 L129 122 L129 138 L194 156 Z" />
      <path d="M88 72 L111 80 L111 90 L90 86 Z" />
      <path d="M152 72 L129 80 L129 90 L150 86 Z" />
      <path d="M111 188 L98 208" />
      <path d="M129 188 L142 208" />
    </>
  ),
};

export function SystemSchematic({
  slug,
  className = "",
  live = false,
}: {
  slug: string;
  className?: string;
  live?: boolean;
}) {
  const content = SCHEMATICS[slug];
  if (!content) return null;
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={live ? `${className} schematic-live` : className}
      aria-hidden="true"
      data-draw={live ? "" : undefined}
    >
      {content}
    </svg>
  );
}
