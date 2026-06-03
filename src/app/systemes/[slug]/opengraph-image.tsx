import { ImageResponse } from "next/og";
import { getSystem, getSystemSlugs } from "@/data/systems";
import { renderSiteOgCard, renderSystemOgCard } from "@/components/og-card";

export const alt = "Dossier système — Panoplie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getSystemSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const system = getSystem(slug);
  return new ImageResponse(
    system ? renderSystemOgCard(system) : renderSiteOgCard(),
    size,
  );
}
