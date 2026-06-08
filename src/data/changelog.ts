import type { ChangelogEntry } from "./types";

// Du plus récent au plus ancien.
export const changelog: ChangelogEntry[] = [
  {
    date: "2026-06-08",
    title: "System X-Ray — lot 1 : cinq phares éditoriaux",
    items: [
      "Quatre dossiers passent en lecture éditoriale — MQ-9 Reaper, Shahed-136, AN/SPY-6 et FREMM France — et rejoignent Bayraktar TB2, Rafale, F-35 et F-15EX déjà édités.",
      "Distinction explicite « Lecture éditoriale » vs « Lecture auto (briques) » dans le header de chaque X-Ray : l'utilisateur voit immédiatement si la lecture est curée ou agrégée automatiquement.",
      "Aperçu « points de preuve » sur la fiche système — pour les dossiers édités, les cinq premiers hotspots apparaissent en bandeau au-dessus du résumé exécutif, avec lien direct vers l'X-Ray.",
      "Badge « X-Ray » sur les cartes du catalogue pour les huit systèmes édités.",
      "Garde-fou : smoke test des 110 scénarios — invariants couches/hotspots et synchronisation du registre éditorial avec le dispatch des builders.",
    ],
  },
  {
    date: "2026-05-22",
    title: "Ouverture du domaine aviation de combat",
    items: [
      "Quinze dossiers chasseurs — Rafale, Mirage 2000, F-22, F-35, F-15EX, Super Hornet, Growler, Gripen, Eurofighter, J-20, J-35, KAAN, F-47, SCAF, GCAP.",
      "Nouveau domaine « Aviation de combat » : page d'introduction, frise des générations, bloc « versions & standards » et lecture revendiquée vs évaluée sur chaque fiche.",
      "Navigation regroupée : les trois domaines réunis sous une entrée « Domaines » et une page d'index dédiée.",
      "Comparateur étendu : groupe de confrontation propre aux avions — générations et navalisation.",
      "Glossaire étendu : AESA, IRST, VLO, RCS, supercroisière, fusion de capteurs, datalink, CATOBAR, STOVL, MCO, CCA, nuage de combat.",
    ],
  },
  {
    date: "2026-05-22",
    title: "Ouverture du domaine énergie dirigée",
    items: [
      "Huit dossiers laser — HELMA-P, Iron Beam, DragonFire, DE M-SHORAD, IFPC-HEL, Skyranger 30 HEL, laser naval MBDA-Rheinmetall, HELIOS.",
      "Nouveau domaine « Énergie dirigée » : page d'introduction, bloc contraintes physiques et encadré juridique sur chaque fiche laser.",
      "Filtre de domaine sur le catalogue, la Console OSINT, le Comparateur et la Matrice.",
      "Glossaire étendu : DEW, HEL, HPM, C-UAS, C-RAM, SHORAD, dwell time, beam director, thermal blooming, SWaP-C, Protocole IV.",
    ],
  },
  {
    date: "2026-05-21",
    title: "Quinze systèmes, quatre outils, un dossier vivant",
    items: [
      "Six nouveaux dossiers — Aarok, Eurodrone, Switchblade 600, Heron TP, Hermes 900, Liutyi : le catalogue passe à quinze systèmes.",
      "Matrice stratégique : positionnement des systèmes sur deux axes dérivés des paliers.",
      "Simulateur d'arbitrage : pondérer ses priorités et lire les points de vigilance — jamais un avis d'achat.",
      "Glossaire contextuel : définitions au survol des termes, dans le fil de lecture des fiches.",
      "Trajectoire : une frise datée — jalons, emplois, exportations, débats — sur chaque dossier.",
      "Couche de mouvement : grain de film, balayage de révélation, radar du catalogue, schématiques inclinables.",
    ],
  },
  {
    date: "2026-05-21",
    title: "Le catalogue passe à neuf systèmes",
    items: [
      "Six nouveaux dossiers : nEUROn, RQ-4 Global Hawk, MQ-25 Stingray, Wing Loong II, Magura V5, Harop.",
      "Modèle d'analyse étendu : classes UCAV, HALE, ravitailleur et drone de surface (USV).",
      "Comparateur repensé en mode sélection — confronter deux à trois systèmes.",
    ],
  },
  {
    date: "2026-05-20",
    title: "Console OSINT",
    items: [
      "Registre de preuves filtrable : chaque affirmation est tracée, sourcée et statuée.",
      "Bande de statistiques dérivées sur l'accueil.",
      "Ouverture des pages Changelog et Roadmap.",
    ],
  },
  {
    date: "2026-05-20",
    title: "Durcissement du sourcing",
    items: [
      "Coûts du Shahed-136 corrigés : fabrication, production Alabuga, prix de cession Iran-Russie.",
      "URLs de sources réelles ajoutées (fact sheet USAF, Defense News, CSIS).",
      "Contrastes relevés au seuil WCAG AA.",
    ],
  },
  {
    date: "2026-05-20",
    title: "Refonte « dossier déclassifié »",
    items: [
      "Nouveau système visuel : palette graphite, schématiques filaires, marques de repérage.",
      "Profil de paliers (data-visualisation) sur les fiches et le comparateur.",
    ],
  },
  {
    date: "2026-05-20",
    title: "Ouverture de Panoplie",
    items: [
      "Trois premiers dossiers : MQ-9 Reaper, Bayraktar TB2, Shahed-136.",
      "Comparateur, méthodologie et glossaire.",
    ],
  },
];
