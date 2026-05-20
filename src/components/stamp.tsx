export function Stamp({
  children,
  tone = "ink",
  rotate = -3,
  className = "",
}: {
  children: React.ReactNode;
  tone?: "ink" | "accent" | "dim";
  rotate?: number;
  className?: string;
}) {
  const color =
    tone === "accent"
      ? "var(--color-accent)"
      : tone === "dim"
        ? "var(--color-ink-faint)"
        : "var(--color-stamp)";
  return (
    <span
      className={`inline-block border-2 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${className}`}
      style={{
        color,
        borderColor: color,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </span>
  );
}
