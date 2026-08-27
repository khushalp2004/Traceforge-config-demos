import { FastifyPluginAsync } from 'fastify';
import fs from 'fs/promises';
import { delay } from '../utils/timeout';
import TraceForgeFastify from 'usetraceforge/fastify';

export const errorRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/reference', async () => {
    // @ts-ignore
    console.log(user.name);
  });

  fastify.get('/type', async () => {
    const user: any = null;
    user.name;
  });

  fastify.get('/json', async () => {
    JSON.parse("{bad json}");
  });

  fastify.get('/async', async () => {
    await Promise.reject(new Error("Async operation failed"));
  });

  fastify.post('/validation', async (request, reply) => {
    // Explicitly sending the requested output
    return reply.status(400).send({ error: "Validation Failed" });
  });

  fastify.get('/database', async () => {
    await fastify.db.failingQuery();
  });

  fastify.get('/timeout', async (request, reply) => {
    await delay(3000);
    throw new Error('Request timed out');
  });

  fastify.get('/filesystem', async () => {
    await fs.readFile('missing-file.txt');
  });

  fastify.get('/env', async () => {
    if (!process.env.MISSING_SECRET) {
      throw new Error("Missing configuration");
    }
    return { secret: process.env.MISSING_SECRET };
  });
};
