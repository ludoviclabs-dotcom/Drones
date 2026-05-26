import type { ReactNode } from "react";
import type { SystemCategory } from "@/data/types";

// Emblèmes filaires de domaine — au trait, comme les schématiques système :
// un drone vu de dessus, un effecteur à énergie dirigée, un avion de combat.
const EMBLEMS: Record<SystemCategory, ReactNode> = {
  drone: (
    <>
      <line
        x1="50"
        y1="16"
        x2="50"
        y2="88"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <rect x="45" y="26" width="10" height="52" rx="5" />
      <circle cx="50" cy="33" r="3.5" />
      <path d="M10 52 L45 48 L45 57 L11 60 Z" />
      <path d="M90 52 L55 48 L55 57 L89 60 Z" />
      <path d="M44 74 L34 88" />
      <path d="M56 74 L66 88" />
    </>
  ),
  "directed-energy": (
    <>
      <line x1="16" y1="82" x2="60" y2="82" strokeWidth="1" />
      <rect x="24" y="58" width="26" height="24" />
      <rect x="32" y="48" width="12" height="10" />
      <circle cx="38" cy="42" r="9" />
      <circle cx="38" cy="42" r="3.5" />
      <line
        x1="46"
        y1="36"
        x2="84"
        y2="12"
        strokeWidth="1.4"
        strokeDasharray="3 5"
      />
      <circle cx="84" cy="12" r="2" />
      <path
        d="M84 4 L84 8 M84 16 L84 20 M76 12 L80 12 M88 12 L92 12"
        strokeWidth="1"
      />
    </>
  ),
  "combat-aircraft": (
    <>
      <line
        x1="50"
        y1="12"
        x2="50"
        y2="84"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <path d="M50 12 L55 36 L55 74 L50 84 L45 74 L45 36 Z" />
      <circle cx="50" cy="27" r="3" />
      <path d="M45 40 L14 68 L21 71 L45 57 Z" />
      <path d="M55 40 L86 68 L79 71 L55 57 Z" />
      <path d="M46 71 L31 84 L37 84 L48 76 Z" />
      <path d="M54 71 L69 84 L63 84 L52 76 Z" />
    </>
  ),
  // Missile vu de face — corps cylindrique vertical, ogive conique, ailerons
  // cruciformes en bas, sortie tuyère, rampe de tir au sol.
  missile: (
    <>
      <line
        x1="50"
        y1="6"
        x2="50"
        y2="90"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <path d="M50 8 L56 24 L56 68 L50 78 L44 68 L44 24 Z" />
      <circle cx="50" cy="20" r="2.4" />
      <line x1="44" y1="48" x2="56" y2="48" strokeWidth="1" />
      <path d="M44 60 L30 72 L44 70 Z" />
      <path d="M56 60 L70 72 L56 70 Z" />
      <path d="M47 76 L43 86 L50 82 L57 86 L53 76 Z" />
      <line x1="22" y1="90" x2="78" y2="90" strokeWidth="1" />
      <line x1="30" y1="86" x2="36" y2="90" strokeWidth="1" />
      <line x1="70" y1="86" x2="64" y2="90" strokeWidth="1" />
    </>
  ),
};

export function DomainEmblem({
  category,
  className = "",
}: {
  category: SystemCategory;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {EMBLEMS[category]}
    </svg>
  );
}
