import type { Metadata } from "next";
import type { Grade, Reliability } from "@/data/types";
import {
  BRICK_BLURBS,
  BRICK_LABELS,
  BRICK_ORDER,
  CONFIDENCE_META,
  GRADE_META,
  MODE_LABELS,
  RELIABILITY_LABELS,
  SCORE_LABELS,
} from "@/data/labels";
import { ConfidenceMark, GradeBadge, SectionMarker } from "@/components/primitives";

export const metadata: Metadata = {
  alternates: { canonical: "/methodologie" },
  title: "Méthodologie",
  description:
    "Comment Panoplie évalue, score et source les systèmes de défense — paliers, confiance des données, fiabilité des sources, cadre éthique.",
};

const GRADES: Grade[] = ["A", "B", "C", "D", "E"];
const RELIABILITIES: Reliability[] = ["A", "B", "C", "D"];
const CONFIDENCES = ["haute", "moyenne", "faible"] as const;

export default function MethodologiePage() {
  return (
    <div className="mx-auto max-w-[880px] px-5 py-12">
      <header className="reveal">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          Référence
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink">
          Méthodologie
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-dim">
          Comment Panoplie évalue, note et source chaque système — et ce que la
          plateforme ne prétend pas faire.
        </p>
      </header>

      <section className="mt-14">
        <SectionMarker index="01" label="Le projet" />
        <div className="mt-5 space-y-4 font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          <p>
            Panoplie analyse les systèmes de défense à partir du renseignement
            de sources ouvertes. La plateforme ne vise pas l'exhaustivité d'un
            catalogue, mais la clarté : peu de systèmes, documentés en
            profondeur, comparables entre eux.
          </p>
          <p>
            Son principe directeur est l'honnêteté sur l'incertitude. Dans le
            domaine de la défense, les données sont souvent incomplètes,
            estimées ou contradictoires. Plutôt que de masquer ce flou derrière
            des chiffres faussement précis, Panoplie l'affiche.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <SectionMarker
          index="02"
          label="La grille des cinq briques"
          blurb="Chaque système est lu à travers les mêmes cinq dimensions."
        />
        <div className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-2">
          {BRICK_ORDER.map((key, i) => (
            <div key={key} className="bg-panel p-5">
              <span className="font-mono text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1.5 font-mono text-sm uppercase tracking-[0.1em] text-ink">
                {BRICK_LABELS[key]}
              </h3>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                {BRICK_BLURBS[key]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionMarker index="03" label="Les paliers d'évaluation" />
        <div className="mt-5 space-y-4 font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          <p>
            Chaque système reçoit six évaluations, exprimées en paliers de A à E
            — jamais en score chiffré. Un « 82 sur 100 » suggère une précision
            que les données ne permettent pas. Un palier, accompagné de son
            raisonnement, est plus honnête.
          </p>
        </div>
        <div className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-5">
          {GRADES.map((grade) => (
            <div key={grade} className="flex flex-col items-center bg-panel p-4">
              <GradeBadge grade={grade} />
              <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-ink-dim">
                {GRADE_META[grade].label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
          Les six dimensions évaluées
        </p>
        <ul className="mt-3 grid gap-px border border-line bg-line sm:grid-cols-2">
          {Object.values(SCORE_LABELS).map((label) => (
            <li
              key={label}
              className="bg-panel px-4 py-2.5 font-mono text-xs text-ink-dim"
            >
              {label}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <SectionMarker index="04" label="La confiance des données" />
        <p className="mt-5 font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          Chaque indicateur chiffré porte un niveau de confiance, signalé par
          trois barres. Il distingue ce qui est établi de ce qui reste estimé.
        </p>
        <div className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-3">
          {CONFIDENCES.map((confidence) => (
            <div key={confidence} className="bg-panel p-4">
              <ConfidenceMark confidence={confidence} />
              <p className="mt-2 font-mono text-xs text-ink">
                {CONFIDENCE_META[confidence].label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionMarker index="05" label="La fiabilité des sources" />
        <p className="mt-5 font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          Chaque source est notée de A à D, selon une échelle inspirée des
          usages du renseignement — du document fiable à la source douteuse à
          recouper.
        </p>
        <ul className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {RELIABILITIES.map((reliability) => (
            <li key={reliability} className="bg-panel p-4">
              <span className="font-mono text-lg text-accent">
                {reliability}
              </span>
              <p className="mt-1 font-mono text-xs text-ink-dim">
                {RELIABILITY_LABELS[reliability]}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <SectionMarker
          index="06"
          label="Les modes d'acquisition"
          blurb="Un système ne s'acquiert pas d'une seule manière — et chaque voie a ses conséquences."
        />
        <ul className="mt-5 space-y-px border border-line bg-line">
          {Object.values(MODE_LABELS).map((mode) => (
            <li key={mode.short} className="bg-panel p-4">
              <p className="font-mono text-sm text-ink">{mode.short}</p>
              <p className="mt-1 font-serif text-sm leading-relaxed text-ink-dim">
                {mode.full}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <SectionMarker
          index="07"
          label="Le domaine énergie dirigée"
          blurb="Les lasers sont lus à la même grille — avec deux ajouts et une vigilance."
        />
        <div className="mt-5 space-y-4 font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          <p>
            Les systèmes à énergie dirigée passent par les mêmes cinq briques et
            les mêmes six paliers que les drones. Deux éléments s'y ajoutent : un
            bloc « contraintes physiques » — ligne de visée, atmosphère,
            refroidissement, énergie disponible — et un encadré juridique
            rappelant le cadre du Protocole IV.
          </p>
          <p>
            Une vigilance particulière porte sur la confiance des données. Le
            sujet laser est saturé d'annonces industrielles : la différence
            entre testé, livré, déployé et opérationnel est critique. Le palier
            de maturité la reflète sans complaisance.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <SectionMarker
          index="08"
          label="Le domaine aviation de combat"
          blurb="Les chasseurs suivent la même grille — avec une lecture des générations qui sépare le revendiqué de l'évalué."
        />
        <div className="mt-5 space-y-4 font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          <p>
            Les avions de combat passent par les mêmes cinq briques et les mêmes
            six paliers que les autres systèmes. S'y ajoute un cadre de lecture
            des générations, de la 4e modernisée à la 6e. Panoplie y distingue
            deux niveaux : la génération revendiquée — celle qu'avancent
            l'industriel ou la nation d'origine — et la génération telle que la
            plateforme la lit, à capacités constatées. L'écart entre les deux
            est, en soi, une information.
          </p>
          <p>
            La brique « coût » se lit ici en couches : coût unitaire de
            production, coût d'acquisition complet, coût du programme, et
            surtout maintien en condition opérationnelle sur trois à quatre
            décennies — le poste qui domine le coût de possession. Le prix
            d'achat affiché n'en est que la part visible.
          </p>
          <p>
            Les programmes de 6e génération — F-47, SCAF, GCAP — ne volent pas
            encore. Le modèle impose pourtant six paliers : les dimensions non
            démontrables y reçoivent une note prudente, dont le raisonnement
            indique explicitement qu'il s'agit d'une évaluation indicative.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <SectionMarker index="09" label="Limites &amp; cadre éthique" />
        <div className="mt-5 space-y-4 font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          <p>
            Panoplie est un outil d'analyse stratégique, industrielle et
            financière. Ce qu'il n'est pas :
          </p>
        </div>
        <ul className="mt-4 space-y-2">
          {[
            "une aide au ciblage ou à la conduite d'opérations militaires ;",
            "une source de données techniques opérationnelles exploitables ;",
            "un catalogue commercial ou une place de marché.",
          ].map((item) => (
            <li
              key={item}
              className="flex gap-3 font-serif text-[1.05rem] leading-relaxed text-ink-dim"
            >
              <span className="text-accent">—</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          Les données publiées sont des estimations issues de sources ouvertes,
          datées et susceptibles d'être révisées. Les corrections sourcées sont
          les bienvenues.
        </p>
      </section>

      <section className="mt-14">
        <SectionMarker
          index="10"
          label="La lecture CCA / costing"
          blurb="Une couche de contrôle de gestion posée sur les briques existantes."
        />
        <div className="mt-5 space-y-4 font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          <p>
            « CCA » désigne ici la comptabilité, le contrôle de gestion et
            l'audit — non l'avion de combat collaboratif. Certains dossiers
            reçoivent une « Lecture CCA » : une synthèse de contrôleur de gestion
            qui reformule les briques Coût et Finance. Elle n'ajoute aucune donnée
            chiffrée et aucun palier — elle nomme ce que les briques contiennent
            déjà.
          </p>
          <p>
            Son fil directeur : le prix affiché n'est jamais le coût réel. Un
            système d'armes se lit en couches de coût emboîtées, du vecteur seul
            jusqu'à l'effet militaire produit.
          </p>
        </div>
        <div className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Coût cellule", "Le vecteur seul — à ne jamais utiliser isolément."],
              ["Coût système", "Vecteurs, stations sol, capteurs et soutien initial."],
              ["Coût d'acquisition", "Le système, plus formation, infrastructure et stock initial de pièces."],
              ["Coût de possession", "Sur la durée : acquisition, MCO, munitions, modernisations, fin de vie."],
              ["Coût de disponibilité", "Le coût rapporté à la capacité réellement disponible."],
              ["Coût par effet", "Le coût rapporté à l'effet obtenu — clé pour les systèmes attritables."],
            ] as const
          ).map(([label, blurb], i) => (
            <div key={label} className="bg-panel p-5">
              <span className="font-mono text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1.5 font-mono text-sm uppercase tracking-[0.1em] text-ink">
                {label}
              </h3>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-dim">
                {blurb}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          Deux repères de finance publique complètent la lecture : les
          autorisations d'engagement (AE), plafond juridique de la dépense, et les
          crédits de paiement (CP), la trésorerie annuelle qui les solde. Le mode
          d'acquisition — FMS, DCS, production nationale — détermine, lui, qui
          porte le risque contractuel.
        </p>
      </section>

      <section className="mt-14">
        <SectionMarker
          index="11"
          label="Le domaine spatial militaire"
          blurb="Trois axes — mission, orbite, charge utile — et une vigilance éditoriale propre au domaine."
        />
        <div className="mt-5 space-y-4 font-serif text-[1.05rem] leading-[1.75] text-ink/90">
          <p>
            Les satellites militaires passent par les mêmes cinq briques que les
            autres systèmes — coût, finance, supply chain, géopolitique, export.
            Trois axes spécifiques s&apos;y ajoutent : la mission (observation,
            écoute, communications, navigation, alerte, surveillance de
            l&apos;espace), l&apos;orbite (LEO, MEO, GEO, SSO, HEO selon la
            mission) et la charge utile (capteur optique, IR, SAR, RF, SATCOM,
            PNT, OPIR).
          </p>
          <p>
            Les fiches du domaine reçoivent un profil structuré — orbite,
            charges utiles, segment sol, lanceur, résilience — calqué sur le
            profil naval. La valeur d&apos;un satellite militaire ne tient
            jamais au satellite isolé : elle tient au cycle complet de service
            (commande, acquisition, descente de données, traitement, diffusion)
            et à la souveraineté que ce cycle engage.
          </p>
          <p>
            Vigilance éditoriale spécifique. Le domaine spatial militaire est
            celui où la frontière entre OSINT responsable et donnée
            opérationnelle est la plus mince. Panoplie publie ce qui est
            ouvertement documenté : missions générales, orbites génériques,
            calendrier de lancement public, opérateurs et industriels, coûts
            issus de rapports parlementaires. Panoplie ne publie pas — par
            principe — d&apos;éphémérides ou TLE temps réel, de fenêtres de
            passage exploitables, de coordonnées précises de stations
            sensibles, de paramètres détaillés de liaison, de méthodes de
            brouillage ou d&apos;interception, ni de résolutions classifiées.
            La règle est rappelée dans le « cadre de prudence » de chaque page
            domaine spatial.
          </p>
        </div>
      </section>
    </div>
  );
}
