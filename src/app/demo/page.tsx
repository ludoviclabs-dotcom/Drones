import type { Metadata } from "next";
import Link from "next/link";
import { FilmStage } from "@/components/film/film-stage";
import { buildFilmData } from "@/film/build-film-data";
import { CHAPTERS, FILM_FPS, FILM_SECONDS } from "@/film/timeline";

export const metadata: Metadata = {
  title: "Briefing vidéo",
  description: `Panoplie en ${FILM_SECONDS} secondes : un dossier lu sous cinq angles, la preuve par la source, la comparaison par paliers et le cadre d'analyse — avec les données du registre.`,
  alternates: { canonical: "/demo" },
};

const LINK_ACCENT =
  "inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink";

/**
 * Page partageable du briefing — à envoyer à un prospect, à projeter sur un
 * salon, ou à ouvrir sur un chapitre précis (`/demo?chapitre=preuve`).
 * La transcription complète suit le film : tout ce qu'il dit se lit aussi.
 */
export default function DemoPage() {
  const data = buildFilmData();

  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-10 pt-10 sm:pt-14">
      <p className="flex items-center gap-4 font-mono text-sm uppercase tracking-[0.22em] text-ink">
        <span className="text-xs font-semibold text-accent">00</span>
        Briefing vidéo
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </p>
      <h1 className="mt-5 max-w-[20ch] font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
        Panoplie en {FILM_SECONDS} secondes.
      </h1>
      <p className="mt-3 max-w-[62ch] font-sans text-[17px] leading-relaxed text-ink-dim">
        Un dossier lu sous cinq angles, une affirmation remontée jusqu'à sa
        source, deux systèmes comparés par paliers, et le cadre qui borne
        l'analyse. Le film est calculé à partir du registre : ses chiffres sont
        ceux du site.
      </p>

      <div className="mt-8">
        <FilmStage data={data} />
      </div>

      <section aria-labelledby="transcription-titre" className="mt-14">
        <h2
          id="transcription-titre"
          className="font-mono text-sm uppercase tracking-[0.22em] text-ink"
        >
          Transcription
        </h2>
        <ol className="mt-5 border-t border-line">
          {CHAPTERS.map((chapter) => (
            <li
              key={chapter.id}
              id={`transcription-${chapter.id}`}
              className="grid gap-x-8 gap-y-2 border-b border-line py-5 sm:grid-cols-[12rem_1fr]"
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                  {chapter.num} · {chapter.label}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  {Math.round(chapter.durationInFrames / FILM_FPS)} s
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl leading-snug text-ink">
                  {chapter.title}
                </h3>
                <p className="mt-1 max-w-[70ch] text-[15px] leading-relaxed text-ink-dim">
                  {chapter.caption(data)}
                </p>
                {/* Lien d'ancre : déclenche hashchange, que le lecteur écoute. */}
                <a href={`#${chapter.id}`} className={LINK_ACCENT}>
                  Lire depuis ce chapitre →
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2">
        <Link href="/#catalogue" className={LINK_ACCENT}>
          Ouvrir le recueil →
        </Link>
        <Link href="/methodologie" className={LINK_ACCENT}>
          Lire la méthodologie →
        </Link>
      </div>
    </div>
  );
}
