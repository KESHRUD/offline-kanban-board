import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ registerType: 'autoUpdate' }), // Add PWA plugin for virtual modules
  ],
  root: '.', // Ensure Vitest runs from frontend folder
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: true,
    // Explicitly exclude E2E tests
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'tests/**', // Only exclude root tests/ folder (E2E), not src/tests/
    ],
    // Only include unit tests
    include: [
      '**/*.test.ts',
      '**/*.test.tsx',
    ],
  },
});
