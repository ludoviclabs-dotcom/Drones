# THD-05 — Production hardening et Preview Vercel

La route `/hud/thundart` est validée comme candidate Preview. THD-05 n’ajoute
aucune fonctionnalité éditoriale majeure : le travail porte sur le chargement,
la stabilité, la couverture E2E, la découvrabilité et la vérification du
déploiement réel.

## 1. Révision et déploiement

| Élément | Valeur |
|---|---|
| Branche | `claude/thundart-cinematic-hud` |
| Commit technique vérifié | `dc4abd066c703ae2774b8d5c2912c9b8bc54b8cd` |
| Message | `perf(thundart): harden preview loading` |
| Déploiement Vercel | `dpl_HbhVnm1ucuqEh21Q2v7CM8zK2DqX` |
| État Vercel | **READY** |
| Preview immuable vérifiée | `https://drones-askst3zj4-ludovics-projects-159c139c.vercel.app` |
| Alias de branche | `https://drones-git-claude-thundart-ci-e75511-ludovics-projects-159c139c.vercel.app` |
| Route vérifiée | `/hud/thundart` |

La Preview est protégée par Vercel Authentication. Les contrôles automatisés
ont utilisé un jeton de bypass temporaire généré par le CLI du projet. Le cookie
a été supprimé immédiatement après validation et n’est présent ni dans le
repository, ni dans ce document.

## 2. Résultats locaux

| Commande | Résultat |
|---|---|
| `npm run test` | **PASS** — 11 fichiers, 88 tests |
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS**, sans avertissement |
| `npm run build` | **PASS** — `/hud/thundart` pré-rendu statiquement |
| `npm run test:e2e` | **PASS** — 48 tests, 2 workers, 2,6 min |

Les 10 tests Playwright THD-05 ajoutés couvrent : HTTP 200, HTML serveur,
canonical, sitemap, titre, état de démonstration, chargement GLB, NEXT,
PREVIOUS, RESET depuis `departure`, double clic rapide, navigation depuis le
site, retour, reload, resize, tactile réel, tabulation complète, sélection,
Échap, reduced-motion, absence d’animation infinie et absence d’erreur console
sérieuse.

axe est exécuté sur la page finale aux largeurs 375, 768, 1024, 1440 et
1920 px, avec les tags WCAG 2.0/2.1/2.2 AA du setup existant. Les violations
`serious` et `critical`, contraste compris, sont un gate dur : **aucune**.

## 3. Audit navigateur local

| Mesure | Desktop | Mobile |
|---|---:|---:|
| Lighthouse accessibilité | 100 | 100 |
| Lighthouse SEO | 100 | 100 |
| Lighthouse navigation agentique | 100 | 100 |
| Lighthouse bonnes pratiques | 96 | 96 |

Le seul audit Lighthouse local en échec est `errors-in-console` : sous
`next start`, les routes `/_vercel/insights/script.js` et
`/_vercel/speed-insights/script.js` n’existent pas et renvoient 404. Sur la
Preview Vercel, ces erreurs disparaissent : **zéro erreur console** sur les
parcours desktop et mobile.

Trace Chrome locale, sans throttling :

| Mesure | Valeur |
|---|---:|
| LCP | 236 ms |
| Élément LCP | texte serveur `#thundart-view-description` |
| TTFB | 11 ms |
| CLS | 0,00 |
| `DOMContentLoaded` | 47 ms |
| `load` | 138 ms |
| Début du chunk 3D différé | ~255 ms |
| Début de la requête GLB | ~432 ms |

Ces valeurs sont des mesures de laboratoire localhost, utiles pour comparer le
découpage, pas des données terrain CrUX.

## 4. Asset et coût 3D

Inspection directe du chunk JSON du GLB :

| Métrique | Valeur |
|---|---:|
| Taille GLB | **73 036 octets** — 71,32 Kio |
| Nœuds glTF | 24 |
| Nœuds maillés | 21 |
| Data-blocks mesh | 8 |
| Primitives uniques | 17 |
| Draw calls instanciés de l’asset | **43** |
| Matériaux | 6 |
| Textures / images | **0 / 0** |
| Buffers externes | 0 |
| Extensions glTF | 0 |
| Animations | 2 |

Le passage couleur représente environ 45 draw calls au repos logique
(43 asset + sol + grille), 46 pendant le flash. Lorsqu’une frame avec ombres est
rendue, la passe shadow peut ajouter environ 43 appels, soit un maximum
approximatif de 88 à 89 appels par frame active. Ce coût n’est pas permanent :
le Canvas utilise `frameloop="demand"` et ne demande plus de frame quand la
transition est terminée.

## 5. JavaScript et chargement initial

Avant THD-05, Three/R3F partageait l’entrée client immédiate de la route :
environ **1 007 543 octets bruts** spécifiques à Thundart. La scène est
maintenant importée dynamiquement depuis la frontière client, avec `ssr: false`,
comme prévu par la documentation locale Next.js 16.

| Bloc final | Brut | gzip niveau 9 |
|---|---:|---:|
| Entrée initiale spécifique à la route | **17 935 o** | **6 448 o** |
| Scène 3D différée | 994 629 o | 265 091 o |

La réduction de JavaScript spécifique sur le chemin initial est d’environ
**98,2 %** en brut. Le runtime partagé Next.js n’est pas inclus dans ces chiffres.

Le titre, la description, le HUD, les contrôles HTML et le fallback
« Préparation différée de la vue 3D locale » restent présents dans le HTML
pré-rendu. Le chunk Three/R3F puis le GLB se chargent après hydratation ; le
Canvas ne bloque donc pas le contenu essentiel.

## 6. Preview réellement vérifiée

Vérification Playwright contre le déploiement immuable, et non localhost :

- document `/hud/thundart` : HTTP 200, titre applicatif présent ;
- asset `/models/hud/thundart.glb` : HTTP 200, corps exact de 73 036 octets ;
- desktop 1440 × 900 : Canvas prêt, NEXT atteint `inspect`, retour au repos,
  sélection et Échap fonctionnels, navigation accueil puis retour fonctionnelle ;
- mobile tactile 375 × 812 : Canvas prêt, tap fonctionnel, aucun overflow ;
- reduced-motion mobile : état final immédiat, `data-thundart-motion="idle"` ;
- aucune animation CSS infinie ;
- aucune erreur console ni `pageerror` ;
- scripts Vercel Analytics chargés sans les 404 observés localement.

## 7. Bugs trouvés et corrigés

1. **Three/R3F dans le chemin initial.** Le chunk de 980 Kio bruts était une
   dépendance immédiate du composant client. La scène seule est désormais
   différée ; le DOM accessible reste pré-rendu.
2. **Mode d’ombre déprécié.** Le raccourci R3F `shadows` sélectionnait
   `PCFSoftShadowMap`, déprécié avec Three 0.184. `shadows="percentage"` choisit
   explicitement `PCFShadowMap` et supprime l’avertissement.
3. **Course dans les mesures responsive.** Après le découpage, trois anciens
   tests pouvaient mesurer un nœud au moment exact où le fallback était remplacé
   par le Canvas. Ils attendent maintenant `data-thundart-asset="ready"` avant
   la lecture géométrique, sans perdre de couverture.
4. **Route peu découvrable.** `/hud/thundart` est ajouté au pied de page et au
   sitemap, selon les conventions existantes. Le canonical était déjà correct.

## 8. Limitations restantes

- La Preview requiert une authentification Vercel ou un bypass autorisé ; ce
  comportement relève de la protection du projet, pas de la route.
- R3F utilise encore `THREE.Clock`, déprécié par Three 0.184. L’avertissement
  vient de la dépendance `@react-three/fiber`, sans erreur ni impact observé ;
  une mise à niveau coordonnée des dépendances 3D est préférable à un patch local.
- Chromium headless peut émettre un avertissement pilote `GPU stall due to
  ReadPixels` pendant les contrôles WebGL. Il n’apparaît pas en mobile et ne
  correspond ni à une erreur applicative ni à une boucle GPU permanente.
- Les ~265 Kio gzip de runtime 3D différé restent nécessaires pour afficher la
  scène. Une réduction supplémentaire supposerait un changement de moteur ou de
  périmètre, explicitement hors THD-05.

## 9. Verdict

- **LOCAL TESTS: PASS**
- **E2E: PASS**
- **VERCEL BUILD: READY**
- **PR READY: YES**
