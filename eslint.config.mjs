import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Projet entièrement en français : les apostrophes (l', d', n') dans le
    // texte JSX ne sont pas des entités HTML à échapper.
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".claude/**",
    ".codex-publish/**",
    ".codex-tmp-repo/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Outils de build hors application (scripts Node CommonJS, ex. deck pptx).
    "docs/**",
  ]),
]);

export default eslintConfig;
