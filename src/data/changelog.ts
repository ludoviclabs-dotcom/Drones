import type { ChangelogEntry } from "./types";

// Du plus récent au plus ancien.
export const changelog: ChangelogEntry[] = [
  {
    date: "2026-06-09",
    title: "Ouverture du domaine spatial militaire",
    items: [
      "Trois fiches pilotes françaises — CSO/MUSIS (observation), CERES (SIGINT/ROEM), Syracuse IV (SATCOM) — couvrant les trois grandes familles spatiales militaires.",
      "Nouveau profil structuré spaceProfile (orbite, charge utile, segment sol, lanceur, résilience), calqué sur navalProfile.",
      "Page /spatial : taxonomie par mission, inventaire d'orbites publiées, chaîne spatiale critique (bus, charge utile, lanceur, segment sol, chiffrement, MCO orbital).",
      "Section méthodologie §11 dédiée et règle éditoriale explicite : pas d'éphémérides ou TLE temps réel, pas de fenêtres de passage exploitables, pas de coordonnées de stations sensibles, pas de paramètres de liaison détaillés.",
      "Glossaire élargi : LEO/MEO/GEO/SSO/HEO, IMINT/GEOINT/SIGINT/ROEM/COMINT/ELINT, SAR/MILSATCOM/PNT/OPIR, SDA/SSA, RPO, segment sol, revisite.",
    ],
  },
  {
    date: "2026-06-08",
    title: "System X-Ray — lot 3 : cinq dossiers à fort levier comparatif",
    items: [
      "Cinq dossiers passent en lecture éditoriale — J-20, Sea Fire, DragonFire, Meteor et MICA NG — portant la couverture éditoriale à dix-sept systèmes (sur 110).",
      "J-20 — cas d'honnêteté radicale sur l'incertitude : flotte 300+ documentée, motorisation et coûts volontairement traités au niveau de confiance abaissé. Le X-Ray reflète ce que l'OSINT peut dire d'un programme aussi fermé — et ce qu'il refuse d'inventer.",
      "Sea Fire — pendant français de SPY-6 : 4 panneaux fixes GaN, hors ITAR, couplé à l'export FDI (Grèce confirmée). Permet le couple comparatif Sea Fire / SPY-6 — deux modèles concurrents de souveraineté radar navale moderne.",
      "DragonFire — du démonstrateur à l'engagement daté : contrat £316M, calendrier accéléré de 5 ans, déploiement Type 45 annoncé pour 2027. Couple comparatif HELMA-P (~2 kW, FR) / DragonFire (~50 kW, UK) : deux modèles de souveraineté laser nationale.",
      "Meteor — pilier autonomie air-air européenne : ramjet Bayern-Chemie (souverain européen), intégration F-35 en cours = fait industriel et politique majeur. L'effecteur qui transforme un avion américain en plateforme partiellement européenne.",
      "MICA NG — cohérence souveraine du couple Rafale + MBDA : double seeker interopérable (RF AESA + IR FPA), mutualisation air-air / sol-air via VL MICA, hors ITAR. Test de cohérence de l'arsenal souverain français à suivre dès 2026.",
    ],
  },
  {
    date: "2026-06-08",
    title: "System X-Ray — lot 2 : quatre dossiers à forte densité éditoriale",
    items: [
      "Quatre dossiers passent en lecture éditoriale — Eurofighter Typhoon, Charles de Gaulle, HELMA-P et Aster 30 B1NT — portant la couverture éditoriale à douze systèmes (sur 110).",
      "Eurofighter Typhoon — cas-école de la coopération à quatre nations : moteur EJ200 (consortium), radar ECRS Mk1, Tranche 5 allemande 2025, friction de gouvernance et veto d'export structurel.",
      "Charles de Gaulle — porte-avions lu comme architecture de puissance : K15 nucléaire, CATOBAR, ATM/IPER, écosystème Rafale Marine + Hawkeye, PA-NG.",
      "HELMA-P — laser anti-drone CILAS : couches de coût (marginal vs système), contraintes physiques (ligne de visée, atmosphère, dwell time), DGA / L2AD, cadre Protocole IV.",
      "Aster 30 B1NT — intercepteur LRAD européen hors ITAR : Eurosam, PIF/PAF + RF actif, OCCAR/FSAF, cadence MBDA sous tension (post-Ukraine, European Sky Shield), positionnement vs PAC-3.",
    ],
  },
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
