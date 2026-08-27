import fp from 'fastify-plugin';
import { FakeDbService } from '../services/fake-db.service';

export default fp(async (fastify) => {
  const db = new FakeDbService();
  
  // Example of successful registration and decorator
  fastify.decorate('db', db);

  fastify.log.info('Database plugin registered successfully');
});

// Extend FastifyInstance type to include our decorators
declare module 'fastify' {
  export interface FastifyInstance {
    db: FakeDbService;
  }
}
