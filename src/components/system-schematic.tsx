import type { ReactNode } from "react";

// Schématiques filaires — vue de dessus, dessin au trait. Stylisées, non
// cotées : elles donnent un visage au système, pas une référence technique.
const SCHEMATICS: Record<string, ReactNode> = {
  "mq-9-reaper": (
    <>
      <line
        x1="120"
        y1="22"
        x2="120"
        y2="226"
        strokeWidth="1"
        strokeDasharray="2 5"
      />
      <rect x="110" y="34" width="20" height="174" rx="10" />
      <circle cx="120" cy="45" r="11" />
      <path d="M24 99 L110 93 L110 109 L26 111 Z" />
      <path d="M216 99 L130 93 L130 109 L214 111 Z" />
      <line x1="24" y1="90" x2="24" y2="118" strokeWidth="1" />
      <line x1="216" y1="90" x2="216" y2="118" strokeWidth="1" />
      <path d="M112 190 L80 216" />
      <path d="M128 190 L160 216" />
      <ellipse cx="120" cy="210" rx="24" ry="4" />
    </>
  ),
  "bayraktar-tb2": (
    <>
      <line
        x1="120"
        y1="26"
        x2="120"
        y2="214"
        strokeWidth="1"
        strokeDasharray="2 5"
      />
      <rect x="111" y="40" width="18" height="150" rx="9" />
      <circle cx="120" cy="50" r="9" />
      <path d="M46 101 L111 95 L111 111 L48 113 Z" />
      <path d="M194 101 L129 95 L129 111 L192 113 Z" />
      <path d="M92 112 L116 198" />
      <path d="M148 112 L124 198" />
      <ellipse cx="120" cy="194" rx="17" ry="3.5" />
    </>
  ),
  "shahed-136": (
    <>
      <line
        x1="120"
        y1="20"
        x2="120"
        y2="214"
        strokeWidth="1"
        strokeDasharray="2 5"
      />
      <path d="M120 28 L208 198 L32 198 Z" />
      <path d="M113 50 L113 198 L127 198 L127 50 Z" />
      <path d="M32 198 L46 174" />
      <path d="M208 198 L194 174" />
      <ellipse cx="120" cy="203" rx="13" ry="3.5" />
    </>
  ),
  neuron: (
    <>
      <line x1="120" y1="24" x2="120" y2="190" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 34 L214 158 L150 158 L120 180 L90 158 L26 158 Z" />
      <line x1="120" y1="38" x2="120" y2="156" strokeWidth="1" />
      <circle cx="120" cy="66" r="7" />
    </>
  ),
  "rq-4-global-hawk": (
    <>
      <line x1="120" y1="14" x2="120" y2="226" strokeWidth="1" strokeDasharray="2 5" />
      <circle cx="120" cy="40" r="16" />
      <path d="M111 52 L111 190 C111 202 115 206 120 206 C125 206 129 202 129 190 L129 52 Z" />
      <path d="M16 110 L111 101 L111 117 L18 119 Z" />
      <path d="M224 110 L129 101 L129 117 L222 119 Z" />
      <path d="M111 188 L80 216" />
      <path d="M129 188 L160 216" />
      <line x1="16" y1="103" x2="16" y2="126" strokeWidth="1" />
      <line x1="224" y1="103" x2="224" y2="126" strokeWidth="1" />
    </>
  ),
  "mq-25-stingray": (
    <>
      <line x1="120" y1="20" x2="120" y2="210" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 28 L138 72 L206 150 L150 158 L132 196 L108 196 L90 158 L34 150 L102 72 Z" />
      <circle cx="120" cy="80" r="6" />
      <line x1="106" y1="124" x2="134" y2="124" strokeWidth="1" />
    </>
  ),
  "wing-loong-2": (
    <>
      <line x1="120" y1="22" x2="120" y2="226" strokeWidth="1" strokeDasharray="2 5" />
      <rect x="111" y="36" width="18" height="170" rx="9" />
      <circle cx="120" cy="47" r="9" />
      <path d="M26 108 L111 100 L111 116 L28 118 Z" />
      <path d="M214 108 L129 100 L129 116 L212 118 Z" />
      <path d="M111 192 L84 214" />
      <path d="M129 192 L156 214" />
      <ellipse cx="120" cy="210" rx="20" ry="4" />
    </>
  ),
  "magura-v5": (
    <>
      <line x1="120" y1="22" x2="120" y2="212" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 26 C132 34 138 64 138 96 L138 198 L102 198 L102 96 C102 64 108 34 120 26 Z" />
      <rect x="108" y="120" width="24" height="42" />
      <circle cx="120" cy="92" r="5" />
      <line x1="102" y1="198" x2="138" y2="198" strokeWidth="1" />
    </>
  ),
  harop: (
    <>
      <line x1="120" y1="18" x2="120" y2="216" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 24 C126 30 129 46 129 70 L129 188 C129 200 125 208 120 208 C115 208 111 200 111 188 L111 70 C111 46 114 30 120 24 Z" />
      <path d="M44 150 L111 122 L111 138 L46 156 Z" />
      <path d="M196 150 L129 122 L129 138 L194 156 Z" />
      <path d="M88 72 L111 80 L111 90 L90 86 Z" />
      <path d="M152 72 L129 80 L129 90 L150 86 Z" />
      <path d="M111 188 L98 208" />
      <path d="M129 188 L142 208" />
    </>
  ),
  aarok: (
    <>
      <line x1="120" y1="20" x2="120" y2="228" strokeWidth="1" strokeDasharray="2 5" />
      <rect x="110" y="32" width="20" height="178" rx="10" />
      <circle cx="120" cy="44" r="10" />
      <path d="M18 104 L110 96 L110 114 L20 122 Z" />
      <path d="M222 104 L130 96 L130 114 L220 122 Z" />
      <path d="M112 196 L86 224" />
      <path d="M128 196 L154 224" />
      <ellipse cx="120" cy="212" rx="22" ry="4" />
    </>
  ),
  eurodrone: (
    <>
      <line x1="120" y1="20" x2="120" y2="226" strokeWidth="1" strokeDasharray="2 5" />
      <rect x="111" y="34" width="18" height="172" rx="9" />
      <circle cx="120" cy="45" r="9" />
      <path d="M26 106 L111 98 L111 114 L28 122 Z" />
      <path d="M214 106 L129 98 L129 114 L212 122 Z" />
      <rect x="70" y="99" width="13" height="26" rx="3" />
      <rect x="157" y="99" width="13" height="26" rx="3" />
      <path d="M112 192 L88 218" />
      <path d="M128 192 L152 218" />
      <ellipse cx="120" cy="208" rx="20" ry="4" />
    </>
  ),
  "switchblade-600": (
    <>
      <line x1="120" y1="30" x2="120" y2="210" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 36 L128 62 L128 186 L112 186 L112 62 Z" />
      <path d="M52 128 L112 120 L112 134 L54 140 Z" />
      <path d="M188 128 L128 120 L128 134 L186 140 Z" />
      <path d="M88 72 L112 78 L112 88 L90 84 Z" />
      <path d="M152 72 L128 78 L128 88 L150 84 Z" />
      <path d="M104 186 L94 206" />
      <path d="M136 186 L146 206" />
    </>
  ),
  "heron-tp": (
    <>
      <line x1="120" y1="18" x2="120" y2="226" strokeWidth="1" strokeDasharray="2 5" />
      <rect x="112" y="30" width="16" height="118" rx="8" />
      <circle cx="120" cy="40" r="8" />
      <path d="M14 96 L112 88 L112 104 L16 112 Z" />
      <path d="M226 96 L128 88 L128 104 L224 112 Z" />
      <line x1="97" y1="103" x2="97" y2="206" strokeWidth="1.4" />
      <line x1="143" y1="103" x2="143" y2="206" strokeWidth="1.4" />
      <line x1="90" y1="206" x2="150" y2="206" strokeWidth="1.4" />
      <path d="M97 206 L89 224" />
      <path d="M143 206 L151 224" />
    </>
  ),
  "hermes-900": (
    <>
      <line x1="120" y1="22" x2="120" y2="222" strokeWidth="1" strokeDasharray="2 5" />
      <rect x="112" y="36" width="16" height="158" rx="8" />
      <circle cx="120" cy="48" r="8" />
      <path d="M30 108 L112 100 L112 116 L32 124 Z" />
      <path d="M210 108 L128 100 L128 116 L208 124 Z" />
      <path d="M113 194 L92 214" />
      <path d="M127 194 L148 214" />
      <ellipse cx="120" cy="198" rx="11" ry="3.5" />
    </>
  ),
  liutyi: (
    <>
      <line x1="120" y1="20" x2="120" y2="222" strokeWidth="1" strokeDasharray="2 5" />
      <rect x="113" y="40" width="14" height="158" rx="7" />
      <circle cx="120" cy="34" r="7" />
      <line x1="111" y1="29" x2="129" y2="29" strokeWidth="1" />
      <path d="M34 112 L113 106 L113 120 L36 126 Z" />
      <path d="M206 112 L127 106 L127 120 L204 126 Z" />
      <path d="M80 196 L113 192 L113 202 L82 206 Z" />
      <path d="M160 196 L127 192 L127 202 L158 206 Z" />
    </>
  ),
  "helma-p": (
    <>
      <line x1="36" y1="206" x2="206" y2="206" strokeWidth="1" />
      <rect x="70" y="156" width="80" height="44" />
      <line x1="70" y1="174" x2="150" y2="174" strokeWidth="1" />
      <circle cx="92" cy="200" r="9" />
      <circle cx="132" cy="200" r="9" />
      <rect x="98" y="140" width="24" height="16" />
      <g transform="rotate(-32 124 120)">
        <rect x="104" y="108" width="40" height="24" rx="5" />
      </g>
      <circle cx="141" cy="103" r="6" />
      <line x1="148" y1="98" x2="206" y2="48" strokeWidth="1.4" strokeDasharray="3 7" />
      <path d="M196 48 L202 48 M210 48 L216 48 M206 38 L206 44 M206 52 L206 58" strokeWidth="1" />
      <circle cx="206" cy="48" r="2.5" />
    </>
  ),
  "iron-beam": (
    <>
      <line x1="28" y1="206" x2="212" y2="206" strokeWidth="1" />
      <rect x="56" y="162" width="100" height="44" />
      <line x1="56" y1="184" x2="156" y2="184" strokeWidth="1" />
      <rect x="72" y="130" width="68" height="32" />
      <circle cx="106" cy="114" r="18" />
      <circle cx="106" cy="114" r="7" />
      <line x1="121" y1="104" x2="210" y2="44" strokeWidth="1.4" strokeDasharray="3 7" />
      <path d="M200 44 L206 44 M214 44 L220 44 M210 34 L210 40 M210 48 L210 54" strokeWidth="1" />
      <circle cx="210" cy="44" r="2.5" />
    </>
  ),
  dragonfire: (
    <>
      <line x1="22" y1="210" x2="218" y2="210" strokeWidth="1" strokeDasharray="3 5" />
      <path d="M44 210 L62 188 L196 188 L208 210 Z" />
      <rect x="80" y="158" width="46" height="30" />
      <rect x="134" y="166" width="20" height="22" />
      <circle cx="144" cy="150" r="15" />
      <circle cx="144" cy="150" r="6" />
      <line x1="157" y1="141" x2="214" y2="52" strokeWidth="1.4" strokeDasharray="3 7" />
      <path d="M204 52 L210 52 M218 52 L224 52 M214 42 L214 48 M214 56 L214 62" strokeWidth="1" />
      <circle cx="214" cy="52" r="2.5" />
    </>
  ),
  "de-m-shorad": (
    <>
      <line x1="20" y1="208" x2="222" y2="208" strokeWidth="1" />
      <path d="M42 186 L58 158 L182 158 L198 186 Z" />
      <circle cx="66" cy="190" r="13" />
      <circle cx="100" cy="190" r="13" />
      <circle cx="142" cy="190" r="13" />
      <circle cx="176" cy="190" r="13" />
      <rect x="92" y="130" width="46" height="28" />
      <g transform="rotate(-30 132 116)">
        <rect x="116" y="106" width="34" height="20" rx="4" />
      </g>
      <circle cx="148" cy="100" r="6" />
      <line x1="155" y1="95" x2="214" y2="46" strokeWidth="1.4" strokeDasharray="3 7" />
      <path d="M204 46 L210 46 M218 46 L224 46 M214 36 L214 42 M214 50 L214 56" strokeWidth="1" />
      <circle cx="214" cy="46" r="2.5" />
    </>
  ),
  "ifpc-hel": (
    <>
      <line x1="18" y1="208" x2="224" y2="208" strokeWidth="1" />
      <rect x="40" y="158" width="124" height="50" />
      <line x1="82" y1="158" x2="82" y2="208" strokeWidth="1" />
      <line x1="122" y1="158" x2="122" y2="208" strokeWidth="1" />
      <rect x="170" y="170" width="38" height="38" />
      <line x1="170" y1="184" x2="208" y2="184" strokeWidth="1" />
      <rect x="90" y="118" width="24" height="42" />
      <circle cx="102" cy="104" r="17" />
      <circle cx="102" cy="104" r="7" />
      <line x1="117" y1="95" x2="214" y2="40" strokeWidth="1.4" strokeDasharray="3 7" />
      <path d="M204 40 L210 40 M218 40 L224 40 M214 30 L214 36 M214 44 L214 50" strokeWidth="1" />
      <circle cx="214" cy="40" r="2.5" />
    </>
  ),
  "skyranger-30-hel": (
    <>
      <line x1="28" y1="208" x2="212" y2="208" strokeWidth="1" />
      <rect x="58" y="186" width="124" height="22" />
      <circle cx="80" cy="208" r="6" />
      <circle cx="160" cy="208" r="6" />
      <path d="M82 186 L96 146 L156 146 L170 186 Z" />
      <line x1="156" y1="160" x2="216" y2="160" strokeWidth="2.4" />
      <rect x="66" y="150" width="16" height="22" />
      <circle cx="120" cy="134" r="9" />
      <circle cx="120" cy="134" r="3.5" />
      <line x1="128" y1="127" x2="200" y2="60" strokeWidth="1.4" strokeDasharray="3 7" />
      <path d="M190 60 L196 60 M204 60 L210 60 M200 50 L200 56 M200 64 L200 70" strokeWidth="1" />
      <circle cx="200" cy="60" r="2.5" />
    </>
  ),
  "laser-naval-mbda-rheinmetall": (
    <>
      <line x1="22" y1="210" x2="218" y2="210" strokeWidth="1" strokeDasharray="3 5" />
      <path d="M34 210 L56 190 L200 190 L214 210 Z" />
      <rect x="74" y="156" width="56" height="34" />
      <rect x="88" y="136" width="32" height="20" />
      <line x1="142" y1="190" x2="142" y2="146" strokeWidth="1" />
      <line x1="130" y1="156" x2="154" y2="156" strokeWidth="1" />
      <circle cx="104" cy="122" r="14" />
      <circle cx="104" cy="122" r="6" />
      <line x1="117" y1="113" x2="212" y2="48" strokeWidth="1.4" strokeDasharray="3 7" />
      <path d="M202 48 L208 48 M216 48 L222 48 M212 38 L212 44 M212 52 L212 58" strokeWidth="1" />
      <circle cx="212" cy="48" r="2.5" />
    </>
  ),
  helios: (
    <>
      <line x1="20" y1="210" x2="220" y2="210" strokeWidth="1" strokeDasharray="3 5" />
      <path d="M30 210 L70 192 L198 192 L208 210 Z" />
      <rect x="82" y="150" width="74" height="42" />
      <rect x="100" y="130" width="42" height="20" />
      <path d="M104 130 L110 116 L132 116 L138 130 Z" />
      <circle cx="121" cy="123" r="6" />
      <line x1="134" y1="117" x2="214" y2="46" strokeWidth="1.4" strokeDasharray="3 7" />
      <path d="M204 46 L210 46 M218 46 L224 46 M214 36 L214 42 M214 50 L214 56" strokeWidth="1" />
      <circle cx="214" cy="46" r="2.5" />
    </>
  ),
  rafale: (
    <>
      <line x1="120" y1="28" x2="120" y2="212" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 28 L131 84 L131 188 L120 210 L109 188 L109 84 Z" />
      <path d="M114 48 L126 48 L123 66 L117 66 Z" />
      <path d="M109 92 L74 104 L80 112 L109 106 Z" />
      <path d="M131 92 L166 104 L160 112 L131 106 Z" />
      <path d="M109 116 L44 176 L58 182 L109 150 Z" />
      <path d="M131 116 L196 176 L182 182 L131 150 Z" />
      <path d="M116 178 L120 206 L124 178 Z" />
      <line x1="110" y1="210" x2="130" y2="210" strokeWidth="1" />
    </>
  ),
  "mirage-2000": (
    <>
      <line x1="120" y1="30" x2="120" y2="212" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 30 L129 90 L129 184 L120 208 L111 184 L111 90 Z" />
      <path d="M114 50 L126 50 L123 70 L117 70 Z" />
      <path d="M111 104 L46 182 L66 186 L111 158 Z" />
      <path d="M129 104 L194 182 L174 186 L129 158 Z" />
      <path d="M115 176 L120 204 L125 176 Z" />
      <ellipse cx="120" cy="206" rx="9" ry="3" />
    </>
  ),
  "f-22-raptor": (
    <>
      <line x1="120" y1="26" x2="120" y2="214" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 26 L138 78 L138 176 L126 210 L114 210 L102 176 L102 78 Z" />
      <path d="M114 46 L126 46 L124 64 L116 64 Z" />
      <path d="M102 96 L36 150 L52 158 L102 138 Z" />
      <path d="M138 96 L204 150 L188 158 L138 138 Z" />
      <path d="M104 150 L78 196 L96 190 L110 162 Z" />
      <path d="M136 150 L162 196 L144 190 L130 162 Z" />
      <line x1="112" y1="210" x2="118" y2="210" strokeWidth="1" />
      <line x1="122" y1="210" x2="128" y2="210" strokeWidth="1" />
    </>
  ),
  "f-35": (
    <>
      <line x1="120" y1="28" x2="120" y2="212" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 28 L134 80 L136 172 L120 208 L104 172 L106 80 Z" />
      <path d="M114 48 L126 48 L124 66 L116 66 Z" />
      <path d="M106 104 L48 150 L62 158 L106 140 Z" />
      <path d="M134 104 L192 150 L178 158 L134 140 Z" />
      <path d="M108 156 L86 196 L102 190 L114 166 Z" />
      <path d="M132 156 L154 196 L138 190 L126 166 Z" />
      <ellipse cx="120" cy="206" rx="11" ry="3.5" />
    </>
  ),
  "f-15ex": (
    <>
      <line x1="120" y1="24" x2="120" y2="216" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 24 L132 76 L132 188 L120 212 L108 188 L108 76 Z" />
      <path d="M114 44 L126 44 L124 62 L116 62 Z" />
      <path d="M108 96 L34 150 L40 160 L108 134 Z" />
      <path d="M132 96 L206 150 L200 160 L132 134 Z" />
      <path d="M112 168 L92 206 L104 200 L116 176 Z" />
      <path d="M128 168 L148 206 L136 200 L124 176 Z" />
      <line x1="110" y1="212" x2="118" y2="212" strokeWidth="1" />
      <line x1="122" y1="212" x2="130" y2="212" strokeWidth="1" />
    </>
  ),
  "super-hornet": (
    <>
      <line x1="120" y1="28" x2="120" y2="212" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 28 L130 72 L134 96 L134 178 L120 208 L106 178 L106 96 L110 72 Z" />
      <path d="M114 46 L126 46 L124 64 L116 64 Z" />
      <path d="M106 110 L52 150 L66 158 L106 140 Z" />
      <path d="M134 110 L188 150 L174 158 L134 140 Z" />
      <path d="M110 160 L88 198 L102 192 L116 168 Z" />
      <path d="M130 160 L152 198 L138 192 L124 168 Z" />
      <line x1="110" y1="208" x2="118" y2="208" strokeWidth="1" />
      <line x1="122" y1="208" x2="130" y2="208" strokeWidth="1" />
    </>
  ),
  "ea-18g-growler": (
    <>
      <line x1="120" y1="28" x2="120" y2="212" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 28 L130 72 L134 96 L134 178 L120 208 L106 178 L106 96 L110 72 Z" />
      <path d="M114 46 L126 46 L124 64 L116 64 Z" />
      <path d="M106 110 L52 150 L66 158 L106 140 Z" />
      <path d="M134 110 L188 150 L174 158 L134 140 Z" />
      <rect x="44" y="146" width="14" height="20" rx="3" />
      <rect x="182" y="146" width="14" height="20" rx="3" />
      <path d="M110 160 L88 198 L102 192 L116 168 Z" />
      <path d="M130 160 L152 198 L138 192 L124 168 Z" />
      <line x1="110" y1="208" x2="118" y2="208" strokeWidth="1" />
      <line x1="122" y1="208" x2="130" y2="208" strokeWidth="1" />
    </>
  ),
  gripen: (
    <>
      <line x1="120" y1="34" x2="120" y2="208" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 34 L128 86 L128 178 L120 202 L112 178 L112 86 Z" />
      <path d="M115 52 L125 52 L123 68 L117 68 Z" />
      <path d="M112 96 L84 106 L89 113 L112 108 Z" />
      <path d="M128 96 L156 106 L151 113 L128 108 Z" />
      <path d="M112 120 L60 172 L72 177 L112 154 Z" />
      <path d="M128 120 L180 172 L168 177 L128 154 Z" />
      <path d="M116 170 L120 198 L124 170 Z" />
      <ellipse cx="120" cy="200" rx="8" ry="3" />
    </>
  ),
  "eurofighter-typhoon": (
    <>
      <line x1="120" y1="26" x2="120" y2="212" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 26 L130 80 L130 186 L120 208 L110 186 L110 80 Z" />
      <path d="M114 44 L126 44 L124 60 L116 60 Z" />
      <path d="M110 64 L72 80 L78 88 L110 82 Z" />
      <path d="M130 64 L168 80 L162 88 L130 82 Z" />
      <path d="M110 118 L46 178 L60 184 L110 156 Z" />
      <path d="M130 118 L194 178 L180 184 L130 156 Z" />
      <path d="M116 178 L120 204 L124 178 Z" />
      <line x1="110" y1="208" x2="130" y2="208" strokeWidth="1" />
    </>
  ),
  "j-20": (
    <>
      <line x1="120" y1="22" x2="120" y2="220" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 22 L132 84 L132 196 L120 216 L108 196 L108 84 Z" />
      <path d="M114 42 L126 42 L124 60 L116 60 Z" />
      <path d="M108 92 L70 106 L76 114 L108 106 Z" />
      <path d="M132 92 L170 106 L164 114 L132 106 Z" />
      <path d="M108 124 L40 188 L54 194 L108 164 Z" />
      <path d="M132 124 L200 188 L186 194 L132 164 Z" />
      <path d="M110 186 L92 212 L104 206 L116 188 Z" />
      <path d="M130 186 L148 212 L136 206 L124 188 Z" />
      <line x1="112" y1="216" x2="128" y2="216" strokeWidth="1" />
    </>
  ),
  "j-35": (
    <>
      <line x1="120" y1="30" x2="120" y2="210" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 30 L133 82 L133 174 L120 206 L107 174 L107 82 Z" />
      <path d="M114 50 L126 50 L124 66 L116 66 Z" />
      <path d="M107 102 L52 150 L66 157 L107 136 Z" />
      <path d="M133 102 L188 150 L174 157 L133 136 Z" />
      <path d="M109 158 L88 196 L102 190 L115 166 Z" />
      <path d="M131 158 L152 196 L138 190 L125 166 Z" />
      <line x1="110" y1="206" x2="118" y2="206" strokeWidth="1" />
      <line x1="122" y1="206" x2="130" y2="206" strokeWidth="1" />
    </>
  ),
  kaan: (
    <>
      <line x1="120" y1="26" x2="120" y2="214" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 26 L132 86 L132 184 L120 212 L108 184 L108 86 Z" />
      <path d="M114 46 L126 46 L124 64 L116 64 Z" />
      <path d="M108 104 L46 156 L58 164 L108 140 Z" />
      <path d="M132 104 L194 156 L182 164 L132 140 Z" />
      <path d="M110 166 L90 204 L104 198 L116 174 Z" />
      <path d="M130 166 L150 204 L136 198 L124 174 Z" />
      <line x1="111" y1="212" x2="119" y2="212" strokeWidth="1" />
      <line x1="121" y1="212" x2="129" y2="212" strokeWidth="1" />
    </>
  ),
  "f-47": (
    <>
      <line x1="120" y1="24" x2="120" y2="206" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 24 L132 96 L196 188 L120 200 L44 188 L108 96 Z" />
      <path d="M114 44 L126 44 L124 64 L116 64 Z" />
      <path d="M110 88 L78 98 L83 105 L110 100 Z" />
      <path d="M130 88 L162 98 L157 105 L130 100 Z" />
      <line x1="120" y1="96" x2="120" y2="196" strokeWidth="1" />
    </>
  ),
  "scaf-fcas": (
    <>
      <line x1="120" y1="28" x2="120" y2="204" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 28 L188 150 L120 198 L52 150 Z" />
      <path d="M114 56 L126 56 L124 76 L116 76 Z" />
      <line x1="120" y1="40" x2="120" y2="190" strokeWidth="1" />
      <path d="M120 96 L74 138 M120 96 L166 138" strokeWidth="1" />
    </>
  ),
  "gcap-tempest": (
    <>
      <line x1="120" y1="30" x2="120" y2="202" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 30 L134 108 L210 150 L188 168 L130 158 L120 196 L110 158 L52 168 L30 150 L106 108 Z" />
      <path d="M114 52 L126 52 L124 72 L116 72 Z" />
      <line x1="120" y1="108" x2="120" y2="190" strokeWidth="1" />
    </>
  ),
  // Missiles — silhouettes en profil, nez en haut. Les éléments distinctifs
  // (intakes ramjet du Meteor, ailes déployées du SCALP, jets de divert
  // du PAC-3) donnent à chaque silhouette son visage.
  meteor: (
    <>
      <line x1="120" y1="14" x2="120" y2="226" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 18 L130 50 L130 196 L120 220 L110 196 L110 50 Z" />
      <path d="M110 110 L86 116 L86 156 L110 162 Z" />
      <path d="M130 110 L154 116 L154 156 L130 162 Z" />
      <path d="M110 70 L94 78 L110 84 Z" />
      <path d="M130 70 L146 78 L130 84 Z" />
      <path d="M110 188 L70 218 L114 208 Z" />
      <path d="M130 188 L170 218 L126 208 Z" />
      <line x1="116" y1="218" x2="124" y2="218" strokeWidth="1" />
    </>
  ),
  "aim-120-amraam": (
    <>
      <line x1="120" y1="16" x2="120" y2="224" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 22 L128 56 L128 200 L120 218 L112 200 L112 56 Z" />
      <path d="M112 120 L94 122 L112 134 Z" />
      <path d="M128 120 L146 122 L128 134 Z" />
      <path d="M112 196 L78 216 L116 208 Z" />
      <path d="M128 196 L162 216 L124 208 Z" />
      <circle cx="120" cy="34" r="2.4" />
    </>
  ),
  "scalp-storm-shadow": (
    <>
      <line x1="120" y1="22" x2="120" y2="222" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 30 L132 70 L132 192 L120 216 L108 192 L108 70 Z" />
      <path d="M108 108 L26 118 L26 132 L108 138 Z" />
      <path d="M132 108 L214 118 L214 132 L132 138 Z" />
      <path d="M108 168 L96 178 L96 188 L108 184 Z" />
      <path d="M132 168 L144 178 L144 188 L132 184 Z" />
      <path d="M114 192 L120 212 L126 192 Z" />
      <line x1="112" y1="216" x2="128" y2="216" strokeWidth="1" />
    </>
  ),
  jagm: (
    <>
      <line x1="120" y1="40" x2="120" y2="216" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 44 L130 76 L130 190 L120 210 L110 190 L110 76 Z" />
      <path d="M110 182 L86 208 L114 200 Z" />
      <path d="M130 182 L154 208 L126 200 Z" />
      <line x1="106" y1="192" x2="134" y2="192" strokeWidth="1" />
      <circle cx="120" cy="60" r="2.6" />
    </>
  ),
  prsm: (
    <>
      <line x1="120" y1="16" x2="120" y2="226" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 22 L134 64 L134 204 L120 222 L106 204 L106 64 Z" />
      <path d="M106 200 L86 220 L112 214 Z" />
      <path d="M134 200 L154 220 L128 214 Z" />
      <line x1="106" y1="100" x2="134" y2="100" strokeWidth="1" />
      <line x1="106" y1="160" x2="134" y2="160" strokeWidth="1" />
    </>
  ),
  "aster-30-b1nt": (
    <>
      <line x1="120" y1="14" x2="120" y2="226" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 20 L128 46 L128 116 L120 126 L112 116 L112 46 Z" />
      <line x1="112" y1="124" x2="128" y2="124" strokeWidth="2" strokeDasharray="2 3" />
      <path d="M112 128 L112 200 L120 218 L128 200 L128 128 Z" />
      <path d="M112 84 L100 92 L112 96 Z" />
      <path d="M128 84 L140 92 L128 96 Z" />
      <path d="M112 184 L72 214 L116 206 Z" />
      <path d="M128 184 L168 214 L124 206 Z" />
      <circle cx="120" cy="32" r="2.4" />
    </>
  ),
  "pac-3-mse": (
    <>
      <line x1="120" y1="14" x2="120" y2="222" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 18 L130 48 L130 200 L120 216 L110 200 L110 48 Z" />
      <rect x="100" y="108" width="10" height="8" />
      <rect x="130" y="108" width="10" height="8" />
      <rect x="100" y="130" width="10" height="8" />
      <rect x="130" y="130" width="10" height="8" />
      <path d="M110 196 L88 214 L114 208 Z" />
      <path d="M130 196 L152 214 L126 208 Z" />
      <circle cx="120" cy="30" r="2.6" />
    </>
  ),
  "aargm-er": (
    <>
      <line x1="120" y1="16" x2="120" y2="222" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 22 L130 58 L130 200 L120 216 L110 200 L110 58 Z" />
      <path d="M110 78 L88 78 L110 92 Z" />
      <path d="M130 78 L152 78 L130 92 Z" />
      <path d="M110 188 L78 212 L114 206 Z" />
      <path d="M130 188 L162 212 L126 206 Z" />
      <circle cx="120" cy="34" r="2.6" />
      <line x1="116" y1="34" x2="124" y2="34" strokeWidth="1" />
    </>
  ),
  "aim-9x": (
    <>
      <line x1="120" y1="36" x2="120" y2="216" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 40 L130 70 L130 196 L120 212 L110 196 L110 70 Z" />
      <path d="M110 102 L96 100 L110 112 Z" />
      <path d="M130 102 L144 100 L130 112 Z" />
      <path d="M110 190 L84 210 L114 204 Z" />
      <path d="M130 190 L156 210 L126 204 Z" />
      <circle cx="120" cy="50" r="2.4" />
    </>
  ),
  "mica-ng": (
    <>
      <line x1="120" y1="28" x2="120" y2="220" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 32 L128 64 L128 200 L120 216 L112 200 L112 64 Z" />
      <path d="M112 112 L98 114 L112 124 Z" />
      <path d="M128 112 L142 114 L128 124 Z" />
      <path d="M112 196 L82 214 L116 208 Z" />
      <path d="M128 196 L158 214 L124 208 Z" />
      <circle cx="120" cy="44" r="2.2" />
    </>
  ),
  nsm: (
    <>
      <line x1="120" y1="34" x2="120" y2="216" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 38 L134 72 L134 196 L120 212 L106 196 L106 72 Z" />
      <path d="M106 110 L26 122 L26 134 L106 142 Z" />
      <path d="M134 110 L214 122 L214 134 L134 142 Z" />
      <path d="M112 190 L120 208 L128 190 Z" />
      <line x1="110" y1="212" x2="130" y2="212" strokeWidth="1" />
      <path d="M114 56 L126 56 L122 70 L118 70 Z" />
    </>
  ),
  gmlrs: (
    <>
      <line x1="120" y1="22" x2="120" y2="220" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 26 L130 56 L130 198 L120 216 L110 198 L110 56 Z" />
      <path d="M110 76 L98 80 L110 88 Z" />
      <path d="M130 76 L142 80 L130 88 Z" />
      <rect x="104" y="190" width="32" height="14" />
      <line x1="108" y1="190" x2="108" y2="204" strokeWidth="1" />
      <line x1="116" y1="190" x2="116" y2="204" strokeWidth="1" />
      <line x1="124" y1="190" x2="124" y2="204" strokeWidth="1" />
      <line x1="132" y1="190" x2="132" y2="204" strokeWidth="1" />
    </>
  ),
  camm: (
    <>
      <line x1="120" y1="18" x2="120" y2="220" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 22 L126 56 L126 198 L120 214 L114 198 L114 56 Z" />
      <path d="M114 188 L96 210 L118 204 Z" />
      <path d="M126 188 L144 210 L122 204 Z" />
      <rect x="106" y="206" width="28" height="14" strokeDasharray="2 3" />
      <circle cx="120" cy="34" r="2" />
    </>
  ),
  "iris-t-slm": (
    <>
      <line x1="120" y1="22" x2="120" y2="220" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 26 L130 58 L130 198 L120 214 L110 198 L110 58 Z" />
      <path d="M110 124 L94 128 L110 138 Z" />
      <path d="M130 124 L146 128 L130 138 Z" />
      <path d="M110 200 L100 214 L120 208 L140 214 L130 200 Z" />
      <circle cx="120" cy="38" r="2.4" />
    </>
  ),
  thaad: (
    <>
      <line x1="120" y1="10" x2="120" y2="228" strokeWidth="1" strokeDasharray="2 5" />
      <path d="M120 14 L126 36 L126 78 L120 88 L114 78 L114 36 Z" />
      <line x1="114" y1="92" x2="126" y2="92" strokeWidth="2" strokeDasharray="2 3" />
      <path d="M114 96 L114 200 L120 220 L126 200 L126 96 Z" />
      <path d="M114 132 L98 138 L114 146 Z" />
      <path d="M126 132 L142 138 L126 146 Z" />
      <path d="M114 192 L82 218 L118 210 Z" />
      <path d="M126 192 L158 218 L122 210 Z" />
      <circle cx="120" cy="22" r="2" />
    </>
  ),
};

export function SystemSchematic({
  slug,
  className = "",
  live = false,
}: {
  slug: string;
  className?: string;
  live?: boolean;
}) {
  const content = SCHEMATICS[slug];
  if (!content) return null;
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={live ? `${className} schematic-live` : className}
      aria-hidden="true"
      data-draw={live ? "" : undefined}
    >
      {content}
    </svg>
  );
}
