# RAF-01 — Planche Rafale F4 · Meteor : chasseur, emports et départs illustratifs en 3D

Nouvelle planche technique `/hud/rafale-f4-meteor`, construite sur le modèle de
la planche Patriot (PAT-01) : asset Blender reproductible, séquence en six
états strictement pilotée par l’état, trois scénarios d’illustration,
inspection accessible, mouvement réduit respecté. Branche
`claude/rafale-3d-missile-sim-2d882f`.

## 1. Ce qui a été livré

| Livrable | Emplacement |
|---|---|
| Pipeline Blender paramétré (6 modules, spec JSON, rendus de contrôle) | `tools/rafale-3d/` (voir son README) |
| Asset GLB compressé meshopt (~230 Ko, sans clip) | `public/models/hud/rafale-f4.glb` |
| Page éditoriale (Server Component) | `src/app/hud/rafale-f4-meteor/page.tsx` |
| Expérience 3D client (scène, modèle, effets, capteurs, décor de vol) | `src/components/hud/rafale/` |
| Logique pure (séquence et scénarios, mouvement, chronologie de départ, inspection) | `src/data/hud/rafale*.ts` |
| Vignette 1280 × 720 (17,6 Ko) | `public/images/hud/rafale-f4-meteor-preview.webp` |
| Tests | `tests/unit/rafale-*.test.ts` (5 fichiers, dont les cadrages projetés), `tests/e2e/rafale-board.spec.ts` et `rafale-motion.spec.ts` (35 tests) |

La page suit le gabarit Patriot : fil d’Ariane, « Cadre éditorial » (quatre
limites), « Pourquoi trois scénarios ? » (une note sourcée par scénario),
« Repères publics 2015 – 2026 » (six repères datés et sourcés), « Méthode »
(liens vers les dossiers Rafale, Meteor et MICA NG et vers le System X-Ray).

Intégration au site, toute additive :

- `src/data/hud/boards.ts` : la planche entre au registre **en tête**, avec
  `systemSlugs: ["rafale", "meteor"]` (lien « Planche 3D interactive → » sur
  le System X-Ray de ces deux dossiers). Deux champs optionnels nouveaux :
  `entries` (entrées directes dans un scénario, `?scenario=bvr|wvr|sead`) et
  `preview.focusX` (point focal horizontal quand la vignette est recadrée).
- Accueil (`src/app/page.tsx`, `HudBoardSpotlight` dans
  `src/components/hud/hud-board-card.tsx`) : `HUD_BOARDS[0]` devient une
  grande vignette (`article[data-hud-board="rafale-f4-meteor"][data-hud-teaser="spotlight"]`)
  placée **sous** les trois autres, qui gardent leur grille (Patriot sur deux
  colonnes, puis Thundart et Drone). L’ordre du DOM reste Patriot, Thundart,
  Drone, Rafale, pour que la première vignette reste dans le premier écran.
  En colonne large (≥ 1024 px), la colonne de gauche devient une colonne
  flexible : la grande vignette comble la bande vide qui restait sous les
  vignettes, en regard du sommaire des domaines. Son image absorbe la hauteur
  disponible jusqu’à un plafond de 1,1 fois sa largeur (requête de conteneur :
  `@container` sur l’article, `lg:max-h-[110cqw]`), 17 rem au minimum ;
  l’excédent passe dans le bloc texte, où les trois entrées directes sont
  poussées vers le bas, au-dessus du lien étiré de la carte. Sous 1024 px :
  vignette 16:9 pleine largeur après la grille.
- Index `/hud` : `HudBoardGrid` ne passe à trois colonnes que si le nombre de
  planches est un multiple de 3 ; quatre planches donnent une grille 2 × 2,
  sans carte orpheline. Description de l’index mise à jour.
- `src/app/layout.tsx` : lien de pied de page « HUD Rafale ».
- `src/app/globals.css` : `.rafaleExperience` reprend la marge d’ancre et le
  gel du grain décoratif (`.film-grain`, `.transmission-dot`) des planches
  Thundart et Patriot.
- System X-Ray du Rafale : la branche reprend le mécanisme de placement
  `XRAY_MODEL_OVERRIDES` arrivé sur `main` (tous les GLB X-Ray en meshopt,
  repères tournés d’un quart de tour vers le repère glTF) et l’étend de deux
  champs, `glbPath` et `hiddenNodes`. `XRAY_MODEL_OVERRIDES.rafale` charge
  l’asset de la planche au lieu de l’ancien GLB filaire
  `public/models/aviation/rafale.glb`, qui reste dans le dépôt mais n’est plus
  lu ; modèle à l’échelle 0,2, caméra initiale reculée (`[4,6 ; 3,1 ; 5,0]`),
  configuration air-sol (AASM, Talios, bidons de voilure et leurs pylônes)
  retirée du clone, contours d’arêtes compris : la vue montre la
  configuration air-air documentée. Huit des treize repères du Rafale sont
  **réalignés** sur les pièces dans `src/data/decision-twin/panoplie-xray.ts`
  (cellule, verrière, radar, SPECTRA, plans canard, voilure, moteur, emport
  central) ; les cinq repères qui ne désignent pas une pièce (Dassault,
  Thales, autonomie stratégique, régime hors ITAR, confiance globale) sont
  replacés au-dessus et au-dessous du modèle, dans le champ de la caméra
  initiale. La détection de la verrière ignore `RAF_CanopyFrame` et lit le nom
  du parent si la compression glisse un nœud sans nom. Le test
  `tests/data/xray-models.test.ts` de `main` suit désormais `glbPath` et
  `hiddenNodes`, déclare les pièces du Rafale et écarte les pièces planes
  (vitre du collimateur, disques de l’OSF et de la bouche du canon), dont
  l’enveloppe convexe dégénérée donnait des écarts arbitraires.
- `tests/unit/hud-boards.test.ts` : chaque entrée directe ouvre sa propre
  planche, sans doublon.
- `tests/e2e/hud-hub.spec.ts` (quatre planches, grande vignette de
  l’accueil, grille 2 × 2 sans carte orpheline) et `tests/e2e/smoke.spec.ts`
  (`A11Y_PAGES` : la planche passe l’audit axe) : mis à jour, verts.

Contrôles géométriques du pipeline, faits après la revue (sondes par lancer
de rayons sur la scène Blender) : coque d’entrée d’air échantillonnée sur
tous ses rangs, bouche du canon et feux de position visibles de l’extérieur
(ils étaient enfermés), cocardes à 3 à 5 mm de la peau, pylônes sans jour
sous la cellule, bandes de livrée des Meteor et MICA exportées. Les nœuds
pilotés (gouvernes, emports) sont des empties sans échelle qui portent leur
maillage en enfant : la quantification meshopt ne déplace plus leur pivot et
n’agrandit plus les flammes accrochées aux munitions.

Aucune dépendance ajoutée (`package.json` inchangé). `@gltf-transform/cli`
n’est appelé qu’au build de l’asset, via `npx`, version épinglée dans la spec.

## 2. Sources

Vérifiées et citées sur la planche (catalogue d’inspection, notes de
scénario, repères datés) ou dans la spec :

- **Constructeurs.** Dassault Aviation :
  [caractéristiques et performances](https://www.dassault-aviation.com/fr/defense/rafale/caracteristiques-et-performances/),
  [dossier de presse du Bourget, juin 2023](https://www.dassault-aviation.com/wp-content/blogs.dir/1/files/2023/06/RAFALE-Dossier-de-Presse-Juin-2023-Le-Bourget.pdf)
  (dimensions canoniques, 14 points d’emport dont 5 lourds, 13 sur le
  Rafale M, siège incliné à 29°, 70 % de composites, M88-2 de 5 t et 7,5 t,
  carburant, charge externe, plans canard identiques à gauche et à droite,
  aérofreins supprimés dès la conception, IRST de l’OSF au standard F4.1). MBDA : [Meteor](https://www.mbda-systems.com/products/air-dominance/meteor),
  [MICA](https://www.mbda-systems.com/products/air-dominance/mica-family/mica),
  [SPECTRA](https://www.mbda-systems.com/products/air-dominance/spectra),
  [fiche technique Meteor 2023](https://www.mbda-systems.com/sites/mbda/files/2024-06/2023%20METEOR%20datasheet.pdf)
  (statoréacteur à propergol solide et à débit variable, départ sur rail ou
  par éjection, 3,7 m et 178 mm) ;
  le rendu de profil de la page Meteor a servi à mesurer les stations du
  missile. Safran :
  [AASM Hammer](https://www.safran-group.com/products-services/aasm-hammer-tm-highly-agile-modular-munition-extended-range)
  (kit de guidage et kit propulsif, corps de 125 à 1 000 kg). KNDS :
  [canon 30M791](https://knds.com/en/press-releases/nexter-a-company-of-knds-produces-the-300th-rafale-gun).
- **Sources officielles.** Ministère des Armées :
  [fiche Rafale F4](https://www.defense.gouv.fr/air/nos-aeronefs/nos-avions/rafale-f4)
  (envergure de 10,80 m),
  [qualification du standard F4.1](https://www.defense.gouv.fr/dga/actualites/dga-qualifie-rafale-au-standard-f41)
  (13 mars 2023 : viseur de casque Scorpion, AASM de 1 000 kg, nouvelles
  fonctions Talios, OSF et RBE2),
  [commande de 42 Rafale F4](https://www.defense.gouv.fr/dga/actualites/dga-commande-42-rafale-larmee-lair-lespace)
  (annoncée le 12 janv. 2024 ; premier avion livré dès 2027),
  [premiers travaux du standard F5](https://www.defense.gouv.fr/dga/actualites/dga-commande-premiers-travaux-amont-du-prochain-lancement-realisation-du-standard-f5-du-rafale)
  (publié le 10 sept. 2026 ; contrats notifiés à l’été 2026 : RBE2-XG,
  SPECTRA F5, M88 T-REX de 7,5 à 9 t, liaison IVDL). DGA :
  [missile Meteor](https://www.defense.gouv.fr/dga/missile-meteor) (3,65 m,
  ≈ 200 kg, arme contre les menaces aériennes).
- **Presse spécialisée.** Opex360 :
  [premier tir guidé d’un Meteor par un Rafale](https://www.opex360.com/2015/04/30/premier-tir-guide-reussi-dun-missile-meteor-par-rafale/)
  (28 avr. 2015),
  [qualification du standard F3-R](https://www.opex360.com/2018/11/09/la-direction-generale-de-larmement-a-prononce-la-qualification-du-standard-f3-r-du-rafale/)
  (31 oct. 2018),
  [qualification de la nacelle Talios](https://www.opex360.com/2018/11/19/la-nouvelle-nacelle-optronique-talios-a-ete-qualifiee-par-la-direction-generale-de-larmement/).
  The Aviationist :
  [vol du 4 mars 2021](https://theaviationist.com/2021/03/09/french-rafale-performs-first-operational-flight-with-live-meteor-beyond-visual-range-air-to-air-missiles/)
  (configuration photographiée : deux Meteor sur les points arrière du
  fuselage, deux MICA EM, deux MICA IR, bidon ventral),
  [qualification du standard F4.1](https://theaviationist.com/2023/04/02/rafale-f4-1-standard-qualified-for-fielding/)
  (13 mars 2023). Avions légendaires :
  [le Rafale F5 et la capacité SEAD](https://www.avionslegendaires.net/2026/04/actu/le-dassault-aviation-rafale-f5-rendra-a-la-france-la-capacite-sead/)
  (avr. 2026).
- **Référence.** Wikipédia (en anglais) :
  [Optronique secteur frontal](https://en.wikipedia.org/wiki/Optronique_secteur_frontal)
  (tête infrarouge, tête télévision et télémètre laser) ; Wikipédia (en
  français) : [Dassault Rafale](https://fr.wikipedia.org/wiki/Dassault_Rafale)
  (surface alaire de 45,7 m², repère « conf. moyenne »).

Consultées pour les choix de modélisation et de scénario, sans être citées
sur la page : l’article d’Opex360 sur le
[premier vol avec des Meteor « bons de guerre »](https://www.opex360.com/2021/03/05/premier-vol-dun-rafale-f3r-avec-des-missiles-air-air-longue-portee-meteor-bons-de-guerre/)
(remplacé par The Aviationist, qui donne la date, la base et la
configuration), le [dossier Rafale de Dassault (2015)](https://www.dassault-aviation.com/wp-content/blogs.dir/1/files/2015/02/Rafale-file_UK.pdf)
(pas d’aérofrein), le
[rapport d’information n° 2507 de l’Assemblée nationale sur la guerre électronique](https://www.assemblee-nationale.fr/dyn/17/rapports/cion_def/l17b2507_rapport-information)
(18 févr. 2026 : moyens SEAD spécialisés abandonnés à la fin des années 1990),
la [loi n° 2026-791 d’actualisation de la LPM](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054694832)
(un missile SEAD pour le standard F5), Janes
([STRATUS RS, futur missile SEAD du Rafale](https://www.janes.com/osint-insights/defence-news/defence/france-confirms-stratus-rs-as-future-sead-weapon-for-rafale)),
[Portail aviation](https://www.portail-aviation.com/blog/2015/04/30/premier-tir-du-missile-meteor-par-le/)
(vérins d’éjection du point d’emport, 2015) et
[Rafalefan](https://rafalefan.e-monsite.com/pages/dossier-rafale-avionique/armements-air-air.html)
(séparation des Meteor par éjection, points d’emport ; site de passionnés,
lecture croisée seulement).

Non retenus :

- le miroir en ligne de Jane’s qui décrit des aérofreins près de la dérive :
  contredit par Dassault ;
- une valeur chiffrée de zone de non-échappement du Meteor, répétée par des
  sources secondaires : non officielle, ni affichée ni reprise ;
- l’emport de quatre Meteor (point 2 de voilure) : décrit comme possible,
  jamais confirmé ;
- les réservoirs conformes dorsaux essayés sans suite : absents du modèle ;
- la fiche AIM-120 du dépôt (`src/data/systems/aim-120-amraam.ts`, résumé),
  qui présente l’AMRAAM comme une munition tirée d’un Rafale F4 : c’est faux,
  le Rafale n’emporte pas d’AMRAAM ; rien n’en est repris (correction à faire
  à part).

Aucun document source n’est ajouté au dépôt : la planche et la spec citent
leurs URL.

Photographies de l’utilisateur (dossier « RAFALE MAQUETTE BLENDER » :
biplaces B, vue de face en configuration air-air, configuration air-sol vue de
dessous, infographie Thales des capteurs) : lecture des formes, de la livrée
et des emports, jamais de cotes. Les vues de contrôle `ref_*` du pipeline
reprennent leurs angles.

## 3. Séquence et scénarios

Six états, pilotés uniquement par Suivant / Précédent / Réinitialiser ou par
la liste des états (accès direct) :

| État | Libellé | Pose | Caméra |
|---|---|---|---|
| `overview` | Rafale F4 en vol | vol stabilisé, emports du scénario | trois-quarts avant droit, orbite libre au repos |
| `inspect` | Inspection de la cellule | idem | trois-quarts avant rapproché, orbite libre |
| `sensors` | Capteurs et fusion de données | secteurs symboliques des capteurs ; en combat rapproché, l’avion prend 55° d’inclinaison | vue arrière haute ; en combat rapproché, cadrage propre, au-dessus du plan des ailes, l’aile basse dans le champ |
| `release` | Séparation | chronologie figée à 0,30 s (Meteor), 0,14 s (MICA IR), 0,45 s (AASM) | gros plan du point d’emport : trois-quarts arrière sous l’aile droite (Meteor, AASM), en arrière et au-dessus du saumon gauche (MICA IR) |
| `launch` | Allumage et départ | figée à 1,6 s, 1,3 s, 2,2 s | poursuite (Meteor, MICA IR) ou profil droit en recul (AASM : avion et munition entiers) ; le cadrage suit la munition pendant la transition, puis revient à celui de l’état |
| `complete` | Planche terminée | figée à 6,4 s, 5,6 s, 7,4 s | plan large final — arrière gauche (Meteor), devant l’avion en regardant le sillage (MICA IR, AASM) — orbite libre |

L’orbite n’est libre que dans les états d’observation (`overview`,
`inspect`, `complete`), au repos ; pendant une transition, la vue affiche
« Recomposition en cours », et dans les autres états « Caméra verrouillée
dans cet état ».

Trois scénarios, choisis avant la séparation puis verrouillés jusqu’à la fin
de la séquence (revenir avant la séparation, ou réinitialiser, pour en
changer). La page les justifie dans « Pourquoi trois scénarios ? » :

- **Interception BVR · Meteor** (par défaut). Le Meteor est un missile
  air-air conçu pour l’engagement au-delà du contact visuel ; c’est le seul
  scénario où il part. Configuration air-air du vol documenté du 4 mars 2021 :
  deux Meteor sur les points arrière du fuselage, deux MICA EM sous voilure,
  deux MICA IR aux saumons, un bidon ventral. Séparation par éjection (course
  vers le bas), allumage une fois dégagé, propulseur d’accélération intégré
  (flamme vive, sillage dense), puis relais du statoréacteur : flamme réduite,
  sillage ténu. Après l’allumage, un pointillé symbolise la liaison de données
  bidirectionnelle. L’état « capteurs » met le RBE2 en avant.
- **Combat rapproché · MICA IR.** En combat tournoyant (« dogfight »), le
  Rafale emploie le MICA — ici en version infrarouge — et son canon de 30 mm,
  pas le Meteor. L’avion vire à gauche, incliné à 55° dès
  l’état « capteurs », plans canard et élevons braqués pour la lecture ; le
  MICA IR part du rail de saumon gauche, moteur allumé sur le rail. L’état
  « capteurs » met l’OSF en avant. Nuance conservée : MBDA revendique pour le
  MICA un double rôle, interception comprise, et le catalogue le dit.
- **SEAD · AASM Hammer.** La suppression des défenses sol-air n’est pas le
  rôle du Meteor, missile air-air. La France n’aligne plus de missile
  antiradar depuis le retrait de l’AS.37 Martel, à la fin des années 1990 ;
  le standard F5 doit retrouver cette capacité avec le STRATUS RS de MBDA,
  annoncé à l’horizon 2035 ; d’ici là, SPECTRA localise précisément les
  menaces sol pour les éviter ou les traiter. Le scénario montre donc l’AASM
  Hammer — armement air-sol modulaire **sans autodirecteur antiradar** —
  largué sous la voilure droite, puis l’allumage de son kit propulsif.
  Configuration air-sol : deux AASM sur les pylônes médians, nacelle Talios
  sous l’entrée d’air droite, trois bidons, MICA conservés ; hauteur de vol
  figurée plus basse. L’état « capteurs » met SPECTRA en avant. Ni radar au
  sol ni émetteur n’est représenté.

Entrées directes : `?scenario=bvr|wvr|sead` (liens de la grande vignette de
l’accueil), lu côté client seulement ; toute autre valeur est ignorée, et un
choix de l’utilisateur prime sur le lien. Changer de scénario au repos
applique directement la pose de l’état pour ce scénario ; pendant une
transition encore libre (Inspection → Capteurs, où l’inclinaison dépend du
scénario), la transition repart de la pose réelle vers celle du nouveau
scénario. Un emport épinglé qui cesse d’être visible est désépinglé.

## 4. Mouvement et effets

Même contrat que Thundart et Patriot : **NO STATE CHANGE = NO MOTION**.
`rafale-motion.ts` construit un plan à quatre canaux — caméra, inclinaison
(`bank`), secteurs des capteurs (`sensors`), chronologie de départ
(`launch`) — qui repart toujours de la pose réelle, se termine sur une pose
exacte et ne dépend pas du framerate (une image fait avancer la transition de
64 ms au plus, 200 ms en rendu logiciel). Premier montage, bascule seule du réglage « mouvement
réduit », redimensionnement, défilement de la page : aucune transition.

**Repère de l’avion.** L’avion reste à l’origine ; les cadrages sont exprimés
dans son repère. Le groupe de vol `RAF_UI_Flight` porte l’inclinaison (ordre
`YXZ`, roulis d’abord) ; la caméra le suit, mais son « haut » reste la
verticale du monde : l’horizon reste horizontal quand l’avion vire. Fumées,
flammes et secteurs des capteurs vivent eux aussi dans le repère de l’avion.

**Cadrages.** Les poses sont réglées pour le format de la vue à 1 440 px de
large (`RAFALE_DESIGN_ASPECT`, 1,55), sous un champ vertical fixe de 34°.
Sur un cadre plus étroit (colonne de 1 024 px, téléphone), la caméra recule
en proportion (`framingScaleForAspect`, plafonné à ×2) pour garder la même
couverture horizontale. `tests/unit/rafale-framing.test.ts` rejoue chaque
pose finale en format carré, 1,55 et 16:9, et exige que ce qu’annonce
l’état reste dans le cadre : l’avion entier en vue d’ensemble, aux
capteurs, au départ et à la fin ; la munition à la séparation et au départ.

**Décor.** `rafale-world.ts` : dôme de ciel, terrain procédural à grille
technique (mailles de 400 et 100 m), 72 nuages en billboards triés, brume ;
hauteur de vol figurée de 1 500 m en air-air, 480 m en mission SEAD. Le
décor **ne défile que pendant une transition** : il recule à la vitesse de
l’écoulement d’air, en temps réel, ou au rythme de la chronologie pendant un
départ, ralenti compris ; terrain, nuages et fumée reculent ensemble vers la
queue. Au repos, rien ne bouge. Sous l’horizon, le dôme prend la couleur de la
brume, si bien que le bord du terrain, entièrement embrumé, ne se voit pas.

**Tempos.** Caméra 1 s ; mise en virage 1,3 s (retour à plat en 0,9 s) ;
secteurs des capteurs en 0,7 s à l’apparition (après 0,35 s), 0,4 s à la
disparition ; l’ordre de séparation attend la fin du virage et un temps
d’armement de 0,26 s. En marche arrière, la chronologie de départ revient
d’un coup (on ne « rembobine » pas un départ), puis l’avion revient à plat.
Horloge de départ par paliers : séparation à **×0,35**, allumage et départ à
**×0,6**, puis temps réel (**×1**). Durées en marche avant :

| Transition | Meteor | MICA IR | AASM |
|---|---|---|---|
| `overview` → `inspect` | 1,0 s | 1,0 s | 1,0 s |
| `inspect` → `sensors` | 1,05 s | 1,3 s (mise en virage) | 1,05 s |
| `sensors` → `release` | 1,57 s | 1,11 s | 2,0 s |
| `release` → `launch` | 2,17 s | 1,93 s | 2,92 s |
| `launch` → `complete` | 4,8 s | 4,3 s | 5,2 s |

Les tests bornent chaque pas à 10 s en marche avant et à 3 s en marche
arrière.

**Chronologie de départ.** `rafale-launch.ts` décrit la séparation comme des
fonctions pures du temps, dans le repère de l’avion : éjection (course de
1,7 m vers le bas, léger piqué, léger recul avant l’allumage), départ sur
rail (1,6 m de rail, puis léger décrochement) ou largage (chute, puis mise en
plané sous propulseur). Après l’allumage, la munition prend de l’avance dans
l’axe de l’avion, avec des accélérations choisies pour la lecture (42, 64 et
24 m/s²) : aucune physique, aucune trajectoire guidée. Flamme : montée en
0,06 s, combustion fumigène de 2,6, 2,2 et 2,4 s ; le Meteor garde ensuite une
flamme réduite (phase entretenue du statoréacteur), les deux autres
s’éteignent en 0,3 s.

**Particules.** Bouffées tirées d’une graine fixe (mulberry32, graine 2027
décalée par scénario ; aucune `Math.random`, ce que vérifie un test qui
parcourt les sources) : 14 bouffées de séparation, 34 d’allumage, 560 de
sillage, plus 600 de phase entretenue pour le seul Meteor, soit 1 208 ou 608
bouffées. `rafale-effects.ts` les rend en un seul billboard instancié (un
appel de rendu), trié d’arrière en avant. Une bouffée émise reste dans l’air :
elle recule avec l’écoulement relatif, grossit et s’estompe. **Près de la
caméra, elle s’efface** (fondu entre 1,2 fois sa taille et 4 fois sa taille
plus 6 m) : jamais de voile plein cadre ; les nuages font de même entre 60 et
260 m. La flamme (cône additif et halo) est enfant de l’empty de la munition,
sans échelle (voir le README du pipeline) ; la lumière
d’allumage est toujours présente, d’intensité nulle au repos, pour qu’aucun
shader ne se recompile au départ. Textures générées localement, aucun
téléchargement. Au repos dans l’état Fin, une orbite re-trie les bouffées
pour le nouveau point de vue ; rien ne bouge pour autant.

**Écoulement d’air : 55 m/s, ralenti assumé.** C’est la vitesse à laquelle
fumée et décor reculent : une vitesse de lecture, très inférieure à une
vitesse de vol réelle, qui garde le sillage dans le cadre.

**Capteurs.** `rafale-sensors.ts` dessine en lignes fines additives, sans
échelle ni valeur, l’éventail de l’antenne RBE2 vers l’avant, le cône étroit
de l’OSF et la sphère de couverture de SPECTRA ; chaque scénario met un
capteur en avant (RBE2, OSF, SPECTRA), avec une légende « secteurs
symboliques, sans échelle ». En BVR, après l’allumage, un pointillé relie
l’avion au Meteor, légende « Liaison de données du Meteor · tracé
symbolique ».

**Mouvement réduit** : chaque état est posé directement, même information (un
test compare la pose finale avec et sans transition). Les deux correctifs
d’orbite de Thundart (PR #28) sont repris d’emblée : la vue ne s’abonne qu’à
la largeur et à la hauteur du canevas (un défilement de la page ne recadre
plus la vue sous l’orbite de l’utilisateur), et la fin d’un glisser n’épingle
aucun sous-ensemble.

## 5. Inspection

Quinze sous-ensembles, en deux groupes. Cellule et capteurs (dix) : radôme et
radar RBE2 AESA, optronique secteur frontal, verrière et cockpit, plans
canard, voilure delta et élevons, cellule et entrées d’air, moteurs M88 et
tuyères, dérive et SPECTRA, perche de ravitaillement, canon de 30 mm. Emports
(cinq) : Meteor, MICA IR et EM, AASM Hammer, nacelle Talios, réservoirs et
pylônes. Chacun est relié à des nœuds réels du GLB
(`rafaleInspectionIdForNodeName`) et décrit par trois faits sourcés, avec un
repère « conf. moyenne » sur les valeurs estimées ou divergentes : envergure
(10,90 ou 10,80 m), surface alaire, têtes de l’OSF, carénages SPECTRA
figurés, emplacement et courbure de la perche, emplacement du canon, masse du
Meteor (190 kg selon MBDA, ≈ 200 kg selon la DGA), corps figuré de l’AASM,
emport figuré de la Talios, points lourds.

**Filtrage par configuration.** Un emport ne se propose à l’inspection que
s’il est visible (`loadouts`, `rafaleInspectablesFor`) : treize
sous-ensembles en air-air (ni AASM ni Talios), quatorze en air-sol (pas de
Meteor) ; MICA et réservoirs restent dans les deux configurations. Changer de
scénario désépingle un emport qui disparaît, et le panneau ne le montre plus.

Survol, focus, toucher et clic ; Entrée / Espace épinglent, Échap désépingle
(aussi après un clic dans la vue 3D, dont le canevas ne prend pas le focus) ;
un emport masqué, celui de l’autre configuration, n’est jamais désigné : il est
retiré des intersections avant la distribution des événements R3F ;
sous 1024 px, épingler depuis le panneau recale la planche dans la vue. La
mise en évidence est colorimétrique : rien ne disparaît. Statut des sources :
« SOURCES PUBLIQUES · REPRÉSENTATION ILLUSTRATIVE ».

## 6. Profils de rendu

La planche importe le module partagé `src/components/hud/render-profile.ts`
(la planche Patriot garde une copie locale, à retirer à part), qui sonde
WebGL 2 une fois par page, avant de créer le contexte de la scène. Le profil
est exposé dans `data-rafale-render-profile` :

- **`hardware`** : rendu complet — environnement de réflexion rendu une seule
  fois (`Environment frames={1}`, quatre `Lightformer`, ni HDR ni CDN),
  ombres, anticrénelage, `dpr` jusqu’à 1,5.
- **`software`** (SwiftShader, llvmpipe…) : ni environnement, ni
  anticrénelage, ni ombres ; `dpr` à 1 ; ambiance remontée pour compenser
  (lumière ambiante à 0,5 au lieu de 0,24, hémisphère à 1,2 au lieu de 0,9) ;
  plafond de pas de temps à 200 ms (`SOFTWARE_MAX_FRAME_STEP_MS`), pour que
  les transitions gardent leur durée ; décor allégé (terrain à une seule
  couche de bruit, 18 nuages au lieu de 72). Coût par image non mesuré pour
  cette planche.
- **`none`** : pas de WebGL 2. Repli explicite (« La vue 3D requiert
  WebGL 2… »), statut « Vue 3D indisponible sans WebGL 2 · contrôles et
  inspection utilisables » ; le GLB n’est jamais téléchargé (préchargement
  conditionné au profil) ; séquence, scénarios et inspection restent
  utilisables.

Un seul canevas, `frameloop="demand"` : rien n’est rendu hors transition,
geste ou changement d’inspection.

## 7. Vérifications exécutées

| Commande | Résultat |
|---|---|
| `npm run typecheck` | OK, aucune erreur |
| `npm run lint` | OK, aucun avertissement |
| `npm test` | OK — 24 fichiers, 263 tests après fusion de `main` (dont `tests/data/xray-models.test.ts`) ; dont `tests/unit/rafale-*.test.ts` (5 fichiers : séquence, mouvement, départ, inspection et contrat GLB, cadrages projetés) et `tests/unit/hud-boards.test.ts` |
| `npm run build` | OK — 499 pages générées, `/hud/rafale-f4-meteor` pré-rendue (○) |
| `npm run test:e2e` | OK — 142 tests. Passe complète sur un port isolé (3117) : 140 verts, le port 3000 étant alors tenu par le serveur d’une autre session ; les deux restants (`thundart-preview.spec.ts`, qui vise `localhost:3000` en dur, et le premier test sans WebGL de `patriot-board.spec.ts`, expiré à froid sous charge) repassés verts sur le port 3000 libéré (37 sur 37). Après fusion de `main` : specs Rafale, Patriot, hub et smoke rejouées ; le test « réinitialiser pendant le départ », instable sous charge (les attentes d’actionnabilité de Playwright dépassaient la transition en rendu logiciel), déclenche désormais la coupure depuis la page : `rafale-motion.spec.ts` 30 sur 30 en trois répétitions |
| `"C:/Program Files/Blender Foundation/Blender 5.1/blender.exe" --background --factory-startup --python tools/rafale-3d/generate-rafale.py -- --spec rafale-f4` | OK — `inverted_normals` vide, 32 266 triangles uniques, 66 nœuds, 34 matériaux ; GLB de 235 312 octets (~230 Ko) |

Le test de contrat `tests/unit/rafale-inspection.test.ts` lit le segment
JSON du GLB publié : taille sous 1 Mo, extensions requises exactement meshopt
et quantification (pas de Draco), aucune animation, nœuds pilotés présents une
seule fois, racines sans transformation, chaque entrée du catalogue
désignable et chaque nœud `RAF_*` relié, couverture propre à chaque
configuration, longueur, pivot et position des munitions tirées, gouvernes
qui pivotent sur leur charnière (bornes lues dans les accesseurs `POSITION`,
déquantifiées).

## 8. Cadre non opérationnel

Aucune cible, coordonnée, trajectoire calculée, balistique, domaine de tir ni
procédure. La munition quitte son point d’emport et s’éloigne dans l’axe de
l’avion ; au-delà de ce départ, rien n’est calculé ni représenté. En SEAD, ni
radar au sol ni émetteur : seule la configuration d’emport est illustrée. Les
secteurs des capteurs sont symboliques et sans échelle ; la liaison de
données est un pointillé. Aucune portée ni zone de non-échappement chiffrée
n’est affichée. Tempos, ralenti, sillages et configurations d’emport sont des
choix de lecture, dits comme tels sur la page (« Cadre éditorial »), dans la
description accessible et au pied du panneau d’inspection (« Représentation
illustrative. Aucun ciblage ou calcul opérationnel. »).

Les tests unitaires refusent le vocabulaire d’engagement dans les textes des
états et des scénarios (`rafale-sequence.test.ts`) comme dans ceux du
catalogue (`rafale-inspection.test.ts`) : « portée » (sans limite de mot dans
les textes de la séquence, ce qui attrape aussi « emportée »), « cible »,
« cibles », « cibler », « probabilité », « altitude d’interception »,
« guidage terminal », « no escape » et « non-échappement », « Pk », « létal »,
« neutralis… », « abattre », « destruction », et « NEZ » en capitales
seulement : le « nez » de l’avion reste permis. Le statut des sources ne doit
porter aucun identifiant de ticket (`RAF-`, `HANDOFF`).

## 9. Limitations connues

- L’asset reste une silhouette : ni intérieur ni câblage, marquages réduits
  aux cocardes, train rentré et non modélisé, pas d’aérofrein (le Rafale n’en
  a pas), bords de fuite lisses (pas de dents de scie), becs non découpés,
  SPECTRA réduit à quatre carénages ; Rafale C seulement.
- Gabarits : longueur modélisée de 15,24 m ; voilure de 10,30 m de saumon à
  saumon (10,50 m aux rails, ≈ 10,92 m avec les MICA IR), et aucune source ne
  précise si l’envergure publiée inclut les rails. Plans canard, dérive,
  entrées d’air, verrière et perche sont calés sur photographies.
- Configurations d’emport illustratives : l’air-air reprend le vol documenté
  du 4 mars 2021 ; l’air-sol (deux AASM de la classe 250 kg sur les pylônes
  médians, Talios, trois bidons, MICA conservés) est plausible mais n’est pas
  une configuration documentée. La liste exacte des points lourds n’est pas
  publiée ; pylônes et adaptateurs sont approchés.
- Attitude : vol en palier, sauf en combat rapproché (55° d’inclinaison,
  braquages de lecture de 5° et 8°) ; aucune mécanique du vol : l’avion ne se
  déplace pas, c’est le décor qui recule.
- Décor : terrain stylisé à grille technique, sans géographie réelle ;
  hauteurs de vol figurées.
- Ralenti : écoulement d’air de 55 m/s, horloge de départ à ×0,35 puis ×0,6 ;
  accélérations et durées de combustion choisies pour la lecture ; l’aspect
  du panache d’un statoréacteur n’est décrit par aucune source publique.
- System X-Ray : le Rafale y charge désormais ~230 Ko au lieu de 28 Ko, et
  la vue réécrit tous les matériaux et ajoute un filaire d’arêtes sur un
  maillage détaillé : coût non mesuré.
- Le chunk 3D différé reste le coût de R3F/three, comme pour Thundart et
  Patriot.
