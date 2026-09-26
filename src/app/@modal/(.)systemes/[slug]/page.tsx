import { notFound } from "next/navigation";
import { getSystem, getSystemSlugs } from "@/data/systems";
import { SystemDossier } from "@/components/system-dossier";
import {
  DeclassificationModal,
  DossierTopBar,
} from "@/components/declassification-modal";

// Route interceptée : depuis le site, un lien vers `/systemes/[slug]` ouvre la
// fiche en surimpression, avec la transition « Déclassification ». Un accès
// direct (rechargement, lien partagé, robot) sert la page complète.
export function generateStaticParams() {
  return getSystemSlugs().map((slug) => ({ slug }));
}

export default async function SystemDossierModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const system = getSystem(slug);
  if (!system) notFound();
  return (
    <DeclassificationModal
      slug={slug}
      title={`${system.name} — Panoplie`}
    >
      <SystemDossier system={system} variant="modal" topBar={<DossierTopBar />} />
    </DeclassificationModal>
  );
}
