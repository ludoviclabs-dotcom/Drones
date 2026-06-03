import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Tests de logique pure (données, claims, matrice, export, grouping) — pas de
// DOM. Les tests E2E vivent sous tests/e2e/ et sont lancés par Playwright.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/data/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
