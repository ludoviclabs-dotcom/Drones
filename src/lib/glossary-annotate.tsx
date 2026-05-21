import { Fragment, type ReactNode } from "react";
import { glossary } from "@/data/glossary";
import { GlossaryRef } from "@/components/glossary-ref";

// Acronymes du glossaire — ancres fiables pour l'infobulle contextuelle :
// graphie verbatim, casse distinctive, pas de flexion. Les termes sans
// acronyme restent consultables sur la page Glossaire.
const TRIGGERS = glossary
  .filter((term) => Boolean(term.acronym))
  .map((term) => ({ acronym: term.acronym as string, term }))
  .sort((a, b) => b.acronym.length - a.acronym.length);

const BY_ACRONYM = new Map(TRIGGERS.map((t) => [t.acronym, t.term]));

const PATTERN = new RegExp(
  `\\b(${TRIGGERS.map((t) => t.acronym).join("|")})\\b`,
  "g",
);

/**
 * Repère les acronymes du glossaire dans un texte et enveloppe la première
 * occurrence de chacun d'une infobulle. `used` est partagé entre les
 * paragraphes d'un même bloc : un terme n'est décoré qu'une fois.
 */
export function annotateGlossary(
  text: string,
  used: Set<string> = new Set(),
): ReactNode {
  PATTERN.lastIndex = 0;
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = PATTERN.exec(text)) !== null) {
    const acronym = match[1];
    const term = BY_ACRONYM.get(acronym);
    if (!term || used.has(acronym)) continue;
    used.add(acronym);
    if (match.index > last) {
      nodes.push(
        <Fragment key={`t${key++}`}>{text.slice(last, match.index)}</Fragment>,
      );
    }
    nodes.push(
      <GlossaryRef key={`g${key++}`} term={term}>
        {acronym}
      </GlossaryRef>,
    );
    last = match.index + acronym.length;
  }

  if (nodes.length === 0) return text;
  if (last < text.length) {
    nodes.push(<Fragment key={`t${key++}`}>{text.slice(last)}</Fragment>);
  }
  return nodes;
}
