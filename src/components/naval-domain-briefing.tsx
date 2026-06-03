const STRATEGIC_FLEETS = [
  {
    country: "France",
    code: "FR",
    status: "base publiée",
    doctrine: "Marine complète à masse limitée",
    signatures: "Charles de Gaulle, FREMM, FDI, Scorpène, Mistral",
    nextWave: "France Libre / PA-NG, Suffren, BRF",
    signal:
      "Continuité nucléaire, export Naval Group et tension budgétaire des grands programmes.",
  },
  {
    country: "États-Unis",
    code: "US",
    status: "base publiée",
    doctrine: "Référence haute intensité",
    signatures: "Gerald R. Ford, Arleigh Burke Flight III, Virginia",
    nextWave: "America-class, Columbia, Constellation comme cas de risque",
    signal:
      "Profondeur nucléaire, série Aegis, mais stress industriel sur sous-marins et frégates.",
  },
  {
    country: "Corée du Sud",
    code: "KR",
    status: "base publiée",
    doctrine: "Montée en gamme export",
    signatures: "KDX-III Batch II, Dokdo / Marado, KSS-III",
    nextWave: "KDDX en programme prospectif",
    signal:
      "Base industrielle rapide, destroyers très chargés et offre sous-marine offensive.",
  },
  {
    country: "Japon",
    code: "JP",
    status: "base publiée",
    doctrine: "Densité technologique d'escorte",
    signatures: "Izumo / Kaga, Maya, Mogami, Taigei",
    nextWave: "F-35B embarqué, USV/UUV, modernisation sous-marine",
    signal:
      "Plateformes officiellement prudentes, mais architecture de groupe naval avancée.",
  },
  {
    country: "Chine",
    code: "CN",
    status: "base publiée",
    doctrine: "Masse industrielle et accélération PLAN",
    signatures: "Fujian, Type 055, Type 075 / 076",
    nextWave: "Type 052D / 054B si données assez robustes",
    signal:
      "Puissance duale construction commerciale / militaire, mais données sous-marines plus opaques.",
  },
  {
    country: "Allemagne",
    code: "DE",
    status: "base publiée",
    doctrine: "Spécialiste OTAN / export",
    signatures: "Sachsen F124, F126, Type 212CD, K130",
    nextWave: "F125 comme cas présence longue durée",
    signal:
      "Frégates, capteurs et sous-marins conventionnels ; risques de calendrier à rendre visibles.",
  },
];

const FUNCTIONAL_MATRIX = [
  {
    function: "Grands ponts aviation",
    current: "Charles de Gaulle, Gerald R. Ford, Queen Elizabeth, Fujian, Izumo / Kaga",
    next: "France Libre / PA-NG, futurs porte-avions chinois",
    logic:
      "Comparer propulsion, catapultes ou STOVL, groupe aérien, escorte et coût complet.",
  },
  {
    function: "Amphibie / projection",
    current: "Mistral PHA, Dokdo / Marado, Type 075",
    next: "America-class, Type 076 (radier + drones)",
    logic:
      "Lire le pont aviation, les chalands, le C2, la protection et la dépendance à l'escorte.",
  },
  {
    function: "Escorteurs AAW / BMD",
    current: "Arleigh Burke Flight III, F110 Bonifaz, Maya, KDX-III Batch II, Type 055, Sachsen F124",
    next: "F127 allemande, Type 052D",
    logic:
      "Comparer radar, CMS, VLS, défense antimissile, liaisons et cadence industrielle.",
  },
  {
    function: "Frégates / corvettes multi-missions",
    current: "FREMM, FDI, Type 26, Gowind, FREMM Carlo Bergamini, F126",
    next: "Mogami, K130, Constellation en cas de programme",
    logic:
      "Distinguer frégate lourde, compacte, corvette export et présence armée.",
  },
  {
    function: "Sous-marins",
    current: "Scorpène, Virginia Block V, Type 212CD, Taigei, KSS-III",
    next: "Suffren, KSS-III Batch II",
    logic:
      "Ne pas mélanger SSK, SSN et programmes stratégiques : segmenter avant de comparer.",
  },
  {
    function: "Soutien / présence / MCM",
    current: "OPV 87",
    next: "BRF, guerre des mines, bâtiments logistiques",
    logic:
      "Mesurer jours de mer, MCO, équipage, soutien, disponibilité et souveraineté maritime.",
  },
];

const COMPARISON_COMPASS = [
  {
    anchor: "Charles de Gaulle",
    compareWith: "Gerald R. Ford · Fujian · Izumo / Kaga · France Libre",
    rule:
      "Comparer comme système aéronaval complet, pas comme simple tonnage de coque.",
  },
  {
    anchor: "FREMM / FDI",
    compareWith: "Maya · KDX-III · Type 055 · F126 · Arleigh Burke",
    rule:
      "Séparer frégate ASM, défense aérienne locale, destroyer BMD et grand escorteur.",
  },
  {
    anchor: "Scorpène",
    compareWith: "KSS-III · Taigei · Type 212CD · Suffren · Virginia",
    rule:
      "Étiqueter clairement conventionnel, AIP, nucléaire d'attaque ou segment supérieur.",
  },
  {
    anchor: "Gowind / OPV 87",
    compareWith: "K130 · Mogami · OPV export · patrouille ZEE",
    rule:
      "Ne pas les forcer face aux grands escorteurs : priorité au coût-présence et à l'export.",
  },
];

const PROGRAM_STRESS = [
  ["Programme futur", "France Libre / PA-NG", "coût, nucléaire, continuité industrielle"],
  ["Programme instable", "Constellation", "adaptation de design et gouvernance"],
  ["Programme glissant", "F126", "calendrier, chantier, arbitrage industriel"],
  ["Capacité critique", "Sous-marins", "main-d'oeuvre, réacteurs, batteries, carénage"],
] as const;

export function NavalDomainBriefing() {
  return (
    <div className="space-y-8">
      <div className="grid gap-px border border-line bg-line lg:grid-cols-3">
        {STRATEGIC_FLEETS.map((fleet) => (
          <article key={fleet.country} className="bg-panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  {fleet.code} · {fleet.status}
                </p>
                <h3 className="mt-2 font-serif text-2xl leading-tight text-ink">
                  {fleet.country}
                </h3>
              </div>
              <span className="border border-line-bright px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                {fleet.doctrine}
              </span>
            </div>
            <dl className="mt-5 space-y-3">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  Signatures
                </dt>
                <dd className="mt-1 font-serif text-sm leading-relaxed text-ink">
                  {fleet.signatures}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  Vague suivante
                </dt>
                <dd className="mt-1 font-serif text-sm leading-relaxed text-ink-dim">
                  {fleet.nextWave}
                </dd>
              </div>
            </dl>
            <p className="mt-4 border-l border-accent pl-3 font-serif text-sm italic leading-relaxed text-ink-dim">
              {fleet.signal}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-px border border-line bg-line">
        {FUNCTIONAL_MATRIX.map((row, i) => (
          <article
            key={row.function}
            className="grid gap-px bg-line md:grid-cols-[170px_1fr_1fr]"
          >
            <div className="bg-panel p-4">
              <p className="font-mono text-[10px] text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-ink">
                {row.function}
              </h3>
            </div>
            <div className="bg-panel p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                Dans la base
              </p>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink">
                {row.current}
              </p>
            </div>
            <div className="bg-panel p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                À ouvrir / surveiller
              </p>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink">
                {row.next}
              </p>
              <p className="mt-2 font-serif text-xs italic leading-relaxed text-ink-dim">
                {row.logic}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-px border border-line bg-line lg:grid-cols-[1.25fr_0.75fr]">
        <div className="bg-panel p-5">
          <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-ink">
            Boussole de comparaison
          </h3>
          <div className="mt-4 space-y-px border border-line bg-line">
            {COMPARISON_COMPASS.map((item) => (
              <div key={item.anchor} className="bg-surface p-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-serif text-lg leading-tight text-ink">
                    {item.anchor}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    à comparer avec
                  </p>
                </div>
                <p className="mt-1 font-mono text-[11px] leading-relaxed text-ink-dim">
                  {item.compareWith}
                </p>
                <p className="mt-2 font-serif text-sm italic leading-relaxed text-ink-faint">
                  {item.rule}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-panel p-5">
          <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-ink">
            Signaux de stress
          </h3>
          <ol className="mt-4 space-y-px border border-line bg-line">
            {PROGRAM_STRESS.map(([kind, program, signal], i) => (
              <li key={program} className="bg-surface p-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {kind}
                  </p>
                </div>
                <p className="mt-2 font-serif text-base text-ink">{program}</p>
                <p className="mt-1 font-serif text-sm leading-relaxed text-ink-dim">
                  {signal}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
