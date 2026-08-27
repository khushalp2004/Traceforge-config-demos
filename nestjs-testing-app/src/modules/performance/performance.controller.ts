import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('performance')
export class PerformanceController {
  constructor(private prisma: PrismaService) {}

  @Get('cpu')
  blockEventLoop(@Query('iterations') iterations: string) {
    const iters = parseInt(iterations || '10000000', 10);
    let sum = 0;
    // Simulate CPU intensive task
    for (let i = 0; i < iters; i++) {
      sum += Math.sqrt(i);
    }
    return { message: 'Event loop blocked and released', iters, sum };
  }

  @Get('memory')
  simulateMemoryLeak() {
    if (!(global as any).memoryLeak) {
      (global as any).memoryLeak = [];
    }
    // Add 10MB of string data to the array on each request
    const leakStr = 'A'.repeat(1024 * 1024 * 10);
    (global as any).memoryLeak.push(leakStr);
    
    // Prevent complete crash by capping the leak
    if ((global as any).memoryLeak.length > 50) {
      (global as any).memoryLeak = [];
      return { message: 'Memory leak cleared to prevent crash', leakSize: 0 };
    }

    return { 
      message: 'Memory leaked by 10MB',
      leakSize: (global as any).memoryLeak.length * 10 + 'MB',
      processMemory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'
    };
  }

  @Get('large-response')
  largeResponse() {
    const data = [];
    for (let i = 0; i < 100000; i++) {
      data.push({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        createdAt: new Date().toISOString(),
        isActive: i % 2 === 0,
      });
    }
    return data;
  }

  @Get('slow-query')
  async slowQuery() {
    // Simulate a 5 second database query
    const result = await this.prisma.querySimulated(5000, false);
    return { message: 'Slow query completed', result };
  }
}
