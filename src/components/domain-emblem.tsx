import type { ReactNode } from "react";
import type { SystemCategory } from "@/data/types";

// Emblèmes filaires de domaine — au trait, comme les schématiques système :
// un drone vu de dessus, un effecteur à énergie dirigée et son faisceau.
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
