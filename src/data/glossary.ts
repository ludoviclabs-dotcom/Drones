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
    slug: "ucav",
    term: "Drone de combat",
    acronym: "UCAV",
    category: "technique",
    definition:
      "Unmanned Combat Aerial Vehicle. Drone conçu pour la mission de combat — frappe ou pénétration en zone défendue — par opposition aux drones de pure surveillance. Souvent furtif, avec armement en soute interne.",
  },
  {
    slug: "hale",
    term: "Drone HALE",
    acronym: "HALE",
    category: "technique",
    definition:
      "Haute Altitude, Longue Endurance. Drone volant au-delà de 15 000 m pendant plus de 24 h, dédié à la surveillance stratégique de vastes zones — plus grand, plus endurant et plus coûteux qu'un MALE.",
  },
  {
    slug: "usv",
    term: "Drone de surface",
    acronym: "USV",
    category: "technique",
    definition:
      "Unmanned Surface Vehicle. Engin naval sans équipage évoluant à la surface de l'eau. Employé pour la reconnaissance ou, sous forme de USV explosif, la frappe contre des navires et des infrastructures.",
  },
  {
    slug: "ravitaillement-en-vol",
    term: "Ravitaillement en vol",
    category: "technique",
    definition:
      "Transfert de carburant d'un avion-citerne vers un aéronef en vol, qui étend son rayon d'action et son endurance. Sa version embarquée et autonome — assurée par un drone depuis un porte-avions — est une capacité émergente.",
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
    slug: "sead",
    term: "Suppression des défenses aériennes",
    acronym: "SEAD",
    category: "doctrine",
    definition:
      "Suppression of Enemy Air Defenses. Ensemble des actions visant à neutraliser radars et systèmes sol-air adverses pour ouvrir un couloir à l'aviation. Mission de prédilection des munitions rôdeuses anti-radar comme le Harop.",
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
  {
    slug: "dew",
    term: "Arme à énergie dirigée",
    acronym: "DEW",
    category: "technique",
    definition:
      "Directed Energy Weapon. Système qui agit par un faisceau — laser ou micro-ondes — plutôt que par un projectile.",
  },
  {
    slug: "hel",
    term: "Laser haute énergie",
    acronym: "HEL",
    category: "technique",
    definition:
      "High Energy Laser. Laser concentrant assez de puissance pour produire un effet thermique ou destructeur sur sa cible.",
  },
  {
    slug: "hpm",
    term: "Micro-ondes haute puissance",
    acronym: "HPM",
    category: "technique",
    definition:
      "High Power Microwave. Arme à énergie dirigée distincte du laser, agissant sur l'électronique de la cible plutôt que par effet thermique localisé.",
  },
  {
    slug: "c-uas",
    term: "Lutte anti-drone",
    acronym: "C-UAS",
    category: "doctrine",
    definition:
      "Counter-UAS. Ensemble des moyens de détection, d'identification et de neutralisation des drones, notamment les petits drones.",
  },
  {
    slug: "c-ram",
    term: "Lutte anti-roquettes et mortiers",
    acronym: "C-RAM",
    category: "doctrine",
    definition:
      "Counter-Rocket, Artillery and Mortar. Défense contre les roquettes, les obus d'artillerie et les obus de mortier.",
  },
  {
    slug: "shorad",
    term: "Défense aérienne courte portée",
    acronym: "SHORAD",
    category: "doctrine",
    definition:
      "Short-Range Air Defense. Couche de défense antiaérienne traitant les menaces à courte portée — drones, hélicoptères, munitions.",
  },
  {
    slug: "vshorad",
    term: "Défense aérienne très courte portée",
    acronym: "VSHORAD",
    category: "doctrine",
    definition:
      "Very Short-Range Air Defense. La frange la plus rapprochée de la défense antiaérienne, en deçà du SHORAD.",
  },
  {
    slug: "dwell-time",
    term: "Dwell time",
    category: "technique",
    definition:
      "Temps pendant lequel le faisceau d'un laser doit rester sur la cible pour la neutraliser — il croît avec la distance et la robustesse de la cible.",
  },
  {
    slug: "beam-director",
    term: "Beam director",
    category: "technique",
    definition:
      "Ensemble optomécanique qui oriente et stabilise le faisceau laser vers la cible, et le maintient pendant toute la durée du tir.",
  },
  {
    slug: "thermal-blooming",
    term: "Thermal blooming",
    category: "technique",
    definition:
      "Dégradation du faisceau laser causée par l'échauffement de l'air qu'il traverse — un effet qui s'aggrave avec la puissance émise.",
  },
  {
    slug: "swap-c",
    term: "SWaP-C",
    acronym: "SWaP-C",
    category: "technique",
    definition:
      "Size, Weight, Power and Cooling — masse, volume, puissance et refroidissement : les contraintes d'intégration d'un système, déterminantes pour un laser.",
  },
  {
    slug: "magazine-profond",
    term: "Magazine profond",
    category: "doctrine",
    definition:
      "Capacité à enchaîner les tirs tant que l'énergie et le refroidissement le permettent — un atout propre aux effecteurs laser face aux munitions en nombre limité.",
  },
  {
    slug: "cout-marginal-tir",
    term: "Coût marginal par tir",
    category: "commerce",
    definition:
      "Coût immédiat d'un engagement — pour un laser, quelques unités d'énergie. À distinguer du coût complet de possession du système.",
  },
  {
    slug: "protocole-iv",
    term: "Protocole IV",
    category: "juridique",
    definition:
      "Protocole de la Convention sur certaines armes classiques interdisant les armes laser spécifiquement conçues pour provoquer une cécité permanente.",
  },
  {
    slug: "aesa",
    term: "Radar AESA",
    acronym: "AESA",
    category: "technique",
    definition:
      "Active Electronically Scanned Array. Radar dont le faisceau est orienté électroniquement par des centaines de modules émetteurs-récepteurs, sans pièce mobile — plus rapide, plus discret et plus résistant au brouillage qu'un radar à antenne mécanique.",
  },
  {
    slug: "irst",
    term: "IRST",
    acronym: "IRST",
    category: "technique",
    definition:
      "Infrared Search and Track. Capteur passif qui détecte et piste un aéronef à sa signature thermique, sans émettre d'onde radar — il permet de suivre une cible sans être soi-même repéré.",
  },
  {
    slug: "fusion-de-capteurs",
    term: "Fusion de capteurs",
    category: "technique",
    definition:
      "Agrégation en temps réel des données de tous les capteurs de l'appareil — radar, IRST, guerre électronique, liaisons — en une image tactique unique. Trait distinctif des chasseurs de 5e génération.",
  },
  {
    slug: "datalink",
    term: "Datalink",
    category: "technique",
    definition:
      "Liaison de données tactique reliant aéronefs, navires et centres de commandement. Elle autorise le partage de la situation tactique et l'engagement coopératif — un appareil tirant sur une cible désignée par un autre.",
  },
  {
    slug: "rcs",
    term: "Surface équivalente radar",
    acronym: "RCS",
    category: "technique",
    definition:
      "Radar Cross Section. Mesure de la détectabilité d'un aéronef au radar — plus elle est faible, plus l'appareil est repéré tard. La furtivité vise à la réduire de plusieurs ordres de grandeur.",
  },
  {
    slug: "vlo",
    term: "Très faible observabilité",
    acronym: "VLO",
    category: "technique",
    definition:
      "Very Low Observable. Niveau de furtivité le plus poussé : une cellule conçue pour minimiser à la fois ses signatures radar, infrarouge et visuelle. Capacité revendiquée des chasseurs de 5e génération.",
  },
  {
    slug: "supercroisiere",
    term: "Supercroisière",
    category: "technique",
    definition:
      "Capacité à voler en régime supersonique de façon prolongée sans recourir à la postcombustion — donc sans la surconsommation de carburant et la signature thermique que celle-ci entraîne.",
  },
  {
    slug: "omnirole",
    term: "Omnirôle",
    category: "doctrine",
    definition:
      "Doctrine d'un chasseur conçu pour assurer l'ensemble des missions — supériorité aérienne, frappe, reconnaissance, dissuasion — sur un même appareil. Terme revendiqué par Dassault pour le Rafale.",
  },
  {
    slug: "swing-role",
    term: "Swing-role",
    category: "doctrine",
    definition:
      "Capacité d'un chasseur à basculer d'une mission à une autre — air-air, air-sol — au cours d'un même vol, sans reconfiguration au sol.",
  },
  {
    slug: "catobar",
    term: "CATOBAR",
    acronym: "CATOBAR",
    category: "technique",
    definition:
      "Catapult Assisted Take-Off But Arrested Recovery. Mise en œuvre embarquée où l'avion est lancé par catapulte et récupéré au brin d'arrêt — elle autorise des appareils plus lourds que le décollage court.",
  },
  {
    slug: "stovl",
    term: "STOVL",
    acronym: "STOVL",
    category: "technique",
    definition:
      "Short Take-Off and Vertical Landing. Décollage court et atterrissage vertical — capacité du F-35B, qui ouvre l'emploi depuis des porte-aéronefs sans catapulte ou des terrains sommaires.",
  },
  {
    slug: "block-standard",
    term: "Block / standard",
    category: "technique",
    definition:
      "Désignation d'un palier de configuration matérielle et logicielle d'un appareil. Sous un même nom — F-35 Block 4, Rafale F4 — coexistent des avions aux capacités distinctes.",
  },
  {
    slug: "mco",
    term: "Maintien en condition opérationnelle",
    acronym: "MCO",
    category: "commerce",
    definition:
      "Ensemble des activités — maintenance, pièces, mises à jour — qui gardent une flotte apte au vol. Sur trois à quatre décennies, c'est le premier poste du coût complet d'un avion de combat.",
  },
  {
    slug: "cca",
    term: "Avion de combat collaboratif",
    acronym: "CCA",
    category: "technique",
    definition:
      "Collaborative Combat Aircraft. Drone de combat conçu pour opérer en équipe avec un chasseur habité — l'« ailier fidèle » qui démultiplie capteurs et armement sans exposer de pilote.",
  },
  {
    slug: "combat-cloud",
    term: "Combat cloud",
    category: "doctrine",
    definition:
      "Nuage de combat. Architecture en réseau où chaque plateforme — chasseur, drone, satellite, navire — partage capteurs et effecteurs par liaisons de données. Concept structurant des programmes de 6e génération.",
  },
  {
    slug: "iamd",
    term: "Défense aérienne et antimissile intégrée",
    acronym: "IAMD",
    category: "doctrine",
    definition:
      "Integrated Air and Missile Defense. Architecture qui fond la défense antiaérienne et antimissile dans un même réseau de capteurs, de commandement et d'effecteurs — un radar ne vaut, dans ce cadre, que par les boucles auxquelles il est connecté.",
  },
  {
    slug: "ibcs",
    term: "Système de commandement intégré",
    acronym: "IBCS",
    category: "doctrine",
    definition:
      "Integrated Battle Command System. C2 IAMD de l'US Army — fédère capteurs et tireurs hétérogènes sous une devise « any sensor, best weapon », en s'appuyant sur des nœuds A-Kit / B-Kit reliés à un réseau IFCN. Cœur de la doctrine AIAMD américaine.",
  },
  {
    slug: "natinamds",
    term: "NATINAMDS",
    acronym: "NATINAMDS",
    category: "doctrine",
    definition:
      "NATO Integrated Air and Missile Defence System. Cadre OTAN qui fédère les radars, les C2 et les effecteurs sol-air et air-air des alliés sous une même image aérienne reconnue, opérée en permanence depuis les CAOC. Successeur élargi du NATINADS.",
  },
  {
    slug: "lpi",
    term: "Faible probabilité d'interception",
    acronym: "LPI",
    category: "technique",
    definition:
      "Low Probability of Intercept. Techniques de forme d'onde et d'agilité de fréquence qui rendent un radar plus difficile à détecter par un récepteur d'alerte. Caractéristique revendiquée des AESA récents — rarement quantifiée publiquement.",
  },
  {
    slug: "eccm",
    term: "Contre-contre-mesures électroniques",
    acronym: "ECCM",
    category: "technique",
    definition:
      "Electronic Counter-Counter-Measures. Ensemble des dispositifs qui permettent à un radar de continuer à fonctionner sous brouillage — agilité de fréquence, sauts de PRF, formes d'onde résistantes, traitement Doppler avancé. Paramètres typiquement classifiés.",
  },
  {
    slug: "trm",
    term: "Module émission-réception",
    acronym: "TRM",
    category: "technique",
    definition:
      "Transmit-Receive Module. Brique de base d'un radar AESA — chaque module combine amplificateur de puissance, récepteur faible bruit, déphaseur. Le nombre, la technologie (GaAs, GaN) et la finesse de packaging déterminent la performance et le coût du radar.",
  },
  {
    slug: "gan",
    term: "Nitrure de gallium",
    acronym: "GaN",
    category: "technique",
    definition:
      "Gallium Nitride. Semiconducteur RF à grand gap, plus efficace et plus tolérant en chaleur que le GaAs traditionnel — meilleur rendement énergétique, puissance crête supérieure, sensibilité accrue. Devenu la référence pour les radars AESA modernes (TRM, EW).",
  },
  {
    slug: "aewc",
    term: "Alerte aérienne avancée",
    acronym: "AEW&C",
    category: "doctrine",
    definition:
      "Airborne Early Warning and Control. Plateforme aéroportée combinant radar longue portée, IFF, capteurs passifs et postes de contrôle — étend l'horizon radar bien au-delà de la courbure terrestre, et sert de relais C2 dans l'image aérienne intégrée.",
  },
  {
    slug: "wassenaar",
    term: "Arrangement de Wassenaar",
    category: "juridique",
    definition:
      "Régime multilatéral de contrôle des exportations d'armes conventionnelles et de biens et technologies à double usage, signé en 1996. Cadre les transferts de radars, capteurs avancés et composants critiques entre 42 États participants — distinct de l'ITAR et du MTCR.",
  },
  {
    slug: "cout-complet",
    term: "Coût complet",
    category: "commerce",
    definition:
      "Approche qui agrège l'ensemble des coûts attribuables à un système — directs et indirects, récurrents et non récurrents — au-delà du seul prix d'achat. Base d'une comparaison honnête entre équipements hétérogènes.",
  },
  {
    slug: "cout-de-possession",
    term: "Coût de possession",
    acronym: "TCO",
    category: "commerce",
    definition:
      "Total Cost of Ownership. Coût d'un système sur tout son cycle de vie : acquisition, formation, infrastructure, MCO, munitions, modernisations et démantèlement. Le prix d'achat n'en est que la part visible.",
  },
  // === Glossaire spatial militaire (lot ouverture du domaine) ===
  {
    slug: "leo",
    term: "Orbite basse",
    acronym: "LEO",
    category: "technique",
    definition:
      "Low Earth Orbit. Orbite proche de la Terre, généralement sous 2 000 km. Couverture limitée par satellite mais latence faible et résolution accessible — utilisée pour imagerie, reconnaissance et constellations proliférées.",
  },
  {
    slug: "meo",
    term: "Orbite moyenne",
    acronym: "MEO",
    category: "technique",
    definition:
      "Medium Earth Orbit. Entre LEO et GEO, typiquement entre 2 000 et 35 786 km. Zone de prédilection des constellations de navigation par satellite (GPS, Galileo, GLONASS, BeiDou).",
  },
  {
    slug: "geo",
    term: "Orbite géostationnaire",
    acronym: "GEO",
    category: "technique",
    definition:
      "Geostationary Orbit. Orbite équatoriale à 35 786 km où le satellite garde une position apparente fixe au-dessus du sol. Utilisée pour SATCOM, alerte avancée et veille persistante régionale.",
  },
  {
    slug: "sso",
    term: "Orbite héliosynchrone",
    acronym: "SSO",
    category: "technique",
    definition:
      "Sun-Synchronous Orbit. Orbite polaire dont le plan suit la rotation apparente du Soleil — passages à heure solaire locale comparable. Idéale pour l'observation répétable et le suivi de changements.",
  },
  {
    slug: "heo",
    term: "Orbite très elliptique",
    acronym: "HEO",
    category: "technique",
    definition:
      "Highly Elliptical Orbit. Orbite très allongée permettant une longue présence apparente au-dessus de hautes latitudes. Famille Molniya utilisée par la Russie pour communications arctiques et alerte avancée.",
  },
  {
    slug: "imint",
    term: "Renseignement image",
    acronym: "IMINT",
    category: "doctrine",
    definition:
      "Imagery Intelligence. Renseignement d'origine image — extraction d'informations à partir de photographies aériennes ou satellitaires, optique, IR ou radar.",
  },
  {
    slug: "geoint",
    term: "Renseignement géospatial",
    acronym: "GEOINT",
    category: "doctrine",
    definition:
      "Geospatial Intelligence. Renseignement issu de la fusion d'images, cartes, coordonnées et analyses spatiales pour caractériser un terrain, une activité ou un mouvement.",
  },
  {
    slug: "sigint",
    term: "Renseignement d'origine signaux",
    acronym: "SIGINT",
    category: "doctrine",
    definition:
      "Signals Intelligence. Détection, interception et analyse de signaux électromagnétiques — communications, radars, télémesure. Recouvre COMINT (communications) et ELINT (signaux non communicationnels).",
  },
  {
    slug: "roem",
    term: "Renseignement d'origine électromagnétique",
    acronym: "ROEM",
    category: "doctrine",
    definition:
      "Terme français équivalent à SIGINT. Détection et localisation d'émissions électromagnétiques — base de capacités comme CERES côté français.",
  },
  {
    slug: "comint",
    term: "Renseignement communications",
    acronym: "COMINT",
    category: "doctrine",
    definition:
      "Communications Intelligence. Branche du SIGINT consacrée à l'interception et à l'exploitation des communications adverses — voix, données, télémesure.",
  },
  {
    slug: "elint",
    term: "Renseignement électronique",
    acronym: "ELINT",
    category: "doctrine",
    definition:
      "Electronic Intelligence. Branche du SIGINT consacrée aux signaux électroniques non communicationnels — radars, télémesure, balises. Permet de caractériser un ordre de bataille électronique adverse.",
  },
  {
    slug: "sar",
    term: "Radar à synthèse d'ouverture",
    acronym: "SAR",
    category: "technique",
    definition:
      "Synthetic Aperture Radar. Imagerie radar jour/nuit, utilisable sous couverture nuageuse. La synthèse d'ouverture combine plusieurs prises pour atteindre des résolutions impossibles à une antenne fixe.",
  },
  {
    slug: "milsatcom",
    term: "Communications militaires par satellite",
    acronym: "MILSATCOM",
    category: "technique",
    definition:
      "Military Satellite Communications. Communications militaires durcies, sécurisées, souvent anti-brouillage, reliant forces déployées et centres de commandement. Bandes X, Ka et EHF principales.",
  },
  {
    slug: "pnt",
    term: "Position, navigation et temps",
    acronym: "PNT",
    category: "technique",
    definition:
      "Positioning, Navigation and Timing. Service délivré par les constellations GNSS (GPS, Galileo, GLONASS, BeiDou) — positionnement, navigation et synchronisation temporelle, essentiels au guidage et aux opérations interarmées.",
  },
  {
    slug: "opir",
    term: "Veille infrarouge persistante",
    acronym: "OPIR",
    category: "technique",
    definition:
      "Overhead Persistent Infrared. Capteurs infrarouges spatiaux détectant les lancements de missiles et participant à l'alerte stratégique. Famille SBIRS, Next-Gen OPIR côté US.",
  },
  {
    slug: "sda",
    term: "Connaissance de la situation spatiale",
    acronym: "SDA / SSA",
    category: "doctrine",
    definition:
      "Space Domain Awareness / Space Situational Awareness. Capacité à détecter, suivre, caractériser et comprendre les objets et comportements en orbite — pierre angulaire de la défense spatiale moderne.",
  },
  {
    slug: "rpo",
    term: "Rendez-vous et opérations de proximité",
    acronym: "RPO",
    category: "doctrine",
    definition:
      "Rendezvous and Proximity Operations. Manœuvres de rapprochement en orbite — inspection, ravitaillement, mais aussi capacités contre-spatiales documentées (patrouilleurs-guetteurs, satellites inspecteurs).",
  },
  {
    slug: "segment-sol",
    term: "Segment sol",
    category: "doctrine",
    definition:
      "Ensemble des moyens terrestres d'un système spatial : stations de réception, centres de mission, chaînes de traitement et de diffusion. Sans segment sol, le satellite ne produit rien d'exploitable.",
  },
  {
    slug: "revisite",
    term: "Revisite",
    category: "doctrine",
    definition:
      "Fréquence à laquelle un satellite ou une constellation peut repasser sur une même zone. Critère structurant pour l'observation — une constellation à 3 satellites améliore la revisite par rapport à un satellite unique.",
  },
  {
    slug: "cout-objectif",
    term: "Coût-objectif",
    category: "commerce",
    definition:
      "Coût cible fixé en amont d'un programme, auquel la conception et l'industrialisation doivent se plier — logique inverse du coût simplement constaté a posteriori.",
  },
  {
    slug: "ae-cp",
    term: "Autorisations d'engagement / Crédits de paiement",
    acronym: "AE / CP",
    category: "commerce",
    definition:
      "Deux bornes de la dépense publique pluriannuelle : l'AE est le plafond juridique d'engagement d'une dépense, le CP la trésorerie budgétaire ouverte chaque année pour la payer. L'écart entre les deux nourrit le « reste à payer ».",
  },
];

export const GLOSSARY_BY_SLUG: Record<string, GlossaryTerm> = Object.fromEntries(
  glossary.map((t) => [t.slug, t]),
);
