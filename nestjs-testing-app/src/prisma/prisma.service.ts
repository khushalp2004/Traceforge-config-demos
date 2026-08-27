import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  
  // Fake database state
  private isConnected = true;

  async onModuleInit() {
    this.logger.log('Fake Prisma connection established.');
  }

  async onModuleDestroy() {
    this.logger.log('Fake Prisma connection closed.');
  }

  // Methods to simulate behavior for the error lab

  async querySimulated(queryTimeMs: number = 50, shouldFail: boolean = false) {
    if (!this.isConnected) {
      throw new Error('Database unavailable (ECONNREFUSED)');
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error('Simulated query failure'));
        } else {
          resolve({ status: 'success', data: [] });
        }
      }, queryTimeMs);
    });
  }

  simulateDisconnect() {
    this.isConnected = false;
  }

  simulateConnect() {
    this.isConnected = true;
  }
  
  // Mock user model
  user = {
    findUnique: async (args: any) => {
      if (!this.isConnected) throw new Error('Database unavailable');
      if (args.where.id === 'invalid') throw new Error('Invalid ID format');
      if (args.where.id === 'not-found') return null;
      return { id: args.where.id, email: 'test@example.com', name: 'Test User', age: 30 };
    },
    create: async (args: any) => {
      if (!this.isConnected) throw new Error('Database unavailable');
      return { id: 'new-id', ...args.data };
    },
    update: async (args: any) => {
      if (!this.isConnected) throw new Error('Database unavailable');
      return { id: args.where.id, ...args.data };
    }
  };
}
