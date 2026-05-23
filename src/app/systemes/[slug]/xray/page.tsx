import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SystemXrayView } from "@/components/decision-twin/SystemXrayView";
import { buildPanoplieXrayScenario } from "@/data/decision-twin/panoplie-xray";
import { getSystem, getSystemSlugs } from "@/data/systems";
import { ReadingProgress } from "@/components/reading-progress";

export function generateStaticParams() {
  return getSystemSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const system = getSystem(slug);
  if (!system) return { title: "System X-Ray introuvable" };

  return {
    title: `${system.name} — System X-Ray`,
    description: `Lecture X-Ray OSINT non operationnelle du dossier ${system.name}.`,
  };
}

export default async function SystemXrayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const system = getSystem(slug);
  if (!system) notFound();

  const scenario = buildPanoplieXrayScenario(system);

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-[1180px] px-5 pt-10">
        <nav className="flex flex-wrap gap-5">
          <Link
            href={`/systemes/${system.slug}`}
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
          >
            Retour au dossier systeme
          </Link>
          <Link
            href="/console"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-accent"
          >
            Console OSINT
          </Link>
        </nav>
      </div>
      <SystemXrayView system={system} scenario={scenario} />
    </>
  );
}
