import { buildSearchIndex } from "@/lib/search-index";

// Index de la palette ⌘K : figé au build, servi comme un fichier statique.
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchIndex());
}
