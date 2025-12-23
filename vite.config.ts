import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    devtools({ autoname: true }), solidPlugin(),
    VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ["**/*.{png,svg,ico,json,jpg}"],
      devOptions: {
        enabled: true
      }
    
    })
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
