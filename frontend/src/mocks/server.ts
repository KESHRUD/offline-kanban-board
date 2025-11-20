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
  // Start server before all tests
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  // Reset handlers after each test
  afterEach(() => server.resetHandlers());

  // Clean up after all tests
  afterAll(() => server.close());
};
