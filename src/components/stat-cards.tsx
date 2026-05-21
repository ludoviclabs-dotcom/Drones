export interface Stat {
  label: string;
  value: string | number;
  hint?: string;
}

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-panel p-5">
          <div
            className="font-mono text-3xl leading-none text-ink"
            data-countup={
              typeof stat.value === "number" ? stat.value : undefined
            }
          >
            {stat.value}
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            {stat.label}
          </div>
          {stat.hint ? (
            <div className="mt-1.5 font-serif text-xs italic leading-snug text-ink-dim">
              {stat.hint}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
