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

## Déploiement

Le projet cible [Vercel](https://vercel.com). Après import du dépôt dans Vercel, chaque push sur `main` déclenche un déploiement de production, et chaque branche ou pull request génère un déploiement de prévisualisation. Aucune configuration spécifique n'est requise : Vercel détecte automatiquement Next.js.
