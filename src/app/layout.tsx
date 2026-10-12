import type { Metadata } from "next";
import Link from "next/link";
import { Newsreader, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MotionController } from "@/components/motion-controller";
import { DossierOriginTracker } from "@/components/dossier-origin-tracker";
import { SafetyBoundaryBanner } from "@/components/safety-boundary-banner";
import { SiteNav } from "@/components/site-nav";
import { JsonLd } from "@/components/json-ld";
import { organizationLd, webSiteLd } from "@/lib/structured-data";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { FOOTER_LINKS } from "@/data/navigation";
import { systems } from "@/data/systems";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Texte courant et commandes de l'accueil et de la navigation : une linéale
// lisible, de la même famille que la mono des annotations.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const TITLE_DEFAULT =
  "Panoplie — Intelligence open source sur les systèmes de défense";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE_DEFAULT,
    template: "%s — Panoplie",
  },
  description:
    "Analyse et comparaison des systèmes de défense à partir de sources ouvertes : coût, finance, supply chain, géopolitique et export.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "fr_FR",
    title: TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${newsreader.variable} ${plexMono.variable} ${plexSans.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion-ready')}}catch(e){}",
          }}
        />
        <JsonLd data={organizationLd()} />
        <JsonLd data={webSiteLd()} />
        <MotionController />
        <DossierOriginTracker />
        <div className="film-grain" aria-hidden="true" />
        <a
          href="#contenu"
          className="sr-only z-50 border border-accent bg-bg px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Aller au contenu
        </a>
        <SafetyBoundaryBanner />

        <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
          <div className="mx-auto flex min-h-[var(--site-header-content-height)] max-w-[1180px] items-center justify-between gap-x-6 px-5 py-2">
            <Link href="/" className="flex shrink-0 items-baseline gap-3">
              <span className="font-serif text-2xl leading-none tracking-tight text-ink">
                Panoplie
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint md:inline">
                Renseignement open source
              </span>
            </Link>
            {/* Quatre groupes (Explorer, Visualisations, Outils d'analyse,
                Méthodologie) et l'accès à la recherche ; volet sous 1024 px. */}
            <SiteNav />
          </div>
        </header>

        <main id="contenu" className="flex-1">
          {children}
        </main>

        <footer className="mt-24 border-t border-line">
          <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-12 sm:grid-cols-[1.6fr_1fr_1.2fr]">
            <div>
              <p className="font-serif text-xl text-ink">Panoplie</p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-ink-dim">
                Intelligence open source sur les systèmes de défense. Données
                estimées à partir de sources ouvertes — datées, notées,
                contextualisées.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                Naviguer
              </p>
              <ul className="mt-3 space-y-1.5">
                {FOOTER_LINKS.map((i) => (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      className="text-xs text-ink-dim transition-colors hover:text-accent"
                    >
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                Cadre
              </p>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-ink-dim">
                Analyse stratégique, industrielle et financière. Pas d'aide au
                ciblage ni de contenu opérationnel exploitable.
              </p>
            </div>
          </div>
          <div className="border-t border-line">
            <p className="mx-auto max-w-[1180px] px-5 py-4 text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              © 2026 Panoplie · {systems.length} systèmes documentés
            </p>
          </div>
        </footer>
        {/* Fiche dossier ouverte en surimpression (route interceptée). */}
        {modal}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
