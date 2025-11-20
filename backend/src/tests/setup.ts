// Vitest global setup for backend tests
import { afterAll, beforeAll } from 'vitest';
import app from '@app/index';
import request from 'supertest';

// You can add DB setup/teardown here if needed
beforeAll(async () => {
  // e.g. connect to test DB
});
afterAll(async () => {
  // e.g. disconnect DB
});

export { app, request };