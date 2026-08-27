import { Controller, Get, Inject } from '@nestjs/common';
import { readFileSync } from 'fs';

@Controller('errors')
export class ErrorsController {
  // constructor(@Inject('MISSING_PROVIDER') private missingProvider: any) {} // This would break the whole app startup, so we skip it or mock it in a separate sub-module that we don't import by default.

  @Get('reference')
  referenceError() {
    // @ts-ignore
    console.log(user.name);
  }

  @Get('type')
  typeError() {
    const user: any = null;
    return user.name;
  }

  @Get('json')
  jsonError() {
    JSON.parse('{bad json}');
  }

  @Get('async')
  async asyncError() {
    return await Promise.reject(new Error('Async operation failed'));
  }

  @Get('database')
  databaseError() {
    const error: any = new Error('connect ECONNREFUSED 127.0.0.1:5432');
    error.code = 'ECONNREFUSED';
    throw error;
  }

  @Get('env')
  envError() {
    if (!process.env.MISSING_SECRET) {
      throw new Error('Configuration Error: MISSING_SECRET is not defined');
    }
    return { secret: process.env.MISSING_SECRET };
  }

  @Get('filesystem')
  filesystemError() {
    readFileSync('missing-file.txt');
  }
}
