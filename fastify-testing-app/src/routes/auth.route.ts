import { FastifyPluginAsync } from 'fastify';
import { authenticate } from '../middleware/auth.middleware';
import { loginSchema } from '../schemas/auth.schema';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;
    
    // Simple validation for demo
    if (!email || !password) {
      return reply.status(400).send({ error: 'Email and password are required' });
    }

    const token = await fastify.jwt.sign({ email });
    return { token };
  });

  fastify.get(
    '/profile',
    {
      preValidation: [authenticate]
    },
    async (request, reply) => {
      return { user: request.user };
    }
  );
};
