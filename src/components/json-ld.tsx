/**
 * Injecte un bloc JSON-LD (schema.org) — composant serveur.
 * Pas d'API Next dédiée : `<script>` natif, avec scrub XSS du caractère « < »
 * remplacé par son équivalent unicode (cf. docs Next « json-ld »).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
