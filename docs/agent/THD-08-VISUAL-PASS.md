# THD-08 — Correctif visuel ciblé

## Correctif d'orientation ultérieur

La validation visuelle a révélé que le rack élevé et le projectile de
démonstration partaient à l'opposé de la cabine. L'asset place la cabine sur
`-Z`, tandis que le clip de séparation progresse vers `+Z`.

La correction ne retourne et ne reparente aucun objet : la pose OVERVIEW et la
hiérarchie du GLB restent strictement intactes. Après évaluation des clips, R3F
réfléchit seulement leurs deltas cinématiques : la charnière arrière du rack
reste fixe pendant que son extrémité côté cabine s'élève, puis le projectile se
sépare vers `-Z`. Le GLB reste inchangé (73 036 octets) et le frameloop reste à
la demande.

## Finition de surface ciblée

Quatre plans de détail R3F, sans raycast, complètent les zones signalées sans
modifier la géométrie : marquages typographiques sobres sur le projectile et le
conteneur extérieur 08, panneau de porte et grille frontale sur la cabine. Les
textures sont générées localement par Canvas 2D, sans téléchargement runtime.
Chaque marquage reste enfant de sa pièce et suit donc les poses existantes.

## 1. Référence de travail

| Élément | Valeur |
|---|---|
| SHA de départ | `58b974463d49a304f8618bb15f95b540c5e7017a` |
| Branche | `codex/thundart-visual-pass` |
| GLB | `public/models/hud/thundart.glb` |
| GLB, taille / MD5 | 73 036 o / `311ea46394b9a59d3e73b03b3b9094a5` |

Le GLB n’a pas été modifié. Les correctifs restent dans le DOM, R3F, les poses
caméra et les tests existants.

## 2. Constats THD-07 traités

### P1 — Co-visibilité sous 1024 px

La solution retenue est **B : un panneau d’inspection compact dans le flux,
sous la scène**, complétée d’un recentrage de la planche à son ancre lors d’une
sélection au clic, tap, Entrée ou Espace sous 1024 px.

- aucun canvas flottant ni recouvrement du rail ;
- la scène et le bouton actif restent simultanément dans le viewport ;
- le flux DOM, l’ordre de tabulation, Échap et les cibles tactiles restent
  natifs ;
- `scroll-margin-top` repose sur `--site-header-offset`, la même valeur que le
  header ; il n’y a pas de hauteur dupliquée arbitrairement.

Les preuves Playwright vérifient désormais que la totalité de la scène se situe
sous le header et dans le viewport à 375 × 812 et 768 × 1024.

### P1 — Projectile de démonstration

Une inspection du projectile active simultanément :

- un callout explicite `DEMONSTRATION PROJECTILE · TUBE 01` ;
- un accent matière sur `THD_Canister_01`, son conteneur porteur ;
- un cadre filaire local, non cliquable, rendu seulement pendant cet état.

Le projectile reste dans le premier conteneur. Aucun clip n’est lancé et aucune
géométrie du GLB n’est déplacée. Le même état est partagé par survol, focus,
clic, tap, Entrée et Espace ; Échap rétablit l’état normal.

### P2 — Lumière, matériau et caméra COMPLETE

L’éclairage est désormais local et fixe : ambient + hemisphere, key
directionnelle, fill chaud et rim froid discret. Il augmente la lecture du rack,
des canisters, de la cabine et du projectile sans HDR distant, asset
supplémentaire, Environment runtime ni boucle de rendu.

`complete` utilise la pose `[17.8, 9.8, 16.8]` vers `[-0.25, 4.1, 1.6]` : une
vue trois-quarts où véhicule, rack relevé et projectile séparé sont visibles
ensemble. Sa distance passe d’environ **27,9** dans THD-07 à **24,28** ; elle
est distincte de DEPARTURE (**25,11**) et ne recule plus par défaut.

### P2/P3 — Header, typographie et libellés publics

- `--site-header-content-height` et `--site-header-offset` centralisent
  l’offset du header et des ancres ;
- les micro-libellés interactifs sont à 10 px, les métadonnées utiles à
  9–10 px ; le callout purement décoratif reste compact ;
- les libellés publics ne contiennent plus `THD-01`, `THD-05` ni
  `HANDOFF THD-*` : la source est « Documentation publique · représentation
  illustrative ».

### P2 — OrbitControls

La détection native d’un drag de 6 px est attachée au canvas. Dès qu’un drag
orbital commence, elle efface un aperçu transitoire et bloque les événements de
survol/clic parasites. Une sélection épinglée n’est pas effacée.

## 3. Éléments volontairement non traités

- aucun changement Blender, GLB, clip, physique, balistique ou ciblage ;
- aucune animation idle, RAF nouvelle ou rotation automatique ;
- pas d’Environment/HDR : l’équivalent local fixe conserve
  `frameloop="demand"` et évite un rendu de sonde additionnel ;
- les systèmes validés (CONFIGURE, DEPARTURE, reset, previous/next,
  reduced-motion, verrouillage orbit en configure) ne sont pas réécrits.

## 4. Mesures avant / après

| Point | Avant THD-07 | Après THD-08 |
|---|---|---|
| Sélection 375 / 768 | scène hors viewport | scène entière sous le header et composant actif visible (E2E) |
| Projectile | inspectable HTML, zone ambiguë | callout Tube 01 + accent du porteur + cadre local |
| COMPLETE | distance ≈ 27,9 ; occupation signalée ≈ 5 % | distance 24,28 ; cadrage final distinct, sujet plus présent dans les captures |
| Métal | `metalness≈0,85`, sombre sans environnement | key/fill/rim fixes, sans téléchargement ni animation |
| Header | recouvrement possible après ancre | offset CSS unique, ancre E2E sous le header |
| Typographie | ~43 éléments ≤ 9 px, jusqu’à 7 px | interactif 10 px, métadonnées utiles 9–10 px |
| GLB | 73 036 o | 73 036 o, MD5 identique |
| Draw calls au repos | ≈45 (THD-05) | ≈49 avec les quatre détails de surface ; le cadre projectile ajoute au plus un appel lorsqu’il est actif |
| JavaScript | runtime 3D différé : 994 629 o brut / 265 091 o gzip | aucun package ajouté ; détails générés localement par Canvas 2D |
| Repos | `frameloop="demand"` | inchangé ; aucune animation CSS infinie (E2E) |

Les compteurs CPU/GPU matériels ne sont pas disponibles dans Chromium headless.
La conservation du frameloop à la demande, l’absence de RAF/animation ajoutée
et le test de repos constituent la vérification reproductible du coût idle.

## 5. Captures réelles

Les 22 captures sont conservées hors du dépôt pour ne pas alourdir la branche,
dans l’artefact local `thd-08/` :

- 375 × 812, 768 × 1024, 1440 × 900 et 1920 × 1080 ;
- OVERVIEW, INSPECT, CONFIGURE, DEPARTURE et COMPLETE pour chaque taille ;
- `375x812-launcher-rack-selected.png` ;
- `768x1024-projectile-selected.png`.

`1920x1080-complete.png` confirme la vue de fin : rack relevé, véhicule et
projectile séparé restent lisibles dans le même cadre. Les captures 375 et 768
de sélection confirment la co-visibilité corrigée.

## 6. Tests exécutés

| Commande | Résultat |
|---|---|
| `npm run test` | 96 tests, 12 fichiers — PASS |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS (Next.js 16.2.6 / Turbopack) |
| `npm run test:e2e` | 54 tests — PASS |

Les ajouts couvrent notamment le visual mode projectile, le drag OrbitControls,
la borne et la distinction COMPLETE, le recentrage mobile, l’ancre sticky, le
reduced-motion et axe WCAG 2.2 AA sans violation serious/critical.

## 7. Limites restantes

- Le projectile reste volontairement contenu dans le premier tube en OVERVIEW ;
  l’inspection l’identifie, elle ne simule pas un lancement.
- La mesure d’occupation après correction est une validation visuelle par
  capture, non une segmentation d’image automatisée.
- La Preview Vercel corrective `dpl_8o3uhpQzUToNt2TzCqnWwKeactRz` est READY et la CLI
  authentifiée a récupéré le HTML réel de `/hud/thundart`. Le navigateur intégré
  est redirigé vers l’authentification Vercel, donc la vérification interactive
  distante ne contourne pas cette protection ; les quatre viewports et le
  reduced-motion restent couverts sur le build local identique par 54 E2E.
- Aucune PR n’est créée dans cette mission.
