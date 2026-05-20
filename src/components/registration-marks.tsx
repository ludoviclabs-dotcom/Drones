// Marques de repérage d'imprimeur aux quatre angles — signature « dossier ».
export function RegistrationMarks({ className = "" }: { className?: string }) {
  const corner = "absolute h-2.5 w-2.5 border-line-bright";
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    >
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />
    </div>
  );
}
