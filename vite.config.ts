import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import { ManifestOptions, VitePWA } from 'vite-plugin-pwa';

const manifest: Partial<ManifestOptions> = require("./manifest.json");

export default defineConfig({
  plugins: [
    devtools({ autoname: true }), solidPlugin(),
    VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ["**/*.{png,svg,ico,json,jpg}"],
      devOptions: {
        enabled: true
      },
      manifest: manifest,
    
    })
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
