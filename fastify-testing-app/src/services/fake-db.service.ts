import { delay } from '../utils/timeout';

export class FakeDbService {
  private users = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
  ];

  async query(ms: number) {
    await delay(ms);
    return { status: 'success', data: 'Query completed' };
  }

  async getUserById(id: string) {
    await delay(50);
    return this.users.find(u => u.id === id);
  }

  async createUser(user: any) {
    await delay(100);
    const newUser = { id: String(this.users.length + 1), ...user };
    this.users.push(newUser);
    return newUser;
  }

  async failingQuery() {
    await delay(50);
    const error: any = new Error('connect ECONNREFUSED 127.0.0.1:5432');
    error.code = 'ECONNREFUSED';
    throw error;
  }
}
