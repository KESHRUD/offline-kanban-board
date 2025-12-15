import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../index';

describe('Tasks API', () => {
  it('GET /api/tasks should return 200 and array', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/tasks should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', description: 'Test desc', columnId: 'todo', priority: 'medium' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Task');
  });

  it('PUT /api/tasks/:id should update a task', async () => {
    const create = await request(app)
      .post('/api/tasks')
      .send({ title: 'To Update', description: '', columnId: 'todo', priority: 'low' });
    const id = create.body.id;
    const res = await request(app)
      .put(`/api/tasks/${id}`)
      .send({ title: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
  });

  it('DELETE /api/tasks/:id should delete a task', async () => {
    const create = await request(app)
      .post('/api/tasks')
      .send({ title: 'To Delete', description: '', columnId: 'todo', priority: 'low' });
    const id = create.body.id;
    const res = await request(app).delete(`/api/tasks/${id}`);
    expect(res.status).toBe(204);
  });
});
