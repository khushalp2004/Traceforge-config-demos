import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as os from 'os';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getDashboard() {
    return {
      service: 'NestJS Testing App',
      status: 'running',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
    };
  }

  @Get('dashboard')
  getStats() {
    return {
      uptime: `${Math.floor(process.uptime())}s`,
      requests: 123, // Fake or tracked via middleware
      errors: 4,     // Fake or tracked via filter
      memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      cpuUsage: `${Math.round(os.loadavg()[0] * 100)}%`,
    };
  }
}
