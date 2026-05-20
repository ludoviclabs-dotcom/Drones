import type { GlossaryTerm } from "./types";

export const glossary: GlossaryTerm[] = [
  {
    slug: "male",
    term: "Drone MALE",
    acronym: "MALE",
    category: "technique",
    definition:
      "Moyenne Altitude, Longue Endurance. Drone capable de voler plus de 24 h à altitude moyenne, conçu pour la surveillance persistante et, souvent, la frappe.",
  },
  {
    slug: "munition-rodeuse",
    term: "Munition rôdeuse",
    category: "technique",
    definition:
      "Aéronef-arme qui patrouille une zone avant de fondre sur sa cible et de la détruire en s'y écrasant. À mi-chemin entre le drone et le missile ; on parle aussi de drone « kamikaze ».",
  },
  {
    slug: "isr",
    term: "ISR",
    acronym: "ISR",
    category: "doctrine",
    definition:
      "Renseignement, Surveillance, Reconnaissance. Ensemble des missions de collecte d'information — la fonction première de la plupart des drones militaires.",
  },
  {
    slug: "los",
    term: "Liaison en vue directe",
    acronym: "LOS",
    category: "technique",
    definition:
      "Line-of-Sight. Liaison radio directe entre le drone et sa station sol, limitée par l'horizon (souvent 150–250 km). Sans relais ni satellite, elle borne le rayon d'action.",
  },
  {
    slug: "satcom",
    term: "Liaison satellite",
    acronym: "SATCOM",
    category: "technique",
    definition:
      "Liaison de données passant par un satellite, qui affranchit le drone de l'horizon radio et autorise un emploi à très longue distance — au prix d'une dépendance spatiale et d'une vulnérabilité au brouillage.",
  },
  {
    slug: "fms",
    term: "Foreign Military Sales",
    acronym: "FMS",
    category: "commerce",
    definition:
      "Vente d'État à État : le gouvernement américain achète le matériel à l'industrie puis le revend au partenaire étranger, dont il encadre l'emploi. Canal sécurisant mais soumis aux arbitrages de Washington.",
  },
  {
    slug: "dcs",
    term: "Direct Commercial Sales",
    acronym: "DCS",
    category: "commerce",
    definition:
      "Vente commerciale directe : l'industriel contracte directement avec le client étranger, sous licence d'exportation de son État. Plus souple que le FMS, avec une garantie étatique moindre.",
  },
  {
    slug: "offset",
    term: "Offset",
    category: "commerce",
    definition:
      "Compensation industrielle. Contrepartie exigée par l'acheteur — production locale, transfert de technologie, investissements — en échange d'un contrat d'armement.",
  },
  {
    slug: "production-sous-licence",
    term: "Production sous licence",
    category: "commerce",
    definition:
      "Fabrication d'un système par un autre pays que son concepteur, en vertu d'un accord de licence ou d'un transfert de savoir-faire — troisième mode d'acquisition à côté de l'achat FMS et DCS.",
  },
  {
    slug: "certificat-utilisateur-final",
    term: "Certificat d'utilisateur final",
    category: "juridique",
    definition:
      "Document par lequel l'acheteur s'engage sur l'usage et la non-réexportation d'un matériel. Pierre angulaire du contrôle des transferts — et point faible récurrent en cas de détournement.",
  },
  {
    slug: "itar",
    term: "ITAR",
    acronym: "ITAR",
    category: "juridique",
    definition:
      "International Traffic in Arms Regulations. Réglementation américaine sur le commerce des matériels de défense ; elle « contamine » tout produit contenant un composant US, soumis dès lors à autorisation américaine.",
  },
  {
    slug: "mtcr",
    term: "MTCR",
    acronym: "MTCR",
    category: "juridique",
    definition:
      "Régime de contrôle de la technologie des missiles. Arrangement multilatéral limitant l'exportation des missiles et drones lourds ; sa catégorie I vaut présomption de refus.",
  },
  {
    slug: "attrition",
    term: "Guerre d'attrition",
    category: "doctrine",
    definition:
      "Logique d'usure visant à épuiser les ressources de l'adversaire. Les munitions rôdeuses bon marché en sont un instrument : elles forcent l'ennemi à dépenser des intercepteurs coûteux.",
  },
  {
    slug: "ratio-echange-cout",
    term: "Ratio d'échange de coût",
    category: "doctrine",
    definition:
      "Rapport entre le coût d'une arme et celui de ce qu'elle détruit — ou de ce qu'il faut dépenser pour l'arrêter. Un drone à 30 000 $ intercepté par un missile à 2 M$ illustre un ratio défavorable pour le défenseur.",
  },
  {
    slug: "charge-utile",
    term: "Charge utile",
    category: "technique",
    definition:
      "Masse emportée hors carburant et structure : capteurs, armement, équipements. Elle conditionne l'arbitrage permanent entre endurance, portée et puissance.",
  },
  {
    slug: "saturation",
    term: "Attaque en saturation",
    category: "doctrine",
    definition:
      "Frappe simultanée par un grand nombre de vecteurs visant à dépasser la capacité de traitement des défenses adverses. Tactique centrale de l'emploi massif des drones bon marché.",
  },
];

export const GLOSSARY_BY_SLUG: Record<string, GlossaryTerm> = Object.fromEntries(
  glossary.map((t) => [t.slug, t]),
);
