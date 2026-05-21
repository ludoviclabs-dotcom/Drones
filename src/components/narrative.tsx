import { annotateGlossary } from "@/lib/glossary-annotate";

export function Narrative({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const paragraphs = text.split("\n\n");
  // Partagé entre paragraphes : chaque terme n'est décoré qu'à sa première
  // occurrence dans le bloc.
  const used = new Set<string>();
  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((paragraph, i) => (
        <p
          key={i}
          className="font-serif text-[1.05rem] leading-[1.75] text-ink/90"
        >
          {annotateGlossary(paragraph, used)}
        </p>
      ))}
    </div>
  );
}
