# Drones

Application web du projet **Drones**, construite avec Next.js et prête pour un déploiement sur Vercel.

## Stack

- **Next.js 16** — App Router, React Compiler
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **ESLint 9**

## Prérequis

- **Node.js 20+** (Node 24 utilisé pour le développement)
- **npm**

## Démarrage

```bash
npm install
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

Le code se trouve dans `src/app/` ; la page d'accueil est `src/app/page.tsx`.

## Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Sert le build de production |
| `npm run lint` | Analyse statique ESLint |

## Briefing vidéo (film Remotion)

Un film de démonstration d'environ 75 secondes présente Panoplie en sept
chapitres : ouverture, un dossier sous cinq angles, la preuve par la source,
la comparaison par paliers, les instruments, le cadre d'analyse, l'appel final.

- **Sur le site** : bouton « Voir le briefing » dans le hero de l'accueil
  (modale), page partageable [`/demo`](http://localhost:3000/demo) avec
  transcription, lien direct `/?demo=1` ou `/demo?chapitre=preuve`. Le lecteur
  (`@remotion/player`) n'est téléchargé qu'à l'ouverture.
- **Données** : `src/film/build-film-data.ts` lit le registre (compteurs,
  dossier Rafale, source, paliers, planches, graphe). Aucun chiffre n'est saisi
  dans le film ; il suit le site à chaque commit.
- **Code** : composition dans `src/film/` (`timeline.ts` = découpage unique,
  `scenes/` = un fichier par chapitre), lecteur dans `src/components/film/`.

| Commande | Description |
| --- | --- |
| `npm run film:studio` | Remotion Studio : prévisualiser et ajuster chaque chapitre |
| `npm run film:render` | Export MP4 16:9 (salon, site, LinkedIn) dans `out/` |
| `npm run film:render:portrait` | Export MP4 9:16 (mobile, stories) dans `out/` |

Le rendu CLI télécharge au premier lancement un Chrome headless (Remotion) ;
les fontes sont embarquées (`@fontsource`), aucun autre réseau n'est requis.
Licence : Remotion est gratuit pour un particulier ou une structure de trois
personnes au plus ; au-delà, une licence entreprise est requise
([remotion.dev/license](https://remotion.dev/license)).

## Déploiement

Le projet cible [Vercel](https://vercel.com). Après import du dépôt dans Vercel, chaque push sur `main` déclenche un déploiement de production, et chaque branche ou pull request génère un déploiement de prévisualisation. Aucune configuration spécifique n'est requise : Vercel détecte automatiquement Next.js.
