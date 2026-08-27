import { FastifyPluginAsync } from 'fastify';

declare global {
  var memoryLeak: any[];
}
global.memoryLeak = [];

export const performanceRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/cpu', async (request, reply) => {
    const iterations = parseInt((request.query as any).iterations) || 1e7;
    // Cap to prevent completely killing the server in testing
    const limit = Math.min(iterations, 1e8);
    for (let i = 0; i < limit; i++) {}
    return { message: `Blocked event loop for ${limit} iterations` };
  });

  fastify.get('/memory', async (request, reply) => {
    const size = parseInt((request.query as any).size) || 10000;
    const limit = Math.min(size, 100000);
    const array = new Array(limit).fill('memory_leak_string_data');
    global.memoryLeak.push(array);
    return { message: `Added ${limit} items to memory leak array. Total items: ${global.memoryLeak.length}` };
  });

  fastify.get('/large-response', async (request, reply) => {
    const start = process.hrtime.bigint();
    const limit = 100000;
    const records = Array.from({ length: limit }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      data: `Some random data to bloat the response for user ${i}`
    }));
    
    const end = process.hrtime.bigint();
    fastify.log.info({ serializationTimeNs: (end - start).toString() }, 'Generated large payload');
    
    return records;
  });

  fastify.get('/slow-query', async (request, reply) => {
    const start = Date.now();
    await fastify.db.query(5000);
    const duration = Date.now() - start;
    fastify.log.info({ duration }, 'Slow query completed');
    return { message: 'Query completed', durationMs: duration };
  });
};
