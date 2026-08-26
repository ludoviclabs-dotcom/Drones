# THD-04 — HUD technique et inspection accessible

La route `/hud/thundart` est désormais une planche technique Panoplie centrée
sur la scène 3D. Le HUD reste une couche éditoriale périphérique : il décrit
l’état, la provenance et les sous-ensembles visibles sans masquer le modèle et
sans introduire de télémétrie, de jauge ou de donnée opérationnelle fictive.

Le cadre de sécurité reste explicite dans le DOM : **« Représentation
illustrative. Aucun ciblage ou calcul opérationnel. »**

## 1. Architecture

| Fichier | Rôle |
|---|---|
| `src/data/hud/thundart-inspection.ts` | Catalogue documenté des cinq sous-ensembles, correspondance avec les nœuds GLB et reducer pur de sélection. |
| `src/components/hud/thundart/ThundartInspectionPanel.tsx` | Rail HUD HTML accessible : informations autorisées, boutons, aperçu et détail épinglé. |
| `src/components/hud/thundart/ThundartExperience.tsx` | Propriétaire de l’état d’inspection et pont déterministe entre DOM, Canvas et touche Échap. |
| `src/components/hud/thundart/ThundartScene3D.tsx` | Canvas, micro-callout visuel et transmission de l’inspection au modèle. |
| `src/components/hud/thundart/ThundartModel.tsx` | Correspondance mesh → sous-ensemble, mise en avant matérielle et atténuation non destructive. |
| `src/components/hud/thundart/ThundartControls.tsx` | Séquence THD-03 conservée dans un bandeau compact et accessible. |
| `src/app/hud/thundart/page.tsx` | Server Component éditorial ; la structure, le titre et la description existent avant hydratation. |

Le modèle d’état de l’inspection est séparé de la machine de séquence THD-02/03 :

```ts
type ThundartInspectionState = {
  previewId: ThundartInspectableId | null;
  selectedId: ThundartInspectableId | null;
};
```

`selectedId` a priorité sur `previewId`. Le reducer n’accepte que les cinq
identifiants du catalogue ; une valeur externe ou inconnue retombe sur `null`,
ce qui empêche un état d’inspection invalide.

## 2. Source et contenu autorisé

La seule source descriptive utilisée est le handoff qualifié
`docs/agent/THD-01-BLENDER-ASSET.md`. Le HUD affiche donc
`DOCUMENTÉ · HANDOFF THD-01` et ne prétend pas à une source externe.

Les cinq entrées correspondent à la hiérarchie réellement inspectée du GLB :

| Entrée HUD | Nœuds GLB associés | Description bornée au handoff |
|---|---|---|
| `VEHICLE` | `THD_Vehicle`, cabine, châssis, essieux et roues | Ensemble porteur extérieur visible. |
| `LAUNCHER BASE` | `THD_Launcher_Base` | Plateau extérieur entre véhicule et rack. |
| `LAUNCHER RACK` | `THD_Launcher_Rack` | Cadre extérieur portant les conteneurs. |
| `CANISTER GROUP` | `THD_Canister_Group`, `THD_Canister_01..08` | Huit conteneurs en deux rangées de quatre. |
| `DEMONSTRATION PROJECTILE` | `THD_Rocket_Demo` | Élément illustratif du premier conteneur. |

Aucune caractéristique technique Thundart n’a été ajoutée. Une absence
d’information est rendue par `—` ou `NON DOCUMENTÉ`.

## 3. Relation DOM ↔ 3D

- survol souris et focus clavier : même aperçu temporaire ;
- clic, tap, Entrée ou Espace sur un bouton HTML : épinglage ;
- second déclenchement du même bouton ou Échap : désélection ;
- interaction directe avec un mesh : même résolution de sous-ensemble ;
- sélection active : couleur et émission Panoplie discrètes sur le groupe visé ;
- autres matériaux : couleur atténuée à 62 %, sans transparence ni disparition.

Les matériaux du GLB sont clonés une fois par mesh avant modification. Le cache
`useGLTF`, l’asset source et d’éventuelles autres instances ne sont donc jamais
mutés. Le callout superposé au Canvas ne contient qu’une ligne fine et le nom du
sous-ensemble actif ; le détail éditorial reste dans la couche HTML.

## 4. Accessibilité

Le Canvas n’est jamais l’unique moyen de comprendre ou d’actionner la planche :

- région principale nommée et décrite par un texte serveur ;
- cinq boutons HTML natifs, chacun avec nom accessible, description associée et
  `aria-pressed` pour l’état épinglé ;
- zone de détail `aria-live="polite"` ;
- ordre de lecture et de tabulation naturel, sans `tabIndex` positif ;
- Tab et Shift+Tab parcourent les contrôles ; Entrée et Espace utilisent le
  comportement natif des boutons ; Échap efface la sélection ;
- aucune capture globale de Tab, donc aucun piège clavier ;
- cibles d’au moins 48 px et événements pointeur compatibles souris/tactile ;
- `/hud/thundart` ajouté au smoke test axe WCAG 2.2 AA.

La revue de l’arbre d’accessibilité Chromium confirme un seul landmark `main`,
une hiérarchie `h1 → h2 → h3`, les cinq boutons nommés par leur composant et la
description de sécurité rattachée à la région interactive.

## 5. Mouvement réduit

Le contrat THD-03 est inchangé : **NO STATE CHANGE = NO MOTION**. L’inspection
ne touche ni à l’`AnimationMixer`, ni aux poses, ni à la caméra, ni au
`frameloop="demand"`. Elle ne fait qu’invalider une frame lors d’un changement
visuel de matériau.

Avec `prefers-reduced-motion: reduce` :

- les transitions de séquence restent instantanées comme en THD-03 ;
- les transitions CSS du HUD sont désactivées via les variantes
  `motion-safe:*` ;
- la sélection garde exactement la même information et la même mise en avant ;
- les animations décoratives globales de grain et de points de transmission
  sont figées sur la route Thundart.

## 6. Responsive

À partir de 1024 px, la scène et la séquence occupent la colonne principale ; un
rail technique étroit encadre la 3D à droite. Sous ce seuil, la scène reste en
premier, puis les contrôles et le rail passent dans le flux vertical.

Les largeurs 375, 430, 768, 1024, 1440 et 1920 px sont couvertes en navigateur
réel. Les tests vérifient l’absence de débordement horizontal, la taille des
cibles et l’ordre relatif scène/panneaux. Une revue visuelle complémentaire a
été faite à 375 px et 1440 px, avec un sous-ensemble épinglé.

## 7. Tests et audits

| Commande | Résultat |
|---|---|
| `npm run test` | **PASS** — 11 fichiers, 88 tests |
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS**, sans avertissement |
| `npm run build` | **PASS** — `/hud/thundart` pré-rendu statiquement |
| `npx playwright test --workers=1` | **PASS** — 38 tests |
| axe sur `/hud/thundart` | **PASS** — WCAG 2.2 AA |
| Lighthouse desktop | **100 accessibilité**, **100 SEO**, **100 navigation agentique**, 96 bonnes pratiques |

Les tests unitaires ajoutés couvrent le catalogue, la correspondance exacte des
noms de nœuds, l’équivalence survol/focus, l’épinglage, la priorité de sélection,
Échap et le rejet d’identifiants invalides. Les 10 tests E2E ajoutés couvrent le
DOM autorisé, la souris, le clavier complet, le tactile, l’état sélectionné, le
mouvement réduit et les six largeurs demandées.

Le score Lighthouse « bonnes pratiques » à 96 vient uniquement des deux scripts
Vercel Analytics/Speed Insights retournant 404 dans le serveur local de
production ; aucune erreur applicative ou WebGL n’est remontée.

## 8. Asset

`public/models/hud/thundart.glb` est chargé une seule fois par `useGLTF` et reste
préchargé. Il est **inchangé** : 21 objets maillés, 2 animations, structure et
noms THD-01 conservés. `tools/thundart-3d/` n’a pas été modifié.

## 9. Dette volontaire restante

- Les callouts 3D restent volontairement minimalistes : une ligne et un libellé,
  sans projection complexe ni collision automatique entre annotations.
- Le survol direct du Canvas dépend du mesh visible sous le pointeur ; le rail
  HTML reste la source d’interaction complète et accessible.
- Aucun contenu interne, éclaté, caractéristique réelle ou donnée opérationnelle
  n’est ajouté tant qu’une source qualifiée du repository ne le documente pas.
- Les 404 locaux Vercel Insights sont propres au mode `next start` sans
  infrastructure Vercel et ne sont pas corrigés dans cette mission.
