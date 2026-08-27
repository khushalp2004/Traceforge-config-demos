import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';

describe('User Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /users should validate input', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { email: 'invalid' }
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload)).toMatchObject({
      error: 'Validation Failed'
    });
  });

  it('GET /users/:id should return 404 for missing user', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users/999'
    });

    expect(response.statusCode).toBe(404);
  });
});
