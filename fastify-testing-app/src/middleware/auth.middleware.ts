import { FastifyReply, FastifyRequest } from 'fastify';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    if (err instanceof Error && err.message.includes('No Authorization')) {
      reply.status(401).send({ error: 'Missing token' });
    } else if (err instanceof Error && err.message.includes('expired')) {
      reply.status(401).send({ error: 'Expired token' });
    } else {
      reply.status(403).send({ error: 'Invalid token' });
    }
  }
};
