import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    const logger = app.get(WINSTON_MODULE_PROVIDER);
    app.useGlobalFilters(new GlobalExceptionFilter(logger));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET) Dashboard', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body.service).toEqual('NestJS Testing App');
        expect(res.body.status).toEqual('running');
      });
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'healthy' });
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com', name: 'Test' })
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toEqual('User registered successfully');
      });
  });

  it('/users (POST) Validation Failure', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'invalid-email', name: '' })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBeInstanceOf(Array);
      });
  });

  it('/errors/type (GET)', () => {
    return request(app.getHttpServer())
      .get('/errors/type')
      .expect(500)
      .expect((res) => {
        expect(res.body.statusCode).toEqual(500);
        expect(res.body.message).toContain('Cannot read properties of null');
      });
  });
});
