export function Narrative({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const paragraphs = text.split("\n\n");
  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((paragraph, i) => (
        <p
          key={i}
          className="font-serif text-[1.05rem] leading-[1.75] text-ink/90"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
