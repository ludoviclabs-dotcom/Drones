# Registre « Souveraineté industrielle »

Source de vérité de la mise à jour de PANOPLIE du 17/11/2026. Les sept fichiers
`panoplie_*` sont copiés **tels quels** depuis le dossier Dropbox `PANOPLIE`
(octet pour octet : BOM UTF-8 et fins de ligne CRLF conservés ; `.gitattributes`
empêche toute conversion par Git). Ne jamais les éditer à la main.

| Fichier | Contenu |
| --- | --- |
| `panoplie_registre.json` | Table principale : 398 entités (`entites_et_programmes`) et 2 051 métriques (`registre_metriques_et_audit`) avec statut du chiffre, alerte d'audit, traçabilité, contrôle interne et vérification externe. |
| `panoplie_metriques.csv`, `panoplie_entites.csv`, `panoplie_jalons.csv` | Vues à plat. Séparateur des colonnes multi-valeurs : « \| ». |
| `panoplie_verifications.csv` | 154 chiffres vérifiés à l'extérieur (verdict, valeur trouvée, URL source). |
| `panoplie_calculs.csv` | 112 formules recalculées. |
| `panoplie_ecarts_site.csv` | 23 écarts relevés sur le site en production. |
| `SHA256SUMS` | Empreintes de contrôle, vérifiées par `tests/data/registre-integrite.test.ts`. |

Règles du registre : aucune valeur fusionnée (une occurrence chiffrée = une
ligne), aucune conversion de devise, variance inter-fichiers calculée sur
`cle_fait`, valeur × multiplicateur et unité.

Ces fichiers ne sont lus que par les tests (`tests/support/registre.ts`) : ils
n'entrent dans aucun bundle du site.
