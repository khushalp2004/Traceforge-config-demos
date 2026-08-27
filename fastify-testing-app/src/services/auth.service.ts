import { FastifyInstance } from 'fastify';

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  async generateToken(payload: any) {
    return this.fastify.jwt.sign(payload);
  }
}
