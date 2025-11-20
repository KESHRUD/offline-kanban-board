// ============================================================================
// MSW Browser Setup
// Configures Mock Service Worker for browser (development mode)
// ============================================================================

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create worker with all handlers
export const worker = setupWorker(...handlers);

// Start worker with options
export const startMockWorker = () => {
  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
    serviceWorker: {
      url: '/mockServiceWorker.js', // Path to service worker
    },
  });
};
