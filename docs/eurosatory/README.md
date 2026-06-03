# Assets EuroSatory 2026

Pièces de présentation Panoplie pour le salon (15–19 juin 2026).

| Fichier | Usage |
|---|---|
| `panoplie-eurosatory.pptx` | Deck 8 slides (thème sombre éditorial). À ouvrir dans PowerPoint / Keynote / Google Slides. |
| `build-deck.js` | Script de génération du deck (pptxgenjs) — pour régénérer ou éditer. |
| `demo-script.md` | Script de démo minuté (5 min) avec clics, talking points et variantes. |

La page **`/eurosatory`** du site sert de one-pager partageable et de landing de démo
(imprimable en PDF via le navigateur).

## Régénérer le deck

```bash
npm install pptxgenjs        # dans un dossier de travail quelconque
node build-deck.js           # écrit panoplie-eurosatory.pptx (chemin absolu en tête du script)
```

Les 8 slides : 1) couverture · 2) le problème · 3) la réponse · 4) la méthode ·
5) la preuve (Console) · 6) les domaines · 7) la démonstration (comparateur) ·
8) pipeline, feuille de route & contact.
