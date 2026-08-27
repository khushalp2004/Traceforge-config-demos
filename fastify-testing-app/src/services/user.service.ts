import { FastifyInstance } from 'fastify';
import { CreateUserInput } from '../schemas/user.schema';
import { AppError } from '../utils/AppError';

export class UserService {
  constructor(private fastify: FastifyInstance) {}

  async getUser(id: string) {
    if (!id || id === 'invalid') {
        throw new AppError('Invalid ID', 400, 'INVALID_INPUT');
    }
    const user = await this.fastify.db.getUserById(id);
    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }
    return user;
  }

  async createUser(input: CreateUserInput) {
    return this.fastify.db.createUser(input);
  }
}
