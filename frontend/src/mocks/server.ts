// ============================================================================
// MSW Server Setup
// Configures Mock Service Worker for Node.js (testing mode)
// ============================================================================

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create server with all handlers
export const server = setupServer(...handlers);

// Setup MSW for tests
export const setupMockServer = () => {
  // Note: beforeAll, afterEach, afterAll are available in test files (Vitest)
  // This function should be called in test setup files
  return {
    beforeAll: () => server.listen({ onUnhandledRequest: 'error' }),
    afterEach: () => server.resetHandlers(),
    afterAll: () => server.close(),
  };
};
