import { printDev } from "@storyblok/field-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import cssInjectedByJs from "vite-plugin-css-injected-by-js";

// Storyblok loads one file: dist/index.js with the CSS injected.
// `pnpm plugins:dev` prints the sandbox URL; `pnpm plugins:deploy` publishes.
// Dev token: inject from env in dev only (see dev-token note in SKILL.md rule 6); never in `vite build`.
export default defineConfig({
  plugins: [react(), cssInjectedByJs(), printDev()],
  build: { rollupOptions: { input: "src/main.tsx", output: { format: "commonjs", entryFileNames: "index.js" } } },
  server: { port: 8080, host: true },
});
