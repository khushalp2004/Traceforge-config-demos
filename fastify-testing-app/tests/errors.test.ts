import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';

describe('Error Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /errors/validation should return validation error', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/errors/validation'
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload)).toMatchObject({
      error: 'Validation Failed'
    });
  });

  it('GET /errors/database should return 500', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/errors/database'
    });

    expect(response.statusCode).toBe(500);
  });
});
