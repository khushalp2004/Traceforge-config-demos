import { FastifyPluginAsync } from 'fastify';
import { UserService } from '../services/user.service';
import { createUserSchema } from '../schemas/user.schema';
import { z } from 'zod';

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  const userService = new UserService(fastify);

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const user = await userService.getUser(id);
    return user;
  });

  fastify.post('/', async (request, reply) => {
    try {
      const data = createUserSchema.parse(request.body);
      const user = await userService.createUser(data);
      return reply.status(201).send(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ error: "Validation Failed", details: err.format() });
      }
      throw err;
    }
  });
};
