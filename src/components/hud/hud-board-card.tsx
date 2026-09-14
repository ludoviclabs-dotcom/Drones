import Image from "next/image";
import Link from "next/link";
import type { HudBoard } from "@/data/hud/boards";
import { RegistrationMarks } from "@/components/registration-marks";

/**
 * Carte d'accès à une planche technique : vignette réelle de la planche, titre,
 * résumé et repères.
 *
 * Toute la carte est cliquable, mais le nom accessible du lien reste le seul
 * titre — le lien est étiré par un pseudo-élément plutôt que d'envelopper la
 * carte entière, qui ferait lire tout son texte comme libellé du lien.
 *
 * Les vignettes sont servies telles quelles (`unoptimized`) : ce sont déjà des
 * WebP de ~20–40 Ko au bon format, et cela évite de consommer le quota
 * d'optimisation d'images Vercel pour un gain nul.
 */
export function HudBoardCard({
  board,
  headingLevel = 2,
  eager = false,
}: {
  board: HudBoard;
  headingLevel?: 2 | 3;
  eager?: boolean;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article
      className="group relative flex min-w-0 flex-col border border-line bg-panel motion-safe:transition-colors hover:border-accent has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-accent"
      data-hud-board={board.slug}
    >
      <div className="relative aspect-video overflow-hidden border-b border-line bg-[#11100c]">
        <Image
          src={board.preview.src}
          alt={board.preview.alt}
          width={board.preview.width}
          height={board.preview.height}
          unoptimized
          loading={eager ? "eager" : "lazy"}
          className="h-full w-full object-cover opacity-90 motion-safe:transition-opacity group-hover:opacity-100"
        />
        <RegistrationMarks className="m-3" />
        {/* En bas à gauche : en haut, l'étiquette recouvrirait le propre titre
            de certaines planches (la vue éclatée drone porte le sien). */}
        <span className="absolute bottom-3 left-3 border border-line-bright bg-panel/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          {board.kind}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <Heading className="font-serif text-2xl leading-tight text-ink">
          <Link
            href={board.href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {board.title}
          </Link>
        </Heading>
        <p className="mt-3 font-serif text-[0.97rem] leading-relaxed text-ink-dim">
          {board.summary}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Repères de la planche">
          {board.features.map((feature) => (
            <li
              key={feature}
              className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint"
            >
              {feature}
            </li>
          ))}
        </ul>
        <span
          className="mt-auto pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-accent"
          aria-hidden="true"
        >
          Ouvrir la planche →
        </span>
      </div>
    </article>
  );
}

/**
 * Vignette compacte pour l'accueil : image et titre seulement. Elle occupe la
 * colonne du hero laissée vide par le sommaire des domaines, pour que les
 * planches soient visibles dès l'arrivée, sans défilement. `featured` l'étend
 * sur les deux colonnes de la grille (nombre impair de planches).
 */
export function HudBoardTeaser({
  board,
  featured = false,
}: {
  board: HudBoard;
  featured?: boolean;
}) {
  return (
    <article
      className={`group relative min-w-0 border border-line bg-bg/40 motion-safe:transition-colors hover:border-accent has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-accent${featured ? " sm:col-span-2" : ""}`}
      data-hud-board={board.slug}
    >
      <div className="aspect-video overflow-hidden border-b border-line bg-[#11100c]">
        <Image
          src={board.preview.src}
          alt={board.preview.alt}
          width={board.preview.width}
          height={board.preview.height}
          unoptimized
          loading="eager"
          className="h-full w-full object-cover opacity-90 motion-safe:transition-opacity group-hover:opacity-100"
        />
      </div>
      <div className="px-3.5 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
          {board.kind}
        </p>
        <h3 className="mt-1 font-serif text-base leading-snug text-ink">
          <Link
            href={board.href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {board.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}

/**
 * Grande vignette de l'accueil : la planche la plus récente, sous la grille des
 * autres. En colonne large (≥ 1024 px), elle s'étire jusqu'au bas du sommaire
 * des domaines : l'image absorbe d'abord la hauteur disponible, jusqu'à un
 * plafond de 1,1 fois sa largeur (au-delà, le recadrage mangerait l'avion) ;
 * l'excédent éventuel passe dans le bloc texte, entrées poussées vers le bas.
 * Les entrées directes ouvrent la planche dans un scénario ; elles passent
 * au-dessus du lien étiré de la carte.
 */
export function HudBoardSpotlight({ board }: { board: HudBoard }) {
  return (
    <article
      className="@container group relative flex min-w-0 flex-col border border-line bg-bg/40 motion-safe:transition-colors hover:border-accent has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-accent lg:grow"
      data-hud-board={board.slug}
      data-hud-teaser="spotlight"
    >
      <div className="relative aspect-video overflow-hidden border-b border-line bg-[#11100c] lg:aspect-auto lg:max-h-[110cqw] lg:min-h-[17rem] lg:grow-[1000]">
        <Image
          src={board.preview.src}
          alt={board.preview.alt}
          width={board.preview.width}
          height={board.preview.height}
          unoptimized
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-90 motion-safe:transition-opacity group-hover:opacity-100"
          style={{ objectPosition: `${board.preview.focusX ?? 50}% 50%` }}
        />
        <RegistrationMarks className="m-3" />
        <span className="absolute bottom-3 left-3 border border-line-bright bg-panel/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          Nouvelle planche
        </span>
      </div>
      <div className="flex flex-col px-4 py-4 sm:px-5 lg:grow">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
          {board.kind}
        </p>
        <h3 className="mt-1 font-serif text-xl leading-snug text-ink">
          <Link
            href={board.href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {board.title}
          </Link>
        </h3>
        <p className="mt-2 font-serif text-[0.95rem] leading-relaxed text-ink-dim">
          {board.summary}
        </p>
        <div className="min-h-4 lg:grow" aria-hidden="true" />
        {board.entries?.length ? (
          <ul
            className="relative z-10 grid gap-px border border-line bg-line"
            aria-label="Entrer directement dans un scénario"
          >
            {board.entries.map((entry) => (
              <li key={entry.href} className="bg-panel">
                <Link
                  href={entry.href}
                  className="flex min-h-11 items-center justify-between gap-3 px-3 py-2 motion-safe:transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                >
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
                      {entry.label}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] leading-snug text-ink-faint">
                      {entry.detail}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-accent" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Repères de la planche">
          {board.features.map((feature) => (
            <li
              key={feature}
              className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint"
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function HudBoardGrid({
  boards,
  headingLevel = 2,
  eager = false,
}: {
  boards: readonly HudBoard[];
  headingLevel?: 2 | 3;
  eager?: boolean;
}) {
  return (
    // Trois colonnes seulement quand elles tombent juste : jamais de carte
    // orpheline sur une dernière rangée (4 planches = 2 × 2).
    <div
      className={
        boards.length % 3 === 0
          ? "grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          : "grid gap-5 md:grid-cols-2"
      }
    >
      {boards.map((board) => (
        <HudBoardCard
          key={board.slug}
          board={board}
          headingLevel={headingLevel}
          eager={eager}
        />
      ))}
    </div>
  );
}
