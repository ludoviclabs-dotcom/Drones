import type { Metadata } from "next";
import Link from "next/link";
import { Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { MotionController } from "@/components/motion-controller";
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

export const metadata: Metadata = {
  title: {
    default: "Panoplie — Intelligence open source sur les systèmes de défense",
    template: "%s — Panoplie",
  },
  description:
    "Analyse et comparaison des systèmes de défense à partir de sources ouvertes : coût, finance, supply chain, géopolitique et export.",
};

const NAV = [
  { href: "/#catalogue", label: "Systèmes" },
  { href: "/comparateur", label: "Comparateur" },
  { href: "/console", label: "Console" },
  { href: "/methodologie", label: "Méthodologie" },
  { href: "/glossaire", label: "Glossaire" },
];

const FOOTER_LINKS = [
  ...NAV,
  { href: "/roadmap", label: "Roadmap" },
  { href: "/changelog", label: "Changelog" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${newsreader.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion-ready')}}catch(e){}",
          }}
        />
        <MotionController />
        <div className="border-b border-line">
          <div className="mx-auto flex max-w-[1180px] items-center gap-2.5 px-5 py-1.5">
            <span
              className="transmission-dot h-1.5 w-1.5 shrink-0 bg-accent"
              aria-hidden="true"
            />
            <p className="text-[10px] uppercase tracking-[0.24em] text-ink-faint">
              OSINT · Sources ouvertes · Analyse stratégique — aucun usage opérationnel
            </p>
          </div>
        </div>

        <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5">
            <Link href="/" className="flex items-baseline gap-3">
              <span className="font-serif text-2xl leading-none tracking-tight text-ink">
                Panoplie
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint sm:inline">
                Renseignement open source
              </span>
            </Link>
            <nav className="flex items-center">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-[11px] uppercase tracking-[0.15em] text-ink-dim transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

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
              © 2026 Panoplie — version MVP · {systems.length} systèmes documentés
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
