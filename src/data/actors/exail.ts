import { ind, src } from "../systems/registry-helpers";
import type { ActorDossier } from "./types";

// Exail — dossier d'acteur issu du registre « Souveraineté industrielle » du
// 17/11/2026. Le 3,9 Md€ annoncé par Thales est une valeur d'entreprise (VE),
// précision apportée par le communiqué d'Exail et confirmée à l'audit du
// 17/11/2026 : il ne se compare pas à la valeur des titres (≈ 2,3 Md€, calcul).
// Trois chiffres du registre (croissance 2025, part de l'export, carnet de
// drones) ne sont pas repris : le registre note lui-même que leur renvoi
// pointe vers un texte de loi, qui ne les étaye pas.

export const exail: ActorDossier = {
  slug: "exail",
  name: "Exail",
  reference: "PNP-ACT-002",
  kind: "groupe-industriel",
  country: "France",
  flag: "🇫🇷",
  tagline:
    "Le spécialiste français des drones maritimes que Thales rachète : 479 M€ de chiffre d'affaires, 1 001 M€ de carnet, 134 € par action.",
  summary:
    "Exail Technologies, ex-iXblue et ECA, est le fournisseur français de drones maritimes et de systèmes de lutte contre les mines. Il fournit, avec Thales, les drones sous-marins du programme SLAM-F ; le registre rapproche de l'UMIS un contrat d'environ 400 M€ dans la lutte contre les mines, signé en février 2025.\n\nLe 6 juillet 2026, Thales a annoncé racheter le bloc de 35,51 % de la famille Gorgé à 134 € par action, avec une offre publique sur la totalité du capital. L'annonce parle de 3,9 Md€ : c'est une valeur d'entreprise, pas la valeur des titres. Le transfert du bloc est visé d'ici le troisième trimestre 2027 ; l'offre publique doit être finalisée au plus tard début 2028.",
  keyFigures: [
    ind("Chiffre d'affaires 2025", "479 M€", "haute", {
      ids: ["MET-0297"],
      fs: "officiel",
      src: ["abcbourse-thales-exail"],
    }),
    ind("Marge d'EBIT ajusté 2025", "11 %", "haute", {
      ids: ["MET-0298"],
      fs: "officiel",
      src: ["abcbourse-thales-exail"],
    }),
    ind("Carnet de commandes au 30 septembre 2026", "1 001 M€", "haute", {
      ids: ["MET-0301"],
      fs: "officiel",
      src: ["abcbourse-exail-t3-2026"],
    }),
    ind("Variation sur un an du carnet de commandes", "Recule de 7 %", "haute", {
      ids: ["MET-0302"],
      fs: "officiel",
      src: ["abcbourse-exail-t3-2026"],
    }),
    ind("Prises de commandes du premier semestre 2026", "228 M€", "haute", {
      ids: ["MET-0299"],
      fs: "officiel",
      src: ["abcbourse-exail-s1-2026"],
      note: "Contre 612 M€ au premier semestre 2025.",
    }),
  ],
  bricks: [
    {
      key: "finance",
      narrative:
        "Les prises de commandes du premier semestre 2026 retombent à 228 M€, contre 612 M€ un an plus tôt ; le carnet de fin septembre, à 1 001 M€, recule de 7 % sur un an. Le premier semestre 2025 inclut probablement le contrat d'environ 400 M€ de février 2025 — c'est une lecture de l'auteur du registre, que le communiqué ne confirme pas.\n\nLes prochains résultats, début 2027, diront si le carnet et les prises de commandes 2026 se redressent.",
      indicators: [
        ind("Prises de commandes du premier semestre 2025", "612 M€", "haute", {
          ids: ["MET-0300"],
          fs: "officiel",
          src: ["abcbourse-exail-s1-2026"],
          note: "Inclut probablement le contrat d'environ 400 M€ de février 2025 — lecture de l'auteur du registre.",
        }),
        ind("Contrat d'Exail dans la lutte contre les mines (février 2025)", "≈ 400 M€", "moyenne", {
          ids: ["MET-0242"],
          fs: "commande-ferme",
          src: ["abcbourse-exail-s1-2026"],
          note: "Contrat non nommé par Exail ; son rattachement à l'UMIS est un rapprochement de l'auteur du registre.",
        }),
      ],
    },
    {
      key: "cout",
      narrative:
        "Thales rachète le bloc de 35,51 % de la famille Gorgé, soit 6 052 645 actions, à 134 € l'action, avec une prime de 44 % sur le cours non affecté du 25 juin 2026. Il annonce une valorisation d'Exail de 3,9 Md€ : c'est une valeur d'entreprise, comme le précise le communiqué d'Exail. La valeur de 100 % des actions à 134 € est d'environ 2,3 Md€ et celle du bloc d'environ 0,81 Md€ (calculs). Les deux chiffres ne sont pas comparables : l'un est une valeur d'entreprise, l'autre la valeur des seuls titres.\n\nThales chiffre ses synergies d'EBIT ajusté à 90 M€ à l'horizon 2032 ; la valeur d'entreprise représente environ 24 fois l'EBIT 2027 après synergies de coûts, environ 20 fois avec les synergies de revenus.",
      indicators: [
        ind("Participation de la famille Gorgé acquise par Thales", "35,51 %", "haute", {
          ids: ["MET-0280"],
          fs: "officiel",
          src: ["exail-communique-thales-2026"],
        }),
        ind("Nombre d'actions du bloc Gorgé", "6 052 645 actions", "haute", {
          ids: ["MET-0289"],
          fs: "officiel",
          src: ["abcbourse-thales-exail"],
        }),
        ind("Prix par action offert par Thales", "134 € par action", "haute", {
          ids: ["MET-0281"],
          fs: "officiel",
          src: ["exail-communique-thales-2026"],
        }),
        ind("Cours non affecté de l'action Exail", "93,15 € (25 juin 2026)", "haute", {
          ids: ["MET-0283"],
          fs: "officiel",
          src: ["abcbourse-thales-exail"],
        }),
        ind("Prime offerte sur le cours non affecté", "Prime de 44 %", "haute", {
          ids: ["MET-0282"],
          fs: "officiel",
          src: ["abcbourse-thales-exail"],
        }),
        ind("Valorisation d'Exail annoncée par Thales", "3,9 Md€ — valeur d'entreprise, pas valeur des titres", "haute", {
          ids: ["MET-0284"],
          fs: "officiel",
          src: ["exail-communique-thales-2026"],
          note: "Précision du communiqué d'Exail du 6 juillet 2026 ; le registre notait d'abord que la nature du montant n'était pas précisée.",
        }),
        ind("Valeur de 100 % des actions d'Exail à 134 € par action", "Environ 2,3 Md€ (calc.)", "moyenne", {
          ids: ["MET-0285"],
          fs: "calcule",
          src: ["abcbourse-thales-exail"],
        }),
        ind("Valeur du bloc Gorgé (35,51 %) à 134 € par action", "0,81 Md€ (calc.)", "moyenne", {
          ids: ["MET-0286"],
          fs: "calcule",
          src: ["abcbourse-thales-exail"],
        }),
        ind("Multiple VE / EBIT 2027 après synergies de coûts", "Environ 24 fois", "moyenne", {
          ids: ["MET-0290"],
          fs: "officiel",
          src: ["abcbourse-thales-exail"],
        }),
        ind("Multiple VE / EBIT 2027 après synergies de coûts et de revenus", "Environ 20 fois", "moyenne", {
          ids: ["MET-0291"],
          fs: "officiel",
          src: ["abcbourse-thales-exail"],
        }),
        ind("Synergies d'EBIT ajusté attendues par Thales", "90 M€ à l'horizon 2032", "moyenne", {
          ids: ["MET-0292"],
          fs: "officiel",
          src: ["abcbourse-thales-exail"],
        }),
      ],
    },
    {
      key: "supply-chain",
      narrative:
        "Exail fournit des drones sous-marins au programme SLAM-F de la Marine nationale — huit drones commandés avec Thales en novembre 2024 — et, en juillet 2026, trois systèmes légers de lutte contre les mines à une marine européenne, à équipage de trois personnes. Aucun montant n'est publié pour ces deux contrats.",
      indicators: [
        ind("Drones sous-marins commandés à Thales et Exail", "Huit (novembre 2024)", "haute", {
          ids: ["MET-0237"],
          fs: "commande-ferme",
          src: ["dga-slam-f-sous-marins"],
        }),
        ind("Montant du contrat des drones sous-marins", "n.c.", "haute", {
          ids: ["MET-0241"],
          fs: "non-communique",
          src: ["dga-slam-f-sous-marins"],
        }),
        ind("Systèmes légers de lutte contre les mines vendus à une marine européenne", "Trois systèmes légers (15 juillet 2026)", "haute", {
          ids: ["MET-0245"],
          fs: "commande-ferme",
          src: ["abcbourse-exail-mines-2026"],
        }),
        ind("Équipage des systèmes légers de lutte contre les mines", "Équipage de trois personnes", "haute", {
          ids: ["MET-0246"],
          fs: "officiel",
          src: ["abcbourse-exail-mines-2026"],
        }),
        ind("Montant du contrat des trois systèmes légers", "n.c.", "haute", {
          ids: ["MET-0247"],
          fs: "non-communique",
          src: ["abcbourse-exail-mines-2026"],
        }),
      ],
    },
    {
      key: "geopolitique",
      narrative:
        "Le rachat par Thales est soumis à une autorisation de concurrence et à une attestation d'équité ; le registre ne documente ni règle de contenu local ni accès au code source. Le passage d'une famille actionnaire à un grand groupe de défense change le contrôle d'un fournisseur de drones maritimes, sans que les sources en disent plus.",
      indicators: [
        ind("Règle de contenu local et accès au code source", "non documenté", "faible"),
      ],
    },
  ],
  relatedSystems: ["slam-f"],
  registryEntityIds: ["ENT-EXAIL"],
  timeline: [
    { date: "2026-07", label: "Le 6 juillet 2026, Thales annonce l'acquisition du bloc de la famille Gorgé dans Exail.", kind: "jalon", metricIds: ["MET-0293"] },
    { date: "2026-07", label: "Le 30 juillet 2026, signature de l'accord de rapprochement entre Thales et Exail.", kind: "jalon", metricIds: ["MET-0294"] },
    { date: "2027", label: "D'ici le troisième trimestre 2027 : transfert du bloc Gorgé à Thales.", kind: "jalon", metricIds: ["MET-0295"] },
    { date: "2028", label: "Au plus tard début 2028 : finalisation de l'offre publique de Thales sur Exail.", kind: "jalon", metricIds: ["MET-0296"] },
  ],
  industrialChain: [
    { entityId: "ENT-EXAIL", entityName: "Exail", actor: "Famille Gorgé", role: "Actionnaire", country: "France", scope: "Bloc de 35,51 % cédé à Thales à 134 € par action" },
    { entityId: "ENT-EXAIL", entityName: "Exail", actor: "Thales", role: "Actionnaire", country: "France", scope: "Acquéreur : bloc Gorgé puis offre publique obligatoire sur 100 %" },
  ],
  sovereignty: [
    { entityId: "ENT-EXAIL", localContentRule: "Non_specifie", thirdPartyLock: "Autorisation_Concurrence_Reglementaire", sourceCodeAccess: "Non_specifie", chokepoints: [] },
  ],
  watchpoints: [
    { entityId: "ENT-EXAIL", entityName: "Exail", horizon: "T3 2027 à début 2028", event: "Thales-Exail : attestation d'équité, autorisations de concurrence, transfert du bloc Gorgé et offre publique." },
    { entityId: "ENT-EXAIL", entityName: "Exail", horizon: "Début 2027", event: "Résultats d'Exail : carnet de commandes (1 001 M€ fin septembre) et prises de commandes 2026." },
  ],
  programmeTree: [
    { entityId: "ENT-EXAIL", name: "Exail", kind: "Acteur_Industriel", children: [
      { entityId: "ENT-UMIS", name: "UMIS (Exail)", kind: "Plateforme_Vecteur" },
    ] },
  ],
  analystNote:
    "Le 3,9 Md€ et le 2,3 Md€ désignent deux choses différentes : une valeur d'entreprise et une valeur de titres. À suivre : les résultats d'Exail début 2027, puis les autorisations de concurrence de l'opération.",
  sources: [
    src("exail-communique-thales-2026", "Exail Technologies", "Thales to acquire the Gorgé family's stake in Exail, with a view to launching a tender offer for 100% of the company", "constructeur", "B", "2026-07-06", "https://www.exail-technologies.com/thales-to-acquire-the-gorge-familys-stake-in-exail-with-a-view-to-launching-a-tender-offer-for-100-of-the-company/"),
    src("abcbourse-thales-exail", "Thales (via ABC Bourse)", "Communiqué sur l'acquisition de la participation de la famille Gorgé dans Exail", "constructeur", "B", "2026-07-06", "https://www.abcbourse.com/marches/thales-va-acquerir-la-participation-de-la-famille-gorge-dans-exail-en-vue-de-la_699258"),
    src("abcbourse-exail-s1-2026", "Exail (via ABC Bourse)", "Résultats du 1er semestre 2026", "constructeur", "B", "2026-10-09", "https://www.abcbourse.com/marches/resultats-du-1er-semestre-2026-forte-croissance-des-revenus-tres-forte-croiss_703950"),
    src("abcbourse-exail-t3-2026", "Exail (via ABC Bourse)", "Activité du 3e trimestre 2026", "constructeur", "B", "2026-10-14", "https://www.abcbourse.com/marches/exail-technologies-affiche-121-m-de-chiffre-daffaires-au-3e-trimestre-2026-en_704208"),
    src("abcbourse-exail-mines-2026", "Exail (via ABC Bourse)", "Communiqué sur trois systèmes légers de lutte contre les mines pour une marine européenne", "constructeur", "B", "2026-07-15", "https://www.abcbourse.com/marches/exail-remporte-un-contrat-pour-trois-systemes-legers-de-lutte-contre-les-mines-a_699735"),
    src("abcbourse-signature-thales-exail", "ABC Bourse", "Signature de l'accord de rapprochement entre Thales et Exail", "presse", "C", "2026-07-31", "https://www.abcbourse.com/marches/thales-signe-laccord-de-rapprochement-pour-racheter-exail-technologies-a-134-eu_700785"),
    src("dga-slam-f-sous-marins", "Ministère des Armées — DGA", "Commande de huit drones sous-marins autonomes de nouvelle génération dans le cadre du programme SLAM-F auprès des sociétés Thales et Exail", "officiel", "A", "2024-11-12", "https://www.defense.gouv.fr/dga/actualites/commande-huit-drones-marins-autonomes-nouvelle-generation-cadre-du-programme-slam-f-aupres-societes"),
  ],
  updated: "2026-11-17",
};
