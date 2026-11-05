import path from "node:path";
import { Config } from "@remotion/cli/config";

/**
 * Configuration du rendu CLI du film (Studio et MP4). Le site Next n'en a
 * pas besoin : son lecteur importe la composition directement.
 */
Config.setEntryPoint("src/film/remotion/index.ts");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");

// Même alias que tsconfig.json : `@/…` → `src/…`.
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias ?? {}),
      "@": path.resolve(process.cwd(), "src"),
    },
  },
}));
