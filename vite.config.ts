import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [deno(), react(), tailwindcss()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: "src/popup/popup.tsx",  
        options: "src/options/options.tsx",
        background: "src/background.ts",
        content: "src/content.ts"
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name][extname]", 
        format: "esm"
      }
    }
  }
});
