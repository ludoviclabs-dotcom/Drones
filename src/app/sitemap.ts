import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SYSTEMS_BY_SLUG, getSystemSlugs } from "@/data/systems";
import { getEvidenceStats } from "@/lib/claims";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

// Routes statiques de premier niveau (les fiches système sont ajoutées plus bas).
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: ChangeFrequency }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/eurosatory", priority: 0.9, changeFrequency: "weekly" },
  { path: "/domaines", priority: 0.8, changeFrequency: "monthly" },
  { path: "/comparateur", priority: 0.8, changeFrequency: "monthly" },
  { path: "/matrice", priority: 0.7, changeFrequency: "monthly" },
  { path: "/simulateur", priority: 0.7, changeFrequency: "monthly" },
  { path: "/console", priority: 0.8, changeFrequency: "weekly" },
  { path: "/hud/drone-airframe", priority: 0.6, changeFrequency: "monthly" },
  { path: "/audit", priority: 0.7, changeFrequency: "weekly" },
  { path: "/couts", priority: 0.7, changeFrequency: "weekly" },
  { path: "/industrial-graph", priority: 0.6, changeFrequency: "monthly" },
  { path: "/updates", priority: 0.6, changeFrequency: "weekly" },
  { path: "/export-briefs", priority: 0.6, changeFrequency: "monthly" },
  { path: "/portefeuille", priority: 0.6, changeFrequency: "monthly" },
  { path: "/aviation-combat", priority: 0.8, changeFrequency: "monthly" },
  { path: "/batiments-navals", priority: 0.8, changeFrequency: "monthly" },
  { path: "/defense-aerienne", priority: 0.8, changeFrequency: "monthly" },
  { path: "/systemes-combat", priority: 0.8, changeFrequency: "monthly" },
  { path: "/spatial-militaire", priority: 0.8, changeFrequency: "monthly" },
  { path: "/artillerie-feux-terrestres", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blindes-chars-combat", priority: 0.8, changeFrequency: "monthly" },
  { path: "/energie-dirigee", priority: 0.8, changeFrequency: "monthly" },
  { path: "/missiles", priority: 0.8, changeFrequency: "monthly" },
  { path: "/radars", priority: 0.8, changeFrequency: "monthly" },
  { path: "/radars/architecture", priority: 0.6, changeFrequency: "monthly" },
  { path: "/methodologie", priority: 0.6, changeFrequency: "yearly" },
  { path: "/glossaire", priority: 0.5, changeFrequency: "monthly" },
  { path: "/roadmap", priority: 0.4, changeFrequency: "monthly" },
  { path: "/changelog", priority: 0.4, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUpdated = getEvidenceStats().updated || undefined;

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: siteUpdated,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const systemEntries: MetadataRoute.Sitemap = getSystemSlugs().flatMap(
    (slug) => {
      const updated = SYSTEMS_BY_SLUG[slug]?.updated || siteUpdated;
      return [
        {
          url: `${SITE_URL}/systemes/${slug}`,
          lastModified: updated,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        },
        {
          url: `${SITE_URL}/systemes/${slug}/xray`,
          lastModified: updated,
          changeFrequency: "monthly" as const,
          priority: 0.5,
        },
      ];
    },
  );

  return [...staticEntries, ...systemEntries];
}
