import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSystem, getSystemSlugs } from "@/data/systems";
import { SystemDossier } from "@/components/system-dossier";

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
  if (!system) return { title: "Système introuvable" };
  const canonical = `/systemes/${slug}`;
  return {
    title: system.name,
    description: system.tagline,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: system.name,
      description: system.tagline,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: system.name,
      description: system.tagline,
    },
  };
}

export default async function SystemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const system = getSystem(slug);
  if (!system) notFound();
  return <SystemDossier system={system} />;
}
