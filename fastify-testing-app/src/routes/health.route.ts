import { FastifyPluginAsync } from 'fastify';

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    return {
      service: "Fastify Testing App",
      status: "running",
      environment: process.env.NODE_ENV || 'development'
    };
  });
};
