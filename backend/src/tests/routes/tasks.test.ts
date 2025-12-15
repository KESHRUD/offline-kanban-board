import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '@app/index';

describe('Tasks API', () => {
  it('GET /api/tasks should return 200 and array', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });

  it('POST /api/tasks should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', description: 'Test desc' });
    expect(res.status).toBe(201);
  });

  it('GET /api/tasks/:id should return 404 for non-existent task', async () => {
    const res = await request(app).get('/api/tasks/non-existent-id');
    expect(res.status).toBe(404);
  });
});
