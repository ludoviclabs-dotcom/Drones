import type { ReactNode } from "react";
import type { SystemCategory } from "@/data/types";

// Emblèmes filaires de domaine — au trait, comme les schématiques système.
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
  // Radar — panneau AESA incliné sur mât, faisceau d'arcs concentriques
  // partant du panneau, base avec véhicule porteur stylisé. Axe vertical
  // pointillé comme les autres emblèmes.
  radar: (
    <>
      <line
        x1="50"
        y1="6"
        x2="50"
        y2="92"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <path d="M30 22 L70 18 L66 50 L34 54 Z" />
      <line x1="36" y1="28" x2="64" y2="24" strokeWidth="1" />
      <line x1="36" y1="36" x2="64" y2="32" strokeWidth="1" />
      <line x1="36" y1="44" x2="64" y2="40" strokeWidth="1" />
      <path d="M50 54 L50 70" strokeWidth="1.6" />
      <path d="M76 18 A38 38 0 0 1 80 38" strokeDasharray="3 4" />
      <path d="M82 14 A48 48 0 0 1 88 42" strokeDasharray="3 4" />
      <path d="M88 10 A58 58 0 0 1 96 46" strokeDasharray="3 4" />
      <rect x="32" y="70" width="36" height="14" rx="2" />
      <circle cx="40" cy="86" r="3" />
      <circle cx="60" cy="86" r="3" />
      <line x1="20" y1="92" x2="80" y2="92" strokeWidth="1" />
    </>
  ),
  "naval-vessel": (
    <>
      <line
        x1="50"
        y1="10"
        x2="50"
        y2="92"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <path d="M50 12 C61 20 67 40 67 66 C67 82 60 91 50 94 C40 91 33 82 33 66 C33 40 39 20 50 12 Z" />
      <path d="M39 64 L61 64 L57 82 L43 82 Z" />
      <rect x="41" y="38" width="18" height="16" />
      <path d="M45 30 L55 30 L58 38 L42 38 Z" />
      <line x1="36" y1="70" x2="64" y2="70" strokeWidth="1" />
      <path d="M42 52 L31 58 M58 52 L69 58" strokeWidth="1" />
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
