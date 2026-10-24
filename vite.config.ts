import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Op GitHub Pages staat de app in een submap (/the-great-random-race/).
// De workflow geeft die mee via BASE_PATH; lokaal en later op
// thegreatrandomrace.nl is het gewoon '/'.
const base = process.env.BASE_PATH ?? '/';

// De testversie wordt niet samengeperst: foutmeldingen tonen dan echte
// namen, wat het opsporen van fouten op een telefoon veel makkelijker maakt.
const testVersion = process.env.VITE_TESTVERSIE === '1';

export default defineConfig({
  base,
  build: {
    minify: testVersion ? false : 'esbuild',
    sourcemap: testVersion,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['images/**/*'],
      manifest: {
        name: 'The Great Random Race',
        short_name: 'Random Race',
        description: 'Gerard de slak doet mee aan een race van zeven dagen.',
        lang: 'nl',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FBF2E2',
        theme_color: '#FBF2E2',
        icons: [],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,webp,svg}'],
      },
    }),
  ],
  test: {
    include: ['tests/**/*.test.ts'],
    // Vaste tijdzone, zodat 'kalenderdag'-tests overal hetzelfde uitpakken.
    env: { TZ: 'Europe/Amsterdam' },
  },
});
