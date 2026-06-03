# Script de démo Panoplie — 5 minutes (EuroSatory 2026)

> Page de présentation en ligne : **`/eurosatory`** — à ouvrir en premier plan, sert de fil conducteur.
> Ton : analytique, sobre. Message-clé : *« un système d'armes n'est jamais un simple achat ».*

---

## 0:00 — Accroche (30 s)

**Ouvrir `/eurosatory`.**

> « Panoplie n'est pas un catalogue technique. C'est un observatoire open-source qui lit les systèmes de défense comme des objets de **coût, finance, supply chain, géopolitique et export** — sourcés, datés, comparables. »

Pointer les compteurs (dérivés des données, jamais saisis à la main) : *X systèmes, X sources, X affirmations tracées, X vérifiées.*

---

## 0:30 — Home multi-domaines (45 s)

**Cliquer le logo → `/` (ou rester sur `/eurosatory`, section Domaines).**

> « Six domaines à grille de lecture constante : drones, énergie dirigée, aviation, missiles, radars, et le naval — neuf marines documentées. La même méthode partout : cinq briques, six paliers A–E, pas de faux score chiffré. »

---

## 1:15 — Ouvrir un dossier naval (1 min)

**Aller sur `/systemes/fremm-france`** (ou `/systemes/maya-class`).

> « Un dossier Panoplie n'est pas une fiche tonnage. C'est une architecture de mission. »

Faire défiler et nommer :
- **Architecture navale** : plateforme, CMS, capteurs, effecteurs, propulsion, soutien, export.
- **Carte relationnelle** : le navire comme nœud d'un système de systèmes (plateforme → capteurs → CMS/C2 → effecteurs → industriels).
- **Évaluation** : six paliers argumentés.
- **Heatmap de confiance** : *« on affiche où le dossier est solide et où il est fragile — c'est rare, et c'est honnête. »*

---

## 2:15 — Auditer une affirmation (1 min)

**Aller sur `/console`.**

> « Tout ce que Panoplie affirme est traçable. »

- Filtrer **Domaine = Bâtiments navals**, **Confiance = haute** (ou **Sources = primaires**).
- Pointer une ligne : système → affirmation → source (avec fiabilité A–D) → confiance → statut → fraîcheur.
- Cliquer **Export CSV** : *« la veille s'emporte — le jeu filtré complet, pas seulement la page. »*

> « Les compteurs sont dérivés des données. La date d'arrêté du registre est affichée. »

---

## 3:15 — Comparer entre pays (1 min)

**Aller sur `/comparateur`.**

- **Charger un pays** → *Japon* (ou *Corée du Sud*). La sélection se remplit.
- Ou **Charger une famille** → *Destroyer* : confronter Maya / KDX-III Batch II / Arleigh Burke.
- Montrer le tableau : identité, architecture navale, **paliers A–E argumentés**, meilleur emploi / point faible.
- Basculer en **Chaînes système** : comparer les chaînes plateforme→capteurs→CMS→effecteurs→industriels côte à côte.

> « On compare des architectures et des dépendances, pas des noms de programmes. »

---

## 4:15 — La lecture décision (45 s)

> « À quoi ça sert ? À une lecture **non opérationnelle** : industrielle, budgétaire, d'export, d'interopérabilité. »

Exemples de phrases :
- *« Le KDX-III Batch II porte une couche nationale (KVLS-II, frappe balistique) que le Maya n'a pas — lecture export et souveraineté. »*
- *« La Chine est traitée en confiance abaissée et triangulée — la méthode assume l'opacité. »*

**Fermer sur le cadre éthique** (`/eurosatory`, section 06) : pas de ciblage, pas de paramètres tactiques, niveau capacitaire et public uniquement.

---

## Variantes selon l'interlocuteur

| Profil | Insister sur |
|---|---|
| **Industriel / BITD** | Supply chain, dépendances ITAR, cartographie fournisseurs, risque programme (F126). |
| **Institutionnel / étatique** | Méthode, registre de preuves, confiance différenciée, cadre éthique. |
| **Journaliste / analyste** | Console, sources primaires, export CSV/JSON, fraîcheur, heatmap de confiance. |
| **Investisseur** | Couverture (9 marines, 6 domaines), pipeline de données, roadmap. |

## Replis si coupure réseau

- La plateforme est statique (Next.js / Vercel) — garder un onglet préchargé sur `/eurosatory`, `/systemes/fremm-france`, `/comparateur`, `/console`.
- Le one-pager imprimable = `/eurosatory` (impression navigateur → PDF).
