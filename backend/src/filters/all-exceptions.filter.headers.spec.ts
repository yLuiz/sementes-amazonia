import {
  Controller,
  HttpException,
  HttpStatus,
  INestApplication,
  Post,
  Res,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { Response } from 'express';
import * as request from 'supertest';
import { AllExceptionsFilter } from './all-exceptions.filter';

// Mesmo fluxo do limite de login: o controller define o cabeçalho e depois lança a exceção.
@Controller('login')
class RateLimitedController {
  @Post()
  login(@Res({ passthrough: true }) response: Response) {
    response.setHeader('Retry-After', '900');
    throw new HttpException(
      'Muitas tentativas de login.',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}

describe('AllExceptionsFilter em um Express real', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RateLimitedController],
      providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(() => app.close());

  it('mantém o Retry-After definido antes da exceção', async () => {
    const response = await request(app.getHttpServer()).post('/login');

    expect(response.status).toBe(429);
    expect(response.headers['retry-after']).toBe('900');
    expect(response.body).toMatchObject({
      statusCode: 429,
      message: 'Muitas tentativas de login.',
      path: '/login',
    });
  });
});
