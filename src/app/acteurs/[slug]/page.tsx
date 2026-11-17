import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActor, getActorSlugs } from "@/data/actors";
import { ActorDossierView } from "@/components/actor-dossier";

export function generateStaticParams() {
  return getActorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const actor = getActor(slug);
  if (!actor) return { title: "Acteur introuvable" };
  const canonical = `/acteurs/${slug}`;
  return {
    title: actor.name,
    description: actor.tagline,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: actor.name,
      description: actor.tagline,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: actor.name,
      description: actor.tagline,
    },
  };
}

export default async function ActorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const actor = getActor(slug);
  if (!actor) notFound();
  return <ActorDossierView actor={actor} />;
}
