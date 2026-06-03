import type { Claim } from "@/lib/claims";

/** Téléchargement client d'un fichier généré (Blob → <a> → revoke). */
export function downloadFile(filename: string, mimeType: string, content: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Échappe une cellule CSV (guillemets doublés, entourée si elle contient , " ; ou retour ligne). */
function csvCell(value: string): string {
  const needsQuote = /[",;\n\r]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuote ? `"${escaped}"` : escaped;
}

const CSV_HEADERS = [
  "reference",
  "systeme",
  "brique",
  "affirmation",
  "valeur",
  "confiance",
  "statut",
  "sources",
  "fiabilites",
  "date",
] as const;

/** Sérialise les affirmations filtrées en CSV (BOM UTF-8 pour Excel, CRLF). */
export function claimsToCsv(claims: Claim[]): string {
  const rows = claims.map((claim) =>
    [
      claim.systemReference,
      claim.systemName,
      claim.scope,
      claim.label,
      claim.value,
      claim.confidence,
      claim.status,
      claim.sources.map((s) => s.publisher).join(" | "),
      claim.sources.map((s) => s.reliability).join(" | "),
      claim.date,
    ]
      .map((value) => csvCell(String(value)))
      .join(","),
  );
  return "﻿" + [CSV_HEADERS.join(","), ...rows].join("\r\n");
}

/** Sérialise les affirmations filtrées en JSON structuré. */
export function claimsToJson(claims: Claim[]): string {
  return JSON.stringify(
    claims.map((claim) => ({
      reference: claim.systemReference,
      systeme: claim.systemName,
      slug: claim.systemSlug,
      brique: claim.scope,
      affirmation: claim.label,
      valeur: claim.value,
      note: claim.note,
      confiance: claim.confidence,
      statut: claim.status,
      sources: claim.sources.map((s) => ({
        publisher: s.publisher,
        type: s.type,
        reliability: s.reliability,
        url: s.url,
      })),
      date: claim.date,
    })),
    null,
    2,
  );
}
