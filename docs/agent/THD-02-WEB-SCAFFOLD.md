# THD-02 — Web experience scaffold

Premier prototype Web fonctionnel de la planche Thundart, disponible sur
`/hud/thundart`. Cette étape installe les frontières Server/Client, le chargement
R3F et la machine d’état ; elle ne joue aucune animation du GLB.

## Architecture

- `src/app/hud/thundart/page.tsx` reste un Server Component. Il fournit le titre,
  la description, l’état démonstratif, le cadre éditorial et le fallback sans
  JavaScript dans le HTML serveur.
- `src/components/hud/thundart/ThundartExperience.tsx` est la frontière client
  qui possède la machine d’état.
- `ThundartScene3D.tsx` monte le Canvas uniquement après hydratation, précharge
  l’asset avec `useGLTF.preload`, pose la caméra, les lumières, la grille, le
  `Suspense` et la gestion d’erreur.
- `ThundartModel.tsx` charge puis clone la scène GLB sans lancer ses clips.
- `ThundartControls.tsx` rend l’état courant dans le DOM et expose Précédent,
  Réinitialiser et Suivant.
- `src/data/hud/thundart.ts` centralise le chemin d’asset, le manifeste connu,
  l’ordre des états et le reducer pur.

La page reprend la palette et les conventions typographiques Panoplie. Le fond
à marqueurs de `PanoplieXrayBackdrop` n’est pas réutilisé : THD-02 interdit les
particules. La scène conserve seulement une grille industrielle statique et un
éclairage sobre.

## Asset chargé et vérifié

Chemin unique : `public/models/hud/thundart.glb`, servi sous
`/models/hud/thundart.glb`.

Inspection directe du JSON glTF du binaire :

- 24 nœuds, dont 21 nœuds maillés ; racine `THD_Root` ;
- `THD_Launcher_Rack` est le nœud 9 et porte les 8 conteneurs ainsi que
  `THD_Rocket_Demo` ;
- `THD_CONFIGURE_DEMO` cible `THD_Launcher_Rack` ;
- `THD_DEPARTURE_DEMO` cible `THD_Rocket_Demo` ;
- six matériaux PBR, aucun fichier ou décodeur externe.

Les clips sont présents mais restent volontairement inactifs. Aucune rotation
automatique, flottement, fumée, particule ou lecture automatique n’est créée.

## Machine d’état

Ordre déterministe :

1. `overview`
2. `inspect`
3. `configure`
4. `departure`
5. `complete`

`NEXT` et `PREVIOUS` sont bornés aux extrémités. `RESET` revient à `overview`.
Le reducer valide aussi son entrée à l’exécution : une valeur inconnue revient à
l’état initial. L’état courant est exposé via `data-sequence-state`,
`data-thundart-state` et un libellé `aria-live`.

Les contrôles orbitaux sont actifs seulement dans `overview` et `inspect`, avec
panoramique désactivé, distances bornées et angle vertical limité.

## Tests et validations

`tests/unit/thundart-sequence.test.ts` couvre :

- l’ordre exact ;
- NEXT ;
- PREVIOUS ;
- RESET ;
- les bornes ;
- le rejet d’un état invalide.

Commandes de validation de la mission :

```text
npm run test
npm run typecheck
npm run lint
npm run build
```

Résultats THD-02 :

- `npm run test` : PASS — 9 fichiers, 53 tests ;
- `npm run typecheck` : PASS ;
- `npm run lint` : PASS, sans avertissement ;
- `npm run build` : PASS — `/hud/thundart` pré-rendu statiquement ;
- contrôle navigateur : aucun débordement horizontal à 375, 768, 1024 et
  1440 px ; cadrage complet du modèle à 375 px ;
- contrôle des boutons :
  `overview → inspect → configure → inspect → overview` pour
  NEXT, NEXT, PREVIOUS, RESET.

## Dette volontaire pour THD-03

- associer les états aux deux clips existants avec une orchestration explicite ;
- définir les transitions de caméra et leur comportement en mouvement réduit ;
- figer proprement la dernière frame de chaque clip ;
- ajouter les annotations extérieures réellement utiles ;
- effectuer le polish visuel final et les tests d’interaction navigateur dédiés.

THD-03 devra préserver le cadre illustratif : aucune donnée connectée, aucun
ciblage, aucune modélisation physique et aucun calcul opérationnel.
